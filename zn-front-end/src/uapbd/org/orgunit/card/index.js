//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, ajax, base, toast ,cardCache,high,promptBox} from 'nc-lightapp-front';
import createUIDom from '../../../public/utils/BDCreateUIDom';
const { NCAffix,NCAnchor,NCScrollElement,NCScrollLink,NCCol,NCCheckbox,NCSwitch,NCCollapse,NCBackBtn} = base;
import {initTemplate,buttonClick,pageInfoClick,oprButtonClick} from './events'
let {setDefData, getDefData } = cardCache;
import './index.less'
import '../../../public/uapbdstyle/uapbd_style_common.less'

const queryCardUrl = '/nccloud/uapbd/org/queryorgcard.do';  //卡片查询url
const saveUrl = '/nccloud/uapbd/customer/saveCustomer.do';             //新增保存
const updateUrl = '/nccloud/uapbd/customer/saveEditCustomer.do';         //修改保存
const queryorgunitUrl = '/nccloud/uapbd/org/queryorgtype.do';         //查询组织类型vo
const queryorgtypeUrl = '/nccloud/uapbd/org/queryallorgtype.do';         //查询所有组织类型
const versionlId = 'versionlId';//版本化模态框
const { NCUploader,PrintOutput } = high;           // 从 高阶组件引入NCUploader。
// import './index.less'
import './card.less'
import Orgunitversion from '../../orgunit/version';


let childstate = {
    corp:false	,//法人公司
    hrorg:false	,//人力资源
    financeorg:false	,//财务组织
    fundorg:false	,//资金
    purchaseorg:false	,//采购
    saleorg:false	,//销售
    stockorg:false	,//库存
    trafficorg:false	,//物流
    qccenter:false	,//质检
    assetorg:false	,//资产
    maintainorg:false	,//维修
    liabilitycenter:false	,//利润中心
    itemorg:false	,//项目
    planbudget:false	,//预算
    adminorg:false	,//行政
    factory:false	,//工厂
    plancenter:false	,//计划中心
};

class Orgunitcard extends Component {
    constructor(props) {
        super(props);
        this.config = props.config;
        this.state = {
            showUploader:false,
            deleteorgtype:[],
            json: {},
            inlt:null,
            originalorgtypefloor:[],
            showlogoUploader:false,
            pks:[],
            buttonshow:false,
            showSubGrid:true,//控制上一页下一页显示
            pk_org : '',
            title_code : '',
            orgtype:[],   //用于查询组织类型数据
            orgtypefloor: [],//加载楼层用
            increaseorgtype: [],//新增楼层用
            childstate:childstate
        }
        this.onRefresh = this.onRefresh.bind(this);
        this.showOffChange = this.showOffChange.bind(this);
    }
    componentDidMount() {
        //this.onRefresh()
    }
    
     componentWillMount() {
		    
  	}


    componentDidUpdate(){
        let urlstatus = this.props.getUrlParam('status')
        //组织主管
        let orgmanagerstatus = this.props.editTable.getStatus('orgmanager');
        //业务期间
        let orgmoduleperiodstatus = this.props.editTable.getStatus('orgmoduleperiod');
        //内部客商
        let innercustsuppstatus = this.props.form.getFormStatus('innercustsupp');
        //维护vat
        let orgvatfunclet = this.props.editTable.getStatus('orgvatfunclet');

        if(urlstatus === 'browse' && (orgmanagerstatus == undefined || orgmanagerstatus=='browse') && (orgmoduleperiodstatus == undefined || orgmoduleperiodstatus=='browse') &&  
        (innercustsuppstatus == undefined || innercustsuppstatus=='browse') && (orgvatfunclet == undefined || orgvatfunclet == 'browse')){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
                };
        }
    }

    initData(pk){
        //初始化界面的时候，需要把楼层清空
        this.state.orgtypefloor = [];
        if(pk == undefined || pk == ''){
            pk = this.props.getUrlParam('pk_org');
        }
        let	status = this.props.getUrlParam('status');
        let flag = true;
        //将职能信息初始化，都设置为false
        this.props.config.orgtypearr.map((nb) =>{
            this.state.childstate[nb.subGrid]=false;
        })
        if(!(pk == undefined || pk == '')){
            let that = this ; 
            ajax({
                url:queryorgtypeUrl,
                data:{pk_org:pk,type:'normal'},
                async:false,
                success: (res) => {
                    if (res.success && res.data) {
                        res.data.map((obj) =>{
                            //orgtype存储所有职能相关信息
                            that.state.orgtype.push(obj);
                            //设置职能初始化相关信息
                            that.props.config.orgtypearr.map((nb) =>{
                                if(nb.subGrid == obj.code && 'add' != status){
                                    nb.pk_orgtype = obj.pk_orgtype;
                                    nb.isshow = true;
                                    //用于保存职能的相关信息（主键，是否显示，区域编码）
                                    that.state.childstate[nb.subGrid]=true;
                                    //用于加载楼层
                                    that.state.orgtypefloor.push(nb);
                                }
                            })
                        })
                    }
                    //将楼层还有职能转态初始化之后，保存，取消的时候，可以用于还原
                    setDefData('orgunit_childstate',that.config.datasource,JSON.parse(JSON.stringify(that.state.childstate)));
                    setDefData('orgunit_orgtypefloor',that.config.datasource,that.state.orgtypefloor);
                    this.setState({
                        originalorgtypefloor:JSON.parse(JSON.stringify(that.state.orgtypefloor))
                    });
                }
            });
        }
    }

    componentWillMount(){
        
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
        if (status) {
               // intemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
                this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
                this.props.config.josn = this.state.json;
                initTemplate(this.props,this.onRefresh);
            } else {
                console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
            }

        }
        this.props.MultiInit.getMultiLang({moduleId: '10100ORG',domainName: 'uapbd',callback})

        this.initData();
        
    }

    onRefresh(pk_org){
        let that = this;
        let status = that.props.getUrlParam('status');
        let btnopr = getDefData('orgunit_btnopr',that.props.config.datasource);
        if(pk_org == undefined || pk_org == ''){
            pk_org = this.props.getUrlParam('pk_org');
        }
        if(status != "add"){
            //不是新增的时候，需要加载页面数据
            if(pk_org && pk_org != 'undefined'){
                that.getdata(pk_org);
            }

            //编辑的时候会计期间方案和本位币是不可以修改
            that.props.form.setFormItemsDisabled('org',{'pk_accperiodscheme':false});
            that.props.form.setFormItemsDisabled('org',{'pk_currtype':false});
            //控制上一页下一页按钮显示
            if(status == "browse"){
                that.setState({
                    showSubGrid:true
                })
            }else{
                that.setState({
                    showSubGrid:false
                },()=>{
                    if('copy' == btnopr){
                        if(that.state.childstate.corp == true){
                            //处理委托关系部分字段，是否可编辑
                            that.dealrelationformstatus();
                        }
                    }
                })
            }
            if(status == "edit"){
                let corproot = getDefData('havecorprootorgunit',that.props.config.datasource);
                //复制的时候，法人的上级公司可以编辑，其他情况，edit状态的时候，根节点法人上级公司不可以编辑
                if(!corproot.haveroot || (pk_org == corproot.pk && 'copy' != btnopr)){
                    that.props.form.setFormItemsDisabled('corp',{'pk_fatherorg':true});
                    that.props.form.setFormItemsRequired('corp',{'pk_fatherorg':false});
                }else{
                    that.props.form.setFormItemsDisabled('corp',{'pk_fatherorg':false});
                    that.props.form.setFormItemsRequired('corp',{'pk_fatherorg':true});
                }

                if(that.state.childstate.financeorg){
                    that.props.form.setFormItemsDisabled('stockorg',{pk_financeorg:true});//设置表单项不可用
                }
                //编辑的时候会计期间方案和本位币是不可以修改
                that.props.form.setFormItemsDisabled('org',{'pk_accperiodscheme':true});
                that.props.form.setFormItemsDisabled('org',{'pk_currtype':true});

                //编辑的时候，如果选中的就是行政根节点，那么上级就不能编辑
                let adminroot = getDefData('haveadminrootorgunit',that.props.config.datasource);

                if(!adminroot.haveroot || pk_org == adminroot.pk){
                    //如果勾选的是根节点，则对应的设置根节点按钮不可以使用
                    that.props.form.setFormItemsDisabled('adminorg',{'pk_fatherorg':true});
                    that.props.form.setFormItemsRequired('adminorg',{'pk_fatherorg':false});
                }
                if(adminroot.haveroot && pk_org != adminroot.pk){
                    that.props.form.setFormItemsDisabled('adminorg',{'pk_fatherorg':false});
                    that.props.form.setFormItemsRequired('adminorg',{'pk_fatherorg':true});
                }
            }
        }else{
            //新增的时候需要把form清空，状态设置为edit
            that.props.config.orgtypearr.map((obj)=>{
                that.props.form.setFormStatus(obj.subGrid,'add');
                that.state.childstate[obj.subGrid] = false;
                that.props.form.EmptyAllFormValue(obj.subGrid);
                obj.isshow = false;
            })
            //自动生成编码
            ajax({
                url:'/nccloud/uapbd/org/getcode.do',
                data: {pk_org:pk_org,status:status}, 
                success:(res)=>{
                    if(res.success){     
                        if(res.data){
                            that.props.form.setFormItemsDisabled('org',{code:!res.data.isCodeEdit});
                            that.props.form.setFormItemsValue('org',{'code':{value:res.data.newCode,display:res.data.newCode}});
                        }
                    }
                }
            });

            let meta1 = that.props.meta.getMeta();
            let pk_fatherorgitem = meta1['org'].items.find((item) => item.attrcode == 'pk_fatherorg');
            //新增的时候，如果存在根节点，就把上级业务单元设置为必填项，否则设置为不可以编辑
            if(!getDefData('orgunit_haverootorgunit',that.props.config.datasource).haveroot){
                // pk_fatherorgitem.required = false;
                // pk_fatherorgitem.disabled = true;
                // that.props.meta.setMeta(meta1);
                that.props.form.setFormItemsDisabled('org',{'pk_fatherorg':true});
                that.props.form.setFormItemsRequired('org',{'pk_fatherorg':false});
            }else{
                that.props.form.setFormItemsDisabled('org',{'pk_fatherorg':false});
                that.props.form.setFormItemsRequired('org',{'pk_fatherorg':true});
                // pk_fatherorgitem.required = true;
                // pk_fatherorgitem.disabled = false;
                // that.props.meta.setMeta(meta1);
            }
            
            if(pk_org && pk_org != 'undefined'){
                //新增的时候，如果勾选了pk_org,需要把它作为他的上级
                that.props.form.setFormItemsValue('org',{'pk_fatherorg':{value:pk_org,display:getDefData('orgunit_name', that.config.datasource)}});
                //新增的时候，如果勾选了，需要把所属公司弄默认值
                ajax({
                    url:'/nccloud/uapbd/org/getcorpvo.do',
                    data: {pk_org:pk_org}, 
                    success:(res)=>{
                        if(res.success){
                            if(res.data){
                                that.props.form.setFormItemsValue('org',{'pk_corp':{value:res.data['pk_corp'],display:res.data['pk_corpname']}});
                                that.props.form.setFormItemsValue('org',{'pk_accperiodscheme':{value:res.data['pk_accperiodscheme'],display:res.data['pk_accperiodschemename']}});
                                that.props.form.setFormItemsValue('org',{'pk_currtype':{value:res.data['pk_currtype'],display:res.data['pk_currtypename']}});
                                that.props.form.setFormItemsValue('org',{'pk_exratescheme':{value:res.data['pk_exratescheme'],display:res.data['pk_exrateschemename']}});
                                setDefData('orgunit_pk_corpfatherorg',that.props.config.datasource,res.data['pk_corpfatherorg']);
                                setDefData('orgunit_pk_corpfatherorgname',that.props.config.datasource,res.data['pk_corpfatherorgname']);
                            }
                        }
                    }
                });
            }
            that.setState({
                buttonshow:true,
                showSubGrid:false
            })
        }
        //编辑态的时候需要根据规则判断编码是否可以修改
        if('edit' == status){
            ajax({
               url:'/nccloud/uapbd/org/getcode.do',
               data: {pk_org:pk_org,status:btnopr}, 
               success:(res)=>{
                   if(res.success){
                       if(res.data){
                        that.props.form.setFormItemsDisabled('org',{code:!res.data.isCodeEdit});
                        //that.props.form.setFormItemsValue('org',{'code':{value:res.data.newCode,display:res.data.newCode}});
                       }
                   }
               }
           });
       }
    }

    afterEvent1 =(props, moduleId, key,value, changedrows)=>{}

    beforeEvent=(props, moduleId, key,value, changedrows)=>{
        let that = this;
        let meta = this.props.meta.getMeta();
        var pk_org = props.getUrlParam('pk_org')
        var status = props.getUrlParam('status')
        if(undefined == pk_org){
            pk_org = getDefData('orgunit_pk_org', props.config.datasource);//cacheTools.get('orgunit_pk_org');
        }

        switch(key)
            {
                case 'orgtype6':
                                //开启的时候
                                if(!value.value){
                                    if(this.state.childstate.financeorg == false){
                                        toast({content: this.state.json['10100ORG-000035'], color: 'warning'});//默认top/* 国际化处理： 业务单元如需具有资金职能，则必须先具有财务职能！*/
                                        return false;
                                    }
                                }
                                
                                break;//资金
                case 'orgtype33':
                                //开启的时候
                                if(!value.value){
                                    if(this.state.childstate.plancenter == true){
                                        toast({content: this.state.json['10100ORG-000036'], color: 'warning'});//默认top/* 国际化处理： 一个业务单元不可同时具有计划中心职能和工厂职能！*/
                                        return false;
                                    };
                                    if(this.state.childstate.stockorg == false){
                                        toast({content: this.state.json['10100ORG-000037'], color: 'warning'});//默认top/* 国际化处理： 一个业务单元具有工厂职能必须同时具有库存职能！*/
                                        return false;
                                    };
                                }
                                
                                break;//工厂
                case 'orgtype5':
                                //关闭的时候
                                if(value.value){
                                    if(this.state.childstate.corp == true){
                                        toast({content: this.state.json['10100ORG-000038'], color: 'warning'});//默认top/* 国际化处理： 业务单元具有公司职能时，必须同时具有财务职能！*/
                                        return false;
                                    }
                                }
                                break;//财务
                case 'orgtype34':
                                if(!value.value){
                                    if(this.state.childstate.factory == true){
                                        toast({content: this.state.json['10100ORG-000036'], color: 'warning'});//默认top/* 国际化处理： 一个业务单元不可同时具有计划中心职能和工厂职能！*/
                                        return false;
                                    }
                                }
                                break;//计划中心
                case 'pk_fatherorg':
                                let btnopr = getDefData('orgunit_btnopr',props.config.datasource);
                                if(!('add' == status || 'copy' == btnopr)){
                                    //上级业务单元不能选自己
                                    let pk_fatherorg = meta['org'].items.find((item) => item.attrcode == 'pk_fatherorg');
                                    let pk_fatherorgcorp = meta['corp'].items.find((item) => item.attrcode == 'pk_fatherorg');
                                    let pk_fatherorghrorg = meta['hrorg'].items.find((item) => item.attrcode == 'pk_fatherorg');
                                    let pk_fatherorgsaleorg = meta['saleorg'].items.find((item) => item.attrcode == 'pk_fatherorg');
                                    let pk_fatherorgliability = meta['liabilitycenter'].items.find((item) => item.attrcode == 'pk_fatherorg');
                                    let pk_fatherorgadminorg = meta['adminorg'].items.find((item) => item.attrcode == 'pk_fatherorg');
                                    pk_fatherorg.queryCondition = function () {
                                        return {
                                            TreeRefActionExt: 'nccloud.web.org.orgunit.action.OrgPkFatherSQLBuilder,nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                            pk:pk_org,
                                            AppCode:props.config.appcode,
                                            orgtype:'org'
                                        }
                                    }
                                    pk_fatherorgcorp.queryCondition = function () {
                                        return {
                                            TreeRefActionExt: 'nccloud.web.org.orgunit.action.OrgPkFatherSQLBuilder,nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                            pk:pk_org,
                                            AppCode:props.config.appcode,
                                            orgtype:'corp'
                                        }
                                    }
                                    pk_fatherorghrorg.queryCondition = function () {
                                        return {
                                            TreeRefActionExt: 'nccloud.web.org.orgunit.action.OrgPkFatherSQLBuilder,nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                            pk:pk_org,
                                            AppCode:props.config.appcode,
                                            orgtype:'hrorg'
                                        }
                                    }
                                    pk_fatherorgsaleorg.queryCondition = function () {
                                        return {
                                            TreeRefActionExt: 'nccloud.web.org.orgunit.action.OrgPkFatherSQLBuilder,nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                            pk:pk_org,
                                            AppCode:props.config.appcode,
                                            orgtype:'saleorg'
                                        }
                                    }
                                    pk_fatherorgliability.queryCondition = function () {
                                        return {
                                            TreeRefActionExt: 'nccloud.web.org.orgunit.action.OrgPkFatherSQLBuilder,nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                            pk:pk_org,
                                            AppCode:props.config.appcode,
                                            orgtype:'liabilitycenter'
                                        }
                                    }
                                    pk_fatherorgadminorg.queryCondition = function () {
                                        return {
                                            TreeRefActionExt: 'nccloud.web.org.orgunit.action.OrgPkFatherSQLBuilder,nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                            pk:pk_org,
                                            AppCode:props.config.appcode,
                                            orgtype:'adminorg'
                                        }
                                    }
                                    that.props.meta.setMeta(meta); 
                                }
                                
                                break;//
                case 'istaxorg':
                    //开启的时候
                    if(value.value){
                        if(this.state.childstate.corp == true){
                            toast({content: this.state.json['10100ORG-000039'], color: 'warning'});//默认top/* 国际化处理： 法人公司必须具有税务职能！*/
                            return false;
                        }
                    }
                
                break;//资金
                default: return true;//只对职能区域按钮做编辑后事件，其他的先跳过
            }
        return true;
    }

    afterEvent =(props, moduleId, key,value, changedrows)=>{
        let that = this;
        let meta1 = that.props.meta.getMeta();
        let subGrid = 'org';
        var pk_org = that.props.getUrlParam('pk_org')
         //只要是为了保持org上职能按钮区域和各个职能模块上开启按钮保持一致，由于职能编码和各个职能按钮模块编码不一致，职能手动维护他们之间关系
        switch(key)
            {
                case 'orgtype2':
                                that.state.childstate.corp = value.value ;subGrid = 'corp';
                                if(value.value){
                                    //是法人公司，必须要有财务职能，关闭法人公司，不一定关闭财务职能
                                    that.state.childstate.financeorg = value.value ;
                                    that.props.form.setFormItemsValue('org',{'orgtype5':{value:value.value,display:null}}) ;
                                    //勾选法人之后，所属公司不能编辑
                                    // that.props.form.setFormItemsValue('org',{'pk_corp':{value:null,display:null}}) ;
                                    that.props.form.setFormItemsDisabled('org',{'pk_corp':true});//设置表单项不可用
                                    that.props.form.setFormItemsRequired('org',{'pk_corp':false});
                                }
                                if(!value.value){
                                    that.props.form.setFormItemsDisabled('org',{'pk_corp':false});//设置表单项不可用
                                    if(that.state.childstate.financeorg){
                                        //关闭法人，如果财务还在，那么所属公司必填
                                        that.props.form.setFormItemsRequired('org',{'pk_corp':true});
                                    }
                                }
                                break;//法人公司
                case 'orgtype4':
                                that.state.childstate.hrorg = value.value ; 
                                subGrid = 'hrorg';
                                break;//人力资源
                case 'orgtype5':   
                                that.state.childstate.financeorg = value.value ;
                                subGrid = 'financeorg'; 
                                if(value.value){
                                    //开启财务职能的时候，需要把库存的采购业务委托关系中的默认结算财务组织和默认应收组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'default2':true,'default1':true});//设置表单项不可用
                                    //开启财务职能的时候，需要把库存的所属财务组织为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':true});//设置表单项不可用
                                    //开启财务职能的时候，需要把销售的默认结算财务组织和默认应收组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'default2':true,'default1':true});//设置表单项不可用
                                    let pk_financeorg1 = meta1['stockorg'].items.find((item) => item.attrcode == 'pk_financeorg');
                                    pk_financeorg1.required = false;
                                    pk_financeorg1.disabled = true;  
                                    // if(that.state.childstate.corp == false){
                                    //     if(that.state.childstate.financeorg ){
                                    //         //勾选法人公司之后财务组织的税务组织必须勾选
                                    //         that.props.form.setFormItemsValue('financeorg',{'istaxorg':{value:false,display:false}});
                                    //     }
                                    // }
                                    //如果勾选了财务，但是没有勾选法人，那么所属公司是必填
                                    if(!that.state.childstate.corp){
                                        that.props.form.setFormItemsRequired('org',{'pk_corp':true});
                                    }
                                    
                                }else{
                                    //停用财务职能的时候，需要把库存的采购业务委托关系中的默认结算财务组织和默认应收组织设置为可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'default2':false,'default1':false});//设置表单项不可用
                                    //停用财务职能的时候，需要把库存的所属财务组织为可编辑
                                    that.props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':false});//设置表单项不可用
                                    if(that.state.childstate.financeorg ){
                                        //勾选法人公司之后财务组织的税务组织必须勾选
                                        that.props.form.setFormItemsValue('financeorg',{'istaxorg':{value:true,display:false}});
                                    }

                                    //停用财务职能的时候，需要把销售的默认结算财务组织和默认应收组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'default2':false,'default1':false});//设置表单项不可用
                                    let pk_financeorg2 = meta1['stockorg'].items.find((item) => item.attrcode == 'pk_financeorg');
                                    pk_financeorg2.required = true;
                                    pk_financeorg2.disabled = false; 
                                    //取消财务职能，所属公司改为非必填
                                    that.props.form.setFormItemsRequired('org',{'pk_corp':false});

                                }
                                break;//财务组织
                case 'orgtype6':
                                //开启的时候
                                if(value.value){
                                    if(that.state.childstate.financeorg == false){
                                        toast({content: this.state.json['10100ORG-000035'], color: 'warning'});//默认top/* 国际化处理： 业务单元如需具有资金职能，则必须先具有财务职能！*/
                                        return;
                                    }
                                }
                                
                                that.state.childstate.fundorg = value.value ;
                                subGrid = 'fundorg'; break;//资金
                case 'orgtype7':
                                that.state.childstate.purchaseorg = value.value ;
                                subGrid = 'purchaseorg'; 
                                if(value.value){
                                    //开启采购职能的时候，需要把库存的采购业务委托关系中的默认采购组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //停用采购职能的时候，需要把库存的采购业务委托关系中的默认采购组织设置为可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'target':false});//设置表单项不可用
                                }
                                break;//采购
                case 'orgtype8':
                                that.state.childstate.saleorg = value.value ; 
                                subGrid = 'saleorg';
                                if(value.value){
                                    //开启销售职能的时候，需要把表头使用零售设置为可编辑
                                    that.props.form.setFormItemsDisabled('org',{'isretail':false});//设置表单项不可用
                                }else{
                                    //停用销售职能的时候，需要把表头使用零售设置为不可编辑
                                    that.props.form.setFormItemsDisabled('org',{'isretail':true});//设置表单项不可用
                                    that.props.form.setFormItemsValue('org',{'isretail':{value:null,display:null}});
                                }


                                //如果库存职能已经启用，需要把维修库存委托关系设置为不可编辑
                                if(that.state.childstate.stockorg){
                                     //开启库存职能的时候，需要把销售的默认库存组织设置为不可编辑
                                     that.props.form.setFormItemsDisabled('saleorgrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //开启库存职能的时候，需要把销售的默认库存组织设置为可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'target':false});//设置表单项可用
                                }
                                //如果财务组织已经启用，需要把财务相关的委托关系设置为不可编辑
                                if(that.state.childstate.financeorg){
                                    //开启财务职能的时候，需要把销售的默认结算财务组织和默认应收组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'default2':true,'default1':true});//设置表单项不可用
                                }else{
                                    //开启财务职能的时候，需要把销售的默认结算财务组织和默认应收组织设置为可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'default2':false,'default1':false});//设置表单项可用
                                }
                                //如果利润中心职能已经启用，需要把采购业务委托关系中的默认利润中心设置为不可编辑
                                if(that.state.childstate.liabilitycenter){
                                    //开启利润中心职能的时候，需要把销售的默认利润中心设置为不可编辑
                                    // that.props.form.setFormItemsDisabled('saleorgrelation',{'default3':true});//设置表单项不可用
                                }else{
                                    //开启利润中心职能的时候，需要把销售的默认利润中心设置为可编辑
                                    // that.props.form.setFormItemsDisabled('saleorgrelation',{'default3':false});//设置表单项可用
                                }
                                break;//销售
                case 'orgtype9':
                                that.state.childstate.stockorg = value.value ; 
                                subGrid = 'stockorg';
                                if(value.value){
                                    //开启库存职能的时候，需要把维修的维修库存业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('maintainstockrelation',{'target':true});//设置表单项不可用
                                    //开启库存职能的时候，需要把项目的项目库存业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('itemstockrelation',{'target':true});//设置表单项不可用
                                    //开启库存职能的时候，需要把销售的默认库存组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'target':true});//设置表单项不可用
                                    //开启销售职能的时候，需要把表头使用零售设置为可编辑
                                    that.props.form.setFormItemsDisabled('org',{'isretail':false});//设置表单项不可用
                                }else{
                                    //停用库存职能的时候，需要把项目的项目库存业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('maintainstockrelation',{'target':false});//设置表单项不可用
                                     //停用库存职能的时候，需要把项目的项目库存业务委托关系设置为可编辑
                                     that.props.form.setFormItemsDisabled('itemstockrelation',{'target':false});//设置表单项不可用
                                     //停用库存职能的时候，需要把销售的默认库存组织设置为可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'target':false});//设置表单项不可用
                                    //停用销售职能的时候，需要把表头使用零售设置为不可编辑
                                    that.props.form.setFormItemsDisabled('org',{'isretail':true});//设置表单项不可用
                                    that.props.form.setFormItemsValue('org',{'isretail':{value:null,display:null}});
                                }

                                let pk_financeorg1 = meta1['stockorg'].items.find((item) => item.attrcode == 'pk_financeorg');
                                //如果财务组织已经启用，需要把财务相关的委托关系设置为不可编辑
                                if(that.state.childstate.financeorg){
                                    //开启财务职能的时候，需要把库存的采购业务委托关系中的默认结算财务组织和默认应收组织设置为不可编辑
                                    
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'default2':true,'default1':true});//设置表单项不可用
                                    //开启财务职能的时候，需要把库存的所属财务组织为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':true});//设置表单项不可用
                                    pk_financeorg1.required = false;
                                    pk_financeorg1.disabled = true;  
                                }else{
                                    //开启财务职能的时候，需要把库存的采购业务委托关系中的默认结算财务组织和默认应收组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'default2':false,'default1':false});//设置表单项不可用
                                    //开启财务职能的时候，需要把库存的所属财务组织为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':false});//设置表单项不可用
                                    pk_financeorg1.required = true;
                                    pk_financeorg1.disabled = false; 
                                }
                                 //如果质检职能已经启用，需要把质检业务委托关系设置为不可编辑
                                 if(that.state.childstate.qccenter){
                                    //开启质检职能的时候，需要把库存的质检业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockqccenterrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //开启质检职能的时候，需要把库存的质检业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('stockqccenterrelation',{'target':false});//设置表单项可用
                                }
                                //如果利润中心职能已经启用，需要把采购业务委托关系中的默认利润中心设置为不可编辑
                                if(that.state.childstate.liabilitycenter){
                                    //开启利润中心职能的时候，需要把库存的采购业务委托关系中的默认利润中心设置为不可编辑
                                    // that.props.form.setFormItemsDisabled('stockorgrelation',{'default3':true});//设置表单项不可用
                                }else{
                                    //开启利润中心职能的时候，需要把库存的采购业务委托关系中的默认利润中心设置为可编辑
                                    // that.props.form.setFormItemsDisabled('stockorgrelation',{'default3':false});//设置表单项可用
                                }
                                //如果物流职能已经启用，需要把物流业务委托关系设置为不可编辑
                                if(that.state.childstate.trafficorg){
                                    //开启物流职能的时候，需要把库存的物流业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stocktrafficrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //开启物流职能的时候，需要把库存的物流业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('stocktrafficrelation',{'target':false});//设置表单项可用
                                }
                                //如果资产职能已经启用，需要把资产库存业务委托关系设置为不可编辑
                                if(that.state.childstate.assetorg){
                                    //开启资产职能的时候，需要把库存的资产库存业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockassetrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //开启资产职能的时候，需要把库存的资产库存业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('stockassetrelation',{'target':false});//设置表单项可用
                                }
                                //如果采购职能已经启用，需要把采购业务委托关系中的默认采购组织设置为不可编辑
                                if(that.state.childstate.purchaseorg){
                                    //开启采购职能的时候，需要把库存的采购业务委托关系中的默认采购组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //开启采购职能的时候，需要把库存的采购业务委托关系中的默认采购组织设置为可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'target':false});//设置表单项可用
                                }
                                break;//库存
                case 'orgtype10':
                                that.state.childstate.trafficorg = value.value ;
                                subGrid = 'trafficorg'; 
                                if(value.value){
                                    //开启物流职能的时候，需要把库存的物流业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stocktrafficrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //开启物流职能的时候，需要把库存的物流业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('stocktrafficrelation',{'target':false});//设置表单项不可用
                                }
                                
                                break;//物流
                case 'orgtype11':
                                that.state.childstate.qccenter = value.value ; 
                                subGrid = 'qccenter';
                                if(value.value){
                                    //开启质检职能的时候，需要把库存的质检业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockqccenterrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //停用质检职能的时候，需要把库存的质检业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('stockqccenterrelation',{'target':false});//设置表单项不可用
                                }
                                break;//质检
                case 'orgtype12':  
                                that.state.childstate.assetorg = value.value ;
                                subGrid = 'assetorg'; 
                                if(value.value){
                                    //开启资产职能的时候，需要把库存的资产库存业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockassetrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //停用资产职能的时候，需要把库存的资产库存业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('stockassetrelation',{'target':false});//设置表单项不可用
                                }
                                break;//资产
                case 'orgtype14':
                                that.state.childstate.maintainorg = value.value ; 
                                subGrid = 'maintainorg';
                                if(value.value){
                                    //开启维修职能的时候，需要把资产的资产维修业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('assetorgmaintainrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //停用维修职能的时候，需要把资产的资产维修业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('assetorgmaintainrelation',{'target':false});//设置表单项不可用
                                }
                                // //如果库存职能已经启用，需要把维修库存委托关系设置为不可编辑
                                if(that.state.childstate.stockorg){
                                     //开启库存职能的时候，需要把维修的维修库存业务委托关系设置为不可编辑
                                     that.props.form.setFormItemsDisabled('maintainstockrelation',{'target':true});//设置表单项不可用
                                    //开启采购职能的时候，需要把库存的采购业务委托关系中的默认采购组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('assetorgmaintainrelation',{target:true});//设置表单项不可用
                                }else{
                                    //开启采购职能的时候，需要把库存的采购业务委托关系中的默认采购组织设置为可编辑
                                    that.props.form.setFormItemsDisabled('assetorgmaintainrelation',{target:false});//设置表单项可用
                                    //开启库存职能的时候，需要把维修的维修库存业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('maintainstockrelation',{'target':false});//设置表单项不可用
                                }
                                break;//维修
                case 'orgtype15':
                                that.state.childstate.liabilitycenter = value.value ;
                                subGrid = 'liabilitycenter'; 
                                // if(value.value){
                                //     //开启利润中心职能的时候，需要把库存的采购业务委托关系中的默认利润中心设置为不可编辑
                                //     that.props.form.setFormItemsDisabled('stockorgrelation',{'default3':true});//设置表单项不可用
                                //     //开启利润中心职能的时候，需要把销售的默认利润中心设置为不可编辑
                                //     that.props.form.setFormItemsDisabled('saleorgrelation',{'default3':true});//设置表单项不可用
                                // }else{
                                //     //停用利润中心职能的时候，需要把库存的采购业务委托关系中的默认利润中心设置为可编辑
                                //     that.props.form.setFormItemsDisabled('stockorgrelation',{'default3':false});//设置表单项不可用
                                //     //停用利润中心职能的时候，需要把销售的默认利润中心设置为不可编辑
                                //     that.props.form.setFormItemsDisabled('saleorgrelation',{'default3':false});//设置表单项不可用
                                // }
                                break;//利润中心
                case 'orgtype16':
                                that.state.childstate.itemorg = value.value ; 
                                subGrid = 'itemorg';
                                //如果库存职能已经启用，需要把维修库存委托关系设置为不可编辑
                                if(that.state.childstate.stockorg){
                                    //开启库存职能的时候，需要把项目的项目库存业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('itemstockrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //开启库存职能的时候，需要把项目的项目库存业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('itemstockrelation',{'target':false});//设置表单项可用
                                }
                                break;//项目
                case 'orgtype17':
                                that.state.childstate.planbudget = value.value ; 
                                subGrid = 'planbudget';
                                break;//预算
                case 'orgtype29':
                                that.state.childstate.adminorg = value.value ;
                                //如果是根节点行政组织，就设置为非必填项
                                if(!getDefData('haveadminrootorgunit',props.config.datasource).haveroot){
                                    that.props.form.setFormItemsRequired('adminorg',{'pk_fatherorg':false});
                                    that.props.form.setFormItemsDisabled('adminorg',{'pk_fatherorg':true});
                                }else{
                                    that.props.form.setFormItemsRequired('adminorg',{'pk_fatherorg':true});
                                    that.props.form.setFormItemsDisabled('adminorg',{'pk_fatherorg':false});
                                }
                                subGrid = 'adminorg'; 
                                break;//行政
                case 'orgtype33':
                                //开启的时候
                                if(value.value){
                                    if(that.state.childstate.keyplancenter == true){
                                        toast({content: this.state.json['10100ORG-000036'], color: 'warning'});//默认top/* 国际化处理： 一个业务单元不可同时具有计划中心职能和工厂职能！*/
                                        return;
                                    };
                                }
                                that.state.childstate.factory = value.value ; subGrid = 'factory';break;//工厂
                case 'orgtype34':
                                //开启的时候
                                if(value.value){
                                    if(that.state.childstate.factory == true){
                                        toast({content: this.state.json['10100ORG-000036'], color: 'warning'});//默认top/* 国际化处理： 一个业务单元不可同时具有计划中心职能和工厂职能！*/
                                        return;
                                    }
                                }
                                that.state.childstate.plancenter = value.value ; subGrid = 'plancenter';break;//计划中心
                case 'issettlecenter':
                                //资金职能下 结算中心开启的时候
                                if(value.value && that.state.childstate.fundorg){
                                    that.props.form.setFormItemsValue('fundorg',{'isfinancecorp':{value:false,display:null}})
                                }else{
                                    if(that.state.childstate.fundorg){
                                        that.props.form.setFormItemsValue('fundorg',{'isfinancecorp':{value:true,display:null}})
                                    } 
                                }
                                break;
                case 'isfinancecorp':
                                //资金职能下 财务公司开启的时候
                                if(value.value && that.state.childstate.fundorg){
                                    that.props.form.setFormItemsValue('fundorg',{'issettlecenter':{value:false,display:null}})
                                }else{
                                    if(that.state.childstate.fundorg){
                                        that.props.form.setFormItemsValue('fundorg',{'issettlecenter':{value:true,display:null}})
                                    }
                                }
                                break;
                case 'pk_address':
                                //选择地点参照，默认带出所属地区参照
                                ajax({
                                    url:'/nccloud/uapbd/org/getpkarea.do',
                                    data: {pk:value.refpk}, 
                                    success:(res)=>{
                                        if(res.success){     
                                            if(res.data){
                                                that.props.form.setFormItemsValue('stockorg',{'pk_areacl':{value:res.data.pk,display:res.data.name}});
                                            }
                                        }
                                    }
                                });
                                break;
            case 'reportconfirm':
                                //集团内只能有一个报表组织
                                if(value.value){
                                    ajax({
                                        url: '/nccloud/uapbd/org/checkreportconfirm.do',
                                        data: {pk_org:pk_org},
                                        success: (res) => {
                                            if (res.success) {
                                                if(res.data){
                                                    toast({content: this.state.json['10100ORG-000040'], color: 'warning'});//默认top/* 国际化处理： 集团内只能有一个报表确认组织！*/
                                                    that.props.form.setFormItemsValue('org',{'reportconfirm':{value:false,display:null}});
                                                    return false;
                                                }
                                            }
                                        }
                                    })
                                }
                                
                                break;//资金
                default: ;//只对职能区域按钮做编辑后事件，其他的先跳过
            }
            //主要是控制各个职能form上开启状态和一些校验
            that.props.meta.setMeta(meta1); 
            
            that.setState({
                childstate:that.state.childstate
            },()=>{
                if(that.state.childstate.corp){
                    if(that.state.childstate.financeorg ){
                        //勾选法人公司之后财务组织的税务组织必须勾选
                        that.props.form.setFormItemsValue('financeorg',{'istaxorg':{value:true,display:false}});
                        //当法人公司和财务职能都勾选时，财务职能的缴税税种字段可编辑，委托税种字段不可编辑
                        that.props.form.setFormItemsDisabled('financeorg',{'paytaxcates':false});//缴税税种
                        that.props.form.setFormItemsDisabled('financeorg',{'authorizedtaxcates':true});//委托税种
                    }
                    //当法人的上级公司为空时，需要给默认值
                    if(!that.props.form.getFormItemsValue('corp','pk_fatherorg').value){
                        //上级公司默认值赋值
                        that.props.form.setFormItemsValue('corp',{'pk_fatherorg':{value:getDefData('orgunit_pk_corpfatherorg',that.props.config.datasource),display:getDefData('orgunit_pk_corpfatherorgname',that.props.config.datasource)}});
                    }
                    
                }
                if(!that.state.childstate.corp ){
                    if(that.state.childstate.financeorg){
                        if(key =='orgtype5'){
                            //勾选法人公司之后财务组织的税务组织必须勾选
                            that.props.form.setFormItemsValue('financeorg',{'istaxorg':{value:false,display:false}});
                        }
                        if(that.props.form.getFormItemsValue('financeorg','istaxorg').value){
                            //不勾选税务组织时，缴税税种和委托税种字段不可编辑；当勾选税务组织时，缴税税种和委托税种字段可编辑
                            that.props.form.setFormItemsDisabled('financeorg',{'paytaxcates':false});//缴税税种
                            that.props.form.setFormItemsDisabled('financeorg',{'authorizedtaxcates':false});//委托税种
                        }else{
                            that.props.form.setFormItemsDisabled('financeorg',{'paytaxcates':true});//缴税税种
                            that.props.form.setFormItemsDisabled('financeorg',{'authorizedtaxcates':true});//委托税种
                        }
                        
                    }
                }
                
            });

            that.showOffChange(subGrid,value.value)
            
    }

    //通过单据id查询单据信息
    getdata = (pk) =>{
        let that = this;
        let status = this.props.getUrlParam('status');
        var btnopr = getDefData('orgunit_btnopr', that.config.datasource);
        //先从缓存里面读取数据，如果有，直接返回
        let carddata = getDefData('orgunit_carddata_'+pk,this.props.config.datasource);

        let meta1 = that.props.meta.getMeta();
        
        let pk_fatherorgitem = {};
        //有些操作，由于ts太多（保存form最多会有27个），所以没有更新，就设置这个标志，下次查询的时候强制走查询，不走缓存
        let needquerydata = getDefData('orgunit_needquerydata_'+pk,this.props.config.datasource);
        if(carddata && !needquerydata){
            let depptcarddata = JSON.parse(JSON.stringify(carddata));
            let formvalue = {};
            depptcarddata.forEach((obj) =>{
                if(obj.hasOwnProperty('org')){
                    if(!(status == 'add' ||  status == 'edit'|| btnopr == 'copy')){
                        //控制表头的停用启用
                        toggleShow(that.props,obj.org.rows[0].values.enablestate.value)
                    }
                }
                console.log(Object.keys(obj)[3]);
                let objPagecode = '';
                Object.keys(obj).map((nba)=>{
                    if(obj[nba] != null && obj[nba] != undefined){
                        objPagecode = nba
                    }
                })
                that.toggleButtonShow(that.props,obj[objPagecode].rows[0].values.enablestate.value,objPagecode);
                formvalue[objPagecode] = obj[objPagecode];
            })
            //form表单批量赋值setAllFormValue（{area1:data1,area2:data2}）
            
            that.setState({
                buttonshow:true
            },()=>{
                that.props.form.setAllFormValue(formvalue);
            })

            if(btnopr == 'copy' ){
                //复制的时候需要把表头主键清空
                //that.props.form.setFormItemsValue('org',{'pk_org':{value:null,display:null}})
                that.props.form.setFormItemsValue('org',{'pk_org':{value:null,display:null},
                                                                 'innercode':{value:null,display:null},
                                                                 'code':{value:null,display:null},
                                                                 'name':{value:null,display:null},'name2':{value:null,display:null},'name3':{value:null,display:null},
                                                                 'shortname':{value:null,display:null},'shortname2':{value:null,display:null},'shortname3':{value:null,display:null}});
                //如果上级组织为空，说明为根节点，n那么修改的时候需要把上级组织设置为非必填 pk_fatherorg.display == undefined || pk_fatherorg.display == ''
                // pk_fatherorgitem = meta1['org'].items.find((item) => item.attrcode == 'pk_fatherorg');
                // pk_fatherorgitem.required = true;
                // pk_fatherorgitem.disabled = false;
                // that.props.meta.setMeta(meta1);
                that.props.form.setFormItemsDisabled('org',{'pk_fatherorg':false});
                that.props.form.setFormItemsRequired('org',{'pk_fatherorg':true});
                //自动生成编码
                ajax({
                    url:'/nccloud/uapbd/org/getcode.do',
                    data: {pk_org:pk,status:status}, 
                    success:(res)=>{
                        if(res.success){     
                            if(res.data){
                                that.props.form.setFormItemsDisabled('org',{code:!res.data.isCodeEdit});
                                that.props.form.setFormItemsValue('org',{'code':{value:res.data.newCode,display:res.data.newCode}});
                            }
                        }
                    }
                });
            }

            //取消的时候，需要把职能和楼层信息还原到修改前状态
            if('cancel' == getDefData('orgunit_btnopr',that.props.config.datasource)){
                that.state.childstate = JSON.parse(JSON.stringify(getDefData('orgunit_childstate', that.props.config.datasource)));
                that.state.orgtypefloor = JSON.parse(JSON.stringify(getDefData('orgunit_orgtypefloor', that.props.config.datasource)));
            };
            
            if('edit' == status || 'browse' == status){
                //给已经勾选职能的switch赋值,由于后台转换的时候，不能够把职能的相关信息成功转换，所以只能先手动维护，后期有时间再去是否去掉
                that.props.form.setFormItemsValue('org',{
                    'orgtype2':{value:that.state.childstate.corp,display:null},
                    'orgtype4':{value:that.state.childstate.hrorg,display:null},
                    'orgtype5':{value:that.state.childstate.financeorg,display:null},
                    'orgtype6':{value:that.state.childstate.fundorg,display:null},
                    'orgtype7':{value:that.state.childstate.purchaseorg,display:null},
                    'orgtype8':{value:that.state.childstate.saleorg,display:null},
                    'orgtype9':{value:that.state.childstate.stockorg,display:null},
                    'orgtype10':{value:that.state.childstate.trafficorg,display:null},
                    'orgtype11':{value:that.state.childstate.qccenter,display:null},
                    'orgtype12':{value:that.state.childstate.assetorg,display:null},
                    'orgtype14':{value:that.state.childstate.maintainorg,display:null},
                    'orgtype15':{value:that.state.childstate.liabilitycenter,display:null},
                    'orgtype16':{value:that.state.childstate.itemorg,display:null},
                    'orgtype17':{value:that.state.childstate.planbudget,display:null},
                    'orgtype29':{value:that.state.childstate.adminorg,display:null},
                    'orgtype33':{value:that.state.childstate.factory,display:null},
                    'orgtype34':{value:that.state.childstate.plancenter,display:null}});
            }
            if(status != 'browse'){
                //复制的时候，法人的上级公司不清空
                let corpfaterorg  = that.props.form.getFormItemsValue('corp','pk_fatherorg');
                that.props.config.orgtypearr.map((obj)=>{
                    that.props.form.setFormStatus(obj.subGrid,'edit');
                 //清空职能信息
                
                 if('copy' == btnopr && 'org' != obj.subGrid){
                    that.props.form.EmptyAllFormValue(obj.subGrid);
                 }
                })

                if('copy' == btnopr){
                    if(that.state.childstate.corp){
                        //复制的时候，法人的上级公司不清空
                        that.props.form.setFormItemsValue('corp',{'pk_fatherorg':{value:corpfaterorg.value,display:corpfaterorg.display}});
                    }
                    
                }
                
                //如果上级组织为空，说明为根节点，n那么修改的时候需要把上级组织设置为非必填
                let pk_fatherorg = that.props.form.getFormItemsValue('org','pk_fatherorg');
                if((pk_fatherorg.display == undefined || pk_fatherorg.display == '') && ('copy' != getDefData('orgunit_btnopr', that.config.datasource))){
                    
                    // pk_fatherorgitem = meta1['org'].items.find((item) => item.attrcode == 'pk_fatherorg');
                    // pk_fatherorgitem.required = false;
                    // pk_fatherorgitem.disabled = true;
                    // that.props.meta.setMeta(meta1);
                    that.props.form.setFormItemsDisabled('org',{'pk_fatherorg':true});
                    that.props.form.setFormItemsRequired('org',{'pk_fatherorg':false});
                    
                }
                that.props.form.setFormStatus('org','edit');
            }else{
                //浏览态设置为不可编辑
                that.props.config.orgtypearr.map((obj)=>{
                    that.props.form.setFormStatus(obj.subGrid,'browse');
                })
            }
            that.setState({
                title_code:''
            });
            if('refresh' == btnopr){
                toast({title:that.state.json['10100ORG-000041'],color:"success"});/* 国际化处理： 刷新成功！*/
                setDefData('orgunit_btnopr', that.config.datasource,'browse');
            }
            //卡片界面翻页之后，内部客商的默认数据需要更新
            setDefData('orgunit_code', that.props.config.datasource, formvalue["org"].rows[0].values.code.value);
            setDefData('orgunit_name', that.props.config.datasource, formvalue["org"].rows[0].values.name.value);
            setDefData('orgunit_shortname', that.props.config.datasource, formvalue["org"].rows[0].values.shortname.value);

            return ;
        }
        
        //前面是走缓存，后面是查询数据库
        let data = {
            pk_org:pk,btnopr:btnopr
        };
        ajax({
            url: queryorgunitUrl,
            data:data,
            success: (res) => {
                if(res.data){
                    console.log(res.data)
                    let formvalue1 = {};
                    res.data.forEach((obj) =>{
                        if(obj.hasOwnProperty('org')){
                            if(!(status == 'add' ||  status == 'edit'|| btnopr == 'copy')){
                                //控制表头的停用启用
                                toggleShow(that.props,obj.org.rows[0].values.enablestate.value)
                            }
                        }

                        //console.log(Object.keys(obj));
                        // console.log(Object.keys(obj)[3]);
                        // let objPagecode = Object.keys(obj)[3];
                        let objPagecode = '';
                        Object.keys(obj).map((nba)=>{
                            if(obj[nba] != null && obj[nba] != undefined){
                                objPagecode = nba
                            }
                        })

                        that.toggleButtonShow(that.props,obj[objPagecode].rows[0].values.enablestate.value,objPagecode);

                        formvalue1[objPagecode] = obj[objPagecode];
                        //that.props.form.setAllFormValue({[objPagecode]:obj[objPagecode]});
                    })
                    // 
                    // that.props.form.setAllFormValue(formvalue1);
                    // //form赋值完之后，在显示按钮
                    // that.setState({
                    //     buttonshow:true
                    // })
                    that.setState({
                        buttonshow:true
                    },()=>{
                        //form表单批量赋值setAllFormValue（{area1:data1,area2:data2}）
                        that.props.form.setAllFormValue(formvalue1);
                    })
                    if(btnopr == 'copy' ){
                        //复制的时候需要把表头主键清空
                        that.props.form.setFormItemsValue('org',{'pk_org':{value:null,display:null},
                                                                 'innercode':{value:null,display:null},
                                                                 'code':{value:null,display:null},
                                                                 'name':{value:null,display:null},'name2':{value:null,display:null},'name3':{value:null,display:null},
                                                                 'shortname':{value:null,display:null},'shortname2':{value:null,display:null},'shortname3':{value:null,display:null}});
                        //如果上级组织为空，说明为根节点，n那么修改的时候需要把上级组织设置为非必填 pk_fatherorg.display == undefined || pk_fatherorg.display == ''
                        // pk_fatherorgitem = meta1['org'].items.find((item) => item.attrcode == 'pk_fatherorg');
                        // pk_fatherorgitem.required = true;
                        // pk_fatherorgitem.disabled = false;
                        // that.props.meta.setMeta(meta1);
                        that.props.form.setFormItemsDisabled('org',{'pk_fatherorg':false});
                        that.props.form.setFormItemsRequired('org',{'pk_fatherorg':true});
                        //自动生成编码
                        ajax({
                            url:'/nccloud/uapbd/org/getcode.do',
                            data: {pk_org:pk,status:status}, 
                            success:(res)=>{
                                if(res.success){     
                                    if(res.data){
                                        that.props.form.setFormItemsDisabled('org',{code:!res.data.isCodeEdit});
                                        that.props.form.setFormItemsValue('org',{'code':{value:res.data.newCode,display:res.data.newCode}});
                                    }
                                }
                            }
                        });
                    }
                     //取消的时候，需要把职能和楼层信息还原到修改前状态
                    if('cancel' == getDefData('orgunit_btnopr',that.props.config.datasource)){
                        that.state.childstate = JSON.parse(JSON.stringify(getDefData('orgunit_childstate', that.props.config.datasource)));
                        that.state.orgtypefloor = JSON.parse(JSON.stringify(getDefData('orgunit_orgtypefloor', that.props.config.datasource)));
                    };
                    if('edit' == status || 'browse' == status){
                        //给已经勾选职能的switch赋值,由于后台转换的时候，不能够把职能的相关信息成功转换，所以只能先手动维护，后期有时间再去是否去掉
                        that.props.form.setFormItemsValue('org',{
                            'orgtype2':{value:that.state.childstate.corp,display:null},
                            'orgtype4':{value:that.state.childstate.hrorg,display:null},
                            'orgtype5':{value:that.state.childstate.financeorg,display:null},
                            'orgtype6':{value:that.state.childstate.fundorg,display:null},
                            'orgtype7':{value:that.state.childstate.purchaseorg,display:null},
                            'orgtype8':{value:that.state.childstate.saleorg,display:null},
                            'orgtype9':{value:that.state.childstate.stockorg,display:null},
                            'orgtype10':{value:that.state.childstate.trafficorg,display:null},
                            'orgtype11':{value:that.state.childstate.qccenter,display:null},
                            'orgtype12':{value:that.state.childstate.assetorg,display:null},
                            'orgtype14':{value:that.state.childstate.maintainorg,display:null},
                            'orgtype15':{value:that.state.childstate.liabilitycenter,display:null},
                            'orgtype16':{value:that.state.childstate.itemorg,display:null},
                            'orgtype17':{value:that.state.childstate.planbudget,display:null},
                            'orgtype29':{value:that.state.childstate.adminorg,display:null},
                            'orgtype33':{value:that.state.childstate.factory,display:null},
                            'orgtype34':{value:that.state.childstate.plancenter,display:null}});
                    }
                    if(status != 'browse'){
                        //复制的时候，法人的上级公司不清空
                        let corpfaterorg1  = that.props.form.getFormItemsValue('corp','pk_fatherorg');
                        that.props.config.orgtypearr.map((obj)=>{
                            that.props.form.setFormStatus(obj.subGrid,'edit');
                         //清空职能信息
                         if('copy' == btnopr && 'org' != obj.subGrid){
                            that.props.form.EmptyAllFormValue(obj.subGrid);
                         }
                        })

                        if('copy' == btnopr){
                            if(that.state.childstate.corp){
                                //复制的时候，法人的上级公司不清空
                                that.props.form.setFormItemsValue('corp',{'pk_fatherorg':{value:corpfaterorg1.value,display:corpfaterorg1.display}});
                            }
                            
                        }
                        
                        //如果上级组织为空，说明为根节点，n那么修改的时候需要把上级组织设置为非必填
                        let pk_fatherorg = that.props.form.getFormItemsValue('org','pk_fatherorg');
                        if((pk_fatherorg.display == undefined || pk_fatherorg.display == '') && ('copy' != getDefData('orgunit_btnopr', that.config.datasource))){
                    
                            // pk_fatherorgitem = meta1['org'].items.find((item) => item.attrcode == 'pk_fatherorg');
                            // pk_fatherorgitem.required = false;
                            // pk_fatherorgitem.disabled = true;
                            // that.props.meta.setMeta(meta1);
                            that.props.form.setFormItemsDisabled('org',{'pk_fatherorg':true});
                            that.props.form.setFormItemsRequired('org',{'pk_fatherorg':false});
                        }
                        that.props.form.setFormStatus('org','edit');
                    }else{
                        //浏览态设置为不可编辑
                        that.props.config.orgtypearr.map((obj)=>{
                            that.props.form.setFormStatus(obj.subGrid,'browse');
                        })
                    }
                    //由于复制的时候,清除了主键，所有复制的时候不缓存数据
                    if(getDefData('orgunit_btnopr',that.props.config.datasource) != 'copy'){
                        //缓存卡片界面数据，下次进来的时候可以从缓存中读取数据
                        setDefData('orgunit_carddata_'+pk,that.props.config.datasource,res.data);
                        //更新完最新的缓存之后，下次操作就可以直接走缓存，不用走ajax了
                        setDefData('orgunit_needquerydata_'+pk,this.props.config.datasource,false);
                    }
                    //重新渲染一下界面
                    that.setState({
                        title_code:''
                    });
                    if('refresh' == btnopr){
                        toast({title:that.state.json['10100ORG-000041'],color:"success"});/* 国际化处理： 刷新成功！*/
                        setDefData('orgunit_btnopr', that.config.datasource,'browse');
                    }
                    //卡片界面翻页之后，内部客商的默认数据需要更新
                    setDefData('orgunit_code', that.props.config.datasource, formvalue1["org"].rows[0].values.code.value);
                    setDefData('orgunit_name', that.props.config.datasource, formvalue1["org"].rows[0].values.name.value);
                    setDefData('orgunit_shortname', that.props.config.datasource, formvalue1["org"].rows[0].values.shortname.value);
                }
            }
        });  
    }

    //版本化
    onSaveVersion = () =>{
        let	pk = this.props.getUrlParam('pk_org');
        let formdata = this.props.form.getAllFormValue('org_v_head');
        let that = this;
        ajax({
            url: '/nccloud/uapbd/org/saveorgversion.do',
            data: formdata,
            success: (res) => {
                if (res.success) {
                    //版本化之后刷新界面
                    setDefData('orgunit_needquerydata_'+pk,that.props.config.datasource,true);
                    that.onRefresh();
                    toast({title : that.state.json['10100ORG-000042'],color : 'success'});/* 国际化处理： 版本化成功！*/
                }
            }
        })
    }

    //财务组织版本化
    onSaveFinanceVersion = () =>{
        //版本化的时候确认版本的是哪一个1：财务组织体系版本化 2：利润中心体系版本化 3：人力资源组织体系版本化4：行政组织体系版本化
        let	pk = this.props.getUrlParam('pk_org');
        let type = getDefData('orgunit_versiontype', this.config.datasource);//cacheTools.get('orgunit_versiontype');
        let modalid = getDefData('orgunit_modalid', this.config.datasource);//cacheTools.get('orgunit_modalid');
        let form = this.props.form.getAllFormValue('financeorg_v');
        let that = this;
        ajax({
            url: '/nccloud/uapbd/org/savefinanceversion.do',
            data: {form,type:type},
            success: (res) => {
                if (res.success) {
                    //版本化之后刷新界面
                    setDefData('orgunit_needquerydata_'+pk,that.props.config.datasource,true);
                    that.onRefresh();
                    if(1==type){
                        toast({title : that.state.json['10100ORG-000043'],color : 'success'});/* 国际化处理： 财务组织版本化成功！*/
                    }
                    if(2==type){
                        toast({title : that.state.json['10100ORG-000044'],color : 'success'});/* 国际化处理： 利润中心体系版本化成功！*/
                    }
                    if(3==type){
                        toast({title : that.state.json['10100ORG-000045'],color : 'success'});/* 国际化处理： 人力资源组织体系版本化成功！*/
                    }
                    if(4==type){
                        toast({title : that.state.json['10100ORG-000046'],color : 'success'});/* 国际化处理： 行政组织体系版本化成功！*/
                    }
                    that.props.modal.close(modalid);
                }
            }
        })
    }
   
    //显示停用数据
	showOffChange(subGrid,value){
        let that = this;
        let status = this.props.getUrlParam('status');
        
        if('browse' == status){
            return ;
        }     

        let flooradjust = [];
        let neworgtype = [];
        //开启职能
        if(value==true){
            that.props.form.setFormStatus(subGrid,"add");
            //用户加载职能楼层，如果存在就添加-----修改为开启就添加，关闭就删除
            that.config.orgtypearr.map((obj =>{
                if(obj.subGrid == subGrid){
                    obj.isshow = value;
                    //保存新增的职能
                    that.state.increaseorgtype.push(obj);
                    //楼层新增就添加，关闭就删除
                    that.state.orgtypefloor.push(obj);
                }
                if(obj.subGrid == 'financeorg' && subGrid == 'corp' && !obj.isshow){
                    //法人公司开启。,如果财务没有开启，财务必须开启
                    obj.isshow = value;
                    that.props.form.setFormStatus("financeorg","add");
                    that.state.orgtypefloor.push(obj);
                }
                //加载楼层的时候需要按照初始状态调整，所以需要重新构建楼层显示数组的位置
                that.state.orgtypefloor.map((nb =>{
                    if(obj.subGrid == nb.subGrid){
                        flooradjust.push(nb);
                    }
                }))
            }))

            //当取消职能，还想再吃勾选职能的时候，以前的职能数据需要还原，
            if(getDefData('orgunit_orgtypeformdata'+subGrid,that.config.datasource)){
                that.props.form.setAllFormValue(getDefData('orgunit_orgtypeformdata'+subGrid,that.config.datasource));
            }
            
            if("stockorg" == subGrid && getDefData('orgunit_orgtypeformdata'+subGrid,that.config.datasource)){
                if(getDefData('orgunit_orgtypeformdata'+'stocktrafficrelation',that.config.datasource)){
                    that.props.form.setAllFormValue(getDefData('orgunit_orgtypeformdata'+'stocktrafficrelation',that.config.datasource));
                }

                if(getDefData('orgunit_orgtypeformdata'+'stockqccenterrelation',that.config.datasource)){
                    that.props.form.setAllFormValue(getDefData('orgunit_orgtypeformdata'+'stockqccenterrelation',that.config.datasource));
                }
                
                if(getDefData('orgunit_orgtypeformdata'+'stockorgrelation',that.config.datasource)){
                    that.props.form.setAllFormValue(getDefData('orgunit_orgtypeformdata'+'stockorgrelation',that.config.datasource));
                }

                if(getDefData('orgunit_orgtypeformdata'+'stockassetrelation',that.config.datasource)){
                    that.props.form.setAllFormValue(getDefData('orgunit_orgtypeformdata'+'stockassetrelation',that.config.datasource));
                }

            }
            if("maintainorg" == subGrid && getDefData('orgunit_orgtypeformdata'+subGrid,that.config.datasource)){
                if(getDefData('orgunit_orgtypeformdata'+'maintainstockrelation',that.config.datasource)){
                    that.props.form.setAllFormValue(getDefData('orgunit_orgtypeformdata'+'maintainstockrelation',that.config.datasource));
                }
            }
            if("itemorg" == subGrid && getDefData('orgunit_orgtypeformdata'+subGrid,that.config.datasource)){
                if(getDefData('orgunit_orgtypeformdata'+'itemstockrelation',that.config.datasource)){
                    that.props.form.setAllFormValue(getDefData('orgunit_orgtypeformdata'+'itemstockrelation',that.config.datasource));
                }
            }
            if("assetorg" == subGrid && getDefData('orgunit_orgtypeformdata'+subGrid,that.config.datasource)){
                if(getDefData('orgunit_orgtypeformdata'+'assetorgmaintainrelation',that.config.datasource)){
                    that.props.form.setAllFormValue(getDefData('orgunit_orgtypeformdata'+'assetorgmaintainrelation',that.config.datasource));
                }
            }
            if("saleorg" == subGrid && getDefData('orgunit_orgtypeformdata'+subGrid,that.config.datasource)){
                if(getDefData('orgunit_orgtypeformdata'+'saleorgrelation',that.config.datasource)){
                    that.props.form.setAllFormValue(getDefData('orgunit_orgtypeformdata'+'saleorgrelation',that.config.datasource));
                }
            }

            that.state.orgtypefloor = flooradjust;
        }

        if(value==false){
            
            if(subGrid != 'org'){
                that.props.form.setFormStatus(subGrid,"browse");
            }
            
            if(this.state.childstate.corp == true && subGrid == 'financeorg'){
                toast({content: this.state.json['10100ORG-000038'], color: 'warning'});//默认top/* 国际化处理： 业务单元具有公司职能时，必须同时具有财务职能！*/
                return ;
            }

            this.config.orgtypearr.map((obj =>{
                if(obj.subGrid == subGrid){
                    obj.isshow = value;                    
                }
                // //楼层中移出
                this.state.orgtypefloor.map((nb =>{
                    if(obj.subGrid == nb.subGrid && obj.isshow){
                        flooradjust.push(nb);
                    }
                }))
             //新增职能中移出
                this.state.increaseorgtype.map((nb =>{
                    if(obj.subGrid == nb.subGrid && obj.isshow){
                        neworgtype.push(nb);
                    }
                }))
                
            }))
            this.state.orgtypefloor = flooradjust;
            this.state.increaseorgtype = neworgtype;
            //关闭职能清空该职能数据
            // if(status == "edit" || status == "add"){
            //     this.props.form.EmptyAllFormValue(subGrid);
            // }
            //现在关闭就把form里面内容清空了，所以需要保存以前form内容，用于还原以前的数据
            if("stockorg" == subGrid){
                let stocktrafficrelation = this.props.form.getAllFormValue('stocktrafficrelation');
                stocktrafficrelation['areacode'] = 'stocktrafficrelation';
                stocktrafficrelation= {['stocktrafficrelation']:stocktrafficrelation};
                setDefData('orgunit_orgtypeformdata'+'stocktrafficrelation',that.config.datasource,JSON.parse(JSON.stringify(stocktrafficrelation)));

                let stockqccenterrelation = this.props.form.getAllFormValue('stockqccenterrelation');
                stockqccenterrelation['areacode'] = 'stockqccenterrelation';
                stockqccenterrelation= {['stockqccenterrelation']:stockqccenterrelation};
                setDefData('orgunit_orgtypeformdata'+'stockqccenterrelation',that.config.datasource,JSON.parse(JSON.stringify(stockqccenterrelation)));

                let stockorgrelation = this.props.form.getAllFormValue('stockorgrelation');
                stockorgrelation['areacode'] = 'stockorgrelation';
                stockorgrelation= {['stockorgrelation']:formdata};
                setDefData('orgunit_orgtypeformdata'+'stockorgrelation',that.config.datasource,JSON.parse(JSON.stringify(stockorgrelation)));

                let stockassetrelation = this.props.form.getAllFormValue('stockassetrelation');
                stockassetrelation['areacode'] = 'stockassetrelation';
                stockassetrelation= {['stockassetrelation']:stockassetrelation};
                setDefData('orgunit_orgtypeformdata'+'stockassetrelation',that.config.datasource,JSON.parse(JSON.stringify(stockassetrelation)));

            }
            if("maintainorg" == subGrid){
                let maintainstockrelation = this.props.form.getAllFormValue('maintainstockrelation');
                maintainstockrelation['areacode'] = 'maintainstockrelation';
                maintainstockrelation= {['maintainstockrelation']:maintainstockrelation};
                setDefData('orgunit_orgtypeformdata'+'maintainstockrelation',that.config.datasource,JSON.parse(JSON.stringify(maintainstockrelation)));

            }
            if("itemorg" == subGrid){
                let itemstockrelation = this.props.form.getAllFormValue('itemstockrelation');
                itemstockrelation['areacode'] = 'itemstockrelation';
                itemstockrelation= {['itemstockrelation']:itemstockrelation};
                setDefData('orgunit_orgtypeformdata'+'itemstockrelation',that.config.datasource,JSON.parse(JSON.stringify(itemstockrelation)));

            }
            if("assetorg" == subGrid){
                let assetorgmaintainrelation = this.props.form.getAllFormValue('assetorgmaintainrelation');
                assetorgmaintainrelation['areacode'] = 'assetorgmaintainrelation';
                assetorgmaintainrelation= {['stockorgrelation']:assetorgmaintainrelation};
                setDefData('orgunit_orgtypeformdata'+'assetorgmaintainrelation',that.config.datasource,JSON.parse(JSON.stringify(assetorgmaintainrelation)));

            }
            if("saleorg" == subGrid){
                let saleorgrelation = this.props.form.getAllFormValue('saleorgrelation');
                saleorgrelation['areacode'] = 'saleorgrelation';
                saleorgrelation= {['stockorgrelation']:saleorgrelation};
                setDefData('orgunit_orgtypeformdata'+'saleorgrelation',that.config.datasource,JSON.parse(JSON.stringify(saleorgrelation)));

            }

            let formdata = this.props.form.getAllFormValue(subGrid);
            formdata['areacode'] = subGrid;
            formdata= {[subGrid]:formdata};
            setDefData('orgunit_orgtypeformdata'+subGrid,that.config.datasource,JSON.parse(JSON.stringify(formdata)));
        }

        //启用职能时候，需要把相关的委托关系添加进去
        if(status == "edit" || status == "add"){
            let	pk = this.props.getUrlParam('pk_org');
            this.props.form.setFormStatus(subGrid,"add");
            //职能委托关系的联动
            if(subGrid == "saleorg"){
                this.props.form.setFormStatus("saleorgrelation","edit");
            }
            if(subGrid == "stockorg"){
                this.props.form.setFormStatus("stocktrafficrelation","edit");
                this.props.form.setFormStatus("stockassetrelation","edit");
                this.props.form.setFormStatus("stockorgrelation","edit");
                this.props.form.setFormStatus("stockqccenterrelation","edit");
            }
            if(subGrid == "assetorg"){
                this.props.form.setFormStatus("assetorgmaintainrelation","edit");
            }
            if(subGrid == "maintainorg"){
                this.props.form.setFormStatus("maintainstockrelation","edit");
            }
            if(subGrid == "itemorg"){
                this.props.form.setFormStatus("itemstockrelation","edit");
            }
        }
        // //新增的时候清空所有数据
        // if(status == "add"){
        //     this.props.form.EmptyAllFormValue(subGrid);
        // }
        let childstatchange = childstate;
        //用于控制各个职能form上停启用按钮的显示和停用
        if(childstatchange[subGrid]){
            this.toggleButtonShow(this.props,3,subGrid);
        }else{
            this.toggleButtonShow(this.props,2,subGrid);
        }
        childstatchange[subGrid] = value;
        //启用法人公司的时候需要同时启用财务职能
        if('corp' == subGrid && value ){
            //childstatchange['financeorg'] = value;
            this.toggleButtonShow(this.props,3,'financeorg');
            
            //开启财务职能的时候，需要把库存的采购业务委托关系中的默认结算财务组织和默认应收组织设置为不可编辑
            this.props.form.setFormItemsDisabled('stockorgrelation',{'default2':true,'default1':true});//设置表单项不可用
            //开启财务职能的时候，需要把库存的所属财务组织为不可编辑
            this.props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':true});//设置表单项不可用
            //开启财务职能的时候，需要把销售的默认结算财务组织和默认应收组织设置为不可编辑
            this.props.form.setFormItemsDisabled('saleorgrelation',{'default2':true,'default1':true});//设置表单项不可用
            
            let meta1 = this.props.meta.getMeta();
            let pk_financeorg1 = meta1['stockorg'].items.find((item) => item.attrcode == 'pk_financeorg');
            pk_financeorg1.required = false;
            pk_financeorg1.disabled = true;  
            this.props.meta.setMeta(meta1); 
        }
        
        //只要是为了保持org上职能按钮区域和各个职能模块上开启按钮保持一致
        switch(subGrid)
            {
                case 'corp':
                            this.props.form.setFormItemsValue('org',{'orgtype2':{value:value,display:null}});

                            if(!value){
                                this.props.form.setFormItemsValue('org',{'pk_corp':{value:null,display:null}});

                                this.props.form.setFormItemsDisabled('org',{'pk_corp':false});//设置表单项不可用
                                if(this.state.childstate.financeorg){
                                    //关闭法人，如果财务还在，那么所属公司必填
                                    that.props.form.setFormItemsRequired('org',{'pk_corp':true});
                                }
                            }
                             break;//法人公司
                case 'hrorg':
                            this.props.form.setFormItemsValue('org',{'orgtype4':{value:value,display:null}});
                            break;//人力资源
                case 'financeorg':
                            if(!value){
                                this.props.form.setFormItemsValue('org',{'orgtype5':{value:value,display:null}}); 
                                //停用财务职能的时候，需要把库存的采购业务委托关系中的默认结算财务组织和默认应收组织设置为可编辑
                                this.props.form.setFormItemsDisabled('stockorgrelation',{'default2':false,'default1':false});//设置表单项不可用
                                //停用财务职能的时候，需要把库存的所属财务组织为可编辑
                                this.props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':false});//设置表单项不可用
                                //停用财务职能的时候，需要把销售的默认结算财务组织和默认应收组织设置为不可编辑
                                this.props.form.setFormItemsDisabled('saleorgrelation',{'default2':false,'default1':false});//设置表单项不可用
                                //取消财务，那所属公司设置为非必填
                                this.props.form.setFormItemsRequired('org',{'pk_corp':false});
                                //需要修改库存组织默认财务的必填
                                let meta1 = this.props.meta.getMeta();
                                let pk_financeorg2 = meta1['stockorg'].items.find((item) => item.attrcode == 'pk_financeorg');
                                pk_financeorg2.required = true;
                                pk_financeorg2.disabled = false; 
                                this.props.meta.setMeta(meta1); 
                            }
                            break;//财务组织
                case 'fundorg':
                            this.props.form.setFormItemsValue('org',{'orgtype6':{value:value,display:null}});
                             break;//资金
                case 'purchaseorg':
                            this.props.form.setFormItemsValue('org',{'orgtype7':{value:value,display:null}}); 
                            if(!value){
                                //停用采购职能的时候，需要把库存的采购业务委托关系中的默认采购组织设置为可编辑
                                this.props.form.setFormItemsDisabled('stockorgrelation',{'target':false});//设置表单项不可用
                            }
                            break;//采购
                case 'saleorg':
                            this.props.form.setFormItemsValue('org',{'orgtype8':{value:value,display:null}});
                            if(!value){
                                ///停用销售职能的时候，需要把表头使用零售设置为不可编辑
                                this.props.form.setFormItemsDisabled('org',{'isretail':true});
                                this.props.form.setFormItemsValue('org',{'isretail':{value:null,display:null}});
                            }
                            
                            break;//销售
                case 'stockorg':
                            this.props.form.setFormItemsValue('org',{'orgtype9':{value:value,display:null}});
                            if(!value){
                                //停用库存职能的时候，需要把项目的项目库存业务委托关系设置为可编辑
                                this.props.form.setFormItemsDisabled('maintainstockrelation',{'target':false});//设置表单项不可用
                                //停用库存职能的时候，需要把项目的项目库存业务委托关系设置为可编辑
                                this.props.form.setFormItemsDisabled('itemstockrelation',{'target':false});//设置表单项不可用
                                //停用库存职能的时候，需要把销售的默认库存组织设置为可编辑
                                this.props.form.setFormItemsDisabled('saleorgrelation',{'target':false});//设置表单项不可用
                                ///停用销售职能的时候，需要把表头使用零售设置为不可编辑
                                this.props.form.setFormItemsDisabled('org',{'isretail':true});
                                this.props.form.setFormItemsValue('org',{'isretail':{value:null,display:null}});
                            }
                            break;//库存
                case 'trafficorg': 
                            this.props.form.setFormItemsValue('org',{'orgtype10':{value:value,display:null}});
                            if(!value){
                                //停用物流职能的时候，需要把库存的物流业务委托关系设置为可编辑
                                this.props.form.setFormItemsDisabled('stocktrafficrelation',{'target':false});//设置表单项不可用
                            }
                            
                             break;//物流
                case 'qccenter':
                            this.props.form.setFormItemsValue('org',{'orgtype11':{value:value,display:null}});
                            if(!value){
                                //停用质检职能的时候，需要把库存的质检业务委托关系设置为可编辑
                                this.props.form.setFormItemsDisabled('stockqccenterrelation',{'target':false});//设置表单项不可用
                            }
                            break;//质检
                case 'assetorg':
                            this.props.form.setFormItemsValue('org',{'orgtype12':{value:value,display:null}}); 
                            if(!value){
                                //停用资产职能的时候，需要把库存的资产库存业务委托关系设置为可编辑
                                this.props.form.setFormItemsDisabled('stockassetrelation',{'target':false});//设置表单项不可用
                            }
                            
                            break;//资产
                case 'maintainorg':
                            this.props.form.setFormItemsValue('org',{'orgtype14':{value:value,display:null}});
                            if(!value){
                                //停用维修职能的时候，需要把资产的资产维修业务委托关系设置为可编辑
                                this.props.form.setFormItemsDisabled('assetorgmaintainrelation',{'target':false});//设置表单项不可用
                            }
                            
                            break;//维修
                case 'liabilitycenter':
                            this.props.form.setFormItemsValue('org',{'orgtype15':{value:value,display:null}});
                            // if(!value){
                            //     //停用利润中心职能的时候，需要把库存的采购业务委托关系中的默认利润中心设置为可编辑
                            //     this.props.form.setFormItemsDisabled('stockorgrelation',{'default3':false});//设置表单项不可用
                            //     //停用利润中心职能的时候，需要把销售的默认利润中心设置为不可编辑
                            //     this.props.form.setFormItemsDisabled('saleorgrelation',{'default3':false});//设置表单项不可用
                            // }
                            
                             break;//利润中心
                case 'itemorg':
                            this.props.form.setFormItemsValue('org',{'orgtype16':{value:value,display:null}});
                            break;//项目
                case 'planbudget':
                            this.props.form.setFormItemsValue('org',{'orgtype17':{value:value,display:null}});
                            break;//预算
                case 'adminorg':
                            this.props.form.setFormItemsValue('org',{'orgtype29':{value:value,display:null}});
                             break;//行政
                case 'factory':
                            this.props.form.setFormItemsValue('org',{'orgtype33':{value:value,display:null}});
                            break;//工厂
                case 'plancenter':
                            this.props.form.setFormItemsValue('org',{'orgtype34':{value:value,display:null}});
                            break;//计划中心
                default:break;
            }
        this.setState({
            childstate:childstatchange
        });
    }


    toggleButtonShow (props,enablestate,subGrid){

       let enablebtnname = subGrid + 'enable';
       let disablebtnname = subGrid + 'disable';
       let status = props.getUrlParam('status')
        if(enablestate ==='2'){//启用状态
            props.button.setButtonsVisible({
                [disablebtnname]:true,
                [enablebtnname]:false,
            });
        }else{
            props.button.setButtonsVisible({
                [disablebtnname]:false,
                [enablebtnname]:true,
            });
        }
        //新增的时候，职能的停启用按钮都不现实
        if('add' == status || 'edit' == status || 'copy' == status){
            props.button.setButtonsVisible({
                [disablebtnname]:false,
                [enablebtnname]:false,
            });
        }
    }

    onPeriodBeforeEvent(props,moduleId, item, index,value, record){
        //业务期初期间，银行授信管理、银行存款管理、银行贷款管理、担保管理、
        //信用证管理、商业汇票、资金调度、内部存款管理、内部贷款管理、票据集中管理、资金结算这几个模块对应的会计期间是日期，不是会计参照
        let meta = this.props.meta.getMeta();
        let moudleidnum = record.values.moduleid.value;
        let arr = ['4510' , '4530'  ,'4532' , '3613' , '3614' , '3615' , '3616' ,'3617' ,'3618' , '3632'  ,'3634' , '3635',  '3637']
        var index = arr.indexOf(moudleidnum);
        if (index >= 0 ) {
            // 找到对应项，也可以用forEach循环、for循环等
            meta[moduleId].items.find(e=>e.attrcode === 'pk_accperiod').itemtype = 'datetimepicker';
            meta[moduleId].items.find(e=>e.attrcode === 'pk_accperiod').refcode = null;
            // 重要！下面那行一定要写
            props.renderItem('table', moduleId, 'pk_accperiod', null) // 前三个参数，根据模板json填对应值，moduleId是区域id
            props.meta.setMeta(meta)
        }else{
            ajax({
                url :'/nccloud/uapbd/org/setaccperiodscheme.do',
                data:{pk_orgtype:record.values.pk_orgtype.display,pk_org:record.values.pk_org.value,moudleid:moudleidnum},
                success : (res) => {
                    if(res.success){
                        
                        if(res.data){
                            item.queryCondition = function () {
                                return {
                                    "pk_accperiodscheme": res.data
                                }
                        }
                    }
                }
            }
            });
        }     
        //编辑前事件必须范围true，不然不可以使用
        return true;
    }

    onVATTableModelAfterEdit(props, moduleId, key, value, changedrows, record, index){
        
        ajax({
            url :'/nccloud/uapbd/org/vatedit.do',
            data:{countrycode:value.refpk},
            success : (res) => {
                if(res.success){
            
                    if(res.data){
                        this.props.editTable.setValByKeyAndIndex('orgvatfunclet',record,'countrycode',{value:res.data,display:res.data})
                }
            }
        }
        });
        //编辑前事件必须范围true，不然不可以使用
        return true;
    }

    onSaveOrgManager(){
        //let tabledata = this.props.editTable.getAllData('orgmanager');
        let	pk_org = this.props.getUrlParam('pk_org');
        let that = this;
        if(undefined == pk_org){
            pk_org = getDefData('orgunit_pk_org', this.config.datasource);//cacheTools.get('orgunit_pk_org');
        }
        this.props.editTable.filterEmptyRows('orgmanager',['cuserid']);
        let tableData = this.props.editTable.getChangedRows('orgmanager');   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
        tableData.map((obj)=>{
            obj.values.pk_org.value = pk_org;
        })
        if(!tableData || tableData.length === 0){
            //保存完设置为浏览态
            that.props.editTable.setStatus('orgmanager', 'browse');
            that.orgManageButtonState(that.props,'orgmanagesave');
            toast({title : that.state.json['10100ORG-000047'],color : 'success'});/* 国际化处理： 保存成功！*/
            return
        } 
        let data = {
            pageid:'10100ORG_orgmanager',
            model : {
                areaType: "table",
                pageinfo: null,
                rows: []
            }
        };
        data.model.rows = tableData;
        ajax({
            url :'/nccloud/uapbd/org/orgmanagesavequery.do',
            data:data,
            success : (res) => {
                if(res.success){
                    //保存完设置为浏览态
                    if(res.data){
                        that.props.editTable.setTableData('orgmanager',res.data.orgmanager);
                     }else{
                        that.props.editTable.setTableData('orgmanager',{rows: []});
                          }
                    //保存完设置为浏览态
                    that.props.editTable.setStatus('orgmanager', 'browse');
                    that.orgManageButtonState(that.props,'orgmanagesave');
                    toast({title : that.state.json['10100ORG-000047'],color : 'success'});/* 国际化处理： 保存成功！*/
                }
            }
        });
    }

    onSaveOrgPeriod(){
        let tableData = this.props.editTable.getAllData('orgmoduleperiod');   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
        let changetableData = props.editTable.getChangedRows('orgmoduleperiod');
        let that = this;
        if(!changetableData || changetableData.length === 0) return
        data = {
            pageid:'10100ORG_orgmoduleperiod',
            model : {
                areaType: "table",
                pageinfo: null,
                rows: []
            }
        };
        data.model.rows = changetableData.rows;
        ajax({
            url :'/nccloud/uapbd/org/saveperiod.do',
            data:data,//{data:data,opera:'year'},
            success : (res) => {
                if(res.success){
                    toast({ color: 'success', title: that.state.json['10100ORG-000048'] });/* 国际化处理： 设置成功！*/
                }
            }
        });
    }

    onSaveOrgInnercust(){
        let memberFlag = this.props.form.isCheckNow('innercustsupp');
            if(!memberFlag){
                return;
            }
        let that = this;
        let countryzone = this.props.form.getFormItemsValue('org','countryzone');
        let pk_unitorg = this.props.form.getFormItemsValue('org','pk_org').value;
        if(pk_unitorg == undefined){
            pk_unitorg = getDefData('orgunit_pk_org', this.config.datasource);//cacheTools.get('orgunit_pk_org');
        }
        let pk_org = this.props.form.getFormItemsValue('innercustsupp','pk_org');
        let code = this.props.form.getFormItemsValue('innercustsupp','code');
        let custname = this.props.form.getFormItemsValue('innercustsupp','custname');
        let custshortname = this.props.form.getFormItemsValue('innercustsupp','custshortname');
        let pk_custclass = this.props.form.getFormItemsValue('innercustsupp','pk_custclass');
        let pk_supplierclass = this.props.form.getFormItemsValue('innercustsupp','pk_supplierclass');
        ajax({
            url :'/nccloud/uapbd/org/saveinnercust.do',
            data:{pk_org:pk_org.value,countryzone:countryzone.value,code:code.value,custname:custname.value,
                custshortname:custshortname.value,pk_custclass:pk_custclass.value,pk_supplierclass:pk_supplierclass.value,pk_unitorg:pk_unitorg},//{data:data,opera:'year'},
            success : (res) => {
                if(res.success){
                    toast({ color: 'success', title: that.state.json['10100ORG-000047'] });/* 国际化处理： 保存成功！*/
                    this.props.form.setFormStatus('innercustsupp','browse');
                    this.props.modal.close('innercustsupp');
                }
            }
        });
        
    }

    //业务期间按钮事件
    onOrgPeirodButtonClick(props,id) {
        let that = this;
        let tableData = this.props.editTable.getAllData('orgmoduleperiod');   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输

        let changetableData = props.editTable.getChangedRows('orgmoduleperiod');

        let rownum =  props.editTable.getNumberOfRows('orgmoduleperiod'); //获取列表总行数

        let flag = 0 ;

        let data = {};

        switch (id) {
            case 'periodsave':
                if(!changetableData || changetableData.length === 0) return;
                data = {
                    pageid:'10100ORG_orgmoduleperiod',
                    model : {
                        areaType: "table",
                        pageinfo: null,
                        rows: []
                    }
                };
                data.model.rows = changetableData;
                ajax({
                    url :'/nccloud/uapbd/org/saveperiod.do',
                    data:data,//{data:data,opera:'year'},
                    success : (res) => {
                        if(res.success){
                            //保存之后刷新界面
                            ajax({
                                url :'/nccloud/uapbd/org/orgmoduleperiod.do',
                                data:{pk_org: getDefData('orgunit_pk_org',props.config.datasource)},
                                success : (res) => {
                                    if(res.success){
                                        if(res.data){
                                            props.editTable.setTableData('orgmoduleperiod',res.data.orgmoduleperiod);
                                        }else{
                                            props.editTable.setTableData('orgmoduleperiod',{rows: []});
                                        }
                                        props.editTable.setStatus('orgmoduleperiod','edit');
                                    }
                                }
                            });
                            toast({ color: 'success', title: that.state.json['10100ORG-000048'] });/* 国际化处理： 设置成功！*/
                        }
                    }
                });
            break;

        case 'batchempty':
            while(flag != rownum){
                props.editTable.setValByKeyAndIndex('orgmoduleperiod',flag,'pk_accperiod',{value:'',display:''});
                flag = flag + 1;
            }
            break;
        case 'batchsetbeginyear':
            
            if(!tableData || tableData.length === 0) return
            data = {
                pageid:'beginyear',
                model : {
                    areaType: "table",
                    pageinfo: null,
                    rows: []
                }
            };
            data.model.rows = tableData.rows;
            ajax({
                url :'/nccloud/uapbd/org/batchsetyearperiod.do',
                data:data,//{data:data,opera:'year'},
                success : (res) => {
                    if(res.success){
                        if(res.data){
                            while(flag != rownum){
                                if(res.data[flag] != null){
                                    props.editTable.setValByKeyAndIndex('orgmoduleperiod',flag,'pk_accperiod',{value:res.data[flag],display:res.data[flag]});
                                }             
                                flag = flag + 1;
                            }
                        }
                    }
                }
            });

            props.editTable.setStatus('orgmoduleperiod', 'edit');
            break;
        case 'batchcurrentyear':
            if(!tableData || tableData.length === 0) return
            data = {
                pageid:'currentyear',
                model : {
                    areaType: "table",
                    pageinfo: null,
                    rows: []
                }
            };
            data.model.rows = tableData.rows;
            ajax({
                url :'/nccloud/uapbd/org/batchsetyearperiod.do',
                data:data,//{data:data,opera:'year'},
                success : (res) => {
                    if(res.success){
                        if(res.data){
                            while(flag != rownum){
                                if(res.data[flag] != null){
                                    props.editTable.setValByKeyAndIndex('orgmoduleperiod',flag,'pk_accperiod',{value:res.data[flag],display:res.data[flag]});
                                }             
                                flag = flag + 1;
                            }
                        }
                    }
                }
            });
            props.editTable.setStatus('orgmoduleperiod', 'edit');
            break;
    }

}


VATbuttonToggleShow(props,status){
    //let status = props.getUrlParam('status');
    //按钮的显示状态
    if(status === 'vatadd' || status === 'vatedit' ){
        props.button.setButtonVisible(['vatadd','vatlinedel','vatsave','vatcancel'],true);
        props.button.setButtonVisible(['vatedit','vatdel','vatrefresh'],false);
    }else{
        props.button.setButtonVisible(['vatadd','vatdel','vatedit','vatrefresh'],true);
        props.button.setButtonVisible(['vatsave','vatcancel','vatlinedel'],false);
    }
}

    onOrgVATButtonClick(props,id){
        let that = this;
        let pk_org = this.props.form.getFormItemsValue('org','pk_org').value;
        if(pk_org == undefined){
            pk_org = getDefData('orgunit_pk_org', this.config.datasource);//cacheTools.get('orgunit_pk_org');
        }
        //过滤空行
        this.props.editTable.filterEmptyRows('orgvatfunclet',['pk_country']);
        let tableData = this.props.editTable.getAllData('orgvatfunclet');   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输

        //获取编辑行改变的数据
        let selectedData=props.editTable.getCheckedRows('orgvatfunclet');
        let rownum =  props.editTable.getNumberOfRows('orgvatfunclet'); //获取列表总行数

        let data = {};
        switch (id) {
            case 'vatadd':
            props.editTable.addRow('orgvatfunclet',rownum,true);
            props.editTable.setStatus('orgvatfunclet','edit');
            this.VATbuttonToggleShow(props,'vatadd');
            // this.props.editTable.setValByKeyAndIndex(tableid, num, 'dataoriginflag', {value: '0'});//设置数据来源
            //新增的时候，删除按钮都不可以使用，勾选数据之后才能使用
            this.props.button.setButtonDisabled(['vatdel','vatlinedel'],true);
            this.props.button.setMainButton('vatsave',true);
            this.props.button.setMainButton('vatadd',false);
            break;

        case 'vatdel':
                if(selectedData.length==0){
                    toast({content:that.state.json['10100ORG-000049'],color:'warning'});/* 国际化处理： 请选择要删除的数据！*/
                    return 
                }
                let indexArr1=[];
                selectedData.forEach((val) => {
                    indexArr1.push(val.index);
                });
                
                props.editTable.deleteTableRowsByIndex('orgvatfunclet', indexArr1);

                //获取界面上修改过的数据
                var changetableData = props.editTable.getChangedRows('orgvatfunclet');

                promptBox({
                    color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: that.state.json['10100ORG-000001'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    hasCloseBtn:false,
                    content: that.state.json['10100ORG-000050'],/* 国际化处理： 您确定要删除吗？*/
                    beSureBtnClick: () =>{
                        data = {
                            pageid:pk_org,
                            model : {
                                areaType: "table",
                                pageinfo: null,
                                rows: []
                            }
                        };
                        data.model.rows = changetableData;
                        ajax({
                            url :'/nccloud/uapbd/org/vatesave.do',
                            data:data,//{data:data,opera:'year'},
                            success : (res) => {
                                if(res.success){
                                    that.VATbuttonToggleShow(props,'vatdel');
                                    toast({ color: 'success', title: that.state.json['10100ORG-000010'] });/* 国际化处理： 删除成功！*/
                                    that.props.button.setButtonDisabled(['vatdel','vatlinedel'], true);
                                }
                                //props.modal.close('orgvatfunclet');
                            }
                        });
                    }   
                })
                // props.modal.show('delete',{
                //     title:'提示',
                //     content: "您确定要删除吗？",
                //     noFooter : false, //是否需要底部按钮,默认true
                //     userControl:true,//自己控制什么时候关闭窗口
                //     beSureBtnClick:() =>{
                //         data = {
                //             pageid:pk_org,
                //             model : {
                //                 areaType: "table",
                //                 pageinfo: null,
                //                 rows: []
                //             }
                //         };
                //         data.model.rows = changetableData;
                //         ajax({
                //             url :'/nccloud/uapbd/org/vatesave.do',
                //             data:data,//{data:data,opera:'year'},
                //             success : (res) => {
                //                 if(res.success){
                //                     this.VATbuttonToggleShow(props,'vatdel');
                //                     toast({ color: 'success', content: '删除成功！' });
                //                 }
                //                 //props.modal.close('orgvatfunclet');
                //             }
                //         });
                //     }
                // });
                
            break;
        case 'vatlinedel':
                if(selectedData.length==0){
                    toast({content:that.state.json['10100ORG-000049'],color:'warning'});/* 国际化处理： 请选择要删除的数据！*/
                    return 
                }
                let indexArr=[];
                selectedData.forEach((val) => {
                    indexArr.push(val.index);
                });
                that.VATbuttonToggleShow(props,'vatedit');
                props.editTable.deleteTableRowsByIndex('orgvatfunclet', indexArr);
                that.props.button.setButtonDisabled(['vatdel','vatlinedel'], true);
            break;
        case 'vatedit':
            props.editTable.setStatus('orgvatfunclet', 'edit');
            that.VATbuttonToggleShow(props,'vatedit');
            props.button.setButtonDisabled(['vatlinedel'],true);
            // this.props.editTable.setValByKeyAndIndex(tableid, num, 'dataoriginflag', {value: '0'});//设置数据来源
            break;
        case 'vatcancel':
            promptBox({
                color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: that.state.json['10100ORG-000001'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                hasCloseBtn:false,
                content: that.state.json['10100ORG-000002'],/* 国际化处理： 您确定要取消吗？*/
                beSureBtnClick: () =>{
                    props.editTable.cancelEdit('orgvatfunclet');
                    props.editTable.setStatus('orgvatfunclet', 'browse');
                    that.VATbuttonToggleShow(props,'vatsave');
                    that.props.button.setMainButton('vatsave',false);
                    that.props.button.setMainButton('vatadd',true);
                }   
            })
            // this.props.editTable.setValByKeyAndIndex(tableid, num, 'dataoriginflag', {value: '0'});//设置数据来源
            break;
        case 'vatrefresh':
            ajax({
                url :'/nccloud/uapbd/org/vatquery.do',
                data:{pk_org: pk_org},
                success : (res) => {
                    if(res.success){
                        //props.modal.show('orgvatfunclet',{title:this.state.json['10100ORG-000060']});
                        if(res.data){
                            props.editTable.setTableData('orgvatfunclet',res.data.orgvatfunclet);
                        }else{
                            props.editTable.setTableData('orgvatfunclet',{rows: []});
                        }
                        props.editTable.setStatus('orgvatfunclet','browse');
                        props.button.setButtonDisabled(['vatdel'],true);
                        props.button.setButtonVisible(['vatadd','vatdel','vatedit','vatrefresh'],true);
                        props.button.setButtonVisible(['vatsave','vatcancel','vatlinedel'],false);
                        toast({title:that.state.json['10100ORG-000041'],color:"success"});/* 国际化处理： 刷新成功！*/
                    }
                }
            });break;
        case 'vatsave':
            that.onSaveOrgVAT();
            that.props.button.setMainButton('vatsave',false);
            that.props.button.setMainButton('vatadd',true);
            // if(!tableData || tableData.length === 0) return
            // data = {
            //     pageid:pk_org,
            //     model : {
            //         areaType: "table",
            //         pageinfo: null,
            //         rows: []
            //     }
            // };
            // data.model.rows = tableData.rows;
            // ajax({
            //     url :'/nccloud/uapbd/org/vatesave.do',
            //     data:data,//{data:data,opera:'year'},
            //     success : (res) => {
            //         if(res.success){
            //             toast({ color: 'success', content: '设置成功！' });
            //         }
            //         props.modal.close('orgvatfunclet');
            //     }
            // });
            // this.VATbuttonToggleShow(props,'vatsave');
            break;
        }

    }

    //保存维护vat
    onSaveOrgVAT(){
        //去除空行
        let that = this;
        this.props.editTable.filterEmptyRows('orgvatfunclet',['pk_country']);
        //获取改变行的时候顺便把必填项校验
        let changedRows = this.props.editTable.getChangedRows('orgvatfunclet',false);
        if(changedRows && !this.props.editTable.checkRequired('orgvatfunclet',changedRows)) return;
       // if(!props.editTable.checkRequired(this.props.config.gridId,changedRows)) return;

        let pk_org = this.props.form.getFormItemsValue('org','pk_org').value;
        if(pk_org == undefined){
            pk_org = getDefData('orgunit_pk_org', this.config.datasource);//cacheTools.get('orgunit_pk_org');
        }
        // let tableData = this.props.editTable.getAllData('orgvatfunclet');
        // if(!tableData || tableData.length === 0) return
        let data = {
            pageid:pk_org,
            model : {
                areaType: "table",
                pageinfo: null,
                rows: []
            }
        };
        data.model.rows = changedRows;
        ajax({
            url :'/nccloud/uapbd/org/vatesave.do',
            data:data,//{data:data,opera:'year'},
            success : (res) => {
                if(res.success){
                    this.VATbuttonToggleShow(this.props,'vatsave');
                    that.props.editTable.setStatus('orgvatfunclet', 'browse');
                    toast({ color: 'success', title: that.state.json['10100ORG-000047'] });/* 国际化处理： 保存成功！*/
                }
                //this.props.modal.close('orgvatfunclet');
            }
        });

    }
    orgManageButtonState(props,status){
        //let status = props.getUrlParam('status');
        //按钮的显示状态
        if(status === 'orgmanageadd' || status === 'orgmanageedit'){
            props.button.setButtonVisible(['orgmanagesave','orgmanagecancel'],true);
            props.button.setButtonVisible(['orgmanageadd','orgmanageedit','orgmanagerefresh','orgmanagedel'],false);
        }else{
            props.button.setButtonVisible(['orgmanagesave','orgmanagecancel'],false);
            props.button.setButtonVisible(['orgmanageadd','orgmanageedit','orgmanagerefresh','orgmanagedel'],true);
        }
    }
    
    //组织主管按钮点击事件
    onOrgManageButtonClick(props,id) {
        
        let that = this;
        switch (id) {
            case 'orgmanageadd':
                let num =  props.editTable.getNumberOfRows('orgmanager'); //获取列表总行数
                props.editTable.addRow('orgmanager',num,true);
                props.editTable.setStatus('orgmanager','edit');
                this.orgManageButtonState(props,'orgmanageadd');
                // this.props.editTable.setValByKeyAndIndex(tableid, num, 'dataoriginflag', {value: '0'});//设置数据来源
                break;

            case 'orgmanagedel':
                let selectedData=props.editTable.getCheckedRows('orgmanager');
                    if(selectedData.length==0){
                        toast({content:that.state.json['10100ORG-000049'],color:'warning'});/* 国际化处理： 请选择要删除的数据！*/
                        return 
                    }
                
                    promptBox({
                        color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                        title: that.state.json['10100ORG-000102'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                        noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                        hasCloseBtn:false,
                        content: that.state.json['10100ORG-000009'],/* 国际化处理： 您确定要删除吗？*/
                        beSureBtnClick: () =>{
                            let indexArr=[];
                            selectedData.forEach((val) => {
                                indexArr.push(val.index);
                            });
                            props.editTable.deleteTableRowsByIndex('orgmanager', indexArr);

                            //过滤无效行
                            props.editTable.filterEmptyRows('orgmanager',['cuserid']);
                            var tableData = props.editTable.getChangedRows('orgmanager');   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
                            if(!tableData || tableData.length === 0) return;
                            var	pk_org = props.getUrlParam('pk_org');
                            if(undefined == pk_org){
                                pk_org = getDefData('orgunit_pk_org', this.config.datasource);//cacheTools.get('orgunit_pk_org');
                            }
                            tableData.map((obj)=>{
                                obj.values.pk_org.value = pk_org;
                            })
                            
                            var data = {
                                pageid:'10100ORG_orgmanager',
                                model : {
                                    areaType: "table",
                                    pageinfo: null,
                                    rows: []
                                }
                            };
                            data.model.rows = tableData;
                            ajax({
                                url :'/nccloud/uapbd/org/orgmanagesavequery.do',
                                data:data,
                                success : (res) => {
                                    if(res.success){
                                        //保存完设置为浏览态
                                    if(res.data){
                                        props.editTable.setTableData('orgmanager',res.data.orgmanager);
                                    }else{
                                        props.editTable.setTableData('orgmanager',{rows: []});
                                        }
                                        toast({title : that.state.json['10100ORG-000010'],color : 'success'});/* 国际化处理： 删除成功！*/
                                        this.orgManageButtonState(props,'orgmanagedel');
                                    }
                                }
                            });
                        }   
                    })
                    // props.modal.show('delete',{
                    //     title:'提示',
                    //     content: "您确定要删除吗？",
                    //     noFooter : false, //是否需要底部按钮,默认true
                    //     userControl:true,//自己控制什么时候关闭窗口
                    //     beSureBtnClick:() =>{
                    //         let indexArr=[];
                    //         selectedData.forEach((val) => {
                    //             indexArr.push(val.index);
                    //         });
                    //         props.editTable.deleteTableRowsByIndex('orgmanager', indexArr);

                    //         //过滤无效行
                    //         props.editTable.filterEmptyRows('orgmanager',['cuserid']);
                    //         var tableData = props.editTable.getChangedRows('orgmanager');   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
                    //         if(!tableData || tableData.length === 0) return;
                    //         var	pk_org = props.getUrlParam('pk_org');
                    //         if(undefined == pk_org){
                    //             pk_org = getDefData('orgunit_pk_org', this.config.datasource);//cacheTools.get('orgunit_pk_org');
                    //         }
                    //         tableData.map((obj)=>{
                    //             obj.values.pk_org.value = pk_org;
                    //         })
                            
                    //         var data = {
                    //             pageid:'10100ORG_orgmanager',
                    //             model : {
                    //                 areaType: "table",
                    //                 pageinfo: null,
                    //                 rows: []
                    //             }
                    //         };
                    //         data.model.rows = tableData;
                    //         ajax({
                    //             url :'/nccloud/uapbd/org/orgmanagesavequery.do',
                    //             data:data,
                    //             success : (res) => {
                    //                 if(res.success){
                    //                     toast({content : "删除成功",color : 'success'});
                    //                     this.orgManageButtonState(props,'orgmanagedel');
                    //                 }
                    //             }
                    //         });
                    //     }
                    // });

                break;
            case 'orgmanageedit':
                props.editTable.setStatus('orgmanager', 'edit');
                this.orgManageButtonState(props,'orgmanageedit');
                // this.props.editTable.setValByKeyAndIndex(tableid, num, 'dataoriginflag', {value: '0'});//设置数据来源
                break;
            case 'orgmanagesave':
                this.onSaveOrgManager();
                // this.props.editTable.setValByKeyAndIndex(tableid, num, 'dataoriginflag', {value: '0'});//设置数据来源
                break;
            case 'orgmanagecancel':
                promptBox({
                    color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: that.state.json['10100ORG-000100'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    hasCloseBtn:false,
                    content: that.state.json['10100ORG-000002'],/* 国际化处理： 您确定要取消吗？*/
                    beSureBtnClick: () =>{
                        ajax({
                            url :'/nccloud/uapbd/org/orgmanagerquery.do',
                            data:{pk_org:getDefData('orgunit_pk_org', this.config.datasource)},
                            success : (res) => {
                                if(res.success){
                                    
                                    if(res.data){
                                        props.editTable.setTableData('orgmanager',res.data.orgmanager);
                                    }
                                    this.orgManageButtonState(props,'orgmanagerefresh');
                                    props.editTable.cancelEdit('orgmanager');
                                    //props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                                }
                            }
                        });
                        //保存完设置为浏览态
                        props.editTable.setStatus('orgmanager', 'browse');
                    }   
                })
                break;
            case 'orgmanagerefresh':
                ajax({
                    url :'/nccloud/uapbd/org/orgmanagerquery.do',
                    data:{pk_org:getDefData('orgunit_pk_org', this.config.datasource)},
                    success : (res) => {
                        if(res.success){
                            
                            if(res.data){
                                props.editTable.setTableData('orgmanager',res.data.orgmanager);
                            }
                            toast({title:that.state.json['10100ORG-000041'],color:"success"});/* 国际化处理： 刷新成功！*/
                            this.orgManageButtonState(props,'orgmanagerefresh');
                            //props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                        }
                    }
                });
                //保存完设置为浏览态
                props.editTable.setStatus('orgmanager', 'browse');
                //props.editTable.setStatus('orgmanager','edit');
                break;
        }
    }

    onTableModelAfterEdit(props, moduleId, key, value, changedrows, record, index){
        if(value.refpk){
            ajax({
                url :'/nccloud/uapbd/org/userquery.do',
                data:{cuserid:value.refpk},
                success : (res) => {
                    if(res.success){
        
                        if(res.data){
                            if(undefined != res.data.orgmanager.rows[0].values['username']){
                                props.editTable.setValByKeyAndIndex('orgmanager', record, 'username', {value: res.data.orgmanager.rows[0].values.username.value});
                            }
                            if(undefined != res.data.orgmanager.rows[0].values['psncode']){
                                props.editTable.setValByKeyAndIndex('orgmanager', record, 'psncode', {value: res.data.orgmanager.rows[0].values.psncode.value});
                            }
                            if(undefined != res.data.orgmanager.rows[0].values['psnname']){
                                props.editTable.setValByKeyAndIndex('orgmanager', record, 'psnname', {value: res.data.orgmanager.rows[0].values.psnname.value});
                            }
                        }
                    }
                }
            });
        }
    }

    dealrelationformstatus (){
        let props = this.props;
        let state = this.state;
        //财务职能开启
        if(state.childstate.financeorg){
            //开启财务职能的时候，需要把库存的采购业务委托关系中的默认结算财务组织和默认应收组织设置为不可编辑
            props.form.setFormItemsDisabled('stockorgrelation',{'default2':true,'default1':true});//设置表单项不可用
            //开启财务职能的时候，需要把库存的所属财务组织为不可编辑
            props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':true});//设置表单项不可用
            //开启财务职能的时候，需要把销售的默认结算财务组织和默认应收组织设置为不可编辑
            props.form.setFormItemsDisabled('saleorgrelation',{'default2':true,'default1':true});//设置表单项不可用
            let meta1 = props.meta.getMeta();
            let pk_financeorg1 = meta1['stockorg'].items.find((item) => item.attrcode == 'pk_financeorg');
            pk_financeorg1.required = false;
            pk_financeorg1.disabled = true; 
            props.meta.setMeta(meta1); 
        }
        //开启采购职能
        if(state.childstate.purchaseorg){
            //开启采购职能的时候，需要把库存的采购业务委托关系中的默认采购组织设置为不可编辑
            props.form.setFormItemsDisabled('stockorgrelation',{'target':true});//设置表单项不可用
        }
        //开启库存职能
        if(state.childstate.stockorg){
            //开启库存职能的时候，需要把维修的维修库存业务委托关系设置为不可编辑
            props.form.setFormItemsDisabled('maintainstockrelation',{'target':true});//设置表单项不可用
            //开启库存职能的时候，需要把项目的项目库存业务委托关系设置为不可编辑
            props.form.setFormItemsDisabled('itemstockrelation',{'target':true});//设置表单项不可用
            //开启库存职能的时候，需要把销售的默认库存组织设置为不可编辑
            props.form.setFormItemsDisabled('saleorgrelation',{'target':true});//设置表单项不可用
        }
        //开启物流职能
        if(state.childstate.trafficorg){
             //开启物流职能的时候，需要把库存的物流业务委托关系设置为不可编辑
             props.form.setFormItemsDisabled('stocktrafficrelation',{'target':true});//设置表单项不可用
        }
        //开启质检职能
        if(state.childstate.qccenter){
            //开启质检职能的时候，需要把库存的质检业务委托关系设置为不可编辑
            props.form.setFormItemsDisabled('stockqccenterrelation',{'target':true});//设置表单项不可用
        }
       //开启资产职能
       if(state.childstate.assetorg){
            //开启资产职能的时候，需要把库存的资产库存业务委托关系设置为不可编辑
            props.form.setFormItemsDisabled('stockassetrelation',{'target':true});//设置表单项不可用
        }
        //开启维修职能
       if(state.childstate.maintainorg){
            //开启维修职能的时候，需要把资产的资产维修业务委托关系设置为不可编辑
            props.form.setFormItemsDisabled('assetorgmaintainrelation',{'target':true});//设置表单项不可用
        }
        //开启利润中心职能
       if(state.childstate.liabilitycenter){
            // //开启利润中心职能的时候，需要把库存的采购业务委托关系中的默认利润中心设置为不可编辑
            // props.form.setFormItemsDisabled('stockorgrelation',{'default3':true});//设置表单项不可用
            // //开启利润中心职能的时候，需要把销售的默认利润中心设置为不可编辑
            // props.form.setFormItemsDisabled('saleorgrelation',{'default3':true});//设置表单项不可用
        }
    }

    onMouseEnterSortTreeEve( key ) {
        let obj = {
            delIcon:false,
            editIcon:false,
            addIcon:false
        };
        this.props.syncTree.hideIcon( 'orgunittree', key, obj )
    }

    //选择左树加载右表数据 控制启用停用按钮
    onSelectEve (data, item, isChange) {
        if(isChange){
            //加载成员树表
            let that = this;
            ajax({
                url:'/nccloud/uapbd/org/querydept.do',
                data:{pk_org: data},
                success:function(res){
                    if(res.success){
                        if(res.data){
                            //后台返回的是表格的数据  需要构造成树状表的数据
                            let datas =  that.props.treeTableManyCol.createNewData(res.data.orgdept.rows);
                            //that.props.treeTableManyCol.EmptyAllFormValue(rightTreeTable);
                            //根据树状表的数据构造树表

                            that.props.treeTableManyCol.initTreeTableData('orgdept',datas,'refpk');
                        }else{

                            that.props.treeTableManyCol.emptyAllData('orgdept');
                        }

                    }
                }
            });
        }
    }
    

    /**
     * 设置业务单元根节点
     * @param data
     * @returns {*}
     */
    onSetUnitOrgRoot(){
        let that = this;
        let pk_org = this.props.form.getFormItemsValue('org','pk_org').value;
        if(pk_org == undefined){
            pk_org = getDefData('orgunit_pk_org', this.config.datasource);//cacheTools.get('orgunit_pk_org');
        }
        let type = 'orgroot';

        ajax({
            url:'/nccloud/uapbd/org/setroot.do',
            data:{pk_org: pk_org,type:type},
            success:function(res){
                if(res.success){
                    toast({ color: 'success', title: that.state.json['10100ORG-000048'] });/* 国际化处理： 设置成功！*/
                    this.props.modal.close('setorgroot');
                }
            },
            error:(result)=>{
                toast({content:result.message,title:that.state.json['10100ORG-000051'], color: 'warning'});/* 国际化处理： 警告*/
            }
        });
    }

    /**
     * 设置行政组织根节点
     * @param data
     * @returns {*}
     */
    onSetAdminOrgRoot(){
        let that = this;
        let pk_org = that.props.form.getFormItemsValue('org','pk_org').value;
        if(pk_org == undefined){
            pk_org = getDefData('orgunit_pk_org', that.config.datasource);//cacheTools.get('orgunit_pk_org');
        }
        let type = 'adminroot';

        ajax({
            url:'/nccloud/uapbd/org/setroot.do',
            data:{pk_org: pk_org,type:type},
            success:function(res){
                if(res.success){
                    toast({ color: 'success', title: that.state.json['10100ORG-000048'] });/* 国际化处理： 设置成功！*/
                    that.props.modal.close('setadminorgroot');
                }
            },
            error:(result)=>{
                toast({content:result.message,title:that.state.json['10100ORG-000051'], color: 'warning'});/* 国际化处理： 警告*/
            }
        });
    }

    /**
     * 设置法人公司根节点
     * @param data
     * @returns {*}
     */
    onSetCorpRoot(){
        let that = this;
        let pk_org = that.props.form.getFormItemsValue('org','pk_org').value;
        if(pk_org == undefined){
            pk_org = getDefData('orgunit_pk_org', that.config.datasource);//cacheTools.get('orgunit_pk_org');
        }
        let type = 'corproot';

        ajax({
            url:'/nccloud/uapbd/org/setroot.do',
            data:{pk_org: pk_org,type:type},
            success:function(res){
                if(res.success){
                    toast({ color: 'success', title: that.state.json['10100ORG-000048'] });/* 国际化处理： 设置成功！*/
                    that.props.modal.close('setcorproot');
                }
            },
            error:(result)=>{
                toast({content:result.message,title:that.state.json['10100ORG-000051'], color: 'warning'});/* 国际化处理： 警告*/
            }
        });
    }

    onHideUploader(){
        this.setState({
            showlogoUploader: false,
            showUploader: false,
        })
    }

    beforeUpload(billId, fullPath, file, fileList) {  
        // 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
        let that = this;
        if(fileList.length > 0){
            toast({content:that.state.json['10100ORG-000052'],color:'warning'});/* 国际化处理： logo只允许上传一张图片，请先删除原图片！*/
            return false;
        }
        let isJPG = false;
        if(file.type === 'image/jpeg' || file.type === 'image/png'){
            isJPG = true;
        }

        if (!isJPG) {
            toast({content:that.state.json['10100ORG-000053'],color:'warning'});/* 国际化处理： 只支持jpg,png格式图片！*/
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            toast({content:that.state.json['10100ORG-000054'],color:'warning'});/* 国际化处理： 上传大小小于2M！*/
        }
        return isJPG && isLt2M;
        // 备注： return false 不执行上传  return true 执行上传
    }

    afterInnercustEvent(props, moduleId, key, value,oldValue){
        let meta = props.meta.getMeta();
        meta['innercustsupp'].items.map((obj) => {
            if(obj.attrcode == 'pk_org'){
                //需要根据管控模式判断客商和供应商有没有对应的节点
                ajax({
                    url:'/nccloud/uapbd/org/checknodeoperapower.do',
                    data:{pk_org: value.value},
                    success:(res)=>{
                        if(res.success){
                            //过滤客户基本分类
                            if(res.data){
                                toast({content:res.data,color:'warning'});
                            }
                            meta['innercustsupp'].items.find((item) => item.attrcode == 'pk_custclass').queryCondition =() =>{
                                return {
                                    pk_org:value.value
                                }
                            }
                            //过滤供应商档案
                            meta['innercustsupp'].items.find((item) => item.attrcode == 'pk_supplierclass').queryCondition =() =>{
                                return {
                                    pk_org:value.value
                                }
                            }
                        }
                    },
                });
            }
        })
        props.meta.setMeta(meta);
    }

    onRowDoubleClick(record,props){
    
        let config = {
            pk_vid:record.pk_vid.value,
            pk_org:record.pk_org.value,
            pageTitle:this.state.json['10100ORG-000104'],
            pagecode:'10100ORG_orgcardversion',
            appcode:'10100ORG',
            appid:'0001Z010000000001NOH',
            type:'version',

            subGrid:'org_v',
            subGrid1:'corp_v',
            subGrid2:'hrorg_v',
            subGrid3:'financeorgcard_v',
            subGrid4:'fundorg_v',
            subGrid5:'purchaseorg_v',
            subGrid6:'salesorg_v',
            subGrid61:'saleorgrelation_v',
            subGrid7:'stockorg_v',
            subGrid71:'stocktrafficrelation_v',
            subGrid72:'stockqccenterrelation_v',
            subGrid73:'stockorgrelation_v',
            subGrid74:'stockassetrelation_v',
            subGrid8:'trafficorg_v',
            subGrid9:'qccenter_v',
            subGrid10:'assetorg_v',
            subGrid101:'assetorgmaintainrelation_v',
            subGrid11:'maintainorg_v',
            subGrid111:'maintainstockrelation_v',
            subGrid12:'liabilitycenter_v',
            subGrid13:'itemorg_v',
            subGrid131:'itemstockrelation_v',
            subGrid14:'planbudget_v',
            subGrid15:'adminorg_v',
            subGrid16:'factory_v',
            subGrid17:'plancenter_v'
        };

        this.props.modal.show('orgversion',{
            content: <Orgunitversion {...{config:config}}/>,
            userControl:false//自己控制什么时候关闭窗口
            //beSureBtnClick:this.onSetUnitOrgRoot.bind(this)
        }) 
    }

    pageInfo(props, pk){
        let that = this;
        //页面跳转的时候，需要把前面缓存form清除掉，然后在赋值，不然保存的时候可能获取到前一个缓存的数据
        props.config.orgtypearr.map((obj)=>{
            that.state.childstate[obj.subGrid] = false;
            that.props.form.EmptyAllFormValue(obj.subGrid);
            obj.isshow = false;
        })
        props.setUrlParam({
            status: 'browse',
            pagecode:props.config.pagecode,
            pk_org: pk
        })
        setDefData('orgunit_btnopr', that.config.datasource,'goto');
        this.initData(pk);
        this.onRefresh(pk);
        //如果是集团管理员，设置根节点，需要单独控制一下
        if(getDefData('orgunit_setroot',props.config.datasource)){
            let reqData = [
                {
                    rqUrl: '/uapbd/org/haverootorgunit.do',
                    rqCode: 'haverootorgunit'
                },
                {
                    rqUrl: '/uapbd/org/haveadminrootorgunit.do',
                    rqCode: 'haveadminrootorgunit'
                },
                {
                    rqUrl: '/uapbd/org/havecorprootorgunit.do',
                    rqCode: 'havecorprootorgunit'
                }
            ];
            ajax({
                url : "/nccloud/platform/pub/mergerequest.do",
                data : reqData,
                success : (res) => {
                    if(getDefData('orgunit_setroot',props.config.datasource)){
                        
                        //如果是集团管理员,设置根节点才可以见
                        //当没有行政组织或者法人公司的时候，设置成根行政组织和设置成根法人公司不可用
                        let adminroot = res.data.haveadminrootorgunit;
    
                        if(!adminroot.haveroot){
                            props.button.setButtonDisabled(['setadminorgroot'],true);
                        }else{
                            if(pk == adminroot.pk){
                                //如果勾选的是根节点，则对应的设置根节点按钮不可以使用
                                props.button.setButtonDisabled(['setadminorgroot'],true);
                            }else{
                                props.button.setButtonDisabled(['setadminorgroot'],false);
                            }
                            
                        }
    
                        let corproot = res.data.havecorprootorgunit;
                        if(!corproot.haveroot){
                            props.button.setButtonDisabled(['setcorproot'],true);
                        }else{
                            if(pk == corproot.pk){
                                props.button.setButtonDisabled(['setcorproot'],true);
                            }else{
                                props.button.setButtonDisabled(['setcorproot'],false);
                            }
                            
                        }
    
                        let orgroot = res.data.haverootorgunit;
    
                        if(!orgroot.haveroot){
                            props.button.setButtonDisabled(['setorgroot'],true);
                        }else{
                            if(pk == orgroot.pk){
                                //如果勾选的是根节点，则对应的设置根节点按钮不可以使用
                                props.button.setButtonDisabled(['setorgroot'],true);
                            }else{
                                props.button.setButtonDisabled(['setorgroot'],false);
                            }
                            
                        }
                    }else{
                        props.button.setButtonVisible(['setroot-2'],false);
                    }
                }
            });
        }
    }

    render() {
        if(!this.state.inlt)return '';
        let { cardTable, form, button, modal, cardPagination,table,editTable ,DragWidthCom,syncTree,treeTableManyCol} = this.props;
        const {createCardPagination} = cardPagination;
        let buttons = this.props.button.getButtons();
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createButtonApp } = button;
        let { createModal } = modal;
        let { createSimpleTable } = table;
        let {createSyncTree} = syncTree;
        let { treeTableCol } = treeTableManyCol;
        const { createEditTable } = editTable;

        
        let status = this.props.getUrlParam('status');

        if(status == undefined){
            status = 'browse';
        }

        return (
            <div  id='nc-bill-card'>
                <div className="nc-bill-card orgunit-card">
                    <NCAffix>
                        <div className='nc-bill-header-area'>
                            {status === 'browse'&&
                                <NCBackBtn className='title-search-detail'
                                        onClick={ buttonClick.bind(this,this.config.formId,this.props,'back') }></NCBackBtn>}
                                        <div className="header-title-search-area">
                                            <h2 className='title-search-detail'>{this.state.json['10100ORG-000098']}</h2>
                                        </div>
                                
                            {/* {status=='browse'?<div className='header-button-cardPagination'>
									{createCardPagination({	handlePageInfoChange: pageInfoClick.bind(this)})}
									</div>:''} */}
                            <div className="header-button-area">
                                {createButtonApp({
                                    area: 'header-button-area',//按钮注册中的按钮区域
                                    //buttonLimit: 5,
                                    onButtonClick:buttonClick.bind(this,this.config.formId)
                                    //popContainer: document.querySelector('.header-button-area')
                                })}
                                {this.state.showSubGrid ? <div className='header-button-cardPagination'>
                                {createCardPagination({
                                    handlePageInfoChange: this.pageInfo.bind(this),
                                    urlPkname:'pk_org',
                                    dataSource: this.config.datasource,
                                })}
                            </div> : ''}
                                {/*分页 */}
                                 {/*{createCardPagination({
                                    handlePageInfoChange:pageInfoClick.bind(this)
                                })} */}
                                
                                
                            </div>
                        </div>
                    </NCAffix>

                    <NCAnchor>
                    {this.state.orgtypefloor.map((obj)=>{
                        return (
                        <NCScrollLink
                            to={obj.subGrid}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{obj.subName}</p>
                        </NCScrollLink>);
                    })}
                    </NCAnchor>
                

                    <NCScrollElement style={{marginBottom:'5px'}} name={this.config.formId}>
                    <div className="nc-bill-form-area">
                        {createForm(this.config.formId, {
                            expandArr:['orgtype'],
                            onBeforeEvent:this.beforeEvent.bind(this),
                            onAfterEvent: this.afterEvent.bind(this)
                        })}
                    </div>
                    </NCScrollElement>
                    {this.state.childstate.corp?(
                    <NCScrollElement name={this.config.subGrid1}>
                        <div className="nc-bill-table-area nc-bill-table-list">
                        {this.state.buttonshow ?(
                        <NCCol>
                                <span className="showOff" style={{marginLeft:'20px'}}>
                                    {this.state.json['10100ORG-000064']/* 国际化处理： 法人公司*/}
                                    <NCSwitch
                                    id = 'orgShowDisable'
                                    checked={this.state.childstate.corp}
                                    onChange={this.showOffChange.bind(this,this.config.subGrid1)}
                                    ></NCSwitch>
                                </span>
                        </NCCol> 
                        ):('')}   
                            <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.corp}>
                            <div>
                            {createButtonApp({
                                area: 'corporgtype-button-area',
                                buttonLimit: 5,
                                onButtonClick: oprButtonClick.bind(this,this.config.subGrid1),
                                popContainer: document.querySelector('.childline-button-area')
                            })}
                            {createForm(this.config.subGrid1, {
                                onBeforeEvent:this.beforeEvent.bind(this),
                                onAfterEvent: this.afterEvent.bind(this)
                            })}
                            </div>
                            </NCCollapse>
                        </div>
                    </NCScrollElement>
                    ):('')
                    }
                    {this.state.childstate.hrorg?(
                        <NCScrollElement name={this.config.subGrid2}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            {this.state.buttonshow ?(
                            <NCCol>
                                <span className="showOff">
                                    {this.state.json['10100ORG-000065']/* 国际化处理： 人力资源*/}
                                    <NCSwitch 
                                        id = 'orgShowDisable'
                                        checked={this.state.childstate.hrorg}
                                        onChange={this.showOffChange.bind(this,this.config.subGrid2)}
                                        ></NCSwitch>
                                </span>
                            </NCCol>
                        ):('')}
                            <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.hrorg}>
                            <div>
                                {createButtonApp({
                                    area: 'hrorgorgtype-button-area',
                                    buttonLimit: 5,
                                    onButtonClick: oprButtonClick.bind(this,this.config.subGrid2),
                                    popContainer: document.querySelector('.childline-button-area')
                                })}
                                {createForm(this.config.subGrid2, {
                                    onBeforeEvent:this.beforeEvent.bind(this),
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                            </div>
                            </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    {this.state.childstate.financeorg?(
                        <NCScrollElement name={this.config.subGrid3}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            {this.state.buttonshow ?(
                            <NCCol>
                                <span className="showOff" style={{marginLeft:'20px'}}>
                                    {this.state.json['10100ORG-000066']/* 国际化处理： 财务*/}
                                    <NCSwitch 
                                        id = 'orgShowDisable'
                                        checked={this.state.childstate.financeorg}
                                        onChange={this.showOffChange.bind(this,this.config.subGrid3)}
                                        ></NCSwitch>
                                </span>
                            </NCCol>
                            ):('')}
                            <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.financeorg}>
                            <div>
                                {createButtonApp({
                                    area: 'financeorgorgtype-button-area',
                                    buttonLimit: 5,
                                    onButtonClick: oprButtonClick.bind(this,this.config.subGrid3),
                                    popContainer: document.querySelector('.childline-button-area')
                                })}
                                {createForm(this.config.subGrid3, {
                                    onBeforeEvent:this.beforeEvent.bind(this),
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                            </div>
                            </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    {this.state.childstate.fundorg?(
                        <NCScrollElement name={this.config.subGrid4}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            {this.state.buttonshow ?(
                            <NCCol>
                                <span className="showOff" style={{marginLeft:'20px'}}>
                                    {this.state.json['10100ORG-000067']/* 国际化处理： 资金*/}
                                    <NCSwitch 
                                        id = 'orgShowDisable'
                                        checked={this.state.childstate.fundorg}
                                        onChange={this.showOffChange.bind(this,this.config.subGrid4)}
                                        ></NCSwitch>
                                </span>
                            </NCCol>
                            ):('')}
                            <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.fundorg}>
                            <div>
                                {createButtonApp({
                                    area: 'fundorgorgtype-button-area',
                                    buttonLimit: 5,
                                    onButtonClick: oprButtonClick.bind(this,this.config.subGrid4),
                                    popContainer: document.querySelector('.childline-button-area')
                                })}
                                {createForm(this.config.subGrid4, {
                                    onBeforeEvent:this.beforeEvent.bind(this),
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                            </div>
                            </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    {this.state.childstate.purchaseorg?(
                        <NCScrollElement name={this.config.subGrid5}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            {this.state.buttonshow ?(
                            <NCCol>
                                <span className="showOff" style={{marginLeft:'20px'}}>
                                   { this.state.json['10100ORG-000068']/* 国际化处理： 采购*/}
                                    <NCSwitch 
                                        id = 'orgShowDisable'
                                        checked={this.state.childstate.purchaseorg}
                                        onChange={this.showOffChange.bind(this,this.config.subGrid5)}
                                        ></NCSwitch>
                                </span>
                            </NCCol>
                            ):('')}
                            <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.purchaseorg}>
                            <div>
                                {createButtonApp({
                                    area: 'purchaseorgorgtype-button-area',
                                    buttonLimit: 5,
                                    onButtonClick: oprButtonClick.bind(this,this.config.subGrid5),
                                    popContainer: document.querySelector('.childline-button-area')
                                })}
                                {createForm(this.config.subGrid5, {
                                    onBeforeEvent:this.beforeEvent.bind(this),
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                            </div>
                            </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    {this.state.childstate.saleorg?(
                        <NCScrollElement name={this.config.subGrid6}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            {this.state.buttonshow ?(
                            <NCCol>
                                <span className="showOff" style={{marginLeft:'20px'}}>
                                    {this.state.json['10100ORG-000069']/* 国际化处理： 销售*/}
                                    <NCSwitch 
                                        id = 'orgShowDisable'
                                        checked={this.state.childstate.saleorg}
                                        onChange={this.showOffChange.bind(this,this.config.subGrid6)}
                                        ></NCSwitch>
                                </span>
                            </NCCol>
                            ):('')}
                            <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.saleorg}>
                            <div>
                                {createButtonApp({
                                    area: 'saleorgorgtype-button-area',
                                    buttonLimit: 5,
                                    onButtonClick: oprButtonClick.bind(this,this.config.subGrid6),
                                    popContainer: document.querySelector('.childline-button-area')
                                })}
                                {createForm(this.config.subGrid6, {
                                    onBeforeEvent:this.beforeEvent.bind(this),
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                                {this.state.buttonshow ?(
                                <div class="operator operator-tit">
                                    {this.state.json['10100ORG-000070']/* 国际化处理： 销售业务委托关系*/}
                                    <span className='wuliu'></span>
                                </div>
                                ):('')}
                                {createForm(this.config.subGrid61, {
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                                
                            </div>
                            </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    {this.state.childstate.stockorg?(
                        <NCScrollElement name={this.config.subGrid7}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            {this.state.buttonshow ?(
                            <NCCol>
                                <span className="showOff" style={{marginLeft:'20px'}}>
                                    {this.state.json['10100ORG-000071']/* 国际化处理： 库存*/}
                                    <NCSwitch 
                                        id = 'orgShowDisable'
                                        checked={this.state.childstate.stockorg}
                                        onChange={this.showOffChange.bind(this,this.config.subGrid7)}
                                        ></NCSwitch>
                                </span>
                            </NCCol>
                            ):('')}
                            <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.stockorg}>
                            <div>
                                {createButtonApp({
                                    area: 'stockorgorgtype-button-area',
                                    buttonLimit: 5,
                                    onButtonClick: oprButtonClick.bind(this,this.config.subGrid7),
                                    popContainer: document.querySelector('.childline-button-area')
                                })}
                                
                                {createForm(this.config.subGrid7, {
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                                {this.state.buttonshow ?(
                                <div class="operator operator-tit">
                                    {this.state.json['10100ORG-000072']/* 国际化处理： 物流业务委托关系*/}
                                    <span className='wuliu'></span>
                                </div>
                                ):('')}
                                {createForm(this.config.subGrid71, {
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                                {this.state.buttonshow ?(
                                <div class="operator operator-tit">
                                    {this.state.json['10100ORG-000073']/* 国际化处理： 质检业务委托关系*/}
                                    <span className='wuliu'></span>
                                </div>
                                ):('')}
                                {createForm(this.config.subGrid72, {
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                                {this.state.buttonshow ?(
                                <div class="operator operator-tit">
                                    {this.state.json['10100ORG-000074']/* 国际化处理： 采购业务委托关系*/}
                                    <span className='wuliu'></span>
                                </div>
                                ):('')}
                                {createForm(this.config.subGrid73, {
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                                {this.state.buttonshow ?(
                                <div class="operator operator-tit">
                                    {this.state.json['10100ORG-000075']/* 国际化处理： 资产库存业务委托关系*/}
                                    <span className='wuliu'></span>
                                </div>
                                ):('')}
                                {createForm(this.config.subGrid74, {
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                                
                            </div>
                            </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    {this.state.childstate.trafficorg?(
                        <NCScrollElement name={this.config.subGrid8}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            {this.state.buttonshow ?(
                            <NCCol>
                                <span className="showOff" style={{marginLeft:'20px'}}>
                                    {this.state.json['10100ORG-000076']/* 国际化处理： 物流*/}
                                    <NCSwitch 
                                        id = 'orgShowDisable'
                                        checked={this.state.childstate.trafficorg}
                                        onChange={this.showOffChange.bind(this,this.config.subGrid8)}
                                        ></NCSwitch>
                                </span>
                            </NCCol>
                            ):('')}
                            <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.trafficorg}>
                            <div>
                                {createButtonApp({
                                    area: 'trafficorgorgtype-button-area',
                                    buttonLimit: 5,
                                    onButtonClick: oprButtonClick.bind(this,this.config.subGrid8),
                                    popContainer: document.querySelector('.childline-button-area')
                                })}
                                {createForm(this.config.subGrid8, {
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                            </div>
                            </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    {this.state.childstate.qccenter?(
                        <NCScrollElement name={this.config.subGrid9}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            <NCCol>
                            {this.state.buttonshow ?(
                                <span className="showOff" style={{marginLeft:'20px'}}>
                                    {this.state.json['10100ORG-000077']/* 国际化处理： 质检*/}
                                    <NCSwitch 
                                        id = 'orgShowDisable'
                                        checked={this.state.childstate.qccenter}
                                        onChange={this.showOffChange.bind(this,this.config.subGrid9)}
                                        ></NCSwitch>
                                </span>):('')
                            }
                            </NCCol>
                            <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.qccenter}>
                            <div>
                                {createButtonApp({
                                    area: 'qccenterorgtype-button-area',
                                    buttonLimit: 5,
                                    onButtonClick: oprButtonClick.bind(this,this.config.subGrid9),
                                    popContainer: document.querySelector('.childline-button-area')
                                })}
                                {createForm(this.config.subGrid9, {
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                            </div>
                            </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    {this.state.childstate.assetorg?(
                        <NCScrollElement name={this.config.subGrid10}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            {this.state.buttonshow ?(
                            <NCCol>
                                <span className="showOff" style={{marginLeft:'20px'}}>
                                    {this.state.json['10100ORG-000078']/* 国际化处理： 资产*/}
                                    <NCSwitch 
                                        id = 'orgShowDisable'
                                        checked={this.state.childstate.assetorg}
                                        onChange={this.showOffChange.bind(this,this.config.subGrid10)}
                                        ></NCSwitch>
                                </span>
                            </NCCol>
                            ):('')}
                            <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.assetorg}>
                            <div>
                                {createButtonApp({
                                    area: 'assetorgorgtype-button-area',
                                    buttonLimit: 5,
                                    onButtonClick: oprButtonClick.bind(this,this.config.subGrid10),
                                    popContainer: document.querySelector('.childline-button-area')
                                })}
                                {createForm(this.config.subGrid10, {
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                                {this.state.buttonshow ?(
                                <div class="operator operator-tit">
                                    {this.state.json['10100ORG-000079']/* 国际化处理： 资产维修业务委托关系*/}
                                    <span className='wuliu'></span>
                                </div>
                                ):('')}
                                {createForm(this.config.subGrid101, {
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                            </div>
                            </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    {this.state.childstate.maintainorg?(
                        <NCScrollElement name={this.config.subGrid11}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            {this.state.buttonshow ?(
                            <NCCol>
                                <span className="showOff" style={{marginLeft:'20px'}}>
                                    {this.state.json['10100ORG-000080']/* 国际化处理： 维修*/}
                                    <NCSwitch 
                                        id = 'orgShowDisable'
                                        checked={this.state.childstate.maintainorg}
                                        onChange={this.showOffChange.bind(this,this.config.subGrid11)}
                                        ></NCSwitch>
                                </span>
                            </NCCol>
                            ):('')}
                            <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.maintainorg}>
                            <div>
                                {createButtonApp({
                                    area: 'maintainorgorgtype-button-area',
                                    buttonLimit: 5,
                                    onButtonClick: oprButtonClick.bind(this,this.config.subGrid11),
                                    popContainer: document.querySelector('.childline-button-area')
                                })}
                                {createForm(this.config.subGrid11, {
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                                {this.state.buttonshow ?(
                                <div class="operator operator-tit">
                                    {this.state.json['10100ORG-000081']/* 国际化处理： 维修库存业务委托关系*/}
                                    <span className='wuliu'></span>
                                </div>
                                ):('')}
                                {createForm(this.config.subGrid111, {
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                                
                            </div>
                            </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    {this.state.childstate.liabilitycenter?(
                        <NCScrollElement name={this.config.subGrid12}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            {this.state.buttonshow ?(
                            <NCCol>
                                <span className="showOff" style={{marginLeft:'20px'}}>
                                    {this.state.json['10100ORG-000003']/* 国际化处理： 利润中心*/}
                                    <NCSwitch 
                                        id = 'orgShowDisable'
                                        checked={this.state.childstate.liabilitycenter}
                                        onChange={this.showOffChange.bind(this,this.config.subGrid12)}
                                        ></NCSwitch>
                                </span>
                            </NCCol>
                            ):('')}
                            <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.liabilitycenter}>
                            <div>
                                {createButtonApp({
                                    area: 'liabilitycenterorgtype-button-area',
                                    buttonLimit: 5,
                                    onButtonClick: oprButtonClick.bind(this,this.config.subGrid12),
                                    popContainer: document.querySelector('.childline-button-area')
                                })}
                                {createForm(this.config.subGrid12, {
                                    onBeforeEvent:this.beforeEvent.bind(this),
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                            </div>
                            </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    {this.state.childstate.itemorg?(
                        <NCScrollElement name={this.config.subGrid13}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            {this.state.buttonshow ?(
                            <NCCol>
                                <span className="showOff" style={{marginLeft:'20px'}}>
                                    {this.state.json['10100ORG-000082']/* 国际化处理： 项目*/}
                                    <NCSwitch 
                                        id = 'orgShowDisable'
                                        checked={this.state.childstate.itemorg}
                                        onChange={this.showOffChange.bind(this,this.config.subGrid13)}
                                        ></NCSwitch>
                                </span>
                            </NCCol>
                            ):('')}
                            <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.itemorg}>
                            <div>
                                {createButtonApp({
                                    area: 'itemorgorgtype-button-area',
                                    buttonLimit: 5,
                                    onButtonClick: oprButtonClick.bind(this,this.config.subGrid13),
                                    popContainer: document.querySelector('.childline-button-area')
                                })}
                                {createForm(this.config.subGrid13, {
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                                {this.state.buttonshow ?(
                                <div class="operator operator-tit">
                                    {this.state.json['10100ORG-000083']/* 国际化处理： 项目库存业务委托关系*/}
                                    <span className='wuliu'></span>
                                </div>
                                ):('')}
                                {createForm(this.config.subGrid131, {
                                    onAfterEvent: this.afterEvent.bind(this)
                                })}
                                
                            </div>
                            </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    {this.state.childstate.planbudget?(
                        <NCScrollElement name={this.config.subGrid14}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            {this.state.buttonshow ?(
                                <NCCol>
                                    <span className="showOff" style={{marginLeft:'20px'}}>
                                        {this.state.json['10100ORG-000084']/* 国际化处理： 预算*/}
                                        <NCSwitch 
                                            id = 'orgShowDisable'
                                            checked={this.state.childstate.planbudget}
                                            onChange={this.showOffChange.bind(this,this.config.subGrid14)}
                                            ></NCSwitch>
                                    </span>
                                </NCCol>
                            ):('')}
                                <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.planbudget}>
                                    <div>
                                        {createButtonApp({
                                            area: 'planbudgetorgtype-button-area',
                                            buttonLimit: 5,
                                            onButtonClick: oprButtonClick.bind(this,this.config.subGrid14),
                                            popContainer: document.querySelector('.childline-button-area')
                                        })}
                                        {createForm(this.config.subGrid14, {
                                            onAfterEvent: this.afterEvent.bind(this)
                                        })}
                                    </div>
                                </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    {this.state.childstate.adminorg?(
                        <NCScrollElement name={this.config.subGrid15}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            {this.state.buttonshow ?(
                                <NCCol>
                                    <span className="showOff" style={{marginLeft:'20px'}}>
                                        {this.state.json['10100ORG-000085']/* 国际化处理： 行政*/}
                                        <NCSwitch 
                                            id = 'orgShowDisable'
                                            checked={this.state.childstate.adminorg}
                                            onChange={this.showOffChange.bind(this,this.config.subGrid15)}
                                            ></NCSwitch>
                                    </span>
                                </NCCol>
                            ):('')}
                                <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.adminorg}>
                                    <div>
                                        {createButtonApp({
                                            area: 'adminorgorgtype-button-area',
                                            buttonLimit: 5,
                                            onButtonClick: oprButtonClick.bind(this,this.config.subGrid15),
                                            popContainer: document.querySelector('.childline-button-area')
                                        })}
                                        {createForm(this.config.subGrid15, {
                                            onBeforeEvent:this.beforeEvent.bind(this),
                                            onAfterEvent: this.afterEvent.bind(this)
                                        })}
                                    </div>
                                </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    {this.state.childstate.factory?(
                        <NCScrollElement name={this.config.subGrid16}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            {this.state.buttonshow ?(
                                <NCCol>
                                    <span className="showOff" style={{marginLeft:'20px'}}>
                                        {this.state.json['10100ORG-000086']/* 国际化处理： 工厂*/}
                                        <NCSwitch 
                                            id = 'orgShowDisable'
                                            checked={this.state.childstate.factory}
                                            onChange={this.showOffChange.bind(this,this.config.subGrid16)}
                                            ></NCSwitch>
                                    </span>
                                </NCCol>
                            ):('')}
                                <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.factory}>
                                    <div>
                                        {createButtonApp({
                                            area: 'factoryorgtype-button-area',
                                            buttonLimit: 5,
                                            onButtonClick: oprButtonClick.bind(this,this.config.subGrid16),
                                            popContainer: document.querySelector('.childline-button-area')
                                        })}
                                        {createForm(this.config.subGrid16, {
                                            onAfterEvent: this.afterEvent.bind(this)
                                        })}
                                    </div>
                                </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    
                    {this.state.childstate.plancenter?(
                        <NCScrollElement name={this.config.subGrid17}>
                            <div className="nc-bill-table-area nc-bill-table-list">
                            {this.state.buttonshow ?(
                                <NCCol>
                                    <span className="showOff" style={{marginLeft:'20px'}}>
                                        {this.state.json['10100ORG-000087']/* 国际化处理： 计划中心*/}
                                        <NCSwitch 
                                            id = 'orgShowDisable'
                                            checked={this.state.childstate.plancenter}
                                            onChange={this.showOffChange.bind(this,this.config.subGrid17)}
                                            ></NCSwitch>
                                    </span>
                                </NCCol>
                            ):('')}
                                <NCCollapse style={{marginBottom:'5px'}} in={this.state.childstate.plancenter}>
                                    <div>
                                        {createButtonApp({
                                            area: 'plancenterorgtype-button-area',
                                            buttonLimit: 5,
                                            onButtonClick: oprButtonClick.bind(this,this.config.subGrid17),
                                            popContainer: document.querySelector('.childline-button-area')
                                        })}
                                        {createForm(this.config.subGrid17, {
                                            onAfterEvent: this.afterEvent.bind(this)
                                        })}
                                    </div>
                                </NCCollapse>
                            </div>
                        </NCScrollElement>
                        ):('')
                    }
                    { createModal('org_v',{
                        title:this.state.json['10100ORG-000056'],/* 国际化处理： 版本化*/
                        content:function(){
                            return(
                                <div>
                                    <div className='orgunit-financeorg'>
                                        {createForm('org_v_head')}
                                         <div className="nc-singleTable-table-area">
                                            {createSimpleTable('org_v', {
                                                onRowDoubleClick:this.onRowDoubleClick.bind(this),
                                                showIndex:true
                                        })}</div>
                                    </div>
                                </div>
                            )
                        }.bind(this)(),
                        userControl:false,//自己控制什么时候关闭窗口
                        noFooter : false, //是否需要底部按钮,默认true
                        beSureBtnClick:this.onSaveVersion.bind(this)
                    }) }
                    { createModal('financeorg_v',{
                        content:function(){
                            return(
                                <div>
                                    <div>
                                        {createForm('financeorg_v')}
                                    </div>
                                </div>
                            )
                        }.bind(this)(),
                        userControl:false,//自己控制什么时候关闭窗口
                        noFooter : false, //是否需要底部按钮,默认true
                        beSureBtnClick:this.onSaveFinanceVersion.bind(this)
                    }) }
                    { createModal('orgmanager',{
                        title:this.state.json['10100ORG-000057'],/* 国际化处理： 组织主管*/
                        content:function(){
                            return(
                                <div>
                                    <div style={{height: 45,marginTop: -15}}>
                                        <div style={{position: 'relative',height:'100%'}}>
                                            <div className='orgmanager-button-parent'>
                                                {createButtonApp({
                                                    area: 'orgmanager-button-area',
                                                    buttonLimit: 5,
                                                    onButtonClick: this.onOrgManageButtonClick.bind(this), 
                                                    popContainer: document.querySelector('.orgmanager-button-area')
                                                })}
                                            </div>
                                            <span className='orgmanager-button-text'>
                                                {this.state.json['10100ORG-000088']/* 国际化处理： 所属组织*/}:{getDefData('orgunit_name', this.config.datasource)}
                                            </span>
                                        </div>
                                    </div>
                                    {createEditTable('orgmanager', {
                                        //onCloseModel:this.onCloseTableModel.bind(this),
                                        //tableModelConfirm:this.onModelConfirm.bind(this),
                                        onAfterEvent:this.onTableModelAfterEdit.bind(this),
                                        //onBeforeEvent:this.onTableModelBeforeEdit.bind(this),
                                        //statusChange: this.gridStatusChange.bind(this),
                                        //selectedChange:this.gridBeChecked.bind(this),
                                        onSelected: ()=>{
                                            let data = this.props.editTable.getCheckedRows('orgmanager');
                                            if(data.length > 0){
                                                this.props.button.setButtonDisabled(['orgmanagedel'],false);
                                            }else{
                                                this.props.button.setButtonDisabled(['orgmanagedel'],true);
                                            }
                                        },
                                        showCheck:true,
                                        showIndex:true
                                    })}
                                </div>
                            )
                        }.bind(this)(),
                        userControl:true,//自己控制什么时候关闭窗口
                        cancelBtnClick: ()=>{//无法控制是否关闭模态框
                            promptBox({
                                color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                title: this.state.json['10100ORG-000100'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                                noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                                hasCloseBtn:false,
                                content: this.state.json['10100ORG-000002'],/* 国际化处理： 您确定要取消吗？*/
                                beSureBtnClick: () =>{
                                    this.props.modal.close('orgmanager');
                                    this.props.editTable.setStatus('orgmanager','browse');
                                }   
                            })
                            // this.props.modal.show('warning',{
                            //     beSureBtnClick:()=>{
                            //         this.props.modal.close('orgvatfunclet');
                            //         this.props.modal.close('warning');
                            //     }
                            // });
                        },
                        noFooter : true, //是否需要底部按钮,默认true
                        //beSureBtnClick:this.onSaveOrgManager.bind(this)
                    }) }
                    { createModal('orgmoduleperiod',{
                        title:this.state.json['10100ORG-000058'],/* 国际化处理： 批量设置业务期初期间*/
                        content:function(){
                            return(
                                <div>
                                    <div style={{height: 45,marginTop:-10}}>
                                        <div style={{position: 'relative',height:'100%'}}>
                                            <div style={{position: 'absolute', height: '100%',right:0,top: 5}}>
                                                {createButtonApp({
                                                    area: 'period-button-area',
                                                    buttonLimit: 5,
                                                    onButtonClick: this.onOrgPeirodButtonClick.bind(this), 
                                                    popContainer: document.querySelector('.period-button-area')
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='orgunit-card-orgmoduleperiod'>
                                        {createEditTable('orgmoduleperiod', {
                                            //onCloseModel:this.onCloseTableModel.bind(this),
                                            //tableModelConfirm:this.onModelConfirm.bind(this),
                                            //onAfterEvent:this.onTableModelAfterEdit.bind(this),
                                            //statusChange: this.gridStatusChange.bind(this),
                                            //selectedChange:this.gridBeChecked.bind(this),
                                            //showCheck:true,
                                            onBeforeEvent:this.onPeriodBeforeEvent.bind(this),
                                            showIndex:true,
                                            adaptionHeight:true,
                                        })}
                                    </div>
                                </div>
                            )
                        }.bind(this)(),
                        userControl:true,//自己控制什么时候关闭窗口
                        noFooter : true, //是否需要底部按钮,默认true
                        cancelBtnClick: ()=>{//无法控制是否关闭模态框
                            promptBox({
                                color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                title: this.state.json['10100ORG-000100'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                                noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                                hasCloseBtn:false,
                                content: this.state.json['10100ORG-000002'],/* 国际化处理： 您确定要取消吗？*/
                                beSureBtnClick: () =>{
                                    this.props.modal.close('orgmoduleperiod');
                                    this.props.editTable.setStatus('orgmoduleperiod','browse');
                                }   
                            })
                            // this.props.modal.show('warning',{
                            //     beSureBtnClick:()=>{
                            //         this.props.modal.close('orgvatfunclet');
                            //         this.props.modal.close('warning');
                            //     }
                            // });
                        },
                        beSureBtnClick:this.onSaveOrgPeriod.bind(this)
                    }) }
                    { createModal('innercustsupp',{
                        title:this.state.json['10100ORG-000059'],/* 国际化处理： 生成内部客商*/
                        content:function(){
                            return(
                                <div>
                                    <div>
                                    {createForm('innercustsupp', {
                                        setVisibleByForm:true,
                                        onAfterEvent: this.afterInnercustEvent.bind(this)
                                    })}
                                    </div>
                                </div>
                            )
                        }.bind(this)(),
                        userControl:true,//自己控制什么时候关闭窗口
                        noFooter : false, //是否需要底部按钮,默认true
                        cancelBtnClick: ()=>{//无法控制是否关闭模态框
                            promptBox({
                                color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                title: this.state.json['10100ORG-000100'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                                noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                                hasCloseBtn:false,
                                content: this.state.json['10100ORG-000002'],/* 国际化处理： 您确定要取消吗？*/
                                beSureBtnClick: () =>{
                                    this.props.modal.close('innercustsupp');
                                    this.props.form.setFormStatus('innercustsupp','browse');
                                }   
                            })
                            // this.props.modal.show('warning',{
                            //     beSureBtnClick:()=>{
                            //         this.props.modal.close('orgvatfunclet');
                            //         this.props.modal.close('warning');
                            //     }
                            // });
                        },
                        beSureBtnClick:this.onSaveOrgInnercust.bind(this)
                    }) }
                    { createModal('orgvatfunclet',{
                        title:this.state.json['10100ORG-000060'],/* 国际化处理： VAT维护*/
                        content:function(){
                            return(
                                <div>
                                    <div style={{height: 45,marginTop:-10}}>
                                        <div style={{position: 'relative',height:'100%'}}>
                                            <div style={{position: 'absolute', height: '100%',right:0,top: 5}}>
                                                {createButtonApp({
                                                    area: 'vat-button-area',
                                                    buttonLimit: 5,
                                                    onButtonClick: this.onOrgVATButtonClick.bind(this), 
                                                    popContainer: document.querySelector('.vat-button-area')
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    {createEditTable('orgvatfunclet', {
                                        //onBeforeEvent:this.onPeriodBeforeEvent.bind(this),
                                        onAfterEvent:this.onVATTableModelAfterEdit.bind(this),
                                        onSelected: ()=>{
                                            let checkdata = this.props.editTable.getCheckedRows('orgvatfunclet');
                                            if(checkdata.length > 0){
                                                this.props.button.setButtonDisabled(['vatdel'],false);
                                                this.props.button.setButtonDisabled(['vatlinedel'],false);
                                            }else{
                                                this.props.button.setButtonDisabled(['vatdel'],true);
                                                this.props.button.setButtonDisabled(['vatlinedel'],true);
                                            }
                                        },
                                        onSelectedAll: ()=>{
                                            let checkdata = this.props.editTable.getCheckedRows('orgvatfunclet');
                                            if(checkdata.length > 0){
                                                this.props.button.setButtonDisabled(['vatdel'],false);
                                                this.props.button.setButtonDisabled(['vatlinedel'],false);
                                            }else{
                                                this.props.button.setButtonDisabled(['vatdel'],true);
                                                this.props.button.setButtonDisabled(['vatlinedel'],true);
                                            }
                                        },
                                        showIndex:true,
                                        showCheck:true
                                    })}
                                </div>
                            )
                        }.bind(this)(),
                        userControl:true,//自己控制什么时候关闭窗口
                        //beSureBtnClick:this.onSaveOrgVAT.bind(this),
                        noFooter : true, //是否需要底部按钮,默认true
                        cancelBtnClick: ()=>{//无法控制是否关闭模态框
                            promptBox({
                                color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                title: this.state.json['10100ORG-000100'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                                noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                                hasCloseBtn:false,
                                content: this.state.json['10100ORG-000002'],/* 国际化处理： 您确定要取消吗？*/
                                beSureBtnClick: () =>{
                                    this.props.modal.close('orgvatfunclet');
                                    this.props.editTable.setStatus('orgvatfunclet','browse');
                                }   
                            })
                            // this.props.modal.show('warning',{
                            //     beSureBtnClick:()=>{
                            //         this.props.modal.close('orgvatfunclet');
                            //         this.props.modal.close('warning');
                            //     }
                            // });
                        }
                    }) }

                    { createModal('orgdept',{
                        title:this.state.json['10100ORG-000061'],/* 国际化处理： 业务单元关联部门*/

                        content:function(){
                            return(
                                <div className="tree-table">
                                    <DragWidthCom
                                        //业务单元树
                                        leftDom = {
                                            <div className="tree-area-dept" >
                                                {createSyncTree({
                                                    treeId:'orgunittree',
                                                    showLine:true, 
                                                   // clickEditIconEveclickEditIconEve: this.onEditSys.bind(this), //编辑点击 回调
                                                   //clickDelIconEve: this.onDeleteSysEve.bind(this), // 删除点击 回调
                                                   // clickAddIconEve: this.onAdd.bind(this), //新增点击 回调
                                                    onSelectEve: this.onSelectEve.bind(this),   //选择节点回调方法
                                                    defaultExpandAll:true,   //初始化展开所有节点  ，默认参数为false,不展开
                                                    onMouseEnterEve:this.onMouseEnterSortTreeEve.bind(this),//鼠标滑过节点事件
                                                    showModal:false
                                                })}
                                            </div>
                                        } 
                                        //部门---树状表
                                        rightDom = {
                                            <div className="treeTableCol">
                                                <div className="version-head">
                                                        { treeTableCol( 'orgdept',{
                                                            async:false,    //数据同步加载为false,异步加载为true
                                                            //showCheckBox:true,
                                                            //checkedType:'radio',
                                                            defaultExpandAll:true,   //初始化展开所有节点  ，默认参数为false,不展开
                                                        } ) }
                                                </div>
                                            </div>
                                        }  
                                        defLeftWid = '30%'  // 默认左侧区域宽度，px/百分百 
                                    />
                            </div>
                            )
                        }.bind(this)(),
                        userControl:false,//自己控制什么时候关闭窗口
                        //beSureBtnClick:this.onSaveOrgVAT.bind(this)
                    }) }
                    {this.state.showUploader&&<NCUploader 
                                            // billId={cacheTools.get('pk_org')} 
                                            billId={'uapbd/null/'+getDefData('orgunit_pk_org', this.config.datasource)}
                                            //billNo={'001'}
                                            //target={target}
                                            placement={'bottom_right'}
                                            multiple={true}
                                            onHide={this.onHideUploader.bind(this)}
                                            //beforeUpload={this.beforeUpload} 
                                            />}

                    {this.state.showlogoUploader&&<NCUploader 
                        // billId={cacheTools.get('pk_org')} 
                        billId={'logo/'+getDefData('orgunit_pk_org', this.config.datasource)}
                        //billNo={'001'}
                        //target={target}
                        placement={'bottom_right'}
                        multiple={false}
                        beforeUpload={this.beforeUpload.bind(this)} 
                        onHide={this.onHideUploader.bind(this)}
                        />}

                    { createModal('setorgroot',{
                        title:this.state.json['10100ORG-000027'],/* 国际化处理： 提示*/
                        content: this.state.json['10100ORG-000028'],/* 国际化处理： 您确定要设置成根业务单元吗？*/
                        userControl:false,//自己控制什么时候关闭窗口
                        noFooter : false, //是否需要底部按钮,默认true
                        beSureBtnClick:this.onSetUnitOrgRoot.bind(this)
                    }) }
                    { createModal('setadminorgroot',{
                        title:this.state.json['10100ORG-000027'],/* 国际化处理： 提示*/
                        content: this.state.json['10100ORG-000030'],/* 国际化处理： 您确定要设置成根行政组织吗？*/
                        userControl:false,//自己控制什么时候关闭窗口
                        noFooter : false, //是否需要底部按钮,默认true
                        beSureBtnClick:this.onSetAdminOrgRoot.bind(this)
                    }) }
                    { createModal('setcorproot',{
                        title:this.state.json['10100ORG-000027'],/* 国际化处理： 提示*/
                        content: this.state.json['10100ORG-000029'],/* 国际化处理： 您确定要设置成根公司吗？*/
                        noFooter : false, //是否需要底部按钮,默认true
                        userControl:false,//自己控制什么时候关闭窗口
                        beSureBtnClick:this.onSetCorpRoot.bind(this)
                    }) }
                    <PrintOutput
                        ref='printOutput'
                        url='/nccloud/uapbd/org/print.do'
                        data={{
                            funcode:'10100ORG',      //功能节点编码，即模板编码
                            nodekey:'cardPrint',     //模板节点标识
                            oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                            outputType: "output"
                        }}
                        //callback={this.onSubmit}
                        >
                    </PrintOutput>
                    <div className='orgversion-table'>
                        {createModal('orgversion',{
                            noFooter : false //是否需要底部按钮,默认true
                        })}
                    </div>
                    
                    {createModal('warning',{
                        title:this.state.json['10100ORG-000062'],/* 国际化处理： 关闭提醒*/
                        content:this.state.json['10100ORG-000063'],/* 国际化处理： 是否确定要关闭？*/
                    })}
                    {createModal('delete')}
                    {createModal('confirm')}
                </div>
            </div>

        );
    }
}

function  toggleShow (props,enablestate){
    if(enablestate =='2'){//启用状态
        props.button.setButtonsVisible({
            disable:true,
            enable:false,
        });
    }else{
        props.button.setButtonsVisible({
            disable:false,
            enable:true,
        });
    }
}

export default  Orgunitcard = createPage({
    
    //initTemplate: ()=>{}
    mutiLangCode: '10100ORG'
})(Orgunitcard);




//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65