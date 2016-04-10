
var React = require("react");
import { connect } from 'react-redux';
import {Segment} from "./Semantic.jsx";

function mapStateToProps(state){
  return {sites: state};
}

function mapDispatchToProps(dispatch){
  return {};
}



var Site = React.createClass({
  render: function(){
    //console.log(this.props);
    //return (<div>Site</div>);
    return (
      <Segment title="Site">
        <div>123</div>
      </Segment>
    );
  }
});

var SiteContainer = connect(mapStateToProps, mapDispatchToProps)(Site);
module.exports = SiteContainer;
