var _ = require("lodash");
var Immutable = require('immutable');
var $ = require('jquery');
//const store = require('./store.js');
//console.log("ajax store",store);
//store.dispatch(loadConfig());

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
            dispatch({
                type: "LOAD_LANGUAGES",
                loading: "loaded",
                languages: _.map(data, "langCode"),
                languagesByCode: _.keyBy(data, "langCode")
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
        $.getJSON("/profiles/", function(data){
            parseStore(data);
            dispatch({
                type: "LOAD_CONFIG",
                loading: "loaded",
                profiles: data
            });
        }).then(function(data){
            loadLanguages()(dispatch);
            var langCode = data.langCode || "en";
            loadThemes(data.langCode)(dispatch);
        });
    };
}

function loadThemes(langCode){
    return function(dispatch){
        dispatch({
            type: "LOAD_THEMES",
            loadingThemes: "loading"
        });
        $.getJSON("/themes/"+langCode + "/", function(data){
            dispatch({
                type: "LOAD_THEMES",
                loadingThemes: "loaded",
                themes: _.map(data, "id"),
                themesById: _.keyBy(data, "id"),
                langCode: langCode
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
    getId: getId
};
