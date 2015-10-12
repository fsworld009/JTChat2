var websocket = require('nodejs-websocket');
var __ = require('underscore');
var util = require("util");
var JTChat2_SocketObj = require('./JTChat2_SocketObj.js');

function JTChat2_WebSocketClient(){

}
util.inherits(JTChat2_WebSocketClient, JTChat2_SocketObj);

JTChat2_WebSocketClient.prototype.init = function(webSocket){
    this._webSocket = webSocket;
    this._webSocket._socketObject = this;
};

JTChat2_WebSocketClient.prototype.sendRaw = function(message){
    if(message.indexOf('\r\n') < 0){
        message = message+'\r\n';
    }
    //this._log('send', message);
    this._webSocket.sendText(message);
};

module.exports = JTChat2_WebSocketClient;
