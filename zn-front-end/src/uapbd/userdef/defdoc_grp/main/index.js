//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Defdocbase from  '../../../userdef/defdoc_base/main'
import { createPage, ajax, base, high, toast } from 'nc-lightapp-front';

/**
 * author wanglinw
 *
 */
class Defdocgrp extends Component {
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
            listpagecode:'10140UDDG_grp',
            formpagecode:'10140UDDG_treecard',
            funcode:'10140UDDG',
            appcode:'10140UDDG',
            title:this.state.json['10140UDDBGO-000041'],/* 国际化处理： 自定义档案维护-集团*/
            nodeType:'GROUP_NODE',//节点类型
            appid:'0001Z0100000000081E1',//小应用id
            billType:'defdoc_grp'
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

Defdocgrp = createPage({
	initTemplate: ()=>{}
})(Defdocgrp);

ReactDOM.render(<Defdocgrp />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65