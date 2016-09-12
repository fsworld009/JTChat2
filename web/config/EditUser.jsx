var React = require("react");
import { connect } from 'react-redux';
import {Segment, SegmentItem, IconButton, Button} from "./Semantic.jsx";
import {Form, TextInput, Dropdown} from "./Semantic_Form.jsx";
var InputRenderer = require("./InputRenderer.jsx");
var _ = require("lodash");
var util = require("./util.js");
import { push } from 'react-router-redux';
import {saveConfig} from './ajax.js';
import {lang, getDB} from "./database.js";

function mapStateToProps(state){
  return {
    usersById: state.get("usersById"),
  };
}

function mapDispatchToProps(dispatch){
  return {
    saveUser: function(params){
      dispatch(_.extend({type: "SAVE_SITE"},params));
      dispatch(push("/config/user/"));
    },
  };
}

var EditUser = React.createClass({
  save: function(){
    var hosts = this.refs.hosts.val();
    hosts = hosts? hosts.split("\n") : [];
    var ports = this.refs.ports.val();
    ports = ports? ports.split("\n") : [];
    ports = _.map(ports, Number);
    this.props.saveSite({
      id: this.props.params.siteId,
      hosts: hosts,
      ports: ports
    });
  },
  render: function(){
    //params: from react-router
    //sitesById: from redux (provided by EditSiteContainer)
    var userId = this.props.params.userId;
    var user;
    var renderProperties;
    var language = lang("user", true);
    var siteIdList = getDB("siteDefs");
    var options = [
      {"name": "displayName", "type": "text", "default": ""},
      {"name": "siteId", "type": "select", "options": siteIdList, "default": siteIdList[0]}
    ];

    var siteOptionsLabel = {};
    _.each(siteIdList, function(siteId){
      siteOptionsLabel[siteId] = lang("site.sitesById."+siteId+".name");
    });

    var optionsLanguage = {
      "displayName" : {"label": language("displayName")},
      "siteId" : { "label": lang("site.title"), options: siteOptionsLabel }
    };

    var title, savedOptions;
    if(typeof userId == "undefined"){
      //new
      title= lang("common.newTitle").replace("%name%",language("title"));
      savedOptions={};
    }else{
      title= lang("common.editTitle").replace("%name%",language("title"));
      savedOptions = this.props.usersById.get(userId).toJS();
      savedOptions = _.keyBy(site.get("options").toJS(), "name");
    }
    console.log("savedOptions", savedOptions);
    return (
        <Segment title={title}>
          <SegmentItem>
            <div className="" match="content">
              <Form>
                <InputRenderer options={options} language={optionsLanguage} savedOptions={savedOptions}></InputRenderer>
              </Form>
            </div>
            <div match="extra">
              <Button className="green" pull-right="true" onClick={this.save}>{lang("common.save")}</Button>
              <Button className="" pull-right="true" route="/config/user/">{lang("common.cancel")}</Button>
              <br/><br/>
            </div>
          </SegmentItem>
        </Segment>
      );
  }
});


var EditUserContainer = connect(mapStateToProps, mapDispatchToProps)(EditUser);
module.exports = EditUserContainer;
