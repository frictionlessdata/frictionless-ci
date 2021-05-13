// TODO: isolate namespace
async function main() {
  // Get params
  const params = new URLSearchParams(window.location.search)
  const user = params.get('user')
  const repo = params.get('repo')
  const workflow = params.get('workflow') || 'frictionless'
  if (!user && !repo && !workflow) {
    return
  }

  // Update form
  document.getElementById('user').value = user
  document.getElementById('repo').value = repo
  document.getElementById('workflow').value = workflow

  // Get runId
  const runs = await getData(
    `/repos/${user}/${repo}/actions/workflows/${workflow}.yaml/runs`
  )
  const runId = runs.workflow_runs.filter((item) => item.status === 'completed')[0].id
  // console.log(runId)

  // Get artifactId
  const artifacts = await getData(
    `/repos/${user}/${repo}/actions/runs/${runId}/artifacts`
  )
  const artifactId = artifacts.artifacts[0].id
  // console.log(artifactId)

  // Get zipFile
  const zipFile = await getFile(
    `/repos/${user}/${repo}/actions/artifacts/${artifactId}/zip`
  )
  // console.log(zipFile)

  // Get report
  const archive = await JSZip.loadAsync(zipFile)
  const contents = await archive.file('report.json').async('string')
  const report = JSON.parse(contents)
  // console.log(report)

  // Show report
  // TODO: add H1 user/repo, link, etc
  const element = document.getElementById('report')
  frictionlessComponents.render(frictionlessComponents.Report, { report }, element)
}

async function getData(path) {
  const TOK = 'Z2hwXzVkQ3BTZUoxTURJNlF3MzlwOWlqVmlxU2YwcnpnaTNSVklBcA=='
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${atob(TOK)}`,
    },
  })
  const data = await res.json()
  return data
}

async function getFile(path) {
  const TOK = 'Z2hwXzVkQ3BTZUoxTURJNlF3MzlwOWlqVmlxU2YwcnpnaTNSVklBcA=='
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${atob(TOK)}`,
    },
  })
  const buffer = await res.blob()
  return buffer
}

main()
  .then(() => {})
  .catch((error) => console.log(error))
