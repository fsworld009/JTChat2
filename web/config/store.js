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

function loadConfig(){
    return function(dispatch){
        dispatch({
            type: "LOAD_CONFIG",
            loading: "loading"
        });
        $.getJSON("/profiles/", function(data){
            parseStore(data);
            dispatch({
                type: "LOAD_CONFIG",
                loading: "loaded",
                profiles: data
            });
        });
    };
}

const store = createStore(reducer, Immutable.fromJS(initialState), applyMiddleware(thunkMiddleware));
store.dispatch(loadConfig());
module.exports = store;
