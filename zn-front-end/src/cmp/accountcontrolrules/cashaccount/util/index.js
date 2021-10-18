/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//引入常量定义
import { FIELD, URL_INFO, data_source, PAGE_STATUS, appcode, card_page_id, card_form_id, list_page_id, list_search_id, list_table_id } from "../cons/constant";
//引入轻量化api
import { ajax, cardCache, toast } from 'nc-lightapp-front';
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
//引入卡片事件
import { buttonVisible } from "../card/events/index";

/**
 * 获取多语
 * @param {*} props
 * @param {*} langCode
 */
export const getLang = function (props, langCode) {
    let code = appcode + '-' + langCode;
    let text = props.MutiInit.getIntl(appcode) && props.MutiInit.getIntl(appcode).get(code);
    return text;
}

/**
 * 获取多语
 * @param {*} props 页面属性
 * @param {*} searchVal 查询条件
 * @param {*} pks 要查询的pk数组
 */
export const getListQueryData = function (props, searchVal, pks) {
    let pageInfo = props.table.getTablePageInfo(list_table_id);
    let queryInfo = props.search.getQueryInfo(list_search_id);
    let oid = queryInfo && queryInfo.oid;
    let data = {
        querycondition: searchVal,
        pageInfo: pageInfo,
        pageCode: list_page_id,
        queryAreaCode: list_search_id,  //查询区编码
        oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree',
        pks: pks
    };
    return data;
}

/**
 * 组织多版本控制
 * @param {*} props 
 */
export const versionControl = function (props) {
    //组织版本试图
    orgVersionView(props, card_form_id);
}

/**
* 处理公式
* @param {*} res 
* @param {*} props 
*/
export const processFormulamsg = function (props, res) {
    if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
        let obj = {};
        props.dealFormulamsg(
            formulamsg,
            obj
        );
    }
}

/**
 * 保存
 * @param {*} props  页面内置对象
 */
export const save = async function (props, callback) {
    let status = props.getUrlParam(URL_INFO.PARAM.STATUS);
    if (status != PAGE_STATUS.ADD && status != PAGE_STATUS.EDIT) {
        return;
    }
    // 必输项校验    
    if (!validateField(props)) {
        return;
    }
    let billdata = props.createFormAfterEventData(card_page_id, card_form_id);
    ajax({
        url: URL_INFO.CARD.SAVE,
        data: billdata,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                props.beforeUpdatePage();//打开开关
                if (data) {
                    props.form.setAllFormValue({ [card_form_id]: data[card_form_id] });
                }
                let voValues = data[card_form_id].rows[0].values
                let pk = voValues.pk_cashaccrule.value;
                //处理缓存
                if (status == PAGE_STATUS.ADD) {
                    cardCache.addCache(pk, data, card_form_id, data_source, voValues);
                } else {
                    cardCache.updateCache(FIELD.PKCASHACCRULE, pk, data, card_form_id, data_source, voValues);
                }
                props.BillHeadInfo.setBillHeadInfoVisible({
                    showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
                });
                props.setUrlParam({
                    status: PAGE_STATUS.BROWSER,
                    id: pk
                });
                //暂行方案，增加回调,方便保存提交逻辑 
                if (callback && (typeof callback == 'function')) {
                    callback(props, data);
                }
                repaintView(props);
                props.updatePage(card_form_id);//关闭开关
                toast({ color: 'success', content: getLang(props, '00007') });
            }
        }
    });
}

/**
 * 根据PK加载数据
 * @param {*} props 页面内置对象
 * @param {*} pk  主键
 */
export const qryDataByPK = function (props, pk, updateStateFunc) {
    let status = props.getUrlParam(URL_INFO.PARAM.STATUS);
    let extParam;
    if (status == PAGE_STATUS.EDIT) {
        extParam = { 'uiState': PAGE_STATUS.EDIT };
    }
    let data = { pk: pk, pageCode: card_page_id, extParam };
    ajax({
        url: URL_INFO.CARD.QUERY,
        data,
        success: (res) => {
            let { data } = res;
            //加载到卡片
            loadData2Card(props, data, () => {
                if (data) {
                    let voValues = data[card_form_id].rows[0].values;
                    let pk = voValues.pk_cashaccrule.value;
                    //添加缓存
                    cardCache.updateCache(FIELD.PKCASHACCRULE, pk, data, card_form_id, data_source, voValues);
                }
            })
        }
    });
}

/**
 * 加载数据到卡片
 * @param {*} props 
 * @param {*} data 
 */
export const loadData2Card = function (props, data, callback) {
    //数据存在则更新卡片界面
    props.beforeUpdatePage();//打开开关
    if (data) {
        props.form.setAllFormValue({ [card_form_id]: data[card_form_id] });
    }
    //数据不存在，则置空卡片
    else {
        props.form.EmptyAllFormValue(card_form_id);
    }
    repaintView(props);
    props.updatePage(card_form_id);//关闭开关
    if (callback && (typeof callback == 'function')) {
        callback.call(this, data);
    }
}

/**
 * 清空界面
 * @param {*} props 
 * @param {*} pk 
 */
export const emptyView = function (props, pk) {
    //删除缓存
    cardCache.deleteCacheById(FIELD.PKCASHACCRULE, pk, data_source);
    let currID = { id: props.getUrlParam(URL_INFO.PARAM.ID), status: 3 };
    let nextID = props.cardPagination.getNextCardPaginationId(currID);
    //如果有下一条数据则加载下一条数据，否则返回列表界面
    if (nextID) {
        props.cardPagination.setCardPaginationId(currID);
        //触发上下页切换
        pageInfoClick.call(this, props, nextID);
    } else {
        //加载空数据到界面
        loadData2Card(props, null);
    }
    repaintView.call(this, props);
}

/**
 * 界面重绘
 * @param {*} props 
 */
export const repaintView = function (props) {
    //从地址栏获取状态
    let status = props.getUrlParam(URL_INFO.PARAM.STATUS);
    //设置页面组件的显示状态
    props.form.setFormStatus(card_form_id, status);
    //新增时组织可修改
    let orgedit = (status == PAGE_STATUS.ADD);
    props.form.setFormItemsDisabled(card_form_id, { 'pk_org': !orgedit });
    //根据最高/最低余额控制设置编辑性
    let islowmnycontrol = props.form.getFormItemsValue(card_form_id, FIELD.ISLOWMNYCONTROL).value;
    props.form.setFormItemsDisabled(card_form_id, {
        [FIELD.LOWMONEY]: !islowmnycontrol,
        [FIELD.LOWMNYCONTROLSCHE]: !islowmnycontrol
    });
    let ishighmnycontrol = props.form.getFormItemsValue(card_form_id, FIELD.ISHIGHMNYCONTROL).value;
    props.form.setFormItemsDisabled(card_form_id, {
        [FIELD.HIGHMONEY]: !ishighmnycontrol,
        [FIELD.HIGHMNYCONTROLSCHE]: !ishighmnycontrol
    });
    //版本控制
    versionControl(props);
    //处理按钮
    buttonVisible(props);
}

/**
 * 余额、控制方式校验
 * @param {*} props 
 */
const validateField = function (props) {
    let validation = true;
    if (!props.form.isCheckNow(card_form_id)) {
        validation = false;
    }
    // 余额和控制方案必输项校验
    let islowmnycontrol = props.form.getFormItemsValue(card_form_id, FIELD.ISLOWMNYCONTROL).value;
    let ishighmnycontrol = props.form.getFormItemsValue(card_form_id, FIELD.ISHIGHMNYCONTROL).value;
    if (islowmnycontrol) {
        let lowmoney = props.form.getFormItemsValue(card_form_id, FIELD.LOWMONEY).value;
        let lowmnycontrolsche = props.form.getFormItemsValue(card_form_id, FIELD.LOWMNYCONTROLSCHE).value;
        if (!lowmoney || lowmoney < 0) {
            toast({ color: 'warning', content: getLang(props, '000015') });/* 国际化处理： 选择最低余额控制时，最低余额不能为空或负数！*/
            validation = false;
        }
        if (!lowmnycontrolsche) {
            toast({ color: 'warning', content: getLang(props, '000016') });/* 国际化处理： 选择最低余额控制时，最低余额不能为空或负数！*/
            validation = false;
        }
    }
    if (ishighmnycontrol) {
        let highmoney = props.form.getFormItemsValue(card_form_id, FIELD.HIGHMONEY).value;
        let highmnycontrolsche = props.form.getFormItemsValue(card_form_id, FIELD.HIGHMNYCONTROLSCHE).value;
        if (!highmoney || highmoney < 0) {
            toast({ color: 'warning', content: getLang(props, '000017') });/* 国际化处理： 选择最低余额控制时，最低余额不能为空或负数！*/
            validation = false;
        }
        if (!highmnycontrolsche) {
            toast({ color: 'warning', content: getLang(props, '000018') });/* 国际化处理： 选择最低余额控制时，最低余额不能为空或负数！*/
            validation = false;
        }
    }
    return validation;
}
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/