# Letyca

## Prerequisites

1. Install docker
2. Install VSCode
3. Install VSCode [DevContainer extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
4. Open this folder in VSCode
5. CTRL+SHIFT+R (or CMD+SHIFT+R) and type `dev containers: open folder in container`
6. It will docker images and then start 3 containers. It might take a few minutes. Check `.devcontainer/docker-compose.yaml` file for more info.

## Configure and run

1. Create `.env` file and copy content from `.env.template`. Fill in the mandatory variables.
2. Migrate Letyca database to latest schema using `npm run migrate-dev`
3. Start both backend and frontend using `npm run start`
4. Open [http://localhost:4200/](http://localhost:4200/)
5. Add a new Letyca connection using connection string config from the docker-compose.yaml file in .devcontainer folder (it should be: `postgresql://postgres:postgres@northwind:5432/northwind?schema=public`)
