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
    var profile = this.props.profilesById.get(String(profile));
    var themeLang = lang("themeLang", true);
    var themeIdList = getDB("themes");
    var language = lang("profile", true);

    var options = [
      {"name": "displayName", "type": "text", "default": ""},
      {"name": "themeId", "type": "select", "options": themeIdList, "default": themeIdList[0], disabled: (this.state.themeId? true: false)},
    ];

    var themeOptionsLabel = {};
    _.each(themeIdList, function(themeId){
      themeOptionsLabel[themeId] = themeLang(themeId+".name");
    });

    var optionsLanguage = {
      "displayName" : {"label": language("displayName")},
      "themeId" : { "label": lang("theme.title"), options: themeOptionsLabel },
    };

    var title, savedOptions;
    if(typeof userId == "undefined"){
      //new
      title= lang("common.newTitle").replace("%name%",language("title"));
      savedOptions={};
    }else{
      var stringPath = "common." + mode + "Title";
      title= lang(stringPath).replace("%name%",language("title"));
      savedOptions = profile.toJS();
    }

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
      console.log("state", this.state);
      if(this.state.themeId){
        $continue = (
            <Button className="green" pull-right="true" onClick={this.save}>{lang("common.save")}</Button>
        );
      }else{
        $continue = (
            <Button className="green" pull-right="true" onClick={this.selectTheme}>{lang("common.confirm")}</Button>
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
