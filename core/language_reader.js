var Promise = require('bluebird');
var fs = require("fs");
var path = require('path');
var _ = require('lodash');
var lowdb = require('lowdb');

var languageBasePath = path.resolve(__dirname, "../language");
var themeBasePath = path.resolve(__dirname, "../themes");
Promise.promisifyAll(fs);



var database;

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
        
        _.each(languageFiles, function(filename){
            //console.log(filename);
            langJsonFileList.push( path.resolve(languageBasePath, filename ));
        });
        //console.log(langJsonFileList);

        return Promise.all (_.map(langJsonFileList, function(jsonPath){
                return fs.readFileAsync(jsonPath,"utf-8").then(function(jsonString){
                    //console.log(jsonString);
                    json = parseJson(jsonString);
                    database.get("languages").push(json).value();
                });
            })
        ).then(function(){
             database.set("languageByCode", database.get("languages").keyBy("langCode").value()).value();
        });

    });

}

function refresh(){
    database = lowdb();
    readLanguageFiles().then(function(){
        console.log("after readLanguageFiles()");
        console.log(database.get("languages").keyBy("langCode").value());
        console.log(database.get("languageByCode").value());
    });
}

refresh();
