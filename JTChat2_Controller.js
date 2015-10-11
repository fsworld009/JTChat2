//Site|username|channel
var ControllerMap = {};
function getConrollerMapKey(site, username, channel){
    return site + '|' + username + '|' + channel;
}


function JTChat2Controller(){
    this.onSocketObjSend = this.onSocketObjSend.bind(this);
    this.onSocketObjReceive = this.onSocketObjReceive.bind(this);
}

// JTChat2Controller.prototype.

/*
options:
  type: 'remote' or 'client';
  site:
  username:
  channel:
*/
JTChat2Controller.prototype.registerSocketObj = function(socketObj, options){
    var key = getConrollerMapKey(options.site, options.username, options.channel);
    if(key.indexOf('undefined') > -1){
        return;
    }

    if(!ControllerMap[key]){
        ControllerMap[key]={};
    }

    if(options.type == 'remote'){
        if(ControllerMap[key].remote){
            return;
        }
        ControllerMap[key].remote = socketObj;
        socketObj.registerController(this);
    }else if(options.type == 'client'){
        if(!ControllerMap[key].clientList){
            ControllerMap[key].clientList=[];
        }
        ControllerMap[key].clientList.push(socketObj);
        socketObj.registerController(this);
        return ControllerMap[key].clientList.length-1;  //return index
    }

};

JTChat2Controller.prototype.onSocketObjSend = function(socketObj, socketType, site, username, channel, message){

};

JTChat2Controller.prototype.onSocketObjReceive = function(socketObj, socketType, site, username, channel, message){

};
