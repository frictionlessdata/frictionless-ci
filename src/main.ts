import * as core from '@actions/core'
import * as github from '@actions/github'

async function run() {
  try {
    const myInput = core.getInput('myInput')
    core.debug(`Hello ${myInput} from inside a container`)

    // Get github context data
    const context = github.context
    console.log(`We can even get context data, like the repo: ${context.repo.repo}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
