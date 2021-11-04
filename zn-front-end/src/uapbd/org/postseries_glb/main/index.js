//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Postseries from '../../postseries/main/';
import { createPage } from 'nc-lightapp-front';

/**
 * 岗位序列-全局
 */
let config = {
    //title:'岗位序列-全局',
    pageCode:'10100PSB_postseries',
    appcode : "10100PSB",
    nodeType:'GLOBE_NODE',
    formId:'head',
    treeId:'epsTree',
    isGlbGrp:'0'
};

let Postseries_Glb = createPage({
    billinfo:{
        billtype: 'form',
        pagecode: '10100PSB_postseries',
        headcode: 'head'
    }
})(Postseries)

/**
 * 渲染页面
 */
ReactDOM.render(<Postseries_Glb {...{config: config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65