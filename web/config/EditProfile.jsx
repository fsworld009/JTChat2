var React = require("react");
import { connect } from 'react-redux';
import {Segment, IconButton, Button} from "./Semantic.jsx";
import {Form, TextInput, Dropdown, Toggle, Colorpicker} from "./Semantic_Form.jsx";
var _ = require("lodash");
var util = require("./util.js");
import { push } from 'react-router-redux';
import {saveConfig} from './ajax.js';

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
  render: function(){
    //params: from react-router
    //sitesById: from redux (provided by EditSiteContainer)
    var currentLanguage = "en";
    var profileId = this.props.params.profileId;
    var profile;
    var renderProperties;
    var themesById = this.props.themesById;
    var themeOptions = _.map(this.props.themes.toArray(), function(themeId){
      var theme = themesById.get(themeId);
      return {value: themeId, label: theme.getIn(["language",currentLanguage,"theme","displayName"])};
    });
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
    console.log("Current state", this.state);
    return (
        <Segment title={renderProperties.title + " Profile"}>
          <Form>
            <Dropdown name="themeId" label="Select Theme" placeholder="Select Theme" options={themeOptions} onChange={this.onChangeTheme} defaultValue="default">
            </Dropdown>
            <Toggle name="toggle" label="Toggle" placeholder="Placeholder" defaultChecked="checked"></Toggle>
            <Colorpicker name="color" label="label"/>
          </Form>
        </Segment>
      );
  }
});


var EditProfileContainer = connect(mapStateToProps, mapDispatchToProps)(EditProfile);
module.exports = EditProfileContainer;
