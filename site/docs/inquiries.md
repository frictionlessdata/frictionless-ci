---
title: Inquiries
---

As it's described in the [Configuration](./configuration.md) section it's possible to provide custom inquiries in `.github/frictionless.yaml` file. An [Inquiry](https://framework.frictionlessdata.io/docs/guides/framework/inquiry-guide) is a Frictionless Framework concept used to define a validation job.

## File Paths

The simplest way to customize an inquiry is to set validation paths:

> .github/frictionless.yaml

```yaml
main:
  tasks:
    - path: data/table.csv
    - path: data/table.xls
```

Note that by default it will create a task for every file found by glob `**/*.{csv,tsv,xls,xlsx}` respecting `.gitignore`.

## File Details

A task can have any parameters accepted by the [Resource](https://framework.frictionlessdata.io/docs/guides/framework/resource-guide) class so you can provide scheme, format, etc:

> .github/frictionless.yaml

```yaml
main:
  tasks:
    - path: data/table.csv.zip
      scheme: file
      format: csv
      hashing: sha256
      encoging: utf-8
      compression: zip
```

By default, Fricitonless tries to infer all these parameters.

## Table Details

Let's provide a layout and a schema as it's described in [Resource](https://framework.frictionlessdata.io/docs/guides/framework/resource-guide):

> .github/frictionless.yaml

```yaml
main:
  tasks:
    - path: table.csv
      dialect:
        separator: ;
      layout:
        headerRows: [1,2]
      schema:
        fields:
          - name: currency
            type: string
          - name: rate
            type: number
            groupChar: ','
            constraints:
              maximum: 100
```

You can also provide dialect, layout, or schema as a file path e.g. `schema: schema.yaml`.

## Validation Details

It's possible to configure how the validation happens as it's in [Errors Configuraiton](https://framework.frictionlessdata.io/docs/guides/validation-guide#pickskip-errors):

> .github/frictionless.yaml

```yaml
main:
  tasks:
    - path: table.csv
      pickErrors: ['#header']
      skipErrors: ['#row']
      limitErrors: 10
      offsetErrors: 10
```

And provide additional [validation checks](https://framework.frictionlessdata.io/docs/guides/validation-checks):

> .github/frictionless.yaml

```yaml
main:
  tasks:
    - path: table.csv
      checks:
        - code: duplicate-row
        - code: forbidden-value
          fieldName: country
          values:
            - not-existent
```

## Validating a Package

It's possible to validate a data package:

> .github/frictionless.yaml

```yaml
main:
  tasks:
    - source: data/datapackage.json
      type: package
```
