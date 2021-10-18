/*OdLGnj/E5WKMnB9Rn1czuY/R48VzUyTPpyGH8lbIHp6H64O6zGTeLWMSQQFmKzCs*/
import { ajax, base, toast, print, cardCache, cacheTools, promptBox } from 'nc-lightapp-front';

export function doAjax(sendData,url,successCallback){
    ajax({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

/*OdLGnj/E5WKMnB9Rn1czuY/R48VzUyTPpyGH8lbIHp6H64O6zGTeLWMSQQFmKzCs*/