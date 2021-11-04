//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import { createPage, ajax, base, toast ,cardCache,promptBox,createPageIcon} from 'nc-lightapp-front';
import utils from '../../../public/utils';
const {showFormular } = utils;
const { NCAffix ,NCForm,NCFormControl,NCRadio,NCCol,NCRow,NCBackBtn} = base;
const NCFormItem = NCForm.NCFormItem;
let { getCacheById, updateCache ,addCache,getCurrentLastId ,getNextId, deleteCacheById } = cardCache;
import createScript from '../../../other/assigntemplate/component/uapRefer.js';
import createUIDom from "../../../public/utils/BDCreateUIDom";

const { NCDiv } = base;
const formId = 'assigntemp';
const tableId = 'assignrules';
const pageId = '10180ADVCG_assigntemp_card';
const appcode = '10180ADVCG'//注册按钮的id
const pk_value = "pk_assign_temp";
const assdatasource = 'uapbd.other.assigntemplate.dataSource';
const pk_item = 'pk_assign_temp';
let urls={
    querycardUrl:"/nccloud/uapbd/assigntemp/AssigntemLoadCardData.do",
    SaveassigntempUrl:"/nccloud/uapbd/assigntemp/AssigntemSaveCardData.do",
    updateassigntempUrl:"/nccloud/uapbd/assigntemp/AssigntemUpdateCardData.do",
    deleteCardUrl:"/nccloud/uapbd/assigntemp/AssigntemDelCardData.do",
    SaveRulesUrl:"/nccloud/uapbd/assigntemp/AssigntemSaveRulesData.do",
};

let tableBtnAry =(props)=>{
    return props.getUrlParam('status') === 'browse'
        ? ['tabdelete']:[ '' ];
}

class Card extends Component {
    constructor(props) {
        super(props);
        this.formId = 'assigntemp';
        this.tableId = 'assignrules';
        this.state = {
            pagetype:null,
            bill_code : '',
            selectedValue:'org',
            pk_docclass0:null,
            pk_org0:null,
            isMultiSelectedEnabled:true,
            stated:'browse',
            json:{}
        }
        this.initTemplate(this.props,()=>{
            let status = this.props.getUrlParam('status');
            this.toggleShow();
            if(status != "add"){
                let	pk = this.props.getUrlParam('id');
                if(pk && pk != 'undefined'&&pk!=null){
                    this.getdata(pk,this.props.getUrlParam('pk_assign_tab'),this.props.getUrlParam('pagetype'));
                }
            }
            else{
                this.setDefaultValue();
            }
        })
        this.renderRef = this.renderRef.bind(this)
        this.buttonClick = this.buttonClick.bind(this)

    }

    initTemplate = (props,callback) => {
        debugger
        createUIDom(props)(
            {
                pagecode: pageId//页面id
            },
            {
                moduleId: "10180ADVCG",domainName: 'uapbd'
            },
            (data,langData)=>{
                if(langData){
                    this.state.json = langData
                }
                if(data){
                    if(data.template){
                        let meta = data.template;
                        meta = this.modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                        props.button.setPopContent({'tabdelete':this.state.json['10180ADVCG-000047']});/* 国际化处理： 确认要删除该信息吗？*/
                    }
                }
                callback&&callback();
            }
        )
    }

    modifierMeta = (props, meta) => {
        debugger
        let status = props.getUrlParam('status')?props.getUrlParam('status'):'browse';
        let pagetype = props.getUrlParam('pagetype');
        meta[formId].status = status;
        meta[tableId].status = 'browse';
        meta[tableId].items.push({
            attrcode: 'opr',
            label: this.state.json['10180ADVCG-000023'],/* 国际化处理： 操作*/
            visible: true,
            className:'table-opr',
            itemtype: 'customer',
            width:200,
            fixed:'right',
            render:(text, record, index) => {

                const btnArray = tableBtnAry(props);

                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-opr-button",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                    }
                )
            }
        });
        if(pagetype){
            meta[pagetype].status = status;
            switch (pagetype){
                //commonItemHander[pagetype].addMetaItem(meta);
                case 'custcreditctl':
                    meta[tableId].items.forEach((e)=>{
                        if(e.attrcode=="pk_docclass"){
                            // e.itemtype = 'refer',
                            e.label = this.state.json['10180ADVCG-000000'],/* 国际化处理： 客户基本分类*/
                                e.refcode ="uapbd/refer/customer/CustClassDefaultTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000000']/* 国际化处理： 客户基本分类*/
                        }
                        if(e.attrcode== 'pk_org'){
                            e.label = this.state.json['10180ADVCG-000001'],/* 国际化处理： 组织_信用控制域*/
                                e.refcode ="uapbd/refer/org/CreditCtlRegionGridRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000002']/* 国际化处理： 信用控制域*/
                        }
                    })
                    break;
                case 'custfinance':
                    meta[tableId].items.forEach((e)=>{
                        if(e.attrcode=="pk_docclass"){
                            // e.itemtype = 'refer',
                            e.label = this.state.json['10180ADVCG-000000'],/* 国际化处理： 客户基本分类*/
                                e.refcode ="uapbd/refer/customer/CustClassDefaultTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000000']/* 国际化处理： 客户基本分类*/
                        }
                        if(e.attrcode== 'pk_org'){
                            e.label = this.state.json['10180ADVCG-000003'],/* 国际化处理： 组织_业务单元_财务组织*/
                                e.refcode ="uapbd/refer/org/FinanceOrgTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000004']/* 国际化处理： 财务组织*/
                        }
                    })
                    meta[pagetype].items.forEach((e)=>{
                        if(e.attrcode=="pk_respdept1"){
                            e.isShowUnit=true;
                            e.refcode ="uapbd/refer/org/DeptTreeRef/index.js";
                        }
                        if(e.attrcode=="pk_resppsn1"){
                            e.isShowUnit=true;
                        }
                        if(e.attrcode=="pk_payterm"){
                            e.isShowUnit=true;
                        }
                    })
                    break;
                case 'custsale':
                    meta[tableId].items.forEach((e)=>{
                        if(e.attrcode=="pk_docclass"){
                            e.label = this.state.json['10180ADVCG-000000'],/* 国际化处理： 客户基本分类*/
                                e.refcode ="uapbd/refer/customer/CustClassDefaultTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000000']/* 国际化处理： 客户基本分类*/
                        }
                        if(e.attrcode== 'pk_org'){
                            e.label = this.state.json['10180ADVCG-000005'],/* 国际化处理： 组织_业务单元_销售组织*/
                                e.refcode ="uapbd/refer/org/SaleOrgTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000006']/* 国际化处理： 销售组织*/
                        }
                    })
                    meta[pagetype].items.forEach((e)=>{
                        switch (e.attrcode){
                            case 'pk_financeorg':
                                e.isShowUnit=true;
                                break;
                            case 'pk_receiveorg':
                                e.isShowUnit=true;
                                break;
                            case 'pk_liabilitycenter':
                                e.isShowUnit=true;
                                break;
                            case 'respdept':
                                e.isShowUnit=true;
                                break;
                            case 'respperson':
                                e.isShowUnit=true;
                                break;
                            case 'pk_custsaleclass':
                                e.isShowUnit=true;
                                break;
                            case 'billingcust':
                                e.isShowUnit=true;
                                break;
                            case 'issuecust':
                                e.isShowUnit=true;
                                break;
                            case 'pk_paycust':
                                e.isShowUnit=true;
                                break;
                            case 'paytermdefault':
                                e.isShowUnit=true;
                                break;
                            default :
                                break
                        }
                    })
                    break;
                case 'materialcost':
                    meta[tableId].items.forEach((e)=>{
                        if(e.attrcode=="pk_docclass"){
                            e.label = this.state.json['10180ADVCG-000007'],/* 国际化处理： 物料基本分类*/
                                e.refcode ="uapbd/refer/material/MaterialBasClassTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000007']/* 国际化处理： 物料基本分类*/
                        }
                        if(e.attrcode== 'pk_org'){
                            e.label = this.state.json['10180ADVCG-000008'],/* 国际化处理： 组织_成本域*/
                                e.refcode ="uapbd/refer/org/CostRegionDefaultGridRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000009']/* 国际化处理： 成本域*/
                        }
                    })
                    break;
                case 'materialfi':
                    meta[tableId].items.forEach((e)=>{
                        if(e.attrcode=="pk_docclass"){
                            e.label = this.state.json['10180ADVCG-000007'],/* 国际化处理： 物料基本分类*/
                                e.refcode ="uapbd/refer/material/MaterialBasClassTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000007']/* 国际化处理： 物料基本分类*/
                        }
                        if(e.attrcode== 'pk_org'){
                            e.label = this.state.json['10180ADVCG-000003'],/* 国际化处理： 组织_业务单元_财务组织*/
                                e.refcode ="uapbd/refer/org/FinanceOrgTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000004']/* 国际化处理： 财务组织*/
                        }
                    })
                    break;
                case 'materialplan':
                    meta[tableId].items.forEach((e)=>{
                        if(e.attrcode=="pk_docclass"){
                            e.label = this.state.json['10180ADVCG-000007'],/* 国际化处理： 物料基本分类*/
                                e.refcode ="uapbd/refer/material/MaterialBasClassTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000007']/* 国际化处理： 物料基本分类*/
                        }
                        if(e.attrcode== 'pk_org'){
                            e.label = this.state.json['10180ADVCG-000010'],/* 国际化处理： 组织*/
                                e.refcode ="uapbd/refer/org/OrgWithGlobalAllDataTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000011']/* 国际化处理： 组织(包含全局)(所有)*/
                        }
                    })
                    meta[pagetype].items.forEach((e)=>{
                        if(e.attrcode=="pk_prodfactory"){
                            e.isShowUnit=true;
                        }
                    })
                    break;
                case 'materialprod':
                    meta[tableId].items.forEach((e)=>{
                        if(e.attrcode=="pk_docclass"){
                            e.label = this.state.json['10180ADVCG-000007'],/* 国际化处理： 物料基本分类*/
                                e.refcode ="uapbd/refer/material/MaterialBasClassTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000007']/* 国际化处理： 物料基本分类*/
                        }
                        if(e.attrcode== 'pk_org'){
                            e.label = this.state.json['10180ADVCG-000012'],/* 国际化处理： 组织_业务单元_工厂*/
                                e.refcode ="uapbd/refer/org/FactoryGridRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000013']/* 国际化处理： 工厂*/
                        }
                    })
                    meta[pagetype].items.forEach((e)=>{
                        if(e.attrcode=="pk_prodeptdoc"){
                            e.isShowUnit=true;
                        }
                        if(e.attrcode=="pk_propsndoc"){
                            e.isShowUnit=true;
                        }
                        if(e.attrcode=="pk_marcostclass"){
                            e.isShowUnit=true;
                        }
                        if(e.attrcode=="disbrcostctr"){
                            e.isShowUnit=true;
                        }
                        if(e.attrcode=="disbearfactory"){
                            e.isShowUnit=true;
                        }
                    })
                    break;
                case 'materialpu':
                    meta[tableId].items.forEach((e)=>{
                        if(e.attrcode=="pk_docclass"){
                            e.label = this.state.json['10180ADVCG-000007'],/* 国际化处理： 物料基本分类*/
                                e.refcode ="uapbd/refer/material/MaterialBasClassTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000007']/* 国际化处理： 物料基本分类*/
                        }
                        if(e.attrcode== 'pk_org'){
                            e.label = this.state.json['10180ADVCG-000014'],/* 国际化处理： 组织_业务单元_采购组织*/
                                e.refcode ="uapbd/refer/org/PurchaseOrgGridRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000015']/* 国际化处理： 采购组织*/
                        }
                    })
                    meta[pagetype].items.forEach((e)=>{
                        if(e.attrcode=="pk_cumandoc"){
                            e.isShowUnit=true;
                        }
                    })
                    break;
                case 'materialsale':
                    meta[tableId].items.forEach((e)=>{
                        if(e.attrcode=="pk_docclass"){
                            e.label = this.state.json['10180ADVCG-000007'],/* 国际化处理： 物料基本分类*/
                                e.refcode ="uapbd/refer/material/MaterialBasClassTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000007']/* 国际化处理： 物料基本分类*/
                        }
                        if(e.attrcode== 'pk_org'){
                            e.label = this.state.json['10180ADVCG-000005'],/* 国际化处理： 组织_业务单元_销售组织*/
                                e.refcode ="uapbd/refer/org/SaleOrgTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000006']/* 国际化处理： 销售组织*/
                        }
                    })
                    meta[pagetype].items.forEach((e)=>{
                        if(e.attrcode=="pk_marsaleclass"){
                            e.isShowUnit=true;
                        }
                    })
                    break;
                case 'materialstock':
                    meta[tableId].items.forEach((e)=>{
                        if(e.attrcode=="pk_docclass"){
                            e.label = this.state.json['10180ADVCG-000007'],/* 国际化处理： 物料基本分类*/
                                e.refcode ="uapbd/refer/material/MaterialBasClassTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000007']/* 国际化处理： 物料基本分类*/
                        }
                        if(e.attrcode== 'pk_org'){
                            e.label = this.state.json['10180ADVCG-000016'],/* 国际化处理： 组织_业务单元_库存组织*/
                                e.refcode ="uapbd/refer/org/StockOrgGridRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000017']/* 国际化处理： 库存组织*/
                        }
                    })
                    meta[pagetype].items.forEach((e)=>{
                        if(e.attrcode=="pk_purchaseorg"){
                            e.isShowUnit=true;
                        }
                        if(e.attrcode=="pk_suplystockorg"){
                            e.isShowUnit=true;
                        }
                        if(e.attrcode=="pk_marpuclass"){
                            e.isShowUnit=true;
                        }
                        if(e.attrcode=="pk_stordoc"){
                            e.isShowUnit=true;
                        }
                    })
                    break;
                case 'materialpfc':
                    meta[tableId].items.forEach((e)=>{
                        if(e.attrcode=="pk_docclass"){
                            e.label = this.state.json['10180ADVCG-000007'],/* 国际化处理： 物料基本分类*/
                                e.refcode ="uapbd/refer/material/MaterialBasClassTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000007']/* 国际化处理： 物料基本分类*/
                        }
                        if(e.attrcode== 'pk_org'){
                            e.label = this.state.json['10180ADVCG-000018'],/* 国际化处理： 组织_业务单元_利润中心*/
                                e.refcode ="uapbd/refer/org/LiabilityCenterOrgTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000019']/* 国际化处理： 利润中心*/
                        }
                    })
                    meta[pagetype].items.forEach((e)=>{
                        if(e.attrcode=="pk_marcostcls"){
                            e.isShowUnit=true;
                        }
                    })
                    break;
                case 'materialpfcc':
                    meta[tableId].items.forEach((e)=>{
                        if(e.attrcode=="pk_docclass"){
                            e.label = this.state.json['10180ADVCG-000007'],/* 国际化处理： 物料基本分类*/
                                e.refcode ="uapbd/refer/material/MaterialBasClassTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000007']/* 国际化处理： 物料基本分类*/
                        }
                        if(e.attrcode== 'pk_org'){
                            e.label = this.state.json['10180ADVCG-000020'],/* 国际化处理： 组织_业务单元_利润中心成本域*/
                                e.refcode ="uapbd/refer/riaorgbd/LiactCostrgDefaultGridRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000021']/* 国际化处理： 利润中心成本域*/
                        }
                    })
                    break;
                case 'supfinance':
                    meta[tableId].items.forEach((e)=>{
                        if(e.attrcode=="pk_docclass"){
                            e.label = this.state.json['10180ADVCG-000022'],/* 国际化处理： 供应商基本分类*/
                                e.refcode ="uapbd/refer/supplier/SupplierClassTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000022']/* 国际化处理： 供应商基本分类*/
                        }
                        if(e.attrcode== 'pk_org'){
                            e.label = this.state.json['10180ADVCG-000003'],/* 国际化处理： 组织_业务单元_财务组织*/
                                e.refcode ="uapbd/refer/org/FinanceOrgTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000004']/* 国际化处理： 财务组织*/
                        }
                    })
                    meta[pagetype].items.forEach((e)=>{
                        if(e.attrcode=="pk_respdept"){
                            e.isShowUnit=true;
                        }
                        if(e.attrcode=="pk_resppsn"){
                            e.isShowUnit=true;
                        }
                        if(e.attrcode=="pk_payterm"){
                            e.isShowUnit=true;
                        }
                    })
                    break;
                case 'supstock':
                    meta[tableId].items.forEach((e)=>{
                        if(e.attrcode=="pk_docclass"){
                            e.label = this.state.json['10180ADVCG-000022'],/* 国际化处理： 供应商基本分类*/
                                e.refcode ="uapbd/refer/supplier/SupplierClassTreeRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000022']/* 国际化处理： 供应商基本分类*/
                        }
                        if(e.attrcode== 'pk_org'){
                            e.label = this.state.json['10180ADVCG-000014'],/* 国际化处理： 组织_业务单元_采购组织*/
                                e.refcode ="uapbd/refer/org/PurchaseOrgGridRef/index.js",
                                e.refName = this.state.json['10180ADVCG-000015']/* 国际化处理： 采购组织*/
                        }
                    })
                    meta[pagetype].items.forEach((e)=>{
                        switch (e.attrcode){
                            case 'respdept':
                                e.isShowUnit=true;
                                break;
                            case 'respperson':
                                e.isShowUnit=true;
                                break;
                            case 'paytermdefault':
                                e.isShowUnit=true;
                                break;
                            case 'billingsup':
                                e.isShowUnit=true;
                                break;
                            case 'issuesup':
                                e.isShowUnit=true;
                                break;
                            case 'pk_gathering':
                                e.isShowUnit=true;
                                break;
                            default :
                                break
                        }
                    })
                    break;
            }
        }


        return meta;
    }

    tableButtonClick=(props, id, text, record, index)=>{
        debugger
        switch(id){
            case "tabdelete"://删除行
                props.cardTable.delRowsByIndex(tableId, index);
                let status = props.cardTable.getStatus(tableId);
                if(status=="browse"){
                    let tableData = props.cardTable.getChangedRows(tableId);
                    this.props.validateToSave( {
                        pageid:pageId,
                        model:{
                            areaType: 'table',
                            pageinfo:null,
                            areacode:tableId,
                            rows:tableData
                        },
                    },()=>{
                        ajax({
                            url: urls.SaveRulesUrl,
                            data: {
                                pageid :pageId,
                                model:{
                                    'pageinfo':{},
                                    'areacode':tableId,
                                    'rows':tableData
                                },
                                userjson : `{id:${props.getUrlParam('id')},pagetype:${props.getUrlParam('pagetype')},pk_assign_tab:${props.getUrlParam('pk_assign_tab')}}`
                            },
                            success: (res) => {
                                if (res.success) {
                                    if (res.data) {
                                        this.tabrefresh();
                                        toast({content:this.state.json['10180ADVCG-000024'],color:'success'});/* 国际化处理： 删除成功*/
                                    }
                                }
                            }
                        })
                    } , {[tableId]:'editTable'} , 'grid' )
                }else{

                }
                break;
            default:
                break;
        }
    }

    componentWillMount(){
        let pagetype = this.props.getUrlParam('pagetype');
        this.state.pagetype = pagetype;
        this.setState(this.state);
    }
    componentDidMount() {
        window.addEventListener("beforeunload", function (e) {
            var  n  =  window.event.screenX  -  window.screenLeft; 
                  var  b  =  n  >  document.documentElement.scrollWidth-20; 
            if(b  &&  window.event.clientY  <  0  ||  window.event.altKey) {//关闭
            //不是所有浏览器都支持提示信息的修改
            var confirmationMessage =this.state.json['10180ADVCG-000048'];// json["10140FORMATDOC-000062"];//"请先保存您编辑的内容,否则您修改的信息会丢失。";
            e.returnValue = confirmationMessage;
            return confirmationMessage;
            }else {
            //不是所有浏览器都支持提示信息的修改
            var confirmationMessage =this.state.json['10180ADVCG-000048'];// json["10140FORMATDOC-000062"];
            e.returnValue = confirmationMessage;
            return confirmationMessage;
            }
            });
    }

    componentDidUpdate(){
        let formStatus = this.props.form.getFormStatus(this.formId);
        let tableStatus = this.props.cardTable.getStatus(this.tableId);
        if(formStatus === 'browse'&&tableStatus === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    setDefaultValue = () =>{
        this.props.form.setFormStatus(this.formId, 'add');
        this.props.form.EmptyAllFormValue(this.formId);
        this.props.form.setFormItemsValue(this.formId,{'bill_status':{value:'0',display:this.state.json['10180ADVCG-000025']}});/* 国际化处理： 自由态*/
        this.toggleShow();
    }

    //切换页面状态
    toggleShow = () => {
        debugger
        debugger
        let status = this.props.getUrlParam('status');
        let length = this.props.cardTable.getNumberOfRows(tableId);
        this.props.button.setButtonVisible(['tabsave','tabcancel'],false);
        //按钮的显示状态
        if(status == 'edit' || status == 'add'){
            this.props.button.setButtonVisible(['edit','add','back','delete','refresh'],false);
            this.props.button.setButtonVisible(['save','cancel'],true);
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
            this.props.button.setDisabled({
                tabadd:true,
                tabsave:true,
                tabedit:true,
                tabcancel:true,
                tabset:true,
            })
        }else{
            this.props.button.setButtonVisible(['save','cancel'],false);
            this.props.button.setButtonVisible(['add','edit','delete','back','refresh'],true);
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
            this.props.button.setDisabled({
                tabadd:false,
                tabsave:true,
                tabedit:!(length>0),
                tabcancel:true,
                tabset:false,
            })
        }
        this.props.form.setFormStatus(this.formId, status);
        this.props.form.setFormStatus(this.state.pagetype, status);
        this.setState({
            stated:status
        });
    };

    tabletoggleShow=(sta)=>{
        debugger
        let status = sta?sta:this.props.cardTable.getStatus(tableId);
        this.props.button.setPopContent(status === 'browse' ?{'tabdelete':this.state.json['10180ADVCG-000047']}:{'tabdelete':null});/* 国际化处理： 确认要删除该信息吗？*/
        let length = this.props.cardTable.getNumberOfRows(tableId);
        let flag = status === 'browse' ? false : true;
        this.props.button.setDisabled({
            add:flag,
            edit:flag,
            delete:flag,
            refresh:flag,
        })
        this.props.button.setButtonVisible({tabsave:flag,tabcancel:flag,tabedit:!flag});
        this.props.button.setDisabled({
            tabsave:!flag,
            tabedit:!(length>0&&!flag),
            tabcancel:!flag,
            tabset:false,
            tabrefresh:flag,
        })
        // this.setState({
        //     stated:status
        // });
    }

    //按钮点击事件
    buttonClick(props, id) {
        debugger
        switch (id) {
            case 'add':
                props.form.EmptyAllFormValue(this.formId)
                props.form.EmptyAllFormValue(this.state.pagetype)
                props.cardTable.setTableData(this.tableId, { rows: [] })
                props.setUrlParam({status:'add'})
                this.setDefaultValue();
                break
            case 'edit':
                props.setUrlParam({status:'edit'})
                this.toggleShow();
                break;
            case 'delete':
                promptBox({
                    color:"info",
                    title: this.state.json['10180ADVCG-000031'],/* 国际化处理： 注意*/
                    content: this.state.json['10180ADVCG-000032'],/* 国际化处理： 确认删除？*/
                    beSureBtnClick: this.delConfirm.bind(this),
                    cancelBtnClick:()=>{
                        return;
                    },
                    closeBtnClick:()=>{
                        return;
                    }
                })
                break
            case 'back':
                props.pushTo("/list",{
                    pagecode:'10180ADVCG_assigntemp'
                })
                break
            case 'save':
                this.saveClick();
                break
            case 'cancel':
                promptBox({
                    color:"warning",
                    title:this.state.json['10180ADVCG-000026'],/* 国际化处理： 确认取消*/
                    content:this.state.json['10180ADVCG-000027'],/* 国际化处理： 是否确认要取消?*/
                    beSureBtnClick:()=>{
                        if (props.getUrlParam('status') === 'add') {
                            let id =  props.getUrlParam('id')||getCurrentLastId(assdatasource);
                            if(id){
                                this.props.setUrlParam({status:'browse',id:id})
                                this.getdata(id,this.props.getUrlParam('pk_assign_tab'),this.props.getUrlParam('pagetype'));
                            }else{
                                props.setUrlParam({status:'browse'})
                                this.props.form.cancel(this.formId);
                                this.props.form.cancel(this.state.pagetype);
                                props.form.setFormStatus(this.formId, "browse");
                                props.form.setFormStatus(this.state.pagetype, "browse");
                                props.cardTable.setStatus(tableId,"browse");
                                this.props.button.setButtonVisible(['save','cancel'],false);
                                this.props.button.setButtonVisible(['add','edit','delete','back','refresh'],true);
                                this.props.button.setDisabled({
                                    tabadd:true,
                                    tabsave:true,
                                    tabedit:true,
                                    tabcancel:true,
                                    tabset:true,
                                    edit:true,
                                    delete:true,
                                    refresh:true,
                                })
                                this.setState({
                                        stated:"browse"
                                    });
                                return;
                            }
                        }
                        if (props.getUrlParam('status') === 'edit') {
                            props.form.cancel(this.formId);
                            props.form.cancel(this.state.pagetype);
                            props.setUrlParam({status:'browse'});
                            this.toggleShow();
                        }
                    },
                    cancelBtnClick:()=>{
                        return;
                    },
                    closeBtnClick:()=>{
                        return;
                    }
                })
                break
            case 'refresh':
                this.allrefresh(()=>{toast({title:this.state.json['10180ADVCG-000028']});});/* 国际化处理： 刷新成功！*/
                break
            case 'tabadd':
                this.props.cardTable.setStatus(tableId, 'edit');
                props.cardTable.addRow(this.tableId);
                this.tabletoggleShow('edit');
                break
            case 'tabsave':
                this.props.cardTable.filterEmptyRows(tableId,['pk_docclass','pk_org'],'include');
                let tableData = this.props.cardTable.getChangedRows(tableId);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
                if(!tableData || tableData.length === 0) {
                    this.props.cardTable.setStatus(tableId, 'browse');
                    toast({title:this.state.json['10180ADVCG-000029']});/* 国际化处理： 保存成功！*/
                    this.tabrefresh();
                    this.tabletoggleShow('browse');
                    return
                }
                this.props.validateToSave( {
                    pageid:pageId,
                    model:{
                        areaType: 'table',
                        pageinfo:null,
                        areacode:tableId,
                        rows:tableData
                    },
                },()=>{
                    ajax({
                        url: urls.SaveRulesUrl,
                        data: {
                            pageid :pageId,
                            model:{
                                'pageinfo':{},
                                'areacode':tableId,
                                'rows':tableData
                            },
                            userjson : `{id:${this.props.getUrlParam('id')},pagetype:${this.props.getUrlParam('pagetype')},pk_assign_tab:${this.props.getUrlParam('pk_assign_tab')}}`
                        },
                        success: (res) => {
                            if (res.success) {
                                if (res.data) {
                                    this.props.cardTable.setStatus(tableId, 'browse');
                                    toast({title:this.state.json['10180ADVCG-000029']});/* 国际化处理： 保存成功！*/
                                    this.tabrefresh();
                                    this.tabletoggleShow('browse');
                                }
                            }
                        }
                    })
                } , {[tableId]:'editTable'} , 'grid' )
                break
            case 'tabedit':
                this.props.cardTable.setStatus(tableId, 'edit');
                this.tabletoggleShow('edit');
                break
            case 'tabcancel':
                this.props.cardTable.resetTableData(tableId);
                this.tabrefresh();
                this.props.cardTable.setStatus(tableId, 'browse');
                this.tabletoggleShow('browse');
                break
            case 'tabrefresh':
                this.tabrefresh(()=>{toast({title:this.state.json['10180ADVCG-000028']});});/* 国际化处理： 刷新成功！*/
                break
            case 'tabset':
                let pk_docclass;
                let pk_org;
                this.props.meta.getMeta()[tableId].items.forEach((e)=>{
                    if(e.attrcode=="pk_docclass"){
                        pk_docclass = e;
                    }
                    if(e.attrcode== 'pk_org'){
                        pk_org = e;
                    }
                });
                this.setState({
                    pk_docclass0:pk_docclass,
                    pk_org0:pk_org
                })
                props.modal.show('modal',{
                    beSureBtnClick:()=>{
                        props.cardTable.setStatus("edit");
                        if(this.state.isMultiSelectedEnabled){
                            this.state.pk_docclassvalue.forEach((e)=>{
                                let len = props.cardTable.getNumberOfRows(tableId);
                                props.cardTable.addRow(this.tableId, len, {pk_docclass:{value:e.refpk,display:e.refname},pk_org:{value:this.state.pk_orgvalue.refpk,display:this.state.pk_orgvalue.refname}});
                            })
                        }else{
                            this.state.pk_orgvalue.forEach((e)=>{
                                let len = props.cardTable.getNumberOfRows(tableId);
                                props.cardTable.addRow(this.tableId, len, {pk_docclass:{value:this.state.pk_docclassvalue.refpk,display:this.state.pk_docclassvalue.refname},pk_org:{value:e.refpk,display:e.refname}});
                            })
                        }
                        this.tabletoggleShow();
                    }
                })
                break;
            default:
                break
        }
    }

    //表格刷新
    tabrefresh(callback){
        let status = this.props.getUrlParam('status');
        if(status == "browse"){
            let	pk = this.props.getUrlParam('id');
            let pk_assign_tab = this.props.getUrlParam('pk_assign_tab');
            let pagetype = this.props.getUrlParam('pagetype');
            if(pk && pk != 'undefined'){
                let data = {pk,pk_assign_tab,pagetype};
                ajax({
                    url: urls.querycardUrl,
                    data,
                    success: (res) => {
                        showFormular(this.props,res,{
                            "assigntemp" : "form",
                            [this.state.pagetype]:"form",
                            "assignrules" : "cardTable",
                        });
                        if(res.data.table){
                            this.props.cardTable.setTableData(this.tableId, res.data.table[this.tableId]);
                        }else{
                            this.props.cardTable.setTableData(this.tableId,{rows: []});               
                        }
                        this.tabletoggleShow();
                        callback&&callback()
                    }
                });
            }else{
                callback&&callback();
            }
        }else{
            callback&&callback();
        }
    }

    //通过单据id查询单据信息
    getdata = (pk,pk_assign_tab,pagetype) =>{
        let that = this;
        let cardData = getCacheById(pk, assdatasource);
        if(cardData){
            if (cardData.form1) {
                this.props.form.setAllFormValue({ [that.formId]: cardData.form1[that.formId] });
            }
            if (cardData.form2) {
                this.props.form.setAllFormValue({ [that.state.pagetype]: cardData.form2[that.state.pagetype] });
            }
            if(cardData.table){
                this.props.cardTable.setTableData(that.tableId, cardData.table[that.tableId]);
            }
            this.toggleShow();
            this.tabletoggleShow();
        }else{
            let data = {pk,pk_assign_tab,pagetype};
            ajax({
                url: urls.querycardUrl,
                data,
                success: (res) => {
                    showFormular(this.props,res,{
                        "assigntemp" : "form",
                        [this.state.pagetype]:"form",
                        "assignrules" : "cardTable",
                    });
                    if (res.data.form1) {
                        this.props.form.setAllFormValue({ [that.formId]: res.data.form1[that.formId] });
                        // let project_code = res.data[that.formId].rows[0].values[pk_value].value;
                        // this.setState({project_code});
                    }
                    if (res.data.form2) {
                        this.props.form.setAllFormValue({ [that.state.pagetype]: res.data.form2[that.state.pagetype] });
                    }
                    if(res.data.table){
                        this.props.cardTable.setTableData(that.tableId, res.data.table[that.tableId]);
                    }
                    res.data['head']=res.data["form1"];
                    updateCache(pk_item,pk,res.data,this.formId1,assdatasource);
                    this.toggleShow();
                    this.tabletoggleShow();
                }
            });
        }
    }

    //刷新缓存查询
    refreshgetdata = (pk,pk_assign_tab,pagetype) =>{
        let that = this;
        let data = {pk,pk_assign_tab,pagetype};
        ajax({
            url: urls.querycardUrl,
            data,
            success: (res) => {
                showFormular(this.props,res,{
                    "assigntemp" : "form",
                    [this.state.pagetype]:"form",
                    "assignrules" : "cardTable",
                });
                if (res.data.form1) {
                    this.props.form.setAllFormValue({ [that.formId]: res.data.form1[that.formId] });
                }
                if (res.data.form2) {
                    this.props.form.setAllFormValue({ [that.state.pagetype]: res.data.form2[that.state.pagetype] });
                }
                if(res.data.table){
                    this.props.cardTable.setTableData(that.tableId, res.data.table[that.tableId]);
                }
                res.data['head']=res.data["form1"];
                updateCache(pk_item,pk,res.data,this.formId1,assdatasource);
            }
        });

    }

    allrefresh = (callback)=>{
        let	pk = this.props.getUrlParam('id');
        this.refreshgetdata(pk,this.props.getUrlParam('pk_assign_tab'),this.props.getUrlParam('pagetype'));
        this.props.cardTable.setStatus(tableId,"browse");
        this.tabrefresh();
        this.tabletoggleShow();
        callback&&callback();
    }
    //保存单据
    saveClick = () =>{
        debugger
        this.props.cardTable.filterEmptyRows(tableId);
        let flag = this.props.form.isCheckNow([this.formId,this.state.pagetype]);
        if(!flag)return
        let formData = this.props.form.getAllFormValue(this.formId);
        formData.areacode = this.formId;
        let formData2 = this.props.form.getAllFormValue(this.state.pagetype);
        formData2.areacode = this.state.pagetype;

        let url = urls.SaveassigntempUrl//新增保存
        if (this.props.getUrlParam('status') === 'edit') {
            url = urls.updateassigntempUrl//修改保存
        }
        this.props.validateToSave( {"model" : formData,"pageid" : pageId} , ()=>{
            this.props.validateToSave( {"model" : formData2,"pageid" : pageId} , ()=>{
                ajax({
                    url: url,
                    data: {
                        pageid :pageId,
                        pagetype:this.props.getUrlParam('pagetype'),
                        pk_assign_tab:this.props.getUrlParam('pk_assign_tab'),
                        model:formData,
                        model1:formData2
                    },
                    success: (res) => {
                        let pk_project = null
                        if (res.success) {
                            showFormular(this.props,res,{
                                "assigntemp" : "form",
                                [this.state.pagetype]:"form",
                                "assignrules" : "cardTable",
                            });
                            if (res.data) {
                                if (res.data.form1) {
                                    this.props.form.setAllFormValue({ [this.formId]: res.data.form1[this.formId] });
                                    // let project_code = res.data[that.formId].rows[0].values[pk_value].value;
                                    // this.setState({project_code});
                                }
                                if (res.data.form2) {
                                    this.props.form.setAllFormValue({ [this.state.pagetype]: res.data.form2[this.state.pagetype] });
                                }
                                if(res.data.table){
                                    this.props.cardTable.setTableData(this.tableId, res.data.table[this.tableId]);
                                }
                                res.data['head']=res.data["form1"];
                                let idvalue = res.data.form1[this.formId].rows[0].values[pk_value].value;
                                if (this.props.getUrlParam('status') === 'add'){
                                    addCache(idvalue,res.data,this.formId1,assdatasource);
                                }{
                                    updateCache(pk_item,idvalue,res.data,this.formId1,assdatasource);
                                }
                                toast({title : this.state.json['10180ADVCG-000029'],color : 'success'});/* 国际化处理： 保存成功！*/
                                this.props.setUrlParam({status:'browse',id: res.data.form1[this.formId].rows[0].values["pk_assign_temp"].value})
                                this.toggleShow();
                            }
                        }
                    }
                });
            } , {[this.state.pagetype]:'form'} , 'form' )
        } , {[this.formId]:'form'} , 'form' )
    }

    //删除单据
    delConfirm = () => {
        ajax({
            url: urls.deleteCardUrl,
            data: {
                pagetype:this.props.getUrlParam('pagetype'),
                id: this.props.getUrlParam('id'),
                pk_assign_tab:this.props.getUrlParam('pk_assign_tab')
            },
            success: (res) => {
                debugger
                let id =this.props.getUrlParam('id');
                let nextId = getNextId(id, assdatasource);
                deleteCacheById(pk_item,id,assdatasource);
                toast({ color: 'success', title: this.state.json['10180ADVCG-000030'] });/* 国际化处理： 删除成功！*/
                if(nextId){
                    this.props.setUrlParam({status:'browse',id: nextId})
                    this.getdata(nextId,this.props.getUrlParam('pk_assign_tab'),this.props.getUrlParam('pagetype'));
                }else{
                    this.props.pushTo("/list",{
                        pagecode:'10180ADVCG_assigntemp',
                    });
                }
            }
        });
    };

    modelSave = (props)=>{
        props.cardTable.closeModel(this.tableId);
        this.saveClick();
    }

    //动态加载参照
    renderRef(param, e ) {
        if(!e){
            return
        }
        let book;
        if(!this.state[param]) {
            setTimeout(()=>{
                {createScript.call(this,e.refcode, param)}
            })
        } else {
            book =  (
                <NCRow>
                    <NCCol xs={12} md={12}>
                        {this.state[param]?(this.state[param])(
                            {
                                isMultiSelectedEnabled:param=="pk_docclass"?this.state.isMultiSelectedEnabled:!this.state.isMultiSelectedEnabled,
                                value: this.state[param+"value"],
                                onChange:(value)=> {
                                    this.setState({[param+"value"]:value});
                                }
                            }
                        ):<div/>}
                    </NCCol>
                </NCRow>
            );
        }
        return book;
    }

    afterEvent = (props, moduleId, key, value,oldValue) =>{
        if(key === 'conversemethod'){
            if(value.value === '1'){
                props.form.setFormItemsDisabled('materialprod',{converstime:true});
                props.form.setFormItemsValue('materialprod',{converstime:{value:null,display:null}});
            }else{
                props.form.setFormItemsDisabled('materialprod',{converstime:false});
            }
        }else if(key === 'sfcbdx'){// 成本对象
            if(value.value){
                props.form.setFormItemsDisabled('materialprod',{sfcbdxtype:false});
            }else{
                props.form.setFormItemsDisabled('materialprod',{sfcbdxtype:true});
                props.form.setFormItemsDisabled('materialprod',{classfeature:true});
                props.form.setFormItemsValue('materialprod',{sfcbdxtype:{value:null,display:null}});
                props.form.setFormItemsValue('materialprod',{classfeature:{value:false,display:null}});
            }
        }else if(key === 'isuseroad'){// 核算工序成本
            if(value.value){
                props.form.setFormItemsDisabled('materialprod',{azcbzxtjcl:false});
            }else{
                props.form.setFormItemsDisabled('materialprod',{azcbzxtjcl:true});
                props.form.setFormItemsValue('materialprod',{azcbzxtjcl:{value:true,display:null}});
            }
        }else if(key === 'sffzfw'){// 辅助服务
            if(value.value){
                props.form.setFormItemsDisabled('materialprod',{sfcbdxtype:true});
                props.form.setFormItemsValue('materialprod',{sfcbdxtype:{value:'Sys001',display:'品种'}});
            }else{
                props.form.setFormItemsDisabled('materialprod',{sfcbdxtype:false});
            }
        }else if(key === 'sfcbdxtype'){//// 成本对象类型
            let meta = props.meta.getMeta();
            if(value.value === 'Sys004'){
                // meta['producecost'].items.forEach((item,index)=>{
                //     if(item.attrcode === 'pk_marcostclass'){
                //         meta['producecost'].items[index].queryCondition={
                //             finalcostobj : 'Y',
                //             pk_org:props.form.getFormItemsValue('materialprod','pk_org').value,
                //             TreeRefActionExt:'nccloud.web.uapbd.material.action.MaterialCostClassTreeRefExt'
                //         }
                //     }
                // });
                if(props.form.getFormItemsValue('materialprod','sfcbdx') && props.form.getFormItemsValue('asmaterialprodsigntemp','sfcbdx')){
                    props.form.setFormItemsDisabled('materialprod',{classfeature:false});
                }else{
                    props.form.setFormItemsDisabled('materialprod',{classfeature:true});
                }
                props.form.setFormItemsDisabled('materialprod',{costvalutasst2:true,costvalutasst3:true,costvalutasst4:true,costvalutasst5:true,costvalutasst6:true,costvalutasst7:true,costvalutasst8:true,costvalutasst9:true,costvalutasst10:true,costvalutasst11:true,costvalutasst12:true,costvalutasst13:true,costvalutasst14:true,costvalutasst15:true,costvalutasst100:true});
            }else{
                // meta['producecost'].items.forEach((item,index)=>{
                //     if(item.attrcode === 'pk_marcostclass'){
                //         meta['producecost'].items[index].queryCondition={
                //             finalcostobj : 'N',
                //             pk_org:props.form.getFormItemsValue('materialprod','pk_org').value,
                //             TreeRefActionExt:'nccloud.web.uapbd.material.action.MaterialCostClassTreeRefExt'
                //         }
                //     }
                // });
                props.form.setFormItemsDisabled('materialprod',{classfeature:true});
                props.form.setFormItemsDisabled('materialprod',{costvalutasst2:false,costvalutasst3:false,costvalutasst4:false,costvalutasst5:false,costvalutasst6:false,costvalutasst7:false,costvalutasst8:false,costvalutasst9:false,costvalutasst10:false,costvalutasst11:false,costvalutasst12:false,costvalutasst13:false,costvalutasst14:false,costvalutasst15:false,costvalutasst100:false});
            }
            //NCCLOUD-164011 [物料]轻量端中，物料生产信息页签，修改或清空成本分类后，应取消勾选“分类特征物料”
            props.form.setFormItemsValue('materialprod',{'pk_marcostclass':{display:"",value:""},'classfeature':{display:"",value:false}});
        }else if(key === "pk_marcostclass"){
            //值修改时，取消勾选“分类特征物料”
            props.form.setFormItemsValue('materialprod',{'classfeature':{display:"",value:false}});
        }
    }

    handleChange=(value)=>{
        if(value == "org"){
            this.setState({
                isMultiSelectedEnabled:true,
                selectedValue:value,
            });
        }else{
            this.setState({
                isMultiSelectedEnabled:false,
                selectedValue:value,
            }) ;
        }
    }

    //分页器
    pageInfoClick=(props, pk)=> {
        if(pk&&pk!=null){
            props.setUrlParam({id:pk});
            this.getdata(pk,this.props.getUrlParam('pk_assign_tab'),this.props.getUrlParam('pagetype'));
        }
    }

    //获取列表肩部信息
    getTableHead = () => {
        let {button} = this.props;
        let { createButtonApp } = button;
        let status = this.props.getUrlParam("status");
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
                    {this.props.cardTable.createBrowseIcons(this.tableId, {
                        iconArr: [ 'max'],
                        maxDestAreaId: 'nc-bill-card'
                    })}
                </div>
            </div>
        )
    }
    render() {
        const {BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        let { cardTable, form, button, modal, cardPagination } = this.props;
        const {createCardPagination} = cardPagination;
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createButtonApp } = button;
        let { createModal } = modal;
        return (
            <div  className='nc-bill-card'>
                <div className="nc-bill-top-area">
                    <NCAffix>
                    <NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area' >
                    {/* fieldid={this.state.json['10180ADVCG-000034']+'_title'} */}
                        {/* {this.state.stated === 'browse'&&
                        <NCBackBtn className='title-search-detail'
                                   onClick={ this.buttonClick.bind(this,this.props,'back') }></NCBackBtn>} */}
                        {/* {createPageIcon()} */}
                        {createBillHeadInfo({
                            title:this.state.json['10180ADVCG-000034'],
                            backBtnClick:this.buttonClick.bind(this,this.props,'back'),
							showBackBtn:this.state.stated === 'browse',
							initShowBackBtn:this.state.stated === 'browse'
                        }	
	                    )}
                        {/* <h2 className='title-search-detail'>{this.state.json['10180ADVCG-000034'] */}
                        {/* 国际化处理： 分配默认值配置*/}
                        {/* </h2> */}
                        <div className="header-button-area">
                            {createButtonApp({
                                area: 'header-button-area',
                                buttonLimit: 3,
                                onButtonClick: this.buttonClick.bind(this),
                                popContainer: document.querySelector('.header-button-area')

                            })}
                            <div className='header-cardPagination-area' style={{float:'right'}}>
                                {createCardPagination({
                                    handlePageInfoChange: this.pageInfoClick.bind(this),
                                    dataSource: assdatasource
                                })}
                            </div>
                        </div>
                    </NCDiv>
                    </NCAffix>
                    <div className="nc-bill-form-area">
                        {
                            createForm(this.formId, {
                                onAfterEvent: this.afterEvent.bind(this)
                            })
                        }
                        <div  className = "nc-theme-common-font-c" style={{paddingLeft: 20}}>{this.state.json['10180ADVCG-000035']/* 国际化处理： 属性默认值*/}</div>
                        {
                            createForm(this.state.pagetype, {
                                onAfterEvent: this.afterEvent.bind(this)
                            })
                        }
                    </div>
                </div>
                <div className="nc-bill-bottom-area">
                    {createCardTable(this.tableId, {
                        tableHead: this.getTableHead.bind(this),
                        modelSave: this.modelSave.bind(this),
                        showIndex:true,
                    })}
                </div>
                {createModal('delete', {
                    title: this.state.json['10180ADVCG-000031'],/* 国际化处理： 注意*/
                    content: this.state.json['10180ADVCG-000032'],/* 国际化处理： 确认删除？*/
                    beSureBtnClick: this.delConfirm.bind(this)
                })}
                {createModal('modal',{
                    color:"warning",
                    title:this.state.json['10180ADVCG-000033'],/* 国际化处理： 快速设置*/
                    content:(
                        <NCForm  showSubmit={false}>
                            <NCFormItem  isRequire={true}  >
                                <NCRadio.NCRadioGroup
                                    selectedValue={this.state.selectedValue}
                                    onChange={this.handleChange.bind(this)}
                                >
                                    <NCRadio value="org" >{this.state.json['10180ADVCG-000036']/* 国际化处理： 多分类同一组织*/}</NCRadio>
                                    <NCRadio value="class" >{this.state.json['10180ADVCG-000037']/* 国际化处理： 多组织同一分类*/}</NCRadio>
                                </NCRadio.NCRadioGroup>
                            </NCFormItem>

                            <NCCol md={12}> <NCCol md={3}>{this.state.pk_docclass0&&this.state.pk_docclass0.label}</NCCol><NCCol md={4}>
                                {this.renderRef('pk_docclass',this.state.pk_docclass0&&this.state.pk_docclass0)}
                            </NCCol></NCCol>
                            <NCCol md={12}> <NCCol md={3}>{this.state.pk_org0&&this.state.pk_org0.label}</NCCol><NCCol md={4}>
                                {this.renderRef('pk_org',this.state.pk_org0&&this.state.pk_org0)}
                            </NCCol></NCCol>

                        </NCForm>

                    ),
                    noFooter:false
                })}
            </div>
        );
    }
}

Card =  createPage({
    billinfo:[{
        billtype: 'form',
        pagecode: '10180ADVCG_assigntemp_card',
        headcode: 'assigntemp'
    }, {
        billtype: 'form',
        pagecode: '10180ADVCG_assigntemp_card',
        headcode: 'custcreditctl'
    },{
        billtype: 'form',
        pagecode: '10180ADVCG_assigntemp_card',
        headcode: 'custfinance'
    }, {
        billtype: 'form',
        pagecode: '10180ADVCG_assigntemp_card',
        headcode: 'custsale'
    }, {
        billtype: 'form',
        pagecode: '10180ADVCG_assigntemp_card',
        headcode: 'materialcost'
    }, {
        billtype: 'form',
        pagecode: '10180ADVCG_assigntemp_card',
        headcode: 'materialfi'
    }, {
        billtype: 'form',
        pagecode: '10180ADVCG_assigntemp_card',
        headcode: 'materialplan'
    },{
        billtype: 'form',
        pagecode: '10180ADVCG_assigntemp_card',
        headcode: 'materialprod'
    }, {
        billtype: 'form',
        pagecode: '10180ADVCG_assigntemp_card',
        headcode: 'materialpu'
    }, {
        billtype: 'form',
        pagecode: '10180ADVCG_assigntemp_card',
        headcode: 'materialsale'
    }, {
        billtype: 'form',
        pagecode: '10180ADVCG_assigntemp_card',
        headcode: 'materialstock'
    }, {
        billtype: 'form',
        pagecode: '10180ADVCG_assigntemp_card',
        headcode: 'materialpfc'
    }, {
        billtype: 'form',
        pagecode: '10180ADVCG_assigntemp_card',
        headcode: 'materialpfcc'
    }, {
        billtype: 'form',
        pagecode: '10180ADVCG_assigntemp_card',
        headcode: 'supfinance'
    }, {
        billtype: 'form',
        pagecode: '10180ADVCG_assigntemp_card',
        headcode: 'supstock'
    },{
        billtype: 'grid',
        pagecode: '10180ADVCG_assigntemp_card',
        bodycode: 'assignrules'
    }]
})(Card);
//export default Card
//ReactDOM.render(<Card />, document.querySelector('#app'));

export default Card;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65