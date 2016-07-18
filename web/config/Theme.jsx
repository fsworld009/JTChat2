var React = require("react");
import { connect } from 'react-redux';
import {loadThemes} from "./ajax.js";
import {Segment, SegmentItem, Items, IconButton} from './Semantic.jsx';
var _ = require("lodash");
var util = require("./util.js");

function mapStateToProps(state){
  var loadStatus = state.getIn(["load,themes"]);


  return {
    loadStatus: loadStatus,
    themes: state.get("themes"),
    themesById: state.get("themesById")
  };
}

function mapDispatchToProps(dispatch){
  return {
    loadThemes: function(){
      dispatch(loadThemes());
    }
  };
}

var Theme = React.createClass({
  render: function(){
    var theme = this.props.theme;
    //<img match="image" src={site.get("logo")} alt={site.get("displayName")} />
    //<IconButton match="extra" iconClass="fa fa-pencil" className="green" pull-right="true" popup-content="Edit" route={"/config/site/edit/"+siteId}></IconButton>
    //<BulletList items={site.get("hosts").toArray()} />
    var language = theme.getIn(["language","en"]);
    return (
      <SegmentItem title={language.getIn(["theme","displayName"]) + " (" + theme.get("version") + ")"}>
          <div match="content" className="ui grid">
            <div className="row">
              <div className="twelve column">
                {language.getIn(["theme","description"])}
              </div>
            </div>
            <div className="row">
              <div className="twelve column">
                <h3 className="ui header">Options</h3>
              </div>
            </div>
            <div className="two column row">
              <div className="column">
                Option A
              </div>
              <div className="column">
                Options B
              </div>
            </div>
          </div>
      </SegmentItem>
    );
  }

});


var Themes = React.createClass({
  /*componentDidMount: function(){
    if(this.props.loadingThemes){
      this.props.loadThemes();
    }

  },*/

  render: function(){
    var themeMap = this.props.themesById;
    return (
      <Segment title="Theme">
        <Items items=
          {
            util.listToComponents(this.props.themes.toArray(), function(id, key){
              var theme = themeMap.get(id);
              return (<Theme key={key} theme={theme}/>);
            })
          } />
      </Segment>
    );
  }
});

var ThemeContainer = connect(mapStateToProps, mapDispatchToProps)(Themes);
module.exports = ThemeContainer;
