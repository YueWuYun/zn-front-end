//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Postseries from '../../postseries/main';
import { createPage } from 'nc-lightapp-front';

/**
 * 岗位序列-集团
 */
let config = {
    //title:'岗位序列-集团',
    pageCode:'10100PSG_postseries',
    appcode : "10100PSG",
    nodeType:'GROUP_NODE',
    formId:'head',
    treeId:'epsTree',
    isGlbGrp:'1'
};

let Postseries_Grp = createPage({
    billinfo:{
        billtype: 'form',
        pagecode: '10100PSG_postseries',
        headcode: 'head'
    }
})(Postseries)

/**
 * 渲染页面
 */
ReactDOM.render(<Postseries_Grp {...{config: config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65