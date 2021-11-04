//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Factor_Base from '../../factor_base/main';
import { createPage } from 'nc-lightapp-front';

/**
 * 要素表-组织
 */
export default class Factor_Org extends Component{
    constructor(props){
        super(props);
    }
    render(){
        /**
         *  后面还要考虑 多语 的情况
         * @type {{nodeTitle: string, pageCode: string, nodeType: string}}
         */
        let config = {
            //title:'要素表-组织',//已改为由appcode判断title
            appcode : "10140ETO",
            pageCode: '10140ETO_page',
            nodeType: 'org',
            nodekey : '10140eto_ncc'
        };
        
        let Page = createPage({
            billinfo:{
                billtype: 'card',
                pagecode: '10140ETO_page',
                headcode: 'factorinfo',
                bodycode: 'factoraccAsoa'//['agentstores','agentstores&childform1','agentstores&childform2']
            }
        })(Factor_Base)

        return (
            <Page {...{config:config}}/>
        )
    }
}
/**
 * 渲染页面
 */
ReactDOM.render(<Factor_Org/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65