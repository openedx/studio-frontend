// For every :matches() rule, adds equivalent :-moz-any() and :-webkit-any() rules.
// From: https://gist.github.com/dennisgaebel/4290fd6e5dbba5e9b35e2587dcc20849
// This needs to use JS compatible with Node.js because it is imported directly by webpack without transpiling.
// TODO: This should probably be its own NPM package.
const postcss = require('postcss');

module.exports = postcss.plugin('postcss-matches', () => {
  return root => {
    root.walkRules(rule => {
      if (rule.selector.indexOf(':matches(') !== -1) {
        mozRule = rule.clone();
        webkitRule = rule.clone();
        mozRule.selectors = rule.selectors.reduce((all, i) => {
          if (i.indexOf(':matches(') !== -1) {
            return all.concat([
              i.replace(/:matches\(/gi, ':-moz-any(')
            ])
          } else {
            return all.concat([i])
          }
        }, []);
        webkitRule.selectors = rule.selectors.reduce((all, i) => {
          if (i.indexOf(':matches(') !== -1) {
            return all.concat([
              i.replace(/:matches\(/gi, ':-webkit-any('),
            ])
          } else {
            return all.concat([i])
          }
        }, []);
        root.append(mozRule);
        root.append(webkitRule);
      }
    })
  }
});
