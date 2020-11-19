# studio-frontend
[![codecov](https://codecov.io/gh/edx/studio-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/edx/studio-frontend)
[![Build Status](https://travis-ci.com/edx/studio-frontend.svg?branch=master)](https://travis-ci.com/edx/studio-frontend)
[![npm](https://img.shields.io/npm/v/@edx/studio-frontend.svg)](https://www.npmjs.com/package/@edx/studio-frontend)
[![npm](https://img.shields.io/npm/dt/@edx/studio-frontend.svg)](https://www.npmjs.com/package/@edx/studio-frontend)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

React front end for edX Studio

For an introduction to what this repo is and how it fits into the rest of the
edX platform, read [Studio-frontend: Developing Frontend Separate from edX
Platform](https://engineering.edx.org/studio-frontend-developing-frontend-separate-from-edx-platform-7c91d76c7360).

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

## Testing in studio-frontend

### Where do test files go?
If you are developing a component and you are adding new `js` or `jsx` test files,
the test files would go in the same location as the file. This makes it easier
to track and test. For example, if you are developing a component `AssetsSearch`
in `src/components/` you would name the test file after the component name
`AssetsSearch.test.jsx`. Similarly, if you are adding a file
`parseDateTime.jsx` in the `src/utils/` place the test file at same location with
the name `parseDateTime.test.jsx`.

### How to run tests locally
To run the whole suite of tests, you can run `npm run test` inside the docker container shell.
```
make shell
npm run test
```
If you want to run a particular test file only, you can run `npm run test -t <path>`.
You can also add `".only"` to any `"it"` or `"describe"` block in a particular test
file to only run that particular test. For example, `it.only` to run only that test
or `describe.only` to run only the tests in that describe block.

### How to debug locally running tests
To debug tests running locally, first open the Node debugger:

1) navigate to `chrome://inspect` in your browser
2) choose "Open dedicated DevTools for Node" (it will open in a new window)
3) check that the default network configuration in the "Connection" tab is `127.0.0.1:9229` (i.e. port `9229` on `localhost`)

Next, after adding a `debugger;` statement above the test code you'd like to debug, use these commands inside the `studio-frontend` repo:
```
make shell
node --inspect=0.0.0.0 node_modules/.bin/jest --runInBand
```
The node debugger should grab focus as soon as your first breakpoint is hit. You can specify individual test files by appending `-- path/to/yourTestFile.test.jsx` to the end of the `node` command.

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

This all happens automagically on merges to master, hooray! There are just a few things to keep in mind:

### What is the latest version?

Check [github](https://github.com/edx/studio-frontend/releases), [npm](https://www.npmjs.com/package/@edx/studio-frontend), or the npm badge at [the top of this README](https://github.com/edx/studio-frontend#studio-frontend). `package.json` no longer contains the correct version (on Github), as it creates an odd loop of "something merged to master, run `semantic-release`" -> "`semantic-release` modified `package.json`, better check that in and make a PR" -> "a PR merged to master, run `semantic-release`", etc. This is the [default behavior for `semantic-release`](https://github.com/semantic-release/semantic-release/blob/caribou/docs/support/FAQ.md#why-is-the-packagejsons-version-not-updated-in-my-repository).

### Commit message linting

In order for `semantic-release` to determine which release type (major/minor/patch) to make, commits must be formatted as specified by [these Angular conventions](https://github.com/angular/angular.js/blob/62e2ec18e65f15db4f52bb9f695a92799c58b5f1/DEVELOPERS.md#-git-commit-guidelines). TravisBuddy will let you know if anything is wrong before you merge your PR. It can be difficult at first, but eventually you get used to it and the added value of automatic releases is well worth it, in our opinions.

#### A note on merge messages

Note that when you merge a PR to master (using a merge commit; we've disabled squash-n-merge), there are actually *2* commits that land on the master branch. The first is the one contained in your PR, which has been linted already. The other is the merge commit, which commitlint is smart enough to ignore due to [these regexes](https://github.com/marionebl/commitlint/blob/ddb470c4d45ccf6e2d5a82ce911b96594ccffb59/%40commitlint/is-ignored/src/index.js). The point here is that you should not change the default `Merge pull request <number> from <branch>` message on your merge commit, or else the master build will fail and we won't get a deploy.

## Updating Latest Docker Image in Docker Hub

If you are making changes to the Dockerfile or docker-compose.yml you may want to include them in the default docker container.

1. Run `make from-scratch`
2. Run `docker tag edxops/studio-frontend:latest edxops/studio-frontend:latest`
3. Run `docker push edxops/studio-frontend:latest`
4. Check that "Last Updated" was updated here: https://hub.docker.com/r/edxops/studio-frontend/tags/

## Adding a new app

There's a bunch of boilerplate that needs to be created to set up a new
studio-frontend app that can be independently embedded into a page in Studio.
See the
[openedx-workshop](https://github.com/edx/studio-frontend/compare/openedx-workshop)
branch, which demonstrates setting up a very basic HelloWorld app.

* Create a [new webpack
  entry](https://github.com/edx/studio-frontend/compare/openedx-workshop#diff-56ee2db4e3db0c7354bb996b003e70beR12)
* Add a [new
  HtmlWebpackPlugin](https://github.com/edx/studio-frontend/compare/openedx-workshop#diff-d5d0cff71a84339db815178b7a3c23fcR95)
  to create a new page in the development server to display the component.
* Create a [new app root index
  file](https://github.com/edx/studio-frontend/compare/openedx-workshop#diff-78a72e926d58cefa762dc661a8745f68R1)
  which will initialize the app.
* For any new components that the app will use, create a new folder under
  `src/components/` with an upper camel case name.
    * For each component, create [an
      index.jsx](https://github.com/edx/studio-frontend/compare/openedx-workshop#diff-7fea6fccbbbbf8e8648b63713da96714R1)
      to render the component.
    * A [test
      file](https://github.com/edx/studio-frontend/compare/openedx-workshop#diff-4cd7210c4c2b6f2c3b6b2a0c1b67b2e5R1)
      named with a `.test.jsx` extension that uses Jest and Enzyme to unit test
      the component.
    * If the component contains any display strings, a
      [displayMessages.jsx](https://github.com/edx/studio-frontend/compare/openedx-workshop#diff-e214e9bb31c5529b699ebb2e86be2cbfR1)
      file.
    * If the component needs any styling, a
      [`.scss`](https://github.com/edx/studio-frontend/compare/openedx-workshop#diff-5ce63f6d51132465b6b5d8980cc3dfc8R1)
      file.
* To embed the app inside Studio:
    * Update the [version of
      studio-frontend](https://github.com/edx/edx-platform/blob/master/package.json)
      in edx-platform.
    * Include the component's built CSS and JS in a template using the
      [`studiofrontend` Mako template
      tag](https://github.com/edx/edx-platform/compare/openedx-workshop-sfe).

## CSS

CSS in studio-frontend is a bit tricky. Because components are embedded in
existing Studio pages, we have to [isolate the
CSS](https://engineering.edx.org/studio-frontend-developing-frontend-separate-from-edx-platform-7c91d76c7360#fdf0).
This prevents Studio CSS affecting studio-frontend components and from
studio-frontend CSS affecting the surrounding Studio page. However, there are a
few key points to know about this:

1. All studio-frontend styles are scoped to the `.SFE-wrapper` div.
    * In a way, this div acts like the `<body>` element for the embedded
      studio-frontend component.
    * If any elements from studio-frontend are placed outside of this div, then
      they will be unstyled (or only have Studio styles applied to them).
2. Studio-frontend elements are [fully reset using a browser default
   stylesheet](https://github.com/thallada/default-stylesheet/). So, weird
   things will occasionally happen with the styling, because it is not a perfect
   process.
    * Use a browser dev tools style inspector to see what styles are being
      applied. Remove styles from `default.css` if you think they might be
      conflicting with other styling.
    * E.g. for some reason, ordered lists appear as unordered. We still have not
      figured that one out.
3. Selectors that you write in studio-frontend `.scss` files will be prepended
   with a selector to the wrapper div during the Webpack build process
   (`#root.SFE .SFE-wrapper`). This is so that studio-frontend styles affect
   only the contents of the embedded studio-frontend component and so that they
   are [specific](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
   enough that they override any Studio styling.
4. The `edx-bootstrap.scss` file contains only the Bootstrap variables and mixin
   definitions. This file is safe to `@import` into individual component `.scss`
   files. It allows you to, for example, color an element using the primary
   color defined in the current Bootstrap theme with the `$primary` variable.
5. Only import `SFE.scss` in JavaScript at the root of a studio-frontend app.
   This file contains all of the Bootstrap style definitions and the CSS reset.
   There is a lot of CSS in the file, so we only want to import it once per app.
6. We currently have CSS modules enabled in the Webpack
   [css-loader](https://github.com/webpack-contrib/css-loader), but aren't
   really using the features of it. CSS modules allows you to rename classname
   selectors defined in the CSS to be more specific, but we currently have it
   configured to leave the names alone. We found it simpler to just reference
   Bootstrap classes with a plain string (e.g. `"col-1"` vs. `styles['col-1']`).
    * CSS modules helps avoid class name collision between different components
      on the same page. We haven't run into this issue with studio-frontend yet,
      but we might want to consider using it in the future once we do.
7. Make sure the font-awesome CSS is imported in JavaScript in the app root
   index file.

Ideally, studio-frontend should not need these CSS hacks. In the future,
studio-frontend should control the full HTML page instead of being embedded in a
Studio page shell. That way, studio-frontend components would be free from
legacy Studio styles and would not need to apply any resets.

## Getting Help

If you need assistance with this repository please see our documentation for [Getting Help](https://github.com/edx/edx-platform#getting-help) for more information.


## Issue Tracker

We use JIRA for our issue tracker, not GitHub Issues. Please see our documentation for [tracking issues](https://github.com/edx/edx-platform#issue-tracker) for more information on how to track issues that we will be able to respond to and track accurately. Thanks!

## How to Contribute

Contributions are very welcome, but for legal reasons, you must submit a signed [individual contributor's agreement](https://github.com/edx/edx-platform/blob/master/CONTRIBUTING.rst#step-1-sign-a-contribution-agreement) before we can accept your contribution. See our [CONTRIBUTING](https://github.com/edx/edx-platform/blob/master/CONTRIBUTING.rst) file for more information -- it also contains guidelines for how to maintain high code quality, which will make your contribution more likely to be accepted.


## Reporting Security Issues

Please do not report security issues in public. Please email security@edx.org.
