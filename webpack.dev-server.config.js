var path = require('path');
var webpack = require('webpack');

var config = {
    entry: {
        config: ['webpack/hot/dev-server', path.resolve(__dirname, 'web/config/index.jsx')]
    },
    output: {
        path: path.resolve(__dirname, 'web/bundle/'),
        publicPath: "/bundle/",
        filename: "[name].bundle.js",
        chunkFilename: "[id].chunk.js"
    },
    module: {
        loaders: [
              {
                test: /\.jsx$/,
                loader: 'babel-loader',
                // exclude: /node_modules/,
                query: {
                  presets: ['babel-preset-es2015','babel-preset-react']
                }
            },
            { test: /\.json$/, loader: "json-loader" },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192' }, // inline base64 URLs for <=8k images, direct URLs for the rest
            { test: /\.woff(2)?$/,   loader: "url-loader?prefix=font/&limit=5000" },
            { test: /\.(eot|ttf|svg)$/,    loader: "file-loader?prefix=font/" },
            { test: require.resolve("react"), loader: "expose?React" },
            { test: require.resolve("react-dom"), loader: "expose?ReactDOM" },
            { test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" }
        ]
    },
    plugins: [
      new webpack.NoErrorsPlugin()
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
