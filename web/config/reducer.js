var _ = require("lodash");
var actions = require('./actions.js');
import {LOCATION_CHANGE}  from "react-router-redux";
var Immutable = require('immutable');
import {INIT}  from "redux";
import {getId} from "./ajax.js";

//id, hosts, ports
var updateSite = function(state, action){
    var site = state.getIn(["sitesById",action.id]);
    site = site.withMutations(function(site){
        site.set("hosts",Immutable.fromJS(action.hosts)),
        site.set("hostsById",Immutable.fromJS(_.keyBy(action.hosts,getId)));
        site.set("ports",Immutable.fromJS(action.ports));
        site.set("portsById",Immutable.fromJS(_.keyBy(action.ports,getId)));
    });
    state = state.setIn(["sitesById",action.id], site);
    return state;
};

var reducer = function(state, action){
    console.log("reducer", state.toJS(), action);
    if(action.type === "@@redux/INIT"){
        //return state.merge(initialState);
        return state;
    }
    if (action.type === LOCATION_CHANGE) {
        return state.setIn(["routing", "locationBeforeTransitions"], action.payload);
    }
    if(action.type === "LOAD_CONFIG"){
        state = state.withMutations(function(state){
            state.setIn(["load","config"], action.loading);
            state.merge(action.profiles);
        });
        return state;
    }
    if(action.type === "SAVE_CONFIG"){
        return state.set("saving",action.saving);
    }
    if(action.type === "SAVE_SITE"){
        state = updateSite(state, action);
        state = state.set("saving","saving");
    }
    if(action.type === "LOAD_THEMES"){
        state = state.withMutations(function(state){
            state.setIn(["load","themes"], action.themes);
            state.set("themes", action.themes);
            state.set("themesByName", _.keyBy(action.themes, "name"));
        });
    }
    return state;
};




module.exports = reducer;
