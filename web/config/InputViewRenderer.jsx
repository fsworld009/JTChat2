var React = require("react");
var ReactDOM = require("react-dom");
var util = require("./util.js");
var $ = require("jquery");
var _ = require("lodash");
import {Form, TextInput, Dropdown, Toggle, Textarea, Colorpicker} from "./Semantic_Form.jsx";

var InputViewRenderer = React.createClass({
  propTypes: {
    "options" : React.PropTypes.array.isRequired,
    "language": React.PropTypes.object.isRequired,
    "savedOptions" : React.PropTypes.object
  },

  render: function(){
    var options = this.props.options;
    var language = this.props.language;
    var savedOptions = this.props.savedOptions || {};
    var $rows=[];
    var $row, $columns=[];
    var rowCounter=0, columnCounter=0;
    _.each(options, function(option){
      option = option || {};
      
      var componentLanguage = language[option.name] || {};
      var label = componentLanguage || option.name;
      var value="";
      if(savedOptions[option.name]){
        value = savedOptions[option.name].value;
      }else{
        value = option.default || "";
      }

      if(typeof value == "boolean"){
        value = String(value);
      }
      if(options.options){
        if(value instanceof Array){

        }else{

        }
      }

      if(value instanceof Array){
        value = value.join(", ");
      }

      if(option.options){
        componentOption.options = _.map(option.values, function(value){
          var label = componentLanguage.options? componentLanguage.options[value] : value;
          return {value: value, label: label};
        });
      }
      var $component = React.createElement(optionMap.comp, componentOption);
      var $column = (<div key={rowCounter + "-" + columnCounter} className="column" style={{paddingBottom: "15px"}}>{$component}</div>);
      $columns.push($column);
      columnCounter++;

      if(columnCounter>=2){
        $row = (<div key={rowCounter} className="two column row">{$columns}</div>);
        $rows.push($row);
        columnCounter=0;
        rowCounter++;
      }

    }.bind(this));


    return (
      <div className="ui vertically padded grid">{$rows}</div>
    );
  }
});


module.exports = InputRenderer;
