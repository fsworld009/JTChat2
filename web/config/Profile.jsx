var React = require("react");
import { connect } from 'react-redux';
import {Segment, SegmentItem, Items, IconButton} from './Semantic.jsx';
var _ = require("lodash");
var util = require("./util.js");
import {lang, getDB} from "./database.js";
var InputViewRenderer = require("./InputViewRenderer.jsx");

function mapStateToProps(state){
  return {
    profiles: state.get("profiles"),
    profilesById: state.get("profilesById")
  };
}

function mapDispatchToProps(dispatch){
  return {};
}



var Profile = React.createClass({
  render: function(){
    var profile = this.props.profile;
    var profileId = profile.get("id");
    var themeDef = this.props.themeDef;
    var themeLang = this.props.themeLang;
    var language = this.props.language;
    var options = [
      {"name": "displayName", "type": "text"},
      {"name": "themeId", "type": "select"}
    ];
    options = options.concat(themeDef.options || []);
    var savedOptions = profile.toJS() || {};
    var optionsLanguage = _.extend({}, language.options, themeLang("options"), {
      themeId: {
        label: lang("theme.title"),
        options: {[savedOptions.themeId] : themeLang("name")}
      } 
    });

    return (
      <SegmentItem title={language.name}>
          <div match="content" className="ui grid">
            <InputViewRenderer options={options} language={optionsLanguage} savedOptions={savedOptions}/>
          </div>
          <div match="extra">
            <IconButton iconClass="fa fa-trash" className="red"  pull-right="true" popup-content={lang("common.delete")} route={"/config/profile/delete/" + profileId}></IconButton>
            <IconButton iconClass="fa fa-pencil" className="green" pull-right="true" popup-content={lang("common.edit")} route={"/config/profile/edit/"+profileId}></IconButton>
          </div>
      </SegmentItem>
    );
  }
});

var Profiles = React.createClass({
  /*componentDidMount: function(){
    if(this.props.loadingThemes){
      this.props.loadThemes();
    }

  },*/

  render: function(){
    var profilesById = this.props.profilesById;
    var language = lang("profile");
    var themes = getDB("themes");
    return (
      <Segment title={language.title}>
        <IconButton iconClass="fa fa-plus" className="green" popup-content={lang("common.new")} route={"/config/profile/new/"}></IconButton>
        <Items>
          {
            util.listToComponents(this.props.profiles.toArray(), function(id, key){
              var profile = profilesById.get(id);
              var themeId = profile.get("themeId");
              var themeDef = getDB("themes", themeId);
              var themeLang = lang("themeLang."+themeId, true);
              return (<Profile themeDef={themeDef} language = {language} themeLang={themeLang} key={key} profile={profile}/>);
            })
          }
        </Items>
      </Segment>
    );
  }
});
var ProfileContainer = connect(mapStateToProps, mapDispatchToProps)(Profiles);
module.exports = ProfileContainer;
