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
$ docker-compose -f docker-compose.yml up studio-frontend
```

To install a new node package in the repo (assumes container is running):
```
$ make shell
$ npm install <package> --save-dev
$ exit
$ git add package.json
```
To make changes to the Docker image locally, modify the Dockerfile as needed and run:
```
$ docker build -t mroytman/studio-frontend:latest .
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

1. Make your changes in a PR and get them into master, as usual. Do not bump the version in package.json!
2. After merging your changes, `git checkout master && git pull`. Ensure your current directory is cleaned, with no outstanding commits or files.
3. Be a member of the correct edX and npm orgs, and be logged in. All of @edx/educator-dahlia should be set up, and others shouldn't need to be publishing this package.
4. `make publish`. This will:
  - verify that you're on a clean master branch
  - bump the version in package.json, as a commit on your local master branch
    - note that this will be a patch version bump by default; for other release types modify the `npm version patch` sub-command under the `publish` make target.
  - tag that commit as a Github release tag
  - `git checkout` to a new branch
  - run our publish script to build everything and send it up to npm, and
  - push all git changes up to the remote.
5. Go view your newly created PR, and merge it. Also consider modifying the release tag with more descriptive release notes.
6. If needed, send an email to release-notifications@edx.org. Summarize your change and link to:
    - the github release
    - the npm package
