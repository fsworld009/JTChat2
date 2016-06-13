var _ = require("lodash");
var actions = require('./actions.js');
import {LOCATION_CHANGE}  from "react-router-redux";
var Immutable = require('immutable');
import {INIT}  from "redux";
import {getId} from "./ajax.js";

//id, hosts, ports
var updateSite = function(state, action){
    var site = state.getIn(["sitesById",action.id]);
    site = site.set("hosts",Immutable.fromJS(action.hosts)),
    site = site.set("hostsById",Immutable.fromJS(_.keyBy(action.hosts,getId)));
    site = site.set("ports",Immutable.fromJS(action.ports));
    site = site.set("portsById",Immutable.fromJS(_.keyBy(action.ports,getId)));
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
    if(action.type === "SAVE_CONFIG"){
        return state.set("saving",action.saving);
    }
    if (action.type === LOCATION_CHANGE) {
        return state.setIn(["routing", "locationBeforeTransitions"], action.payload);
    }
    if(action.type === "SAVE_SITE"){
        state = updateSite(state, action);
        state = state.set("saving","saving");
    }
    return state;
};




module.exports = reducer;
