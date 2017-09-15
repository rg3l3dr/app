# app

> A Vue.js SPA for www.omnibuilds.com

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build the vue project
npm run build

# clear the existing build and deploy new build to S3 staging environment (appstage.omnibuilds.com)
npm run deploy_stage

# clear the existing build and deploy new build to S3 production environment (app.omnibuilds.com)
npm run deploy_prod

# does the following
aws s3 rm s3://omni-dev-spa --recursive && aws s3 sync ~/Desktop/app/dist/ s3://omni-dev-spa

```
### Invalidate Cloudfront Cache (after deploy)

From the AWS Console select clouldfront -> distribution -> settings -> invalidations -> create invalidation with path /*

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
