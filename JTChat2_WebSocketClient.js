var websocket = require('nodejs-websocket');
var __ = require('underscore');
var util = require("util");
var JTChat2_SocketObj = require('./JTChat2_SocketObj.js');

function JTChat2_WebSocketClient(){

}
util.inherits(JTChat2_WebSocketClient, JTChat2_SocketObj);

JTChat2_WebSocketClient.init = function(webSocket){
    this._webSocket = webSocket;
};
