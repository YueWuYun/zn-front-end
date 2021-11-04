//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {createPage} from 'nc-lightapp-front';
import Udim from '../../userdefitem/main/index.js'

var config ={
    title:'10140UDIB-000009',
    pageCode:'10140UDIG_list',
    nodeType:'GROUP_NODE',//'ORG_NODE','GROUP_NODE'
    tableId:'userdefitems',
    treeId:'userdefruleTree',
    appCode:'10140UDIG'
};

/**
 * 创建页面
 */
var UserDefItem = createPage({
    billinfo:{
        billtype: 'grid',
        pagecode: '10140UDIG_list',
        bodycode: 'userdefitems'
    }
})(Udim)

ReactDOM.render(<UserDefItem {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65