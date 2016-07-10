var $ = require("jquery");
var util = require("./util.js");
require("../css/dataTables.font-awesome.css");
require("../js/jquery.dataTables");
require("../js/dataTables.semanticui.js");


var DataTable = React.createClass({
  componentDidMount: function(){
    var $this = util.getJqueryDom(this);
    $this.dataTable({
      data:[{col1:"col1",col2:"col2"},{col1:"col1-2",col2:"col2-2"}],
      columns: [{title: "Col 1", data: "col1"}, {title: "Col 2", data: "col2"}],
      destroy: true,
      lengthChange: false
    });
  },

  componentDidUpdate: function(){
    var $this = util.getJqueryDom(this);
    $this.DataTable().draw();
  },

  componentWillUnmount: function(){
    var $this = util.getJqueryDom(this);
    $this.DataTable().destroy();
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
