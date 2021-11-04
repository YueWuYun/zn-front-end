//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import AreaClassFun from '../../addressdoc_base/card/'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {getMultiLang,createPage } from 'nc-lightapp-front';

class Card extends Component {
    constructor(props){
        super(props);
    }

    render(){
        let config = {
            title:'10140ADRB-000000',
            pageCode:"10140ADRB_card",
            pageListCode:"10140ADRB_list",
            appcode:'10140ADRB',
            nodeType:"GLOBE_NODE",
            linktourl:'/uapbd/address/addressdoc_glb/',
            linkpagecode:'10140ADRB_list'
        };
        return(
            <AreaClassFun {...Object.assign(this.props,{config:config})}/>
        );
    }
}

var AddressdocglbCard = createPage({
    billinfo:[{
        billtype: 'card',
        pagecode: "10140ADRB_card",
        headcode: 'head',
        bodycode: 'linkmanvos'
    },{
        billtype: 'form',
        pagecode: "10140ADRB_card",
        headcode: '10140LM'
    }]
})(Card);

export default AddressdocglbCard;
/**
 * 渲染页面
 */
//ReactDOM.render(<AreaClassFun  {...{config:config}}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65