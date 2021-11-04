//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Card from '../../rateschema_base/card';

let config = {
    nodeName: '10140RATEG-000000',/* 国际化处理： 现金折扣方案-集团*/
    nodeType: 'group',
    pagecode_list:'10140RATEG_ratelistview',
    pagecode_card:'10140RATEG_ratecard',
    printFunCode:'10140RATEG',      //有打印模板的小应用编码
    printNodeKey:'rateschemacard',     //模板节点标识
    appid : '0001Z010000000001RAJ',
    appcode: '10140RATEG',
    isGlbGrp:'0',
    //cardUrl:'/uapbd/sminfo/rateschema_grp/card/index.html',
    //listUrl:'/uapbd/sminfo/rateschema_grp/list/index.html'
    cardUrl:'/card',
    listUrl:'/list'
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