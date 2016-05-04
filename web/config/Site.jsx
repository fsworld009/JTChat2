
var React = require("react");
import { connect } from 'react-redux';
import {Segment, IconButton, BulletList, Modal, Button, Form, TextInput} from "./Semantic.jsx";
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
                      <TextInput label="Host" required="true" iconClass="fa fa-trash" name="host" placeholder="Input Name"/>
                    </div>
                    <div className="column">
                      Ports

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
            <IconButton iconClass="fa fa-pencil" className="green" pull-right="true" popup-content="Edit" onClick={this.editSite}></IconButton>
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
module.exports = SiteContainer;
