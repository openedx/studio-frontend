# studio-frontend
React front end for edX Studio

## Development

Requirements:
* https://github.com/edx/devstack (including the docker and docker-compose prereqs)
* node 6+ (https://github.com/tj/n is recommended for setting up a local nodeenv)

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
