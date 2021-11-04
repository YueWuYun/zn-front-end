//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import List from '../../project_base/list';

let config = {
    // nodeName: this.state.json['10140PRJB-000034'],/* 国际化处理： 项目-集团*/
    nodeType: 'group',
    pagecode_list:'10140PRJG_list',
    pagecode_card:'10140PRJG_card',
    appcode: '10140PRJG',
    appid:'0001Z010000000000IJB',
    printFunCode:'10140PRJG',      //有打印模板的小应用编码
    printNodeKey:'orgProjectList',      //模板节点标识
    // cardUrl:'/uapbd/pmbase/project_grp/card/index.html',
    // listUrl:'/uapbd/pmbase/project_grp/list/index.html'
    billType:'project_grp',
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