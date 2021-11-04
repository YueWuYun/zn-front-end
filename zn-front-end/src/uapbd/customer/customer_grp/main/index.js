//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import {createPage} from 'nc-lightapp-front';
import CustomerTable from  '../../../customer/customer_base/main'

/**
 * author zhenmx
 *
 */

let config = {
    pageFlag:'list',
    pageTitle:'客户-集团',
    NODE_TYPE:'GROUP_NODE',
    pagecode:'10140CUG_list',
    pagecodecard:'10140CUG_card',
    importTemplate:'10140CUG_card',
    gridId:'customer_list',
    custassign:'customerassign_list',
    customer_list_checkbyorg:'customer_list_checkbyorg',
    searchId:'customer_search',
    searchId_modal:'customer_search_modal',
    searchId_modal_orgdoc:'customer_search_orgbase',
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
    linkman:'10140LM',//联系人
    pushCardUrl:'/card',
    pushListUrl:'/list',
    datasource:'uapbd_customer_grp_main',
    billType:'customer_grp'
};

let CustGrpTablePage = createPage({
    billinfo:{
        billtype:'grid',
        pagecode:config.pagecode,
        headcode:config.gridId
    },
    initTemplate: null

})(CustomerTable);


class CustGrpTable extends Component {
    constructor(props){
        super(props);
    }
    render(){

        return(
            <CustGrpTablePage {...{config:config, props: this.props}}/>
        );
    }
}
export default CustGrpTable;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65