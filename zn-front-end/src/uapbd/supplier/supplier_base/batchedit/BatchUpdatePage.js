//8VXzsSWv0cZoI+RiLjQdTmrPYTTylNKIC/3htIy8s6aHf7dbTNoeOp3/cGvO6RTf
import React,{Component} from 'react';
import {ajax,base,toast} from 'nc-lightapp-front';
import FinanceOrg from '../../../refer/org/FinanceOrgTreeRef/index';
import PurchaseOrg from '../../../refer/org/PurchaseOrgGridRef/index';
import BatchUpdateAttrRefer from '../../../refer/supplier/SupBatchUpdateAttrRefer/index';
import BusinessUnit from '../../../refer/org/BusinessUnitTreeRef/index';
const {NCDiv} = base;
import {component} from '../../../public/platwapper/index.js';
import SyncLoadComp from '../utils/SyncLoadComp';
const {NCSelect,NCTable} = component;
const {NCOption} = NCSelect;
const PK_GLOBE = 'GLOBLE00000000000000';
const referUrls ={
    FinanceOrg:'uapbd/refer/org/FinanceOrgTreeRef/index',
    PurchaseOrg:'uapbd/refer/org/PurchaseOrgGridRef/index',
    BatchUpdateAttrRefer:'uapbd/refer/supplier/SupBatchUpdateAttrRefer/index',
    BusinessUnit:'uapbd/refer/org/BusinessUnitTreeRef/index'
}

// const FinanceOrgWapper = (others)=>{return <ReferWapper ReferComp={FinanceOrg} {...others}/>};
/**
 * 批改dialog
 */
export default class BatchUpdate extends Component{
    constructor(props){
        super(props);
        this.state = {
            afterInitLoad:false,
            quickBatchUpdate:this.props.quickBatchUpdate || false,
            pk_suppliers:this.props.pk_suppliers || [],//需要批改的供应商主键数组
            pk_orgs:this.props.pk_orgs || [],
            tsMap:new Map(),
            hasOrgData:false,
            tabs:null,
            selectedTab:null,
            orgValue:[],
            queryCondition:null,
            attrValues:null,//选择的批改属性
            attr_valueMap:{},
            financeOrg:{
                queryCondition:{
                    AppCode:this.props.appcode,
                    orgType:'FINANCEORGTYPE000000',
                    TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                }
            },
            purchaseOrg:{
                queryCondition:{
                    AppCode:this.props.appcode,
                    orgType:'PURCHASEORGTYPE00000',
                    GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                    
                }
            },
            orgtableitems:[
                {
                    title:this.props.Lang['10140SUG-000056'],///* 国际化处理： 编码*/
                    dataIndex: "refcode",
                    key: "refcode",
                    width:'50%',
                },
                {
                    title:this.props.Lang['10140SUG-000057'],///* 国际化处理： 名称*/
                    dataIndex: "refname",
                    key: "refname",
                    width:'50%',
                }
            ]
        }
    }
    /**
     * 获得选择的tab页
     */
    getSelectedTab = ()=>{
        return this.state.selectedTab;
    }
    getSelectedOrg = ()=>{
        return this.state.orgValue;
    }
    getSelectedAttrs = ()=>{
        return this.state.attrValues;
    }
    /**
     * 清理批改数据
     */
    cleanBatchUpdateData = (callback)=>{
        this.setState({pk_suppliers: [],
            pk_orgs: [],
            tabs:null,
            selectedTab:null,
            orgValue:[],
            queryCondition:null,
            attrValues:null,
            attr_valueMap:{},},()=>{
                callback && callback();
            })
    }
    /**
     * 校验批改数据
     * @returns {boolean}
     */
    validateBatchUpdateData = ()=>{
        //业务单元节点 && 批改  && 基本信息 && 没有选中组织数据
        if(this.props.nodeType == 'ORG_NODE' && !this.props.isWarzidBatchUpdate && this.state.selectedTab == 'sup_base_info' && !this.state.hasOrgData){
            toast({content:this.props.Lang['10140SUG-000212'],color:'warning'});/* 国际化处理： 界面选中的数据中没有可供批改的记录！*/
            return false;
        }
        //非基本信息页签 组织参照必选
        if(this.state.selectedTab != 'sup_base_info' && (!this.state.orgValue || this.state.orgValue.length == 0)){
            toast({content:this.props.Lang['10140SUG-000058'],color:'warning'});/* 国际化处理： 请选择业务单元！*/
            return false;
        }
        if(!this.state.attrValues || this.state.attrValues.length == 0){
            toast({content:this.props.Lang['10140SUG-000059'],color:'warning'});/* 国际化处理： 请先选择批改字段！*/
            return false;
        }
        
        return this.props.form.isCheckNow('sup_batch_update');
    }
    /**
     * 获得批改数据
     * @returns {{currTabKey: null, attrs: any, attrValues: *, pks: (*|Array|any[]), selectedOrgs: (*|Array), orgs: any, attr_valueMap: (BatchUpdate.state.attr_valueMap|{})}}
     */
    getBatchUpdateData = ()=>{
        if(!this.validateBatchUpdateData()){
            return;
        }
        return {
            currTabKey:this.state.selectedTab,//批改页签
            attrs:this.state.attrValues ? this.state.attrValues.map(attr=>{return attr.refcode}):[],//批改属性
            attrValues:this.props.form.getFormItemsValue('sup_batch_update',this.state.attrValues.map(attr=>{return attr.refcode})),//批改属性值
            pks:this.state.pk_suppliers || [],//供应商主键
            selectedOrgs:this.state.pk_orgs || [],//所选供应商单据的组织
            orgs:this.state.orgValue? this.state.orgValue.map(org=>{return org.refpk}):[],//采购组织 or 财务组织
            attr_valueMap:this.state.attr_valueMap || {},//这个好像没用
            tsMap:this.state.tsMap
        }
    }


    /**
     * 设置快速批改条件
     *  在快速批改时使用
     * @param pk_suppliers
     * @param pk_orgs
     */
    setBatchUpdateCondition = (pk_suppliers,pk_orgs,tsMap,hasOrgData)=>{

        this.setState({
            pk_suppliers:pk_suppliers ||[],
            pk_orgs:Array.from(pk_orgs) || [],
            tsMap:tsMap,
            hasOrgData:hasOrgData
        },()=>{
            this.SyncLoadRefer();
        })
    }
    SyncLoadRefer = ()=>{
        let config = {
            props:this.props,
            urlsArr:Object.values(referUrls),
            success:()=>{this.setState({afterInitLoad:true},this.loadBatchUpdateTabs)},
            fail:()=>{this.setState({afterInitLoad:true},this.loadBatchUpdateTabs)}
        };
        SyncLoadComp.call(this,config);
    }
    setBatchUpdateAttrRefQueryCondition= (callback)=>{
        this.state.queryCondition = {};
        //业务单元节点 && 批改 && 基本信息页签 && 没有组织级数据
        let {hasOrgData,selectedTab,queryCondition} = this.state;
        if(this.props.nodeType == 'ORG_NODE' && !this.props.isWarzidBatchUpdate && selectedTab == 'sup_base_info' && !hasOrgData){
            queryCondition.hasOrgData = hasOrgData;
        }else{
            queryCondition.hasOrgData = false;
        }
        queryCondition.isBaseTab = this.state.selectedTab == 'sup_base_info';
        queryCondition.isOrgNode = this.props.nodeType == 'ORG_NODE';
        queryCondition.isWarzidBatchUpdate = this.props.isWarzidBatchUpdate;
        queryCondition.issingleorg =this.getIsSingleOrg();
        this.setState(this.state,callback);
    }
    /**
     * !!!!!!
     */
    getIsSingleOrg = (value)=>{
        if(this.props.isWarzidBatchUpdate){
            if(this.state.selectedTab == 'sup_base_info' && this.props.nodeType != 'ORG_NODE'){
                return true;
            }else{
                return value?(value.length==1):(this.state.orgValue && this.state.orgValue.length == 1);
            }
        }else{
            if(this.state.selectedTab == 'sup_base_info'){
                return this.state.pk_orgs && this.state.pk_orgs.length == 1;
            }else{
                return value?(value.length==1):(this.state.orgValue && this.state.orgValue.length == 1);
            }
        }
    }
    /**
     * 加载批改页签
     */
    loadBatchUpdateTabs = (callback)=>{
        ajax({
            url:'/nccloud/uapbd/supplier/querySupBatchUpdate.do',
            success:(res)=>{
                if(res.success){
                    this.setState({
                        tabs:res.data.tab,
                        selectedTab:res.data.tab[0].code,
                        queryCondition:res.data.tab[0].pk_batchupdatetab
                    },()=>{
                        this.setBatchUpdateAttrRefQueryCondition(()=>{
                            this.setBatchUpdateFormReferItemsQueryCondition();
                        })
                    });
                }
            }
        })
    }
    /**
     * 设置批改form参照item的查询条件
     */
    setBatchUpdateFormReferItemsQueryCondition = ()=>{
        this.props.meta.getMeta()['sup_batch_update'].items.forEach(item =>{
            item.visible = false;
            if(item.attrcode == 'trade'){
                //经济行业
                item.rootNode={ refname: this.props.Lang['10140SUG-000210'], refpk: 'root' };
            }
            if(item.attrcode == 'ecotypesincevfive'){
                //经济类型
                item.rootNode={ refname: this.props.Lang['10140SUG-000211'], refpk: 'root' };
            }
            if(item.attrcode == 'pk_supplierclass' || item.attrcode == 'pk_supplier_main' || item.attrcode =='issuesup' || item.attrcode =='billingsup'){
                //供应商基本分类 || 上级供应商
                item.queryCondition = {
                    pk_org:this.props.nodeType == 'GLOBE_NODE' ? PK_GLOBE : this.state.pk_orgs[0],
                }
            }
        })
        this.props.meta.setMeta(this.props.meta.getMeta());
    }
    /**
     * 页签切换事件
     */
    onSupBatchUpdateTabsChanged = (value)=>{
        let me = this;
        me.setState({selectedTab:value},()=>{
            //设置属性参照的queryCondition
            me.state.tabs.find(tab=>{
                if(tab.code == me.state.selectedTab){
                    me.state.queryCondition = {pk_batchupdatetab:tab.pk_batchupdatetab}
                }})
                me.state.queryCondition.isBaseTab = value == 'sup_base_info';
                me.state.queryCondition.isOrgNode =  me.props.nodeType == 'ORG_NODE';
                me.state.queryCondition.isWarzidBatchUpdate =  me.props.isWarzidBatchUpdate;
                me.state.queryCondition.issingleorg = this.getIsSingleOrg();
            //清空属性参照已经选择的值 &&   清空并隐藏form表单
            me.setState(Object.assign( me.state,{attrValues:null,orgValue:[]}), me.clearAndHideForm);
        })
    }

    /**
     * 清空并隐藏表单项
     */
    clearAndHideForm = ()=>{
        //清空表单值
        this.props.form.EmptyAllFormValue('sup_batch_update');
        //隐藏表单项
        this.props.meta.getMeta()['sup_batch_update'].items.forEach(item=>{item.visible = false});
        this.props.meta.setMeta(this.props.meta.getMeta());
    }
    /**
     * 渲染批改页签
     */
    renderBatchUpdateTab = ()=>{
        
        return (
           <div className='batchupdate-tab' style={{display: 'flex'}}>
               <div style={{marginTop: 17,marginRight: 10}}>{this.props.Lang['10140SUG-000047']/* 国际化处理： 批改属性所在页签*/}</div>
               {this.state.tabs &&
                <div style={{width: 240,marginTop: 10}}>
                    <NCSelect defaultValue={this.state.tabs[0].code} fieldid={"batchupdateattr"} onChange={this.onSupBatchUpdateTabsChanged}>
                        {this.state.tabs.map(tab=>{
                            return <NCOption value={tab.code}>{tab.name}</NCOption>
                        })}
                    </NCSelect> 
               </div>
               }
           </div>
        )
    }

    renderBatchUpdateAttr = ()=>{
        let {BatchUpdateAttrRefer} = referUrls;
        let cfg = {
            fieldid:"batchUpdateAttrRefer",
            queryCondition:this.state.queryCondition,
            value:this.state.attrValues,
            onChange:this.onBatchUpdateAttrReferChanged
        };
        return (
            <div style={{display: 'flex',marginTop: 10,/***marginLeft: 20 */}}>
                    <div style={{marginTop: 7,marginRight: 10}}>{this.props.Lang['10140SUG-000206']}</div>
                    <div style={{width:240}}>
                        {this.state.queryCondition && window[BatchUpdateAttrRefer].default(cfg)}
                    </div>
                </div>
        )
        
    }

    renderBatchUpdateOrg = ()=>{
        let isFinance = this.state.selectedTab && this.state.selectedTab == 'sup_finance';
        let isPurchase = this.state.selectedTab && this.state.selectedTab == 'sup_purchase';
        let refer = null;
        let {orgValue,financeOrg,purchaseOrg} = this.state;
        let {FinanceOrg,PurchaseOrg,BatchUpdateAttrRefer,BusinessUnit} = referUrls;
        
        
        if(isFinance){
            let financeorgcfg = {
                fieldid :'financeorg',
                queryCondition :financeOrg.queryCondition,
                value:orgValue ,
                isMultiSelectedEnabled:true,
                isShowUnit:false,
                onChange :this.onOrgReferValueChanged.call(this,'finance')
            };
            refer = (<div style={{marginTop: 10,marginBottom: 10,display:"flex"}}>
                    <div style={{marginTop:4,marginRight:10}}>
                        {this.props.Lang['10140SUG-000060']/* 国际化处理： 财务组织*/}
                    </div>
                    <div style={{width: 240}}>
                        {window[FinanceOrg].default(financeorgcfg)}
                    </div>
                </div>);
        }else if(isPurchase){
            let purchaseorgcfg = {
                fieldid:'purchaseorg',
                queryCondition :purchaseOrg.queryCondition,
                value :orgValue,
                isMultiSelectedEnabled:true,
                onChange:this.onOrgReferValueChanged.call(this,'purchase')
            };
            refer = (<div style={{marginTop: 10,marginBottom: 10,display:"flex"}}>
                    <div style={{marginTop:4,marginRight:10}}>
                        {this.props.Lang['10140SUG-000061']/* 国际化处理： 采购组织*/}
                    </div>
                    <div style={{width: 240}}>
                        {window[PurchaseOrg].default(purchaseorgcfg)}
                    </div>
                </div>);
        }else {
            let businessunitcfg = {
                fieldid:'businessunit',
                value:orgValue,
                isMultiSelectedEnabled:true,
                onChange:this.onOrgReferValueChanged.call(this,'businessunit'),
                queryCondition:{
                    appcode:this.props.appcode,
                    TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                }
            };
            //业务单元节点向导批改基本信息
            refer = (this.props.nodeType == 'ORG_NODE' && this.props.isWarzidBatchUpdate && this.state.selectedTab == 'sup_base_info') && 
                <div style={{marginTop: 10,marginBottom: 10,display: 'flex'}}>
                    <div style={{marginTop:4,marginRight: 10}}>
                        {this.props.Lang['10140SUG-000062']/* 国际化处理： 业务单元*/}</div>
                    <div style={{width: 240}}>
                        {window[BusinessUnit].default(businessunitcfg)}
                    </div>
                </div>;
        }
        return refer;
    }
    /**
     * 财务组织和采购组织 值改变事件
     * 
     * 经典闭包实例2
     * @param value
     */
    onOrgReferValueChanged = (id)=>{
        return (value)=>{
            this.state.queryCondition.isOrgNode = this.props.nodeType == 'ORG_NODE';
            this.state.queryCondition.isWarzidBatchUpdate = this.props.isWarzidBatchUpdate;
            this.state.queryCondition.issingleorg = this.getIsSingleOrg(value);
            value.forEach(org=>{
                if(org.hasOwnProperty('children')){
                    delete org.children;
                }
            });
            let hasChange = false;
            let oldRefPks = new Array();
            if(this.state.orgValue.length>0){
                oldRefPks = this.state.orgValue.map(org=>{return org.refpk});
            }
            if(value.length == this.state.orgValue.length && value.length>0){
                for(let o of value){
                    if(!oldRefPks.includes(o.refpk)){
                        hasChange = true;
                        break;
                    }
                }
            }else if(value.length!=this.state.orgValue.length){
                hasChange = true;
            }
            let attrs = hasChange?[]:this.state.attrValues;
            this.setState({orgValue:value,attrValues:attrs},()=>{
               
                this.props.meta.getMeta()['sup_batch_update'].items.forEach(item =>{
                    item.visible = hasChange?false:item.visible;
                    if(item.attrcode =='respdept' || item.attrcode == 'pk_respdept') {
                        //专管部门
                        item.queryCondition ={
                            pk_org:value.length>0?value[0].refpk:null,
                            TreeRefActionExt:'nccloud.web.uapbd.supplier.suprefcondition.action.RespDeptNCTreeRefSqlBuilder'
                        }
                    }
                    if(item.attrcode =='respperson' || item.attrcode == 'pk_resppsn'){
                        //专管业务员
                        item.queryCondition = {
                            pk_org:value.length>0?value[0].refpk:null
                        }
                    }
                    if(item.attrcode == 'pk_supplierclass' || item.attrcode == 'pk_supplier_main' || item.attrcode =='issuesup' || item.attrcode =='billingsup'){
                        //供应商基本分类 || 上级供应商
                        item.queryCondition = {
                            pk_org:this.props.nodeType == 'GLOBE_NODE' ? PK_GLOBE : (value.length>0?value[0].refpk:null),
                        }
                    }
                });
                this.props.meta.setMeta(this.props.meta.getMeta());
            });
        }
       
    }
    /**ss
     * 渲染组织和组织列表
     */
    renderOrgAndTable = ()=>{
        let isFinance = this.state.selectedTab && this.state.selectedTab == 'sup_finance';
        let isPurchase = this.state.selectedTab && this.state.selectedTab == 'sup_purchase';
        let orgNodeBatchUpBaseInfo = this.props.nodeType == 'ORG_NODE' && this.props.isWarzidBatchUpdate && this.state.selectedTab == 'sup_base_info';
        return(
            <div id='portalContainter07' >
                {(isFinance || isPurchase || orgNodeBatchUpBaseInfo) && <NCTable  columns={this.state.orgtableitems} scroll={{y:200,x:true}} data={this.state.orgValue}/>}
            </div>
        )
    }
    /**
     * 批改属性参照值改变事件
     * @param val
     */
    onBatchUpdateAttrReferChanged = (val)=>{
        if(!val || val.length == 0){
            this.clearAndHideForm();
        }
        let me = this;
        this.setState({attrValues:val},()=>{
            let attrcodeArr = me.state.attrValues ? me.state.attrValues.map(attr=>{return attr.refcode}):[];
            this.props.meta.getMeta()['sup_batch_update'].items.forEach(item=>{
                if(attrcodeArr && attrcodeArr.length>0){
                    item.visible = attrcodeArr.includes(item.attrcode);
                }
            })
            this.props.form.setFormStatus('sup_batch_update','edit');
            this.props.meta.addMeta(this.props.meta.getMeta()['sup_batch_update'],()=>{me.setState(me.state)});
        })
    }
    onFormAfterEdit = (props, moduleId, key, value) => {
        debugger
        this.state.attr_valueMap[key] = value.value;
        this.setState(this.state);
    }
    render(){
        let {createForm} = this.props.form;
        return(
        <div style={{width:'100%','padding-left': '20px','padding-right': '20px'}}>
            <NCDiv fieldid = 'updateform' areaCode = {NCDiv.config.FORM}>
                {this.renderBatchUpdateTab()}
                {this.renderBatchUpdateOrg()}
                {this.renderBatchUpdateAttr()}
            </NCDiv>
            {this.renderOrgAndTable()}
            {/*{this.renderAttrsForm()}*/}
            {!!this.state.attrValues && createForm('sup_batch_update',{
                onAfterEvent: this.onFormAfterEdit
            })}
        </div>
            
        )
    }

}

//8VXzsSWv0cZoI+RiLjQdTmrPYTTylNKIC/3htIy8s6aHf7dbTNoeOp3/cGvO6RTf