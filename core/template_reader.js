var Promise = require('bluebird');
var fs = require("fs");
var path = require('path');
var _ = require('lodash');

var templateBasePath = path.resolve(__dirname, "../template");
Promise.promisifyAll(fs);

var templateJsonFileObjectList;

function refreshTemplateList(){
    var templateJsonFileList=[];
    templateJsonFileObjectList=[];
    return fs.readdirAsync(templateBasePath).then(function(files){
        _.each(files, function(file){
            var filepath = path.resolve(templateBasePath, file);
            var stat = fs.statSync(filepath);
            if(stat.isDirectory()){
                var filenames = fs.readdirSync(filepath);
                if(_.includes(filenames, "jtchat2.json")){
                    //console.log(filepath);
                    templateJsonFileList.push(path.resolve(filepath, "jtchat2.json"));
                }
            }
        });
        return Promise.all (_.map(templateJsonFileList, function(jsonPath){
                return fs.readFileAsync(jsonPath,"utf-8").then(function(json){
                    templateJsonFileObjectList.push(JSON.parse(json));
                });
            })
        );
    });
}

function getTemplateList(){
return templateJsonFileObjectList;
}

module.exports = {
    refresh: refreshTemplateList,
    get: getTemplateList
};
