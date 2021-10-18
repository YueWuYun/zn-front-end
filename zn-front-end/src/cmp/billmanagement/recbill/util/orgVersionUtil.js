/*zTjtRMrfXkwpbiCYSAF0SJ4itYxxhU/wareT8LZrMh3xDhsc7zBrULY/3PlCkZxu*/

import {  ajax } from 'nc-lightapp-front';
import { orgVersionView } from '../../../../tmpub/pub/util/version/index.js';//多版本视图

/**
 * [收款结算]-[多版本控制]
 * @param {*} props  
 * @param {*} formId  headcode
 */
export const orgVersionUtil = function (props, formId) {
    //console.log(props, 'orgVersion');
    orgVersionView(props, formId, 'pk_org', 'pk_org_v');//组织版本显示
    // orgVersionView(props, formId, 'pk_fiorg', 'pk_fiorg_v');//组织版本显示
    // orgVersionView(props, formId, 'pk_pcorg', 'pk_pcorg_v');//组织版本显示
}

/**
 * [收款结算]-[交易类别：散户控制(通过org来进行过滤散户)]
 * @param {*} props  
 * @param {*} value  参数值
 * @param {*} mouldeId  数据空间formid或者tableid
 */
export const orgAfterCustomerUtil = function (props, value, mouldeId) {
    if (value && mouldeId) {
        ajax({
            url: '/nccloud/cmp/pub/getpara.do',
            //参数返回类型type， int ,string,boolean
            //组织pk_org
            //参数编码paracode 
            data: { paracode: 'CMP48', pk_org: value, type: 'boolean' },
            success: function (res) {
                let { success, data } = res;
                if (res.data.CMP48) {
                    let meta = props.meta.getMeta();
                    let item = meta[mouldeId].items.find(e => e.attrcode === 'objecttype')
                    item.options = [
                        {
                            "display": " ", /* 清空*/
                            "value": " "
                        },
                        {
                            "display": props.MutiInit.getIntl("36070RBM") && props.MutiInit.getIntl("36070RBM").get('36070RBM-000105'), /* 国际化处理： 客户*/
                            "value": "0"
                        },
                        {
                            "display": props.MutiInit.getIntl("36070RBM") && props.MutiInit.getIntl("36070RBM").get('36070RBM-000106'), /* 国际化处理： 供应商*/
                            "value": "1"
                        },
                        {
                            "display": props.MutiInit.getIntl("36070RBM") && props.MutiInit.getIntl("36070RBM").get('36070RBM-000107'), /* 国际化处理： 部门*/
                            "value": "2"
                        },
                        {
                            "display": props.MutiInit.getIntl("36070RBM") && props.MutiInit.getIntl("36070RBM").get('36070RBM-000108'), /* 国际化处理： 人员*/
                            "value": "3"
                        },
                        {
                            "display": props.MutiInit.getIntl("36070RBM") && props.MutiInit.getIntl("36070RBM").get('36070RBM-000109'), /* 国际化处理： 散户*/
                            "value": "4"
                        }
                    ]
                } else {
                    let meta = props.meta.getMeta();
                    let item = meta[mouldeId].items.find(e => e.attrcode === 'objecttype')
                    item.options = [
                        {
                            "display": " ", /* 清空*/
                            "value": " "
                        },
                        {
                            "display": props.MutiInit.getIntl("36070RBM") && props.MutiInit.getIntl("36070RBM").get('36070RBM-000105'), /* 国际化处理： 客户*/
                            "value": "0"
                        },
                        {
                            "display": props.MutiInit.getIntl("36070RBM") && props.MutiInit.getIntl("36070RBM").get('36070RBM-000106'), /* 国际化处理： 供应商*/
                            "value": "1"
                        },
                        {
                            "display": props.MutiInit.getIntl("36070RBM") && props.MutiInit.getIntl("36070RBM").get('36070RBM-000107'), /* 国际化处理： 部门*/
                            "value": "2"
                        },
                        {
                            "display": props.MutiInit.getIntl("36070RBM") && props.MutiInit.getIntl("36070RBM").get('36070RBM-000108'), /* 国际化处理： 人员*/
                            "value": "3"
                        }
                    ]
                }
            }
        });
    }

}

/*zTjtRMrfXkwpbiCYSAF0SJ4itYxxhU/wareT8LZrMh3xDhsc7zBrULY/3PlCkZxu*/