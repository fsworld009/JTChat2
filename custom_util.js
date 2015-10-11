var custom_util = {
    super: function(parentClass, methodName, context, argList){
        if(typeof methodName !== 'string'){
            parentClass.apply(context, argList);
        }else if(typeof parentClass.prototype[methodName] == 'function'){
            parentClass.prototype[methodName].apply(context,argList);
        }
    }
};

module.exports = custom_util;
