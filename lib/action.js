import util from 'util'
import fs from 'fs-extra'
import yaml from 'js-yaml'
import globby from 'globby'
import { exec } from 'child_process'
import * as core from '@actions/core'
import * as artifact from '@actions/artifact'
import * as config from './config.js'

// Action

export async function action() {
  let inquiry
  let report

  // Set workdir
  if (process.env.CI) {
    try {
      process.chdir(config.WORKDIR)
    } catch (error) {
      core.setFailed(`Cannot set workdir: ${error.message}`)
      return
    }
  }

  // Read inquiry
  if (await fs.pathExists(config.CONFIG)) {
    try {
      const file = await fs.readFile(config.CONFIG, 'utf-8')
      const config = yaml.load(file)
      const name = core.getInput('inquiry') || config.INQUIRY
      if (config.hasOwnProperty(name)) inquiry = config[name]
    } catch (error) {
      core.setFailed(`Cannot read inqiury: ${error.message}`)
      return
    }
  }

  // Create inquiry
  if (!inquiry) {
    try {
      const paths = await globby(['**/*.{csv,tsv,xls,xlsx}'])
      inquiry = { tasks: paths.map((path) => ({ source: path })) }
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
  if (process.env.CI) {
    const upload = artifact.create().uploadArtifact
    const options = { continueOnError: false, retentionDays: 90 }
    const response = await upload('report', ['report.json'], '.', options)
    if (response.failedItems.length > 0) {
      core.setFailed(`Cannot upload report: ${response.failedItems}`)
      return
    }
  }

  // Notify user
  if (process.env.CI) {
    const [user, repo] = process.env.GITHUB_REPOSITORY.split('/')
    const flow = process.env.GITHUB_WORKFLOW
    const run = process.env.GITHUB_RUN_ID
    const link = `https://repository.frictionlessdata.io/report/?user=${user}&repo=${repo}&flow=${flow}&run=${run}`
    if (!report.valid) {
      core.setFailed(`Data validation has failed: ${link}`)
    } else {
      core.info(`Data validation has passed: ${link}`)
    }
  }
}
