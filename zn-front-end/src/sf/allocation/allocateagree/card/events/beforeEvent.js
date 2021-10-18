/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/
import { ajax, toast } from 'nc-lightapp-front';
//引入配置常量定义
import { module_id, base_url, card_page_id, card_from_id, card_table_id } from '../../cons/constant.js';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
export default function bodyBeforeEvent(props, moduleId, key, value, index, record) {
	switch (key) {
		//汇款速度	
		case "paytype":
			//当勾选网银支付后 汇款速度可编辑
			let isnetpay = record.values.isnetpay.value;
			if (isnetpay) {
				return true;
			} else {
				return false;
			}
			break;
		case "agreeamount":
		case "agreeolcamount":
			let isagree = record.values.isagree.value;
			if (isagree == '0') {
				return false;
			} else {
				return true;
			}
			break;
		case "olcrate":
			let applyolcrate = props.cardTable.getValByKeyAndIndex(card_table_id, index, 'olcrate') &&
				props.cardTable.getValByKeyAndIndex(card_table_id, index, 'olcrate').value;
			if (applyolcrate == 1) {
				return false;
			} else
				return true;
		default:
			return true
			break;
	}
} 

/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/