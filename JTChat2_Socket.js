var util = require("util");
var EventEmitter = require("events");

function JTChat2_Socket(){

}
util.inherits(JTChat2_Socket, EventEmitter);

//override in child objs
JTChat2_Socket.prototype.toRemote = function(message){
    return message;
};

JTChat2_Socket.prototype.toClient = function(message){
    return message;
};


JTChat2_Socket.prototype.registerController = function(controller){
    this.addListener('onSend',controller);
    this.addListener('onReceive',controller);
};


module.exports = JTChat2_Socket;
