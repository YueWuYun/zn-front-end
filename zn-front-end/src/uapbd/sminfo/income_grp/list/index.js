//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import List from '../../income_base/list';

let config = {
    nodeName: '收款协议-集团',
    nodeType: 'group',
    pagecode_list:'10140INCMG_incomelist',
    pagecode_card:'10140INCMG_incomecard',
    appcode: '10140INCMG',
    appid:'0001AA100000000047BM',
    printFunCode:'10140INCMG',      //有打印模板的小应用编码
    printNodeKey:'incomelist',      //模板节点标识
    // cardUrl:'/uapbd/sminfo/income_grp/card/index.html',
    // listUrl:'/uapbd/sminfo/income_grp/list/index.html'
    billType:'income_grp_1',
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
// ReactDOM.render(<List {...config}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65