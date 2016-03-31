var _ = require("lodash");
var actions = require('./actions.js');
var reducers = {
    sites: function(state, action){

        return _.assign({},state);
    },

    users: function(state, action){
        return _.assign({},state);
    },

    themes: function(state, action){
        return _.assign({},state);
    },

    profiles: function(state, action){
        return _.assign({},state);
    }

};










module.exports = reducers;
