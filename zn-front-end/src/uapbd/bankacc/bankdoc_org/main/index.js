//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {ajax} from 'nc-lightapp-front';
import BankPageView from '../../banktype/main/index';

class Bank_Org extends Component{
    render(){
        let config = {
            pageCode:"10140BANKO_bankdoc",
            appid:'0001Z01000000000244U',//按钮注册
            type:"org",
            //accessMessage:'组织节点只能维护当前节点有权限组织的数据',
            searchId:'bankdoc_query',
            formId:"bankdoc",
            tableId:'linkmans',
            needEdit:false,
            showModal:false,
            showLine:false,
            editType:true
        };

        return(
            <BankPageView config={config}/>
        );
    }
}

ReactDOM.render(<Bank_Org/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65