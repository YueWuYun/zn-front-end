//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { Component } from 'react';
import { createPage, ajax, base, toast ,cacheTools,high} from 'nc-lightapp-front';
const { NCAffix,NCAnchor,NCScrollElement,NCScrollLink,NCCol,NCCheckbox,NCSwitch,NCMessage,NCCollapse,NCDiv} = base;

import createUIDom from '../../../public/utils/BDCreateUIDom';

const queryorgtypeUrl = '/nccloud/uapbd/org/queryallorgtype.do';        //查询所有组织类型
const queryorgunitversionUrl = '/nccloud/uapbd/org/queryorgunitversionUrl.do';  
const queryorgunitUrl = '/nccloud/uapbd/org/queryorgtype.do';         //查询组织类型vo


var headareaname = 'org'
class Orgunitversion extends Component {
    constructor(props) {
        super(props);
        this.config = props.config ;
        if(this.config && this.config['templatedata'] != undefined){
            this.lang = props.config.json;
            this.state = this.createState();
            headareaname = 'org_v_form';
            this.state.json = this.config.json;
            this.queryRoot(this.config['templatedata'],props);
            props.meta.setMeta(this.config['templatedata'],()=>{
                this.setState(this.state, () => {
                    this.browseCard(this.config.pk_vid);
                });
            });
        }else{
            var config1 = {
                pagecode:'10100ORG_orgunit',
                datasource : 'uapbd.org.orgunit.orgunit',
                appcode:'10100ORG',
                gridId:'orglist',
            };
            createUIDom(props)(config1,{moduleId: "10100ORG",domainName: 'uapbd' }, (data, lang)=> {
                headareaname = 'org';
                this.lang = lang;
                this.state = this.createState(data);
                this.state.json = lang;
                this.queryRoot(data,props);
                this.setState(this.state,()=>{
                    props.meta.setMeta(data && data.template ? data.template:{},()=>{
                        this.browseCard(this.props.getUrlParam('pk_org') || undefined);
                    })
                })
            });
        }

        window.onbeforeunload = () => {
            if(this.state.editMode == 'edit')
                return;
            else
                return;
        };
    }
    createState(template){
        var me = this,
            props = this.props,
            popContainer = document.querySelector('.childline-button-area'),
            commonCardName = (arename) =>{
                return 'subname-' + arename || 'null';
            },
            isshow = function(){
                if(props.form.getFormItemsValue(headareaname,this.orgtypeitem) != null){
                    return props.form.getFormItemsValue(headareaname,this.orgtypeitem).value == null ? false : props.form.getFormItemsValue(headareaname,this.orgtypeitem).value;
                }else{
                    return false;
                }
            },
            setFormStatus = function(){
                props.form.setFormStatus(this.areaname,me.state.status == false ? 'edit': 'browse')
                if(this.authorize != undefined){
                    this.authorize.authorizeareacode.forEach(areaname =>{
                        props.form.setFormStatus(areaname,me.state.status == false ? 'edit': 'browse')
                    });
                }
            },
            renderCardFramework = function(){
                 var comp = this,
                        {areaname,title,orgtypeitem}   = comp;
                    var {form,button}     = props;
                    var {createForm}      = form;
                    var switchCfg = {
                        checked :(props.form.getFormItemsValue(headareaname,orgtypeitem) == null || props.form.getFormItemsValue(headareaname,orgtypeitem).value == null) ? false : props.form.getFormItemsValue(headareaname,orgtypeitem).value,
                    };
                    return (
                        <div name={commonCardName(areaname)} style={{display: comp.isshow() ? '' : 'none'}}>
                            <NCScrollElement name={areaname}>
                                <div className="nc-bill-table-area nc-bill-table-list nc-bill-part nc-theme-gray-area-bgc">
                                    <NCCol className='part-col'>
                                        <div className="col-title nc-theme-common-font-c">{title}</div>
                                        <div className="col-switch"><NCSwitch {...switchCfg}/></div>
                                    </NCCol>
                                    <NCCollapse className='nc-bill-btn-par' style={{marginBottom:'5px'}} in={switchCfg.checked}>
                                        <div>
                                            {comp.renderCardForm()}
                                        </div>
                                    </NCCollapse>
                                </div>
                            </NCScrollElement>
                        </div>
                    );
                   
            },
            renderCardForm = function(){
                var comp = this,
                       {areaname,title,orgtypeitem, isshow}   = comp;
                   var {form,button}     = props;
                   var {createForm}      = form;
                   return createForm(areaname);      
            };
        var state = {  //添加当前选中组织到State
            templateid : template && template.template.pageid ,
            showMode: 'card',
            json:{},//多语字符串
            orgunit_name:'',//当前操作数据的名称
            status:true,//页面状态
        };
        var card = {
            corp:{
                areaname: 'version' != this.props.config.type ? 'corp': 'corp_v',
                orderby: 1,
                pk:'pk_corp',
                orgtypeitem:'orgtype2',
                title: this.lang['10100ORG-000064']
            },
            hrorg:{
                areaname: 'version' != this.props.config.type ? 'hrorg':'hrorg_v',
                orderby: 2,
                title: this.lang['10100ORG-000065'],
                orgtypeitem:'orgtype4',
                pk:'pk_hrorg',
            },
            financeorg:{
                areaname: 'version' != this.props.config.type ? 'financeorg':'financeorg_v',
                orderby: 3,
                title: this.lang['10100ORG-000066'],
                orgtypeitem:'orgtype5',
                pk:'pk_financeorg', 
            },
            fundorg:{
                areaname: 'version' != this.props.config.type ? 'fundorg' : 'fundorg_v',
                orderby: 4,
                orgtypeitem:'orgtype6',
                pk:'pk_fundorg',
                title: this.lang['10100ORG-000067'],
            },
            purchaseorg:{
                areaname: 'version' != this.props.config.type ? 'purchaseorg' : 'purchaseorg_v',
                orderby: 5,
                orgtypeitem:'orgtype7',
                pk:'pk_purchaseorg',
                title: this.lang['10100ORG-000068'],
            },
            saleorg:{
                areaname: 'version' != this.props.config.type ? 'saleorg' : 'saleorg_v',
                orderby: 6,
                orgtypeitem:'orgtype8',
                pk:'pk_salesorg',
                title: this.lang['10100ORG-000069'],
                authorize:{
                    authorizetitle:this.lang['10100ORG-000070'],
                    authorizeareacode:'version' != this.props.config.type ? ['saleorgrelation'] : ['saleorgrelation_v'],
                },
                renderCardFramework : function(){
                    var comp = this,
                        {areaname,title,orgtypeitem,authorize}   = comp;
                    var {form,button}     = props;
                    var {createForm}      = form;
                    var switchCfg = {
                        checked :(props.form.getFormItemsValue(headareaname,orgtypeitem) == null || props.form.getFormItemsValue(headareaname,orgtypeitem).value == null) ? false : props.form.getFormItemsValue(headareaname,orgtypeitem).value,
                    };
                    return (
                        <div name={commonCardName(areaname)} style={{display: comp.isshow() ? '' : 'none'}}>
                            <NCScrollElement name={areaname}>
                                <div className="nc-bill-table-area nc-bill-table-list nc-bill-part nc-theme-gray-area-bgc">
                                    <NCCol className='part-col'>
                                        <div className="col-title nc-theme-common-font-c">{title}</div>
                                        <div className="col-switch"><NCSwitch {...switchCfg}/></div>
                                    </NCCol>
                                    <NCCollapse className='nc-bill-btn-par' style={{marginBottom:'5px'}} in={switchCfg.checked}>
                                        <div>
                                            {comp.renderCardForm()}
                                            <div class="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle/* 国际化处理： 销售业务委托关系*/}
                                                <span class="wuliu"></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[0])}
                                        </div>
                                    </NCCollapse>
                                </div>
                            </NCScrollElement>
                        </div>
                    );
                },
            },
            stockorg:{     
                areaname: 'version' != this.props.config.type ? 'stockorg' : 'stockorg_v',
                orderby: 7,
                orgtypeitem:'orgtype9',
                pk:'pk_stockorg',
                title: this.lang['10100ORG-000071'],
                authorize:{
                    authorizetitle:[this.lang['10100ORG-000072'],[this.lang['10100ORG-000073']],[this.lang['10100ORG-000074']],[this.lang['10100ORG-000075']]],
                    authorizeareacode:'version' != this.props.config.type ? ['stocktrafficrelation','stockqccenterrelation','stockorgrelation','stockassetrelation'] : ['stocktrafficrelation_v','stockqccenterrelation_v','stockorgrelation_v','stockassetrelation_v'],
                },
                renderCardFramework : function(){
                    var comp = this,
                        {areaname,title,orgtypeitem,authorize}   = comp;
                    var {form,button}     = props;
                    var {createForm}      = form;
                    var switchCfg = {
                        checked :(props.form.getFormItemsValue(headareaname,orgtypeitem) == null || props.form.getFormItemsValue(headareaname,orgtypeitem).value == null) ? false : props.form.getFormItemsValue(headareaname,orgtypeitem).value,
                    };
                    return (
                        <div name={commonCardName(areaname)} style={{display: comp.isshow() ? '' : 'none'}}>
                            <NCScrollElement name={areaname}>
                                <div className="nc-bill-table-area nc-bill-table-list nc-bill-part nc-theme-gray-area-bgc">
                                    <NCCol className='part-col'>
                                        <div className="col-title nc-theme-common-font-c">{title}</div>
                                        <div className="col-switch"><NCSwitch {...switchCfg}/></div>
                                    </NCCol>
                                    <NCCollapse className='nc-bill-btn-par' style={{marginBottom:'5px'}} in={switchCfg.checked}>
                                        <div>
                                            {comp.renderCardForm()}
                                            <div class="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle[0]/* 国际化处理： 物流业务委托关系*/}
                                                <span class="wuliu"></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[0])}
                                            <div class="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle[1]/* 国际化处理： 质检业务委托关系*/}
                                                <span className='wuliu'></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[1])}
                                            <div class="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle[2]/* 国际化处理： 采购业务委托关系*/}
                                                <span className='wuliu'></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[2])}
                                            <div class="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle[3]/* 国际化处理： 资产库存业务委托关系*/}
                                                <span className='wuliu'></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[3])}
                                        </div>
                                    </NCCollapse>
                                </div>
                            </NCScrollElement>
                        </div>
                    );
                },
            },
            trafficorg:{
                areaname: 'version' != this.props.config.type ? 'trafficorg' : 'trafficorg_v',
                orderby: 8,
                title: this.lang['10100ORG-000076'],
                orgtypeitem:'orgtype10',
                pk:'pk_trafficorg',
            },
            qccenter:{
                areaname: 'version' != this.props.config.type ? 'qccenter' : 'qccenter_v',
                orderby: 9,
                title: this.lang['10100ORG-000077'],
                orgtypeitem:'orgtype11',
                pk:'pk_qccenter',
            },
            assetorg:{
                areaname: 'version' != this.props.config.type ? 'assetorg' : 'assetorg_v',
                orderby: 10,
                orgtypeitem:'orgtype12',
                pk:'pk_assetorg',
                title: this.lang['10100ORG-000078'],
                authorize:{
                    authorizetitle:this.lang['10100ORG-000079'],
                    authorizeareacode:'version' != this.props.config.type ? ['assetorgmaintainrelation'] : ['assetorgmaintainrelation_v'],
                },
                renderCardFramework : function(){
                    var comp = this,
                        {areaname,title,orgtypeitem,authorize}   = comp;
                    var {form,button}     = props;
                    var {createForm}      = form;
                    var switchCfg = {
                        checked :(props.form.getFormItemsValue(headareaname,orgtypeitem) == null || props.form.getFormItemsValue(headareaname,orgtypeitem).value == null) ? false : props.form.getFormItemsValue(headareaname,orgtypeitem).value,
                    };
                    return (
                        <div name={commonCardName(areaname)} style={{display: comp.isshow() ? '' : 'none'}}>
                            <NCScrollElement name={areaname}>
                                <div className="nc-bill-table-area nc-bill-table-list nc-bill-part nc-theme-gray-area-bgc">
                                    <NCCol className='part-col'>
                                        <div className="col-title nc-theme-common-font-c">{title}</div>
                                        <div className="col-switch"><NCSwitch {...switchCfg}/></div>
                                    </NCCol>
                                    <NCCollapse className='nc-bill-btn-par' style={{marginBottom:'5px'}} in={switchCfg.checked}>
                                        <div>
                                            {comp.renderCardForm()}
                                            <div class="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle/* 国际化处理： 资产维修业务委托关系*/}
                                                <span class="wuliu"></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[0])}
                                        </div>
                                    </NCCollapse>
                                </div>
                            </NCScrollElement>
                        </div>
                    );
                },
            },
            maintainorg:{
                areaname: 'version' != this.props.config.type ? 'maintainorg' : 'maintainorg_v',
                orderby: 11,
                orgtypeitem:'orgtype14',
                pk:'pk_maintainorg',
                title: this.lang['10100ORG-000080'],
                authorize:{
                    authorizetitle:this.lang['10100ORG-000081'],
                    authorizeareacode:'version' != this.props.config.type ? ['maintainstockrelation'] : ['maintainstockrelation_v'],
                },
                renderCardFramework : function(){
                    var comp = this,
                        {areaname,title,orgtypeitem,authorize}   = comp;
                    var {form,button}     = props;
                    var {createForm}      = form;
                    var switchCfg = {
                        checked :(props.form.getFormItemsValue(headareaname,orgtypeitem) == null || props.form.getFormItemsValue(headareaname,orgtypeitem).value == null) ? false : props.form.getFormItemsValue(headareaname,orgtypeitem).value,
                    };
                    return (
                        <div name={commonCardName(areaname)} style={{display: comp.isshow() ? '' : 'none'}}>
                            <NCScrollElement name={areaname}>
                                <div className="nc-bill-table-area nc-bill-table-list nc-bill-part nc-theme-gray-area-bgc">
                                    <NCCol className='part-col'>
                                        <div className="col-title nc-theme-common-font-c">{title}</div>
                                        <div className="col-switch"><NCSwitch {...switchCfg}/></div>
                                    </NCCol>
                                    <NCCollapse className='nc-bill-btn-par' style={{marginBottom:'5px'}} in={switchCfg.checked}>
                                        <div>
                                            {comp.renderCardForm()}
                                            <div class="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle/* 国际化处理： 维修库存业务委托关系*/}
                                                <span class="wuliu"></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[0])}
                                        </div>
                                    </NCCollapse>
                                </div>
                            </NCScrollElement>
                        </div>
                    );
                },
            },
            liabilitycenter:{
                areaname: 'version' != this.props.config.type ? 'liabilitycenter' : 'liabilitycenter_v',
                orderby: 12,
                title: this.lang['10100ORG-000003'],
                orgtypeitem:'orgtype15',
                pk:'pk_liabilitycenter',
            },
            itemorg:{
                areaname: 'version' != this.props.config.type ? 'itemorg':'itemorg_v',
                orderby: 13,
                orgtypeitem:'orgtype16',
                pk:'pk_itemorg',
                title: this.lang['10100ORG-000082'],
                authorize:{
                    authorizetitle:this.lang['10100ORG-000083'],
                    authorizeareacode:'version' != this.props.config.type ? ['itemstockrelation'] : ['itemstockrelation_v'],
                },
                renderCardFramework : function(){
                    var comp = this,
                        {areaname,title,orgtypeitem,authorize}   = comp;
                    var {form,button}     = props;
                    var {createForm}      = form;
                    var switchCfg = {
                        checked :(props.form.getFormItemsValue(headareaname,orgtypeitem) == null || props.form.getFormItemsValue(headareaname,orgtypeitem).value == null) ? false : props.form.getFormItemsValue(headareaname,orgtypeitem).value,
                    };
                    return (
                        <div name={commonCardName(areaname)} style={{display: comp.isshow() ? '' : 'none'}}>
                            <NCScrollElement name={areaname}>
                                <div className="nc-bill-table-area nc-bill-table-list nc-bill-part nc-theme-gray-area-bgc">
                                    <NCCol className='part-col'>
                                        <div className="col-title nc-theme-common-font-c">{title}</div>
                                        <div className="col-switch"><NCSwitch {...switchCfg}/></div>
                                    </NCCol>
                                    <NCCollapse className='nc-bill-btn-par' style={{marginBottom:'5px'}} in={switchCfg.checked}>
                                        <div>
                                            {comp.renderCardForm()}
                                            <div class="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle/* 国际化处理： 项目库存业务委托关系*/}
                                                <span class="wuliu"></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[0])}
                                        </div>
                                    </NCCollapse>
                                </div>
                            </NCScrollElement>
                        </div>
                    );
                },
            },
            planbudget:{
                areaname: 'version' != this.props.config.type ? 'planbudget' : 'planbudget_v',
                orderby: 14,
                title: this.lang['10100ORG-000084'],
                orgtypeitem:'orgtype17',
                pk:'pk_planbudget',
            },
            adminorg:{
                areaname: 'version' != this.props.config.type ? 'adminorg' : 'adminorg_v',
                orderby: 15,
                title: this.lang['10100ORG-000085'],
                orgtypeitem:'orgtype29',
                pk:'pk_adminorg',
            },
            factory:{
                areaname: 'version' != this.props.config.type ? 'factory' : 'factory_v',
                orderby: 16,
                title: this.lang['10100ORG-000086'],
                orgtypeitem:'orgtype33',
                pk:'pk_factory',
            },
            plancenter:{
                areaname: 'version' != this.props.config.type ? 'plancenter' : 'plancenter_v',
                orderby: 17,
                title: this.lang['10100ORG-000087'],
                orgtypeitem:'orgtype34',
                pk:'pk_plancenter',
            }
        };
        Object.values(card).forEach(v => {
            !v.setFormStatus && (v.setFormStatus = setFormStatus);
            !v.isshow && (v.isshow = isshow);
            !v.renderCardFramework  && (v.renderCardFramework = renderCardFramework);
            !v.renderCardForm && (v.renderCardForm = renderCardForm);
        });
        state.card = card;
        return state;
    }

    queryRoot(data,props){
        if(!data['formrelation']){
            data['formrelation'] = {};
        }
        //设置模板之间的关联关系
        //组合原NC也去的单据模板关联关系
        data['formrelation'].corp=['corpotherinfo','corpcontactinfo','corpdefinfo','corpaudioinfo'];//'corpaudioinfo'
        data['formrelation'].org=['orgtype','orgversioninfo','orgauditinfo'];//'corpaudioinfo','orgauditinfo'
        data['formrelation'].hrorg=['hrorgdef','hrorgauditinfo'];//'hrorgauditinfo'
        data['formrelation'].financeorg=['financeorgdef','financeorgaudioinfo'];//'financeorgaudioinfo'
        data['formrelation'].fundorg=['fundorgdef','fundorgauditinfo'];//,'fundorgauditinfo'
        data['formrelation'].purchaseorg=['purchaseorgdef','purchaseorgauditinfo'];//,'purchaseorgauditinfo'
        data['formrelation'].saleorg=['saleorgdef','saleorgaudit'];//'saleorgdef','saleorgaudit',
        data['formrelation'].stockorg=['stockorgdef','stockorgaudit'];//'stockorgaudit','stockorgdef'
        data['formrelation'].trafficorg=['trafficorgdef','trafficorgauditinfo'];//'trafficorgauditinfo',
        data['formrelation'].qccenter=['qccenterdef','qccenterauditinfo'];//'qccenterauditinfo',
        data['formrelation'].assetorg=['assetorgdef','assetorgauditinfo'];//'assetorgauditinfo','assetorgdef'
        data['formrelation'].maintainorg=['maintainorgdef','maintainorgauditinfo'];//'maintainorgauditinfo','maintainorgdef'
        data['formrelation'].liabilitycenter=['liabilitycenterdef','liabilitycenterauditinfo'];//'liabilitycenterauditinfo',
        data['formrelation'].itemorg=['itemorgdefinfo','itemorgauditinfo'];//'itemorgauditinfo','itemorgdefinfo'
        data['formrelation'].planbudget=['planbudgetdef','planbudgetauditinfo'];//'planbudgetauditinfo',
        data['formrelation'].adminorg=['adminorgdef','adminorgauditinfo'];//'adminorgauditinfo',
        data['formrelation'].factory=['factorydefitem','factoryauditinfo'];//'factoryauditinfo',
        data['formrelation'].plancenter=['plancenterdefiitem','plancenterauditinfo'];//,'plancenterauditinfo'
        //版本模板关系
        data['formrelation'].corp_v=['corpversionotherinfo','corpversionlinkinfo'];//'corpaudioinfo'
        data['formrelation'].org_v_form=['orgtype_v','orgunitversioninfo'];//'corpaudioinfo'
        data['formrelation'].org_v_form=['orgtype_v','orgunitversioninfo'];//'corpaudioinfo'
        data['formrelation'].hrorg_v=['hrorgdef'];//'hrorgauditinfo'
        data['formrelation'].financeorg_v=['financeorgdef'];//'financeorgaudioinfo'
        data['formrelation'].fundorg_v=['fundorgdef'];//,'fundorgauditinfo'
        data['formrelation'].purchaseorg_v=['purchaseorgdef'];//,'purchaseorgauditinfo'
        data['formrelation'].salesorg_v=['saleorgrelation_v'];//'saleorgdef','saleorgaudit',
        data['formrelation'].stockorg_v=['stocktrafficrelation_v','stockqccenterrelation_v','stockorgrelation_v','stockassetrelation_v'];//'stockorgaudit','stockorgdef'
        data['formrelation'].trafficorg_v=['trafficorgdef'];//'trafficorgauditinfo',
        data['formrelation'].qccenter_v=['qccenterdef'];//'qccenterauditinfo',
        data['formrelation'].assetorg_v=['assetorgmaintainrelation_v'];//'assetorgauditinfo','assetorgdef'
        data['formrelation'].maintainorg_v=['maintainstockrelation_v'];//'maintainorgauditinfo','maintainorgdef'
        data['formrelation'].liabilitycenter_v=['liabilitycenterdef'];//'liabilitycenterauditinfo',
        data['formrelation'].itemorg_v_v=['itemstockrelation_v'];//'itemorgauditinfo','itemorgdefinfo'
        data['formrelation'].planbudget_v=['planbudgetdef'];//'planbudgetauditinfo',
        data['formrelation'].adminorg_v=['adminorgdef'];//'adminorgauditinfo',
        data['formrelation'].factory_v=['factorydefitem'];//'factoryauditinfo',
        data['formrelation'].plancenter_v=['plancenterdefiitem'];//,'plancenterauditinfo'
    }

    browseCard(pk_org ,callback){
        this.state.showMode = 'card';
        this.state.status = true;
        this.setState(this.state,()=>{
            this.loadCardData({
                pk_org:pk_org,
                callback:(orgData, codeDatapro) =>{
                    this.fillCardData(orgData, (data) =>{
                        //设置页面form状态
                        this.setAllFormStatus(data);
                        //设置卡片翻页的当前主键
                        setTimeout(() => {
                            callback && callback(data);
                        }, 0);
                    })
                }
            });
        });
    }

    loadCardData(cfg){
        var {pk_org, callback} = cfg; //loadtype: add/copy/load
        var orgData;
        pk_org && ajax({
            url: 'version' != this.props.config.type ? '/nccloud/uapbd/org/queryorgtype.do':'/nccloud/uapbd/org/queryorgunitversionUrl.do',
            data:{
                pk_org: pk_org || undefined,
                oid:this.state.templateid,
                type: this.props.config.type || 'normal'
            },
            success: (res) => {
                orgData = res.data || undefined;
                callback && callback(orgData);
            }
        }); 
    }

    fillCardData(orgData,callback){
        var data = {};
        orgData && orgData.forEach( d =>{
            var values = Object.values(d);
            values.forEach(v =>{
                if(v && v.areacode){
                    data[v.areacode] = v;
                }
            });
        });
        this.props.form.setAllFormValue(data);
        this.setState(this.state,() =>{
            callback && callback(data);
        });
    }

    //批量设置页面所有form状态
    setAllFormStatus(data){
        var status = this.state.status == false ? 'edit': 'browse';
        var allcomps = Object.values(this.state.card);
        //设置表头form状态
        this.props.form.setFormStatus('org',status);
        allcomps.map( comp =>{
            comp.setFormStatus();
        });
    }

    render() {
        if(!this.lang)return '';
        let { cardTable, form, button, modal,table,editTable ,DragWidthCom,syncTree,treeTableManyCol,BillHeadInfo} = this.props;
        let { createForm } = form;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
        let { createCardTable } = cardTable;
        let { createModal } = modal;
        let { createSimpleTable } = table;
        let {createSyncTree} = syncTree;
        let { treeTableCol } = treeTableManyCol;
        const { createEditTable } = editTable;

        var renderMainCard = () =>{
            // var renderScrollLink = () => {
            //     var allcomps = Object.values(this.state.card);
            //     var showComps = allcomps.filter( comp => comp.isshow());
            //     return allcomps.map( comp =>{
            //         var cfg = {
            //             spy:true,
            //             smooth:true,
            //             duration:300,
            //             offset:-100,
            //             to: comp.areaname || 'less name'
            //         };
            //         return  <NCScrollLink {...cfg}><p>{comp.title || 'less title' }</p></NCScrollLink>
            //     });
            // };
            return ( 
                <div className="nc-bill-list">
                    <NCAffix>
                        <NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                            <div className="header-title-search-area">
                                {createBillHeadInfo({
                                    title:this.lang['10100ORG-000098'],
                                    showBackBtn:false,
                                    initShowBackBtn:false}
                                    )}
                            </div>
                        </NCDiv>
                    </NCAffix>
                    {/*<NCAnchor>renderScrollLink()</NCAnchor>*/}
                    <NCScrollElement style={{marginBottom:'5px'}} name={headareaname}>
                        <div className="nc-bill-form-area">
                            {createForm(headareaname, {
                                expandArr:['orgtype_v']
                            })}
                        </div>
                    </NCScrollElement>
                </div>  
            );
        };
        var renderSubCard = () =>{
            var cardcfgs = Object.values(this.state.card);
            return cardcfgs.map( cfg => cfg.renderCardFramework());        
        };
        var renderCard = () =>{
            return (
                <div  id='nc-bill-card'>
                    <div className="nc-bill-card orgunit-card">
                        {renderMainCard()}
                        {renderSubCard()}
                    </div>
                </div>
            );
        };
        return (
            <div>
                {renderCard()}
            </div>
        );
    }
}

export default  Orgunitversion = createPage({

})(Orgunitversion);



//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65