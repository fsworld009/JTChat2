var _ = require("lodash");
var $ = require("jquery");
var ReactDOM = require("react-dom");
var util = {};

util.mergeClassName = function(ReactComponent, defaultClassNames, componentPropsToComponentClassMap){
    defaultClassNames = defaultClassNames || "";
    var className="";
    if(ReactComponent.props.className){
        className = defaultClassNames + " " + ReactComponent.props.className;
    }
    if(typeof componentPropsToComponentClassMap == "object"){
        _.each(componentPropsToComponentClassMap, function(propValueMap, propKey){
            if(ReactComponent.props[propKey]){
                var mappedClass = propValueMap[ReactComponent.props[propKey]];
                if(mappedClass){
                    className = className + " " + mappedClass;
                }
            }
        });
    }
    return className;
};

util.getJqueryDom = function(ReactComponent){
    return $(ReactDOM.findDOMNode(ReactComponent));
};


module.exports = util;
