var React = require("react");
var ReactDOM = require("react-dom");
var util = require("./util.js");
var $ = require("jquery");
var _ = require("lodash");
import {Form, TextInput, Dropdown, Toggle, Textarea, Colorpicker} from "./Semantic_Form.jsx";

var InputRenderer = React.createClass({
  propTypes: {
    "options" : React.PropTypes.array.isRequired,
    "language": React.PropTypes.object.isRequired,
    "savedOptions" : React.PropTypes.object
  },

  optionMap: {
    number: {comp: TextInput, defaultProps:{}},
    text: {comp: TextInput, defaultProps:{}},
    password: {comp: TextInput, defaultProps:{password: true}},
    toggle: {comp: Toggle, defaultProps:{}},
    select: {comp: Dropdown, defaultProps:{}},
    multiselect: {comp: Dropdown, defaultProps: {multiselect: true}},
    color: {comp: Colorpicker, defaultProps: {}}
  },

  render: function(){
    var options = this.props.options;
    var language = this.props.language;
    var savedOptions = this.props.savedOptions || {};
    var $rows=[];
    var $row, $columns=[];
    var rowCounter=0, columnCounter=0, componentCounter=0;
    _.each(options, function(option){
      option = option || {};
      var optionMap = this.optionMap[option.type];
      if(!optionMap){
        return;
      }
      var componentLanguage = language[option.name] || {};
      var value;
      if(savedOptions[option.name] && option.type != "password"){
        value = savedOptions[option.name];
      }else{
        value = option.default || "";
      }
      var componentOption = _.extend({}, optionMap.defaultProps, {
        name: option.name,
        label: componentLanguage.label || option.name,
        defaultValue: value,
        placeholder: componentLanguage.tip || ""
      });
      if(option.disabled){
        componentOption.disabled = true;
      }
      if(option.options){
        componentOption.options = _.map(option.options, function(value){
          var label = componentLanguage.options? componentLanguage.options[value]||value : value;
          return {value: value, label: label};
        });
      }
      var $component = React.createElement(optionMap.comp, componentOption);
      var $column = (<div key={rowCounter + "-" + columnCounter} className="column" style={{paddingBottom: "15px"}}>{$component}</div>);
      $columns.push($column);
      columnCounter++;

      componentCounter++;
      if(columnCounter>=2 || (columnCounter < 2 && componentCounter==options.length)){
        $row = (<div key={rowCounter} className="two column row">{$columns}</div>);
        $rows.push($row);
        $columns=[];
        columnCounter=0;
        rowCounter++;
      }

    }.bind(this));

    return (
      <div className="ui grid">{$rows}</div>
    );
  }
});


module.exports = InputRenderer;
