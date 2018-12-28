'use strict';

const path = require('path');
const VueLoaderPlugin = require("vue-loader").VueLoaderPlugin;

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
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass")
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};
