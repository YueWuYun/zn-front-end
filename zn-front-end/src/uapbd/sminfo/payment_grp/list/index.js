//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import List from '../../payment_base/list';
let config = {
    //modified by wh 20181020 移动至base
    //nodeName: '付款协议-集团',
    nodeType: 'group',
    pagecode_list:'10140PAYMG_list',
    pagecode_card:'10140PAYMG_card',
    appcode:'10140PAYMG',
    appid:'0001Z010000000001DMG',
    printFunCode:'10140PAYMG',      //有打印模板的小应用编码
    printNodeKey:'paymentlist',     //模板节点标识
    // cardUrl:'/uapbd/sminfo/payment_grp/card/index.html',
    // listUrl:'/uapbd/sminfo/payment_grp/list/index.html'
    billType:'payment_grp',
    listUrl:'/list',
    cardUrl:'/card'
}
class Listgrp extends Component{

    constructor(props){
        super(props)

        debugger
    }
    render(){
        return(
            <div>
                <List {...config}/>    
            </div>
        )
    }
}

export default Listgrp;
//ReactDOM.render(<Listgrp {...config}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65