// Utility method for replacing a portion of a string.
// An ES6 copy of the same function in edx-platform:
// https://github.com/edx/edx-platform/blob/d14ec65912ef3fb5bb3284b81ccdf60d59b34c87/common/static/js/src/utility.js#L21-L39
export default (content, from, to) => {
  if (from === null || to === null) {
    return content;
  }
  // replace only relative urls
  const replacer = (match) => {
    if (match === from) {
      return to;
    }
    return match;
  };
  // change all relative urls only which may be embedded inside other tags in content.
  // handle http and https
  // escape all regex interpretable chars
  const fromRe = from.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  // eslint-disable-next-line no-useless-escape
  const regex = new RegExp(`(https?://(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&//=]*))?${fromRe}`, 'g');
  return content.replace(regex, replacer);
};
