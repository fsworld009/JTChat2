
var React = require("react");
import { connect } from 'react-redux';
import {Segment, IconButton, BulletedList, Modal} from "./Semantic.jsx";
var _ = require("lodash");
var util = require("./util.js");

function mapStateToProps(state){
  return {
    sitesById: state.get("sitesById"),
    sites: state.get("sites")
  };
}

function mapDispatchToProps(dispatch){
  return {};
}

var EditSiteModal = React.createClass({
  show: function(){
    this.refs.modal.show({});
  },

  render: function(){
    return (
      <Modal ref="modal">
          <div className="header">
            Profile Picture
          </div>
          <div className="content">
              <div className="ui header">We've auto-chosen a profile image for you.</div>
              <p>Is it okay to use this photo?</p>
          </div>
          <div className="actions">
            <div className="ui red deny button">
              Cancel
            </div>
            <div className="ui right confirm blue button">
              Save
            </div>
          </div>
      </Modal>
    );
  }
});

var Site = React.createClass({
  editSite: function(){
    console.log(this, arguments);
    console.log("id", this.props.site.get("id"));
    console.log(this.refs)
    this.refs.editModal.show();
  },

  render: function(){
    var site = this.props.site;
    // var hosts = site.get("hosts").toArray();
    // var hostList = [];


    return (
      <div className="item">
        <div className="image">
          <i className="fa fa-twitch fa-3x" style={{color: "blue"}}></i>
        </div>
        <div className="content">
          <div className="header">{site.get("displayName")}</div>
          <div className="description">
            <div className="ui grid">
              <div className="three column row">
                <div className="column">
                  URL ID<br/><br/>
                  {site.get("urlId")}
                </div>
                <div className="column">
                  Hosts
                  <BulletedList items={site.get("hosts").toArray()} />
                </div>
                <div className="column">
                  Ports
                  <BulletedList items={site.get("ports").toArray()} />
                </div>
              </div>
            </div>
          </div>
          <div className="extra">
            <IconButton iconClass="fa fa-pencil" className="green" pull-right="true" popup-content="Edit" onClick={this.editSite}></IconButton>
          </div>
        </div>
        <EditSiteModal ref="editModal" state={site}/>
      </div>
    );
  }
});

var Sites = React.createClass({
  render: function(){
    var siteMap = this.props.sitesById;
    return (
      <Segment title="Site">
        <div className="ui divided items">
          {
            this.props.sites.toArray().map(function(id){
              var site = siteMap.get(id);
              return (<Site key={id} site={site}/>);
            })
          }
        </div>
      </Segment>
    );
  }
});

var SiteContainer = connect(mapStateToProps, mapDispatchToProps)(Sites);
module.exports = SiteContainer;
