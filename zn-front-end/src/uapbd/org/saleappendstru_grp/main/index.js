//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SaleAppendStru from '../../saleappendstru/main/';

/**
 * 分销补货体系
 */
export default class SaleAppendStru_Grp extends Component{
    constructor(props){
        super(props);
    }
    render(){
        /**
         *  后面还要考虑 多语 的情况
         * @type {{nodeTitle: string, pageCode: string, nodeType: string}}
         */
        let config = {
            title:'分销补货体系',
            pageCode:'10100SAS_saleappendstrumember',
            appcode:'10100SAS',
            appid:'0001Z010000000001KI5',
            nodeType:'GROUP_NODE',
            formId:'head',
            treeId:'saleappendstruTree',
            isGlbGrp:'0'
        };
        return (
            <SaleAppendStru {...{config:config}}/>
        )
    }
}



/**
 * 渲染页面
 */
ReactDOM.render(<SaleAppendStru_Grp/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65