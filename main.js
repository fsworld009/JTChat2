console.log("main.js");
var twitchIrcbot = require('./twitchIrcbot.js');
var fs = require('fs');
var config;

function afterLoadConfig(){
    config.port = config.port || 6667;
    config.host = config.host || 'irc.twitch.tv';
        
    var callbacks = {};

    twitchIrcbot.init(config, callbacks);
    twitchIrcbot.connect();
}


fs.readFile('./profile/twitchIrcbot_config.json', 'utf8', function (err,data) {
    if (err) {
        config={};
        return console.log(err);
    }
    config = JSON.parse(data);
    afterLoadConfig();
});





