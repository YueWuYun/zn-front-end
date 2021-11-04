//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {createPage} from 'nc-lightapp-front';
import MarPuClass from '../../mpcl_base/main/index.js'

var config ={
    title:'物料采购分类-集团',
    pageCode:'10140MPCLG_list',
    nodeType:'GROUP_NODE',//'ORG_NODE','GROUP_NODE'
    formId:'marpuclass',
    treeId:'marpuTree',
    appcode:'10140MPCLG',
    billType:'mpcl_grp'
};

var MarPuClass_grp = createPage({
    billinfo:{
        billtype: 'form',
        pagecode: '10140MPCLG_list',
        headcode: 'marpuclass'
    }
})(MarPuClass)

ReactDOM.render(<MarPuClass_grp {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65