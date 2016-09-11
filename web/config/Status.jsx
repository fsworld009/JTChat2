
var React = require("react");
import { connect } from 'react-redux';

function mapStateToProps(state){
  return {sites: state};
}

function mapDispatchToProps(dispatch){
  return {};
}



var Status = React.createClass({
  render: function(){
    return (<div>Status</div>);
  }
});

var StatusContainer = connect(mapStateToProps, mapDispatchToProps)(Status);
module.exports = StatusContainer;
