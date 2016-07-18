
var React = require("react");
import { connect } from 'react-redux';
import {loadThemes} from "./ajax.js";

function mapStateToProps(state){
  var loadStatus = state.getIn(["load,themes"]);


  return {
    loadStatus: loadStatus,
    themes: state.get("themes"),
    themesById: state.get("themesById")
  };
}

function mapDispatchToProps(dispatch){
  return {
    loadThemes: function(){
      dispatch(loadThemes());
    }
  };
}



var Theme = React.createClass({
  /*componentDidMount: function(){
    if(this.props.loadingThemes){
      this.props.loadThemes();
    }

  },*/

  render: function(){
        return (<div>Theme</div>);
  }
});

var ThemeContainer = connect(mapStateToProps, mapDispatchToProps)(Theme);
module.exports = ThemeContainer;
