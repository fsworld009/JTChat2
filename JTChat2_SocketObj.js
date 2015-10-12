var util = require("util");
var EventEmitter = require("events");

function JTChat2_SocketObj(){

}
util.inherits(JTChat2_SocketObj, EventEmitter);

//override in child objs
JTChat2_SocketObj.prototype.forwardToRemote = function(site, username, channel, command, message){

};

// JTChat2_SocketObj.prototype.forwardToClient = function(rawMessage){
// };


JTChat2_SocketObj.prototype.registerController = function(controller, type){
    if(type=='client'){
        console.log('register',type,this,controller);
        this.addListener('onClientSocketObjSend',controller.onClientSocketObjSend);
    }else{
        //remote
        console.log('register',type,this,controller);
        this.addListener('onRemoteSocketObjReceive',controller.onRemoteSocketObjReceive);
    }
};


module.exports = JTChat2_SocketObj;
