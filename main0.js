console.log("main.js");

var JTChat2_WebSocketServer = require('./JTChat2_WebSocketServer.js');
var JTChat2_Controller = require('./JTChat2_Controller.js');
var webSocketServer;
var fs = require('fs');
var config;
var controller;
controller = new JTChat2_Controller();

function afterLoadConfig(){
    config.port = config.port || 6667;
    config.host = config.host || 'irc.twitch.tv';
    // twitchIrcbot.init(config);
    // twitchIrcbot.connect();
    webSocketServer = new JTChat2_WebSocketServer();
    console.log('controller',controller);
    webSocketServer.init({controller: controller});
    webSocketServer.listen(8001);
}


fs.readFile('./profile/twitchIrcbot_config.json', 'utf8', function (err,data) {
    if (err) {
        config={};
        return console.log(err);
    }
    config = JSON.parse(data);
    afterLoadConfig();
});
