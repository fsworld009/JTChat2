$(function(){
    console.log(_,$);
    var username='world9918';
    var $chatInput = $('.chat-input');
    var $chatMsg = $('.chat-msg');


    var JTChat2_WebSocketClient = function(){
        this._webSocket = undefined;
    };

    JTChat2_WebSocketClient.prototype.init = function(options){
        console.log('connect to',options.url+':'+options.port);
        this._webSocket = new WebSocket(options.url+':'+options.port);
        this._webSocket.onopen = function(ev){
            console.log('onopen',this,ev);
            this.send('Twitch username #channel')
        };
        this._webSocket.onmessage = function(event){
            console.log('receive',event,event.data,$chatMsg);
            $chatMsg.html( $chatMsg.html() + '[Recv] << ' + event.data + '<br/>' );
            $chatInput.val('');
        };
    };

    JTChat2_WebSocketClient.prototype.chat = function(message){
        this._webSocket.send('MSG ' + username + ' ' + message);
    };


    var jtChat2Client = new JTChat2_WebSocketClient();
    jtChat2Client.init({
        url: 'ws://localhost',
        port: 8001
    });


    $('.chat-submit').off('click').on('click', function(ev){
        var message = $chatInput.val();
        $chatMsg.html($chatMsg.html() + '[Send]>> ' + message + '<br/>');
        jtChat2Client.chat(message);
    });
});
