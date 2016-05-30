var React = require("react");
import { connect } from 'react-redux';
import {Segment, IconButton, BulletList, Modal, Button} from "./Semantic.jsx";
import {Form, TextInput, TextInputList, Textarea} from "./Semantic_Form.jsx";
var _ = require("lodash");
var util = require("./util.js");

function mapStateToProps(state){
  return {
    sitesById: state.get("sitesById"),
    sites: state.get("sites")
  };
}

function mapDispatchToProps(dispatch){
  return {};
}

var EditSite = React.createClass({
  render: function(){
    //params: from react-router
    //sitesById: from redux (provided by EditSiteContainer)
    var siteId = this.props.params.siteId;
    var site = this.props.sitesById.get(siteId);
    return (
        <Segment title={"EditSite" + this.props.params.siteId}>
          <Form>
            <div className="content">
              <div className="description">
                <div className="ui grid">
                  <div className="two column row">
                    <div className="column">
                      <Textarea name="hosts" label="Hosts" rows="3" defaultValue={site.get("hosts").toArray().join("\n")}/>
                    </div>
                    <div className="column">
                      <Textarea name="ports" label="Ports" rows="3" defaultValue={site.get("ports").toArray().join("\n")}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="extra">
                <Button className="green" pull-right="true">Save</Button>
                <Button className="" pull-right="true" route="/config/site/">Cancel</Button>
                <br/><br/>
              </div>
            </div>
          </Form>
        </Segment>
      );
  }
});


var EditSiteContainer = connect(mapStateToProps, mapDispatchToProps)(EditSite);
module.exports = EditSiteContainer;
