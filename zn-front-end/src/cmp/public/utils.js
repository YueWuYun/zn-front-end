/*VXFvg6Mvwf6woNAz5hi+V3jbVRyF5CjuDjpPwANwxZTzGnwikwflLe2ivz2elu/t*/

export const dateformat =(today,fmt)=>{
    let o = {
        "M+": today.getMonth() + 1, // 月份
        "d+": today.getDate(), // 日
        "h+": today.getHours(), // 小时
        "m+": today.getMinutes(), // 分
        "s+": today.getSeconds(), // 秒
        "q+": Math.floor((today.getMonth() + 3) / 3), // 季度
        "S": today.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (today.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;


}


// Date.prototype.Format = function (fmt) { // author: meizz
//     var o = {
//         "M+": this.getMonth() + 1, // 月份
//         "d+": this.getDate(), // 日
//         "h+": this.getHours(), // 小时
//         "m+": this.getMinutes(), // 分
//         "s+": this.getSeconds(), // 秒
//         "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
//         "S": this.getMilliseconds() // 毫秒
//     };
//     if (/(y+)/.test(fmt))
//         fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
//     for (var k in o)
//         if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
//             return fmt;
// }
/*VXFvg6Mvwf6woNAz5hi+V3jbVRyF5CjuDjpPwANwxZTzGnwikwflLe2ivz2elu/t*/