var $ = require("jquery");
var _ = require("lodash");
var util = require("./util.js");
require("../css/dataTables.font-awesome.css");
require("../js/jquery.dataTables");
require("../js/dataTables.semanticui.js");


var DataTable = React.createClass({
  propTypes: {
    "options": React.PropTypes.object.isRequired
  },

  componentDidMount: function(){
    var $this = util.getJqueryDom(this);
    if(this.props.options.columns instanceof Array && this.props.options.columns.length>0 && this.props.options.data instanceof Array){
      _.each(this.props.options.columns, function(column){
        if(typeof column.defaultContent == 'undefined'){
          column.defaultContent = "-";
        }
      });
      $this.dataTable(this.props.options);
      this.hasDataTableInstance = true;
    }else{
      this.hasDataTableInstance = false;
    }
  },

  componentDidUpdate: function(){
    if(this.hasDataTableInstance){
      var $this = util.getJqueryDom(this);
      $this.DataTable().draw();
    }
  },

  componentWillUnmount: function(){
    if(this.hasDataTableInstance){
      var $this = util.getJqueryDom(this);
      $this.DataTable().destroy();
    }
  },
  render: function(){
    var className = util.mergeClassName(this, ["ui celled table", this.props.className]);
    return (
      <table className={className}>
        <tbody></tbody>
        <thead></thead>
      </table>
    );
  }
});


module.exports = DataTable;
