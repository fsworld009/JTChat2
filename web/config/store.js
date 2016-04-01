var _ = require("lodash");
var reducers = require('./reducers.js');
import { createStore, combineReducers } from 'redux';

function parseValue(value){
    if(typeof value == "object" && value.id){
        return value.id;
    }else{
        return value;
    }
}

function parseStore(store){
    _.forEach(store, function(value, key){
        if(value instanceof Array){
            store[key + "ById"] = _.keyBy(value, parseValue);
            store[key] = _.map(value, parseValue);
            parseStore(store[key + "ById"]);
        }else if(typeof value == "object"){
            parseStore(value);
        }
    });
}

//saveStore

var data = {
  "sites": [
    {
      "id": 1,
      "remoteSocketObj": "TwitchIRCBot",
      "urlId": "twitch",
      "displayName": "Twitch",
      "hosts": [
          {
              "id": 1,
              "host":"irc.chat.twitch.tv"
          },{
              "id": 2,
              "host":"irc.twitch.tv"
          }
      ],
      "ports": [6667, 80]
    }
  ],
  "users": [
    {
      "id": 1,
      "siteId": 1,
      "urlId": "none",
      "displayName": "(Anonymous)",
      "username": "justinfan123",
      "password": "kappa"
    }
  ],

  "themes": [
    {
      "id": 1,
      "urlId": "default",
      "displayName" :"Theme 1",
      "userTheme": false,
      "path" : "/"
    }
  ],

  "profiles": [
    {
      "id" : 1,
      "urlId": "profile1",
      "themeId": 1,
      "options": {

      }
    }
  ]
};

parseStore(data);
const store = createStore(combineReducers(reducers), data.store);

module.exports = store;