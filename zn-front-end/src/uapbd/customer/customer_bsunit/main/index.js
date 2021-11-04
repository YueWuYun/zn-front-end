//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import CustomerTable from  '../../../customer/customer_base/main'
import {createPage} from 'nc-lightapp-front';
/**
 * author zhenmx
 *
 */

let config = {
    pageFlag:'list',
    NODE_TYPE:'ORG_NODE',
    pagecode:'10140CUO_list',
    pagecodecard:'10140CUO_card',
    importTemplate:'10140CUO_card',
    gridId:'customer_list',
    custassign:'customerassign_list',
    customer_list_checkbyorg:'customer_list_checkbyorg',
    searchId:'customer_search',
    searchId_modal:'customer_search_modal',
    searchId_modal_batchEdit:'searchId_modal_batchEdit',
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
    pushCardUrl:'/card',
    pushListUrl:'/list',
    datasource:'uapbd_customer_org_main',
    billType:'customer_bsunit'

};
let CustBusTablePage = createPage({
    billinfo:{
        billtype:'grid',
        pagecode:config.pagecode,
        headcode:config.gridId
    },
    initTemplate: null
})(CustomerTable);
class CustBusTable extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <CustBusTablePage {...{config:config, props: this.props}}/>
        );
    }
}
export default CustBusTable;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65