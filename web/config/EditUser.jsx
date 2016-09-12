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
    updateConfig: function(params){
      dispatch(_.extend({type: "UPDATE_CONFIG"},params));
      dispatch(push("/config/user/"));
    },

  };
}

var EditUser = React.createClass({
  save: function(){
    var originalSavedOptions = this.originalSavedOptions;
    var savedOptions = util.saveForm(this, this.formOptions, originalSavedOptions);
    this.props.updateConfig({
      category: "users",
      id: this.props.params.userId,
      options: savedOptions
    });
  },

  render: function(){
    //params: from react-router
    //sitesById: from redux (provided by EditSiteContainer)
    var userId = this.props.params.userId;
    var user = this.props.usersById.get(String(userId));
    var renderProperties;
    var language = lang("user", true);
    var siteIdList = getDB("siteDefs");
    var options = [
      {"name": "displayName", "type": "text", "default": ""},
      {"name": "siteId", "type": "select", "options": siteIdList, "default": siteIdList[0]},
      {"name": "username", "type": "text", "default": ""},
      {"name": "password", "type": "password", "default": ""},
    ];

    var siteOptionsLabel = {};
    _.each(siteIdList, function(siteId){
      siteOptionsLabel[siteId] = lang("site.sitesById."+siteId+".name");
    });

    var optionsLanguage = {
      "displayName" : {"label": language("displayName")},
      "siteId" : { "label": lang("site.title"), options: siteOptionsLabel },
      "username" : {"label": language("username")},
      "password" : {"label": language("password"), "tip": language("passwordTip")}
    };

    var title, savedOptions;
    if(typeof userId == "undefined"){
      //new
      title= lang("common.newTitle").replace("%name%",language("title"));
      savedOptions={};
    }else{
      title= lang("common.editTitle").replace("%name%",language("title"));
      savedOptions = user.toJS();
    }

    this.formOptions = options;
    this.originalSavedOptions = savedOptions;
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
          <div className="ui red message">
            <p>{language("passwordWarning")}</p>
          </div>
        </Segment>
      );
  }
});


var EditUserContainer = connect(mapStateToProps, mapDispatchToProps)(EditUser);
module.exports = EditUserContainer;
