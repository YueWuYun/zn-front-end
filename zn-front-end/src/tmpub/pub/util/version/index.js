/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/

/**
 * 处理Form组织多版本
 * @author tangleic
 * @param {*} props 页面内置对象
 * @param {*} formOrgFieldObj form组织字段对象
 */
const formOrgVersionControl = function (props, formOrgFieldObj) {
    if (!props || Object.keys(formOrgFieldObj).length == 0) {
        return;
    }
    let status = props.getUrlParam("status");
    let show = {};
    let unshow = {};
    for (let areaCode of Object.keys(formOrgFieldObj)) {
        let orgFieldArr = formOrgFieldObj[areaCode];
        if (!orgFieldArr || orgFieldArr.length == 0) {
            continue;
        }
        //循环遍历组织字段，先判断组织字段在模板中是否显示，显示则处理组织和组织版本字段的显隐性
        for (let orgField of orgFieldArr) {
            //拼接组织版本字段名
            let v_orgField = orgField + '_v';
            //浏览态，显示版本信息，否则显示非浏览态
            let visible_org = props.form.getFormItemsVisible(areaCode, orgField);
            let visible_org_v = props.form.getFormItemsVisible(areaCode, v_orgField);
            if (status == 'browse') {
                if (visible_org || visible_org_v) {
                    show[v_orgField] = true;
                    unshow[orgField] = false;
                } else {
                    unshow[orgField] = false;
                    unshow[v_orgField] = false;
                }
            } else {
                if (visible_org || visible_org_v) {
                    show[orgField] = true;
                    unshow[v_orgField] = false;
                } else {
                    unshow[orgField] = false;
                    unshow[v_orgField] = false;
                }
            }
        }
        props.form.setFormItemsVisible(areaCode, show);
        props.form.setFormItemsVisible(areaCode, unshow);
    }
}



/**
 * 处理grid组织多版本
 * @param {*} props 
 * @param {*} gridOrgFieldObj 
 */
const gridOrgVersionControl = function (props, gridOrgFieldObj) {
    if (!props || Object.keys(gridOrgFieldObj).length == 0) {
        return;
    }
    let status = props.getUrlParam("status");
    for (let areaCode of Object.keys(gridOrgFieldObj)) {
        let orgFieldArr = gridOrgFieldObj[areaCode];
        if (!orgFieldArr || orgFieldArr.length == 0) {
            continue;
        }
        //获取版本字段
        let v_orgFieldArr = getOrgVersionFieldArr(orgFieldArr);
        //浏览态显示版本，编辑态显示非版本
        if (status == 'browse') {
            props.cardTable.showColByKey(areaCode, v_orgFieldArr);
            // setTimeout(() => {
            //     debugger
            //     props.cardTable.hideColByKey(areaCode, orgFieldArr)
            // }, 3000)
            props.cardTable.hideColByKey(areaCode, orgFieldArr);
        } else {
            props.cardTable.showColByKey(areaCode, orgFieldArr);
            props.cardTable.hideColByKey(areaCode, v_orgFieldArr);
        }
    }
}

/**
 * 获取版本字段名
 * @param {*} orgFieldArr 组织字段数组 
 */
const getOrgVersionFieldArr = function (orgFieldArr) {
    if (!orgFieldArr || orgFieldArr.length == 0) {
        return [];
    }
    let v_orgArr = [];
    for (let orgField of orgFieldArr) {
        //TODO 获取模板该字段是否显示，目前平台无此api 待平台提供后完善
        let v_org = orgField + '_v';
        v_orgArr.push(v_org);
    }
    return v_orgArr;
}

/**
 * 组织多版本试图
 * @param {*} props 
 * @param {*} headCode 
 * @param {*} orgField (主组织字段名，默认pk_org,可自行注入，非必输)
 * @param {*} orgVField (主组织版本字段名，默认pk_org_v,可自行注入，非必输)
 */
export const orgVersionView = function (props, headcode,
    orgField = 'pk_org', orgVField = 'pk_org_v') {
    if (!props || !headcode) {
        return;
    }
    let status = props.getUrlParam("status");
    //浏览态显示组织版本，编辑态显示组织
    let showflag = status == 'browse';
    let obj = {};
    obj[orgField] = !showflag;
    obj[orgVField] = showflag;
    props.form.setFormItemsVisible(headcode, obj);
}
/**
 * 组织多版本试图新解决效率问题
 * @param {*} props 
 * @param {*} headCode 
 * @param {*} orgField (主组织字段名，默认pk_org,可自行注入，非必输)
 * @param {*} orgVField (主组织版本字段名，默认pk_org_v,可自行注入，非必输)
 */
export const orgVersionViewNew = function (props, headcode,
    orgField = 'pk_org', orgVField = 'pk_org_v') {
    if (!props || !headcode) {
        return;
    }
    let status = props.getUrlParam("status");
    //浏览态显示组织版本，编辑态显示组织
    let showflag = status == 'browse';
    let obj = {};
    obj[orgField] = !showflag;
    obj[orgVField] = showflag;
    props.form.setItemsVisible(headcode, obj);
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/