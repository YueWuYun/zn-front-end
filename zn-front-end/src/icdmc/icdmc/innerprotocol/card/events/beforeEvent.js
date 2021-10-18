/*mgBVjmwkvoNAq04L4PpN6WDkBpc5Cb+fBrnTboDV4bHkyBfePqzKLrUts+/FRsG3*/
import { getBeforeEventCurrtype } from "../../../public/cardEvent";
/**
 * 卡片编辑前事件
 */
export function beforeEvent(props, moduleId, key, value, data) {
    // 设置单据编号编辑前事件，不允许修改单据编号
    billnoBeforeEvent.call(this);
    // 汇率编辑前事件
    return getBeforeEventCurrtype.call(this, props, key);
}

export function billnoBeforeEvent(props) {
    //设置列得编辑性，flag=true是不可编辑，false是可编辑
    this.props.form.setFormItemsDisabled(this.formId, { vbillno: true });
}

/*mgBVjmwkvoNAq04L4PpN6WDkBpc5Cb+fBrnTboDV4bHkyBfePqzKLrUts+/FRsG3*/