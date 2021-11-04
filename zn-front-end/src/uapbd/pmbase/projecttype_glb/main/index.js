//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ProjectType from '../../projecttype_base/main/index.js';
import { createPage,ajax} from 'nc-lightapp-front';

let config = {
    title:'项目类型-全局',
    pagecode:'10140PRJTB_form',
    appcode:'10140PRJTB',
    nodeType:'GLOBE_NODE',
    treeId:'projectTypeTree',
    formId:'head',
    primaryKey:'pk_projectclass',
};
var ProjectType_GLB = createPage({
    billinfo:{
        billtype: 'form',
        pagecode: '10140PRJTB_form',
        headcode: 'head'
    },
    initTemplate: {},
})(ProjectType)
/**
 * 渲染页面
 */
ReactDOM.render(<ProjectType_GLB {...config}/>, document.querySelector('#app'));


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65