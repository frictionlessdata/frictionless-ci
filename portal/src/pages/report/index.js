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
        <h1>frictionlessdata/repository</h1>
        <div id="report"></div>
      </div>
      <Safe.script src={useBaseUrl('js/report.js')}></Safe.script>
    </Layout>
  )
}

export default Report
