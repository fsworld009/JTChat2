var React = require("react");
import { connect } from 'react-redux';
import {Segment, IconButton, Button, Items, SegmentItem} from "./Semantic.jsx";
import {Form, TextInput, Dropdown, Toggle, Textarea, Colorpicker} from "./Semantic_Form.jsx";
var _ = require("lodash");
var util = require("./util.js");
var InputRenderer = require("./InputRenderer.jsx");
var InputViewRenderer = require("./InputViewRenderer.jsx");
import { push } from 'react-router-redux';
import {saveConfig} from './ajax.js';
import {lang, getDB} from "./database.js";

function mapStateToProps(state){
  return {
    profilesById: state.get("profilesById"),
    profiles: state.get("profiles")
  };
}

function mapDispatchToProps(dispatch){
  return {
    updateConfig: function(params){
      dispatch(_.extend({type: "UPDATE_CONFIG"},params));
      dispatch(push("/config/profile/"));
    },

    deleteConfigObj: function(params){
      dispatch(_.extend({type: "DELETE_CONFIG_OBJ"},params));
      dispatch(push("/config/profile/"));
    },
  };
}

var EditProfile = React.createClass({
  getInitialState: function(){
    console.log("getInitialState", this.props);
    return {
      themeId: null
    };
  },

  save: function(){
    var originalSavedOptions = this.originalSavedOptions;
    var savedOptions = util.saveForm(this, this.formOptions);
    this.props.updateConfig({
      category: "profiles",
      id: this.props.params.profileId,
      options: savedOptions
    });

  },
  
  deleteObj: function(){
    this.props.deleteConfigObj({
      category: "profiles",
      id: this.props.params.profileId
    });

  },

  selectTheme: function(){
    var $this = util.getJqueryDom(this);
    var $theme = $this.find("input[name=themeId]");
    this.setState({themeId: $theme.val()});
  },

  render: function(){
    
    var params = this.props.params;
    var mode = params.mode;
    var profileId = params.profileId;
    var profile = this.props.profilesById.get(String(profileId));
    var themeLang = lang("themeLang", true);
    var themeIdList = getDB("themes");
    var language = lang("profile", true);


    var title, savedOptions;
    if(typeof profileId == "undefined"){
      //new
      title= lang("common.newTitle").replace("%name%",language("title"));
      savedOptions={};
    }else{
      var stringPath = "common." + mode + "Title";
      title= lang(stringPath).replace("%name%",language("title"));
      savedOptions = profile.toJS();
    }


    var themeId = this.state.themeId || savedOptions.themeId;
    console.log("themeId", themeId);

    var options = [
      {"name": "displayName", "type": "text", "default": ""},
      {"name": "themeId", "type": "select", "options": themeIdList, "default": themeIdList[0], disabled: (themeId? true: false)},
    ];

    var themeOptionsLabel = {};
    _.each(themeIdList, function(themeId){
      themeOptionsLabel[themeId] = themeLang(themeId+".name");
    });

    var optionsLanguage = {
      "displayName" : {"label": language("displayName")},
      "themeId" : { "label": lang("theme.title"), options: themeOptionsLabel },
    };

    if(themeId){
      //append theme options after selecting the theme
      var themeDB = getDB("themes", themeId);
      options = options.concat(themeDB.options || []);
      _.extend(optionsLanguage, themeLang(themeId + ".options"));
    }

    this.originalSavedOptions = savedOptions;
    this.formOptions = options;

    var $content, $continue = null;
    if(mode == "delete"){
      $content = (
        <SegmentItem>
          <div className="" match="content">
            <Form>
              <InputViewRenderer options={options} language={optionsLanguage} savedOptions={savedOptions}></InputViewRenderer>
            </Form>
          </div>
          <div match="extra">
            <Button className="red" pull-right="true" onClick={this.deleteObj}>{lang("common.confirm")}</Button>
            <Button className="" pull-right="true" route="/config/profile/">{lang("common.cancel")}</Button>
            <br/><br/>
          </div>
        </SegmentItem>
      );
    }else{
      if(themeId){
        $continue = (
            <Button className="green" pull-right="true" onClick={this.save}>{lang("common.save")}</Button>
        );
      }else{
        $continue = (
            <Button className="blue" pull-right="true" onClick={this.selectTheme}>{lang("common.confirm")}</Button>
        );
      }
      $content = (
        <SegmentItem>
          <div className="" match="content">
            <Form>
              <InputRenderer options={options} language={optionsLanguage} savedOptions={savedOptions}></InputRenderer>
            </Form>
          </div>
          <div match="extra">
            {$continue}
            <Button className="" pull-right="true" route="/config/profile/">{lang("common.cancel")}</Button>
            <br/><br/>
          </div>
        </SegmentItem>
      );


    }

    return (
        <Segment title={title}>
          {$content}
        </Segment>
    );  
  }
});


var EditProfileContainer = connect(mapStateToProps, mapDispatchToProps)(EditProfile);
module.exports = EditProfileContainer;
