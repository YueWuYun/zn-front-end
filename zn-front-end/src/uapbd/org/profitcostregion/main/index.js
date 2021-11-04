//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {ProfitcentercostTable} from  '../../../org/profitcostregion/list'

/**
 * author zhj
 *
 */
class ProfitCostregionglbTable extends Component {
    constructor(props){
        super(props);
    }
    render(){
        let config = {
            appid:'1001Z0100000000008HQ',
            gridId : 'pfcc_list',
            searchId : 'pfcc_query',
            pagecode : '10100PCCOSTR_pccostr'
        };
        return(
            <ProfitcentercostTable {...{config:config}}/>
        );
    }
}
ReactDOM.render(<ProfitCostregionglbTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65