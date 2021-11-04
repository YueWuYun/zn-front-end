//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, promptBox, getMultiLang, createPageIcon } from 'nc-lightapp-front';
import { print } from 'nc-lightapp-front';
import Utils from '../../../public/utils';
import PsndocTreeGridRef from "../../../../uapbd/refer/psninfo/PsndocTreeGridRef/index.js"
// import ApprovalTrans from '../../../../uap/public/excomponents/approvalTrans';
import { cardCache } from "nc-lightapp-front";
const { NCAffix, NCAnchor, NCScrollElement, NCScrollLink, NCBackBtn, NCDiv } = base;
const { NCUploader, ApproveDetail, ApprovalTrans } = high
const { PrintOutput } = high
const { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById, setDefData, getDefData } = cardCache;
const addUrl = '/nccloud/uapbd/incomeapply/addIncomeApply.do'
const exFieldUrl = '/nccloud/uapbd/incomeapply/incomeExField.do'
const checkDataPermUrl = '/nccloud/uapbd/incomeapply/checkDataPerm.do' //编辑数据权限校验功能
const queryGroupUrl = '/nccloud/uapbd/incomeapply/queryGroupAction.do';   //卡片查询url
const queryCardUrl = '/nccloud/uapbd/incomeapply/queryIncomeApplyCard.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/incomeapply/saveIncomeApply.do';         //新增保存
const updateUrl = '/nccloud/uapbd/incomeapply/updateIncomeApply.do';         //修改保存
const callbackUrl = '/nccloud/uapbd/incomeapply/callbackIncomeApply.do' //收回
const commitUrl = '/nccloud/uapbd/incomeapply/commitIncomeApply.do' //提交
const deleteUrl = '/nccloud/uapbd/incomeapply/deleteIncomeApply.do'	//删除
const printUrl = '/nccloud/uapbd/incomeapply/printIncomeApplyCard.do'
const qryUserInfoUrl = '/nccloud/uapbd/incomeapply/PaymentLoginUserInfoQuery.do';//登录用户信息

const dataSource = 'uapbd.sminfo.income_org.data'
const formId = 'sminfoPf';                      //表头id
const pageId = '10140INCPF_card';            //pagecode
const searchId = 'search';                  //查询区id
const appCode = '10140INCPF'
const pk_item = 'pk_income_pf';             //单据主键--用于卡片查询刷新
const tableIds = ['incomech'];
const tableId = 'incomech'
const baseform = 'income_baseInfo'
function tableButtonClick(props, id, text, record, index, item) {
    let allData = props.cardTable.getVisibleRows(tableId, false);
    let value;
    switch (id) {
        case 'Spread'://展开
            //toggleRowView**(moduleId, record) | 切换视图，展开和收起 | record  行数据data Object | undefined     执行函数 | toggleRowView('tableDemo', record) 
            props.cardTable.toggleRowView(tableId, record);
            break
        case 'Detail'://更多
            props.cardTable.openModel(tableId, 'edit', record, index);
            break;
        case 'Delline'://删除
            allData.forEach(element => {
                if (element.values['showorder'].value >= record.values['showorder'].value) {
                    //先转成整数-1 再转成字符串类型
                    value = (parseInt(element.values['showorder'].value) - 1).toString()
                    //setValByKeyAndRowId**<br>(moduleId, rowId, key, { value, display, scale }) | 根据RowId设置表格某行某个字段值
                    props.cardTable.setValByKeyAndRowId(tableId, element.rowid, 'showorder', { value: value })
                }
            })
            props.cardTable.delRowsByIndex(tableId, index);
            break
        default:
            console.log(id, index);
            break;
    }
}
// function getTime(effectdate)
// 			{
// 				// window.setTimeout(function(){
// 				// 	window.requestAnimationFrame(getDate)
// 				// },1000/2)
// 				var d=new Date();   
// 				var year=d.getFullYear()  //获取年
// 				var month=d.getMonth()+1;  //获取月，从 Date 对象返回月份 (0 ~ 11)，故在此处+1
// 				var day=d.getDay()    //获取日
// 				var days=d.getDate() //获取日期
// 				var hour=d.getHours()   //获取小时
// 				var minute=d.getMinutes()  //获取分钟
// 				var second=d.getSeconds()   //获取秒

// 				if(month<10) month="0"+month
// 				if(days<10) days="0"+days
// 				if(hour<10) hour="0"+hour
// 				if(minute<10) minute="0"+minute
// 				if(second<10) second="0"+second

// 				var week=new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六")
// 				var Tools=document.getElementsByClassName("u-form-control md")
// 				var effectDate=year+" 年 "+month+" 月 "+days+" 日 "+week[day]+" "+hour+" : "+minute+" :"+second
// 				Tools.innerHTML=effectDate
// 			}


class Card extends Component {
    constructor(props) {
        super(props);
        this.formId = formId;
        this.tableId = tableId;
        this.searchId = searchId;

        this.billId = this.props.getUrlParam('id')
        this.state = {
            pk_org: '',
            title_code: '',
            totalcount: 0,
            applycount: 0,
            showBaseInfo: true,
            isList: true,
            showApprove: false,
            showUploader: false,
            target: null,
            pks: [],
            backVisible: true,
            compositedata: null,
            compositedisplay: false,
            showApprInfo: false,
            billId: null,
            billno: '',
            json: {},
            showFAndS: true,
            bankCanEdit: true
        }
    }
    initTemplate = (props, callback) => {
        props.createUIDom(
            {
                pagecode: pageId//页面id
            },
            (data) => {
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        this.modifierMeta(props, meta)
                        props.meta.setMeta(meta, () => {
                            if (data.context) {
                                if (data.context.pk_org && data.context.org_Name) {
                                    this.pfOrg = data.context.pk_org
                                    this.pfOrgName = data.context.org_Name
                                }

                                if (callback && typeof callback == 'function') {
                                    callback()
                                }
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

        // 修正，收款申请单申请类型字段去掉停用和启用选项
        let applyTypeItem = meta[formId].items.find(item => item.attrcode == 'apply_type')
        // 避免界面上删除了该字段
        if (applyTypeItem) {
            let originOptions = applyTypeItem.options
            if (originOptions && originOptions.length > 2) {
                let newOptions = [originOptions[0], originOptions[1]]
                applyTypeItem.options = newOptions
            }
        }

        tableIds.forEach(item => {
            let porCol = {
                itemtype: 'customer',
                attrcode: 'opr',
                label: this.state.json['10140INCPF-000019'],/* 国际化处理： 操作*/
                visible: true,
                className: 'table-opr',
                width: 200,
                fixed: 'right',
                render: (text, record, index) => {
                    let status = props.cardTable.getStatus(item);
                    let tableBtnAry = status === 'browse' ? ['Spread'] : ['Detail']
                    if (!(status == 'browse')) {
                        tableBtnAry.push('Delline');
                    }
                    return props.button.createOprationButton(
                        tableBtnAry,
                        {
                            area: "table-opr-area",
                            buttonLimit: 3,
                            onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index, item)
                        }
                    )
                }
            };
            meta[item].items.push(porCol);
        })

        return meta;
    }


    handleGtxidBillpx = (errParam) => {
        let gtxid = "", billpx = "", params = {}, billtype = "", billpkname = "";
        if (errParam) {
            params = JSON.parse(errParam);
            console.log({ params, params })

            billpx = params.pk_income_pf.value || "";
            billtype = params.pk_billtype.value || "10SX";
            billpkname = "pk_income_pf";
        }

        this.setState({ billpx, billtype, billpkname })
    }

    componentDidMount() {
        const errParam = this.props.getUrlParam('errParam') || "";
        this.handleGtxidBillpx(errParam);
        let callback = (json) => {
            this.setState({ json }, () => {
                this.initTemplate(this.props, () => {
                    let status = this.props.getUrlParam('status');
                    let BillStatus = -1
                    if (status != "add") {
                        let pk = this.props.getUrlParam('id')
                        this.getdata(pk, (billStatus) => {
                            this.toggleShow(billStatus)
                            //设置一下是否可编辑两个编码
                            let codeedit = this.props.getUrlParam("codeedit")
                            let billnumedit = this.props.getUrlParam("billnumedit")
                            if (status == 'edit') {
                                this.preShowFAndS = this.state.showFAndS
                                this.setState({
                                    showFAndS: false
                                })
                                this.props.form.setFormItemsDisabled(this.formId, { billno: !billnumedit })
                                this.props.form.setFormItemsDisabled("income_baseInfo", { code: !codeedit })
                            }
                            // else {
                            //     this.setDefaultValue();
                            // }
                        });
                    }
                    else {
                        ajax({
                            url: addUrl,
                            data: {},
                            success: res => {
                                Utils.filterEmptyData(res.data.income_baseInfo.rows[0].values);
                                this.props.form.setAllFormValue({ income_baseInfo: res.data.income_baseInfo })

                                this.props.form.setFormItemsValue(formId, { billstatus: { value: '-1', display: this.state.json['10140INCPF-000021'] } })
                                // this.props.form.setFormItemsValue(this.formId,{'destorg':{value:'0',display: this.state.json['10140INCPF-000022']}});/* 国际化处理： 本组织*/
                                this.setState({
                                    showFAndS: false
                                })

                                ajax({
                                    url: queryGroupUrl,
                                    data: {},
                                    success: res => {
                                        this.groupInfo = res.data
                                        if (this.props.getUrlParam('status') == 'add') {
                                            this.props.form.setFormItemsValue(this.formId, { pk_org: { value: this.pfOrg, display: this.pfOrgName } })
                                            this.afterEvent(this.props, this.formId, 'pk_org', { value: 'value' })
                                        }
                                    }
                                })
                            }
                        })

                        this.toggleShow(BillStatus)
                    }
                })
            })
        }
        getMultiLang({ moduleId: '10140INCPF', domainName: 'uapbd', callback })

        let status = this.props.getUrlParam('status');
        if (status != "add") {
            let pk = this.props.getUrlParam('id');
            if (pk && pk != 'undefined') {
                this.getdata(pk);
            }
        }
        else {
            this.setDataValue();
        }
    }

    setDataValue = () => {
        //this.props.form.setFormItemsValue(this.formId,{'pk_org':{value: this.props.CacheTools.get("pk_org"),display:'自由态'}});

        // let businessInfo = getBusinessInfo();
        // let pkGroup = businessInfo.groupId;
        // let grpName = businessInfo.groupName;

        if (this.props.nodeType == 'group') {
            // this.props.form.setFormItemsValue(this.formId,{'pk_org':{value:pkGroup,display:grpName}});
            ajax({
                url: addUrl,
                success: (res) => {
                    this.props.form.setFormItemsValue(this.formId, {
                        'effectdate':
                        {
                            value: res.data.effectDate,
                            display: null
                        }
                    });
                }
            })
        } else {
            //此处暂且先仿照原作者去后台取登录用户集团信息并取form默认值，
            //后续登录用户集团信息应从businessinfo里取，form默认值应再写个action
            ajax({
                url: addUrl,
                success: (res) => {
                    this.props.form.setFormItemsValue(this.formId, {
                        'effectdate':
                        {
                            value: res.data.effectDate,
                            display: null
                        },

                    });
                }
            })
        }
    }

    tableBeforeEvent = (props, moduleId, key, value, index, record, s, line, model) => {

        let status = props.getUrlParam('status');

        let meta = props.meta.getMeta();
        //effectaddmonth   附加月  effectmonth  生效月    accountday  出账日
        //['accountday', 'effectmonth', 'effectaddmonth'].includes(key)  key里面包含这三个值或者任意一个
        if (status != 'browse' && ['accountday', 'effectmonth', 'effectaddmonth'].includes(key)) {
            //getValByKeyAndIndex**<br>(moduleId, index, key)| 根据行序号获取表格某行某个字段值
            //checkdata  固定结账日
            let checkdata = props.cardTable.getValByKeyAndIndex(moduleId, index, 'checkdata');

            if (!checkdata || checkdata.value == null || checkdata.value == '') {
                toast({ content: this.state.json['10140INCPF-000007'], color: 'danger' });/* 国际化处理： 请先填写固定结账日！*/
                return false;
            }
        }
        //起效日期 pk_incomeperiod
        if (key == 'pk_incomeperiod') {
            let pk_incomeperiod = meta[moduleId].items.find((item) => item.attrcode == 'pk_incomeperiod');
            pk_incomeperiod.queryCondition = function () {
                return {
                    pk_org: props.form.getFormItemsValue('income', 'pk_org').value
                }
            }
        }
        //pk_rate 现金折扣
        if (key == 'pk_rate') {
            let pk_rate = meta[moduleId].items.find((item) => item.attrcode == 'pk_rate');
            pk_rate.queryCondition = function () {
                return {
                    pk_org: props.form.getFormItemsValue('income', 'pk_org').value
                }
            }
        }


        props.meta.setMeta(meta);
        return true;
    }

    //通过单据id查询单据信息
    getdata = (pk, callback, speTableIds = []) => {
        let data = { pk };//{pk: "1001A11000000007O0QX"};//
        let retBillStatus = null
        const { billpx } = this.state;
        ajax({
            url: queryCardUrl,
            data,
            success: (res) => {
                //特殊子表的刷新操作
                if (res.data && res.data.bodys && speTableIds.length > 0) {
                    res.data.bodys.forEach((item, index) => {
                        speTableIds.forEach((tableId) => {
                            if (item.hasOwnProperty(tableId)) {
                                this.props.cardTable.setTableData(tableId, res.data.bodys[index][tableId])
                            }
                            else {
                                this.props.cardTable.setTableData(tableId, { rows: [] })
                            }
                        })
                    })

                    return
                }


                if (res.data && res.data.head) {
                    let formData = {
                        [this.formId]: res.data.head[this.formId],
                        "income_baseInfo": res.data['incomeBaseInfo']['income_baseInfo']
                    }
                    this.props.form.setAllFormValue(formData)
                    //卡片修改保存时，保存成功后，需要调用updateCache方法，将数据更新到缓存中
                    //放入缓存
                    updateCache(pk_item, res.data.head[formId].rows[0].values[pk_item].value, res.data, formId, dataSource);

                    retBillStatus = res.data.head[formId].rows[0].values.billstatus.value
                    //新增=1,修改=2,启用=3,停用=4
                    //特使控制一下是否显示财务信息以及采购信息两个子表的数据
                    // res.data.head[formId].rows[0].values  res.data里面formId=XX的head的第一行数据的值
                    let applyType = res.data.head[formId].rows[0].values.apply_type.value
                    //showFAndS  它的值为true 或者false
                    let showFAndS = applyType != 2 && applyType != 3 && applyType != 4
                    let showOrgOrSup = showFAndS
                    if (this.props.getUrlParam('status') == 'edit') {
                        showFAndS = false
                    }
                    //设置一下审批详情组件所需的组件
                    this.preShowFAndS = showFAndS
                    this.setState({
                        billno: res.data.head[formId].rows[0].values['billno'].value,
                        billId: res.data.head[formId].rows[0].values[pk_item].value,
                        showFAndS: showFAndS,
                        applyType: applyType	//在银行账户两个界面当中根据这个字段判定是否允许修改
                    })
                    //特殊控制一下， 根据申请类型决定显示那些字段
                    this.props.form.setItemsVisible(formId, { 'destorg': showOrgOrSup, 'update_inc': !showOrgOrSup })

                    //特殊设置一下，将申请类型保存下来，方便上传附件的时候做判定
                    this.applyType = applyType

                    //特殊控制一下，申请类型字段只有在新增的时候能够编辑
                    this.props.form.setFormItemsDisabled(formId, { apply_type: true })
                }
                if (res.data && res.data.bodys) {
                    res.data.bodys.forEach((item, index) => {
                        tableIds.forEach((tableId) => {
                            if (item.hasOwnProperty(tableId)) {
                                this.props.cardTable.setTableData(tableId, res.data.bodys[index][tableId])
                            }
                            else {
                                this.props.cardTable.setTableData(tableId, { rows: [] })
                            }
                        })
                    })

                    tableIds.forEach(tableId => {
                        let isSet = false
                        res.data.bodys.forEach((item, index) => {
                            if (item.hasOwnProperty(tableId)) {
                                isSet = true
                                this.props.cardTable.setTableData(tableId, res.data.bodys[index][tableId])
                            }
                        })
                        if (!isSet) {
                            this.props.cardTable.setTableData(tableId, { rows: [] })
                        }
                    })
                }
                else {
                    tableIds.forEach((tableId) => {
                        this.props.cardTable.setTableData(tableId, { rows: null })
                    })
                }

                let dealObj = {
                    [formId]: 'form',
                    "income_baseInfo": 'form'
                }
                tableIds.forEach(id => {
                    dealObj.id = 'cardTable'
                })
                if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                    this.props.dealFormulamsg(
                        res.formulamsg, dealObj
                    )
                }
                if (callback && typeof callback == 'function') {
                    callback.call(this, retBillStatus)
                }
            }
        });
    }

    setDefaultValue = (orgInfo) => {
        this.props.form.setFormItemsValue(this.formId, { 'bill_status': { value: '0', display: this.state.json['10140INCPF-000021'] } });/* 国际化处理： 自由态*/
        //this.props.form.setFormItemsValue(this.formId,{'vgoalorg':{value:'0',display: this.state.json['10140INCPF-000022']}});/* 国际化处理： 本组织*/
        if (orgInfo) {
            this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value: orgInfo.pk_org, display: orgInfo.orgName } });
            this.afterEvent(this.props, this.formId, 'pk_org', { value: orgInfo.pk_org, display: orgInfo.orgName })
        }

    }

    // getTime(effectdate){
    //     props.form.setFormItemsValue(baseform,{'effectdate':{value:effectDate,display:effectDate}})
    // }
    // getTime = (effectdate)=>{
    //     props.form.setFormItemsValue(baseform,{'effectdate':{value:effectDate,display:effectDate}})
    // }


    pfProcess(url) {
        let data = null
        let finalData = []
        finalData.push(this.props.getUrlParam('id'))
        if (url == commitUrl) {
            data = {
                pks: finalData,
                content: null
            }

        }
        else {
            data = finalData

        }
        ajax({
            url,
            data: data,
            success: res => {
                if (res && res.data) {
                    toast({ color: 'danger', content: res.data })
                }
                else {
                    let billStatus = this.getdata(this.props.getUrlParam('id'))
                    this.toggleShow(billStatus)
                    toast({ color: 'success', content: this.state.json['10140INCPF-000049'] });/* 国际化处理： 收回成功！*/
                }

            }
        })
    }


    updateSpeTableBtnStatus(billstatus = -1, mainFormStatus = 'browse', speTableStatus = { finance: 'browse', purchase: 'browse' }) {
        let speBtnObj = {}
        speTableIds.forEach((item, index) => {
            let tableStatus = speTableStatus[item]
            if (mainFormStatus == 'edit' || mainFormStatus == 'add' || billstatus != -1) {
                speBtnObj[`${speTableBtnPre[index]}Edit`] = false
                speBtnObj[`${speTableBtnPre[index]}Save`] = false
                speBtnObj[`${speTableBtnPre[index]}Cancel`] = false
                speBtnObj[`${speTableBtnPre[index]}Refresh`] = false
            }
            else if (tableStatus == 'edit' || tableStatus == 'add') {
                speBtnObj[`${speTableBtnPre[index]}Edit`] = false
                speBtnObj[`${speTableBtnPre[index]}Save `] = true
                speBtnObj[`${speTableBtnPre[index]}Cancel`] = true
                speBtnObj[`${speTableBtnPre[index]}Refresh`] = false
            }
            else {
                speBtnObj[`${speTableBtnPre[index]}Edit`] = true
                speBtnObj[`${speTableBtnPre[index]}Save`] = false
                speBtnObj[`${speTableBtnPre[index]}Cancel`] = false
                speBtnObj[`${speTableBtnPre[index]}Refresh`] = true
            }
        })
        this.props.button.setButtonVisible(speBtnObj);
    }

    buttonClick = (props, id) => {
        let _this = this;
        switch (id) {
            case 'Add':
                //EmptyAllFormValue**(moduleId)| 清空表单所有数据
                props.form.EmptyAllFormValue(this.formId)
                props.form.EmptyAllFormValue('income_baseInfo')
                // setFormStatus**(moduleId, status)| 设置表单状态 
                props.form.setFormStatus(this.formId, 'add')
                props.form.setFormStatus('income_baseInfo', 'add')
                //setTableData |设置表格数据
                setTimeout(() => props.cardTable.setTableData('incomech', { rows: [] }), 1)
                let data = {}
                this.setState({
                    showFAndS: false
                }, () => {
                    ajax({
                        url: addUrl,
                        data: data,
                        success: res => {
                            Utils.filterEmptyData(res.data.income_baseInfo.rows[0].values);
                            this.props.form.setAllFormValue({ income_baseInfo: res.data.income_baseInfo })
                            //setItemsVisible**(moduleId,values)  设置表单某些字段的显隐性(新方法)
                            this.props.form.setItemsVisible(formId, { applyType: false })
                            this.props.form.setFormItemsValue(formId, { billstatus: { value: '-1', display: this.state.json['10140INCPF-000021'] } })
                            this.props.form.setFormItemsValue(this.formId, { pk_org: { value: this.pfOrg, display: this.pfOrgName } })
                            this.afterEvent(this.props, this.formId, 'pk_org', { value: 'value' })
                        }
                    })
                })

                props.pushTo('/card', {
                    pagecode: pageId,
                    status: 'add'
                })
                this.toggleShow()
                this.preShowFAndS = this.state.showFAndS

                //设置下使申请类型字段可编辑
                // this.props.form.setFormItemsDisabled(formId, { apply_type: false })
                // this.props.form.setFormItemsValue(baseform, { 'effectdate': { value: date, display: date } });
                // getTime = (effectdate)=>{
                //     props.form.setFormItemsValue(baseform,{'effectdate':{value:effectDate,display:effectDate}})
                // }
                this.setDataValue();
                break;
            case 'Edit':
                //getUrlParam**(pop) | 获取页面参数
                let primaryKey = props.getUrlParam('id')
                //setFormItemsDisabled**(moduleId,values)| 设置表单某些字段的编辑性 | moduleId  页面对应区域名 String ;<br> values 键值对 Object  | - | setFormItemsDisabled('formid',{'name':true,'sex':false) | -
                this.props.form.setFormItemsDisabled(formId, { apply_type: true })
                ajax({
                    url: checkDataPermUrl,
                    data: { pks: [primaryKey] },
                    success: (res) => {
                        props.pushTo('/card', {
                            pagecode: pageId,
                            status: 'edit',
                            id: props.getUrlParam('id')
                        })
                        this.toggleShow()

                        //根据返回的数据设置一下两个编码是否可编辑
                        if (res.data) {
                            this.props.form.setFormItemsDisabled(this.formId, { billno: !res.data.billnumedit })
                            this.props.form.setFormItemsDisabled("income_baseInfo", { code: !res.data.codeedit })
                        }
                        //特殊设置一下返回按钮的可见性
                        this.preShowFAndS = this.state.showFAndS
                        this.setState({
                            showFAndS: false
                        })
                        this.props.form.setFormItemsDisabled(formId, { update_inc: false })
                        //同时设置一下修改收款字段的参照过滤条件
                        let meta = this.props.meta.getMeta()
                        let orgValue = this.props.form.getFormItemsValue(formId, 'pk_org')
                        //find()在一个页面中搜索指定的字符串.
                        meta[formId].items.find(item => item.attrcode == 'update_inc').queryCondition = () => {
                            return {
                                pk_org: orgValue.value
                            }
                        }
                    }
                })
                break;
            case 'Save':
                this.saveClick(props)
                break;
            case 'Delete':
                //props.modal.show('delete')
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10140INCPF-000023'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
                    content: this.state.json['10140INCPF-000024'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
                    noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    beSureBtnName: this.state.json['10140INCPF-000010'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                    cancelBtnName: this.state.json['10140INCPF-000011'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                    beSureBtnClick: this.delConfirm.bind(this)   // 确定按钮点击调用函数,非必输
                })
                break
            case 'Back':
                props.pushTo('/list', {
                    pagecode: '10140INCPF_list',
                })
                break;
            case 'Refresh':
                this.getdata(this.props.getUrlParam('id'), () => {
                    toast({ content: this.state.json['10140INCPF-000025'], color: 'success' });/* 国际化处理： 刷新成功*/
                })
                break

            case 'Commit':
                //getFormItemsValue**(moduleId,keys)| 获取表单某些字段的值
                let tsValue = this.props.form.getFormItemsValue(formId, 'ts')
                //getUrlParam**(pop) | 获取页面参数
                let tempPk = this.props.getUrlParam('id')
                let tss = {}
                //
                tss[tempPk] = tsValue.value
                ajax({
                    url: commitUrl,
                    data: { content: null, pks: [this.props.getUrlParam('id')], tss },
                    success: res => {
                        if (res.data && res.data.workflow && (res.data.workflow == 'approveflow')) {
                            this.setState({
                                compositedata: res.data,
                                compositedisplay: true
                            });
                        } else if (res.data) {
                            //提交即通过的时候，如果异常信息不为空，那么提示该异常信息
                            toast({ color: 'warning', content: res.data })
                            return
                        }
                        else {
                            toast({ color: 'success', content: this.state.json['10140INCPF-000026'] });/* 国际化处理： 提交成功*/
                            //根据单据id获取单据数据
                            this.getdata(this.props.getUrlParam("id"), (billStatus) => {
                                this.toggleShow(billStatus)
                            })
                        }
                    }
                })
                break
            case 'Callback':
                this.pfProcess(callbackUrl)
                break;
            case 'Cancel':
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: "请注意",                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
                    content: "是否确认要取消",             // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
                    noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                    cancelBtnName: "取消",           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                    beSureBtnClick: this.onCancelSureClick.bind(this)   // 确定按钮点击调用函数,非必输
                })
                break;
            case 'ApprDetail':
                this.setState({
                    showApprInfo: true
                })
                break;
            case 'BankAddLine':
                // props.cardTable.addRow('incomech')
                //getNumberOfRows**(moduleId, flag) | 根据id获取表格中所有(可见)的行的数量 
                let rowNum = props.cardTable.getNumberOfRows(this.tableId);
                props.cardTable.addRow(this.tableId, rowNum, { 'showorder': { display: '', value: rowNum + 1 + '' } }, false);
                break;
            case 'Print':
                this.output('print')
                break;
            case 'Output':
                let pks = [];
                pks.push(this.props.getUrlParam('id'))
                this.setState({
                    pks
                }, () => {
                    this.refs.printOutput.open()
                })
                break;
            case 'Attach': //附件
                this.setState({
                    showUploader: true
                })
                break

        }
    }

    //切换页面状态
    toggleShow(billStatus = -1, fiStatus = 'browse', purStatus = 'browse', applyType = 1, onlyAdd = false) {
        let status = this.props.getUrlParam('status');
        let isPortal = this.props.getUrlParam('portal')
        status = status == 'add' || status == 'edit' ? 'edit' : 'browse'

        //此处取约定参数决定是否显示所有按钮
        let hideAllButtons = this.props.getUrlParam('hideButton')
        if (hideAllButtons) {
            this.props.button.setButtonVisible(['Add', 'Edit', 'Delete', 'Commit', 'Callback', 'Attach', 'ApprDetail', 'Save', 'Cancel', 'Print', 'Output', 'Refresh', 'BankAddLine', 'Delline'], false)
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        }
        else if (isPortal) {
            this.props.button.setButtonVisible(['Refresh', 'Attach', 'Delline'], true)
            this.props.button.setButtonVisible(['Add', 'Edit', 'Delete', 'Commit', 'Callback', 'ApprDetail', 'Save', 'Cancel', 'Print', 'Output', 'BankAddLine'], false)
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
            this.setState({
                backVisible: false
            })
        }
        else {
            let visibleAction = []
            let unVisibleAction = []
            if (onlyAdd) {
                visibleAction = ['Add']
                unVisibleAction = ['Edit', 'Delete', 'Commit', 'Callback', 'Attach', 'ApprDetail', 'Bankacc', 'Save', 'Cancel', 'Print', 'Output', 'Refresh', 'BankAddLine']
            }
            else if (status == 'edit' || status == 'add') {
                visibleAction = ['Save', 'Cancel', 'Delline']
                unVisibleAction = ['Edit', 'Add', 'back', 'Delete', 'Refresh', 'Commit', 'Callback', 'Bankacc', 'Attach', 'ApprDetail', 'Print', 'Output']
                if (applyType == 3 || applyType == 4) {
                    unVisibleAction.push('BankAddLine')
                }
                else {
                    visibleAction.push('BankAddLine')
                }
                this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
            } else {
                let disableActionSet = []
                let totalValue = this._constructVisibleButton(billStatus)
                visibleAction = totalValue[0]
                unVisibleAction = totalValue[1]
                disableActionSet = totalValue[2]

                this.props.button.setButtonDisabled(disableActionSet)
                this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
            }
            this.props.button.setButtonVisible(visibleAction, true);
            this.props.button.setButtonVisible(unVisibleAction, false);
        }

        //控制form以及子表的可编辑性
        this._controlEditalbe()

        //控制返回按钮的可见性
        this.setState({
            backVisible: status == 'browse' && !hideAllButtons && !isPortal
        })

        //添加浏览器窗口关闭监听事件
        if (status != 'add' && status != "edit") {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    };

    _controlEditalbe() {
        let status = this.props.getUrlParam('status');
        //status = status == 'add' || status == 'edit' ? 'edit' : 'browse'
        setTimeout(() => this.props.form.setFormStatus(formId, status), 1);
        setTimeout(() => this.props.form.setFormStatus('income_baseInfo', status), 1)
        tableIds.forEach(item => {
            //财务和采购信息两个子表需要特殊控制--新增态不可编辑
            if (item !== 'finance' && item != 'purchase') {
                this.props.cardTable.setStatus(item, status);
            }
            else {
                if (status == 'add') {
                    this.props.cardTable.toggleCardTable(['purchase', 'finance'], false)
                }
            }
        })
    }

    _constructVisibleButton(billStatus = -1) {
        //根据单据状态设置一下按钮状态
        let visibleAction = []
        let unVisibleAction = []
        let disableActionSet = {}

        if (billStatus == -1) {	//自由态
            visibleAction = ['Add', 'Edit', 'Delete', 'back', 'Refresh', 'Commit', 'Callback', 'Bankacc', 'ApprDetail', 'Attach', 'Print', 'Output']
            unVisibleAction = ['Callback', 'ApprDetail', 'Save', 'Cancel', 'BankAddLine']
            disableActionSet = {
                Commit: false,
                Edit: false,
                Delete: false,
                Bankacc: false,
                Callback: true,
                ApprDetail: true
            }
        }
        else if (billStatus == 3) {	//提交态
            visibleAction = ['Add', 'Delete', 'back', 'Refresh', 'Commit', 'Callback', 'Attach', 'Print', 'Output', 'ApprDetail']
            unVisibleAction = ['Save', 'Edit', 'Cancel', 'Bankacc', 'BankAddLine']
            disableActionSet = {
                Commit: true,
                Edit: false,
                Delete: false,
                Bankacc: false,
                Callback: false,
                ApprDetail: false
            }
        }
        else {
            visibleAction = ['Add', 'back', 'Refresh', 'Commit', 'Callback', 'ApprDetail', 'Attach', 'Print', 'Output']
            unVisibleAction = ['Edit', 'Delete', 'Bankacc', 'Save', 'Cancel', 'BankAddLine']
            disableActionSet = {
                Commit: true,
                Edit: true,
                Delete: true,
                Bankacc: true,
                Callback: true,
                ApprDetail: false
            }
        }

        //特殊处理一下审批通过——收回按钮可用
        if (billStatus == 1 || billStatus == 3) {
            visibleAction.push('Callback')
        }
        else {
            unVisibleAction.push('Callback')
        }
        if (billStatus == 1) {
            disableActionSet.Callback = false
        }

        return [visibleAction, unVisibleAction, disableActionSet]
    }

    output(type = '') {
        let pks = [];
        pks.push(this.props.getUrlParam('id'))
        //原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
        if (type != '') {
            //打印
            print(
                'pdf',
                printUrl,
                {
                    funcode:/*this.props.config.funcode*/'10140INCPF',     //功能节点编码
                    nodekey: 'incomecard',     //模板节点标识
                    oids: pks,
                    outputType: type
                }
            )
        }
    }


    pageInfoClick = (props, pk) => {
        this.getDataForCache(pk)
    }

    afterEvent(props, moduleId, key, value, oldValue) {
        //新增一段业务逻辑：修改，停启用也走申请单，加了两个字段，申请类型以及修改申请单
        //当修改类型不是新增的时候，显示修改收款协议字段，并且加载相应的收款信息到界面上来
        if (key == 'apply_type') {
            //重新切换回新增的时候，重新构建一下新增的数据
            //新增=1,修改=2,启用=3,停用=4
            //如果是申请类型有新增改为其他类型，那么需要将原有的收款协议基本信息当中的编码退掉
            if ((oldValue.value == 1 || oldValue.value == '') && value.value != '' && value.value != 1 && this.incCode) {
                this.props.form.setFormItemsValue(formId, { "destorg": { value: null, display: null } })
                let orgValue = this.props.form.getFormItemsValue('income_baseInfo', 'pk_org')
                ajax({
                    url: exFieldUrl,
                    data: { operation: 'rollbackincCode', incCode: this.incCode, pk_org: orgValue.value }
                })
            }
            else if ((value.value == 1 || value.value == '') && oldValue.value != '' && oldValue.value != 1) {
                this.props.form.setFormItemsValue(formId, { "update_inc": { value: null, display: null } })
                this.props.form.setFormItemsValue(formId, { "destorg": { value: null, display: null } })
                this.props.table.setAllTableData(tableId, { rows: [] })
                let orgValue = this.props.form.getFormItemsValue(formId, 'pk_org')
                ajax({
                    url: exFieldUrl,
                    data: { operation: 'applyTypeAdd', pk_org: orgValue.value },
                    success: res => {
                        if (res.success && res.data) {
                            this.incCode = res.data.incCode
                            this.hasincCode = res.data.hasincCode
                            this.props.form.setAllFormValue({ income_baseInfo: res.data.baseInfo.income_baseInfo })
                            this.props.form.setFormItemsValue('income_baseInfo', { code: { value: res.data.incCode, display: res.data.incCode } })
                        }
                    }
                })
            }

            //设置修改收款协议字段可见性

            this.props.form.setItemsVisible(formId,
                {
                    //update_inc 修改收款协议
                    //destorg 目的组织
                    "update_inc": value.value && value.value != 1,
                    "destorg": !value.value || value.value == 1
                }
            )
            //当为新增的时候 update_inc 修改收款协议 为禁用
            //setFormItemsDisabled**(moduleId,values)| 设置表单某些字段的编辑性
            this.props.form.setFormItemsDisabled(formId, {
                "update_inc": value.value && value.value == 1
            })
            //设置一下修改收款协议以及目的组织两个字段是否必输
            let isdestorgEditable = value.value && value.value == 1
            let isUpdateSupEditable = value.value && value.value != 1

            //setFormItemsRequired(moduleId, values) | 设置表单某些字段的必输性
            this.props.form.setFormItemsRequired(formId, {
                "update_inc": isUpdateSupEditable,
                "destorg": isdestorgEditable
            })
            if (value.value == 3 || value.value == 4) {
                this.props.form.setFormStatus('income_baseInfo', 'browse')
                tableIds.forEach(item => {
                    this.props.cardTable.setStatus(item, 'browse')
                })

                //设置一下账期不能新增
                this.props.button.setButtonVisible(['BankAddLine'], false)
            }
            else if (value.value == 1 || value.value == 2) {
                this.props.form.setFormStatus('income_baseInfo', 'edit')
                let nApplTypeEditTableIds = ['incomech']
                nApplTypeEditTableIds.forEach(item => {
                    this.props.cardTable.setStatus(item, 'edit')
                })
                this.props.button.setButtonVisible(['BankAddLine'], true)
            }

        }
        else if (key == 'update_inc') {
            //加个判定，修改收款协议如果为空的话，那么就不请求后台了
            //trim() 方法用于删除字符串的头尾空格。
            if (value.value == null || value.value == '' || value.value.trim() == '') {
                return
            }
            //获取相关收款的数据并且展示到界面上
            let requestData = {
                operation: 'updateincome',
                pk_income: value.value
            }
            ajax({
                url: exFieldUrl,
                data: requestData,
                success: res => {
                    if (res.data && res.data.head) {
                        let formData = {
                            //这儿就不设置incomePfVO的数据了，因为从收款来的数据没有这些数据，这部分应该由客户填写
                            "income_baseInfo": res.data['incomeBaseInfo']['income_baseInfo']
                        }
                        this.props.form.setAllFormValue(formData)
                    }
                    if (res.data && res.data.bodys) {
                        tableIds.forEach(tableId => {
                            let isSet = false
                            res.data.bodys.forEach((item, index) => {
                                //hasOwnProperty 判断自身属性是否存在
                                if (item.hasOwnProperty(tableId)) {
                                    isSet = true
                                    this.props.cardTable.setTableData(tableId, res.data.bodys[index][tableId])
                                }
                            })
                            if (!isSet) {
                                this.props.cardTable.setTableData(tableId, { rows: [] })
                            }
                        })
                    }
                    else {
                        tableIds.forEach((tableId) => {
                            this.props.cardTable.setTableData(tableId, { rows: null })
                        })
                    }
                },
                error: (res) => {
                    toast({ color: 'dange', content: res.message })
                    this.props.form.setFormItemsValue(formId, { update_inc: { value: '', display: '' } })
                }
            })
        }
        let goalOrg = props.form.getFormItemsValue(this.formId, 'destorg')
        //所属组织
        let belongedOrg = props.form.getFormItemsValue(this.formId, 'pk_org')
        //    let  belongedGroup = props.form.getFormItemsValue(this.formId,'pk_org')
        if ((key == 'destorg' || key == 'pk_org') && moduleId == 'sminfoPf' && value.value && goalOrg.value) {
            if (goalOrg.value == 1) {
                //集团
                belongedOrg = this.groupInfo


            }
            else if (goalOrg.value == 2) {
                belongedOrg = {
                    value: 'GLOBLE00000000000000',
                    display: "全局"/* 国际化处理： 全局*/
                }
            }
            props.form.setFormItemsValue('income_baseInfo', { "pk_org": belongedOrg })

            //记录一下上次选择的组织，下次自动带出
            this.lastOrg = value.value
            this.lastOrgName = value.display

            //四个字段需要根据收款协议基本信息的pk_org字段进行参照
            let meta = this.props.meta.getMeta()

            //修改收款协议的修改，停启用走申请单 -- 修改收款协议字段需要根据组织进行过滤
            // update_inc 修改收款协议
            if (key == 'pk_org') {
                meta[formId].items.find(item => item.attrcode == 'update_inc').queryCondition = () => {
                    return {
                        pk_org: belongedOrg.value
                    }
                }
            }
            this.props.meta.setMeta(meta)
        }
        if (key == 'pk_org' && moduleId == 'sminfoPf') {
            let pk_org = belongedOrg
            setDefData('lastPkOrg', dataSource, pk_org)
            ajax({
                url: exFieldUrl,
                data: {
                    pk_org: pk_org.value,
                    operation: 'getCode',
                    preCode: this.billcode
                },
                success: res => {
                    //将获取到的单据编码以及相关组织记录到this当中
                    //避免用户将组织或者单据编码删掉之后回退单据编码时出问题
                    let tempMeta = this.props.meta.getMeta()
                    let tempItem = tempMeta["sminfoPf"].items.find(item => item.attrcode == 'billno')
                    let disabled = tempItem.disabled;

                    this.billcode = res.data.code
                    this.pk_org = pk_org.value
                    this.hasPreCode = res.data.hasPreCode
                    let tempCode = res.data.code ? res.data.code : ''
                    tempCode = res.data.hasAfCode ? '1' : tempCode
                    let billCodeEditable = res.data.editable && !res.data.hasAfCode
                    this.props.form.setFormItemsValue('sminfoPf', { billno: { value: tempCode, display: res.data.hasAfCode ? ' ' : tempCode } })
                    this.props.form.setFormItemsDisabled('sminfoPf', { billno: !billCodeEditable || disabled })


                    tempItem = tempMeta["income_baseInfo"].items.find(item => item.attrcode == 'code')
                    disabled = tempItem.disabled;
                    if (res.data.incCode) {
                        this.props.form.setFormItemsValue("income_baseInfo", { code: { value: res.data.incCode, display: res.data.incCode } })
                        this.props.form.setFormItemsDisabled("income_baseInfo", { code: !res.data.codeEditable || disabled })
                        if (res.data.hasincCode) {
                            this.incCode = res.data.incCode
                            this.hasincCode = res.data.hasincCode
                        }
                    }
                }
                // this.pfOrg = value.value
                // this.pfOrgName = value.refname || value.display
            })
        }

    }

    //// 附件的关闭点击
    onHideUploader = () => {
        this.setState({
            showUploader: false
        })
    }

    beforeUpload(billId, fullPath, file, fileList) {
        //getFormItemsValue**(moduleId,keys)| 获取表单某些字段的值
        let billStatus = this.props.form.getFormItemsValue(formId, 'billstatus')
        //停用和启用类型不允许上传附件
        if (this.applyType != '' && this.applyType != 1 && this.applyType != 2) {
            //"10140INCPF-000016": "启用和停用申请单不允许编辑附件！",
            toast({ color: 'warning', content: this.state.json['10140INCPF-000016'] })
            return false
        }
        if (billStatus.value != -1) {
            // "10140INCPF-000015": "流程中单据不允许上传附件！",
            toast({ color: 'warning', content: this.state.json['10140INCPF-000015'] })
            return false
        }
        return true
        // 备注： return false 不执行上传  return true 执行上传
    }

    beforeDelete() {
        if (this.state.applyType != '' && this.state.applyType != 1 && this.state.applyType != 2) {
            return false
        }
        return true
    }


    //保存单据
    saveClick = (props) => {
        let url = saveUrl;//新增保存
        if (this.props.getUrlParam('status') === 'edit') {
            url = updateUrl;//修改保存
        }
        let finalData = {}
        let mainFormData = props.form.getAllFormValue(this.formId)
        let baseInfoData = props.form.getAllFormValue('income_baseInfo')
        if (baseInfoData.rows[0].values.hasOwnProperty('status'))
            delete baseInfoData.rows[0].values.status
        finalData.incomePfVO = mainFormData
        finalData.incomeVO = baseInfoData
        tableIds.forEach(item => {
            //相当于给子表  finalData[item] 相当于  finalData.子表名称
            finalData[item] = props.cardTable.getAllRows(item)
        })

        //加个判定，校验一下收款协议表头信息
        if (!this.props.form.isCheckNow(this.formId)) {
            //setFormStatus(moduleId, status) | 设置表单状态
            //  props.form.setFormStatus(this.formId, 'add')
            //  props.form.setFormStatus('income_baseInfo', 'add')
            return
        }
        //判定，校验子表
        if (!this.props.cardTable.checkTableRequired(tableId)) {
            //accrate 收款比例    pk_incomeperiod  起效日期    pk_balatype  结算方式
            return
        }

        //加个判定字段不能为空
        let appType = this.props.form.getFormItemsValue(formId, 'apply_type')
        let updInc = this.props.form.getFormItemsValue(formId, 'update_inc')

        if (appType.value != '' && appType.value != 1 && updInc.value == '') {
            toast({ color: 'danger', content: this.state.json['10140INCPF-000018'] + ": " + this.state.json['10140INCPF-000020'] })
            return
        }

        //收款协议基本信息校验
        let baseInfoMeta = this.props.meta.getMeta()
        baseInfoMeta = baseInfoMeta.income_baseInfo.items

        let emtpyNesItems = []
        baseInfoMeta.forEach(item => {
            if (item.required == true) {
                if (baseInfoData.rows[0].values[item.attrcode].value == null || baseInfoData.rows[0].values[item.attrcode].value == '') {
                    emtpyNesItems.push(item.label)
                }
            }
        })

        let afterInsertToastInfo = null
        if (emtpyNesItems.length > 0) {
            afterInsertToastInfo = `${this.state.json['10140INCPF-000041']}，${this.state.json['10140INCPF-000042']}:\n${this.state.json['10140INCPF-000018']}:\n[${emtpyNesItems.join('],[')}]`/* 国际化处理： 收款协议基本信息校验失败,详细信息如下,下列字段值不能为空*/
            mainFormData.rows[0].values.memo.value = afterInsertToastInfo
        }
        else {
            // 所有信息都已经录入，清除异常信息字段
            mainFormData.rows[0].values.memo.value = null
        }

        finalData.hasPreincCode = this.hasincCode



        let tableTypeMap = {}
        tableIds.forEach(id => {
            tableTypeMap.id = 'cardTable'
        })



        //*createMasterChildData**(pagecode, headid, bodyid) | 获取主子表单据数据
        // let CardData = this.props.createMasterChildData(pageId, this.formId, tableIds);
        let incomeBaseInfo = this.props.form.getAllFormValue("income_baseInfo")
        let CardData = this.props.createMasterChildData(this.props.pagecode_card, this.formId, this.tableId);
        incomeBaseInfo["areacode"] = 'income_baseInfo'

        //validateToSave 保存时执行的验证公式
        // data 单据数据 必输
        // tableTypeObj 界面上所有表格的类型 必输
        // callback 点击确认的时候执行的自定义回调 非必输 -----执行原来的保存逻辑
        // billType 单据类型 非必输

        this.props.validateToSave({
            model: incomeBaseInfo,
            pageid: pageId,
        }, () => {
            this.props.validateToSave(CardData, () => {
                ajax({
                    url: url,
                    data: finalData,
                    success: (res) => {
                        props.pushTo('/card', {
                            pagecode: pageId,
                            status: 'browse',
                            id: res.data
                        })
                        if (url == saveUrl) {
                            addCache(res.data, res.data, this.formId, dataSource, res.data)
                        }
                        // this.bankaccConfig.mainPk = res.data
                        let BillStatus = this.getdata(res.data)
                        this.toggleShow(BillStatus, 'browse', 'browse')
                        // this.updateSpeTableBtnStatus(BillStatus) 	//更新财务采购两个子表的按钮状态
                        this.setState({
                            showFAndS: this.preShowFAndS
                        })

                        //业务参数设置当中允许违反规则校验并且必输项未填的话，成功保存之后需要在界面上展示一下提示信息
                        if (afterInsertToastInfo) {
                            toast({ color: 'warning', content: afterInsertToastInfo })
                        }
                        else {
                            toast({ color: 'success', title: this.state.json['10140INCPF-000032'] })/* 国际化处理： 保存成功！*/
                        }

                        //清除有关于收款协议基本信息编码的信息
                        this.incCode = null
                        this.hasincCode = false
                    }
                })
            }, tableTypeMap, 'extcard')
        }, { "income_baseInfo": 'form' }, 'form')
    }

    //确定取消
    onCancelSureClick() {
        let status = this.props.getUrlParam('status');
        if (status == 'add') {
            if (this.billcode != null && this.hasPreCode) {
                ajax({
                    url: exFieldUrl,
                    data: {
                        operation: "cancelCode",
                        pk_org: this.pk_org,
                        billCode: this.billcode,
                        incCode: this.incCode
                    },
                    success: res => {
                        this.billCode = null
                        this.incCode = null
                    }
                })
            }
        }
        if (this.props.getUrlParam('status') === 'add') {
            //卡片上点击新增按钮后，未保存，又点了取消按钮, 则需调用方法getCurrentLastId，获取当前列表最后一条数据渲染界面
            let pk = getCurrentLastId(dataSource);
            if (pk) {
                this.props.pushTo("/card", {
                    pagecode: pageId,
                    status: 'browse',
                    id: pk
                })
                this.getDataForCache(pk)
            }
            else {
                window.onbeforeunload = null;	//特殊修正一下：列表无数据新增，取消返回列表，然后点击关闭会有关闭提示
                //清空所有数据
                this.props.form.EmptyAllFormValue(formId)
                this.props.form.EmptyAllFormValue("income_baseInfo")
                tableIds.forEach(id => {
                    this.props.cardTable.setTableData(id, { rows: [] })
                })
                this.props.setUrlParam({ 'status': 'browse' })
                setTimeout(() => this.props.form.setFormStatus(formId, 'browse'), 1)
                setTimeout(() => this.props.form.setFormStatus("income_baseInfo", 'browse'), 1)
                setTimeout(() => {
                    tableIds.forEach(id => {
                        this.props.cardTable.setStatus(id, 'browse')
                    })
                }, 1)
                this.toggleShow(-1, true, true, 1, true) //只显示新增按钮
            }
            this.incCode = null
            this.hasincCode = false
        }
        else if ((this.props.getUrlParam('status') === 'edit')) {
            this.props.form.cancel([this.formId, 'income_baseInfo'])
            this.props.pushTo('/card', {
                pagecode: pageId,
                status: 'browse',
                id: this.props.getUrlParam('id')
            })

            this.toggleShow(-1, true, true);
        }

        this.props.form.setFormItemsDisabled(formId, { update_sup: true })
    }


    //删除单据
    delConfirm = () => {
        let primaryKeys = []
        //push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
        primaryKeys.push(this.props.getUrlParam('id'))
        ajax({
            url: deleteUrl,
            data: { primaryKeys: primaryKeys },
            success: res => {
                let id = this.props.getUrlParam("id");
                //卡片删除数据时，删除成功后，先通过getNextId获取下条数据的主键
                let nextId = getNextId(id, dataSource);
                //删除列表表格数据时，删除成功后，需要调用平台方法deleteCacheId,
                deleteCacheById(pk_item, id, dataSource);
                this.getDataForCache(nextId, () => {
                    toast({ color: 'success', title: this.state.json['10140INCPF-000033'] })/* 国际化处理： 删除成功！*/
                })
            }
        })
    };


    getAssginUsedr = (value) => {
        ajax({
            url: commitUrl,
            data: { content: value, info: [{ id: this.props.getUrlParam('id') }] },
            success: (res) => {
                if (res.data.workflow && (res.data.workflow == 'approveflow')) {
                    this.setState({
                        compositedata: res.data,
                        compositedisplay: true
                    });
                } else {
                    if (res.data instanceof Array) {
                        this.getData(this.props.getUrlParam("status"), this.props.getUrlParam("id"), true);
                        this.setState({
                            compositedata: null,
                            compositedisplay: false
                        });
                        toast({ color: 'success', content: this.state.json['10140INCPF-000026'] });/* 国际化处理： 提交成功*/
                    } else {
                        toast({ color: 'warning', content: res.data });
                    }
                }
            }
        })
    }

    onApprTransClose = () => {
        this.setState({
            compositedata: null,
            compositedisplay: false
        });
    }

    getDataForCache(pk, callback) {
        if (!pk) {
            //如果pk为空，清空formId的值，并遍历子表给子表赋值为空
            //EmptyAllFormValue**(moduleId)| 清空表单所有数据
            this.props.form.EmptyAllFormValue(this.formId)
            tableIds.forEach((tableId) => {
                //setTableData |设置表格数据  
                this.props.cardTable.setTableData(tableId, { rows: [] })
            })
            return
        }

        let cardData = getCacheById(pk, dataSource);
        //自由=-1
        let BillStatus = -1
        if (cardData) {
            let formData = {
                [this.formId]: cardData.head[this.formId],
                "income_baseInfo": cardData['incomeBaseInfo']['income_baseInfo']
            }
            //setAllFormValue**(data)| 设置表单数据 | data表单数据对象 Object
            this.props.form.setAllFormValue(formData)
            if (cardData.bodys) {
                //tableIds  子表
                tableIds.forEach(tableId => {
                    let isSet = false
                    cardData.bodys.forEach((item, index) => {
                        if (item.hasOwnProperty(tableId)) {
                            isSet = true
                            //setTableData**(moduleId, data, callback, isCache，isTop)| 设置表格数据 | data  渲染数据
                            //setTimeout 设置一个定时器 在1秒后去渲染 数据
                            setTimeout(() => this.props.cardTable.setTableData(tableId, cardData.bodys[index][tableId]), 1)
                        }
                    })

                    if (!isSet) {
                        setTimeout(() => this.props.cardTable.setTableData(tableId, { rows: [] }), 1)
                    }
                })
            }
            else {
                tableIds.forEach((tableId) => {
                    //setTableData**(moduleId, data, callback, isCache，isTop)| 设置表格数据 | data  渲染数据 Object;<br>如果设置空数据 data为{rows: []}, isCache(Boolean)是否保存原始数据，默认是true(保存),isTop 数据是否回到顶部(默认是false，不回到顶部)| undefined    执行函数 | setTableData('tableDemo', res.table) 
                    this.props.cardTable.setTableData(tableId, { rows: [] })
                })
            }
            this.props.setUrlParam(pk)//动态修改地址栏中的id的值
            //纠正一下附件管理
            this.setState({
                billId: pk
            })

            //更正一下按钮状态
            BillStatus = cardData.head[this.formId].rows[0].values.billstatus.value
            this.toggleShow(BillStatus)
            //setFormItemsDisabled**(moduleId,values)| 设置表单某些字段的编辑性
            this.props.form.setFormItemsDisabled(formId, { apply_type: true })

            let applyType = cardData.head[this.formId].rows[0].values.apply_type.value
            if (applyType == 2 || applyType == 3 || applyType == 4) {
                this.setState({
                    showFAndS: false,
                    applyType: applyType
                })
            }
            else {
                this.setState({
                    showFAndS: true
                })
            }
        }
        else {
            this.getdata(pk, (billStatus) => {
                //更正一下按钮状态
                this.toggleShow(billStatus)

            })
            this.props.setUrlParam(pk)//动态修改地址栏中的id的值
        }

        if (callback && typeof callback == 'function') {
            callback.call(this)
        }
    }

    closeApprDetail = () => {
        this.setState({
            showApprInfo: false
        })
    }

    getTableHead(tableId) {
        let { createButtonApp } = this.props.button
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons" style={{ padding: '0px' }}>
                    {createButtonApp({
                        // area: `${tableId}-action`,//按钮注册中的按钮区域
                        area: `bank-body`,
                        onButtonClick: this.buttonClick.bind(this)
                    })}
                    {this.props.cardTable.createBrowseIcons(tableId, {
                        iconArr: ['close', 'open', 'max', 'setCol'],
                        maxDestAreaId: 'nc-bill-card'
                    })}
                </div>
            </div>
        )
    }

    cardTableDoubleClick(props, record, index) {
        let currStatus = props.form.getFormStatus(this.formId)
        if (currStatus == 'edit') {
            let pk = record.values.pk_paymentch.value
            ajax({
                url: queryLinkmanUrl,
                data: { pk },
                success: res => {
                    props.modal.show('linkman')
                    props.form.setAllFormValue({ incomech: res.data.incomech })
                    props.form.setFormStatus('incomech', 'edit')
                }
            })
        }
    }




    render() {
        let { cardTable, form, button, modal, cardPagination, BillHeadInfo, socket } = this.props;
        const { createCardPagination } = cardPagination;
        let { createSimpleTable } = this.props.table;
        let { createForm } = form;
        let { createModal } = modal;
        let { createCardTable } = cardTable;
        let { createButtonApp } = button;
        const { createBillHeadInfo } = BillHeadInfo;
        const { gtxid, billpx, billtype, billpkname } = this.state;
        let iconItem = this.state.showBaseInfo ? 'icon-jiantouxia1' : 'icon-jiantouyou'

        let groupItem = this.state.showBaseInfo ? "show-form" : "hide-form"
        return (

            <div className="nc-bill-extCard">
                <div className="nc-bill-top-area">
                    <NCAffix>
                        <NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                            <NCBackBtn className='title-search-detail' style={{ 'line-height': '32px', display: this.state.backVisible ? 'inline' : 'none' }}
                                onClick={this.buttonClick.bind(this, this.props, 'Back')}
                            >
                            </NCBackBtn>
                            <div className='header-title-search-area'>
                                {createBillHeadInfo({
                                    title: "收款协议申请单",
                                    initShowBackBtn: false
                                })}
                            </div>
                            <div className="header-button-area">
                                {button.createErrorFlag({
                                    headBtnAreaCode: "header-action"//"按钮区域编码"
                                })}
                                {createButtonApp({
                                    area: 'header-action',//按钮注册中的按钮区域
                                    // buttonLimit: 5, 
                                    onButtonClick: this.buttonClick.bind(this)
                                    // popContainer: document.querySelector('.header-button-area')
                                })}
                                {/*createCardPagination({ handlePageInfoChange: pageQueryClick.bind(this) })| handlePageInfoChange:卡片翻页事件 */}
                                {createCardPagination({
                                    handlePageInfoChange: this.pageInfoClick.bind(this),
                                    dataSource: dataSource
                                })}
                            </div>
                        </NCDiv>
                    </NCAffix>
                    <NCAnchor>
                        <NCScrollLink
                            to={this.formId}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json ? this.state.json['10140INCPF-000002'] : '10140INCPF-000002'/* 国际化处理： 收款协议信息*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to={'incomech'}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json ? this.state.json['10140INCPF-000005'] : '10140INCPF-000005'/* 国际化处理： 账期*/}</p>
                        </NCScrollLink>
                    </NCAnchor>
                    <NCScrollElement name={this.formId}>
                        <div className="nc-bill-form-area">
                            {createForm(this.formId, {
                                onAfterEvent: this.afterEvent.bind(this),
                                setVisibleByForm: true
                            })}
                        </div>
                    </NCScrollElement>
                    <NCScrollElement name={this.state.json ? this.state.json['10140INCPF-000000'] : '10140INCPF-000000'/* 国际化处理： 收款协议基本信息state*/}>
                        <div className="nc-bill-form-area">
                            <div className='group-form-wrapper'>
                                <NCDiv fieldid="income_baseInfo" areaCode={NCDiv.config.Group} className="group-form-name">
                                    <span
                                        className={`toggle-form-icon iconfont ${iconItem}`}
                                        onClick={() => {
                                            let show = !this.state.showBaseInfo
                                            this.setState({
                                                showBaseInfo: show
                                            });
                                        }}
                                    />
                                    <span className="name">{this.state.json ? this.state.json['10140INCPF-000000'] : '10140SPF-000000'/* 国际化处理： 收款协议基本信息*/}</span>
                                </NCDiv>
                                <div className={`group-form-item ${groupItem} `}>
                                    {createForm('income_baseInfo', {
                                        onAfterEvent: this.afterEvent.bind(this)
                                    })}
                                </div>
                            </div>
                        </div>
                    </NCScrollElement>

                </div>

                <div className="nc-bill-bottom-area">
                    <NCScrollElement name={'incomech'}>
                        <div className="nc-bill-tableTab-area">
                            {createCardTable("incomech", {
                                tableHead: this.getTableHead.bind(this, 'incomech'),
                                onBeforeEvent: this.tableBeforeEvent.bind(this),
                                modelSave: () => {
                                    this.props.cardTable.closeModel('incomech')
                                    this.saveClick(this.props)
                                }

                            })}
                        </div>
                    </NCScrollElement>
                </div>

                {this.state.showUploader && <NCUploader
                    //billId单据Id    String    必须   此字段决定了附件的文件夹和服务器地址和文件列表
                    billId={"uapbd/713b9a16-add6-4b4f-87e9-e41e493aa865/" + this.state.billId}
                    billNo={'001'}
                    //placement  上传控件相对弹窗的位置
                    placement={'bottom_right'}
                    //multiple  是否支持批量上传
                    multiple={true}
                    //onHide   点击关闭的钩子函数   Function   可选    关闭弹窗事件写到此处
                    onHide={this.onHideUploader.bind(this)}
                />
                }

                <PrintOutput
                    ref='printOutput'
                    url={printUrl}
                    data={{
                        funcode: '10140INCPF',// //小应用编码
                        oids: this.state.pks,// // 功能节点的数据主键 
                        nodekey: 'incomecard',//模板节点标识
                        outputType: 'output'
                    }}
                />

                {createModal('cancel', {
                    title: this.state.json ? this.state.json['10140INCPF-000027'] : '10140INCPF-000027',/* 国际化处理： 确认取消*/
                    content: this.state.json ? this.state.json['10140INCPF-000028'] : '10140INCPF-000028',/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick: this.onCancelSureClick.bind(this)
                })}



                {/* 审批详情组件 */}
                <ApproveDetail
                    show={this.state.showApprInfo}
                    close={this.closeApprDetail.bind(this)}
                    billtype='10SX' //此处billtype为类型
                    billid={this.state.billId}
                />
            </div>



        );
    }

}

Card = createPage({
    billinfo: [
        {
            billtype: 'form',
            pagecode: '10140INCPF_card',
            headcode: "income_baseInfo"
        }, {
            billtype: "extcard",
            pagecode: '10140INCPF_card',
            headcode: formId,
            bodycode: tableIds
        }
    ],
    initTemplate: []
})(Card);

export default Card
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65