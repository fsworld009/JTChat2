
var React = require("react");
import { connect } from 'react-redux';

function mapStateToProps(state){
  return {sites: state};
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
module.exports = SiteContainer;
