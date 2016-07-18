require("../css/semantic.css");
require("../css/font-awesome.css");
require("../css/fa-color.css");

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

var Status = require("./Status.jsx");
var Site= require("./Site.jsx");
var EditSite = require("./EditSite.jsx");
var User = require("./User.jsx");
var EditUser = require("./EditUser.jsx");
var Theme = require("./Theme.jsx");
var Profile = require("./Profile.jsx");
var UrlGenerator = require("./UrlGenerator.jsx");

import {saveConfig} from './ajax.js';





var rootPath = "/config/";

var MainMenu = React.createClass({
  render: function(){
    var menuItems = [
      {path: "status", label: "Status"},
      {path: "site", label: "Site"},
      {path: "user", label: "User"},
      {path: "theme", label: "Theme"},
      {path: "profile", label: "Theme Profile"},
      {path: "url", label: "Url Generator"}
    ];
    var currentPath = (this.props.currentPath || "").replace(/^\/config\/([^\/]*)(.*$)/, function(match, $1){
      return $1;
    });

    var inEdit = (this.props.currentPath || "").indexOf("/edit/") > -1;

    var currentMenuItem = _.find(menuItems, function(menuItem){
      return menuItem.path == currentPath;
    });
    if(currentMenuItem){
      currentMenuItem.selected = true;
    }else{
      menuItems[0].selected = true;
    }
    return (
      <div className="ui blue secondary pointing menu">
        {menuItems.map(function(menuItem){
            if(inEdit){
              return <a href="javascript:void(0)" key={menuItem.path} className="item disabled" >{menuItem.label}</a>;
            }else{
              return <Link key={menuItem.path} className={"item"+ (menuItem.selected? " active":"")} to={rootPath + menuItem.path}>{menuItem.label}</Link>;
            }
        })}
      </div>
    );
  }
});


var App = React.createClass({
  render: function(){
    var content;
    if(this.props.loading){
      content = (
        <div><i className="fa fa-spin fa-spinner"></i> Loading...</div>
      );
    }else{
      if(this.props.saving){
        this.props.saveConfig(this.props.state);
      }
      content = this.props.children;
    }


    return (
      <div>
        <div style={{margin:"5px"}}>
          <h1 className="ui header">JTChat2 Configuration</h1>
        </div>
        <MainMenu currentPath={this.props.location.pathname}/>
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
        <Route path="user/edit/:userId" component={EditUser}/>
        <Route path="theme" component={Theme}/>
        <Route path="profile" component={Profile}/>
        <Route path="url" component={UrlGenerator}/>
        <Route path="*" component={Status}/>
        <IndexRoute component={Status} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
