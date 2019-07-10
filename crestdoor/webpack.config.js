/*globals require, __dirname*/
const path = require('path');
const appDir = path.resolve(__dirname, '');
const theme = (() => {
    const args = process.argv;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg.indexOf('--theme=') === 0) {
            return arg.split('=')[1];
        }
    }
})();
const distDir = path.resolve(__dirname, `themes/${theme}-child-1/`);
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const WebpackShellPlugin = require('webpack-shell-plugin');


module.exports = {
    context: appDir,
    entry: {
        'cd-bundle': `./src/themes/${theme}-child-1/js/index.js`
    },
    watchOptions: {
        ignored: ['node_modules'],
        poll: true
    },
    output: {
        path: distDir,
        filename: 'js/cd-bundle.js',
        jsonpFunction: 'CrestDoorAmd',
        devtoolModuleFilenameTemplate: 'crestdoor://[resource-path]',
        devtoolFallbackModuleFilenameTemplate: 'crestdoor://[resource-path]?[hash]'
    },
    plugins: [
        // =======================================================================
        // create css file and extract its content to different file
        // =======================================================================
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'style.css'
        }),
        // =======================================================================
        // scripts to run before and after webpack process
        // =======================================================================
        new WebpackShellPlugin({
            onBuildStart: [],
            onBuildEnd: [
                `node ./config/sassBuild.js --theme=${theme}`
            ]
        })
    ],
    resolve: {
        modules: [
            path.resolve(__dirname, `src/themes/${theme}-child-1/js`),
            'node_modules'
        ],
        alias: {
            base: path.resolve(__dirname, `src/themes/${theme}-child-1/`)
        }
    },
    externals: {
        jquery: 'jQuery'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => {
                                return [
                                    autoprefixer({
                                        overrideBrowserslist: '> 1%, last 2 versions, iOS >= 8, Firefox ESR, Safari >= 9, Explorer >= 11'
                                    })
                                ]
                            }
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ],
                            plugins: [
                            ]
                        }
                    }
                ]
            }
        ]
    }
};