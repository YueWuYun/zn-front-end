/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/**
 * 资金领域 公共api
 * 
 * @author tangleic
 */
import { print, ajax, toast, cardCache, promptBox } from 'nc-lightapp-front'
import { SCENE, URL_PARAM, COMMON_URL, cache, sagaField, tbbwarntype, SPLIT_TBBCTRLTYPE } from "../cons/constant";

/**
 * 判断是否是联查场景
 * @param {*} props 页面内置对象
 */
export const isLinkScene = function (props) {
    //获取场景标志
    let scene = props.getUrlParam(URL_PARAM.SCENE);
    //是否预算反联查(鄙视，预算反联查没有联查标志，只能通过是否有参数值来判断是否预算反联查)
    let isTbbLink = !props.getUrlParam(URL_PARAM.TBB_LINK) ? false : true;
    //被联查场景(凭证反联查以及预算反联查)不渲染查询区域，故无需加载默认业务单元到查询区域
    return (isTbbLink || scene == SCENE.LINK || scene == SCENE.FIP) ? true : false;
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
    try {
        let searchValue = props.search.getSearchValByField(areaCode, item);
        return searchValue && searchValue.value && (searchValue.value.firstvalue || searchValue.value.secondvalue) ? true : false;
    } catch (e) {
        //console.log(e);
        return true;
    }
}
/**
 * 给卡片头部区域赋默认业务单元(在setMeta之后使用)
 * @param {*} props 页面内置对象
 * @param {*} areaCode 卡片头部区域编码
 * @param {*} data  createUIDom请求返回数据
 */
export const setDefOrg2Form = function (props, areaCode, data) {
    //判空
    if (!props || !areaCode || !hasDefaultOrg(data)) {
        return;
    }
    let { pk_org, org_Name, pk_org_v, org_v_Name } = data.context;
    //将默认业务单元加载到头部表单
    props.form.setFormItemsValue(areaCode, {
        'pk_org': { value: pk_org, display: org_Name },
        'pk_org_v': { value: pk_org_v, display: org_v_Name },
    })
}

/**
 * 给列表查询区域赋默认业务单元(在setMeta之后使用)
 * @param {*} props 页面内置对象
 * @param {*} areaCode 列表查询区域编码
 * @param {*} data  createUIDom请求返回数据
 */
export const setDefOrg2ListSrchArea = function (props, areaCode, data, field = 'pk_org') {
    //判空
    if (!props || !props.search || !areaCode || !hasDefaultOrg(data)) {
        return;
    }
    //联查场景不渲染查询区域
    if (isLinkScene(props)) {
        return;
    }
    //判断查询区域组织是否有值，如果有则表明快速查询方案已个性化定制。无需加载默认业务单元
    if (hasSearchValue(props, areaCode, field)) {
        return;
    }
    //获取默认业务单元
    let { pk_org, org_Name } = data.context;
    let searchData = { 'display': org_Name, 'value': pk_org };
    //更新列表查询区域
    props.search.setSearchValByField(areaCode, field, searchData);
}

/**
 * 给高级查询区域赋默认业务单元(在setMeta之前使用)
 * 
 * @param {*} props 页面内置对象
 * @param {*} areaCode 列表查询区域编码
 * @param {*} data  createUIDom请求返回数据
 */
export const setDefOrg2AdvanceSrchArea = function (props, areaCode, data, field = 'pk_org') {
    //判空
    if (!props || !props.search || !areaCode || !hasDefaultOrg(data) || !data.template) {
        return;
    }
    //联查场景不渲染查询区域
    if (isLinkScene(props)) {
        return;
    }
    let meta = data.template;
    //获取默认业务单元
    let { pk_org, org_Name } = data.context;
    //遍历查询区域字段，将默认业务单元赋值给组织字段
    meta[areaCode].items.map((item) => {
        if (item.attrcode == field) {
            item.initialvalue = { 'display': org_Name, 'value': pk_org }
        }
    });
}

/**
 * 联查隐藏翻页按钮专用
 * 
 * @param {*} props 页面内置对象
 * @param {*} tableCode 列表tableID
 * @param {*} data  createUIDom请求返回数据
 */
export const showPagination = function (props, tableCode, data) {
    if (!props || !tableCode || !data || data.template) {
        return;
    }
    let meta = data.template;
    //联查场景不渲染查询区域
    meta[tableCode].pagination = !isLinkScene(props);
}

//获取拓展数据对象的键
const getExtObjKey = function (appCode) {
    return appCode + "_" + "extObj";
}

const getMultiLangKey = function () {
    return 'multiLang';
}
/**
 * 将数据存储到页面级缓存
 * @param {*} props 页面内置对象
 * @param {*} appCode 应用编码
 * @param {*} key 键
 * @param {*} value 值 
 */
export const setPropCache = function (props, appCode, key, value) {
    //参数判空
    if (!props || !appCode || !key) {
        return;
    }
    const extObjKey = getExtObjKey(appCode);
    //从页面级缓存中获取拓展对象
    let extObj = props.ViewModel.getData(extObjKey);
    if (!extObj) {
        extObj = {};
    }
    //将键值对存储到拓展对象
    extObj[key] = value;
    //将拓展对象存储到页面级缓存
    props.ViewModel.setData(extObjKey, extObj);
}

/**
 * 获取页面级缓存中指定键的数据
 * @param {*} props 页面内置对象
 * @param {*} appCode 应用编码
 * @param {*} key 键
 */
export const getPropCache = function (props, appCode, key) {
    //参数判空
    if (!props || !appCode || !key) {
        return null;
    }
    const extObjKey = getExtObjKey(appCode);
    //从页面级缓存中获取拓展对象
    let extObj = props.ViewModel.getData(extObjKey);
    if (!extObj || !extObj.hasOwnProperty(key)) {
        return null;
    }
    //从页面级缓存中获取指定键的值
    return extObj[key];
}

/**
 * 存储多语资源
 * @param {*} props 
 * @param {*} multiLang 
 */
export const saveMultiLangRes = function (props, multiLang) {
    if (!props || !multiLang) {
        return;
    }
    let key = getMultiLangKey();
    props.ViewModel.setData(key, multiLang);
}

/**
 * 追加多语资源
 * @param {*} props 页面内置对象
 * @param {*} multiLang 多语资源
 */
export const appendMultiLangRes = function (props, multiLang) {
    if (!props || !multiLang) {
        return;
    }
    //获取多语资源
    let lang = getMultiLangRes(props);
    if (!lang) {
        saveMultiLangRes(props, multiLang);
    } else {
        Object.assign(lang, multiLang);
    }
}
/**
 * 获取多语资源对象
 * @param {*} props 
 */
export const getMultiLangRes = function (props) {
    if (!props) {
        return;
    }
    let key = getMultiLangKey();
    return props.ViewModel.getData(key);
}

/**
 * 加载多语信息
 * @param {*} props 页面内置对象
 * @param {*} key 多语资源键
 */
export const loadMultiLang = function (props, key) {
    //获取多语资源
    const lang = getMultiLangRes(props);
    if (!lang) {
        return '';
    }
    return lang[key] || '';
}

/**
 * 构建编辑后事件表头数据
 * @param {*} props 页面内置对象
 * @param {*} headCode 表头区域编码
 */
const buildAfterEditHeadData = function (props, headCode) {
    let data = {};
    let formData = props.form.getAllFormValue(headCode);
    formData['areacode'] = headCode;
    data[headCode] = formData;
    return data;
}

/**
 * 构建表体编辑后事件数据
 * @param {*} props 页面内置对象
 * @param {*} bodyCode 表体区域编码
 */
const buildAfterEditBodyData = function (props, bodyCode) {
    let bodyData = {
        'rows': props.cardTable.getChangedRows(bodyCode),
        'areaType': 'table',
        'areacode': bodyCode
    };
    let data = {};
    data[bodyCode] = bodyData;
    return data;
}

/**
 * 构建编辑后事件的卡片数据
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 表头区域编码
 * @param {*} bodyCode 表体区域编码（当前修改的表体）
 * @param {*} attrcode 修改的字段
 * @param {*} changedrows 修改的行信息
 * @param {*} index 行索引
 * @param {*} isSingleBody 是否单表体
 */
const buildAfterEditEventData = function (props, pageCode, headCode, bodyCode, attrcode, changedrows, index, isSingleBody) {
    let card = {
        'head': buildAfterEditHeadData(props, headCode),
        'pageid': pageCode
    };
    if (isSingleBody) {
        card['body'] = buildAfterEditBodyData(props, bodyCode);
    } else {
        card['bodys'] = buildAfterEditBodyData(props, bodyCode);
    }
    return {
        'areacode': bodyCode,
        attrcode,
        card,
        changedrows,
        index,
    };
}
/**
 * 构建精简表体编辑后事件数据(旨在替代原来平台API：createBodyAfterEventData，只保留修改的当前行数据)
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 表头区域编码
 * @param {*} handleBodyCode 当前操作表体区域编码
 * @param {*} attrCode 编辑的字段
 * @param {*} changeRows 编辑的行信息
 * @param {*} index 行索引
 * @param {*} isSingleBody 是否是单表体
 */
export const buildLightBodyAfterEditData = function (props, pageCode, headCode, handleBodyCode, attrCode, changeRows, index, isSingleBody = false) {
    try {
        //参数判空
        if (!props || !pageCode || !headCode || !handleBodyCode || !attrCode || !changeRows) {
            throw new Error("参数缺失！");
        }
        //构建表体编辑后事件数据
        let eventData = buildAfterEditEventData(props, pageCode, headCode, handleBodyCode, attrCode, changeRows, index, isSingleBody);
        let { card } = eventData;
        let { body, bodys } = card;
        //当编辑后事件数据只有一行表体时，不做额外处理。有多行时，对多行表体过滤，只保留当前编辑行
        if ((isSingleBody && body[handleBodyCode].rows.length == 1)
            || (!isSingleBody && bodys[handleBodyCode].rows.length == 1)) {
            return eventData;
        }
        let newRowArr = [];
        //修改行的行ID
        let changeRowID = changeRows[0].rowid;
        //获取当前编辑的表体
        body = isSingleBody ? body[handleBodyCode] : bodys[handleBodyCode];
        if (!body) {
            throw new Error("未获取到指定的表体[" + handleBodyCode + "]!");
        }
        let { rows } = body;
        for (let row of rows) {
            let { rowid } = row;
            //过滤非当前修改的行
            if (!rowid || rowid != changeRowID) {
                continue;
            }
            newRowArr.push(row);
            break;
        }
        if (newRowArr.length == 0) {
            throw new Error("未找到修改的行!");
        }
        body.rows = newRowArr;
        return eventData;
    } catch (e) {
        //console.log("构建精简表体编辑后数据时出错！:" + e.message);
        throw e;
    }
}

/**
 * 清空值为空的字段
 * @param {*} rows 字段数组
 */
const filterEmptyItem = function (rows) {
    if (!rows || rows.length == 0) {
        return null;
    }
    //遍历行数据
    for (let row of rows) {
        if (!row || !row.values || Object.keys(row.values).length == 0) {
            continue;
        }
        let { values } = row;
        let keys = Object.keys(values);
        //遍历一行数据中所有字段，过滤空值字段
        for (let key of keys) {
            let item = values[key];
            if (!item || Object.keys(item).length == 0 || !item.value) {
                delete values[key];
            }
        }
    }
}
/**
 * 构建一主一子页面数据
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 头部区域编码
 * @param {*} bodyCode 表体区域编码
 * @param {*} clearEmptyItem 是否过滤空值字段
 */
const createSimpleBillDataOneBody = function (props, pageCode, headCode, bodyCode, clearEmptyItem) {
    let billData = props.createMasterChildDataSimple(pageCode, headCode, bodyCode);
    let { head, body } = billData;
    if (clearEmptyItem) {
        filterEmptyItem(head[headCode].rows);
        filterEmptyItem(body[bodyCode].rows);
    }
    return billData;
}

/**
 * 构建一主多子页面数据
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 头部区域编码
 * @param {*} bodyCodeArr 表体区域编码数组
 * @param {*} clearEmptyItem 是否过滤空值字段
 */
const createSimpleBillDataMultiBody = function (props, pageCode, headCode, bodyCodeArr, clearEmptyItem) {
    let billData = props.createExtCardDataSimple(pageCode, headCode, bodyCodeArr);
    let { head, bodys } = billData;
    if (clearEmptyItem) {
        filterEmptyItem(head[headCode].rows);
        for (let bodyCode of bodyCodeArr) {
            filterEmptyItem(bodys[bodyCode].rows);
        }
    }
    return billData;
}

/**
 * 构建轻量级的页面数据(适合保存操作)
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 头部区域编码
 * @param {*} bodyCodes 表体区域编码（一主多子为表体区域编码数组）
 * @param {*} clearEmptyItem 是否过滤空值字段(默认不过滤)
 */
export const createSimpleBillData = function (props, pageCode, headCode, bodyCodes, clearEmptyItem = false) {
    if (!props || !pageCode || !headCode || !bodyCodes) {
        return null;
    }
    //根据表体区域编码参数来判断是一主一子还是一主多子
    let isMultiBody = Array.isArray(bodyCodes) ? (bodyCodes.length > 1) : false;
    let bodyCodeArr = Array.isArray(bodyCodes) ? bodyCodes : [bodyCodes];
    let billData = null;
    //一主一子单据处理
    if (!isMultiBody) {
        billData = createSimpleBillDataOneBody(props, pageCode, headCode, bodyCodeArr[0], clearEmptyItem);
    }
    //一主多子单据处理
    else {
        billData = createSimpleBillDataMultiBody(props, pageCode, headCode, bodyCodeArr, clearEmptyItem);
    }
    return billData;
}

/**
 * 电子签章列表打印
 * @param {*} props 
 * @param {*} param1 
 */
export const elecSignListPrint = function (props, {
    //打印地址
    url,
    //是否正式打印(默认补充打印)
    offical = false,
    //应用编码
    appCode,
    //模版标示
    nodeKey,
    //表格区域编码
    tableCode,
    //主键字段
    field_id,
    //单据编号字段(默认vbillno)
    field_billno = 'vbillno',
    //获取组织字段的值（不注入默认按照pk_org来获取）
    getOrgFunc,
    //数据校验逻辑（没有则默认每一条数据都可以进行电子签章打印,如果不通过需要返回返回异常信息）
    validateFunc
}) {
    //参数判空
    if (!url || !appCode || !tableCode || !field_id || !field_billno) {
        throw new Error("参数缺失！");
    }
    let selectDatas = props.table.getCheckedRows(tableCode);
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0) {
        toast({ color: 'warning', content: loadMultiLang(props, '3601-000010') });/* 国际化处理： 未选中行！*/
        return;
    }
    let detail = [];
    let errMessArr = [];
    //遍历选中数据，获取打印需要的参数
    for (let selectData of selectDatas) {
        //主键
        let id = selectData && selectData.data && selectData.data.values && selectData.data.values[field_id] && selectData.data.values[field_id].value;
        if (!id) {
            continue;
        }
        //单据编号
        let vbillno = selectData && selectData.data && selectData.data.values && selectData.data.values[field_billno] && selectData.data.values[field_billno].value;
        //组织
        let pk_org = selectData && selectData.data && selectData.data.values && selectData.data.values['pk_org'] && selectData.data.values['pk_org'].value;
        //行索引
        let index = selectData.index;
        //获取自定义的组织
        if (getOrgFunc && (typeof getOrgFunc == 'function')) {
            pk_org = getOrgFunc(selectData);
        }
        //业务自定义的校验
        let flag = true;
        if (validateFunc && (typeof validateFunc == 'function')) {
            let errMess = validateFunc(selectData);
            if (errMess) {
                errMessArr.push(buildErrMess(props, errMess, vbillno, index));
                flag = false;
            }
        }
        if (flag) {
            detail.push({ id, vbillno, pk_org, index });
        }
    }
    elecSignPrint(props, {
        url, offical, appCode, nodeKey, detail, errMessArr
    });
}

/**
 * 电子签章卡片打印
 * @param {*} props 
 * @param {*} param1 
 */
export const elecSignCardPrint = function (props, {
    //打印地址
    url,
    //是否正式打印(默认补充打印)
    offical = false,
    //应用编码
    appCode,
    //模版标示
    nodeKey,
    //表格区域编码
    headCode,
    //主键字段
    field_id,
    //单据编号字段(默认vbillno)
    field_billno = 'vbillno',
    //获取组织字段的值（不注入默认按照pk_org来获取）
    getOrgFunc,
    //数据校验逻辑（没有则默认每一条数据都可以进行电子签章打印,如果不通过需要返回返回异常信息）
    validateFunc }
) {
    //参数判空
    if (!url || !appCode || !headCode || !field_id || !field_billno) {
        throw new Error("参数缺失！");
    }
    //主键
    let id = props.form.getFormItemsValue(headCode, field_id).value;
    //单据编号
    let vbillno = props.form.getFormItemsValue(headCode, field_billno).value;
    //组织
    let pk_org = props.form.getFormItemsValue(headCode, 'pk_org').value;
    //如果有自定义获取组织的逻辑则采用自定义的逻辑来获取组织
    if (getOrgFunc && (typeof getOrgFunc == 'function')) {
        pk_org = getOrgFunc();
    }
    let errMessArr = [];
    let flag = true;
    if (validateFunc && (typeof validateFunc == 'function')) {
        let errMess = validateFunc();
        if (errMess) {
            errMessArr.push(buildErrMess(props, errMess, vbillno, 0));
            flag = false;
        }
    }
    elecSignPrint(props, {
        url,
        offical,
        appCode,
        nodeKey,
        detail: flag ? [{ id, vbillno, pk_org }] : null,
        errMessArr
    })
}

/**
 * 电子签章打印输出错误信息
 * @param {*} props 
 * @param {*} errMessArr 
 */
const elecSingPrintErrMsg = function (props, errMessArr) {
    if (!errMessArr || errMessArr.length == 0) {
        return;
    }
    else if (errMessArr.length == 1) {
        toast({
            duration: 'infinity',
            color: 'danger',
            content: errMessArr[0],
            hasCloseBtn: true
        });
    } else {
        //提示
        toast({
            duration: 'infinity',
            color: 'danger',
            TextArr: [loadMultiLang(props, '3601-000000'), loadMultiLang(props, '3601-000001'), loadMultiLang(props, '3601-000021')],/* 国际化处理： 展开,收起,我知道了*/
            groupOperation: true,
            groupOperationMsg: errMessArr
        });
    }
}
/**
 * 电子签章打印
 * @param {*} props 
 * @param {*} param 
 */
const elecSignPrint = function (props, {
    //打印地址
    url,
    //是否正式打印
    offical,
    //应用编码
    appCode,
    //模版标示 
    nodeKey,
    //打印数据明细
    detail,
    //异常信息数组
    errMessArr = [] }
) {
    //没有要检查的数据，但是有异常信息，则直接提示，不再与后端交互
    if ((errMessArr && errMessArr.length > 0) && (!detail || detail.length == 0)) {
        elecSingPrintErrMsg(props, errMessArr);
        return;
    }
    //构建检查参数
    const checkParam = {
        offical, detail
    }
    ajax({
        url: COMMON_URL.ELECSIGNPRINTCHECK,
        data: checkParam,
        success: (res) => {
            let { passPKs, passInfos, unPassInfos } = res.data;
            if (errMessArr.length > 0 || (unPassInfos && unPassInfos.length > 0)) {
                //遍历检查不通过的数据，组装提示信息
                for (let unPassInfo of unPassInfos) {
                    let { vbillno, mess, index } = unPassInfo;
                    let errMess = buildErrMess(props, mess, vbillno, index);
                    errMessArr.push(errMess);
                }
                elecSingPrintErrMsg(props, errMessArr);
            }
            //有检查通过的数据，则进行打印
            if (passPKs && passPKs.length > 0 && passInfos && passInfos.length > 0) {
                const printParam = {
                    offical,
                    detail: passInfos
                }
                print(
                    'pdf',
                    url,
                    {
                        nodekey: nodeKey,//模版标示
                        appcode: appCode,//应用编码
                        oids: passPKs,//单据主键
                        userjson: JSON.stringify(printParam)
                    }
                );
            }
        }
    })
}

//组装异常信息
const buildErrMess = function (props, errMess, vbillno, index) {
    return loadMultiLang(props, '3601-000008') + vbillno + loadMultiLang(props, '3601-000009') + errMess || '';
}

/**
 * 添加自定义项参照过滤
 * @param {*} props 页面内置对象
 * @param {*} param 参数对象
 */
export const addDefReferFilter = function (props, { /**表头区域编码 */headCode, /**区域编码 */areaCode, /**模版元数据 */meta, /**组织字段名 */orgField, /**自定义获取组织的方法 */getOrgFunc }) {
    if (!areaCode || !meta || (!headCode && !orgField && !getOrgFunc)) {
        return;
    }
    let areaCodeArr = Array.isArray(areaCode) ? areaCode : [areaCode];
    for (let code of areaCodeArr) {
        meta[code].items.map(item => {
            if (item.attrcode.startsWith('vdef') || item.attrcode.startsWith('vuserdef')) {
                item.queryCondition = () => {
                    return {
                        pk_org: (getOrgFunc && (typeof getOrgFunc == 'function')) ? getOrgFunc() : ((props.form.getFormItemsValue(headCode, orgField) || {}).value)
                    };
                };
            }
        })
    }
}

/**缓存汇率信息 */
const cacheRateInfo = function ({ rateInfo, datasource }) {
    if (!rateInfo || !datasource) {
        return;
    }
    cardCache.setDefData(cache.rateinfo, datasource, rateInfo);
    let obj = cardCache.getDefData(cache.rateinfo, datasource);
    //console.log(obj);
}

/** 编辑后事件处理汇率 */
export const bodyRateEditOnAfterEdit = function ({ props, bodyCodes, rateInfo, datasource, olcRates, glcRates, gllcRates }) {
    if (!props || !rateInfo || !datasource || !bodyCodes) {
        return;
    }
    //缓存汇率信息
    cacheRateInfo({ rateInfo, datasource });
    //兼容非数组场景
    if (!Array.isArray(bodyCodes)) {
        bodyCodes = [bodyCodes];
    }
    let { olcRateEditable, glcRateEditable, gllcRateEditable } = rateInfo;
    for (let bodyCode of bodyCodes) {
        //处理组织本币汇率
        if (olcRates) {
            //兼容非数组场景
            if (!Array.isArray(olcRates)) {
                olcRates = [olcRates];
            }
            props.cardTable.setColEditableByKey(bodyCode, olcRates, !olcRateEditable);
        }
        //处理集团本币汇率
        if (glcRates) {
            //兼容非数组场景
            if (!Array.isArray(glcRates)) {
                glcRates = [glcRates];
            }
            props.cardTable.setColEditableByKey(bodyCode, glcRates, !glcRateEditable);
        }
        //处理全局本币汇率
        if (gllcRates) {
            //兼容非数组场景
            if (!Array.isArray(gllcRates)) {
                gllcRates = [gllcRates];
            }
            props.cardTable.setColEditableByKey(bodyCode, gllcRates, !gllcRateEditable);
        }
    }
}

/**获取缓存中的汇率信息 */
export const getCacheRateValue = function ({ datasource }) {
    if (!datasource) {
        return;
    }
    let rateInfo = cardCache.getDefData(cache.rateinfo, datasource);
    if (!rateInfo) {
        return null;
    }
    return {
        olcRate: rateInfo.olcRate,
        glcRate: rateInfo.glcRate,
        gllcRate: rateInfo.gllcRate
    }
}
/**给新的行注入汇率 */
export const setRate2NewRow = function ({ olcRates, glcRates, gllcRates, datasource, row }) {
    if (!datasource) {
        return;
    }
    let rateInfo = getCacheRateValue({ datasource });
    if (!rateInfo) {
        return;
    }
    let { olcRate, glcRate, gllcRate } = rateInfo;
    if (olcRates) {
        if (!Array.isArray(olcRates)) {
            olcRates = [olcRates];
        }
        for (let rate of olcRates) {
            row[rate] = { value: olcRate };
        }
    }
    if (glcRates) {
        if (!Array.isArray(glcRates)) {
            glcRates = [glcRates];
        }
        for (let rate of glcRates) {
            row[rate] = { value: glcRate };
        }
    }
    if (gllcRates) {
        if (!Array.isArray(gllcRates)) {
            gllcRates = [gllcRates];
        }
        for (let rate of gllcRates) {
            row[rate] = { value: gllcRate };
        }
    }
}

/**
 * 列表websocket
 * @param {*} props 
 */
export const createListWebSocket = function (props, {
    //表格区域编码
    tableAreaCode,
    //表格主键字段名
    tablePkName,
    //单据类型
    billtype,
    //缓存数据源
    dataSource,
    //本地测试时指定websocket服务器ip:port
    serverLocation
}) {
    if (!props || !tableAreaCode || !tablePkName || !billtype) {
        return;
    }
    const { socket } = props;
    let param = {
        tableAreaCode,
        billpkname: tablePkName,
        billtype,
        dataSource
    }
    if (serverLocation) {
        param['serverLocation'] = serverLocation;
    }
    return (<div>{socket.connectMesg(param)}</div>);
}

/**
 * 创建卡片websocket连接
 * @param {*} props 
 * @param {*} param1 
 */
export const createCardWebSocket = function (props, {
    //表头按钮区域编码
    headBtnAreaCode,
    //表头区域编码
    formAreaCode,
    //单据主键字段
    billpkname,
    //单据类型
    billtype,
    //缓存数据源
    dataSource,
    //本地测试时指定websocket服务器ip:port
    serverLocation
}) {
    if (!props || !headBtnAreaCode || !formAreaCode || !billpkname || !billtype) {
        return;
    }
    const { socket } = props;
    let param = {
        headBtnAreaCode,
        formAreaCode,
        billtype,
        billpkname,
        dataSource
    }
    if (serverLocation) {
        param['serverLocation'] = serverLocation;
    }
    return (<div>{socket.connectMesg(param)}</div>)
}

/**异常按钮显示 */
export const showErrBtn = function (props, {
    headBtnCode,
    headAreaCode,
    fieldPK,
    datasource,
}) {
    if (!props || !headBtnCode || !headAreaCode) {
        return;
    }
    let status = props.getUrlParam(URL_PARAM.STATE);
    let saga_status = '0';
    try {
        saga_status = props.form.getFormItemsValue(headAreaCode, sagaField.status).value;
    } catch (error) {
        saga_status = '0';
    }
    let errFlag = (saga_status === "1") && (status == 'browse');
    props.button.toggleErrorStatus(headBtnCode, { isError: errFlag });
    if (errFlag) {
        errToast(props, { headAreaCode, fieldPK });
    }
}

/**异常提示 */
const errToast = function (props, {
    headAreaCode,
    fieldPK,
}) {
    if (!headAreaCode || !fieldPK) {
        return;
    }
    //begin tm tangleic 20191212 取消通过缓存标志来控制是否提示，UE交互决定只要刷新就提示，无需区分
    //是否异常提示（这里从缓存中获取，业务单据在列表跳转卡片的动作中注入缓存标志）
    // let iserrtoast = cardCache.getDefData(cache.iserrtoast, datasource);
    // if (!iserrtoast) {
    // return;
    // }
    //避免标志位重复 立即初始化标志位
    // cardCache.setDefData(cache.iserrtoast, datasource, false);
    //end tangleic
    let status = props.getUrlParam("status");
    let gtxid = props.form.getFormItemsValue(headAreaCode, sagaField.gtxid);
    let billpk = props.form.getFormItemsValue(headAreaCode, fieldPK);
    if ((status == 'browse') && gtxid && gtxid.value && billpk && billpk.value) {
        props.socket.showToast({
            gtxid: gtxid.value,
            billpk: billpk.value
        });
    }
}
/**冻结按钮控制 */
export const frozenBtnCtrl = function (props, { btnCodes }) {
    if (!props || !btnCodes) {
        return;
    }
    let btnArr = Array.isArray(btnCodes) ? btnCodes : [btnCodes];
    let status = props.getUrlParam(URL_PARAM.STATE);
    if (status != 'browse') {
        return;
    }
    let saga_frozen = '1';
    try {
        saga_frozen = props.form.getFormItemsValue(headAreaCode, sagaField.frozen).value;
    } catch (error) {
        saga_frozen = '1';
    }
    props.button.setButtonDisabled(btnArr, saga_frozen == '1');
}

/**构建表体区域编码数组 */
const buildBodyCodeArr = function (bodyCodes) {
    //表体区域编码兼容 单个和数组
    if (!bodyCodes) {
        return [];
    } else if (!Array.isArray(bodyCodes)) {
        return [bodyCodes]
    } else {
        return bodyCodes;
    }
}
/** 预保存(实现验证公式) */
const preSave = function (props, {
    //页面编码
    pageCode,
    //表头区域编码
    headCode,
    //表体区域编码数组
    bodyCodeArr,
    //保存逻辑
    saveFunc
}) {
    //获取界面数据
    let billdata = {};
    let saveObj = {};
    //考虑单表
    if (bodyCodeArr.length == 0) {
        billdata = {
            pageid: pageCode,
            model: {
                areacode: headCode,
                rows: props.form.getAllFormValue(headCode).rows,
                areaType: 'form'
            }
        };
        saveObj[headCode] = 'form';
    } else {
        billdata = (bodyCodeArr.length > 1) ?
            props.createExtCardData(pageCode, headCode, bodyCodeArr) :
            props.createMasterChildData(pageCode, headCode, bodyCodeArr[0]);
        //组装区域数据
        for (let code of bodyCodeArr) {
            saveObj[code] = 'cardTable';
        }
    }
    props.validateToSave(billdata, saveFunc, saveObj, '');
}
/**构建保存数据 */
const buildSaveData = async function (props, {
    //页面编码
    pageCode,
    //表头区域编码
    headCode,
    //表体区域编码数组
    bodyCodeArr,
    //保存校验
    saveValidate,
    //处理保存数据
    processSaveData,
}) {
    //表头必输项校验
    if (!props.form.isCheckNow(headCode)) {
        return null;
    }
    //表体存在则校验表体
    if (bodyCodeArr && bodyCodeArr.length > 0 && !props.cardTable.checkTableRequired()) {
        return null;
    }
    //校验
    if (saveValidate && (typeof saveValidate == 'function')) {
        if (!saveValidate()) {
            return null;
        }
    }
    //构建卡片界面数据（流量优化后去除display和scale）
    let billdata = createSimpleBillData(props, pageCode, headCode, bodyCodeArr);
    //处理保存数据
    if (processSaveData && (typeof processSaveData == 'function')) {
        billdata = await processSaveData(billdata);
    }
    //组装请求数据
    return { data: JSON.stringify(billdata), pageCode: pageCode };
}

/**公共的保存提交 */
export const saveCommit = async function (props, {
    //页面编码
    pageCode,
    //表头区域编码
    headCode,
    //表体区域编码(多表体注入数组)
    bodyCode,
    //请求url
    url,
    //指派数据
    assign,
    //显示指派框的方法
    showAssignFunc,
    //更新界面数据的方法
    updateViewFunc,
    //保存校验逻辑（需要返回boolean）
    saveValidate,
    //处理保存数据
    processSaveData,
    //拓展参数
    extParam
}) {
    if (!pageCode || !headCode || !url || !showAssignFunc || !updateViewFunc) {
        return;
    }
    //拓展参数容错
    if (!extParam) {
        extParam = {};
    }
    let bodyCodeArr = buildBodyCodeArr(bodyCode);
    let data = await buildSaveData(props, { pageCode, headCode, bodyCodeArr, saveValidate, processSaveData });
    if (!data) {
        return;
    }
    //将指派信息追加到拓展参数
    if (assign) {
        extParam['content'] = JSON.stringify(assign);
    }
    //将拓展参数追加到请求数据
    data['extParam'] = extParam;
    preSave(props, {
        pageCode,
        headCode,
        bodyCodeArr,
        saveFunc: () => {
            ajax({
                url: url,
                data,
                success: (res) => {
                    let { workflow } = res.data;
                    //有指派信息，则指派 没有则更新界面
                    if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                        showAssignFunc(res);
                    } else {
                        updateViewFunc(res);
                    }
                }
            });
        }
    })
}

/**
 * 获取预算信息
 * @return 预算提示信息
 */
export const getTBBMsg = function ({
    //行数据
    row,
    //预算信息字段名
    msgfield }) {
    if (!msgfield) {
        msgfield = 'ntbinfo'
    }
    let ntbinfo = (row && row.values && row.values[msgfield] || {}).value;
    if (ntbinfo) {
        //清空预算提示字段
        row.values[msgfield] = { value: null, display: null };
    }
    return ntbinfo;
}

/**
 * 卡片预算信息提示（主要用于柔性控制提示）
 * @return 是否进行过预算提示
 */
export const showTBBMsg = function ({
    //表头数据
    head,
    //表头区域编码
    headCode,
    //预算信息字段名
    msgfield }) {
    if (!head || !headCode || !head[headCode] || !head[headCode].rows || head[headCode].rows.length == 0) {
        return false;
    }
    let flag = false;
    let row = head[headCode].rows[0];
    let ntbinfo = getTBBMsg({ row, msgfield });
    if (ntbinfo) {
        //气泡提示
        toast({ color: 'warning', content: ntbinfo });
        flag = true;
    }
    return flag;
}

/**
 * 预算预警弹框
 */
export const tbbWarnDialog = function (props, {
    //预算预警信息
    ntbinfos,
    //确认事件
    onConfirm,
}) {
    if (!ntbinfos || ntbinfos.length == 0) {
        return;
    }
    //主键数组
    let pkArr = [];
    //是否多条
    let ismulti = ntbinfos.length > 1;
    let index = 1;
    //多条时第一条信息为汇总信息
    let lineArr = ismulti ? [loadMultiLang(props, '3601-000019')/* 国际化处理： 总共*/ + '[' + ntbinfos
        .length + ']' + loadMultiLang(props, '3601-000020')/* 国际化处理： 条数据超预算*/] : [];
    for (let ntbinfo of ntbinfos) {
        if (ntbinfo == null) {
            continue;
        }
        let { pk, msg, vbillno } = ntbinfo;
        if (!pk || !vbillno) {
            continue;
        }
        pkArr.push(pk);
        let line = '';
        //只有多条 时拼接序号，单据编号
        if (ismulti) {
            line = '' + index + '. ' + loadMultiLang(props, '3601-000018')/* 国际化处理： 单据号*/ + '[' + vbillno + '] ';
        }
        lineArr.push(<li>{line + msg}</li>)
        index++;
    }
    if (lineArr.length == 0) {
        return;
    }
    promptBox({
        color: "warning",
        title: loadMultiLang(props, '3601-000017'),/* 国际化处理： 预算预警提示信息*/
        content: <ul>{lineArr}</ul>,
        beSureBtnClick: () => {
            onConfirm(pkArr);
        }
    });
}

/**
 * 跳转卡片检查
 */
export const go2CardCheck = function ({
    //页面内置对象
    props,
    //请求url
    url,
    //数据主键
    pk,
    //时间戳
    ts,
    //主键字段名
    fieldPK,
    //动作编码（权限检查 空则不检查）
    actionCode,
    //权限编码（权限检查 空则不检查）
    permissionCode,
    //是否进行saga检查(默认检查，不涉及云原生改造的单据不用检查)
    checkSaga = true,
    //是否进行ts检查（默认检查，非操作按钮导致的跳转不用检查）
    checkTS = true,
    //检查通过真正的跳转逻辑
    go2CardFunc,
}) {
    if (!go2CardFunc || typeof go2CardFunc != 'function') {
        return;
    }
    if (!props || !url || !pk || !ts || !fieldPK) {
        go2CardFunc();
    }
    ajax({
        url,
        data: { pk, ts, actionCode, permissionCode, fieldPK, checkSaga, checkTS },
        success: (res) => {
            go2CardFunc();
        }
    });
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/