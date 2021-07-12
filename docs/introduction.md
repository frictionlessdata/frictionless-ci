---
title: Introduction
---

[![Build](https://img.shields.io/github/workflow/status/frictionlessdata/repository/general/main)](https://github.com/frictionlessdata/repository/actions)
[![Coverage](https://img.shields.io/codecov/c/github/frictionlessdata/repository/main)](https://codecov.io/gh/frictionlessdata/repository)
[![Release](https://img.shields.io/github/v/release/frictionlessdata/repository)](https://github.com/frictionlessdata/repository/releases)
[![Codebase](https://img.shields.io/badge/codebase-github-brightgreen)](https://github.com/frictionlessdata/repository)
[![Support](https://img.shields.io/badge/support-discord-brightgreen)](https://discord.com/channels/695635777199145130/695635777199145133)

Frictionless Repository is a Github Action created for continuous data validation. It is a minimalistic integration between [Github Actions](https://github.com/features/actions) and [Frictionless Data](https://frictionlessdata.io/). In this introduction we will show an example of its work and describe the projects it relies on.

<p><iframe width="560" height="315" src="https://www.youtube.com/embed/kXA4hmuF57c" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>

## How It Works

On every commit to your repository there will be run a validation process to find tabular errors and other problems in your data. A visual validation report will be provided:

![Example](/img/example.png)

## Github Actions

Github Actions is a continuous integration service. If you're not familiar with Github Actions we really recommend you to watch a short talk given by [Grant R. Vousden-Dishington](https://github.com/GrantRVD) on csv,conf,v6:

<p><iframe width="560" height="315" src="https://www.youtube.com/embed/0WYpiba-UjE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>

## Frictionless Data

Frictionless Data is a comprehensive data software and standards project covering many aspects working with data. Frictionless Repository uses a Python framework to validate data and a report component to show the validation results:
- [Frictionless Framework](https://framework.frictionlessdata.io/)
- [Frictionless Components](https://components.frictionlessdata.io/?path=/story/components-report--invalid)

Frictionless Repository can be described by this simple flow:
- you add a Frictionless Repository step to their workflow on Github
- Frictionless Framework validates your data and saves the result as a workflow's artifact
- Frictionless Components fetch and render this validation report

Frictionless Repository is completely server-less so it doesn't rely on any third-party hardware except for Github infrastructure. There is no vendor-lock or something like this a you can fork this project and run it on Github differently if needed.
