
const hl = require('../../node_modules/highlight.js/lib/index');
hl.registerLanguage('json', require('../../node_modules/highlight.js/lib/languages/json'));
hl.registerLanguage('json', require('../../node_modules/highlight.js/lib/languages/haml'));

const jsonHL = (json) => {
  return hl.highlight( JSON.stringify(json, undefined, 2),{language: "json", ignoreIllegals: true });
}

module.exports = jsonHL;
