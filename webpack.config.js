var webpack = require('webpack');

module.exports = {
    entry: [
        './contactList.js'
    ],
    output: {
        path: __dirname,
        filename: './contactListCompiled.jsx'
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015', 'stage-0']
            },
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/
        }]
    },
    devtool: 'cheap-module-eval-source-map'
};
