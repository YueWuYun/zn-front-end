/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//引入轻量化api  
import { ajax, cardCache ,toast,viewModel} from 'nc-lightapp-front'; 
import moment from "moment";
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
import { setHeadItemProp ,setBodyItemProp} from "../../../pub/utils/CMPAfterEditUtil";
//引入卡片事件
import { buttonVisible, afterEvent } from "../card/events/index";
import { buildQryData, updateListView } from "../list/events/searchBtnClick";
//引入常量定义
import { APP_INFO, LIST_PAGE_INFO, CARD_PAGE_INFO, ITEM_INFO, URL_INFO, CACHE_KEY, SHOW_MODE ,TRAN_CARD_PAGE_INFO } from "../cons/constant";
import { showTBBMsg ,AddLine,getPKMapBodyPKMapRowID} from "../../../pub/utils/CMPButtonUtil";
// ca
import Sign from '../../../../tmpub/pub/util/ca'; 
import { loadMultiLang,setRate2NewRow } from "../../../../tmpub/pub/util/index";
import { fail } from 'assert';
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
//加载小应用基础部件
import appBase from "../base/index";
import { pageInfoClick } from "../card/events/index";
const { comp, api, cons } = appBase;

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
            billCode: props.form.getFormItemsValue(cons.card.headCode, cons.field.vbillno).value
        });
    }
    else if(viewmode =='edit'){
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
            billCode: props.form.getFormItemsValue(cons.card.headCode, cons.field.vbillno).value
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
            billCode: props.form.getFormItemsValue(cons.card.headCode, cons.field.vbillno).value
        });
    }
    else if(viewmode =='edit'){
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
            billCode: props.form.getFormItemsValue(cons.card.headCode, cons.field.vbillno).value
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
        repaintView(props);
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
export const qryDataByPK = function (props, pk, updateStateFunc,src,isrefresh) {
    let status = props.getUrlParam('status');
    let extParam;
    if(status == SHOW_MODE.EDIT){
        extParam = { 'uiState': 'edit' ,'src':src};
    }else{
        extParam = {  'src':src};
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
            if(res.data && res.data.head){
                //加载到卡片
                loadData2Card(props, res.data, () => {
                    let billID = res.data.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_apply.value;
                    let billNO = res.data.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.vbillno.value;
                    if (updateStateFunc && (typeof updateStateFunc == 'function')) {
                        updateStateFunc({
                            billID, billNO
                        })
                    }
                    if(billID){
                        if(isrefresh){
                            //添加缓存
                            cardCache.updateCache(ITEM_INFO.PK, billID, res.data, CARD_PAGE_INFO.HEAD_CODE, APP_INFO.DATA_SOURCE_TRANS);
                        }else{
                            //添加缓存
                            cardCache.updateCache(ITEM_INFO.PK, billID, res.data, CARD_PAGE_INFO.HEAD_CODE, APP_INFO.DATA_SOURCE);
                        }
                    }
                    if(isrefresh){
                        props.transferTable.setTransformFormStatus(TRAN_CARD_PAGE_INFO.HEAD_CODE, {
                            status: true,
                            onChange: (current, next, currentIndex) => {                                                  
                                props.transferTable.setTransferListValueByIndex(TRAN_CARD_PAGE_INFO.HEAD_CODE,res.data,currentIndex);						                        
                            }
                        });  
                    }else{
                        //界面重绘
                        repaintView(props);                 
                    }
                })
            }else{
                emptyView.call(this, props, pk);
            }
        }
        
    });
}


/**
 * 清空界面
 * @param {*} props 
 * @param {*} pk 
 */
export const emptyView = function (props, pk) {
    //删除缓存
    cardCache.deleteCacheById(ITEM_INFO.PK, pk, APP_INFO.DATA_SOURCE);
    let currID = { id: props.getUrlParam('id'), status: 3 };
    let nextID = props.cardPagination.getNextCardPaginationId(currID);
    //如果有下一条数据则加载下一条数据，否则返回列表界面
    if (nextID) {
      props.cardPagination.setCardPaginationId(currID);
      //触发上下页切换
      pageInfoClick.call(this, props, nextID);
    } else {
      //加载空数据到界面
      loadData2Card(props, null, () => {
        props.BillHeadInfo.setBillHeadInfoVisible({       
          billCode: null  //修改单据号---非必传
        });
      });
    }
    repaintView.call(this, props);
  }


/**
 * 根据PK加载数据
 * @param {*} props 页面内置对象
 * @param {*} pk  主键
 */
export const qryDataByPKApprove = function (props, pk, updateStateFunc) {

    //弹异常提示
    cardCache.setDefData(cons.comm.iserrtoast, cons.comm.dataSource, true);

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
            debugger;
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
 * 拉单项目的单独设置编辑性
 * @param {*} props 
 */
export const setEditFor4D = function (props){
    //false可以编辑 true不可以编辑
    props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 
        'pk_org': true ,
        'pk_acceptorg':true ,
        'applydate':false,
        'pk_supplier':true,
        'pk_currtype':true
    });
    props.cardTable.setColEditableByKey(CARD_PAGE_INFO.BODY_CODE, 
        ['summary','applymny'],
        false
    );
    props.cardTable.setColEditableByKey(CARD_PAGE_INFO.BODY_CODE,
        ['contractno','isprepay','isqualitymy','pk_project','pk_decidedept','pk_srcbilltypeid','sourcesystypecode','srcbillno'],
        true
    );
}

/**
 * 供应链推单的单独设置编辑性
 * @param {*} props 
 */
export const setEditForSCM = function (props){
    //false可以编辑 true不可以编辑
    props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 
        'pk_org': true ,
        'pk_acceptorg':true ,
        'applydate':false,
        'pk_supplier':true,
        'pk_currtype':true
    });
    //false可以编辑 true不可以编辑   
    props.cardTable.setColEditableByKey(CARD_PAGE_INFO.BODY_CODE,
        ['contractno','orderno','pk_srcbilltypeid','sourcesystypecode','srcbillno'],
        true
    );
}

/**
 * 拉单应付的单独设置编辑性
 * @param {*} props 
 */
export const setEditForAP = function (props){
    //false可以编辑 true不可以编辑
    // props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 
    //     'pk_org': true ,
    //     'pk_acceptorg':true ,
    //     'applydate':false,
    //     'pk_supplier':false,
    //     'pk_currtype':true
    // });
    //false可以编辑 true不可以编辑   
    props.cardTable.setColEditableByKey(CARD_PAGE_INFO.BODY_CODE,
        ['pk_srcbilltypeid','sourcesystypecode','srcbillno'],
        true
    );
}
/**
 * 界面重绘
 * @param {*} props 
 */
export const repaintView = function (props) {                
    //从地址栏获取状态
    status = props.getUrlParam("status");
    //判断是否是浏览态
    let viewmode = (status == SHOW_MODE.COPY ? SHOW_MODE.ADD : status);
    //处理单据号
    dealBillNO(props,viewmode);
    //设置页面组件的显示状态
    props.form.setFormStatus(CARD_PAGE_INFO.HEAD_CODE, viewmode);
    //表体只有编辑和浏览两种状态
    props.cardTable.setStatus(CARD_PAGE_INFO.BODY_CODE, (viewmode == SHOW_MODE.ADD || viewmode == SHOW_MODE.EDIT) ? SHOW_MODE.EDIT : SHOW_MODE.BROWSER);
    //新增组织可修改
    let orgedit = status == SHOW_MODE.ADD;
    props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 'pk_org': !orgedit });
    //来源项目管理的单独设置编辑性
    let sourcesystypecode = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE,'sourcesystypecode');						
    if(sourcesystypecode && sourcesystypecode.value==5){
        setEditFor4D(props);
    }   
    //来源供应链的单独设置编辑性
    if(sourcesystypecode && sourcesystypecode.value==4){
        setEditForSCM(props);
    }  
    //来源供应链的单独设置编辑性
    if(sourcesystypecode && sourcesystypecode.value==1){
        setEditForAP(props);
    }  
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
    if (getStateFunc && (typeof getStateFunc == 'function')) {
        //获取分组合计数据
        let groupCount = getStateFunc('groupCount');
        //缓存分组合计数据
        cardCache.setDefData(CACHE_KEY.GROUP_COUNT, APP_INFO.DATA_SOURCE, groupCount);
        //获取选中的分组页签
        let selectedGroup = getStateFunc('selectedGroup');
        //缓存选中的分组页签
        cardCache.setDefData(CACHE_KEY.SELECT_GROUP, APP_INFO.DATA_SOURCE, selectedGroup);
    }
    //弹异常提示
    cardCache.setDefData(cons.comm.iserrtoast, cons.comm.dataSource, true);
    //获取查询区域条件(不校验必输项)
    // let searchData = props.search.getQueryInfo(LIST_PAGE_INFO.SEARCH_CODE, false);
    //缓存查询区域条件
    // cardCache.setDefData(CACHE_KEY.SEARCH_DATA, APP_INFO.DATA_SOURCE, (searchData && searchData.querycondition && searchData.querycondition.conditions) || null);
    if (!urlParam) {
        urlParam = {};
        urlParam['status'] = 'browse';
    }
    urlParam['pagecode'] = CARD_PAGE_INFO.PAGE_CODE;    
    let tradeType = JSON.parse(getGlobalStorage('sessionStorage', 'sessionTP'));
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
                    props.setUrlParam({
                        status: 'edit',
                        from: 'card',
                        id: props.getUrlParam('id')
                    });
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
                        setBodyItemProp(props, bodyItemProps);      
                    }
                }
                //组织选中值则恢复其余字段的编辑性
                props.resMetaAfterPkorgEdit();
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
 * 清空界面数据
 * @param {*} props 
 * @param {*} otherItemEdit 其余字段是否可编辑
 */
export const clearAllData = function (props, otherItemEdit = true) {
    let refpk = props.getUrlParam('refpk');
	let refname = props.getUrlParam('refname');
    let refcode = props.getUrlParam('refcode');
    
    props.form.EmptyAllFormValue(CARD_PAGE_INFO.HEAD_CODE);
    props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, { rows: [] });
    if (!otherItemEdit) {
        //其余字段不可编辑
        props.initMetaByPkorg();
    }
    //设置默认交易类型
    if(refpk||refname){
        props.form.setFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, { pk_trantypeid: {value:refpk,display:refname} });
        props.form.setFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, { pk_trantypecode: {value:refcode,display:refcode} });       
    }	
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
    let maxrow = getMaxRowIndex(props);
    let offset = rowIndex-1;
    for (let selectData of selectDatas) {
        maxrow++;
      recored = JSON.parse(JSON.stringify(selectData));
      //处理行号
      recored.data.values['rowno'] ={
        value: maxrow,
        display: null,
        scale: -1
      };
      processNewRecord(recored.data);
      recordArr.push(recored.data);
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
 * 行号处理 或取单据表体最大行号
 * @param {*} props 
 */
export const getMaxRowIndex = function (props){
    let maxrow = 0 ;
    let rows = props.cardTable.getAllRows(CARD_PAGE_INFO.BODY_CODE);
    rows.forEach((row) => {
        let rowno = row.values.rowno.value;
        if(rowno && rowno > maxrow){
            maxrow = rowno;
        }
    });
    return maxrow;
}


/**
 * 保存
 * @param {*} props  页面内置对象
 */
export const save = async function (props, callback) { 
    let status = props.getUrlParam('status');
    if (status != SHOW_MODE.ADD && status != SHOW_MODE.EDIT && status != SHOW_MODE.COPY) {
        return;
    }
    //开启必输项校验    
    if(!props.form.isCheckNow(CARD_PAGE_INFO.HEAD_CODE) || !props.cardTable.checkTableRequired(CARD_PAGE_INFO.BODY_CODE)){
        return;
    }
  
    let url = null;
    //新增时保存
    if (status == SHOW_MODE.ADD || status == SHOW_MODE.COPY) {
        url = URL_INFO.CARD.SAVENEW;
    }
    //修改时保存
    else if (status == SHOW_MODE.EDIT) {
        url = URL_INFO.CARD.SAVEUPDATE;
    }
    let billdata = props.createMasterChildData(CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, CARD_PAGE_INFO.BODY_CODE);
    //console.log(billdata, 'sign before billdata'); 
    let result = await Sign({isSign: true, isKey: false, data: billdata, 
        encryptVOClassName: 'nccloud.dto.cmp.vo.ApplyEncryptVO4NCC'});
    if (result.isStop) {
        return;
    }
    billdata = result.data;
    //console.log(billdata, 'sign after billdata');
    let pageCode = CARD_PAGE_INFO.PAGE_CODE;
    let data = { data: JSON.stringify(billdata), pageCode };
    const that = this;
    ajax({
        url: url,
        data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                let { head, body } = data;
                props.beforeUpdatePage();//打开开关
                //预算提示
                let hasTbbMsg = showTBBMsg(head, CARD_PAGE_INFO.HEAD_CODE);
                if (head) {
                    props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] });
                }
                if (body) {
                    //更新表体
                    body = updateBody(props, body); 
                    if (body) {
                        data.body = body;
                    }
                }          
                let pk = head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_apply.value;
                let vbillno = head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.vbillno.value;
                //处理缓存
                if (status == SHOW_MODE.ADD || status == SHOW_MODE.COPY) {
                    cardCache.addCache(pk, data, CARD_PAGE_INFO.HEAD_CODE, APP_INFO.DATA_SOURCE);
                } else {
                    cardCache.updateCache(ITEM_INFO.PK, pk, data, CARD_PAGE_INFO.HEAD_CODE, APP_INFO.DATA_SOURCE);
                }            
                props.BillHeadInfo.setBillHeadInfoVisible({
                    showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
                    showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
                    billCode: vbillno
                });
                props.setUrlParam({
                    status: 'browse',
                    id: pk
                });      
                //暂行方案，增加回调,方便保存提交逻辑 
                if (callback && (typeof callback == 'function')) {
                    callback(props, data);
                }           
                repaintView(props);
                props.updatePage(CARD_PAGE_INFO.HEAD_CODE, CARD_PAGE_INFO.BODY_CODE);//关闭开关
                toast({ color: 'success', content: '保存成功' });
            }
        }
    });
}


/**
 * 承付是否可以逆向操作
 * @param {*} billstatus 单据状态
 * @param {*} decidewfstatus 经办工作流状态（判断是手工经办还是自动经办）
 */
export const reverseAcceptEnable = function (billstatus, decidewfstatus) {
    // 如果单据类型不为待经办或承付中或待审批，则表示已经有后续操作
    if (BILLSTATE.WAITDECIDE != billstatus && BILLSTATE.ACCEPTTING != billstatus && BILLSTATE.WAITAPPROVE != billstatus) {
        return false;
    }
    //如果是待经办，一定可以反向
    if (BILLSTATE.WAITDECIDE == billstatus) {
        return true;
    }
    if (BILLSTATE.WAITAPPROVE == billstatus) {
        //自动经办可以反向，手动不可以
        if (WORK_FLOW_STATE.WFStatus_PersonRun == decidewfstatus) {
            return false;
        }
    }
    return true;
}


/**
 * 承付是否在经办之前
 * @param {*} props 
 */
const isAcceptBeforeDecide = function (props) {
    //经办时间
    let decidetime = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'decidetime').value;
    let bodyData = props.cardTable.getAllData(CARD_PAGE_INFO.BODY_CODE);
    //经办时间为空或者表体为空，则为未经办
    if (!decidetime || !bodyData || !bodyData.rows || bodyData.rows.length == 0) {
        return false;
    }
    let accepttime;
    for (let rowData of bodyData.rows) {
        accepttime = rowData.values['accepttime'].value;
        if (!accepttime) {
            accepttime = rowData.values['forceaccepttime'].value;
        }
        if (accepttime) {
            break;
        }
    }
    if (accepttime) {
        let decideTime = moment(decidetime).format('yyyy-MM-dd HH:mm:ss');
        let acceptTime = moment(accepttime).format('yyyy-MM-dd HH:mm:ss');
        return moment(acceptTime).isBefore(decideTime);
    } else {
        return false;
    }
}


/**
 * 自动加载数据
 * @param {*} props 
 */
export const autoLoadData = function (props, groupKey) {
    let searchData = props.search.getQueryInfo(LIST_PAGE_INFO.SEARCH_CODE, false);
    let extParam = {
        appCode: APP_INFO.FUNCODE
    }
    if (!groupKey) {
        groupKey = LIST_PAGE_INFO.GROUP.NEEDDEAL;
    }
    let data = buildQryData(props, searchData.querycondition, groupKey);
    data['extParam'] = extParam;
    ajax({
        url: URL_INFO.LIST.AUTO_QRY,
        data,
        success: (res) => {
            updateListView.call(this, props, res, groupKey);
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
    if (extParam.hasOwnProperty('bodyGlcRateEditable')) {
        //设置列得编辑性，flag=true是不可编辑，false是可编辑
        let flag = extParam['bodyGlcRateEditable'] == 'Y' ? false : true;
        props.cardTable.setColEditableByKey(CARD_PAGE_INFO.BODY_CODE, ['glcrate'], flag);
    }
    if (extParam.hasOwnProperty('bodyGllcRateEditable')) {
        //设置列得编辑性，flag=true是不可编辑，false是可编辑
        let flag = extParam['bodyGllcRateEditable'] == 'Y' ? false : true;
        props.cardTable.setColEditableByKey(CARD_PAGE_INFO.BODY_CODE, ['gllcrate'], flag);
    }
}

/**
 * 获取新行
 * @param {*} props 
 */
export const getNewRow = function (props) {
    let values = {};
    values[ITEM_INFO.PK] = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, ITEM_INFO.PK);
    values['pk_org'] = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_org');
    values['pk_group'] = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_group');
   
    values['pk_currtype'] = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_currtype');
    values['pk_supplier'] = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_supplier');
    values['customer'] = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'customer');
    values['pk_acceptorg'] = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg');
    //增加行号处理
    let maxrow = getMaxRowIndex(props);
    values['rowno'] = {
        value: maxrow+1,
        display: null,
        scale: -1
    }
    setRate2NewRow({
        olcRates: 'olcrate',
        glcRates: 'glcrate',
        gllcRates: 'gllcrate',
        datasource: APP_INFO.DATA_SOURCE,
        row: values
    })
    return values;
}

/**
 * 新增行（带默认值）
 * @param {*} props 
 */
export const addNewRow = function (props) {
    let values = getNewRow(props);
    let rowSize = props.cardTable.getNumberOfRows(CARD_PAGE_INFO.BODY_CODE);
    props.cardTable.addRow(CARD_PAGE_INFO.BODY_CODE, rowSize, values);
}
/**
 * 插入行
 * @param {*} props 
 * @param {*} index 
 */
export const InsertLine = function (props,index) {
    let values = getNewRow(props);
    props.cardTable.addRow(CARD_PAGE_INFO.BODY_CODE, index+1, values);
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

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/