//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
编码规则等的公共方法；
*/

export function codeUtilsParseCodeRule(coderule){
    if(coderule === ''){
        return [];
    }
    let codeArrys = coderule.split('/');
    let retIntArrs = [];
    codeArrys.forEach((ele)=>{
        let pInt = parseInt(ele);
        retIntArrs.push(pInt);
    })
    return retIntArrs;
}
export function codeUtilsGetParentCode(code,rule){
    let llength = code.length;
    if(llength === rule[0]){
        return '';
    }
    let sum = 0;
    for(let i = 0;i<rule.length;i++){
        if(sum + rule[i] === llength){
            return code.substring(0,sum);
        }
        sum = sum + rule[i]
    }
    return '';//
}

export function codeUtilsGetAccLev(code,rule){
    if(code === ''){
        return -1;//编码错误；
    }
    let llength = code.length;
    let sum = 0 ;
    for(let i = 0;i<rule.length;i++){
        sum = sum + rule[i];
        if(sum === llength){
            return  i + 1;
        }
        if( sum > llength){
            return -1;
        }
    }
    return -1;
}


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65