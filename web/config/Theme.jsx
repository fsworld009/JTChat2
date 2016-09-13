var React = require("react");
import { connect } from 'react-redux';
import {Segment, SegmentItem, Items, IconButton} from './Semantic.jsx';
var _ = require("lodash");
var util = require("./util.js");
import {lang, getDB} from "./database.js";

function mapStateToProps(state){
  return {};
}

function mapDispatchToProps(dispatch){
  return {};
}

var Theme = React.createClass({
  render: function(){
    var theme = this.props.theme;
    var language = this.props.language;
    return (
      <SegmentItem title={language.name + " (" + theme.version + ")"}>
          <div match="content" className="ui grid">
            <div className="row">
              <div className="twelve column">
                { language.description }
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
    var language = lang("theme");
    return (
      <Segment title={ language.title }>
        <Items>
          {
            util.listToComponents(getDB("themes"), function(id, key){
              var theme = getDB("themes",id);
              var themeLang = lang("themeLang."+id);
              return (<Theme key={key} theme={theme} language={themeLang}/>);
            })
          }
        </Items>
      </Segment>
    );
  }
});

var ThemeContainer = connect(mapStateToProps, mapDispatchToProps)(Themes);
module.exports = ThemeContainer;
