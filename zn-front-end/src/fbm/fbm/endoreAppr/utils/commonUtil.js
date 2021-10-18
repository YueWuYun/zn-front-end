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

/*OdLGnj/E5WKMnB9Rn1czuY/R48VzUyTPpyGH8lbIHp6H64O6zGTeLWMSQQFmKzCs*/