//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Orgunitcard from '../../orgunit/card';


/**
 * author wanglqh
 *
 */
export default class Orgcard extends Component {
    constructor(props){
        super(props);
    }
    render(){
        let config = {
            pageTitle:'业务单元',
            subTableTitle:'',
            json:{},
            NODE_TYPE:'GROUP_NODE',
            listpagecode:'10100ORG_orgunit',
            pagecode:'10100ORG_orgunitcard',
            appcode:'10100ORG',
            datasource : 'uapbd.org.orgunit.orgunit',
            appid:'0001Z010000000001NOH',
            searchId:'10100ORGSEARCH',
            formId:'org',
            orgtypearr:[{subGrid:'corp',subName:'法人公司',isshow:false,pk_orgtype :''},{subGrid:'hrorg',subName:'人力资源',isshow:false,pk_orgtype :''},{subGrid:'financeorg',subName:'财务组织',isshow:false,pk_orgtype :''},
                 {subGrid:'fundorg',subName:'资金',isshow:false,pk_orgtype :''},{subGrid:'purchaseorg',subName:'采购',isshow:false,pk_orgtype :''},{subGrid:'saleorg',subName:'销售',isshow:false,pk_orgtype :''},
                 {subGrid:'stockorg',subName:'库存',isshow:false,pk_orgtype :''},{subGrid:'trafficorg',subName:'物流',isshow:false,pk_orgtype :''},{subGrid:'qccenter',subName:'质检',isshow:false,pk_orgtype :''},
                 {subGrid:'assetorg',subName:'资产',isshow:false,pk_orgtype :''},{subGrid:'maintainorg',subName:'维修',isshow:false,pk_orgtype :''},{subGrid:'liabilitycenter',subName:'利润中心',isshow:false,pk_orgtype :''},
                 {subGrid:'itemorg',subName:'项目',isshow:false,pk_orgtype :''},{subGrid:'itemstockrelation',subName:'项目库存业务委托关系',isshow:false,pk_orgtype :''},{subGrid:'planbudget',subName:'预算',isshow:false,pk_orgtype :''},{subGrid:'adminorg',subName:'行政',isshow:false,pk_orgtype :''},
                 {subGrid:'factory',subName:'工厂',isshow:false,pk_orgtype :''},{subGrid:'plancenter',subName:'计划中心',isshow:false,pk_orgtype :''},{subGrid:'stocktrafficrelation',subName:'物流业务委托关系',isshow:false,pk_orgtype :''},
                 {subGrid:'stockqccenterrelation',subName:'质检业务委托关系',isshow:false,pk_orgtype :''},{subGrid:'stockorgrelation',subName:'采购业务委托关系',isshow:false,pk_orgtype :''},{subGrid:'stockassetrelation',subName:'资产库存业务委托关系',isshow:false,pk_orgtype :''},
                 {subGrid:'assetorgmaintainrelation',subName:'资产维修业务委托关系',isshow:false,pk_orgtype :''},{subGrid:'maintainstockrelation',subName:'维修库存业务委托关系',isshow:false,pk_orgtype :''},{subGrid:'saleorgrelation',subName:'销售业务委托关系',isshow:false,pk_orgtype :''},
                 {subGrid:'org',subName:'业务单元',isshow:false,pk_orgtype :''}],//用于控制卡片界面楼层
            subGrid1:'corp',
            subGrid2:'hrorg',
            subGrid3:'financeorg',
            subGrid4:'fundorg',
            subGrid5:'purchaseorg',
            subGrid6:'saleorg',
            subGrid61:'saleorgrelation',
            subGrid7:'stockorg',
            subGrid71:'stocktrafficrelation',
            subGrid72:'stockqccenterrelation',
            subGrid73:'stockorgrelation',
            subGrid74:'stockassetrelation',
            subGrid8:'trafficorg',
            subGrid9:'qccenter',
            subGrid10:'assetorg',
            subGrid101:'assetorgmaintainrelation',
            subGrid11:'maintainorg',
            subGrid111:'maintainstockrelation',
            subGrid12:'liabilitycenter',
            subGrid13:'itemorg',
            subGrid131:'itemstockrelation',
            subGrid14:'planbudget',
            subGrid15:'adminorg',
            subGrid16:'factory',
            subGrid17:'plancenter'
        };
        return(
            <Orgunitcard {...{config:config}}/>
        );
    }
}
//ReactDOM.render(<OrgCard />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65