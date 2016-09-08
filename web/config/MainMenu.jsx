var React = require("react");
var util = require("./util.js");
var $ = require("jquery");
var _ = require("lodash");
import { connect } from 'react-redux';
import {Dropdown} from "./Semantic_Form.jsx";
import {Link} from "react-router";
import {lang} from "./language.js";
function mapStateToProps(state){
  return {
  };
}

function mapDispatchToProps(dispatch){
  return {};
}

var rootPath = "/config/";
var MainMenu = React.createClass({
  render: function(){
    
    var menuItems = _.map(["status","site","user","theme","profile","url"], function(path){
      return {
        path: path,
        label: lang(path+".title")
      };
    });

    var currentPath = (this.props.currentPath || "").replace(/^\/config\/([^\/]*)(.*$)/, function(match, $1){
      return $1;
    });

    var inEdit = (this.props.currentPath || "").search(/\/(edit|new)\//) > -1;

    var currentMenuItem = _.find(menuItems, function(menuItem){
      return menuItem.path == currentPath;
    });
    if(currentMenuItem){
      currentMenuItem.selected = true;
    }else{
      menuItems[0].selected = true;
    }
    return (
      <div className="ui blue secondary pointing menu">
        {menuItems.map(function(menuItem){
            if(inEdit){
              return <a href="javascript:void(0)" key={menuItem.path} className="item disabled" >{menuItem.label}</a>;
            }else{
              return <Link key={menuItem.path} className={"item"+ (menuItem.selected? " active":"")} to={rootPath + menuItem.path}>{menuItem.label}</Link>;
            }
        })}
      </div>
    );
  }
});


var MainMenuContainer = connect(mapStateToProps, mapDispatchToProps)(MainMenu);
module.exports = MainMenuContainer;
