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
