
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
        siteId: null,
        profileId: null,
        userId: null
    };
  },

  selectSite: function(){
    var $this = util.getJqueryDom(this);
    var $site = $this.find("input[name=siteId]");
    //dirty hack
    $this.find("input[name=userId]").parents(".selection").dropdown("clear");
      this.setState({
          siteId: $site.val(),
          userId: false
      });
  },

  selectUser: function(){
    this.setState({userId: true});
  },

  selectProfile: function(){
    this.setState({profileId: true});
  },

  generateUrl: function(){
    var $this = util.getJqueryDom(this);
    var userId = $this.find("input[name=userId]").val();
    var profileId = $this.find("input[name=profileId]").val();
    var urlBase = window.location.href.replace(window.location.pathname,"/chat/");
    urlBase += "?profileId=" + profileId + "&userId=" + userId;
    $this.find("input[name=url]").val(urlBase);
  },

  copyUrl: function(){
    var $this = util.getJqueryDom(this);
    $this.find("input[name=url]").trigger("select");
    document.execCommand('copy');
  },

  render: function(){
    var siteId = this.state.siteId || "";

    var language = lang("url");

    
    var options = [
      {"name": "siteId", "type": "select", "options": [], onChange: this.selectSite},
      {"name": "userId", "type": "select", "options": [], onChange: this.selectUser},
      {"name": "profileId", "type": "select", "options": [], onChange: this.selectProfile},
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

    var disabled = !(this.state.siteId && this.state.profileId && this.state.userId);

    return (
      <Segment title={lang("url.title")}>
        <SegmentItem>
          <div className="" match="content">
            <Form>
              <InputRenderer options={options} language={optionsLanguage} savedOptions={{}}></InputRenderer>
              <div className="ui grid">
                <div className="row">
                  <div className="column sixteen wide">
                    <Button className={"blue " + (disabled? "disabled":"")} pull-right="true" onClick={this.generateUrl}>{lang("url.generate")}</Button>
                  </div>
                </div>
                <div className="row">
                  <div className="column fourteen wide">
                    <TextInput name="url" label={lang("url.generatedUrl")} readOnly="readOnly">
                    </TextInput>
                  </div>
                  <div className="column two wide" style={{paddingTop: "20px", paddingLeft: 0}}>
                    <Button className="green" pull-right="true" onClick={this.copyUrl}>{lang("url.copy")}</Button>
                  </div>
                </div>
              </div>
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
