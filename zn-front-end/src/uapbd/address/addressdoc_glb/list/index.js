//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import AreaClassFun from '../../addressdoc_base/list/'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {getMultiLang } from 'nc-lightapp-front';

class AddressdocglbList extends Component {
    constructor(props){
        super(props);
    }
    render(){
        let config = {
            title:'10140ADRB-000000',
            pageCode:"10140ADRB_list",
            pageCardCode:"10140ADRB_card",
            appcode:'10140ADRB',
            nodeType:"GLOBE_NODE",
            linktourl:'/uapbd/address/addressdoc_glb/',
            linkpagecode:'10140ADRB_card',
            billType:'addressdoc_glb',
            importTemplate:'10140ADRB_card'
        };
        return(
            <AreaClassFun {...{config:config}}/>
        );
    }
}
export default AddressdocglbList;
/**
 * 渲染页面
 */
//ReactDOM.render(<AreaClassFun  {...{config:config}}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65