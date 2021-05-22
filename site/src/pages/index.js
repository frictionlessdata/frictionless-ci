/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import Layout from '@theme/Layout'
import classnames from 'classnames'
import styles from './styles.module.css'

function Home() {
  const context = useDocusaurusContext()
  const { siteConfig: { customFields = {}, tagline } = {} } = context

  return (
    <Layout title={tagline} permalink="/" description={customFields.description}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroProjectTagline}>
            <img
              alt="Frictionless Repository"
              className={styles.heroLogo}
              src={useBaseUrl('img/promo.png')}
            />
            Github <span>Action</span> <br />
            for <span className={styles.heroProjectKeywords}>data validation</span>
          </h1>
          <div className={styles.indexCtas}>
            <Link
              className={styles.indexCtasGetStartedButton}
              to={useBaseUrl('docs/introduction')}
            >
              Get Started
            </Link>
            <span className={styles.indexCtasGitHubButtonWrapper}>
              <iframe
                className={styles.indexCtasGitHubButton}
                src="https://ghbtns.com/github-btn.html?user=frictionlessdata&amp;repo=repository&amp;type=star&amp;count=true&amp;size=large"
                width={160}
                height={30}
                title="GitHub Stars"
              />
            </span>
          </div>
        </div>
      </div>
      <div className={classnames(styles.announcement, styles.announcementDark)}>
        <div className={styles.announcementInner}>
          Frictionless Repository is a Github Action for continious data validation of
          your repository.
        </div>
      </div>
      <div className={styles.section}>
        <div className="container text--center">
          <div className="row">
            <div className="col">
              <a href="docs/overview">
                <img
                  className={styles.featureImage}
                  alt="Data Validation"
                  src={useBaseUrl('img/describe.png')}
                />
                <h3 className="padding-top--md">Data Validation</h3>
              </a>
              <p className="padding-horiz--md">
                You can infer, edit and save metadata of your data tables. It's a first
                step for ensuring data quality and usability.
              </p>
            </div>
            <div className="col">
              <a href="docs/overview">
                <img
                  className={styles.featureImage}
                  alt="Github Statuses"
                  src={useBaseUrl('img/extract.png')}
                />
                <h3 className="padding-top--md">Github Statuses</h3>
              </a>
              <p className="padding-horiz--md">
                You can read your data using a unified tabular interface. Data quality and
                consistency are guaranteed by a schema.
              </p>
            </div>
            <div className="col">
              <a href="docs/overview">
                <img
                  className={styles.featureImage}
                  alt="Visual Reports"
                  src={useBaseUrl('img/validate.png')}
                />
                <h3 className="padding-top--md">Visual Reports</h3>
              </a>
              <p className="padding-horiz--md">
                You can read your data using a unified tabular interface. Data quality and
                consistency are guaranteed by a schema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
