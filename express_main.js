var express = require('express');
var app = express();
var path = require('path');

var basePath = path.resolve(__dirname);

var Promise = require('bluebird');
var fs = require('fs');
var bodyParser = require("body-parser");
Promise.promisifyAll(fs);

var theme_reader = require(path.resolve(basePath, "./core/theme_reader.js"));
var core_reader = require(path.resolve(basePath, "./core/core_reader.js"));

var environment = process.env.NODE_ENV;

app.use(bodyParser.json());
//app.set('views', './views')
app.set('view engine', 'ejs');

app.get("/config/*", function(req, res, next){
    req.url = "/config/";
    next();
});

app.get("/config/", function(req, res, next){
    res.render("config",{env: environment});
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

//old
app.get("/themes/", function(req, res, next){
    theme_reader.refresh().then(function(){
        res.setHeader('Content-Type', 'application/json');
        res.send(theme_reader.get());
    });
});

app.get("/themes/:langCode", function(req, res, next){
    core_reader.getThemes(req.params.langCode).then(function(themes){
        res.setHeader('Content-Type', 'application/json');
        res.send(themes);
    });
});

app.get("/languages/", function(req, res, next){
    res.setHeader('Content-Type', 'application/json');
    res.send(core_reader.getLanguages());
});

app.put("/profiles/", function(req, res){
    fs.writeFileAsync(basePath + "/profiles/config.json", JSON.stringify(req.body, null, 2), "utf-8").then(function(error){
        res.send({success: true});
    });
});
app.use('/js/', express.static(path.resolve(__dirname + '/web/js/')));
app.use('/css/', express.static(path.resolve(__dirname + '/web/css/')));
app.use('/fonts/', express.static(path.resolve(__dirname + '/web/fonts/')));

if(environment === "production"){
    //production
    app.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });
}else{
    //use express.static in production
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


    var reload = require('reload');
    var http = require('http');

    var server = http.createServer(app);
    reload(server, app);
    server.listen(3000, function(){
        console.log('JTChat 2 (Dev) listening on port 3000');
    });
}

