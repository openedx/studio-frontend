#!/bin/bash


# 4 steps:
# 0. this has to run inside our docker container in order to have access to npm and react-intl-gettext
# 1. pull newly updated po files from Transifex
# 2. parse po files into json
# 3. massage json into the most useful format for us (remove empty entries, format as a plain dict)
# only the final results of step 3 will persist and be committed.

docker network create devstack_default
make up-detached && sleep 60  # Yeah, yeah...

tx pull -af --mode reviewed

rm -rf src/data/i18n/locales/**/*.json
for lang in src/data/i18n/locales/po/*.po;
do
    lang_code=$(basename $lang .po);
    docker exec dahlia.studio-frontend bash -c "/studio-frontend/node_modules/.bin/react-intl-gettext po2json --lang-matcher-pattern '(.*)\.po$' --pattern \"$lang_code.po\" --pretty src/data/i18n/locales/po/ src/data/i18n/locales/tmp/$lang_code.json";
    docker exec dahlia.studio-frontend bash -c "npm run-script i18n_cleanJson -- $lang_code";
done

# clean up
make down
rm -rf src/data/i18n/locales/tmp/*.json
