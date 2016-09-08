var _ = require("lodash");
var lowdb = require("lowdb");


var langDB = lowdb();
var currentLangCode;

function wrapLang(Wrapper){
    return function(path, wrapperOnly){
        var childWrapper = Wrapper.get(currentLangCode + "." + path);
        if(!wrapperOnly){
            return childWrapper.value();
        }else{
            return wrapLang(childWrapper);
        }
    };
}

function lang(path, wrapperOnly){
    return wrapLang(langDB)(path, wrapperOnly);
}

function setLang(langCode, root, json){
    langDB.set(langCode + "." + root, json).value();
    console.log("database", langDB.value());
}

function refreshLang(){
    langDB = lowdb();
}

function setLangCode(langCode){
    currentLangCode = langCode;
}

module.exports= {
    lang: lang,
    setLang: setLang,
    refreshLang: refreshLang,
    setLangCode: setLangCode
};

