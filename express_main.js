var express = require('express');
var app = express();
var path = require('path');

var basePath = path.resolve(__dirname);

var Promise = require('bluebird');
var fs = require('fs');
Promise.promisifyAll(fs);


var environment = process.env.NODE_ENV;

app.get("/config/*", function(req, res, next){
    req.url = "/config/";
    next();
});

app.get("/profiles/", function(req, res, next){
    fs.readFileAsync(basePath + "/profiles/config.json","utf-8").then(function(data){
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    }).error(function(err){
        res.json({error: true});
    });
});


app.use('/', express.static(path.resolve(__dirname + '/web')));

var webpack = require('webpack');
//var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev-server.config.js');
var compiler = webpack(config);

var webpackDevMiddleware = require("webpack-dev-middleware");
app.use("/bundle/",webpackDevMiddleware(compiler, {
    // options
}));
app.use(require("webpack-hot-middleware")(compiler));

// new WebpackDevServer(webpack(config), {
//    hot: true,
//    historyApiFallback: true,
//    proxy: {
//      "*": "http://localhost:3000"
//    }
// }).listen(3001, 'localhost', function (err, result) {
//    if (err) {
//      console.log(err);
//    }
//
//    console.log('webpack-dev-server Listening on port 3001');
// });





app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
