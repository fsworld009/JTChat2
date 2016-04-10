require("../css/semantic.css");

//window.jQuery = window.$ = require("jquery");
//window.$ = window.jQuery = require("jquery");
var _ = require("lodash");
require("../js/semantic.js");

var React = require("react");
var ReactDOM = require("react-dom");

import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

const store = require("./store.js");
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: function(state){
    return state.get("routing").toJS();
  }
});

var Status = require("./Status.jsx");
var Site = require("./Site.jsx");
var User = require("./User.jsx");
var Theme = require("./Theme.jsx");
var Profile = require("./Profile.jsx");
var UrlGenerator = require("./UrlGenerator.jsx");





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
          return <Link key={menuItem.path} className={"item"+ (menuItem.selected? " active":"")} to={rootPath + menuItem.path}>{menuItem.label}</Link>;
        })}
      </div>
    );
  }
});


var App = React.createClass({
  render: function(){
    return (
      <div>
        <div style={{margin:"5px"}}>
          <h1 className="ui header">JTChat2 Configuration</h1>
        </div>
        <MainMenu currentPath={this.props.location.pathname}/>
        <div style={{margin:"5px"}}>
          {this.props.children}
        </div>
      </div>
    );
  }

});

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
        <Route path={rootPath} component={App}>
        <Route path="site" component={Site}/>
        <Route path="user" component={User}/>
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
