const util = require('util')
const fs = require('fs-extra')
const yaml = require('js-yaml')
const globby = require('globby')
const { exec } = require('child_process')
const artifact = require('@actions/artifact')
const core = require('@actions/core')
const config = require('./config')

// General

exports.action = async function () {
  let inquiry
  let report

  // Set workdir
  try {
    process.chdir(process.env.GITHUB_WORKSPACE)
  } catch (error) {
    core.setFailed(`Cannot set workdir: ${error.message}`)
    return
  }

  // Read inquiry
  if (await fs.pathExists(config.CONFIG_FILE)) {
    try {
      const file = await fs.readFile(config.CONFIG_FILE, 'utf-8')
      const config = yaml.load(file)
      const name = core.getInput('inquiry') || config.INQUIRY_PROPERTY
      if (config.hasOwnProperty(name)) inquiry = config[name]
    } catch (error) {
      core.setFailed(`Cannot read inqiury: ${error.message}`)
      return
    }
  }

  // Create inquiry
  if (!inquiry) {
    try {
      let sources = await globby(config.PACKAGE_GLOB)
      if (!sources.length) sources = await globby(config.RESOURCE_GLOB)
      if (!sources.length) sources = await globby(config.TABLE_GLOB)
      if (!sources.length) throw new Error('no sources to validate')
      inquiry = { tasks: sources.map((source) => ({ source })) }
    } catch (error) {
      core.setFailed(`Cannot create inqiury: ${error.message}`)
      return
    }
  }

  // Save inquiry
  try {
    const file = JSON.stringify(inquiry, null, 2)
    await fs.writeFile('inquiry.json', file)
  } catch (error) {
    core.setFailed(`Cannot save inqiury: ${error.message}`)
    return
  }

  // Upload inquiry
  try {
    const upload = artifact.create().uploadArtifact
    const options = { continueOnError: false, retentionDays: 90 }
    const response = await upload('inquiry', ['inquiry.json'], '.', options)
    if (response.failedItems.length > 0) throw new Error(response.failedItems)
  } catch (error) {
    core.setFailed(`Cannot upload inquiry: ${error.message}`)
    return
  }

  // Create report
  try {
    const promExec = util.promisify(exec)
    const { stdout } = await promExec('frictionless validate inquiry.json --json')
    await fs.writeFile('report.json', stdout)
    report = JSON.parse(stdout)
  } catch (error) {
    core.setFailed(`Cannot validate inqiury: ${error.message}`)
    return
  }

  // Upload report
  try {
    const upload = artifact.create().uploadArtifact
    const options = { continueOnError: false, retentionDays: 90 }
    const response = await upload('report', ['report.json'], '.', options)
    if (response.failedItems.length > 0) throw new Error(response.failedItems)
  } catch (error) {
    core.setFailed(`Cannot upload report: ${error.message}`)
    return
  }

  // Notify user
  try {
    const [user, repo] = process.env.GITHUB_REPOSITORY.split('/')
    const flow = process.env.GITHUB_WORKFLOW
    const run = process.env.GITHUB_RUN_ID
    const link = `https://repository.frictionlessdata.io/report/?user=${user}&repo=${repo}&flow=${flow.toLowerCase()}&run=${run}`
    const notify = report.valid ? core.info : core.setFailed
    const state = report.valid ? 'passed' : 'failed'
    notify(`Data validation has ${state}: ${link}`)
  } catch (error) {
    core.setFailed(`Cannot notify user: ${error.message}`)
    return // eslint-disable-line
  }
}
