/*mgBVjmwkvoNAq04L4PpN6WDkBpc5Cb+fBrnTboDV4bHkyBfePqzKLrUts+/FRsG3*/
import { getBeforeEventCurrtype } from "../../../public/cardEvent";
/**
 * 卡片编辑前事件
 * @param {*} props
 * @param {*} moduleId
 * @param {*} key
 * @param {*} value
 * @param {*} data
 */
export default function beforeEvent(props, moduleId, key, value, data) {
    // 汇率编辑前事件
    return getBeforeEventCurrtype.call(this, props, key);
}

/*mgBVjmwkvoNAq04L4PpN6WDkBpc5Cb+fBrnTboDV4bHkyBfePqzKLrUts+/FRsG3*/