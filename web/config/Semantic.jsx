var React = require("react");
var ReactDOM = require("react-dom");

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
    iconClass: React.PropTypes.string.isRequired
  },

  componentDidMount: function(){
    var $this = $(ReactDOM.findDOMNode(this));
    console.log($this);
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
    var className = "ui circular icon button";
    if(this.props.extraClass){
      className = className + " " + this.props.extraClass;
    }
    if(this.props["pull-right"]==="true"){
      className = className + " right floated";
    }

    return (
      <button className={className} data-content={this.props["popup-content"]}>
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
            return (<li key={counter}>{item}</li>);
          })
        }
      </ul>
    );
  }
});


module.exports = SemanticUI;
