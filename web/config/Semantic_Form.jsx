var React = require("react");
var ReactDOM = require("react-dom");
var util = require("./util.js");
var $ = require("jquery");
var _ = require("lodash");

var SemanticUI={};

SemanticUI.Form = React.createClass({
  render: function(){
    var className = util.mergeClassName(this, ["ui form", this.props.className]);
    return (
      <form {..._.extend({}, this.props, {className: className})}>
        {this.props.children}
      </form>
    );
  }
});

SemanticUI.FormField = React.createClass({
  render: function(){
    return (
      <div className="field">
        <label>{this.props.label}</label>
        {this.props.children}
      </div>
    );
  }
});

SemanticUI.TextInput = React.createClass({
  render: function(){
    var divClassName = util.mergeClassName(this, ["ui input"],{
      "iconClass" : {
        "*": "icon"
      },
      "required" : {
        "true" : ""
      }
    });
    return (
      <SemanticUI.FormField label={this.props.label}>
        <div className={divClassName}>
          {this.props.required==="true"? <i className="fa fa-asterisk red"></i> : null}
          {this.props.iconClass? <i className={util.mergeClassName(this, ["icon", this.props.iconClass])}></i> : null}
          <input {..._.extend({}, this.props, {type: (this.props.password == "true"?"password":"text"), iconClass: undefined, required: undefined, label: undefined})}/>
        </div>
      </SemanticUI.FormField>
    );
  }
});

SemanticUI.Textarea = React.createClass({
  val: function(value){
    var $this = util.getJqueryDom(this);
    var $textarea = $this.find("textarea");
    return typeof value == "undefined"? $textarea.val() : $textarea.val(value);
  },
  render: function(){
    return (
      <SemanticUI.FormField label={this.props.label}>
        <textarea {..._.extend({}, this.props, {label: undefined})}/>
      </SemanticUI.FormField>
    );
  }
});

SemanticUI.__TextInputList_Row = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    index: React.PropTypes.number.isRequired,
    value: React.PropTypes.string,
    isNew: React.PropTypes.bool
  },

  getInitialState: function(){
    var state={
      value: this.props.value
    };
    state.isNew = typeof this.props.value == "undefined";
    if(state.isNew){
      state.action == null;
    }else{
      state.action == typeof value=="undefined"? "revert" : "delete";
    }

    return state;
  },

  onAction: function(ev){

  },

  onChange: function(ev){
    var isNew = this.state.isNew;
    this.setState(
      {
        value: ev.currentTarget.value,
        isNew: false
      }
    );
    this.props.onChange(this.props.index, ev.currentTarget.value, isNew);
  },

  render: function(){

    var actionIconClass="";

    console.log(this.state, this.props.index);
    return (
      <div className="ui grid">
        <div className="column fifteen wide" style={{padding: "0.5em"}} data-index={this.props.index}>
          <div className="ui small input">
            <input type="text" defaultValue={this.props.value} className="ui input" onChange={this.onChange}/>
          </div>
          </div>
          <div className="column one wide" style={{padding: "0.5em"}}>
            {!this.state.isNew? <a href="javascript:void(0)" onClick={this.onAction}><i className="fa fa-trash fa-lg pink"/></a> : null}
          </div>
      </div>
    );
  }
});

SemanticUI.TextInputList = React.createClass({
  propTypes: {
    items: React.PropTypes.array.isRequired
  },

  onInputChange: function(index, value, appendNewInput){
    console.log("changed", index, value, appendNewInput);
    var items = this.state.items;
    items[index] = value;
    if(appendNewInput){
      this.setState({
        items: items.concat(undefined)
      });
    }else{
      this.setState({
        items: items.concat()
      });
    }
  },

  getInitialState: function(){
    return {
      items: this.props.items.concat(undefined)
    };
  },

  render: function(){
    var index=-1;
    var view=this;
      console.log("items",this.state.items);
      return (
        <div className="field">
          <label>{this.props.label}</label>
          {
            this.state.items.map(function(item){
              index++;
              return (
                <SemanticUI.__TextInputList_Row className="__TextInputList_Row" key={index} value={item} index={index} onChange={view.onInputChange}></SemanticUI.__TextInputList_Row>
              );
            })
          }
        </div>
      );

  }
});

SemanticUI.Dropdown = React.createClass({
  propTypes: {
    "label" : React.PropTypes.string.isRequired,
    "name" : React.PropTypes.string.isRequired,
    "placeholder" : React.PropTypes.string,
    "defaultValue": React.PropTypes.string,
    "options": React.PropTypes.array,
    "onChange" : React.PropTypes.func,
    "multiselect" : React.PropTypes.bool
  },


  componentDidMount: function(){
    var $this = util.getJqueryDom(this);
    var $selection = $this.find(".selection");
    var options = {};
    if(this.props.onChange){
      options.onChange = this.props.onChange;
    }
    $selection.dropdown(options);
  },

  componentDidUpdate: function(){
    var $this = util.getJqueryDom(this);
    var $selection = $this.find(".selection");
    $selection.dropdown('refresh');
  },

  componentWillUnmount: function(){
    var $this = util.getJqueryDom(this);
    var $selection = $this.find(".selection");
    $selection.dropdown('destroy');
  },
  render: function(){
    var multi = this.props.multiselect? "multiple" : "";
    return (
      <SemanticUI.FormField label={this.props.label}>
        <div className={"ui search selection dropdown "+multi}>
          <input name={this.props.name} defaultValue={this.props.defaultValue} type="hidden"/>
          <i className="dropdown icon fa fa-caret-down"></i>
          <div className="default text">{this.props.placeholder}</div>
          <div className="menu">
            {
              util.listToComponents(this.props.options || [], function(option, key){
                return (
                  <div key={key} className="item" data-value={option.value}>{option.label}</div>
                );
              })
            }
          </div>
        </div>
      </SemanticUI.FormField>
    );
  }
});

SemanticUI.Toggle = React.createClass({
  propTypes: {
    "label" : React.PropTypes.string.isRequired,
    "name" : React.PropTypes.string.isRequired,
    "placeholder" : React.PropTypes.string,
    "defaultValue": React.PropTypes.string,
    "onChange" : React.PropTypes.func
  },

  componentDidMount: function(){
    var $this = util.getJqueryDom(this);
    var $checkbox = $this.find(".checkbox");
    var options = {};
    console.log(this, $checkbox);
    if(this.props.onChange){
      options.onChange = this.props.onChange;
    }
    $checkbox.checkbox();
  },

  componentDidUpdate: function(){
    var $this = util.getJqueryDom(this);
    var $checkbox = $this.find(".checkbox");
    $checkbox.checkbox('refresh');
  },

  componentWillUnmount: function(){
    var $this = util.getJqueryDom(this);
    var $checkbox = $this.find(".checkbox");
    $checkbox.checkbox('destroy');
  },
  render: function(){
      return (
        <SemanticUI.FormField label={this.props.label}>
          <div className="ui toggle checkbox">
            <input className="hidden" type="checkbox"/>
            <label>{this.props.placeholder}</label>
          </div>
        </SemanticUI.FormField>
      );
  }


});
module.exports = SemanticUI;
