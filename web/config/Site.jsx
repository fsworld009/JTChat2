var React = require("react");
import { connect } from 'react-redux';
import {Segment, SegmentItem, Items, IconButton, BulletList, Modal, Button} from "./Semantic.jsx";
import {Form, TextInput, TextInputList, Textarea} from "./Semantic_Form.jsx";
var _ = require("lodash");
var util = require("./util.js");
import {getId} from "./ajax.js";

function mapStateToProps(state){
  return {
    sitesById: state.get("sitesById"),
    sites: state.get("sites"),
    siteDefsById: state.get("siteDefsById"),
    siteDefs: state.get("siteDefs")
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
    var siteId = site.get("id");
    siteId = getId(siteId);

    return (
      <SegmentItem title={site.get("displayName")}>
          <img match="image" src={site.get("logo")} alt={site.get("displayName")} />
          <div match="content" className="ui grid">
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
          <IconButton match="extra" iconClass="fa fa-pencil" className="green" pull-right="true" popup-content="Edit" route={"/config/site/edit/"+siteId}></IconButton>
      </SegmentItem>
    );
  }
});

var Sites = React.createClass({

  render: function(){
    var siteDefsById = this.props.siteDefsById;
    var view = this;
    console.log(this.props.siteDefs.toArray());
    return (
      <Segment title="Site">
        <Items items=
          {
            util.listToComponents(this.props.siteDefs.toArray(), function(id, key){
              var siteDef = siteDefsById.get(id);
              return (<div key={key}>{id} {siteDef.get("name")} </div>);
              //return (<Site key={key} site={site}/>);
            })
          } />
      </Segment>
    );
  }
});

var SiteContainer = connect(mapStateToProps, mapDispatchToProps)(Sites);
module.exports = SiteContainer;
