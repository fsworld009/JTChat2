var React = require("react");
import { connect } from 'react-redux';
import {Segment, SegmentItem,  IconButton, BulletList, Modal, Button} from "./Semantic.jsx";
import {Form, TextInput, TextInputList, Textarea} from "./Semantic_Form.jsx";
var InputRenderer = require("./InputRenderer.jsx");
var _ = require("lodash");
var util = require("./util.js");
import { push } from 'react-router-redux';
import {saveConfig} from './ajax.js';

function mapStateToProps(state){
  return {
    sitesById: state.get("sitesById"),
    siteDefsById: state.get("siteDefsById"),
    language: state.getIn(["currentLanguage","site"])
  };
}

function mapDispatchToProps(dispatch){
  return {
    saveSite: function(params){
      dispatch(_.extend({type: "SAVE_SITE"},params));
      dispatch(push("/config/site/"));
    },
  };
}

var EditSite = React.createClass({
  save: function(){
    //return; 
    this.props.saveSite({
      id: this.props.params.siteId,
      hosts: hosts,
      ports: ports
    });
  },
  render: function(){
    var siteId = this.props.params.siteId;
    var site = this.props.sitesById.get(siteId);
    var siteDef = this.props.siteDefsById.get(siteId);
    var language = this.props.language.toJS();
    var options = siteDef.get("options").toJS();
    var savedOptions = {};
    if(typeof site !== "undefined"){
      savedOptions = _.keyBy(site.get("options").toJS(), "name");
    }
    var optionsLanguage = language.sitesById[siteId].options;
    return (
        <Segment title={language.editTitle.replace("%name%",language.sitesById[siteId].name)}>
          <SegmentItem>
            <div className="ui grid" match="content">
              <Form>
                <InputRenderer options={options} language={optionsLanguage} savedOptions={savedOptions}></InputRenderer>
              </Form>
            </div>
            <div match="extra">
              <Button className="green" pull-right="true" onClick={this.save}>Save</Button>
              <Button className="" pull-right="true" route="/config/site/">Cancel</Button>
              <br/><br/>
            </div>
          </SegmentItem>
        </Segment>
      );
  }
});


var EditSiteContainer = connect(mapStateToProps, mapDispatchToProps)(EditSite);
module.exports = EditSiteContainer;
