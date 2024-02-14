<div align="center">

# `letyca`

![Static Badge](https://img.shields.io/badge/mission-make_analytics_accessible_for_everyone-purple)
<br />
![GitHub top language](https://img.shields.io/github/languages/top/clnnn/letyca)
![GitHub last commit](https://img.shields.io/github/last-commit/clnnn/letyca)
[![License: MIT](https://img.shields.io/github/license/clnnn/letyca)](https://opensource.org/license/agpl-v3/)
[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/clnnn/letyca)

<p class="align center">
<h4><code>letyca</code> is an AI-driven analytical platform designed to generate visually stunning insights about your data using just human language</h4>
</p>

[What?](#what) •
[Why?](#why) •
[How?](#how) •
[Quickstart](#quickstart) •
[Examples](#examples) •
[Meta](#meta)

</div>

> [!NOTE]  
> This project is in early development stage. It is not ready for production use.

![Welcome GIF](docs/assets/welcome.gif)

## What?

`letyca` is an AI-driven analytical platform that can be used by analysts, data scientists, and business users to generate charts to visualize their existing database content without writing a single line of code or SQL query.

## Why?

The main goal of `letyca` is to provide a simple and intuitive way to generate business insights from your data. It is designed to be used by non-technical users who are not familiar with SQL or any other technical language.

Any existing tool that provides similar functionality is either too complex or too expensive for small and medium-sized businesses. `letyca` aims to fill this gap by providing a simple and affordable solution.

Even if this platform is not a replacement for a data scientist, it can be used to generate quick insights and to validate hypotheses by connecting to the existing database and generating charts and insights.

## How?

It uses a language model to understand the user's input and generate a SQL query that can be used to generate the desired chart. The SQL query is then executed on the database and the result is used to generate the chart.

<!--TODO Diagram - Gif? -->

## Quickstart

### Using DevContainer

#### Prerequisites

If you already have **VS Code** and **Docker** installed, you can click the badge above or [here](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/clnnn/letyca) to get started. Clicking these links will cause VS Code to automatically install the Dev Containers extension if needed, clone the source code into a container volume, and spin up a dev container for use.

#### Running the app

1. Create `.env` file and copy content from `.env.template`. Fill in the mandatory variables.

2. Start both backend and frontend

   ```bash
   npm run start
   ```

3. Open [http://localhost:4200/](http://localhost:4200/)

4. Add a new Letyca connection using the connection string from `.devcontainer/docker-compose.yml`

#### Notes

- `letyca` can run in demo mode without needing database connection. In this mode, the platform will automatically add some demo connections that can be used to generate charts and insights and will restrict the user from managing connections. To enable this mode, set `DEMO_MODE=true` in the `.env` file.

### Supported databases

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

### Supported chart types

- Bar chart
- Line chart
- Pie chart
- Count label

## Meta

### Primary contributors

<a href="https://github.com/clnnn"><img src="https://github.com/clnnn.png" title="clnnn" width="50" height="50"></a>
<a href="https://github.com/drazvan91"><img src="https://github.com/drazvan91.png" title="Răzvan Dragomir" width="50" height="50"></a>

`letyca` was created by <a href="https://github.com/clnnn" target="_blank">me</a> in August of 2023 as a pet project and was intended to be a playground for learning about LLMs.
