const config = require('../lib/config')

// General

describe('General', () => {
  it('main', async () => {
    expect(config.INQUIRY_PROPERTY).toBe('main')
  })
})
