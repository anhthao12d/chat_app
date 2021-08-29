let getParamsHelper = (params, property, defaultValue) => {
    if(params.hasOwnProperty(property) && params[property] !== undefined){
        return params[property];
    } 
    return defaultValue;
}
module.exports = {
    getParamsHelper,

}