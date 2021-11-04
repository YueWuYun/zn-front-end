//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Card from '../../payment_base/card';

let config = {
    //modified by wh 20181020 移动至base
    //nodeName: '付款协议-集团',
    nodeType: 'group',
    pagecode_list:'10140PAYMG_list',
    pagecode_card:'10140PAYMG_card',
    appcode:'10140PAYMG',
    appid:'0001Z010000000001DMG',
    printFunCode:'10140PAYMG',      //有打印模板的小应用编码
    printNodeKey:'paymentcard',     //模板节点标识
    // cardUrl:'/uapbd/sminfo/payment_grp/card/index.html',
    // listUrl:'/uapbd/sminfo/payment_grp/list/index.html'
    listUrl:'/list',
    cardUrl:'/card'
}

class Cardgrp extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <Card {...config}/>
        )
    }
}

export default Cardgrp;
// ReactDOM.render(<Card {...config}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65