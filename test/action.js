import { dir } from 'tmp-promise'
import { jest } from '@jest/globals'
import * as core from '@actions/core'
import * as artifact from '@actions/artifact'
import { action } from '../lib/action.js'

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
