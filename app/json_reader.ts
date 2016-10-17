import Promise = require('bluebird');
import {fs} from './bluebird_promisifyAll.js';
import {Stats} from 'fs';

import path = require('path');
import _ = require('lodash');
import Lowdb = require('lowdb');

let languageBasePath:string  = path.resolve(__dirname, "../languages");
let themeBasePath:string = path.resolve(__dirname, "../themes");

let database: Lowdb.Low;
let defaultLangCode:string = "en";
let defaultLangFileNameRegExp: RegExp = new RegExp("^"+defaultLangCode);
let loadedThemeLanguage: any = {};

function parseJson(jsonString:string, defaultObject?:any):any{
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


function readThemeFiles(): Promise<any>{
    console.log("readThemeFiles");
    let themeJsonFileList: string[]=[];
    return fs.readdirAsync(themeBasePath).then(function(files){
        _.each(files, function(file){
            let filepath:string = path.resolve(themeBasePath, file);
            let stat: Stats = fs.statSync(filepath);
            if(stat.isDirectory()){
                var filenames = fs.readdirSync(filepath);
                if(_.includes(filenames, "jtchat2.json")){
                    //console.log(filepath);
                    themeJsonFileList.push(path.resolve(filepath, "jtchat2.json"));
                }
            }
        });
        themeJsonFileList.sort();
        return Promise.map(themeJsonFileList, function(jsonPath){
            return fs.readFileAsync(jsonPath,"utf-8").then(function(json){
                json = parseJson(json, {});
                database.get("themes").push(json).value();
            });
        }).then(function(){
            //database.set("themesById", database.get("themes").keyBy("id").value()).value();
            return Promise.resolve();
        });
    });

}

function setThemeLanguage(themeId:string, langCode:string, json:any){
    console.log("setThemeLanguage", themeId, langCode);
    json = json || {};
    json = _.extend(json,{id: themeId} );
    var dbThemeWrapper :Lowdb.LoDashWrapper = database.get("themesLanguage");
    if(langCode != defaultLangCode){
        json = _.extend({}, dbThemeWrapper.get(defaultLangCode + "." + themeId).value() , json);
    }
    dbThemeWrapper.set(langCode + "." + themeId, json).value();
    loadedThemeLanguage[langCode] = true;
}

function readThemeLanguageFiles(langCode:string): Promise<any>{
    console.log("readThemeLanguageFiles ",langCode);
    var themes:any  = database.get("themes").value();
    var themeLangPromiseList: Promise<any>[]=[];
    _.each(themes, function(theme){
        var themeId:string = theme.id;
        var jsonPath:string = path.resolve(themeBasePath, themeId, "languages", langCode + ".json");

        var promise:Promise<any> = fs.readFileAsync(jsonPath,"utf-8").then(function(json){
            json = parseJson(json, {});
            setThemeLanguage(themeId, langCode, json);
        }).error(function(e){
            console.log("failed to load ", jsonPath," reason: ", e.message);
            setThemeLanguage(themeId, langCode, {});
        });

        themeLangPromiseList.push(promise);
    });
    return Promise.all(themeLangPromiseList);
}

function readLanguageFiles(): Promise<any>{
    console.log("readLanguageFiles");
    return fs.readdirAsync(languageBasePath).then(function(languageFiles: string[]){
        let langJsonFileList: string[] = [];
        let enLangJsonFile: string = "";
        
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
                    let json = parseJson(jsonString);
                    let thisLangJson = _.merge({}, enLangJson, json);
                    database.get("languages").push(thisLangJson).value();
                });
            });
        }).then(function(){
             //database.set("languagesByCode", database.get("languages").keyBy("langCode").value()).value();
             return Promise.resolve();
        });

    });

}

let currentLangCode: string;
let promises: any = {};
function refresh(){
    currentLangCode = currentLangCode || defaultLangCode;
    loadedThemeLanguage = {};
    promises = {};
    database = Lowdb();
    database.set("languages", []).value();
    database.set("themes",[]).value();
    database.set("themesLanguage",{}).value();
    return Promise.resolve();
}

//refresh("zh-tw");



function getLanguages(): Promise<any>{
    var promise: Promise<any>;
    if(!promises.languages){
        promises.languages = readLanguageFiles();
    }
    promise = promises.languages;
    return promise.then(function(){
        return Promise.resolve(database.get("languages").value());
    });
}

function getThemes(): Promise<any>{
    var promise: Promise<any>;
    if(!promises.themes){
        promises.themes = readThemeFiles();
    }
    promise = promises.themes;
    return promise.then(function(){
        return Promise.resolve(database.get("themes").value());
    });
};

function getThemesLanguage(langCode: string): Promise<any>{
    currentLangCode = langCode;
    var promise: Promise<any>, defaultThemeLangPromise: Promise<any>;
    if(!promises.themeLanguage){
        promises.themeLanguage={};
    }
    if(langCode != defaultLangCode){
        defaultThemeLangPromise = getThemesLanguage(defaultLangCode);
    }else{
        defaultThemeLangPromise = Promise.resolve();
    }
    return getThemes().then(function(){
        return defaultThemeLangPromise;
    }).then(function(){
        if(!promises.themeLanguage[langCode]){
            promises.themeLanguage[langCode] = readThemeLanguageFiles(langCode);
        }
        promise = promises.themeLanguage[langCode];
        return promise;
    }).then(function(){
        return Promise.resolve(database.get("themesLanguage." + langCode).value());
    });
}

/*currentLangCode = 'zh-tw';
refresh().then(function(){
    console.log(database.get("languages").value());
    console.log(database.get("themes").value());
    console.log(database.get("themesLanguage").value());
});*/
refresh();
module.exports = {
    refresh: refresh,
    getLanguages: getLanguages,
    getThemes: getThemes,
    getThemesLanguage: getThemesLanguage
};
