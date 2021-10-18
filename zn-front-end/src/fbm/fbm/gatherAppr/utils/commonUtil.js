/*OdLGnj/E5WKMnB9Rn1czuY/R48VzUyTPpyGH8lbIHp6H64O6zGTeLWMSQQFmKzCs*/
import { ajax, base, toast, print, cardCache, cacheTools, promptBox } from 'nc-lightapp-front';

export function doAjax(sendData,url,successCallback){
    ajax({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

/**
 * 时间格式化
 * @param {*} date 
 */
export function formatDateTime(date){
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    
    if(month <10){
        month = "0"+month
    }
    if(day <10){
        day = "0"+day
    }
    if(hour <10){
        hour = "0"+hour
    }
    if(minute <10){
        minute = "0"+minute
    }
    if(second <10){
        second = "0"+second
    }

    return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second
}

/*OdLGnj/E5WKMnB9Rn1czuY/R48VzUyTPpyGH8lbIHp6H64O6zGTeLWMSQQFmKzCs*/