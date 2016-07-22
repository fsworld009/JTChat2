var React = require("react");
import { connect } from 'react-redux';
import {Segment, SegmentItem, Items, IconButton} from './Semantic.jsx';
var _ = require("lodash");
var util = require("./util.js");

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
    return (<div>Profile</div>);
  }
});

var Profiles = React.createClass({
  /*componentDidMount: function(){
    if(this.props.loadingThemes){
      this.props.loadThemes();
    }

  },*/

  render: function(){
    var profileMap = this.props.profilesById;
    return (
      <Segment title="Theme Profile">
        <IconButton iconClass="fa fa-plus" className="green" popup-content="New" route={"/config/profile/new/"}></IconButton>
        <Items>
          {
            util.listToComponents(this.props.profiles.toArray(), function(id, key){
              var profile = profileMap.get(id);
              return (<Profile key={key} profile={profile}/>);
            })
          }
        </Items>
      </Segment>
    );
  }
});
var ProfileContainer = connect(mapStateToProps, mapDispatchToProps)(Profiles);
module.exports = ProfileContainer;
