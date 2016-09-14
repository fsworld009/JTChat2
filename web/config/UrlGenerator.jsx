
var React = require("react");
import { connect } from 'react-redux';
import {Segment, SegmentItem,  IconButton, BulletList, Modal, Button} from "./Semantic.jsx";
import {Form, TextInput} from "./Semantic_Form.jsx";
var InputRenderer = require("./InputRenderer.jsx");
var _ = require("lodash");
var util = require("./util.js");
import {lang, getDB} from "./database.js";

function mapStateToProps(state){
  return {
    profiles: state.get("profiles"),
    profilesById: state.get("profilesById"),
    users: state.get("users"),
    usersById: state.get("usersById")
  };
}

function mapDispatchToProps(dispatch){
  return {};
}



var UrlGenerator = React.createClass({
  getInitialState: function(){
    return {
      siteId: null
    };
  },

  selectSite: function(){
    var $this = util.getJqueryDom(this);
    var $site = $this.find("input[name=siteId]");
    //dirty hack
    $this.find("input[name=userId]").parents(".selection").dropdown("clear");
    this.setState({siteId: $site.val()});
  },

  render: function(){
    var siteId = this.state.siteId || "";

    var language = lang("url");

    
    var options = [
      {"name": "siteId", "type": "select", "options": [], onChange: this.selectSite},
      {"name": "userId", "type": "select", "options": []},
      {"name": "profileId", "type": "select", "options": [] }
    ];

    var optionsLanguage = {
      "siteId": {"label": lang("site.title"), "options": {}},
      "userId": {"label": lang("user.title"), "options": {}},
      "profileId": {"label": lang("profile.title"), "options": {}}  
    };

    _.each(getDB("siteDefs"), function(siteId){
      options[0].options.push(siteId);
      optionsLanguage.siteId.options[siteId] = lang("site.sitesById."+siteId + ".name");
    });

    _.each(this.props.users.toArray(), function(userId){
      var user = this.props.usersById.get(userId);
      if(user.get("siteId") == siteId){
        options[1].options.push(userId);
        optionsLanguage.userId.options[userId] = user.get("displayName");
      }
    }.bind(this));
    if(siteId){
        options[1].default = options[1].options[0];
    }

    _.each(this.props.profiles.toArray(), function(profileId){
      options[2].options.push(profileId);
      optionsLanguage.profileId.options[profileId] = this.props.profilesById.get(profileId).get("displayName");
    }.bind(this));




    return (
      <Segment title={lang("url.title")}>
        <SegmentItem>
          <div className="" match="content">
            <Form>
              <InputRenderer options={options} language={optionsLanguage} savedOptions={{}}></InputRenderer>
            <Button className="green" pull-right="true" onClick={this.save}>{lang("common.save")}</Button>
              <TextInput name="url" label="Output Url" readOnly="readOnly"></TextInput>
            </Form>
          </div>
          <div match="extra">
          </div>
        </SegmentItem>
      </Segment>
    );
  }
});

var UrlGeneratorContainer = connect(mapStateToProps, mapDispatchToProps)(UrlGenerator);
module.exports = UrlGeneratorContainer;
