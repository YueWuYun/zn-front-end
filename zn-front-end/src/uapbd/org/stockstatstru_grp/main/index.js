//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import StockStatStruMember from '../../stockstatstru/main/';

/**
 * 库存统计体系
 */
export default class StockStatStruMember_Glb extends Component{
    constructor(props){
        super(props);
    }
    render(){
        /**
         *  后面还要考虑 多语 的情况
         * @type {{nodeTitle: string, pageCode: string, nodeType: string}}
         */
        let config = {
            title:'库存统计体系',
            pageCode:'10100SSS_stockstatstrumember',
            appcode:'10100SSS',
            appid:'0001Z010000000001PXQ',
            nodeType:'GROUP_NODE',
            formId:'head',
            treeId:'stockstatstruTree',
            isGlbGrp:'0'
        };
        return (
            <StockStatStruMember {...{config:config}}/>
        )
    }
}



/**
 * 渲染页面
 */
ReactDOM.render(<StockStatStruMember_Glb/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65