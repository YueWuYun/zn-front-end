//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, cacheTools, print, high, getBusinessInfo, deepClone, promptBox,cardCache,excelImportconfig } from 'nc-lightapp-front';
import createUIDom from '../../../public/utils/BDCreateUIDom';
const { NCAffix, NCPopconfirm, NCFormControl, NCBackBtn } = base;
const { PrintOutput,ExcelImport } = high;
const { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
const { NCDiv } = base;
const formId = 'income';                      //表头id
const tableId = 'incomech';                  //子表id
const pageId = '10140INCMG_incomecard';            //pagecode
//const searchId = 'search';                  //查询区id
const appId = '0001Z010000000001PR5';        //按钮注册id
const queryCardUrl = '/nccloud/uapbd/sminfo/IncomeCardQuery.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/sminfo/IncomeSave.do';             //新增保存
const updateUrl = '/nccloud/uapbd/sminfo/IncomeUpdate.do';         //修改保存
const deleteUrl = '/nccloud/uapbd/sminfo/IncomeDelete.do';         //删除
const qryUserInfoUrl = '/nccloud/uapbd/sminfo/PaymentLoginUserInfoQuery.do'//登录用户信息
const printUrl = '/nccloud/uapbd/sminfo/IncomePrint.do';                  //列表打印url
const validUrl = '/nccloud/uapbd/sminfo/IncomeValid.do';                   //权限校验
const pk_item = 'pk_income';               //单据主键--用于卡片查询刷新
const titleCode = 'code';           //单据编码--用于卡片表头显示
//const tableBtnAry = ['delline','detail','spread'];		//表格列操作按钮
const dataSource = 'uapbd.sminfo.income.data'

let tableBtnAry = (props) => {
    return props.getUrlParam('status') === 'browse'
        ? ['detail'] : ['insertline', 'delline'];
    // ,'spread'展开新增有问题，先隐藏
}

//
// let initTemplate =(props)=>{
//
// }

function modifierMeta(props, meta) {
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
                        AppCode: '10140INCMO',
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    }
                }
            }
        }
    })

    let porCol = {
        attrcode: 'opr',
        label: props.MutiInit.getIntl("10140INCMG") && props.MutiInit.getIntl("10140INCMG").get('10140INCMG-000001'), //this.state.json['10140INCMG-000001'],/* 国际化处理： 操作*/
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

function tableButtonClick(props, id, text, record, index) {

    let allData = props.cardTable.getVisibleRows(tableId, false);
    let value ;
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
        case "delline"://删除行s
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
        props.cardTable.showColByKey(tableId, 'opr');
        props.button.setButtonVisible(['edit', 'add', 'back', 'delete', 'refresh', 'spread', 'printGrp', 'print', 'export','import', 'output'], false);
        props.button.setButtonVisible(['save', 'saveAdd', 'cancel', 'addline', 'insertline', 'delline', 'detail'], true);
        props.button.setButtonDisabled('saveAdd', false);
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
    }
    else if (status == 'edit') {
        //显示子表操作列
        props.cardTable.showColByKey(tableId, 'opr');
        props.button.setButtonVisible(['edit', 'add', 'back', 'delete', 'refresh', 'spread', 'printGrp', 'print', 'export','import', 'output'], false);
        props.button.setButtonVisible(['save', 'saveAdd', 'cancel', 'addline', 'insertline', 'delline', 'detail'], true);
        props.button.setButtonDisabled('saveAdd', true);
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
    } else {
        //隐藏子表操作列
        props.cardTable.hideColByKey(tableId, 'opr');
        if(!props.getUrlParam('id')){
            //列表为空新增时id未控制，取消后只保留新增按钮
            props.button.setButtonVisible(['save', 'saveAdd', 'cancel', 'addline', 'insertline', 'delline', 'spread', 'print', 'back', 'edit', 'delete', 'refresh', 'printGrp', 'output', 'detail','export','import'], false);
            props.button.setButtonVisible(['add'], true);
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        }else{
            props.button.setButtonVisible(['save', 'saveAdd', 'cancel', 'addline', 'insertline', 'delline', 'detail', 'print', 'export','import', 'back'], false);
            props.button.setButtonVisible(['add', 'edit', 'delete', 'refresh', 'spread', 'printGrp', 'output'], true);
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
            pk_org: '',
            json: {},
            title:'',
            title_code: '',
            totalcount: 0,
            applycount: 0,
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
        
        this.initTemplate(props);

    }
    
     //初始化单据模板
    initTemplate = (props,callback) => {
        let that = this;
        createUIDom(props)(
            {
                pagecode:props.pagecode_card//页面id
            // appcode:props.config.appcode//注册按钮的id
            },
            {
                moduleId: '10140INCMG',domainName: 'uapbd'
            },
            (data, langData)=>{ //(data, langData)
                if(langData){
                    this.state.json = langData
                    if(props.nodeType == 'group'){
						that.state.title = this.state.json['10140INCMG-000000']//this.state.json['10140CSCLG-000000'],/* 国际化处理： 收款协议-集团*/
					}else{
						that.state.title= this.state.json['10140INCMG-000025']//this.state.json['10140CSCLG-000000'],/* 国际化处理： 收款协议-业务单元*/
					}
                }
                if (data) {
                    let context = data.context;
                    this.state.context = Object.assign(this.state.context, context);

                    if (data.template) {
                        let meta = data.template;
                        modifierMeta(props, meta)
                        props.meta.setMeta(meta,() => {
                            this.setDefaultValue();
                        });
                    }
                    if (data.button) {
                        let button = data.button;
                        debugger;
                        let excelimportconfig = excelImportconfig(props,'uapbd',props.billType,true,'',{appcode: props.appcode,pagecode: props.pagecode_card},()=>{
                            props.setUrlParam({
                                appcode: props.appcode,
                                pagecode: props.pagecode_card,
                                status: props.getUrlParam('status'),
                                id: props.getUrlParam('id')
                            });
                            toggleShow(this.props);
                            this.getdata(props.getUrlParam('id'), true);
                        });
                        props.button.setUploadConfig("import",excelimportconfig);
                        props.button.setButtons(data.button);
                        toggleShow(props);
                        props.button.setButtons(button, () => {
                            //props.button.setPopContent('delline','确认要删除该信息吗？') /* 设置操作列上删除按钮的弹窗提示 */
                        });
                        toggleShow(props);
                    }
                    callback && callback();
                }
            }
        )
		}
		
    componentDidMount() {
        // toggleShow(this.props);

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

        if (this.props.nodeType == 'group') {
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
                //   status: 'add'
                // })
                props.setUrlParam({
                    appcode: props.appcode,
                    pagecode: props.pagecode_card,
                    status: 'add'
                })
                toggleShow(this.props);
                break;
            case 'edit':
                this.valid(props, () => {
                    //   props.linkTo(props.cardUrl, {
                    //       appcode:props.appcode,
                    //       pagecode:props.pagecode_card,
                    //       status: 'edit',
                    //       id: props.getUrlParam('id')
                    //   });
                    props.setUrlParam({
                        appcode: props.appcode,
                        pagecode: props.pagecode_card,
                        status: 'edit',
                        id: props.getUrlParam('id')
                    });
                    toggleShow(this.props);
                })
                break;
            case 'delete':
                this.valid(props, () => {
                    promptBox({
                        title: this.state.json['10140INCMG-000002'],/* 国际化处理： 确认删除*/
                        color: "warning",
                        hasCloseBtn:false,
                        content: this.state.json['10140INCMG-000003'],/* 国际化处理： 确定要删除所选数据吗？*/
                        beSureBtnClick: this.delConfirm.bind(this)
                    })
                })
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
                    title: this.state.json['10140INCMG-000004'],/* 国际化处理： 确认取消*/
                    hasCloseBtn:false,
                    content: this.state.json['10140INCMG-000005'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick: () => {
                        if (props.getUrlParam('status') === 'add') {
                            //modified by tangcht 2019.2.27    
                            let pk = getCurrentLastId(dataSource);
                            this.getDataForCache(pk, () => { 
                                props.form.cancel(this.formId);
                               // props.cardTable.resetTableData(this.tableId);
                                props.setUrlParam({
                                status: 'browse',
                                id: props.getUrlParam('id'),
                                appcode:props.appcode,
                                pagecode:props.pagecode_card
                                })
                            })
                        }
                        if ((props.getUrlParam('status') === 'edit')) {
                            props.form.cancel(this.formId);
                           // props.cardTable.resetTableData(this.tableId);
                            props.setUrlParam({
                                appcode: props.appcode,
                                pagecode: props.pagecode_card,
                                status: 'browse',
                                id: props.getUrlParam('id')
                            });
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
                //   status:props.getUrlParam('status'),
                //   id:props.getUrlParam('id')
                // })
                props.setUrlParam({
                    appcode: props.appcode,
                    pagecode: props.pagecode_card,
                    status: props.getUrlParam('status'),
                    id: props.getUrlParam('id')
                });
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
            case 'export':
                this.setState(this.state,()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;    
            default:
                break
        }
    }

    //校验
    valid = (props, callback) => {
        let data = {
            pks: [props.form.getFormItemsValue(formId, pk_item).value],
            nodeType: props.nodeType
        }
        ajax({
            url: validUrl,
            data,
            success: (res) => {
                callback && callback();
            }
        })
    }

    //新增
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
        });
        let date = getBusinessInfo().businessDate;
        let grpId = getBusinessInfo().groupId;
        let grpName = getBusinessInfo().groupName;
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

    //打印
    onPrint = () => {

        let allData = this.props.form.getAllFormValue(formId);

        if (allData.length === 0) {
            toast({ content: this.state.json['10140INCMG-000006'], color: 'warning' });/* 国际化处理： 无可打印数据！*/
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
            },false
        )
    }
    //输出
    onOutput = () => {

        let allData = this.props.form.getAllFormValue(formId);
        if (allData.length === 0) {
            toast({ content: this.state.json['10140INCMG-000007'], color: 'warning' });/* 国际化处理： 无可输出的数据！*/
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
                    let title_code = res.data.head[formId].rows[0].values[titleCode].value;
                    this.setState({ title_code });
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
                props.cardTable.setValByKeyAndIndex(moduleId, index, 'effectmonth', { value: '0', display: this.state.json['10140INCMG-000008'] })/* 国际化处理： 当月生效*/
                props.cardTable.setValByKeyAndIndex(moduleId, index, 'effectaddmonth', { value: '0', display: '0' })
            }
        }
    }

    tableBeforeEvent = (props, moduleId, key, value, index, record, s, line, model) => {

        let status = props.getUrlParam('status');

        let meta = props.meta.getMeta();

        if (status != 'browse' && ['accountday', 'effectmonth', 'effectaddmonth'].includes(key)) {

            let checkdata = props.cardTable.getValByKeyAndIndex(moduleId, index, 'checkdata');

            if (!checkdata || checkdata.value == null || checkdata.value == '') {
                toast({ content: this.state.json['10140INCMG-000009'], color: 'danger' });/* 国际化处理： 请先填写固定结账日！*/
                return false;
            }
        }
        if(key == 'pk_incomeperiod'){
            let pk_incomeperiod = meta[moduleId].items.find((item) => item.attrcode == 'pk_incomeperiod');
            pk_incomeperiod.queryCondition = function () {
                return {
                    pk_org:props.form.getFormItemsValue('income','pk_org').value
                }
            }
        }

        if(key == 'pk_rate'){
            let pk_rate = meta[moduleId].items.find((item) => item.attrcode == 'pk_rate');
            pk_rate.queryCondition = function () {
                return {
                    pk_org:props.form.getFormItemsValue('income','pk_org').value
                }
            }
        }
        

        props.meta.setMeta(meta); 
        return true;
    }

    //通过单据id查询单据信息
    getdata = (pk, isRefresh) => {
        let data = {
            pk,
            pk_org: cacheTools.get('pk_org')
        };
        ajax({
            url: queryCardUrl,
            data,
            success: (res) => {
                if(res.data){
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
                        props.dealFormulamsg(
                            res.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                [this.tableId]:"table",
                                [this.formId]:"form"
                            }
                        );
                    }
                }
                if (isRefresh) {
                    toast({ title: this.state.json['10140INCMG-000010'], color: 'success' });/* 国际化处理： 刷新成功！*/
                }
            }
        });
    }

    //保存单据
    saveClick = (btn) => {

        //必填校验
        if (this.props.form.isCheckNow(formId) && this.props.cardTable.checkTableRequired(tableId)) {

            this.props.cardTable.filterEmptyRows(tableId,['accrate','pk_incomeperiod','pk_balatype']);
            let CardData = this.props.createMasterChildData(this.props.pagecode_card, this.formId, this.tableId);
            // CardData.head.head.rows[0].values.bill_code = _this.state.bill_code;
            let url = saveUrl;//新增保存
            if (this.props.getUrlParam('status') === 'edit') {
                url = updateUrl;//修改保存
            }
            
            //适配校验公式
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
                            toast({ title: this.state.json['10140INCMG-000011'], color: 'success' });/* 国际化处理： 保存成功！*/
    
                            if (btn == 'save') {
    
                                this.getdata(pk_value);
                                // this.props.linkTo(this.props.cardUrl, {
                                //     appcode:this.props.appcode,
                                //     pagecode:this.props.pagecode_card,
                                //     status: 'browse',
                                //     id: pk_value
                                // })
                                this.props.setUrlParam({
                                    appcode: this.props.appcode,
                                    pagecode: this.props.pagecode_card,
                                    status: 'browse',
                                    id: pk_value
                                });
                            } else {
                                //保存新增
                                this.add(this.props);
                                // this.props.linkTo(this.props.cardUrl, {
                                //     appcode:this.props.appcode,
                                //     pagecode:this.props.pagecode_card,
                                //     status: 'add'
                                // })
                                this.props.setUrlParam({
                                    appcode: this.props.appcode,
                                    pagecode: this.props.pagecode_card,
                                    status: 'add'
                                });
                            }
                            //修改保存
                            if (this.props.getUrlParam('status') === 'edit') {
                                updateCache(pk_item,res.data.head[formId].rows[0].values[pk_item].value,res.data,formId,dataSource);
                            }else{//新增保存
                                addCache(pk_value,res.data,this.formId,dataSource);
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
                    deleteCacheById(pk_item,this.props.getUrlParam('id'),dataSource);

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

    //从缓存获取信息
    //added by tangcht 2019.2.27
    getDataForCache(pk, callback) {
		if(!pk) {
			this.props.form.EmptyAllFormValue(this.formId)
            this.props.cardTable.setTableData(this.tableId, {rows: []})
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
        // 	return b.btnorder - a.btnorder;
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
                                            backBtnClick: this.onReturnClick.bind(this),
                                            title:this.state.title,
                                            initShowBackBtn:status == 'browse' ? true :false
                                        }
                                    )}
                            </div>
                         <span className="bill-info-code" style={{fontSize: '16px',marginLeft: '8px',lineHeight: '32px',verticalAlign: 'baseline'}}>
									{status=='browse' && ": "+this.state.title_code}
								</span>
                            <div className="header-button-area">
                                {createButtonApp({
                                    area: 'header-button-area',//按钮注册中的按钮区域
                                    onButtonClick: this.buttonClick.bind(this)
                                })}
                                {createCardPagination({
                                    handlePageInfoChange: this.pageInfoClick.bind(this),
                                    dataSource:dataSource
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
                        title: this.state.json['10140INCMG-000012'],/* 国际化处理： 注意*/
                        content: this.state.json['10140INCMG-000013'],/* 国际化处理： 确认删除？*/
                        beSureBtnClick: this.delConfirm.bind(this)
                    })}
                    {createModal('modal', {
                        title: this.state.json['10140INCMG-000002'],										//标题/* 国际化处理： 确认删除*/
                        content: this.state.json['10140INCMG-000014'],							//内容/* 国际化处理： 确认删除所选数据？*/
                        // beSureBtnClick : ()=>{
                        // 	console.log('aaaaaaa')
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
                     <ExcelImport
                {...this.props}
                moduleName ='uapbd'//模块名
                billType = {this.props.billType}//单据类型
                selectedPKS = {[]}
                appcode={this.props.appcode}
                pagecode={this.props.pagecode_card}
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
    mutiLangCode: '10140INCMG'
})(Card);

// ReactDOM.render(<Card />, document.querySelector('#app'));

export default Card;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65