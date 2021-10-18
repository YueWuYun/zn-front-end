/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
/**
 * 关账----取用组件---显示页面
 */
import { createPage, ajax, base, toast, high } from "nc-lightapp-front";
import React, { Component } from "react";
import ReactDOM from "react-dom";
//关账导入组件[出盘完毕后进行修改]
// import Closeaccbook from "../../../../uapbd/orgcloseacc/closeaccbook/main";
import Closeaccbook from 'uapbd/exportArea/closeaccbook';
/**
 * 财务组织关账
 */
export default class Closeaccbook_uapbd extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        /**
         *  后面还要考虑 多语 的情况
         *
         */
        //1909打开节点更新检查url-begin
        ajax({
            url: '/nccloud/cmp/closeaccount/udpatecheckurl.do',
            data: {checkUp:true},
            success: (res) => {
            }
        });
        //end
        let config = {
            title: "资金关账", //显示节点名称
            appCode: "36070CA", //需要写成自己的小应用编码//  appCode:'101006',
            showMoudles: {
                "3607": true //3607现金管理
            },
            btnsShow: {
                //组件调用时控制按钮显示属性
                CloseAccBook: true, //	关账
                // 'PreCloseAccBook' : true,	//	提前关账
                UnCloseAccBook: true, //	反关账
                // 'UnPreCloseAccBook' : true,	//	反提前关账
                CloseCheck: true, //  关账检查
                // 'batchCloseAcc' : true,	    //  批关帐
                Refresh: true //  刷新
            }
        };

        return <Closeaccbook {...{ config: config }} />;
    }
}

ReactDOM.render(<Closeaccbook_uapbd />, document.querySelector("#app"));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/