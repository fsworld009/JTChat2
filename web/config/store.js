var _ = require("lodash");
var reducer = require('./reducer.js');
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import {browserHistory} from 'react-router';
import { syncHistoryWithStore, routerMiddleware, push } from 'react-router-redux';
var Immutable = require('immutable');
var $ = require('jquery');
import {loadConfig, loadThemes, loadLanguages, loadSiteDefs} from "./ajax.js";


var initialState=Immutable.fromJS({
    routing: {locationBeforeTransitions: null},
    load: {
        config: "loading",
        themes: "loading",
        themesLanguage: "loading",
        languages: "loading",
        siteDefs: "loading"
    }
});


const store = createStore(reducer, Immutable.fromJS(initialState), applyMiddleware(thunkMiddleware, routerMiddleware(browserHistory)));
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: function(state){
    return state.get("routing").toJS();
  }
});
store.dispatch(loadConfig());
store.dispatch(loadLanguages());
store.dispatch(loadThemes());
store.dispatch(loadSiteDefs());
module.exports = store;
