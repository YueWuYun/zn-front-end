//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Ctterm from '../../ctterm/main/';

/**
 * 合同条款定义-业务单元
 */
export default class Ctterm_Org extends Component{
    constructor(props){
        super(props);
    }
    render(){
        /**
         *  后面还要考虑 多语 的情况
         * @type {{nodeTitle: string, pageCode: string, nodeType: string}}
         */
        let config = {
            title:'合同条款定义-业务单元',
            pageCode:'10140Z00_termset',
            appcode:'10140Z02',
            appid:'0001Z010000000000O0L',
            nodeType:'ORG_NODE',
            formId:'head',
            treeId:'cttermTree',
            isGlbGrp:'1'
        };
        return (
            <Ctterm {...{config:config}}/>
        )
    }
}



/**
 * 渲染页面
 */
ReactDOM.render(<Ctterm_Org/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65