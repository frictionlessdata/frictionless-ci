import { dir } from 'tmp-promise'
import * as config from '../lib/config.js'

// General

describe('General', () => {
  it('main', async () => {
    expect(config.INQUIRY_PROPERTY).toBe('main')
  })
})
