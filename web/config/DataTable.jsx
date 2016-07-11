var $ = require("jquery");
var _ = require("lodash");
var util = require("./util.js");
require("../css/dataTables.font-awesome.css");
require("../js/jquery.dataTables");
require("../js/dataTables.semanticui.js");


var DataTable = React.createClass({
  propTypes: {
    "options": React.PropTypes.object
  },

  componentDidMount: function(){
    var $this = util.getJqueryDom(this);
console.log("options", this.props.options);
    $this.dataTable(this.props.options);
  },

  componentDidUpdate: function(){
    var $this = util.getJqueryDom(this);
    $this.DataTable().draw();
  },

  componentWillUnmount: function(){
    var $this = util.getJqueryDom(this);
    $this.DataTable().destroy();
  },

  renderDataCell: function(data, columns){
    var cells = [];
    _.each(columns, function(column){
      var defaultContent = typeof column.defaultContent == "undefined"? "-" : column.defaultContent;
      var cellData;
      var attributes = ["data", "render"];
      _.each(attributes, function(attribute){
        switch(typeof column[attribute]){
          default: case "string":
            cellData = data[column[attribute]];
            break;
          case "function" :
            var passInData = attribute=="data"? data: cellData;
            cellData = column[attribute](passInData, column);
            break;
          case "undefined" :
            break;
        }
      });
      cellData = (typeof cellData == "undefined" || cellData == null) ? defaultContent : cellData;
      cells.push(cellData);
    });
    var key=0;
    return (cells.map(function(cell){key++;return (<td key={key}>{cell}</td>);}));
  },

  renderRow: function(data, columns){
    var rows = [];
    _.each(data, function(dataObject){
      rows.push(this.renderDataCell(dataObject, columns));
    }.bind(this)); 
    var key=0;
    return (rows.map(function(row){key++;return (<tr key={key}>{row}</tr>);}));
  },

  render: function(){
    var className = util.mergeClassName(this, ["ui celled table", this.props.className]);
    var options = this.props.options;
    this.isValidTable = options.columns instanceof Array && options.columns.length>0 && options.data;
    if(this.isValidTable){
        this.thead = (<thead><tr>
          {options.columns.map(function(column){
            return (<th key={column.title}>{column.title}</th>);
          })} 
        </tr></thead>);
        

      this.tbody = (<tbody>
        {this.renderRow(options.data, options.columns)}
      </tbody>);
      delete options.data;
      delete options.columns;
    }


    return (
      <table className={className}>
        {this.thead}
        {this.tbody}
      </table>
    );
  }
});


module.exports = DataTable;
