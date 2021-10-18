/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
//引入轻量化api  
import { ajax, cardCache, toast } from 'nc-lightapp-front';
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
import { setHeadItemProp } from '../../../pub/utils/FBMAfterEditUtil.js';
// import { AddLine, showTBBMsg } from "../../../pub/utils/CMPButtonUtil";
//引入卡片事件
import { buttonVisible } from "../card/events/index";
//引入常量定义
import { APP_INFO, CACHE_KEY, CARD_PAGE_INFO, ITEM_INFO, LIST_PAGE_INFO, SHOW_MODE, URL_INFO } from "../cons/constant";
// import { buildQryData, updateListView } from "../list/events/searchBtnClick";

/**
 * 组织多版本控制
 * @param {*} props 
 */
export const versionControl = function (props) {
    //组织版本试图
    orgVersionView(props, CARD_PAGE_INFO.HEAD_CODE);
}
/**
 * 处理单据号
 */
export const dealBillNO = function (props,viewmode) {
    if(viewmode =='browse'){
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
        });
    }
    else if(viewmode =='edit'){
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true //控制显示单据号：true为显示,false为隐藏 ---非必传
        });
    }else{
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
        });
    }
}


/**
 * 处理单据号
 */
export const dealBillNOApprove = function (props,viewmode) {
    if(viewmode =='browse'){
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
        });
    }
    else if(viewmode =='edit'){
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true //控制显示单据号：true为显示,false为隐藏 ---非必传
        });
    }else{
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
        });
    }
}

/**
 * 加载数据到卡片
 * @param {*} props 
 * @param {*} data 
 */
export const loadData2Card = function (props, data, callback) {
    //数据存在则更新卡片界面
    if (data) {
        let { head, body } = data;
        if (head) {
            // if (callback && (typeof callback == 'function')) {
            //     props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] }, true, false, null, callback.bind(this, data));
            // } else {
            props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] });
            // }
        }
        if (body) {
            props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, body[CARD_PAGE_INFO.BODY_CODE]);
        }
    }
    //数据不存在，则置空卡片
    else {
        props.form.EmptyAllFormValue(CARD_PAGE_INFO.HEAD_CODE);
        props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, { rows: [] });
    }
    if (callback && (typeof callback == 'function')) {
        callback.call(this, data);
    }
}

/**
 * 根据PK加载数据
 * @param {*} props 页面内置对象
 * @param {*} pk  主键
 */
export const qryDataByPK = function (props, pk, updateStateFunc) {
    let status = props.getUrlParam('status');
    let extParam;
    if(status == SHOW_MODE.EDIT){
        extParam = { 'uiState': 'edit' };
    }
    let pks = [];
    if(pk instanceof Array){
        pks = pk
    }
    let data = { pk: props.getUrlParam('id'), pageCode: CARD_PAGE_INFO.PAGE_CODE, pks,extParam};
    ajax({
        url: URL_INFO.CARD.QRY,
        data,
        success: (res) => {
            let { data } = res;
            
            //加载到卡片
            loadData2Card(props, res.data, () => {
                let billID = res.data.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_apply.value;
                let billNO = res.data.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.vbillno.value;
                if (updateStateFunc && (typeof updateStateFunc == 'function')) {
                    updateStateFunc({
                        billID, billNO
                    })
                }
                //添加缓存
                cardCache.updateCache(ITEM_INFO.PK, billID, res.data, CARD_PAGE_INFO.HEAD_CODE, APP_INFO.DATA_SOURCE);
                //界面重绘
                repaintView(props);
            })
        }
        
    });
}


/**
 * 根据PK加载数据
 * @param {*} props 页面内置对象
 * @param {*} pk  主键
 */
export const qryDataByPKApprove = function (props, pk, updateStateFunc) {
    let status = props.getUrlParam('status');
    let extParam;
    if(status == SHOW_MODE.EDIT){
        extParam = { 'uiState': 'edit' };
    }
    let pks = [];
    if(pk instanceof Array){
        pks = pk
    }
    let data = { pk: props.getUrlParam('id'), pageCode: CARD_PAGE_INFO.PAGE_CODE, pks,extParam};
    ajax({
        url: URL_INFO.CARD.QRY,
        data,
        success: (res) => {
            let { data } = res;
            //加载到卡片
            loadData2Card(props, res.data, () => {
                let billID = res.data.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_apply.value;
                let billNO = res.data.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.vbillno.value;
                if (updateStateFunc && (typeof updateStateFunc == 'function')) {
                    updateStateFunc({
                        billID, billNO
                    })
                }
                //添加缓存
                cardCache.updateCache(ITEM_INFO.PK, billID, res.data, CARD_PAGE_INFO.HEAD_CODE, APP_INFO.DATA_SOURCE);
                //界面重绘
                repaintViewApprove(props);
            })
        }
        
    });
}
/**
 * 加载经办数据
 * @param {*} props 页面内置对象
 * @param {*} pk  主键
 * @param {*} ts 时间戳
 */
export const loadNeedDealDataByPK = function (props, pk, ts) {
    //获取时间戳
    let pkMapTs = {};
    pkMapTs[pk] = ts || null;
    //请求数据
    let data = { pkMapTs, pageCode: CARD_PAGE_INFO.PAGE_CODE };
    ajax({
        url: URL_INFO.CARD.QRYDEALINFO,
        data,
        success: (res) => {
            let { data } = res;
            //加载到卡片
            loadData2Card(props, res.data, () => {
                let billID = res.data.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_innertransfer_h.value;
                let billNO = res.data.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.vbillno.value;
                //更新缓存
                cardCache.updateCache(ITEM_INFO.PK, billID, data, CARD_PAGE_INFO.HEAD_CODE, APP_INFO.DATA_SOURCE);
                //版本控制
                versionControl(props);
                //界面重绘
                repaintView(props);
                let editItemArr = {
                    'pk_currency': true,
                    'isreversebustype': true,
                    'transfertype': true,
                    'pk_fundorg_p': true,
                    'pk_fundorg_r': true,
                    'pk_transactorg': true,
                    'olcrate': true,
                    'pk_clearaccount_out': true,
                    'pk_org': true
                };
                //设置表头字段编辑性
                props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, editItemArr);
                //设置表体字段编辑性
                props.cardTable.setColEditableByKey(CARD_PAGE_INFO.BODY_CODE, ['pk_financeorg_p', 'pk_inneraccount_p', 'pk_financeorg_r', 'pk_inneraccount_r', 'amount'], true);
                props.cardTable.setColEditableByKey(CARD_PAGE_INFO.BODY_CODE, ['brief', 'pk_getplanitem', 'pk_payplanitem'], false);
            })
        }
    });
}

/**
 * 保存提交
 */
export const saveCommit = function () {
    let billdata = this.props.createMasterChildData(CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, CARD_PAGE_INFO.BODY_CODE);
    let pageCode = CARD_PAGE_INFO.PAGE_CODE;
    let data = { data: JSON.stringify(billdata), pageCode };
    ajax({
        url: URL_INFO.CARD.SAVECOMMIT,
        data,
        success: (res) => {
            let { data } = res;
            //加载到卡片
            loadData2Card(props, data, () => {
                let billID = data.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_apply.value;
                let billNO = data.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.vbillno.value;
                //更新卡片界面的state
                this.setState({ billID, billNO });
                //更新缓存
                cardCache.updateCache(ITEM_INFO.PK, billID, data, CARD_PAGE_INFO.HEAD_CODE, APP_INFO.DATA_SOURCE);
                //界面重绘
                repaintView(props);
            })
        }
    });
}
/**
 * 加载复制数据
 * @param {*} props 页面内置对象
 * @param {*} pk  主键
 */
export const loadCopyData = function (props, pk) { 
    let pkMapTs = {};
    let extParam = { 'uiState': 'add' };
    pkMapTs[pk] = null;
    let data = { pkMapTs, pageCode: CARD_PAGE_INFO.PAGE_CODE, extParam };
    ajax({
        url: URL_INFO.CARD.QRYCOPY,
        data,
        success: (res) => {
            let { card, extParam, headItemProps, bodyItemProps } = res.data;
            let { head, bodys } = card;
            //更新表单数据
            props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] });
            //更新表体数据
            props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, bodys[CARD_PAGE_INFO.BODY_CODE]);
            //设置表头字段属性
            setHeadItemProp(props, CARD_PAGE_INFO.HEAD_CODE, headItemProps);
            let billID = head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_apply.value;
            let billNO = head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.vbillno.value;
            //组织选中值则恢复其余字段的编辑性
            props.resMetaAfterPkorgEdit();
            props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 'pk_supplier': false });
            //版本控制
            versionControl(props);
            //界面重绘
            repaintView(props);
            //更新缓存
            cardCache.updateCache(ITEM_INFO.PK, billID, card, CARD_PAGE_INFO.HEAD_CODE, APP_INFO.DATA_SOURCE);
        }
    });
}
/**
 * 界面重绘
 * @param {*} props 
 */
export const repaintView = function (props) {
    //从地址栏获取状态
    let status = props.getUrlParam("status");
    //判断是否是浏览态
    let viewmode = (status == SHOW_MODE.COPY ? SHOW_MODE.ADD : status);
    //处理单据号
    dealBillNO(props,viewmode);
    //设置页面组件的显示状态
    props.form.setFormStatus(CARD_PAGE_INFO.HEAD_CODE, viewmode);
    //表体只有编辑和浏览两种状态
    props.cardTable.setStatus(CARD_PAGE_INFO.BODY_CODE, (viewmode == SHOW_MODE.ADD || viewmode == SHOW_MODE.EDIT) ? SHOW_MODE.EDIT : SHOW_MODE.BROWSER);
    //新增/复制时组织可修改
    let orgedit = (status == SHOW_MODE.ADD || status == SHOW_MODE.COPY || status == SHOW_MODE.EDIT);
    props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 'pk_org': !orgedit });
    //版本控制
    versionControl(props);
    //处理按钮
    buttonVisible(props);
}

/**
 * 界面重绘
 * @param {*} props 
 */
export const repaintViewApprove = function (props) {
    //从地址栏获取状态
    let status = props.getUrlParam("status");
    //判断是否是浏览态
    let viewmode = (status == SHOW_MODE.COPY ? SHOW_MODE.ADD : status);
    //处理单据号
    dealBillNOApprove(props,viewmode);
    //设置页面组件的显示状态
    props.form.setFormStatus(CARD_PAGE_INFO.HEAD_CODE, viewmode);
    //表体只有编辑和浏览两种状态
    props.cardTable.setStatus(CARD_PAGE_INFO.BODY_CODE, (viewmode == SHOW_MODE.ADD || viewmode == SHOW_MODE.EDIT) ? SHOW_MODE.EDIT : SHOW_MODE.BROWSER);
    //新增/复制时组织可修改
    let orgedit = (status == SHOW_MODE.ADD || status == SHOW_MODE.COPY || status == SHOW_MODE.EDIT);
    props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 'pk_org': !orgedit });
    //版本控制
    versionControl(props);
    //处理按钮
    buttonVisible(props);
}

/**
 * 跳转卡片
 * @param {*} props 
 * @param {*} urlParam 
 */
export const go2card = function (props, urlParam, getStateFunc, callback) { 
    //获取分组合计数据
    let groupCount = getStateFunc('groupCount');
    //缓存分组合计数据
    cardCache.setDefData(CACHE_KEY.GROUP_COUNT, APP_INFO.DATA_SOURCE, groupCount);
    //获取选中的分组页签
    let selectedGroup = getStateFunc('selectedGroup');
    //缓存选中的分组页签
    cardCache.setDefData(CACHE_KEY.SELECT_GROUP, APP_INFO.DATA_SOURCE, selectedGroup);
    //获取查询区域条件(不校验必输项)
    // let searchData = props.search.getQueryInfo(LIST_PAGE_INFO.SEARCH_CODE, false);
    //缓存查询区域条件
    // cardCache.setDefData(CACHE_KEY.SEARCH_DATA, APP_INFO.DATA_SOURCE, (searchData && searchData.querycondition && searchData.querycondition.conditions) || null);
    if (!urlParam) {
        urlParam = {};
        urlParam['status'] = 'browse';
    }
    urlParam['pagecode'] = CARD_PAGE_INFO.PAGE_CODE;
    let tradeType = JSON.parse(sessionStorage.getItem('sessionTP'));
    if (tradeType && tradeType.refcode) {
        urlParam['refpk'] = tradeType.refpk;
        urlParam['refname'] = tradeType.refname;
        urlParam['refcode'] = tradeType.refcode;
        urlParam['pagecode'] = tradeType.refcode;
    }  
    //页面跳转
    props.pushTo(URL_INFO.CARD_PAGE_URL, urlParam);
    //回调
    if (callback && (typeof callback == 'function')) {
        callback(props);
    }
}

/**
 * 获取缓存数据
 */
export const getCahceValue = function (props, updateStateFunc, callback) {
    let updateStateObj = {};
    //从缓存中获取分组合计数据
    let groupCount = cardCache.getDefData(CACHE_KEY.GROUP_COUNT, APP_INFO.DATA_SOURCE);
    if (groupCount) {
        updateStateObj['groupCount'] = groupCount;
    }
    //从缓存中获取选中的分组页签数据
    let selectedGroup = cardCache.getDefData(CACHE_KEY.SELECT_GROUP, APP_INFO.DATA_SOURCE);
    if (selectedGroup) {
        updateStateObj['selectedGroup'] = selectedGroup;
        updateStateObj['defaultSelectGrup'] = selectedGroup;
    }

    //更新列表state
    if (Object.keys(updateStateObj).length > 0) {
        updateStateFunc(updateStateObj);
    }
    //回调
    if (callback && (typeof callback == 'function')) {
        callback(props);
    }
}

/**
 * 加载查询区域缓存
 * @param {*} props 
 */
export const loadSearchCache = function (props) {
    //从缓存中获取查询区域条件
    let searchData = cardCache.getDefData(CACHE_KEY.SEARCH_DATA, APP_INFO.DATA_SOURCE);
    //更新查询区域
    if (searchData) {
        props.search.setSearchValue(LIST_PAGE_INFO.SEARCH_CODE, searchData);
    }
}
/**
 * 修改
 * @param {*} props  页面内置对象
 */
export const edit = function (props, callback) {     
    let url = URL_INFO.CARD.EDIT;  
    let pkMapTs = {};
    let pk = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, ITEM_INFO.PK).value;
    let ts = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'ts').value;
    pkMapTs[pk] = ts;

    ajax({
        url,
        data: {pkMapTs,pageCode:CARD_PAGE_INFO.PAGE_CODE,isRet: true},
        success: (res) => {
            let { data } = res;
            if (data) {
                let {headItemProps, bodyItemProps,card} = data;
                let status = props.getUrlParam('status');
                let { head, bodys } = card;
                if (head || bodys) {                    
                    //更新表头
                    if (head) {
                        props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] });
                    }
                    if (bodys) {
                        //更新表体
                        bodys = updateBody(props, bodys);
                        if (bodys) {
                            data.bodys = bodys;
                        }
                    }       
                    let busistatus = head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.busistatus.value;              
                    //待提交态不设置编辑性
                    if(headItemProps && busistatus !=1){
                        //设置表头字段属性
                        setHeadItemProp(props, CARD_PAGE_INFO.HEAD_CODE, headItemProps);         
                    }
                    if(bodyItemProps && busistatus !=1){
                        //设置表体字段属性
                        //setBodyItemProp(props, bodyItemProps);      
                    }
                }
                //组织选中值则恢复其余字段的编辑性
                props.resMetaAfterPkorgEdit();
                props.setUrlParam({
                    status: 'edit',
                    from: 'card',
                    id: props.getUrlParam('id')
                });
                repaintView(props);
            }
            //回调
            if (callback && (typeof callback == 'function')) {
                callback(props, data);
            }
        }
    });
}


/**
 * 删行
 * @param {*} props  页面内置对象
 */
export const delLineAction = function (props, key , record,index,callback) {  
    if(key && key =='DeletebodyBtn'){
        let selectDatas = props.table.getCheckedRows(CARD_PAGE_INFO.BODY_CODE);
        if (selectDatas == null || selectDatas.length == 0) {
            toast({
                'color': 'warning',
                'content': '未选中要删除的行'
            });
            return false;
        }
        let selectIndexs = [];
        for (let item of selectDatas) {
            selectIndexs.push(item.index);
        }
        props.cardTable.delRowsByIndex(CARD_PAGE_INFO.BODY_CODE, selectIndexs);
        let rowid = selectDatas[0].data.rowid;
        let changedrows=[];
        let map ={newvalue:null,oldvalue:null,rowid}
        changedrows.push(map);
        let eventData = props.createBodyAfterEventData(CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, [CARD_PAGE_INFO.BODY_CODE], CARD_PAGE_INFO.BODY_CODE, 'line', changedrows);
        let data = { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData)}
        ajax({
            url: URL_INFO.CARD.AFTEREDIT, 
            data,
            success: (res) => {
                //处理请求返回数据
                let { card, extParam, headItemProps } = res.data;
                let { head, bodys } = card;
                //更新表单数据
                props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] });
                //更新表体数据
                // props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, bodys[CARD_PAGE_INFO.BODY_CODE]);
                //回调
                if (callback && (typeof callback == 'function')) {
                    callback(props, card);
                }    
            }
        });
    }else{
        props.cardTable.delRowsByIndex(CARD_PAGE_INFO.BODY_CODE, index);
        let rowid = record.rowid;
        let changedrows=[];
        let map ={newvalue:null,oldvalue:null,rowid}
        changedrows.push(map);
        let eventData = props.createBodyAfterEventData(CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, [CARD_PAGE_INFO.BODY_CODE], CARD_PAGE_INFO.BODY_CODE, 'line', changedrows);
        let data = { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData)}
        ajax({
            url: URL_INFO.CARD.AFTEREDIT, 
            data,
            success: (res) => {
                //处理请求返回数据
                let { card, extParam, headItemProps } = res.data;
                let { head, bodys } = card;
                //更新表单数据
                props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] });
                //更新表体数据
                // props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, bodys[CARD_PAGE_INFO.BODY_CODE]);
                //回调
                    callback(props, card);
                if (callback && (typeof callback == 'function')) {
                }    
            }
        });
    }
}


/**
 * 处理新行数据
 * @param {*} recored 
 */
const processNewRecord = function (record) {
    //数据新增状态
    record.status = '2';
    //未选中
    record.selected = false;
    //去除主键
    record.values[ITEM_INFO.PK] = {
      value: null,
      display: null,
      scale: -1
    }
    //去除表体主键
    record.values[ITEM_INFO.BPK] = {
      value: null,
      display: null,
      scale: -1
    }
    //去除ts
    record.values[ITEM_INFO.TS] = {
      value: null,
      display: null,
      scale: -1
    }
    //清空伪列
    record.values[ITEM_INFO.PSEUDOCOLUMN] = {
      value: null,
      display: null,
      scale: -1
    }
  }

/**
 * 增行
 * @param {*} props  页面内置对象
 */
export const addLineAction = function (props, key , record,callback) {  
    let selectDatas = props.cardTable.getCheckedRows(CARD_PAGE_INFO.BODY_CODE);
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0) {
      toast({ color: 'warning', content: '未选中行！' });
      return;
    }    
    let recordArr = [];
    let recored = {};
    //获取行尾行号    
    let rowIndex = props.cardTable.getNumberOfRows(CARD_PAGE_INFO.BODY_CODE);
    let offset = rowIndex-1;
    for (let selectData of selectDatas) {
      recored = JSON.parse(JSON.stringify(selectData));
      processNewRecord(recored.data);
      recordArr.push(recored.data);
      rowIndex++;
    }
    props.cardTable.insertRowsAfterIndex(CARD_PAGE_INFO.BODY_CODE, recordArr, offset);

    let rowid = selectDatas[0].data.rowid;
    let changedrows=[];
    let map ={newvalue:null,oldvalue:null,rowid}
    changedrows.push(map);
    let eventData = props.createBodyAfterEventData(CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, [CARD_PAGE_INFO.BODY_CODE], CARD_PAGE_INFO.BODY_CODE, 'line', changedrows);
    let data = { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData)}
    ajax({
        url: URL_INFO.CARD.AFTEREDIT, 
        data,
        success: (res) => {
            //处理请求返回数据
            let { card } = res.data;
            let { head } = card;
            //更新表单数据
            props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] });
            //更新表体数据
            // props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, bodys[CARD_PAGE_INFO.BODY_CODE]);
            //回调
            if (callback && (typeof callback == 'function')) {
                callback(props, card);
            }    
        }
    });
}

/**
 * 处理列精度
 * @param {*} props 
 * @param {*} columnPrecisions 
 */
export const processColumnPrecision = function (props, columnPrecisions) {
    if (columnPrecisions && columnPrecisions.length > 0) {
        props.cardTable.setColScale(columnPrecisions)
    }
}

/**
 * 设置表体组织本币汇率得编辑性
 * @param {*} props 
 */
export const processBodyOlcRateEditable = function (props, extParam) {
    if (extParam.hasOwnProperty('bodyOlcRateEditable')) {
        //设置列得编辑性，flag=true是不可编辑，false是可编辑
        let flag = extParam['bodyOlcRateEditable'] == 'Y' ? false : true;
        props.cardTable.setColEditableByKey(CARD_PAGE_INFO.BODY_CODE, ['olcrate'], flag);
    }
}

/**
 * 新增行（带默认值）
 * @param {*} props 
 */
export const addNewRow = function (props) {
    //获取表头的组织，集团
    let pk_org = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_org');
    let pk_group = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_group');
    let pk_currtype = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_currtype');
    let pk_bankacc_p = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_bankacc_p');
    let pk_bankacc_pd = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_bankacc_pd');
    let pk_bankacc_r = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_bankacc_r');
    let pk_acceptorg = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg');
    let pk_billtypecode = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_billtypecode');
    let pk_billtypeid = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_billtypeid');
    const defaultRowData = {
        'pk_org': pk_org,
        'pk_group': pk_group,
        'pk_currtype':pk_currtype,
        'pk_bankacc_p':pk_bankacc_p,
        'pk_bankacc_pd':pk_bankacc_pd,
        'pk_bankacc_r':pk_bankacc_r,
        'pk_acceptorg':pk_acceptorg,
        'pk_billtypecode':pk_billtypecode,
        'pk_billtypeid': pk_billtypeid  
    }
    AddLine(props, CARD_PAGE_INFO.BODY_CODE, defaultRowData);
}

/**
 * 更新表体，兼容差异化处理 
 * @param {*} props 
 * @param {*} body 
 */
export const updateBody = function (props, body) {
    //rowid存在则按照差异化处理
    if (body[CARD_PAGE_INFO.BODY_CODE] && body[CARD_PAGE_INFO.BODY_CODE].rows && body[CARD_PAGE_INFO.BODY_CODE].rows[0] && body[CARD_PAGE_INFO.BODY_CODE].rows[0].rowid) {
        body[CARD_PAGE_INFO.BODY_CODE] = props.cardTable.updateDataByRowId(CARD_PAGE_INFO.BODY_CODE, body[CARD_PAGE_INFO.BODY_CODE]);
    }
    //否则直接更新表体
    else {
        props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, body[CARD_PAGE_INFO.BODY_CODE]);
    }
    return body;
}

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/