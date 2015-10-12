//Site|username|channel
var __ = require('underscore');
var TwitchIRCBot = require('./TwitchIRCbot.js');

var ControllerMap = {};
function getConrollerMapKey(site, username, channel){
    return site + '|' + username + '|' + channel;
}


function JTChat2Controller(){
    this.onClientSocketObjSend = this.onClientSocketObjSend.bind(this);
    this.onRemoteSocketObjReceive = this.onRemoteSocketObjReceive.bind(this);
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
    console.log('registerSocketObj', key);
    if(key.indexOf('undefined') > -1){
        return;
    }

    if(!ControllerMap[key]){
        ControllerMap[key]={};
    }

    if(!ControllerMap[key].clientList){
        ControllerMap[key].clientList=[];
    }
    ControllerMap[key].clientList.push(socketObj);
    socketObj.registerController(this, 'client');
    if(!ControllerMap[key].remote){
        this.startRemote(options);
    }
    return ControllerMap[key].clientList.length-1;  //return index

    // if(options.type == 'remote'){
    //     if(ControllerMap[key].remote){
    //         return;
    //     }
    //     ControllerMap[key].remote = socketObj;
    //     socketObj.registerController(this);
    // }else if(options.type == 'client'){
    //
    // }

};

JTChat2Controller.prototype.startRemote = function(options){
    var remoteSocketObj;
    switch(options.site){
        case 'Twitch':
            remoteSocketObj = new TwitchIRCBot();
            var config = {
                "username": "",
                "password": "",
                "autoJoinChannels": ["#"]
            };
            config.port = config.port || 6667;
            config.host = config.host || 'irc.twitch.tv';
            remoteSocketObj.init(config);
            remoteSocketObj.connect();
            break;
    }
    var key = getConrollerMapKey(options.site, options.username, options.channel);
    ControllerMap[key].remote = remoteSocketObj;
    remoteSocketObj.registerController(this, 'remote');
    console.log('!!!!ControllerMap',ControllerMap);
};

JTChat2Controller.prototype.onClientSocketObjSend = function(socketObj, site, username, channel, command, message){
    var key = getConrollerMapKey(site, username, channel);

    var remoteSocketObj = ControllerMap[key].remote;
    remoteSocketObj.forwardToRemote(site, username, channel, command, message);
    //sync to other client
    //__.each()
};

JTChat2Controller.prototype.onRemoteSocketObjReceive = function(socketObj, site, username, channel, command, sender, message){
    var key = getConrollerMapKey(site, username, channel);
    console.log('recv forward',ControllerMap);
    console.log('recv forward',socketObj, site, username, channel, command, sender, message);
    __.each(ControllerMap[key].clientList, function(clientSocketObj){
        clientSocketObj.send(command,sender,message);
    });
};

module.exports = JTChat2Controller;
