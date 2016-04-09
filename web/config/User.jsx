var React = require("react");
import { connect } from 'react-redux';

function mapStateToProps(state){
  return {sites: state};
}

function mapDispatchToProps(dispatch){
  return {};
}



var User = React.createClass({
  render: function(){
    console.log(this.props);
    return (<div>User</div>);
  }
});

var UserContainer = connect(mapStateToProps, mapDispatchToProps)(User);
module.exports = UserContainer;
