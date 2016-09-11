var _ = require("lodash");
var Immutable = require('immutable');
var $ = require('jquery');
//const store = require('./store.js');
//console.log("ajax store",store);
//store.dispatch(loadConfig());
import {setLang, setLangCode, refreshLang} from "./database.js";

function doSaveConfig(saveJson){
    _.forEach(saveJson, function(value, key){
        var originalKey = key.replace(/ById$/g, "");
        if(originalKey !== key && saveJson[originalKey]){
            saveJson[originalKey] = _.values(value);
            delete saveJson[key];
        }
        if(!(value instanceof Array) && typeof value == "object"){
            doSaveConfig(value);
        }
    });
}

function saveConfig(state){
    //console.log("store",store2);
    var stateJson = state.toJS();
    var saveJson = {
        users: stateJson.users,
        usersById: stateJson.usersById,
        sites: stateJson.sites,
        sitesById: stateJson.sitesById,
        profiles: stateJson.profiles,
        profilesById: stateJson.profilesById,
        langCode: stateJson.langCode
    };
    setLangCode(stateJson.langCode);
    doSaveConfig(saveJson);
    return function(dispatch){
        $.ajax({
            url: "/profiles/",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(saveJson),
            method: "PUT",
            success: function(response){
                dispatch({type: "SAVE_CONFIG", saving: "success"});
            },
            error: function(error){
                dispatch({type: "SAVE_CONFIG", saving: "failed"});
            }
        });
    };
}


function getId(value){
    if(typeof value == "object" && value.id){
        return value.id;
    }else{
        return  value;
    }
}

function getValue(value){
    if(typeof value == "object" && value.id){
        return value.id;
    }else{
        return value;
    }
}

function parseStore(store){
    _.forEach(store, function(value, key){
        if(value instanceof Array){
            store[key + "ById"] = _.keyBy(value, getId);
            store[key] = _.map(value, getValue);
            parseStore(store[key + "ById"]);
        }/*else if(typeof value == "object"){
            parseStore(value);
        }*/
    });
}

function loadSiteDefs(){
    return function(dispatch){
        dispatch({
            type: "LOAD_SITE_DEFS",
            loading: "loading"
        });
        $.getJSON("/siteDefs/", function(data){
            dispatch({
                type: "LOAD_SITE_DEFS",
                loading: "loaded",
                siteDefs: _.map(data, "id"),
                siteDefsById: _.keyBy(data, "id")
            });
        });
    };
}


function loadLanguages(){
    return function(dispatch){
        dispatch({
            type: "LOAD_LANGUAGES",
            loading: "loading"
        });
        $.getJSON("/languages/", function(data){
            _.each(data, function(langData){
                var langCode = langData.langCode;
                _.each(langData, function(json, root){
                    setLang(langCode, root, json);
                });
            });
            dispatch({
                type: "LOAD_LANGUAGES",
                loading: "loaded",
                languages: data
            });
        });
    };
}

function loadConfig(){
    return function(dispatch){
        dispatch({
            type: "LOAD_CONFIG",
            loading: "loading"
        });
        var currentLangCode;
        $.getJSON("/profiles/", function(data){
            currentLangCode = data.langCode || "en";
            setLangCode(currentLangCode);
            parseStore(data);
            dispatch({
                type: "LOAD_CONFIG",
                loading: "loaded",
                profiles: data
            });
        }).then(function(){
            loadThemesLanguage(currentLangCode)(dispatch);
        });
    };
}

function loadThemes(){
    return function(dispatch){
        dispatch({
            type: "LOAD_THEMES",
            loading: "loading"
        });
        $.getJSON("/themes/", function(data){
            dispatch({
                type: "LOAD_THEMES",
                loading: "loaded"
            });
        });
    };
}   

function loadThemesLanguage(langCode){
    return function(dispatch){
        dispatch({
            type: "LOAD_THEMES_LANGUAGE",
            loading: "loading"
        });
        $.getJSON("/themesLanguage/"+langCode, function(data){
            setLang(langCode, "themeLang", data);
            dispatch({
                type: "LOAD_THEMES_LANGUAGE",
                loading: "loaded"
            });
        });
    };

}

module.exports = {
    saveConfig: saveConfig,
    loadConfig: loadConfig,
    loadThemes: loadThemes,
    loadLanguages: loadLanguages,
    loadSiteDefs: loadSiteDefs,
    loadThemesLanguage: loadThemesLanguage,
    getId: getId
};
