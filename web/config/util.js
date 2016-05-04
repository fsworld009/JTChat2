var _ = require("lodash");
var $ = require("jquery");
var ReactDOM = require("react-dom");
var util = {};

util.mergeClassName = function(ReactComponent, defaultClassNames, componentPropsToComponentClassMap){
    defaultClassNames = defaultClassNames || [];
    var className;
    if(defaultClassNames instanceof Array){
        className = defaultClassNames.join(" ");
    }else{
        className = String(defaultClassNames);
    }

    if(typeof componentPropsToComponentClassMap == "object"){
        _.each(componentPropsToComponentClassMap, function(propValueMap, propKey){
            if(ReactComponent.props[propKey]){
                var mappedClass = propValueMap[ReactComponent.props[propKey]];
                if(mappedClass){
                    className = className + " " + mappedClass;
                }else if(propValueMap["*"]){
                    className = className + " " + propValueMap["*"];
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
