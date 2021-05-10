import * as core from '@actions/core'

async function run() {
  try {
    const myInput = core.getInput('myInput')
    console.log(`Hello "${myInput}" from inside a container`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
