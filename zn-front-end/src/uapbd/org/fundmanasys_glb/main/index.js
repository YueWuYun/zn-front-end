//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import OrgSysPage from '../../fundmanasys_base/main'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage} from 'nc-lightapp-front';

let config = {
    // nodeName: this.state.json['10100FMSB-000051'],/* 国际化处理： 资金管理体系-全局*/
    nodeType: 'GLOBE_NODE',
    nodePageCode: "10100FMSB_list",
    appId:'0001Z01000000000156Y',
    appCode:'10100FMSB'
}

let FundPage =  createPage({
    initTemplate:function(){},
    billinfo:{
        billtype: 'form', 
        pagecode: config.nodePageCode, 
        headcode: 'sysForm',
    }
})(OrgSysPage);

ReactDOM.render(<FundPage {...config}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65