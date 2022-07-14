---
title: Migration from Goodtables
---

In [Goodtables](https://goodtables.io) you did need to create a `goodtables.yml` file in your repository, otherwise 
it would validates all your files with extensions as CSV, ODS, XLS or XLSX as described
[here](https://github.com/frictionlessdata/goodtables.io/blob/master/docs/configuration/index.md).

Instead of the `goodtables.yml` file, you will need to create a github workflow file `.github/frictionless.yaml` as describe
[here](/docs/getting-started).

# Example and howto

The website [Dataportals](http://dataportals.org/) used Goodtables in the past to validate their [data](https://github.com/okfn/dataportals.org/tree/master/data) containing all the portals listed on it.
The migration steps from Goodtables to the current Frictionless workflow on Dataportals [repository](https://github.com/okfn/dataportals.org) were:

## 1. Deleted the Goodtables configuration file `goodtables.yml`

## 2. Creation of a file inside the repository at the path `.github/frictionless.yml`

If the folder `.github` does not exist in your repository, you do need to create it first. The content of the `frictionless.yml` file is:

```
main:
  tasks:
    - path: data/datapackage.json
```

Note that the `path` must point to the place in your repository where the file that you do want to validate is located.

## 3. Creation of the configuration file for the Frictionless validation workflow at `.github/workflow/frictionless.yaml`

This file is were you configure how the validation is going to run as described [here](/docs/configuration). The content of this file for the Dataportals website is:

```
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

After you created this files in your repository, commit (`git commit -a`) them and push the changes to Github (`git push`) you can check the workflow running in your repository
clicking in the tab Actions:

![Github Actions](/img/github-actions.png)

## 4. Update of the validation badge

In Goodtables, the badge showing the validation status was located at `https://goodtables.io/badge/github/REPOSITORY-PATH.svg`, in Dataportals case, this path was `https://goodtables.io/badge/github/okfn/dataportals.org.svg`. 

To use the badge from the new workflow you can add a reference to the URL `https://github.com/okfn/dataportals.org/actions/workflows/frictionless.yaml/badge.svg`.

You can see how the Dataportals.org is being used at their [README page](https://github.com/okfn/dataportals.org/tree/master/data):

![Status Badge](/img/dataportals-status-badge.png)

If you look at the `README.md`file content you will see how this badge is written in Markdown:

```
[![Data](https://github.com/okfn/dataportals.org/actions/workflows/frictionless.yaml/badge.svg)](https://repository.frictionlessdata.io/report?user=okfn&repo=dataportals.org&flow=portals)
```

To get ther markdown code for your frictionless validation workflow, go again to Github Actions tab for your repository:

![Github Actions](/img/github-actions.png)

Click in the last workflow run:

![Github Workflow Run](/img/github-actions-workflow-run.png)

And then click in the three dots menu at the top right corner:

![Github Workflow Run Menu](/img/github-actions-workflow-run-menu.png)

Select "Create status badge" and this will open a dialog where you can copy the badge markdown code:

![Github Workflow Badge Code](/img/github-actions-workflow-run-badge-code.png)
