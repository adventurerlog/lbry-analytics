/**
 * Dependency and file imports
 */
const { Lbry } = require("lbry-redux");
const onSdkStart = require('./onSdkStart');
const bootstrapVueApp = require('./vue-app');

const Vue = require('../../node_modules/vue/dist/vue');

// Wait until the sdk is fully started before doing anything else
onSdkStart(Lbry, () => {
  bootstrapVueApp(Vue);
});

