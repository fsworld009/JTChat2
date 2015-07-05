console.log("main.js");
var TwitchIRCBot = require('./twitchIrcbot.js');
var twitchIrcbot = new TwitchIRCBot();
var fs = require('fs');
var config;

function afterLoadConfig(){
    config.port = config.port || 6667;
    config.host = config.host || 'irc.twitch.tv';
        
    twitchIrcbot.init(config);
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





