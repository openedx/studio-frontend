#!/bin/bash

# 3 steps:
# 1. pull newly updated po files from Transifex
# 2. parse po files into json
# 3. massage json into the most useful format for us (remove empty entries, format as a plain dict)
# only the final results of step 3 will persist and be committed.

tx pull -af --mode reviewed
rm -rf src/data/i18n/locales/**/*.json
for lang in src/data/i18n/locales/po/*.po;
do
    lang_code=$(basename $lang .po);
    $(npm bin)/react-intl-gettext po2json --lang-matcher-pattern "(.*)\.po$" --pattern "$lang_code\.po" --pretty src/data/i18n/locales/po/ src/data/i18n/locales/tmp/$lang_code.json;
    npm run-script i18n_cleanJson -- $lang_code;
done
