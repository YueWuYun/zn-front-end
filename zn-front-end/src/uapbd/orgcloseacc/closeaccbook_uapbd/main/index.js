//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Closeaccbook from 'uapbd/exportArea/closeaccbook';

/**
 * 财务组织关账
 */
export default class Closeaccbook_uapbd extends Component{
    constructor(props){
        super(props);
    }
    render(){
        /**
         *  后面还要考虑 多语 的情况
         * @type {{title: string, showMoudles: Object}}
         */
        let config = {
            title : '财务组织关账',
            appCode : '101006',
            showMoudles : { //传入需要显示的模块 key-value
                '2002'  : true,//2002总账
                '2006'  : true,//2006应收管理
                '2008'  : true,//2008应付管理
                '2011'  : true,//2011费用管理
                '3607'  : true,//3607现金管理
                '2014'  : true,//2014存货核算
                '3830'  : true,//3830产品成本
                '3880' : true,//3880标准成本核算
                '3840'  : true,//3840项目成本会计
                '4008'  : true,//4008库存
                'STOREDOC' : true//STOREDOC仓库
            },
            isShowFlowchart : true //是否显示图形界面
        }
        return (
            <Closeaccbook {...{config:config}}/>
        )
    }
}

ReactDOM.render(<Closeaccbook_uapbd />, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65