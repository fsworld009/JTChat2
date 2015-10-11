var util = require("util");
var EventEmitter = require("events");

function JTChat2_SocketObj(){

}
util.inherits(JTChat2_SocketObj, EventEmitter);

//override in child objs
JTChat2_SocketObj.prototype.toRemote = function(message){
    return message;
};

JTChat2_SocketObj.prototype.toClient = function(message){
    return message;
};


JTChat2_SocketObj.prototype.registerController = function(controller){
    this.addListener('onSend',controller.onSocketObjSend);
    this.addListener('onReceive',controller.onSocketObjReceive);
};


module.exports = JTChat2_SocketObj;
