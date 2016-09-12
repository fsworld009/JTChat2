var React = require("react");
import { connect } from 'react-redux';
import {Segment, SegmentItem,  IconButton, BulletList, Modal, Button} from "./Semantic.jsx";
import {Form, TextInput, TextInputList, Textarea} from "./Semantic_Form.jsx";
var InputRenderer = require("./InputRenderer.jsx");
var _ = require("lodash");
var util = require("./util.js");
import { push } from 'react-router-redux';
import {saveConfig} from './ajax.js';
import {lang, getDB} from "./database.js";

function mapStateToProps(state){
  return {
    sitesById: state.get("sitesById")
  };
}

function mapDispatchToProps(dispatch){
  return {
    updateSite: function(params){
      dispatch(_.extend({type: "UPDATE_CONFIG"},params));
      dispatch(push("/config/site/"));
    },
  };
}

var EditSite = React.createClass({
  save: function(){
    var savedOptions = util.saveForm(this, this.formOptions);
    this.props.updateSite({
      category: "sites",
      id: this.props.params.siteId,
      options: savedOptions
    });
  },
  render: function(){
    var siteId = this.props.params.siteId;
    var site = this.props.sitesById.get(siteId);
    var siteDef = getDB("siteDefs",siteId);
    var language = lang("site.sitesById."+siteId, true);
    var options = siteDef.options || [];
    this.formOptions = options;
    var savedOptions = {};
    if(typeof site !== "undefined"){
      savedOptions = _.keyBy(site.get("options").toJS(), "name");
    }
    var optionsLanguage = language("options") || {};
    return (
        <Segment title={lang("common.editTitle").replace("%name%",language("name"))}>
          <SegmentItem>
            <div className="" match="content">
              <Form>
                <InputRenderer options={options} language={optionsLanguage} savedOptions={savedOptions}></InputRenderer>
              </Form>
            </div>
            <div match="extra">
              <Button className="green" pull-right="true" onClick={this.save}>{lang("common.save")}</Button>
              <Button className="" pull-right="true" route="/config/site/">{lang("common.cancel")}</Button>
              <br/><br/>
            </div>
          </SegmentItem>
        </Segment>
      );
  }
});


var EditSiteContainer = connect(mapStateToProps, mapDispatchToProps)(EditSite);
module.exports = EditSiteContainer;
