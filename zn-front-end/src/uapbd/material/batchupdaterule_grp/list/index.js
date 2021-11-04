//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Batchupdaterule from '../../batchupdaterule_base/list/index.js'

export default class Batchupdaterulelist extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        var config ={
            title:'批改规则',
            node_type:'GROUP_NODE',//'ORG_NODE','GROUP_NODE'
            appid : '0001Z0100000000019GO',
            pagecode : '10140BURG_LIST',
            pagecodecard : '10140BURG_CARD',
            appcode : '10140BURG',
            datasource : 'uapbd.material.batchpdaterule.grp',
            pagecodeValues : {
                'pagecode' : '10140BURG_LIST',
            }
        };
        return (
            <Batchupdaterule {...{config:config}}/>
        )
    }
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65