---
title: Overview
---

Frictionless Repository is a Github Action created for continous data validation. The idea is that on every commit to your repository there will be run a validation process to find tabular errors and other problems in your data.

Generally speaking, Fricitonless Repository is just a thin wrapper over these projects:
- [Github Actions](https://github.com/features/actions)
- [Frictionless Data](https://frictionlessdata.io/)

Github Actions is a continous integration service. If you're not familiar with Github Actions we really recommend you to watch a short talk given on csv,conf,v6:

<p><iframe width="560" height="315" src="https://www.youtube.com/embed/0WYpiba-UjE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>

Frictionless Data is a comprehensive data software and standards project covering many aspects working with data. Frictionless Repository uses a Python framework to validate data and a report component to show the validation results:
- [Frictionless Framework](https://framework.frictionlessdata.io/)
- [Frictionless Components](https://components.frictionlessdata.io/?path=/story/components-report--invalid)

Frictionless Repository can be described by this simple flow:
- you add a Frictionless Repository step to their worflow on Github
- Frictionless Framework validates your data and saves the result as a workflow's artifact
- Frictionless Components fetch and render this validation report

Frictionless Repository is completely server-less so it doesn't rely on any third-party hardware except for Github infrastructure. There is no vendor-lock or something like this a you can fork this project and run it on Github differently if needed.
