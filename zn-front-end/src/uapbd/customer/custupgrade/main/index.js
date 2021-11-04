//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast ,high,getBusinessInfo,promptBox,createPageIcon} from 'nc-lightapp-front';
import utils from '../../../public/utils';
const {showFormular } = utils;
let businessInfo = getBusinessInfo();
let {  NCAnchor, NCScrollLink, NCScrollElement, NCAffix  } = base;
const { NCTabs,NCCol,NCMessage } = base;
const NCTabPane = NCTabs.NCTabPane;
let {BDselect} = Utils;
import Utils from '../../../public/utils/index.js';
import customer from '../../../refer/customer/CustomerDefaultTreeGridRef';
import Sourcecust from "../components/sourcecust.js"
import './index.less'
import SupBaseInfo from "../../../customersupplier/supupgrade/component/supbaseinfo";
import createUIDom from "../../../public/utils/BDCreateUIDom";

const formId = 'customer';
const formId2 = 'custupgradequery';
const tableId1 = 'custbanks';
const tableId2 = 'custcontacts';
const tableId3 = 'custtaxtypes';
const pageId = '1317CUUG_base';//页面id
const appcode = '1317CUUG';//注册按钮的id
const oid = '1002Z01000000000EZCZ';
const ugtableid = 'custupgrade';
const ugsearchid = 'custupgradesearch';
const linkman='10140LM';
let urls={
    editUrl:'/nccloud/uapbd/custupgrade/dealupcustomer.do',
    saveUrl:'/nccloud/uapbd/custupgrade/saveupcustomer.do',
    queryListUrl:'/nccloud/uapbd/custupgrade/queryupgradecustomer.do',
    saveLinkman:"/nccloud/uapbd/custupgrade/saveLinkman.do",
    queryLinkman:"/nccloud/uapbd/custupgrade/queryLinkman.do"
};

let tableBtnAry =(props)=>{
    return  props.cardTable.getStatus(tableId2) === 'browse' ?['spread']:['edit','delline'];
}

class Card extends Component {
    constructor(props) {
        super(props);
        this.formId = formId;
        this.moduleId = '3630';
        this.tableId1 = tableId1;
        this.tableId2 = tableId2;
        this.tableId3 = tableId3;
        this.ugtableid = ugtableid;
        this.pageId = pageId;
        this.appcode = appcode;
        this.modeclassid = 'e4f48eaf-5567-4383-a370-a59cb3e8a451';
        this.state = {
            customerdata:null,
            curOrg:null,
            customer:null,
            oldFormData:null,
            hasDatatype:null,//判断当前客户所属组织
            formConfig:null,
            stated:'browse',
            json: {},
            inlt:null,
        };
        this.Supdata={};
        this.issupplier=null;
        this.initTemplate(this.props, () => {
            this.toggleShow("browse");
        });
    }

    componentDidUpdate(){
        let formStatus = this.props.form.getFormStatus(this.formId);
        if(formStatus === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    initTemplate = (props,callback) =>{
        createUIDom(props)(
            {
                pagecode: pageId
            },
            {
                moduleId: "1317CUUG",domainName: 'uapbd'
            },
            (data,langData,inlt)=>{
                if(langData){
                    this.state.json = langData
                    if(inlt){
                       this.state.inlt = inlt
                    }
                }
                if(data){
                    if(data.template){
                        let meta = data.template;
                        this.modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    callback&&callback()
                }
            }
        )
    }

    modifierMeta = (props, meta)=> {
        let status = 'browse';
        meta[formId2].status = "edit";
        meta[formId].status = status;
        meta[tableId1].status = status;
        meta[tableId2].status = status;
        meta[tableId3].status = status;

        meta[ugsearchid].items.map((item, key) =>{
            if (item.attrcode == "destcust.code") {
                item['refcode']='uapbd/refer/customer/CustomerDefaultTreeGridRef/index.js';
                item.isMultiSelectedEnabled = true;
            }
            if (item.attrcode == "sourceorg"||item.attrcode == "destcust.pk_org") {
                item.isMultiSelectedEnabled = true;
                item.queryCondition=()=>{
                    return {
                        TreeRefActionExt: 'nccloud.web.uapbd.customer.custupgrade.action.BusinessUnitAllTreeRefExt'
                    }
                }
            }
            if (item.attrcode == "operator") {
                item.isMultiSelectedEnabled = true;
            }
            if (item.attrcode == "destcust.pk_org") {
                item.isMultiSelectedEnabled = true;
            }

        })
        meta[formId].items.map((item,key)=>{
            if(item.attrcode == "pk_custclass"){
                item.queryCondition=()=>{
                    return {
                        pk_org:props.form.getFormItemsValue(formId,'pk_org')?props.form.getFormItemsValue(formId,'pk_org').value:null,
                    }
                }
            }
        })
        meta[formId2].items.map((item, key) => {
            if (item.attrcode == "sourceorg") {
                item['disabled']=false;
            }
            if (item.attrcode == "pk_source") {
                item['refcode']='uapbd/refer/customer/CustomerDefaultTreeGridRef/index.js';
                item['disabled']=true;
                item.isMultiSelectedEnabled = true;
                item.queryCondition=()=>{
                    return {
                        pk_org:props.form.getFormItemsValue(formId2,'sourceorg')?props.form.getFormItemsValue(formId2,'sourceorg').value:null,
                        GridRefActionExt: 'nccloud.web.uapbd.customer.custupgrade.action.BusinessUnitAllGridRefExt'
                    }
                }
            }
        });

        let multiLang = props.MutiInit.getIntl('3630');
        let porCol = {
            attrcode: 'opr',
            label: this.state.json['1317CUUG-000000'],/* 国际化处理： 操作*/
            visible: true,
            className:'table-opr',
            width:'200px',
            itemtype: 'customer',
            fixed:'right',
            render:(text, record, index)=> {
                const btnArray = props.cardTable.getStatus(tableId2) === 'browse' ?['spread']:[];
                const tableId = tableId1;
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-opr-area",
                        buttonLimit: 3,
                        onButtonClick: (props, id ) => this.tableButtonClick(props, id,tableId, text, record, index)
                    }
                )
            }
        };
        meta[tableId1].items.push(porCol);

        let porCol2 = {
            attrcode: 'opr',
            label: this.state.json['1317CUUG-000000'],/* 国际化处理： 操作*/
            visible: true,
            className:'table-opr',
            width:'200px',
            itemtype: 'customer',
            fixed:'right',
            render:(text, record, index)=> {
                const btnArray = tableBtnAry(props);
                const tableId = tableId2;

                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-opr-area",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => this.tableButtonClick(props, id,tableId, text, record, index)
                    }
                )
            }
        };
        meta[tableId2].items.push(porCol2);

        let porCol3 = {
            attrcode: 'opr',
            label: this.state.json['1317CUUG-000000'],/* 国际化处理： 操作*/
            visible: true,
            className:'table-opr',
            width:'200px',
            itemtype: 'customer',
            fixed:'right',
            render:(text, record, index) =>{

                const btnArray = props.cardTable.getStatus(tableId2) === 'browse' ?[]:[];
                const tableId = tableId3;

                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-opr-area",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => thids.tableButtonClick(props, id,tableId, text, record, index)
                    }
                )
            }
        };
        meta[tableId3].items.push(porCol3);

        return meta;
    }

    tableButtonClick = (props, id, tableId,text, record, index) => {

        switch(id){

            case "delline"://删除行
                props.cardTable.delRowsByIndex(tableId, index);
                e.stopPropagation();
                break;
            case "edit"://更多
                ajax({
                    url:urls.queryLinkman,
                    data:{
                        pageid:pageId,
                        moudleid:linkman,
                        pk:record.values["pk_linkman"].value
                    },
                    success:(res)=>{
                        showFormular(this.props,res,{
                            "10140LM" : "form",
                        });
                        let{success,data} =res;
                        if(success){
                            if(data){
                                props.form.setFormStatus(linkman,'edit');
                                props.form.setAllFormValue({[linkman]:res.data[linkman]})
                                this.tablemodalshow(props,index);
                            }
                        }
                    }
                });
                break;
            case "spread"://展开
                props.cardTable.toggleRowView(tableId, record);
                break;
            default:
                console.log(id,index);
                break;
        }
    }

    tablemodalshow = (props,index) => {
        props.modal.show('linkmanModal',{
            beSureBtnClick:()=>{
                let lmdata = props.form.getAllFormValue(linkman);
                lmdata["areacode"] = linkman;
                this.props.validateToSave( {"model" : lmdata,"pageid" : this.pageId} , ()=>{
                    ajax({
                        url:urls.saveLinkman,
                        data:{
                            'pageid':pageId,
                            'gridModel':lmdata
                        },
                        success:(res)=>{
                            let{success,data} =res;
                            if(success){
                                if(data){
                                    //联系人新增成功，回显子表数据
                                    props.cardTable.setValByKeyAndIndex(tableId2,index,'pk_linkman',{value:data,display:data});
                                    props.cardTable.setValByKeyAndIndex(tableId2,index,'pk_linkman.name',lmdata.rows[0].values.name);
                                    props.cardTable.setValByKeyAndIndex(tableId2,index,'pk_linkman.sex',lmdata.rows[0].values.sex);
                                    props.cardTable.setValByKeyAndIndex(tableId2,index,'pk_linkman.vjob',lmdata.rows[0].values.vjob);
                                    props.cardTable.setValByKeyAndIndex(tableId2,index,'pk_linkman.phone',lmdata.rows[0].values.phone);
                                    props.cardTable.setValByKeyAndIndex(tableId2,index,'pk_linkman.cell',lmdata.rows[0].values.cell);
                                }
                            }
                        }
                    });
                } , {[linkman]:'form'} , 'form' )

            },
            cancelBtnClick:()=>{

            }
        })
    }

    //按钮事件
    buttonClick(props, id) {
        switch (id) {
            case 'upgrade':
               //this.getData();
               //this.setState({"customer":"1001A010000000004UHD"});
                var bdselect =  new BDselect([this.modeclassid]);
                bdselect.getModeByClassid(this.modeclassid, (mode) => {
                    if (!mode) {
                        toast({content: this.state.json['1317CUUG-000003'],color: 'warning'});/* 国际化处理： 未设置管控模式.*/
                    }
                    var managemode = mode[0].managemode;
                    let mes = this.state.json['1317CUUG-000004'];/* 国际化处理： 全局*/
                    if(this.state.customerdata==null){
                        toast({content: this.state.json['1317CUUG-000019'],color: 'warning'});/* 国际化处理： 请选择源客户。.*/
                        return
                    }
                    if(this.state.customerdata.values.pk_org.value==='GLOBLE00000000000000'){
                        toast({content: this.state.json['1317CUUG-000005'],color: 'warning'});/* 国际化处理： 全局级数据不支持升级。.*/
                        //NCMessage.create({content: '全局级数据不支持升级。.',color: 'warning',position: 'bottom'});
                        return;
                    }else if(this.state.customerdata.values.pk_group.value == this.state.customerdata.values.pk_org.value){
                        if (managemode == BDselect.SCOPE_GROUP || managemode == BDselect.SCOPE_GROUP_ORG) {
                            toast({content: this.state.json['1317CUUG-000006'],color: 'warning'});/* 国际化处理： 当前的管控模式不包含全局级节点，集团级数据不支持升级.*/
                            //NCMessage.create({content: '当前的管控模式不包含全局级节点，集团级数据不支持升级.',color: 'warning',position: 'bottom'});
                            return;
                        }
                    }else{
                        mes = businessInfo.groupName +this.state.json['1317CUUG-000007'];/* 国际化处理： ][集团*/
                        if(managemode == BDselect.SCOPE_ORG){
                            toast({content: this.state.json['1317CUUG-000008'],color: 'warning'});/* 国际化处理： 当前的管控模式只包含组织级节点，组织级数据不支持升级.*/
                            //NCMessage.create({content: '当前的管控模式只包含组织级节点，组织级数据不支持升级.', color: 'warning', position: 'bottom'});
                        }
                    }
                    if(this.props.form.getFormItemsValue(this.formId,'issupplier').value){
                       let suppcontents  = this.state.json['1317CUUG-000009']/* 国际化处理： 检测到所选档案为客商档案,点击确认升级供应商档案!*/
                        promptBox({
                            color:'info',
                            noFooter:false,
                            userControl:true,
                            title: this.state.json['1317CUUG-000010'],/* 国际化处理： 询问  */
                            content:suppcontents,
                            beSureBtnClick: ()=>{
                                promptBox({
                                    color:'info',
                                    noFooter:false,
                                    userControl:true,
                                    title: this.state.json['1317CUUG-000010'],/* 国际化处理： 询问  */
                                    content: this.state.inlt&&this.state.inlt.get('1317CUUG-000011',{mes:mes}),/* 国际化处理： 您确定要将该供应商升级至[,]吗？升级后该供应商的主组织将被替换为[,].单击〖确定〗按钮执行升级操作，单击〖取消〗则不执行升级;*/
                                    beSureBtnClick:()=>{
                                        this.props.modal.show('upgrade',{
                                            title: this.state.json['1317CUUG-000010'],/* 国际化处理： 询问  */
                                            content: <SupBaseInfo  {...{pk_supplier:this.state.customer.value,from:2,callback:this.setSupplier.bind(this)}} ref={(info)=>{this.SupBaseInfo = info}}/>,
                                            beSureBtnClick: ()=>{
                                                let contents = this.state.inlt&&this.state.inlt.get('1317CUUG-000014',{mes:mes})/* 国际化处理： 您确定要将该客户升级至[,]吗？升级后该客户的主组织将被替换为[,].单击〖确定〗按钮执行升级操作，单击〖取消〗则不执行升级;*/
                                                promptBox({
                                                    color:'info',
                                                    noFooter:false,
                                                    userControl:true,
                                                    title: this.state.json['1317CUUG-000010'],/* 国际化处理： 询问  */
                                                    content: contents,
                                                    beSureBtnClick:this.upgrede.bind(this),
                                                    
                                                });
                                            },
                                            cancelBtnClick: () => {
                                                this.props.modal.close('upgrade');
                                            },
                                        });
                                    }
                                });
                            }
                        });
                    }else{
                        let contents = this.state.inlt&&this.state.inlt.get('1317CUUG-000014',{mes:mes})/* 国际化处理： 您确定要将该客户升级至[,]吗？升级后该客户的主组织将被替换为[,].单击〖确定〗按钮执行升级操作，单击〖取消〗则不执行升级;*/
                        promptBox({
                            color:'info',
                            noFooter:false,
                            userControl:true,
                            title:this.state.json['1317CUUG-000010'],/* 国际化处理： 询问  */
                            content:contents,
                            beSureBtnClick:this.upgrede.bind(this)
                        });
                    }
                })
                break;
            case 'save':
                this.saveBill();
                break;
            case 'cancel':
                promptBox({
                    color:"warning",
                    title:this.state.json['1317CUUG-000034'],/* 国际化处理： 确认取消*/
                    content:this.state.json['1317CUUG-000035'],/* 国际化处理： 是否确认要取消?*/
                    beSureBtnClick:()=>{
                        this.props.form.setAllFormValue({ [this.formId]: this.state.oldFormData })
                        // 表单返回上一次的值
                        //props.form.cancel(this.formId);
                        this.props.cardTable.resetTableData(this.tableId2);
                        // 表格返回上一次的值
                        //props.cardTable.cancelEdit(this.tableId)
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
            case 'addline':
                this.linkadd(props);
                break
            default:
                break
        }
    }

    //查询数据
    getData =(pk) =>{
        //pk='1001A010000000004UHD';
       // console.log(pk)
        //查询单据详情
        if (pk != null) {
            let data = { pk: pk, pageid: this.pageId };
            let that = this;
            ajax({
                url: '/nccloud/uapbd/custupgrade/queryupcustomer.do',
                data: data,
                success: (res) => {
                    if (res.data) {
                        showFormular(this.props,res,{
                            [formId] : "form",
                            [tableId1]:"cardTable",
                            [tableId2]:"cardTable",
                            [tableId3]:"cardTable"
                        });
                        if (res.data.head) {
                            this.state.customerdata = res.data.head.customer.rows[0];
                            this.setState(this.state);
                            this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        }
                        if (res.data.bodys) {
                            this.props.cardTable.setTableData(that.tableId1, res.data.bodys[that.tableId1]?res.data.bodys[that.tableId1]:{ rows: [] });
                            this.props.cardTable.setTableData(that.tableId2, res.data.bodys[that.tableId2]?res.data.bodys[that.tableId2]:{ rows: [] });
                            this.props.cardTable.setTableData(that.tableId3, res.data.bodys[that.tableId3]?res.data.bodys[that.tableId3]:{ rows: [] });
                        }
                    } else {
                        this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                        this.props.cardTable.setTableData(this.tableId1, { rows: [] });
                        this.props.cardTable.setTableData(this.tableId2, { rows: [] });
                        this.props.cardTable.setTableData(this.tableId3, { rows: [] });
                    }
                    this.toggleShow("browse");
                    this.issupplier=this.props.form.getFormItemsValue(this.formId,'issupplier').value;
                }
            });
        }
    }

    //切换页面状态
    toggleShow = (status) => {
        //console.log("buttons", this.props.button.getButtons());
        if(status == "twopage"){
            this.props.button.setButtonVisible(['upgrade', 'save', 'cancel'], false);
            this.props.button.setButtonVisible(['notify'], true);
        }else{
            let flag = status === 'browse' ? true : false;
            this.props.button.setButtonVisible(['upgrade'], flag);
            this.props.button.setButtonVisible([ 'save', 'cancel'], !flag);
            this.props.button.setButtonVisible(['notify'], false);
            this.props.button.setButtonVisible(['spread'], flag);
            this.props.button.setButtonVisible(['delline','edit'], !flag);
            this.props.button.setDisabled({
                upgrade:!flag,
                save:flag,
                cancel:flag,
                addline:flag
            });
            this.props.form.setFormStatus(this.formId, status);
            this.props.cardTable.setStatus(this.tableId2, status);
        }
    };

    //供应商升级
    setSupplier(){
        let me = this;
        let pk_org_value = 'GLOBLE00000000000000';
        let pk_org_name = this.state.json['1317CUUG-000004'];/* 国际化处理： 全局*/
        if(this.state.customerdata.values.pk_group.value == this.state.customerdata.values.pk_org.value){
            
        }else{
            pk_org_value = businessInfo.groupId;
            pk_org_name = businessInfo.groupName;
        }
        me.SupBaseInfo.form.setFormItemsValue('supplier_baseInfo',{
            pk_org:{value:pk_org_value,display:pk_org_name},
            pk_supplierclass:{value:'',display:''}
        });
        me.SupBaseInfo.form.setFormItemsDisabled('supupgrade',{'sourceorg':false,'sourcesup':false});
        let meta = me.SupBaseInfo.meta.getMeta(); 
        meta.supplier_baseInfo.items.map((item,key)=>{
            if(item.attrcode == "pk_supplierclass"){
                item.queryCondition=()=>{
                    return {
                        pk_org:me.SupBaseInfo.formOldValues.supplier_baseInfo.pk_org.value?me.SupBaseInfo.formOldValues.supplier_baseInfo.pk_org.value:null,
                    }
                }
            }
        })
        toast({content : this.state.json['1317CUUG-000016'],color : 'warning'});/* 国际化处理： 如下字段:[供应商基本分类]被清空，需要重新修改选择*/
    }

    //客户升级
    upgrede=()=>{
        if(!this.state.customer)
            return
        let data = { pk: this.state.customer.value, pageid: this.pageId };
        let formData = this.props.form.getAllFormValue(this.formId);//获得表单信息
        this.state.oldFormData = formData;
        this.state.stated = 'edit';
        if (this.issupplier){
            this.Supdata=this.SupBaseInfo.createExtCardData('1317SUUG_supbaseinfo','supplier_baseInfo',['supbankacc','suplinkman','supcountrytaxes']);
        }
        
        //this.saveBill();
        this.setState(this.state);
        ajax({
            url: urls.editUrl,
            data: data,
            success: (res) => {
                showFormular(this.props,res,{
                    [formId] : "form",
                    [tableId1]:"cardTable",
                    [tableId2]:"cardTable",
                    [tableId3]:"cardTable"
                });
                if (res.data) {
                    if (res.data.head) {
                        this.props.form.EmptyAllFormValue(this.formId);
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                    }
                    if (res.data.bodys) {
                        this.props.cardTable.setTableData(this.tableId1, res.data.bodys[this.tableId1]);
                        this.props.cardTable.setTableData(this.tableId2, res.data.bodys[this.tableId2]);
                        this.props.cardTable.setTableData(this.tableId3, res.data.bodys[this.tableId3]);
                    }
                    this.toggleShow("edit");
                    if(res.data.head.customer.rows[0].values.pk_custclass.value == null){
                        promptBox({
                            color: 'info',
                            noFooter: false,
                            userControl: true,
                            title: this.state.json['1317CUUG-000025'],/* 国际化处理： 提示 */
                            content: this.state.json['1317CUUG-000026'],/* 国际化处理： 如下字段：[客户基本分类]被清空，需要重新修改选择.*/
                        })
                    }
                }
                this.props.modal.close('upgrade');
            }
        });

    }

    //保存单据
    saveBill = () => {
        //过滤表格空行

        this.props.cardTable.filterEmptyRows(this.tableId1);
        this.props.cardTable.filterEmptyRows(this.tableId2);
        this.props.cardTable.filterEmptyRows(this.tableId3);
        let CardData = this.props.createExtCardData(this.pageId, this.formId, [this.tableId1, this.tableId2, this.tableId3]);
        let SuppCardData = {};
        let issupplier = CardData.head.customer.rows[0].values["issupplier"].value;
        if(issupplier){
            // this.SupBaseInfo.cardTable.filterEmptyRows('suplinkman');
            //SuppCardData = this.SupBaseInfo.createExtCardData('1317SUUG_supbaseinfo','supplier_baseInfo',['supbankacc','suplinkman','supcountrytaxes']);
            this.props.cardTable.filterEmptyRows('suplinkman');
            SuppCardData = this.Supdata;
        }

        this.props.validateToSave( CardData , ()=>{
            ajax({
                url: urls.saveUrl,
                data: {CardData:CardData,suppCardData:SuppCardData,issupplier:issupplier},
                success: (res) => {
                    let pk_payment = null;
                    showFormular(this.props,res,{
                        [formId] : "form",
                        [tableId1]:"cardTable",
                        [tableId2]:"cardTable",
                        [tableId3]:"cardTable"
                    });
                    if (res.success) {
                        if (res.data) {
                            toast({ color: 'success', title: this.state.json['1317CUUG-000017'] });/* 国际化处理： 保存成功!*/
                            this.state.customerdata = res.data.head.customer.rows[0];
                            if (res.data.head && res.data.head[this.formId]) {
                                this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                            }
                            if (res.data.body && res.data.body[this.tableId1]) {
                                this.props.cardTable.setTableData(this.tableId1, res.data.body[this.tableId1]);
                            }
                            if (res.data.body && res.data.body[this.tableId2]) {
                                this.props.cardTable.setTableData(this.tableId2, res.data.body[this.tableId2]);
                            }
                            if (res.data.body && res.data.body[this.tableId3]) {
                                this.props.cardTable.setTableData(this.tableId3, res.data.body[this.tableId3]);
                            }
                        }
                        this.toggleShow("browse");
                    }

                }
            });
            } , {[formId]:'form',[tableId1]:'cardTable',[tableId2]:'cardTable',[tableId3]:'cardTable'} , 'card' )
    };

    //获取列表肩部信息
    getTableHead = (buttons, tableId) => {
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

    //获取列表肩部信息
    getTable2Head = (buttons, tableId) => {
        let { createButtonApp } = this.props.button;
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'definition-icons',//按钮注册中的按钮区域
                        buttonLimit: 5,
                        onButtonClick: this.buttonClick.bind(this),
                        popContainer: document.querySelector('.definition-icons')
                    })}
                    {this.props.cardTable.createBrowseIcons(tableId, {
                        iconArr: ['close', 'open', 'max','setCol'],
                        maxDestAreaId: 'nc-bill-extCard'
                    })}
                </div>
            </div>
        );
    };

    //获取列表肩部信息
    getTable3Head = (buttons, tableId) => {
        let { createButtonApp } = this.props.button;
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {this.props.cardTable.createBrowseIcons(tableId, {
                        iconArr: ['close', 'open', 'max','setCol'],
                        maxDestAreaId: 'nc-bill-extCard'
                    })}
                </div>
            </div>
        );
    };

    //页签切换时间
    checkForm = (flag) => {
        if(flag == "1"){
            this.toggleShow("browse");
        }else{
            this.toggleShow("twopage");
        }
    }

    //查询区按钮点击事件
    clickSearchBtn(props,searchVal) {
        let searchVa = this.props.search.getAllSearchData(ugsearchid);
        let pageInfo = props.table.getTablePageInfo(this.ugtableid);
        let queryInfo = this.props.search.getQueryInfo(ugsearchid);
        let data={
            querycondition:searchVal==null?null:searchVal,
            pageInfo:{
                pageIndex: 0,
                pageSize: 10,
                total: 0,
                totalPage: 0
            },
            pagecode: pageId,
            queryAreaCode:ugsearchid,  //查询区编码
            oid:queryInfo.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype:'tree'
        };
        ajax({
            url: urls.queryListUrl,
            data: data,
            success: (res) => {
                showFormular(this.props,res,{
                    [ugtableid] : "SimpleTable",
                });
                let { success, data } = res;
                if (success) {
                    if(data){
                        this.props.table.setAllTableData(this.ugtableid,data&&data[this.ugtableid]?data[this.ugtableid]:{rows:[]});
                        let count = data[this.ugtableid]?data[this.ugtableid].rows.length:0;
                        toast({content:this.state.inlt&&this.state.inlt.get('1317CUUG-000018',{count:count}),color:'success'})/* 国际化处理： 查询成功，共,条。*/
                    }else{
                        this.props.table.setAllTableData(this.ugtableid, {rows:[]});
                        toast({content:this.state.json['1317CUUG-000020'],color:'warning'})/* 国际化处理： 未查询出符合条件的数据！*/
                    }

                }
            }
        });
        // }

    };

    //列表双击事件
    onRowDoubleClick(record, index){
        let pk_source = record.pk_custupgrade.value;
        let formConfig ={
            pk_source :pk_source,
        }
        this.props.modal.show("source",{
            title:this.state.json['1317CUUG-000021'],/* 国际化处理： 源客户基本信息*/
            content:<Sourcecust config={formConfig} />,
            userControl:true,//自己控制什么时候关闭窗口
            noFooter : true //是否需要底部按钮,默认true
        });
    }

    onSaveSys(){}


    //编辑后事件
    afterEvent=()=>{

    }

    afterEvent1=(props, moduleId , key,  value, oldValue, data)=>{
        switch(key){
            case 'sourceorg':
                if(value&&value.value!=null){
                    props.form.setFormItemsDisabled(moduleId,{'pk_source':false});
                }
                props.form.setFormItemsValue(moduleId,{'pk_source':{value:null,display:null}});
                this.setState({
                    curOrg:value
                })
                break;
            case 'pk_source':
                let pk_org = props.form.getFormItemsValue(moduleId,'sourceorg').value;
                this.setState({
                    customer:value
                });
                if(value&&value.value!=null){
                    let allPks = value.value.split(',')
                    if (allPks.length > 1) {
                        ajax({
                            url: '/nccloud/uapbd/custupgrade/batchupgradecust.do',
                            data: { pk_org: pk_org, realBatchUpgrade: 'N' },
                            success: resp => {
                                promptBox({
                                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                    title: this.state.json['1317CUUG-000010'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
                                    content: resp.data,             // 提示内容,非必输/* 国际化处理： 您确认删除所选数据？*/
                                    noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                                    noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                                    beSureBtnName: this.state.json['1317CUUG-000036'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                                    cancelBtnName: this.state.json['1317CUUG-000037'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                                    beSureBtnClick: () => {
                                        this.batchUpgradeCust(allPks)
                                    }
                                })
                            }
                        })
                    }else{
                        this.getData(value.value);
                    }
                }
                break;
        }
    }
    batchUpgradeCust(pks) {
        let pk_org = this.props.form.getFormItemsValue(formId2,'sourceorg').value;
        ajax({
            url: '/nccloud/uapbd/custupgrade/batchupgradecust.do',
            data: { pk_org: pk_org, realBatchUpgrade: 'Y', update_pks: pks },
            success: resp => {
                this.props.form.setFormItemsValue(formId, { 'sourcesup': { value: '', display: '' } })
                toast({ color: 'success', content: resp.data })
            }
        })
    }

    linkadd=(props)=>{
        props.form.setFormStatus(linkman,'edit');
        props.form.EmptyAllFormValue(linkman);
        props.modal.show('linkmanModal',{
            beSureBtnClick:()=>{
                let lmdata = props.form.getAllFormValue(linkman);
                lmdata["areacode"] = linkman;
                this.props.validateToSave( {"model" : lmdata,"pageid" : this.pageId} , ()=>{
                    ajax({
                        url:urls.saveLinkman,
                        data:{
                            'pageid':this.pageId,
                            'gridModel':lmdata
                        },
                        success:(res)=>{
                            let{success,data} =res;
                            if(success){
                                if(data){
                                    let len = props.cardTable.getNumberOfRows(this.tableId2);
                                    //联系人新增成功，回显子表数据
                                    props.cardTable.addRow(this.tableId2,len,{

                                        'pk_linkman':{
                                            value:data
                                        },
                                        'pk_linkman.name':lmdata.rows[0].values.name,
                                        'pk_linkman.sex':lmdata.rows[0].values.sex,
                                        'pk_linkman.vjob':lmdata.rows[0].values.vjob,
                                        'pk_linkman.phone':lmdata.rows[0].values.phone,
                                        'pk_linkman.cell':lmdata.rows[0].values.cell,
                                    });
                                }
                            }
                        }
                    });
                } , {[linkman]:'form'} , 'form' )
            },
            cancelBtnClick:()=>{

            }
        })
    }

    //联系人模态框
    createLinkmanForm = ()=>{
        const{form} = this.props;
        const{createForm} = form;
        return (
            <div>
                <div className="nc-bill-form-area">
                    {createForm(linkman, {
                        onAfterEvent: this.modalAfterEvent.bind(this)
                    })}
                </div>

            </div>
        )
    }

    modalAfterEvent=()=>{

    }

    initData(templateid,callback){
        let me = this;
        if(!me.props.pk_supplier)
            return;

        let requestParams = {
            pk_supplier:me.props.pk_supplier,
            templateid:templateid
        }
        ajax({
            url: urls['querySupBaseInfoUrl'],
            //async:false,
            data:requestParams,
            success: function (res) {
                showFormular(this.props,res,{
                    [formId] : "form",
                    [tableId1]:"cardTable",
                    [tableId2]:"cardTable",
                    [tableId3]:"cardTable"
                });
                let { success, data } = res;
                if(success){
                    me.state.allValues = data;
                    me.setState(me.state,()=>{
                        if(me.props.from){
                            me.props.form.setFormStatus(me.config.formId,'edit');
                            me.props.button.setDisabled({
                                AddLine:false,
                                BatchDel:false
                            });
                        }
                        me.props.form.setAllFormValue({[me.config.formId]:data.head[me.config.formId]});
                        me.props.cardTable.setTableData(me.config.tableId1,data.bodys[me.config.tableId1]);
                        me.props.cardTable.setTableData(me.config.tableId2,data.bodys[me.config.tableId2]);
                        me.props.cardTable.setTableData(me.config.tableId3,data.bodys[me.config.tableId3]);
                        if(callback)
                            callback();
                    });
                }
            }
        })
    }

    render() {
        let { cardTable, form, button, modal, cardPagination,search ,table} = this.props;
        let buttons = this.props.button.getButtons();
        let multiLang = this.props.MutiInit.getIntl(this.moduleId);
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createCardPagination } = cardPagination;
        let { createButton, createButtonApp } = button;
        let { createModal } = modal;
        let { NCCreateSearch } = search;
        let { createSimpleTable } = table;
        let { BillHeadInfo}=this.props;
        const{ createBillHeadInfo}=BillHeadInfo
        const{ NCDiv} =base;
        

        return (
            <div className="nc-bill-extCard custupgrage_xuehao">
                    <NCDiv areaCode={NCDiv.config.HEADER}>
                        <div className="nc-bill-header-area">
                            <div className="header-title-search-area">
                                {createBillHeadInfo({
                                    title: this.state.json['1317CUUG-000028'],/* 国际化处理： 客户升级 */
                                    initShowBackBtn: false
                                    })}
                            </div>
                            <div className="header-button-area">
                                {/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
                                {createButtonApp({
                                    area: 'base-header-button',
                                    buttonLimit: 3,
                                    onButtonClick: this.buttonClick.bind(this),
                                    popContainer: document.querySelector('.base-header-button')

                                })}
                            </div>
                        </div>
                    </NCDiv>
                <NCTabs navtype="turn" contenttype="moveleft" defaultActiveKey="1" onChange={this.checkForm} >
                    <NCTabPane tab={this.state.json['1317CUUG-000022']/* 国际化处理： 升级处理*/} key="1">
                        <NCAnchor>
                            <NCScrollLink
                                to='head'
                                spy={true}
                                smooth={true}
                                duration={300}
                                offset={-100}
                            >
                                <p>{this.state.json['1317CUUG-000029']/* 国际化处理： 顶部信息*/}</p>
                            </NCScrollLink>
                            <NCScrollLink
                                to='forminfo'
                                spy={true}
                                smooth={true}
                                duration={300}
                                offset={-100}
                            >
                                <p>{this.state.json['1317CUUG-000030']/* 国际化处理： 表单信息*/}</p>
                            </NCScrollLink>
                            <NCScrollLink
                                to='businfo'
                                spy={true}
                                smooth={true}
                                duration={300}
                                offset={-100}
                            >
                                <p>{this.state.json['1317CUUG-000031']/* 国际化处理： 客户银行账号*/}</p>
                            </NCScrollLink>
                            <NCScrollLink
                                to='detail'
                                spy={true}
                                smooth={true}
                                duration={300}
                                offset={-50}
                            >
                                <p>{this.state.json['1317CUUG-000032']/* 国际化处理： 客户联系人*/}</p>
                            </NCScrollLink>
                            <NCScrollLink
                                to='detailaa'
                                spy={true}
                                smooth={true}
                                duration={300}
                                offset={-50}
                            >
                                <p>{this.state.json['1317CUUG-000033']/* 国际化处理： 客户国家税类*/}</p>
                            </NCScrollLink>
                        </NCAnchor>
                        <NCScrollElement name='head'>
                        </NCScrollElement>
                        <NCScrollElement name='forminfo'>
                            <div className="nc-bill-top-area">
                                <div className="nc-bill-form-area">
                                    {createForm(formId2, {
                                        onAfterEvent: this.afterEvent1.bind(this)
                                    })}
                                </div>
                                <div style={{ height: '10px' }} />
                                <div className="nc-bill-form-area">
                                    {createForm(this.formId, {
                                        onAfterEvent: this.afterEvent.bind(this)
                                    })}
                                </div>
                            </div>
                        </NCScrollElement>
                        <div className="nc-bill-bottom-area">
                            <NCScrollElement name='businfo'>
                                <div className="nc-bill-table-area">
                                    {this.getTableHead(buttons, this.tableId1)}
                                    {createCardTable(this.tableId1, {
                                        tableHead: this.getTableHead.bind(this, buttons, this.tableId1),
                                        modelSave: this.saveBill,
                                        onAfterEvent: this.afterEvent.bind(this),
                                        showCheck: true,
                                        showIndex: true
                                    })}
                                </div>
                            </NCScrollElement>
                            <NCScrollElement name='detail'>
                                <div className="nc-bill-table-area">
                                    {createCardTable(this.tableId2, {
                                        tableHead: this.getTable2Head.bind(this, buttons, this.tableId2),
                                        modelSave: this.saveBill,
                                        onAfterEvent: this.afterEvent.bind(this),
                                        showCheck: true,
                                        showIndex: true
                                    })}
                                </div>
                            </NCScrollElement>
                            <NCScrollElement name='detailaa'>
                            <div className="nc-bill-table-area">
                                {this.getTable3Head(buttons, this.tableId3)}
                                {createCardTable(this.tableId3, {
                                    tableHead: this.getTable3Head.bind(this, buttons, this.tableId3),
                                    modelSave: this.saveBill,
                                    onAfterEvent: this.afterEvent.bind(this),
                                    showCheck: true,
                                    showIndex: true
                                })}
                            </div>
                        </NCScrollElement>
                        </div>
                    </NCTabPane>
                    <NCTabPane tab={this.state.json['1317CUUG-000023']/* 国际化处理： 历史查询*/} key="2">
                        <div className="nc-bill-list">
                        <div className="nc-bill-search-area">
                            {NCCreateSearch(ugsearchid, {
                                clickSearchBtn: this.clickSearchBtn.bind(this),
                            })}
                        </div>
                        </div>
                        <div className="nc-bill-table-area">
                            {createSimpleTable(ugtableid, {//列表区
                                //onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件
                                onRowDoubleClick: this.onRowDoubleClick.bind(this),                      // 控件的编辑后事件
                            })}
                        </div>
                    </NCTabPane>
                </NCTabs>

                {createModal('upgrade', {
                    title: this.state.json['1317CUUG-000010'],/* 国际化处理： 询问  */
                    content: this.state.json['1317CUUG-000024'],/* 国际化处理： 您确定要将该客户升级至[集团]吗？升级后该客户的主组织将被替换为[集团].单击〖确定〗按钮执行升级操作，单击〖取消〗则不执行升级;*/
                    beSureBtnClick: this.upgrede.bind(this),
                    noFooter:false,
                    userControl:true,
                })}
                {createModal('point', {
                    title: this.state.json['1317CUUG-000025'],/* 国际化处理： 提示 */
                    content: this.state.json['1317CUUG-000026'],/* 国际化处理： 如下字段：[客户基本分类]被清空，需要重新修改选择.*/
                    //beSureBtnClick: this.upgrede.bind(this)
                })}
                { createModal("source",{
                    title:this.state.json['1317CUUG-000021'],/* 国际化处理： 源客户基本信息*/
                    content:<Sourcecust config={this.state.formConfig} />,
                    noFooter : true //是否需要底部按钮,默认true
                }) }
                {createModal('linkmanModal',{
                    title:this.state.json['1317CUUG-000027'],/* 国际化处理： 联系人*/
                    size:'lg',
                    content:this.createLinkmanForm()

                })}
            </div>
        );
    }
}

Card = createPage({
    billinfo:[{
        billtype: 'extcard',
        pagecode: "1317CUUG_base",
        headcode: 'customer',
        bodycode: ['custbanks','custcontacts','custtaxtypes']
    },{
        billtype: 'form',
        pagecode: "1317CUUG_base",
        headcode: 'custupgradequery'
    },{
        billtype: 'grid',
        pagecode: "1317CUUG_base",
        bodycode: 'custupgrade'
    },{
        billtype: 'form',
        pagecode: "1317CUUG_base",
        headcode: '10140LM'
    }]
})(Card);

ReactDOM.render(<Card />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65