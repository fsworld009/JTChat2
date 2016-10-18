import express = require('express');
import path = require('path');
import json_reader = require("./json_reader.js");
import Promise = require('bluebird');
import {fs} from './bluebird_promisifyAll.js';
import bodyParser = require("body-parser");


let webServer: express.Application = express();
let basePath = path.resolve(__dirname);
let environment:string = process.env.NODE_ENV;
// let router: express.Router = express.Router();

webServer.use(bodyParser.json());
//app.set('views', './views')
webServer.set('view engine', 'ejs');

webServer.get("/config/*", function(req, res, next){
    req.url = "/config/";
    next();
});

webServer.get("/config/", function(req, res, next){
    res.render("config",{env: environment});
});

webServer.get("/profiles/", function(req, res, next){
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

webServer.get("/siteDefs/", function(req, res, next){
    var responseJson = {error: true};
    fs.readFileAsync(basePath + "/core/siteDefs.json","utf-8").then(function(data){
        responseJson = data;
        return Promise.resolve();
    },function(err){
        return Promise.resolve();
    }).then(function(){
        res.setHeader('Content-Type', 'application/json');
        res.send(responseJson);
    });
});

webServer.get("/themesLanguage/:langCode", function(req, res, next){
    json_reader.getThemesLanguage(req.params.langCode).then(function(themeLanguage){
        res.setHeader('Content-Type', 'application/json');
        res.send(themeLanguage);
    });
});

webServer.get("/languages/", function(req, res, next){
    json_reader.getLanguages().then(function(languages){
        res.setHeader('Content-Type', 'application/json');
        res.send(languages);
    });
});

webServer.get("/themes/", function(req, res, next){
    json_reader.getThemes().then(function(themes){
        res.setHeader('Content-Type', 'application/json');
        res.send(themes);
    });
});
webServer.get("/refresh/", function(req, res, next){
    json_reader.refresh().then(function(){
        res.setHeader('Content-Type', 'application/json');
        res.send({refreshed: true});
    });
});


webServer.put("/profiles/", function(req, res){
    fs.writeFileAsync(basePath + "/profiles/config.json", JSON.stringify(req.body, null, 2), "utf-8").then(function(error){
        res.send({success: true});
    });
});
webServer.use('/js/', express.static(basePath + '/web/js/'));
webServer.use('/css/', express.static(basePath + '/web/css/'));
webServer.use('/fonts/', express.static(basePath + '/web/fonts/'));

if(environment === "production"){
    //production
    webServer.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });
}else{
    //use express.static in production
    let webpack:any = require('webpack');
    //var WebpackDevServer = require('webpack-dev-server');
    let config:any = require('../webpack.dev-server.config.js');
    let compiler:any = webpack(config);

    let webpackDevMiddleware = require("webpack-dev-middleware");
    webServer.use("/bundle/",webpackDevMiddleware(compiler, {
        // options
    }));
    webServer.use(require("webpack-hot-middleware")(compiler));

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


    let reload:any = require('reload');
    let http:any = require('http');
    let server = http.createServer(webServer);
    reload(server, webServer);
    server.listen(3000, function(){
        console.log('JTChat 2 (Dev) listening on port 3000');
    });
}

