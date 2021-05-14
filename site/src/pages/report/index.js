import React from 'react'
import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'
import useBaseUrl from '@docusaurus/useBaseUrl'
import Safe from 'react-safe'

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
        <script src="https://unpkg.com/jszip/dist/jszip.js"></script>
        <script src="//unpkg.com/frictionless-components/dist/frictionless-components.js"></script>
      </Head>
      <div className="container margin-vert--lg">
        <form
          style={{
            paddingBottom: '30px',
            borderBottom: 'solid 1px #ddd',
            marginBottom: '15px',
          }}
        >
          <div className="form-row">
            <div class="col">
              <input name="user" id="user" placeholder="user" className="form-control" />
            </div>
            <div class="col">
              <input name="repo" id="repo" placeholder="repo" className="form-control" />
            </div>
            <div class="col">
              <input
                name="workflow"
                id="workflow"
                placeholder="workflow"
                className="form-control"
              />
            </div>
            <div class="col">
              <button className="btn btn-primary" style={{ width: '100%' }}>
                Show
              </button>
            </div>
          </div>
        </form>
        <div id="report"></div>
      </div>
      <Safe.script src={useBaseUrl('js/report.js')}></Safe.script>
    </Layout>
  )
}

export default Report
