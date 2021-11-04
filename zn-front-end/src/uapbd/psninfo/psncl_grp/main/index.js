//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {createPage} from 'nc-lightapp-front';
import PsnclCardTable from '../../psncl/main';
/**
 * author zhenmx
 *
 */
const config = {
    NODE_TYPE:'GROUP_NODE',
    nodeKey:'psnclPrint',
    billType:'psncl_grp'
}

let PsnclGrp =createPage({
    initTemplate: null,
    billinfo:{
        billtype:'form',
        pagecode:config.pagecode,
        headcode:'head'
    }
})(PsnclCardTable)

ReactDOM.render(<PsnclGrp {...{config:config}}/>, document.querySelector('#app'));





//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65