//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {AccountingbookEditTable} from  '../../../org/accountingbook_base/main'

/**
 * author zhj
 *
 */
class AccountingbookglbTable extends Component {
    constructor(props){
        super(props);
    }
    render(){
        let config = {
            NODE_TYPE:'GLOBE_NODE',
            appid:'0001Z010000000003WBN',
            gridId : 'accountingbook',
            searchId : 'accountingbook_search',
            pagecode : '10100ACB_accountingbook'
        };
        return(
            <AccountingbookEditTable {...{config:config}}/>
        );
    }
}
ReactDOM.render(<AccountingbookglbTable />, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65