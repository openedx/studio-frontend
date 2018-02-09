// cleanI18nJson.js
// expects a language code as argument

const fs = require('fs');

const lang = process.argv[2];
const inpath = `src/data/i18n/locales/tmp/${lang}.json`;
let indata = '';
const outpath = `src/data/i18n/locales/json/${lang}.json`;
const outdata = {};

indata = JSON.parse(fs.readFileSync(inpath));

Object.keys(indata[lang]).forEach((key) => {
  if (indata[lang][key]) {
    outdata[key] = indata[lang][key];
  }
});

fs.writeFileSync(outpath, JSON.stringify(outdata, null, '\t'));
