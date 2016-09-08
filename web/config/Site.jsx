var React = require("react");
import { connect } from 'react-redux';
import {Segment, SegmentItem, Items, IconButton, BulletList, Modal, Button} from "./Semantic.jsx";
import {Form, TextInput, TextInputList, Textarea} from "./Semantic_Form.jsx";
var _ = require("lodash");
var util = require("./util.js");
var InputViewRenderer = require("./InputViewRenderer.jsx");
import {lang} from "./language.js";

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
    var siteDef = this.props.siteDef;
    var siteId = siteDef.get("id");
    var language = this.props.language;
    var options = siteDef.get("options").toJS();
    var savedOptions = {};
    if(typeof site !== "undefined"){
      savedOptions = _.keyBy(site.get("options").toJS(), "name");
    }
    var optionsLanguage = language.options || {};
    return (
      <SegmentItem title={language.name}>
          <img match="image" src={siteDef.get("logo")} alt={language.name} />
          <div match="content" className="ui grid">
            <InputViewRenderer options={options} language={optionsLanguage} savedOptions={savedOptions}/>
          </div>
          <IconButton match="extra" iconClass="fa fa-pencil" className="green" pull-right="true" popup-content={lang("common.edit")} route={"/config/site/edit/"+siteId}></IconButton>
      </SegmentItem>
    );
  }
});

var Sites = React.createClass({

  render: function(){
    var siteDefsById = this.props.siteDefsById;
    var sitesById = this.props.sitesById;
    var view = this;
    var language = lang("site");
    return (
      <Segment title={ language.title }>
        <Items>
          {
            util.listToComponents(this.props.siteDefs.toArray(), function(id, key){
              var siteDef = siteDefsById.get(id);
              var site = sitesById.get(id);
              var siteLang = language.sitesById[id];
              return (<Site key={key} siteDef={siteDef} site={site} language={siteLang}/>);
            })
          }
        </Items>
      </Segment>
    );
  }
});

var SiteContainer = connect(mapStateToProps, mapDispatchToProps)(Sites);
module.exports = SiteContainer;
