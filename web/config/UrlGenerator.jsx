
var React = require("react");
import { connect } from 'react-redux';

function mapStateToProps(state){
  return {sites: state};
}

function mapDispatchToProps(dispatch){
  return {};
}



var UrlGenerator = React.createClass({
  render: function(){
    console.log(this.props);
    return (<div>UrlGenerator</div>);
  }
});

var UrlGeneratorContainer = connect(mapStateToProps, mapDispatchToProps)(UrlGenerator);
module.exports = UrlGenerator;
