
var websocket = require('nodejs-websocket');

var JTChat2_WebSocketServer = function(){
    this._serverSocket = undefined;

};




JTChat2_WebSocketServer.prototype.init = function(options){

    this._serverSocket = websocket.createServer(function(conn){
        console.log('serversocket',this);
            conn.on("text", function (str) {
            console.log("Received "+str);
            console.log('send',str);
            conn.sendText(str);
        });
    });
};

JTChat2_WebSocketServer.prototype.listen = function(port){
    this._serverSocket.listen(port);
    console.log('listen to port ',port);
};



var test = new JTChat2_WebSocketServer();
test.init();
test.listen(8001);
