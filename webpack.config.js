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
        "au/content/scripts/landing-page-little-online": "./src/au/landing-page-little-online.ts",
        "au/content/scripts/landing-page-little-instore": "./src/au/landing-page-little-instore.ts",
        "au/content/scripts/landing-page-big-online": "./src/au/landing-page-big-online.ts",
        "au/content/scripts/landing-page-big-instore": "./src/au/landing-page-big-instore.ts",
        "au/content/scripts/landing-page-little-big-online": "./src/au/landing-page-little-big-online.ts",
        "au/content/scripts/top-banner": "./src/au/more-info-small-slices.ts",

        // "nz/content/scripts/more-info-large": "./src/nz/more-info-large.ts",
        // "nz/content/scripts/more-info-large-slices": "./src/nz/more-info-large-slices.ts",
        // "nz/content/scripts/more-info-small": "./src/nz/more-info-small.ts",
        // "nz/content/scripts/more-info-small-slices": "./src/nz/more-info-small-slices.ts",
        // "nz/content/scripts/more-info-mini": "./src/nz/more-info-mini.ts",
        "nz/content/scripts/price-info": "./src/nz/price-info.ts",
        // "nz/content/scripts/landing-page": "./src/nz/landing-page.ts",
        // "nz/content/scripts/top-banner": "./src/nz/more-info-small-slices.ts"
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
            },
            {
                from : './src/nz/html/',
                to : './nz/content/html'
            },
            {
                from : './src/nz/images/',
                to : './nz/content/images'
            },
            {
                from : './src/nz/js/',
                to : './nz/content/js'
            },
            {
                from : './src/nz/styles/',
                to : './nz/content/styles'
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
};
