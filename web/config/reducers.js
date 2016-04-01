var _ = require("lodash");
var actions = require('./actions.js');
var LOCATION_CHANGE = require("react-router-redux").LOCATION_CHANGE;

var initialState={};

function doNothing(state, action){
    return state || initialState;
}

var reducers = {
    sites: doNothing,
    sitesById: doNothing,
    users: doNothing,
    usersById: doNothing,
    themes: doNothing,
    themesById: doNothing,
    profiles: doNothing,
    profilesById: doNothing,
    routing: function(state, action){
        if(action.type == LOCATION_CHANGE){
            return _.assign(state,{
                locationBeforeTransitions: action.payload
            });
        }
        return state || initialState;
    }

};










module.exports = reducers;
