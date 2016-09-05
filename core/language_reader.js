var Promise = require('bluebird');
var fs = require("fs");
var path = require('path');
var _ = require('lodash');
var lowdb = require('lowdb');

var languageBasePath = path.resolve(__dirname, "../language");
var themeBasePath = path.resolve(__dirname, "../themes");
Promise.promisifyAll(fs);



var database;
var defaultLangFileNameRegExp = new RegExp("^en");

function parseJson(jsonString, defaultObject){
    //inject comment handle in the future
    defaultObject = defaultObject || {};
    var json = defaultObject;
    if(typeof jsonString == "string"){
        try{
            json = JSON.parse(jsonString);
        } catch ( e){
            console.error("JSON parse failed:");
            console.error(e);
            console.error("input is: \n", jsonString);
            console.error("use default Object: ", defaultObject);
            json = defaultObject;
        }
    }
    return json;
}

function readLanguage(langCode){

}

function readLanguageFiles(){
    database.set("languages", []).value();
    return fs.readdirAsync(languageBasePath).then(function(languageFiles){
        var langJsonFileList = [];
        var enLangJsonFile;
        
        _.each(languageFiles, function(filename){
            //console.log(filename);
            var readPath = path.resolve(languageBasePath, filename );
            if(filename.search(defaultLangFileNameRegExp) > -1){
                enLangJsonFile = readPath;
            }else{
                langJsonFileList.push( readPath);
            }
        });
        //console.log(langJsonFileList);
        //read English first
        return fs.readFileAsync(enLangJsonFile, "utf-8").then(function(jsonString){
            var enLangJson = parseJson(jsonString);
            database.get("languages").push(enLangJson).value();

            //then read other languages
            return Promise.all (_.map(langJsonFileList, function(jsonPath){
                return fs.readFileAsync(jsonPath,"utf-8").then(function(jsonString){
                    //console.log(jsonString);
                    json = parseJson(jsonString);
                    var thisLangJson = _.merge({}, enLangJson, json);
                    database.get("languages").push(thisLangJson).value();
                });
            }));
        }).then(function(){
             database.set("languageByCode", database.get("languages").keyBy("langCode").value()).value();
             return Promise.resolve();
        });

    });

}

function refresh(){
    database = lowdb();
    readLanguageFiles().then(function(){
        console.log("after readLanguageFiles()");
        console.log(database.get("languages").value());
        console.log(database.get("languageByCode").value());
    });
}

refresh();
