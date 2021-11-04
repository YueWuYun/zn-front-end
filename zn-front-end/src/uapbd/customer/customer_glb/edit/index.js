//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import CustomerBaseCard from '../../customer_base/edit';
import {createPage} from 'nc-lightapp-front';

/**
 * author zhenmx
 *
 */
let config = {
    pageFlag:'card',
    NODE_TYPE:'GLOBE_NODE',
    pagecode:'10140CUB_card',
    pagecodelist:'10140CUB_list',
    searchId_modal:'customer_search_modal',
    searchId_modal_batchEdit:'searchId_modal_batchEdit',
    formId:'customer',//客户共享信息
    formId_share:'cust_share',//客户基本信息
    custassign:'customerassign_list',
    customer_list_checkbyorg:'customer_list_checkbyorg',
    subGrid1:'custbanks',
    subGrid2:'custcontacts',
    subGrid3:'custtaxtypes',
    subGrid4:'cust_finance',
    subGrid5:'cust_sale',
    subGrid6:'cust_creditctl',
    subGrid4_simple:'cust_finance_simple',
    subGrid5_simple:'cust_sale_simple',
    subGrid6_simple:'cust_creditctl_simple',
    associateSup:'associateSup',//关联供应商
    createSupplier:'createSupplier',//生成供应商
    custAddress:'custAddress',//客户收货地址
    custRename:'custrename',//客户更名记录
    custBankaccbas:'custBankaccbas',//银行账户
    creditctlForm:'customer_simpleinfo',//客户信用控制卡片
    custfinanceForm:'custfinancecardcustomer',//客户财务信息卡片
    custsaleForm:'custsalecustomerinfo',//客户销售信息卡片
    linkman:'10140LM',//联系人
    loop:['custbanks','custcontacts','custtaxtypes','cust_finance','cust_sale','cust_creditctl'],
    pushCardUrl:'/card',
    pushListUrl:'/list',
    datasource:'uapbd_customer_glb_main'
};
let CustomerGlbCardPage  =  createPage({
    billinfo:{
        billtype:'extcard',
        pagecode:config.pagecode,
        headcode:config.formId,
        bodycode:[config.subGrid1,config.subGrid2,config.subGrid3,config.subGrid4,config.subGrid5,config.subGrid6]
    },
    initTemplate: null
})(CustomerBaseCard);
class CustomerGlbCard extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <CustomerGlbCardPage {...{config:config, props: this.props}}/>
        );
    }
}
export default CustomerGlbCard;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65