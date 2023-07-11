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
  try {
    const path = core.getInput('inquiry')
    if (path) {
      const file = await fs.readFile(path, 'utf-8')
      inquiry = yaml.load(file)
    }
  } catch (error) {
    core.setFailed(`Cannot read inquiry: ${error.message}`)
    return
  }

  // Create inquiry
  if (!inquiry) {
    try {
      for (const name of ['package', 'resource', 'table']) {
        if (inquiry) break
        const key = name === 'table' ? 'path' : name
        const glob = core.getInput(`${name}s`) || config[`${name.toUpperCase()}_GLOB`]
        const paths = await globby(glob)
        if (paths.length) inquiry = { tasks: paths.map((path) => ({ [key]: path })) }
      }
      if (!inquiry) throw new Error('no sources to validate')
    } catch (error) {
      core.setFailed(`Cannot create inquiry: ${error.message}`)
      return
    }
  }

  // Save inquiry
  try {
    const file = JSON.stringify(inquiry, null, 2)
    await fs.writeFile('inquiry.json', file)
  } catch (error) {
    core.setFailed(`Cannot save inquiry: ${error.message}`)
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
    let stdout
    const promExec = util.promisify(exec)
    try {
      const result = await promExec('frictionless validate inquiry.json --json')
      stdout = result.stdout
    } catch (error) {
      stdout = error.stdout
    }
    report = JSON.parse(stdout)
    await fs.writeFile('report.json', stdout)
  } catch (error) {
    core.setFailed(`Cannot validate inquiry: ${error.stderr}`)
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
    const link = `https://repository.frictionlessdata.io/pages/dashboard.html?user=${user}&repo=${repo}&flow=${flow.toLowerCase()}&run=${run}`
    const notify = report.valid ? core.info : core.setFailed
    const state = report.valid ? 'passed' : 'failed'
    notify(`Data validation has ${state}: ${encodeURI(link)}`)
  } catch (error) {
    core.setFailed(`Cannot notify user: ${error.message}`)
    return // eslint-disable-line
  }
}
