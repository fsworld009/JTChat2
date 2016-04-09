
var React = require("react");
import { connect } from 'react-redux';

function mapStateToProps(state){
  return {sites: state};
}

function mapDispatchToProps(dispatch){
  return {};
}



var Profile = React.createClass({
  render: function(){
    console.log(this.props);
    return (<div>Profile</div>);
  }
});

var ProfileContainer = connect(mapStateToProps, mapDispatchToProps)(Profile);
module.exports = ProfileContainer;
