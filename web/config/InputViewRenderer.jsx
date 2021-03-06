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
    var rowCounter=0, columnCounter=0, componentCounter=0;
    _.each(options, function(option){
      option = option || {};
      
      var componentLanguage = language[option.name] || {};
      var label = componentLanguage.label || option.name;
      var value="";
      if(savedOptions[option.name]){
        value = savedOptions[option.name];
      }else{
        value = option.default;
      }
      switch(option.type){
        case "select": case "multiselect":
          if(value instanceof Array){
            value = _.map(value, function(savedVar){
              var label = componentLanguage.options? componentLanguage.options[savedVar]||savedVar : savedVar;
              return label;
            });
            value = value.join(", ");
          }else{
              value = componentLanguage.options? componentLanguage.options[value]||value : value;
          }
          break;
        case "password" :
          value = "*****";
          break;
        case "toggle":
          value = value? "ON" : "OFF";
          break;
        default:
          break;
      
      }

      var $component = (
        <div>
          {label} : {value}
        </div>);
      var $column = (<div key={rowCounter + "-" + columnCounter} className="column" >{$component}</div>);
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
      <div className="ui vertically padded grid">{$rows}</div>
    );
  }
});


module.exports = InputViewRenderer;
