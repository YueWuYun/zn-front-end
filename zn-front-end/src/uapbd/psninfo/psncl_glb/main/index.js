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
    NODE_TYPE:'GLOBE_NODE',
    nodeKey:'psnclPrint',
    billType:'psncl_glb'
}
let PsnclGlb = createPage({
    initTemplate: null,
    billinfo:{
        billtype:'form',
        pagecode:config.pagecode,
        headcode:'head'
    }
})(PsnclCardTable)

ReactDOM.render(<PsnclGlb {...{config:config}}/>, document.querySelector('#app'));





//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65