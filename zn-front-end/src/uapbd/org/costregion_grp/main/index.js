//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {JobEditTable} from  '../../costregion_base/main'

/**
 * author zhenmx
 *
 */
class CostregionGrpTable extends Component {
    constructor(props){
        super(props);
    }
    render(){
        let config = {
            pageTitle:'职务-集团',
            NODE_TYPE:'GROUOP_NODE',
            appid :'10100COSTR',
            gridId : 'costregion',
            searchId : 'costregion_search',
            pagecode : '10100COSTR_costregion'
        };
        return(
            <CostregionEditTable {...{config:config}}/>
        );
    }
}
ReactDOM.render(<CostregionGrpTable />, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65