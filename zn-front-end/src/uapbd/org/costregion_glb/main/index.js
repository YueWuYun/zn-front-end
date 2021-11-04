//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {CostregionEditTable} from  '../../../org/costregion_base/main'

/**
 * author zhj
 *
 */
class CostregionglbTable extends Component {
    constructor(props){
        super(props);
    }
    render(){
        let config = {
            appid:'0001Z010000000001AB9',
            gridId : 'costregion',
            searchId : 'costregion_search',
            pagecode : '10100COSTR_costregion'
        };
        return(
            <CostregionEditTable {...{config:config}}/>
        );
    }
}
ReactDOM.render(<CostregionglbTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65