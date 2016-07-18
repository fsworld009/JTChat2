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
    var saveJson = state.toJS();
    delete saveJson.routing;
    delete saveJson.loading;
    delete saveJson.saving;
    delete json.loadingTheme;
    delete json.themes;
    delete json.themesByName;
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
        return "_" + value.id;
    }else{
        return "_" + value;
    }
}

function getValue(value){
    if(typeof value == "object" && value.id){
        return "_" + value.id;
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
        }else if(typeof value == "object"){
            parseStore(value);
        }
    });
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
        });
    };
}

function loadThemes(){
    return function(dispatch){
        dispatch({
            type: "LOAD_THEMES",
            loadingThemes: "loading"
        });
        $.getJSON("/themes/", function(data){
            dispatch({
                type: "LOAD_THEMES",
                loadingThemes: "loaded",
                themes: data
            });
        });
    };
}   

module.exports = {
    saveConfig: saveConfig,
    loadConfig: loadConfig,
    loadThemes: loadThemes,
    getId: getId
};
