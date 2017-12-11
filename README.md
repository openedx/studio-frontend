# studio-frontend
[![codecov](https://codecov.io/gh/edx/studio-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/edx/studio-frontend)

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

Notes:

The development server will run regardless of whether devstack is running along side it. If devstack is not running, requests to the studio API will fail. You can start up the devstack at any time by following the instructions in the devstack repository, and the development server will then be able to communicate with the studio container. API requests will return the following statuses, given your current setup:

| Studio Running? | Logged in?             | API return |
|-----------------|------------------------|------------|
| No              | n/a                    | 504        |
| Yes             | No                     | 404        |
| Yes             | Yes, non-staff account | 403        |
| Yes             | Yes, staff account     | 200        |

## Releases

Currently, the process for releasing a new version of our package is as follows:

1. Make your changes in a pull request. Bump the version in package.json according to [semver](https://semver.org/) as part of the pull request.
2. Merge your pull request.
3. Publish a [GitHub release](https://github.com/edx/studio-frontend/releases). Make sure to prefix the version number with `v`, as in `v2.3.4`.
3. `git checkout master` and `git pull`. Ensure your current directory is cleaned, with no outstanding commits or files. As an extra precaution, you can `rm -rf node node_modules` and `npm install` prior to publishing.
4. Be a member of the correct edX and npm orgs, and be logged in. All of @edx/educator-dahlia should be set up, and others shouldn't need to be publishing this package.
5. Run `npm publish`.
