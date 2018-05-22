#!/bin/bash

# This script exists so that all validation checks can be run in parallel with a single compound exit status

EXIT_STATUS=0
npm run lint || EXIT_STATUS=$?
make i18n.pre_validate || EXIT_STATUS=$?
commitlint-travis || EXIT_STATUS=$?
exit $EXIT_STATUS
