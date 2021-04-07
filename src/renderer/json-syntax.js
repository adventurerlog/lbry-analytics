
const hl = require('../../node_modules/highlight.js/lib/highlight');
hl.registerLanguage('json', require('../../node_modules/highlight.js/lib/languages/json'));
hl.registerLanguage('json', require('../../node_modules/highlight.js/lib/languages/haml'));

const jsonHL = (json) => {
  return hl.highlight('json', JSON.stringify(json, undefined, 2));
}

module.exports = jsonHL;
