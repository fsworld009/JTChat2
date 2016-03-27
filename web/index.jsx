require("./css/semantic.css");

window.jQuery = window.$ = require("jquery");
var semantic = require("./js/semantic.js");
var React = require("react");
var ReactDOM = require("react-dom");





var HelloWorld = React.createClass({
  render: function() {
    return (
      <p>
        Hello, <input type="text" placeholder="Your name here" />!
        It is {this.props.date.toTimeString()}
      </p>
    );
  }
});

setInterval(function() {
  ReactDOM.render(
    <HelloWorld date={new Date()} />,
    document.getElementById('app')
  );
}, 500);
