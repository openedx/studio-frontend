# studio-frontend
[![codecov](https://codecov.io/gh/edx/studio-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/edx/studio-frontend)
[![Build Status](https://travis-ci.org/edx/studio-frontend.svg?branch=master)](https://travis-ci.org/edx/studio-frontend)
[![npm](https://img.shields.io/npm/v/@edx/studio-frontend.svg)](https://www.npmjs.com/package/@edx/studio-frontend)
[![npm](https://img.shields.io/npm/dt/@edx/studio-frontend.svg)](https://www.npmjs.com/package/@edx/studio-frontend)

React front end for edX Studio

## Development

Requirements:
* [Docker 17.06 CE+](https://docs.docker.com/engine/installation/), which should come with [docker-compose](https://docs.docker.com/compose/install/) built in.
* A working, running [edX devstack](https://github.com/edx/devstack)

To install and run locally:
```
$ git clone git@github.com:edx/studio-frontend.git
$ cd studio-frontend
$ make up
```
You can append ```-detached``` to the ```make up``` command to run Docker in the background.

To install a new node package in the repo (assumes container is running):
```
$ make shell
$ npm install <package> --save-dev
$ exit
$ git add package.json
```
To make changes to the Docker image locally, modify the Dockerfile as needed and run:
```
$ docker build -t edxops/studio-frontend:latest .
```

Webpack will serve pages in development mode at http://localhost:18011.

The following pages are served in the development:

| Page                 | URL                                              |
|----------------------|--------------------------------------------------|
| Assets               | http://localhost:18011/assets.html               |
| Accessibility Policy | http://localhost:18011/accessibilityPolicy.html  |
| Edit Image Modal     | http://localhost:18011/editImageModal.html       |

Notes:

The development server will run regardless of whether devstack is running along side it. If devstack is not running, requests to the studio API will fail. You can start up the devstack at any time by following the instructions in the devstack repository, and the development server will then be able to communicate with the studio container. API requests will return the following statuses, given your current setup:

| Studio Running? | Logged in?             | API return |
|-----------------|------------------------|------------|
| No              | n/a                    | 504        |
| Yes             | No                     | 404        |
| Yes             | Yes, non-staff account | 403        |
| Yes             | Yes, staff account     | 200        |

## Development Inside Devstack Studio

To load studio-frontend components from the webpack-dev-server inside your
studio instance running in [Devstack](https://github.com/edx/devstack):

1. In your devstack edx-platform folder, create `cms/envs/private.py` if it
   does not exist already.
2. Add `STUDIO_FRONTEND_CONTAINER_URL = 'http://localhost:18011'` to
   `cms/envs/private.py`.
3. Reload your Studio server: `make studio-restart`.

Pages in Studio that have studio-frontend components should now request assets
from your studio-frontend docker container's webpack-dev-server. If you make a
change to a file that webpack is watching, the Studio page should hot-reload or
auto-reload to reflect the changes.

## Testing the Production Build Inside Devstack Studio

The Webpack development build of studio-frontend is optimized for speeding up
developement, but sometimes it is necessary to make sure that the production
build works just like the development build. This is especially important when
making changes to the Webpack configs.

Sandboxes use the production webpack build (see section below), but they also
take a long time to provision. You can more quickly test the production build in
your local docker devstack by following these steps:

1. If you have a `cms/envs/private.py` file in your devstack edx-platform
   folder, then make sure the line `STUDIO_FRONTEND_CONTAINER_URL =
   'http://localhost:18011'` is commented out.
2. Reload your Studio server: `make studio-restart`.
3. Run the production build of studio-frontend by running `make shell` and then
   `npm run build` inside the docker container.
4. Copy the production files over to your devstack Studio's static assets
   folder by running this make command on your host machine in the
   studio-frontend folder: `make copy-dist`.
5. Run Studio's static asset pipeline: `make studio-static`.

Your devstack Studio should now be using the production studio-frontend files
built by your local checkout.

## Testing a Branch on a Sandbox

It is a good practice to test out any major changes to studio-frontend in a
sandbox since it is much closer to a production environment than devstack. Once
you have a branch of studio-frontend up for review:

1. Create a new branch in edx-platform off master.
2. Edit the `package.json` in that branch so that it will install
   studio-frontend from your branch in review:

    ```json
    "@edx/studio-frontend": "edx/studio-frontend#your-branch-name",
    ```

3. Commit the change and push your edx-platform branch.
4. Follow [this document on provisioning a
   sandbox](https://openedx.atlassian.net/wiki/spaces/EdxOps/pages/13960183/Sandboxes)
   using your edx-platform branch.

The sandbox should automatically pull the studio-frontend branch, run the
production webpack build, and then install the dist files into its static assets
during provisioning.

## Releases

Currently, the process for releasing a new version of our package is as follows:

1. Make your changes in a pull request. Bump the version in package.json according to [semver](https://semver.org/) as part of the pull request.
2. Merge your pull request.
3. Publish a [GitHub release](https://github.com/edx/studio-frontend/releases). Make sure to prefix the version number with `v`, as in `v2.3.4`.
3. `git checkout master` and `git pull`. Ensure your current directory is cleaned, with no outstanding commits or files. As an extra precaution, you can `rm -rf node_modules`, `rm -rf dist/*` and `npm install` prior to publishing.
4. Make sure that build production files in /dist will be included in the release by running `npm run build`.
5. Be a member of the correct edX and npm orgs, and be logged in. All of @edx/educator-dahlia should be set up, and others shouldn't need to be publishing this package.
6. Run `npm publish`.


## Updating Latest Docker Image in Docker Hub

If you are making changes to the Dockerfile or docker-compose.yml you may want to include them in the default docker container.

1. Run `make from-scratch`
2. Run `docker tag edxops/studio-frontend:latest edxops/studio-frontend:latest`
3. Run `docker push edxops/studio-frontend:latest`
4. Check that "Last Updated" was updated here: https://hub.docker.com/r/edxops/studio-frontend/tags/


## Getting Help

If you need assistance with this repository please see our documentation for [Getting Help](https://github.com/edx/edx-platform#getting-help) for more information.


## Issue Tracker

We use JIRA for our issue tracker, not GitHub Issues. Please see our documentation for [tracking issues](https://github.com/edx/edx-platform#issue-tracker) for more information on how to track issues that we will be able to respond to and track accurately. Thanks!

## How to Contribute

Contributions are very welcome, but for legal reasons, you must submit a signed [individual contributor's agreement](http://code.edx.org/individual-contributor-agreement.pdf) before we can accept your contribution. See our [CONTRIBUTING](https://github.com/edx/edx-platform/blob/master/CONTRIBUTING.rst) file for more information -- it also contains guidelines for how to maintain high code quality, which will make your contribution more likely to be accepted.


## Reporting Security Issues

Please do not report security issues in public. Please email security@edx.org.
