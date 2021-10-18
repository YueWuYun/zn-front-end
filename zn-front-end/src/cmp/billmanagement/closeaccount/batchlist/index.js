/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import Batchcloseaccbook from '../../../../uapbd/orgcloseacc/batch_closeaccbook/main'
import Batchcloseaccbook from  'uapbd/exportArea/batch_closeaccbook'
/**
 * 组织批量关账
 */
export default class Batchcloseaccbook_uapbd extends Component{
    constructor(props){
        super(props);
    }
    render(){
        /**
         *  后面还要考虑 多语 的情况
         */
        let config = {
            title : '资金集中关账',
            appCode:'36070FCA',//需要写成自己的小应用编码 // appCode:'101007',
            showMoudles : { //传入需要显示的模块 key-value
          
                '3607'  : true
           
            },
            btnsShow : {
				'BatchPrecloseAcc' : true,     //批量提前关账
				'BatchCloseAcc' : true,        //批量关账
				'BatchAntiPrecloseAcc' : true, //批量反提前关账
				'BatchAntiCloseAcc' : true,    //批量反关账
				'Refresh' : true               //刷新
			}
        }
        return (
            <Batchcloseaccbook {...{config:config}}/>
        )
    }
}

ReactDOM.render(<Batchcloseaccbook_uapbd />, document.querySelector('#app'));
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/