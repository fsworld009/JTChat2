var _ = require("lodash");
var Immutable = require('immutable');
var $ = require('jquery');
//const store = require('./store.js');
//console.log("ajax store",store);
//store.dispatch(loadConfig());
import {lang, setLang, setLangList, setLangCode, setDB, getDatabase} from "./database.js";

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
    var saveJson = state.toJS();
    delete saveJson.load;
    delete saveJson.routing;
    delete saveJson.saving;
    setLangCode(saveJson.langCode);
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

function loadLanguages(){
    return function(dispatch){
        dispatch({
            type: "LOAD_DATABASE",
            loadKey: "languages",
            loading: "loading"
        });
        $.getJSON("/languages/", function(data){
            data = data || [];
            setLangList(data);
            _.each(data, function(langData){
                var langCode = langData.langCode;
                _.each(langData, function(json, root){
                    setLang(langCode, root, json);
                });
            });
            dispatch({
                type: "LOAD_DATABASE",
                loadKey: "languages",
                loading: "loaded",
            });
        });
    };
}

function loadSiteDefs(){
    return function(dispatch){
        dispatch({
            type: "LOAD_DATABASE",
            loadKey: "siteDefs",
            loading: "loading"
        });
        $.getJSON("/siteDefs/", function(data){
            setDB("siteDefs", data);
            dispatch({
                type: "LOAD_DATABASE",
                loadKey: "siteDefs",
                loading: "loaded",
            });
        });
    };
}

function loadThemes(){
    return function(dispatch){
        dispatch({
            type: "LOAD_DATABASE",
            loadKey: "themes",
            loading: "loading"
        });
        $.getJSON("/themes/", function(data){
            setDB("themes", data);
            dispatch({
                type: "LOAD_DATABASE",
                loadKey: "themes",
                loading: "loaded"
            });
        });
    };
}   

function loadThemesLanguage(langCode){
    return function(dispatch){
        dispatch({
        type: "LOAD_DATABASE",
            loadKey: "themesLanguage",
            loading: "loading"
        });
        var themeLang = lang("themeLang");
        if(themeLang){
            //if themeLang already exists, don't call the service
            //only trigger dispatches for rerendering
            dispatch({
                type: "LOAD_DATABASE",
                loadKey: "themesLanguage",
                loading: "loaded"
            });
            return;
        }
        $.getJSON("/themesLanguage/"+langCode, function(data){
            setLang(langCode, "themeLang", data);
            dispatch({
                type: "LOAD_DATABASE",
                loadKey: "themesLanguage",
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
