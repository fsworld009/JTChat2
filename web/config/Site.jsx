
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
  getInitialState() {
    return {
        site: null
    };
  },

  // componentDidUpdate: function(){
  //   console.log("EditSiteModal updatet");
  // },

  show: function(siteProp){
    this.refs.modal.show({});
    this.setState({site: siteProp});
  },

  render: function(){
    var modalContent;
    if(this.state.site){
      modalContent = (
        <Modal ref="modal">
          <div className="header">
            Edit Site
          </div>
          <div className="content">
              <div className="ui header">Edit Site</div>
              <p>(Forms)</p>
              <p>You're now editing {this.state.site.get("displayName")}</p>
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
    }else{
      modalContent = (
        <Modal ref="modal">
          <div>No site</div>
        </Modal>
      );
    }
    return modalContent;
  }
});

var Site = React.createClass({
  editSite: function(){
    this.props.onEdit(this.props.site);
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
      </div>
    );
  }
});

var Sites = React.createClass({
  editSite: function(siteProp){
    this.refs.editModal.show(siteProp);
  },

  render: function(){
    var siteMap = this.props.sitesById;
    var view = this;
    return (
      <Segment title="Site">
        <div className="ui divided items">
          {
            this.props.sites.toArray().map(function(id){
              var site = siteMap.get(id);
              return (<Site key={id} site={site} onEdit={view.editSite}/>);
            })
          }
        </div>
        <EditSiteModal ref="editModal"/>
      </Segment>
    );
  }
});

var SiteContainer = connect(mapStateToProps, mapDispatchToProps)(Sites);
module.exports = SiteContainer;
