/*globals require, __dirname*/
const config = require('./webpack.config');
const path = require('path');
const distDir = path.resolve(__dirname, `themes/bistro-crestdoor/theme-customisations/custom`);

config.entry = {
    'cd-bundle': `./src/themes/bistro-crestdoor/js/index.js`
};
// remove shell plugin
config.plugins.splice(1, 1);
config.output.path = distDir;
config.output.filename = 'custom.js';
delete config.resolve;


module.exports = config;
