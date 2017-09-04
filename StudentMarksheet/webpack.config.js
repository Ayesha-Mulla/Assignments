var webpack = require("webpack");
var query = {
    bypassOnDebug: true,
    optipng: {
        optimizationLevel: true
    },
    gifsicle: {
        interlaced: true
    }
};

var config = {
    entry: ['babel-polyfill', './main.js'],

    output: {
        path:'./build/',
        filename: 'index.js'
    },

    devServer: {
        inline: true,
        port: 8033
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',

                query: {
                    presets: ['es2015','react','stage-0','stage-1','stage-2','stage-3']
                }
            },
            { test: /\.css$/,  loader: 'style-loader!css-loader' },
            { test: /\.(woff|woff2|eot|ttf|svg)(\?\S*)?$/, loader: 'url-loader?limit=10000' },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?${JSON.stringify(query)}'
                ]
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },

};

module.exports = config;
