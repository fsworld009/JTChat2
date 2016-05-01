
var React = require("react");
import { connect } from 'react-redux';
import {Segment, IconButton, BulletedList} from "./Semantic.jsx";
var _ = require("lodash");

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


  render: function(){

  }
});

var Site = React.createClass({
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
            <IconButton iconClass="fa fa-pencil" className="green" pull-right="true" popup-content="Edit"></IconButton>
          </div>
        </div>
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
