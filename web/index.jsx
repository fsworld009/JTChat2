require("./css/semantic.css");

//window.jQuery = window.$ = require("jquery");
window.$ = window.jQuery = require("jquery");
require("./js/semantic.js");
var React = require("react");
var ReactDOM = require("react-dom");
import { Router, Route, IndexRoute, Link, browserHistory, hashHistory } from 'react-router';


var MainMenu = React.createClass({
    render: function(){
        console.log(this.props);
        return (
            <div className="ui blue secondary pointing menu">
                <Link className="item active" to="/web/site">Site</Link>
                <Link className="item" to="/web/user">User</Link>
                <Link className="item" to="/web/theme">Theme</Link>
                <Link className="item" to="/web/profile">Profile</Link>
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

window.rootPath = "/web/";
ReactDOM.render(
    <Router history={browserHistory}>
      <Route path="/web/" component={App}>
        <Route path="site" component={Site}/>
        <Route path="user" component={User}/>
        <Route path="theme" component={Theme}/>
        <Route path="profile" component={Profile}/>
        <IndexRoute component={Site} />
      </Route>
    </Router>,
  document.getElementById('app')
);
