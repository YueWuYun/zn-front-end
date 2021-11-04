//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import VouchertypeTable from '../../vouchertype_base/main/';
import { createPage } from 'nc-lightapp-front';

/**
 * 凭证类别-全局
 */
export default class VouchertypeTable_Glb extends Component{
    constructor(props){
        super(props);
    }
    render(){
        /**
         *  后面还要考虑 多语 的情况
         * @type {{nodeTitle: string, pageCode: string, nodeType: string}}
         */
        let config = {
            //title:'凭证类别-全局',//已改为由appcode判断title
            pageCode:'10140VTB_vouchertype',
            appcode : "10140VTB",
            appid: '0001Z010000000000I15',
            nodeType:'glb'
        };
        
        let Page = createPage({
            billinfo:{
                billtype: 'grid',
                pagecode: '10140VTB_vouchertype',
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
ReactDOM.render(<VouchertypeTable_Glb/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65