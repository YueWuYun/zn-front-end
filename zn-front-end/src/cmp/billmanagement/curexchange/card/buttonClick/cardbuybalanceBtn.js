/*6v6/JAJJtyczNGbnV33UBMMupAYoIZgyBCm09iHDF0cMcUK2DbK+OwbjhTb+gr/t*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-买入余额联查按钮
 * @param {*} props  
 */
export const cardbuybalanceBtn = function () {
    let buybalanceBtnArr = [];
    let pk_buyorg, pk_buyacct
    if (this.props.form.getFormItemsValue(this.formId, 'pk_org').value) {
        pk_buyorg = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    }
    if (this.props.form.getFormItemsValue(this.formId, 'pk_buyacct').value) {
        pk_buyacct = this.props.form.getFormItemsValue(this.formId, 'pk_buyacct').value;
        //查询条件
        let buyquery_data = {
            pk_org: pk_buyorg, //财务组织id
            pk_account: pk_buyacct, //银行账户id，没有可不写，和现金账户二选一
            pk_cashaccount: null //现金账户id，没有可不写
        }
        buybalanceBtnArr.push(buyquery_data);//买入银行账号
        this.setState({
            showOriginalData: buybalanceBtnArr,
            showOriginal: true,
        });
    } else {
        toast(
            {
                color: 'warning',
                content: this.props.MutiInit.getIntl("36070FCE") &&
                    this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000013')
            });/* 国际化处理： 查询失败,买入账户不存在！*/
        return;
    }
}

/*6v6/JAJJtyczNGbnV33UBMMupAYoIZgyBCm09iHDF0cMcUK2DbK+OwbjhTb+gr/t*/