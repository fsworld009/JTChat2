var React = require("react");
import { connect } from 'react-redux';
import {Segment, IconButton, Button, Items, SegmentItem} from "./Semantic.jsx";
import {Form, TextInput, Dropdown, Toggle, Textarea, Colorpicker} from "./Semantic_Form.jsx";
var _ = require("lodash");
var util = require("./util.js");
import { push } from 'react-router-redux';
import {saveConfig} from './ajax.js';
var InputRenderer = require("./InputRenderer.jsx");

function mapStateToProps(state){
  return {
    sitesById: state.get("sitesById"),
    themes: state.get("themes"),
    themesById: state.get("themesById"),
    profilesById: state.get("profilesById"),
    profiles: state.get("profiles")
  };
}

function mapDispatchToProps(dispatch){
  return {
    saveProfile: function(params){
      dispatch(_.extend({type: "SAVE_SITE"},params));
      dispatch(push("/config/profile/"));
    },
  };
}

var EditProfile = React.createClass({
  getInitialState: function(){
    return {
      themeId: null
    };
  },
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
  onChangeTheme: function(value, label, $dropdown){
    console.log(this);
    this.setState({themeId : value});
  },

  onChangeColorTest: function(event, color){
    console.log("EditProfile view get color: ", color, this);
  },

  render: function(){
    //params: from react-router
    //sitesById: from redux (provided by EditSiteContainer)
    var currentLanguage = "en";
    var profileId = this.props.params.profileId;
    var profile;
    var renderProperties;
    var themesById = this.props.themesById;
    var themeOptionLabels = {};
    _.each(this.props.themes.toArray(), function(themeId){
      var theme = themesById.get(themeId);
      themeOptionLabels[themeId] = theme.getIn(["language",currentLanguage,"theme","displayName"]);
    });
    var themes = {
      options: this.props.themes.toArray(),
      labels: themeOptionLabels
    };
    if(typeof profileId == "undefined"){
      //new
      renderProperties = {
        title: "New"
      };
    }else{
      renderProperties = {
        title: "Edit"
      };
      profile = this.props.profilesById.get(profileId);
      _.extend(renderProperties, profile.toObject());
    
    }

    var basic = {
      "options": [
          {"name": "profileName", "type": "text"},
          {"name": "themeId", "type": "select", "options":themes.options}
        ],
        "language":{
          "en": {
            "options": {
              "profileName" : {"label": "Profile Name"},
              "themeId" : {"label": "Theme", "tip":"Select a theme", "options": themes.labels}
            }
          }
        }
    };


    return (
        <Segment title={renderProperties.title + " Profile"}>
          <Form>
            <Items>
              <SegmentItem title="Profile Setting">
                <div match="content">
                  <InputRenderer options={basic.options} language={basic.language[currentLanguage].options} />
                </div>
              </SegmentItem>
            </Items>
            <Toggle name="toggle" label="Toggle" placeholder="Placeholder" defaultChecked="checked"></Toggle>
            <Colorpicker name="color" label="label" placeholder="Choose Color" onChange={this.onChangeColorTest}/>
            <Colorpicker name="color2" label="label2" placeholder="Choose Color" onChange={this.onChangeColorTest}/>
          </Form>
          <br/><br/>
            <Button className="green" pull-right="true" onClick={this.save}>Save</Button>
            <Button className="" pull-right="true" route="/config/profile/">Cancel</Button>
          <br/><br/>

        </Segment>
      );
  }
});


var EditProfileContainer = connect(mapStateToProps, mapDispatchToProps)(EditProfile);
module.exports = EditProfileContainer;
