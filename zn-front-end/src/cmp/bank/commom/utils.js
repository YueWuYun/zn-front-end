/*VXFvg6Mvwf6woNAz5hi+V3jbVRyF5CjuDjpPwANwxZTzGnwikwflLe2ivz2elu/t*/
// 银行对账模块所使用的小工具函数方法

/** 
 * 数组求和
*/
export const sum = (arr) => {
    if (!arr.length) {
        return 0;
    } else if (arr.length=== 1) {
        return arr[0];
    }
    let sums= 0;
    arr.forEach(val => sums+= Number(val) || 0);
    return sums;
};

/** 
 * 获取多语
*/
export function getLangCode (key) {
    let multiLang = this.props.MutiInit.getIntl(this.moduleId);
    return multiLang && multiLang.get(this.moduleId + '-' + key);
};

/** 
 * 获取当前存储的缓存
*/
export function getProp (key) {
    return this.props.ViewModel.getData(key);
}

/** 
 * 做分页缓存
*/
export function setPageProp (key, val) {
    this.props.ViewModel.setData(key, val);
}

/** 
 * 将prop缓存到props中
*/
export function setProp (key, val= true) {
    this.props.ViewModel.setData(key, val);
    this.forceUpdate();
}

/** 
 * 情况url地址栏的参数
*/
export const clearUrlParam = () => {
    window.location.hash= '';
};

/** 
 * 转换小数位
*/
Number.prototype.toScale = function(scale = 2) {         
    return Math.round(this * Math.pow(10, scale)) / Math.pow(10, scale);     
}  

/** 
 * 俩个数字相加保留几位小数
*/
export const AccSub = (num1, num2 ,scale, signal= true) =>{
    let r1, r2, m, n;
    if (!scale) {
        scale= getScale(num1);
    }
    try {
        r1= num1.toString().split(".")[1].length;
    } catch (e) {
        r1= 0;
    }
    try {
        r2= num2.toString().split(".")[1].length;
    } catch (e) {
        r2= 0;
    }
    m= Math.pow(10, Math.max(r1,r2));
    let type= signal ? -1 : 1;
    return ((num1*m + type*num2*m)/m).toScale(scale);
}

/** 
 * 获取当前数字的小数位数
*/
export const getScale = num =>{
    let scale;
    try {
        scale= num.toString().split(".")[1].length;
    } catch (e) {
        scale=0;
    }
    return scale;
}

export const width= '150px';

/** 
 * 给数字添加千位符
*/
Number.prototype.formatMoney = function (places, symbol, thousand = ",", decimal = ".") {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    if(number == '0E-8'){
        number = 0;
    }
    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toScale(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return (symbol || '') + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

/** 
 * 转换成带千位符的金额形式
*/
export const showMoney = num => {
    if (!num) {
        return '';
    }
    let scale= getScale(num);
    
    if(scale==8){
        scale=2;
    }

    return Number(num).formatMoney(scale);
}

/** 
 * 数据格式转换
*/
export const dateFormat = date => {
    if (!date[0]) {
        return [];
    }
    return [];
}

/** 
 * 已废弃
*/
export function resolveColumn (list) {
    return list;
}

/** 
 * 获取当前table的高度
*/
export function getTableHeight () {
    let screenWidth = window.screen.width || 768;
    let tableMaxHeight = 410;
    if (screenWidth <= 1440) {
        tableMaxHeight = 40 * 10;
    } else if (screenWidth > 1440 && screenWidth < 1920) {
        tableMaxHeight = 48 * 10;
    } else if (screenWidth >= 1920) {
        tableMaxHeight = 56 * 10;
    }
    return tableMaxHeight;
}
/*VXFvg6Mvwf6woNAz5hi+V3jbVRyF5CjuDjpPwANwxZTzGnwikwflLe2ivz2elu/t*/