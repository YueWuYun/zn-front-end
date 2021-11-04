//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CustsaleClass from '../../custsaleclass/main/';

/**
 * 客户销售分类-集团
 */
export default class CustsaleClass_Glb extends Component{
    constructor(props){
        super(props);
    }
    render(){
        /**
         *  后面还要考虑 多语 的情况
         * @type {{nodeTitle: string, pageCode: string, nodeType: string}}
         */
        let config = {
            title:'客户销售分类-集团',
            pageCode:'10140CSCLG_custsaleclass',
            appcode:'10140CSCLG',
            appid:'0001Z010000000000PBR',
            billType:'custsaleclass_grp',
            nodeType:'GROUP_NODE',
            formId:'head',
            treeId:'custsaleclassTree',
            isGlbGrp:'0'
        };
        return (
            <CustsaleClass {...{config:config}}/>
        )
    }
}



/**
 * 渲染页面
 */
ReactDOM.render(<CustsaleClass_Glb/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65