//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import OrgSysPage from '../../fundmanasys_base/main'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage} from 'nc-lightapp-front';

let config = {
    // nodeName: this.state.json['10100FMSB-000052'],/* 国际化处理： 资金管理体系-集团*/
    nodeType: 'GROPE_NODE',
    nodePageCode: "10100FMSG_list",
    appId:'0001Z010000000001570',
    appCode:'10100FMSG'
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