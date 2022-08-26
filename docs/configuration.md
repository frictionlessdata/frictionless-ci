# Configuration

Frictionless Repository can work without any additional configuration. It will just validate all the CSV and EXCEL files it can find in your repository (respecting `.gitignore` file).

## Configuration File

You can add a `.github/frictionless.yaml` file to your Github repository to provide an additional configuration. This file is a mapping in a form of `inquiry name: inquiry descriptor`. It's easier to understand using an example:

> .github/frictionless.yaml

```yaml
main:
  tasks:
    - path: data/valid.csv
    - path: data/invalid.csv
```

The inquiry descriptor is a Frictionless Framework's [Inquiry](./inquiries.md) so you can use whatever is possible to use for the Frictionless Framework validation. Here is a more complex example:

> https://github.com/roll/flat-demo-bitcoin-price/blob/main/.github/frictionless.yaml

```yaml
main:
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

Note, that we used the `main` inquiry name because it's a default inquiry. You can have multiple inquiries in your repository setting the `inquiry` parameter in your workflow.

## Inquiry Parameter

Frictionless Repository step as a part of Github Workflow accepts only one parameter called `inquiry`. Here is an example:

> .github/workflows/(name).yaml

```yaml
- name: Validate data
  uses: frictionlessdata/repository@v1
  with:
    inquiry: extra
```

By default, the `inquiry` parameter is set to `main`. So the examples in the previous section will work for any step without the `inquiry` parameter or when it's set to `main`. When we have, as in our example, `inquiry: extra` we need to provide a corresponding configuration:

> .github/frictionless.yaml

```yaml
extra:
  tasks:
    - path: data/table.csv
    - path: data/other.csv
```

## Validation Strategy

You can use Frictionless in many ways and this limit is only our imagination. Thanks to composability of Github Actions, it's possible to integrate Frictionless with many other steps and implement complex validation strategies. On the other hand, if you are new to Github Actions we recommend to start from these setups:

### Single Workflow

The simplest way to use Frictionless Repository is to create a single workflow called `frictionless`. This workflow will be responsible of all your data validation and you can have one status badge for the whole project:

> .github/workflows/frictionless.yaml

```yaml
name: frictionless

# ...

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Validate data
        uses: frictionlessdata/repository@v1
```

Using this setup you will have a single "Frictionless" badge that you can add to your README.md file.

### Multiple Workflow

You have a few groups of independent data or interested in more sophisticated logic you might use multiple workflows. For example, consider we have some data related to humans and some to animals:

> .github/workflows/people.yaml

```yaml
name: people

# ...

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Validate data
        uses: frictionlessdata/repository@v1
        with:
            inquiry: people
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
        uses: frictionlessdata/repository@v1
        with:
            inquiry: animals
```

The only missing part in this case is the [Configuration File](#configuration-file) that will tell Frictionless what are these inquiries:

> .github/frictionless.yaml

```yaml
people:
  tasks:
    - source: people/*.csv

animals:
  tasks:
    - source: animals/*.csv
```

Don't forget that we use Frictionless Framework's [Inquiry](./inquiries.md) that gives us even more flexibility. For example, you can write quite complex tasks logic and combine it with your single or multiple workflows.

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
        uses: frictionlessdata/repository@v1
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
