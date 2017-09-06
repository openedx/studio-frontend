# studio-frontend
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

Notes:

The development server will run regardless of whether devstack is running along side it. If devstack is not running, requests to the studio API will fail. You can start up the devstack at any time by following the instructions in the devstack repository, and the development server will then be able to communicate with the studio container. API requests will return the following statuses, given your current setup:

| Studio Running? | Logged in?             | API return |
|-----------------|------------------------|------------|
| No              | n/a                    | 504        |
| Yes             | No                     | 404        |
| Yes             | Yes, non-staff account | 403        |
| Yes             | Yes, staff account     | 200        |

## Releases

We are exploring automated release management for this package, but for now you have to do it by hand. Currently, the process for releasing to npm is as follows:

1. Within your PR, update the version in package.json. Follow [semver](http://semver.org/).
2. Once your PR has been approved and merged, check out master locally and pull the latest.
3. Make sure you have no untracked/junk files within your local directory, and ensure you have npm publish access as a member of the `@edx` organization. If you're not sure, ask for help!
4. Within your `studio-frontend` directory, run `npm publish --access public`. The `prepublish` script will kick in and build production files before bundling up the package and sending it up to npm.
5. [Create a new tagged release](https://github.com/edx/studio-frontend/releases/new) on Github.
    - For "Tag version", use the exact version you used in step 1 (e.g. 1.2.3). Don't prepend it with a "v".
    - Leave target as master.
    - Pick a release title and summary that accurately reflect the changes that have been made since the previous release.
6. Send an email to release-notifications@edx.org. Summarize your change and link to:
    - the github release
    - the npm package
