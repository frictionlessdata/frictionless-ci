# Inquiries

As it's described in the [Configuration](configuration.html) section it's possible to provide custom inquiries in `.github/frictionless.yaml` file. An [Inquiry](https://framework.frictionlessdata.io/docs/framework/inquiry.html) is a Frictionless Framework concept used to define a validation job.

## File Paths

The simplest way to customize an inquiry is to set validation paths:

> path/to/inquiry.yaml

```yaml tabs=YAML
tasks:
  - path: data/table.csv
  - path: data/table.xls
```

## File Details

A task can have many parameters accepted by the [Resource](https://framework.frictionlessdata.io/docs/framework/resource.html) class so you can provide scheme, format, etc:

> path/to/inquiry.yaml

```yaml tabs=YAML
tasks:
  - path: data/table.csv.zip
    scheme: file
    format: csv
    encoging: utf-8
    compression: zip
```

By default, Fricitonless tries to infer all these parameters.

## Table Details

Let's provide a dialect and a schema as it's described in [Resource](https://framework.frictionlessdata.io/docs/framework/resource.html):

> path/to/inquiry.yaml

```yaml tabs=YAML
tasks:
  - path: table.csv
    dialect:
      headerRows: [1,2]
      csv:
        separator: ;
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

You can also provide dialect, or schema as a file path e.g. `schema: schema.yaml`.

## Validation Details

It's possible to configure how the validation happens as it's in [Checklist](https://framework.frictionlessdata.io/docs/framework/checklist.html):

> path/to/inquiry.yaml

```yaml tabs=YAML
tasks:
  - path: table.csv
    checklsit:
      pickErrors: ['#header']
      skipErrors: ['#row']
      checks:
        - type: ascii-value
        - type: row-constraint
          formula: id>1
```

Please consult with [Validation Checks](https://framework.frictionlessdata.io/docs/checks/baseline.html) for available checks.

## Validating Resource

It's possible to validate a data resource:

> path/to/inquiry.yaml

```yaml tabs=YAML
tasks:
  - resource: data/dataresource.json
```

Read more about [Resource](https://framework.frictionlessdata.io/docs/framework/resource.html) in the Frictionless Framework docs.

## Validating Package

It's possible to validate a data package:

> path/to/inquiry.yaml

```yaml tabs=YAML
tasks:
  - package: data/datapackage.json
```

Read more about [Package](https://framework.frictionlessdata.io/docs/framework/package.html) in the Frictionless Framework docs.
