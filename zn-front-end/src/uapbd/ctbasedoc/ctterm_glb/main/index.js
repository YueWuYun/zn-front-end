//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Ctterm from '../../ctterm/main/';

/**
 * 合同条款定义-集团
 */
export default class Ctterm_Glb extends Component{
    constructor(props){
        super(props);
    }
    render(){
        /**
         *  后面还要考虑 多语 的情况
         * @type {{nodeTitle: string, pageCode: string, nodeType: string}}
         */
        let config = {
            title:'合同条款定义-集团',
            pageCode:'10140Z00_termset',
            appcode:'10140Z00',
            appid:'0001Z010000000000MDP',
            nodeType:'GROUP_NODE',
            formId:'head',
            treeId:'cttermTree',
            isGlbGrp:'0'
        };
        return (
            <Ctterm {...{config:config}}/>
        )
    }
}



/**
 * 渲染页面
 */
ReactDOM.render(<Ctterm_Glb/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65