'use strict';

const path = require('path');

module.exports = {
    entry: './js/index.js',
    mode: 'production',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.common.js'
        }
    }
};
