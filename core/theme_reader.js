var Promise = require('bluebird');
var fs = require("fs");
var path = require('path');
var _ = require('lodash');

var themeBasePath = path.resolve(__dirname, "../themes");
Promise.promisifyAll(fs);

var themeJsonFileObjectList;

function refreshTemplateList(){
    var themeJsonFileList=[];
    themeJsonFileObjectList=[];
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
        return Promise.all (_.map(themeJsonFileList, function(jsonPath){
                return fs.readFileAsync(jsonPath,"utf-8").then(function(json){
                    themeJsonFileObjectList.push(JSON.parse(json));
                });
            })
        );
    });
}

function getTemplateList(){
return themeJsonFileObjectList;
}

module.exports = {
    refresh: refreshTemplateList,
    get: getTemplateList
};
