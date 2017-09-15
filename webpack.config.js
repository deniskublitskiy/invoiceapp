const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
    entry: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:3333',
        'webpack/hot/only-dev-server',
        './src/index.js'
    ],

    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'index.js'
    },

    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015', 'react', 'stage-0'],
                            plugins: [
                                'react-hot-loader/babel',
                                'transform-decorators-legacy'
                            ]
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.sass$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: [
                                autoprefixer('last 2 versions')
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ],

    devServer: {
        contentBase: "public",
        port: 3333,
        hot: true,
        historyApiFallback: true,
        //compress: true
    }
};