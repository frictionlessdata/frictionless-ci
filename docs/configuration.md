# Configuration

Frictionless Repository can work without any additional configuration. It will validate all the CSV, EXCEL and JSONL files it can find in your repository (respecting `.gitignore` file) or all the DATA PACKAGE and DATA RESOURCE descriptors if they present. Note that if data packges are found all other type of sources are ignored. The same for data resources if not data packages are found.

## Search Patterns

It's possible to configure how Frictionless Repository searchs for the validation sources. Github Workflow accepts parameters called `packages`, `resources`, and `tables` expecting a GLOB pattern pointing to data sources. See [Getting Started](/docs/getting-started.html) guide for more inpormation on how to setup workflows.

We can configure the GLOB patterns used for searching packages:

> .github/workflows/(name).yaml

```yaml tabs=YAML
- name: Validate data
  uses: frictionlessdata/repository@v2
  with:
    packages: "path/to/*.package.yaml"
```

Or for searching resources:

```yaml tabs=YAML
- name: Validate data
  uses: frictionlessdata/repository@v2
  with:
    resources: "path/to/*.resource.yaml"
```

Or for searching tables:

```yaml tabs=YAML
- name: Validate data
  uses: frictionlessdata/repository@v2
  with:
    tables: "path/to/**/*.csv"
```

Read more about [GLOB Patterns](https://en.wikipedia.org/wiki/Glob_(programming)) in this article.

## Validation Inquiry

### Creating Inquiry

You can create an Inquiry file in your Github repository and use it in the action configuration to have more granular control over validation. An Inqiury tells Frictionless Repository how validate the data. For example:

> path/to/inquiry.yaml

```yaml tabs=YAML
tasks:
  - path: data/valid.csv
  - path: data/invalid.csv
```

The inquiry descriptor is a Frictionless Framework's Inquiry so you can use whatever is possible to use for the Frictionless Framework validation. Here is a more complex example:

```yaml tabs=YAML
tasks:
  - path: btc-price-postprocessed.json
    schema:
      fields:
        - name: currency
          type: string
        - name: bitcoinRate
          type: number
          groupChar: ','
          constraints:
            maximum: 40000
```

Note, that you can place this file anywhere in your repository or create multiple inquiries; to enable it you need to use the `inquiry` parameter in your workflow as described in the next section.

### Testing Inquiry

It's quite easy to test your inquiry locally.

First of all, install Frictionless Framework:

```bash tabs=CLI
pip install frictionless[excel,json] --pre
```

Secondly, run the `validate` command against your inquiry:

```bash tabs=CLI
frictionless validate path/to/inquiry.yaml
```

As a result, you will get a textual validation report with the same details as you will get on every Frictionless Repository run.

### Enabling Inqiury

Frictionless Repository step as a part of Github Workflow accepts a parameter called `inquiry`. To use an inquiry from the section above set this parameter:

> .github/workflows/(name).yaml

```yaml tabs=YAML
- name: Validate data
  uses: frictionlessdata/repository@v2
  with:
    inquiry: path/to/inquiry.yaml
```

In this case the inquiry from `path/to/inquiry.yaml` will be used as a validation source.

Read more about [Inquiries](inquiries.html) in this article.

## Validation Strategy

You can use Frictionless in many ways and this limit is only our imagination. Thanks to composability of Github Actions, it's possible to integrate Frictionless with many other steps and implement complex validation strategies. On the other hand, if you are new to Github Actions we recommend to start from these setups:

### Single Workflow

The simplest way to use Frictionless Repository is to create a single workflow called `frictionless`. This workflow will be responsible of all your data validation and you can have one status badge for the whole project:

> .github/workflows/frictionless.yaml

```yaml tabs=YAML
name: frictionless

# ...

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Validate data
        uses: frictionlessdata/repository@v2
```

Using this setup you will have a single "Frictionless" badge that you can add to your README.md file.

### Multiple Workflow

You have a few groups of independent data or interested in more sophisticated logic you might use multiple workflows. For example, consider we have some data related to humans and some to animals:

> .github/workflows/people.yaml

```yaml tabs=YAML
name: people

# ...

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Validate data
        uses: frictionlessdata/repository@v2
        with:
            inquiry: path/to/people.inquiry.yaml
```

> .github/workflows/animals.yaml

```yaml
name: animals

# ...

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Validate data
        uses: frictionlessdata/repository@v2
        with:
            inquiry: path/to/animals.inquiry.yaml
```

In this case, we need to create two inquiry files:

> path/to/people.inquiry.yaml

```yaml tabs=YAML
tasks:
  - path: people/table1.csv
  - path: people/table2.csv
```

> path/to/animals.inquiry.yaml

```yaml tabls=YAML
tasks:
  - path: animals/table1.csv
  - path: animals/table2.csv
```

Don't forget that we use Frictionless Framework's Inquiry that gives us even more flexibility. For example, you can write quite complex tasks logic and combine it with your single or multiple workflows.

### Complex Workflow

On top of dedicated validation workflows, you can integrate Frictionless Repository inside existent workflows. For example, here is a Frictionless-Flat Data integration:

> https://github.com/roll/flat-demo-bitcoin-price/blob/main/.github/workflows/flat.yaml

```yaml
name: Flat

# ...

jobs:
  scheduled:
    runs-on: ubuntu-latest
    steps: # This workflow has 3 steps
      # The first step is to check out the repository so it can read the files inside of it and do other operations
      - name: Check out repo
        uses: actions/checkout@v2
      # This step installs Deno, which is a new Javascript runtime that improves on Node. We'll use it for postprocessing later
      - name: Setup deno
        uses: denoland/setup-deno@main
        with:
          deno-version: v1.x
      # The third step is a Flat Action step. We fetch the data in the http_url and save it as downloaded_filename
      - name: Fetch data
        uses: githubocto/flat@v2
        with:
          http_url: https://api.coindesk.com/v2/bpi/currentprice.json # The data to fetch every 5 minutes
          downloaded_filename: btc-price.json # The http_url gets saved and renamed in our repository as btc-price.json
          postprocess: postprocess.js # A postprocessing javascript or typescript file written in Deno
      # The fourth step is validation using Frictionless Repository
      - name: Frictionless Repository
        uses: frictionlessdata/repository@v2
```

## Validation Triggers

Github Actions provides a great deal of flexibility regarding on when your workflow will be run. Here is a quick example:

> .github/workflows/(name).yaml

```yaml
on:
  # Trigger the workflow on push or pull request,
  # but only for the main branch
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  # Also trigger on page_build, as well as release created events
  page_build:
  release:
    types: # This configuration does not affect the page_build event above
      - created`
```

This knowledge is related not only to Frictionless Repository but to all Github Actions so we really recommend to read [Github Documentaion](https://docs.github.com/en/actions/reference/events-that-trigger-workflows) on this topic.
