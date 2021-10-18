/*j8G0Gx9zne7h/iQQP3kBBrvqclnuzNUR7DIutgrFmIcoDlHIaHZzB0IHW+5raUgh*/
import { toast } from 'nc-lightapp-front';


/**
 * 票据号校验
 * 
 * "361805IBR-000024": "票据编号不为空",
  "361805IBR-000025": "票据编号应为数字",
  "361805IBR-000026": "票据编号中有空格",
  "361805IBR-000027": "票据编号长度应为16或30位数字",
  "361805IBR-000028": "票据编号长度应为30位数字",
  "361805IBR-000029": "票据种类标识错误",
  "361805IBR-000030": "出票日期有误",
  "361805IBR-000031": "票据编号长度应为16位数字",
  "361805IBR-000032": "省别码号有误",
  "361805IBR-000033": "票据种类码有误",
  "361805IBR-000034": "银行机构代码与票据种类码不匹配",
  "361805IBR-000035": "印制识别码有误"
 * 
 * 
 * 
 * 
 * 
 * 
 * @param {*} fbmbillno 
 */
export function billValidation(fbmbillno){
    let muti = this.props.MutiInit.getIntl("361805IBR");
    let blankCheck = /\s/  
    if(!fbmbillno){
        toast({ color: 'warning', content: muti &&
            muti.get("361805IBR-000024") /* 国际化处理： 票据编号不为空*/ });   
        return false
    }

    // 数字校验
    let numbercheck = /^[0-9]*$/;    
    if (fbmbillno.match(numbercheck) == null) {
        toast({color: 'warning', content: muti &&
            muti.get("361805IBR-000025") /* 国际化处理： 票据编号应为数字！*/});
        return false;
    }

    if(fbmbillno.match(blankCheck) != null){
        toast({color: 'warning', content: muti &&
                muti.get("361805IBR-000026") /* 国际化处理：票据编号中有空格！ */});
        return false      
    }

    if(fbmbillno.length != 30 && fbmbillno.length != 16){
        toast({ color: 'warning', content: muti &&
                muti.get("361805IBR-000027") /* 国际化处理： 票据编号长度应为16或30位！*/ });   
        return false
    }

    // 电子票据号
    if(fbmbillno && fbmbillno.length == 30){
       return eBillNoCheck.call(this,fbmbillno)
    }
    // 纸质票据号
    else{
        return paperBillCheck.call(this,fbmbillno)
    }
}



/**
 *  电票校验
 *  返回值为true表示合法
 * @param {票据编号} billno 
 */
function eBillNoCheck(billno){
    let allExeCheck = /^\d{30}$/;      
    let muti = this.props.MutiInit.getIntl("361805IBR");
    // let billno = fbmbillnoTemp.replace(/\s+/g, ""); // 去空格
    if (billno.match(allExeCheck) == null) {
        toast({color: 'warning', content: muti &&
                muti.get("361805IBR-000028") /* 国际化处理： 票据编号长度应为30位数字！*/});
        return false;
    }

    let firstNum = billno.split('')[0];   
    if (firstNum != '1' && firstNum != '2') {
        toast({color: 'warning', content: muti &&
                muti.get("361805IBR-000029") /* 国际化处理：票据种类标识错误！*/});
        return false;
    }

    let year = billno.substring(13,17)
    let month = billno.substring(17,19)
    let day = billno.substring(19,21)
    
    if (!(month > 0 && month < 12)) {
        toast({color: 'warning', content: muti &&
                muti.get("361805IBR-000030") /* 国际化处理：出票日期有误*/});
        return false;
    }

    // 闰年
    if((year%4 == 0) && (month ==2) && !(day>0 && day <=29)){
        toast({color: 'warning', content:  muti &&
                muti.get("361805IBR-000030") /* 国际化处理：出票日期有误*/});
        return false;
    }
    // 平年
    if(!(year%4 == 0) && (month ==2) && !(day>0 && day <=28)){
        toast({color: 'warning', content:  muti &&
                muti.get("361805IBR-000030") /* 国际化处理：出票日期有误*/});
        return false;
    }

    // 日校验，没考虑2月
    if ([1, 3, 5, 7, 8, 10, 12].includes(month) && !(day > 0 && day <= 31)) {
        toast({color: 'warning', content:  muti &&
                muti.get("361805IBR-000030") /* 国际化处理：出票日期有误*/});
        return false;
    } else if ([ 4, 6, 9, 11].includes(month) && !(day > 0 && day <= 30)) {
        toast({color: 'warning', content:  muti &&
                muti.get("361805IBR-000030") /* 国际化处理：出票日期有误*/});
        return false;
    }
    
    return true;
}


/**
 * 纸质票 校验
 * 返回值为true表示合法
 * @param {票据编号} billno 
 * @param {票据类型} fbmbilltype 
 */
function paperBillCheck(billno){
    let allExeCheck = /^\d{16}$/;  
    let muti = this.props.MutiInit.getIntl("361805IBR");
    if (billno.match(allExeCheck) == null) {
        toast({color: 'warning', content:  muti &&
                muti.get("361805IBR-000031") /* 国际化处理：票据编号长度应为16位数字！*/});
        return false;
    }

    let bankCode = billno.substring(0,3)
    let provinceCode = billno.substring(4,6)
    let billtypeCode = billno.substring(6,7)
    let printCode = billno.substring(7,8)

    // 省别码统一使用全国代码00
    if(provinceCode != "00"){
        toast({color: 'warning', content:  muti &&
                muti.get("361805IBR-000032") /* 国际化处理：省别码号有误！*/});
        return false;
    }

    // 5位银行承兑汇票；6为商业承兑汇票
    if(!['5','6'].includes(billtypeCode)){
        toast({color: 'warning', content:  muti &&
                muti.get("361805IBR-000033") /* 国际化处理：票据种类码有误！*/});
        return false;
    }

        
    if(billtypeCode == '6' && bankCode != '001'){
        toast({color: 'warning', content:  muti &&
                muti.get("361805IBR-000034") /* 国际化处理：银行机构代码与票据种类码不匹配！*/});
        return false;
    }

    // 编码从0到6，其中1至6代表其中六家印刷厂，0代表其他的十家印刷厂，第八位不可能出现数字7、8、9。
    if(['7','8','9'].includes(printCode)){
        toast({color: 'warning', content:  muti &&
                muti.get("361805IBR-000035") /* 国际化处理：印制识别码有误！*/});
        return false;
    }

    return true
}
/*j8G0Gx9zne7h/iQQP3kBBrvqclnuzNUR7DIutgrFmIcoDlHIaHZzB0IHW+5raUgh*/