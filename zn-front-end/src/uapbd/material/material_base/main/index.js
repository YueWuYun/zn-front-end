//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 物料
 * @author  yinshb
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,print,getBusinessInfo,cardCache,promptBox,createPageIcon,excelImportconfig,output } from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
import deepClone from '../../../public/utils/deepClone';
import AssignStepModal from '../excomponents/assign/AssignStepModal';
import AssignModal from '../excomponents/assign/AssignModal';

import OrgDoc from  '../excomponents/OrgDoc';
import MarOrg from '../excomponents/MarOrg';
import AssignStatus from '../excomponents/AssignStatus';

import Batcheditmodal from '../excomponents/batchEdit/BatchEditModal';
import Batcheditstepmodal from '../excomponents/batchEdit/BatchEditStepModal';

let {setDefData, getDefData } = cardCache;
const {PrintOutput,NCUploader,ExcelImport} = high;
const {NCButton,NCDiv} = base;
let pagecode = '10140MAG_base_list';
let pagecodeValues = {};
let node_type;
const tableid = 'material';
const searchid = 'material_search';
let appid = '0001Z0100000000019GO';
const urls = {
    "exporturl":"/nccloud/uapbd/material/export.do",
    "searchQuery" : "/nccloud/uapbd/material/query.do",
    "queryTemp" : "/platform/templet/querypage.do",
    "mergerequest" : "/nccloud/platform/pub/mergerequest.do",
    "addMaterial" : "/nccloud/uapbd/material/addMaterial.do",
    "queryJurisdiction":"/nccloud/uapbd/material/queryJurisdiction.do",
    "deleteMaterial" : "/nccloud/uapbd/material/deleteMaterial.do",
    "enableMaterial" : "/nccloud/uapbd/material/enableMaterial.do",
    "disableMaterial" : "/nccloud/uapbd/material/disableMaterial.do",
    "print" : "/nccloud/uapbd/material/printMaterial.do",
    "upgrade" : "/nccloud/uapbd/material/upgrade.do",
    "batchUpdate" : "/nccloud/uapbd/material/batchUpdate.do",
    "batchUpdateWizard" : "/nccloud/uapbd/material/batchUpdateWizard.do",
    "editMaterial" : "/nccloud/uapbd/material/editMaterial.do",
    "queryPermOrg" : "/uapbd/material/queryPermOrg.do",
    "checkMaterialDataPermission" : "/uapbd/material/checkMaterialDataPermission.do",
    "qryIsAddMaterialAction" : "/nccloud/uapbd/material/qryIsAddMaterialAction.do"
};
const EditTabConfig = {
    mdId : 'c7dc0ccd-8872-4eee-8882-160e8f49dfad',
    tableRelation : {
        "base_info" : ['base'],
        "fi_info" : ['fi_base'],
        "pu_info" : ['pu_base'],
        "stock_info" : ['stock_base','stock_freeasst','stock_check','stock_atp','stock_realusableamount'],
        "sale_info" : ['sale_base'],
        "prod_info" : ['prod_base','producecost','costvalutasst'],
        "cost_info" : ['cost_base'],
        "plan_info" : ['plan_base','plan_marasst'],
        "pfc_info" : ['pfc_base'],
        "pfcc_info" : ['pfcc_base']
    },
    specialItems : {
        "fi_info" : 'pk_org',
        "pu_info" : 'pk_org',
        "stock_info" : 'pk_org',
        "sale_info" : 'pk_org',
        "prod_info" : 'pk_org',
        "cost_info" : 'pk_org',
        "plan_info" : 'pk_org',
        "pfc_info" : 'pk_org',
        "pfcc_info" : 'pk_org'
    }
};
/**
 * 有权限的组织pk
 */
let permOrg = [];
let BatchUpdateWizardConfig = {
    mdId : 'c7dc0ccd-8872-4eee-8882-160e8f49dfad',
    searchid:'search4assign',
    tablepagecode:'assign',
    tableid:'material4assign',
    queryTable:'/nccloud/uapbd/material/queryMaterialForbatchUpdateWizard.do',
    pkName:'pk_material',
    nodeType : '',
    tableRelation : {
        "base_info" : ['materialForm','base'],
        "fi_info" : ['fi_base'],
        "pu_info" : ['pu_base'],
        "stock_info" : ['stock_base','stock_freeasst','stock_check','stock_atp','stock_realusableamount'],
        "sale_info" : ['sale_base'],
        "prod_info" : ['prod_base','producecost','costvalutasst'],
        "cost_info" : ['cost_base'],
        "plan_info" : ['plan_base','plan_marasst'],
        "pfc_info" : ['pfc_base'],
        "pfcc_info" : ['pfcc_base']
    },
    specialItems : {
        "base_info" : 'pk_org',
        "fi_info" : 'pk_org',
        "pu_info" : 'pk_org',
        "stock_info" : 'pk_org',
        "sale_info" : 'pk_org',
        "prod_info" : 'pk_org',
        "cost_info" : 'pk_org',
        "plan_info" : 'pk_org',
        "pfc_info" : 'pk_org',
        "pfcc_info" : 'pk_org'
    }
};

/**
 * 将返回数据更新到页面
 * @param {*} allData 
 * @param {*} reDataRows 
 */
function filterResult(allData,reDataRows){
    if(!reDataRows) return;
    if(allData.rows){
        allData.rows.forEach((item,index) => {
            reDataRows.forEach((it,i) => {
                if(it.values['pk_material'].value === item.values['pk_material'].value){
                    allData.rows[index] = it;
                }
            });
        });
    }
 }

class Material extends Component {

    constructor(props) {
        super(props);

        this.config = props.config;
        appid = this.config.appid;
        pagecode = this.config.pagecode;
        pagecodeValues = this.config.pagecodeValues;
        node_type = this.config.node_type;
        BatchUpdateWizardConfig.nodeType = this.config.node_type;
        this.state = {
            checkflag : getDefData('checkflag',this.config.datasource)?true:false,
            oids : [],
            exportIds : [],
            billType:this.props.config.billType,
            pagecode_card:this.props.config.pagecode_card,
            appcode:this.props.config.appcode,
            showUploader:false,
            uploaderDir:'',
            assignStepModal : false,
            assignModal : false,
            importparams:{},
            context : {}
        }
        this.initTemplate(this.props,this.modifierMeta.bind(this,this.tableInnerButtonClick),()=>{
            setTimeout(() => {
                this.updateButtonDisable();
                if(this.config.node_type==='GROUP_NODE'){
                    let businessInfo = getBusinessInfo();
                    this.props.search.setSearchValByField(searchid,'pk_org',{value:businessInfo.groupId,display:businessInfo.groupName});
                }else{
                    if(this.state.context && this.state.context.pk_org && this.state.context.org_Name){
                        this.props.search.setSearchValByField(searchid,'pk_org_assign',{value:this.state.context.pk_org,display:this.state.context.org_Name});
                    }
                }
            }, 0);
        });
    }

    //获取并初始化模板
    initTemplate = (props,modifierMeta,callback) => {
        let count = 0;
        let AppCode = props.getAppCode();
        let data,res;console.log(data);console.log(res);console.log(props.meta.getMeta());
        let handleMeta = () => {
            if(count != 2){
                return;
            }else{
                //有权限组织pk
                permOrg = res.data.permOrg.permOrg?res.data.permOrg.permOrg:[];
                if(data.button){
                    let button = data.button;
                    let excelimportconfig = excelImportconfig(props,'uapbd',props.config.billType,true,'',{appcode: props.config.appcode,pagecode: props.config.pagecode_card},()=>{
                        //如果组织级节点未选组织则导入后不刷新
                        let searchVal = this.props.search.getQueryInfo(searchid);
                        if(this.props.config.billType==='material_org'){
                            if(!searchVal || !searchVal.querycondition) return;
                            let flag = true;
                            searchVal['querycondition']['conditions'].map((obj)=>{
                                if(obj['field']=='pk_org'){
                                    flag = false;
                                }
                            });
                            if(flag) return;
                        }
                        setDefData('searchVal',this.props.config.datasource,searchVal);
                        this.queryData();
                    });
                    let stockimportconfig = excelImportconfig(props,'uapbd','materialstock',true,'',{appcode: '10140MAG',pagecode: 'stock_import'},()=>{});
                    props.button.setUploadConfig("importstock",stockimportconfig);
                    let saleimportconfig = excelImportconfig(props,'uapbd','materialsale',true,'',{appcode: '10140MAG',pagecode: 'sale_import'},()=>{});
                    props.button.setUploadConfig("importsale",saleimportconfig);
                    let fiimportconfig = excelImportconfig(props,'uapbd','materialfi',true,'',{appcode: '10140MAG',pagecode: 'fi_import'},()=>{});
                    props.button.setUploadConfig("importfi",fiimportconfig);
                    let puimportconfig = excelImportconfig(props,'uapbd','materialpu',true,'',{appcode: '10140MAG',pagecode: 'pu_import'},()=>{});
                    props.button.setUploadConfig("importpu",puimportconfig);
                    let prodimportconfig = excelImportconfig(props,'uapbd','materialprod',true,'',{appcode: '10140MAG',pagecode: 'prod_import'},()=>{});
                    props.button.setUploadConfig("importprod",prodimportconfig);
                    let costimportconfig = excelImportconfig(props,'uapbd','materialcost',true,'',{appcode: '10140MAG',pagecode: 'cost_import'},()=>{});
                    props.button.setUploadConfig("importcost",costimportconfig);
                    let planimportconfig = excelImportconfig(props,'uapbd','materialplan',true,'',{appcode: '10140MAG',pagecode: 'plan_import'},()=>{});
                    props.button.setUploadConfig("importplan",planimportconfig);
                    let pfcimportconfig = excelImportconfig(props,'uapbd','materialpfc',true,'',{appcode: '10140MAG',pagecode: 'pfc_import'},()=>{});
                    props.button.setUploadConfig("importpfc",pfcimportconfig);
                    let pfccimportconfig = excelImportconfig(props,'uapbd','materialpfcc',true,'',{appcode: '10140MAG',pagecode: 'pfcc_import'},()=>{});
                    props.button.setUploadConfig("importpfcc",pfccimportconfig);
                    props.button.setUploadConfig("import",excelimportconfig);
                    props.button.setButtons(button);

                    //物料节点加载时发送的请求，判定是否可直接录入,若可直接录入则显示导入按钮
                    props.button.setButtonsVisible({import : false, export : false});
                    ajax({
                        url : urls['qryIsAddMaterialAction'],
                        loading:false,
                        data : {},
                        success : (res2) => {
                            if(res2.data){
                                props.button.setButtonsVisible({import : true, export : true});
                            }
                        }
                    });
                }
                let meta = data.template;
                meta = modifierMeta(props,meta);
                meta['fi_list'] = res.data.fi_list_template.fi_list;
                meta['pfc_list'] = res.data.pfc_list_template.pfc_list;
                meta['pu_list'] = res.data.pu_list_template.pu_list;
                meta['sale_list'] = res.data.sale_list_template.sale_list;
                meta['stock_list'] = res.data.stock_list_template.stock_list;
                meta['plan_list'] = res.data.plan_list_template.plan_list;
                meta['prod_list'] = res.data.prod_list_template.prod_list;
                meta['cost_list'] = res.data.cost_list_template.cost_list;
                meta['pfccinfo_list'] = res.data.pfcc_list_template.pfccinfo_list;

                //将财务信息卡片模板放入meta中
                meta['materialfi'] = res.data.fi_template.materialfi;
                meta['fi_base'] = res.data.fi_template.fi_base;
                meta['fi_audit'] = res.data.fi_template.fi_audit;

                //将利润中心信息卡片模板放入meta中
                meta['materialpfc'] = res.data.pfc_template.materialpfc;
                meta['pfc_base'] = res.data.pfc_template.pfc_base;
                meta['pfc_audit'] = res.data.pfc_template.pfc_audit;
                meta['materialpfcsub_orgbrowse'] = res.data.pfc_template.materialpfcsub;

                //将采购信息卡片模板放入meta中
                meta['materialpu'] = res.data.pu_template.materialpu;
                meta['pu_base'] = res.data.pu_template.pu_base;
                meta['pu_audit'] = res.data.pu_template.pu_audit;

                //将销售信息卡片模板放入meta中
                meta['materialsale'] = res.data.sale_template.materialsale;
                meta['sale_base'] = res.data.sale_template.sale_base;
                meta['sale_audit'] = res.data.sale_template.sale_audit;
                meta['materialbindle_orgbrowse'] = res.data.sale_template.materialbindle;

                //将库存信息卡片模板放入meta中
                meta['materialstock'] = res.data.stock_template.materialstock;
                meta['stock_base'] = res.data.stock_template.stock_base;
                meta['stock_freeasst'] = res.data.stock_template.stock_freeasst;
                meta['stock_check'] = res.data.stock_template.stock_check;
                meta['stock_atp'] = res.data.stock_template.stock_atp;
                meta['stock_realusableamount'] = res.data.stock_template.stock_realusableamount;
                meta['stock_audit'] = res.data.stock_template.stock_audit;
                meta['materialwarh_orgbrowse'] = res.data.stock_template.materialwarh;

                //将计划信息卡片模板放入meta中
                meta['materialplan'] = res.data.plan_template.materialplan;
                meta['plan_base'] = res.data.plan_template.plan_base;
                meta['plan_marasst'] = res.data.plan_template.plan_marasst;
                meta['plan_audit'] = res.data.plan_template.plan_audit;
                meta['materialrepl_orgbrowse'] = res.data.plan_template.materialrepl;

                //将生产信息卡片模板放入meta中
                meta['materialprod'] = res.data.prod_template.materialprod;
                meta['prod_base'] = res.data.prod_template.prod_base;
                meta['producecost'] = res.data.prod_template.producecost;
                meta['costvalutasst'] = res.data.prod_template.costvalutasst;
                meta['prod_audit'] = res.data.prod_template.prod_audit;

                //将成本信息卡片模板放入meta中
                meta['materialcost'] = res.data.cost_template.materialcost;
                meta['cost_base'] = res.data.cost_template.cost_base;
                meta['cost_audit'] = res.data.cost_template.cost_audit;
                meta['materialcostmode_orgbrowse'] = res.data.cost_template.materialcostmode;

                for(let i=2;i<16;i++){
                    meta['materialcostmode_orgbrowse'].items.forEach((item,index) => {
                        if(item.attrcode === 'marasst100' || item.attrcode === ('marasst'+i)){
                            item.visible=true;
                        }
                    });
                }

                //将利润中心成本卡片信息放入meta中
                meta['materialpfcc'] = res.data.pfcc_template.materialpfcc;
                meta['pfcc_base'] = res.data.pfcc_template.pfcc_base;
                meta['pfcc_audit'] = res.data.pfcc_template.pfcc_audit;
                meta['profitcostlist_orgbrowse'] = res.data.pfcc_template.profitcostlist;

                meta['base'] = res.data.basecard_template.base;
                meta['materialForm'] = res.data.basecard_template.material;

                //组合原NC也去的单据模板关联关系
                if(!meta['formrelation']){
                    meta['formrelation'] = {};
                }
                meta['formrelation'].materialfi=['fi_base'];//,'fi_audit'
                meta['formrelation'].materialpfc=['pfc_base'];//,'pfc_audit'
                meta['formrelation'].materialpu=['pu_base'];//,'pu_audit'
                meta['formrelation'].materialsale=['sale_base'];//,'sale_audit'
                meta['formrelation'].materialstock=['stock_base','stock_freeasst','stock_check','stock_atp','stock_realusableamount'];//,'stock_audit'
                meta['formrelation'].materialplan=['plan_base','plan_marasst'];//,'plan_audit'
                meta['formrelation'].materialprod=['prod_base','producecost','costvalutasst'];//,'prod_audit'
                meta['formrelation'].materialcost=['cost_base'];//,'cost_audit'
                meta['formrelation'].materialpfcc=['pfcc_base'];//,'pfcc_audit'
                meta['formrelation'].marasstframe=['marasstframe_audit'];
                meta['search4assign'] = res.data.assign_template.search4assign;
                meta['material4assign'] = res.data.assign_template.material4assign;
                meta['assignstatus']=res.data.assignstatus_template.assignstatus;
                let businessInfo = getBusinessInfo();
                meta['search4assign'].items.forEach((item,index)=>{
                    if(item.attrcode === 'pk_org_assign'){
                        meta['search4assign'].items[index].itemtype = 'refer';
                        meta['search4assign'].items[index].refName = props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000158')/* 国际化处理： 业务单元+集团*/;
                        meta['search4assign'].items[index].refName_db = props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000158')/* 国际化处理： 业务单元+集团*/;
                        meta['search4assign'].items[index].refcode = 'uapbd/refer/org/BusinessUnitAndGroupTreeRef/index';
                    }else if(item.attrcode === 'pk_marbasclass'){
                        meta['search4assign'].items[index].isMultiSelectedEnabled = true;
                        meta['search4assign'].items[index].isShowDisabledData = true;
                        meta['search4assign'].items[index].isShowUnit = true;
                    }else if(item.attrcode === 'pk_brand' || item.attrcode === 'prodarea' || item.attrcode === 'pk_prodline' || item.attrcode === 'creator' || item.attrcode === 'modifier' || item.attrcode === 'delperson'){
                        meta['search4assign'].items[index].isShowDisabledData = true;
                    }

                    if(item.attrcode === 'pk_org' && node_type==='ORG_NODE'){
                        meta['search4assign'].items[index].refcode = 'uapbd/refer/org/BusinessUnitAndGroupTreeRef/index';
                        meta['search4assign'].items[index].queryCondition = {
                            AppCode : AppCode,
                            TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryGroupAndOrgSQLBuilder'
                        }
                    }else if(item.attrcode === 'pk_org' && node_type==='GROUP_NODE'){
                        meta['search4assign'].items[index].refcode = 'uapbd/refer/org/BusinessUnitAndGroupTreeRef/index';
                        meta['search4assign'].items[index].queryCondition = {
                            pk_group : businessInfo.groupId,
                            AppCode : AppCode,
                            TreeRefActionExt:'nccloud.web.uapbd.material.action.BusinessUnitAndGroupTreeRefExt'
                        }
                    }
                });
                    
                if(props.config.node_type === 'GROUP_NODE'){
                    //meta['materialqry'] = res.data.marorg_m_template.materialqry;
                    meta['marorg_material'] = res.data.marorg_m_template.marorg_material;
                    meta['marorg'] = res.data.marorg_template.marorg;
                }
                meta['fi_list'].pagination = true;
                meta['pfc_list'].pagination = true;
                meta['pu_list'].pagination = true;
                meta['sale_list'].pagination = true;
                meta['stock_list'].pagination = true;
                meta['plan_list'].pagination = true;
                meta['prod_list'].pagination = true;
                meta['cost_list'].pagination = true;
                meta['pfccinfo_list'].pagination = true;
                props.meta.setMeta(meta,()=>{
                    /* if(node_type==='GROUP_NODE'){
                        let businessInfo = getBusinessInfo();
                        props.search.setSearchValByField(searchid,'pk_org',{value:businessInfo.groupId,display:businessInfo.groupName});
                    } */
                    var cb = callback || function(){};
                    cb();
                });
            }
            
        }
        let reqData = [
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['fi_list']}\"\n}`,
                rqCode: 'fi_list_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['pfc_list']}\"\n}`,
                rqCode: 'pfc_list_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['pu_list']}\"\n}`,
                rqCode: 'pu_list_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['sale_list']}\"\n}`,
                rqCode: 'sale_list_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['stock_list']}\"\n}`,
                rqCode: 'stock_list_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['plan_list']}\"\n}`,
                rqCode: 'plan_list_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['prod_list']}\"\n}`,
                rqCode: 'prod_list_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['cost_list']}\"\n}`,
                rqCode: 'cost_list_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['pfccinfo_list']}\"\n}`,
                rqCode: 'pfcc_list_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['fi']}\"\n}`,
                rqCode: 'fi_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['pfc']}\"\n}`,
                rqCode: 'pfc_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['pu']}\"\n}`,
                rqCode: 'pu_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['sale']}\"\n}`,
                rqCode: 'sale_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['stock']}\"\n}`,
                rqCode: 'stock_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['plan']}\"\n}`,
                rqCode: 'plan_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['prod']}\"\n}`,
                rqCode: 'prod_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['cost']}\"\n}`,
                rqCode: 'cost_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['pfccinfo']}\"\n}`,
                rqCode: 'pfcc_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['assign']}\"\n}`,
                rqCode: 'assign_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['assignstatus']}\"\n}`,
                rqCode: 'assignstatus_template'
            },
            {
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"${pagecodeValues['cardpagecode']}\"\n}`,
                rqCode: 'basecard_template'
            },
            {
                rqUrl: urls['queryPermOrg'],
                rqCode: 'permOrg'
            }
        ];
        if(props.config.node_type === 'GROUP_NODE'){
            reqData.push({
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"10140MORG_marorg_m\"\n}`,
                rqCode: 'marorg_m_template'
            });
            reqData.push({
                rqUrl: urls['queryTemp'],
                rqJson: `{\n  \"pagecode\": \"10140MORG_marorg\"\n}`,
                rqCode: 'marorg_template'
            });
        }

        ajax({
            url : urls['mergerequest'],
            data : reqData,
            success : (res1) => {
                res = res1;
                count = count + 1;
                handleMeta();
            }
        });

        props.createUIDom({
            pagecode : pagecode
        },
        (data1)=>{
            data = data1;
            if(data && data.context){
                this.state.context = data.context;
                this.setState(this.state);
            }
            
            count = count + 1;
            handleMeta();
        });
    }

    modifierMeta = (tableInnerButtonClick,props,meta) => {
        let businessInfo = getBusinessInfo();
        let AppCode =props.getAppCode();
        let opr = {
            attrcode: 'opr',
            key : 'opr',
            label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060'),/* 国际化处理： 操作*/
            visible: true,
            className:'table-opr',
            width:200,
            itemtype: 'customer',
            fixed:'right',
            render(text, record, index) {
                console.log(record);
                let oprbtn = [];
                let pk_org = record.pk_org.value;
                if(permOrg.indexOf(pk_org) !== -1){
                    oprbtn.push('EditOpr');
                    oprbtn.push('DeleteOpr');
                }
                oprbtn.push('CopyOpr');
                if(permOrg.indexOf(pk_org) !== -1){
                    if(record.enablestate.value === '2'){
                        oprbtn.push('DisableOpr');
                    }else{
                        oprbtn.push('EnableOpr');
                    }
                    oprbtn.push('CreateVersionOpr');
                }
                if(record.pk_material_pf && record.pk_material_pf.value){
                    oprbtn.push('AssociateOpr');
                }
                if(record.pk_group.value !== record.pk_org.value){
                    oprbtn.push('UpgradeOpr');
                }
                oprbtn.push('FileOpr');
                return props.button.createOprationButton(
                    oprbtn,
                    {
                        area:'list_opr',
                        buttonLimit:3,
                        onButtonClick : tableInnerButtonClick.bind(this,record,index)
                    }
                );
            }
        };
        meta[tableid].items.forEach((item,index)=>{
            if(item.attrcode === 'code'){
                item.render = (text, record) => {
                    return (
                        <span
                            style={{color: '#007ace', cursor: 'pointer' }}
                            onClick={() => {
                                this.props.pushTo('/card',{
                                    pagecode:this.props.config.pagecodecard,
                                    status:'browse',
                                    id : record['pk_material'].value
                                });
                            }}
                        >
                            {record && record['code'] && record['code'].value}
                        </span>
                    );
                };
            }
        });
        meta[tableid].items.push(opr);
        meta['material_search'].items.forEach((item,index)=>{
            if(item.attrcode === 'pk_org_assign'){
                meta['material_search'].items[index].itemtype = 'refer';
                meta['material_search'].items[index].refcode = 'uapbd/refer/org/BusinessUnitTreeRef/index';
                meta['material_search'].items[index].queryCondition = {
                    AppCode : AppCode,
                    TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                }
            }else if(item.attrcode === 'pk_marbasclass'){
                meta['material_search'].items[index].isMultiSelectedEnabled = true;
                meta['material_search'].items[index].isShowDisabledData = true;
                meta['material_search'].items[index].isShowUnit = true;
            }else if(item.attrcode === 'pk_brand' || item.attrcode === 'prodarea' || item.attrcode === 'pk_prodline' || item.attrcode === 'creator' || item.attrcode === 'modifier' || item.attrcode === 'delperson'){
                meta['material_search'].items[index].isShowDisabledData = true;
            }
            if(item.attrcode === 'pk_org' && node_type==='ORG_NODE'){
                meta['material_search'].items[index].refcode = 'uapbd/refer/org/BusinessUnitAndGroupTreeRef/index';
                meta['material_search'].items[index].queryCondition = {
                    AppCode : AppCode,
                    TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryGroupAndOrgSQLBuilder'
                }
            }else if(item.attrcode === 'pk_org' && node_type==='GROUP_NODE'){
                meta['material_search'].items[index].refcode = 'uapbd/refer/org/BusinessUnitAndGroupTreeRef/index';
                meta['material_search'].items[index].queryCondition = {
                    pk_group : businessInfo.groupId,
                    AppCode : AppCode,
                    TreeRefActionExt:'nccloud.web.uapbd.material.action.BusinessUnitAndGroupTreeRefExt'
                }
                //uapbd/refer/org/GroupDefaultTreeRef/index
            }
        });
        meta['materialqry'].items.forEach((item,index)=>{
            if(item.attrcode === 'pk_marbasclass'){
                meta['materialqry'].items[index].isMultiSelectedEnabled = true;
                meta['materialqry'].items[index].isShowDisabledData = true;
                meta['materialqry'].items[index].isShowUnit = true;
            }else if(item.attrcode === 'pk_org' && node_type==='GROUP_NODE'){
                meta['materialqry'].items[index].refcode = 'uapbd/refer/org/BusinessUnitTreeRef/index';
                meta['materialqry'].items[index].isShowDisabledData=true;
                meta['materialqry'].items[index].queryCondition = {
                    AppCode : AppCode,
                    TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                }
                //uapbd/refer/org/GroupDefaultTreeRef/index
            }
        });
        return meta;
    }

    tableInnerButtonClick = (record,index,props, id) => {
        switch(id){
            case 'EditOpr':
                ajax({
                    url : urls['editMaterial'],
                    data : {pk:record.pk_material.value},
                    success : (res) => {
                        this.props.pushTo('/card',{
                            pagecode:this.props.config.pagecodecard,
                            status:'edit',
                            id : record.pk_material.value
                        });
                    }
                })
                break;
            case 'DeleteOpr':
                let dataArr = [{
                    status: '1',
                    values : {
                        pk_material : record.pk_material,
                        ts : record.ts,
                        code : record.code,
                        name : record.name
                    }
                }];
                props.modal.show('deleteModal',{
                    content : this.getDeleteModalContext(dataArr,[index]),	
                    customBtns : this.getDelcustomBtns(dataArr,[index])
                });
                break;
            case 'CopyOpr':
                ajax({
                    url : urls['addMaterial'],
                    data : {node_type:node_type},
                    success : (res) => {
                        this.props.pushTo('/card',{
                            pagecode:this.props.config.pagecodecard,
                            status:'copy',
                            id : record.pk_material.value
                        })
                    }
                });
                break;
            case 'UpgradeOpr':
                if(record.pk_org.value === record.pk_group.value){
                    toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000026'),color:'warning'});/* 国际化处理： 待升级物料全部为集团数据，不需升级。*/
                    break;
                }
                ajax({
                    url : urls['upgrade'],
                    data : {
                        pk_material : record.pk_material.value,
                        ts : record.ts.value,
                        isSure: false,
                        node_type : this.config.node_type
                    },
                    success : (res)=>{
                        let {success,data} = res;
                        if(data && data.result){
                            if(data.result === 'error'){
                                toast({content:data.msg,color:'error'});
                            }else if(data.result === 'tip'){
                                promptBox({
                                    color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                    title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000027'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认升级*/
                                    content: data.msg,             // 提示内容,非必输
                                    noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                                    noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                                    beSureBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                                    cancelBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                                    beSureBtnClick: () => {
                                        ajax({
                                            url : urls['upgrade'],
                                            data : {
                                                pk_material : record.pk_material.value,
                                                ts : record.ts.value,
                                                isSure: true,
                                                node_type : this.config.node_type
                                            },
                                            success : (res) => {
                                                this.onButtonClick(props,'Refresh');
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000028'),color:'success'});/* 国际化处理： 操作成功*/
                                            }
                                        })
                                    }
                                });
                            }
                        }else{
                            this.onButtonClick(props,'Refresh');
                            toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000028'),color:'success'});/* 国际化处理： 操作成功*/
                        }
                    }
                });
                break;
            case 'CreateVersionOpr':
                promptBox({
                    color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000032'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 提示信息*/
                    content: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000061'),             // 提示内容,非必输/* 国际化处理： 是否创建选中物料的新版本数据？*/
                    noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    beSureBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                    cancelBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                    beSureBtnClick: () => {
                        ajax({
                            url : urls['addMaterial'],
                            data : {node_type:this.config.node_type},
                            success : (res) => {
                                props.pushTo('/card',{
                                    pagecode:this.props.config.pagecodecard,
                                    status:'create',
                                    id : record.pk_material.value
                                });
                            }
                        });
                    }
                });
                break;
            case 'AssociateOpr':
                let pk_material_pf = record.pk_material_pf;
                if(pk_material_pf && pk_material_pf.value){
                    this.props.openTo('/uapbd/material/material_pf/approve/index.html',{
                        id:pk_material_pf.value,
                        status:'browse',
                        appcode:'10140MPFA',
                        pagecode : '10140MPFA_approve',
                        ismaterial:true
                    });
                }
                break;
            case 'EnableOpr':
                promptBox({
                    color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000018'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认启用*/
                    content: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000019'),             // 提示内容,非必输/* 国际化处理： 是否确认要启用数据？*/
                    noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    beSureBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                    cancelBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                    beSureBtnClick: () => {
                        let enable_data = {
                            pageid:pagecode,
                            model: {
                                areaType: 'table',
                                pageinfo: null,
                                rows: [{
                                    status: '1',
                                    values : {
                                        pk_material : record.pk_material,
                                        ts : record.ts
                                    }
                                }]
                            }
                        };
                        ajax({
                            url: urls['enableMaterial'],
                            data:enable_data,
                            success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                                let { success,data} = res;
                                console.log(data);
                                if (success) {
                                    Utils.handleTableReData({
                                        tableid : tableid,
                                        props : this.props,
                                        data : data,
                                        notEmpty : (data) => {
                                            let allD = this.props.table.getAllTableData(tableid);
                                            Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                                            filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
                                            this.props.table.setAllTableData(tableid,allD);
                                        }
                                    });
                                }
                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000022'),color:'success'});/* 国际化处理： 启用成功*/
                            }
                        });
                    }
                });
                break;
            case 'DisableOpr':
                promptBox({
                    color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000023'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认停用*/
                    content: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000024'),             // 提示内容,非必输/* 国际化处理： 是否确认要停用数据？*/
                    noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    beSureBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                    cancelBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                    beSureBtnClick: () => {
                        let disable_data = {
                            pageid:pagecode,
                            model: {
                                areaType: 'table',
                                pageinfo: null,
                                rows: [{
                                    status: '1',
                                    values : {
                                        pk_material : record.pk_material,
                                        ts : record.ts
                                    }
                                }]
                            }
                        };
                        ajax({
                            url: urls['disableMaterial'],
                            data:disable_data,
                            success: (res) => {
                                let { success,data} = res;
                                console.log(data);
                                if (success) {
                                    Utils.handleTableReData({
                                        tableid : tableid,
                                        props : this.props,
                                        data : data,
                                        notEmpty : (data) => {
                                            let allD = this.props.table.getAllTableData(tableid);
                                            Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                                            filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
                                            this.props.table.setAllTableData(tableid,allD);
                                        }
                                    });
                                }
                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000025'),color:'success'});/* 国际化处理： 停用成功*/
                            }
                        });
                    }
                });
                break;
            case 'FileOpr':
                this.setState({
                    showUploader:true,
                    uploaderDir : record.pk_material.value
                });
                break;
        }
    
    }

    componentDidMount() {
    }

    /**
     * 点击查询
     */
    clickSearchBtn = (props,data) =>{
        let searchVal = this.props.search.getQueryInfo(searchid);
        if(!searchVal || !searchVal.querycondition) return;
        setDefData('searchVal',this.props.config.datasource,searchVal);
        let pageInfo=this.props.table.getTablePageInfo(tableid);
        // let pageInfo = {
        //     pageIndex : 0,
        //     pageSize : 10
        // };
        this.queryData({pageInfo,isSearch:true});
    }

    queryData = ({pageInfo,isDelete=false,isRefresh = false,isSearch = false}) => {
        let searchdata = getDefData('searchVal',this.props.config.datasource);
        if(!searchdata || !searchdata.querycondition){ 
            let searchVal = this.props.search.getQueryInfo(searchid);
            if(!searchVal || !searchVal.querycondition){
                return;
            }else{
                setDefData('searchVal',this.props.config.datasource,searchVal);
                searchdata = searchVal;
            }
        }
        if(!pageInfo){
            pageInfo =this.props.table.getTablePageInfo(tableid);
        }
        searchdata.pageCode = pagecode;
        searchdata.pageInfo = pageInfo;
        searchdata.custcondition = {conditions:[{
            field:'node_type',value:{firstvalue:this.config.node_type}
        },{
            field:'isShowDisable',value:{firstvalue:this.state.checkflag?'1':'0'}
        }]};
        ajax({
            url: urls['searchQuery'],
            data:searchdata,
            success : (res)=>{
                if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                    this.props.dealFormulamsg(
                        res.formulamsg,  //参数一：返回的公式对象
                        {                //参数二：界面使用的表格类型
                            [tableid]:"simpleTable"
                        }
                    );
                }
                let {sucess,data} = res;
                isRefresh && toast({color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147')});/* 国际化处理： 刷新成功！*/
                if(data&&data[tableid]){
                    this.setState({oids:data[tableid].allpks},this.props.table.setAllTableData(tableid,data[tableid]));
                    let sum = data[tableid].allpks ? data[tableid].allpks.length : 0;
					if(sum === 0){
						isSearch && toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000062'),color:'warning'});/* 国际化处理： 未查询到符合条件的数据！,请注意！*/
					}else{
						isSearch && toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000064',{sum:sum}),color:'success'});/* 国际化处理： 查询成功，共,条数据。,已成功！*/
					}
                }else{
                    isSearch && toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000062'),color:'warning'});/* 国际化处理： 未查询到符合条件的数据！,请注意！*/
                    this.setState({oids:[]},this.props.table.setAllTableData(tableid,{
                        allpks:[],
                        areacode : 'material',
                        rows:[],
                        pageInfo : {
                            pageIndex : 0,
                            pageSize : 10
                        }
                    }));
                }
                this.updateButtonDisable();
            }
        });
    }

    /**
     * 编辑后事件
     */
    onAfterEvent = () => {}

    onSelected = (props, moduleId, record,index,status) => {
        this.updateButtonDisable();
    }

    onSelectedAll = (props, moduleId, status,length) => {
        this.updateButtonDisable();
    }

    /**
     * 行选择变动事件
     */
    selectedChangeFn = (props, moduleId,newVal,oldVal) => {
        this.updateButtonDisable();
    }

    hasPerm = (orgs) => {
        for(let i=0;i<orgs.length;i++){
            if(permOrg.indexOf(orgs[i]) === -1){
                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
                return false;
            }
        }
        return true;
    }

    onButtonClick = (props,id) => {
        switch(id){
            case 'Add':
                ajax({
                    url : urls['addMaterial'],
                    data : {node_type:this.config.node_type},
                    success : (res) => {
                        props.pushTo('/card',{
                            pagecode:this.props.config.pagecodecard,
                            status:'add'
                        })
                    }
                });
                break;
            case 'Delete':
                let rows = props.table.getCheckedRows(tableid);
                if(!rows || rows.length === 0){
                    toast({content:请选择数据,color:'warning'});/* 国际化处理： 请选择数据,请选择数据*/
                    return 
                }
                let pk_orgs = [];
                rows.forEach(row=>{pk_orgs.push(row.data.values.pk_org.value)});
                if(this.hasPerm(pk_orgs)){
                    props.modal.show('deleteModal',{
                        content : this.getDeleteModalContext(),	
                        customBtns : this.getDelcustomBtns()
                    });
                }
                break;
            case 'BatchUpdate':
                rows = props.table.getCheckedRows(tableid);
                if(!rows || rows.length === 0){
                    toast({content:请选择数据,color:'warning'});/* 国际化处理： 请选择数据,请选择数据*/
                    return 
                }
                let orgs = [];
                let pks = [];
                rows.forEach(item=>{
                    orgs.push(item.data.values.pk_org.value);
                    pks.push(item.data.values.pk_material.value);
                });
                
                this.Batcheditmodal.show(pks,orgs,permOrg);

                // rows = props.table.getCheckedRows(tableid);
                // if(!rows || rows.length === 0){
                //     toast({content:请选择数据,color:'warning'});/* 国际化处理： 请选择数据,请选择数据*/
                //     return 
                // }
                
                
                // if(!this.hasPerm(orgs)){
                //     return;
                // }
                
                 break;
            case 'BatchUpdateWizard':
                this.Batcheditstepmodal.show();
                break;
            case 'BatchUpdateRuleTeam':
                if(this.props.config.node_type === 'ORG_NODE'){
                    this.props.openTo('/uapbd/material/batchupdaterule_org/main/index.html',{
                        appcode : '10140BURO',
                        pagecode : '10140BURO_LIST'
                    });
                }else{
                    this.props.openTo('/uapbd/material/batchupdaterule_grp/main/index.html',{
                        appcode : '10140BURG',
                        pagecode : '10140BURG_LIST'
                    });
                }
                break;
            case 'Enable':
                rows = props.table.getCheckedRows(tableid);
                if(!rows || rows.length === 0){
                    toast({content:请选择数据,color:'warning'});/* 国际化处理： 请选择数据,请选择数据*/
                    return 
                }
                pk_orgs = [];
                rows.forEach(row=>{pk_orgs.push(row.data.values.pk_org.value)});
                if(!this.hasPerm(pk_orgs)){
                    break;
                }
                promptBox({
					color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000018'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认启用*/
					content: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000019'),             // 提示内容,非必输/* 国际化处理： 是否确认要启用数据？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: () => {
						let selectedData=this.props.table.getCheckedRows(tableid);
                        let _enable_dataArr=[];
                        selectedData.forEach((val) => {
                            let _enable_Obj = {
                                status: '2',
                                values: {
                                    ts: {
                                        display: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000020'),/* 国际化处理： 时间戳*/
                                    },
                                    pk_material: {
                                        display: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000021'),/* 国际化处理： 主键*/
                                    }
                                }
                            };
                            _enable_Obj.rowid=val.data.rowId;
                            _enable_Obj.values.ts.value=val.data.values.ts.value;
                            _enable_Obj.values.pk_material.value=val.data.values.pk_material.value;
                            _enable_dataArr.push(_enable_Obj);
                        });
                        let enable_data = {
                            pageid:pagecode,
                            model: {
                                areaType: 'table',
                                pageinfo: null,
                                rows: _enable_dataArr
                            }
                        };
                        ajax({
                            url: urls['enableMaterial'],
                            data:enable_data,
                            success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                                let { success,data} = res;
                                console.log(data);
                                if (success) {
                                    Utils.handleTableReData({
                                        tableid : tableid,
                                        props : this.props,
                                        data : data,
                                        notEmpty : (data) => {
                                            let allD = this.props.table.getAllTableData(tableid);
                                            console.log(allD);
                                            Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                                            filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
                                            this.props.table.setAllTableData(tableid,allD);
                                        }
                                    });
                                }
                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000022'),color:'success'});/* 国际化处理： 启用成功*/
                            }
                        });
					}
				});
                break;
            case 'Disable':
                rows = props.table.getCheckedRows(tableid);
                if(!rows || rows.length === 0){
                    toast({content:请选择数据,color:'warning'});/* 国际化处理： 请选择数据,请选择数据*/
                    return 
                }
                pk_orgs = [];
                rows.forEach(row=>{pk_orgs.push(row.data.values.pk_org.value)});
                if(!this.hasPerm(pk_orgs)){
                    break;
                }
                promptBox({
					color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000023'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认停用*/
					content: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000024'),             // 提示内容,非必输/* 国际化处理： 是否确认要停用数据？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: () => {
                        let _disable_selectedData=this.props.table.getCheckedRows(tableid);
                        let _disable_dataArr=[];
                        _disable_selectedData.forEach((val) => {
                            let _disable_Obj = {
                                status: '2',
                                values: {
                                    ts: {
                                        display: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000020'),/* 国际化处理： 时间戳*/
                                    },
                                    pk_material: {
                                        display: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000021'),/* 国际化处理： 主键*/
                                    }
                                }
                            };
                            _disable_Obj.rowid=val.data.rowId;
                            _disable_Obj.values.ts.value=val.data.values.ts.value;
                            _disable_Obj.values.pk_material.value=val.data.values.pk_material.value;
                            _disable_dataArr.push(_disable_Obj);
                        });
                        let disable_data = {
                            pageid:pagecode,
                            model: {
                                areaType: 'table',
                                pageinfo: null,
                                rows: _disable_dataArr
                            }
                        };
                        ajax({
                            url: urls['disableMaterial'],
                            data:disable_data,
                            success: (res) => {
                                let { success,data} = res;
                                console.log(data);
                                if (success) {
                                    Utils.handleTableReData({
                                        tableid : tableid,
                                        props : this.props,
                                        data : data,
                                        notEmpty : (data) => {
                                            let allD = this.props.table.getAllTableData(tableid);
                                            console.log(allD);
                                            Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                                            filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
                                            this.props.table.setAllTableData(tableid,allD);
                                        }
                                    });
                                }
                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000025'),color:'success'});/* 国际化处理： 停用成功*/
                            }
                        });
					}
				});
                break;
            case 'Refresh':
                let searchVal = this.props.search.getQueryInfo(searchid);
                if(!searchVal || !searchVal.querycondition) return;
                setDefData('searchVal',this.props.config.datasource,searchVal);
                let pageInfo=this.props.table.getTablePageInfo(tableid);
                // let pageInfo = {
                //     pageIndex : 0,
                //     pageSize : 10
                // };
                this.queryData({pageInfo,isRefresh:true});
                break;
            case 'Copy':
                rows = props.table.getCheckedRows(tableid);
                if(!rows || rows.length !== 1){
                    toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000067'),color:'warning'});/* 国际化处理： 请选择一条数据进行复制*/
                    return 
                }
                ajax({
                    url : urls['addMaterial'],
                    data : {node_type:this.config.node_type},
                    success : (res) => {
                        props.pushTo('card',{
                            pagecode:this.props.config.pagecodecard,
                            status:'copy',
                            id : rows[0].data.values['pk_material'].value
                        })
                    }
                });
                break;
            case 'Assign'://快速分配
                rows = props.table.getCheckedRows(tableid);
                if(!rows || rows.length === 0){
                    toast({content:请选择数据,color:'warning'});/* 国际化处理： 请选择数据,请选择数据*/
                    return 
                }
                pk_orgs = [];
                rows.forEach(row=>{pk_orgs.push(row.data.values.pk_org.value)});
                ajax({
                    url : urls['queryJurisdiction'],
                    data : {},
                    success : (res) => {
                        if(res.data){
                            
                        }else{
                            if(!this.hasPerm(pk_orgs)){
                                return;
                            }
                        }
                        let ids = [];
                        rows.forEach((val) => {
                            ids.push(val.data.values.pk_material.value);
                        });
                        this.setState({assignModal:true},()=>{this.assignModal.show(ids,false);});
                    }
                });
                
                //this.assignModal.show(ids,false);
                break;
            case 'AssignWizard':
                //this.assignStepModal.show('assign');
                // rows = props.table.getCheckedRows(tableid);
                // if(!rows || rows.length === 0){
                //     toast({content:请选择数据,color:'warning'});/* 国际化处理： 请选择数据,请选择数据*/
                //     return 
                // }
                // pk_orgs = [];
                // rows.forEach(row=>{pk_orgs.push(row.data.values.pk_org.value)});
                // ajax({
                //     url : urls['queryJurisdiction'],
                //     data : {},
                //     success : (res) => {
                //         if(res.data){
                            
                //         }else{
                //             if(!this.hasPerm(pk_orgs)){
                //                 return;
                //             }
                //         }
                //         this.setState({assignStepModal:true},()=>{this.assignStepModal.show('assign');});
                //     }
                // });
                this.setState({assignStepModal:true},()=>{this.assignStepModal.show('assign');});
                
                break;
            case 'CancelAssign':
                rows = props.table.getCheckedRows(tableid);
                if(!rows || rows.length === 0){
                    toast({content:请选择数据,color:'warning'});/* 国际化处理： 请选择数据,请选择数据*/
                    return 
                }
                pk_orgs = [];
                rows.forEach(row=>{pk_orgs.push(row.data.values.pk_org.value)});
                ajax({
                    url : urls['queryJurisdiction'],
                    data : {},
                    success : (res) => {
                        if(res.data){
                            
                        }else{
                            if(!this.hasPerm(pk_orgs)){
                                return;
                            }
                        }
                        let ids = [];
                        rows.forEach((val) => {
                            ids.push(val.data.values.pk_material.value);
                        });
                        this.setState({assignModal:true},()=>{this.assignModal.show(ids,true);});
                    }
                });
                
                
                //this.assignModal.show(ids,true);
                break;
            case 'AssignStatus':
                rows = props.table.getCheckedRows(tableid);
                if(!rows || rows.length === 0){
                    toast({content:请选择数据,color:'warning'});/* 国际化处理： 请选择数据,请选择数据*/
                    return 
                }else if(rows.length > 1){
                    toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000068'),color:'warning'});/* 国际化处理： 请选择一条数据*/
                    return 
                }
                this.props.modal.show('assignstatusModal',{
                    content : this.getAssignStatus(rows[0].data.values['pk_material'].value)
                });
                break;
            case 'OrgBrowse':
                props.modal.show('orgBrowseModal');
                break;
            case 'QueryOrgDoc':
                props.modal.show('marOrgModal');
                break;
            case 'Print':
                if(this.state.oids.length === 0){
                    toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000069'),color:'warning'});/* 国际化处理： 无可打印数据*/
                    return;
                }
                if(this.state.oids.length > 16000){
                    toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000160'),color:'warning'});/* 国际化处理： 打印的数据不能大于16000条*/
                    return;
                }
                var tableorder = this.props.table.getSortParam(tableid);
                print('pdf',
                urls['print'],
                {
                    funcode : this.config.print.funcode,
                    appcode : this.config.appcode,
                    nodekey : this.config.print.nodekey,
                    userjson:`{order:${tableorder  && tableorder.sortParam[0].order},field:${tableorder  && tableorder.sortParam[0].field}}`,
                    oids : this.state.oids
                });
                break;
            case 'Output':
                if(this.state.oids.length === 0){
                    toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000070'),color:'warning'});/* 国际化处理： 无可输出的数据*/
                    return;
                }
                
                var outorder = this.props.table.getSortParam(tableid);
                let data = {
                    funcode:this.config.print.funcode,  
                    appcode:this.config.appcode,      //小应用编码
                    nodekey:this.config.print.nodekey,     //模板节点标识
                    userjson:`{order:${outorder  && outorder.sortParam[0].order},field:${outorder  && outorder.sortParam[0].field}}`,
                    oids:this.state.oids,    // 功能节点的数据主键  oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印
                    outputType: 'output'
                }
                this.setState(this.state,() => {
                    output({data: data,url:urls['print']})
                });
                break;
            case 'File':
                rows = props.table.getCheckedRows(tableid);
                if(!rows || rows.length !== 1){
                    toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000071'),color:'warning'});/* 国际化处理： 请选择一条数据进行操作*/
                    return 
                }
                pk_orgs = [];
                rows.forEach(row=>{pk_orgs.push(row.data.values.pk_org.value)});
                if(!this.hasPerm(pk_orgs)){
                    break;
                }
                this.setState({
                    showUploader:true,
                    uploaderDir : rows[0].data.values['pk_material'].value
                });
                break;
            case 'export'://导出模板前需清空exportIds
                this.setState({
                    exportIds : [],
                    billType:this.props.config.billType,
                    appcode:this.props.config.appcode,
                    pagecode_card:this.props.config.pagecode_card
                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            case 'exportstock'://导出模板前需清空exportIds
                this.setState({
                    importparams:{type:'stock'},
                    billType:'materialstock',
                    appcode:'10140MAG',
                    pagecode_card:'stock_import'
                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            case 'exportcost'://导出模板前需清空exportIds
                this.setState({
                    importparams:{type:'cost'},
                    billType:'materialcost',
                    appcode:'10140MAG',
                    pagecode_card:'cost_import'
                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            case 'exportsale'://导出模板前需清空exportIds
                this.setState({
                    importparams:{type:'sale'},
                    billType:'materialsale',
                    appcode:'10140MAG',
                    pagecode_card:'sale_import'
                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            case 'exportfi'://导出模板前需清空exportIds
                this.setState({
                    importparams:{type:'fi'},
                    billType:'materialfi',
                    appcode:'10140MAG',
                    pagecode_card:'fi_import'
                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            case 'exportpu'://导出模板前需清空exportIds
                this.setState({
                    importparams:{type:'pu'},
                    billType:'materialpu',
                    appcode:'10140MAG',
                    pagecode_card:'pu_import'
                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            case 'exportplan'://导出模板前需清空exportIds
                this.setState({
                    importparams:{type:'plan'},
                    billType:'materialplan',
                    appcode:'10140MAG',
                    pagecode_card:'plan_import'
                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            case 'exportprod'://导出模板前需清空exportIds
                this.setState({
                    importparams:{type:'prod'},
                    billType:'materialprod',
                    appcode:'10140MAG',
                    pagecode_card:'prod_import'
                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            case 'exportpfc'://导出模板前需清空exportIds
                this.setState({
                    importparams:{type:'pfc'},
                    billType:'materialpfc',
                    appcode:'10140MAG',
                    pagecode_card:'pfc_import'
                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            case 'exportpfcc'://导出模板前需清空exportIds
                this.setState({
                    importparams:{type:'pfcc'},
                    billType:'materialpfcc',
                    appcode:'10140MAG',
                    pagecode_card:'pfcc_import'
                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            case 'exportData'://导出数据前需将界面上数据的主键填充到exportIds
                if(this.state.oids.length === 0){
                    toast({content : '无可导出的数据',color : 'warning'});
                    return;
                }
                this.setState({exportIds : deepClone(this.state.oids)},()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            default:
                break;
        }
    }


    getAssignStatus = (pk_material) => {
        let AssignStatusConfig = {pk_material:pk_material};
        return (
            <AssignStatus {...this.props} AssignStatusConfig={AssignStatusConfig} />
        );
    }
    getDeleteModalContext = (dataArr,indexArr) => {
        let newModalTitle={color: '#111111',fontWeight: 'normal !important',paddingLeft: 38,lineHeight: '21px',fontSize: 18,marginTop: 5,display: 'flex'};
        let newModalBody={marginBottom: 15,padding: '8px 47px 0 85px',width: '100%',fontSize: 13,height: '-webkit-max-content',height: '-moz-max-content',height: 'max-content',lineHeight: '21px',color: '#555555'};
        
        return (
            [
                <h4 class="u-modal-title" style={newModalTitle}><span style={{color: '#ffbf00',fontSize:25,marginRight:20}}class="iconfont icon-zhuyi1 warning"></span>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000056')/* 国际化处理： 删除*/}</h4>,
                <div class="u-modal-body" style={newModalBody} tabindex="0">{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000053')/* 国际化处理： 删除可能等待很长的时间，可以点击'后台删除'按钮，调用后台任务执行。*/}</div>,
                
            ]
        )
    }

    getDelcustomBtns = (dataArr,indexArr)=>{
        let newuModalFooter={height: 45,paddingLeft: 0,backgroundColor: '#fff',borderTop: '1px solid #d0d0d0',marginTop: 5,marginBottom:-7,display:'flex',flexDirection:'row-reverse',alignItems:'flex-end'};
        return (
            <div>
                <NCButton filedid = 'sure' onClick={ ()=>{this.props.modal.close("deleteModal");this.onDelForBrowse(false,dataArr,indexArr)}}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000056')/* 国际化处理： 删除*/}</NCButton>
                <NCButton filedid = 'backgroudDelete' colors='primary' onClick={ ()=>{this.props.modal.close("deleteModal");this.onDelForBrowse(true,dataArr,indexArr)}}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000030')/* 国际化处理： 后台删除*/}</NCButton>
                <NCButton fieldid = 'cancel' onClick={()=>{this.props.modal.close("deleteModal");} }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/}</NCButton>
            </div>
        );
    }

    /**
     * 确认删除
     */
    onDelForBrowse(isBackDelete,dataArr,indexArr){
        if(!dataArr){
            let selectedData=this.props.table.getCheckedRows(tableid);
            indexArr=[];
            dataArr=[];
            selectedData.forEach((val) => {
                let delObj = {
                    status: '3',
                    values: {
                        ts: {
                            display: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000020'),/* 国际化处理： 时间戳*/
                        },
                        pk_material: {
                            display: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000021'),/* 国际化处理： 主键*/
                        },
                        name : {
                            display : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000072')/* 国际化处理： 物料名称*/
                        },
                        code : {
                            display : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000073')/* 国际化处理： 物料编码*/
                        }
                    }
                };
                delObj.rowId=val.data.rowId;
                delObj.values.ts.value=val.data.values.ts.value;
                delObj.values.pk_material.value=val.data.values.pk_material.value;
                dataArr.push(delObj);
                indexArr.push(val.index);
            });
        }
		let data = {
			pageid:pagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: dataArr
            },
            userjson : `{\"isBackDelete\":\"${isBackDelete?'1':'0'}\"}`
		};
		ajax({
			url: urls['deleteMaterial'],
			data,
			success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
                    if(isBackDelete){
                        this.queryData({isDelete:true});
                    }else{
                        this.props.table.deleteTableRowsByIndex(tableid, indexArr);
                        dataArr.forEach(item=>{
                            this.props.table.deleteCacheId(tableid,item.values.pk_material.value);
                        });
                        toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029'),color:'success'});/* 国际化处理： 删除成功*/
                        this.queryData({isDelete:true});
                    }
				}
			}
		});
	}

    createOrgDoc = () => {
        return (
            <OrgDoc {...this.props}/>
        );
    }

    createMarOrg = () => {
        return (
            <MarOrg {...this.props}/>
        );
    }

    /**
     * 是否显示停用数据复选框选择事件
     */
    onCheckShowDisable = (value) => {
        this.setState({
            checkflag : value
        },()=>{
            setDefData('checkflag',this.props.config.datasource,value);
            this.queryData({isSearch:true});
        });
    }

    updateButtonDisable = () => {
        let rows = this.props.table.getCheckedRows(tableid);
        let length = rows && rows.length > 0 ? rows.length : 0;
        if(length === 0){
            this.props.button.setDisabled({
                Delete : true,
                AssignStatus : true,
                Assign:true,
                CancelAssign:true,
                BatchUpdate : true,
                Enable:true,
                Disable:true
            });
        }else if(length === 1){
            let Disable = false;
            let Enable = false;
            if(rows[0].data.values.enablestate.value === '2'){
                Enable = true;
            }else{
                Disable = true;
            }
            this.props.button.setDisabled({
                Delete : false,
                Assign:false,
                CancelAssign:false,
                AssignStatus : false,
                BatchUpdate : false,
                Enable:Enable,
                Disable:Disable
            });
        }else if(length > 1){
            this.props.button.setDisabled({
                Delete : false,
                Assign:false,
                CancelAssign:false,
                AssignStatus : true,
                BatchUpdate : false,
                Enable:false,
                Disable:false
            });
        }
        let tableData = this.props.table.getAllTableData(tableid);
        if(tableData && tableData.rows && tableData.rows.length > 0){
            this.props.button.setDisabled({
                Print : false,
                Output:false,
            });
        }else{
            this.props.button.setDisabled({
                Print : true,
                Output:true,
            });
        }
    }

    /**
     * 双击行事件
     */
    onRowDoubleClick = (record,index) => {
        //record(行数据) ，index(当前index)
        this.props.pushTo('/card',{
            pagecode:this.props.config.pagecodecard,
            status:'browse',
            id : record['pk_material'].value
        });
    }

    handlePageInfoChange = (props,config,pks) =>{
        this.queryData({});
    }

    render (){
        let { button, table, search,modal,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
        let {NCCreateSearch} = search;
        let {createSimpleTable } = table;
        let { createButtonApp } = button;
        let {createModal} = modal;
        let {NCCheckbox} = base;
        return (
            <div className="nc-bill-list">
                {/* 头部 */}
                <NCDiv className="nc-bill-header-area" areaCode={NCDiv.config.HEADER}>
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get(this.props.config.title),
                            initShowBackBtn:false
                        })}                        
                    </div>
                    <div className="title-search-detail">
                        <NCCheckbox onChange = {this.onCheckShowDisable} checked = {this.state.checkflag}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000074')/* 国际化处理： 显示停用*/}</NCCheckbox>
                    </div>
                    <div className="title-search-detail" style={{display:'none'}}>
                        <NCCheckbox>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000075')/* 国际化处理： 显示已分配*/}</NCCheckbox>
                    </div>
                    <div className="header-button-area">
                        {createButtonApp({
							area: 'list_head',
							buttonLimit: 3, 
							onButtonClick: this.onButtonClick, 
							popContainer: document.querySelector('.header-button-area')
	
						})}
                    </div>
                </NCDiv>
                {/* 查询区 */}
                <div className="nc-bill-search-area">
                {NCCreateSearch(
                    searchid,//模块id
                    {
                        clickSearchBtn: this.clickSearchBtn,//   点击按钮事件
                        showAdvBtn: true,                           //  显示高级按钮
                        //clickPlanEve:this.clickPlanEve,
                        //addAdvBody:()=>{},
                        //onAfterEvent: this.onAfterEvent.bind(this),  //编辑后事件
                        // searchBtnName :''                        //    查询按钮名称，默认查询
                        // showAdvSearchPlanBtn :false,    //高级面板中是否显示保存方案按钮 ;默认显示
                        // replaceAdvBtnEve:()=>{},        // 业务组替换高级面板 (fun)
                        // replaceAdvBody: this.replaceAdvBody,          // 业务组替换高级面板中的body (fun),return Dom 
                        //addAdvTabs: this.addAdvTabs,              // 添加高级查询区自定义页签 (fun), return Dom 
                        // addAdvBody: ()=>{},              // 添加高级查询区自定义查询条件Dom (fun) , return Dom 
                        oid:'1009Z01000000005855D'        //查询模板的oid，用于查询查询方案
                    }
                )}
                </div>
                {/* 列表区 */}
                <div className="nc-bill-table-area">
                    {createSimpleTable(tableid, {
                        dataSource: this.config.datasource,
                        showIndex : true,
                        showCheck : true,
                        handlePageInfoChange: this.handlePageInfoChange,    // 分页器操作的回调函数
                        onRowDoubleClick : this.onRowDoubleClick,
                        //tableModelConfirm: tableModelConfirmFn,          // 弹窗确认事件回调
                        //onAfterEvent: this.onAfterEvent.bind(this),                      // 弹窗控件的编辑后事件      
                        //onSelected: onSelectedFn,                        // 左侧选择列单个选择框回调
                        //onSelectedAll: onSelectedAllFn,                  // 左侧选择列全选回调
                        selectedChange: this.selectedChangeFn,                // 选择框有变动的钩子函数
                        onSelectedAll:this.onSelectedAll,
                        onSelected:this.onSelected
                        //params: 'test',                                  // 自定义传参
                        }
                    )}
                </div>
                {this.state.assignStepModal && <AssignStepModal ref={(assignStepModal) => this.assignStepModal = assignStepModal} closeEvnt={()=>{this.setState({assignStepModal:false});}} {...this.props}/>}
                {this.state.assignModal && <AssignModal ref={(assignModal) => this.assignModal = assignModal} closeEvnt={()=>{this.setState({assignModal:false});}} {...this.props}/>}
                <Batcheditmodal ref={(item)=>{this.Batcheditmodal=item}} {...this.props} tableConfig={EditTabConfig} url={urls['batchUpdate']} onFinish={(res)=>{this.onButtonClick(this.props,'Refresh')}}/>
                <Batcheditstepmodal ref={(item)=>{this.Batcheditstepmodal=item}} {...this.props} tableConfig={BatchUpdateWizardConfig} url={urls['batchUpdateWizard']} onFinish={(res)=>{this.onButtonClick(this.props,'Refresh')}}/>
                <PrintOutput
                    ref='printOutput'
                    url={urls['print']}
                    data={{
                        funcode : this.config.print.funcode,
                        appcode : this.config.appcode,
						nodekey : this.config.print.nodekey,
						oids : this.state.oids,
						outputType : 'output'
					}}
                />
                {createModal('orgBrowseModal',{
					title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000045'),										//标题/* 国际化处理： 物料按组织查看*/
                    content : this.createOrgDoc(),
                    hasCloseBtn:true,
                    size : 'xlg',
                    noFooter : true							
                })}

                {createModal('marOrgModal',{
                    title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000047'),/* 国际化处理： 查看组织级物料*/
                    content : this.createMarOrg(),
                    hasCloseBtn:true,
                    size : 'xlg',
                    noFooter : true
                })}

                {createModal('assignstatusModal',{
                    title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000048'),/* 国际化处理： 已分配组织查询*/
                    content : '',
                    hasCloseBtn:true,
                    size : 'xlg',
                    noFooter : true
                })}

                {createModal('deleteModal',{
					title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000046'),										//标题/* 国际化处理： 确认删除*/
                    content : '',
                    className:'junior',			//内容
                    noFooter : false,
                    showCustomBtns:true
                })}
                {createModal('modal',{
                    title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000050'),/* 国际化处理： 提示*/
                    size : 'xlg',
                })}
                {this.state.showUploader && <NCUploader 
                    billId={`uapbd/c7dc0ccd-8872-4eee-8882-160e8f49dfad/${this.state.uploaderDir}`} 
                    //billNo={'001'}
                    placement={'bottom'}
                    onHide={()=>{this.setState({showUploader:false})}} // 关闭功能
                    //beforeUpload={this.beforeUpload} 
                    />
                }
                <ExcelImport
                    {...this.props}
                    moduleName ='uapbd'//模块名
                    billType = {this.state.billType}//单据类型
                    appcode={this.state.appcode}//appcode与pagecode为后台转换多语的必填字段，根据节点实际值传入
                    pagecode={this.state.pagecode_card}
                    exportTreeUrl = {'/nccloud/uapbd/material/export.do'}//自定义导出action接口(可不传)
                />
            </div>
        )
    }
}




Material = createPage({
    initTemplate: function(){},
    mutiLangCode: '10140MATERIAL'
})(Material);
export default Material;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65