var React = require("react");
var ReactServer = require("react-dom/server");
var _ = require("lodash");
var DataTable = require("./DataTable.jsx");
import { connect } from 'react-redux';
import { getId } from './ajax.js';
import {IconButton} from './Semantic.jsx';

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
  renderActionButtons: function(userId){
    userId = getId(userId);
    return (
      <span>
        <IconButton iconClass="fa fa-pencil" className="green" popup-content="Edit" route={"/config/user/edit/" + userId}></IconButton>
        <IconButton iconClass="fa fa-trash" className="red" popup-content="Delete" route={"/config/user/delete/" + userId}></IconButton>
      </span>
    );
  },

  getSiteFromSiteId: function(siteId){
    var siteRefId = getId(siteId);
    var site = this.props.sitesById.get(siteRefId);
    return site.get("displayName");
  },

  render: function(){
    var users = this.props.usersById.toJS();
    users = _.values(users);

    var options = {
      data: users,
      columns: [
        {title: "Site", data: "siteId", render: this.getSiteFromSiteId},
        {title: "URL ID", data: "urlId"},
        {title: "Username", data: "username"},
        {title: "Display Name", data: "displayName"},
        {title: " ", data: "id", render: this.renderActionButtons}
      ],
      columnDefs: [
        { targets: [4], orderable: false, width: "8em"}
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
