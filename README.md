# Vertex NextJS Template

## Run locally in Docker

1. Copy `.env.template` to `.env` and optionally edit values
1. Run `docker-compose up app` to start the app locally
1. Browse to http://localhost:3000

If you pull down changes, you'll need to run `docker-compose build app` to build them and then `docker-compose up app` again.

## Local development

1. Copy `.env.template` to `.env` and optionally edit values
1. Install dependencies, `yarn install`
1. Run `yarn dev` to start the local development server
1. Browse to http://localhost:3000

## Project organization

```text
public/       // Static assets
src/
  components/ // Components that are used in pages
  lib/        // Shared libraries and utilities
  pages/      // Pages that are served by NextJS
```
