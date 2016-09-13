var _ = require("lodash");
var $ = require("jquery");
var actions = require('./actions.js');
import {LOCATION_CHANGE}  from "react-router-redux";
var Immutable = require('immutable');
import {INIT}  from "redux";
import {getId} from "./ajax.js";
import {setLang} from "./database.js";

//id, hosts, ports
var updateSite = function(state, action){
    var site = state.getIn(["sitesById",action.id]);
    if(!site){

    }else{

    }
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
    if(action.type === "UPDATE_LANG"){
        state = state.withMutations(function(state){
            state.set("langCode",action.langCode);
            setLang(action.langCode);
            state.set("saving","saving");
        });
    }
    if(action.type === "UPDATE_CONFIG"){
        var category = action.category;
        var target = state.getIn([category+"ById", action.id]);
        var newRecord = false, id = action.id;
        if(!target){
            newRecord = true;
            var idList = _.map(state.get(category).toJS() || [], Number);
            id = (_.max(idList) || 0) + 1;
        }else if($.isNumeric(id)){
            //make sure id converts back to number
            id = Number(id);
        }
        state = state.withMutations(function(state){
            var savedObject = _.extend({}, {id: id}, action.options);
            state.setIn([category+"ById", String(id)], Immutable.fromJS(savedObject));
            if(newRecord){
                var newList = state.get(category).push(String(id));
                state.set(category, newList);
            }
            state.set("saving","saving");
        });
    }
    if(action.type === "DELETE_CONFIG_OBJ"){
        var category = action.category;
        var target = state.getIn([category+"ById", action.id]);
        if (target){
            state = state.withMutations(function(state){
                var mapByIdState = state.get(category + "ById").delete(action.id);
                state.set(category + "ById", mapByIdState);
                var idListState = state.get(category).filter(function(id) {
                    return id != action.id;
                });
                state.set(category, idListState);
                state.set("saving","saving");
            });
        }
    }
    if(action.type === "LOAD_DATABASE"){
        state = state.withMutations(function(state){
            state.setIn(["load",action.loadKey], action.loading);
        });
    }
    console.log("return state",state.toJS());
    return state;
};




module.exports = reducer;
