//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import AreaClassFun from '../../addressdoc_base/list'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {getMultiLang } from 'nc-lightapp-front';

class AddressdocgrpList extends Component {
    constructor(props){
        super(props);
    }

    render(){
        let config = {
            title:'10140ADRB-000024',
            pageCode:"10140ADRG_list",
            pageCardCode:"10140ADRG_card",
            appcode:'10140ADRG',
            nodeType:"GROPE_NODE",
            billType:'addressdoc_grp',
            importTemplate:'10140ADRG_card'
        };
        return(
            <AreaClassFun {...{config:config}}/>
        );
    }
}
export default AddressdocgrpList;
/**
 * 渲染页面
 */
//ReactDOM.render(<AreaClassFun  {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65