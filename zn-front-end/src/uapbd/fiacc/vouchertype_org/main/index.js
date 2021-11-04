//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import VouchertypeTable from '../../vouchertype_base/main/';
import { createPage } from 'nc-lightapp-front';

/**
 * 凭证类别-核算账簿
 */
export default class VouchertypeTable_Org extends Component{
    constructor(props){
        super(props);
    }
    render(){
        /**
         *  后面还要考虑 多语 的情况
         * @type {{nodeTitle: string, pageCode: string, nodeType: string}}
         */
        let config = {
            //title:'凭证类别-核算账簿',//已改为由appcode判断title
            pageCode:'10140VTO_vouchertype',
            appcode : "10140VTO",
            appid: '0001Z010000000000I19',
            nodeType:'org'
        };

        let Page = createPage({
            billinfo:{
                billtype: 'grid',
                pagecode: '10140VTO_vouchertype',
                bodycode: 'vouchertype'
            }
        })(VouchertypeTable)

        return (
            <Page {...{config:config}}/>
        )
    }
}



/**
 * 渲染页面
 */
ReactDOM.render(<VouchertypeTable_Org/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65