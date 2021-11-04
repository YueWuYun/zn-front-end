//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Batchcloseaccbook from 'uapbd/exportArea/batch_closeaccbook';

/**
 * 组织批量关账
 */
export default class Batchcloseaccbook_uapbd extends Component{
    constructor(props){
        super(props);
    }
    render(){
        /**
         *  后面还要考虑 多语 的情况
         * @type {{title: string, showMoudles: Object}}
         */
        let config = {
            title : '组织批量关账',
            appCode: '101007',
            showMoudles : { //传入需要显示的模块 key-value
                '2002'  : true,//2002总账
                '2006'  : true,//2006应收管理
                '2008'  : true,//2008应付管理
                '2011'  : true,//2011费用管理
                '2014'  : true,//2014存货核算
                '2016'  : true,//2016税务管理
                '3607'  : true,//3607现金管理
                '3820'  : true,//3820责任会计 利润中心会计
                '3840'  : true,//3840项目成本会计
                '4008'  : true//4008库存
            }
        }
        return (
            <Batchcloseaccbook {...{config:config}}/>
        )
    }
}

ReactDOM.render(<Batchcloseaccbook_uapbd />, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65