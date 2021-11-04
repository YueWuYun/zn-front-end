//ty6XU5OENOi3a07XWPL/3uW9UVwbZDKGXY7U8v0nlCBraCWTXoXFRa/tKOHD6W/2
/**
 * 扩展替换规则
 * @param FindText  需要替换的源字符
 * @param RepText   替换的目标字符
 * @returns {string}
 */
String.prototype.replaceAll = function (FindText, RepText) {
    let regExp = new RegExp(FindText,'g');
    return this.replace(regExp, RepText);
};

/**
 * 获取多语值
 * @param multiObj  多语json对象或map对象
 * @param key
 * @param param
 * @returns {*}
 */
export function getMulti(multiObj,key,param) {
    if(!multiObj)
        return '';
    if(!key)
        return multiObj;
    let val = isMap(multiObj) ? multiObj.get(key) : multiObj[key];
    if(!param)
        return val;
    //param为map结构
    if(isMap(param)){
        for(let item of multiObj.entries()){
            val = val.replaceAll(`{${item[0]}}`,item[1]);
        }
        console.log(val);
    }else{//为正常对象如{1:1}
        for(let [key,value] of Object.entries(param)){
            val = val.replaceAll(`{${key}}`,value);
        }
        console.log(val);
    }
    return val;
}

/**
 * 判断是否为map结构
 * @param obj
 * @returns {boolean}
 */
function isMap(obj){
    return Object.prototype.toString.call(obj).includes('Map');
}
//ty6XU5OENOi3a07XWPL/3uW9UVwbZDKGXY7U8v0nlCBraCWTXoXFRa/tKOHD6W/2