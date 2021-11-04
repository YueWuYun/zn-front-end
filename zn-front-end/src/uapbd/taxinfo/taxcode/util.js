//yMkbfdnQzOKEagOJhLmf9QKMucOTO0CmHomW1mzZM7voKuVHNfaoBr+JOBJKKom3
 /*************************************************************
 * 将子表数据赋值到主表字段
 *
 * @param tab_h_data 主表数据（包含字表） 数组
 * @param tab_b_str 主表中子表属性名
 * @param attrNames 赋值属性名称数组[[主表属性，子表属性，options]]
 * @returns {tab_h_data}
 *************************************************************/
const setTab_hForTab_b = (tab_h_data,tab_b_str,attrNames)=> {
    if(!(tab_h_data && tab_b_str && attrNames && attrNames.length)){
        return tab_h_data;
    }
    tab_h_data.rows.forEach((obj,index) => {
        let tab_b = obj['values'][tab_b_str]['value'];
        if(tab_b && tab_b.length && tab_b[0]){
            attrNames.forEach((attrName) => {
                if(attrName.length===2){
                    obj['values'][attrName[0]] = {};
                    obj['values'][attrName[0]]['value'] = tab_b[0][attrName[1]];
                }else if(attrName.length===3){
                    obj['values'][attrName[0]] = {};
                    attrName[2].forEach((item) => {
                        if(item['value']===tab_b[0][attrName[1]]){
                            obj['values'][attrName[0]] = item;
                        }
                    });
                }
            });
        }
    });
    return tab_h_data;
};

/**
 * 判断某个元素是否存在于某个 js数组中
 * @param {*数组} arr 
 * @param {*某个元素} str 
 */
const isInArray = (arr,str) => {
    if(!arr || !str || arr.length===0 || str.length===0){
        return false;
    }
    Array.prototype.in_array=function(e){
        let r=new RegExp(','+e+',');
        return (r.test(','+this.join(',')+','));
    }
    let arrStr = new Array(arr);
    return arrStr.in_array(str);
}



let Util = {
    setTab_hForTab_b : setTab_hForTab_b,
    isInArray : isInArray
};
export default Util;
//yMkbfdnQzOKEagOJhLmf9QKMucOTO0CmHomW1mzZM7voKuVHNfaoBr+JOBJKKom3