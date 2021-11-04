//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import BankAccountCardBase from '../../bankAccount_base/edit'
import {createPage} from 'nc-lightapp-front';

/**
 * author zhenmx
 *
 */

let config = {
    pageFlag: 'card',
    NODE_TYPE: 'GROUP_NODE',
    pagecode: '10140BACCG_baseInfo_card',
    pagecode_list:'10140BACCG_baseInfo',
    nodekey: 'bankacc',
    gridId: 'bankaccsub',
    formId: 'bankaccount',
    controlorg: 'controlorg',
    bankaccuse: 'bankaccuse',
    datasource: 'bankacc_grp_main'
};
let BankAccountCardBasePage = createPage({
    billinfo: {
        billtype: 'card',
        pagecode: config.pagecode,
        headcode: config.formId,
        bodycode: [config.gridId]
    },
    initTemplate: null

})(BankAccountCardBase);
class BankAccountCardGrp extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BankAccountCardBasePage {...{config: config}}/>
        );
    }
}

export default BankAccountCardGrp;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65