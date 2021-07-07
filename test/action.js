const { dir } = require('tmp-promise')
const { action } = require('../lib/action')
const artifact = require('@actions/artifact')
const core = require('@actions/core')

// General

let inputs = {}

describe('General', () => {
  beforeAll(() => {
    jest.spyOn(core, 'getInput').mockImplementation((name) => inputs[name])
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn())
    jest.spyOn(core, 'error').mockImplementation(jest.fn())
    jest.spyOn(core, 'warning').mockImplementation(jest.fn())
    jest.spyOn(core, 'info').mockImplementation(jest.fn())
    jest.spyOn(core, 'debug').mockImplementation(jest.fn())
    jest.spyOn(artifact, 'create').mockImplementation(jest.fn())
  })

  beforeEach(() => {
    inputs = {}
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('default', async () => {
    const temp = await dir()
    console.log(temp.path)
  })
})
