//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, createPageIcon, ajax, base, toast, high, print, printer, getBusinessInfo, cacheTools, promptBox } from 'nc-lightapp-front';
import Utils from '../../../public/utils';
import Enable from '../component/Enable';
import BatchAdd from '../component/BatchAdd';
import { config } from '../config/config';
import "./index.less";
import { RefFilter, AccountUtils } from '../utils/accountcommon';
const { NCAffix, NCCheckbox, NCStep, NCRadio, NCFormControl, NCBackBtn } = base;
const { PrintOutput } = high;
const NCSteps = NCStep.NCSteps;
const { NCDiv } = base;
//常量
const { gridId, searchId, pagecode, batchaddform, batchaddtable, batchAddFormPageCode, batchAddListPageCode, formId, funcode, listPrint, cardPrint, formEnable, formPeriod, ajaxurl } = config;

//自定义全局变量
let batchOrgs = [];
let pk = '';
let curindex = 0;
let businessInfo = getBusinessInfo();//用作高级查询获取当前用户信息，暂时还没有适配
let oids = [];
let that, onClickBatch;
let searchValue = { "conditions": [] };
let oid = '';

/**
 * author zhaochxs
 *
 */
class AccountingbookEditTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            checkValue: null,
            queryData: [],
            currentStep: 0,
            thirdTableData: [],
            accountOrg: [],
            curDataValues: {},
            enableopr: true,
            currelorg: {},
            cursetofbook: {},
            checkData: {},
            disableData: {},
            listShow: props.getUrlParam('pk_org')?false:true,
            isOpenTo: props.getUrlParam('pk_org')?true:false,
            formStatus: {},
            json: {},
            inlt: null
        }
        this.config = props.config;
        that = this;
        //用于组织结构图跳转
        if (props.getUrlParam('pk_org')){
            // this.setState({listShow:false});
            this.loadOpenToFormByPk(props.getUrlParam('pk_org'));
        }
    }

    componentDidMount() {

        cacheTools.set('batchAddRow', undefined);
        cacheTools.set('batchAddRows', undefined);

        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
                this.setState({ json, inlt })       // 保存json和inlt到页面state中并刷新页面
            } else {
                console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
            }

        }
        this.props.MultiInit.getMultiLang({ moduleId: '10100ACB', domainName: 'uapbd', callback });

    }

    //初始化卡片界面参照过滤 组织，账簿类型，要素表,及卡片分页信息
    initCard() {
        RefFilter.filterFinanceOrg(this.props, formId);
        RefFilter.setSetOfBookRefFilter(this.props, formId);
        RefFilter.setFactorChartOrgPaneFilter(this.props, this.state.cursetofbook, formId);
    }

    initTemplate(props) {

        props.createUIDom({
            pagecode: pagecode
        },
            (data) => {
                oid = data['template'][searchId].oid;
                console.log(data);
                let meta = data.template;
                meta = this.modifierMeta(this.props, meta);
                meta.formrelation.accountingbookbatchcard = ["accountbatch", "assetbatch", "materialbatch", "productcostbatch", "itemcostbatch"]//隐藏税务卡片批量信息, "taxbatch"
                //移除税务区域关联关系  for  产品经理确认本版本不需要此区域

                let taxindex = meta.formrelation.accountingbookcard.indexOf("tax")
                if (taxindex > -1) {
                    meta.formrelation.accountingbookcard.splice(taxindex, 1)
                }
                delete meta.tax;
                delete meta.taxbatch
                props.meta.setMeta(meta);

                data.button && props.button.setButtons(data.button);
                if (data.button) {
                    props.button.setButtons(data.button);
                    props.button.setPopContent('btnOprDel', this.state.json['10100ACB-000020']) /* 设置操作列上删除按钮的弹窗提示 */
                }
                this.loadGridData('init');
            });
    }

    //合并模板
    addTemplet = (props, resdata, pagecode) => {

        //合并relation,防止被覆盖
        if (!resdata[pagecode].formrelation) {
            resdata[pagecode].formrelation = {};
        }
        if (!resdata[pagecode].gridrelation) {
            resdata[pagecode].gridrelation = {};
        }
        Object.assign(resdata[pagecode].formrelation, props.meta.getMeta().formrelation)
        Object.assign(resdata[pagecode].gridrelation, props.meta.getMeta().gridrelation)
        props.meta.addMeta(resdata[pagecode]);

    }

    //控制本位币，会计期间方案不可编辑，根据停启用判断财务组织是否可修改
    setDisabledItem(record) {

        let orgEdit = false;
        formEnable.forEach((enableItem) => {
            if (record && record.values[enableItem].value == 2) {
                orgEdit = true;
            }
        })
        //this.props.form.setFormItemsDisabled(formId,{'paraccount':parEdit});

        this.props.form.setFormItemsDisabled(formId, { 'pk_setofbook.pk_standardcurr': true, 'pk_setofbook.pk_accperiodscheme': true, 'pk_relorg': orgEdit, 'pk_setofbook': orgEdit });
    }
    //控制平行记账是否可修改
    setparaccountenable(record, index) {
        record.key = null;
        let selectedRows = [{ values: record, index: index }];

        let editdata = {
            'pageid': pagecode,
            'gridModel': {
                'pageinfo': {},
                'areacode': gridId,
                'rows': selectedRows
            }
        };
        ajax({
            url: ajaxurl.editparaccount,
            data: editdata,
            success: (res) => {
                let { success, parEdit } = res;
                if (success) {
                    let parEdit = false;
                    if (res.data != null) {
                        parEdit = res.data;
                    }
                    this.props.form.setFormItemsDisabled(formId, { 'paraccount': parEdit });

                }
            }
        });


    }
    modifierMeta(props, meta) {
        //meta[gridId].scroll={ x: true, y: 300 };
        //添加操作列;
        console.log(meta);
        let _this = this;
        meta[gridId].items.push({
            attrcode: 'opr',
            label: this.state.json['10100ACB-000021'],/* 国际化处理： 操作*/
            itemtype: 'customer',
            width: 168,
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            render: (text, record, index, key) => {
                let buttonAry = [];
                buttonAry = ['btnOprEdit', 'btnOprDel'];
                return props.button.createOprationButton(buttonAry, {
                    area: 'opr-button',
                    buttonLimit: 2,
                    onButtonClick: this.onClickOprButton.bind(_this, record, index, text)
                });
            }
        });

        //账簿类型过滤
        let l_items = meta['accountingbook_search'].items;
        if (l_items != null && l_items.length > 0) {
            for (let i = 0; i < l_items.length; i++) {
                if (l_items[i].attrcode == 'pk_setofbook') {
                    l_items[i].queryCondition = () => {
                        return {
                            GridRefActionExt: 'nccloud.web.uapbd.ref.org.SetOfBookGridRefExt'
                        }
                    }
                    break;
                }
            }
        }
        if (meta['accountbatch']) {
            meta['accountbatch'].items.map((item) => {
                if (item.attrcode == 'pk_curraccchart') {
                    item.isShowUnit = true;
                }
            });
        }

        if (meta[batchaddtable]) {
            meta[batchaddtable].items.map((item) => {
                if (item.attrcode == 'pk_curraccchart') {
                    item.isShowUnit = true;
                }
            });
        }


        meta[gridId].items = meta[gridId].items.map((item, key) => {
            // //item.width = 150;
            if (item.attrcode == 'code') {
                item.render = (text, record, index) => {
                    return (
                        <span
                            style={{ cursor: 'pointer', color: '#007ACE' }}
                            onClick={() => {
                                this.onRowDoubleClick(record, index);
                            }}
                        >
                            {record && record['code'] && record['code'].value}
                        </span>
                    );
                };
            }
            return item;
        });

        return meta;
    }

    onClickOprButton(record, index, props, keyss, key) {
        switch (key) {
            case 'btnOprEdit':
                let l_record = Utils.clone(record);
                let ll_record = {};
                ll_record.values = l_record;
                let callBack = () => {
                    this.toFormByData(ll_record, index, 'edit');
                }
                this.setparaccountenable(record, index);
                this.editPerm([ll_record], callBack);
                break;
            case 'btnOprDel':
                record.key = null;
                let selectedRows = [{ values: record, index: index }];
                let deleteData = this.getDeleteData(selectedRows);
                this.delRows(this.props, deleteData);
                break;
        }
    }

    editPerm(selectedRows, callBack) {
        console.log(selectedRows);
        let paramData = {
            pk: selectedRows[0].values.pk_accountingbook.value,
        }
        console.log(paramData);
        ajax({
            url: ajaxurl.edit,
            data: paramData,
            success: () => {
                callBack.call(this);
            }
        })

    }

    //加载列表数据
    loadGridData(init, callback) {
        let _this = this;

        let pageInfo = { pageIndex: 0, pageSize: "10" }//this.props.table.getTablePageInfo(gridId);
        let queryInfo = {}//this.props.search.getQueryInfo(searchId);

        //要求打开节点初始化数据，执行componentDidMount时表格未初始化，会报错，
        if (init != 'init') {
            pageInfo = this.props.table.getTablePageInfo(gridId);
            //查询的时候编码置0
            pageInfo.pageIndex = 0;
        }

        let paramData = {
            pageInfo: pageInfo,
            querycondition: searchValue,
            pageCode: pagecode,
            queryAreaCode: searchId,  //查询区编码
            oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree',
            showDisable: this.state.checkValue ? '1' : '0'
        }
        ajax({
            url: ajaxurl.queryPage,
            data: paramData,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    //显示公式
                    Utils.showFormular(this.props, res, { [gridId]: 'table' });
                    if (res.data != null) {
                        _this.state.queryData = data[gridId].rows;
                        _this.props.table.setAllTableData(gridId, data[gridId]);
                        cacheTools.set('allpks', data[gridId].allpks);
                    } else {
                        let nulldata = {
                            rows: []
                        }
                        _this.props.table.setAllTableData(gridId, nulldata);
                        cacheTools.set('allpks', []);
                    }
                    if (callback) {
                        //callback(res.data);
                        callback.call(this, res.data);
                    }
                    //this.setState({listShow:true});
                    this.gridStatusChange();
                    if (this.state.listShow) {
                        this.props.button.setDisabled({ 'changeBook': true })
                    }
                }
            }
        })
    }
    afterDel(pks) {
        //删除数据后维护cardPagination中pk信息
        if (!this.state.listShow) {
            let nextPk = this.props.cardPagination.getNextCardPaginationId({ id: pks[0], status: 1 });
            this.props.cardPagination.setCardPaginationId({ id: pks[0], status: 3 });
            this.props.cardPagination.setCardPaginationId({ id: nextPk, status: 1 });
            if (nextPk) {
                this.loadFormByPk(nextPk);
            } else {
                //this.setState({listShow:true});
                this.props.form.EmptyAllFormValue(formId);
                //没值时设置按钮不可用
                this.gridStatusChange();
            }
        } else {
            pks.forEach((pk) => {
                setTimeout(() => {
                    this.props.cardPagination.setCardPaginationId({ id: pk, status: 3 });
                }, 1)
            })
        }

        //维护cacheTools中的pks
        let allpks = cacheTools.get('allpks');
        let newAllPks = allpks.filter((pk) => {
            let flag = true;
            for (let ii = 0; ii < pks.length; ii++) {
                if (pks[ii] == pk) {
                    flag = false;
                    break;
                }
            }
            return flag;
        })
        cacheTools.set('allpks', newAllPks);
        /*if(newAllPks.length <1){
            this.loadGridData();
            this.setState({'listShow':true});
        }*/
    }


    getDeleteData(selectedRows) {
        return {
            'pageid': pagecode,
            'gridModel': {
                'pageinfo': {},
                'areacode': gridId,
                'rows': selectedRows
            }
        }
    }

    delRows(props, paramData2) {
        ajax({
            url: ajaxurl.delete,
            data: paramData2,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    let indexArr = [];
                    let pks = []
                    paramData2.gridModel.rows.forEach((val) => {
                        indexArr.push(val.index);
                        pks.push(val.values.pk_accountingbook.value);
                    });
                    if (this.state.listShow) {
                        props.table.deleteTableRowsByIndex(gridId, indexArr, true);
                        this.updateButtonStatus();
                    } else {
                        //props.table.deleteTableRowsByIndex(gridId, [curindex],true);
                    }
                    this.afterDel(pks);
                    toast({ color: 'success', title: this.state.json['10100ACB-000022'] });/* 国际化处理： 删除成功！*/
                } else {
                    toast({ color: 'danger', title: this.state.json['10100ACB-000023'] });/* 国际化处理： 删除失败！*/
                }
            }
        });
    }


    //行双击
    onRowDoubleClick(record, index) {
        let record2 = {};
        record2.values = record;
        this.toFormByData(record2, index, 'browse');
    }

    //带数据跳转到卡片,只要进入卡片，就设置参照的过滤条件，为编辑做准备
    toFormByData(record, index2, status) {
        //设置卡片分页信息
        
        /*let formdata = Utils.clone(record);console.log(formdata);
        this.props.form.setAllFormValue({[formId]:{rows:[formdata]}});*/
        this.state.listShow = false;
        this.setState(this.state, () => {
            this.props.cardPagination.setCardPaginationId({ id: record.values.pk_accountingbook.value, status: 1 });
            this.loadFormByPk(record.values.pk_accountingbook.value, () => {
                if (status == 'edit') {
                    this.setFormStatus(formId, 'edit');
                    this.toEdit(record);
                    this.props.button.setButtonsVisible({
                        'btnAddAndSave': false,
                    });
                } else if (status == 'browse') {
                    this.setFormStatus(formId, 'browse');
                    this.gridStatusChange();
                    this.props.button.setButtonsVisible({ 'btnEdit': true });
                }
    
                //查询账簿类型和组织的参照信息，进行赋值及加过滤条件***
                let callBack = () => {
                    this.initCard();
                    RefFilter.pageAfterEventFilter(this.props, this.state.cursetofbook, formId);
                }
                this.setCurOrgBook(record, callBack);
            });
        });
        
    }

    toEdit(record) {
        this.initCard();
        //适配原NC的逻辑，卡片界面编辑态里只要出现一次财务组织与账簿类型同时存在的情况就为科目表添加集团过滤
        RefFilter.setCurrchartFilter(this.props, this.state.currelorg, this.state.cursetofbook);
        this.setDisabledItem(record);
    }

    setCurOrgBook(record, callBack = () => { }) {
        let pk_relorg = record.values.pk_relorg.value;
        let pk_setofbook = record.values.pk_setofbook.value;

        let reqData = [
            {
                rqUrl: '/uapbd/org/FinanceOrgAllDataTreeRef.do',
                rqJson: JSON.stringify({
                    'queryCondition': { 'pk_relorg': pk_relorg, 'TreeRefActionExt': 'nccloud.web.org.accountingbook.action.OrgExtRef' },
                    'pageInfo': { 'pageSize': 50, 'pageIndex': -1 }
                }),
                rqCode: 'pk_relorg'
            },
            {
                rqUrl: '/uapbd/ref/SetOfBookGridRef.do',
                rqJson: JSON.stringify({
                    'queryCondition': { 'pk_setofbook': pk_setofbook, 'GridRefActionExt': 'nccloud.web.org.accountingbook.action.SetofbookExtRef' },
                    'pageInfo': { 'pageSize': 50, 'pageIndex': -1 }
                }),
                rqCode: 'pk_setofbook'
            }
        ]
        ajax({
            url: ajaxurl['mergerequest'],
            data: reqData,
            success: (res) => {
                this.state.currelorg = res.data.pk_relorg.rows[0];
                this.state.cursetofbook = res.data.pk_setofbook.rows[0];
                this.setState(this.state);
                callBack.call(this);
            }
        })
    }

    //按钮点击事件
    onClickButton(props, id) {
        //获取选中行数据
        let rowsdata = {};
        let formdata = {};

        //得到选中的行或卡片态的数据  所有的处理都用此数据        格式：rows
        let selectedRows = [];
        if (this.state.listShow) {
            rowsdata = props.table.getCheckedRows(gridId);
            rowsdata.map((ele) => {
                selectedRows.push(ele.data);
                ele.data.index = ele.index;
            });
        } else {
            formdata = props.form.getAllFormValue(formId)
            selectedRows.push(formdata.rows[0])
        }
        let paramData = {
            'pageid': pagecode,
            'gridModel': {
                'pageinfo': {},
                'areacode': gridId,
                'rows': selectedRows
            }
        }
        //记录不进行改变的原始数据
        let oriData = selectedRows.length > 0 ? Utils.clone(selectedRows[0].values) : [];

        let newData = [];
        switch (id) {
            case 'add':
            case 'btnAdd':
                if (this.state.listShow) {
                    let rows = this.props.table.getPks(gridId);
                    if (rows && rows.length > 0) {
                        pk = '';
                        this.props.cardPagination.setCardPaginationId({ id: rows[0], status: 1 });
                    }
                }
                if (!this.state.listShow) {
                    pk = this.props.form.getFormItemsValue(formId, 'pk_accountingbook');
                }
                this.state.listShow = false;
                this.setState(this.state);
                this.state.currelorg = {};
                this.state.cursetofbook = {};
                this.setState(this.state, () => {
                    this.toEdit();
                    this.props.form.EmptyAllFormValue(formId);
                    this.setFormStatus(formId, 'add');
                    this.props.form.setFormItemsDisabled(formId, { 'paraccount': false });//平行记账设置可编辑
                    this.props.form.setFormItemsValue(formId, {
                        'accountenablestate': { value: '1', display: this.state.json['10100ACB-000004'] },/* 国际化处理： 未启用*/
                        'assetenablestate': { value: '1', display: this.state.json['10100ACB-000004'] },/* 国际化处理： 未启用*/
                        'materialenablestate': { value: '1', display: this.state.json['10100ACB-000004'] },/* 国际化处理： 未启用*/
                        'taxenablestate': { value: '1', display: this.state.json['10100ACB-000004'] },/* 国际化处理： 未启用*/
                        'productcostenablestate': { value: '1', display: this.state.json['10100ACB-000004'] },/* 国际化处理： 未启用*/
                        'itemcostenablestate': { value: '1', display: this.state.json['10100ACB-000004'] },/* 国际化处理： 未启用*/
                        'dataoriginflag': { value: '0', display: this.state.json['10100ACB-000005'] }
                    });/* 国际化处理： 本级产生*/
                });
                break;
            case 'btnEdit':
                let callBack = () => {
                    this.setFormStatus(formId, 'edit');
                    this.props.button.setButtonsVisible({
                        'btnAddAndSave': false,
                    });
                    this.toEdit(selectedRows[0]);
                    console.log(selectedRows[0]);
                    this.setparaccountenable(selectedRows[0].values, 0);
                    this.setState(this.state);
                }
                this.editPerm(selectedRows, callBack);
                break;
            case "btnAccountAdd":
                ajax({
                    url: ajaxurl.LoadOrgTree,
                    data: {},
                    success: (res) => {
                        let { success, data } = res;
                        batchOrgs = JSON.parse(JSON.stringify(data && data.financeOrgVOs ? data.financeOrgVOs : []));
                        this.setState({
                            currentStep: 0,
                            oprType: '1'
                        });

                        props.modal.show('stepModal', { title: this.state.json['10100ACB-000044'], })	/* 国际化处理： 批量新增财务核算账簿*/;
                        this.sss.setBatchOrgs(batchOrgs);

                    }
                });

                break;
            case 'changeBook':
                if (selectedRows.length > 1 || selectedRows.length == 0) {
                    toast({ color: 'warning', content: this.state.json['10100ACB-000024'] });/* 国际化处理： 请选择1条数据操作！*/
                    return;
                }
                if (selectedRows[0].values.accounttype.value == '1') {
                    return;
                }
                let callback = () => {
                    ajax({
                        url: ajaxurl.changeBook,
                        data: paramData,
                        success: (res) => {
                            //根据列表态或是卡片态使用不同的方法赋值
                            if (!this.state.listShow) {
                                this.props.form.setAllFormValue({ [formId]: { rows: res.data[formId].rows } });
                                this.setButtonVisible(res.data[formId].rows, 'browse')
                            } else {
                                this.loadGridData();
                            }
                            toast({ title: this.state.json['10100ACB-000025'], color: 'success' });/* 国际化处理： 切换成功！*/
                        }, error: (res) => {
                            toast({ color: 'danger', content: res.message, title: this.state.json['10100ACB-000026'] });/* 国际化处理： 出错了*/
                        }
                    });
                };
                ajax({
                    url: ajaxurl.queryChangeBook,
                    data: paramData,
                    success: (res) => {
                        if (res.data.status == '1') {
                            toast({ color: 'warning', content: res.data.msg });
                        } else if (res.data.status == '2') {
                            promptBox({
                                color: 'warning',
                                title: this.state.json['10100ACB-000027'],/* 国际化处理： 提示*/
                                content: res.data.msg,
                                beSureBtnClick: callback,
                            })
                        } else if (res.data.status == '0') {
                            callback();
                        }
                    },
                    error: (res) => {
                        toast({ color: 'danger', content: res.message, title: this.state.json['10100ACB-000026'] });/* 国际化处理： 出错了*/
                    }
                });
                break;
            case 'btnDel':
                if (selectedRows.length < 1) {
                    toast({ color: 'danger', content: this.state.json['10100ACB-000024'] });/* 国际化处理： 请选择1条数据操作！*/
                    return;
                }
                let deleteData = this.getDeleteData(selectedRows);
                this.enabledeletepre(ajaxurl.deletepre, deleteData).then(() => {
                    promptBox({
                        color: 'warning',
                        title: this.state.json['10100ACB-000046'],/* 国际化处理： 删除*/
                        content: this.state.json['10100ACB-000028'],/* 国际化处理： 确定删除所选数据？*/
                        beSureBtnClick: () => {
                            this.delRows(props, deleteData);
                        }
                    });
                })


                break;
            case 'btnSave':

                let formStatus = this.props.form.getFormStatus(formId);
                if (!this.props.form.isCheckNow(formId)) {
                    return;
                }

                let CardData = this.props.form.getAllFormValue(formId);
                CardData.areacode = formId;
                let padata = {
                    'model': CardData,
                    'pageid': pagecode,
                    'userjson': JSON.stringify({ formStatus: formStatus })
                }
                let saveFunc = () => {
                    ajax({
                        url: ajaxurl.saveAdd,
                        data: padata,
                        success: (res) => {
                            let { success, data } = res;
                            if (success) {
                                if (data.status == '0') {
                                    console.log('btnSave success');
                                    console.log(res);
                                    // setTimeout(()=>{
                                    this.setFormStatus(formId, 'browse');
                                    this.props.form.setAllFormValue({ [formId]: { rows: data.returnForm[formId].rows } });
                                    toast({ title: this.state.json['10100ACB-000029'], color: 'success' });/* 国际化处理： 保存成功！*/
                                    this.afterSave(data, formStatus);
                                    // },1);
                                    //this.props.form.setAllFormValue({[formId]:{rows:data.returnForm[formId].rows}});
                                    //this.setFormStatus(formId,'browse');
                                    //this.afterSave(data,formStatus);
                                } else if (data.status == '1') {
                                    toast({ color: 'warning', content: data.msg });
                                }
                            } else {
                                toast({ title: this.state.json['10100ACB-000030'], color: 'danger' });/* 国际化处理： 保存失败！*/
                            }
                        }
                    });
                }
                props.validateToSave(padata, saveFunc, { [formId]: 'form' }, 'form');
                break;
            case 'btnAddAndSave':
                let formStatus2 = this.props.form.getFormStatus(formId);
                if (!this.props.form.isCheckNow(formId)) {
                    return;
                }
                let CardData2 = this.props.form.getAllFormValue(formId);
                let padata2 = {
                    'model': CardData2,
                    'pageid': pagecode,
                    'userjson': JSON.stringify({ formStatus: formStatus2 })
                }
                ajax({
                    url: ajaxurl.saveAdd,
                    data: padata2,
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            toast({ title: this.state.json['10100ACB-000029'], color: 'success' });/* 国际化处理： 保存成功！*/
                            this.afterSave(data, formStatus);
                            this.onClickButton(props, 'btnAdd');
                        } else {
                            toast({ title: this.state.json['10100ACB-000030'], color: 'danger' });/* 国际化处理： 保存失败！*/
                        }
                    }
                });
                break;
            case 'btnCancel':
                promptBox({
                    color: 'warning',
                    title: this.state.json['10100ACB-000031'],/* 国际化处理： 取消*/
                    content: this.state.json['10100ACB-000032'],/* 国际化处理： 确定要取消吗？*/
                    beSureBtnClick: () => {
                        let formStatus = this.props.form.getFormStatus(formId);
                        if (formStatus == 'add') {
                            if (pk != '') {
                                this.props.form.cancel(formId);
                            } else {
                                // let rows = this.props.table.getPks(gridId);
                                // if(rows&&rows.length>0){
                                //     this.loadFormByPk(rows[0]);
                                // }else{
                                //     this.props.form.EmptyAllFormValue(formId);
                                //     //没值时设置按钮不可用
                                //     this.props.form.cancel(formId);
                                // }
                                this.props.form.EmptyAllFormValue(formId);
                                //没值时设置按钮不可用
                                this.props.form.cancel(formId);
                            }
                        } else if (formStatus == 'edit') {
                            this.props.form.cancel(formId);
                        }
                        this.setFormStatus(formId, 'browse');
                    }
                });
                break;
            case "CancelStep":
                this.closeModal('stepModal');
                break;
            case 'print1':
            case 'print':
                let data = [];
                let key = '';
                if (this.state.listShow) {
                    key = listPrint;
                    data = this.props.table.getAllTableData(gridId).rows;
                } else {
                    key = cardPrint;
                    data = props.form.getAllFormValue(formId).rows;
                }

                if (data.length > 0) {
                    oids = [];
                    (data.forEach((e) => {
                        oids.push(e.values.pk_accountingbook.value);
                    }))

                }
                console.log(oids);
                print(
                    'pdf',
                    ajaxurl.print,
                    {
                        billtype: '',
                        funcode: funcode,
                        nodekey: key,
                        oids: oids
                    }
                );
                break;
            case 'out':
                let outdata;
                if(this.state.listShow){//列表态
                    outdata = this.props.table.getAllTableData(gridId).rows;
                }else{//卡片态
                    outdata = this.props.form.getAllFormValue(formId).rows;
                }
                if (outdata.length > 0) {
                    oids = [];
                    (outdata.forEach((e) => {
                        oids.push(e.values.pk_accountingbook.value);
                    }))
                }
                this.setState({
                    pks: oids
                }, this.refs.printOutput.open());
                break;
            case 'refresh':
                if (this.state.listShow) {
                    this.loadGridData('', (data) => {
                        toast({ title: this.state.json['10100ACB-000033'], color: 'success' });/* 国际化处理： 刷新成功！*/
                    });
                } else {
                    let pk = this.props.form.getFormItemsValue(formId, 'pk_accountingbook').value;
                    this.loadFormByPk(pk);
                    toast({ title: this.state.json['10100ACB-000033'], color: 'success' });/* 国际化处理： 刷新成功！*/
                }
                break;
            case 'enable':
                this.enableFun(props, selectedRows, oriData, '0');
                break;
            case 'disable':
                this.enableFun(props, selectedRows, oriData, '1');
                break;
            case 'btnReturn':
                this.state.listShow = true;
                this.setState(this.state, () => {
                    this.loadGridData('', () => {
                        this.gridStatusChange();
                        this.updateButtonStatus();
                    });
                });
            default:
                break;
        }
    }

    openModal(modalName) {
        if ('stepModal' == modalName) {
            window.onbeforeunload = () => {
                return '';
            }
        }
        this.props.modal.show(modalName);
    }

    closeModal(modalName) {
        if ('stepModal' == modalName) {
            window.onbeforeunload = null;
        }

        this.props.modal.close(modalName);

        /*promptBox({color:'warning',
            title : '确认关闭',
            content : '是否确认要关闭',
            beSureBtnClick : ()=>{
                this.props.modal.close(modalName);
        }})*/
    }

    afterSave(data, formStatus) {
        // let l_tabledata = this.props.table.getAllTableData(gridId);
        // let rows = l_tabledata.rows;
        let newPk = data.returnForm[formId].rows[0].values.pk_accountingbook.value;
        if (formStatus == 'add') {
            this.props.cardPagination.setCardPaginationId({ id: newPk, status: 2 });
            pk = newPk;
            let cachePk = cacheTools.get('allpks');
            if (!cachePk) {
                cacheTools.set('allpks', [newPk]);
            }

            /*rows.push(data.returnForm[formId].rows[0]);
            this.props.table.setAllTableData(gridId, l_tabledata);
            curindex = rows.length-1;*/
        } else if (formStatus == 'edit') {
            /*rows[curindex] = data.returnForm[formId].rows[0];
            this.props.table.setAllTableData(gridId, l_tabledata);*/
        }
        this.setFormStatus(formId, 'browse');
    }
    //用于组织结构图跳转页面
    loadOpenToFormByPk(spk) {
        pk = spk;
        if (!spk) {
            return;
        }
        ajax({
            url: ajaxurl.queryBypk,
            data: { pk: spk },
            success: (res) => {
                //显示公式
                Utils.showFormular(this.props, res, { [formId]: 'form' })
                this.props.form.setAllFormValue({ [formId]: { rows: res.data[formId].rows } });
                this.setButtonVisible(res.data[formId].rows, 'browse');
            }
        })
    }
    loadFormByPk(spk, callback) {
        pk = spk;
        if (!spk) {
            return;
        }
        ajax({
            url: ajaxurl.queryBypk,
            data: { pk: spk },
            success: (res) => {
                //显示公式
                Utils.showFormular(this.props, res, { [formId]: 'form' })
                this.props.form.setAllFormValue({ [formId]: { rows: res.data[formId].rows } });
                this.gridStatusChange();
                this.setButtonVisible(res.data[formId].rows, 'browse');
                callback && callback();
            }
        })
    }

    enableAjax(enabledata, msg) {
        ajax({
            url: ajaxurl.enable,
            data: enabledata,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (res.data.status == '0') {
                        if (this.state.listShow) {
                            let oriRows = this.props.table.getAllTableData(gridId).rows;
                            oriRows[enabledata.model.rows[0].index] = res.data.rows[0];
                            this.props.table.setAllTableData(gridId, { rows: oriRows });
                            this.updateButtonStatus();
                        } else {
                            this.props.form.setAllFormValue({ [formId]: { rows: res.data.rows } });
                            this.setButtonVisible(res.data.rows, true);
                        }
                        this.props.modal.close('enableModal');
                        toast({ color: 'success', title: msg });
                    } else if (res.data.status == '1') {
                        toast({ color: 'warning', content: res.data.msg });
                    }
                }
            }
        });
    }

    enabledeletepre(url, enabledata) {
        var p = new Promise(function (resolve, reject) {
            ajax({
                url: url,
                data: enabledata,
                success: (res) => {
                    resolve(res);
                }
            });
        });
        return p;
    }

    enableFun(props, selectedRows, oriData, type) {

        if (selectedRows.length !== 1) {
            toast({ color: 'danger', content: this.state.json['10100ACB-000024'] });/* 国际化处理： 请选择1条数据操作！*/
            return;
        };
        this.state.disableData = Utils.clone(oriData);
        this.state.checkData = Utils.clone(oriData);
        this.state.curDataValues = selectedRows[0].values;
        this.state.enableopr = type == '0' ? true : false;
        this.setState(this.state, () => {

            let msg = type == '0' ? this.state.json['10100ACB-000034'] : this.state.json['10100ACB-000035'];/* 国际化处理： 启用成功！,停用成功！*/

            let enabledata = {
                pageid: '10100ACB_accountingbook',
                model: {
                    areacode: gridId,
                    pageinfo: {},
                    rows: []
                },
                userjson: JSON.stringify({
                    'enable': type,
                    'listShow': this.state.listShow ? "0" : "1"
                })
            };
            //添加原来修改前的数据
            enabledata.model.rows.push(selectedRows[0]);
            this.enabledeletepre(ajaxurl.enablepre, enabledata).then(() => {

                props.modal.show('enableModal', {
                    title: this.state.enableopr ? this.state.json['10100ACB-000042'] : this.state.json['10100ACB-000043'],//标题/* 国际化处理： 财务核算账簿启用,财务核算账簿停用*/
                    beSureBtnClick: () => {
                        //添加停启用面板操作后的数据
                        enabledata.model.rows.push({ values: this.state.checkData });
                        this.enableAjax(enabledata, msg);
                    },
                    cancelBtnClick: () => {
                        props.modal.close('enableModal');
                    }
                });
            })
        });
    }

    //查询区按钮点击事件
    onClickSearchBtn(props, data) {
        //校验通过后，条件查询请求
        searchValue = this.props.search.getAllSearchData(searchId);
        this.loadGridData('', this.searchShow.bind(this));
    }

    searchShow(data) {
        if (data && data[gridId] && data[gridId].allpks.length > 0) {
            toast({ content: this.state.inlt && this.state.inlt.get('10100ACB-000036', { count: data[gridId].allpks.length }), color: 'success' });/* 国际化处理： 查询成功，共,条。*/
        } else {
            toast({ content: this.state.json['10100ACB-000038'], color: 'warning' });/* 国际化处理： 未查询出符合条件的数据！*/
        }

    }

    //显示停用按钮点击事件
    onCheckShowDisable(checked) {
        this.state.checkValue = checked;
        this.setState(this.state);
        this.loadGridData('');
    }
    /**
     * 获取子组件的点击事件
     * @param {子组件传递过来的点击事件} a
     * @param {子组件的this} th
     */
    fn(a, th) {
        onClickBatch = a;       //保存为全局变量
        that = th;              //保存为全局变量
    }
    /**
     * 父组件点击事件触发
     * @param {createButtonApp传递过来的东西，props} a
     * @param {同上，id} b
     */
    fn2(a, b) {
        onClickBatch.call(that, a, b); //执行子组件的函数，顺便绑定this
    }
    getSteps() {
        return (<BatchAdd {...this.props} fn={this.fn} closeModal={this.closeModal.bind(this)} multiJson={this.state.json} inlt={this.state.inlt} ref={(item) => {
            this.sss = item;
        }}></BatchAdd>)

    }

    setFormStatus(formId, status) {

        if (status == 'edit' || status == 'add') {
            window.onbeforeunload = () => {
                return '';
            };
        } else {
            window.onbeforeunload = null;
        }

        this.props.form.setFormStatus(formId, status);
        this.state.formStatus = status;
        this.setState(this.state);
        this.gridStatusChange();

    }

    //表格状态改变监听事件,form状态改变及列表卡片切换事件
    gridStatusChange() {

        //卡片状态
        let formStatus = this.props.form.getFormStatus(formId) != 'edit' || this.props.form.getFormStatus(formId) == undefined ? true : false;
        formStatus = this.props.form.getFormStatus(formId) != 'edit' && this.props.form.getFormStatus(formId) != 'add' ? true : false;
        //是否列表态
        let listShow = this.state.listShow;
        //列表是否选中数据
        let checkedFlag = false;
        let dataFlag = false;
        if (listShow) {
            checkedFlag = this.props.table.getCheckedRows(gridId).length > 0;
            dataFlag = this.props.table.getAllTableData(gridId).rows.length > 0;
        }

        let formdataflag = this.props.form.getFormItemsValue(formId, 'pk_accountingbook') && this.props.form.getFormItemsValue(formId, 'pk_accountingbook').value;

        let formNullDataDisabled = !this.state.listShow && !formdataflag && formStatus;
        let formDataVisible = !this.state.listShow && formdataflag && formStatus || this.state.listShow;

        this.props.button.setButtonsVisible({
            'btnAdd': formStatus,
            'btnAccountAdd': formStatus,
            'btnEdit': !listShow && formDataVisible,
            'btnDel': formDataVisible,
            'refresh': formDataVisible,
            'enable': formDataVisible,
            'disable': formDataVisible,
            'changeBook': formDataVisible,
            'print': formDataVisible,
            'out': formDataVisible,
            'btnSave': !formStatus,
            'btnAddAndSave': this.props.form.getFormStatus(formId) == 'add' ? true : false,
            'btnCancel': !formStatus,
            'btnReturn': !listShow && formStatus,
        })
        this.props.button.setDisabled({
            /*'btnEdit':formNullDataDisabled,
            'refresh':formNullDataDisabled,
            'btnDel':(listShow&&!checkedFlag)||formNullDataDisabled,
            'enable':(listShow&&!checkedFlag)||formNullDataDisabled,
            'disable':(listShow&&!checkedFlag)||formNullDataDisabled,
            'changeBook':(listShow&&!checkedFlag)||formNullDataDisabled,
            'print':(listShow&&!dataFlag)||formNullDataDisabled,
            'out':(listShow&&!dataFlag)||formNullDataDisabled,
            'print1':(listShow&&!dataFlag)||formNullDataDisabled*/

            'btnDel': (listShow && !checkedFlag),
            'enable': (listShow && !checkedFlag),
            'disable': (listShow && !checkedFlag),
            'changeBook': (listShow && !checkedFlag),
            'print': (listShow && !dataFlag),
            'out': (listShow && !dataFlag),
            'print1': (listShow && !dataFlag)
        })
        //进行特殊设置
        this.setButtonVisible(this.props.form.getAllFormValue(formId).rows, formStatus);
        this.buttonDisableEvent();
        //liyfp 组织结构图 跳转时用于控制页面按钮
        if(this.state.isOpenTo){
            this.props.button.setButtonsVisible({
                'btnAdd': false,
                'btnAccountAdd': false,
                'btnEdit': false,
                'btnDel': false,
                'refresh': false,
                'enable': false,
                'disable': false,
                'changeBook': false,
                'print': false,
                'out': false,
                'btnSave': false,
                'btnAddAndSave': false,
                'btnCancel': false,
                'btnReturn': false,
            })
        }
    }

    getModal() {
        return (<div>
            <Enable
                disableData={this.state.disableData}
                checkData={this.state.checkData}
                enableopr={this.state.enableopr}
                changeCheck={this.changeCheck.bind(this)}
                multiJson={this.state.json}
                inlt={this.state.inlt}>
            </Enable>
        </div>)
    }

    changeCheck(field, val) {
        let enableopr = this.state.enableopr;
        //启用操作：勾选设置为启用，取消勾选设置为原来的未启用或是已停用
        if (enableopr) {
            this.state.checkData[field]['value'] = val ? 2 : this.state.curDataValues[field]['value'];
        } else {
            //停用操作：勾选设置为停用，取消勾选设置为原来的启用
            this.state.checkData[field]['value'] = val ? 3 : 2;
        }
        this.setState({ checkData: this.state.checkData });
    }

    afterEvent = (props, moduleId, key, value, changedrows, i, s, g) => {


        if (key === 'pk_relorg') {
            if (value.value == null) {
                props.form.setFormItemsValue([formId], {
                    'pk_curraccchart': { value: null, display: null },
                    'code': { display: null, value: null },
                    'pk_factorchart': { value: null, display: null }
                });
                this.state.currelorg = {};
                this.setState(this.state);
                return;
            }
            this.state.currelorg = i;
            this.setState(this.state);
            //this.setFactorchartData();
            //添加科目表过滤
            RefFilter.setCurrchartFilter(this.props, this.state.currelorg, this.state.cursetofbook);

            this.setCurrchartData(formId);
            this.setOther(props);

        }
        if (key === 'pk_setofbook') {
            if (value.value == null) {
                props.form.setFormItemsValue([formId], {
                    'pk_setofbook.pk_standardcurr': { value: null, display: null },
                    'pk_setofbook.pk_accperiodscheme': { value: null, display: null },
                    'code': { value: null, display: null },
                    'pk_factorchart': { value: null, display: null },
                    'pk_curraccchart': { value: null, display: null }
                });
                this.state.cursetofbook = {};
                this.setState(this.state);
                RefFilter.pageAfterEventFilter(this.props, this.state.cursetofbook, formId);
                return;
            }
            this.state.cursetofbook = i;
            this.setState(this.state);

            //为编码名称，本位币，会计期间方案赋值
            this.setOther(props);

            //添加科目表过滤
            RefFilter.setCurrchartFilter(this.props, this.state.currelorg, this.state.cursetofbook);

            //为科目表赋值
            this.setCurrchartData(formId);

            //增加参照过滤
            RefFilter.pageAfterEventFilter(this.props, this.state.cursetofbook, formId);

        }
        //财务组织或账簿类型为空时，科目表无法选择
        if (key == 'pk_curraccchart') {
            if (JSON.stringify(this.state.currelorg) == '{}' || JSON.stringify(this.state.cursetofbook) == '{}') {
                this.props.form.setFormItemsValue([formId], {
                    'pk_curraccchart': { value: '', display: '' }
                });
            }
        }

    };



    //重选账簿类型或财务组织后赋值使用科目表
    setCurrchartData(formId) {
        let cursetofbook = this.state.cursetofbook;
        let currelorg = this.state.currelorg;
        let formStatus = this.props.form.getFormStatus(formId);

        if ('edit' == formStatus) {
            this.props.form.setFormItemsValue([formId], {
                'pk_curraccchart': { value: '', display: '' }
            });
        }

        if (JSON.stringify(currelorg) != '{}' && JSON.stringify(cursetofbook) != '{}' && 'add' == formStatus) {
            let data = {
                "pk_accsystem": cursetofbook.values.pk_accsystem.value,
                "pk_relorg": currelorg.refpk
            };
            ajax({
                url: ajaxurl.queryCurraccchart,
                data: data,
                success: (res) => {
                    if (res.data) {
                        this.props.form.setFormItemsValue([formId], {
                            'pk_curraccchart': { value: res.data.pk_curraccchart, display: res.data.display }
                        });
                    }
                }
            });
        }
    }

    //为编码名称，本位币，会计期间方案赋值
    setOther(props) {
        let currelorg = this.state.currelorg;
        let cursetofbook = this.state.cursetofbook;
        if (JSON.stringify(currelorg) != '{}' && JSON.stringify(cursetofbook) != '{}') {

            let currelorg = this.state.currelorg;
            let cursetofbook = this.state.cursetofbook;
            let codeName = AccountUtils.getCodeName(currelorg, cursetofbook);
            props.form.setFormItemsValue(formId, codeName);

            let data = {
                'pk': cursetofbook.refpk
            };
            ajax({
                url: ajaxurl.queryAccperiodschemeAndCurrtype,
                data: data,
                success: (res) => {
                    if (res.data) {
                        props.form.setFormItemsValue([formId], {
                            'pk_setofbook.pk_standardcurr': { value: res.data[1].dataid, display: res.data[1].dataname },
                            'pk_setofbook.pk_accperiodscheme': {
                                value: res.data[0].dataid,
                                display: res.data[0].dataname
                            }
                        });
                    }
                }
            });
        }
    }


    updateButtonStatus() {
        let tableData = this.props.table.getCheckedRows(gridId);
        let data = [];
        tableData.forEach((e) => {
            data.push(e.data);
        })
        //是否勾选了一条数据
        let flag = (data[0] && data.length == 1) ? true : false;

        //只要6个state中有一个不为启用（不为2）时可用
        let enableStatus = formEnable.some((key) => {
            return flag && data[0].values[key] && data[0].values[key].value != 2;
        });;
        //enablestate为启用2时可以点击
        let disableStatus = //!flag||(flag&&data[0].values.enablestate.value!=2);
            flag && data[0].values.enablestate && data[0].values.enablestate.value == 2;

        this.props.button.setDisabled({
            'changeBook': !(data[0] && flag && data[0].values.accounttype.value == 2), 'enable': !enableStatus, 'disable': !disableStatus, 'btnDel': data.length == 0
        })

    }

    buttonDisableEvent() {
        if (this.state.listShow) {
            this.updateButtonStatus();
        } else {
            let data = this.props.form.getAllFormValue(formId).rows;
            this.props.button.setDisabled({
                'changeBook': !(data[0] && data[0].values.accounttype.value == 2)
            })
        }
    }

    setButtonVisible(tableData, status) {

        //只要6个state中有一个不为启用（不为2）时可用
        let enableStatus = formEnable.some((key) => {
            return status && tableData[0].values[key] && tableData[0].values[key].value != 2 && tableData[0].values[key].value != null;
        });;
        //enablestate为启用2时可以点击
        let disableStatus =
            status && tableData[0].values.enablestate && tableData[0].values.enablestate.value == 2;
        if (this.state.listShow) {

        } else {
            //this.props.button.setDisabled({'changeBook':!(status&&(tableData[0]&&tableData[0].values.accounttype.value==2)),'disable':!(status&&(tableData[0]&&tableData[0].values.enablestate&&tableData[0].values.enablestate.value==2))});
            this.props.button.setDisabled({ 'changeBook': !(status && (tableData[0] && tableData[0].values.accounttype.value == 2)), 'enable': !enableStatus, 'disable': !disableStatus });

        }
    }

    pageInfoClick = (props, config, pks) => {


        let paramData = {
            allpks: pks
        }
        ajax({
            url: ajaxurl.queryPageIndex,
            data: paramData,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    Utils.showFormular(this.props, res, { [gridId]: 'table' });
                    if (res.data != null) {
                        //表格数据启用状态 123 转化true false
                        this.state.queryData = data[gridId].rows;
                        this.props.table.setAllTableData(gridId, data[gridId]);
                    } else {

                        let nulldata = {
                            rows: []
                        }
                        this.props.table.setAllTableData(gridId, nulldata);
                    }
                }
            }
        })
    }
    cardPageInfoClick(props, pk) {
        this.loadFormByPk(pk);
    }


    render() {
        const { BillHeadInfo } = this.props;
        const { createBillHeadInfo } = BillHeadInfo;
        const { editTable, button, search, modal, form, table, cardPagination } = this.props;
        const { createCardPagination } = cardPagination;
        const { createButtonApp } = button;
        const { NCCreateSearch } = search;
        const { createModal } = modal;
        const { createEditTable } = editTable;
        let { createForm } = form;
        let { createSimpleTable } = table;
        let formStatus = this.props.form.getFormStatus(formId) != 'add' && this.props.form.getFormStatus(formId) != 'edit';
        let formdataflag = this.props.form.getFormItemsValue(formId, 'pk_accountingbook') && this.props.form.getFormItemsValue(formId, 'pk_accountingbook').value;
        // cacheTools.set('allpks',undefined);
        var renderList = () => {
            return (
                <div style={{ height: '100%' }}>
                    {/* 头部 header */}
                    <NCAffix>
                        <NCDiv areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area" >
                            <div className="header-title-search-area">
                                {createBillHeadInfo({
                                    title: this.state.json['10100ACB-000039'],
                                    backBtnClick: this.onClickButton.bind(this, this.props, 'btnReturn'),
                                    showBackBtn: !this.state.listShow && this.state.formStatus != 'add' && this.state.formStatus != 'edit',
                                    initShowBackBtn: !this.state.listShow && this.state.formStatus != 'add' && this.state.formStatus != 'edit'
                                }
                                )}
                                <div className="title-search-detail showDisableStyle">
                                    <span>
                                        <NCCheckbox checked={this.state.checkValue} onChange={this.onCheckShowDisable.bind(this)}>{this.state.json['10100ACB-000045']/* 国际化处理： 显示停用*/}</NCCheckbox>
                                    </span>
                                </div>
                            </div>
                            {/* 按钮区  btn-group */}
                            <div className="header-button-area">
                                {this.state.listShow && createButtonApp({
                                    area: 'header-button-area',
                                    buttonLimit: 6,
                                    onButtonClick: this.onClickButton.bind(this),
                                    // popContainer: document.querySelector('.header-button-area')

                                })}
                            </div>
                        </NCDiv>
                    </NCAffix>
                    {/*查询区*/}
                    <div className="nc-singleTable-search-area">
                        {NCCreateSearch(searchId, {
                            clickSearchBtn: this.onClickSearchBtn.bind(this)
                        })}
                    </div>
                    {/* 列表区 */}
                    <div className="nc-singleTable-table-area">
                        {createSimpleTable(gridId, {
                            handlePageInfoChange: this.pageInfoClick.bind(this),
                            onRowDoubleClick: this.onRowDoubleClick.bind(this),
                            selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动回调
                            onSelected: this.updateButtonStatus.bind(this),                        // 左侧选择列单个选择框回调
                            onSelectedAll: this.updateButtonStatus.bind(this),                  // 左侧选择列全选回调
                            showCheck: true,
                            showIndex: true,
                            pkname:'pk_accountingbook',
                            showPagination: true,
                            dataSource: 'uapbd.org.accountingbook.cache'
                        })}
                    </div>
                </div>
            )
        }
        var renderCard = () => {
            return (
                <div style={{ height: '100%' }}>
                    {/* 头部 header */}
                    <div className="nc-bill-top-area nc-bill-top-area-self" >
                        <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
                            {!this.state.isOpenTo ?//liyfp 组织结构图 跳转时用于控制页面按钮
                                <div className="header-title-search-area">
                                    {createBillHeadInfo({
                                        title: this.state.json['10100ACB-000039'],
                                        backBtnClick: this.onClickButton.bind(this, this.props, 'btnReturn'),
                                        showBackBtn: !this.state.listShow && this.state.formStatus != 'add' && this.state.formStatus != 'edit',
                                        initShowBackBtn: !this.state.listShow && this.state.formStatus != 'add' && this.state.formStatus != 'edit'
                                    }
                                    )}
                                </div>:
                                <div className="header-title-search-area">
                                    {createBillHeadInfo({
                                        title: this.state.json['10100ACB-000039'],
                                        showBackBtn:false,
                                        initShowBackBtn:false
                                    }
                                    )}
                                </div>
                            }
                            {/* 按钮区  btn-group */}
                            <div className="header-button-area">
                                {!this.state.listShow && createButtonApp({
                                    area: 'header-button-area',
                                    buttonLimit: 3,
                                    onButtonClick: this.onClickButton.bind(this),
                                    popContainer: document.querySelector('.header-button-area')

                                })}
                            </div>
                            <div className='header-cardPagination-area' style={{ float: 'right' }}>
                                {!this.state.isOpenTo && !this.state.listShow && this.state.formStatus != 'add' && this.state.formStatus != 'edit' && createCardPagination({
                                    handlePageInfoChange: this.cardPageInfoClick.bind(this),
                                    dataSource: 'uapbd.org.accountingbook.cache',
                                    urlPkname: 'pk_accountingbook'
                                })}
                            </div>

                        </NCDiv>
                        {/* 卡片区 */}
                        <div className="nc-bill-form-area">
                            {createForm(formId, {
                                onAfterEvent: this.afterEvent.bind(this),
                                expandArr: ['account', 'asset', 'material', 'productcost', 'itemcost'] //隐藏税务账簿区域tax 
                            })}
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className={this.state.listShow ? "nc-single-table" : "nc-bill-card nc-bill-extCard"}>
                {this.state.listShow ? renderList() : renderCard()}

                {/* 删除前确认模态框 */}
                {createModal('cancelModal', {
                    title: this.state.json['10100ACB-000040'],										//标题/* 国际化处理： 确认删除*/
                    content: this.state.json['10100ACB-000041'],							//内容/* 国际化处理： 确认删除所选数据？*/
                })}
                {createModal('enableModal', {
                    userControl: true,
                    size: '300px',
                    content: this.getModal()						//内容
                })}
                {createModal('delModal')}
                {createModal('confirmModal')}
                {/* 批量新增委托关系模块框 */}

                {createModal('stepModal', {
                    content: this.getSteps.bind(this)(),							//内容
                    noFooter: false,
                    className: 'batch-add',
                    closeModalEve: () => {
                        this.closeModal('stepModal');
                    },
                    showCustomBtns: true,
                    customBtns: <div className="steps-action"  >
                        {createButtonApp({
                            area: 'modal_area',
                            buttonLimit: 4,
                            onButtonClick: this.fn2.bind(this),
                            popContainer: document.querySelector('.steps-action')
                        })}

                    </div>
                })}

                {createModal('changebook', {
                })}
                <PrintOutput
                    ref='printOutput'
                    url={ajaxurl.print}
                    data={{
                        funcode: '10100ACB',
                        oids: this.state.pks,
                        outputType: 'output',
                        nodekey: this.state.listShow ? listPrint : cardPrint

                    }}
                >
                </PrintOutput>

            </div>
        )
    }

}

AccountingbookEditTable = createPage({
    billinfo: [
        {
            billtype: 'form',
            pagecode: pagecode,
            headcode: formId

        },
        {
            billtype: "form",
            pagecode: pagecode,
            headcode: batchaddform
        }, {
            billtype: "grid",
            pagecode: pagecode,
            bodycode: batchaddtable
        }
    ],
    /*{
        billtype: 'form',
        pagecode: pagecode,
        bodycode: formId
    },*/
    initTemplate: (props) => { }
})(AccountingbookEditTable);
export { AccountingbookEditTable }

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65