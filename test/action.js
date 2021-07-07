const util = require('util')
const { dir } = require('tmp-promise')
const { action } = require('../lib/action')
const { copy, readJson } = require('fs-extra')
const artifact = require('@actions/artifact')
const core = require('@actions/core')

// General

describe('General', () => {
  const any = expect.anything()
  const curdir = process.cwd()
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

    // Mock upload
    upload.mockReturnValue({ failedItems: [] })
    jest.spyOn(artifact, 'create').mockImplementation(() => ({ uploadArtifact: upload }))

    // Mock execute
    execute.mockReturnValue({ stdout: '{"valid": false}' })
    jest.spyOn(util, 'promisify').mockImplementation(() => execute)
  })

  beforeEach(async () => {
    inputs = {}
    workdir = await dir({ unsafeCleanup: true })
    process.env.GITHUB_WORKSPACE = workdir.path
  })

  afterEach(() => {
    workdir.cleanup()
    jest.clearAllMocks()
    process.chdir(curdir)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('table', async () => {
    // Action
    await copy('data/invalid.csv', `${workdir.path}/invalid.csv`)
    await copy('data/valid.csv', `${workdir.path}/valid.csv`)
    await action()

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

  it('resource', async () => {
    // Action
    await copy('data/invalid.resource.json', `${workdir.path}/invalid.resource.json`)
    await copy('data/valid.resource.json', `${workdir.path}/valid.resource.json`)
    await copy('data/invalid.csv', `${workdir.path}/invalid.csv`)
    await copy('data/valid.csv', `${workdir.path}/valid.csv`)
    await action()

    // Validation
    expect(await readJson(`${workdir.path}/report.json`)).toEqual({ valid: false })
    expect(await readJson(`${workdir.path}/inquiry.json`)).toEqual({
      tasks: [{ source: 'invalid.resource.json' }, { source: 'valid.resource.json' }],
    })

    // Integration
    expect(execute).toHaveBeenCalledWith('frictionless validate inquiry.json --json')
    expect(upload).toHaveBeenNthCalledWith(1, 'inquiry', ['inquiry.json'], '.', any)
    expect(upload).toHaveBeenNthCalledWith(2, 'report', ['report.json'], '.', any)
    expect(core.setFailed).toHaveBeenCalledWith(
      'Data validation has failed: https://repository.frictionlessdata.io/report/?user=user&repo=repo&flow=flow&run=id'
    )
  })

  it('package', async () => {
    // Action
    await copy('data/datapackage.yaml', `${workdir.path}/datapackage.yaml`)
    await copy('data/invalid.csv', `${workdir.path}/invalid.csv`)
    await copy('data/valid.csv', `${workdir.path}/valid.csv`)
    await action()

    // Validation
    expect(await readJson(`${workdir.path}/report.json`)).toEqual({ valid: false })
    expect(await readJson(`${workdir.path}/inquiry.json`)).toEqual({
      tasks: [{ source: 'datapackage.yaml' }],
    })

    // Integration
    expect(execute).toHaveBeenCalledWith('frictionless validate inquiry.json --json')
    expect(upload).toHaveBeenNthCalledWith(1, 'inquiry', ['inquiry.json'], '.', any)
    expect(upload).toHaveBeenNthCalledWith(2, 'report', ['report.json'], '.', any)
    expect(core.setFailed).toHaveBeenCalledWith(
      'Data validation has failed: https://repository.frictionlessdata.io/report/?user=user&repo=repo&flow=flow&run=id'
    )
  })

  it('no sources', async () => {
    await action()
    expect(core.setFailed).toHaveBeenCalledWith(
      'Cannot create inquiry: no sources to validate'
    )
  })

  it('config', async () => {
    // Action
    await copy('data/frictionless.yaml', `${workdir.path}/.github/frictionless.yaml`)
    await copy('data/invalid.csv', `${workdir.path}/invalid.csv`)
    await copy('data/valid.csv', `${workdir.path}/valid.csv`)
    await action()

    // Validation
    expect(await readJson(`${workdir.path}/report.json`)).toEqual({ valid: false })
    expect(await readJson(`${workdir.path}/inquiry.json`)).toEqual({
      tasks: [{ path: 'invalid.csv' }, { path: 'valid.csv' }],
    })

    // Integration
    expect(execute).toHaveBeenCalledWith('frictionless validate inquiry.json --json')
    expect(upload).toHaveBeenNthCalledWith(1, 'inquiry', ['inquiry.json'], '.', any)
    expect(upload).toHaveBeenNthCalledWith(2, 'report', ['report.json'], '.', any)
    expect(core.setFailed).toHaveBeenCalledWith(
      'Data validation has failed: https://repository.frictionlessdata.io/report/?user=user&repo=repo&flow=flow&run=id'
    )
  })

  it('inputs', async () => {
    // Action
    await copy('data/frictionless.yaml', `${workdir.path}/.github/frictionless.yaml`)
    await copy('data/invalid.csv', `${workdir.path}/invalid.csv`)
    inputs.inquiry = 'extra'
    await action()

    // Validation
    expect(await readJson(`${workdir.path}/report.json`)).toEqual({ valid: false })
    expect(await readJson(`${workdir.path}/inquiry.json`)).toEqual({
      tasks: [{ path: 'invalid.csv' }],
    })

    // Integration
    expect(execute).toHaveBeenCalledWith('frictionless validate inquiry.json --json')
    expect(upload).toHaveBeenNthCalledWith(1, 'inquiry', ['inquiry.json'], '.', any)
    expect(upload).toHaveBeenNthCalledWith(2, 'report', ['report.json'], '.', any)
    expect(core.setFailed).toHaveBeenCalledWith(
      'Data validation has failed: https://repository.frictionlessdata.io/report/?user=user&repo=repo&flow=flow&run=id'
    )
  })

  it('inputs bad', async () => {
    await copy('data/frictionless.yaml', `${workdir.path}/.github/frictionless.yaml`)
    inputs.inquiry = 'bad'
    await action()
    expect(core.setFailed).toHaveBeenCalledWith('Cannot read inquiry: not existent "bad"')
  })

  it('valid', async () => {
    // Action
    execute.mockReturnValue({ stdout: '{"valid": true}' })
    await copy('data/valid.csv', `${workdir.path}/valid.csv`)
    await action()
    execute.mockReturnValue({ stdout: '{"valid": false}' })

    // Validation
    expect(await readJson(`${workdir.path}/report.json`)).toEqual({ valid: true })
    expect(await readJson(`${workdir.path}/inquiry.json`)).toEqual({
      tasks: [{ source: 'valid.csv' }],
    })

    // Integration
    expect(execute).toHaveBeenCalledWith('frictionless validate inquiry.json --json')
    expect(upload).toHaveBeenNthCalledWith(1, 'inquiry', ['inquiry.json'], '.', any)
    expect(upload).toHaveBeenNthCalledWith(2, 'report', ['report.json'], '.', any)
    expect(core.info).toHaveBeenCalledWith(
      'Data validation has passed: https://repository.frictionlessdata.io/report/?user=user&repo=repo&flow=flow&run=id'
    )
  })
})
