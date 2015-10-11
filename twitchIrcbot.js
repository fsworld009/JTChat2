var IRCBot = require('./ircbot.js');


var TwitchIRCBot = function(){
    this._options = undefined;
    this._ircbot = new IRCBot();
    this._callbacks = {
        onLoginSuccess: this._onLoginSuccess,
        onUnknownMessage: this._onUnknownMessage,
        onUserJoinChannel: this._onUserJoinChannel
    };
};

TwitchIRCBot.prototype.init = function(r_options){
    this._options = r_options;
    this._ircbot.init(this._options, this._callbacks, this);
};

TwitchIRCBot.prototype.connect = function(){
    this._ircbot.connect();
};

TwitchIRCBot.prototype._onLoginSuccess = function(){
    console.log('loginSuccess');
    this._ircbot.sendRaw('CAP REQ :twitch.tv/membership');
};


TwitchIRCBot.prototype._onUnknownMessage = function(message){
};

TwitchIRCBot.prototype._onUserJoinChannel = function(channel,user){
    console.log('!JOIN',user,channel);
};
module.exports = TwitchIRCBot;
