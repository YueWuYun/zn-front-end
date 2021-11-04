//Aspa4GogLk8Lhb48aTpvptZ/ONgg3Q8/tTcqrBzNS/Iko63kPYhDhxFBhnnY6vfX
/**
 * 按组织查看
 * @author yinshb
 */
import React, { Component } from 'react';
import {ajax, base,print,high,toast } from 'nc-lightapp-front';
import FinanceOrgTreeRef from '../../../../uapbd/refer/org/FinanceOrgTreeRef/index';//财务组织参照
import LiabilityCenterOrgTreeRef from '../../../../uapbd/refer/org/LiabilityCenterOrgTreeRef/index';//利润中心参照
import PurchaseOrgGridRef from '../../../../uapbd/refer/org/PurchaseOrgGridRef/index';//采购组织参照
import SaleOrgTreeRef from '../../../../uapbd/refer/org/SaleOrgTreeRef/index';//销售组织参照
import StockOrgGridRef from '../../../../uapbd/refer/org/StockOrgGridRef/index';//库存组织参照
import StockPlanGridRef from '../../../../uapbd/refer/org/StockPlanGridRef/index';// 库存/计划
import FactoryGridRef from '../../../../uapbd/refer/org/FactoryGridRef/index';//工厂参照
import CostRegionDefaultGridRef from '../../../../uapbd/refer/org/CostRegionDefaultGridRef/index';//成本域参照
import LiactCostrgDefaultGridRef from '../../../../uapbd/refer/riaorgbd/LiactCostrgDefaultGridRef/index';//利润中心成本域参照

import '../../../public/uapbdstyle/uapbd_style_common.less'

const {PrintOutput} = high;
import './OrgDoc.less';
const { NCTabs } = base;
const NCTabPane = NCTabs.NCTabPane;
const urls = {
    "fi" : "/nccloud/uapbd/material/queryMaterialFiList.do",
    "pfc" : "/nccloud/uapbd/material/queryMaterialPfcList.do",
    "pu" : "/nccloud/uapbd/material/queryMaterialPuList.do",
    "sale" : "/nccloud/uapbd/material/queryMaterialSaleList.do",
    "stock" : "/nccloud/uapbd/material/queryMaterialStockList.do",
    "plan" : "/nccloud/uapbd/material/queryMaterialPlanList.do",
    "prod" : "/nccloud/uapbd/material/queryMaterialProdList.do",
    "cost" : "/nccloud/uapbd/material/queryMaterialCostList.do",
    "pfccinfo" : "/nccloud/uapbd/material/queryMaterialPfccList.do",
    "querypfc" : '/nccloud/uapbd/material/queryMaterialpfc.do',
    "querysale" : '/nccloud/uapbd/material/queryMaterialsale.do',
    "querystock" : '/nccloud/uapbd/material/queryMaterialstock.do',
    "queryplan" : '/nccloud/uapbd/material/queryMaterialplan.do',
    "querycost" : '/nccloud/uapbd/material/queryMaterialcost.do',
    "querypfccinfo" : '/nccloud/uapbd/material/queryMaterialpfcc.do'
}

const printUrls = {
    fi : "/nccloud/uapbd/material/printMaterialfi.do",
    pfc : "/nccloud/uapbd/material/printMaterialpfc.do",
    pu : "/nccloud/uapbd/material/printMaterialpu.do",
    sale : "/nccloud/uapbd/material/printMaterialsale.do",
    stock : "/nccloud/uapbd/material/printMaterialstock.do",
    plan : "/nccloud/uapbd/material/printMaterialplan.do",
    prod : "/nccloud/uapbd/material/printMaterialprod.do",
    cost : "/nccloud/uapbd/material/printMaterialcost.do",
    pfccinfo : "/nccloud/uapbd/material/printMaterialpfcc.do"
}

const printConfig = {
    fi : {
        funcode : '10140MAQ',
        nodekey : 'materialfilist_ncc'
    },
    pfc : {
        funcode : '10140MAQ',
        nodekey : 'materialpfclist_ncc'
    },
    pu : {
        funcode : '10140MAQ',
        nodekey : 'materialpubrow_ncc'
    },
    sale : {
        funcode : '10140MAQ',
        nodekey : 'materialpulist_ncc'
    },
    stock : {
        funcode : '10140MAQ',
        nodekey : 'materialstocklist_ncc'
    },
    plan : {
        funcode : '10140MAQ',
        nodekey : 'materialplanlist_ncc'
    },
    prod : {
        funcode : '10140MAQ',
        nodekey : 'materialprodlist_ncc'
    },
    cost : {
        funcode : '10140MAQ',
        nodekey : 'materialcostlist_ncc'
    },
    pfccinfo : {
        funcode : '10140MAQ',
        nodekey : 'materialpfcclist_ncc'
    }
}


class OrgDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fi_ref_value : {},
            pfc_ref_value : {},
            pu_ref_value : {},
            sale_ref_value : {},
            stock_ref_value : {},
            plan_ref_value : {},
            cost_ref_value : {},
            pfccinfo_ref_value : {},
            curKey : 'fi',
            oids : [],
            printConfig:{
                funcode:'',
                nodekey : '',
                url : ''
            }
        };
        this.setButtonDisabled(true);
        setTimeout(() => {
            this.clearTable();
        }, 0);
    }

    //this.props.button.setDisabled({
    setButtonDisabled = (disabled) => {
        this.props.button.setDisabled({
            marorg_print : disabled,
            marorg_output : disabled
        });
    }

    clearTable = () => {
        this.props.table.setAllTableData('fi_list',{rows:[],areacode:'fi_list'});
        this.props.table.setAllTableData('pfc_list',{rows:[],areacode:'pfc_list'});
        this.props.editTable.setTableData('materialpfcsub_orgbrowse',{rows:[],areacode:'materialpfcsub'});
        this.props.table.setAllTableData('pu_list',{rows:[],areacode:'pu_list'});
        this.props.table.setAllTableData('sale_list',{rows:[],areacode:'sale_list'});
        this.props.editTable.setTableData('materialbindle_orgbrowse',{rows:[],areacode:'materialbindle'});
        this.props.table.setAllTableData('stock_list',{rows:[],areacode:'stock_list'});
        this.props.editTable.setTableData('materialwarh_orgbrowse',{rows:[],areacode:'materialwarh'});
        this.props.table.setAllTableData('plan_list',{rows:[],areacode:'plan_list'});
        this.props.editTable.setTableData('materialwarh',{rows:[],areacode:'materialwarh'});
        this.props.table.setAllTableData('prod_list',{rows:[],areacode:'prod_list'});
        this.props.editTable.setTableData('materialrepl_orgbrowse',{rows:[],areacode:'materialrepl'});
        this.props.table.setAllTableData('cost_list',{rows:[],areacode:'cost_list'});
        this.props.editTable.setTableData('materialcostmode_orgbrowse',{rows:[],areacode:'materialcostmode'});
        this.props.table.setAllTableData('pfccinfo_list',{rows:[],areacode:'pfccinfo_list'});
        this.props.editTable.setTableData('profitcostlist_orgbrowse',{rows:[],areacode:'profitcostlist'});
    }

    refValueOnChange = {
        fi : (value,callback) => {
            this.setState({fi_ref_value : value});
            //清空表格数据
            this.props.table.setAllTableData('fi_list',{rows:[],areacode:'fi_list'});
            this.setButtonDisabled(true);
            if(value.refpk){
                let pageInfo =this.props.table.getTablePageInfo('fi_list');
                //请求财务信息列表
                ajax({
                    url : urls['fi'],
                    data : {
                        pk : value.refpk,
                        pagecode : this.props.config.pagecodeValues['fi_list'],
                        pageIndex:pageInfo.pageIndex,
                        pageSize:pageInfo.pageSize
                    },
                    success : (res) => {
                        let {success,data} = res;
                        if(data && data.fi_list){
                            this.props.table.setAllTableData('fi_list',data.fi_list);
                            this.setButtonDisabled(false);
                        }else{
                            this.setButtonDisabled(true);
                            this.props.table.setAllTableData('fi_list',{
                                allpks:[],
                                areacode : 'fi_list',
                                rows:[],
                                pageInfo : {
                                    pageIndex : 1,
                                    pageSize : 10
                                }
                            });
                        }
                        callback && callback(data);
                    }
                });
            }
        },
        pfc : (value,callback) => {
            this.setState({pfc_ref_value : value});
            //清空表格数据
            this.props.table.setAllTableData('pfc_list',{rows:[],areacode:'pfc_list'});
            this.props.editTable.setTableData('materialpfcsub_orgbrowse',{rows:[],areacode:'materialpfcsub'});
            this.setButtonDisabled(true);
            if(value.refpk){
                let pageInfo =this.props.table.getTablePageInfo('pfc_list');
                //请求财务信息列表
                ajax({
                    url : urls['pfc'],
                    data : {
                        pk : value.refpk,
                        pagecode : this.props.config.pagecodeValues['pfc_list'],
                        pageIndex:pageInfo.pageIndex,
                        pageSize:pageInfo.pageSize
                    },
                    success : (res) => {
                        let {success,data} = res;
                        if(data && data.pfc_list){
                            this.props.table.setAllTableData('pfc_list',data.pfc_list);
                            this.setButtonDisabled(false);
                        }else{
                            this.setButtonDisabled(true);
                            this.props.table.setAllTableData('pfc_list',{
                                allpks:[],
                                areacode : 'pfc_list',
                                rows:[],
                                pageInfo : {
                                    pageIndex : 1,
                                    pageSize : 10
                                }
                            });
                        }
                        callback && callback(data);
                    }
                });
            }
        },
        pu : (value,callback) => {
            this.setState({pu_ref_value : value});
            //清空表格数据
            this.props.table.setAllTableData('pu_list',{rows:[],areacode:'pu_list'});
            this.setButtonDisabled(true);
            if(value.refpk){
                let pageInfo =this.props.table.getTablePageInfo('pu_list');
                //请求财务信息列表
                ajax({
                    url : urls['pu'],
                    data : {
                        pk : value.refpk,
                        pagecode : this.props.config.pagecodeValues['pu_list'],
                        pageIndex:pageInfo.pageIndex,
                        pageSize:pageInfo.pageSize
                    },
                    success : (res) => {
                        let {success,data} = res;
                        if(data && data.pu_list){
                            this.setButtonDisabled(false);
                            this.props.table.setAllTableData('pu_list',data.pu_list);
                        }else{
                            this.setButtonDisabled(true);
                            this.props.table.setAllTableData('pu_list',{
                                allpks:[],
                                areacode : 'pu_list',
                                rows:[],
                                pageInfo : {
                                    pageIndex : 1,
                                    pageSize : 10
                                }
                            });
                        }
                        callback && callback(data);
                    }
                });
            }
        },
        sale : (value,callback) => {
            this.setState({sale_ref_value : value});
            //清空表格数据
            this.props.table.setAllTableData('sale_list',{rows:[],areacode:'sale_list'});
            this.props.editTable.setTableData('materialbindle_orgbrowse',{rows:[],areacode:'materialbindle'});
            this.setButtonDisabled(true);
            if(value.refpk){
                let pageInfo =this.props.table.getTablePageInfo('sale_list');
                //请求财务信息列表
                ajax({
                    url : urls['sale'],
                    data : {
                        pk : value.refpk,
                        pagecode : this.props.config.pagecodeValues['sale_list'],
                        pageIndex:pageInfo.pageIndex,
                        pageSize:pageInfo.pageSize
                    },
                    success : (res) => {
                        let {success,data} = res;
                        if(data && data.sale_list){
                            this.props.table.setAllTableData('sale_list',data.sale_list);
                            this.setButtonDisabled(false);
                        }else{
                            this.setButtonDisabled(true);
                            this.props.table.setAllTableData('sale_list',{
                                allpks:[],
                                areacode : 'sale_list',
                                rows:[],
                                pageInfo : {
                                    pageIndex : 1,
                                    pageSize : 10
                                }
                            });
                        }
                        callback && callback(data);
                    }
                });
            }
        },
        stock : (value,callback) => {
            this.setState({stock_ref_value : value});
            //清空表格数据
            this.props.table.setAllTableData('stock_list',{rows:[],areacode:'stock_list'});
            this.props.editTable.setTableData('materialwarh_orgbrowse',{rows:[],areacode:'materialwarh'});
            this.setButtonDisabled(true);
            if(value.refpk){
                let pageInfo =this.props.table.getTablePageInfo('stock_list');
                //请求财务信息列表
                ajax({
                    url : urls['stock'],
                    data : {
                        pk : value.refpk,
                        pagecode : this.props.config.pagecodeValues['stock_list'],
                        pageIndex:pageInfo.pageIndex,
                        pageSize:pageInfo.pageSize
                    },
                    success : (res) => {
                        let {success,data} = res;
                        if(data && data.stock_list){
                            this.props.table.setAllTableData('stock_list',data.stock_list);
                            this.setButtonDisabled(false);
                        }else{
                            this.setButtonDisabled(true);
                            this.props.table.setAllTableData('stock_list',{
                                allpks:[],
                                areacode : 'stock_list',
                                rows:[],
                                pageInfo : {
                                    pageIndex : 1,
                                    pageSize : 10
                                }
                            });
                        }
                        callback && callback(data);
                    }
                });
            }
        },
        plan : (value,callback) => {
            this.setState({plan_ref_value : value});
            //清空表格数据
            this.props.table.setAllTableData('plan_list',{rows:[],areacode:'plan_list'});
            this.props.editTable.setTableData('materialwarh',{rows:[],areacode:'materialwarh'});
            this.setButtonDisabled(true);
            if(value.refpk){
                let pageInfo =this.props.table.getTablePageInfo('plan_list');
                //请求财务信息列表
                ajax({
                    url : urls['plan'],
                    data : {
                        pk : value.refpk,
                        pagecode : this.props.config.pagecodeValues['plan_list'],
                        pageIndex:pageInfo.pageIndex,
                        pageSize:pageInfo.pageSize
                    },
                    success : (res) => {
                        let {success,data} = res;
                        if(data && data.plan_list){
                            this.props.table.setAllTableData('plan_list',data.plan_list);
                            this.setButtonDisabled(false);
                        }else{
                            this.setButtonDisabled(true);
                            this.props.table.setAllTableData('plan_list',{
                                allpks:[],
                                areacode : 'plan_list',
                                rows:[],
                                pageInfo : {
                                    pageIndex : 1,
                                    pageSize : 10
                                }
                            });
                        }
                        callback && callback(data);
                    }
                });
            }
        },
        prod : (value,callback) => {
            this.setState({prod_ref_value : value});
            //清空表格数据
            this.props.table.setAllTableData('prod_list',{rows:[],areacode:'prod_list'});
            this.props.editTable.setTableData('materialrepl_orgbrowse',{rows:[],areacode:'materialrepl'});
            this.setButtonDisabled(true);
            if(value.refpk){
                let pageInfo =this.props.table.getTablePageInfo('prod_list');
                //请求财务信息列表
                ajax({
                    url : urls['prod'],
                    data : {
                        pk : value.refpk,
                        pagecode : this.props.config.pagecodeValues['prod_list'],
                        pageIndex:pageInfo.pageIndex,
                        pageSize:pageInfo.pageSize
                    },
                    success : (res) => {
                        let {success,data} = res;
                        if(data && data.prod_list){
                            this.props.table.setAllTableData('prod_list',data.prod_list);
                            this.setButtonDisabled(false);
                            let sum = data.prod_list.rows ? data.prod_list.rows.length : 0;
                        }else{
                            this.setButtonDisabled(true);
                            this.props.table.setAllTableData('prod_list',{
                                allpks:[],
                                areacode : 'prod_list',
                                rows:[],
                                pageInfo : {
                                    pageIndex : 1,
                                    pageSize : 10
                                }
                            });
                        }
                        callback && callback(data);
                    }
                });
            }
        },
        cost : (value,callback) => {
            this.setState({cost_ref_value : value});
            //清空表格数据
            this.props.table.setAllTableData('cost_list',{rows:[],areacode:'cost_list'});
            this.props.editTable.setTableData('materialcostmode_orgbrowse',{rows:[],areacode:'materialcostmode'});
            this.setButtonDisabled(true);
            if(value.refpk){
                let pageInfo =this.props.table.getTablePageInfo('cost_list');
                //请求财务信息列表
                ajax({
                    url : urls['cost'],
                    data : {
                        pk : value.refpk,
                        pagecode : this.props.config.pagecodeValues['cost_list'],
                        pageIndex:pageInfo.pageIndex,
                        pageSize:pageInfo.pageSize
                    },
                    success : (res) => {
                        let {success,data} = res;
                        if(data && data.cost_list){
                            this.props.table.setAllTableData('cost_list',data.cost_list);
                            this.setButtonDisabled(false);
                        }else{
                            this.setButtonDisabled(true);
                            this.props.table.setAllTableData('cost_list',{
                                allpks:[],
                                areacode : 'cost_list',
                                rows:[],
                                pageInfo : {
                                    pageIndex : 1,
                                    pageSize : 10
                                }
                            });
                        }
                        callback && callback(data);
                    }
                });
            }
        },
        pfccinfo : (value,callback) => {
            this.setState({pfccinfo_ref_value : value});
            //清空表格数据
            this.props.table.setAllTableData('pfccinfo_list',{rows:[],areacode:'pfccinfo_list'});
            this.props.editTable.setTableData('profitcostlist_orgbrowse',{rows:[],areacode:'profitcostlist'});
            this.setButtonDisabled(true);
            if(value.refpk){
                let pageInfo =this.props.table.getTablePageInfo('pfccinfo_list');
                //请求财务信息列表
                ajax({
                    url : urls['pfccinfo'],
                    data : {
                        pk : value.refpk,
                        pagecode : this.props.config.pagecodeValues['pfccinfo_list'],
                        pageIndex:pageInfo.pageIndex,
                        pageSize:pageInfo.pageSize
                    },
                    success : (res) => {
                        let {success,data} = res;
                        if(data && data.pfccinfo_list){
                            this.props.table.setAllTableData('pfccinfo_list',data.pfccinfo_list);
                            this.setButtonDisabled(false);
                        }else{
                            this.setButtonDisabled(true);
                            this.props.table.setAllTableData('pfccinfo_list',{
                                allpks:[],
                                areacode : 'pfccinfo_list',
                                rows:[],
                                pageInfo : {
                                    pageIndex : 1,
                                    pageSize : 10
                                }
                            });
                        }
                        callback && callback(data);
                    }
                });
            }
        }
    }

    onRowClick = {
        pfc : (props,moduleId,record,index) => {
            //props, moduleId(区域id), record（行数据）, index（当前index）
            console.log(record);
            let pk = record.values['pk_materialpfc'].value;
            ajax({
                url : urls['querypfc'],
                data : {
                    pk : pk,
                    pageid : props.config.pagecodeValues['pfc']
                },
                success : (res) => {
                    let {success,data} = res;
                    if(data.bodys.materialpfcsub){
                        props.editTable.setTableData('materialpfcsub_orgbrowse',data.bodys.materialpfcsub);
                    }
                }
            });
        },
        sale : (props,moduleId,record,index) => {
            let pk = record.values['pk_materialsale'].value;
            ajax({
                url : urls['querysale'],
                data : {
                    pk : pk,
                    pageid : props.config.pagecodeValues['sale']
                },
                success : (res) => {
                    let {success,data} = res;
                    if(data.bodys.materialbindle){
                        props.editTable.setTableData('materialbindle_orgbrowse',data.bodys.materialbindle);
                    }
                }
            });
        },
        stock : (props,moduleId,record,index) => {
            let pk = record.values['pk_materialstock'].value;
            ajax({
                url : urls['querystock'],
                data : {
                    pk : pk,
                    pageid : props.config.pagecodeValues['stock']
                },
                success : (res) => {
                    let {success,data} = res;
                    if(data.bodys.materialwarh){
                        props.editTable.setTableData('materialwarh_orgbrowse',data.bodys.materialwarh);
                    }
                }
            });
        },
        plan : (props,moduleId,record,index) => {
            let pk = record.values['pk_materialplan'].value;
            ajax({
                url : urls['queryplan'],
                data : {
                    pk : pk,
                    pageid : props.config.pagecodeValues['plan']
                },
                success : (res) => {
                    let {success,data} = res;
                    if(data.bodys.materialrepl){
                        props.editTable.setTableData('materialrepl_orgbrowse',data.bodys.materialrepl);
                    }
                }
            });
        },
        cost : (props,moduleId,record,index) => {
            let pk = record.values['pk_materialcost'].value;
            ajax({
                url : urls['querycost'],
                data : {
                    pk : pk,
                    pageid : props.config.pagecodeValues['cost']
                },
                success : (res) => {
                    let {success,data} = res;
                    if(data.bodys.materialcostmode){
                        props.editTable.setTableData('materialcostmode_orgbrowse',data.bodys.materialcostmode);
                    }
                }
            });
        },
        pfccinfo : (props,moduleId,record,index) => {
            let pk = record.values['pk_mateprofcost'].value;
            ajax({
                url : urls['querypfccinfo'],
                data : {
                    pk : pk,
                    pageid : props.config.pagecodeValues['pfccinfo']
                },
                success : (res) => {
                    let {success,data} = res;
                    if(data.bodys.profitcostlist){
                        props.editTable.setTableData('profitcostlist_orgbrowse',data.bodys.profitcostlist);
                    }
                }
            });
        }
    }

    onChange = (key) => {
        this.setState({curKey : key});
        setTimeout(() => {
            let tableData = this.props.table.getAllTableData(key+'_list');
            if(tableData && tableData.rows && tableData.rows.length > 0){
                this.setButtonDisabled(false);
            }else{
                this.setButtonDisabled(true);
            }
        }, 0);
    }

    refresh = () => {
        switch(this.state.curKey){
            case 'fi':
                this.refValueOnChange.fi(this.state.fi_ref_value,(data)=>{
                    toast({color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147')/* 国际化处理： 刷新成功！*/});
                });
                break;
            case 'pfc':
                this.refValueOnChange.pfc(this.state.pfc_ref_value,(data)=>{
                    toast({color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147')/* 国际化处理： 刷新成功！*/});
                });
                break;
            case 'pu':
                this.refValueOnChange.pu(this.state.pu_ref_value,(data)=>{
                    toast({color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147')/* 国际化处理： 刷新成功！*/});
                });
                break;
            case 'sale':
                this.refValueOnChange.sale(this.state.sale_ref_value,(data)=>{
                    toast({color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147')/* 国际化处理： 刷新成功！*/});
                });
                break;
            case 'stock':
                this.refValueOnChange.stock(this.state.stock_ref_value,(data)=>{
                    toast({color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147')/* 国际化处理： 刷新成功！*/});
                });
                break;
            case 'plan':
                this.refValueOnChange.plan(this.state.plan_ref_value,(data)=>{
                    toast({color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147')/* 国际化处理： 刷新成功！*/});
                });
                break;
            case 'prod':
                this.refValueOnChange.prod(this.state.prod_ref_value,(data)=>{
                    toast({color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147')/* 国际化处理： 刷新成功！*/});
                });
                break;
            case 'cost':
                this.refValueOnChange.cost(this.state.cost_ref_value,(data)=>{
                    toast({color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147')/* 国际化处理： 刷新成功！*/});
                });
                break;
            case 'pfccinfo':
                this.refValueOnChange.pfccinfo(this.state.pfccinfo_ref_value,(data)=>{
                    toast({color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147')/* 国际化处理： 刷新成功！*/});
                });
                break;
        }
    }

    getOids = (tableid,key) => {
        let array = [];
        let tableData = this.props.table.getAllTableData(tableid);
        tableData.rows.forEach(element => {
            array.push(element.values[key].value);
        });
        return array;
    }

    printTable = () => {
        switch(this.state.curKey){
            case 'fi':
                print('pdf',
                printUrls['fi'],
                {
                    appcode : this.props.config.appcode,
                    funcode : printConfig.fi.funcode,
                    nodekey : printConfig.fi.nodekey,
                    oids : this.getOids('fi_list','pk_materialfi')
                });
                break;
            case 'pfc':
                print('pdf',
                printUrls['pfc'],
                {
                    appcode : this.props.config.appcode,
                    funcode : printConfig.pfc.funcode,
                    nodekey : printConfig.pfc.nodekey,
                    oids : this.getOids('pfc_list','pk_materialpfc')
                });
                break;
            case 'pu':
                print('pdf',
                printUrls['pu'],
                {
                    appcode : this.props.config.appcode,
                    funcode : printConfig.pu.funcode,
                    nodekey : printConfig.pu.nodekey,
                    oids : this.getOids('pu_list','pk_materialpu')
                });
                break;
            case 'sale':
                print('pdf',
                printUrls['sale'],
                {
                    appcode : this.props.config.appcode,
                    funcode : printConfig.sale.funcode,
                    nodekey : printConfig.sale.nodekey,
                    oids : this.getOids('sale_list','pk_materialsale')
                });
                break;
            case 'stock':
                print('pdf',
                printUrls['stock'],
                {
                    appcode : this.props.config.appcode,
                    funcode : printConfig.stock.funcode,
                    nodekey : printConfig.stock.nodekey,
                    oids : this.getOids('stock_list','pk_materialstock')
                });
                break;
            case 'plan':
                print('pdf',
                printUrls['plan'],
                {
                    appcode : this.props.config.appcode,
                    funcode : printConfig.plan.funcode,
                    nodekey : printConfig.plan.nodekey,
                    oids : this.getOids('plan_list','pk_materialplan')
                });
                break;
            case 'prod':
                print('pdf',
                printUrls['prod'],
                {
                    appcode : this.props.config.appcode,
                    funcode : printConfig.prod.funcode,
                    nodekey : printConfig.prod.nodekey,
                    oids : this.getOids('prod_list','pk_materialprod')
                });
                break;
            case 'cost':
                print('pdf',
                printUrls['cost'],
                {
                    appcode : this.props.config.appcode,
                    funcode : printConfig.cost.funcode,
                    nodekey : printConfig.cost.nodekey,
                    oids : this.getOids('cost_list','pk_materialcost')
                });
                break;
            case 'pfccinfo':
                print('pdf',
                printUrls['pfccinfo'],
                {
                    appcode : this.props.config.appcode,
                    funcode : printConfig.pfccinfo.funcode,
                    nodekey : printConfig.pfccinfo.nodekey,
                    oids : this.getOids('pfccinfo_list','pk_mateprofcost')
                });
                break;
        }
    }

    printout = () => {
        switch(this.state.curKey){
            case 'fi':
                this.state.printConfig.url = printUrls['fi'];
                this.state.printConfig.funcode = printConfig.fi.funcode;
                this.state.printConfig.nodekey = printConfig.fi.nodekey;
                this.state.oids = this.getOids('fi_list','pk_materialfi');
                this.setState(this.state,
                this.refs.printOutput.open());
                break;
            case 'pfc':
                this.state.printConfig.url = printUrls['pfc'];
                this.state.printConfig.funcode = printConfig.pfc.funcode;
                this.state.printConfig.nodekey = printConfig.pfc.nodekey;
                this.state.oids = this.getOids('pfc_list','pk_materialpfc');
                this.setState(this.state,
                this.refs.printOutput.open());
                break;
            case 'pu':
                this.state.printConfig.url = printUrls['pu'];
                this.state.printConfig.funcode = printConfig.pu.funcode;
                this.state.printConfig.nodekey = printConfig.pu.nodekey;
                this.state.oids = this.getOids('pu_list','pk_materialpu');
                this.setState(this.state,
                this.refs.printOutput.open());
                break;
            case 'sale':
                this.state.printConfig.url = printUrls['sale'];
                this.state.printConfig.funcode = printConfig.sale.funcode;
                this.state.printConfig.nodekey = printConfig.sale.nodekey;
                this.state.oids = this.getOids('sale_list','pk_materialsale');
                this.setState(this.state,
                this.refs.printOutput.open());
                break;
            case 'stock':
                this.state.printConfig.url = printUrls['stock'];
                this.state.printConfig.funcode = printConfig.stock.funcode;
                this.state.printConfig.nodekey = printConfig.stock.nodekey;
                this.state.oids = this.getOids('stock_list','pk_materialstock');
                this.setState(this.state,
                this.refs.printOutput.open());
                break;
            case 'plan':
                this.state.printConfig.url = printUrls['plan'];
                this.state.printConfig.funcode = printConfig.plan.funcode;
                this.state.printConfig.nodekey = printConfig.plan.nodekey;
                this.state.oids = this.getOids('plan_list','pk_materialplan');
                this.setState(this.state,
                this.refs.printOutput.open());
                break;
            case 'prod':
                this.state.printConfig.url = printUrls['prod'];
                this.state.printConfig.funcode = printConfig.prod.funcode;
                this.state.printConfig.nodekey = printConfig.prod.nodekey;
                this.state.oids = this.getOids('prod_list','pk_materialprod');
                this.setState(this.state,
                this.refs.printOutput.open());
                break;
            case 'cost':
                this.state.printConfig.url = printUrls['cost'];
                this.state.printConfig.funcode = printConfig.cost.funcode;
                this.state.printConfig.nodekey = printConfig.cost.nodekey;
                this.state.oids = this.getOids('cost_list','pk_materialcost');
                this.setState(this.state,
                this.refs.printOutput.open());
                break;
            case 'pfccinfo':
                this.state.printConfig.url = printUrls['pfccinfo'];
                this.state.printConfig.funcode = printConfig.pfccinfo.funcode;
                this.state.printConfig.nodekey = printConfig.pfccinfo.nodekey;
                this.state.oids = this.getOids('pfccinfo_list','pk_mateprofcost');
                this.setState(this.state,
                this.refs.printOutput.open());
                break;
        }
    }

    onButtonClick = (props,id) => {
        switch(id){
            case 'marorg_print':
                this.printTable();
                break;
            case 'marorg_output':
                this.printout()
                break;
            case 'marorg_refresh':
                this.refresh();
                break;
        }
    }

    render() {
        let {editTable,table} = this.props;
        let { createEditTable } = editTable;
        let {createSimpleTable} = table;
        return (
            <div style={{maxHeight:'500px'}}>
                <div className="marorg-button-area">
                    <div style={{height: 30}}>
                        <div className="uapbd_style_center_container">
                            <div className="uapbd_style_center_right20" style={{right: 0}}>
                                {this.props.button.createButtonApp({
                                    area: 'marorg',
                                    buttonLimit: 3, 
                                    onButtonClick: this.onButtonClick.bind(this), 
                                    popContainer: document.querySelector('.marorg-button-area')
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <NCTabs navtype="turn" tabBarPosition={'top'} contenttype="moveleft" defaultActiveKey="fi" onChange={this.onChange}>
                    <NCTabPane tab={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000093')/* 国际化处理： 财务组织*/} key="fi">
                        <div className="orgbrowse">
                            <div className="refclass-line">
                                <div className="refclass">
                                    {FinanceOrgTreeRef({
                                        isShowUnit : false,
                                        isShowDisabledData : false,
                                        onChange : (value)=>{this.refValueOnChange.fi(value,(data)=>{
                                            let sum = data && data.fi_list && data.fi_list.allpks ? data.fi_list.allpks.length : 0;
                                            if(sum === 0){
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000062')/* 国际化处理： 未查询到符合条件的数据！*/,color:'warning',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000063')/* 国际化处理： 请注意！*/});
                                            }else{
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000064',{sum:sum})/* 国际化处理： 查询成功，共{sum}条数据!*/,color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000066')/* 国际化处理： 已成功！*/});
                                            }
                                        })},
                                        value : this.state.fi_ref_value,
                                        queryCondition :{
                                            AppCode : '10140MAO',
                                            orgType : 'FINANCEORGTYPE000000',
                                            TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }
                                    })}
                                </div>
                            </div>
                            <div className="table-top">
                                {createSimpleTable('fi_list', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false,
                                    onRowClick:()=>{},
                                    handlePageInfoChange:this.refresh
                                })}
                            </div>
                            <div className="table-bottom"></div>
                        </div>
                    </NCTabPane>
                    <NCTabPane tab={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000094')/* 国际化处理： 利润中心信息*/} key="pfc">
                        <div className="orgbrowse">
                            <div className="refclass-line">
                                <div className="refclass">
                                    {LiabilityCenterOrgTreeRef({
                                        onChange : (value)=>{this.refValueOnChange.pfc(value,(data)=>{
                                            let sum = data && data.pfc_list && data.pfc_list.allpks ? data.pfc_list.allpks.length : 0;
                                            if(sum === 0){
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000062')/* 国际化处理： 未查询到符合条件的数据！*/,color:'warning',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000063')/* 国际化处理： 请注意！*/});
                                            }else{
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000064',{sum:sum})/* 国际化处理： 查询成功，共{sum}条数据!*/,color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000066')/* 国际化处理： 已成功！*/});
                                            }
                                        })},
                                        value : this.state.pfc_ref_value,
                                        queryCondition :{
                                            AppCode : '10140MAO',
                                            orgType : 'LIACENTERTYPE0000000',
                                            TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }
                                    })}
                                </div>
                            </div>
                            <div className="table-top">
                                {createSimpleTable('pfc_list', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false,
                                    onRowClick:this.onRowClick.pfc,
                                    handlePageInfoChange:this.refresh
                                })}
                            </div>
                            <div className="table-bottom">
                                {createEditTable('materialpfcsub_orgbrowse', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false
                                })}
                            </div>
                        </div>
                    </NCTabPane>
                    <NCTabPane tab={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000095')/* 国际化处理： 采购信息*/} key="pu">
                        <div className="orgbrowse">
                            <div className="refclass-line">
                                <div className="refclass">
                                    {PurchaseOrgGridRef({
                                        isShowDisabledData : false,
                                        onChange : (value)=>{this.refValueOnChange.pu(value,(data)=>{
                                            let sum = data && data.pu_list && data.pu_list.allpks ? data.pu_list.allpks.length : 0;
                                            if(sum === 0){
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000062')/* 国际化处理： 未查询到符合条件的数据！*/,color:'warning',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000063')/* 国际化处理： 请注意！*/});
                                            }else{
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000064',{sum:sum})/* 国际化处理： 查询成功，共{sum}条数据!*/,color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000066')/* 国际化处理： 已成功！*/});
                                            }
                                        })},
                                        value : this.state.pu_ref_value,
                                        queryCondition :{
                                            AppCode : '10140MAO',
                                            orgType : 'PURCHASEORGTYPE00000',
                                            GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }
                                    })}
                                </div>
                            </div>
                            <div className="table-top">
                                {createSimpleTable('pu_list', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false,
                                    handlePageInfoChange:this.refresh
                                })}
                            </div>
                            <div className="table-bottom"></div>
                        </div>
                    </NCTabPane>
                    <NCTabPane tab={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000096')/* 国际化处理： 销售信息*/} key="sale">
                        <div className="orgbrowse">
                            <div className="refclass-line">
                                <div className="refclass">
                                    {SaleOrgTreeRef({
                                        onChange : (value)=>{this.refValueOnChange.sale(value,(data)=>{
                                            let sum = data && data.sale_list && data.sale_list.allpks ? data.sale_list.allpks.length : 0;
                                            if(sum === 0){
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000062')/* 国际化处理： 未查询到符合条件的数据！*/,color:'warning',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000063')/* 国际化处理： 请注意！*/});
                                            }else{
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000064',{sum:sum})/* 国际化处理： 查询成功，共{sum}条数据!*/,color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000066')/* 国际化处理： 已成功！*/});
                                            }
                                        })},
                                        value : this.state.sale_ref_value,
                                        queryCondition :{
                                            AppCode : '10140MAO',
                                            orgType : 'SALEORGTYPE000000000',
                                            TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }
                                    })}
                                </div>
                            </div>
                            <div className="table-top">
                                {createSimpleTable('sale_list', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false,
                                    onRowClick:this.onRowClick.sale,
                                    handlePageInfoChange:this.refresh
                                })}
                            </div>
                            <div className="table-bottom">
                                {createEditTable('materialbindle_orgbrowse', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false
                                })}
                            </div>
                        </div>  
                    </NCTabPane>
                    <NCTabPane tab={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000097')/* 国际化处理： 库存信息*/} key="stock">
                        <div className="orgbrowse">
                            <div className="refclass-line">
                                <div className="refclass">
                                    {StockOrgGridRef({
                                        onChange : (value)=>{this.refValueOnChange.stock(value,(data)=>{
                                            let sum = data && data.stock_list && data.stock_list.allpks ? data.stock_list.allpks.length : 0;
                                            if(sum === 0){
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000062')/* 国际化处理： 未查询到符合条件的数据！*/,color:'warning',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000063')/* 国际化处理： 请注意！*/});
                                            }else{
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000064',{sum:sum})/* 国际化处理： 查询成功，共{sum}条数据!*/,color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000066')/* 国际化处理： 已成功！*/});
                                            }
                                        })},
                                        value : this.state.stock_ref_value,
                                        queryCondition :{
                                            AppCode : '10140MAO',
                                            orgType : 'STOCKORGTYPE00000000',
                                            GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }
                                    })}
                                </div>
                            </div>
                            <div className="table-top">
                                {createSimpleTable('stock_list', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false,
                                    onRowClick:this.onRowClick.stock,
                                    handlePageInfoChange:this.refresh
                                })}
                            </div>
                            <div className="table-bottom">
                                {createEditTable('materialwarh_orgbrowse', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false
                                })}
                            </div>
                        </div>
                    </NCTabPane>
                    <NCTabPane tab={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000098')/* 国际化处理： 计划信息*/} key="plan">
                        <div className="orgbrowse">
                            <div className="refclass-line">
                                <div className="refclass">
                                    {StockPlanGridRef({/** 此处nc端用的是库存组织的参照，不知道为什么，这里和nc端一致了，也改成库存组织了 */
                                        //refName : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000151')/* 国际化处理： 库存/计划*/,
                                        //placeholder : this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000151')/* 国际化处理： 库存/计划*/,
                                        onChange : (value)=>{this.refValueOnChange.plan(value,(data)=>{
                                            let sum = data && data.plan_list && data.plan_list.allpks ? data.plan_list.allpks.length : 0;
                                            if(sum === 0){
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000062')/* 国际化处理： 未查询到符合条件的数据！*/,color:'warning',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000063')/* 国际化处理： 请注意！*/});
                                            }else{
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000064',{sum:sum})/* 国际化处理： 查询成功，共{sum}条数据!*/,color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000066')/* 国际化处理： 已成功！*/});
                                            }
                                        })},
                                        value : this.state.plan_ref_value,
                                        queryCondition :{
                                            AppCode : '10140MAO',
                                            orgType : 'STOCKPLANTYPE0000000',
                                            GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }
                                    })}
                                </div>
                            </div>
                            <div className="table-top">
                                {createSimpleTable('plan_list', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false,
                                    onRowClick:this.onRowClick.plan,
                                    handlePageInfoChange:this.refresh
                                })}
                            </div>
                            <div className="table-bottom">
                                {createEditTable('materialrepl_orgbrowse', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false
                                })}
                            </div>
                        </div>
                    </NCTabPane>
                    <NCTabPane tab={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000099')/* 国际化处理： 生产信息*/} key="prod">
                        <div className="orgbrowse">
                            <div className="refclass-line">
                                <div className="refclass">
                                    {FactoryGridRef({
                                        onChange : (value)=>{this.refValueOnChange.prod(value,(data)=>{
                                            let sum = data && data.prod_list && data.prod_list.allpks ? data.prod_list.allpks.length : 0;
                                            if(sum === 0){
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000062')/* 国际化处理： 未查询到符合条件的数据！*/,color:'warning',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000063')/* 国际化处理： 请注意！*/});
                                            }else{
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000064',{sum:sum})/* 国际化处理： 查询成功，共{sum}条数据!*/,color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000066')/* 国际化处理： 已成功！*/});
                                            }
                                        })},
                                        value : this.state.prod_ref_value,
                                        queryCondition :{
                                            AppCode : '10140MAO',
                                            orgType : 'FACTORYTYPE000000000',
                                            GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }
                                    })}
                                </div>
                            </div>
                            <div className="table-top">
                                {createSimpleTable('prod_list', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false,
                                    handlePageInfoChange:this.refresh
                                })}
                            </div>
                            <div className="table-bottom">
                            </div>
                        </div>
                    </NCTabPane>
                    <NCTabPane tab={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000100')/* 国际化处理： 成本信息*/} key="cost">
                        <div className="orgbrowse">
                            <div className="refclass-line">
                                <div className="refclass">
                                    {CostRegionDefaultGridRef({
                                        onChange : (value)=>{this.refValueOnChange.cost(value,(data)=>{
                                            let sum = data && data.cost_list && data.cost_list.allpks ? data.cost_list.allpks.length : 0;
                                            if(sum === 0){
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000062')/* 国际化处理： 未查询到符合条件的数据！*/,color:'warning',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000063')/* 国际化处理： 请注意！*/});
                                            }else{
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000064',{sum:sum})/* 国际化处理： 查询成功，共{sum}条数据!*/,color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000066')/* 国际化处理： 已成功！*/});
                                            }
                                        })},
                                        value : this.state.cost_ref_value,
                                        queryCondition :{
                                            AppCode : '10140MAO',
                                            orgType : 'COSTREGION0000000000',
                                            GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }
                                    })}
                                </div>
                            </div>
                            <div className="table-top">
                                {createSimpleTable('cost_list', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false,
                                    onRowClick:this.onRowClick.cost,
                                    handlePageInfoChange:this.refresh
                                })}
                            </div>
                            <div className="table-bottom">
                                {createEditTable('materialcostmode_orgbrowse', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false
                                })}
                            </div>
                        </div>
                    </NCTabPane>
                    <NCTabPane tab={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000101')/* 国际化处理： 利润中心成本*/} key="pfccinfo">
                        <div className="orgbrowse">
                            <div className="refclass-line">
                                <div className="refclass">
                                    {LiactCostrgDefaultGridRef({
                                        onChange : (value)=>{this.refValueOnChange.pfccinfo(value,(data)=>{
                                            let sum = data && data.pfccinfo_list && data.pfccinfo_list.allpks ? data.pfccinfo_list.allpks.length : 0;
                                            if(sum === 0){
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000062')/* 国际化处理： 未查询到符合条件的数据！*/,color:'warning',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000063')/* 国际化处理： 请注意！*/});
                                            }else{
                                                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000064',{sum:sum})/* 国际化处理： 查询成功，共{sum}条数据!*/,color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000066')/* 国际化处理： 已成功！*/});
                                            }
                                        })},
                                        value : this.state.pfccinfo_ref_value,
                                        queryCondition :{
                                            AppCode : '10140MAO',
                                            orgType : 'LIACTCOSTRG000000000',
                                            GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }
                                    })}
                                </div>
                            </div>
                            <div className="table-top">
                                {createSimpleTable('pfccinfo_list', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false,
                                    onRowClick:this.onRowClick.pfccinfo,
                                    handlePageInfoChange:this.refresh
                                })}
                            </div>
                            <div className="table-bottom">
                                {createEditTable('profitcostlist_orgbrowse', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false
                                })}
                            </div>
                        </div>
                    </NCTabPane>
                </NCTabs>
                <PrintOutput
                    ref='printOutput'
                    url={this.state.printConfig.url}
                    data={{
                        appcode : this.props.config.appcode,
						funcode : this.state.printConfig.funcode,
						nodekey : this.state.printConfig.nodekey,
						oids : this.state.oids,
						outputType : 'output'
					}}
                />

            </div>
        );
    }
}

export default OrgDoc;


//Aspa4GogLk8Lhb48aTpvptZ/ONgg3Q8/tTcqrBzNS/Iko63kPYhDhxFBhnnY6vfX