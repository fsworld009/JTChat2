require("../css/semantic.css");
require("../css/font-awesome.css");
require("../css/fa-color.css");
require("../css/override.css");

//window.jQuery = window.$ = require("jquery");
//window.$ = window.jQuery = require("jquery");
var _ = require("lodash");
require("../js/semantic.js");

var React = require("react");
var ReactDOM = require("react-dom");

import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { Provider, connect } from 'react-redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

const store = require("./store.js");

var MainMenu = require("./MainMenu.jsx");
var LanguageMenu = require("./LanguageMenu.jsx");
var Status = require("./Status.jsx");
var Site= require("./Site.jsx");
var EditSite = require("./EditSite.jsx");
var User = require("./User.jsx");
var EditUser = require("./EditUser.jsx");
var Theme = require("./Theme.jsx");
var Profile = require("./Profile.jsx");
var EditProfile = require("./EditProfile.jsx");
var UrlGenerator = require("./UrlGenerator.jsx");

import {saveConfig} from './ajax.js';
import {lang} from "./database.js";




var rootPath = "/config/";

var App = React.createClass({
  render: function(){
    var content, languageMenu, mainMenu;
    if(this.props.loading){
      languageMenu = (<span></span>);
      mainMenu = (<span></span>);
      content = (
        <div><i className="fa fa-spin fa-spinner"></i> {lang("loading") || "Loading"}...</div>
      );
    }else{
      if(this.props.saving){
        this.props.saveConfig(this.props.state);
      }
      content = this.props.children;
      languageMenu = (<LanguageMenu currentPath={this.props.location.pathname}/>);
      mainMenu = (<MainMenu currentPath={this.props.location.pathname}/>);
    }


    return (
      <div>
        <div style={{margin:"5px"}}>
          <h1 className="ui header">{lang("title")}</h1>
        </div>
        {languageMenu}
        {mainMenu}
        <div style={{margin:"5px","maxWidth":"800px"}}>
          {content}
        </div>
      </div>
    );
  }

});

function mapStateToProps(state){
  var loadingStatus = state.get("load").toObject();
  var loading = false;
  _.each(loadingStatus, function(status){
    loading = loading || (status === "loading");
  });
  var saving = state.get("saving") == "saving";
  console.log("loading", loading, loadingStatus);
  return {
    loading: loading,
    saving: saving,
    state: state
  };
}

function mapDispatchToProps(dispatch){
  return {
    saveConfig: function(store){
      dispatch(saveConfig(store));
    }
  };
}

var AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
        <Route path={rootPath} component={AppContainer}>
        <Route path="site" component={Site} />
        <Route path="site/edit/:siteId" component={EditSite}/>
        <Route path="user" component={User}/>
        <Route path="user/new/" component={EditUser}/>
        <Route path="user/:mode/:userId" component={EditUser}/>
        <Route path="theme" component={Theme}/>
        <Route path="profile" component={Profile}/>
        <Route path="profile/new/" component={EditProfile}/>
        <Route path="profile/edit/:profileId" component={EditProfile}/>
        <Route path="url" component={UrlGenerator}/>
        <Route path="*" component={Status}/>
        <IndexRoute component={Status} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
