var _ = require("lodash");
var utility = {};

utility.mergeClassName = function(ReactComponent, defaultClassNames, componentPropsToComponentClassMap){
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


module.exports = utility;
