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
    jest.spyOn(core, 'getInput').mockImplementation((name) => inputs[name])
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn())
    jest.spyOn(core, 'error').mockImplementation(jest.fn())
    jest.spyOn(core, 'warning').mockImplementation(jest.fn())
    jest.spyOn(core, 'info').mockImplementation(jest.fn())
    jest.spyOn(core, 'debug').mockImplementation(jest.fn())
    jest.spyOn(artifact, 'create').mockImplementation(jest.fn())
  })

  beforeEach(async () => {
    inputs = {}
    workdir = await dir({ unsafeCleanup: true })
    await copy('data/valid.csv', `${workdir.path}/valid.csv`)
    await copy('data/invalid.csv', `${workdir.path}/invalid.csv`)
  })

  afterEach(() => {
    inputs = {}
    workdir.cleanup()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('default', async () => {
    await action({ workingDirectory: workdir.path })
    console.log(core.setFailed.mock.calls)
  })
})
