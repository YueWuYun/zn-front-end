//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import List from '../../rateschema_base/list';

let config = {
    nodeName: '10140RATEG-000025',/* 国际化处理： 现金折扣方案-业务单元*/
    nodeType: 'org',
    pagecode_list:'10140RATEG_ratelistview',
    pagecode_card:'10140RATEG_ratecard',
    printFunCode:'10140RATEG',      //有打印模板的小应用编码
    printNodeKey:'rateschemalist',     //模板节点标识
    appcode: '10140RATEO',
    appid : '0001Z010000000004404',
    isGlbGrp:'1',
    billType:'rateschema_org',
    // cardUrl:'/uapbd/sminfo/rateschema_org/card/index.html',
    // listUrl:'/uapbd/sminfo/rateschema_org/list/index.html'
    cardUrl:'/card',
    listUrl:'/list'
}

class Listorg extends Component{

    constructor(props){
        super(props)

        debugger
    }
    render(){
        return(
            <List {...config}/>
        )
    }
}

export default Listorg;
// ReactDOM.render(<List {...config}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65