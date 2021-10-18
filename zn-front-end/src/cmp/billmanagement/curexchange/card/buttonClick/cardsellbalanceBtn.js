/*molv2xN0M1ZekFD4U1hgab/oWRkxXcfIr4BT4qjaoO526GZNdztXhBgNCN+wNqFA*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-卖出余额联查按钮
 * @param {*} props  
 */
export const cardsellbalanceBtn = function () {
    let sellbalanceBtnArr = [];
    let pk_sellacct = null;
    if (this.props.form.getFormItemsValue(this.formId, 'pk_sellacct').value) {
        pk_sellacct = this.props.form.getFormItemsValue(this.formId, 'pk_sellacct').value;
        let pk_sellorg = null;
        if (this.props.form.getFormItemsValue(this.formId, 'pk_org').value) {
            pk_sellorg = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
        }
        //修改请求联查方式
        let query_sell_data = {
            pk_org: pk_sellorg, //财务组织id
            pk_account: pk_sellacct, //银行账户id，没有可不写，和现金账户二选一
            pk_cashaccount: null //现金账户id，没有可不写
        }
        sellbalanceBtnArr.push(query_sell_data);//卖出银行账号
        this.setState({
            showOriginalData: sellbalanceBtnArr,
            showOriginal: true,
        });
    } else {
        toast(
            {
                color: 'warning',
                content: this.props.MutiInit.getIntl("36070FCE") &&
                    this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000014')
            });/* 国际化处理： 卖出账户为空！*/
        return;
    }
}

/*molv2xN0M1ZekFD4U1hgab/oWRkxXcfIr4BT4qjaoO526GZNdztXhBgNCN+wNqFA*/