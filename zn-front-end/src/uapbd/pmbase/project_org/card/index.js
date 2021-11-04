//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Card from '../../project_base/card';
import { createPage} from 'nc-lightapp-front';
debugger 
let config = {
    // nodeName: this.state.json['10140PRJB-000045'],/* 国际化处理： 项目-项目组织*/
    nodeType: 'org',
    pagecode_list:'10140PRJG_list',
    pagecode_card:'10140PRJG_card',
    appcode: '10140PRJO',
    appid:'0001Z010000000004OEE',
    printFunCode:'10140PRJO',      //有打印模板的小应用编码
    printNodeKey:null,      //模板节点标识
    // cardUrl:'/uapbd/pmbase/project_org/card/index.html',
    // listUrl:'/uapbd/pmbase/project_org/list/index.html'
    listUrl:'/list',
    cardUrl:'/card'
}

let CardModi = createPage({
    initTemplate:function(){},
    billinfo:{
        billtype: 'card', 
        pagecode: config.pagecode_card, 
        headcode: 'head',
        bodycode: 'bodyvos'
    }
})(Card);

class Cardgrp extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <CardModi {...config}/>
            </div>
        )
    }
}

export default Cardgrp;
// ReactDOM.render(<Card {...config}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65