import fs from 'fs'
import util from 'util'
import yaml from 'js-yaml'
import globby from 'globby'
import { exec } from 'child_process'
import * as core from '@actions/core'
import * as artifact from '@actions/artifact'
import { IDict } from './common'

async function main() {
  // TODO: handle errors
  process.chdir('/github/workspace')

  // Load inquiry
  let inquiry: IDict
  try {
    const path = '.github/frictionless.yaml'
    const file = await fs.promises.readFile(path, 'utf-8')
    const config = yaml.load(file) as IDict
    // TODO: validate config being a dict
    const key = core.getInput('inquiry')
    inquiry = config[key]
    if (!inquiry) throw new Error('no inquiry')
  } catch {
    const paths = await globby(['**/*.{csv,tsv,xls,xlsx}'])
    inquiry = {
      tasks: paths.map((path) => ({ source: path })),
    }
  }

  // Save inquiry
  if (inquiry) {
    const file = JSON.stringify(inquiry, null, 2)
    await fs.promises.writeFile('inquiry.json', file)
  }

  // Run inqiury
  const promExec = util.promisify(exec)
  const { stdout } = await promExec('frictionless validate inquiry.json --json')
  const report: IDict = JSON.parse(stdout)
  await fs.promises.writeFile('report.json', stdout)

  // Upload report
  const artifactClient = artifact.create()
  const options: artifact.UploadOptions = {
    continueOnError: false,
    retentionDays: 90,
  }
  const uploadResponse = await artifactClient.uploadArtifact(
    'report',
    ['report.json'],
    '.',
    options
  )
  if (uploadResponse.failedItems.length > 0) {
    core.setFailed(
      `An error was encountered when uploading ${uploadResponse.artifactName}. There were ${uploadResponse.failedItems.length} items that failed to upload.`
    )
  }

  // Notify user
  const [user, repo] = process.env.GITHUB_REPOSITORY!.split('/')
  const workflow = process.env.GITHUB_WORKFLOW
  const link = `https://repository.frictionlessdata.io/report/?user=${user}&repo=${repo}&workflow=${workflow}`
  if (report.valid) {
    core.setFailed(`Data validation has failed: ${link}`)
  } else {
    core.info(`Data validation has passed: ${link}`)
  }
}

main()
  .then(() => {})
  .catch((error) => core.setFailed(error.message))
