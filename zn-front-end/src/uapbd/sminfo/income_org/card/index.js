//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Card from '../../income_base/card';

let config = {
    nodeName: '收款协议-业务单元',
    nodeType: 'org',
    pagecode_list:'10140INCMG_incomelist',
    pagecode_card:'10140INCMG_incomecard',
    appcode: '10140INCMO',
    appid:'0001Z010000000001PR5',
    printFunCode:'10140INCMG',      //有打印模板的小应用编码
    printNodeKey:'incomecard',      //模板节点标识
    // cardUrl:'/uapbd/sminfo/income_org/card/index.html',
    // listUrl:'/uapbd/sminfo/income_org/list/index.html'
    //10140PAYMO 业务单元未注册
    billType:'income_org_1',
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