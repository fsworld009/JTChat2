var _ = require("lodash");
var actions = require('./actions.js');
import {LOCATION_CHANGE}  from "react-router-redux";
var Immutable = require('immutable');
import {INIT}  from "redux";
import {getId} from "./ajax.js";

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
    if(action.type === "SAVE_LANG"){
        state = state.withMutations(function(state){
            state.set("langCode",action.langCode);
            var currentLangCode = state.get("langCode");
            state.set("currentLanguage", state.getIn(["languagesByCode",currentLangCode]));
            state.set("saving","saving");
        });
    }
    if(action.type === "UPDATE_CONFIG"){
        var category = action.category;
        var target = state.getIn([category+"ById", action.id]);
        var newRecord = false;
        if(!target){
            newRecord = true;
        }
        state = state.withMutations(function(state){
            state.setIn([category+"ById", action.id], Immutable.fromJS({
                id: action.id,
                options: action.options
            }));
            if(newRecord){
                var newList = state.get(category).push(action.id);
                state.set(category, newList);
            }
            state.set("saving","saving");
        });
    }
    if(action.type === "LOAD_THEMES"){
        state = state.withMutations(function(state){
            state.setIn(["load","themes"], action.loadingThemes);
            state.merge({themes: action.themes, themesById: action.themesById});
        });
    }
    if(action.type === "LOAD_LANGUAGES"){
        state = state.withMutations(function(state){
            state.setIn(["load","languages"], action.loading);
            state.merge({languages: action.languages, languagesByCode: action.languagesByCode});
            var currentLangCode = state.get("langCode");
            state.set("currentLanguage", state.getIn(["languagesByCode",currentLangCode]));
        });
    }
    if(action.type === "LOAD_SITE_DEFS"){
        state = state.withMutations(function(state){
            state.setIn(["load","siteDefs"], action.loading);
            state.merge({siteDefs: action.siteDefs, siteDefsById: action.siteDefsById});
        });
    }
    return state;
};




module.exports = reducer;
