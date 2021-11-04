//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import { createPage, ajax, base, toast ,high,print,getBusinessInfo,cardCache,promptBox,createPageIcon} from 'nc-lightapp-front';
let { getCacheById, updateCache ,addCache,getCurrentLastId ,getNextId, deleteCacheById ,setDefData, getDefData} = cardCache;
let businessInfo = getBusinessInfo();
import Materialpftabs from "../components/materialpftabs.js"
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix ,NCUpload } = base;
const { NCTabs,NCCol,NCMessage ,NCBackBtn} = base;
const { NCUploader,PrintOutput,ApproveDetail,ApprovalTrans } = high;
const {BillCodeUtil} = Utils;
const { NCDiv } = base;
import './index.less';
//import ApprovalTrans from '../../../../uap/public/excomponents/approvalTrans';
import Utils from "../../../public/utils";
import createUIDom from "../../../public/utils/BDCreateUIDom";
const {showFormular } = Utils;

const formId1 = 'material_pf';
const formId2 = 'material';
const tableId1 = 'materialconvert';
const tableId2 = 'fi';//财务
const tableId3 = 'pfc';//利润中心npm ru
const tableId4 = 'pu';//采购
const tableId5 = 'sale';//销售
const tableId6 = 'stock';//库存
const tableId7 = 'plan';//计划
const tableId8 = 'prod';//生产信息
const dataSource = 'uapbd.material.material_pf.dataSource'
const pk_item = 'pk_material_pf';

const linktourl='/uapbd/material/material_pf/';
const linkpagecode='10140MPF_approve_card';
const linkpagecode2='10140MPF_approve';

const pageId = '10140MPF_approve_card';//页面id
const appcode = '10140MPF';//注册按钮的id


let urls={
    queryCardDataUrl:'/nccloud/uapbd/materialpf/queryMaterialpfCardData.do',
    queryDefaultDataUrl:'/nccloud/uapbd/materialpf/queryMaterialpfDefaultData.do',
    afterEventUrl:'/nccloud/uapbd/materialpf/queryMaterialpfAfterEventData.do',
    saveUrl:'/nccloud/uapbd/materialpf/insertMaterialpf.do',
    updateUrl:'/nccloud/uapbd/materialpf/updateMaterialpf.do',
    deleteUrl:'/nccloud/uapbd/materialpf/deleteMaterialpf.do',
    commiturl:'/nccloud/uapbd/materialpf/commitMaterialpf.do',
    recallurl:'/nccloud/uapbd/materialpf/recallMaterialpf.do',
    approveurl:'/nccloud/uapbd/materialpf/approveMaterialpf.do',
    unapproveurl:'/nccloud/uapbd/materialpf/unapproveMaterialpf.do',
    printurl:'/nccloud/uapbd/materialpf/printMaterialpfInfo.do',
    cancelurl:'/nccloud/uapbd/materialpf/cancelMaterialpf.do',
    validateMaterialpfUrl:'/nccloud/uapbd/materialpf/validateMaterialpf.do',
};

let tableBtnAry =(props)=>{
    return props.cardTable.getStatus(tableId1)==='browse'?['']:["delline",'insertline','pasteline'];;
}
class Card extends Component {
    constructor(props) {
        super(props);
        this.formId1 = formId1;
        this.formId2 = formId2;
        this.tableId1 = tableId1;
        this.tableId2 = tableId2;
        this.tableId3 = tableId3;
        this.tableId4 = tableId4;
        this.tableId5 = tableId5;
        this.tableId6 = tableId6;
        this.tableId7 = tableId7;
        this.tableId8 = tableId8;
        this.pageId = pageId;
        this.appcode = appcode;
        this.state = {
            formConfig:null,
            stated:'browse',
            showUploader:false,
            target: null,
            pks:[],
            materialpfpk:null,
            compositedata: null,
            compositedisplay: false,
            showBaseInfo : true,
            json:{},
            inlt:null,
            sysParam:null,
            memo:null,
            materialisPrecode:true,
            isPrecode:true,
            hasApproveflowDef:true,
            userId:businessInfo.userId,
            materialpk:'',
            imguploaddata : {},
            img_url : '',
            imgcachelist : [],
            isUploadImg:false,
            showApprInfo:false,
            billId:null
        };
        this.initTemplate(this.props, () => {
            let status = this.props.getUrlParam("status");
            let id = this.props.getUrlParam("id");
            if(status=="add"){
                this.setDefaultValue(status);
            }else{
                this.getData(status,id)
            }
        });
    }

    initTemplate = (props, callback) =>{
        createUIDom(props)(
            {
                pagecode: pageId
            },
            {
                moduleId: "10140MPF",domainName: 'uapbd'
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
        meta[formId1].status = status;
        meta[formId2].status = status;
        meta[tableId1].status = status;
        meta[tableId2].status = status;
        meta[tableId3].status = status;
        meta[tableId4].status = status;
        meta[tableId5].status = status;
        meta[tableId6].status = status;
        meta[tableId7].status = status;
        meta[tableId8].status = status;

        let porCol1 = {
            attrcode: 'opr',
            label: this.state.json['10140MPF-000010'],/* 国际化处理： 操作*/
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
                        area: "table-opr-area",
                        buttonLimit: 3,
                        onButtonClick: (props, id ) => this.tableButtonClick(props, id,tableId1, text, record, index)
                    }
                )
            }
        };

        meta[formId1].items.map((item)=>{
            if(item.attrcode == 'pk_org'){
                item.queryCondition=()=>{
                    return {'AppCode':appcode,
                        TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    }
                }
            }
        })
        meta[formId2].items.map((item)=>{
            if(item.attrcode == 'pk_marbasclass'){
                item.onlyLeafCanSelect = true;
            }else if(item.attrcode == 'pk_brand'){
                item.queryCondition=()=>{
                    return {
                        pk_org:this.props.form.getFormItemsValue(this.formId1,"pk_org").value
                    }
                }
            }
        })
        let confpor=(tableid)=>{
            var moduleid = tableid;
            let porCol = {
                attrcode: 'opr',
                label: this.state.json['10140MPF-000010'],/* 国际化处理： 操作*/
                visible: true,
                className:'table-opr',
                width:'200px',
                itemtype: 'customer',
                fixed:'right',
                render:(text, record, index)=> {

                    const btnArray = props.form.getFormStatus(formId1)=='browse'&&this.props.form.getFormItemsValue(this.formId1,'billstatus').value==-1?["editline"]:[];

                    return props.button.createOprationButton(
                        btnArray,
                        {
                            area: "table-opr-area",
                            buttonLimit: 3,
                            onButtonClick: (props, id ) => {
                                this.tableButtonClick2(props, id, text, record, index,moduleid);
                            }
                        }
                    )
                }
            };
            return porCol
        }


        meta[tableId1].items.push(porCol1);
        meta[tableId2].items.push(confpor(tableId2));
        meta[tableId3].items.push(confpor(tableId3));
        meta[tableId4].items.push(confpor(tableId4));
        meta[tableId5].items.push(confpor(tableId5));
        meta[tableId6].items.push(confpor(tableId6));
        meta[tableId7].items.push(confpor(tableId7));
        meta[tableId8].items.push(confpor(tableId8));

        return meta;
    }

    tableButtonClick = (props, id, tableId,text, record, index)=>{

        switch(id){

            case "delline"://删除行
                props.cardTable.delRowsByIndex(tableId, index);
                break;
            case "insertline":
                props.cardTable.addRow(tableId,index,{"fixedflag":{display: null,value: false},
                    "isstorebalance":{display: null,value: true},
                    "ispumeasdoc":{display: null,value: false},
                    "isprodmeasdoc":{display: null,value: false},
                    "isstockmeasdoc":{display: null,value: false},
                    "issalemeasdoc":{display: null,value: false},
                    "isretailmeasdoc":{display: null,value: false},
                    "ispiecemangage":{display: null,value: false},
                });
                break;
            case "pasteline":
                props.cardTable.addRow(tableId,index+1,record.values);
                break;
            case "detail"://更多
                props.cardTable.toggleRowView(tableId, record);
                break;
            case "spread"://展开
                props.cardTable.openModel(tableId, 'edit', record, index);
                break;
            default:
                break;
        }
    }

    tableButtonClick2 = (props, id,text, record, index,moduleid)=>{
        let tableid = null;
        let title= null;
        let pk_measdocarr = [];
        switch(moduleid){
            case tableId2:
                title =this.state.json['10140MPF-000000'];/* 国际化处理： 财务信息*/
                break;
            case tableId3:
                tableid = 'materialpfcsub';
                title =this.state.json['10140MPF-000001'];/* 国际化处理： 利润中心信息*/
                break;
            case tableId4:
                title =this.state.json['10140MPF-000002'];/* 国际化处理： 采购信息*/
                break;
            case tableId5:
                tableid = 'materialbindle';
                title =this.state.json['10140MPF-000003'];/* 国际化处理： 销售信息*/
                break;
            case tableId6:
                let pk_measdoc = props.form.getFormItemsValue('material','pk_measdoc');
                let cardTableData = props.cardTable.getAllRows('materialconvert');
                if(pk_measdoc && pk_measdoc.value){
                    pk_measdocarr.push(pk_measdoc.value);
                }
                (cardTableData || []).forEach(element => {
                    pk_measdocarr.push(element.values['pk_measdoc'].value);
                });
                tableid = 'materialwarh';
                title =this.state.json['10140MPF-000004'];/* 国际化处理： 库存信息*/
                break;
            case tableId7:
                tableid = 'materialrepl';
                title =this.state.json['10140MPF-000005'];/* 国际化处理： 计划信息*/
                break;
            case tableId8:
                title =this.state.json['10140MPF-000006'];/* 国际化处理： 生产信息*/
                break;
        }
        let formConfig ={
            pk:props.getUrlParam("id"),
            moduleId:moduleid,
            formId:moduleid,
            tableId:tableid,
            state:"edit",
            billstatus:this.props.form.getFormItemsValue(this.formId1,'billstatus').value,
            pk_org:this.props.form.getFormItemsValue(this.formId1,'pk_org').value,
            pk_measdocarr:pk_measdocarr,
        }
        props.modal.show("source",{
            title:title,
            content:<Materialpftabs config={formConfig} />,
            userControl:true,//自己控制什么时候关闭窗口
            noFooter:true
        });
    }

    componentDidMount() {

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
        switch (id) {
            case "add":
                props.form.EmptyAllFormValue(this.formId1)
                props.form.EmptyAllFormValue(this.formId2)
                props.cardTable.setTableData(this.tableId1, { rows: [] })
                this.props.pushTo("/card",{
                    pagecode:pageId,
                    status:'add',
                    id:props.getUrlParam('id')
                });
                this.setDefaultValue('add');
                break;
            case 'edit':
                ajax({
                    url: urls.validateMaterialpfUrl,
                    data: {type:'edit',info:[{
                            id: props.getUrlParam('id')
                        }]},
                    success: (res) => {
                        this.props.pushTo("/card", {
                            pagecode:pageId,
                            status: 'edit',
                            id: props.getUrlParam('id')
                        });
                        this.toggleShow('edit');
                    }
                });
                break;
            case 'delete':
                ajax({
                    url: urls.validateMaterialpfUrl,
                    data: {type:'delete',info:[{
                            id: props.getUrlParam('id')
                        }]},
                    success: (res) => {
                        promptBox({
                            color:"warning",
                            title: this.state.json['10140MPF-000011'],/* 国际化处理： 确定删除*/
                            content: this.state.json['10140MPF-000012'],/* 国际化处理： 您确定要删除所选数据吗?*/
                            beSureBtnClick: this.deleteBill.bind(this)
                        });
                    }
                });
                break;
            case 'save':
                this.saveBill();
                break;
            case 'refresh':
                let refreshid = props.getUrlParam("id")?props.getUrlParam("id"):this.props.form.getFormItemsValue(this.formId1,'pk_material_pf').value;
                this.getData(props.getUrlParam("status"),refreshid,true,()=>{
                    toast({title:this.state.json['10140MPF-000013'],color:'success'})/* 国际化处理： 刷新成功！*/
                });
                break;
            case 'cancel':
                promptBox({
                    color:"warning",
                    title:this.state.json['10140MPF-000014'],/* 国际化处理： 确认取消*/
                    content:this.state.json['10140MPF-000015'],/* 国际化处理： 是否确认要取消?*/
                    beSureBtnClick:()=>{
                        if (props.getUrlParam('status') === 'add'){
                            let code = this.props.form.getFormItemsValue(this.formId1,'billno');
                            let materialcode = this.props.form.getFormItemsValue(this.formId2,'code');
                            let pk_org = this.props.form.getFormItemsValue(this.formId1,'pk_org');
                            let materialpk_org = this.props.form.getFormItemsValue(this.formId2,'pk_org');
                            ajax({
                                url: urls.cancelurl,
                                data: {code: code.value,materialcode:materialcode.value,pk_org:pk_org.value,materialpk_org:materialpk_org.value},
                                success: (res) => {
                                    let id = props.getUrlParam('id')?props.getUrlParam('id'):getCurrentLastId(dataSource);
                                    props.pushTo("/card", {
                                        pagecode:pageId,
                                        status: 'browse',
                                        id: id
                                    });
                                    if(id==null){
                                        props.form.cancel(this.formId1);
                                        props.form.cancel(this.formId2);
                                        props.cardTable.resetTableData(this.tableId1);
                                        this.props.button.setButtonVisible(['add', 'back'], true);
                                        this.props.button.setButtonVisible(['save','cancel','addline','edit','addline','delete','refresh','commit','approve','print','attachment','RowApprInfo'], false);
                                        this.setState({
                                            img_url: ''
                                        })
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
                            let pk_org = this.props.form.getFormItemsValue(this.formId1,'pk_org');
                            let materialpk_org = this.props.form.getFormItemsValue(this.formId2,'pk_org');
                            ajax({
                                url: urls.cancelurl,
                                data: {pk_org:pk_org.value,materialpk_org:materialpk_org.value},
                                success: (res) => {
                                    props.form.cancel(this.formId1);
                                    props.form.cancel(this.formId2);
                                    props.cardTable.resetTableData(this.tableId1);
                                    props.pushTo("/card", {
                                        pagecode:pageId,
                                        status: 'browse',
                                        id: props.getUrlParam('id')
                                    });
                                    let	pk = this.props.getUrlParam('id');
                                    this.getData('browse',pk);
                                }
                            })

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
                    pagecode:'10140MPF_approve',
                });
                break;
            case 'commit':
                ajax({
                    url: urls.validateMaterialpfUrl,
                    data: {type:'commit',info:[{
                            id: props.getUrlParam('id')
                        }]},
                    success: (res) => {
                        ajax({
                            url:urls.commiturl,
                            data:{content:null,info:[{id:this.props.getUrlParam('id')}]},
                            success:(res)=>{
                                if(res.data.workflow && (res.data.workflow == 'approveflow'|| res.data.workflow == 'workflow')) {
                                    this.setState({
                                        compositedata: res.data,
                                        compositedisplay: true
                                    });
                                }else{
                                    if(res.data instanceof Array){
                                        toast({ color: 'success', title: this.state.json['10140MPF-000016'] });/* 国际化处理： 提交成功！*/
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
                    url: urls.validateMaterialpfUrl,
                    data: {type:'recall',info:[{
                            id: props.getUrlParam('id')
                        }]},
                    success: (res) => {
                        ajax({
                            url:urls.recallurl,
                            data:{info:[{id:this.props.getUrlParam('id')}]},
                            success:(res)=>{
                                toast({ color: 'success', content: this.state.json['10140MPF-000017'] });/* 国际化处理： 单据成功收回。*/
                                this.getData(props.getUrlParam("status"),props.getUrlParam("id"),true);
                            }
                        })
                    }
                });
                break;
            case "print":
                let printParam={
                    funcode: "10140MPF",
                    nodekey: 'materialpfcard',
                    outputType:'print'
                };
                this.pintFunction(printParam);
                break;
            case 'output':
                let pk = this.props.form.getFormItemsValue(this.formId1,'pk_material_pf')
                if(pk==null){
                    return
                }
                let pks = [];
                pks.push(pk.value);
                this.setState({
                    pks:pks
                },this.refs.printOutput.open())
                break;
            case 'attachment':
                this.setState({
                    materialpfpk:this.props.form.getFormItemsValue(this.formId1,'pk_material_pf').value,
                    showUploader: true,
                })
                break;
            case 'RowApprInfo':
                //打开审批详情页
                this.setState({
                    billId: this.props.form.getFormItemsValue(this.formId1,'pk_material_pf').value,
                    showApprInfo: true
                })
                break;
            case 'addline':
                let number = props.cardTable.getNumberOfRows(this.tableId1, false)
                props.cardTable.addRow(this.tableId1,number,{"fixedflag":{display: null,value: false},
                    "isstorebalance":{display: null,value: true},
                    "ispumeasdoc":{display: null,value: false},
                    "isprodmeasdoc":{display: null,value: false},
                    "isstockmeasdoc":{display: null,value: false},
                    "issalemeasdoc":{display: null,value: false},
                    "isretailmeasdoc":{display: null,value: false},
                    "ispiecemangage":{display: null,value: false},
                });
                break;
            default:
                break
        }
    }

    //打印功能函数
    pintFunction(param){
        let pk = this.props.form.getFormItemsValue(this.formId1,'pk_material_pf')
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
        this.props.form.setFormStatus(this.formId1, status );
        this.props.form.setFormStatus(this.formId2, status);
        this.props.form.EmptyAllFormValue(this.formId1);
        this.props.form.EmptyAllFormValue(this.formId2);
        this.state.img_url = '';
        ajax({
            url: urls.queryDefaultDataUrl,
            data:{pk_org:getDefData("pk_org",dataSource),materialpk_org:getDefData("pk_org",dataSource)},
            success: (res) =>{
                showFormular(this.props,res,{
                    "material_pf" : "form",
                    'material' : "form",
                    'materialconvert' : 'cardTable',
                    'fi': 'cardTable',
                    'pfc': 'cardTable',
                    'pu': 'cardTable',
                    'sale': 'cardTable',
                    'stock': 'cardTable',
                    'plan': 'cardTable',
                    'prod': 'cardTable',
                });
                if(res.data){
                    this.state.sysParam = res.data['sysParam'];
                    if(res.data.form[this.formId1]){
                        Utils.filterEmptyData(res.data.form[this.formId1].rows[0].values);
                        this.props.form.setAllFormValue({ [this.formId1]: res.data.form[this.formId1]});
                        this.props.form.setFormItemsDisabled(this.formId1,{'billno':!res.data['isCodeEdit']})
                        this.state.isPrecode = res.data['isPrecode'];
                    }
                    if(res.data.form2[this.formId2]){
                        Utils.filterEmptyData(res.data.form2[this.formId2].rows[0].values);
                        this.props.form.setAllFormValue({ [this.formId2]: res.data.form2[this.formId2]});
                        this.props.form.setFormItemsDisabled(this.formId2,{'code':!res.data['materialisCodeEdit']})
                        this.state.materialisPrecode = res.data['materialisPrecode'];
                        this.setState({
                            materialpk:this.props.form.getFormItemsValue(this.formId2,'pk_material').value
                        });
                    }
                    setTimeout(() => {
                        this.updateUploadData();
                        this.toggleShow(status);
                    } ,0);
                }
            }
        },this.toggleShow(status))
    }

    //编辑后事件
    afterEvent=(props, moduleId, key, value,oldValue,ref)=>{
        switch(moduleId){
            case this.formId1:
                switch(key){
                    case "pk_org":
                        let targetorgvalue = this.props.form.getFormItemsValue(this.formId1,"targetorg")
                        if(value.value&&value.value!=null){
                            setDefData("pk_org",dataSource,value.value);
                            ajax({
                                url: urls.queryDefaultDataUrl,
                                data:{
                                    pk_org:value.value,
                                    materialpk_org:targetorgvalue.value==0?value.value:businessInfo.groupId,
                                    materialpfbillno:this.props.form.getFormItemsValue(this.formId1,"billno").value,
                                    materialbillno:this.props.form.getFormItemsValue(this.formId2,"code").value,
                                },
                                success: (res) =>{
                                    if(res.data){
                                        if(res.data.form[this.formId1]){
                                            this.props.form.setFormItemsValue([this.formId1],{'billno':{value:res.data.form[this.formId1].rows[0].values['billno'].value,display:null}});
                                            this.props.form.setFormItemsDisabled(this.formId1,{'billno':!res.data['isCodeEdit']})
                                            this.state.isPrecode = res.data['isPrecode'];
                                        }
                                        if(res.data.form2[this.formId2]){
                                            this.props.form.setFormItemsValue([this.formId2],{'code':{value:res.data.form2[this.formId2].rows[0].values['code'].value,display:null}});
                                            this.props.form.setFormItemsDisabled(this.formId2,{'code':!res.data['materialisCodeEdit']})
                                            this.state.materialisPrecode = res.data['materialisPrecode']
                                        }
                                    }
                                }
                            })
                        }
                        if(targetorgvalue.value==0){
                            this.props.form.setFormItemsValue(this.formId2,{'pk_org':{value:value.value,display:value.display}});
                        }else{
                            this.props.form.setFormItemsValue(this.formId2,{'pk_org':{value:businessInfo.groupId,display:businessInfo.groupName}});
                        }
                        this.props.form.setFormItemsValue(this.formId2,{'pk_marbasclass':{value:null,display:null}});
                        break;
                    case "targetorg":
                        let orgvalue = this.props.form.getFormItemsValue(this.formId1,"pk_org")
                        if(value.value==0){
                            this.props.form.setFormItemsValue(this.formId2,{'pk_org':{value:orgvalue.value,display:orgvalue.display}});
                        }else{
                            this.props.form.setFormItemsValue(this.formId2,{'pk_org':{value:businessInfo.groupId,display:businessInfo.groupName}});
                        }
                        this.props.form.setFormItemsValue(this.formId2,{'pk_marbasclass':{value:null,display:null}});
                        let meta = this.props.meta.getMeta();
                        meta[formId2].items.map((item)=>{
                        if(item.attrcode == 'pk_marbasclass'){
                            item.onlyLeafCanSelect = true;
                                item.queryCondition = {
                                     "pk_org" :this.props.form.getFormItemsValue('material','pk_org').value
                                }
                            }
                        })
                        break;
                    default:
                        break
                }
                break;
            case this.formId2:
                switch(key){
                    case "fee":
                        let discountflag = this.props.form.getFormItemsValue(this.formId2,"discountflag");
                        if(value.value||discountflag.value){
                            this.props.form.setFormItemsValue(this.formId2,{'ishproitems':{value:null,display:null}});
                            this.props.form.setFormItemsValue(this.formId2,{'materialmgt':{value:null,display:null}});
                            this.props.form.setFormItemsDisabled(this.formId2,{'materialmgt':true,'ishproitems':true});
                        }else{
                            this.props.form.setFormItemsDisabled(this.formId2,{'materialmgt':false,'ishproitems':false});
                        }
                        break;
                    case "discountflag":
                        let retail = this.props.form.getFormItemsValue(this.formId2,"retail");
                        if(value.value&&retail.value){
                            promptBox({
                                title:this.state.json['10140MPF-000018'],/* 国际化处理： 询问*/
                                content:this.state.json['10140MPF-000019'],/* 国际化处理： 勾选“价格折扣”后，“适用零售”将被取消勾选，是否继续勾选“价格折扣”？*/
                                beSureBtnClick:()=>{
                                    this.props.form.setFormItemsValue(this.formId2,{'retail':{value:false,display:this.state.json['10140MPF-000020']}});/* 国际化处理： 否*/
                                    let fee = this.props.form.getFormItemsValue(this.formId2,"fee");
                                    if(fee.value||value.value){
                                        this.props.form.setFormItemsValue(this.formId2,{'ishproitems':{value:false,display:this.state.json['10140MPF-000020']}});/* 国际化处理： 否*/
                                        this.props.form.setFormItemsValue(this.formId2,{'materialmgt':{value:null,display:null}});
                                        this.props.form.setFormItemsDisabled(this.formId2,{'materialmgt':true,'ishproitems':true});
                                    }else{
                                        this.props.form.setFormItemsDisabled(this.formId2,{'materialmgt':false,'ishproitems':false});
                                    }
                                    return;
                                },
                                cancelBtnClick:()=>{
                                    this.props.form.setFormItemsValue(this.formId2,{'discountflag':{value:false,display:this.state.json['10140MPF-000020']}});/* 国际化处理： 否*/
                                    return;
                                },
                                closeBtnClick:()=>{
                                    this.props.form.setFormItemsValue(this.formId2,{'discountflag':{value:false,display:this.state.json['10140MPF-000020']}});/* 国际化处理： 否*/
                                    return;
                                },
                            });
                        }else{
                            let fee = this.props.form.getFormItemsValue(this.formId2,"fee");
                            if(fee.value||value.value){
                                this.props.form.setFormItemsValue(this.formId2,{'ishproitems':{value:false,display:this.state.json['10140MPF-000020']}});/* 国际化处理： 否*/
                                this.props.form.setFormItemsValue(this.formId2,{'materialmgt':{value:null,display:null}});
                                this.props.form.setFormItemsDisabled(this.formId2,{'materialmgt':true,'ishproitems':true});
                            }else{
                                this.props.form.setFormItemsDisabled(this.formId2,{'materialmgt':false,'ishproitems':false});
                            }
                        }
                        break;
                    case "retail":
                        if(value.value){
                            let datas = this.props.cardTable.getAllRows(this.tableId1);
                            let flag = false;
                            datas.forEach((e)=>{
                                if(!e.values['fixedflag'].value){
                                    this.props.form.setFormItemsValue(this.formId2,{'retail':{value:false,display:this.state.json['10140MPF-000020']}});/* 国际化处理： 否*/
                                    toast({ color: 'warning', content: this.state.json['10140MPF-000021'] });/* 国际化处理： 您当前的物料存在固定换算未被勾选，不允许勾选适用零售，请先勾选所有的固定换算*/
                                    flag =true;
                                }
                            });
                            if(flag)return;
                            let discountflagva = this.props.form.getFormItemsValue(this.formId2,"discountflag");
                            if(discountflagva.value){
                                promptBox({
                                    title:this.state.json['10140MPF-000018'],/* 国际化处理： 询问*/
                                    content:this.state.json['10140MPF-000022'],/* 国际化处理： 勾选“适用零售”后，“价格折扣”将被取消勾选，是否继续勾选“适用零售”？*/
                                    beSureBtnClick:()=>{
                                        this.props.form.setFormItemsValue(this.formId2,{'discountflag':{value:false,display:this.state.json['10140MPF-000020']}});/* 国际化处理： 否*/
                                        return;
                                    },
                                    cancelBtnClick:()=>{
                                        this.props.form.setFormItemsValue(this.formId2,{'retail':{value:false,display:this.state.json['10140MPF-000020']}});/* 国际化处理： 否*/
                                        return;
                                    },
                                    closeBtnClick:()=>{
                                        this.props.form.setFormItemsValue(this.formId2,{'retail':{value:false,display:this.state.json['10140MPF-000020']}});/* 国际化处理： 否*/
                                        return;
                                    },
                                });
                            }
                        }
                        break;
                    case "pk_goodscode":
                        this.props.form.setFormItemsValue(this.formId2,{'goodsprtname':{value:ref.refcode,display:null}});
                        break;
                    case "isfeature":
                        if(value.value){
                            this.props.form.setFormItemsValue(this.formId2,{'matchmode':{value:1}});
                            this.props.form.setFormItemsDisabled(this.formId2,{'featureclass':false,'matchmode':false});
                        }else{
                            this.props.form.setFormItemsValue(this.formId2,{'featureclass':{value:null,display:null}});
                            this.props.form.setFormItemsValue(this.formId2,{'matchmode':{value:null,display:null}});
                            this.props.form.setFormItemsDisabled(this.formId2,{'featureclass':true,'matchmode':true});
                        }
                        break;
                    case "matchmode":
                        if(value.value!=null&&value.value==1){
                            this.props.form.setFormItemsDisabled(this.formId2,{'featureclass':false});
                        }else {
                            this.props.form.setFormItemsDisabled(this.formId2,{'featureclass':true});
                        }
                        break;
                    case "pk_measdoc":
                        let data = this.props.cardTable.getAllRows(this.tableId1);
                        let params = {info:data.map((v)=>{
                                let measdocvalue = v.values["pk_measdoc"].value;
                                let rowid = v.rowid;
                                return {
                                    rowid,measdocvalue
                                }
                            })};
                        ajax({
                            url: urls.afterEventUrl,
                            data: {
                                pk :"form",
                                value:value.value,
                                oldValue:oldValue.value,
                                data : params.info,
                            },
                            success: (res) =>{
                                if(res.data["measrate"]){
                                    params.info.map((v)=>{
                                        this.props.cardTable.setValByKeyAndRowId(this.tableId1,v.rowid,'measrate',{value:res.data["measrate"][v.rowid]});

                                    })
                                }
                                if(res.data[this.tableId1]){
                                    this.props.cardTable.setTableData(this.tableId1,res.data[this.tableId1]);
                                }
                            }
                        })
                        break;
                    default:
                        break
                }
                break;
            default:
                break
        }

    }

    //表格编辑后事件
    tableafterEvent=(props, moduleId, key, value,changevalue,index,record)=>{
        switch(key){
            case "pk_measdoc":
                let pk_measdocvalue = this.props.form.getFormItemsValue(this.formId2,"pk_measdoc");
                ajax({
                    url: urls.afterEventUrl,
                    data: {
                        pk :"table",
                        value:pk_measdocvalue?pk_measdocvalue.value:null,
                        oldValue:value?value.value:null,
                    },
                    success: (res) =>{
                        if(res.data["measrate"]){
                            this.props.cardTable.setValByKeyAndIndex(this.tableId1,index,'measrate',res.data[Measrate]);
                        }
                    }
                })
                break;
            case "fixedflag":
                if(!value.value){
                    let retailvalue = this.props.form.getFormItemsValue(this.formId2,"retail").value;
                    if(retailvalue){
                        this.props.cardTable.setValByKeyAndIndex(this.tableId1,index,'fixedflag',{value:true});
                        toast({ color: 'warning', content: this.state.json['10140MPF-000023'] });/* 国际化处理： 您当前已经勾选了适用零售，不允许取消勾选固定换算，请先取消勾选适用零售*/
                    }
                }
                break;
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
            if(cardData["form2"]){
                this.props.form.setAllFormValue({ [this.formId1]: cardData["form2"][this.formId1]});
                this.props.form.setFormItemsDisabled(this.formId1,{'billno':!cardData['isCodeEdit']})
                this.state.hasApproveflowDef = cardData['hasApproveflowDef'];
            }
            if(cardData["billCard"]){
                if(cardData["billCard"].head){
                    this.props.form.setAllFormValue({ [this.formId2]: cardData["billCard"].head[this.formId2]});
                    this.setState({
                        materialpk:this.props.form.getFormItemsValue(this.formId2,'pk_material').value
                    })
                }
                if(cardData["billCard"].bodys){
                    this.props.cardTable.setTableData(that.tableId1, cardData["billCard"].bodys[that.tableId1]);
                    this.props.cardTable.setTableData(that.tableId2, cardData["billCard"].bodys[that.tableId2]);
                    this.props.cardTable.setTableData(that.tableId3, cardData["billCard"].bodys[that.tableId3]);
                    this.props.cardTable.setTableData(that.tableId4, cardData["billCard"].bodys[that.tableId4]);
                    this.props.cardTable.setTableData(that.tableId5, cardData["billCard"].bodys[that.tableId5]);
                    this.props.cardTable.setTableData(that.tableId6, cardData["billCard"].bodys[that.tableId6]);
                    this.props.cardTable.setTableData(that.tableId7, cardData["billCard"].bodys[that.tableId7]);
                    this.props.cardTable.setTableData(that.tableId8, cardData["billCard"].bodys[that.tableId8]);
                }
            }
            this.updateUploadData(this.state.materialpk);
            this.queryAttachByPath(this.state.materialpk);
            callback&&callback();
            this.toggleShow(status);
        }else{
            let data = { pk: id, pageid: this.pageId };
            ajax({
                url: urls.queryCardDataUrl,
                data: data,
                success: (res) => {
                    if (res.data) {
                        showFormular(this.props,res,{
                            "material_pf" : "form",
                            'material' : "form",
                            'materialconvert' : 'cardTable',
                            'fi': 'cardTable',
                            'pfc': 'cardTable',
                            'pu': 'cardTable',
                            'sale': 'cardTable',
                            'stock': 'cardTable',
                            'plan': 'cardTable',
                            'prod': 'cardTable',
                        });
                        this.state.sysParam = res.data['sysParam'];
                        if(res.data["form2"]){
                            this.props.form.setAllFormValue({ [this.formId1]: res.data["form2"][this.formId1]});
                            this.props.form.setFormItemsDisabled(this.formId1,{'billno':!res.data['isCodeEdit']});
                            this.state.isPrecode = res.data['isPrecode'];
                            this.state.hasApproveflowDef = res.data['hasApproveflowDef'];
                            res.data['head']=res.data["form2"];
                        }
                        if(res.data["billCard"]){
                            if(res.data["billCard"].head){
                                this.props.form.setAllFormValue({ [this.formId2]: res.data["billCard"].head[this.formId2]});
                                this.props.form.setFormItemsDisabled(this.formId2,{'code':!res.data['materialisCodeEdit']});
                                this.state.materialisPrecode = res.data['materialisPrecode'];
                                this.setState({
                                    materialpk:this.props.form.getFormItemsValue(this.formId2,'pk_material').value
                                })
                            }
                            if(res.data["billCard"].bodys){
                                this.props.cardTable.setTableData(that.tableId1, res.data["billCard"].bodys[that.tableId1]);
                                this.props.cardTable.setTableData(that.tableId2, res.data["billCard"].bodys[that.tableId2]);
                                this.props.cardTable.setTableData(that.tableId3, res.data["billCard"].bodys[that.tableId3]);
                                this.props.cardTable.setTableData(that.tableId4, res.data["billCard"].bodys[that.tableId4]);
                                this.props.cardTable.setTableData(that.tableId5, res.data["billCard"].bodys[that.tableId5]);
                                this.props.cardTable.setTableData(that.tableId6, res.data["billCard"].bodys[that.tableId6]);
                                this.props.cardTable.setTableData(that.tableId7, res.data["billCard"].bodys[that.tableId7]);
                                this.props.cardTable.setTableData(that.tableId8, res.data["billCard"].bodys[that.tableId8]);
                            }
                        }
                    } else {
                        this.props.form.EmptyAllFormValue(this.formId1);
                        this.props.form.EmptyAllFormValue(this.formId2);
                        this.props.cardTable.setTableData(this.tableId1, { rows: [] });
                        this.props.cardTable.setTableData(this.tableId2, { rows: [] });
                        this.props.cardTable.setTableData(this.tableId3, { rows: [] });
                        this.props.cardTable.setTableData(this.tableId4, { rows: [] });
                        this.props.cardTable.setTableData(this.tableId5, { rows: [] });
                        this.props.cardTable.setTableData(this.tableId6, { rows: [] });
                        this.props.cardTable.setTableData(this.tableId7, { rows: [] });
                        this.props.cardTable.setTableData(this.tableId8, { rows: [] });
                    }
                    updateCache(pk_item,id,res.data,this.formId1,dataSource);
                    this.updateUploadData(this.state.materialpk);
                    this.queryAttachByPath(this.state.materialpk);
                    callback&&callback();
                    this.toggleShow(status);
                }
            });
        }
    }

    //切换页面状态
    toggleShow = (status) => {
        let flag = status != 'browse' ? false : true;
        this.props.button.setButtonVisible(['add', 'edit','addline','delete','refresh','commit','approve','print','attachment','back','RowApprInfo'], flag);
        this.props.button.setButtonVisible(['save','cancel','addline'], !flag);
        this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
        this.props.BillHeadInfo.setBillHeadInfoVisible({showBackBtn:flag});
        if(flag){
            let billstate = this.props.form.getFormItemsValue(this.formId1,'billstatus').value
            this.props.button.setButtonVisible(['commit','delete'], (billstate==-1));
            this.props.button.setButtonVisible(['RowApprInfo'], !(billstate==-1));
            this.props.button.setButtonVisible(['recall'], (billstate==3||billstate==1));
            this.props.button.setDisabled({
                commit:!(billstate==-1),
                delete:!(billstate==-1),
                recall:(billstate==-1),
                RowApprInfo:(billstate==-1)
            });
        }
        this.props.form.setFormStatus(this.formId1, status === 'browse' ? 'browse' : 'edit' );
        this.props.form.setFormStatus(this.formId2, status === 'browse' ? 'browse' : 'edit');
        this.props.cardTable.setStatus(this.tableId1, status==='browse'?"browse" :"edit");
        setTimeout( () => {
            this.setState({
                stated:status
            })
        },0);


    };

    //保存单据
    saveBill = () => {
        this.props.cardTable.filterEmptyRows(this.tableId1,['pk_measdoc','measrate'],"include");
        let formData = this.props.form.getAllFormValue(this.formId1);
        let flag = this.props.form.isCheckNow(this.formId1);
        if(!flag)return
        this.isCheckForm(this.formId2, (flag2) =>{
            if(!flag2) return
            formData = this.props.form.getAllFormValue(this.formId1);
            formData["areacode"] = formId1;
            let CardData = this.props.createExtCardData(this.pageId, this.formId2, [this.tableId1]);
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
                                "material_pf" : "form",
                                'material' : "form",
                                'materialconvert' : 'cardTable',
                                'fi': 'cardTable',
                                'pfc': 'cardTable',
                                'pu': 'cardTable',
                                'sale': 'cardTable',
                                'stock': 'cardTable',
                                'plan': 'cardTable',
                                'prod': 'cardTable',
                            });
                            if (res.data) {
                                this.showmemo(res,()=>{
                                    if(res.data["form2"]){
                                        this.props.form.setAllFormValue({ [this.formId1]: res.data["form2"][this.formId1]});
                                        this.state.hasApproveflowDef = res.data['hasApproveflowDef'];
                                    }
                                    if(res.data["billCard"]){
                                        if(res.data["billCard"].head){
                                            this.props.form.setAllFormValue({ [this.formId2]: res.data["billCard"].head[this.formId2]});
                                        }
                                        if(res.data["billCard"].bodys){
                                            this.props.cardTable.setTableData(tableId1, res.data["billCard"].bodys[tableId1]);
                                            this.props.cardTable.setTableData(tableId2, res.data["billCard"].bodys[tableId2]);
                                            this.props.cardTable.setTableData(tableId3, res.data["billCard"].bodys[tableId3]);
                                            this.props.cardTable.setTableData(tableId4, res.data["billCard"].bodys[tableId4]);
                                            this.props.cardTable.setTableData(tableId5, res.data["billCard"].bodys[tableId5]);
                                            this.props.cardTable.setTableData(tableId6, res.data["billCard"].bodys[tableId6]);
                                            this.props.cardTable.setTableData(tableId7, res.data["billCard"].bodys[tableId7]);
                                            this.props.cardTable.setTableData(tableId8, res.data["billCard"].bodys[tableId8]);
                                        }
                                    }
                                    let idvalue = res.data["form2"][this.formId1].rows[0].values.pk_material_pf.value;
                                    res.data['head']=res.data["form2"];
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
                                    toast({ color: 'success', title: this.state.json['10140MPF-000024'] });/* 国际化处理： 保存成功！*/
                                    this.toggleShow("browse");
                                })
                            } else {
                                this.props.form.EmptyAllFormValue(this.formId1);
                                this.props.form.EmptyAllFormValue(this.formId2);
                                this.props.cardTable.setTableData(this.tableId1, { rows: [] });
                                this.props.cardTable.setTableData(this.tableId2, { rows: [] });
                                this.props.cardTable.setTableData(this.tableId3, { rows: [] });
                                this.props.cardTable.setTableData(this.tableId4, { rows: [] });
                                this.props.cardTable.setTableData(this.tableId5, { rows: [] });
                                this.props.cardTable.setTableData(this.tableId6, { rows: [] });
                                this.props.cardTable.setTableData(this.tableId7, { rows: [] });
                                this.props.cardTable.setTableData(this.tableId8, { rows: [] });
                            }
                        }
                    });
                } , {[formId2]:'form',[tableId1]:'cardTable'} , 'extcard' )
            } , {[formId1]:'form'} , 'form' )
        });

    };
    showmemo=(res,callback)=>{
        if(this.state.memo){
            promptBox({
                color:"warning",
                title: this.state.json['10140MPF-000045'],/* 国际化处理： 错误信息*/
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
                    toast({ color: 'success', title: this.state.json['10140MPF-000025'] });/* 国际化处理： 删除成功！*/
                    if(nextId){
                        this.props.pushTo("/card", {
                            pagecode:pageId,
                            status: 'browse',
                            id: nextId
                        });
                        this.getData('browse',nextId);
                    }else{
                        this.props.pushTo("/list",{
                            pagecode:'10140MPF_approve',
                        });
                    }
                }
            }
        });
    }

    //获取列表肩部信息
    getTableHead1 = (tableId) => {
        let { createButtonApp } = this.props.button;
        return (
            <div className="shoulder-definition-area">
                <div className="">
                    {createButtonApp({
                        area: 'table-button-area',
                        buttonLimit: 3,
                        onButtonClick: this.buttonClick.bind(this),
                        popContainer: document.querySelector('.table-button-area')

                    })}
                </div>
                <div className="definition-icons">
                    {this.props.cardTable.createBrowseIcons(tableId, {
                        iconArr: ['close', 'open', 'max','setCol'],
                        maxDestAreaId: 'nc-bill-extCard'
                    })}
                </div>
            </div>
        );
    };
    getTableHead = ( tableId) => {
        let { createButtonApp } = this.props.button;
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {this.props.cardTable.createBrowseIcons(tableId, {
                        iconArr: ['close', 'open', 'max','setCol'],
                        maxDestAreaId: 'nc-bill-form-area'
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

    //子表双击事件
    onRowDoubleClick=(moduleid,props, record, index)=>{
        let tableid = null;
        let title= null;
        let pk_measdocarr = [];
        switch(moduleid){
            case this.tableId2:
                title =this.state.json['10140MPF-000000'];/* 国际化处理： 财务信息*/
                break;
            case this.tableId3:
                tableid = 'materialpfcsub';
                title =this.state.json['10140MPF-000001'];/* 国际化处理： 利润中心信息*/
                break;
            case this.tableId4:
                title =this.state.json['10140MPF-000002'];/* 国际化处理： 采购信息*/
                break;
            case this.tableId5:
                tableid = 'materialbindle';
                title =this.state.json['10140MPF-000003'];/* 国际化处理： 销售信息*/
                break;
            case this.tableId6:
                let pk_measdoc = props.form.getFormItemsValue('material','pk_measdoc');
                let cardTableData = props.cardTable.getAllRows('materialconvert');
                if(pk_measdoc && pk_measdoc.value){
                    pk_measdocarr.push(pk_measdoc.value);
                }
                (cardTableData || []).forEach(element => {
                    pk_measdocarr.push(element.values['pk_measdoc'].value);
                });
                tableid = 'materialwarh';
                title =this.state.json['10140MPF-000004'];/* 国际化处理： 库存信息*/
                break;
            case this.tableId7:
                tableid = 'materialrepl';
                title =this.state.json['10140MPF-000005'];/* 国际化处理： 计划信息*/
                break;
            case this.tableId8:
                title =this.state.json['10140MPF-000006'];/* 国际化处理： 生产信息*/
                break;
        }
        let formConfig ={
            pk:this.props.getUrlParam("id"),
            moduleId:moduleid,
            formId:moduleid,
            tableId:tableid,
            state:"browse",
            billstatus:this.props.form.getFormItemsValue(this.formId1,'billstatus').value,
            pk_org:this.props.form.getFormItemsValue(this.formId1,'pk_org').value,
            pk_measdocarr:pk_measdocarr,
        }
        this.props.modal.show("source",{
            title:title,
            content:<Materialpftabs config={formConfig} />,
            //userControl:true,//自己控制什么时候关闭窗口
            beSureBtnClick:this.onSaveSys.bind(this)
        });
    }

    onSaveSys(){}

    onHideUploader(){
        this.setState({
            showUploader: false,
        })
    }


    getmaterialpfpk(){
        return this.form.getFormItemsValue(this.formId1,'pk_material_pf');
    }

    //必输项校验
    isCheckForm(moduleId, callback) {
        let flag = true;
        let requiredItems = [];
        let secrequiredItems = [];
        this.state.memo = null;
        if (typeof moduleId === 'string') {
            let verifyObj =this.getRequiredItems.call(this, moduleId);;
            if (verifyObj) {
                flag = verifyObj.flag;
                requiredItems = verifyObj.requiredItems
                secrequiredItems = verifyObj.secrequiredItems
            }
        }
        if (!flag) {
            let errorMsg = requiredItems.join("，");
            if(this.state.sysParam == true){
                this.state.memo = `${this.state.json['10140MPF-000046']} \n ${this.state.json['10140MPF-000034']}\n ${errorMsg}`;
                this.props.form.setFormItemsValue([this.formId1],{'memo':{value:this.state.memo,display:null}});
                flag = true;
            }else{
                toast({
                    color: 'danger',
                    content: `${this.state.json['10140MPF-000046']} \n ${this.state.json['10140MPF-000034']}\n ${errorMsg}`/* 国际化处理： 下列字段不能为空*/
                });
            }
        }else{
            this.props.form.setFormItemsValue([this.formId1],{'memo':{value:null,display:null}});
        }
        callback && callback(flag)
    }

    getRequiredItems(moduleId){
        //单个表单
        let itemsArr = [];
        if (this.props.meta.getMeta()["material"]) {
            itemsArr = this.props.meta.getMeta()["material"].items;
        }
        let finalValue = '';
        let lengthTypes = ['input', 'number', 'textarea'];
        let switchfalse = ['switch', 'switch_browse', 'radio','checkbox_switch'];
        let items = this.state.materialisPrecode?[]:['code'];
        itemsArr = itemsArr.filter((item) => item.visible == true);
        let formData = this.props.form.getAllFormValue(moduleId);
        let secrequiredItems = itemsArr.filter((ele)=>{
            finalValue = formData.rows[0].values[ele.attrcode].value
            return (!finalValue)&&items.includes(ele.attrcode)
        }).map(function (ele, index) {
            return ele.label;
        });;
        let requiredItems = itemsArr
            .filter((ele) => {
                finalValue = formData.rows[0].values[ele.attrcode].value

                let flag = true;
                let flagitem = true;
                if(switchfalse.includes(ele.itemtype)){
                    return false;
                }
                if (finalValue && ele.reg) {
                    flag = ele.reg.test(finalValue);
                    ele.reg.lastIndex = 0;
                }
                if (lengthTypes.includes(ele.itemtype) && finalValue && ele.maxlength && finalValue.length > ele.maxlength) {
                    flag = false;
                }
                if(items.includes(ele.attrcode)){
                    flagitem = false;
                }
                return flagitem&&((ele.required && !finalValue && finalValue !== 0) || (!flag));
            })
            .map(function (ele, index) {
                return ele.label;
            });
        let flag1 = requiredItems.length<=0
        return {flag: flag1,requiredItems:requiredItems,secrequiredItems:secrequiredItems};
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
                        toast({ color: 'success', content: this.state.json['10140MPF-000027'] });/* 国际化处理： 提交成功*/
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

    //图片上传
    getUplodImg = () => {
        return this.state.stated != 'browse' ? (
            <NCUpload
                action='/nccloud/platform/attachment/upload.do'
                data = {this.state.imguploaddata}
                onChange={this.onUploadImgChange}
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                listType='picture'
                accept="image/jpg"
            >
                <div  style={{position:'relative'}}>
                    <div className='left-img' style={{display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                        {(!this.state.img_url || this.state.img_url === '') && <i class="uf uf-cloud-o-up"/>}
                        {this.state.img_url && this.state.img_url !== '' && <img src={this.state.img_url} style={{width:'100%',height:'100%'}} />}
                    </div>
                    {this.state.img_url && this.state.img_url !== '' && <i class="uf uf-close" style={{position:'absolute',right:-5,top:-5}} onClick={this.deleteImg}/>}
                </div>
            </NCUpload>
        ):(
            <div  style={{position:'relative'}}>
                <div className='left-img' style={{display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                    {(!this.state.img_url || this.state.img_url === '') && <i class="uf uf-cloud-o-up"/>}
                    {this.state.img_url && this.state.img_url !== '' && <img src={this.state.img_url} style={{width:'100%',height:'100%'}} />}
                </div>
            </div>
        )
    }

    /**
     * 查询图片
     */
    queryAttachByPath =(pk_material_pf) => {
        let params = {
            billId:'uapbd/IMG/c7dc0ccd-8872-4eee-8882-160e8f49dfad/'+pk_material_pf,
            fullPath:'uapbd/IMG/c7dc0ccd-8872-4eee-8882-160e8f49dfad/'+pk_material_pf,
        };
        ajax({
            url: "/nccloud/platform/attachment/query.do",
            data: params,
            success: res => {
                let { data } = res;
                if(data && data[0] && data[0].fullPath){
                    this.setState({
                        img_url: data[0].previewUrl
                    })
                }else{
                    this.setState({
                        img_url: ''
                    })
                }
            }
        });
    }

    beforeUpload = (billId, fullPath, file, fileList)=>{
        if(fileList&&fileList.length>0){
            toast({ color: 'warning', content: "当前只支持一张图片显示"});
            return false
        }
        const isJPG = fullPath[0].type === 'image/jpeg';
        if (!isJPG) {
            alert(this.state.json['10140MPF-000028'])/* 国际化处理： 只支持jpg格式图片*/
        }
        const isLt2M = fullPath[0].size / 1024 / 1024 < 2;
        if (!isLt2M) {
            alert(this.state.json['10140MPF-000029'])/* 国际化处理： 上传大小小于2M*/
        }
        return isJPG && isLt2M;
    }

    onUploadImgChange = (info) => {
        let {file} = info;
        let {status,response} = file;
        if(status === 'done'){
            //上传完成
            if(response.data && response.data.length  > 0){
                this.setState({
                    img_url : response.data[0].previewUrl,
                    imgcachelist : response.data,
                    isUploadImg : true
                });
            }
        }
    }

    /**
     * 点击删除按钮删除图片
     */
    deleteImg = () => {
        if(this.state.isUploadImg && this.state.imgcachelist.length > 0){
            this.state.imgcachelist.forEach(item=>{
                this.deleteImageDB(item);
            });
        }
        this.setState({
            imgcachelist : [],
            isUploadImg : true,
            img_url : ''
        })
    }

    /**
     * 数据库删除图片
     */
    deleteImageDB = (item,callback) => {
        ajax({
            url : '/nccloud/platform/attachment/delete.do',
            data : {
                billId : item.billId,
                fullPath: item.fullPath,
                pk_doc : item.pk_doc
            },
            success:(res)=>{
                callback && callback();
            }
        })
    }

    updateUploadData = (pk_material_pf) => {
        let businessInfo = getBusinessInfo();
        let imgpath = businessInfo.userId;
        if(pk_material_pf){
            imgpath = imgpath + '/' + pk_material_pf;
        }
        this.state.imguploaddata.billId = 'uapbd/IMG/c7dc0ccd-8872-4eee-8882-160e8f49dfad/' + imgpath;
        this.state.imguploaddata.fullPath = 'uapbd/IMG/c7dc0ccd-8872-4eee-8882-160e8f49dfad/' + imgpath;
        this.state.imgcachelist = [];
        this.state.isUploadImg = false;
        this.setState(this.state);
    }

    closeApprove = () =>{
        this.setState({
            showApprInfo: false
        })
    }

    render() {
        let { cardTable, form, button, modal, cardPagination,search ,table,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        let multiLang = this.props.MutiInit.getIntl(this.moduleId);
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createCardPagination } = cardPagination;
        let { createButton, createButtonApp } = button;
        let { createModal } = modal;
        let iconItem = this.state.showBaseInfo ? 'icon-jiantouxia1' : 'icon-jiantouyou'

        let groupItem = this.state.showBaseInfo ? "show-form" : "hide-form"

        let temp = this.state.img_url == ""?this.state.userId:this.state.materialpk;
        return (
            <div className="nc-bill-extCard">
                <div className="nc-bill-top-area">
                    <NCAffix>
                        <NCDiv  areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                            <span>
                            {
                                createBillHeadInfo(
                                    {
                                        title :this.state.json['10140MPF-000007']/* 国际化处理： 物料申请单*/,             //标题
                                        backBtnClick:this.buttonClick.bind(this,this.props,'back')
                                    }
                                )}
                            </span>
                            <div className="header-button-area">
                                {createButtonApp({
                                    area: 'header-button-area',
                                    buttonLimit: 3,
                                    onButtonClick: this.buttonClick.bind(this),
                                    popContainer: document.querySelector('.header-button-area')

                                })}
                            </div>
                            <div className='header-cardPagination-area' style={{float:'right'}}>
                                {this.props.getUrlParam('id')&&createCardPagination({
                                    handlePageInfoChange: this.pageInfoClick.bind(this),
                                    dataSource: dataSource
                                })}
                            </div>
                        </NCDiv>
                    </NCAffix>
                    <NCAnchor>
                        <NCScrollLink
                            to='head'
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140MPF-000007']/* 国际化处理： 物料申请单*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to='material'
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140MPF-000008']/* 国际化处理： 物料信息*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to='materialconvert'
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140MPF-000009']/* 国际化处理： 计量信息*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to='fi'
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-50}
                        >
                            <p>{this.state.json['10140MPF-000000']/* 国际化处理： 财务信息*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to='pfc'
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-50}
                        >
                            <p>{this.state.json['10140MPF-000001']/* 国际化处理： 利润中心信息*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to='pu'
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-50}
                        >
                            <p>{this.state.json['10140MPF-000002']/* 国际化处理： 采购信息*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to='sale'
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-50}
                        >
                            <p>{this.state.json['10140MPF-000003']/* 国际化处理： 销售信息*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to='stock'
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-50}
                        >
                            <p>{this.state.json['10140MPF-000004']/* 国际化处理： 库存信息*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to='plan'
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-50}
                        >
                            <p>{this.state.json['10140MPF-000005']/* 国际化处理： 计划信息*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to='prod'
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-50}
                        >
                            <p>{this.state.json['10140MPF-000006']/* 国际化处理： 生产信息*/}</p>
                        </NCScrollLink>
                    </NCAnchor>
                    <NCScrollElement name='head'>
                        <div className="nc-bill-form-area">
                            {createForm(this.formId1, {
                                onAfterEvent: this.afterEvent.bind(this),
                                headLeftArea : this.getUplodImg
                            })}
                        </div>
                    </NCScrollElement>

                    <NCScrollElement name='material'>
                        <div className="nc-bill-form-area">
                            <div className='group-form-wrapper'>
                                <NCDiv fieldid="materialbaseinfo" areaCode={NCDiv.config.Group} className="group-form-name">
                                    <span
                                        className={`toggle-form-icon iconfont ${iconItem}`}
                                        onClick={() => {
                                            let show = !this.state.showBaseInfo
                                            this.setState({
                                                showBaseInfo: show
                                            });
                                        }}
                                    />
                                    <span className="name">{this.state.json['10140MPF-000008']/* 国际化处理： 物料信息*/}</span>
                                </NCDiv>
                                <div className={`group-form-item ${groupItem} `}>
                                    {createForm(this.formId2, {
                                        onAfterEvent: this.afterEvent.bind(this)
                                    })}
                                </div>
                            </div>
                        </div>
                    </NCScrollElement>
                </div>
                <div className="nc-bill-bottom-area">
                    <NCScrollElement name='materialconvert'>
                        <div className="nc-bill-table-area">
                            {createCardTable(this.tableId1, {
                                tableHead: this.getTableHead1.bind(this, this.tableId1),
                                modelSave: this.saveBill,
                                onAfterEvent: this.tableafterEvent.bind(this),
                                showCheck: true,
                                showIndex: true
                            })}
                        </div>
                    </NCScrollElement>
                    {this.state.stated === 'browse'&&<div>
                        <NCScrollElement name='fi'>
                            <div className="nc-bill-table-area">
                                {createCardTable(this.tableId2, {
                                    tableHead: this.getTableHead.bind(this,  this.tableId2),
                                    modelSave: this.saveBill,
                                    onRowDoubleClick: this.onRowDoubleClick.bind(this,this.tableId2),
                                    showIndex: true
                                })}
                            </div>
                        </NCScrollElement>
                        <NCScrollElement name='pfc'>
                            <div className="nc-bill-table-area">
                                {createCardTable(this.tableId3, {
                                    tableHead: this.getTableHead.bind(this,  this.tableId3),
                                    modelSave: this.saveBill,
                                    onRowDoubleClick: this.onRowDoubleClick.bind(this,this.tableId3),
                                    showIndex: true
                                })}
                            </div>
                        </NCScrollElement>
                        <NCScrollElement name='pu'>
                            <div className="nc-bill-table-area">
                                {createCardTable(this.tableId4, {
                                    tableHead: this.getTableHead.bind(this,  this.tableId4),
                                    modelSave: this.saveBill,
                                    onRowDoubleClick: this.onRowDoubleClick.bind(this,this.tableId4),
                                    showIndex: true
                                })}
                            </div>
                        </NCScrollElement>
                        <NCScrollElement name='sale'>
                            <div className="nc-bill-table-area">
                                {createCardTable(this.tableId5, {
                                    tableHead: this.getTableHead.bind(this,  this.tableId5),
                                    modelSave: this.saveBill,
                                    onRowDoubleClick: this.onRowDoubleClick.bind(this, this.tableId5),
                                    showIndex: true
                                })}
                            </div>
                        </NCScrollElement>
                        <NCScrollElement name='stock'>
                            <div className="nc-bill-table-area">
                                {createCardTable(this.tableId6, {
                                    tableHead: this.getTableHead.bind(this,  this.tableId6),
                                    modelSave: this.saveBill,
                                    onRowDoubleClick: this.onRowDoubleClick.bind(this, this.tableId6),
                                    showIndex: true
                                })}
                            </div>
                        </NCScrollElement>
                        <NCScrollElement name='plan'>
                            <div className="nc-bill-table-area">
                                {createCardTable(this.tableId7, {
                                    tableHead: this.getTableHead.bind(this,  this.tableId7),
                                    modelSave: this.saveBill,
                                    onRowDoubleClick: this.onRowDoubleClick.bind(this,this.tableId7),
                                    showIndex: true
                                })}
                            </div>
                        </NCScrollElement>
                        <NCScrollElement name='prod'>
                            <div className="nc-bill-table-area">
                                {createCardTable(this.tableId8, {
                                    tableHead: this.getTableHead.bind(this, this.tableId8),
                                    modelSave: this.saveBill,
                                    onRowDoubleClick: this.onRowDoubleClick.bind(this, this.tableId8),
                                    showIndex: true
                                })}
                            </div>
                        </NCScrollElement>
                    </div>}
                </div>
                {createModal('delete', {
                    title: this.state.json['10140MPF-000031'],/* 国际化处理： 注意*/
                    content: this.state.json['10140MPF-000032'],/* 国际化处理： 确认删除？*/
                    beSureBtnClick: this.deleteBill.bind(this)
                })}
                {createModal('modal')}
                { createModal("source",{
                    title:'null',
                    content:<Materialpftabs config={this.state.formConfig} />,
                    //userControl:true,//自己控制什么时候关闭窗口
                    noFooter : true,
                    beSureBtnClick:this.onSaveSys.bind(this)
                }) }
                {this.state.showUploader&&<NCUploader
                    billId={'uapbd/6b2c8309-930b-4989-8b0e-f2a80f35c62c/'+this.state.materialpfpk}
                    //billNo={'001'}
                    //target={target}
                    placement={'bottom_right'}
                    multiple={true}
                    onHide={this.onHideUploader.bind(this)}
                    //beforeUpload={this.beforeUpload}
                />}
                
                <PrintOutput
                    ref='printOutput'
                    url= {urls['printurl']}
                    data={{
                        funcode:'10140MPF',
                        nodekey:'materialpfcard',     //模板节点标识
                        oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output",
                        userjson :`{type:'card'}`
                    }}
                    //callback={this.onSubmit}
                >
                </PrintOutput>
                {this.state.compositedisplay ? <ApprovalTrans
                    title={this.state.json['10140MPF-000033']}/* 国际化处理： 指派*/
                    data={this.state.compositedata}
                    display={this.state.compositedisplay}
                    getResult={this.getAssginUsedr.bind(this)}
                    cancel={this.turnOff.bind(this)}
                /> : ""}
                <ApproveDetail
                    show={this.state.showApprInfo}
                    close={this.closeApprove.bind(this)}
                    billtype='10WL'
                    billid={this.state.billId}
                />
            </div>
        );
        let { NCCreateSearch } = search;


        let { createSimpleTable } = table;
    }
}

Card = createPage({
    billinfo:[{
        billtype: 'card',
        pagecode: "10140MPF_approve_card",
        headcode: 'material',
        bodycode: 'materialconvert'
    },{
        billtype: 'form',
        pagecode: "10140MPF_approve_card",
        headcode: 'material_pf'
    }]
})(Card);

//ReactDOM.render(<Card />, document.querySelector('#app'));
//6b2c8309-930b-4989-8b0e-f2a80f35c62c
export default Card;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65