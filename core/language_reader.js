var Promise = require('bluebird');
var fs = require("fs");
var path = require('path');
var _ = require('lodash');
var lowdb = require('lowdb');

var languageBasePath = path.resolve(__dirname, "../languages");
var themeBasePath = path.resolve(__dirname, "../themes");
Promise.promisifyAll(fs);



var database;
var defaultLangCode = "en";
var defaultLangFileNameRegExp = new RegExp("^"+defaultLangCode);

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

function readThemeFiles(){
    var themeJsonFileList=[];
    return fs.readdirAsync(themeBasePath).then(function(files){
        _.each(files, function(file){
            var filepath = path.resolve(themeBasePath, file);
            var stat = fs.statSync(filepath);
            if(stat.isDirectory()){
                var filenames = fs.readdirSync(filepath);
                if(_.includes(filenames, "jtchat2.json")){
                    //console.log(filepath);
                    themeJsonFileList.push(path.resolve(filepath, "jtchat2.json"));
                }
            }
        });
        return Promise.map(themeJsonFileList, function(jsonPath){
            return fs.readFileAsync(jsonPath,"utf-8").then(function(json){
                json = parseJson(json, {});
                database.get("themes").push(json).value();
            });
        }).then(function(){
            database.set("themeById", database.get("themes").keyBy("id").value()).value();
            return Promise.resolve();
        });
    });

}

function setLanguage(themeId, langCode, json){
    json = json || {};
    var dbThemeWrapper = database.get("themeById."+ themeId);
    if(typeof dbThemeWrapper.get("languages").value() == "undefined"){
        dbThemeWrapper.set("languages",{}).value();
    }

    if(langCode != defaultLangCode){
        json = _.merge({}, dbThemeWrapper.get("languages."+defaultLangCode).value(), json); 
    }
    dbThemeWrapper.set("languages."+langCode, json).value();
}

function readThemeLanguage(langCode){
    var themes = database.get("themes").value();
    var themeLangPromiseList=[];
    _.each(themes, function(theme){
        var themeId = theme.id;
        var jsonPath = path.resolve(themeBasePath, themeId, "languages", langCode + ".json");

        var promise = fs.readFileAsync(jsonPath,"utf-8").then(function(json){
            json = parseJson(json, {});
            setLanguage(themeId, langCode, json);
        }).error(function(e){
            console.log("failed to load ", jsonPath," reason: ", e.message);
            setLanguage(themeId, langCode, {});
        });

        themeLangPromiseList.push(promise);
    });
    return Promise.all(themeLangPromiseList);
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
            return Promise.map (langJsonFileList, function(jsonPath){
                return fs.readFileAsync(jsonPath,"utf-8").then(function(jsonString){
                    //console.log(jsonString);
                    json = parseJson(jsonString);
                    var thisLangJson = _.merge({}, enLangJson, json);
                    database.get("languages").push(thisLangJson).value();
                });
            });
        }).then(function(){
             database.set("languageByCode", database.get("languages").keyBy("langCode").value()).value();
             return Promise.resolve();
        });

    });

}

function refresh(currentLangCode){
    currentLangCode = currentLangCode || defaultLangCode;
    database = lowdb();
    readLanguageFiles().then(function(){
        database.set("themes",[]).value();
        return readThemeFiles();
    }).then(function(){
        return readThemeLanguage(defaultLangCode);
    }).then(function(){
        if(currentLangCode != defaultLangCode){
            return readThemeLanguage(currentLangCode);
        }else{
            return Promise.resolve();
        }
    }).then(function(){
        console.log("load end");

        //console.log(database.get("themeById.default.languages").value());
    });
}

//refresh("zh-tw");


var initialized = false;

function getLanguages(){
    if(!initialized){
        refresh();
        initialized=true;
    }
    return {
        languages: database.get("languages").value(),
        languageByCode: database.get("languageByCode").value()
    };
}

function getThemes(currentLangCode){
    
}

module.exports = {
    refresh: refresh,
};
