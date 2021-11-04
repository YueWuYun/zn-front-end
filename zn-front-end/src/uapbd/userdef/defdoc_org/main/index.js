//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Defdocbase from  '../../../userdef/defdoc_base/main'
import { createPage, ajax, base, high, toast } from 'nc-lightapp-front';

/**
 * author wanglinw
 *
 */
class Defdocorg extends Component {
    constructor(props){
        super(props);
        this.state={
            isFinish:false,
            json:{}
        }
        let callback=(json,status,inlt)=>{
            this.setState({isFinish:true,json:json});
        }
        props.MultiInit.getMultiLang({moduleId:'10140UDDBGO',/*currentLocale:'zh-CN',*/domainName:'uapbd',callback});
    }
    render(){
        let config = {
            listpagecode:'10140UDDO_org',
            formpagecode:'10140UDDO_treecard',
            funcode:'10140UDDO',
            appcode:'10140UDDO',
            title:this.state.json['10140UDDBGO-000042'],/* 国际化处理： 自定义档案维护-业务单元*/
            nodeType:'ORG_NODE',//节点类型
            appid:'0001Z0100000000081E1',//小应用id
            billType:'defdoc_org'
        };
        config.json=this.state.json;
        if(!this.state.isFinish){
            return null;
        }
        return(
            <Defdocbase {...{config:config}}/>
        );
    }
}

Defdocorg = createPage({
	initTemplate: ()=>{}
})(Defdocorg);

ReactDOM.render(<Defdocorg />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65