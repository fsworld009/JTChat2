var _ = require("lodash");
var reducer = require('./reducer.js');
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
var Immutable = require('immutable');
var $ = require('jquery');

function parseValue(value){
    if(typeof value == "object" && value.id){
        return "_" + value.id;
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

var initialState=Immutable.fromJS({
    routing: {locationBeforeTransitions: null}
});

function loadConfig(store){
    return function(next){
        return function(action){
            var state = store.getState();
            if(!state.get("loading")){
                var nextState = next({
                    type: "LOAD_CONFIG",
                    loading: "loading"
                });

                $.getJSON("/profiles/", function(data){
                    parseStore(data);
                    next({
                        type: "LOAD_CONFIG",
                        loading: "loaded",
                        profiles: data
                    });
                });
                return nextState;
            }else{
                //move to next middleware or reducer
                return next(action);
            }
        };
    };
}

const store = createStore(reducer, Immutable.fromJS(initialState), applyMiddleware(thunkMiddleware, loadConfig));
module.exports = store;
