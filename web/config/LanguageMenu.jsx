
var React = require("react");
var util = require("./util.js");
var $ = require("jquery");
var _ = require("lodash");
import { connect } from 'react-redux';
import {Dropdown} from "./Semantic_Form.jsx";
import {loadThemesLanguage} from "./ajax.js";
function mapStateToProps(state){
  return {
    langCode: state.get("langCode"),
    languages: state.get("languages"),
  };
}

function mapDispatchToProps(dispatch){
  return {
    changeLanguage:function(){
      var $this = util.getJqueryDom(this);
      var $input = $this.find("[name=lang]");
      var langCode = $input.val();
      dispatch({
        type: "SAVE_LANG",
        langCode: langCode
      });
      dispatch(loadThemesLanguage(langCode));
    }
  };

}

var LanguageMenu = React.createClass({
  render: function(){
    var inEdit = (this.props.currentPath || "").search(/\/(edit|new)\//) > -1;
    var className = "";
    if(inEdit){
      className = "disabled";
    }
    var languages = _.map(this.props.languages.toJS(), function(languageObj){
      return {
        value: languageObj.langCode,
        label: languageObj.name
      };
    }.bind(this));
    return (
      <Dropdown className={className} name="lang" label="" onChange={this.props.changeLanguage.bind(this)} defaultValue={this.props.langCode} options={languages}></Dropdown>
    );
  }

});


var LanguageMenuContainer = connect(mapStateToProps, mapDispatchToProps)(LanguageMenu);
module.exports = LanguageMenuContainer;
