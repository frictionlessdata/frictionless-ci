---
title: Migration from Goodtables
---

[Goodtables](https://goodtables.io) was a data package validation service
that has been superseded by Frictionless Repository. To use it, it was
necessary to create a `goodtables.yml` configuration file in your
repository, otherwise it would validate all your files with as CSV, ODS,
XLS or XLSX extensions. The instructions for doing that configuration
are described
[here](https://github.com/frictionlessdata/goodtables.io/blob/master/docs/configuration/index.md).

With Frictionless Repository, instead of the `goodtables.yml` file, you
will need to create a github workflow file named
`.github/frictionless.yaml` as describe [here](/docs/getting-started).

# Example and howto

The website [Dataportals.org](http://dataportals.org/) has used GoodTables in
the past to validate their
[data files](https://github.com/okfn/dataportals.org/tree/master/data),
which contain all the portals listed on it. The migration steps from
GoodTables to the current Frictionless workflow on Dataportals.org
[repository](https://github.com/okfn/dataportals.org) were:

## 1. Delete the GoodTables configuration file `goodtables.yml`

The configuration file needs to be removed from the repository:

```bash
git rm goodtables.yml
```

## 2. Remove the GoodTables WebHook from repository settings

In the Github repository, go into "Settings", then "WebHooks".

![Github Actions](/img/github-actions.png)

Find the GoodTables.io entry there and hit "Delete".

## 3. Create a file inside the repository at the path `.github/frictionless.yaml`

If the `.github` folder does not yet exist in your repository, you do
need to create it first. The contents of the `frictionless.yaml` file are:

```yaml
main:
  tasks:
    - source: data/datapackage.json
      type: package
```

Note that the `source` must point to the place in your repository where
the data package file that you do want to validate is located.

## 4. Create the configuration file for the Frictionless validation workflow at `.github/workflow/frictionless.yaml`

This file is where you configure how the validation is going to run as
described [here](/docs/configuration). The contents of this file for the
Dataportals.org website are:

```yaml
name: portals

on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Validate data
        uses: frictionlessdata/repository@v1
```

After creating these files in your repository, commit (`git commit -a`)
them and push the changes to Github (`git push`). You can check the
workflow running in your repository clicking the Actions tab:

![Github Actions](/img/github-actions.png)

## 5. Update the validation badge

In GoodTables, the badge showing the validation status was located at
`https://goodtables.io/badge/github/REPOSITORY-PATH.svg`.
In Dataportals.org's case, the path was
`https://goodtables.io/badge/github/okfn/dataportals.org.svg`. 

With Frictionless Repository, in order to use a badge for the new
workflow you need to create an image referencing a specific URL. In
Dataportals.org's case this is
`https://github.com/okfn/dataportals.org/actions/workflows/frictionless.yaml/badge.svg`.

You can see how the Dataportals.org repository is using the badge at their
[data README page](https://github.com/okfn/dataportals.org/tree/master/data):

![Status Badge](/img/dataportals-status-badge.png)

If you look at the `README.md` file contents you will see how this badge is written in Markdown:

```markdown
[![Data](https://github.com/okfn/dataportals.org/actions/workflows/frictionless.yaml/badge.svg)](https://repository.frictionlessdata.io/report?user=okfn&repo=dataportals.org&flow=portals)
```

You can get the exact code to create the badge for your frictionless
validation workflow, in markdown format, by going to your repository's
Github Actions tab:

![Github Actions](/img/github-actions.png)

Click the last workflow run:

![Github Workflow Run](/img/github-actions-workflow-run.png)

And then click the three dots menu at the top right corner:

![Github Workflow Run Menu](/img/github-actions-workflow-run-menu.png)

Select "Create status badge" and this will open a dialog where you can copy the badge markdown code:

![Github Workflow Badge Code](/img/github-actions-workflow-run-badge-code.png)

Paste this code at the top (or anywhere else) of your README.md file,
commit it, and you're done!
