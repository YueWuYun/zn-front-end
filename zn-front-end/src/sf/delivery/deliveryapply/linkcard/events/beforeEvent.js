/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/
import { ajax, toast } from 'nc-lightapp-front';
import { jsoncode } from '../../util/const.js';
export default function bodyBeforeEvent(props, moduleId, key, value, i, record, status) {
	let pk_org = props.form.getFormItemsValue(jsoncode.formcode, 'pk_org').value
	switch (key) {
		//网银上缴
		case "isnetpay":
			let pk_bankacc_p = props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, i, 'pk_bankacc_p');
			if (pk_bankacc_p && pk_bankacc_p.value) {
				let isnetpaydata = {
					attrcode: key,
					userObj: pk_bankacc_p && pk_bankacc_p.value,
				}
				ajax({
					url: '/nccloud/sf/delivery/deliverybodybeforeevent.do',
					data: isnetpaydata,
					success: (res) => {
						if (res.success) {
							if (res.data) {
								props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'isnetpay', res.data);
								// return res.data;
							}
						}
					}
				});
			}
			return true;
			break;
		default:
			return true
			break;
	}
} 

/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/