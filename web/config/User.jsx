var React = require("react");
var ReactServer = require("react-dom/server");
var _ = require("lodash");
var DataTable = require("./DataTable.jsx");
import { connect } from 'react-redux';
import { getId } from './ajax.js';
import {Segment, IconButton} from './Semantic.jsx';

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
        {title: "Username", data: "username"},
        {title: "Display Name", data: "displayName"},
        {title: "URL ID", data: "urlId"},
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
      <Segment style={{position:"relative"}} title="User">
        <DataTable className="selectable" options={options}></DataTable>
        <div style={{position: "absolute", left: "1em", top: "1em"}}><IconButton iconClass="fa fa-plus" className="green" popup-content="New" route={"/config/user/new/"}></IconButton></div>
      </Segment>
    );
  }
});

var UserContainer = connect(mapStateToProps, mapDispatchToProps)(User);
module.exports = UserContainer;
