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
          href="//unpkg.com/frictionless-components/dist/frictionless-components.css"
        />
        <script src="https://unpkg.com/jszip/dist/jszip.js"></script>
        <script src="//unpkg.com/frictionless-components@0.1.14/dist/frictionless-components.js"></script>
      </Head>
      <div className="container margin-vert--lg">
        <form action="" method="GET">
          <div>
            <input name="user" id="user" placeholder="user" />
            <input name="repo" id="repo" placeholder="repo" />
            <input name="workflow" id="workflow" placeholder="workflow" />
            <button>Show</button>
          </div>
        </form>
        <div id="report"></div>
      </div>
      <Safe.script src={useBaseUrl('js/report.js')}></Safe.script>
    </Layout>
  )
}

export default Report
