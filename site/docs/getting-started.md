---
title: Getting Started
---

There are two options of installing Fricitonless Repository. In both cases it will be validating your CSV and EXCEL files on every push, tag, or PR (or based on your configuration). After a commit and a workflow run you will see a link to a validation report within the workflow log or an error message.

## New Workflow

Add a file shown below in your Github Repository:

> .github/worflows/frictionless.yaml

```yaml
name: frictionless

on:
  push:
    branches:
      - main
    tags:
      - v*.*.*
  pull_request:
    branches:
      - main

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Validate data
        uses: frictionlessdata/repository@v0.8.0 # update to the latest version
```

## Existent Workflow

Just add this step to an existent workflow:

> .github/worflows/(name).yaml

```yaml
- name: Validate data
  uses: frictionlessdata/repository@v0.8.0 # update to the latest version
```
