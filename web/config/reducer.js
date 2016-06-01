var _ = require("lodash");
var actions = require('./actions.js');
import {LOCATION_CHANGE}  from "react-router-redux";
import {INIT}  from "redux";

//console.log("out", initialState.get("locationBeforeTransitions"));

function doNothing(state, action){
    return state;
}

var reducers = {
    //sites: doNothing,
    sitesById: doNothing,
    //users: doNothing,
    usersById: doNothing,
    //themes: doNothing,
    themesById: doNothing,
    //profiles: doNothing,
    profilesById: doNothing,
    routing: null

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
    return state;
};


module.exports = reducer;
