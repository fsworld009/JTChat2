require("../css/semantic.css");

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
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: function(state){
    return state.get("routing").toJS();
  }
});

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
function mapStateToProps(state){
  return {sites: state.sites};
}

function mapDispatchToProps(dispatch){
  return {};
}



var Site = React.createClass({
  render: function(){
    console.log(this.props);
    return (<div>Site</div>);
  }
});

var SiteContainer = connect(mapStateToProps, mapDispatchToProps)(Site);


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

var Status = React.createClass({
  render: function(){
    return (<div>Status</div>);
  }
});

var UrlGenerator = React.createClass({
  render: function(){
    return (<div>Url Generator</div>);
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
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path={rootPath} component={App}>
      <Route path="site" component={SiteContainer}/>
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
