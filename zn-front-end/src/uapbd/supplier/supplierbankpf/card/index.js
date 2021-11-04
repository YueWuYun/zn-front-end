//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, {Component} from 'react';
import {ajax, base, cardCache, createPage, getBusinessInfo, high, print, promptBox, toast,createPageIcon} from 'nc-lightapp-front';
// import ApprovalTrans from '../../../../uap/public/excomponents/approvalTrans';
import createUIDom from "../../../public/utils/BDCreateUIDom";
import Utils from "../../../public/utils";
import {imageScan, imageView} from "sscrp/rppub/components/image";
const {showFormular } = Utils;
const {NCDiv} = base;

let { getCacheById, updateCache ,addCache,getCurrentLastId ,getNextId, deleteCacheById ,setDefData, getDefData} = cardCache;
let businessInfo = getBusinessInfo();
let { NCAnchor, NCScrollLink, NCScrollElement, NCAffix ,NCBackBtn } = base;
const { NCUploader,PrintOutput,ApproveDetail, ApprovalTrans} = high;

const formId1 = 'supplierbankpf';
const formId2 = 'supplierbank';
const tableId = 'bankaccsub';
const dataSource = 'uapbd.supplier.supplierbankpf.dataSource'
const pk_item = 'pk_supplierbankpf';

const linkpagecode='10140SBAPF_card';

const pageId = '10140SBAPF_card';//页面id
const appcode = '10140SBAPF';//注册按钮的id


let urls={
    queryCardDataUrl:'/nccloud/uapbd/supplierbankpf/querypfCardData.do',
    queryDefaultDataUrl:'/nccloud/uapbd/supplierbankpf/querypfDefaultData.do',
    afterEventUrl:'/nccloud/uapbd/supplierbankpf/supbkpfafterEvent.do',
    saveUrl:'/nccloud/uapbd/supplierbankpf/supbkpfInsertData.do',
    updateUrl:'/nccloud/uapbd/supplierbankpf/supbkpfSaveData.do',
    deleteUrl:'/nccloud/uapbd/supplierbankpf/supbkpfDeleteData.do',
    commiturl:'/nccloud/uapbd/supplierbankpf/supbkpfCommitData.do',
    recallurl:'/nccloud/uapbd/supplierbankpf/supbkpfRecallData.do',
    printurl:'/nccloud/uapbd/supplierbankpf/supbkpfPrintData.do',
    cancelurl:'/nccloud/uapbd/supplierbankpf/supbkpfCancel.do',
    validateSupplierBankpfurl:'/nccloud/uapbd/supplierbankpf/supbkpfValiData.do',
};

let tableBtnAry =(props)=>{
    return props.cardTable.getStatus(tableId)==='browse'?['']:["delline"];;
}
class Card extends Component {
    constructor(props) {
        super(props);
        this.formId1 = formId1;
        this.formId2 = formId2;
        this.tableId = tableId;
        this.pageId = pageId;
        this.appcode = appcode;
        this.state = {
            stated:'browse',
            pks:[],
            supplierbankpfpk:null,
            compositedata: null,
            compositedisplay: false,
            showBaseInfo: true,
            json:{},
            inlt:null,
            sysParam:null,
            memo:null,
            isPrecode:true,
            hasApproveflowDef:true,
            userId:businessInfo.userId,
            showApprInfo:false,
            billId:null,
        };
        this.initTemplate(this.props, () => {
            let status = this.props.getUrlParam("status");
            let id = this.props.getUrlParam("id");
            const errParam = this.props.getUrlParam('errParam') || "";
            this.handleGtxidBillpx(errParam);
            if(status=="add"){
                this.setDefaultValue(status);
            }else{
                if(id && id != 'undefined'){
                    this.getData(status,id)
                }
            }
        });
    }

    handleGtxidBillpx = (errParam) => {
		let gtxid = "", billpx="", params={}, billtype="",billpkname="";
		if(errParam) {
			params = JSON.parse(errParam);
			console.log({params, params})
			gtxid = params.saga_gtxid.value || "";
			billpx = params.pk_supplierbankpf.value || "";
			billtype = params.pk_billtypecode.value || "10GZ";
			billpkname = "pk_supplierbankpf";
		}
		
		this.setState({gtxid,billpx, billtype, billpkname})
	}

    initTemplate = (props, callback) =>{
        createUIDom(props)(
            {
                pagecode: pageId
            },
            {
                moduleId: "10140SBAPF",domainName: 'uapbd'
            },
            (data, langData,inlt)=>{
                if(langData){
                    this.state.json = langData
                    if(inlt){
                        this.state.inlt = inlt
                    }
                }
                if(data){
                    if(data.template){
                        let meta = data.template;
                        this.modifierMeta(props, meta);
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    if(data.context){
                        if(data.context.pk_org&&data.context.org_Name){
                            setDefData("pk_org",dataSource,data.context.pk_org);
                        }
                    }
                    callback && callback();
                }
            }
        )
    }

    modifierMeta = (props, meta) => {
        let status = 'browse';


        meta[formId1].items.map((item)=>{
            if(item.attrcode == 'pk_org'){
                item.queryCondition=()=>{
                    return {'AppCode':appcode,
                        TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    }
                }
            }
            if(item.attrcode == 'supplier'){
                item.queryCondition=()=>{
                    return {
                        pk_org:this.props.form.getFormItemsValue(formId1,"pk_targetorg").value,
                        GridRefActionExt: 'nccloud.web.uapbd.supplier.supplierbankpf.action.SupplierGridRefExt'
                    }
                }
            }else if(item.attrcode == 'supplierbank'){
                item.refName = this.state.json['10140SBAPF-000021'];
                item.placeholder = this.state.json['10140SBAPF-000021'];
                item.queryCondition=()=>{
                    return {
                        isShowDisabledData : true,
                        accclass:3,
                        pk_cust:this.props.form.getFormItemsValue(formId1,"supplier").value
                    }
                }
            }
        })
        let porCol1 = {
            attrcode: 'opr',
            label: this.state.json['10140SBAPF-000002'],/* 国际化处理： 操作*/
            visible: true,
            className:'table-opr',
            width:'200px',
            itemtype: 'customer',
            fixed:'right',
            render:(text, record, index)=> {

                const btnArray = tableBtnAry(props);

                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table_opr_area",
                        buttonLimit: 3,
                        onButtonClick: (props, id ) => this.tableButtonClick(props, id,tableId, text, record, index)
                    }
                )
            }
        };
        meta[tableId].items.push(porCol1);
        return meta;
    }

    tableButtonClick = (props, id, tableId,text, record, index)=>{

        switch(id){

            case "delline"://删除行
                props.cardTable.delRowsByIndex(tableId, index);
                break;
            default:
                break;
        }
    }


    componentDidUpdate(){
        let formStatus = this.props.form.getFormStatus(this.formId1);
        if(formStatus === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    //按钮事件
    buttonClick(props, id) {
        let billdata = null;
        switch (id) {
            case 'add':
                props.form.EmptyAllFormValue(this.formId1)
                props.cardTable.setTableData(this.tableId, { rows: [] })
                this.props.pushTo("/card",{
                    status:'add',
                    pagecode:pageId,
                    id:props.getUrlParam('id')
                });
                this.setDefaultValue('add');
                break;
            case 'edit':
                ajax({
                    url: urls.validateSupplierBankpfurl,
                    data: {type:'edit',info:[{
                            id: props.getUrlParam('id')
                        }]},
                    success: (res) => {
                        this.props.pushTo("/card", {
                            status: 'edit',
                            pagecode:pageId,
                            id: props.getUrlParam('id')
                        });
                        this.toggleShow('edit');
                    }
                });
                break;
            case 'delete':
                ajax({
                    url: urls.validateSupplierBankpfurl,
                    data: {type:'delete',info:[{
                            id: props.getUrlParam('id')
                        }]},
                    success: (res) => {
                        promptBox({
                            color:"warning",
                            title: this.state.json['10140SBAPF-000005'],/* 国际化处理： 删除*/
                            content: this.state.json['10140SBAPF-000001'],/* 国际化处理： 您确定要删除所选数据吗?*/
                            beSureBtnClick: this.deleteBill.bind(this)
                        });
                    }
                });
                break;
            case 'save':
                this.saveBill();
                break;
            case 'refresh':
                this.getData(props.getUrlParam("status"),props.getUrlParam("id"),true,()=>{
                    toast({title:this.state.json['10140SBAPF-000004'],color:'success'})/* 国际化处理： 刷新成功！*/
                });
                break;
            case 'cancel':
                promptBox({
                    color:"warning",
                    title:this.state.json['10140SBAPF-000013'],/* 国际化处理： 取消*/
                    content:this.state.json['10140SBAPF-000014'],/* 国际化处理： 是否确认要取消?*/
                    beSureBtnClick:()=>{
                        if (props.getUrlParam('status') === 'add'){
                            let code = this.props.form.getFormItemsValue(this.formId1,'billno');
                            let pk_org = this.props.form.getFormItemsValue(this.formId1,'pk_org');
                            ajax({
                                url: urls.cancelurl,
                                data: {code: code.value,pk_org:pk_org.value},
                                success: (res) => {
                                    let id = getCurrentLastId(dataSource);
                                    props.pushTo("/card", {
                                        status: 'browse',
                                        pagecode:pageId,
                                        id: id
                                    });
                                    if(id==null){
                                        props.form.cancel(this.formId1);
                                        props.form.cancel(this.formId2);
                                        props.cardTable.resetTableData(this.tableId);
                                        this.props.button.setButtonVisible(['add', 'back'], true);
                                        this.props.button.setButtonVisible(['save','cancel','addline','edit','addline','delete','refresh','commit','approve','print','attachment','ImgView','ImgScan'], false);
                                        this.props.button.setDisabled(['edit','addline','delete','refresh','commit','approve','print','attachment','ImgView','ImgScan'],true);
                                        return;
                                    }
                                    let	pk = this.props.getUrlParam('id');
                                    if(pk && pk != 'undefined'){
                                        this.getData('browse',pk);
                                    }
                                }
                            })
                        }
                        if(props.getUrlParam('status')==='edit'){
                            props.form.cancel(this.formId1);
                            props.form.cancel(this.formId2);
                            props.cardTable.resetTableData(this.tableId);
                            props.pushTo("/card", {
                                status: 'browse',
                                pagecode:pageId,
                                id: props.getUrlParam('id')
                            });
                        }
                        this.toggleShow("browse");
                    },
                    cancelBtnClick:()=>{
                        return;
                    },
                    closeBtnClick:()=>{
                        return;
                    }
                })
                break;
            case 'back':
                this.props.pushTo("/list",{
                });
                break;
            case 'commit':
                ajax({
                    url: urls.validateSupplierBankpfurl,
                    data: {type:'commit',info:[{
                            id: props.getUrlParam('id')
                        }]},
                    success: (res) => {
                        ajax({
                            url:urls.commiturl,
                            data:{content:null,info:[{id:this.props.getUrlParam('id')}]},
                            success:(res)=>{
                                if(res&&res.data&&res.data.workflow && (res.data.workflow == 'approveflow'|| res.data.workflow == 'workflow')) {
                                    this.setState({
                                        compositedata: res.data,
                                        compositedisplay: true
                                    });
                                }else{
                                    if(res.data instanceof Array){
                                        toast({ color: 'success', title: this.state.json['10140SBAPF-000006'] });/* 国际化处理： 提交成功！*/
                                        this.getData(props.getUrlParam("status"),props.getUrlParam("id"),true);
                                    }else {
                                        toast({ color: 'warning', content: res.data });
                                    }
                                }
                            }
                        })
                    }
                });
                break;
            case 'recall':
                ajax({
                    url: urls.validateSupplierBankpfurl,
                    data: {type:'recall',info:[{
                            id: props.getUrlParam('id')
                        }]},
                    success: (res) => {
                        ajax({
                            url:urls.recallurl,
                            data:{info:[{id:this.props.getUrlParam('id')}]},
                            success:(res)=>{
                                toast({ color: 'success', content: this.state.json['10140SBAPF-000007'] });/* 国际化处理： 单据成功收回。*/
                                this.getData(props.getUrlParam("status"),props.getUrlParam("id"),true);
                            }
                        })
                    }
                });
                break;
            case "print":
                let printParam={
                    funcode: "10140SBAPF",
                    nodekey: 'supplierbankpfcard_ncc',
                    outputType:'print',
                };
                this.pintFunction(printParam);
                break;
            case 'output':
                let pk = this.props.form.getFormItemsValue(this.formId1,pk_item)
                if(pk==null){
                    return
                }
                let pks = [];
                pks.push(pk.value);
                console.log(pks)
                this.setState({
                    pks:pks
                },this.refs.printOutput.open())
                break;
            case 'addline':
                let number = props.cardTable.getNumberOfRows(tableId, false)
                props.cardTable.addRow(tableId,number,{"pk_currtype":{display: null,value: null},
                    "pseudocolumn":{display: null,value: 0},
                });
                break;
            case 'ApprInfo':
                //打开审批详情页
                this.setState({
                    billId: this.props.form.getFormItemsValue(this.formId1,'pk_supplierbankpf').value,
                    showApprInfo: true
                })
                break;
            case 'ImgView':
                billdata =  this.props.form.getAllFormValue(this.formId1);
                let billInfoMap = {}
                billInfoMap.pk_billid = this.props.getUrlParam('id');
                billInfoMap.pk_billtype = billdata.rows[0].values['pk_billtypecode'].value;
                billInfoMap.pk_tradetype = billdata.rows[0].values['pk_billtypecode'].value;
                billInfoMap.pk_org = billdata.rows[0].values['pk_org'].value;
                imageView(billInfoMap, 'iweb');
                break
            case 'ImgScan':
                billdata = this.props.form.getAllFormValue(this.formId1);
                billInfoMap = {}
                billInfoMap.pk_billid = this.props.getUrlParam('id');
                billInfoMap.pk_billtype = billdata.rows[0].values['pk_billtypecode'].value;
                billInfoMap.pk_tradetype = billdata.rows[0].values['pk_billtypecode'].value;
                billInfoMap.pk_org = billdata.rows[0].values['pk_org'].value;

                billInfoMap.BillType = billdata.rows[0].values['pk_billtypecode'].value;
                billInfoMap.BillDate = billdata.rows[0].values['creationtime'].value;
                billInfoMap.Busi_Serial_No = billdata.rows[0].values['pk_supplierbankpf'].value;
                billInfoMap.pk_billtype = billdata.rows[0].values['pk_billtypecode'].value;
                billInfoMap.OrgNo = billdata.rows[0].values['pk_org'].value;
                billInfoMap.BillCode = billdata.rows[0].values['billno'].value;
                billInfoMap.OrgName = billdata.rows[0].values['pk_org'].display;
                billInfoMap.Cash = '0';
                imageScan(billInfoMap, 'iweb');
                break
            default:
                break
        }
    }

    //打印功能函数
    pintFunction(param){
        let pk = this.props.form.getFormItemsValue(this.formId1,pk_item)
        if(pk==null){
            return
        }
        let pks = [];
        pks.push(pk.value);
        let userjson = `{type:'card'}`
        param.oids = pks;
        param.userjson = userjson;
        print(
            'pdf',
            urls['printurl'],
            param
        );
    }

    //设置表单默认值
    setDefaultValue = (status) =>{
        this.props.form.setFormStatus(this.formId1, status);
        this.props.form.setFormStatus(this.formId2, status);
        this.props.form.EmptyAllFormValue(this.formId1);
        this.props.form.EmptyAllFormValue(this.formId2);
        ajax({
            url: urls.queryDefaultDataUrl,
            data:{pk_org:getDefData("pk_org",dataSource),bankaccpk_org:getDefData("pk_org",dataSource)},
            success: (res) =>{
                showFormular(this.props,res,{
                    [formId1] : "form",
                    [formId2] : "form",
                    [tableId] : 'cardTable',
                });
                if(res.data){
                    if(res.data.form1[this.formId1]){
                        Utils.filterEmptyData(res.data.form1[this.formId1].rows[0].values);
                        this.props.form.setAllFormValue({ [this.formId1]: res.data.form1[this.formId1]});
                        this.props.form.setFormItemsDisabled(this.formId1,{'billno':!res.data['isCodeEdit']})
                        this.state.isPrecode = res.data['isPrecode'];

                        // 触发一下编辑后事件，修正一下供应商参照
                        let targetOrg = this.props.form.getFormItemsValue(this.formId1, 'targetorg')
                        if(!targetOrg && !targetOrg.value) {
                            targetOrg = {}
                        }
                        this.afterEvent(this.props, this.formId1, 'targetorg', targetOrg,null, null)
                    }
                    if(res.data["billCard"].head){
                        Utils.filterEmptyData(res.data["billCard"].head[this.formId2].rows[0].values);
                        this.props.form.setAllFormValue({ [this.formId2]: res.data["billCard"].head[this.formId2]});
                    }
                    if(res.data["billCard"].body){
                        this.props.cardTable.setTableData(this.tableId, res.data["billCard"].body[this.tableId]);
                    }
                }
            }
        },this.toggleShow(status))
    }

    //编辑后事件
    afterEvent=(props, moduleId, key, value,oldValue,ref)=>{
        switch(moduleId){
            case this.formId1:
                switch(key){
                    case 'pk_org':
                        let targetorgvalue = this.props.form.getFormItemsValue(this.formId1,"targetorg")
                        if(value.value&&value.value!=null){
                            setDefData("pk_org",dataSource,value.value);
                            ajax({
                                url: urls.queryDefaultDataUrl,
                                data:{
                                    pk_org:value.value,
                                    supplierbankpfbillno:this.props.form.getFormItemsValue(this.formId1,"billno").value,
                                },
                                success: (res) =>{
                                    showFormular(this.props,res,{
                                        [formId1] : "form",
                                        [formId2] : "form",
                                        [tableId] : 'cardTable',
                                    });
                                    if(res.data.form1[this.formId1]){
                                        this.props.form.setAllFormValue({ [this.formId1]: res.data.form1[this.formId1]});
                                        this.props.form.setFormItemsDisabled(this.formId1,{'billno':!res.data['isCodeEdit']})
                                        this.state.isPrecode = res.data['isPrecode'];
                                    }
                                    if(res.data["billCard"].head){
                                        this.props.form.setAllFormValue({ [this.formId2]: res.data["billCard"].head[this.formId2]});
                                    }
                                    if(res.data["billCard"].body){
                                        this.props.cardTable.setTableData(this.tableId, res.data["billCard"].body[this.tableId]);
                                    }
                                    if(targetorgvalue.value==0){
                                        this.props.form.setFormItemsValue(this.formId1,{'pk_targetorg':{value:value.value,display:value.display}});
                                        this.props.form.setFormItemsValue(this.formId2,{'pk_org':{value:value.value,display:value.display}});
                                    }else{
                                        this.props.form.setFormItemsValue(this.formId2,{'pk_targetorg':{value:businessInfo.groupId,display:businessInfo.groupName}});
                                        this.props.form.setFormItemsValue(this.formId2,{'pk_org':{value:businessInfo.groupId,display:businessInfo.groupName}});
                                    }
                                    this.props.form.setFormItemsValue(this.formId1,{'supplier':{value:null,display:null}});
                                    this.props.form.setFormItemsValue(this.formId1,{'supplierbank':{value:null,display:null}});
                                }
                            })
                        }
                        break;
                    case 'targetorg':
                        let orgvalue = this.props.form.getFormItemsValue(this.formId1,"pk_org")
                        if(value.value==0){
                            this.props.form.setFormItemsValue(this.formId1,{'pk_targetorg':{value:orgvalue.value,display:orgvalue.display}});
                            this.props.form.setFormItemsValue(this.formId2,{'pk_org':{value:orgvalue.value,display:orgvalue.display}});
                        }else if(value.value==1){
                            this.props.form.setFormItemsValue(this.formId1,{'pk_targetorg':{value:businessInfo.groupId,display:businessInfo.groupName}});
                            this.props.form.setFormItemsValue(this.formId2,{'pk_org':{value:businessInfo.groupId,display:businessInfo.groupName}});
                        }else if(value.value==2){
                            this.props.form.setFormItemsValue(this.formId1,{'pk_targetorg':{value:'GLOBLE00000000000000',display:'全局'}});
                            this.props.form.setFormItemsValue(this.formId2,{'pk_org':{value:'GLOBLE00000000000000',display:'全局'}});
                        }
                        this.props.form.setFormItemsValue(this.formId1,{'supplier':{value:null,display:null}});
                        this.props.form.setFormItemsValue(this.formId1,{'supplierbank':{value:null,display:null}});
                        break;
                    case 'supplier':
                        this.props.form.setFormItemsValue(this.formId1,{'supplierbank':{value:null,display:null}});
                        this.props.form.setFormItemsValue(this.formId2,{'accname':{value:value.display,display:null}});
                        if(this.props.form.getFormItemsValue(this.formId1,"opertype").value==1&&value){
                            this.props.form.setFormItemsDisabled(this.formId1,{'supplierbank':false})
                        }
                        break;
                    case 'opertype':
                        if(value.value==0){
                            this.props.form.setFormItemsValue(this.formId1,{'supplierbank':{value:null,display:null}});
                            this.props.form.setFormItemsDisabled(this.formId1,{'supplierbank':true})
                            this.props.form.setFormItemsRequired(this.formId1,{'supplierbank':false})
                        }else if(this.props.form.getFormItemsValue(this.formId1,"supplier").value){
                            this.props.form.setFormItemsDisabled(this.formId1,{'supplierbank':false})
                            this.props.form.setFormItemsRequired(this.formId1,{'supplierbank':true})
                        }
                        break;
                    case 'supplierbank':
                        if(value.values){
                            ajax({
                                url: urls.afterEventUrl,
                                data:{
                                    type:'supplierbank',
                                    pk_supplier:this.props.form.getFormItemsValue(this.formId1,"supplier").value,
                                    pk_supplierbank:value.values?value.values.pk_bankaccbas.value:null,
                                },
                                success: (res) =>{
                                    showFormular(this.props,res,{
                                        [formId1] : "form",
                                        [formId2] : "form",
                                        [tableId] : 'cardTable',
                                    });
                                    if(res.data){
                                        if(res.data["billCard"].head){
                                            this.props.form.setAllFormValue({ [this.formId2]: res.data["billCard"].head[this.formId2]});
                                        }
                                        if(res.data["billCard"].body){
                                            this.props.cardTable.setTableData(this.tableId, res.data["billCard"].body[this.tableId]);
                                        }
                                    }
                                }
                            })
                        }else{
                            ajax({
                                url: urls.queryDefaultDataUrl,
                                data:{pk_org:getDefData("pk_org",dataSource),bankaccpk_org:getDefData("pk_org",dataSource)},
                                success: (res) =>{
                                    showFormular(this.props,res,{
                                        [formId1] : "form",
                                        [formId2] : "form",
                                        [tableId] : 'cardTable',
                                    });
                                    if(res.data){
                                        if(res.data["billCard"].head){
                                            this.props.form.setAllFormValue({ [this.formId2]: res.data["billCard"].head[this.formId2]});
                                        }
                                        if(res.data["billCard"].body){
                                            this.props.cardTable.setTableData(this.tableId, res.data["billCard"].body[this.tableId]);
                                        }
                                        let val = this.props.form.getFormItemsValue(this.formId1,"opertype");
                                        this.props.form.setFormItemsValue(this.formId2,{'accname':{value:val.value,display:val.display}});
                                    }
                                }
                            })
                        }

                        break;
                    default:
                        break
                }
                break;
            case this.formId2:
                switch(key){
                    case 'pk_bankdoc':
                        value.value?
                            ajax({
                                url:'/nccloud/uapbd/bankacc/formafteredit.do',
                                data:{
                                    value:value.value,
                                    key:key,
                                    arreacode:moduleId,
                                    pagecode:pageId
                                },
                                success:(res)=>{
                                    let{success,data} =res;
                                    if(success&&data){
                                        let bankaccref = {
                                            refName: this.state.json['10140SBAPF-000019'],//'IBAN生成'
                                            itemtype: data.UserJson == 'Y' ? 'refer' : 'input',
                                            refcode: 'uapbd/refer/customer/RefBankAccountComp/index',
                                            ibanFormId: 'generateIban',
                                            form: this.props.form,
                                            pagecode: pageId,
                                            json: this.state.json,
                                            onAfterSave: this.writebackIbanCode,
                                            queryCondition:{
                                                pk_bankdoc:data.form[moduleId].rows[0].values.pk_bankdoc.value,
                                                actionName:'loadBankDoc'
                                            },
                                            reg:data.UserJson != 'Y' ?new RegExp('^[[a-zA-Z0-9\-]*$'):null,
                                            errorMessage:data.UserJson != 'Y' ?this.state.json['10140SBAPF-000020']:null,/* 国际化处理： 只能输入数字、字母和-！*/
                                        }
                                        let accnameitem = this.props.meta.getMeta()[moduleId]['items'].find(item => item.attrcode == 'accnum');
                                        Object.assign(accnameitem, bankaccref);
                                        this.props.meta.setMeta(this.props.meta.getMeta(), () => {
                                            this.setAccBaseAndNetDefaultValue(moduleId,data.form[moduleId].rows[0].values,true);
                                        });
                                    }
                                }
                            }):this.setAccBaseAndNetDefaultValue(moduleId,{
                                pk_banktype:{display:'',value:''},
                                pk_netbankinftp:{display:'',value:''},
                                combineaccnum:{display:'',value:''},
                                combineaccname:{display:'',value:''},
                                combinenum:{display:'',value:''},
                                orgnumber:{display:'',value:''},
                                bankarea:{display:'',value:''},
                                province:{display:'',value:''},
                                city:{display:'',value:''},
                                customernumber:{display:'',value:''},
                                areacode:{display:'',value:''}
                            },false);
                        break;

                    case 'pk_banktype':
                        //账户基本信息选择银行类别时
                        let meta = props.meta.getMeta(),
                            item = meta[moduleId]['items'].find(item=>item.attrcode == 'pk_bankdoc');
                        item.queryCondition = {
                            pk_banktype:value.value
                        }
                        props.meta.setMeta(meta,()=>{
                            if(value.value!=oldValue.value){
                                this.props.form.setFormItemsValue(moduleId,{pk_bankdoc:{display:'',value:''}});
                                this.setAccBaseAndNetDefaultValue(moduleId,{
                                    pk_banktype:value,
                                    pk_netbankinftp:{display:'',value:''},
                                    combineaccnum:{display:'',value:''},
                                    combineaccname:{display:'',value:''},
                                    combinenum:{display:'',value:''},
                                    orgnumber:{display:'',value:''},
                                    bankarea:{display:'',value:''},
                                    province:{display:'',value:''},
                                    city:{display:'',value:''},
                                    customernumber:{display:'',value:''},
                                    areacode:{display:'',value:''}
                                },false);
                            }
                        });
                        break;
                    case 'enablestate':
                        this.props.form.setFormItemsDisabled(this.formId2,{'accnum':value.value==2})
                        break;
                    default:
                        break
                }
                break;
            default:
                break
        }
    }

    setAccBaseAndNetDefaultValue = (moduleId,data,flag)=>{
        this.props.form.setFormItemsValue(
            moduleId,
            {
                'pk_banktype': data.pk_banktype,
                'pk_netbankinftp': data.pk_netbankinftp,
                'combineaccnum': {
                    display: data.combineaccnum.value,
                    value: data.combineaccnum.value
                },//人行联行号
                'combineaccname': {
                    display: data.combineaccname.value,
                    value: data.combineaccname.value
                },//联行名称
                'combinenum': {
                    display: data.combinenum.value,
                    value: data.combinenum.value
                },
                'orgnumber': {
                    display: data.orgnumber.value,
                    value: data.orgnumber.value
                },
                'bankarea': {
                    display: data.bankarea.value,
                    value: data.bankarea.value
                },
                'province': {
                    display: data.province.value,
                    value: data.province.value
                },
                'city': {
                    display: data.city.value,
                    value: data.city.value
                },
                'customernumber': {
                    display: data.customernumber.value,
                    value: data.customernumber.value
                },
                'areacode': data.areacode,
                'issigned': data.issigned?data.issigned:{value: ''}
            });
        this.props.form.setFormItemsDisabled(moduleId, {'pk_banktype': flag});
    }

    writebackIbanCode = (value)=>{
        this.props.form.setFormItemsValue(this.formId2,{'accnum':value});
    }

    //表格编辑后事件
    tableafterEvent=(props, moduleId, key, value,changevalue,index,record)=>{
        switch(key){

            default:
                break
        }
    }

    //查询数据
    getData =(status,id,flag,callback) =>{
        //查询单据详情
        let cardData = getCacheById(id, dataSource);
        let that = this;
        if(cardData&&!flag){
            if(cardData["form1"]){
                this.props.form.setAllFormValue({ [this.formId1]: cardData["form1"][this.formId1]});
                this.props.form.setFormItemsDisabled(this.formId1,{'billno':!cardData['isCodeEdit']})
                this.state.hasApproveflowDef = cardData['hasApproveflowDef'];
            }
            if(cardData["billCard"]){
                if(cardData["billCard"].head){
                    this.props.form.setAllFormValue({ [this.formId2]: cardData["billCard"].head[this.formId2]});
                }
                if(cardData["billCard"].body){
                    this.props.cardTable.setTableData(that.tableId, cardData["billCard"].body[that.tableId]);
                }
            }
            callback&&callback();
            this.toggleShow(status);
        }else{
            let data = { pk: id, pageid: this.pageId };//{"pk":"1001N3100000000IQOKX","pageid":"10140SBAPF_card"};//
            ajax({
                url: urls.queryCardDataUrl,
                data: data,
                success: (res) => {
                    showFormular(this.props,res,{
                        [formId1] : "form",
                        [formId2] : "form",
                        [tableId] : 'cardTable',
                    });

                    if(res.data && res.data.form1 && res.data.form1.supplierbankpf && res.data.form1.supplierbankpf.rows && res.data.form1.supplierbankpf.rows[0].values.saga_status && res.data.form1.supplierbankpf.rows[0].values.saga_status.value){
                        // 进入页面就出现提示  可以不写   billpx gtxid 必填參數不然不能顯示追溯
                        // const {gtxid, billpx} = this.state;
                        const saga_status = res.data.form1.supplierbankpf.rows[0].values.saga_status.value;
                        const billpx = res.data.form1.supplierbankpf.rows[0].values.pk_supplierbankpf.value;
                        const gtxid = res.data.form1.supplierbankpf.rows[0].values.saga_gtxid.value;
                        this.props.socket.showToast({gtxid, billpx});
                        this.props.button.toggleErrorStatus('header_button_area',{
                            isError: saga_status === "1"
                        })
                    }

                    if (res.data) {
                        this.state.sysParam = res.data['sysParam'];
                        if(res.data["form1"]){
                            this.props.form.setAllFormValue({ [this.formId1]: res.data["form1"][this.formId1]});
                            this.props.form.setFormItemsDisabled(this.formId1,{'billno':!res.data['isCodeEdit']});
                            this.state.isPrecode = res.data['isPrecode'];
                            this.state.hasApproveflowDef = res.data['hasApproveflowDef'];
                            res.data['head']=res.data["form1"];
                        }
                        if(res.data["billCard"]){
                            if(res.data["billCard"].head){
                                this.props.form.setAllFormValue({ [this.formId2]: res.data["billCard"].head[this.formId2]});
                            }
                            if(res.data["billCard"].body){
                                this.props.cardTable.setTableData(that.tableId, res.data["billCard"].body[that.tableId]);
                            }
                        }
                    } else {
                        this.props.form.EmptyAllFormValue(this.formId1);
                        this.props.form.EmptyAllFormValue(this.formId2);
                        this.props.cardTable.setTableData(this.tableId, { rows: [] });
                    }
                    updateCache(pk_item,id,res.data,this.formId1,dataSource);
                    callback&&callback();
                    this.toggleShow(status);
                }
            });
        }
    }

    //切换页面状态
    toggleShow = (status) => {
        console.log(this.meta)
        let flag = status === 'browse' ? true : false;
        this.props.button.setButtonVisible(['add', 'edit','addline','delete','refresh','commit','approve','print','attachment','back','ApprInfo','ImgView','ImgScan'], flag);
        this.props.button.setButtonVisible(['save','cancel','addline'], !flag);
        this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
        if(flag){
            let billstate = this.props.form.getFormItemsValue(this.formId1,'billstatus').value
            this.props.button.setButtonVisible(['commit','delete'], (billstate==-1));
            this.props.button.setButtonVisible(['ApprInfo'], !(billstate==-1));
            this.props.button.setButtonVisible(['recall'], (billstate==3||billstate==1));
            this.props.button.setDisabled({
                commit:!(billstate==-1),
                delete:!(billstate==-1),
                recall:(billstate==-1),
                ApprInfo:(billstate==-1)
            });
        }
        this.props.form.setFormStatus(this.formId1, status === 'browse' ? 'browse' : 'edit' );
        this.props.form.setFormStatus(this.formId2, status === 'browse' ? 'browse' : 'edit');
        this.props.cardTable.setStatus(this.tableId, status==='browse'?"browse" :"edit");
        setTimeout( () => {
            this.setState({
                stated:status
            })
        },0);


    };

    //保存单据
    saveBill = () => {
        this.props.cardTable.filterEmptyRows(this.tableId,['pk_currtype'],"include");
        let formData = this.props.form.getAllFormValue(this.formId1);
        formData["areacode"] = formId1;
        let flag = this.props.form.isCheckNow(this.formId1)&&this.props.form.isCheckNow(this.formId2);
        if(!flag)return
        let CardData = this.props.createMasterChildData(this.pageId, this.formId2, this.tableId);
        let url = urls.saveUrl//新增保存
        if (this.props.getUrlParam('status') === 'edit') {
            url = urls.updateUrl//修改保存
        }
        this.props.validateToSave( {
            model : formData,
            pageid : pageId,
        } , ()=>{
            this.props.validateToSave( CardData , ()=>{
                ajax({
                    url: url,
                    data: {
                        formData:{pageid :pageId,
                            model:formData},
                        CardData:CardData,
                    },
                    success: (res) => {
                        showFormular(this.props,res,{
                            [formId1] : "form",
                            [formId2] : "form",
                            [tableId] : 'cardTable',
                        });
                        if (res.data) {
                            this.showmemo(res,()=>{
                                if(res.data["form1"]){
                                    this.props.form.setAllFormValue({ [this.formId1]: res.data["form1"][this.formId1]});
                                    this.state.hasApproveflowDef = res.data['hasApproveflowDef'];
                                }
                                if(res.data["billCard"]){
                                    if(res.data["billCard"].head){
                                        this.props.form.setAllFormValue({ [this.formId2]: res.data["billCard"].head[this.formId2]});
                                    }
                                    if(res.data["billCard"].body){
                                        this.props.cardTable.setTableData(tableId, res.data["billCard"].body[tableId]);
                                    }
                                }
                                let idvalue = res.data["form1"][this.formId1].rows[0].values.pk_supplierbankpf.value;
                                res.data['head']=res.data["form1"];
                                if (this.props.getUrlParam('status') === 'add'){
                                    this.props.setUrlParam({id:idvalue})
                                    addCache(idvalue,res.data,this.formId1,dataSource);
                                }{
                                    updateCache(pk_item,idvalue,res.data,this.formId1,dataSource);
                                }
                                this.props.pushTo("/card", {
                                    pagecode:linkpagecode,
                                    status: 'browse',
                                    id: this.props.getUrlParam('id')
                                });
                                toast({ color: 'success', title: this.state.json['10140SBAPF-000016'] });/* 国际化处理： 保存成功！*/
                                this.toggleShow("browse");
                            })
                        } else {
                            this.props.form.EmptyAllFormValue(this.formId1);
                            this.props.form.EmptyAllFormValue(this.formId2);
                            this.props.cardTable.setTableData(this.tableId, { rows: [] });
                        }
                    }
                });
            } , {[formId2]:'form',[tableId]:'cardTable'} , 'extcard' )
        } , {[formId1]:'form'} , 'form' )
    };
    showmemo=(res,callback)=>{
        if(this.state.memo){
            promptBox({
                color:"warning",
                title: this.state.json['10140SBAPF-000018'],/* 国际化处理： 错误信息*/
                noCancelBtn: true,
                content: this.state.memo,
                beSureBtnClick:()=>{
                    callback && callback();
                },
                cancelBtnClick:()=>{
                    callback && callback();
                },
                closeBtnClick:()=>{
                    callback && callback();
                },
            })
        }else {
            callback && callback();
        }
    }

    //删除单据
    deleteBill=()=>{
        ajax({
            url: urls.deleteUrl,
            data: {deleteinfo:[{
                    id: this.props.getUrlParam('id'),
                    ts: this.props.form.getFormItemsValue(this.formId1, 'ts').value
                }]},
            success: (res) => {
                if (res.success&&res.data) {
                    let id =this.props.getUrlParam('id');
                    let nextId = getNextId(id, dataSource);
                    deleteCacheById(pk_item,id,dataSource);
                    toast({ color: 'success', title: this.state.json['10140SBAPF-000003'] });/* 国际化处理： 删除成功！*/
                    if(nextId){
                        this.props.pushTo("/card", {
                            status: 'browse',
                            id: nextId
                        });
                        this.getData('browse',nextId);
                    }else{
                        this.props.pushTo("/list",{
                            pagecode:'10140SBAPF_list',
                        });
                    }
                }
            }
        });
    }

    //获取列表肩部信息
    getTableHead = (tableId) => {
        let { createButtonApp } = this.props.button;
        return (
            <div className="shoulder-definition-area">
                <div className="">
                    {createButtonApp({
                        area: 'table_header_area',
                        buttonLimit: 3,
                        onButtonClick: this.buttonClick.bind(this),
                        popContainer: document.querySelector('.table_header_area')

                    })}
                </div>
            </div>
        );
    };

    pageInfoClick=(props, pk)=> {
        if(pk&&pk!=null) {
            props.setUrlParam({id: pk});
            this.getData("browse", pk);
        }
    }

    getAssginUsedr = (value) => {
        ajax({
            url: urls.commiturl,
            data: {content:value,info:[{id:this.props.getUrlParam('id')}]},
            success: (res) => {
                if(res.data.workflow && (res.data.workflow == 'approveflow'|| res.data.workflow == 'workflow')) {
                    this.setState({
                        compositedata: res.data,
                        compositedisplay: true
                    });
                }else {
                    if(res.data instanceof Array){
                        this.getData(this.props.getUrlParam("status"),this.props.getUrlParam("id"),true);
                        this.setState({
                            compositedata: null,
                            compositedisplay: false
                        });
                        toast({ color: 'success', content: this.state.json['10140SBAPF-000009'] });/* 国际化处理： 提交成功*/
                    }else {
                        toast({ color: 'warning', content: res.data });
                    }
                }
            }
        })
    }
    turnOff=()=>{
        this.setState({
            compositedata:null,
            compositedisplay: false
        });
    }

    closeApprove = () =>{
        this.setState({
            showApprInfo: false
        })
    }

    socketMesg = (props, mesg) => {
        this.props.button.toggleErrorStatus('header_button_area',{
            isError: mesg.error === "1"
        })
		// if(mesg.error){
		// 	//出错时，控制业务按钮显示
            
		// }else{
		// 	//成功时，显示原来的浏览态按钮
	
		// }	
	}

    render() {
        let { cardTable, form, button, modal, cardPagination,search ,table,BillHeadInfo, socket} = this.props;
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createCardPagination } = cardPagination;
        let {createButtonApp } = button;
        let { createModal } = modal;
        const {createBillHeadInfo} = BillHeadInfo;
        let iconItem = this.state.showBaseInfo ? 'icon-jiantouxia1' : 'icon-jiantouyou'

        let groupItem = this.state.showBaseInfo ? "show-form" : "hide-form"
        return (
            <div className="nc-bill-extCard">
            	{socket.connectMesg({
						headBtnAreaCode: "header_button_area",//"按钮区域编码", // 用于平台内部更新按钮状态
						formAreaCode: "supplierbankpf",//this.formId1,//"表单区域编码", //用于平台内部更新表头数据
						onMessage: this.socketMesg, //监听消息
						isShowView: true, // 显示立即查看按钮
						billtype: "10GZ",//"单据类型", //用于查询追溯
						billpkname: "pk_supplierbankpf",//"单据主键名", //用于查询追溯
						dataSource: dataSource,//'缓存cardCache使用的pk', 

						// 本地前端调试，请传ip和端口
						// 打包到测试环境之前 去掉
						// serverLocation: "http://10.11.115.10:80"
					})}
                <div className="nc-bill-top-area">
                    <NCAffix>
                        <NCDiv  areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                                
                            {this.state.stated === 'browse'&&
                            <NCBackBtn className='title-search-detail'
                                       onClick={ this.buttonClick.bind(this,this.props,'back') }></NCBackBtn>}
                            {/* {createPageIcon()} */}
                            <div className="header-title-search-area" >
                                {/* <h2 className='title-search-detail'>{this.state.json['10140SBAPF-000008']/* 国际化处理： 供应商银行账号申请单}</h2></div> */}
                                {createBillHeadInfo({
                                    title : this.state.json['10140SBAPF-000008'],
                                    initShowBackBtn:false
                                })}
                            </div>
                            <div className="header-button-area">
                                {button.createErrorFlag( {
                    				headBtnAreaCode: "header_button_area"//"按钮区域编码"
                				})}
                                {createButtonApp({
                                    area: 'header_button_area',
                                    buttonLimit: 3,
                                    onButtonClick: this.buttonClick.bind(this),
                                    popContainer: document.querySelector('.header-button-area')

                                })}
                            </div>
                            <div className='header-cardPagination-area' style={{float:'right'}}>
                                {createCardPagination({
                                    handlePageInfoChange: this.pageInfoClick.bind(this),
                                    dataSource: dataSource
                                })}
                            </div>
                        </NCDiv>
                    </NCAffix>
                    <NCScrollElement name='head'>
                        <div className="nc-bill-form-area">
                            {createForm(this.formId1, {
                                onAfterEvent: this.afterEvent.bind(this)
                            })}
                        </div>
                    </NCScrollElement>

                    <div className="nc-bill-form-area">
                        <div className='group-form-wrapper'>
                            <NCDiv fieldid="supplierbankinfo" areaCode={NCDiv.config.Group} className="group-form-name">
                                <span
                                    className={`toggle-form-icon iconfont ${iconItem}`}
                                    onClick={() => {
                                        let show = !this.state.showBaseInfo
                                        this.setState({
                                            showBaseInfo: show
                                        });
                                    }}
                                />
                                <span className="name">{this.state.json['10140SBAPF-000015']/* 国际化处理： 供应商银行账号信息*/}</span>
                            </NCDiv>
                            <div className={`group-form-item ${groupItem} `}>
                                {createForm(this.formId2, {
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="nc-bill-bottom-area">
                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId, {
                            tableHead: this.getTableHead.bind(this, this.tableId),
                            modelSave: this.saveBill,
                            onAfterEvent: this.tableafterEvent.bind(this),
                            showCheck: true,
                            showIndex: true
                        })}
                    </div>
                </div>
                {createModal('modal')}
                <PrintOutput
                    ref='printOutput'
                    url= {urls['printurl']}
                    data={{
                        funcode:'10140SBAPF',
                        nodekey:'supplierbankpfcard_ncc',     //模板节点标识
                        oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output",
                        userjson :`{type:'card'}`
                    }}
                    //callback={this.onSubmit}
                >
                </PrintOutput>
                {this.state.compositedisplay ? <ApprovalTrans
                    title={this.state.json['10140SBAPF-000017']}/* 国际化处理： 指派*/
                    data={this.state.compositedata}
                    display={this.state.compositedisplay}
                    getResult={this.getAssginUsedr.bind(this)}
                    cancel={this.turnOff.bind(this)}
                /> : ""}
                <ApproveDetail
                    show={this.state.showApprInfo}
                    close={this.closeApprove.bind(this)}
                    billtype='10GZ'
                    billid={this.state.billId}
                />
            </div>
        );
    }
}

Card = createPage({
    billinfo:[{
        billtype: 'card',
        pagecode: linkpagecode,
        headcode: formId2,
        bodycode: tableId
    },{
        billtype: 'form',
        pagecode: linkpagecode,
        headcode: formId1
    }]
})(Card);

export default Card;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65