/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/
import { ajax, toast } from 'nc-lightapp-front';
import { jsoncode } from '../../util/const.js';
export default function bodyBeforeEvent(props, moduleId, key, value, i, record, status) {
	let ruletype = props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, i, 'ruletype') && props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, i, 'ruletype').value;
	switch (key) {
		//内部账户
		case "pk_accid":
			let busitype = props.form.getFormItemsValue(jsoncode.formcode, 'busitype') && props.form.getFormItemsValue(jsoncode.formcode, 'busitype').value;
			// 集团上收  1
			// 中心上收 2 
			// 全局上收 3
			if (busitype == '1' || busitype == '3' ) {
				//设置内部账户不可编辑
				props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'pk_accid', false);
				return false;
			}else {
				return true;
			}
			break;
		//取整基数
		case "acceptbase":
			if (record && record.values.isacceptinteger.value) {
				return true;
			}
			return false;
			break;
		default:
			return true;
			break;
	}
} 

/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/