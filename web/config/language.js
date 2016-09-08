var _ = require("lodash");
var lowdb = require("lowdb");


var langDB;
var currentLangCode;
//var hasLangMap;

function wrapLang(Wrapper){
    return function(path, wrapperOnly){
        var stringPath = currentLangCode + "." + path;
        var childWrapper = Wrapper.get(stringPath);
        if(!wrapperOnly){
            var value = childWrapper.value();
            if(typeof value == "undefined"){
                console.info("No string:", stringPath);
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
    return wrapLang(langDB)(path, wrapperOnly);
}

function setLang(langCode, root, json){
    langDB.set(langCode + "." + root, json).value();
}

function refreshLang(){
    langDB = lowdb();
    //hasLangMap = {};
}

function setLangCode(langCode){
    currentLangCode = langCode;
}

refreshLang();
module.exports= {
    lang: lang,
    setLang: setLang,
    refreshLang: refreshLang,
    setLangCode: setLangCode
};

