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
    usersById: state.get("usersById"),
    users: state.get("users")
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
    if(typeof userId == "undefined"){
      //new
      renderProperties = {
        title: "New"
      };
    }else{
      renderProperties = {
        title: "Edit"
      };
      user = this.props.usersById.get(userId);
      _.extend(renderProperties, user.toObject());
    
    }
    console.log(renderProperties);
    return (
        <Segment title={renderProperties.title + " User"}>
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
                <Button className="" pull-right="true" route="/config/user/">Cancel</Button>
                <br/><br/>
              </div>
            </div>
          </Form>
        </Segment>
      );
  }
});


var EditUserContainer = connect(mapStateToProps, mapDispatchToProps)(EditUser);
module.exports = EditUserContainer;
