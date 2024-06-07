# Vertex NextJS Starter

Use our starter application template using the NextJS framework.

View a scene, apply camera states, and see a scene item's metadata. We built this application following best practices for integrating the Vertex platform. [Follow our guide](https://developer.vertex3d.com/docs/guides/build-your-first-app) to build a foundation, then add functionality to create your own prototype application using Vertex.

## Local development

1. Copy `.env.local.template` to `.env.local` and edit values
  1. Ensure that you have provided valid credentials for `VERTEX_CLIENT_ID` and `VERTEX_CLIENT_SECRET`
  1. Determine a scene that you would like to have loaded into the viewer by default upon load and provide the Scene's Supplied ID for `DEFAULT_SUPPLIED_ID`
1. Install dependencies, `yarn install` or `npm install`
1. Run `yarn dev` or `npm run dev` to start the local development server
1. Browse to http://localhost:3000
1. You can load any Scene in your account by using the Scene's Supplied ID in the URL (ex. http://localhost:3000/?suppliedId=PART123)

### Project organization

```text
public/       // Static assets
src/
  components/ // Components used in pages
  lib/        // Shared libraries and utilities
  pages/      // Pages served by NextJS
    api/      // API endpoints served by NextJS
```

## Run locally in Docker

1. Copy `.env.local.template` to `.env.local` and optionally edit values
1. Run `docker-compose --file ./docker-compose.yml up` to start the app locally
1. Browse to http://localhost:3000

If you pull down changes, you'll need to run `docker-compose --file ./docker-compose.yml build` to build them and then `docker-compose --file ./docker-compose.yml up` again.

### Deployment

A few options for deployment,

- [Vercel](https://nextjs.org/docs/deployment)
- [Netlify](https://www.netlify.com/blog/2020/11/30/how-to-deploy-next.js-sites-to-netlify/)
- [AWS CDK](https://github.com/serverless-nextjs/serverless-next.js#readme)
