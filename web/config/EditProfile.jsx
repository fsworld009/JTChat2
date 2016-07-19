var React = require("react");
import { connect } from 'react-redux';
import {Segment, IconButton, Button} from "./Semantic.jsx";
import {Form, TextInput, Dropdown} from "./Semantic_Form.jsx";
var _ = require("lodash");
var util = require("./util.js");
import { push } from 'react-router-redux';
import {saveConfig} from './ajax.js';

function mapStateToProps(state){
  return {
    sitesById: state.get("sitesById"),
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
    var profileId = this.props.params.profileId;
    var profile;
    var renderProperties;
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
    console.log(renderProperties);
    return (
        <Segment title={renderProperties.title + " Profile"}>
          <Form>
            <div className="content">
              <div className="description">
                <div className="ui grid">
                  <div className="two column row">
                    <div className="column">
                      <Dropdown label="Site" name="site"/>
                    </div>
                    <div className="column">
                      <TextInput name="displayName" label="Display Name" defaultValue={renderProperties.displayName}/>
                    </div>
                  </div>
                  <div className="two column row">
                    <div className="column">
                      <TextInput name="username" label="Username" defaultValue={renderProperties.username}/>
                    </div>
                    <div className="column">
                      <TextInput name="password" label="Password" password="true"/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ui red message">
                <p>Password will be saved as plain text file</p>
              </div>
              <div className="extra">
                <br/><br/>
                <Button className="green" pull-right="true" onClick={this.save}>Save</Button>
                <Button className="" pull-right="true" route="/config/profile/">Cancel</Button>
                <br/><br/>
              </div>
            </div>
          </Form>
        </Segment>
      );
  }
});


var EditProfileContainer = connect(mapStateToProps, mapDispatchToProps)(EditProfile);
module.exports = EditProfileContainer;
