#!/usr/bin/env node
/*
MIT License

Copyright (c) 2018 Eric Fischer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const glob = require('glob');
const path = require('path');

/*
 * See the Makefile for how the required hash file is downloaded from Transifex.
 */

/*
 * Expected input: a directory, possibly containing subdirectories, with .json files.  Each .json
 * file is an array of translation triplets (id, description, defaultMessage).
 *
 *
 */
function gatherJson(dir) {
  const ret = [];
  const files = glob.sync(`${dir}/**/*.json`);

  files.forEach((filename) => {
    const messages = JSON.parse(fs.readFileSync(filename));
    ret.push(...messages);
  });
  return ret;
}

// the hash file returns ids whose periods are 'escaped' (sort of), like this:
// 'key': 'profile\\.sociallinks\\.social\\.links'
// so our regular messageIds won't match them out of the box
function escapeDots(messageId) {
  return messageId.replace(/\./g, '\\.');
}

const jsonDir = process.argv[2];
const messageObjects = gatherJson(jsonDir);

if (messageObjects.length === 0) {
  process.exitCode = 1;
  throw new Error('Found no messages');
}

if (process.argv[3] === '--comments') { // prepare to handle the translator notes
  const loggingPrefix = path.basename(`${__filename}`); // the name of this JS file
  const bashScriptsPath = (
    process.argv[4] && process.argv[4] === '--v3-scripts-path'
      ? './node_modules/@edx/reactifex/bash_scripts'
      : './node_modules/reactifex/bash_scripts');

  const hashFile = `${bashScriptsPath}/hashmap.json`;
  process.stdout.write(`${loggingPrefix}: reading hash file ${hashFile}\n`);
  const messageInfo = JSON.parse(fs.readFileSync(hashFile));

  const outputFile = `${bashScriptsPath}/hashed_data.txt`;
  process.stdout.write(`${loggingPrefix}: writing to output file ${outputFile}\n`);
  fs.writeFileSync(outputFile, '');

  messageObjects.forEach((message) => {
    const transifexFormatId = escapeDots(message.id);

    const info = messageInfo.find((mi) => mi.key === transifexFormatId);
    if (info) {
      fs.appendFileSync(outputFile, `${info.string_hash}|${message.description}\n`);
    } else {
      process.stdout.write(`${loggingPrefix}: string ${message.id} does not yet exist on transifex!\n`);
    }
  });
} else {
  const output = {};

  messageObjects.forEach((message) => {
    output[message.id] = message.defaultMessage;
  });
  fs.writeFileSync(process.argv[3], JSON.stringify(output, null, 2));
}
