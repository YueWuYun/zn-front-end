//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import AreaClassFun from '../../addressdoc_base/card'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {getMultiLang,createPage } from 'nc-lightapp-front';

class Card extends Component {
    constructor(props){
        super(props);
    }
    render(){
        let config = {
            title:'10140ADRB-000024',
            pageCode:"10140ADRG_card",
            pageListCode:"10140ADRG_list",
            appcode:'10140ADRG',
            nodeType:"GROPE_NODE",
        };

        return(
            <AreaClassFun {...Object.assign(this.props,{config:config})}/>
        );
    }
}

var AddressdocgrpCard = createPage({
    billinfo:[{
        billtype: 'card',
        pagecode: "10140ADRG_card",
        headcode: 'head',
        bodycode: 'linkmanvos'
    },{
        billtype: 'form',
        pagecode: "10140ADRG_card",
        headcode: '10140LM'
    }]
})(Card);

export default AddressdocgrpCard;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65