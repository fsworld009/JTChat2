
var React = require("react");
import { connect } from 'react-redux';

function mapStateToProps(state){
  return {sites: state};
}

function mapDispatchToProps(dispatch){
  return {};
}



var Theme = React.createClass({
  render: function(){
    console.log(this.props);
    return (<div>Theme</div>);
  }
});

var ThemeContainer = connect(mapStateToProps, mapDispatchToProps)(Theme);
module.exports = ThemeContainer;
