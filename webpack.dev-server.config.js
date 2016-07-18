var path = require('path');
var webpack = require('webpack');
var config = {
    entry: {
        config: ["webpack-hot-middleware/client",/*'webpack/hot/dev-server'*/, path.resolve(__dirname, 'web/config/index.jsx')]
    },
    output: {
        //path and public Path is meaningless when used by expressjs
        path: path.resolve(__dirname, 'web/bundle/'),
        publicPath: "/bundle/",
        filename: "[name].bundle.js",
        chunkFilename: "[id].chunk.js"
    },
    module: {
        loaders: [
            {
              test: /\.jsx$/,
              loader: 'react-hot-loader',
              exclude: /(semantic.js)|(node_modules)/,
            },
            {
              test: /\.js$/,
              loader: 'webpack-module-hot-accept',
              exclude: /(semantic.js)|(node_modules)/,
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /(semantic.js)|(node_modules)/,
                query: {
                  presets: ['babel-preset-es2015','babel-preset-react']
                }
            },
            { test: /\.json$/, loader: "json-loader" },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192' }, // inline base64 URLs for <=8k images, direct URLs for the rest
            { test: /\.woff(2)?(\?v=[0-9\.]+)?$/,   loader: "url-loader?prefix=font/&limit=5000" },
            { test: /\.(eot|ttf|svg)(\?v=[0-9\.]+)?$/,    loader: "url-loader?prefix=font/&limit=5000" },
            { test: require.resolve("react"), loader: "expose?React" },
            { test: require.resolve("react-dom"), loader: "expose?ReactDOM" },
            { test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" },
            { test: require.resolve("lodash"), loader: "expose?_" },
            { test: path.resolve(__dirname, 'web/config/store.js'), loaders: ["expose?store","babel-loader?presets[]=react,presets[]=es2015" ]}
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
  ],
  devServer: {
      contentBase: './web/',
      port: 3000,
      historyApiFallback: {
            index: '/',
            rewrites: [
              { from: /^\/config\/*/, to: '/config/'}
          ]
      }
  }

};
module.exports=config;
