
var React = require("react");
import { connect } from 'react-redux';
import {Segment, IconButton, BulletList, Modal, Button} from "./Semantic.jsx";
import {Form, TextInput, TextInputList, Textarea} from "./Semantic_Form.jsx";
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
                  <BulletList items={site.get("hosts").toArray()} />
                </div>
                <div className="column">
                  Ports
                  <BulletList items={site.get("ports").toArray()} />
                </div>
              </div>
            </div>
          </div>
          <div className="extra">
            <IconButton iconClass="fa fa-pencil" className="green" pull-right="true" popup-content="Edit" route={"/config/site/edit/_"+site.get("id")}></IconButton>
          </div>
        </div>
      </div>
    );
  }
});

var Sites = React.createClass({

  render: function(){
    var siteMap = this.props.sitesById;
    var view = this;
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
