var path = require('path');
var webpack = require('webpack');

var config = {
    entry: ['webpack/hot/dev-server', path.resolve(__dirname, 'web/index.jsx')],
    output: {
        path: path.resolve(__dirname, 'web/build/'),
        publicPath: "/web/build/",
        filename: 'bundle.js'
    },
    module: {
        loaders: [
              {
                test: /\.jsx$/,
                loader: 'babel-loader',
                // exclude: /node_modules/,
                query: {
                  presets: ['babel-preset-react']
                }
            },
            { test: /\.json$/, loader: "json-loader" },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192' }, // inline base64 URLs for <=8k images, direct URLs for the rest
            { test: /\.woff(2)?$/,   loader: "url-loader?prefix=font/&limit=5000" },
            { test: /\.(eot|ttf|svg)$/,    loader: "file-loader?prefix=font/" }
        ]
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ]
};
module.exports=config;
