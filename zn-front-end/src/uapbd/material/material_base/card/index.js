//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 物料卡片
 * @author  yinshb
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,cardCache,print,getBusinessInfo,promptBox,createPageIcon } from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
import {modifierMeta,onRowDoubleClick,updateButtonStatus,modifierAssistant} from './event';
import CheckBoxGroup from '../excomponents/checkBoxGroup';
import MarAsstFrameGridRef from '../../../../uapbd/refer/material/MarAsstFrameGridRef';
import AssignStepModal from '../excomponents/assign/AssignStepModal';
import AssignModal from '../excomponents/assign/AssignModal';
import OrgDoc from  '../excomponents/OrgDoc';
import MarOrg from '../excomponents/MarOrg';
import AssignStatus from '../excomponents/AssignStatus';
import DataTempletModal from './dataTemplet/DataTempletModal';

import Batcheditmodal from '../excomponents/batchEdit/BatchEditModal';
import Batcheditstepmodal from '../excomponents/batchEdit/BatchEditStepModal';
const {NCButton,NCUpload,NCDiv} = base;
let {setDefData, addCache } = cardCache;

import './index.less';

const { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix,NCTabs,NCCheckbox,NCBackBtn } = base;
const NCTabPane = NCTabs.NCTabPane;
const {PrintOutput,NCUploader } = high;
let pagecode = '10140MAG_base_card';
const formid = 'material';
let appid = '0001Z0100000000019GO';

const urls = {
    "queryDefaultValueForAdd" : "/uapbd/material/queryDefaultValueForAdd.do",
    "addMaterial" : "/nccloud/uapbd/material/addMaterial.do",
    "queryJurisdiction":"/nccloud/uapbd/material/queryJurisdiction.do",
    "queryMaterialById" : "/nccloud/uapbd/material/queryById.do",
    "saveMaterial" : "/nccloud/uapbd/material/saveMaterial.do",
    "queryTemp" : "/platform/templet/querypage.do",
    "mergerequest" : "/nccloud/platform/pub/mergerequest.do",
    "queryMarAssistant" : "/uapbd/material/queryMarAssistant.do",
    "queryMarAssistantByFrameID" : "/nccloud/uapbd/material/queryMarAssistantByFrameID.do",
    "saveMarAssFrame" : "/nccloud/uapbd/material/saveMarAssFrame.do",
    "enableMaterial" : "/nccloud/uapbd/material/enableMaterial.do",
    "disableMaterial" : "/nccloud/uapbd/material/disableMaterial.do",
    "print" : "/nccloud/uapbd/material/printMaterial.do",
    "upgrade" : "/nccloud/uapbd/material/upgrade.do",
    "batchUpdate" : "/nccloud/uapbd/material/batchUpdate.do",
    "batchUpdateWizard" : "/nccloud/uapbd/material/batchUpdateWizard.do",
    "queyMaterialBillCode" : "/uapbd/material/queyMaterialBillCode.do",
    "rollBackMaterialBillCode" : "/nccloud/uapbd/material/rollBackMaterialBillCode.do",
    "judgeCodeEdit" : "/nccloud/uapbd/material/judgeCodeEdit.do",
    "editMaterial" : "/nccloud/uapbd/material/editMaterial.do",
    "queryPermOrg" : "/uapbd/material/queryPermOrg.do",
    "deleteMaterial" : "/nccloud/uapbd/material/deleteMaterial.do",
    "refreshMaterialChild" : "/nccloud/uapbd/material/refreshMaterialChild.do",
    "getSysInitToTemplate" : "/uapbd/material/getSysInitToTemplate.do",
    "queryMeasrate" : "/nccloud/uapbd/material/queryMeasrate.do"
};
const delUrls = {
    'fi' : '/nccloud/uapbd/material/delMaterialfi.do',
    'pfc' : '/nccloud/uapbd/material/delMaterialpfc.do',
    'pu' : '/nccloud/uapbd/material/delMaterialpu.do',
    'sale' : '/nccloud/uapbd/material/delMaterialsale.do',
    'stock' : '/nccloud/uapbd/material/delMaterialstock.do',
    'plan' : '/nccloud/uapbd/material/delMaterialplan.do',
    'prod' : '/nccloud/uapbd/material/delMaterialprod.do',
    'cost' : '/nccloud/uapbd/material/delMaterialcost.do',
    'pfccinfo' : '/nccloud/uapbd/material/delMaterialpfcc.do'
}
let pagecodeValues = {};
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

let BatchUpdateWizardConfig = {
    mdId : 'c7dc0ccd-8872-4eee-8882-160e8f49dfad',
    searchid:'search4assign',
    tablepagecode:'assign',
    tableid:'material4assign',
    queryTable:'/nccloud/uapbd/material/queryMaterialForbatchUpdateWizard.do',
    pkName:'pk_material',
    nodeType : '',
    tableRelation : {
        "base_info" : ['material','base'],
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
var values = {
    base : 'base',//物料基本信息
    convert : 'materialconvert',//辅助计量管理
    taxtype : 'materialtaxtype',//物料税类
    fi : 'fi',//财务信息
    pfc : 'pfc',//利润中心
    pu : 'pu',//采购信息
    sale : 'sale',//销售信息
    stock : 'stock',//库存信息
    plan : 'plan',//计划信息
    prod : 'prod',//生产信息
    cost : 'cost',//成本信息
    pfccinfo : 'pfccinfo'//利润中心成本
}

let permOrg = [];
//物料辅助属性
const MarAssistant = [];
let contextOrg = {};
//获取并初始化模板
let initTemplate = (props, callback) => {
    let AppCode =props.getAppCode();
    let reqData = [
        {
            rqUrl: urls['queryMarAssistant'],
            rqCode: 'MarAssistant'
        },
        {//获取辅助属性结构定义保存的卡片模板
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['asstframe']}\"\n}`,
            rqCode: 'asstframe_card'
        },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['fi_list']}\"\n}`,
        //     rqCode: 'fi_list_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['pfc_list']}\"\n}`,
        //     rqCode: 'pfc_list_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['pu_list']}\"\n}`,
        //     rqCode: 'pu_list_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['sale_list']}\"\n}`,
        //     rqCode: 'sale_list_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['stock_list']}\"\n}`,
        //     rqCode: 'stock_list_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['plan_list']}\"\n}`,
        //     rqCode: 'plan_list_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['prod_list']}\"\n}`,
        //     rqCode: 'prod_list_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['cost_list']}\"\n}`,
        //     rqCode: 'cost_list_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['pfccinfo_list']}\"\n}`,
        //     rqCode: 'pfcc_list_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['fi']}\"\n}`,
        //     rqCode: 'fi_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['pfc']}\"\n}`,
        //     rqCode: 'pfc_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['pu']}\"\n}`,
        //     rqCode: 'pu_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['sale']}\"\n}`,
        //     rqCode: 'sale_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['stock']}\"\n}`,
        //     rqCode: 'stock_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['plan']}\"\n}`,
        //     rqCode: 'plan_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['prod']}\"\n}`,
        //     rqCode: 'prod_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['cost']}\"\n}`,
        //     rqCode: 'cost_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['pfccinfo']}\"\n}`,
        //     rqCode: 'pfcc_template'
        // },
        // {
        //     rqUrl: urls['getSysInitToTemplate'],
        //     rqCode: 'getSysInitToTemplate'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['assign']}\"\n}`,
        //     rqCode: 'assign_template'
        // },
        // {
        //     rqUrl: urls['queryTemp'],
        //     rqJson: `{\n  \"pagecode\": \"${pagecodeValues['assignstatus']}\"\n}`,
        //     rqCode: 'assignstatus_template'
        // },
        {
            rqUrl: urls['queryPermOrg'],
            rqCode: 'permOrg'
        }
    ];
    // if(props.config.node_type === 'GROUP_NODE'){
    //     reqData.push({
    //         rqUrl: urls['queryTemp'],
    //         rqJson: `{\n  \"pagecode\": \"10140MORG_marorg_m\"\n}`,
    //         rqCode: 'marorg_m_template'
    //     });
    //     reqData.push({
    //         rqUrl: urls['queryTemp'],
    //         rqJson: `{\n  \"pagecode\": \"10140MORG_marorg\"\n}`,
    //         rqCode: 'marorg_template'
    //     });
    // }
    ajax({
        url : urls['mergerequest'],
        data : reqData,
        success : (res) => {
            //有权限组织pk
            permOrg = res.data.permOrg.permOrg?res.data.permOrg.permOrg:[];
            props.createUIDom({
                pagecode : pagecode
            },
            (data)=>{
                let context = data.context;
                if(context && context.pk_org && context.org_Name && permOrg.indexOf(context.pk_org) > -1){
                    contextOrg.refpk = context.pk_org;
                    contextOrg.refname = context.org_Name;
                }
                let meta = data.template;
                data.button && props.button.setButtons(data.button);
                data.button && props.button.setPopContent(['cost_delete','fi_delete','pfc_delete','pfccinfo_delete','plan_delete','prod_delete','pu_delete','sale_delete','stock_delete'],props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000000'));/* 国际化处理： 确认执行该操作吗？*/
                props.button.setButtonsVisible({
                    Add : false,//新增
                    Edit : false,//修改
                    Save : false,//保存
                    SaveAdd : false,
                    Delete : false,//删除
                    Cancel : false,//取消
                    Refresh : false,//刷新
                    Copy : false,//复制
                    BatchUpdate : false,//批改
                    BatchUpdateWizard : false,//向导批改
                    BatchUpdateRuleTeam : false,//按规则批改
                    Assign : false,//分配
                    CancelAssign : false,//取消分配
                    AssignWizard : false,//向导分配
                    AssignStatus : false,//已分配组织查询
                    assistantMenu : false,//辅助功能下拉按钮组
                    CreateVersion : false,//创建新版本
                    File : false,//附件管理
                    OrgBrowse : false,//按组织查看
                    QueryOrgDoc : false,//查看组织档案
                    Associate : false, //申请单查询
                    Enable:false,//启用
                    Disable:false, //停用
                    Print:false,//打印
                    Upgrade : false,//升级
                    Reback:false,//返回
                    convert_add:true,
                    DataTemplet:false,
                    More:false
                });
                //处理物料辅助属性
                let _cache_MarAssistant = {};
                MarAssistant.splice(0,MarAssistant.length);  
                if(res.data.MarAssistant && res.data.MarAssistant.MarAssistant){
                    res.data.MarAssistant.MarAssistant.forEach((item,index) => {
                        let it = {
                            id:item.pk_userdefitem,
                            name:item.showname
                        }
                        MarAssistant.push(it);
                        _cache_MarAssistant[item.pk_userdefitem]=item;
                    });
                }
                //将用户自定义辅助属性放入前端缓存，同步修改各页签中的辅助属性
                setDefData('_cache_MarAssistant',props.config.datasource,_cache_MarAssistant);
                meta['marasstframe'] = res.data.asstframe_card.marasstframe;
                meta['marasstframe_audit'] = res.data.asstframe_card.marasstframe_audit;

                // meta['fi_list'] = res.data.fi_list_template.fi_list;
                // meta['pfc_list'] = res.data.pfc_list_template.pfc_list;
                // meta['pu_list'] = res.data.pu_list_template.pu_list;
                // meta['sale_list'] = res.data.sale_list_template.sale_list;
                // meta['stock_list'] = res.data.stock_list_template.stock_list;
                // meta['plan_list'] = res.data.plan_list_template.plan_list;
                // meta['prod_list'] = res.data.prod_list_template.prod_list;
                // meta['cost_list'] = res.data.cost_list_template.cost_list;
                // meta['pfccinfo_list'] = res.data.pfcc_list_template.pfccinfo_list;

                //将财务信息卡片模板放入meta中
                // meta['materialfi'] = res.data.fi_template.materialfi;
                // meta['fi_base'] = res.data.fi_template.fi_base;
                // meta['fi_audit'] = res.data.fi_template.fi_audit;

                //将利润中心信息卡片模板放入meta中
                // meta['materialpfc'] = res.data.pfc_template.materialpfc;
                // meta['pfc_base'] = res.data.pfc_template.pfc_base;
                // meta['pfc_audit'] = res.data.pfc_template.pfc_audit;
                // meta['materialpfcsub'] = res.data.pfc_template.materialpfcsub;
                // meta['materialpfcsub_childform1'] = res.data.pfc_template['materialpfcsub_childform1'];
                // meta['materialpfcsub_childform2'] = res.data.pfc_template['materialpfcsub_childform2'];

                //将采购信息卡片模板放入meta中
                // meta['materialpu'] = res.data.pu_template.materialpu;
                // meta['pu_base'] = res.data.pu_template.pu_base;
                // meta['pu_audit'] = res.data.pu_template.pu_audit;

                //将销售信息卡片模板放入meta中
                // meta['materialsale'] = res.data.sale_template.materialsale;
                // meta['sale_base'] = res.data.sale_template.sale_base;
                // meta['sale_audit'] = res.data.sale_template.sale_audit;
                // meta['materialbindle'] = res.data.sale_template.materialbindle;
                // meta['materialbindle_childform1'] = res.data.sale_template['materialbindle_childform1'];
                // meta['materialbindle_childform2'] = res.data.sale_template['materialbindle_childform2'];

                //将库存信息卡片模板放入meta中
                // meta['materialstock'] = res.data.stock_template.materialstock;
                // meta['stock_base'] = res.data.stock_template.stock_base;
                // meta['stock_freeasst'] = res.data.stock_template.stock_freeasst;
                // meta['stock_check'] = res.data.stock_template.stock_check;
                // meta['stock_atp'] = res.data.stock_template.stock_atp;
                // meta['stock_realusableamount'] = res.data.stock_template.stock_realusableamount;
                // meta['stock_audit'] = res.data.stock_template.stock_audit;
                // meta['materialwarh'] = res.data.stock_template.materialwarh;
                // meta['materialwarh_childform1'] = res.data.stock_template['materialwarh_childform1'];
                // meta['materialwarh_childform2'] = res.data.stock_template['materialwarh_childform2'];

                //将计划信息卡片模板放入meta中
                // meta['materialplan'] = res.data.plan_template.materialplan;
                // meta['plan_base'] = res.data.plan_template.plan_base;
                // meta['plan_marasst'] = res.data.plan_template.plan_marasst;
                // meta['plan_audit'] = res.data.plan_template.plan_audit;
                // meta['materialrepl'] = res.data.plan_template.materialrepl;
                // meta['materialrepl_childform1'] = res.data.plan_template['materialrepl_childform1'];
                // meta['materialrepl_childform2'] = res.data.plan_template['materialrepl_childform2'];

                //将生产信息卡片模板放入meta中
                // meta['materialprod'] = res.data.prod_template.materialprod;
                // meta['prod_base'] = res.data.prod_template.prod_base;
                // meta['producecost'] = res.data.prod_template.producecost;
                // meta['costvalutasst'] = res.data.prod_template.costvalutasst;
                // meta['prod_audit'] = res.data.prod_template.prod_audit;

                //将成本信息卡片模板放入meta中
                // meta['materialcost'] = res.data.cost_template.materialcost;
                // meta['cost_base'] = res.data.cost_template.cost_base;
                // meta['cost_audit'] = res.data.cost_template.cost_audit;
                // meta['materialcostmode'] = res.data.cost_template.materialcostmode;
                // meta['materialcostmode_childform1'] = res.data.cost_template['materialcostmode_childform1'];
                // meta['materialcostmode_childform2'] = res.data.cost_template['materialcostmode_childform2'];

                //将利润中心成本卡片信息放入meta中
                // meta['materialpfcc'] = res.data.pfcc_template.materialpfcc;
                // meta['pfcc_base'] = res.data.pfcc_template.pfcc_base;
                // meta['pfcc_audit'] = res.data.pfcc_template.pfcc_audit;
                // meta['profitcostlist'] = res.data.pfcc_template.profitcostlist;
                // meta['profitcostlist_orgbrowse'] = Utils.clone(res.data.pfcc_template.profitcostlist);
                // meta['profitcostlist_childform1'] = res.data.pfcc_template['profitcostlist_childform1'];
                // meta['profitcostlist_childform2'] = res.data.pfcc_template['profitcostlist_childform2'];


                //组合原NC也去的单据模板关联关系
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
                //meta['stock_check'].name = '';
                //meta['stock_atp'].name = '';
                //meta['stock_realusableamount'].name = '';
                // meta['gridrelation'].materialpfcsub={
                //     tabRelation:['materialpfcsub'],
                //     destBrowseAreaCode:'materialpfcsub_childform1',
                //     destEditAreaCode:'materialpfcsub_childform2'
                // };
                // meta['gridrelation'].materialbindle={
                //     tabRelation:['materialbindle'],
                //     destBrowseAreaCode:'materialbindle_childform1',
                //     destEditAreaCode:'materialbindle_childform2'
                // };
                // meta['gridrelation'].materialwarh={
                //     tabRelation:['materialwarh'],
                //     destBrowseAreaCode:'materialwarh_childform1',
                //     destEditAreaCode:'materialwarh_childform2'
                // };
                // meta['gridrelation'].materialrepl={
                //     tabRelation:['materialrepl'],
                //     destBrowseAreaCode:'materialrepl_childform1',
                //     destEditAreaCode:'materialrepl_childform2'
                // };
                // meta['gridrelation'].materialcostmode={
                //     tabRelation:['materialcostmode'],
                //     destBrowseAreaCode:'materialcostmode_childform1',
                //     destEditAreaCode:'materialcostmode_childform2'
                // };
                // meta['gridrelation'].profitcostlist={
                //     tabRelation:['profitcostlist'],
                //     destBrowseAreaCode:'profitcostlist_childform1',
                //     destEditAreaCode:'profitcostlist_childform2'
                // };

                // if(props.config.node_type === 'GROUP_NODE'){
                //     //meta['materialqry'] = res.data.marorg_m_template.materialqry;
                //     meta['marorg_material'] = res.data.marorg_m_template.marorg_material;
                //     meta['marorg'] = res.data.marorg_template.marorg;
                // }
                // meta['assignstatus']=res.data.assignstatus_template.assignstatus;
                // meta['search4assign'] = res.data.assign_template.search4assign;
                // meta['material4assign'] = res.data.assign_template.material4assign;
                // meta['formrelation'].material=['base'];
                //let businessInfo = getBusinessInfo();
                // meta['search4assign'].items.forEach((item,index)=>{
                //     if(item.attrcode === 'pk_org_assign'){
                //         meta['search4assign'].items[index].itemtype = 'refer';
                //         meta['search4assign'].items[index].refName = props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000158')/* 国际化处理： 业务单元+集团*/;
                //         meta['search4assign'].items[index].refName_db = props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000158')/* 国际化处理： 业务单元+集团*/;
                //         meta['search4assign'].items[index].refcode = 'uapbd/refer/org/BusinessUnitAndGroupTreeRef/index';
                //         /* meta['search4assign'].items[index].queryCondition = {
                //             AppCode : props.config.appcode,
                //             TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                //         } */
                //     }else if(item.attrcode === 'pk_marbasclass'){
                //         meta['search4assign'].items[index].isMultiSelectedEnabled = true;
                //     }else if(item.attrcode === 'pk_brand' || item.attrcode === 'prodarea' || item.attrcode === 'pk_prodline' || item.attrcode === 'creator' || item.attrcode === 'modifier' || item.attrcode === 'delperson'){
                //         meta['search4assign'].items[index].isShowDisabledData = true;
                //     }
                //     if(item.attrcode === 'pk_org' && props.config.node_type==='ORG_NODE'){
                //         meta['search4assign'].items[index].refcode = 'uapbd/refer/org/BusinessUnitAndGroupTreeRef/index';
                //         meta['search4assign'].items[index].queryCondition={
                //             AppCode : props.config.appcode,
                //             TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryGroupAndOrgSQLBuilder'
                //         }
                //     }else if(item.attrcode === 'pk_org' && props.config.node_type==='GROUP_NODE'){
                //         meta['search4assign'].items[index].refcode = 'uapbd/refer/org/BusinessUnitAndGroupTreeRef/index';
                //         meta['search4assign'].items[index].queryCondition = {
                //             pk_group : businessInfo.groupId,
                //             AppCode : props.config.appcode,
                //             TreeRefActionExt:'nccloud.web.uapbd.material.action.BusinessUnitAndGroupTreeRefExt'
                //         }
                //     }else if(item.attrcode === 'pk_marbasclass'){
                //         meta['search4assign'].items[index].isMultiSelectedEnabled = true;
                //         meta['search4assign'].items[index].isShowDisabledData = true;
                //         meta['search4assign'].items[index].isShowUnit = true;
                //     }
                // });
                meta['material'].items.forEach((item,index)=>{
                    if(item.attrcode === 'pk_org'){
                        meta['material'].items[index].queryCondition={
                            AppCode : AppCode,
                            TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                        }
                    }else if(item.attrcode === 'pk_marbasclass'){
                        meta['material'].items[index].isShowUnit = true;
                        item.onlyLeafCanSelect=true
                    }
                });
                //modifeird by wangying16 for NCCLOUD-137512
                //物料基本分类参照只允许选末级及叶子节点
                meta['base'].items.forEach((item,index)=>{
                     if(item.attrcode === 'pk_marbasclass'){
                        item.onlyLeafCanSelect=true
                    }
                });

                ///////设置BD303,BD304,BD305三个业务参数
                let getSysInitToTemplate = res.data.getSysInitToTemplate;
                if(getSysInitToTemplate){
                    meta['base'].items.forEach(item=>{
                        if(item.attrcode === 'storeunitnum'){
                            let storeunitnum = item.label;
                            if(storeunitnum.indexOf('（') > -1){
                                storeunitnum = storeunitnum.substring(0,storeunitnum.indexOf('（'));
                            }
                            if(getSysInitToTemplate.storeunitnum && getSysInitToTemplate.storeunitnum.name){
                                storeunitnum = storeunitnum + '（' + getSysInitToTemplate.storeunitnum.name + '）';
                            }
                            item.label = storeunitnum;
                        }else if(item.attrcode === 'unitvolume'){
                            let unitvolume = item.label;
                            if(unitvolume.indexOf('（') > -1){
                                unitvolume = unitvolume.substring(0,unitvolume.indexOf('（'));
                            }
                            if(getSysInitToTemplate.unitvolume && getSysInitToTemplate.unitvolume.name){
                                unitvolume = unitvolume + '（' + getSysInitToTemplate.unitvolume.name + '）';
                            }
                            item.label = unitvolume;
                        }else if(item.attrcode === 'unitweight'){
                            let unitweight = item.label;
                            if(unitweight.indexOf('（') > -1){
                                unitweight = unitweight.substring(0,unitweight.indexOf('（'));
                            }
                            if(getSysInitToTemplate.unitweight && getSysInitToTemplate.unitweight.name){
                                unitweight = unitweight + '（' + getSysInitToTemplate.unitweight.name + '）';
                            }
                            item.label = unitweight;
                        }
                    });
                }
                

                props.setRelationItemBillinfo([
                    {
                        billtype: 'extcard',
                        pagecode: '10140MAG_base_card',
                        templetid: data.template.pageid,
                        headcode: 'material',
                        bodycode: ['materialconvert']
                    },
                    // {
                    //     billtype: 'form',
                    //     pagecode: 'fi_card',
                    //     templetid: res.data.fi_template.pageid,
                    //     headcode: 'materialfi'
                    // },
                    // {
                    //     billtype: 'extcard',
                    //     pagecode: 'pfc_card',
                    //     templetid: res.data.pfc_template.pageid,
                    //     headcode: 'materialpfc',
                    //     bodycode: ['materialpfcsub']
                    // },
                    // {
                    //     billtype: 'form',
                    //     pagecode: 'pu_card',
                    //     templetid: res.data.pu_template.pageid,
                    //     headcode: 'materialpu'
                    // },
                    // {
                    //     billtype: 'extcard',
                    //     pagecode: 'sale_card',
                    //     templetid: res.data.sale_template.pageid,
                    //     headcode: 'materialsale',
                    //     bodycode: ['materialbindle']
                    // },
                    // {
                    //     billtype: 'extcard',
                    //     pagecode: 'stock_card',
                    //     templetid: res.data.stock_template.pageid,
                    //     headcode: 'materialstock',
                    //     bodycode: ['materialwarh']
                    // },
                    // {
                    //     billtype: 'extcard',
                    //     pagecode: 'plan_card',
                    //     templetid: res.data.plan_template.pageid,
                    //     headcode: 'materialplan',
                    //     bodycode: ['materialrepl']
                    // },
                    // {
                    //     billtype: 'form',
                    //     pagecode: 'prod_card',
                    //     templetid: res.data.prod_template.pageid,
                    //     headcode: 'materialprod'
                    // },
                    // {
                    //     billtype: 'extcard',
                    //     pagecode: 'cost_card',
                    //     templetid: res.data.cost_template.pageid,
                    //     headcode: 'materialcost',
                    //     bodycode: ['materialcostmode']
                    // },
                    // {
                    //     billtype: 'extcard',
                    //     pagecode: 'profitcost_card',
                    //     templetid: res.data.pfcc_template.pageid,
                    //     headcode: 'materialpfcc',
                    //     bodycode: ['profitcostlist']
                    // }
                ]);
                meta = modifierMeta(props, meta,values,pagecodeValues);
                meta.validateFlag = true;
                props.meta.setMeta(meta);
                
                setTimeout(() => {
                    var cb = callback || function(){};
                    cb();
                }, 10);
                
            });
        }
    });
}

class Material extends Component {

    constructor(props) {
        super(props);
        this.materialID = props.getUrlParam('id');
        this.panelCheckModel = {};

        setDefData('cacheRowid',props.config.datasource,{});
        //status参数不传，默认为浏览态
        this.pageStatus = props.getUrlParam('status');
        this.pageStatus = this.pageStatus ? this.pageStatus : 'browse';
        this.state = {
            status,
            code : '',//记录编码规则生成的编码
            formStatus : (this.pageStatus === 'copy' || this.pageStatus === 'create' || this.pageStatus === 'add')?'add':this.pageStatus,
            MarAssistantShowStatus:true,
            checkModel:{},
            panelCheckModel:{},
            isSaveFrame:false,
            isBrowse:this.pageStatus === 'browse',
            oids : [],
            childOids:[],
            printConfig : {
                funcode : '',
                nodekey : '',
                url : ''
            },
            showUploader:false,
            uploaderDir:'',
            showImgUploader:false,
            img_url : '',
            picEdit : false,
            imguploaddata : {},
            imgcachelist : [],
            isUploadImg : false,
            pageDrawing : false
        }
        this.config = props.config;
        BatchUpdateWizardConfig.nodeType = this.config.node_type;
        appid = this.config.appid;
        pagecode = this.config.pagecode;
        pagecodeValues = this.config.pagecodeValues;
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        initTemplate(this.props, ()=>{
            if(this.pageStatus !== 'add'){
                this.getData();
            }else{
                if(this.config.node_type === 'GROUP_NODE'){
                    let businessInfo = getBusinessInfo();
                    this.getAddData(businessInfo.groupId);
                }else{
                    if(contextOrg.refpk){
                        this.getAddData(contextOrg.refpk);
                    }else{
                        this.getAddData();
                    }
                    
                }
                
            }
            this.updateFormEditEnable(this.config.node_type);
        })
    }

    updateFormEditEnable(node_type){
        if((this.pageStatus === 'add' || this.pageStatus === 'create'|| this.pageStatus === 'copy') && node_type === 'ORG_NODE'){//组织节点并且是新增时
            this.props.form.setFormItemsDisabled(formid,{pk_org:false});
        }else{
            this.props.form.setFormItemsDisabled(formid,{pk_org:true});
        }
    }

    componentWillUpdate() {
        if(this.state.formStatus && this.state.formStatus !== 'browse'){
            window.onbeforeunload = () =>{
                return this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000001')/* 国际化处理： 页面还没有保存，确定离开页面？*/
            }
        }else{
            window.onbeforeunload = null;
        }
    }

    /**
     * 新增时发送请求，主要设置一些默认值使用
     */
    getAddData  = (pk_org) => {
        if(this.pageStatus == 'add'){
            this.props.form.EmptyAllFormValue(formid);
            this.props.form.setFormStatus(formid,'add');
        }
        let data = [
            {
                rqUrl: urls['queryDefaultValueForAdd'],
                rqJson: `{ \"pagecode\": \"${pagecode}\",\"funcode\":\"${this.config.dataTemplet_funcode}\",\"node_type\":\"${this.config.node_type}\"}`,
                rqCode: 'queryDefaultValueForAdd'
            }
        ];
        if(pk_org){
            data.push({
                rqUrl: urls['queyMaterialBillCode'],
                rqJson: `{ \"pk_org\": \"${pk_org}\"}`,
                rqCode: 'queyMaterialBillCode'
            });
        }
        ajax({
            url : urls['mergerequest'],
            data:data,
            success : (res) => {
                let {success,data} = res;
                if (data.queryDefaultValueForAdd.formulamsg && data.queryDefaultValueForAdd.formulamsg instanceof Array && data.queryDefaultValueForAdd.formulamsg.length > 0) {
                    this.props.dealFormulamsg(
                        data.queryDefaultValueForAdd.formulamsg,  //参数一：返回的公式对象
                        {                //参数二：界面使用的表格类型
                            'maiterial':"form",
                            'materialconvert':'cardTable'
                        }
                    );
                }
                
                if(data.queryDefaultValueForAdd.head){
                    debugger;
                    Utils.filterEmptyData(data.queryDefaultValueForAdd.head.material.rows[0].values);
                    this.props.form.setAllFormValue({material:data.queryDefaultValueForAdd.head.material});
                    /////////////////////////////////
                    this.setState({img_url:null});
                    ////////////////////////////////
                    if(this.config.node_type === 'ORG_NODE'){
                        if(contextOrg.refpk){
                            this.props.form.setFormItemsValue(formid,{'pk_org' : {value:contextOrg.refpk,display:contextOrg.refname}});
                            let meta = this.props.meta.getMeta();
                            meta['base'].items.map(item=>{
                                if(item.attrcode === 'pk_marbasclass'){
                                    item.queryCondition = {
                                        pk_org : contextOrg.refpk
                                    }
                                }
                            });
                            this.props.meta.setMeta(meta);
                        }
                        
                    }
                    this.updatePageStatus();
                    updateButtonStatus(this.props,this.state.formStatus==='add'?this.pageStatus:this.state.formStatus);
                }
                if(data.queyMaterialBillCode){
                    if(data.queyMaterialBillCode.code){
                        this.props.form.setFormItemsValue(formid,{'code' : {value:data.queyMaterialBillCode.code}});
                        this.setState({
                            code : data.queyMaterialBillCode.code
                        })
                    }
                    if(data.queyMaterialBillCode.isNextCode){
                        this.props.form.setFormItemsRequired(formid,{'code':false});
                        this.props.form.setFormItemsDisabled(formid,{'code':true});
                    }else{
                        this.props.form.setFormItemsRequired(formid,{'code':true});
                        this.props.form.setFormItemsDisabled(formid,{'code':!data.queyMaterialBillCode.isCodeEdit});
                    }
                }
                setTimeout(() => {
                    this.updateUploadData();//更新上传路径
                }, 0);
            }
        });
    }

    initChidlData(that,flag){
        let fi_isunfold =that.props.meta.getMeta().fi.isunfold;
        if(!fi_isunfold&&flag&&flag=="fi"){
            that.RefreshMaterialChild("fi","fi_list");
        }
        let pu_isunfold =that.props.meta.getMeta().pu.isunfold;
        if(!pu_isunfold&&flag&&flag=="pu"){
            that.RefreshMaterialChild("pu","pu_list");
        }
        let cost_isunfold =that.props.meta.getMeta().cost.isunfold;
        if(!cost_isunfold&&flag&&flag=="cost"){
            that.RefreshMaterialChild("cost","cost_list");
        }
        let prod_isunfold =that.props.meta.getMeta().prod.isunfold;
        if(!prod_isunfold&&flag&&flag=="prod"){
            that.RefreshMaterialChild("prod","prod_list");
        }
        let plan_isunfold =that.props.meta.getMeta().plan.isunfold;
        if(!plan_isunfold&&flag&&flag=="plan"){
            that.RefreshMaterialChild("plan","plan_list");
        }
        let sale_isunfold =that.props.meta.getMeta().sale.isunfold;
        if(!sale_isunfold&&flag&&flag=="sale"){
            that.RefreshMaterialChild("sale","sale_list");
        }
        let stock_isunfold =that.props.meta.getMeta().stock.isunfold;
        if(!stock_isunfold&&flag&&flag=="cost"){
            that.RefreshMaterialChild("cost","cost_list");
        }
        let pfc_isunfold =that.props.meta.getMeta().pfc.isunfold;
        if(!pfc_isunfold&&flag&&flag=="pfc"){
            that.RefreshMaterialChild("pfc","pfc_list");
        }
        let pfccinfo_isunfold =that.props.meta.getMeta().pfccinfo.isunfold;
        if(!pfccinfo_isunfold&&flag&&flag=="pfccinfo"){
            that.RefreshMaterialChild("pfccinfo","pfccinfo_list");
        }
    }
    /**
     * 请求页面数据
     */
    getData = (callback) => {
        if(!this.materialID) return;
        let data = {
            materialID : this.materialID,
            pagecode : pagecode
        }
        const that = this;
        ajax({
            url : urls['queryMaterialById'],
            data : data,
            success : (res) => {
                if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                    this.props.dealFormulamsg(
                        res.formulamsg,  //参数一：返回的公式对象
                        {                //参数二：界面使用的表格类型
                            'maiterial':"form",
                            'materialconvert':'cardTable'
                        }
                    );
                }
                let {success,data} = res;
                if(data){
                    if(!data.head || !data.head.material || !data.head.material.rows || data.head.material.rows.length<1){
                        toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000002'),color:'danger',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000003')});/* 国际化处理： 未找到对应数据，请重试,出错啦！*/
                        return
                    }
                    if(this.pageStatus !== 'copy' && this.pageStatus !== 'create'){
                        this.queryAttachByPath(data.head.material.rows[0].values['pk_material'].value);
                    }
                    this.setState({img_url:data.head.material.rows[0].values['picture'].value});
                    if(data.head.material.rows[0].values['pk_marasstframe']){
                        let pk_marasstframe = data.head.material.rows[0].values['pk_marasstframe'].value;
                        ajax({
                            url : urls['queryMarAssistantByFrameID'],
                            data : {FrameID : pk_marasstframe},
                            success : (res1) => {
                                if(res1.data){
                                    if(res1.data.asstFrame){//公共辅助结构
                                        let refvalue = {
                                            refcode : res1.data.asstFrame.code,
                                            refname : res1.data.asstFrame.name,
                                            refpk : res1.data.asstFrame.pk_marasstframe
                                        };
                                        //设置参照选定值
                                        this.setState({MarAsstFrameGridRefValue:refvalue});
                                    }
                                    //设置页面上辅助属性的选定值
                                    if(res1.data.assistant){
                                        res1.data.assistant.forEach(element => {
                                            this.state.checkModel[element.pk_userdefitem]=true;
                                        });
                                        this.setState({checkModel : this.state.checkModel});
                                    }
                                    //更新其他页签中自定义辅助属性的显示
                                    //modifierAssistant(this.props,res1.data.assistant);
                                }
                                // else{
                                //     modifierAssistant(this.props,undefined);
                                // }
                            }
                        });
                    }
                    //设置表单数据
                    if(data.head){
                        this.setState({
                            img_url : data.head.material.rows[0].values['picture'].value
                        });
                        this.updateUploadData(data.head.material.rows[0].values['picture'].value);
                        if(this.state.formStatus === 'edit' || this.pageStatus === 'copy'){
                            let pk_org = data.head.material.rows[0].values.pk_org.value;
                            ajax({
                                url : urls['judgeCodeEdit'],
                                data : {pk_org:pk_org,status:this.pageStatus},
                                success : (res) => {
                                    if(res.data){
                                        //设置可编辑性
                                        if(this.pageStatus === 'copy'){
                                            if(res.data.isNextCode){
                                                this.props.form.setFormItemsRequired(formid,{'code':false});
                                                this.props.form.setFormItemsDisabled(formid,{'code':true});
                                            }else{
                                                this.props.form.setFormItemsRequired(formid,{'code':true});
                                                this.props.form.setFormItemsDisabled(formid,{'code':!res.data.isCodeEdit});
                                                if(res.data.isExist){
                                                    this.props.form.setFormItemsValue(formid,{'code' : {value:res.data.code}});
                                                    this.setState({
                                                        code : res.data.code
                                                    });
                                                }
                                            }
                                        }else{
                                            this.props.form.setFormItemsDisabled(formid,{'code':!res.data.isCodeEdit});
                                            if(res.data.isNextCode){
                                                this.props.form.setFormItemsRequired(formid,{'code':false});
                                            }else{
                                                this.props.form.setFormItemsRequired(formid,{'code':true});
                                            }
                                        }
                                    }
                                }
                            });
                        }
                        this.props.form.setAllFormValue({material:data.head.material});
                        if(this.pageStatus === 'copy' || this.pageStatus === 'create'){//复制、创建新版本时不需要图片
                            // this.props.form.setFormItemsValue(formid,{'picture':''});
                            this.setState({img_url:''});
                        }
                    }
                    //设置所有子表数据
                    if(data.bodys){
                        if(data.bodys[values['convert']]){//辅助计量管理
                            this.props.cardTable.setTableData(values['convert'],data.bodys[values['convert']]);
                        }
                        // if(data.bodys[values['fi']]){//财务信息
                        //     this.props.cardTable.setTableData(values['fi'],data.bodys[values['fi']]);
                        // }
                        // if(data.bodys[values['pfc']]){//利润中心
                        //     this.props.cardTable.setTableData(values['pfc'],data.bodys[values['pfc']]);
                        // }
                        // if(data.bodys[values['pu']]){//采购信息
                        //     this.props.cardTable.setTableData(values['pu'],data.bodys[values['pu']]);
                        // }
                        // if(data.bodys[values['sale']]){//销售信息
                        //     this.props.cardTable.setTableData(values['sale'],data.bodys[values['sale']]);
                        // }
                        // if(data.bodys[values['stock']]){//库存信息
                        //     this.props.cardTable.setTableData(values['stock'],data.bodys[values['stock']]);
                        // }
                        // if(data.bodys[values['plan']]){//计划信息
                        //     this.props.cardTable.setTableData(values['plan'],data.bodys[values['plan']]);
                        // }
                        // if(data.bodys[values['prod']]){//生产信息
                        //     this.props.cardTable.setTableData(values['prod'],data.bodys[values['prod']]);
                        // }
                        // if(data.bodys[values['cost']]){//成本信息
                        //     this.props.cardTable.setTableData(values['cost'],data.bodys[values['cost']]);
                        // }
                        // if(data.bodys[values['pfccinfo']]){//利润中心成本
                        //     this.props.cardTable.setTableData(values['pfccinfo'],data.bodys[values['pfccinfo']]);
                        // }
                    }
                    //更新页面上表单及表格的状态
                    this.updatePageStatus();
                    updateButtonStatus(this.props,this.state.formStatus==='add'?this.pageStatus:this.state.formStatus);
                    if(this.pageStatus === 'create'){
                        this.props.form.setFormItemsValue(formid,{'version':{value:0,display:'0'}});
                    }
                    setTimeout(() => {
                        this.updateUploadData();//更新上传路径
                    }, 0);
                }
                callback && callback(that);
            }
        });
        
    }

    /**
     * 查询图片
     */
    queryAttachByPath =(pk_material) => {
        let params = {
            billId:'uapbd/IMG/c7dc0ccd-8872-4eee-8882-160e8f49dfad/'+pk_material,
            fullPath:'uapbd/IMG/c7dc0ccd-8872-4eee-8882-160e8f49dfad/'+pk_material,
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

    /**
     * 设置页面表单及表格编辑状态，已经表格操作
     */
    updatePageStatus = () => {
        //this.setState({pageDrawing:true},()=>{
            this.props.form.setFormStatus(formid,this.state.formStatus);
            if(this.state.formStatus !== 'browse'){
                let fee = this.props.form.getFormItemsValue(formid,'fee');
                let discountflag = this.props.form.getFormItemsValue(formid,'discountflag');
                if(fee.value || discountflag.value){
                    this.props.form.setFormItemsValue(formid,{ishproitems:{value:false},materialmgt:{}});
                    this.props.form.setFormItemsDisabled(formid,{ishproitems:true,materialmgt:true});
                }else{
                    this.props.form.setFormItemsDisabled(formid,{ishproitems:false,materialmgt:false});
                }
            }
            if(this.state.isBrowse){
                this.props.cardTable.setStatus(values['convert'],'browse');
                this.props.cardTable.hideColByKey(values['convert'],'opr');
                this.props.cardTable.showColByKey(values['fi'],'opr');
                this.props.cardTable.showColByKey(values['pfc'],'opr');
                this.props.cardTable.showColByKey(values['pu'],'opr');
                this.props.cardTable.showColByKey(values['sale'],'opr');
                this.props.cardTable.showColByKey(values['stock'],'opr');
                this.props.cardTable.showColByKey(values['plan'],'opr');
                this.props.cardTable.showColByKey(values['prod'],'opr');
                this.props.cardTable.showColByKey(values['cost'],'opr');
                this.props.cardTable.showColByKey(values['pfccinfo'],'opr');
            }else{
                this.props.cardTable.setStatus(values['convert'],'edit');
                this.props.cardTable.showColByKey(values['convert'],'opr');
                this.props.cardTable.hideColByKey(values['fi'],'opr');
                this.props.cardTable.hideColByKey(values['pu'],'opr');
                this.props.cardTable.hideColByKey(values['pfc'],'opr');
                this.props.cardTable.hideColByKey(values['sale'],'opr');
                this.props.cardTable.hideColByKey(values['stock'],'opr');
                this.props.cardTable.hideColByKey(values['plan'],'opr');
                this.props.cardTable.hideColByKey(values['prod'],'opr');
                this.props.cardTable.hideColByKey(values['cost'],'opr');
                this.props.cardTable.hideColByKey(values['pfccinfo'],'opr');
                let isfeature = this.props.form.getFormItemsValue(formid,'isfeature');
                if(isfeature.value){
                    this.props.form.setFormItemsDisabled(formid,{matchmode:false});
                    let matchmode = this.props.form.getFormItemsValue(matchmode,'isfeature');
                    if(matchmode.value === '1'){
                        this.props.form.setFormItemsDisabled(formid,{'featureclass':false});
                        this.props.form.setFormItemsRequired(formid,{'featureclass':true});
                    }else{
                        this.props.form.setFormItemsDisabled(formid,{featureclass:true});
                        this.props.form.setFormItemsRequired(formid,{'featureclass':false});
                    }
                }else{
                    this.props.form.setFormItemsValue(formid,{matchmode:{value:null,display:null}});
                    this.props.form.setFormItemsDisabled(formid,{matchmode:true});
                    this.props.form.setFormItemsValue(formid,{featureclass:{value:null,display:null}});
                    this.props.form.setFormItemsDisabled(formid,{featureclass:true});
                    this.props.form.setFormItemsRequired(formid,{'featureclass':false});
                }
    
            }
            //this.setState({pageDrawing:false});
       // });
    }

    /* updatePageStatus = () => {
        this.setState({pageDrawing:true},()=>{
            this.props.form.setFormStatus(formid,this.state.formStatus);
            if(this.state.formStatus !== 'browse'){
                let fee = this.props.form.getFormItemsValue(formid,'fee');
                let discountflag = this.props.form.getFormItemsValue(formid,'discountflag');
                if(fee.value || discountflag.value){
                    this.props.form.setFormItemsValue(formid,{ishproitems:{value:false},materialmgt:{}});
                    this.props.form.setFormItemsDisabled(formid,{ishproitems:true,materialmgt:true});
                }else{
                    this.props.form.setFormItemsDisabled(formid,{ishproitems:false,materialmgt:false});
                }
            }
            if(this.state.isBrowse){
                this.props.cardTable.setStatus(values['convert'],'browse');
                this.props.cardTable.hideColByKey(values['convert'],'opr');
                this.props.cardTable.showColByKey(values['fi'],'opr');
                this.props.cardTable.showColByKey(values['pfc'],'opr');
                this.props.cardTable.showColByKey(values['pu'],'opr');
                this.props.cardTable.showColByKey(values['sale'],'opr');
                this.props.cardTable.showColByKey(values['stock'],'opr');
                this.props.cardTable.showColByKey(values['plan'],'opr');
                this.props.cardTable.showColByKey(values['prod'],'opr');
                this.props.cardTable.showColByKey(values['cost'],'opr');
                this.props.cardTable.showColByKey(values['pfccinfo'],'opr');
            }else{
                this.props.cardTable.setStatus(values['convert'],'edit');
                this.props.cardTable.showColByKey(values['convert'],'opr');
                this.props.cardTable.hideColByKey(values['fi'],'opr');
                this.props.cardTable.hideColByKey(values['pu'],'opr');
                this.props.cardTable.hideColByKey(values['pfc'],'opr');
                this.props.cardTable.hideColByKey(values['sale'],'opr');
                this.props.cardTable.hideColByKey(values['stock'],'opr');
                this.props.cardTable.hideColByKey(values['plan'],'opr');
                this.props.cardTable.hideColByKey(values['prod'],'opr');
                this.props.cardTable.hideColByKey(values['cost'],'opr');
                this.props.cardTable.hideColByKey(values['pfccinfo'],'opr');
                let isfeature = this.props.form.getFormItemsValue(formid,'isfeature');
                if(isfeature.value){
                    this.props.form.setFormItemsDisabled(formid,{matchmode:false});
                    let matchmode = this.props.form.getFormItemsValue(matchmode,'isfeature');
                    if(matchmode.value === '1'){
                        this.props.form.setFormItemsDisabled(formid,{'featureclass':false});
                        this.props.form.setFormItemsRequired(formid,{'featureclass':true});
                    }else{
                        this.props.form.setFormItemsDisabled(formid,{featureclass:true});
                        this.props.form.setFormItemsRequired(formid,{'featureclass':false});
                    }
                }else{
                    this.props.form.setFormItemsValue(formid,{matchmode:{value:null,display:null}});
                    this.props.form.setFormItemsDisabled(formid,{matchmode:true});
                    this.props.form.setFormItemsValue(formid,{featureclass:{value:null,display:null}});
                    this.props.form.setFormItemsDisabled(formid,{featureclass:true});
                    this.props.form.setFormItemsRequired(formid,{'featureclass':false});
                }
    
            }
            this.setState({pageDrawing:false});
        });
    } */

    /**
     * 表单编辑前事件
     */
    onBeforeEvent = (props, moduleId, key, value,oldValue) => {
        if(key === 'retail'){//适用零售
            if(!value.value){
                let cardTableRows = this.props.cardTable.getAllRows(values['convert']);
                if(cardTableRows.length > 0){
                    for(let i=0;i<cardTableRows.length;i++){
                        if(!cardTableRows[i].values.fixedflag.value){
                            toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000004'),color:'warning'});/* 国际化处理： 您当前的物料存在固定换算未被勾选，不允许勾选适用零售，请先勾选所有的固定换算*/
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    queryMeasrate =({pk_measdoc,measdoc_list,callback})=>{
        ajax({
            url : urls['queryMeasrate'],
            data:{
                pk_measdoc : pk_measdoc,
                measdoc_list : measdoc_list
            },
            success : (res)=>{
                callback && callback(res);
            }
        })
    }



    /**
     * 表单编辑后事件
     */
    onAfterEvent = (props, moduleId, key, value,oldValue) => {
        //props, moduleId(区域id), key(操作的键), value（当前值），oldValue(旧值) 
        var clearAssistant = () =>{
            this.setState({MarAsstFrameGridRefValue:{}});
            Object.keys(this.state.checkModel).forEach((item,index) => {
                this.state.checkModel[item] = false;
            });
        }
        if(key === 'pk_measdoc'){//主计量单位
            let cardTableRows = this.props.cardTable.getAllRows(values['convert']);
            if(value && value.value){
                if(cardTableRows.length === 0){
                    let defaultValue = {
                        'pk_measdoc' : value,
                        'measrate' : {value:'1/1',display:'1/1'},
                        'fixedflag' : {value:true},
                        'isstorebalance' : {value:true},
                        'ispumeasdoc' : {value:true},
                        'isprodmeasdoc':{value:true},
                        'ispumeasdoc' : {value:true},
                        'isstockmeasdoc' : {value:true},
                        'issalemeasdoc' : {value:true},
                        'isretailmeasdoc' : {value:true}
                    };
                    this.props.cardTable.addRow(values['convert'],undefined,defaultValue,false);
                }else{
                    let pk_measdoc = value.value;
                    let measdoc_list = [];
                    cardTableRows.forEach(item=>{
                        if(item.values.pk_measdoc && item.values.pk_measdoc.value){
                            measdoc_list.push(item.values.pk_measdoc.value);
                        }
                    });
                    if(measdoc_list.length > 0){
                        this.queryMeasrate({
                            pk_measdoc : pk_measdoc,
                            measdoc_list : measdoc_list,
                            callback:(res)=>{
                                let {data} = res;
                                cardTableRows.forEach((item,index)=>{
                                    if(item.values.pk_measdoc && item.values.pk_measdoc.value){
                                        if(data && data[item.values.pk_measdoc.value]){
                                            this.props.cardTable.setValByKeyAndIndex(values['convert'],index,'measrate',{value:data[item.values.pk_measdoc.value],display:data[item.values.pk_measdoc.value]});
                                        }else{
                                            this.props.cardTable.setValByKeyAndIndex(values['convert'],index,'measrate',{value:null,display:null});
                                        }
                                    }
                                });
                            }
                        })
                    }
                }
            }else{
                //清空子表数据中的主计量单位与辅计量单位比例
                cardTableRows.forEach((item,index)=>{
                    if(item.values.pk_measdoc && item.values.pk_measdoc.value){
                        this.props.cardTable.setValByKeyAndIndex(values['convert'],index,'measrate',{value:null,display:null});
                    }
                });
            }
        }
        if(key === 'pk_marbasclass'){
            if(this.state.formStatus === 'add' && value && value.value){
                ajax({
                    url : urls['queryMarAssistantByFrameID'],
                    data : {pk_marbasclass : value.value},
                    success : (res) => {
                        if(res.data){
                            if(res.data.asstFrame){//公共辅助结构
                                let refvalue = {
                                    refcode : res.data.asstFrame.code,
                                    refname : res.data.asstFrame.name,
                                    refpk : res.data.asstFrame.pk_marasstframe
                                };
                                //设置参照选定值
                                this.setState({MarAsstFrameGridRefValue:refvalue});
                            }
                            //设置页面上辅助属性的选定值
                            if(res.data.assistant){
                                res.data.assistant.forEach(element => {
                                    this.state.checkModel[element.pk_userdefitem]=true;
                                });
                                this.setState({checkModel : this.state.checkModel});
                            }
                            this.props.form.setFormItemsValue(formid,{'pk_marasstframe':{value:res.data.asstFrame.pk_marasstframe}});
                             //更新其他页签中自定义辅助属性的显示
                             //modifierAssistant(this.props,res.data.assistant);
                        }else{
                            this.state.MarAsstFrameGridRefValue={};
                            Object.keys(this.state.checkModel).forEach((item,index) => {
                                this.state.checkModel[item] = false;
                            });
                            this.props.form.setFormItemsValue(formid,{'pk_marasstframe':{value:'~'}});
                            this.setState(this.state);
                        }
                    }
                });
            }else if(this.state.formStatus === 'add' && (!value || !value.value)){
                this.state.MarAsstFrameGridRefValue={};
                Object.keys(this.state.checkModel).forEach((item,index) => {
                    this.state.checkModel[item] = false;
                });
                this.props.form.setFormItemsValue(formid,{'pk_marasstframe':{value:'~'}});
                this.setState(this.state);
            }
        }else if(key === 'matchmode'){
            if(value.value === '1'){
                this.props.form.setFormItemsDisabled(formid,{'featureclass':false});
                this.props.form.setFormItemsRequired(formid,{'featureclass':true});
            }else{
                this.props.form.setFormItemsValue(formid,{featureclass:{value:null,display:null}});
                this.props.form.setFormItemsDisabled(formid,{'featureclass':true});
                this.props.form.setFormItemsRequired(formid,{'featureclass':false});
            }
        }else if(key === 'isfeature'){
            if(value.value){
                this.props.form.setFormItemsValue(formid,{matchmode:{value:1,display:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000005')}});/* 国际化处理： 特征选配*/
                this.props.form.setFormItemsDisabled(formid,{matchmode:false});
                this.props.form.setFormItemsDisabled(formid,{'featureclass':false});
                this.props.form.setFormItemsRequired(formid,{'featureclass':true});
            }else{
                this.props.form.setFormItemsValue(formid,{matchmode:{value:null,display:null}});
                this.props.form.setFormItemsDisabled(formid,{matchmode:true});
                this.props.form.setFormItemsValue(formid,{featureclass:{value:null,display:null}});
                this.props.form.setFormItemsDisabled(formid,{'featureclass':true});
                this.props.form.setFormItemsRequired(formid,{'featureclass':false});
            }
        }else if(key === 'retail'){//适用零售
            let discountflag = this.props.form.getFormItemsValue(formid,'discountflag');
            if(discountflag.value && value.value){
                promptBox({
					color:"warning",               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000014'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
					content: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000006'),/* 国际化处理： 勾选“适用零售”后，“价格折扣”将被取消勾选，是否继续勾选“适用零售”？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000008'),/* 国际化处理： 是*/
					cancelBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000007'),/* 国际化处理： 否*/
					beSureBtnClick: () => {
						this.props.form.setFormItemsValue(formid,{discountflag:{value:false}});
                        let fee = this.props.form.getFormItemsValue(formid,'fee');
                        if(fee.value){
                            this.props.form.setFormItemsValue(formid,{ishproitems:{value:false},materialmgt:{}});
                            this.props.form.setFormItemsDisabled(formid,{ishproitems:true,materialmgt:true});
                        }else{
                            this.props.form.setFormItemsDisabled(formid,{ishproitems:false,materialmgt:false});
                        }
                    },
                    cancelBtnClick:()=>{
                        this.props.form.setFormItemsValue(formid,{retail:{value:false}});
                    }
                });
                return;
            }
        }else if(key === 'discountflag'){
            let retail = this.props.form.getFormItemsValue(formid,'retail');
            if(retail.value && value.value){
                promptBox({
					color:"warning",               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000014'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
					content: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000009'),/* 国际化处理： 勾选“价格折扣”后，“适用零售”将被取消勾选，是否继续勾选“价格折扣”？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000008'),/* 国际化处理： 是*/
					cancelBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000007'),/* 国际化处理： 否*/
					beSureBtnClick: () => {
						this.props.form.setFormItemsValue(formid,{retail:{value:false}});
                        this.props.form.setFormItemsValue(formid,{ishproitems:{value:false},materialmgt:{}});
                        this.props.form.setFormItemsDisabled(formid,{ishproitems:true,materialmgt:true});
                    },
                    cancelBtnClick:()=>{
                        this.props.form.setFormItemsValue(formid,{discountflag:{value:false}});
                    }
                });
            }
            let fee = this.props.form.getFormItemsValue(formid,'fee');
            let discountflag = this.props.form.getFormItemsValue(formid,'discountflag');
            if(fee.value || discountflag.value){
                this.props.form.setFormItemsValue(formid,{ishproitems:{value:false},materialmgt:{}});
                this.props.form.setFormItemsDisabled(formid,{ishproitems:true,materialmgt:true});
            }else{
                this.props.form.setFormItemsDisabled(formid,{ishproitems:false,materialmgt:false});
            }
        }else if(key === 'pk_org'){
            let pk_org = this.props.form.getFormItemsValue(formid,'pk_org');
            if(pk_org && pk_org.value){
                if(this.config.node_type === 'ORG_NODE'){
                    let meta = this.props.meta.getMeta();
                    meta['base'].items.map(item=>{
                        if(item.attrcode === 'pk_marbasclass'){
                            item.queryCondition = {
                                pk_org : pk_org.value
                            }
                        }
                    });
                    this.props.meta.setMeta(meta);
                }
                ajax({
                    url : '/nccloud/uapbd/material/queyMaterialBillCode.do',
                    data : {pk_org:pk_org.value},
                    success : (res) => {
                        if(res.data.code){
                            this.props.form.setFormItemsValue(formid,{code : {value:res.data.code}});
                            this.setState({
                                code : res.data.code
                            })
                        }
                        if(res.data.isNextCode){
                            this.props.form.setFormItemsRequired(formid,{'code':false});
                            this.props.form.setFormItemsDisabled(formid,{'code':this.state.formStatus==='add'?true:!res.data.isCodeEdit});
                        }else{
                            this.props.form.setFormItemsRequired(formid,{'code':true});
                            this.props.form.setFormItemsDisabled(formid,{'code':!res.data.isCodeEdit});
                        }
                    }
                });
            }
        }else if(key === 'fee'){//服务类
            let fee = this.props.form.getFormItemsValue(formid,'fee');
            let discountflag = this.props.form.getFormItemsValue(formid,'discountflag');
            if(fee.value || discountflag.value){
                this.props.form.setFormItemsValue(formid,{ishproitems:{value:false},materialmgt:{}});
                this.props.form.setFormItemsDisabled(formid,{ishproitems:true,materialmgt:true});
            }else{
                this.props.form.setFormItemsDisabled(formid,{ishproitems:false,materialmgt:false});
            }
        }else if(key === 'pk_goodscode'){//海关商品代码
            if(value && value.refcode){
                this.props.form.setFormItemsValue(formid,{goodsprtname:{value:value.refcode}});
            }else{
                this.props.form.setFormItemsValue(formid,{goodsprtname:{value:null}});
            }
        }
    }

    /**
     * 辅助计量管理子表编辑前事件
     */
    onBeforeEvent4convert = (props, moduleId, key, value, changedrows, index, record,status) => {
        if(key === 'fixedflag'){
            if(value.value){
                let retail = this.props.form.getFormItemsValue(formid,'retail');
                if(retail.value){
                    toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000010'),color:'warning'});/* 国际化处理： 您当前已经勾选了适用零售，不允许取消勾选固定换算，请先取消勾选适用零售*/
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 辅助计量管理子表编辑后事件
     */
    onAfterEvent4convert = (props, moduleId, key, value, changedrows, index, record,type, method) => {
        //props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, index（当前index）, record（行数据）,type(表格内为line，弹窗为modal), method(有blur有change)
        if(key=='measrate'){
            //校验主单位/辅单位的合法性
            if(!value || value === ''){
                return;
            }
            var reg = new RegExp('^(\\d+(\\.\\d+)?)/(\\d+(\\.\\d+)?)$');
            if(!reg.test(value)){
                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000011'),color:'warning',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000003')});/* 国际化处理： 请录入分数，例如‘1/2’，/两侧为大于0的数值！,错误啦！*/
                props.cardTable.setValByKeyAndRowId(moduleId, record.rowid, 'measrate', {value: null,display:null});
            }
        }else if(key =='pk_measdoc'){
            let pk_measdoc = props.form.getFormItemsValue(formid,'pk_measdoc');
            if(!value || !value.refpk || !pk_measdoc || !pk_measdoc.value){
                props.cardTable.setValByKeyAndRowId(moduleId, record.rowid, 'measrate', {value: null,display:null});
            }else{
                
                this.queryMeasrate({
                    pk_measdoc : pk_measdoc.value,
                    measdoc_list : [value.refpk],
                    callback:(res)=>{
                        let {data} = res;
                        if(data && data[value.refpk]){
                            props.cardTable.setValByKeyAndRowId(moduleId, record.rowid, 'measrate', {value: data[value.refpk],display:data[value.refpk]});
                        }else{
                            props.cardTable.setValByKeyAndRowId(moduleId, record.rowid, 'measrate', {value: null,display:null});
                        }
                    }
                })



            }
        }
    }

    /**
     * 清空页面数据
     */
    clearPage = (isGetData,callback) => {
        if(isGetData){
            //清空表单数据
            this.props.form.EmptyAllFormValue(formid);
            //清空辅助属性结构
            this.setState({MarAsstFrameGridRefValue:{}});
            Object.keys(this.state.checkModel).forEach((item,index) => {
                this.state.checkModel[item] = false;
            });
            //清空辅助计量管理表格数据
            this.props.cardTable.setTableData(values['convert'],{rows: []})
        }
        
        //关闭页签
        this.props.cardTable.toggleCardTable('fi',false);
        this.props.cardTable.toggleCardTable('cost',false);
        this.props.cardTable.toggleCardTable('sale',false);
        this.props.cardTable.toggleCardTable('pu',false);
        this.props.cardTable.toggleCardTable('pfc',false);
        this.props.cardTable.toggleCardTable('plan',false);
        this.props.cardTable.toggleCardTable('stock',false);
        this.props.cardTable.toggleCardTable('prod',false);
        this.props.cardTable.toggleCardTable('pfccinfo',false);
        this.setState({checkModel : this.state.checkModel,img_url:null});
        //财务信息
        this.props.cardTable.setTableData(values['fi'],{rows: []},()=>{
            //利润中心
            this.props.cardTable.setTableData(values['pfc'],{rows: []},()=>{
                //采购信息
                this.props.cardTable.setTableData(values['pu'],{rows: []},()=>{
                    //销售信息
                    this.props.cardTable.setTableData(values['sale'],{rows: []},()=>{
                        //库存信息
                        this.props.cardTable.setTableData(values['stock'],{rows: []},()=>{
                            //计划信息
                            this.props.cardTable.setTableData(values['plan'],{rows: []},()=>{
                                //生产信息
                                this.props.cardTable.setTableData(values['prod'],{rows: []},()=>{
                                    //成本信息
                                    this.props.cardTable.setTableData(values['cost'],{rows: []},()=>{
                                        //利润中心成本
                                        this.props.cardTable.setTableData(values['pfccinfo'],{rows: []},()=>{
                                            callback && callback();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    // clearMaterial = (isGetData,callback) => {
    //     //清空表单数据
    //     this.props.form.EmptyAllFormValue(formid);
    //     //清空辅助属性结构
    //     this.setState({MarAsstFrameGridRefValue:{}});
    //     Object.keys(this.state.checkModel).forEach((item,index) => {
    //         this.state.checkModel[item] = false;
    //     });
    //     this.setState({checkModel : this.state.checkModel,img_url:null});
    //     //清空辅助计量管理表格数据
    //     this.props.cardTable.setTableData(values['convert'],{rows: []},()=>{
    //         callback && callback();
    //     });
    // }

    hasPerm = (pk_org) => {
        if(permOrg.indexOf(pk_org) === -1){
            toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
            return false;
        }
        return true;
    }
    getReqData = () => {
        let reqData = [
            {
                rqUrl: urls['queryMarAssistant'],
                rqCode: 'MarAssistant'
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
        ]
        return reqData;
    }

    //打开页签并查询
    clickFunFunction(page_status){
            this.props.cardTable.toggleCardTable(page_status,true);
            this.querychildclick(page_status,false)
    }
    /**
     * 按钮的点击事件
     */
    onButtonClick = (props,id) => {
        let _this = this;
        switch(id){
            case 'Add':
                ajax({
                    url : urls['addMaterial'],
                    data : {node_type:this.config.node_type},
                    success : (res) => {
                        this.pageStatus = 'add';
                        this.setState({formStatus:'add',isBrowse:false},()=>{
                            this.clearPage(true,()=>{
                                if(this.config.node_type === 'GROUP_NODE'){
                                    let businessInfo = getBusinessInfo();
                                    this.getAddData(businessInfo.groupId);
                                }else{
                                    if(contextOrg.refpk){
                                        this.getAddData(contextOrg.refpk);
                                    }else{
                                        this.getAddData();
                                    }
                                }
                            });
                            updateButtonStatus(this.props,this.state.formStatus);
                        });
                        this.updateFormEditEnable(this.config.node_type);
                    }
                });
                break;
            case 'Edit':
                if(!this.hasPerm(this.props.form.getFormItemsValue(formid,'pk_org').value)){
                    break;
                }
                this.updateUploadData(this.props.form.getFormItemsValue(formid,'pk_material').value);
                ajax({
                    url : urls['editMaterial'],
                    data : {pk:this.props.form.getFormItemsValue(formid,'pk_material').value},
                    success : (res) => {
                        this.setState({
                            formStatus : 'edit',
                            isBrowse : false
                        },this.updatePageStatus);
                        //更新头部按钮状态
                        updateButtonStatus(this.props,'edit');
                        this.pageStatus = 'edit';
                        ajax({
                            url : urls['judgeCodeEdit'],
                            data : {pk_org:this.props.form.getFormItemsValue(formid,'pk_org').value},
                            success : (res) => {
                                if(res.data){
                                    //设置可编辑性
                                    this.props.form.setFormItemsDisabled(formid,{code:!res.data.isCodeEdit});
                                }
                            }
                        });
                    }
                });
                break;
            case 'Cancel':
                promptBox({
					color:"warning",               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000014'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
					content: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000015'),             // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: () => {
						if(this.state.code !== ''){
                            ajax({
                                url : urls['rollBackMaterialBillCode'],
                                data : {pk_org:this.props.form.getFormItemsValue(formid,'pk_org').value,code:this.state.code},
                                success : (res) => {
                                }
                            });
                        }
                        props.form.cancel(formid);
                        props.cardTable.resetTableData(values['convert']);
                        this.pageStatus = 'browse';
                        this.setState({
                            formStatus : 'browse',
                            isBrowse : true
                        },this.updatePageStatus);
                        this.queryAttachByPath(this.materialID);//查询图片
                        //更新头部按钮状态
                        updateButtonStatus(this.props,'browse');
					}
				});
                break;
            case 'Delete':
                let pk = this.props.form.getFormItemsValue(formid,'pk_material');
                if(!pk || !pk.value){
                    return 
                }
                if(this.hasPerm(this.props.form.getFormItemsValue(formid,'pk_org').value)){
                    props.modal.show('deleteModal');
                }
                break;
            case 'Save':
                this.save(false);
                break;
            case 'SaveAdd' :
                this.save(true);
                break;
            case 'Refresh':
            this.clearPage(true,
                this.getData(()=>{
                    toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/
                }));
                break;
            case 'Enable':
                if(!this.hasPerm(this.props.form.getFormItemsValue(formid,'pk_org').value)){
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
						let _enable_dataArr=[];
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
                        _enable_Obj.values.ts.value=this.props.form.getFormItemsValue(formid,'ts').value;
                        _enable_Obj.values.pk_material.value=this.props.form.getFormItemsValue(formid,'pk_material').value;
                        _enable_dataArr.push(_enable_Obj);
                        let enable_data = {
                            pageid:pagecodeValues['list_pagecode'],
                            model: {
                                areaType: 'table',
                                pageinfo: null,
                                rows: _enable_dataArr
                            }
                        };
                        ajax({
                            url: urls['enableMaterial'],
                            data:enable_data,
                            success: (res) => {
                                let { success,data} = res;
                                if(data && data.material && data.material.rows){
                                    this.props.form.setFormItemsValue(formid,{
                                        ts:data.material.rows[0].values['ts'],
                                        enablestate:data.material.rows[0].values['enablestate']
                                    });
                                    updateButtonStatus(this.props,'browse');
                                    toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000022'),color:'success'});/* 国际化处理： 启用成功*/
                                }
                            }
                        });
					}
				});
                break;
            case 'Disable':
                if(!this.hasPerm(this.props.form.getFormItemsValue(formid,'pk_org').value)){
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
						let _disable_dataArr=[];
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
                        _disable_Obj.values.ts.value=this.props.form.getFormItemsValue(formid,'ts').value;
                        _disable_Obj.values.pk_material.value=this.props.form.getFormItemsValue(formid,'pk_material').value;
                        _disable_dataArr.push(_disable_Obj);
                        let disable_data = {
                            pageid:pagecodeValues['list_pagecode'],
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
                                if(data && data.material && data.material.rows){
                                    this.props.form.setFormItemsValue(formid,{
                                        ts:data.material.rows[0].values['ts'],
                                        enablestate:data.material.rows[0].values['enablestate']
                                    });
                                    updateButtonStatus(this.props,'browse');
                                    toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000025'),color:'success'});/* 国际化处理： 停用成功*/
                                }
                            }
                        });
					}
				});
                break;
            case 'Copy':
                ajax({
                    url : urls['addMaterial'],
                    data : {node_type:this.config.node_type},
                    success : (res) => {
                        this.pageStatus = 'copy';
                        this.setState({
                            formStatus : 'add',
                            isBrowse : false
                        },()=>{
                            this.setState({ img_url: ''},()=>{
                                this.getData();
                                this.updateFormEditEnable(this.config.node_type)
                                updateButtonStatus(this.props,'copy');
                            });
                        });
                    }
                });
                break;
            case 'CreateVersion':
                if(!this.hasPerm(this.props.form.getFormItemsValue(formid,'pk_org').value)){
                    break;
                }
                if(this.hasPerm(this.props.form.getFormItemsValue(formid,'pk_org').value)){
                    promptBox({
                        color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                        title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000032'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 提示信息*/
                        content: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000061'),             // 提示内容,非必输/* 国际化处理： 是否创建选中物料的新版本数据？*/
                        noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                        noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                        beSureBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                        cancelBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                        beSureBtnClick: this.createVerisonBeSureBtnClick
                    });
                }
                break;
            case 'BatchUpdate':
                let reqData = this.getReqData();
                ajax({
                    url : urls['mergerequest'],
                    data : reqData,
                    success : (res) => {
                        if(res&&res.data){
                            this.initBatchTemplate(props,res.data); 
                        }
                        pk = this.props.form.getFormItemsValue(formid,'pk_material');
                        let pk_org = this.props.form.getFormItemsValue(formid,'pk_org');
                        if(!pk || !pk.value || !pk_org || !pk_org.value){
                            return 
                        }
                        
                        let orgs = [pk_org.value];
                        let pks = [pk.value];
                        
                        this.Batcheditmodal.show(pks,orgs,permOrg);
                    }
                })
                break;
            case 'BatchUpdateWizard':
            let reqQueryData = this.getReqData();
                ajax({
                    url : urls['mergerequest'],
                    data : reqQueryData,
                    success : (res) => {
                        if(res&&res.data){
                            this.initBatchTemplate(props,res.data); 
                        }
                    this.Batcheditstepmodal.show();
                    }
                })
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
            case 'Assign'://分配
                pk = this.props.form.getFormItemsValue(formid,'pk_material');
                if(!pk || !pk.value){
                    return 
                }
                ajax({
                    url : urls['queryJurisdiction'],
                    data : {},
                    success : (res) => {
                        if(res.data){
                            this.assignModal.show([pk.value],false);
                        }else{
                            if(this.hasPerm(this.props.form.getFormItemsValue(formid,'pk_org').value)){
                                this.assignModal.show([pk.value],false);
                            }
                        }
                       
                    }
                });
                
                break;
            case 'AssignWizard':
                let AppCode =this.props.getAppCode();
                let req_Data =  [
                    {
                        rqUrl: urls['queryTemp'],
                        rqJson: `{\n  \"pagecode\": \"${pagecodeValues['assign']}\"\n}`,
                        rqCode: 'assign_template'
                    }]
                ajax({
                    url : urls['mergerequest'],
                    data : req_Data,
                    success : (res) => {
                        if(res&&res.data){
                            let meta = props.meta.getMeta();
                            meta['search4assign'] = res.data.assign_template.search4assign;
                            meta['material4assign'] = res.data.assign_template.material4assign;
                            let businessInfo = getBusinessInfo();
                            meta['search4assign'].items.forEach((item,index)=>{
                                if(item.attrcode === 'pk_org_assign'){
                                    meta['search4assign'].items[index].itemtype = 'refer';
                                    meta['search4assign'].items[index].refName = props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000158')/* 国际化处理： 业务单元+集团*/;
                                    meta['search4assign'].items[index].refName_db = props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000158')/* 国际化处理： 业务单元+集团*/;
                                    meta['search4assign'].items[index].refcode = 'uapbd/refer/org/BusinessUnitAndGroupTreeRef/index';
                                    /* meta['search4assign'].items[index].queryCondition = {
                                        AppCode : props.config.appcode,
                                        TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                                    } */
                                }else if(item.attrcode === 'pk_marbasclass'){
                                    meta['search4assign'].items[index].isMultiSelectedEnabled = true;
                                }else if(item.attrcode === 'pk_brand' || item.attrcode === 'prodarea' || item.attrcode === 'pk_prodline' || item.attrcode === 'creator' || item.attrcode === 'modifier' || item.attrcode === 'delperson'){
                                    meta['search4assign'].items[index].isShowDisabledData = true;
                                }
                                if(item.attrcode === 'pk_org' && props.config.node_type==='ORG_NODE'){
                                    meta['search4assign'].items[index].refcode = 'uapbd/refer/org/BusinessUnitAndGroupTreeRef/index';
                                    meta['search4assign'].items[index].queryCondition={
                                        AppCode : AppCode,
                                        TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryGroupAndOrgSQLBuilder'
                                    }
                                }else if(item.attrcode === 'pk_org' && props.config.node_type==='GROUP_NODE'){
                                    meta['search4assign'].items[index].refcode = 'uapbd/refer/org/BusinessUnitAndGroupTreeRef/index';
                                    meta['search4assign'].items[index].queryCondition = {
                                        pk_group : businessInfo.groupId,
                                        AppCode : AppCode,
                                        TreeRefActionExt:'nccloud.web.uapbd.material.action.BusinessUnitAndGroupTreeRefExt'
                                    }
                                }else if(item.attrcode === 'pk_marbasclass'){
                                    meta['search4assign'].items[index].isMultiSelectedEnabled = true;
                                    meta['search4assign'].items[index].isShowDisabledData = true;
                                    meta['search4assign'].items[index].isShowUnit = true;
                                }
                            });
                        }
                        this.assignStepModal.show('assign');
                    }
                })
                break;
            case 'CancelAssign':
                pk = this.props.form.getFormItemsValue(formid,'pk_material');
                if(!pk || !pk.value){
                    return 
                }
                ajax({
                    url : urls['queryJurisdiction'],
                    data : {},
                    success : (res) => {
                        if(res.data){
                            this.assignModal.show([pk.value],true);
                        }else{
                            if(this.hasPerm(this.props.form.getFormItemsValue(formid,'pk_org').value)){
                                this.assignModal.show([pk.value],true);
                            }
                        }
                       
                    }
                });
                break;
            case 'AssignStatus':
                let pk_material = this.props.form.getFormItemsValue(formid,'pk_material').value;
                this.props.modal.show('assignstatusModal',{
                    title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000048'),/* 国际化处理： 已分配组织查询*/
                    content : this.getAssignStatus(pk_material),
                    hasCloseBtn:true,
                    size : 'xlg',
                    noFooter : true
                });
                break;
            case 'OrgBrowse':
                props.modal.show('orgBrowseModal');
                break;
            case 'QueryOrgDoc':
                props.modal.show('marOrgModal');
                break;
            case 'Print':
                let _print_pk = this.props.form.getFormItemsValue(formid,'pk_material');
                if(!_print_pk || !_print_pk.value){
                    return 
                }
                this.setState({oids:[_print_pk.value]},
                    print('pdf',
                    urls['print'],
                    {
                        funcode : this.config.print.funcode,
                        nodekey : this.config.print.nodekey,
                        oids : [_print_pk.value]
                    })
                );
                break;
            case 'Output':
                let _output_pk = this.props.form.getFormItemsValue(formid,'pk_material');
                if(!_output_pk || !_output_pk.value){
                    return
                }
                this.setState({oids:[_output_pk.value]},()=>{this.refs.printOutput.open()});
                break;
            case 'Associate':
                let pk_material_pf = this.props.form.getFormItemsValue('material','pk_material_pf');
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
            case 'File': 
                if(!this.hasPerm(this.props.form.getFormItemsValue(formid,'pk_org').value)){
                    break;
                }
                let uploaderDir = this.props.form.getFormItemsValue('material','pk_material');
                if(uploaderDir && uploaderDir.value){
                    this.setState({
                        showUploader:true,
                        uploaderDir : uploaderDir.value
                    });
                }
                break;
            case 'Upgrade'://升级
                if(this.props.form.getFormItemsValue(formid,'pk_group').value === this.props.form.getFormItemsValue(formid,'pk_org').value){
                    toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000026'),color:'warning'});/* 国际化处理： 待升级物料全部为集团数据，不需升级。*/
                    break;
                }
                pk = this.props.form.getFormItemsValue(formid,'pk_material');
                if(!pk || !pk.value){
                    return 
                }
                ajax({
                    url : urls['upgrade'],
                    data : {
                        pk_material : pk.value,
                        ts : this.props.form.getFormItemsValue(formid,'ts').value,
                        isSure: false,
                        node_type : this.config.node_type
                    },
                    success : (res)=>{
                        let {success,data} = res;
                        if(data && data.result){
                            if(data.result === 'error'){
                                toast({content:data.msg,color:'error'});
                            }else if(data.result === 'tip'){
                                props.modal.show('modal',{
                                    title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000027'),/* 国际化处理： 确认升级*/
					                content : data.msg,	
					                beSureBtnClick : ()=>{
                                        ajax({
                                            url : urls['upgrade'],
                                            data : {
                                                pk_material : pk.value,
                                                ts : this.props.form.getFormItemsValue(formid,'ts').value,
                                                isSure: true
                                            },
                                            success : (res) => {
                                                this.onButtonClick(props,'Refresh');
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000028'),color:'success'});/* 国际化处理： 操作成功*/
                                            }
                                        })
                                    },
					                leftBtnName : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000008'),/* 国际化处理： 是*/
    				                rightBtnName : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000007')/* 国际化处理： 否*/
                                });
                            }
                        }else{
                            this.onButtonClick(props,'Refresh');
                            toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000028'),color:'success'});/* 国际化处理： 操作成功*/
                        }
                    }
                });
                break;
            case 'Reback':
                //props.linkBack();
                props.pushTo('/list',{
                pagecode:this.props.config.pagecodelist});
                break;
            case 'DataTemplet':
                let CardData = this.props.createMasterChildData(pagecode, formid, values['convert']);
                    let reqData1 = {
                        pageid : CardData.pageid,
                        head : CardData.head,
                        bodys : CardData.body
                    }
                this.DataTempletModal.show(this.config.dataTemplet_funcode,reqData1);
                break;
        }
    }

    /**
     * 分配完成后执行该后调函数
     */
    onAssignFinish = () => {
        let isGetData =false;
        this.clearPage(isGetData,()=>{
            if(isGetData){
                this.getData();
            }
        });
    }
    initBatchTemplate(props,data){
        let meta = props.meta.getMeta();
            meta['fi_base'] = data.fi_template.fi_base;
            meta['pfc_base'] = data.pfc_template.pfc_base;
            meta['pu_base'] = data.pu_template.pu_base;
            meta['sale_base'] = data.sale_template.sale_base;
            meta['stock_base'] = data.stock_template.stock_base;
            meta['stock_freeasst'] = data.stock_template.stock_freeasst;
            meta['stock_check'] = data.stock_template.stock_check;
            meta['stock_atp'] = data.stock_template.stock_atp;
            meta['stock_realusableamount'] = data.stock_template.stock_realusableamount;
            meta['plan_base'] = data.plan_template.plan_base;
            meta['plan_marasst'] = data.plan_template.plan_marasst;
            meta['prod_base'] = data.prod_template.prod_base;
            meta['producecost'] = data.prod_template.producecost;
            meta['costvalutasst'] = data.prod_template.costvalutasst;
            meta['cost_base'] = data.cost_template.cost_base;
            meta['pfcc_base'] = data.pfcc_template.pfcc_base;

            meta['search4assign'] = data.assign_template.search4assign;
            meta['material4assign'] = data.assign_template.material4assign;
            let businessInfo = getBusinessInfo();
            let AppCode =props.getAppCode();
            meta['search4assign'].items.forEach((item,index)=>{
            if(item.attrcode === 'pk_org_assign'){
                meta['search4assign'].items[index].itemtype = 'refer';
                meta['search4assign'].items[index].refName = props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000158')/* 国际化处理： 业务单元+集团*/;
                meta['search4assign'].items[index].refName_db = props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000158')/* 国际化处理： 业务单元+集团*/;
                meta['search4assign'].items[index].refcode = 'uapbd/refer/org/BusinessUnitAndGroupTreeRef/index';
                /* meta['search4assign'].items[index].queryCondition = {
                    AppCode : props.config.appcode,
                    TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                } */
            }else if(item.attrcode === 'pk_marbasclass'){
                meta['search4assign'].items[index].isMultiSelectedEnabled = true;
            }else if(item.attrcode === 'pk_brand' || item.attrcode === 'prodarea' || item.attrcode === 'pk_prodline' || item.attrcode === 'creator' || item.attrcode === 'modifier' || item.attrcode === 'delperson'){
                meta['search4assign'].items[index].isShowDisabledData = true;
            }
            if(item.attrcode === 'pk_org' && props.config.node_type==='ORG_NODE'){
                meta['search4assign'].items[index].refcode = 'uapbd/refer/org/BusinessUnitAndGroupTreeRef/index';
                meta['search4assign'].items[index].queryCondition={
                    AppCode : AppCode,
                    TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryGroupAndOrgSQLBuilder'
                }
            }else if(item.attrcode === 'pk_org' && props.config.node_type==='GROUP_NODE'){
                meta['search4assign'].items[index].refcode = 'uapbd/refer/org/BusinessUnitAndGroupTreeRef/index';
                meta['search4assign'].items[index].queryCondition = {
                    pk_group : businessInfo.groupId,
                    AppCode : AppCode,
                    TreeRefActionExt:'nccloud.web.uapbd.material.action.BusinessUnitAndGroupTreeRefExt'
                }
            }else if(item.attrcode === 'pk_marbasclass'){
                meta['search4assign'].items[index].isMultiSelectedEnabled = true;
                meta['search4assign'].items[index].isShowDisabledData = true;
                meta['search4assign'].items[index].isShowUnit = true;
            }
        });
    }
    save = (isSaveAdd) => {
        let check = this.props.form.isCheckNow(formid);
        if(!check) return;
        let checked = this.props.cardTable.checkTableRequired(values['convert']);
            if(!checked){
                return;
            }
        let CardData = this.props.createMasterChildData(pagecode, formid, values['convert']);
        let reqData = {
            pageid : CardData.pageid,
            head : CardData.head,
            bodys : CardData.body,
            userjson : `{ \"isSure\" : \"0\",\"opr\":${(this.pageStatus !== 'copy' && this.pageStatus != 'create')?'save':this.pageStatus},\"isUploadImg\":${this.state.isUploadImg} }`
        }
        let saveFunction = () => {
            ajax({
                url : urls['saveMaterial'],
                data : reqData,
                success : (res) => {
                    if(res.data && res.data.returnMsg){
                        this.props.modal.show('saveModal',{
                            content : res.data.returnMsg,
                            leftBtnName : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000008'),/* 国际化处理： 是*/
                            rightBtnName : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000007'),/* 国际化处理： 否*/
                            beSureBtnClick : ()=>{this.beSureSaveMaterial(isSaveAdd)}
                        });
                    }else{//保存成功
                        if(isSaveAdd){//保存新增
                            this.onButtonClick(this.props,'Add');
                            return;
                        }
                        //更新页面表单及表格状态
                        this.setState({
                            formStatus : 'browse',
                            isBrowse : true,
                            code : ''
                        },this.updatePageStatus);
                        if(this.pageStatus === 'add' && res.data.head){
                            addCache(res.data.head.material.rows[0].values['pk_material'].value,res.data,formid,this.props.config.datasource);
                        }
                        if(this.pageStatus === 'copy' ||  this.pageStatus === 'create' || this.pageStatus === 'add'){
                            this.pageStatus = 'browse';
                            if(res.data.head){
                                this.materialID = res.data.head.material.rows[0].values['pk_material'].value;
                                this.getData();
                            }
                            //更新头部按钮状态
                            updateButtonStatus(this.props,'browse');
                            toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000089'),color:'success'});/* 国际化处理： 保存成功*/
                            return ;
                        }
                        //设置表单数据
                        if(res.data.head){
                            this.props.form.setAllFormValue({material:res.data.head.material});
                        }
                        //设置辅助计量管理数据
                        if(res.data.bodys){
                            if(res.data.bodys[values['convert']]){//辅助计量管理
                                this.props.cardTable.setTableData(values['convert'],res.data.bodys[values['convert']]);
                            }
                        }
                        // if(res.data.head.material.rows[0].values['pk_marasstframe']){
                        //     let pk_marasstframe = res.data.head.material.rows[0].values['pk_marasstframe'].value;
                        //     ajax({
                        //         url : urls['queryMarAssistantByFrameID'],
                        //         data : {FrameID : pk_marasstframe},
                        //         success : (res) => {
                        //             if(res.data){
                        //                 //更新其他页签中自定义辅助属性的显示
                        //                 modifierAssistant(this.props,res.data.assistant);
                        //             }
                        //         }
                        //     });
                        // }
                        toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000089'),color:'success'});/* 国际化处理： 保存成功*/
                        //更新头部按钮状态
                        updateButtonStatus(this.props,'browse');
                    }
                }
            });
        }
        this.props.validateToSave(reqData,saveFunction,{'material':'form','materialconvert':'cardTable'},'extcard');
    }
    /**
     * 数据模板加载完成后事件
     */
    loadDataAfter = (checked_id,default_id) => {
        if(this.state.formStatus === 'add' && checked_id === ''){
            this.DataTempletModal.setSelected(default_id);
        }
    }

    /**
     * 选择数据模板改变事件
     * 更新页面数据
     */
    selectTempletEvt = (data) =>{
        if(!data) return
        if(data.head && data.head.material && data.head.material.rows && data.head.material.rows[0].values['pk_marasstframe']){
            let pk_marasstframe = data.head.material.rows[0].values['pk_marasstframe'].value;
            ajax({
                url : urls['queryMarAssistantByFrameID'],
                data : {FrameID : pk_marasstframe},
                success : (res) => {
                    if(res.data){
                        if(res.data.asstFrame){//公共辅助结构
                            let refvalue = {
                                refcode : res.data.asstFrame.code,
                                refname : res.data.asstFrame.name,
                                refpk : res.data.asstFrame.pk_marasstframe
                            };
                            //设置参照选定值
                            this.setState({MarAsstFrameGridRefValue:refvalue});
                        }
                        //设置页面上辅助属性的选定值
                        if(res.data.assistant){
                            res.data.assistant.forEach(element => {
                                this.state.checkModel[element.pk_userdefitem]=true;
                            });
                            this.setState({checkModel : this.state.checkModel});
                        }
                         //更新其他页签中自定义辅助属性的显示
                         //modifierAssistant(this.props,res.data.assistant);
                    }
                }
            });
        }
        if(data.head){
            this.props.form.setAllFormValue({material:data.head.material});
        }
        if(data.bodys){
            if(data.bodys[values['convert']]){//辅助计量管理
                this.props.cardTable.setTableData(values['convert'],data.bodys[values['convert']]);
            }
        }
    }

    getAssignStatus = (pk_material) => {
        let AssignStatusConfig = {pk_material:pk_material};
        return (
            <AssignStatus {...this.props} AssignStatusConfig={AssignStatusConfig} />
        );
    }

    /**
     * 确认删除
     */
    onDelForBrowse=(isBackDelete)=>{
        let pk = this.props.form.getFormItemsValue(formid,'pk_material');
        let ts = this.props.form.getFormItemsValue(formid,'ts');
        let dataArr=[];
        let delObj = {
            status: '3',
            values: {
                ts: {
                    display: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000020'),/* 国际化处理： 时间戳*/
                },
                pk_material: {
                    display: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000021'),/* 国际化处理： 主键*/
                }
            }
        }
        delObj.values.ts.value=ts.value;
        delObj.values.pk_material.value=pk.value;
        dataArr.push(delObj);
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
                    this.materialID = this.props.cardPagination.getNextCardPaginationId({id:pk,status:3});
                    this.props.cardPagination.setCardPaginationId({id:this.materialID});
                    this.clearPage(true,this.getData);
                    if(!this.materialID){
                        updateButtonStatus(this.props,'browse');
                    }
					toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029'),color:'success'});/* 国际化处理： 删除成功*/
				}
			}
		});
    }
    
    /**
     * 查看组织档案
     */
    createMarOrg = () => {
        return (
            <MarOrg {...this.props}/>
        );
    }

    /**
     * 按组织查看
     */
    createOrgDoc = () => {
        return (
            <OrgDoc {...this.props}/>
        );
    }

    /**
     * 创建新版本
     */
    createVerisonBeSureBtnClick = () => {
        this.pageStatus = 'create';
        this.setState({
            formStatus : 'add',
            isBrowse : false,
            img_url: ''
        },this.getData());
        this.updateFormEditEnable(this.config.node_type)
        updateButtonStatus(this.props,'create');
        //this.BillCode.setType('add');
        //this.BillCode.getBillCode();
    }

    /**
     * 保存验证，后台返回验证信息，前台点击确认事件，将数据保存到数据库
     */
    beSureSaveMaterial = (isSaveAdd) => {
        let CardData = this.props.createMasterChildData(pagecode, formid, values['convert']);
        let reqData = {
            pageid : CardData.pageid,
            head : CardData.head,
            bodys : CardData.body,
            userjson : `{ \"isSure\" : \"1\",\"opr\":${(this.pageStatus !== 'copy' && this.pageStatus != 'create')?'save':this.pageStatus},\"isUploadImg\":${this.state.isUploadImg} }`
        }
        ajax({
            url : urls['saveMaterial'],
            data : reqData,
            success : (res) => {
                if(isSaveAdd){//保存新增
                    this.onButtonClick(this.props,'Add');
                    return;
                }

                //更新页面表单及表格状态
                this.setState({
                    formStatus : 'browse',
                    isBrowse : true,
                    code : ''
                },this.updatePageStatus);
                if(this.pageStatus === 'add' && res.data.head){
                    addCache(res.data.head.material.rows[0].values['pk_material'].value,res.data,formid,this.props.config.datasource);
                }
                if(this.pageStatus === 'copy' ||  this.pageStatus === 'create' || this.pageStatus === 'add'){
                    this.pageStatus = 'browse';
                    if(res.data.head){
                        this.materialID = res.data.head.material.rows[0].values['pk_material'].value;
                        this.getData();
                    }
                    //更新头部按钮状态
                    updateButtonStatus(this.props,'browse');
                    return ;
                }
                //设置表单数据
                if(res.data.head){
                    this.props.form.setAllFormValue({material:res.data.head.material});
                }
                //设置辅助计量管理数据
                if(res.data.bodys){
                    if(res.data.bodys[values['convert']]){//辅助计量管理
                        this.props.cardTable.setTableData(values['convert'],res.data.bodys[values['convert']]);
                    }
                }
                // if(res.data.head.material.rows[0].values['pk_marasstframe']){
                //     let pk_marasstframe = res.data.head.material.rows[0].values['pk_marasstframe'].value;
                //     ajax({
                //         url : urls['queryMarAssistantByFrameID'],
                //         data : {FrameID : pk_marasstframe},
                //         success : (res) => {
                //             if(res.data){
                //                 //更新其他页签中自定义辅助属性的显示
                //                 modifierAssistant(this.props,res.data.assistant);
                //             }
                //         }
                //     });
                // }
                toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000089'),color:'success'});/* 国际化处理： 保存成功*/
                //更新头部按钮状态
                updateButtonStatus(this.props,'browse');
            }
        });
    }

    /**
     * 辅助属性结构参照值变化时的操作业务
     */
    onChangeMarAsstFrameGridRefValue = (value) => {
        this.setState({MarAsstFrameGridRefValue:value});
        if(value.refpk){
            ajax({
                url : urls['queryMarAssistantByFrameID'],
                data : {FrameID : value.refpk},
                success : (res) => {
                    if(res.data){
                        //1.将辅助属性设置为未选择状态
                        Object.keys(this.state.checkModel).forEach((item,index) => {
                            this.state.checkModel[item] = false;
                        });
                        //2.根据返回数据设置辅助属性的选中状态
                        if(res.data.assistant){
                            res.data.assistant.forEach(element => {
                                this.state.checkModel[element.pk_userdefitem]=true;
                            });
                            this.setState({checkModel : this.state.checkModel});
                        }
                    }
                }
            });
            //设置表单中pk_marasstframe的值
            this.props.form.setFormItemsValue(formid,{'pk_marasstframe':{value:value.refpk,display:value.refname}})
        }else{
            //辅助属性结构参照不选时，情况辅助属性，将基本信息中的pk_marasstframe设置为空
            Object.keys(this.state.checkModel).forEach((item,index) => {
                this.state.checkModel[item] = false;
            });
            this.setState({checkModel:this.state.checkModel});
            this.props.form.setFormItemsValue(formid,{'pk_marasstframe':{value:'~',display:null}})
        }
    }

    /**
     * 自定义辅助属性设置
     */
    setAssistant = () => {
        if(this.state.isBrowse){
            return
        }
        //1.将辅助属性定义面板设置为未选择状态
        Object.keys(this.state.panelCheckModel).forEach((item,index) => {
            this.state.panelCheckModel[item] = false;
        });
        //2.根据checkModel数据设置辅助属性定义面板的选中状态
        Object.keys(this.state.checkModel).forEach((item,index) => {
            this.state.panelCheckModel[item] = this.state.checkModel[item];
        });
        this.setState(this.state,()=>{this.props.modal.show('assistantmodal');})
    }

    /**
     * 获取辅助属性定义面板
     */
    getAssistantPanel = () => {
        return (
            <div>
                <div className="frame-save">
                    <NCCheckbox onChange={(e)=>{this.setState({isSaveFrame:e})}} checked={this.state.isSaveFrame}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000052')/* 国际化处理： 另存为辅助属性结构*/}</NCCheckbox>
                </div>
                <div>
                    <CheckBoxGroup 
                    disabled={false} 
                    items={MarAssistant}
                    checkModel={this.state.panelCheckModel} 
                    ></CheckBoxGroup>
                </div>
                
            </div>
        );
    }

    /**
     * 辅助属性定义面板确定事件
     */
    AssistantPanelBeSureBtnClick = () => {
        let sum = 0;
        let assistant_ids = [];
        Object.keys(this.state.panelCheckModel).forEach((item,index) => {
            if(this.state.panelCheckModel[item]) {
                sum++;
                assistant_ids.push(item);
            }
        });
        if(sum === 0){//全不选状态
            this.props.form.setFormItemsValue(formid,{'pk_marasstframe':{value:'~',display:null}});
            //设置辅助属性结构参照值为空
            this.setState({MarAsstFrameGridRefValue:{}});
            Object.keys(this.state.checkModel).forEach((item,index) => {
                this.state.checkModel[item] = false;
            });
            this.setState({checkModel:this.state.checkModel});
            //关闭模态框
            this.props.modal.close("assistantmodal");
        }else{//有数据选择状态，先保存到数据库，然后将数据设置到页面上
            if(this.state.isSaveFrame){//另存为辅助属性结构
                //打开marAssFrameModal模态框
                this.props.modal.show("marAssFrameModal");
                this.props.form.setFormStatus('marasstframe','add');
                let pk_group = this.props.form.getFormItemsValue(formid,'pk_group');
                //let pk_org = this.props.form.getFormItemsValue(formid,'pk_org');
                this.props.form.setFormItemsValue('marasstframe',{
                    pk_group : pk_group,
                    pk_org : pk_group,
                    ispub : {value:true}
                });
            }else{
                let rows = [];
                let pk_group = this.props.form.getFormItemsValue(formid,'pk_group');
                //let pk_org = this.props.form.getFormItemsValue(formid,'pk_org');
                let row = {
                    values : {
                        pk_group : pk_group,
                        pk_org : pk_group,
                        ispub : {value:false}
                    }
                }
                rows.push(row);
                let reqData = {
                    pageid:pagecodeValues['asstframe'],
                    model : {
                        areacode : 'marasstframe',
                        areaType : 'form',
                        rows : rows
                    },
                    userjson : `{ \"assistant_ids\" : \"${assistant_ids}\" }`
                }
                ajax({
                    url : urls['saveMarAssFrame'],
                    data : reqData,
                    success : (res) => {
                        let {success,data} = res;
                        let marasstframe = data.marasstframe;

                        this.props.form.setFormItemsValue(formid,{'pk_marasstframe':{value:marasstframe.pk_marasstframe,display:null}})
                        //设置辅助属性结构参照值为空
                        this.setState({MarAsstFrameGridRefValue:{}});
                        //将辅助属性设置为未选择状态
                        Object.keys(this.state.checkModel).forEach((item,index) => {
                            this.state.checkModel[item] = false;
                        });
                        //根据返回数据设置辅助属性的选中状态
                        data.assistants.forEach((item,index) => {
                            this.state.checkModel[item.pk_userdefitem] = true;
                        });
                        this.setState({checkModel:this.state.checkModel});
                        //关闭模态框
                        this.props.modal.close("assistantmodal");
                    }
                });
            }
        }
        
    }

    /**
     * 辅助属性结构信息新增模态框面板
     */
    getMarAssFramePanel = () => {
        return (
            <div className = "material-nc-bill-form-area nc-theme-gray-area-bgc">
                {this.props.form.createForm('marasstframe',{})}
            </div>
        );
    }

    /**
     * 辅助属性结构信息新增模态框确认按钮事件
     */
    MarAssFramePanelBeSureBtnClick = () => {
        let isCheckNow = this.props.form.isCheckNow('marasstframe');
        if(!isCheckNow) return;
        let assistant_ids = [];
        Object.keys(this.state.panelCheckModel).forEach((item,index) => {
            if(this.state.panelCheckModel[item]) {
                assistant_ids.push(item);
            }
        });
        let formValues = this.props.form.getAllFormValue('marasstframe');
        let reqData = {
            pageid:pagecodeValues['asstframe'],
            model : {
                areacode : 'marasstframe',
                areaType : 'form',
                rows : formValues.rows
            },
            userjson : `{ \"assistant_ids\" : \"${assistant_ids}\" }`
        }
        ajax({
            url : urls['saveMarAssFrame'],
            data:reqData,
            success : (res) => {
                let {success,data} = res;
                let marasstframe = data.marasstframe;

                this.props.form.setFormItemsValue(formid,{'pk_marasstframe':{value:marasstframe.pk_marasstframe,display:null}})
                //设置辅助属性结构参照值为空
                //TODO
                this.setState({MarAsstFrameGridRefValue:{refpk:marasstframe.pk_marasstframe,refcode:marasstframe.code,refname:marasstframe.name}});
                //将辅助属性设置为未选择状态
                Object.keys(this.state.checkModel).forEach((item,index) => {
                    this.state.checkModel[item] = false;
                });
                //根据返回数据设置辅助属性的选中状态
                data.assistants.forEach((item,index) => {
                    this.state.checkModel[item.pk_userdefitem] = true;
                });
                this.setState({checkModel:this.state.checkModel});
                //关闭模态框
                this.props.modal.close("marAssFrameModal");
                this.props.modal.close("assistantmodal");
            }
        });
    }

    getTableHead = () => {
		let {button} = this.props;
		let { createButtonApp } = button;
		let buttons  = this.props.button.getButtons();
		let status = this.props.getUrlParam("status");
        return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{createButtonApp({
						area: 'convert_table_head',//按钮注册中的按钮区域
						onButtonClick: (props,id)=>{
                            props.cardTable.addRow(values['convert']);
                        }
					})}
				</div>	
			</div>
        )
    }

    getTableHeadByAreaId = (areaid) => {
		let {button} = this.props;
		let { createButtonApp } = button;
        return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{createButtonApp({
                        tabindex:'0',
						area: areaid,//按钮注册中的按钮区域
						onButtonClick: this.childPrint
					})}
				</div>	
			</div>
        )
    }

    /**
     * 刷新子表表格数据
     */
    RefreshMaterialChild = (childTableID,pagecode,callback) => {
        let pk_material = this.props.form.getFormItemsValue(formid,'pk_material');
        if(!pk_material || !pk_material.value){
            return;
        }
        ajax({
            url:urls['refreshMaterialChild'],
            data:{
                materialID:pk_material.value,
                pagecode:pagecode
            },
            success:(res) => {
                let {success,data}=res;
                if(success && data && data[pagecode]){
                    this.props.cardTable.setTableData(childTableID,data[pagecode]);
                }else{
                    this.props.cardTable.setTableData(childTableID,{
                        areacode:pagecode,
                        rows:[]
                    });
                }
                callback && callback();
                //toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/
            }
        });
    }

    /**
     * 删除子表中的数据行
     */
    deleteMaterialChild = (childTableID,pkName,url) => {
        let checkedData = this.props.cardTable.getCheckedRows(childTableID);
        if(checkedData.length === 0){
            toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000063'),content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000145'),color:'success'});/* 国际化处理： 删除成功*/
            return;
        }
        promptBox({
            color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000046'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
            content: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000146'),             // 提示内容,非必输/* 国际化处理： 您确认删除所选数据？*/
            noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
            noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
            beSureBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
            cancelBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
            beSureBtnClick: ()=>{
                let pkArray = [],tsArray=[],indexArray=[];
                checkedData.forEach((item,index)=>{
                    indexArray.push(item.index);
                    pkArray.push(item.data.values[pkName].value);
                    tsArray.push(item.data.values['ts'].value);
                });
                ajax({
                    url:url,
                    data:{
                        pk:pkArray,
                        ts:tsArray
                    },
                    success: (res)=>{
                        let {success} = res;
                        if(success){
                            this.props.cardTable.delRowsByIndex(childTableID,indexArray);
                            toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029'),color:'success'});/* 国际化处理： 删除成功*/
                        }
                    }
                });
            }
        });
        
    }

    childPrint = (props,id) => {
        switch(id){
            case 'fi_head_delete':
                this.deleteMaterialChild(values['fi'],'pk_materialfi',delUrls['fi']);
                break;
            case 'fi_head_print':
                print('pdf',
                this.config.printUrls['fi'],
                {
                    funcode : this.config.printlist.fi.funcode,
                    nodekey : this.config.printlist.fi.nodekey,
                    oids : this.getOids('fi','pk_materialfi')
                });
                break;
            case 'fi_head_output':
                this.state.printConfig.url = this.config.printUrls['fi'];
                this.state.printConfig.funcode = this.config.printlist.fi.funcode;
                this.state.printConfig.nodekey = this.config.printlist.fi.nodekey;
                this.state.oids = this.getOids('fi','pk_materialfi');
                this.setState(this.state,
                this.refs.childPrintOutput.open());
                break;
            case 'fi_head_refresh':
                this.RefreshMaterialChild(values['fi'],'fi_list',()=>{toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/})
                break;
            case 'pfc_head_delete':
                this.deleteMaterialChild(values['pfc'],'pk_materialpfc',delUrls['pfc']);
                break;
            case 'pfc_head_print':
                print('pdf',
                this.config.printUrls['pfc'],
                {
                    funcode : this.config.printlist.pfc.funcode,
                    nodekey : this.config.printlist.pfc.nodekey,
                    oids : this.getOids('pfc','pk_materialpfc')
                });
                break;
            case 'pfc_head_output':
                this.state.printConfig.url = this.config.printUrls['pfc'];
                this.state.printConfig.funcode = this.config.printlist.pfc.funcode;
                this.state.printConfig.nodekey = this.config.printlist.pfc.nodekey;
                this.state.oids = this.getOids('pfc','pk_materialpfc');
                this.setState(this.state,
                this.refs.childPrintOutput.open());
                break;
            case 'pfc_head_refresh':
                this.RefreshMaterialChild(values['pfc'],'pfc_list',()=>{toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/})
                break;
            case 'pu_head_delete':
                this.deleteMaterialChild(values['pu'],'pk_materialpu',delUrls['pu']);
                break;
            case 'pu_head_print':
                print('pdf',
                this.config.printUrls['pu'],
                {
                    funcode : this.config.printlist.pu.funcode,
                    nodekey : this.config.printlist.pu.nodekey,
                    oids : this.getOids('pu','pk_materialpu')
                });
                break;
            case 'pu_head_output':
                this.state.printConfig.url = this.config.printUrls['pu'];
                this.state.printConfig.funcode = this.config.printlist.pu.funcode;
                this.state.printConfig.nodekey = this.config.printlist.pu.nodekey;
                this.state.oids = this.getOids('pu','pk_materialpu');
                this.setState(this.state,
                this.refs.childPrintOutput.open());
                break;
            case 'pu_head_refresh':
                this.RefreshMaterialChild(values['pu'],'pu_list',()=>{toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/})
                break;
            case 'sale_head_delete':
                this.deleteMaterialChild(values['sale'],'pk_materialsale',delUrls['sale']);
                break;
            case 'sale_head_print':
                print('pdf',
                this.config.printUrls['sale'],
                {
                    funcode : this.config.printlist.sale.funcode,
                    nodekey : this.config.printlist.sale.nodekey,
                    oids : this.getOids('sale','pk_materialsale')
                });
                break;
            case 'sale_head_output':
                this.state.printConfig.url = this.config.printUrls['sale'];
                this.state.printConfig.funcode = this.config.printlist.sale.funcode;
                this.state.printConfig.nodekey = this.config.printlist.sale.nodekey;
                this.state.oids = this.getOids('sale','pk_materialsale');
                this.setState(this.state,
                this.refs.childPrintOutput.open());
                break;
            case 'sale_head_refresh':
                this.RefreshMaterialChild(values['sale'],'sale_list',()=>{toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/})
                break;
            case 'stock_head_delete':
                this.deleteMaterialChild(values['stock'],'pk_materialstock',delUrls['stock']);
                break;
            case 'stock_head_print':
                print('pdf',
                this.config.printUrls['stock'],
                {
                    funcode : this.config.printlist.stock.funcode,
                    nodekey : this.config.printlist.stock.nodekey,
                    oids : this.getOids('stock','pk_materialstock')
                });
                break;
            case 'stock_head_output':
                this.state.printConfig.url = this.config.printUrls['stock'];
                this.state.printConfig.funcode = this.config.printlist.stock.funcode;
                this.state.printConfig.nodekey = this.config.printlist.stock.nodekey;
                this.state.oids = this.getOids('stock','pk_materialstock');
                this.setState(this.state,
                this.refs.childPrintOutput.open());
                break;
            case 'stock_head_refresh':
                this.RefreshMaterialChild(values['stock'],'stock_list',()=>{toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/})
                break;
            case 'plan_head_delete':
                this.deleteMaterialChild(values['plan'],'pk_materialplan',delUrls['plan']);
                break;
            case 'plan_head_print':
                print('pdf',
                this.config.printUrls['plan'],
                {
                    funcode : this.config.printlist.plan.funcode,
                    nodekey : this.config.printlist.plan.nodekey,
                    oids : this.getOids('plan','pk_materialplan')
                });
                break;
            case 'plan_head_output':
                this.state.printConfig.url = this.config.printUrls['plan'];
                this.state.printConfig.funcode = this.config.printlist.plan.funcode;
                this.state.printConfig.nodekey = this.config.printlist.plan.nodekey;
                this.state.oids = this.getOids('plan','pk_materialplan');
                this.setState(this.state,
                this.refs.childPrintOutput.open());
                break;
            case 'plan_head_refresh':
                this.RefreshMaterialChild(values['plan'],'plan_list',()=>{toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/})
                break;
            case 'prod_head_delete':
                this.deleteMaterialChild(values['prod'],'pk_materialprod',delUrls['prod']);
                break;
            case 'prod_head_print':
                print('pdf',
                this.config.printUrls['prod'],
                {
                    funcode : this.config.printlist.prod.funcode,
                    nodekey : this.config.printlist.prod.nodekey,
                    oids : this.getOids('prod','pk_materialprod')
                });
                break;
            case 'prod_head_output':
                this.state.printConfig.url = this.config.printUrls['prod'];
                this.state.printConfig.funcode = this.config.printlist.prod.funcode;
                this.state.printConfig.nodekey = this.config.printlist.prod.nodekey;
                this.state.oids = this.getOids('prod','pk_materialprod');
                this.setState(this.state,
                this.refs.childPrintOutput.open());
                break;
            case 'prod_head_refresh':
                this.RefreshMaterialChild(values['prod'],'prod_list',()=>{toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/})
                break;
            case 'cost_head_delete':
                this.deleteMaterialChild(values['cost'],'pk_materialcost',delUrls['cost']);
                break;
            case 'cost_head_print':
                print('pdf',
                this.config.printUrls['cost'],
                {
                    funcode : this.config.printlist.cost.funcode,
                    nodekey : this.config.printlist.cost.nodekey,
                    oids : this.getOids('cost','pk_materialcost')
                });
                break;
            case 'cost_head_output':
                this.state.printConfig.url = this.config.printUrls['cost'];
                this.state.printConfig.funcode = this.config.printlist.cost.funcode;
                this.state.printConfig.nodekey = this.config.printlist.cost.nodekey;
                this.state.oids = this.getOids('cost','pk_materialcost');
                this.setState(this.state,
                this.refs.childPrintOutput.open());
                break;
            case 'cost_head_refresh':
                this.RefreshMaterialChild(values['cost'],'cost_list',()=>{toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/})
                break;
            case 'pfccinfo_head_delete':
                this.deleteMaterialChild(values['pfccinfo'],'pk_mateprofcost',delUrls['pfccinfo']);
                break;
            case 'pfccinfo_head_print':
                print('pdf',
                this.config.printUrls['pfccinfo'],
                {
                    funcode : this.config.printlist.pfccinfo.funcode,
                    nodekey : this.config.printlist.pfccinfo.nodekey,
                    oids : this.getOids('pfccinfo','pk_mateprofcost')
                });
                break;
            case 'pfccinfo_head_output':
                this.state.printConfig.url = this.config.printUrls['pfccinfo'];
                this.state.printConfig.funcode = this.config.printlist.pfccinfo.funcode;
                this.state.printConfig.nodekey = this.config.printlist.pfccinfo.nodekey;
                this.state.oids = this.getOids('pfccinfo','pk_mateprofcost');
                this.setState(this.state,
                this.refs.childPrintOutput.open());
                break;
            case 'pfccinfo_head_refresh':
                this.RefreshMaterialChild(values['pfccinfo'],'pfccinfo_list',()=>{toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/})
                break;
        }

    }

    getOids = (tableid,key) => {
        let array = [];
        let tableData = this.props.cardTable.getAllRows(tableid);
        tableData.forEach(element => {
            array.push(element.values[key].value);
        });
        return array;
    }

    /**
     * 卡片翻页
     */
    pageQueryClick = (props,pk) => {
        if(pk && pk !== this.materialID){
            this.props.cardPagination.setCardPaginationId({id:pk});
            this.props.setUrlParam({id:pk,status:'browse'});
            this.materialID = pk;
            this.clearPage(true,this.getData);
        }
    }

    getDeleteModalContext = () => {
        let newModalTitle={color: '#111111',fontWeight: 'normal !important',paddingLeft: 38,lineHeight: '21px',fontSize: 18,marginTop: 5,display: 'flex'};
        let newModalBody={marginBottom: 15,padding: '8px 47px 0 85px',width: '100%',fontSize: 13,height: '-webkit-max-content',height: '-moz-max-content',height: 'max-content',lineHeight: '21px',color: '#555555'};
        return (
            [
                <h4 class="u-modal-title" style={newModalTitle}><span style={{color: '#ffbf00',fontSize:25,marginRight:20}}class="iconfont icon-zhuyi1 warning"></span>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000056')/* 国际化处理： 删除*/}</h4>,
                <div class="u-modal-body" style={newModalBody} tabindex="0">{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000053')/* 国际化处理： 后台删除,删除可能等待很长的时间,可以点击,按钮,调用后台任务执行*/}</div>,
                
            ]
        )
    }

    getDelcustomBtns = ()=>{
        return (
            <div>
                <NCButton filedid = 'sure' onClick={ ()=>{this.props.modal.close("deleteModal");this.onDelForBrowse(false)}}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000056')/* 国际化处理： 删除*/}</NCButton>
                <NCButton filedid = 'backgroudDelete' colors='primary' onClick={ ()=>{this.props.modal.close("deleteModal");this.onDelForBrowse(true)}}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000030')/* 国际化处理： 后台删除*/}</NCButton>
                <NCButton fieldid = 'cancel' onClick={()=>{this.props.modal.close("deleteModal");} }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/}</NCButton>
            </div>
        );
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
     * 上传前事件，删除本次编辑上传过的图片
     */
    beforeUploadImg = () => {
        let imglist = this.state.imgcachelist;
        if(imglist.length === 0){
            return true;
        }else{
            imglist.forEach(item => {
                this.deleteImageDB(item);
            });
            return true;
        }
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

    updateUploadData = (pk_material) => {
        let businessInfo = getBusinessInfo();
        let imgpath = businessInfo.userId;
        if(pk_material){
            imgpath = imgpath + '/' + pk_material;
        }
        this.state.imguploaddata.billId = 'uapbd/IMG/c7dc0ccd-8872-4eee-8882-160e8f49dfad/' + imgpath;
        this.state.imguploaddata.fullPath = 'uapbd/IMG/c7dc0ccd-8872-4eee-8882-160e8f49dfad/' + imgpath;
        this.state.imgcachelist = [];
        this.state.isUploadImg = false;
        this.setState(this.state);
    }

    getUplodImg = () => {
        return this.state.formStatus != 'browse' ? (
            <NCUpload
                action='/nccloud/platform/attachment/upload.do'
                data = {this.state.imguploaddata}
                onChange={this.onUploadImgChange}
                showUploadList={false}
                beforeUpload={this.beforeUploadImg}
                listType='picture'
                accept="image/jpg"
                >
                    <div style={{position:'relative'}}>
                        <div className='left-img' style={{display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                            {(!this.state.img_url || this.state.img_url === '') && <i class="uf uf-cloud-o-up"/>}
                            {this.state.img_url && this.state.img_url !== '' && <img src={this.state.img_url} style={{width:'100%',height:'100%'}} />}
                        </div>
                        {this.state.img_url && this.state.img_url !== '' && <i class="uf uf-close" style={{position:'absolute',right:-5,top:-5}} onClick={this.deleteImg}/>}
                    </div>
                </NCUpload>
        ):(
            <div style={{position:'relative'}}>
                <div className='left-img' style={{display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                    {(!this.state.img_url || this.state.img_url === '') && <i class="uf uf-cloud-o-up"/>}
                    {this.state.img_url && this.state.img_url !== '' && <img src={this.state.img_url} style={{width:'100%',height:'100%'}} />}
                </div>
            </div>
        )
    }
    querychildclick =(tableflag,isfold)=>{
        if(!isfold){
            let length =this.props.cardTable.getAllData(tableflag).rows.length;
            if(length<=0){
                if(!this.materialID) return;
                let data = {
                    materialID : this.materialID,
                    pagecode : pagecode,
                    tableflag:tableflag
                }
                ajax({
                    url : '/nccloud/uapbd/material/queryMaterialChild.do',
                    data : data,
                    success : (res) => {
                        //设置子表数据
                        let {success,data} = res;
                        if(data.bodys){
                            if(data.bodys[values['convert']]){//辅助计量管理
                                this.props.cardTable.setTableData(values['convert'],data.bodys[values['convert']]);
                            }
                            if(data.bodys[values['fi']]){//财务信息
                                this.props.cardTable.setTableData(values['fi'],data.bodys[values['fi']]);
                                this.initChidlData(this,'fi');
                            }
                            if(data.bodys[values['pfc']]){//利润中心
                                this.props.cardTable.setTableData(values['pfc'],data.bodys[values['pfc']]);
                                this.initChidlData(this,'pfc');
                            }
                            if(data.bodys[values['pu']]){//采购信息
                                this.props.cardTable.setTableData(values['pu'],data.bodys[values['pu']]);
                                this.initChidlData(this,'pu');
                            }
                            if(data.bodys[values['sale']]){//销售信息
                                this.props.cardTable.setTableData(values['sale'],data.bodys[values['sale']]);
                                this.initChidlData(this,'sale');
                            }
                            if(data.bodys[values['stock']]){//库存信息
                                this.props.cardTable.setTableData(values['stock'],data.bodys[values['stock']]);
                                this.initChidlData(this,'stock');
                            }
                            if(data.bodys[values['plan']]){//计划信息
                                this.props.cardTable.setTableData(values['plan'],data.bodys[values['plan']]);
                                this.initChidlData(this,'plan');
                            }
                            if(data.bodys[values['prod']]){//生产信息
                                this.props.cardTable.setTableData(values['prod'],data.bodys[values['prod']]);
                                this.initChidlData(this,'prod');
                            }
                            if(data.bodys[values['cost']]){//成本信息
                                this.props.cardTable.setTableData(values['cost'],data.bodys[values['cost']]);
                                this.initChidlData(this,'cost');
                            }
                            if(data.bodys[values['pfccinfo']]){//利润中心成本
                                this.props.cardTable.setTableData(values['pfccinfo'],data.bodys[values['pfccinfo']]);
                                this.initChidlData(this,'pfccinfo');
                            }
                        }
                    }
                })
            }
        }
    }
    /**
     * 更新子表按钮状态
     */
    updateChildButton = (tableflag) => {
        switch(tableflag){
            case 'fi':
                let rows = this.props.cardTable.getCheckedRows(values['fi']);
                if(rows && rows.length > 0){//fi_head_delete
                    this.props.button.setDisabled({ fi_head_delete : false });
                }else{
                    this.props.button.setDisabled({ fi_head_delete : true });
                }
                break;
            case 'pfc':
                rows = this.props.cardTable.getCheckedRows(values['pfc']);
                if(rows && rows.length > 0){//pfc_head_delete
                    this.props.button.setDisabled({ pfc_head_delete : false });
                }else{
                    this.props.button.setDisabled({ pfc_head_delete : true });
                }
                break;
            case 'pu':
                rows = this.props.cardTable.getCheckedRows(values['pu']);
                if(rows && rows.length > 0){//pu_head_delete
                    this.props.button.setDisabled({ pu_head_delete : false });
                }else{
                    this.props.button.setDisabled({ pu_head_delete : true });
                }
                break;
            case 'plan':
                rows = this.props.cardTable.getCheckedRows(values['plan']);
                if(rows && rows.length > 0){//plan_head_delete
                    this.props.button.setDisabled({ plan_head_delete : false });
                }else{
                    this.props.button.setDisabled({ plan_head_delete : true });
                }
                break;
            case 'prod':
                rows = this.props.cardTable.getCheckedRows(values['prod']);
                if(rows && rows.length > 0){//prod_head_delete
                    this.props.button.setDisabled({ prod_head_delete : false });
                }else{
                    this.props.button.setDisabled({ prod_head_delete : true });
                }
                break;
            case 'cost':
                rows = this.props.cardTable.getCheckedRows(values['cost']);
                if(rows && rows.length > 0){//cost_head_delete
                    this.props.button.setDisabled({ cost_head_delete : false });
                }else{
                    this.props.button.setDisabled({ cost_head_delete : true });
                }
                break;
            case 'sale':
                rows = this.props.cardTable.getCheckedRows(values['sale']);
                if(rows && rows.length > 0){//sale_head_delete
                    this.props.button.setDisabled({ sale_head_delete : false });
                }else{
                    this.props.button.setDisabled({ sale_head_delete : true });
                }
                break;
            case 'stock':
                rows = this.props.cardTable.getCheckedRows(values['stock']);
                if(rows && rows.length > 0){//stock_head_delete
                    this.props.button.setDisabled({ stock_head_delete : false });
                }else{
                    this.props.button.setDisabled({ stock_head_delete : true });
                }
                break;
            case 'pfccinfo':
                rows = this.props.cardTable.getCheckedRows(values['pfccinfo']);
                if(rows && rows.length > 0){//pfccinfo_head_delete
                    this.props.button.setDisabled({ pfccinfo_head_delete : false });
                }else{
                    this.props.button.setDisabled({ pfccinfo_head_delete : true });
                }
                break;
        }
    }

    render (){
        let { button,cardTable,form,modal,cardPagination, BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
        let { createForm } = form;
        let {createCardTable } = cardTable;
        let { createButtonApp } = button;
        let {createModal} = modal;
        const { createCardPagination } = cardPagination;
        const isShow = { display: this.state.MarAssistantShowStatus ? 'block' : 'none' };
        return (
            <div className="nc-bill-extCard">
                <NCAnchor>
                    <NCScrollLink to='base' spy={true} smooth={true} duration={300} offset={-100} >
                        <p>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000031')/* 国际化处理： 基本信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink to='materialconvert' spy={true} smooth={true} duration={300}  offset={-100}>
                        <p>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000057')/* 国际化处理： 辅助计量管理*/}</p>
                    </NCScrollLink>
                    <NCScrollLink to='materialtaxtype' spy={true} smooth={true} duration={300} offset={-100} >
                        <p>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000058')/* 国际化处理： 辅助属性*/}</p>
                    </NCScrollLink>
                    <NCScrollLink to='fi' spy={true} smooth={true} duration={300} offset={-100} clickFun={this.clickFunFunction.bind(this,'fi')}>
                        <p>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000036')/* 国际化处理： 财务信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink  to='pfc' spy={true} smooth={true} duration={300} offset={-100} clickFun={this.clickFunFunction.bind(this,'pfc')}>
                        <p>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000037')/* 国际化处理： 利润中心信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink  to='pu' spy={true} smooth={true} duration={300} offset={-100} clickFun={this.clickFunFunction.bind(this,'pu')}>
                        <p>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000038')/* 国际化处理： 采购信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink  to='sale' spy={true} smooth={true} duration={300} offset={-100} clickFun={this.clickFunFunction.bind(this,'sale')}>
                        <p>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000039')/* 国际化处理： 销售信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink  to='stock' spy={true} smooth={true} duration={300} offset={-100} clickFun={this.clickFunFunction.bind(this,'stock')}>
                        <p>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000040')/* 国际化处理： 库存信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink  to='plan' spy={true} smooth={true} duration={300} offset={-100} clickFun={this.clickFunFunction.bind(this,'plan')}>
                        <p>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000041')/* 国际化处理： 计划信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink  to='prod' spy={true} smooth={true} duration={300} offset={-100} clickFun={this.clickFunFunction.bind(this,'prod')}>
                        <p>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000042')/* 国际化处理： 生产信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink  to='cost' spy={true} smooth={true} duration={300} offset={-100} clickFun={this.clickFunFunction.bind(this,'cost')}>
                        <p>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000043')/* 国际化处理： 成本信息*/}</p>
                    </NCScrollLink>
                    <NCScrollLink  to='pfccinfo' spy={true} smooth={true} duration={300} offset={-100} clickFun={this.clickFunFunction.bind(this,'pfccinfo')}>
                        <p>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000044')/* 国际化处理： 利润中心成本*/}</p>
                    </NCScrollLink>
                </NCAnchor>
                <NCAffix>
                    <NCDiv className="nc-bill-header-area nc-theme-gray-area-bgc nc-bill-header-area-my-style" areaCode={NCDiv.config.HEADER}>
                    {/* <div style={{display:this.state.isBrowse ? '' : 'none'}} className='header-title-search-area'>
                        {createBillHeadInfo({
                                title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get(this.config.title),
                                backBtnClick: this.onButtonClick.bind(this,this.props,'Reback')
                            }
                        )}
                    </div> */}
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get(this.config.title),
                            initShowBackBtn:this.state.isBrowse,
                            backBtnClick : ()=>{this.onButtonClick(this.props,'Reback')}
                        })}
                    </div>
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'card_head',
                            buttonLimit: 3, 
                            onButtonClick: this.onButtonClick.bind(this), 
                            popContainer: document.querySelector('.header-button-area')

                        })}
                    </div>
                    {
                        this.props.form.getFormItemsValue('material','pk_material') != null
                        && this.props.form.getFormItemsValue('material','pk_material').value != null
                        && this.props.form.getFormItemsValue('material','pk_material').value.length > 0?
                    <div className="header-cardPagination-area">
                        {createCardPagination({ handlePageInfoChange: this.pageQueryClick,dataSource:this.props.config.datasource })}
                    </div> : ''
                    }
                </NCDiv>
                </NCAffix>
                <NCTabs navtype="turn" contenttype="moveleft" defaultActiveKey="base">
                    <NCTabPane tab={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000031')/* 国际化处理： 基本信息*/} key="base">
                        <NCScrollElement name="base">
                            {/* 卡片区 */}
                            <div className="nc-bill-form-area material-nc-bill-form-area nc-theme-gray-area-bgc">
                                {createForm(formid, {
                                    expandArr : ['base'],
                                    onAfterEvent: this.onAfterEvent,
                                    onBeforeEvent : this.onBeforeEvent,
                                    headLeftArea : this.getUplodImg
                                })}
                            </div>
                        </NCScrollElement>

                        <NCScrollElement name='materialconvert' className = "material-nc-bill-form-area nc-theme-gray-area-bgc" style={{paddingTop: 6}}>
                            {/* 子表列表 */}
                            <div className="nc-bill-tableTab-area nc-bill-tableTab-area-add-style nc-theme-gray-area-bgc" style={{borderRadius:'3px'}}>
                                {!this.state.pageDrawing && createCardTable(values['convert'], {//列表区
                                    tableHead: this.getTableHead,
                                    onAfterEvent: this.onAfterEvent4convert,                      // 控件的编辑后事件  
                                    onBeforeEvent:this.onBeforeEvent4convert,
                                    useFixedHeader:true,  
                                    hideSwitch:()=>{return true},  
                                    showIndex:true				//显示序号

                                })}
                            </div>
                        </NCScrollElement>

                        <NCScrollElement name='materialtaxtype'>
                            <div className="nc-bill-tableTab-area material-nc-bill-form-area nc-theme-gray-area-bgc">
                                <main className="lightapp-component-cardTable">
                                    <div className="lightapp-component-cardTable-table">
                                        <section className="light-tabs">
                                            <header className="light-tabs-header cf">
                                                <i className={this.state.MarAssistantShowStatus?"light-tabs-angle fl angle-show":"light-tabs-angle fl"}
                                                onClick={()=>{this.setState({MarAssistantShowStatus:!this.state.MarAssistantShowStatus});}}
                                                >
                                                    <span className={this.state.MarAssistantShowStatus?"iconfont icon table-tabs-icon icon-bottom":"iconfont icon table-tabs-icon icon-right"}></span>
                                                </i>
                                                <ul className="tabs-wraps fl single-tab">
                                                    <li className="active"><a href="javascript:;">{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000058')/* 国际化处理： 辅助属性*/}</a></li>
                                                </ul>
                                                <div className="tabs-operation fr">
                                                    <span className="icon iconfont icon-shezhi head-icon" onClick={this.setAssistant}></span>
                                                </div>
                                            </header>
                                            <footer className="light-tabs-content" style={isShow}>
                                            <div className="marasstframe-ref-div">
                                                <span className="title nc-theme-common-font-c">{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000059')/* 国际化处理： 辅助属性结构*/}</span>
                                                <div className="grid-ref">
                                                    {MarAsstFrameGridRef({
                                                        onChange : this.onChangeMarAsstFrameGridRefValue,
                                                        value: this.state.MarAsstFrameGridRefValue,
                                                        disabled : this.state.isBrowse
                                                    })}
                                                </div>
                                            </div>
                                            <div>
                                                <CheckBoxGroup
                                                    disabled={true}
                                                    items={MarAssistant}
                                                    checkModel={this.state.checkModel}
                                                ></CheckBoxGroup>
                                            </div>
                                            </footer>
                                        </section>
                                    </div>
                                </main>
                            </div>
                        </NCScrollElement>

                        {/* 财务信息 */}
                        <NCScrollElement name='fi'>
                            <div className="nc-bill-tableTab-area material-nc-bill-form-area nc-theme-gray-area-bgc">
                                {!this.state.pageDrawing && createCardTable(values['fi'], {//列表区
                                    tableHead: this.getTableHeadByAreaId.bind(this,'fi_head'),
                                    useFixedHeader:true,    
                                    showIndex:true,				//显示序号
                                    showCheck:true,
                                    hideSwitch:()=>{return false},
                                    selectedChange:()=>{this.updateChildButton('fi')},
                                    foldCallback:(isfold)=>{this.querychildclick('fi',isfold)},
                                    onSelectedAll:()=>{this.updateChildButton('fi')},
                                    onRowDoubleClick:onRowDoubleClick.fi.bind(this)

                                })}
                            </div>
                        </NCScrollElement>

                            {/* 利润中心信息 */}
                        <NCScrollElement name='pfc'>
                            <div className="nc-bill-tableTab-area material-nc-bill-form-area nc-theme-gray-area-bgc">
                                {!this.state.pageDrawing && createCardTable(values['pfc'], {//列表区
                                    tableHead: this.getTableHeadByAreaId.bind(this,'pfc_head'),
                                    useFixedHeader:true,    
                                    showIndex:true,				//显示序号
                                    showCheck:true,
                                    hideSwitch:()=>{return false},
                                    selectedChange:()=>{this.updateChildButton('pfc')},
                                    foldCallback:(isfold)=>{this.querychildclick('pfc',isfold)},
                                    onSelectedAll:()=>{this.updateChildButton('pfc')},
                                    onRowDoubleClick:onRowDoubleClick.pfc.bind(this)

                                })}
                            </div>
                        </NCScrollElement>
                        {/* 采购信息 */}
                        <NCScrollElement name='pu'>
                            <div className="nc-bill-tableTab-area material-nc-bill-form-area nc-theme-gray-area-bgc">
                                {!this.state.pageDrawing && createCardTable(values['pu'], {//列表区
                                    tableHead: this.getTableHeadByAreaId.bind(this,'pu_head'),
                                    useFixedHeader:true,    
                                    showIndex:true,				//显示序号
                                    showCheck:true,
                                    hideSwitch:()=>{return false},
                                    selectedChange:()=>{this.updateChildButton('pu')},
                                    foldCallback:(isfold)=>{this.querychildclick('pu',isfold)},
                                    onSelectedAll:()=>{this.updateChildButton('pu')},
                                    onRowDoubleClick:onRowDoubleClick.pu.bind(this)

                                })}
                            </div>
                        </NCScrollElement>
                        {/* 销售信息 */}
                        <NCScrollElement name='sale'>
                            <div className="nc-bill-tableTab-area material-nc-bill-form-area nc-theme-gray-area-bgc" >
                                {!this.state.pageDrawing && createCardTable(values['sale'], {//列表区
                                    tableHead: this.getTableHeadByAreaId.bind(this,'sale_head'),
                                    useFixedHeader:true,    
                                    showIndex:true,				//显示序号
                                    showCheck:true,
                                    hideSwitch:()=>{return false},
                                    selectedChange:()=>{this.updateChildButton('sale')},
                                    onSelectedAll:()=>{this.updateChildButton('sale')},
                                    foldCallback:(isfold)=>{this.querychildclick('sale',isfold)},
                                    onRowDoubleClick:onRowDoubleClick.sale.bind(this)

                                })}
                            </div>
                        </NCScrollElement>
                        {/* 库存信息 */}
                        <NCScrollElement name='stock'>
                            <div className="nc-bill-tableTab-area material-nc-bill-form-area nc-theme-gray-area-bgc">
                                {!this.state.pageDrawing && createCardTable(values['stock'], {//列表区
                                    tableHead: this.getTableHeadByAreaId.bind(this,'stock_head'),
                                    useFixedHeader:true,    
                                    showIndex:true,				//显示序号
                                    showCheck:true,
                                    hideSwitch:()=>{return false},
                                    selectedChange:()=>{this.updateChildButton('stock')},
                                    foldCallback:(isfold)=>{this.querychildclick('stock',isfold)},
                                    onSelectedAll:()=>{this.updateChildButton('stock')},
                                    onRowDoubleClick:onRowDoubleClick.stock.bind(this)

                                })}
                            </div>
                        </NCScrollElement>
                        {/* 计划信息 */}
                        <NCScrollElement name='plan'>
                            <div className="nc-bill-tableTab-area material-nc-bill-form-area nc-theme-gray-area-bgc">
                                {!this.state.pageDrawing && createCardTable(values['plan'], {//列表区
                                    tableHead: this.getTableHeadByAreaId.bind(this,'plan_head'),
                                    useFixedHeader:true,    
                                    showIndex:true,				//显示序号
                                    showCheck:true,
                                    hideSwitch:()=>{return false},
                                    selectedChange:()=>{this.updateChildButton('plan')},
                                    foldCallback:(isfold)=>{this.querychildclick('plan',isfold)},
                                    onSelectedAll:()=>{this.updateChildButton('plan')},
                                    onRowDoubleClick:onRowDoubleClick.plan.bind(this)

                                })}
                            </div>
                        </NCScrollElement>
                        {/* 生产信息 */}
                        <NCScrollElement name='prod'>
                            <div className="nc-bill-tableTab-area material-nc-bill-form-area nc-theme-gray-area-bgc" >
                                {!this.state.pageDrawing && createCardTable(values['prod'], {//列表区
                                    tableHead: this.getTableHeadByAreaId.bind(this,'prod_head'),
                                    useFixedHeader:true,    
                                    showIndex:true,				//显示序号
                                    showCheck:true,
                                    hideSwitch:()=>{return false},
                                    selectedChange:()=>{this.updateChildButton('prod')},
                                    foldCallback:(isfold)=>{this.querychildclick('prod',isfold)},
                                    onSelectedAll:()=>{this.updateChildButton('prod')},
                                    onRowDoubleClick:onRowDoubleClick.prod.bind(this)

                                })}
                            </div>
                        </NCScrollElement>
                        {/* 成本信息 */}
                        <NCScrollElement name='cost'>
                            <div className="nc-bill-tableTab-area material-nc-bill-form-area nc-theme-gray-area-bgc" >
                                {!this.state.pageDrawing && createCardTable(values['cost'], {//列表区
                                    tableHead: this.getTableHeadByAreaId.bind(this,'cost_head'),
                                    useFixedHeader:true,    
                                    showIndex:true,				//显示序号
                                    showCheck:true,
                                    hideSwitch:()=>{return false},
                                    selectedChange:()=>{this.updateChildButton('cost')},
                                    foldCallback:(isfold)=>{this.querychildclick('cost',isfold)},
                                    onSelectedAll:()=>{this.updateChildButton('cost')},
                                    onRowDoubleClick:onRowDoubleClick.cost.bind(this)

                                })}
                            </div>
                        </NCScrollElement>
                        {/* 利润中心成本 */}
                        <NCScrollElement name='pfccinfo'>
                            <div className="nc-bill-tableTab-area material-nc-bill-form-area nc-theme-gray-area-bgc">
                                {!this.state.pageDrawing && createCardTable(values['pfccinfo'], {//列表区
                                    tableHead: this.getTableHeadByAreaId.bind(this,'pfccinfo_head'),
                                    useFixedHeader:true,    
                                    showIndex:true,				//显示序号
                                    showCheck:true,
                                    hideSwitch:()=>{return false},
                                    selectedChange:()=>{this.updateChildButton('pfccinfo')},
                                    foldCallback:(isfold)=>{this.querychildclick('pfccinfo',isfold)},
                                    onSelectedAll:()=>{this.updateChildButton('pfccinfo')},
                                    onRowDoubleClick:onRowDoubleClick.pfccinfo.bind(this)

                                })}
                            </div>
                        </NCScrollElement>
                    </NCTabPane>
                </NCTabs>
    
                <PrintOutput
                    ref='printOutput'
                    url={urls['print']}
                    data={{
						funcode : this.config.print.funcode,
						nodekey : this.config.print.nodekey,
						oids : this.state.oids,
						outputType : 'output'
					}}
                />
                <PrintOutput
                    ref='childPrintOutput'
                    url={this.state.printConfig.url}
                    data={{
						funcode : this.state.printConfig.funcode,
						nodekey : this.state.printConfig.nodekey,
						oids : this.state.oids,
						outputType : 'output'
					}}
                />
                {createModal('saveModal',{
					title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000032'),										//标题/* 国际化处理： 提示信息*/
                    content : '',
                    size : 'lg'						
                })}
                
                {createModal('assistantmodal',{
					title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000034'),										//标题/* 国际化处理： 辅助属性定义*/
                    content : this.getAssistantPanel(),
                    beSureBtnClick : this.AssistantPanelBeSureBtnClick,                 //确定按钮事件回调
                    size : 'xlg',
                    noFooter : false							
                })}

                {createModal('marAssFrameModal',{
					title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000035'),										//标题/* 国际化处理： 请输入辅助属性结构信息*/
                    content : this.getMarAssFramePanel(),
                    beSureBtnClick : this.MarAssFramePanelBeSureBtnClick,                 //确定按钮事件回调
                    cancelBtnClick : ()=>{this.props.modal.close('marAssFrameModal');},
                    size : 'xlg',
                    noFooter : false,
                    userControl:true							
                })}
                
                {createModal('fimodal', {
                    zIndex:211,
                })}
                {createModal('pfcmodal', {
                    zIndex:211,
                })}
                {createModal('pumodal', {
                    zIndex:211,
                })}
                {createModal('salemodal', {
                    zIndex:211,
                })}
                {createModal('stockmodal', {
                    zIndex:211,
                })}
                {createModal('planmodal', {
                    zIndex:211,
                })}
                {createModal('prodmodal', {
                    zIndex:211,
                })}
                {createModal('costmodal', {
                    zIndex:211,
                })}
                {createModal('pfccinfomodal')}
                <AssignStepModal ref={(assignStepModal) => this.assignStepModal = assignStepModal} {...this.props} onFinish={this.onAssignFinish}/>
                <AssignModal ref={(assignModal) => this.assignModal = assignModal} {...this.props} onFinish={this.onAssignFinish}/>
                <Batcheditmodal ref={(item)=>{this.Batcheditmodal=item}} {...this.props} tableConfig={EditTabConfig} url={urls['batchUpdate']} onFinish={(res)=>{this.onButtonClick(this.props,'Refresh')}}/>
                <Batcheditstepmodal ref={(item)=>{this.Batcheditstepmodal=item}} {...this.props} tableConfig={BatchUpdateWizardConfig} url={urls['batchUpdateWizard']} onFinish={(res)=>{this.onButtonClick(this.props,'Refresh')}}/>
                <DataTempletModal ref={(item)=> this.DataTempletModal = item} {...this.props} selectTempletEvt={this.selectTempletEvt} loadDataAfter={this.loadDataAfter}/>
                {createModal('orgBrowseModal',{
					title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000045'),										//标题/* 国际化处理： 物料按组织查看*/
                    content : this.createOrgDoc(),
                    hasCloseBtn:true,
                    size : 'xlg',
                    noFooter : true							
                })}

                {createModal('deleteModal',{
					title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000046'),										//标题/* 国际化处理： 确认删除*/
					content : this.getDeleteModalContext(),							//内容
                    customBtns : this.getDelcustomBtns(),
                    noFooter : false,
                    showCustomBtns:true,
                    className:'junior',
                })}
                
                {createModal('marOrgModal',{
                    title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000047'),/* 国际化处理： 查看组织级物料*/
                    content : this.createMarOrg(),
                    hasCloseBtn:true,
                    size : 'xlg',
                    noFooter : true
                })}

                {createModal('assignstatusModal')}
                {createModal('inquiry',{
                    title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000049'),/* 国际化处理： 询问*/
                    content : '',
                    size : 'xlg'
                })}
                {createModal('modal',{
                    title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000050'),/* 国际化处理： 提示*/
                    content : '',
                    size : 'xlg'
                })}
                {createModal('childCardmodal',{
                    title : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000051'),/* 国际化处理： 子表提示*/
                    content : '',
                    size : 'xlg'
                })}
                {this.state.showUploader && <NCUploader 
                    billId={`uapbd/c7dc0ccd-8872-4eee-8882-160e8f49dfad/${this.state.uploaderDir}`} 
                    //billNo={'001'}
                    placement={'bottom'}
                    onHide={()=>{this.setState({showUploader:false})}} // 关闭功能
                    //beforeUpload={this.beforeUpload} 
                    />
                }

            </div>
        )
    }
}
Material = createPage({
    initTemplate: function(){},
    mutiLangCode: '10140MATERIAL'
})(Material);

export default Material;
//ReactDOM.render(<Material/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65