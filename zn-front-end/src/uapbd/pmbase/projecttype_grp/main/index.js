//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ProjectType from '../../projecttype_base/main/index.js';
import { createPage,ajax} from 'nc-lightapp-front';

let config = {
    title:'项目类型-集团',
    pageCode:'10140PRJTG_form',
    nodeType:'GROUP_NODE',
    formId:'head',
    primaryKey:'pk_projectclass',
    treeId:'projectTypeTree',
    appcode:'10140PRJTG',
};
var ProjectType_GRP = createPage({
    billinfo:{
        billtype: 'form',
        pagecode: '10140PRJTG_form',
        headcode: 'head'
    },
    initTemplate: {},
})(ProjectType)
/**
 * 渲染页面
 */
ReactDOM.render(<ProjectType_GRP {...config}/>, document.querySelector('#app'));


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65