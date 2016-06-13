var _ = require("lodash");
var actions = require('./actions.js');
import {LOCATION_CHANGE}  from "react-router-redux";
var Immutable = require('immutable');
import {INIT}  from "redux";

//console.log("out", initialState.get("locationBeforeTransitions"));


function saveConfig(state){
    var store = state.toJS();
    delete store.routing;
    delete store.loading;
    _.forEach(store, function(value, key){
        var originalKey = key.replace(/ById$/g, "");
        if(originalKey !== key && store[originalKey]){
            store[originalKey] = _.values(value);
            delete store[key];
        }
    });
        console.log("saveConfig3", store);
}

//id, hosts, ports
var updateSite = function(state, action){
    var site = state.getIn(["sitesById",action.id]);
    site = site.set("hosts",Immutable.fromJS(action.hosts)),
    site = site.set("ports",Immutable.fromJS(action.ports));
    state = state.setIn(["sitesById",action.id], site);
    console.log("updateSite",site.toJS());
    console.log("state update",state.getIn(["sitesById",action.id]).toJS());
    return state;
};

var reducer = function(state, action){
    console.log("reducer", state.toJS(), action);
    if(action.type === "@@redux/INIT"){
        //return state.merge(initialState);
        return state;
    }
    if(action.type === "LOAD_CONFIG"){
        return state.merge(_.extend({"loading":action.loading}, action.profiles));
    }
    if (action.type === LOCATION_CHANGE) {
            return state.setIn(["routing", "locationBeforeTransitions"], action.payload);
    }
    if(action.type === "SAVE_SITE"){
        state = updateSite(state, action);
        saveConfig(state);
    }
    return state;
};


module.exports = reducer;
