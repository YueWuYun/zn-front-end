//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MarPuClass from '../../mpcl_base/main/index.js'
import {createPage} from 'nc-lightapp-front';

var config ={
    title:'物料采购分类-库存组织',
    pageCode:'10140MPCLO_list',
    nodeType:'ORG_NODE',//'ORG_NODE','GROUP_NODE'
    formId:'marpuclass',
    treeId:'marpuTree',
    appcode:'10140MPCLO',
    billType:'mpcl_org'
};

var MarPuClass_org = createPage({
    billinfo:{
        billtype: 'form',
        pagecode: '10140MPCLO_list',
        headcode: 'marpuclass'
    }
})(MarPuClass)

ReactDOM.render(<MarPuClass_org {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65