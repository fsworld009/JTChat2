var React = require("react");
var ReactServer = require("react-dom/server");
var _ = require("lodash");
var DataTable = require("./DataTable.jsx");
import { connect } from 'react-redux';
import {Segment, IconButton} from './Semantic.jsx';
import {lang, getDB} from "./database.js";

function mapStateToProps(state){
  return {
    usersById: state.get("usersById"),
    users: state.get("users")
  };
}

function mapDispatchToProps(dispatch){
  return {};
}



var User = React.createClass({
  renderActionButtons: function(userId){
    return (
      <span>
        <IconButton iconClass="fa fa-pencil" className="green" popup-content={lang("common.edit")} route={"/config/user/edit/" + userId}></IconButton>
        <IconButton iconClass="fa fa-trash" className="red" popup-content={lang("common.delete")} route={"/config/user/delete/" + userId}></IconButton>
      </span>
    );
  },

  getSiteFromSiteId: function(siteId){
    return lang("site.sitesById."+siteId+".name");
  },

  render: function(){
    var users = this.props.users.toJS() || [];
    var usersById = this.props.usersById.toJS() || {};
    var language = lang("user");
    users = users.map(function(userId) {
      return usersById[userId] || {};
    });
    console.log("users", users);

    var options = {
      data: users,
      info: false,
      columns: [
        {title: lang("site.title"), data: "siteId", render: this.getSiteFromSiteId},
        {title: lang("user.username"), data: "username"},
        {title: lang("user.displayName"), data: "displayName"},
        {title: " ", data: "id", render: this.renderActionButtons}
      ],
      columnDefs: [
        { targets: [3], orderable: false, width: "8em"}
      ],
      lengthChange: false,
      paging: false,
      order: [],
      language: {
        search: lang("common.search")
      }
    };
    return (
      <Segment style={{position:"relative"}} title={language.title}>
        <DataTable className="selectable" options={options}></DataTable>
        <div style={{position: "absolute", left: "1em", top: "1em"}}><IconButton iconClass="fa fa-plus" className="green" popup-content="New" route={"/config/user/new/"}></IconButton></div>
      </Segment>
    );
  }
});

var UserContainer = connect(mapStateToProps, mapDispatchToProps)(User);
module.exports = UserContainer;
