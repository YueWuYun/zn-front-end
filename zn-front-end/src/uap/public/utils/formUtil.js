/*****************************************************
 * 表单工具类
 *****************************************************/


/*****************************************************
 * 检查 元数据模板中是否含有指定的属性
 * 例如：meta,formId,"enablestate" 检查元数据模板中有无enablestate属性
 * @param meta
 * @param areacode
 * @param attrcode
 * @returns {boolean}
 *****************************************************/
const checkHasProps = (meta,areacode,attrcode)=>{
    //判断元数据中有我的表单元数据
    if(Object.prototype.toString.call(meta).slice(8, -1) === 'Object' && meta.hasOwnProperty(formId)){
        let formMeta = meta[areacode];
        if(formMeta.code!=areacode){
            throw new Error("areacode和元数据模板不匹配，请确认！");
        }
        if(!formMeta.hasOwnProperty("items")){
            throw new Error("元数据没有属性项！");
        }
        //获得属性
        let items = formMeta.items;
        if(Object.prototype.toString.call(items).slice(8, -1) === 'Array'){
            items.map((item)=>{
                //查找属性
                if(item.hasOwnProperty("attrcode") && item.attrcode == attrcode){
                    return true;
                }
            });
        }
    }
    return false;
};


/*****************************************************
 * 检查 对象中是否有指定的字段
 * 例如：a.b.c.d.e 中是否有e属性
 * @param obj
 * @param keys
 * @returns {boolean}
 *****************************************************/
const validChain = (obj, ...keys) => {
    return keys.reduce((obj, key) => (obj || {})[key], obj) !== undefined
}

export {checkHasProps, validChain}