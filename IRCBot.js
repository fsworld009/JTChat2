var net = require('net');
var __ = require('underscore');
var util = require("util");
var JTChat2_Socket = require('./JTChat2_Socket.js');
/*
 * options = {
 * logger: fn,
 * port: number,
 * host: string,
 * username: string,
 * password: string,
 * autoJoinChannels: []
 * }
 *
 * callbacks:
 * loginSuccess: fn()
 *
 * }
 *
 * */

function IRCBot(){
    this._options = undefined;
    this._channelUserMap = undefined;
    this._ircSocket = new net.Socket();
    this._ircSocket._botObject = this;
}
util.inherits(IRCBot, JTChat2_Socket);

IRCBot.prototype._log = function(logType, context){
    var prefix;
    switch(logType){
        case 'send':
            prefix = '>>';
            break;
        case 'receive':
            prefix = '<<';
            break;
        case 'sys':
            prefix = '[SYS]';
            break;
        default:
            prefix = '';
    }

    var logText = prefix + ' ' + context;
    if(logText.indexOf('\r\n')<0){
        logText = logText + '\r\n';
    }
    if(typeof this._options.logger==='function'){
        this._options.logger(logText);
    }else{
        process.stdout.write(logText);
    }
};

IRCBot.prototype._invokeCallback = function(callbackName, argList){
    if(typeof this[callbackName] === "function"){
        this[callbackName].apply(this, argList);
    }
};

IRCBot.prototype._getSenderNickname = function(sender){
    var exclamationMarkPos = sender.indexOf('!');
    if(exclamationMarkPos === -1){
        return sender.substr(1);
    }
    return sender.substr(0,exclamationMarkPos ).replace(':','');
};

IRCBot.prototype._parseMessage = function(message){
    //get rid of heading spaces
    while(message.length>0 && message.charAt(0) !== ':' && message.charAt(0) !== 'P'){
        message = message.substr(1);
    }

    if(message.length == 0){
        return;
    }

    if(message.indexOf("PING") === 0){
        var args = message.split(' ');
        var pong='';
        if(args.length>=2){
            pong = args[1];
        }
        this.send('PONG', pong);
        return;
    }


    var args = message.split(' ');
    if(args.length>4){
        args[3] = args.splice(3).join(' ');
    }

    var sender  = args[0]? args[0]: '';
    sender = this._getSenderNickname(sender);
    var command = args[1]? args[1]: '';
    var target  = args[2]? args[2]: '';
    var context = args[3]? args[3]: '';



    var callbackName, callbackArgList=[];
    switch(command){
        case '001':
            callbackName = 'onLoginSuccess';
            break;
        case '421':
            callbackName = 'onUnknownCommand';
            break;
        case '353':
            //NAMES response
            var parse = context.split(' ');
            if(parse.length >=3){
                var channel = parse[1];
                var names = parse.splice(2).join(' ').substr(1);
                this._addToNameList(channel,names);
            }
            break;
        case '366':
            var channel = context.substr(0, context.indexOf(' '));
            callbackArgList=[channel];
            console.log('!!Names of', channel, this._channelUserMap[channel]);
            break;
        case 'JOIN':
            if(sender === this._options.username){
                this._initChannelUserMap(target);
                callbackName = 'onJoinChannel';
                callbackArgList.push(channel);
                this.send("NAMES", target);
            }else{
                this._addToNameList(target, sender);
                callbackName = 'onUserJoinChannel';
                callbackArgList=[target,sender];
            }
            break;
        case 'PART':
            if(sender === this._options.username){
                this._removeChannelUserMap(target);
                callbackName = 'onLeaveChannel';
                callbackArgList.push(channel);
            }else{
                this._removeFromNameList(target, sender);
                callbackName = 'onUserLeaveChannel';
                callbackArgList=[target,sender];
            }
            break;
        case 'PRIVMSG':
            if(target.indexOf('#') > -1){
                callbackName = 'onChatMessage';
                callbackArgList=[sender,context.substr(1)];
            }
            break;
        default:
            callbackName = 'onUnknownMessage';
            callbackArgList.push(message);
            break;
    }
    if(typeof callbackName !== 'undefined'){
        this._invokeCallback(callbackName, callbackArgList);
    }
    if(command == '001' && this._options.autoJoinChannels instanceof Array){
        __.each(this._options.autoJoinChannels, function(channel){
            this.joinChannel(channel);
        }, this);
    }
};

IRCBot.prototype.sendRaw = function(message){
    if(message.indexOf('\r\n') < 0){
        message = message+'\r\n';
    }
    this._log('send', message);
    this._ircSocket.write(message,'utf8');
};

IRCBot.prototype.send = function(command, message){
    message = command + ' ' + message;
    this.sendRaw(message);
};

IRCBot.prototype._Socket__onReceive = function(message){
    var self = this._botObject;
    message = message.toString();
    self._log('receive', message);
    var messages = message.split('\r\n');
    __.each(messages, function(message){
        self._parseMessage(message);
    });
};

IRCBot.prototype._Socket__onConnect = function(){
    var self = this._botObject;
    self._log("sys", "connected");
    self._channelUserMap={};
    self.send('PASS',self._options.password);
    self.send('NICK',self._options.username);
    self.send('USER','JtChat2');
    //ircSocket.destroy();
};

IRCBot.prototype._Socket__onClose = function(){
    var self = this._botObject;
    self._log('sys', 'closed');
};

IRCBot.prototype._Socket__onError = function(error){
    var self = this._botObject;
    self._log("sys", "error");
};

IRCBot.prototype.init = function(r_options){
    this._options = __.extend({},r_options);
    this._ircSocket.on("error", this._Socket__onError);
    this._ircSocket.on("close", this._Socket__onClose);
    this._ircSocket.on("data", this._Socket__onReceive);
};

IRCBot.prototype.connect = function(){
    console.log('connect options',this._options,this._ircSocket);
    this._ircSocket.connect(this._options.port, this._options.host, this._Socket__onConnect);
};

IRCBot.prototype._addToNameList = function(channel, names){
    console.log('add to channel',channel, names);
    if(this._channelUserMap[channel]){
        __.each(names.split(" "), function(name){
            if(!this._channelUserMap[channel][name]){
                this._channelUserMap[channel][name] = "";
            }
        }, this);
    }
};

IRCBot.prototype._removeFromNameList = function(channel, names){
    console.log('remove from channel',channel, names);
    if(this._channelUserMap[channel]){
        __.each(names.split(" "), function(name){
            delete this._channelUserMap[channel][name];
        }, this);
    }
};

IRCBot.prototype._initChannelUserMap = function(channelName){
    delete this._channelUserMap[channelName];
    this._channelUserMap[channelName]={};
};

IRCBot.prototype._removeChannelUserMap = function(channelName){
    delete this._channelUserMap[channelName];
};

//irc actions
IRCBot.prototype.joinChannel = function(channelName){
    this.send("JOIN","#"+channelName);
};



module.exports = IRCBot;
