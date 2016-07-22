var React = require("react");
var ReactDOM = require("react-dom");
var util = require("./util.js");
var $ = require("jquery");
var _ = require("lodash");
import { Link } from 'react-router';

//Common semantic components for this project
var SemanticUI={};

SemanticUI.Segment = React.createClass({
  render: function(){
    return (<div>
      <h2 className="ui top attached header blue">
        {this.props.title}
      </h2>
      <div className="ui attached segment">
        {this.props.children}
      </div>
    </div>);
  }
});

SemanticUI.SegmentItem = React.createClass({
  render: function(){
    var childrenMatchMap = util.getChildrenMatchMap(this);
    
    var image = childrenMatchMap.image;
    var content = childrenMatchMap.content;
    var extra = childrenMatchMap.extra;

    return (
      <div className="item">
        { image ? (
        <div className="image">
          { image}
        </div>
        ) : null }
        <div className="content">
          <div className="header">{this.props.title}</div>
          <div className="description">
            { content || null }
          </div>
          { extra? (
          <div className="extra">
            { extra || null }
            </div>
          ) : null }
        </div>
      </div>
    );
  }
});

SemanticUI.Items = React.createClass({
    render: function(){
      return (
        <div className="ui divided items">
            { this.props.children}
        </div>
      );
    }
});

SemanticUI.IconButton = React.createClass({
  propTypes: {
    "pull-right": React.PropTypes.string,
    "popup-content": React.PropTypes.string,
    iconClass: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
  },

  componentDidMount: function(){
    var $this = $(ReactDOM.findDOMNode(this));
    //console.log($this);
    $this.popup({
      inline: true
    });
  },

  componentDidUpdate: function(){
    var $this = $(ReactDOM.findDOMNode(this));
    $this.popup("reposition");
  },

  componentWillUnmount: function(){
    var $this = $(ReactDOM.findDOMNode(this));
    $this.popup("destroy");
  },


  render: function(){
    var className = util.mergeClassName(this, ["ui circular icon button", this.props.className], {
      "pull-right": {"true":"right floated"}
    });

    if(this.props.route){
      return (<Link to={this.props.route} className={className} data-content={this.props["popup-content"]} onClick={this.props.onClick}>
        <i className={this.props.iconClass}></i>
      </Link>);
    }else{
      return (
        <a className={className} data-content={this.props["popup-content"]} onClick={this.props.onClick}>
          <i className={this.props.iconClass}></i>
        </a>
      );
    }
  }
});

SemanticUI.Button = React.createClass({
  render: function(){
    var className = util.mergeClassName(this, ["ui button", this.props.className], {
      "pull-right": {"true":"right floated"}
    });
    if(this.props.route){
      return (<Link {..._.extend({type: "button"}, this.props, {className: className, to: this.props.route})}></Link>);
    }else{
      return (
        <button {..._.extend({type: "button"}, this.props, {className: className})}></button>
      );
    }
  }
});

SemanticUI.BulletList = React.createClass({
  propTypes: {
    items: React.PropTypes.array.isRequired
  },
  render: function(){
    var counter=0;
    return (
      <ul className="ui list">
        {
          this.props.items.map(function(item){
            counter++;
            return (
              <li key={counter}>{item}</li>
            );
          })
        }
      </ul>
    );
  }
});

SemanticUI.Modal = React.createClass({
  propTypes:{},

  getInitialState() {
    return {
        initialized: false,
        visible: false,
    };
  },

  callbackToStateMap: {
    onVisible: {
      initialized: true,
      visible: true
    },

    onHidden: {
      initialized: true,
      visible: false
    }
  },

  show: function(options){
    var $this = util.getJqueryDom(this);
    var reactComponent = this;

    if(!this.state.initialized){
      options = $.extend(true, {}, options, {detachable: false});  //prevent moving the element to other cotainer
      _.each(this.callbackToStateMap, function(state, callbackFuncName){
        var clientCallbackFunc = options[callbackFuncName];
        var returnValue;
        options[callbackFuncName] = function(){
          if(typeof clientCallbackFunc == "function"){
            //lose the ability to use bind in client Componetnt
            returnValue = clientCallbackFunc.apply(this);
          }
          reactComponent.setState(state);
          return returnValue;
        };
      });
      $this.modal(options);
    }
    $this.modal("show");
  },

  componentDidMount: function(){
  },

  componentDidUpdate: function(){
    console.log("current state:", this.state);
    var $this = util.getJqueryDom(this);
    $this.modal("refresh");
  },

  componentWillUnmount: function(){
    var $this = util.getJqueryDom(this);
    $this.modal("hide");
  },

  render: function(){
    return (
      <div className="ui modal">
        {this.props.children};
      </div>
    );
  }
});
module.exports = SemanticUI;
