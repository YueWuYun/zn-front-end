//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import BankAccountBase from '../../bankAccount_base/main';
import {createPage} from 'nc-lightapp-front';
/**
 * author zhenmx
 *
 */
let config = {
    pageFlag:'list',
    NODE_TYPE:'GROUP_NODE',
    pagecode:'10140BACCG_baseInfo',
    pagecode_card:'10140BACCG_baseInfo_card',
    nodekey:'bankacclist',
    gridId:'bankaccount',
    searchId:'bankaccount_search',
    formId:'controlorg',//核算归属组织formid
    bankaccuse:'bankaccuse',//银行账户使用权table
    datasource:'bankacc_grp_main',
    billType:'bankaccount_grp'
};
let BankAccountBasePage = createPage({
    billinfo:{
        billtype:'grid',
        pagecode:config.pagecode,
        headcode:config.gridId,
        bodycode:''
    },
    initTemplate: null
})(BankAccountBase);
class BankAccountGrp extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <BankAccountBasePage {...{config:config}}/>
        );
    }
}
export default BankAccountGrp;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65