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

util.getChildrenMatchMap = function(ReactComponent){
    var children = ReactComponent.props.children || [];
    return _.keyBy(children, function(component){
        return component.props.match;
    });
}

/*util.setRef = function(refName){
    console.log(refName, "called");
    return function(component){
        console.log("ref", this, "called");
        if(!this.__refs){
            this.__refs = {};
        }
        this.__refs[refName] = component;
    }
}

util.getRef = function(ReactComponent, refName){
    console.log("__refs", this.__refs);
    if(!ReactComponent.__refs){
        return undefined;
    }
    console.log("AAAA",refName, ReactComponent.__refs[refName]);
    return ReactComponent.__refs[refName];
}*/

util.listToComponents = function(list, renderMethod){
    if(list instanceof Array && typeof renderMethod == "function"){
        var componentKey=1;
        return list.map(function(item){
            var component = renderMethod(item, componentKey);
            componentKey++;
            return component;
        });
    }
}


module.exports = util;
