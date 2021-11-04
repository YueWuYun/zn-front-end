//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Supplyabilityclass from '../../supplyabilityclass/main/';

/**
 * 供货能力分类-集团
 */
export default class Supplyabilityclass_Glb extends Component{
    constructor(props){
        super(props);
    }
    render(){
        /**
         *  后面还要考虑 多语 的情况
         * @type {{nodeTitle: string, pageCode: string, nodeType: string}}
         */
        let config = {
            title:'供货能力分类',
            pageCode:'10140SACL_supabcl01',
            appcode:'10140SACL',
            appid:'0001Z010000000000MEC',
            nodeType:'GROUP_NODE',
            formId:'head',
            treeId:'supplyabilityclassTree',
            isGlbGrp:'0'
        };
        return (
            <Supplyabilityclass {...{config:config}}/>
        )
    }
}



/**
 * 渲染页面
 */
ReactDOM.render(<Supplyabilityclass_Glb/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65