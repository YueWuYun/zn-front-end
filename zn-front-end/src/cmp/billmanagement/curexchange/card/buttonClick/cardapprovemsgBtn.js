/*SStb25r4/PmBe9PQLs9lc8wO0Uytmx4bt8NZqC2BtIiOuGGU74IlRMZHhzwiGg5j*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-审批意见按钮
 * @param {*} props  
 */
export const cardapprovemsgBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value) {
        toast(
            {
                color: 'warning',
                content: this.props.MutiInit.getIntl("36070FCE") &&
                    this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000011')
            });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    let billid = this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value;
    if (billid) {
        this.setState({
            show: true,
            billtype: Templatedata.approve_billtype,//单据类型
            billid: billid//单据pk
        });
    }
}

/*SStb25r4/PmBe9PQLs9lc8wO0Uytmx4bt8NZqC2BtIiOuGGU74IlRMZHhzwiGg5j*/