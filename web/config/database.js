var _ = require("lodash");
var lowdb = require("lowdb");

var database;
var langDB, siteDefsDB, themesDB, themesLanguageDB;
var currentLangCode;
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

function setSiteDefs(siteDefs){
    siteDefsDB.set("siteDefs",_.map(siteDefs, "id")).value();
    siteDefsDB.set("sitesById", _.keyBy(siteDefs, "id")).value();
}

function getSiteDef(id, wrapperOnly){
    var wrapper;
    if (typeof id == "undefined") {
        wrapper = siteDefsDB.get("siteDefs");
    }else{
        wrapper = siteDefsDB.get("siteDefsDB." + id);
    }
    if(wrapperOnly){
    }
}

function refresh(){
    database = lowdb();
    refreshLang();
    refreshSiteDefs();
}

function refreshLang(){
    database.set("lang",{}).value();
    langDB = database.get("lang");
    //hasLangMap = {};
}

function refreshSiteDefs(){
    database.set("siteDefs",{}).value();
    siteDefsDB = database.get("siteDefs");
}




refresh();
module.exports= {
    lang: lang,
    setLang: setLang,
    setLangList: setLangList,
    getLangList: getLangList,
    setSiteDefs: setSiteDefs,
    refresh: refresh,
    setLangCode: setLangCode,
    database: database
};

