var IRCBot = require('./IRCBot.js');
var util = require("util");

var TwitchIRCBot = function(){
    TwitchIRCBot.super_.apply(this);
    this._options = undefined;
};
util.inherits(TwitchIRCBot, IRCBot);

TwitchIRCBot.prototype.onLoginSuccess = function(){
    console.log('loginSuccess');
    this.sendRaw('CAP REQ :twitch.tv/membership');
};


TwitchIRCBot.prototype.onUnknownMessage = function(message){
};

TwitchIRCBot.prototype.onUserJoinChannel = function(channel,user){
    console.log('!JOIN',user,channel);
};

TwitchIRCBot.prototype.onChatMessage = function(channel, sender, message){
    console.log('!TwitchIRCBot receives',channel, sender, message);
    this.emit('onRemoteSocketObjReceive', this, 'Twitch', this.getLoginUser(), channel, 'MSG',  sender, message);
};

module.exports = TwitchIRCBot;
