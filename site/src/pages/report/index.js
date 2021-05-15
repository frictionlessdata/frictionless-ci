import React from 'react'
import Safe from 'react-safe'
import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'

function Report() {
  return (
    <Layout title="Report" description="Report renderer">
      <Head>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
          integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
          crossorigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="//unpkg.com/frictionless-components/dist/frictionless-components.css"
        />
        <script src="//unpkg.com/frictionless-components/dist/frictionless-components.js"></script>
      </Head>
      <div class="cotainer margin-vert--lg">
        <div id="workflow"></div>
        <Safe.script>{`
          const tok = 'Z2hwXzVkQ3BTZUoxTURJNlF3MzlwOWlqVmlxU2YwcnpnaTNSVklBcA=='
          const params = new URLSearchParams(window.location.search)
          const user = params.get('user')
          const repo = params.get('repo')
          const workflow = params.get('workflow')
          const run = params.get('run')
          const element = document.getElementById('workflow')
          const props = { user, repo, workflow, run, token: atob(tok) }
          frictionlessComponents.render(frictionlessComponents.Workflow, props, element)
        `}</Safe.script>
      </div>
    </Layout>
  )
}

export default Report
