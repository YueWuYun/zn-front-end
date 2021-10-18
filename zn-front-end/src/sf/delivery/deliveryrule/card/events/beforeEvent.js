/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/
import { ajax, toast } from 'nc-lightapp-front';
import { jsoncode } from '../../util/const.js';
export default function bodyBeforeEvent(props, moduleId, key, value, i, record, status) {
	//let pk_org = props.form.getFormItemsValue(jsoncode.formcode, 'pk_org') && props.form.getFormItemsValue(jsoncode.formcode, 'pk_org').value
	let ruletype = props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, i, 'ruletype') && props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, i, 'ruletype').value;
	switch (key) {
		//保留余额上收：最小上收金额、余额可编辑； 定额、定率不可编辑
		//定额上收： 定额可编辑； 余额、最小上收金额、定率不可编辑
		//定率上收： 定率、最小上收金额可编辑； 余额、定额不可编辑
		//定额
		case "ration":
			// if (ruletype == '2') {//定额上收
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'ration', true);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'deliveryrate', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'leastamount', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'balance', false);
			// }
			// if (ruletype == '') {
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'ration', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'deliveryrate', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'leastamount', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'balance', false);
			// }
			if (ruletype == '2') {//定额上收
				return true;
			} else {
				return false;
			}
			break;
		//上收定率
		case "deliveryrate":
			// if (ruletype == '3') {//定率上收
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'deliveryrate', true);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'leastamount', true);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'balance', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'ration', false);
			// }
			// if (ruletype == '') {
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'ration', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'deliveryrate', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'leastamount', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'balance', false);
			// }
			if (ruletype == '3') {//定率上收
				return true;
			} else {
				return false;
			}
			break;
		//最小上收金额
		case "leastamount":
			// if (ruletype == '1') {//保留余额上收
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'leastamount', true);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'balance', true);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'ration', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'deliveryrate', false);
			// }
			// if (ruletype == '') {
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'ration', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'deliveryrate', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'leastamount', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'balance', false);
			// }
			if (ruletype == '1' || ruletype == '3') {//保留余额上收
				return true;
			} else {
				return false;
			}
			break;
		//余额
		case "balance":
			// if (ruletype == '1') {//保留余额上收
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'leastamount', true);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'balance', true);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'ration', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'deliveryrate', false);
			// }
			// if (ruletype == '3') {//定率上收
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'deliveryrate', true);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'leastamount', true);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'balance', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'ration', false);
			// }
			// if (ruletype == '') {
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'ration', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'deliveryrate', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'leastamount', false);
			// 	props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'balance', false);
			// }
			if (ruletype == '1') {//保留余额上收
				return true;
			} else {
				return false;
			}
			break;
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
			}else{
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
			return true
			break;
	}
} 

/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/