//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage} from 'nc-lightapp-front';

import Card from '../../project_base/card';

let config = {
    // nodeName: this.state.json['10140PRJB-000044'],/* 国际化处理： 项目-全局*/
    nodeType: 'global',
    pagecode_list:'10140PRJG_list',
    pagecode_card:'10140PRJG_card',
    appcode: '10140PRJB',
    appid:'0001Z010000000004OE8',
    printFunCode:'10140PRJB',      //有打印模板的小应用编码
    printNodeKey:'orgProjectCard',      //模板节点标识S
    // cardUrl:'/uapbd/pmbase/project_glb/card/index.html',
    // listUrl:'/uapbd/pmbase/project_glb/list/index.html'
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