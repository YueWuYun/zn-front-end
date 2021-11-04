//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, getMultiLang,base, ajax,toast, promptBox, cardCache, high, print} from 'nc-lightapp-front';
import Utils from '../../../public/utils';

const { PrintOutput, ApproveDetail, NCUploader, ApprovalTrans} = high;
const {setDefData, getCurrentLastId} = cardCache;
const formId = 'creditpf';        //表头id
const tableId = 'financeorgs';    // 子表id
const pageId = '10100CRESP_card';  //pagecode
const searchId = 'searcharea'; //查询区id
const { NCAffix, NCDiv,NCAnchor, NCScrollElement, NCScrollLink, NCBackBtn } = base;
const dataSource = 'uapbd.org.creditctlreapply.data';
const queryCardUrl = '/nccloud/uapbd/creditctlreapply/credApplyCardQuery.do';   //卡片查询url
const addUrl = '/nccloud/uapbd/creditctlreapply/credApplyAdd.do';	//新增
const saveUrl = '/nccloud/uapbd/creditctlreapply/saveCreditctlreApply.do'; //新增保存
const updateUrl = '/nccloud/uapbd/creditctlreapply/updateCreditctlreApply.do';         //修改保存
const validUrl = '/nccloud/uapbd/creditctlreapply/credApplyValid.do'; 
const deleteUrl = '/nccloud/uapbd/creditctlreapply/credApplyDelete.do';      //删除url
const printUrl = '/nccloud/uapbd/creditctlreapply/credApplyCardPrint.do';          //打印url
const commitUrl = '/nccloud/uapbd/creditctlreapply/credApplyCommit.do' //提交
const callbackUrl = '/nccloud/uapbd/creditctlreapply/credApplyCallback.do' //收回

const pk_item = 'pk_ccregion_pf'; //单据主键--用于卡片查询刷新
const tableIds = ['financeorgs'];
const listUrl = '/list';
const pagecode_list = '10100CRESP_list';
const printFunCode = '10100CRESP';
const printNodeKey = 'credpfcard';
const eventItems=['pk_org','destorg','pk_exratescheme']

function tableButtonClick(props, id, text, record, index, tableid){
    switch(id){
        case 'Spread': //展开
           props.cardTable.toggleRowView(tableid,record);
           break;
        case 'Detail': //更多
           props.cardTable.openModel(tableid,'edit',record,index);
           break
        case 'Delline'://删除
            props.cardTable.delRowsByIndex(tableid, index);
            break
        default:
            console.log(id, index);
            break;
    }
}
class Card extends Component{
    constructor(props){
        super(props);
        this.formId = formId;
        this.tableId = tableId;
        this.searchId = searchId;
        this.state={
            json:{},
            pk_org:'',
            curOrg:'',
            approveDetailshow: false,
            billid:null,
        }
    }

    initTemplate=(props,callback)=>{
        //createUIDom方法用于页面初始化时查询模板、按钮和context信息
        props.createUIDom(
            {
                pagecode:pageId //页面id
            },
            (data)=>{
                if(data){
                    if(data.template){
                        // props.meta.setMeta(data.template)
                        let meta = data.template;
                        this.modifierMeta(props,meta)
                        props.meta.setMeta(meta);

                    }
                    if(data.button){
                        // props.button.setButtons(data.button)
                        let button = data.button;
                        props.button.setButtons(button);
                        this.toggleShow(props);

                    }
                    if(data.context){
                        if(data.context.pk_org && data.context.org_Name){
                            this.state.curOrg = {
                                refname:data.context.org_Name,
                                refpk:data.context.pk_org
                            }
                        }

                    }
                    callback && callback();
                }
            }
        )

    }

    modifierMeta(props,meta){
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

        tableIds.forEach(item=>{
            let porCol = {
                itemtype:'customer',
                attrcode:'opr',
                label:this.state.json['10100CRESP-000023'], /**国际化处理：操作 */
                visible:true,
                className:'table-opr',
                width:200,
                fixed:'right',
                render:(text,record,index)=>{
                    let status = props.cardTable.getStatus(item);
                    let tableBtnAry = status === 'browse' ? ['Spread'] : ['Detail'];
                    if (!(status == 'browse')) {
                        tableBtnAry.push('Delline');
                    }
                    return props.button.createOprationButton(
                        tableBtnAry,
                        {
                            area: "table-opr-area",
                            buttonLimit:3,
                            onButtonClick:(props,id)=>tableButtonClick(props,id,text,record,index,item)
                        }
                    )
                }
            };
            meta[item].items.push(porCol);
        })
        return meta;
    }
    
    componentDidMount() {
        //json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
        let callback = (json, status, intl) => {
            if (status) {
                this.setState({ json }, () => {
                    // this.initTemplate(this.props)
                    this.initTemplate(this.props, ()=>{
                        this.props.form.setFormStatus(this.formId,'edit')
                        let BillStatus = -1
                       //getUrlParam(pop)  获取页面参数
                        let status = this.props.getUrlParam('status');
                        if(status != "add"){
                            let pk = this.props.getUrlParam('id')
                            this.getdata(pk,(billstatus)=>{
                                let codeedit = this.props.getUrlParam("codeedit")
                                let vbillnumedit = this.props.getUrlParam("vbillnumedit")
                                //设置一下是否可编辑两个编码
                                if(status == 'edit'){
                                    //code 信用控制域编码  billno billno 申请单号
                                    this.props.form.setFormItemsDisabled(this.formId, { billno: !vbillnumedit })
                                    this.props.form.setFormItemsDisabled("creditbaseinfo", { code: !codeedit })
                                }
                                //初始化一下特殊子表的按钮状态
                                if(status == 'edit' || status == 'add'){
                                    this.updateSpeTableBtnStatus(billstatus,'edit')
                                }
                                else{
                                    this.updateSpeTableBtnStatus(billstatus)
                                }
                            });
                        }
                        else{
                            this.setDefaultValue(undefined,()=>{
                                this.props.form.setFormItemsValue(formId, { 'pk_org': { value: this.state.curOrg.refpk, display: this.state.curOrg.refname } });
                                this.afterEvent(this.props, formId, 'pk_org', this.state.curOrg)
                                this.updateSpeTableBtnStatus(-1, 'edit')
                            });
                        }
                    });
                })   // 保存json和inlt到页面state中并刷新页面
            }
        }
        getMultiLang({ moduleId: '10100CRESP', domainName: 'uapbd', callback })
    }


    updateSpeTableBtnStatus(billStatus = -1, mainFormStatus = 'browse', speTableStatus = { finance: 'browse', sale: "browse", "creditctl": "browse" }) {
        // let speTableIds = ['finance', 'sale', 'creditctl']
        let speTableBtnPre = ['Finan', 'Sale', "Credit"]	//财务信息和采购信息按钮前缀
        let speTableRefreshBtn = ['FinanceRefresh', 'SaleRefresh', 'CreditctlRefresh'];
        let speTableIds  = ['financeorgs']
        let speBtnObj = {}
        speTableIds.forEach((item, index) => {
            let tableStatus = speTableStatus[item]
            if (mainFormStatus == 'edit' || mainFormStatus == 'add' || billStatus != -1) {
                speBtnObj[`${speTableBtnPre[index]}Edit`] = false
                speBtnObj[`${speTableBtnPre[index]}Save`] = false
                speBtnObj[`${speTableBtnPre[index]}Cancel`] = false
                speBtnObj[speTableRefreshBtn[index]] = false
            }
            else if (tableStatus == 'edit' || tableStatus == 'add') {
                speBtnObj[`${speTableBtnPre[index]}Edit`] = false
                speBtnObj[`${speTableBtnPre[index]}Save`] = true
                speBtnObj[`${speTableBtnPre[index]}Cancel`] = true
                speBtnObj[speTableRefreshBtn[index]] = false
            }
            else {
                speBtnObj[`${speTableBtnPre[index]}Edit`] = true
                speBtnObj[`${speTableBtnPre[index]}Save`] = false
                speBtnObj[`${speTableBtnPre[index]}Cancel`] = false
                speBtnObj[speTableRefreshBtn[index]] = true
            }
        })
        this.props.button.setButtonVisible(speBtnObj);
    }


    setDefaultValue = (data,callback) =>{
        if(data){
            data.preBillCode = this.preBillCode
            data.preCredCode = this.preCredCode
            data.hasPreBillCode = this.hasPreBillCode
            data.haspreCredCode = this.haspreCredCode
        }
        ajax({
            url:addUrl,
            data,
            success:(res)=>{
                if(res.data){
                   Utils.filterEmptyData(res.data[this.formId][this.formId].rows[0].values);
                   Utils.filterEmptyData(res.data.creditbaseinfo.creditbaseinfo.rows[0].values);
                   this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId][this.formId] });
                   this.props.form.setAllFormValue({ ['creditbaseinfo']: res.data.creditbaseinfo.creditbaseinfo });
                //    this.props.form.setFormItemsValue(formId, { billstatus: { value: '-1', display: this.state.json['10100CRESP-000011'] } })
                    // 对于目的组织，进行一下默认赋值，如果模板上没有的话
                    //0 本组织 1 集团  2 全局 
                    if(!res.data[this.formId][this.formId].rows[0].values.destorg) {
                        this.props.form.setFormItemsValue(this.formId, {destorg: {value: '0'}})
                    }

                    this.setItemsProperty(res);

                    this.preBillCode = res.data.preBillCode
                    this.preCredCode = res.data.preCredCode
                    this.hasPreBillCode = res.data.hasPreBillCode
                    this.haspreCredCode = res.data.haspreCredCode

                    let pk_org = res.data.creditbaseinfo.creditbaseinfo.rows[0].values.pk_org ? res.data.creditbaseinfo.creditbaseinfo.rows[0].values.pk_org.value : ''
        
                    //四个字段需要根据供应商基本信息的pk_org字段进行参照
                    let meta = this.props.meta.getMeta()

                    this.props.meta.setMeta(meta)
                }
                callback && callback();
            },
            
            error: (res) => {
                toast({ color: 'danger', content: res.message });
                return;
            }
        })
    }

    /**
     * setItemsProperty
     */
    
    setItemsProperty = (res)=>{
        //信用控制域申请单主要信息
        let pfData = res.data[this.formId][this.formId].rows[0];
        //信用控制域申请单基本信息
        let baseData = res.data['creditbaseinfo']['creditbaseinfo'].rows[0];
        //申请组织
        let pk_org = pfData.values['pk_org'];
        //单据号
        let billno = pfData.values['billno '];
        //目的组织
        let destorg = pfData.values['destorg'];

        //单据号为空可编辑
        let billNumEditable = res.data.billnoIsEditable == 'Y' ? true : false;
        this.props.form.setFormItemsDisabled(this.formId,{'billno':!billNumEditable});

        let credCodeEditable = res.data.cstBillNumCanEdit == 'Y' ? true : false
        this.props.form.setFormItemsDisabled('creditbaseinfo',{code: !credCodeEditable});
        if(!billNumEditable){
            if(this.state.billNumInitState == null){
                this.state.billNumInitState = this.props.form.getFormItemsValue(this.formId,'billno');
            }
            this.props.form.setFormItemsRequired(this.formId,{'billno':false});
        }else{
            if(this.state.billNumInitState != null){
                this.props.form.setFormItemsRequired(this.formId,{'billno':this.state.billNumInitState})
            }
        }


           
    }

     

    /**
     * afterEvent 事件
     */

    afterEvent = (props,moduleId,key,value, changedrows,i,s,g) => {
       

        //includes() 方法用来判断一个数组是否包含一个指定的值，如果是返回 true，否则false。
        if(eventItems.includes(key)){
            
            let data = {};

            // let creditpf = this.props.form.getAllFormValue('creditpf');
            let creditpf = this.props.form.getAllFormValue(this.formId);
            let creditbaseinfo = this.props.form.getAllFormValue('creditbaseinfo');

            data.CreditPfVO = creditpf;
            data.CreditbaseinfoVO = creditbaseinfo;
            data.key = key;
            data.status = this.props.getUrlParam('status');

            if(key == 'pk_org'){
                props.meta.getMeta()['creditbaseinfo'].items.forEach(item =>{
                    if (['pk_exratescheme', 'pk_timezone'].includes(item.attrcode)) {
                        item.queryCondition = {
                            'pk_org': value.value
                        };
                    }
                   
                })
            }

             //目的组织为本组织时
            if (key == 'destorg') {
                let disableFlag = value.value == '0' ? true : false;
                this.props.form.setFormItemsDisabled('creditbaseinfo', { 'pk_exratescheme': disableFlag, 'pk_timezone': disableFlag });
            }
            this.setDefaultValue(data);

        }
    }


    //通过单据id查询单据信息
    getdata = (pk, callback ,sepTables = []) => {
        let data = {pk};
        ajax({
            url:queryCardUrl,
            data,
            success:(res)=>{
                let retBillStatus = -1
                if(res.data){
                    if(res.data.head){
                        let formData = {
                            [this.formId]:res.data.head[this.formId],
                            "creditbaseinfo":res.data['creditbaseinfo']['creditbaseinfo']
                        }
                        this.props.form.setAllFormValue(formData)
                        retBillStatus = res.data.head[this.formId].rows[0].values.approvestatus.value
                    }
                    if(res.data.bodys){
                        if(sepTables.length>0){
                            res.data.bodys.forEach((item,index)=>{
                                speTables.forEach((tableId) => {
                                    if (item.hasOwnProperty(tableId)) {
                                        this.props.cardTable.setTableData(tableId, res.data.bodys[index][tableId])
                                    }
                                })
                            })
                            return;
                        }

                        res.data.bodys.forEach((item, index) => {
                            tableIds.forEach((tableId) => {
                                if (item.hasOwnProperty(tableId)) {
                                    this.props.cardTable.setTableData(tableId, res.data.bodys[index][tableId])
                                }
                            })
                        })
                    }
                }
                else {
                    this.props.form.EmptyAllFormValue(this.formId);
                    this.props.form.EmptyAllFormValue('creditbaseinfo')
                }
                this.toggleShow(this.props, pk == '' || pk==null ? true:false);
                this.setState(this.state);
                if(callback && typeof callback == 'function'){
                    callback(retBillStatus)
                }
            }

        })

    }



    toggleShow(props, onlyAdd = false) {
        let showBtn = props.getUrlParam('showBtn');
        let status = props.getUrlParam('status');
        status = status == 'add' || status == 'edit' ? 'edit' : 'browse'
        let flag = status === 'browse' ? false : true;
    
        if (showBtn && showBtn == 'false') {
            props.button.setButtonVisible(['Edit', 'Add', 'Delete', 'Refresh', 'PrintGrp', 'Print', 'Output', 'CommitGrp', 'Commit', 'Callback', 'Bankacc', 'Back', 'Attment', 'ApproveInfo', 'Save', 'Cancel', 'AddLine', 'DelLine'], false);
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        } else {
            if (onlyAdd) {
                props.button.setButtonVisible(['Edit','Save', 'Cancel', 'AddLine', 'Back', 'DelLine', 'Delete', 'Refresh','PrintGrp', 'Print', 'Output', 'CommitGrp', 'Commit', 'Callback', 'Bankacc', 'Attment', 'ApproveInfo'], false);
                props.button.setButtonVisible(['Add'], true)
                // props.button.setButtonVisible(['Save', 'Cancel', 'AddLine', 'DelLine', 'Back', 'Print', 'Commit'], false);
                // props.button.setButtonVisible(['Edit', 'Add', 'Delete' ,'Refresh', 'PrintGrp', 'Output', 'CommitGrp', 'Callback', 'Bankacc', 'Attment', 'ApproveInfo'], true);
            }
            else {
                // 按钮的显示状态
                if (status == 'edit' || status == 'add') {
                    props.button.setButtonVisible(['Edit', 'Add', 'Delete', 'Refresh',  'PrintGrp', 'Print', 'Output', 'CommitGrp', 'Commit', 'Callback', 'Bankacc', 'Back', 'Attment', 'ApproveInfo'], false);
                    props.button.setButtonVisible(['Save', 'Cancel', 'AddLine', 'DelLine'], true);
                    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
                } else {
                    //返回按钮换成图标，不再用按钮，此处先隐藏
                    props.button.setButtonVisible(['Save', 'Cancel', 'AddLine', 'DelLine', 'Back', 'Print', 'Commit'], false);
                    props.button.setButtonVisible(['Edit', 'Add', 'Delete' ,'Refresh', 'PrintGrp', 'Output', 'CommitGrp', 'Callback', 'Bankacc', 'Attment', 'ApproveInfo'], true);
                  //  props.button.setButtonVisible(['Edit', 'Add', 'Delete' ,'Refresh',  'Output', 'CommitGrp', 'Callback', 'Bankacc', 'Attment', 'ApproveInfo'], false);
                    
                    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
                }
                let billstate = props.form.getFormItemsValue(formId, 'approvestatus').value;
                //'-1'自由态，'3' 提交态，'1' 审批通过
                if (billstate == '-1') {
    
                    props.button.setButtonDisabled(['CommitGrp', 'Edit', 'Delete', 'Bankacc'], false);
                    props.button.setButtonVisible(['Callback', 'ApproveInfo'], false);
    
                } else if (billstate == '3' || billstate == '1') {
    
                    props.button.setButtonVisible(['Edit', 'Delete', 'Bankacc'], false);
                    props.button.setButtonDisabled(['ApproveInfo'], false);
                    props.button.setButtonDisabled(['CommitGrp'], true);
                } else {
                    props.button.setButtonVisible(['CommitGrp', 'Callback', 'Edit', 'Delete', 'Bankacc'], false);
                    props.button.setButtonDisabled('ApproveInfo', false);
                }
            }
        }
        //返回图标控制
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: status === 'browse'
        });

        // this.setState({
        //     backVisible: status == 'browse' 
        // })
        setTimeout(() => props.form.setFormStatus(formId, status), 1);
        setTimeout(() => props.form.setFormStatus('creditbaseinfo', status), 1)
        tableIds.forEach(item => {
            if (item != 'finance' && item != 'sale' && item != 'creditctl') {
                props.cardTable.setStatus(item, status);
            }
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

    buttonClick = (props, id)=>{
        let _this = this;
        switch (id) {
            case 'Add':
                // //EmptyAllFormValue**(moduleId)| 清空表单所有数据
                props.form.EmptyAllFormValue(this.formId);
                props.form.EmptyAllFormValue('creditbaseinfo');
                //设置表单为add态   setFormStatus**(moduleId, status)| 设置表单状态 
                props.form.setFormStatus(this.formId,'add');
                props.form.setFormStatus('creditbaseinfo','add')
                //设置子表为空  遍历各个子表 设置为空
                tableIds.forEach(item =>{
                    setTimeout(()=>props.cardTable.setTableData(item,{rows:[]}),1)
                })
                //当子表为一个的时候，可以这样写
                //setTimeout(()=>props.cardTable.setTableData('creditbaseinfo',{rows:[]}),1)
                props.setUrlParam({
                    pagecode:pageId,
                    status:'add'
                })
                this.setDefaultValue(undefined,()=>{
                    this.props.form.setFormItemsValue(this.formId,{'pk_org':{value:this.state.curOrg.refpk,display:this.state.curOrg.refname}});
                    this.afterEvent(props,formId,'pk_org',this.state.curOrg);
                    this.toggleShow(props)
                    this.updateSpeTableBtnStatus(-1,'edit')
                })
                break;
            case 'Save':
                this.saveClick(props)
                break;
            case 'Back':
                props.pushTo(listUrl, {
                    pagecode: pagecode_list,
                    // appcode: appId,
                    status: 'browse'
                })
                break;
            case 'Cancel':
                promptBox({
                    color: "warning",
                    title: this.state.json['10100CRESP-000009'],/* 国际化处理： 确认取消*/
                    content: this.state.json['10100CRESP-000010'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick: this.Cancel.bind(this, props)
                })
                break;
            case 'Back':
                props.pushTo('/list', {
                    pagecode: '10100CRESP_list',
                })
                break;
            case 'Edit':
                this.valid(props,'edit',this.edit.bind(this,props));
                break;
            case 'Delete':
                promptBox({
                    color:'warning',
                    title: this.state.json['10100CRESP-000018'],/**国际化处理：确认删除 */
                    content: this.state.json['10100CRESP-000019'],/**国际化处理：是否确认要删除？ */
                    beSureBtnClick:this.delConfirm.bind(this)
                })
                break;
            case 'Refresh':
                this.refresh(props);
                break;
            case 'ApproveInfo':
                this.setState({
                    approveDetailshow:true,
                    billid:props.form.getFormItemsValue(formId,pk_item).value
                });
                break;
            case 'PrintGrp':
                this.onPrint();
                break;
            case 'Print':
                this.onPrint();
                break;
            case 'Output':
                this.onOutput();
                break;
            case 'Attment':
                this.Attment();
                break;
            case 'CommitGrp':
                this.pfProcess(commitUrl);
                break;
            case 'Commit':
                this.pfProcess(commitUrl);
                break;
            case 'Callback':
                this.pfProcess(callbackUrl);
                break;

        }

    }

    /**
     * 删除
     */

     delConfirm=()=>{
         ajax({
             url:deleteUrl,
             data:{
                 deleteinfo:[
                     {
                         pk_org:this.props.form.getFormItemsValue(this.formId,'pk_org').value,
                         id:this.props.getUrlParam('id') == null ? this.props.form.getFormItemsValue(this.formId,pk_item).value:this.props.getUrlParam('id'),
                         ts:this.props.form.getFormItemsValue(this.formId,'ts').value
                     }

                 ]
             },
             success:(res)=>{
                 if(res){
                     this.props.pushTo(listUrl,{
                         pagecode:pagecode_list,
                         appcode:appId,
                         status:'browse'
                     });
                 }
             }
         });

     };

    /**
     * 保存
     */
  
     //保存单据
     saveClick = (props) => {
        let url = saveUrl;//新增保存
        if (this.props.getUrlParam('status') === 'edit') {
            url = updateUrl;//修改保存
        }
        let finalData = {}
        if (!props.form.isCheckNow(this.formId)) {
            return;
        }

        let mainFormData = props.form.getAllFormValue(this.formId)
        let baseInfoData = props.form.getAllFormValue('creditbaseinfo')
        finalData.CreditPfVO = mainFormData
        finalData.CreditbaseinfoVO = baseInfoData
        //保存每个子表信息
        tableIds.forEach(item => {
            if (!(item == 'creditbaseinfo')) {
                finalData[item] = props.cardTable.getAllData(item);
            }
        })

        //供应商基本信息校验
        let baseInfoMeta = this.props.meta.getMeta()
        baseInfoMeta = baseInfoMeta.creditbaseinfo.items
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
            afterInsertToastInfo = `${this.state.json['10100CRESP-000014']}[${emtpyNesItems.join('],[')}]`/* 国际化处理： 信用控制域信息校验失败,详细信息如下,下列字段值不能为空*/
            mainFormData.rows[0].values.memo.value = afterInsertToastInfo
        }
        else {
            // 所有信息都已经录入，清除异常信息字段
            mainFormData.rows[0].values.memo.value = null
        }

        finalData.preCredCode = this.preCredCode
        finalData.haspreCredCode = this.haspreCredCode

        ajax({
            url: url,
            data: finalData,
            success: (res) => {
                let pk = res.data;
                props.setUrlParam({
                    pagecode: pageId,
                    // appcode: appId,
                    status: 'browse',
                    id: pk
                });
                setDefData('preid', dataSource, pk);
                this.getdata(pk, (billstatus) => {
                    this.updateSpeTableBtnStatus(billstatus, 'browse')
                });

                //业务参数设置当中允许违反规则校验并且必输项未填的话，成功保存之后需要在界面上展示一下提示信息
                if (afterInsertToastInfo) {
                    toast({ color: 'warning', content: afterInsertToastInfo })
                }
                else {
                    toast({ color: 'success', title: this.state.json['10100CRESP-000017'] })/* 国际化处理： 保存成功！*/
                }
            }
        })
    }

    /**
     * 修改
     */

    edit = (props) => {
        props.setUrlParam({
            pagecode: pageId,
            // appcode: appId,
            status: 'edit',
            id: props.getUrlParam('id')
        });
        this.toggleShow(props)
        this.updateSpeTableBtnStatus(-1, 'edit')
    }

    //action  edit
    valid = (props, action, callback) => {

        let pk = props.form.getFormItemsValue(formId, pk_item).value;
        let data = { pk, action };

        ajax({
            url: validUrl,
            data,
            success: res => {
                if (res && res.data) {
                    this.props.form.setFormItemsDisabled(this.formId, { 'billnumber': !res.data.vbillnumedit });
                    this.props.form.setFormItemsDisabled('creditbaseinfo', { code: !res.data.codeedit });
                    callback && callback();
                }
            }
        })
    }

    /**
     * 确认取消
     */

    Cancel = (props) => {

        // let pk = props.getUrlParam('id')==undefined?getDefData('preid',dataSource):this.props.getUrlParam('id');
        //缓存区最后一条
        //卡片上点击新增按钮后，未保存，又点了取消按钮, 则需调用方法getCurrentLastId，获取当前列表最后一条数据渲染界面**
        let pk = getCurrentLastId(dataSource);
        this.getdata(pk, (billstatus) => {
            this.updateSpeTableBtnStatus(billstatus)
        })
        props.form.setFormStatus(this.formId, 'browse')
        props.form.setFormStatus('creditbaseinfo', 'browse')
        tableIds.forEach(item => {
            props.cardTable.setStatus(item, 'browse')
        })
       
        props.setUrlParam({
            pagecode: pageId,
            // appcode: appId,
            status: 'browse'
        });
        this.toggleShow(props, pk == '' || pk == null ? true : false)
        this.setDefaultValue({ status: "cancel" });
       
    }
  
    /**
     * 刷新
     */
    refresh=(props)=>{
        //setUrlParam(params)  设置页面参数
        props.setUrlParam({
            pagecode:pageId,
            status:props.getUrlParam('status'),
            id:props.getUrlParam('id')
        })
        this.getdata(props.getUrlParam('id'),()=>{
            toast({title:this.state.json['10100CRESP-000031'],color:'success'});/**国际化处理：刷新成功 */
        })
    }
    /**
     * 提交
     */
    pfProcess(url,content){
        let finalData={
            pks:[this.props.getUrlParam('id')],
            content
        }
        ajax({
            url,
            data:finalData,
            success:res=>{

                if(url == commitUrl){
                    if(res.data.workflow && (res.data.workflow == 'approveflow')){
                        this.setState({
                            compositedata:res.data,
                            compositedisplay:true
                        });
                    }else{
                        toast({color:'success',content:this.state.json['10100CRESP-000029']});/**国际化处理：提交成功 */
                        this.setState({
                            compositedata:null,
                            compositedisplay:false
                        });
                        this.getdata(this.props.getUrlParam('id'),(billstatus)=>{
                            this.updateSpeTableBtnStatus(billstatus)
                        });
                    }
                }
                else if(url == callbackUrl){
                    toast({content:this.state.json['10100CRESP-000030'],color:'success'});/**国际化处理：单据已成功收回 */
                    this.getdata(this.props.getUrlParam('id'),(billstatus)=>{
                        this.updateSpeTableBtnStatus(billstatus)
                    });
                }
            }
        })
    }
    /**
     * 打印
     */
    onPrint = () => {
        let allData = this.props.form.getAllFormValue(formId);

        if(allData.length === 0){
            toast({color:'warning',content:this.state.json['10100CRESP-000025']});/*国际化处理：无可打印的数据 */
            return;
        }
        let pks = [];
        pks.push(allData.rows[0].values[pk_item].value);

        print(
            'pdf',
            printUrl,
            {
                funcode:printFunCode,//功能节点编码
                nodekey:printNodeKey,//模板节点编码
                oids:pks
            }
        )

    }
    /**
     * 输出
     */
    onOutput = ()=>{
        let allData = this.props.form.getAllFormValue(formId);
        if(allData.length === 0){
            toast({color:'warning',content:this.state.json['10100CRESP-000025']});/*国际化处理：无可打印数据 */
            return;
        }
        let pks = [];
        pks.push(allData.rows[0].values[pk_item].value);

        this.setState({
            ids:pks
        },this.refs.printOutput.open());
    }
    /**
     * 附件管理
     */
    Attment = () =>{
        this.state.showlogoUploader = true;
        this.setState(this.state);
    }
    /**
     * 关闭附件窗口
     */
    onHideUploader = () =>{
        this.state.showlogoUploader = false;
        this.setState(this.state);
    }
    /**
     * 分页翻页
     */
    pageInfoClick = (props,pk)=>{
        let data = {
            "pk":pk,
            "pageid":pageId
        };
        ajax({
            url:queryCardUrl,
            data:data,
            success:(res)=>{
                if(res.data.head){
                    props.form.setAllFormValue({ [formId]: res.data.head[formId]});
                    props.setUrlParam(pk) // 动态修改地址栏中的id的值
                }
                if(res.data.body){
                    props.editTable.setTableData(tableId,res.data.body[tableId]);
                }
                this.toggleShow(props);
            }
        })
    }

    getTableHead = (tableId)=>{
        let { createButtonApp } = this.props.button
        return(
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                   {createButtonApp({
                       area:'definition-icons',//按钮注册中的按钮区域
                       onButtonClick:this.addLindeClick.bind(this,tableId)
                   })}
                   {this.props.cardTable.createBrowseIcons(tableId,{
                       iconArr:['close','open','max','setCol'],
                       maxDestAreaId:'nc-bill-card'
                   })}
                </div>
            </div>
        )
    }

    addLindeClick=(tableid)=>{
        if(tableid == 'financeorgs'){
            this.props.cardTable.addRow(tableid);
        }else{
            this.props.cardTable.addRow(tableid);
        }
    }
    /**
     *指派
     */
    getAssginUsedr = (value) => {
        this.pfProcess(commitUrl,value);
    }

    turnOff = () =>{
        this.setState({
            compositedata:null,
            compositedisplay:false
        })
    }
    
    /**
     * 关闭审批详情
     */
    closeApprove=()=>{
        this.setState({
            approveDetailshow:false
        })
    }
    /**
     * 返回按钮操作
     */
    onReturnClick(){
        this.props.pushTo(listUrl,{
                 pagecode:pagecode_list,
                //  appcode:appId,
                 Status:'browse'
        })
    }

    render(){
        let { BillHeadInfo, button, cardPagination, form, cardTable} = this.props;
        const { createBillHeadInfo } = BillHeadInfo;
        const { createCardPagination } = cardPagination;
        let  { createButtonApp } = button;
        let  { createForm } = form;
        let  { createCardTable } = cardTable;
        let status = this.props.getUrlParam('status');
        let iconItem = this.state.showBaseInfo ? 'icon-jiantouxia1' : 'icon-jiantouyou'

        let groupItem = this.state.showBaseInfo ? "show-form" : "hide-form"

        return(
            <div className='nc-bill-extCard'>
                <div className='nc-bill-top-area'>
                    {/* //固钉 NCAffix */}
                    <NCAffix>
                        <NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                           {/* <NCBackBtn className='title-search-detail' style={{ 'line-height': '32px', display: this.state.backVisible ? 'inline' : 'none' }}
                                onClick={this.buttonClick.bind(this, this.props, 'Back')}
                            >
                            </NCBackBtn>
                            <div className='header-title-search-area'>
                                {createBillHeadInfo({
                                    title:this.state.json['10100CRESP-000000'],
                                    initShowBackBtn: false
                                })}
                            </div> */}

                            <div className='header-title-search-area'>
                                {createBillHeadInfo({
                                    title:this.state.json['10100CRESP-000000'],
                                    backBtnClick:this.onReturnClick.bind(this),
                                    initShowBackBtn:status == 'browse'
                                })}
                            </div>
                            <div className="header-button-area">
                                {createButtonApp({
                                    area: 'header-button-area',//按钮注册中的按钮区域
                                    //buttonLimit: 5,
                                    onButtonClick: this.buttonClick.bind(this)
                                    //popContainer: document.querySelector('.header-button-area')
                                })}
            
                                {createCardPagination({   //卡片翻页组件
                                    handlePageInfoChange: this.pageInfoClick.bind(this)  //handlePageInfoChange:卡片翻页事件
                                })}
                            </div>
                        </NCDiv>
                    </NCAffix>
                      {/*//子表导航树*/}
                      {/* 楼层 NCAnchor */}
                    <NCAnchor>
                        <NCScrollLink 
                            to={this.formId}
                            spy={true}
                            smoot={true}
                            duration={300}
                            offset={-100}
                            >
                            <p>{this.state.json['10100CRESP-000001']}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to={'financeorgs'}
                            spy={true}
                            smoot={true}
                            duration={300}
                            offset={-100}
                            >
                            <p>{this.state.json['10100CRESP-000002']/*财务组织 */}</p> 
                            </NCScrollLink>
                    </NCAnchor>
                    <NCScrollElement name={this.formId}>
                        <div className="nc-bill-form-area">
                            {createForm(this.formId,{
                                // onAfterEvent:this.onAfterEvent.bind(this)
                            })}
                        </div>
                    </NCScrollElement>
                    <NCScrollElement name={this.state.json['10100CRESP-000001']/**财务组织 */}>
                        <div className="nc-bill-form-area">
                            <div className='group-form-wrapper'>
                                <NCDiv fieldid="creditbaseinfo" areaCode={NCDiv.config.Group} className="group-form-name">
                                    <span
                                       className={`toggle-form-icon iconfont ${iconItem}`}
                                       onClick={()=>{
                                           let show = !this.state.showBaseInfo
                                           this.setState({
                                               showBaseInfo:show
                                           });
                                       }}
                                    />
                                      <span className="name">{this.state.json['10100CRESP-000001']/* 国际化处理： 财务组织*/}</span>
                                </NCDiv>
                                <div className={`group-form-item ${groupItem} `}>
                                    {createForm('creditbaseinfo',{
                                         onAfterEvent: this.afterEvent.bind(this)
                                    })}
                                </div>
                            </div>
                        </div>
                    </NCScrollElement>
                </div>

                <div className="nc-bill-bottom-area">
                    <NCScrollElement name={'financeorgs'}>
                        <div className="nc-bill-table-area">
                            {createCardTable("financeorgs", {
                                showIndex:true,    //showIndex  控制序号展示和隐藏  true或false 
                                tableHead:this.getTableHead.bind(this,'financeorgs')
                            })}
                        </div>
                    </NCScrollElement>
            
                </div>
                <PrintOutput
                    ref='printOutput' //定义组件元素的ref，利用此值进行显示隐藏打印输出组件的弹框
                    url={printUrl}   //url | 要链接的打印后台地址
                    data={{         //data | 要传输给后台的数据 
                        funcode:printFunCode,//功能节点编码
                        nodeKey:printNodeKey,//模板节点编码
                        oids:this.state.ids,
                        outputType:'output'
                    }}
                />
                {/* 附件管理 */}
                {this.state.showlogoUploader && <NCUploader
                    //billId   单据Id    String    必须
                    billId = {'uapbd/6d6d4a15-d9bb-4b0c-9da3-80760872bf87/'+this.props.getUrlParam('id')}
                    //placement   上传控件相对弹窗的位置  String  可选
                    placement={'bottom_right'}
                    //multiple  是否支持批量上传   Boolean   可选 默认值为false，不支持
                    multiple={false}
                    //onHide   点击关闭的钩子函数   Function   可选
                    onHide={this.onHideUploader.bind(this)}
                />}
                {this.state.compositedisplay ? <ApprovalTrans
                      title={this.state.json['10100CRESP-000027']}/**国际化处理：指派 */
                      data={this.state.compositedata}
                      display={this.state.compositedisplay}
                      getResult = {this.getAssginUsedr.bind(this)}
                      Cancel={this.turnOff.bind(this)}

                />:""}
                <ApproveDetail
                    show={this.state.approveDetailshow}
                    close={this.closeApprove.bind(this)}
                    billtype='10kH'                      // // 此处billtype为交易类型
                    billid={this.state.billid}
                />
            </div>
        )
    }

}


Card = createPage({

})(Card)
export default Card;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65