//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, cacheTools, cardCache, print, high, getBusinessInfo, deepClone, promptBox,getMultiLang } from 'nc-lightapp-front';
const { NCAffix, NCPopconfirm, NCFormControl, NCBackBtn,NCDiv } = base;
const { PrintOutput } = high;

const { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
const dataSource = 'uapbd.sminfo.payment.data'

const formId = 'payment';                      //表头id
const tableId = 'paymentch';                  //子表id
const pageId = '10140PAYMG_card';            //pagecode
//const searchId = 'search';                  //查询区id
const appcode = '10140PAYMG';        //按钮注册id
const queryCardUrl = '/nccloud/uapbd/sminfo/PaymentCardQuery.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/sminfo/PaymentSave.do';             //新增保存
const updateUrl = '/nccloud/uapbd/sminfo/PaymentUpdate.do';         //修改保存
const deleteUrl = '/nccloud/uapbd/sminfo/PaymentDelete.do';         //删除
const qryUserInfoUrl = '/nccloud/uapbd/sminfo/PaymentLoginUserInfoQuery.do';//登录用户信息
const printUrl = '/nccloud/uapbd/sminfo/PaymentPrint.do';                  //卡片打印url
const validUrl = '/nccloud/uapbd/sminfo/PaymentValid.do';                   //权限校验
const pk_item = 'pk_payment';               //单据主键--用于卡片查询刷新
const titleCode = 'code';           //单据编码--用于卡片表头显示
//const titleName = json['10140PAYMG-000000'];					//节点名称/* 国际化处理： 付款协议-集团*/
//const tableBtnAry = ['delline','detail','spread'];		//表格列操作按钮

let tableBtnAry = (props) => {
    return props.getUrlParam('status') === 'browse'
        ? ['detail'] : ['insertline', 'delline'];
    // ,'spread' 展开新增有问题，先隐藏
}

//
// let initTemplate =(props)=>{
//
//
// }



function tableButtonClick(props, id, text, record, index) {

    let allData = props.cardTable.getVisibleRows(tableId);
    let value = {};
    switch (id) {
        case 'insertline'://插入行
            allData.forEach(element => {
                if (element.values['showorder'].value >= record.values['showorder'].value) {
                    let a = parseInt(element.values['showorder'].value);
                    value = a+1;
                    //value = (parseInt(element.values['showorder'].value) + 1).toString()
                    props.cardTable.setValByKeyAndRowId(tableId, element.rowid, 'showorder', { value: value })
                }
            })
            props.cardTable.addRow(tableId, index, { 'showorder': { display: '', value: index + 1 + '' } }, false);
            break;
        case "delline"://删除行
            allData.forEach(element => {
                if (element.values['showorder'].value >= record.values['showorder'].value) {
                    value = (parseInt(element.values['showorder'].value) - 1).toString()
                    props.cardTable.setValByKeyAndRowId(tableId, element.rowid, 'showorder', { value: value })
                }
            })
            props.cardTable.delRowsByIndex(tableId, index);
            break;
        case "detail"://更多
            props.cardTable.toggleRowView(tableId, record);
            break;
        case "spread"://展开
            props.cardTable.openModel(tableId, 'edit', record, index);
            break;
        default:
            console.log(id, index);
            break;
    }
}

//切换页面状态
function toggleShow(props) {
    let status = props.getUrlParam('status');
    let flag = status === 'browse' ? false : true;
    //按钮的显示状态
    if (status == 'add') {
        //显示子表操作列
        if (props.meta.getMeta()[tableId]) {
            props.cardTable.showColByKey(tableId, 'opr');
        }
        props.button.setButtonVisible(['edit', 'add', 'back', 'delete', 'refresh', 'printGrp', 'print', 'output', 'detail'], false);
        props.button.setButtonVisible(['save', 'saveAdd', 'cancel', 'addline', 'insertline', 'spread', 'delline'], true);
        props.button.setButtonDisabled('saveAdd', false);
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
    }
    else if (status == 'edit') {
        //显示子表操作列
        if (props.meta.getMeta()[tableId]) {
            props.cardTable.showColByKey(tableId, 'opr');
        }
        props.button.setButtonVisible(['edit', 'add', 'back', 'delete', 'refresh', 'printGrp', 'print', 'output', 'detail'], false);
        props.button.setButtonVisible(['save', 'saveAdd', 'cancel', 'addline', 'insertline', 'delline', 'spread'], true);
        props.button.setButtonDisabled('saveAdd', true);
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);

    } else {
        //隐藏子表操作列
        if (props.meta.getMeta()[tableId]) {
            props.cardTable.hideColByKey(tableId, 'opr');
        }
        if(!props.getUrlParam('id')){
            //列表为空新增时id未控制，取消后只保留新增按钮
            props.button.setButtonVisible(['save', 'saveAdd', 'cancel', 'addline', 'insertline', 'delline', 'spread', 'print', 'back', 'edit', 'delete', 'refresh', 'printGrp', 'output', 'detail'], false);
            props.button.setButtonVisible(['add'], true);
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        }else{
            props.button.setButtonVisible(['save', 'saveAdd', 'cancel', 'addline', 'insertline', 'delline', 'spread', 'print', 'back'], false);
            props.button.setButtonVisible(['add', 'edit', 'delete', 'refresh', 'printGrp', 'output', 'detail'], true);
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);    
        }

    }
    //返回图标控制
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: status === 'browse'
    });
    props.form.setFormStatus(formId, status);
    props.cardTable.setStatus(tableId, status);
};

class Card extends Component {

    constructor(props) {
        super(props);
        this.formId = formId;
        //this.searchId = searchId;
        this.tableId = tableId;
        this.state = {
            json:{},
            pk_org: '',
            title_code: '',
            context: {
                nodeType: props.nodeType,
                pk_org: '',
                pk_org_v: '',
                org_Name: '',
                org_v_Name: '',
                mdid: '',
                PermissionOrgIDs: []
            }
        }
        
    }

    initTemplate (props){
        props.createUIDom(
            {
                pagecode: props.pagecode_card//,//页面id
                // appid: props.appid//注册按钮的id
            },
            (data) => {
                if (data) {
                    let context = data.context;
                    this.state.context = Object.assign(this.state.context, context);
                    if (data.template) {
                        let meta = data.template;
                        this.modifierMeta(props, meta)
                        props.meta.setMeta(meta, () => {
                            //this.setDefaultValue();
                        });
                    }
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button, () => {
                            props.button.setPopContent('delline', this.state.json['10140PAYMG-000002']) /*国际化：确认要删除该信息吗？ 设置操作列上删除按钮的弹窗提示 */
                        });
                        toggleShow(props);
                    }
                }
            }
        )
    }

    //moved by wh 20181020 为了多语json对象能够饮用得到，由外部引入至类内部
    modifierMeta(props, meta) {

        let status = props.getUrlParam('status');
        meta[formId].status = status;
        meta[tableId].status = status;
    
        meta[formId].items.map((item) => {
    
            if (item.attrcode == 'pk_org') {
    
                if (props.nodeType == 'group') {
                    item.disabled = 'false';
                }
                else {
                    item.queryCondition = function () {
                        return {
                            AppCode: '10140PAYMO',
                            TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                        }
                    }
                }
            }
        })
    
        let porCol = {
            key: 'oprCol',
            attrcode: 'opr',
            label: this.state.json['10140PAYMG-000001'],/* 国际化处理： 操作*/
            visible: true,
            className: 'table-opr',
            width: '200px',
            itemtype: 'customer',
            fixed: 'right',
            render(text, record, index) {
    
                let btnArray = tableBtnAry(props);
    
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-opr-area",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
                    }
                )
            }
        };
        meta[tableId].items.push(porCol);
    
        return meta;
    }

    componentDidMount() {
        // toggleShow(this.props);
        //add wh 20181020 多语引用的json文件
        let callback = (json, status, inlt) => {
			if (status) {
				this.setState({json, inlt},() => {
					this.initTemplate(this.props)
				})       // 保存json和inlt到页面state中并刷新页面
			}
        }
        this.props.MultiInit.getMultiLang({moduleId: '10140PAYMG', domainName: 'uapbd',callback})

        let status = this.props.getUrlParam('status');
        if (status != "add") {
            let pk = this.props.getUrlParam('id');
            if (pk && pk != 'undefined') {
                this.getdata(pk);
            }
        }
        else {
            this.setDefaultValue();
        }
    }

    componentDidUpdate() {
        let l_formstatus = this.props.form.getFormStatus(formId);
        if (l_formstatus != 'add' && l_formstatus != "edit") {
            window.onbeforeunload = null;
        }
        else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    componentWillReceiveProps() { }

    setDefaultValue = () => {
        //this.props.form.setFormItemsValue(this.formId,{'pk_org':{value: this.props.CacheTools.get("pk_org"),display:'自由态'}});

        // let businessInfo = getBusinessInfo();
        // let pkGroup = businessInfo.groupId;
        // let grpName = businessInfo.groupName;

        if (this.props.nodeType == 'group') {
            // this.props.form.setFormItemsValue(this.formId,{'pk_org':{value:pkGroup,display:grpName}});
            ajax({
                url: qryUserInfoUrl,
                success: (res) => {
                    this.props.form.setFormItemsValue(this.formId, {
                        'pk_org':
                        {
                            value: res.data.group.pk_group,
                            display: res.data.group.name
                        }, 'effectdate':
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
                url: qryUserInfoUrl,
                success: (res) => {
                    this.props.form.setFormItemsValue(this.formId, {
                        'effectdate':
                        {
                            value: res.data.effectDate,
                            display: null
                        },
                        'pk_org':
                        {
                            value: this.state.context.pk_org,
                            display: this.state.context.org_Name
                        }
                    });
                }
            })
        }
    }

    buttonClick = (props, id) => {

        let _this = this;
        switch (id) {
            case 'add':
                this.add(props);
                // props.linkTo(props.cardUrl, {
                //     appcode:props.appcode,
                //     pagecode:props.pagecode_card,
                //     status: 'add'
                // })
                props.setUrlParam({
                    appcode: props.appcode,
                    pagecode: props.pagecode_card,
                    status: 'add'
                })
                toggleShow(this.props);
                //NC CloudNCCLOUD-191474 :新增时业务单元没有设置默认值问题。
                this.setDefaultValue();
                break
            case 'edit':
                this.valid(props,'edit', () => {
                    // props.linkTo(props.cardUrl, {
                    //     appcode:props.appcode,
                    //     pagecode:props.pagecode_card,
                    //     status: 'edit',
                    //     id: props.getUrlParam('id')
                    // });
                    props.setUrlParam({
                        appcode: props.appcode,
                        pagecode: props.pagecode_card,
                        status: 'edit',
                        id: props.getUrlParam('id')
                    })
                    toggleShow(this.props);
                })
                break;
            case 'delete':
                this.valid(props,'delete', () => {
                    promptBox({
                        color: 'warning',
                        title: this.state.json['10140PAYMG-000003'],/* 国际化处理： 确认删除*/
                        content: this.state.json['10140PAYMG-000004'],/* 国际化处理： 确定要删除所选数据吗？*/
                        beSureBtnClick: this.delConfirm.bind(this)
                    })
                });
                break;
            case 'back':
                props.pushTo(props.listUrl, {
                    appcode: props.appcode,
                    pagecode: props.pagecode_list,
                    status: 'browse'
                })
                break;
            case 'save':
                this.saveClick('save');
                break;
            case 'saveAdd':
                this.saveClick('saveAdd');
                break;
            case 'cancel':
                promptBox({
                    color: "warning",
                    title: this.state.json['10140PAYMG-000005'],/* 国际化处理： 取消*/
                    content: this.state.json['10140PAYMG-000006'],/* 国际化处理： 确定取消吗？*/
                    beSureBtnClick: () => {
                        if (props.getUrlParam('status') === 'add') {
                        //modified by wh 20181029    
                        let pk = getCurrentLastId(dataSource);
						    this.getDataForCache(pk, () => { 
						         props.form.cancel(this.formId);
						         props.cardTable.resetTableData(this.tableId);
						         props.setUrlParam({
    							status: 'browse',
					    		id: props.getUrlParam('id'),
						    	appcode:props.appcode,
						    	pagecode:props.pagecode_card
						    })
						    // toggleShow(this.props);
						})
                            // if (cacheTools.get("preid")) {
                            //     props.form.cancel(this.formId);
                            //     props.cardTable.resetTableData(this.tableId);
                            //     // props.linkTo(props.cardUrl, {
                            //     //     appcode:props.appcode,
                            //     //     pagecode:props.pagecode_card,
                            //     //     status: 'browse',
                            //     //     id: cacheTools.get("preid")
                            //     // })
                            //     props.setUrlParam({
                            //         appcode: props.appcode,
                            //         pagecode: props.pagecode_card,
                            //         status: 'browse',
                            //         id: cacheTools.get("preid")
                            //     })
                            //     toggleShow(this.props);
                            // } else {
                            //     props.pushTo(props.listUrl, {
                            //         appcode: props.appcode,
                            //         pagecode: props.pagecode_list,
                            //         status: 'browse'
                            //     })
                            // }
                        }
                        if ((props.getUrlParam('status') === 'edit')) {
                            props.form.cancel(this.formId);
                            props.cardTable.resetTableData(this.tableId);
                            // props.linkTo(props.cardUrl, {
                            //     appcode:props.appcode,
                            //     pagecode:props.pagecode_card,
                            //     status: 'browse',
                            //     id: props.getUrlParam('id')
                            // })
                            props.setUrlParam({
                                appcode: props.appcode,
                                pagecode: props.pagecode_card,
                                status: 'browse',
                                id: props.getUrlParam('id')
                            })
                        }
                        toggleShow(this.props);
                    }
                });
                break
            case 'addline':
                let rowNum = props.cardTable.getNumberOfRows(this.tableId);
                props.cardTable.addRow(this.tableId, rowNum, { 'showorder': { display: '', value: rowNum + 1 + '' } }, false);
                break
            case 'refresh':
                // props.linkTo(props.cardUrl, {
                //     appcode:props.appcode,
                //     pagecode:props.pagecode_card,
                //     status:props.getUrlParam('status'),
                //     id:props.getUrlParam('id')
                // })
                props.setUrlParam({
                    appcode: props.appcode,
                    pagecode: props.pagecode_card,
                    status: props.getUrlParam('status'),
                    id: props.getUrlParam('id')
                })
                toggleShow(this.props);
                this.getdata(props.getUrlParam('id'), true);
                break
            case 'printGrp':
                this.onPrint();
                break;
            case 'print':
                this.onPrint();
                break;
            case 'output':
                this.onOutput();
                break;
            default:
                break
        }
    }

    add = (props) => {
        let pk_org = deepClone(props.form.getFormItemsValue(this.formId, 'pk_org'));
        // Utils.clone(props.form.getFormItemsValue(this.formId,'pk_org'));
        props.form.EmptyAllFormValue(this.formId)
        props.cardTable.setTableData(this.tableId, { rows: [] })
        // props.linkTo(props.cardUrl, {
        //     appcode:props.appcode,
        //     pagecode:props.pagecode_card,
        //     status: 'add'
        // })
        props.setUrlParam({
            appcode: props.appcode,
            pagecode: props.pagecode_card,
            status: 'add'
        })
        let businessInfo = getBusinessInfo();
        let date = null;
        let grpId = null;
        let grpName = null;

        if (businessInfo) {
            date = businessInfo.businessDate;
            grpId = businessInfo.groupId;
            grpName = businessInfo.groupName;
        }

        //组织节点不能赋值集团
        if (props.nodeType == 'org' && pk_org.value == grpId) {
            pk_org = { value: '', display: '' };
        }
        //集团一定是集团
        if (props.nodeType == 'group' && pk_org != grpId) {
            pk_org = { value: grpId, display: grpName };
        }
        props.form.setFormItemsValue(this.formId, { 'pk_org': { value: pk_org.value, display: pk_org.display } });
        props.form.setFormItemsValue(this.formId, { 'effectdate': { value: date, display: date } });
    }

    valid = (props,operateCode='', callback) => {
        let data = {
            pks: [props.form.getFormItemsValue(formId, pk_item).value],
            nodeType: props.nodeType,
            mdOperateCode:operateCode
        }
        ajax({
            url: validUrl,
            data,
            success: (res) => {
                callback && callback();
            }
        })
    }
    //打印
    onPrint = () => {

        let allData = this.props.form.getAllFormValue(formId);

        if (allData.length === 0) {
            toast({ content: this.state.json['10140PAYMG-000007'], color: 'warning' });/* 国际化处理： 无可打印数据*/
            return;
        }

        let pks = [];

        allData.rows.forEach((item, key) => {
            pks.push(item.values[pk_item].value);
        });
        print(
            'pdf',
            printUrl,
            {
                appcode: this.props.appcode,
                funcode: this.props.printFunCode,//小应用编码
                nodekey: this.props.printNodeKey,//模板节点编码
                oids: pks
            }
        )
    }
    //输出
    onOutput = () => {

        let allData = this.props.form.getAllFormValue(formId);
        if (allData.length === 0) {
            toast({ content: this.state.json['10140PAYMG-000008'], color: 'warning' });/* 国际化处理： 无可输出的数据*/
            return;
        }
        let pks = [];

        allData.rows.forEach((item, key) => {
            pks.push(item.values[pk_item].value);
        });
        this.setState({
            ids: pks
        }, this.refs.printOutput.open());
    }

    pageInfoClick = (props, pk) => {

        let data = {
            'pk_org': cacheTools.get('pk_org'),
            'pk': pk,
            'pageid': props.pagecode_card
        };
        ajax({
            url: queryCardUrl,
            data: data,
            success: (res) => {
                if (res.data.head) {

                    props.form.setAllFormValue({ [formId]: res.data.head[formId] });
                    props.setUrlParam(pk)//动态修改地址栏中的id的值
                }
                if (res.data.body) {
                    props.cardTable.setTableData(tableId, res.data.body[tableId]);
                }
            }
        });
    }


    afterEvent = (props, moduleId, key, value, changedrows, i, s, g) => { }

    tableAfterEvent = (props, moduleId, key, value, changedrows, index, record, type) => {
        if (key == 'paymentday' && value && value != null && value != '') {
            props.cardTable.setValByKeyAndIndex(moduleId, index, 'accountday', { value: null, display: null })
            props.cardTable.setValByKeyAndIndex(moduleId, index, 'checkdata', { value: null, display: null })
            props.cardTable.setValByKeyAndIndex(moduleId, index, 'effectmonth', { value: null, display: null })
            props.cardTable.setValByKeyAndIndex(moduleId, index, 'effectaddmonth', { value: null, display: null })
        }
        if (key == 'checkdata' && value && value != null && value != '') {
            props.cardTable.setValByKeyAndIndex(moduleId, index, 'paymentday', { value: null, display: null })
            if (changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
                props.cardTable.setValByKeyAndIndex(moduleId, index, 'accountday', { value: null, display: null })
                props.cardTable.setValByKeyAndIndex(moduleId, index, 'effectmonth', { value: '0', display: this.state.json['10140PAYMG-000009'] })/* 国际化处理： 当月生效*/
                props.cardTable.setValByKeyAndIndex(moduleId, index, 'effectaddmonth', { value: '0', display: '0' })
            }
        }
    }

    tableBeforeEvent = (props, moduleId, key, value, index, record, s, line, model) => {

        let status = props.getUrlParam('status');

        let meta = props.meta.getMeta()

        if (status != 'browse' && ['accountday', 'effectmonth', 'effectaddmonth'].includes(key)) {

            let checkdata = props.cardTable.getValByKeyAndIndex(moduleId, index, 'checkdata');

            if (!checkdata || checkdata.value == null || checkdata.value == '') {
                toast({ content: this.state.json['10140PAYMG-000010'], color: 'danger' });/* 国际化处理： 请先填写固定结账日！*/
                return false;
            }
        }

        //付款时点参照pk_org过滤pk_payperiod
        if(key == 'pk_payperiod'){
            let pk_payperiod = meta[moduleId].items.find((item) => item.attrcode == 'pk_payperiod');
            pk_payperiod.queryCondition = function () {
                return {
                    pk_org:props.form.getFormItemsValue(formId,'pk_org').value
                }
            }
        }
        //现金折扣参照pk_org过滤pk_rate
        if(key == 'pk_rate'){
            let pk_rate = meta[moduleId].items.find((item) => item.attrcode == 'pk_rate');
            pk_rate.queryCondition = function () {
                return {
                    pk_org:props.form.getFormItemsValue(formId,'pk_org').value
                }
            }
        }


        return true;
    }

    //通过单据id查询单据信息
    getdata = (pk, isRefresh,pk_org_c = null) => {
        let data = {
            pk,
            pk_org: pk_org_c == null? cacheTools.get('pk_org'):pk_org_c
        };
        ajax({
            url: queryCardUrl,
            data,
            success: (res) => {
                if (res.data.head) {
                    this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                    let title_code = res.data.head[this.formId].rows[0].values[titleCode].value;
                    this.setState({ title_code });
                }
                if (res.data.body) {
                    this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                }

                //查询时执行显示公式前端适配
                if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                    this.props.dealFormulamsg(
                        res.formulamsg,  //参数一：返回的公式对象
                        {                //参数二：界面使用的表格类型
                            [this.tableId]:"table",
                            [this.formId]:"form"
                        }
                    );
                }

                if (isRefresh) {
                    toast({ content: this.state.json['10140PAYMG-000011'], color: 'success' });/* 国际化处理： 刷新成功*/
                }
            }
        });
    }

    //保存单据
    saveClick = (btn) => {
        if (!this.props.cardTable.getAllRows(tableId)) {
            toast({ content: this.state.json['10140PAYMG-000012'], color: 'danger' });/* 国际化处理： 账期不能为空*/
        }
        setTimeout(() => {
            debugger
            //var a = this.props.cardTable.checkTableRequired(tableId)
        }, 0)
        // 必填校验
        if (this.props.form.isCheckNow(formId) && this.props.cardTable.checkTableRequired(tableId)) {
            this.props.cardTable.filterEmptyRows(tableId);
            let CardData = this.props.createMasterChildData(this.props.pagecode_card, this.formId, this.tableId);
            // CardData.head.head.rows[0].values.bill_code = _this.state.bill_code;
            let url = saveUrl;//新增保存
            if (this.props.getUrlParam('status') === 'edit') {
                url = updateUrl;//修改保存
            }

            //适配保存校验公式
            this.props.validateToSave( CardData , ()=>{
                ajax({
                    url: url,
                    data: CardData,
                    success: (res) => {
                        let pk_value = null
                        if (res.success) {
                            if (res.data) {
                                if (res.data.head && res.data.head[this.formId]) {
                                    this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                                    pk_value = res.data.head[this.formId].rows[0].values[pk_item].value
                                }
                                if (res.data.body && res.data.body[this.tableId]) {
                                    this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId])
                                }
                            }

                            //修改保存
                            if (this.props.getUrlParam('status') === 'edit') {
                                updateCache(pk_item,res.data.head[formId].rows[0].values[pk_item].value,res.data,formId,dataSource);
                            }else{//新增保存
                                addCache(pk_value,res.data,this.formId,dataSource);
                            }

                            toast({ title: this.state.json['10140PAYMG-000013'], color: 'success' });/* 国际化处理： 保存成功*/
                            if (btn == 'save') {
                                let pk_org_c=res.data.head[this.formId].rows[0].values.pk_org.value
                                this.getdata(pk_value,false,pk_org_c);
                                // this.props.linkTo(this.props.cardUrl, {
                                //     appcode: this.props.appcode,
                                //     pagecode: this.props.pagecode_card,
                                //     status: 'browse',
                                //     id: pk_value
                                // })
                                this.props.setUrlParam({
                                    appcode: this.props.appcode,
                                    pagecode: this.props.pagecode_card,
                                    status: 'browse',
                                    id: pk_value
                                })
                                this.props.setUrlParam();
                            } else {
                                //保存新增
                                this.add(this.props);
                                // this.props.linkTo(this.props.cardUrl, {
                                //     appcode: this.props.appcode,
                                //     pagecode: this.props.pagecode_card,
                                //     status: 'add'
                                // })
                                this.props.setUrlParam({
                                    appcode: this.props.appcode,
                                    pagecode: this.props.pagecode_card,
                                    status: 'add'
                                })
                                //addCache(pk_value,res.data,this.formId,dataSource);
                            }
                            toggleShow(this.props)
                        }
                    }
                })
            },{[tableId]:'cardTable'} , 'card' )

            
        }
    }

    //删除单据
    delConfirm = () => {
        ajax({
            url: deleteUrl,
            data: {
                //列表新增保存，pk_org 没有缓存，修改成从卡片页面获取。
                // 不修改缓存的原因是列表页面的pk_org 可能是数组，修改完后列表删除会有问题
                pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
                deleteinfo: [{
                    id: this.props.getUrlParam('id'),
                    ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
                }]
            },
            success: (res) => {
                if (res) {
                    let id = this.props.getUrlParam("id");
                    //调用删除缓存数据方法
					/*
					* idname: 数据主键的命名
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
					deleteCacheById(pk_item,id,dataSource);
                    this.props.pushTo(this.props.listUrl, {
                        appcode: this.props.appcode,
                        pagecode: this.props.pagecode_list,
                        status: 'browse'
                    });
                }

            }
        });
    };

    modelSave = (props) => {
        props.cardTable.closeModel(this.tableId);
        this.saveClick();
    }

    // getButtonNames = (codeId) => {
    //     if (codeId === 'edit'||codeId === 'add'||codeId === 'save'){
    //         return 'main-button'
    //     }else {
    //         return 'secondary - button'
    //     }
    // };

    //从缓存获取信息
    //added by wh 20181030
    getDataForCache(pk, callback) {
		if(!pk) {
			this.props.form.EmptyAllFormValue(this.formId)
            this.props.cardTable.setTableData(this.tableId, {rows: []})
            // this.props.pushTo('/list', {})
			// return
        }
        else{
            let cardData = getCacheById(pk, dataSource);
            if(cardData) {
                this.props.form.setAllFormValue({ [formId]:cardData.head[formId] });
                if(cardData.body && cardData.body[tableId]) {
                    this.props.cardTable.setTableData(tableId, cardData.body[tableId]);
                }
                else {
                    this.props.cardTable.setTableData(tableId, {rows: []})
                }
                this.props.setUrlParam(pk)//动态修改地址栏中的id的值
            }
            else {
                this.getdata(pk)
                this.props.setUrlParam(pk)//动态修改地址栏中的id的值
            }
        }
		
		if(callback && typeof callback == 'function') {
			callback.call(this)
		}

		//将更新按钮状态的调用延后到callback之后，否则新增取消的时候显示的还是编辑态的按钮
		// if(cardData) {
        //     //note by wh 20181212
        //     //let enableState = cardData.head[formId].rows[0].values.enablestate.value
		// 	toggleShow(this.props)
		// }
	}

    //获取列表肩部信息
    getTableHead = () => {
        let { button } = this.props;
        let { createButtonApp } = button;
        let buttons = this.props.button.getButtons();
        let status = this.props.getUrlParam("status");
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'definition-icons',//按钮注册中的按钮区域
                        //buttonLimit: 5,
                        onButtonClick: this.buttonClick.bind(this)
                        //popContainer: document.querySelector('.header-button-area')
                    })}
                    {/* {this.props.cardTable.createBrowseIcons(this.tableId, {
                        iconArr: ['close', 'open', 'max','setCol'],
                        maxDestAreaId: 'nc-bill-card'
                    })} */}
                </div>
            </div>
        )
    }

    /**
     * 返回按钮操作
     */
    onReturnClick() {
        this.props.pushTo(this.props.listUrl, {
            pagecode: this.props.pagecode_list,
            appcode: this.props.appcode,
            status: 'browse'
        })
    }

    render() {
        let { cardTable, form, button, modal, cardPagination,BillHeadInfo } = this.props;
        const { createCardPagination } = cardPagination;
        const {createBillHeadInfo} = BillHeadInfo;
        let buttons = this.props.button.getButtons();
        // buttons = buttons.sort((a,b)=>{
        //     return b.btnorder - a.btnorder;
        // });
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createButtonApp } = button;
        let { createModal } = modal;
        let status = this.props.getUrlParam('status');
        return (
                <div className='nc-bill-extCard'>
                    <div className="nc-bill-top-area">
                        <NCAffix>
                            <NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                                {/* <div>
                                    {status == 'browse' ? <NCBackBtn onClick={this.onReturnClick.bind(this)}></NCBackBtn> : ''}
                                </div> */}
                                <div className='header-title-search-area'>
                                    {createBillHeadInfo({
                                            title:(this.props.nodeType == 'group'? this.state.json['10140PAYMG-000000'] : this.state.json['10140PAYMG-000014']),
                                            backBtnClick: this.onReturnClick.bind(this)
                                        }
                                    )}
                                    {/*modified by wh 20181020 为了适应多语工具的回写功能把nodeName移动至此*/}
                                    {/* <h2 className='title-search-detail'>{this.props.nodeType == 'group'? this.state.json['10140PAYMG-000000'] : this.state.json['10140PAYMG-000014']}{status == 'browse' ? `：${this.state.title_code}` : ''}</h2> */}
                                </div>
                                {/* <span className="bill-info-code" style={{fontSize: '16px',marginLeft: '8px',lineHeight: '32px',verticalAlign: 'baseline'}}>
									{status=='browse' && ": "+this.state.title_code}
								</span> */}
                                <div className="header-button-area">
                                    {createButtonApp({
                                        area: 'header-button-area',//按钮注册中的按钮区域
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
                                onAfterEvent: this.afterEvent.bind(this)
                            })}
                        </div>
                    </div>
                    <div className="nc-bill-bottom-area">
                        <div className="nc-bill-table-area">
                            {createCardTable(this.tableId, {
                                tableHead: this.getTableHead.bind(this),
                                modelSave: this.modelSave.bind(this),
                                showIndex: true,
                                onAfterEvent: this.tableAfterEvent.bind(this),
                                onBeforeEvent: this.tableBeforeEvent.bind(this)
                            })}
                        </div>
                        {createModal('delete', {
                            title: this.state.json['10140PAYMG-000015'],/* 国际化处理： 注意*/
                            content: this.state.json['10140PAYMG-000016'],/* 国际化处理： 确认删除？*/
                            beSureBtnClick: this.delConfirm.bind(this)
                        })}
                        {/* 删除前确认模态框 */}
                        {createModal('modal', {
                            title: this.state.json['10140PAYMG-000003'],										//标题/* 国际化处理： 确认删除*/
                            content: this.state.json['10140PAYMG-000017'],							//内容/* 国际化处理： 确认删除所选数据？*/
                            // beSureBtnClick : ()=>{
                            //     console.log('aaaaaaa')
                            // },		//确定按钮事件回调
                            //cancelBtnClick : this.closeDelModal.bind(this),			//取消按钮事件回调
                            // leftBtnName : '确认',   								//左侧按钮名称
                            // rightBtnName : '关闭'   								//右侧按钮名称
                        })}
                        <PrintOutput
                            ref='printOutput'
                            url={printUrl}
                            data={{
                                appcode: this.props.appcode,
                                funcode: this.props.printFunCode,//小应用编码
                                nodekey: this.props.printNodeKey,//模板节点编码
                                oids: this.state.ids,
                                outputType: 'output'
                            }}
                        />
                    </div>
                </div>
        );
    }
}

Card = createPage({
    billinfo:[{
        billtype: 'card',
        pagecode: pageId,
        headcode: formId,
        bodycode: tableId
    }],
    initTemplate: [],
    //mutiLangCode: '10140PAYMG'
})(Card);


// ajav({

// 	success: function(temp){
// 		var temp0 = temp;
// 		Card = createPage({
// 			initTemplate: function(){
// 				return temp0;
// 			}
// 		})(Card);
// 	}
// })

// ReactDOM.render(<Card />, document.querySelector('#app'));

export default Card;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65