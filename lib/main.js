const { action } = require('./action')

// General

action()
  .then(() => {})
  .catch((error) => {
    throw error
  })
