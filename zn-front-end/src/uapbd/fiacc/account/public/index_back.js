//fVHDP2c97g9/ktrXCMc+S6TfxymQ1sQZ0m2o0a/24fJdi5EbrYzWL3vF2Ljo6UDn
/*
编码规则等的公共方法；
*/

export const codeUtilsParseCodeRule= (coderule)=>{
    if(coderule === ''){
        return "";
    }
    let codeArrys = coderule.split('/');
    let retIntArrs = [];
    codeArrys.forEach((ele)=>{
        let pInt = parseInt(ele);
        retIntArrs.push(pInt);
    })
    return retIntArrs;
}
export const codeUtilsGetParentCode= (code,rule)=>{
    let llength = code.length;
    if(llength === rule[0]){
        return '科目编码不符合科目编码规则！';
    }
    let sum = 0;
    for(let i = 0;i<rule.length;i++){
        if(sum + rule[i] === llength){
            return code.substring(0,sum);
        }
        sum = sum + rule[i]
    }
    return '编码不符合编码规则！';//
}

export const codeUtilsGetAccLev = (code,rule)=>{
    if(code === ''){
        return '科目编码不能为空！';//编码错误；
    }
    let llength = code.length;
    let sum = 0 ;
    for(let i = 0;i<rule.length;i++){
        sum = sum + rule[i];
        if(sum === llength){
            return  i + 1;
        }
        if( sum > llength){
            return '科目编码不符合科目编码规则！';
        }
    }
    return '科目编码不符合科目编码规则！';
}


//fVHDP2c97g9/ktrXCMc+S6TfxymQ1sQZ0m2o0a/24fJdi5EbrYzWL3vF2Ljo6UDn