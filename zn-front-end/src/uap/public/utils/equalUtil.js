import {isObject, getVariableType} from "./typeRegUtil";
/**
 * @desc 判断两个数组是否相等
 * @param {Array} arr1 
 * @param {Array} arr2 
 * @return {Boolean}
 */
export const arrayEqual = (arr1, arr2) => {
    if(arr1 === arr2) return true;
    if(arr1.length !== arr2.length) return false;
    for(let i=0; i< arr1.length; i++) {
        if(arr1[i] !== arr2[i]) return false; 
    }
    return true;
}

/**
 * @desc 判断两个对象是否相等
 * @param {Object} a 
 * @param {Object} b 
 * @return {Boolean}
 */
export const objectEqual = (a, b) => {
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);
    if(aProps.length !== bProps.length) {
        return false;
    }
    for(let i=0; i< aProps.length; i++) {
        var propsName = aProps[i];
        if(isObject(aProps[propsName]) && isObject(bProps[propsName])) {
            objectEqual(aProps[propsName], bProps[propsName]);
        }else if(getVariableType(aProps[propsName]) !== getVariableType(bProps[propsName]) ) {
            return false;
        }else if(aProps[propsName] !== bProps[propsName]) {
            return false;
        }
    }
    return true;
}

/**
 * @desc 判断两个基本类型的变量是否完全相同
 * @param {String} param1 
 * @param {String} param2 
 * @return {Boolean}
 */
export const baseTypeEqual = (param1, param2) => {
   return Object.is(param1, param2); 
}









