/*OdLGnj/E5WKMnB9Rn1czuY/R48VzUyTPpyGH8lbIHp6H64O6zGTeLWMSQQFmKzCs*/
import { ajax, base, toast, print, cardCache, cacheTools, promptBox } from 'nc-lightapp-front';

export function doAjax(sendData,url,successCallback){
    ajax({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}
export function isEmptyObject(obj){
    if (null === obj || typeof(obj) === "undefined")
        return true;
    else
        return false;
}
export function isEmptyStr(obj){
    if (null === obj || typeof(obj) === "undefined")
        return true;
    else if (obj === '')
        return true;
    else
        return false;
}
/**
* 设置表头字段属性
* @param {*} props 页面内置对象
* @param {*} headCode 表头编码
* @param {*} headItemProps 表头页面属性
*/
export const setHeadItemProp = function (props, headCode, headItemProps) {
    let obj = {};
    headItemProps.forEach(element => {
        obj[element["itemName"]] = element["editable"] === "true" ? false : true;
    });
    props.form.setFormItemsDisabled(headCode, obj);
}
/*OdLGnj/E5WKMnB9Rn1czuY/R48VzUyTPpyGH8lbIHp6H64O6zGTeLWMSQQFmKzCs*/