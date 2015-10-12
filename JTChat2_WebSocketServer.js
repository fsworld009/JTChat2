
var websocket = require('nodejs-websocket');
var JTChat2_WebSocketClient = require('./JTChat2_WebSocketClient.js');

var JTChat2_WebSocketServer = function(){
    this._serverSocket = undefined;

};




JTChat2_WebSocketServer.prototype.init = function(options){

    var controllerRef = options.controller;
    this._controller = controllerRef;

    this._serverSocket = websocket.createServer(function(websocket){
        // var clientSocketObj = new JTChat2_WebSocketClient();
        // clientSocketObj.init(websocket);
        websocket.on("text", function (str) {
            console.log("Received "+str);
            var parse = str.split(' ');
            if(parse.length !== 3){
                //console.log('close');
                this.close('0','init msg incorrect');
            }else{
                var options = {
                    site: parse[0],
                    username: parse[1],
                    channel: parse[2]
                };
                var clientSocketObj = new JTChat2_WebSocketClient();
                clientSocketObj.init(websocket, options);
                controllerRef.registerSocketObj(clientSocketObj, options);
            }
            // console.log('send',str);
        });
    });
};

JTChat2_WebSocketServer.prototype.listen = function(port){
    this._serverSocket.listen(port);
    console.log('listen to port ',port);
};

module.exports = JTChat2_WebSocketServer;
