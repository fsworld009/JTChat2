var express = require('express');
var app = express();
var path = require('path');

var basePath = path.resolve(__dirname);

var Promise = require('bluebird');
var fs = require('fs');
var bodyParser = require("body-parser");
Promise.promisifyAll(fs);


var environment = process.env.NODE_ENV;

app.use(bodyParser.json());

app.get("/config/*", function(req, res, next){
    req.url = "/config/";
    next();
});

app.get("/profiles/", function(req, res, next){
    var responseJson = {error: true};
    fs.readFileAsync(basePath + "/profiles/config.json","utf-8").then(function(data){
        responseJson = data;
        return Promise.resolve();
    },function(err){
        return fs.readFileAsync(basePath + "/profiles/default.json","utf-8");
    }).then(function(data){
        if(data){
            responseJson = data;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(responseJson);
    });
});

app.put("/profiles/", function(req, res){
    fs.writeFileAsync(basePath + "/profiles/config.json", JSON.stringify(req.body, null, 2), "utf-8").then(function(error){
        res.send({success: true});
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
