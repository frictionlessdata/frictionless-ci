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
          Data management Github Action for continuous validation of tabular data in your
          repository.
        </div>
      </div>
      <div className={styles.section}>
        <div className="container text--center">
          <div className="row">
            <div className="col">
              <a href="docs/introduction">
                <img
                  className={styles.featureImage}
                  alt="Data Validation"
                  src={useBaseUrl('img/validation.png')}
                />
                <h3 className="padding-top--md">Data Validation</h3>
              </a>
              <p className="padding-horiz--md">
                Frictionless Repository will be continuously validating your data for
                tabular errors.
              </p>
            </div>
            <div className="col">
              <a href="docs/reports">
                <img
                  className={styles.featureImage}
                  alt="Github Statuses"
                  src={useBaseUrl('img/reports.png')}
                />
                <h3 className="padding-top--md">Visual Reports</h3>
              </a>
              <p className="padding-horiz--md">
                After a validation Frictionless Repository will provide a visual report
                available by a link.
              </p>
            </div>
            <div className="col">
              <a href="docs/badges">
                <img
                  className={styles.featureImage}
                  alt="Visual Reports"
                  src={useBaseUrl('img/medal.png')}
                />
                <h3 className="padding-top--md">Markdown Badges</h3>
              </a>
              <p className="padding-horiz--md">
                With Frictionless Repository you can have a validation badge to always see
                the status.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
