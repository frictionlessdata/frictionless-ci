const { copy } = require('fs-extra')
const { dir } = require('tmp-promise')
const { action } = require('../lib/action')
const artifact = require('@actions/artifact')
const core = require('@actions/core')

// General

describe('General', () => {
  let inputs
  let workdir

  beforeAll(() => {
    // Mock core
    jest.spyOn(core, 'getInput').mockImplementation((name) => inputs[name])
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn())
    jest.spyOn(core, 'error').mockImplementation(jest.fn())
    jest.spyOn(core, 'warning').mockImplementation(jest.fn())
    jest.spyOn(core, 'info').mockImplementation(jest.fn())
    jest.spyOn(core, 'debug').mockImplementation(jest.fn())

    // Mock artifact
    const uploadArtifact = jest.fn()
    uploadArtifact.mockReturnValue({ failedItems: [] })
    jest.spyOn(artifact, 'create').mockImplementation(() => ({ uploadArtifact }))
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

  it('valid', async () => {
    await copy('data/valid.csv', `${workdir.path}/valid.csv`)
    await action({ workingDirectory: workdir.path })
  })
})
