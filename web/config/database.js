var _ = require("lodash");
var lowdb = require("lowdb");

var database;
var langDB;
var currentLangCode = "en";
//var hasLangMap;

function wrapLang(Wrapper){
    return function(path, wrapperOnly){
        var childWrapper = Wrapper.get(path);
        if(!wrapperOnly){
            var value = childWrapper.value();
            if(typeof value == "undefined"){
                console.info("No string:", path);
                return "";
            }else{
                return value;
            }
        }else{
            return wrapLang(childWrapper);
        }
    };
}

function lang(path, wrapperOnly){
    var stringPath = currentLangCode + "." + path;
    return wrapLang(langDB)(stringPath, wrapperOnly);
}

function setLangCode(langCode){
    currentLangCode = langCode;
}

function setLang(langCode, root, json){
    langDB.set(langCode + "." + root, json).value();
}

function setLangList(languages) {
    database.set("langList", languages).value();
}

function getLangList(){
    return database.get("langList").value();
}

function setDatabase(propertyKey, propertyList){
    database.set(propertyKey,{}).value();
    var wrapper = database.get(propertyKey);
    wrapper.set("idList",_.map(propertyList, "id")).value();
    wrapper.set("idMap", _.keyBy(propertyList, "id")).value();
}

function getDatabase(propertyKey, id, wrapperOnly){
    var wrapper;
    if (typeof id == "undefined") {
        wrapper = database.get(propertyKey).get("idList");
    }else{
        wrapper = database.get(propertyKey).get("idMap." + id);
    }
    if(wrapperOnly){
        return wrapper;
    }else{
        return wrapper.value();
    }
}

function refresh(){
    database = lowdb();
    database.set("lang",{}).value();
    langDB = database.get("lang");
}

refresh();
module.exports= {
    lang: lang,
    setLang: setLang,
    setLangList: setLangList,
    getLangList: getLangList,
    setDB: setDatabase,
    getDB: getDatabase,
    refresh: refresh,
    setLangCode: setLangCode,
    database: database
};

