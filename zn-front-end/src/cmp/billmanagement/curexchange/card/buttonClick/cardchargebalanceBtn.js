/*zFKiup0HVO6al8Wg8RtWg6s0On02mpmSnKovsGcGR0kcYLJ0Nasfq+skk6dieqhg*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-手续费查询按钮
 * @param {*} props  
 */
export const cardchargebalanceBtn = function () {
    let chargebalanceBtnArr = [];
    let pk_paychargeacct = null;
    if (this.props.form.getFormItemsValue(this.formId, 'pk_paychargeacct').value) {
        pk_paychargeacct = this.props.form.getFormItemsValue(this.formId, 'pk_paychargeacct').value;
        let pk_charge_org = null;
        if (this.props.form.getFormItemsValue(this.formId, 'pk_org').value) {
            pk_charge_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
        }
        //修改请求联查方式
        let query_charge_data = {
            pk_org: pk_charge_org, //财务组织id
            pk_account: pk_paychargeacct, //银行账户id，没有可不写，和现金账户二选一
            pk_cashaccount: null //现金账户id，没有可不写
        }
        chargebalanceBtnArr.push(query_charge_data);//卖出银行账号
        this.setState({
            showOriginalData: chargebalanceBtnArr,
            showOriginal: true,
        });
    } else {
        toast(
            {
                color: 'warning',
                content: this.props.MutiInit.getIntl("36070FCE") &&
                    this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000015')
            });/* 国际化处理： 手续费账户为空！*/
        return;
    }
}

/*zFKiup0HVO6al8Wg8RtWg6s0On02mpmSnKovsGcGR0kcYLJ0Nasfq+skk6dieqhg*/