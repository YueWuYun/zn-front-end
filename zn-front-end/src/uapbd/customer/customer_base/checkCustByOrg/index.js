//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import {ajax, base, toast,print,output } from 'nc-lightapp-front';
const {NCTabs} = base;
const NCTabPane = NCTabs.NCTabPane;
import {handlePageInfoChange} from './evetns/index';
import CreditCtrl from "../../../refer/org/CreditCtlRegionGridRef";
import financeOrg from "../../../refer/org/FinanceOrgTreeRef";
import saleOrg from "../../../refer/org/SaleOrgTreeRef";
import Utils from '../../../public/utils/index';
const {queryToastFunc} = Utils;
export  default  class CheckCustByOrg extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectOrg:{
                financeOrg:'',//财务组织
                saleOrg:'',//销售组织
                CreditCtrl:''//信用控制域
            },
            currentTab:'',
            currentGridId:'cust_financeOrg_simple',
            curentPk:'pk_customer',
            curentPrinTemp:'baselist',
            curentPrintUrl:'/nccloud/uapbd/customer/mainPrint.do',
            json:props.json
        }
    }
    componentDidMount(){
        this.props.button.setButtonDisabled(['btnModalPrint','modalOutp'],true);
    }
    componentWillReceiveProps(nextProps){
        if(Object.keys(nextProps.json).length !== 0 ){
            this.setState({
                json:nextProps.json
            })
        }
    }
    modalButtonClick =(props,id)=>{
        let currentGridId = this.state.currentGridId;
        let pks=[];
        switch (id) {
            case 'btnModalRefrensh':
                //刷新
                if(this.state.currentTab!=''){
                    this.loadModalSubGrid(this.state.currentTab,()=>{
                        toast({
                            color: 'success',
                            title: this.state.json['10140CUST-000066']/* 国际化处理： 刷新成功！*/
                        });
                    });
                }else{
                    toast({
                        color: 'success',
                        title: this.state.json['10140CUST-000066']/* 国际化处理： 刷新成功！*/
                    });
                }
                break;
            case'btnModalPrint':
                let alldataP = props.table.getAllTableData(currentGridId);
                if(alldataP.rows.length===0){
                    toast({'color':'info','content':this.state.json['10140CUST-000029']});/* 国际化处理： 请查询打印数据！*/
                    return;
                }
                alldataP.rows.forEach((item,index) => {
                    pks.push(item.values[this.state.curentPk]['value']);
                });
                print(
                    'pdf',
                    this.state.curentPrintUrl,
                    {
                        funcode: '10140CUB',      //功能节点编码，即模板编码
                        nodekey:this.state.curentPrinTemp,    //模板节点标识
                        oids: pks,
                        appcode:'10140CUB'
                    }
                );
                break;
            case'modalOutp':
                let alldataO = props.table.getAllTableData(currentGridId);
                if(alldataO.rows.length===0){
                    toast({'color':'info','content':this.state.json['10140CUST-000029']});/* 国际化处理： 请查询打印数据！*/
                    return;
                }
                alldataO.rows.forEach((item,index) => {
                    pks.push(item.values[this.state.curentPk]['value']);
                });
                output({
                    url:this.state.curentPrintUrl,
                    data:{
                        funcode: '10140CUB',  //全局集团组织打印模板相同    //功能节点编码，即模板编码
                        outputType:'output',
                        nodekey:this.state.curentPrinTemp,
                        oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                    }
                });
                break;
            default:
                break;
        }
    }
    loadModalSubGrid = (param,callback)=>{
        let subGridId,pk,requestParam,pks;
        if(param instanceof Object) {
            subGridId = param.moduleId;
            pks = param.pks;
            requestParam = {
                subGridId:subGridId,
                pks:pks,
                actionName:'loadSubGrid',
                pagecode:this.props.config.pagecode,
                queryType:'pageQuery'
            }
        }else{
            if(param ==='financeOrg'){
                subGridId = 'cust_finance_simple';
                pk = this.state.selectOrg.financeOrg.refpk;


            }else if(param === 'saleOrg'){
                subGridId = 'cust_sale_simple';
                pk = this.state.selectOrg.saleOrg.refpk;

            }else{
                subGridId = 'cust_creditctl_simple';
                pk = this.state.selectOrg.CreditCtrl.refpk;
            }
            let pageInfo =  this.props.table.getTablePageInfo(subGridId);
            requestParam ={
                subGridId:subGridId,
                pk:pk,
                actionName:'loadSubGrid',
                pagecode:this.props.config.pagecode,
                pageInfo:pageInfo,
                queryType:'normalQuery'
            }
        }
        ajax({
            url:'/nccloud/uapbd/customer/querySubGrid.do',
            data:requestParam,
            success:(res)=>{
                let{success,data} =res;
                if(success){
                    if(data){
                        if(data.hasOwnProperty('message')&&data.message){
                            //请求成功，但是有异常信息
                            toast({'color':'success','content':data.message});

                        }else{
                            if(data[subGridId]){
                                this.props.table.setAllTableData(subGridId,data[subGridId]);
                                callback && callback.call(this,data[subGridId]['allpks']);
                                this.props.button.setButtonDisabled(['btnModalPrint','modalOutp'],false);
                            }else{
                                let nulldata = {
                                    rows:[]
                                }
                                this.props.table.setAllTableData(subGridId,nulldata);
                                callback && callback.call(this,[])
                                this.props.button.setButtonDisabled(['btnModalPrint','modalOutp'],true);
                            }

                        }
                    }else{
                        let nulldata = {
                            rows:[]
                        }
                        this.props.table.setAllTableData(subGridId,nulldata);
                        callback && callback.call(this,[])
                    }
                }
            }
        });
    }

    render(){
        const {table,button} = this.props;
        const{ createSimpleTable} =table;
        const { createButtonApp } = button;
        return(
            <div className="header-title-search-area">
                <div style={{overflow: 'hidden'}}>
                    <div style={{float:'right'}}>
                        {/* 按钮区  btn-group */}
                        <div className="header-button-area" >
                            {createButtonApp({
                                area: 'modal-button-area',
                                onButtonClick:this.modalButtonClick,
                                popContainer: document.querySelector('.header-button-area')
                            })}
                        </div>
                    </div>
                </div>
                {/* 列表区 */}
                <NCTabs navtype="turn" contenttype="moveleft" defaultActiveKey="1">
                    <NCTabPane tab={this.state.json['10140CUST-000030']} key="1">{/* 国际化处理： 财务信息*/}
                        <div className="nc-singleTable-table-area">
                            <div className="title-search-detail-ref" style={{width: '200px',margin:'5px 0px'}}>
                                {financeOrg({
                                    onChange: (val) => {
                                        this.state.selectOrg.financeOrg = val;
                                        this.state.currentGridId ='cust_finance_simple';
                                        this.state.currentTab = 'financeOrg';
                                        this.state.curentPk = 'pk_customer';
                                        this.state.curentPrinTemp = 'baselist';
                                        this.state.curentPrintUrl = '/nccloud/uapbd/customer/mainPrint.do';
                                        this.setState(this.state, () => {
                                            this.loadModalSubGrid('financeOrg');
                                        });
                                    },
                                    value:this.state.selectOrg.financeOrg,
                                    fieldid:"financeorg",
                                    queryCondition: () => {
                                        return   {
                                            AppCode : this.props.config.appcode,
                                            orgType : 'FINANCEORGTYPE000000',
                                            TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }
                                    }
                                })}
                            </div>
                            <div className="nc-singleTable-table-area" >
                                {createSimpleTable(this.props.config.subGrid4_simple, {
                                    handlePageInfoChange:handlePageInfoChange.bind(this,this.props.config.subGrid4_simple),
                                    showIndex:true
                                })}
                            </div>
                        </div>
                    </NCTabPane>
                    <NCTabPane tab={this.state.json['10140CUST-000031']} key="2">{/* 国际化处理： 销售信息*/}
                        <div className="nc-singleTable-table-area">
                            <div className="title-search-detail ref" style={{width: '200px', margin:'5px 0px'}}>
                                {saleOrg({
                                    onChange: (val)=>{
                                        this.state.selectOrg.saleOrg = val;
                                        this.state.currentGridId ='cust_sale_simple';
                                        this.state.currentTab = 'saleOrg';
                                        this.state.curentPk = 'pk_customer';
                                        this.state.curentPrinTemp='baselist';
                                        this.state.curentPrintUrl = '/nccloud/uapbd/customer/mainPrint.do';
                                        this.setState(this.state, () => {
                                            this.loadModalSubGrid('saleOrg');
                                        });
                                    },
                                    value:this.state.selectOrg.saleOrg,
                                    fieldid:"saleorg",
                                    queryCondition: () => {
                                        return {
                                            AppCode : this.props.config.appcode,
                                            orgType : 'SALEORGTYPE000000000',
                                            TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }
                                    }
                                })}
                            </div>
                            <div className="nc-singleTable-table-area" >
                                {createSimpleTable(this.props.config.subGrid5_simple, {
                                    handlePageInfoChange:handlePageInfoChange.bind(this,this.props.config.subGrid5_simple),
                                    showIndex:true
                                })}
                            </div>
                        </div>
                    </NCTabPane>
                    <NCTabPane tab={this.state.json['10140CUST-000032']} key="3">{/* 国际化处理： 信用控制信息*/}
                        <div className="nc-singleTable-table-area">
                            <div className="title-search-detail ref" style={{width: '200px', margin:'5px 0px'}}>
                                {CreditCtrl({
                                    onChange: (val)=>{
                                        this.state.selectOrg.CreditCtrl = val;
                                        this.state.currentGridId ='cust_creditctl_simple';
                                        this.state.currentTab = 'CreditCtrl';
                                        this.state.curentPk = 'pk_customer';
                                        this.state.curentPrinTemp='baselist';
                                        this.state.curentPrintUrl = '/nccloud/uapbd/customer/mainPrint.do';
                                        this.setState(this.state, () => {
                                            this.loadModalSubGrid('CreditCtrl');
                                        });
                                    },
                                    value:this.state.selectOrg.CreditCtrl,
                                    fieldid:"creditctrl",
                                    queryCondition :{
                                        AppCode : this.props.config.appcode,
                                        orgType : 'CREDITCTLREGION00000',
                                        GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                    }
                                })}
                            </div>
                            <div className="nc-singleTable-table-area">
                                {createSimpleTable(this.props.config.subGrid6_simple, {
                                    handlePageInfoChange:handlePageInfoChange.bind(this,this.props.config.subGrid6_simple),
                                    showIndex:true
                                })}
                            </div>
                        </div>
                    </NCTabPane>
                </NCTabs>
            </div>
        )}
    }

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65