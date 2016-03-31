require("../css/semantic.css");

//window.jQuery = window.$ = require("jquery");
window.$ = window.jQuery = require("jquery");
require("../js/semantic.js");
var React = require("react");
var ReactDOM = require("react-dom");
var _ = require("lodash");
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';


var rootPath = "/config/";

var MainMenu = React.createClass({
  render: function(){
    var menuItems = [
      {path: "site", label: "Site"},
      {path: "user", label: "User"},
      {path: "theme", label: "Theme"},
      {path: "profile", label: "Theme Profile"}
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

var Site = React.createClass({
  render: function(){
    return (<div>Site</div>);
  }
});

var User = React.createClass({
  render: function(){
    return (<div>User</div>);
  }
});

var Theme = React.createClass({
  render: function(){
    return (<div>Theme</div>);
  }
});

var Profile = React.createClass({
  render: function(){
    return (<div>Profile</div>);
  }
});

var NoMatch = React.createClass({
  render: function(){
    return (<div>NoMatch</div>);
  }
});

var App = React.createClass({
  render: function(){
    return (
      <div>
        <h1 className="ui header">JTChat2 Configuration</h1>
        <MainMenu currentPath={this.props.location.pathname}/>
        {this.props.children}
      </div>
    );
  }

});

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path={rootPath} component={App}>
    <Route path="site" component={Site}/>
    <Route path="user" component={User}/>
    <Route path="theme" component={Theme}/>
    <Route path="profile" component={Profile}/>
    <Route path="*" component={Site}/>
    <IndexRoute component={Site} />
    </Route>
  </Router>,
  document.getElementById('app')
);
