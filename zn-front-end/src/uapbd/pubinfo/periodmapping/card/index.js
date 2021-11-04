//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, cardCache, promptBox, createPageIcon, getMultiLang } from 'nc-lightapp-front';
const { NCAffix, NCPopconfirm, NCFormControl, NCBackBtn } = base;
const { PrintOutput } = high
import { print } from 'nc-lightapp-front';
const { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;

const dataSource = 'upabd.pubinfo.periodmapping.data'
const formId = 'periodmappingh';                      //表头id
const tableId = 'periodmappingb';                  //子表id
const pageId = '10140ACMAP_card';            //pagecode
const queryCardUrl = '/nccloud/uapbd/periodmapping/queryPeriodMappingCard.do';   //卡片查询url
const extraUrl = '/nccloud/uapbd/periodmapping/extraInfo.do'
const saveUrl = '/nccloud/uapbd/periodmapping/insert.do';             //新增保存
const updateUrl = '/nccloud/uapbd/periodmapping/update.do';         //修改保存
const deleteUrl = '/nccloud/uapbd/periodmapping/delete.do';         //删除
const changeEnableStatus = '/nccloud/uapbd/taxregion/changeEnableTaxregion.do';
const pk_item = 'pk_peiodmapping';               //单据主键--用于卡片查询刷新
const titleCode = 'code';            //单据编码--用于卡片表头显示
const childValues = 'periodmappingdetail'
const printUrl = '/nccloud/uapbd/taxregion/printTaxregion.do'

//全局变量，为了设置行政区划参照的范围
let gCurrCountry = null

class Card extends Component {
    constructor(props) {
        super(props);
        this.formId = formId;
        this.tableId = tableId;

        this.state = {
            pk_org: '',
            title_code: '',
            totalcount: 0,
            applycount: 0,
            backVisible: true,
            json: {}
        }

        // 记录编辑态时选择不同年度时生成的不同的子表数据
        this.yearData = {}

        // 记录一下以前设置的会计期间编码，切换目标会计年度会清空编码
        this.preCode = {
            value: '',
            display: ''
        }
    }

    initTemplate = (props, callback) => {
        props.createUIDom(
            {
                pagecode: pageId//页面id
                // appid: appId,//注册按钮的id
                // appcode: '10140ACMAP'
            },
            data => {
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        this.modifierMeta(props, meta)
                        props.meta.setMeta(meta, () => {
                            if (callback && typeof callback == 'function') {
                                callback()
                            }
                        });
                    }
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                        this.toggleShow();
                    }
                }
            }
        )
    }

    modifierMeta(props, meta) {
        let status = props.getUrlParam('status');
        meta[formId].status = status;
        meta[tableId].status = status;

        meta[formId].items.find(item => item.attrcode == 'targetperiod').queryCondition = () => {
            return {
                GridRefActionExt: "nccloud.web.uapbd.periodmapping.action.PeriodMappingFilterEmpScheEBuilder"
            }
        }

        meta[formId].items.find(item => item.attrcode == 'sourceperiod').queryCondition = () => {
            return {
                GridRefActionExt: "nccloud.web.uapbd.periodmapping.action.PeriodMappingFilterEmpScheEBuilder"
            }
        }
        meta[tableId].items.forEach((item) => {
            if (item.attrcode == 'sourcebeginperiodmth' || item.attrcode == 'sourceendperiodmth') {
                item.queryCondition = () => {
                    return {
                        pk_accperiodscheme: props.form.getFormItemsValue(this.formId, 'sourceperiod').value
                    }
                }
            }
        })
        meta['detail_b'].items.forEach((item) => {
            if (item.attrcode == 'sourcebeginperiodmth' || item.attrcode == 'sourceendperiodmth') {
                item.queryCondition = () => {
                    return {
                        pk_accperiodscheme: props.form.getFormItemsValue(this.formId, 'sourceperiod').value
                    }
                }
            }
        })
        meta['detail_e'].items.forEach((item) => {
            if (item.attrcode == 'sourcebeginperiodmth' || item.attrcode == 'sourceendperiodmth') {
                item.queryCondition = () => {
                    return {
                        pk_accperiodscheme: props.form.getFormItemsValue(this.formId, 'sourceperiod').value
                    }
                }
            }
        })
        let porCol = {
            itemtype: 'customer',
            attrcode: 'opr',
            label: this.state.json ? this.state.json['10140ACMAP-000000'] : '10140ACMAP-000000',/* 国际化处理： 操作*/
            visible: true,
            className: 'table-opr',
            width: 200,
            fixed: 'right',
            render: (text, record, index) => {

                let btnArray = []

                let status = this.props.getUrlParam('status')
                btnArray.push(status == 'add' || status == 'edit' ? 'More' : 'Expand')
                // 根据需求要求，不需要这些东西
                // if(status == 'add' || status == 'edit') {
                //     btnArray.push('RowDel', 'RowInsert')
                // }
                //浏览态不渲染操作列按钮
                //update by zhenmx
                return status == 'add' || status == 'edit' ? props.button.createOprationButton(
                    btnArray,
                    {
                        area: "row-action",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                    }
                ) : '';
                //update end
            }
        };
        meta[tableId].items.push(porCol);

        return meta;
    }

    tableButtonClick(props, id, text, record, index) {
        switch (id) {
            case "More":
                props.cardTable.openModel(tableId, 'edit', record, index);
                break;
            case "Expand":
                props.cardTable.toggleRowView(tableId, record)
                break;
            case 'RowDel':
                props.cardTable.delRowsByIndex(tableId, index);
                break
            case 'RowInsert':
                props.cardTable.addRow(tableId, index)
                break
        }
    }

    componentDidMount() {
        let callback = (json) => {
            this.setState({ json }, () => {
                this.initTemplate(this.props, () => {
                    this.toggleShow();
                    this.updateCardTableBtnStatus()

                    let status = this.props.getUrlParam('status');
                    if (status != "add") {
                        //this.props.cardPagination.setCardPaginationId({id: this.props.getUrlParam('id'),status: 0})
                        let pk = this.props.getUrlParam('id');
                        if (pk && pk != 'undefined') {
                            this.getdata(pk);
                        }
                    }
                    else {
                        this.processBillCode(true)
                        //this.props.form.setFormItemsDisabled(this.formId, {'sourceperiod': true, 'targetyear': true})
                        this.setDefaultValue();
                    }

                    if (status == 'add' || status == 'edit') {
                        //点击修改或者新增进入的时候，返回按钮不可见
                        this.setState({
                            backVisible: false
                        })
                    }
                })
            })
        }
        this.props.MultiInit.getMultiLang({ moduleId: '10140ACMAP', domainName: 'uapbd', callback })


    }

    //切换页面状态
    toggleShow() {
        let status = this.props.getUrlParam('status');
        let id = this.props.getUrlParam('id')
        //按钮的显示状态
        let visibleButtons = []
        let unvisibleButtons = []
        if (status == 'browse' && id == 'null') {
            visibleButtons = ['Add']
            unvisibleButtons = ['SaveAdd', 'Edit', 'back', 'Delete', 'Refresh', 'Enable', 'Disable', 'Print', 'Output', 'Save', 'Cancel', 'AddLine', 'DelLine']
        }
        else if (status == 'edit' || status == 'add') {
            unvisibleButtons = ['Edit', 'Add', 'back', 'Delete', 'Refresh', 'Enable', 'Disable', 'Print', 'Output']
            visibleButtons = ['Save', 'Cancel', 'AddLine', 'DelLine']
            if (status == 'add') {
                visibleButtons.push('SaveAdd')
            }
            else {
                unvisibleButtons.push('SaveAdd')
            }
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        } else {
            unvisibleButtons = ['Save', 'Cancel', 'AddLine', 'DelLine', 'SaveAdd']
            visibleButtons = ['Add', 'Edit', 'Delete', 'back', 'Refresh', 'Print', 'Output']
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
        }
        this.props.form.setFormStatus(formId, 'edit');
        this.props.form.setFormItemsDisabled(formId, { 'code': status != 'add', 'targetperiod': status != 'add', sourceperiod: status != 'add', targetyear: false })
        this.props.cardTable.setStatus(tableId, status == 'edit' || status == 'add' ? 'edit' : 'browse');
        this.props.button.setButtonVisible(unvisibleButtons, false);
        this.props.button.setButtonVisible(visibleButtons, true);
        this.updateCardTableBtnStatus();

        //添加浏览器窗口关闭监听事件
        if (status != 'add' && status != "edit") {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    };

    setDefaultValue = () => {
        this.props.form.setFormItemsValue(this.formId, { 'bill_status': { value: '0', display: this.state.json['10140ACMAP-000001'] } });/* 国际化处理： 自由态*/
        this.props.form.setFormItemsValue(this.formId, { 'dataoriginflag': { value: '0', display: this.state.json['10140ACMAP-000003'] } });/* 国际化处理： 本级产生*/
    }

    // 处理一下编码规则
    processBillCode(isAdd = false) {
        let data = {
            operation: isAdd ? 'getCode' : 'cancelCode'
        }

        if (!isAdd && this.isPreCode) {
            data.billCode = this.preCode
        }
        ajax({
            url: extraUrl,
            data: data,
            success: res => {
                if (isAdd) {
                    // 如果有编码
                    if (res.data.hasCode) {
                        this.props.form.setFormItemsValue(this.formId, { code: { display: res.data.code, value: res.data.code } })
                        this.props.form.setFormItemsDisabled(this.formId, { code: res.data.codeType != 'pre' || !res.data.editable })
                        this.preCode = res.data.code
                        this.isPreCode = res.data.codeType == 'pre'
                        this.isCodeEditable = res.data.codeType != 'pre' || !res.data.editable
                    }
                }
            }
        })
    }

    buttonClick = (props, id) => {

        let _this = this;
        switch (id) {
            case 'Add':
                props.form.EmptyAllFormValue(this.formId)
                props.cardTable.setTableData(this.tableId, { rows: [] })
                props.pushTo('/card', {
                    pagecode: '10140ACMAP_card',
                    status: 'add'
                })
                this.setDefaultValue()
                this.toggleShow();
                //特殊设置一下返回按钮的可见性
                this.setState({
                    backVisible: false
                })

                // 处理一下编码规则
                this.processBillCode(true)

                //this.props.form.setFormItemsDisabled(this.formId, {'sourceperiod': true, 'targetyear': true})
                break
            case 'Edit':
                this.props.cardTable.resetTableData(this.tableId)
                this.props.form.cancel(this.formId)
                // props.pushTo('/card', {
                //     status: 'edit',
                //     pagecode:'10140ACMAP_card',
                // 	id: props.getUrlParam('id')
                // })
                this.getdata(this.props.getUrlParam('id'), () => {
                    this.props.setUrlParam({ status: 'edit' })
                    this.toggleShow()
                })

                //特殊设置一下返回按钮的可见性
                this.setState({
                    backVisible: false
                })
                break;
            case 'Delete':
                //this.props.modal.show('delete');
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10140ACMAP-000004'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
                    content: this.state.json['10140ACMAP-000005'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
                    noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    beSureBtnName: this.state.json['10140ACMAP-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                    cancelBtnName: this.state.json['10140ACMAP-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                    beSureBtnClick: this.delConfirm.bind(this)   // 确定按钮点击调用函数,非必输
                })
                break
            case 'Back':
                props.pushTo('/list', {
                    pagecode: '10140ACMAP_list',
                })
                break
            case 'Save':
                this.saveClick();
                break
            case 'Cancel':
                //this.props.modal.show('cancel')
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10140ACMAP-000008'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
                    content: this.state.json['10140ACMAP-000009'],             // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
                    noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    beSureBtnName: this.state.json['10140ACMAP-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                    cancelBtnName: this.state.json['10140ACMAP-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                    beSureBtnClick: this.cancelSureEvent.bind(this)   // 确定按钮点击调用函数,非必输
                })
                break
            case 'Refresh':
                this.getdata(this.props.getUrlParam('id'), () => {
                    toast({ title: this.state.json['10140ACMAP-000013'], color: 'success' });/* 国际化处理： 刷新成功！*/
                })
                break
            case 'SaveAdd':
                this.saveClick(true)
                break
            case 'AddLine':
                props.cardTable.addRow(this.tableId);
                break
            default:
                break
        }
    }

    cancelSureEvent() {
        if (this.props.getUrlParam('status') === 'add') {
            let pk = getCurrentLastId(dataSource);
            this.getDataForCache(pk, () => {
                //编辑态取消时，修正一下页面状态
                this.props.pushTo('/card', {
                    status: 'browse',
                    pagecode: '10140ACMAP_card',
                    id: this.props.getUrlParam('id')
                })

                this.props.form.setFormStatus(this.formId, 'browse')
                this.props.cardTable.setStatus(this.tableId, 'browse')
            })
        }
        if ((this.props.getUrlParam('status') === 'edit')) {
            this.props.form.cancel(this.formId);
            //this.props.cardTable.resetTableData(this.tableId);
            // 刷新一下数据
            this.getdata(this.props.getUrlParam('id'))
            this.props.pushTo('/card', {
                status: 'browse',
                pagecode: '10140ACMAP_card',
                id: this.props.getUrlParam('id')
            })
            this.toggleShow()
        }
        //特殊设置一下返回按钮的可见性
        this.setState({
            backVisible: true
        })
        //处理一下编码规则
        this.processBillCode()
        // 清除一下原先缓存的数据
        this.yearData = []
        //this.props.form.setFormItemsDisabled(this.formId, {'sourceperiod': true, 'targetyear': false})
    }

    pageInfoClick = (props, pk) => {
        this.getDataForCache(pk)
    }


    afterEvent(props, moduleId, key, value, oldValue) {
        debugger
        if (key == 'targetyear' && value.value != oldValue.value) {
            let status = this.props.getUrlParam('status')
            // 看下是否已经缓存过数据了，如果缓存过数据了的话，那么就加载缓存过的子表数据
            if (this.yearData[value.display]) {
                this._recordYearData(oldValue.display)
                debugger
                this.props.cardTable.setTableData(this.tableId, this.yearData[value.display])
                return
            }
            // 解决表头，目标会计年度不显示 add by zhangchenm
            let targetperiodyearrefpk =  value.refpk;
            if (value.values != null) {
                if (value.values.periodyear != null) {
                    value.values.periodyear.display = value.values.periodyear.value;
                    this.props.form.setFormItemsValue(this.formId, { targetyear: value.values.periodyear })
                }

            }
            // 进行编辑后处理
            let data = {
                operation: 'targetYearChanged',
                pk_periodmapping: props.getUrlParam("id"),
                pk_sourcePeriod: props.form.getFormItemsValue(this.formId, 'sourceperiod').value,
                pk_targetPeriod: props.form.getFormItemsValue(this.formId, 'targetperiod').value,
                targetperiodyear: targetperiodyearrefpk,
                year: props.form.getFormItemsValue(this.formId, 'targetyear').display,
                status
            }
            ajax({
                url: extraUrl,
                data: data,
                success: res => {
                    // 先行记录一下变更年度之前的子表数据，最后合并到后台的插入或者更新数据中
                    this._recordYearData(oldValue.display)
                    this._displayDataFromRes(res)

                    // 重新设置一下编码
                    this.props.form.setFormItemsValue(this.formId, { code: this.preCode })
                }
            })
        }
        else if (key == 'targetperiod' && value.value != oldValue.value) {
            let sourcePeriodVal = this.props.form.getFormItemsValue(this.formId, 'sourceperiod')

            // 修正一下参照
            let meta = this.props.meta.getMeta()
            meta[this.formId].items.find(item => item.attrcode == 'sourceperiod').queryCondition = () => {
                return {
                    GridRefActionExt: "nccloud.web.uapbd.periodmapping.action.PeriodSchemeExceptSqlBuilder",
                    pk_accperiodscheme: value.value
                }
            }
            meta[formId].items.find(item => item.attrcode == 'targetyear').queryCondition = () => {
                return {
                    GridRefActionExt: "nccloud.web.uapbd.periodmapping.action.PeriodMappingExtSqlBuilder",
                    pk_accperiodscheme: value.value
                }
            }
            this.props.meta.setMeta(meta)

            // 特殊修正一下表单字段编辑性
            this.props.form.setFormItemsDisabled(this.formId, { 'sourceperiod': false, 'targetyear': false })

            // 清除一下原先缓存的数据
            this.yearData = []

            if (sourcePeriodVal && sourcePeriodVal.value) {
                // 进行编辑后处理
                let data = {
                    operation: 'targetYearChanged',
                    pk_periodmapping: props.getUrlParam("id"),
                    pk_sourcePeriod: props.form.getFormItemsValue(this.formId, 'sourceperiod').value,
                    pk_targetPeriod: value.value,
                    targetperiodyear: null,
                    year: null
                }
                ajax({
                    url: extraUrl,
                    data: data,
                    success: res => {
                        // 先行记录一下变更年度之前的子表数据，最后合并到后台的插入或者更新数据中
                        this._recordYearData(oldValue.display)
                        this._displayDataFromRes(res)

                        // 重新设置一下编码
                        this.props.form.setFormItemsValue(this.formId, { code: this.preCode })
                    }
                })
            }
            else {
                let data = {
                    operation: 'targetPeriodSelected',
                    pk_targetPeriod: value.value,
                }
                ajax({
                    url: extraUrl,
                    data: data,
                    success: res => {
                        if (res.data) {
                            this.props.form.setFormItemsValue(this.formId, {
                                targetyear: {
                                    value: res.data[0],
                                    display: res.data[1]
                                }
                            })
                        }
                    }
                })
            }
        }
        else if (key == 'sourceperiod' && value.value != oldValue.value) {
            // 清除一下原先缓存的数据
            this.yearData = []
            // 修正一下参照
            let meta = this.props.meta.getMeta();
            meta[tableId].items.find(item => item.attrcode == 'sourcebeginperiodmth').queryCondition = () => {
                return {
                    GridRefActionExt: "nccloud.web.uapbd.periodmapping.action.PeriodMappingExtSqlBuilder",
                    pk_accperiodscheme: value.value
                }
            }

            meta[tableId].items.find(item => item.attrcode == 'sourceendperiodmth').queryCondition = () => {
                return {
                    GridRefActionExt: "nccloud.web.uapbd.periodmapping.action.PeriodMappingExtSqlBuilder",
                    pk_accperiodscheme: value.value
                }
            }
            this.props.meta.setMeta(meta, () => {
                let targetPeriodVal = this.props.form.getFormItemsValue(this.formId, 'targetperiod')
                let targetYear = this.props.form.getFormItemsValue(this.formId, "targetyear")
                if (targetPeriodVal && targetPeriodVal.value) {
                    // 进行编辑后处理
                    let data = {
                        operation: 'targetYearChanged',
                        pk_periodmapping: props.getUrlParam("id"),
                        pk_sourcePeriod: props.form.getFormItemsValue(this.formId, 'sourceperiod').value,
                        pk_targetPeriod: targetPeriodVal.value,
                        targetperiodyear: targetYear && targetYear.value ? targetYear.value : null,
                        year: targetYear && targetYear.value ? targetYear.display : null
                    }
                    ajax({
                        url: extraUrl,
                        data: data,
                        success: res => {
                            // 先行记录一下变更年度之前的子表数据，最后合并到后台的插入或者更新数据中
                            this._recordYearData(oldValue.display)
                            this._displayDataFromRes(res)

                            // 重新设置一下编码
                            this.props.form.setFormItemsValue(this.formId, { code: this.preCode })
                        }
                    })
                }
            })

        }

    }

    beforeEvent(props, moduleId, key, value, data) {
        //如果目标期间参照没有值 来源期间参照不能编辑
        switch (key) {
            
            case 'sourceperiod':
                return !!props.form.getFormItemsValue(moduleId, 'targetperiod').value;
        }
        return true;
    }

    _recordYearData(preYear) {
        let status = this.props.getUrlParam("status")
        if (status == 'edit' || status == 'add') {
            let tableData = this.props.cardTable.getAllData(this.tableId)
            this.yearData[preYear] = tableData
        }
        this.preCode = this.props.form.getFormItemsValue(this.formId, 'code')
    }

    /**
     * 修正参照
     */
    _fixRef() {

    }

    _displayDataFromRes(res) {
        if (res.data.head) {
            this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
            let title_code = res.data.head[this.formId].rows[0].values[titleCode].value;
            this.setState({ title_code });

            this.toggleShow()

            //放入缓存
            updateCache(pk_item, res.data.head[formId].rows[0].values[pk_item].value, res.data, formId, dataSource);

            // this.props.form.setFormItemsValue(formId, {
            //     targetyear: {
            //         value: res.data.head[formId].rows[0].values['targetperiodyear'].value,
            //         display: res.data.head[formId].rows[0].values['targetperiodyear'].display
            //     }
            // })

            let meta = this.props.meta.getMeta()
            meta[formId].items.find(item => item.attrcode == 'targetyear').queryCondition = () => {
                return {
                    GridRefActionExt: "nccloud.web.uapbd.periodmapping.action.PeriodMappingExtSqlBuilder",
                    pk_accperiodscheme: res.data.head[formId].rows[0].values['targetperiod'].value
                }
            }

            meta[tableId].items.find(item => item.attrcode == 'sourcebeginperiodmth').queryCondition = () => {
                return {
                    pk_accperiodscheme: res.data.head[formId].rows[0].values['sourceperiod'].value
                }
            }

            meta[tableId].items.find(item => item.attrcode == 'sourceendperiodmth').queryCondition = () => {
                return {
                    pk_accperiodscheme: res.data.head[formId].rows[0].values['sourceperiod'].value
                }
            }
            this.props.meta.setMeta(meta)
            //this.props.form.setFormItemsDisabled(this.formId, {code : this.isCodeEditable})
        }
        if (res.data.body) {
            debugger
            this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
            let totalcount = this.props.cardTable.getNumberOfRows(this.tableId);
            let arr = this.props.cardTable.getAllRows(this.tableId);
            let applycount = 0;
            // arr.map((item)=>{
            // 	applycount += parseInt(item.values.pk_project.value);
            // })
            this.setState({ applycount });
            this.setState({ totalcount });
        }
        else {
            debugger
            this.props.cardTable.setTableData(this.tableId, { rows: [] })
            this.setState({ totalcount: 0 });
        }

        if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
            this.props.dealFormulamsg(
                res.formulamsg, {
                    [formId]: 'form',
                    [tableId]: 'cardTable'
                }
            )
        }
    }

    //通过单据id查询单据信息
    getdata = (pk, callback) => {
        let data = { pk };
        ajax({
            url: queryCardUrl,
            data,
            success: (res) => {
                this._displayDataFromRes(res)

                if (callback && typeof callback == 'function') {
                    callback.call(this)
                }
            }
        });
    }

    onCardTableAfterEvent(props, moduleId, key, value, changedrows, index, record) {
        if (changedrows[0].newvalue.value != changedrows[0].oldvalue.value && key == 'sourcebeginperiodmth') {
            let CardData = this.props.createMasterChildData(pageId, this.formId, this.tableId);
            CardData['operation'] = 'beginPeriodMonth'
            CardData.index = index
            CardData.yearmth = props.cardTable.getValByKeyAndIndex(this.tableId, index, key).display
            ajax({
                url: extraUrl,
                data: CardData,
                success: res => {
                    if (res.data.head) {
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        let title_code = res.data.head[this.formId].rows[0].values[titleCode].value;
                        this.setState({ title_code });

                        this.toggleShow()
                         debugger
                        this.props.form.setFormItemsValue(formId, {
                            targetyear: {
                                value: res.data.head[formId].rows[0].values['targetperiodyear'].value,
                                display: res.data.head[formId].rows[0].values['targetperiodyear'].display
                            }
                        })

                        let meta = this.props.meta.getMeta()
                        meta[formId].items.find(item => item.attrcode == 'targetyear').queryCondition = () => {
                            return {
                                GridRefActionExt: "nccloud.web.uapbd.periodmapping.action.PeriodMappingExtSqlBuilder",
                                pk_accperiodscheme: res.data.head[formId].rows[0].values['targetperiod'].value
                            }
                        }

                        meta[tableId].items.find(item => item.attrcode == 'sourcebeginperiodmth').queryCondition = () => {
                            return {
                                pk_accperiodscheme: res.data.head[formId].rows[0].values['sourceperiod'].value
                            }
                        }

                        meta[tableId].items.find(item => item.attrcode == 'sourceendperiodmth').queryCondition = () => {
                            return {
                                pk_accperiodscheme: res.data.head[formId].rows[0].values['sourceperiod'].value
                            }
                        }
                        this.props.meta.setMeta(meta)
                    }
                    if (res.data.body) {
                        debugger
                        this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                        let totalcount = this.props.cardTable.getNumberOfRows(this.tableId);
                        let arr = this.props.cardTable.getAllRows(this.tableId);
                        let applycount = 0;
                        // arr.map((item)=>{
                        // 	applycount += parseInt(item.values.pk_project.value);
                        // })
                        this.setState({ applycount });
                        this.setState({ totalcount });
                    }
                    else {
                        debugger
                        this.props.cardTable.setTableData(this.tableId, { rows: [] })
                    }
                }
            })
        }
    }

    //保存单据
    saveClick = (saveAdd = false) => {
        //加个判定，这会导致必输项如果没有输入的话会标红
        if (!this.props.form.isCheckNow(this.formId)) {
            return
        }
        let currRows = this.props.cardTable.getAllRows(this.tableId)
        let isCurrEmpty = currRows == null || currRows.length == 0
        let OriginCardData = this.props.createMasterChildData(pageId, this.formId, this.tableId);
        let CardData = { ...OriginCardData, body: { [tableId]: { rows: [] } } }
        CardData.body[tableId].rows.push(...OriginCardData.body[tableId].rows);

        // 处理一下CardData，如果存在更改目标会计年度的，将前几次的数据合并到最终结果当中
        let currYear = this.props.form.getFormItemsValue(this.formId, 'targetyear').display
        if (this.yearData) {
            for (let tempKey in this.yearData) {
                if (tempKey != currYear) {
                    CardData.body[tableId].rows.push(...this.yearData[tempKey].rows)
                }
            }
        }

        if (CardData.body[tableId] && CardData.body[tableId].rows) {
            let unchangedNum = 0
            CardData.body[tableId].rows.forEach(element => {
                if (element.status != 0)
                    unchangedNum++
            });
            // 没有修改的数据，并且当前界面展示的子表为空，那么就模仿一下@see nc.ui.bd.periodmapping.actions.PeriodMappingSaveAction
            // 的校验，提示一下信息：映射关系不存在，请检查对应年份映射关系!
            if (unchangedNum == 0) {
                if (isCurrEmpty) {
                    toast({ color: 'warning', content: this.state.json['10140ACMAP-000044'] })
                    return
                }
            }
        }
        delete CardData.head[formId].rows[0].values[childValues]
        // CardData.head.head.rows[0].values.bill_code = _this.state.bill_code;
        let url = saveUrl;//新增保存
        if (this.props.getUrlParam('status') === 'edit') {
            url = updateUrl;//修改保存

            // 让后台更新一下targetperiodyear，避免显示上的问题
            CardData.targetperiodyear = this.props.form.getFormItemsValue(this.formId, 'targetyear').value
        }

        // 因为这个节点的特殊性，现在不能够从前台界面上获取数据了，从记录当中选择数据
        this.props.validateToSave(CardData, () => {
            ajax({
                url: url,
                data: CardData,
                success: (res) => {
                    let pk_value = null
                    if (res.success) {
                        // 清除一下原先缓存的数据
                        this.yearData = []
                        if (res.data && !saveAdd) {
                            if (res.data.head && res.data.head[this.formId]) {
                                this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                                pk_value = res.data.head[this.formId].rows[0].values[pk_item].value
                            }
                            if (res.data.body && res.data.body[this.tableId]) {
                                debugger
                                this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId])
                            }
                        }
                        else {
                            pk_value = res.data.head[this.formId].rows[0].values[pk_item].value
                        }
                        if (!saveAdd) {
                            this.props.pushTo('/card', {
                                status: 'browse',
                                pagecode: '10140ACMAP_card',
                                id: pk_value
                            })
                            this.toggleShow()
                            //特殊设置一下返回按钮的可见性
                            this.setState({
                                backVisible: true,
                                title_code: res.data.head[this.formId].rows[0].values.code.value
                            })
                            this.props.form.setFormItemsDisabled(this.formId, { 'targetperiod': true, 'sourceperiod': true, 'targetyear': false })
                        }
                        else {
                            this.props.form.EmptyAllFormValue(this.formId)
                            this.setDefaultValue()
                        }

                        //更正缓存
                        if (url == saveUrl) {
                            //新增保存
                            addCache(pk_value, res.data, this.formId, dataSource);
                        }
                        else {
                            //修改保存
                            updateCache(pk_item, res.data.head[formId].rows[0].values[pk_item].value, res.data, formId, dataSource);
                        }
                        toast({ content: this.state.json['10140ACMAP-000018'], color: 'success' });/* 国际化处理： 保存成功*/
                    }
                }
            })
        }, { 'head': formId, [tableId]: 'cardTable' })
    }

    getDataForCache(pk, callback) {
        if (!pk) {
            this.setState({ title_code: '', totalcount: 0 });
            this.props.setUrlParam({ id: 'null', status: 'browse' })
            this.props.form.EmptyAllFormValue(this.formId)
            debugger
            this.props.cardTable.setTableData(this.tableId, { rows: [] })
            this.toggleShow()
            return
        }

        let cardData = getCacheById(pk, dataSource);
        if (cardData) {
            this.props.form.setAllFormValue({ [formId]: cardData.head[formId] });
            let title_code = cardData.head[this.formId].rows[0].values[titleCode].value;
            //this.setState({title_code});
            if (cardData.body && cardData.body[tableId]) {
                debugger
                this.props.cardTable.setTableData(tableId, cardData.body[tableId]);
                let totalcount = cardData.body[tableId].rows.length;
                this.setState({ title_code: title_code, totalcount: totalcount });
            }
            else {
                debugger
                this.props.cardTable.setTableData(tableId, { rows: [] })
                this.setState({ title_code: '', totalcount: 0 });
            }
            this.props.setUrlParam(pk)//动态修改地址栏中的id的值
        }
        else {
            this.getdata(pk)
            this.props.setUrlParam(pk)//动态修改地址栏中的id的值
        }

        if (callback && typeof callback == 'function') {
            callback.call(this)
        }

        //将更新按钮状态的调用延后到callback之后，否则新增取消的时候显示的还是编辑态的按钮
        if (cardData) {
            this.toggleShow()
        }
    }

    //删除单据
    delConfirm = () => {
        let CardData = this.props.createMasterChildData(pageId, this.formId, this.tableId);
        let data = {
            deleteInfo: [
                {
                    id: this.props.getUrlParam('id'),
                    ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
                }
            ]
        }
        ajax({
            url: deleteUrl,
            data: data,
            success: (res) => {
                if (res) {
                    let id = this.props.getUrlParam("id");

                    //根据当前id,获取下个id
					/*
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
                    let nextId = getNextId(id, dataSource);

                    //调用删除缓存数据方法
					/*
					* idname: 数据主键的命名
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
                    deleteCacheById(pk_item, id, dataSource);

                    this.getDataForCache(nextId, () => {
                        //this.props.cardPagination.setCardPaginationId({id: nextId,status: 1})
                        toast({ color: "success", title: this.state.json['10140ACMAP-000019'] });/* 国际化处理： 删除成功！*/
                    })
                }

            }
        });
    };

    updateCardTableBtnStatus() {
        let checkedRows = this.props.cardTable.getCheckedRows(this.tableId)
        let status = this.props.getUrlParam('status')
        status = status == 'add' || status == 'edit' ? 'edit' : 'browse'

        if (checkedRows.length > 0 && status == 'edit') {
            this.props.button.setButtonDisabled(['DelLine'], false);
        }
        else {
            this.props.button.setButtonDisabled(['DelLine'], true);
        }
    }

    changeEnableClick() {
        ajax({
            url: changeEnableStatus,
            data: {
                id: this.props.getUrlParam('id')
            },
            success: res => {
                this.getdata(this.props.getUrlParam('id'), () => {
                    if (this.enableClick) {
                        toast({ color: "success", title: this.state.json['10140ACMAP-000020'] })/* 国际化处理： 启用成功！*/
                    }
                    else {
                        toast({ color: "success", title: this.state.json['10140ACMAP-000021'] })/* 国际化处理： 停用成功！*/
                    }
                });
            }
        })
    }

    modelSave = (props) => {
        props.cardTable.closeModel(this.tableId);
        this.saveClick();
    }

    getButtonNames = (codeId) => {
        if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
            return 'main-button'
        } else {
            return 'secondary - button'
        }
    };

    //获取列表肩部信息
    getTableHead = () => {
        let { button } = this.props;
        let { createButtonApp } = button;
        let buttons = this.props.button.getButtons();
        let status = this.props.getUrlParam("status");
        return (
            <div className="shoulder-definition-area">
                <div className='definition-search'>
                    {status == 'browse' ? <div className='nc-theme-common-font-c'><span className="definition-search-title">{this.state.json ? this.state.json['10140ACMAP-000026'] : '10140ACMAP-000026'} | {this.state.json ? this.state.json['10140ACMAP-000027'] : '10140ACMAP-000027'/* 国际化处理： 详细信息,总计*/}：</span>
                        <span className='count'>{this.state.totalcount}</span><span>{this.state.json ? this.state.json['10140ACMAP-000028'] : '10140ACMAP-000028'/* 国际化处理： 条*/}</span></div> : <span className="definition-search-title"></span>}
                </div>
                <div className="definition-icons" style={{ padding: "0px" }}>
                    {createButtonApp({
                        area: 'body-action',//按钮注册中的按钮区域
                        onButtonClick: this.buttonClick.bind(this)
                    })}
                    {this.props.cardTable.createBrowseIcons(this.tableId, {
                        iconArr: ['close', 'open', 'max', 'setCol'],
                        maxDestAreaId: 'nc-bill-card'
                    })}
                </div>
            </div>
        )
    }
    render() {
        let { cardTable, form, button, modal, cardPagination, BillHeadInfo } = this.props;
        const { createCardPagination } = cardPagination;
        const { createBillHeadInfo } = BillHeadInfo;
        const { NCDiv } = base;
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createButtonApp } = button;
        let { createModal } = modal;
        let status = this.props.getUrlParam('status');
        return (
            <div className="nc-bill-card">
                <div className="nc-bill-top-area">
                    <NCAffix>
                        <NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area' >
                            <div className='header-title-search-area' >
                                {
                                    createBillHeadInfo(
                                        {
                                            title: this.state.json ? this.state.json['10140ACMAP-000029'] : '10140ACMAP-000029'/* 国际化处理： 税收地区*/,             //标题
                                            backBtnClick: this.buttonClick.bind(this, this.props, 'Back'),
                                            initShowBackBtn: status == 'browse'
                                        }
                                    )}
                                <span className="bill-info-code" style={{ fontSize: '16px', marginLeft: '8px', lineHeight: '32px', verticalAlign: 'baseline' }}>
                                    {status == 'browse' ? `：${this.state.title_code}` : ''}
                                </span>
                                {/*<h2 className='title-search-detail'>{status=='browse'?`：${this.state.title_code}`:''}</h2>*/}

                            </div>
                            <div className="header-button-area">
                                {createButtonApp({
                                    area: 'header-action',//按钮注册中的按钮区域
                                    onButtonClick: this.buttonClick.bind(this)
                                })}
                                {createCardPagination({
                                    handlePageInfoChange: this.pageInfoClick.bind(this),
                                    dataSource: dataSource
                                })}
                            </div>
                        </NCDiv>
                    </NCAffix>
                    <div className="nc-bill-form-area">
                        {createForm(this.formId, {
                            onAfterEvent: this.afterEvent.bind(this),
                            onBeforeEvent: this.beforeEvent.bind(this)
                        })}
                    </div>
                </div>
                <div className="nc-bill-bottom-area">
                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId, {
                            tableHead: this.getTableHead.bind(this),
                            modelSave: this.modelSave.bind(this),
                            onAfterEvent: this.onCardTableAfterEvent.bind(this),
                            showIndex: true,
                            onSelected: this.updateCardTableBtnStatus.bind(this),
                            onSelectedAll: this.updateCardTableBtnStatus.bind(this),
                            hideAdd: true,
                            hideDel: true,
                            adaptionHeight: true
                        })}
                    </div>
                </div>
                {createModal('delete', {
                    title: this.state.json ? this.state.json['10140ACMAP-000004'] : '10140ACMAP-000004',/* 国际化处理： 注意*/
                    content: this.state.json ? this.state.json['10140ACMAP-000005'] : '10140ACMAP-000005',/* 国际化处理： 确认删除？*/
                    beSureBtnClick: this.delConfirm.bind(this)
                })}

                {createModal('cancel', {
                    title: this.state.json ? this.state.json['10140ACMAP-000008'] : '10140ACMAP-000008',/* 国际化处理： 确认取消*/
                    content: this.state.json ? this.state.json['10140ACMAP-000009'] : '10140ACMAP-000009',/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick: this.cancelSureEvent.bind(this)
                })}

                {createModal('enable', {
                    title: this.state.json ? this.state.json['10140ACMAP-000014'] : '10140ACMAP-000014',/* 国际化处理： 确认启用*/
                    content: this.state.json ? this.state.json['10140ACMAP-000015'] : '10140ACMAP-000015',/* 国际化处理： 是否确认要启用？*/
                    beSureBtnClick: this.changeEnableClick.bind(this)
                })}

                {createModal('disable', {
                    title: this.state.json ? this.state.json['10140ACMAP-000016'] : '10140ACMAP-000016',/* 国际化处理： 确认停用*/
                    content: this.state.json ? this.state.json['10140ACMAP-000017'] : '10140ACMAP-000017',/* 国际化处理： 是否确认要停用？*/
                    beSureBtnClick: this.changeEnableClick.bind(this)
                })}

                <PrintOutput
                    ref='printOutput'
                    url={printUrl}
                    data={{
                        funcode: '10140ACMAP',
                        nodekey: 'card',
                        oids: this.state.pks,
                        outputType: 'output'
                    }}
                />
            </div>

        );
    }
}

Card = createPage({
    billinfo: {
        billtype: 'card',
        pagecode: pageId,
        headcode: formId,
        bodycode: tableId
    },
    initTemplate: []
})(Card);

export default Card

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65