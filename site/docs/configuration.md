---
title: Configuration
---

Frictionless Repository can work without any additional configuration. It will just validate all the CSV and EXCEL files it can find in your repository (respecting `.gitignore` file).

## Step's Inqiury

Frictionless Repository step as a part of Github Workflow acceps only one paramenter called `inquiry`. Here is an example:

> .github/workflows/(name).yaml

```yaml
- name: Validate data
  uses: frictionlessdata/repository@v0.8.0
  with:
    inquiry: extra
```

By default, the `inqiury` paramenter is set to `main`.

## Configuration File

You can add a `.github/frictionless.yaml` file to your Github repository to provide an additional configuration. This file is a mapping in a form of `inquiry name: inqiury descriptor`. It's easier to understan using an example:

> .github/frictionless.yaml

```yaml
extra:
  tasks:
    - path: data/valid.csv
    - path: data/invalid.csv
```

The inquiry descriptor is a Frictionless Framework's [Inquiry](https://framework.frictionlessdata.io/docs/guides/framework/inquiry-guide) so you can use whather is possible to use for the Frictionless Framework validation. Here is a more complex example:

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
