/*cYk6FLTqODaXIQhDR/JVGIzz7pX6QTdK0mV+6+T7UwCZ8qDlQhq9SKZaotas28hd*/
export const setDefOrg2ListSrchArea = function (props, areaCode, data, fundorg) {
    //判空
    if (!props || !props.search || !areaCode || !hasDefaultOrg(data)) {
        return;
    }
    //判断查询区域组织是否有值，如果有则表明快速查询方案已个性化定制。无需加载默认业务单元
    if (hasSearchValue(props, areaCode, fundorg)) {
        return;
    }
    //获取默认业务单元
    let { pk_org, org_Name } = data.context;
    let searchData = { 'display': org_Name, 'value': pk_org };
    //更新列表查询区域
    props.search.setSearchValByField(areaCode, fundorg, searchData);
}

/**
 * 给高级查询区域赋默认业务单元(在setMeta之前使用)
 * 
 * @param {*} props 页面内置对象
 * @param {*} areaCode 列表查询区域编码
 * @param {*} data  createUIDom请求返回数据
 */
export const setDefOrg2AdvanceSrchArea = function (props, areaCode, data, fundorg) {
    //判空
    if (!props || !props.search || !areaCode || !hasDefaultOrg(data) || !data.template) {
        return;
    }
    let meta = data.template;
    //获取默认业务单元
    let { pk_org, org_Name } = data.context;
    //遍历查询区域字段，将默认业务单元赋值给组织字段
    meta[areaCode].items.map((item) => {
        if (item.attrcode == fundorg) {
            item.initialvalue = { 'display': org_Name, 'value': pk_org }
        }
    });
}
/**
 * 判断是否有默认业务单元数据
 * @param {*} data createUIDom请求返回数据
 */
export const hasDefaultOrg = function (data) {
    return data && data.context && data.context && data.context.pk_org;
}

/**
 * 判断查询区域查询条件是否有值
 * @param {*} props 页面内置对象
 * @param {*} areaCode 查询区域编码
 * @param {*} item 查询条件字段名
 */
const hasSearchValue = function (props, areaCode, item) {
    if (!props || !props.search || !areaCode || !item) {
        return false;
    }
    let searchValue = props.search.getSearchValByField(areaCode, item);
    return searchValue && searchValue.value && (searchValue.value.firstvalue || searchValue.value.secondvalue) ? true : false;
}
/*cYk6FLTqODaXIQhDR/JVGIzz7pX6QTdK0mV+6+T7UwCZ8qDlQhq9SKZaotas28hd*/