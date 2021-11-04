//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import BankPageView from '../../banktype/main/index';

class Bank_Glb extends Component{
    render(){
        let config = {
            pageCode:"10140BANK_bankdoc",
            appid:'0001Z010000000001932',//按钮注册
            type:"glb",
            searchId:'bankdoc_query',
            formId:"bankdoc",
            tableId:'linkmans',
            showModal:false,
            showLine:false,
            editType:true
        };

        return(
            <BankPageView config={config}/>
        );
    }
}

ReactDOM.render(<Bank_Glb/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65