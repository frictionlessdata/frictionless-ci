const util = require('util')
const { dir } = require('tmp-promise')
const { action } = require('../lib/action')
const { copy, readJson } = require('fs-extra')
const artifact = require('@actions/artifact')
const core = require('@actions/core')

// General

describe('General', () => {
  const any = expect.anything()
  const execute = jest.fn()
  const upload = jest.fn()
  let workdir
  let inputs

  beforeAll(() => {
    // Set environ
    process.env.GITHUB_REPOSITORY = 'user/repo'
    process.env.GITHUB_WORKFLOW = 'flow'
    process.env.GITHUB_RUN_ID = 'id'

    // Mock core
    jest.spyOn(core, 'getInput').mockImplementation((name) => inputs[name])
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn())
    jest.spyOn(core, 'error').mockImplementation(jest.fn())
    jest.spyOn(core, 'warning').mockImplementation(jest.fn())
    jest.spyOn(core, 'info').mockImplementation(jest.fn())
    jest.spyOn(core, 'debug').mockImplementation(jest.fn())

    // Mock artifact
    upload.mockReturnValue({ failedItems: [] })
    jest.spyOn(artifact, 'create').mockImplementation(() => ({ uploadArtifact: upload }))

    // Mock execute
    execute.mockReturnValue({ stdout: '{"valid": false}' })
    jest.spyOn(util, 'promisify').mockImplementation(() => execute)
  })

  beforeEach(async () => {
    inputs = {}
    workdir = await dir({ unsafeCleanup: true })
  })

  afterEach(() => {
    inputs = {}
    workdir.cleanup()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('files', async () => {
    // Action
    await copy('data/invalid.csv', `${workdir.path}/invalid.csv`)
    await copy('data/valid.csv', `${workdir.path}/valid.csv`)
    await action({ workingDirectory: workdir.path })

    // Validation
    expect(await readJson(`${workdir.path}/report.json`)).toEqual({ valid: false })
    expect(await readJson(`${workdir.path}/inquiry.json`)).toEqual({
      tasks: [{ source: 'invalid.csv' }, { source: 'valid.csv' }],
    })

    // Integration
    expect(execute).toHaveBeenCalledWith('frictionless validate inquiry.json --json')
    expect(upload).toHaveBeenNthCalledWith(1, 'inquiry', ['inquiry.json'], '.', any)
    expect(upload).toHaveBeenNthCalledWith(2, 'report', ['report.json'], '.', any)
    expect(core.setFailed).toHaveBeenCalledWith(
      'Data validation has failed: https://repository.frictionlessdata.io/report/?user=user&repo=repo&flow=flow&run=id'
    )
  })
})
