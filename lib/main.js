import fs from 'fs'
import util from 'util'
import yaml from 'js-yaml'
import globby from 'globby'
import { exec } from 'child_process'
import * as core from '@actions/core'
import * as artifact from '@actions/artifact'

// Data

export const WORKDIR = '/github/workspace'
export const CONFIG = '.github/frictionless.yaml'

// Main

async function main() {
  let inquiry
  let report

  // Set workdir
  if (process.env.CI) {
    try {
      process.chdir(WORKDIR)
    } catch (error) {
      core.setFailed(`Cannot set workdir: ${error.message}`)
      return
    }
  }

  // Read inquiry
  if (await fs.promises.access(CONFIG, fs.constants.R_OK)) {
    try {
      const file = await fs.promises.readFile(CONFIG, 'utf-8')
      const config = yaml.load(file)
      const key = core.getInput('inquiry')
      if (config.hasOwnProperty(key)) inquiry = config[key]
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
    await fs.promises.writeFile('inquiry.json', file)
  } catch (error) {
    core.setFailed(`Cannot save inqiury: ${error.message}`)
    return
  }

  // Create report
  try {
    const promExec = util.promisify(exec)
    const { stdout } = await promExec('frictionless validate inquiry.json --json')
    await fs.promises.writeFile('report.json', stdout)
    report = JSON.parse(stdout)
  } catch (error) {
    core.setFailed(`Cannot validate inqiury: ${error.message}`)
    return
  }

  // Upload report
  if (process.env.CI) {
    const upload = artifact.create().uploadArtifact
    const options: artifact.UploadOptions = { continueOnError: false, retentionDays: 90 }
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

// Run

main()
  .then(() => {})
  .catch((error) => core.setFailed(error.message))
