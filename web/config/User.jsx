var React = require("react");
var _ = require("lodash");
var DataTable = require("./DataTable.jsx");
import { connect } from 'react-redux';
import { getId } from './ajax.js';

function mapStateToProps(state){
  return {
    usersById: state.get("usersById"),
    users: state.get("users"),
    sitesById: state.get("sitesById")
  };
}

function mapDispatchToProps(dispatch){
  return {};
}



var User = React.createClass({
  getSiteFromSiteId: function(siteId){
    var siteRefId = getId(siteId);
    var site = this.props.sitesById.get(siteRefId);
    return site.get("displayName");
  },

  render: function(){
    console.log("User",this.props);
    var users = this.props.usersById.toJS();
    users = _.values(users);

    var options = {
      data: users,
      columns: [
        {title: "Site", data: "siteId", render: this.getSiteFromSiteId},
        {title: "URL ID", data: "urlId"},
        {title: "Username", data: "username"},
        {title: "Display Name", data: "displayName"}
      ],
      lengthChange: false,
      paging: false,
      order: []
    };
    return (
      <DataTable options={options}></DataTable>
    );
  }
});

var UserContainer = connect(mapStateToProps, mapDispatchToProps)(User);
module.exports = UserContainer;
