var React = require("react");
var ReactDOM = require("react-dom");
var util = require("./util.js");

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

SemanticUI.IconButton = React.createClass({
  propTypes: {
    extraClass: React.PropTypes.string,
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
    var className = util.mergeClassName(this, "ui circular icon button", {
      "pull-right": {"true":"right floated"}
    });
    return (
      <button className={className} data-content={this.props["popup-content"]} onClick={this.props.onClick}>
        <i className={this.props.iconClass}></i>
      </button>
    );
  }
});

SemanticUI.BulletedList = React.createClass({
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

  show: function(options){
    var $this = util.getJqueryDom(this);
    var reactComponent = this;
    if(!this.state.initialized){
      console.log("initialized");
      options =  {
        detachable: false,
        closable: false,
        selector: {
          approve  : '.actions .confirm',
          deny: '.actions .deny'
        },
        onVisible: function(){
          console.log("onVisible");
          reactComponent.setState({
            initialized: true,
            visible: true
          });
        },
        onHidden: function(){
          console.log("onHidden");
          reactComponent.setState({
            initialized: true,
            visible: false
          });
        },
        onApprove: function(){
          console.log("onApprove", arguments);
          return false;
        },
        onDeny: function(){
          console.log("onDeny", arguments);
        }
      };
      $this.modal(options);
    }
    $this.modal("show");
    //this.setState();
  },

  componentDidMount: function(){
    console.log("componentDidMount");
  },

  componentDidUpdate: function(){
    console.log("componentDidUpdate");
    var $this = util.getJqueryDom(this);
    $this.modal("refresh");
  },

  componentWillUnmount: function(){
    console.log("componentWillUnmount");
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
