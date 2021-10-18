/*mDNxpmg6oKeXhUX5LLwkTCEW6GJRXBHODOSjE4DE/2D0OH0C+pNpEgUaKdSKv+MX*/
import { Templatedata } from "../../config/Templatedata";
/**
 * [外币兑换]-关联结算按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const linksettleBtn = function () {
  
    this.props.openTo('/cmp/settlementmanagement/settlepublic/list/index.html',
        {
            appcode: Templatedata.settle_code,
            pagecode: Templatedata.settle_pageid,
            status: 'browse',
            src: Templatedata.settle_src,
            callback: Templatedata.settle_callback,  //回调页面
            name: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000013'),/* 国际化处理： 关联结算信息*/
            callbackappcode: Templatedata.callback_appcode,
            callbackpagecode: Templatedata.callback_pagecode

     });
}

/*mDNxpmg6oKeXhUX5LLwkTCEW6GJRXBHODOSjE4DE/2D0OH0C+pNpEgUaKdSKv+MX*/