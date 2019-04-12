var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: {
        "au/content/scripts/more-info-large": "./src/au/more-info-large.ts",
        "au/content/scripts/more-info-large-slices": "./src/au/more-info-large-slices.ts",
        "au/content/scripts/more-info-small": "./src/au/more-info-small.ts",
        "au/content/scripts/more-info-small-slices": "./src/au/more-info-small-slices.ts",
        "au/content/scripts/more-info-mini": "./src/au/more-info-mini.ts",
        // "au/content/scripts/more-info-general": "./src/au/more-info-general.ts",
        "au/content/scripts/price-info": "./src/au/price-info.ts",
        "au/content/scripts/landing-page": "./src/au/landing-page.ts",
        "au/content/scripts/top-banner": "./src/au/more-info-small-slices.ts"
    },

    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css?url=false" },
            { test: /\.ts?$/, loader: 'ts-loader', sourceMap: false }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from : './src/au/html/',
                to : './au/content/html'
            },
            {
                from : './src/au/images/',
                to : './au/content/images'
            },
            {
                from : './src/au/js/',
                to : './au/content/js'
            },
            {
                from : './src/au/styles/',
                to : './au/content/styles'
            }
        ]),
        new webpack.SourceMapDevToolPlugin({
            test: /\.js$/,
            filename: "[name].map.js"
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
            mangle: false,
            sourceMap: true
        }),
    ]
}
