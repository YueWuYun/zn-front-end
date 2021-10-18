/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/
import { ajax, toast } from 'nc-lightapp-front';
import { jsoncode } from '../../util/const.js';
export default function bodyBeforeEvent(props, moduleId, key, value, i, record, status) {
	let pk_org = props.form.getFormItemsValue(jsoncode.formcode, 'pk_org').value
	
	switch (key) {
		//网银上缴
		case "isnetpay":
		debugger
		//冲销业务，是，则网银上收为 否，不可编辑
		let isreversebustype = props.form.getFormItemsValue(jsoncode.formcode, 'isreversebustype') && props.form.getFormItemsValue(jsoncode.formcode, 'isreversebustype').value;
		if(isreversebustype){
			return false;
		}	
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
								debugger
								props.cardTable.setEditableByIndex(jsoncode.ctablecode, i, 'isnetpay', res.data);
								//return res.data;
							}
						}
					}
				});
			}
			return true;
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
		}
		return true;
			break;
		//本币汇率
		case "olcrate":
		let olcrate = props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, i, 'olcrate')&& props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, i, 'olcrate').value;
		if(olcrate==1){
			return false
		}else{
			return true;
		}
			break;
		default:
			return true
			break;
	}
} 

/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/