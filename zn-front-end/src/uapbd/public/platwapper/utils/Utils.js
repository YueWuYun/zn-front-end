//A90wzqh25GIGePbs8vLv1eBXDSIwv8TSn1BrdJVQavSjwGnY8FtNIZGKNJrexMYd
var Utils = {
    /**
     * 判断对象是否是一个函数对象
     * @param obj
     */
    isFunction: function(obj){
        return obj && Object.prototype.toString.call(obj).slice(8, -1) === 'Function';
    },
    /**
     * 判断对象是否是一个数组对象
     * @param obj
     */
    isArray: function(obj){
        return obj && Object.prototype.toString.call(obj).slice(8, -1) === 'Array';
    },
    /**
     * 判断对象是否是一个字符串对象
     * @param obj
     */
    isString: function(obj) {
        return obj && Object.prototype.toString.call(obj).slice(8, -1) === 'String';
    },
    /**
     * 判断对象是否是一个对象
     * @param obj
     */
    isObject:function(obj){
        return obj && Object.prototype.toString.call(obj).slice(8, -1) === 'Object';
    }
};
export default Utils;


//A90wzqh25GIGePbs8vLv1eBXDSIwv8TSn1BrdJVQavSjwGnY8FtNIZGKNJrexMYd