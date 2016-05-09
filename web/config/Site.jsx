
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

var EditSiteModal = React.createClass({
  getInitialState() {
    return {
        site: null
    };
  },

  // componentDidUpdate: function(){
  //   console.log("EditSiteModal updatet");
  // },

  show: function(siteProp){
    var view = this;
    this.refs.modal.show({
      closable: false,
      selector: {
        approve  : '.actions .confirm',
        deny: '.actions .deny'
      },
      onVisible: function(){
        console.log("onVisible",this);
      },
      onHidden: function(){
        console.log("onHidden", this);
      },
      onApprove: function(){
        console.log("Modal onApprove", arguments);
        return false;
      },
      onDeny: function(){
        console.log("onDeny", arguments);
      }
    });
    this.setState({site: siteProp});
  },

  render: function(){
    var modalContent;
    if(this.state.site){
      var site = this.state.site;
      modalContent = (
        <Modal ref="modal">
          <div className="header">
            Edit {site.get("displayName")}
          </div>
          <div className="content">
              <Form>
                <div className="ui grid">
                  <div className="two column row">
                    <div className="column">
                      <TextInputList name="hosts" label="Hosts" items={site.get("hosts").toArray()}/>
                    </div>
                    <div className="column">
                      <TextInputList name="ports" label="Ports" items={site.get("ports").toArray()}/>
                    </div>
                  </div>
                </div>
              </Form>
          </div>
          <div className="actions">
            <Button className="deny">Cancel</Button>
            <Button className="right confirm green">Save</Button>
          </div>
        </Modal>
      );
    }else{
      modalContent = (
        <Modal ref="modal">
          <div>No site</div>
        </Modal>
      );
    }
    return modalContent;
  }
});

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

var Site = React.createClass({
  editSite: function(){
    this.props.onEdit(this.props.site);
  },

  render: function(){
    var site = this.props.site;
    // var hosts = site.get("hosts").toArray();
    // var hostList = [];


    return (
      <div className="item">
        <div className="image">
          <i className="fa fa-twitch fa-3x" style={{color: "blue"}}></i>
        </div>
        <div className="content">
          <div className="header">{site.get("displayName")}</div>
          <div className="description">
            <div className="ui grid">
              <div className="three column row">
                <div className="column">
                  URL ID<br/><br/>
                  {site.get("urlId")}
                </div>
                <div className="column">
                  Hosts
                  <BulletList items={site.get("hosts").toArray()} />
                </div>
                <div className="column">
                  Ports
                  <BulletList items={site.get("ports").toArray()} />
                </div>
              </div>
            </div>
          </div>
          <div className="extra">
            <IconButton iconClass="fa fa-pencil" className="green" pull-right="true" popup-content="Edit" route={"/config/site/edit/_"+site.get("id")}></IconButton>
          </div>
        </div>
      </div>
    );
  }
});

var Sites = React.createClass({
  editSite: function(siteProp){
    this.refs.editModal.show(siteProp);
  },

  render: function(){
    var siteMap = this.props.sitesById;
    var view = this;
    return (
      <Segment title="Site">
        <div className="ui divided items">
          {
            this.props.sites.toArray().map(function(id){
              var site = siteMap.get(id);
              return (<Site key={id} site={site} onEdit={view.editSite}/>);
            })
          }
        </div>
        <EditSiteModal ref="editModal"/>
      </Segment>
    );
  }
});

var SiteContainer = connect(mapStateToProps, mapDispatchToProps)(Sites);
var EditSiteContainer = connect(mapStateToProps, mapDispatchToProps)(EditSite);
module.exports = {Site: SiteContainer, EditSite: EditSiteContainer};
