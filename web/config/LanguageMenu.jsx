
var React = require("react");
var util = require("./util.js");
var $ = require("jquery");
var _ = require("lodash");
import { connect } from 'react-redux';
import {Dropdown} from "./Semantic_Form.jsx";
function mapStateToProps(state){
  return {
    langCode: state.get("langCode"),
    languages: state.get("languages"),
    languageByCode: state.get("languageByCode")
  };
}

function mapDispatchToProps(dispatch){
  return {
    changeLanguage:function(){
      var $this = util.getJqueryDom(this);
      var $input = $this.find("[name=lang]");
      console.log("select", $input.val());
      dispatch({
        type: "SAVE_LANG",
        langCode: $input.val()
      });
    }
  };

}

var LanguageMenu = React.createClass({
  render: function(){
    var languages = _.map(this.props.languages.toArray(), function(langCode){
      var languageObj = this.props.languageByCode.get(langCode).toJS();
      return {
        value: languageObj.langCode,
        label: languageObj.name
      };
    }.bind(this));
    return (
      <Dropdown name="lang" label="" onChange={this.props.changeLanguage} defaultValue={this.props.langCode} options={languages}></Dropdown>
    );
  }

});


var LanguageMenuContainer = connect(mapStateToProps, mapDispatchToProps)(LanguageMenu);
module.exports = LanguageMenuContainer;
