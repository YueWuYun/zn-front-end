/*mgBVjmwkvoNAq04L4PpN6WDkBpc5Cb+fBrnTboDV4bHkyBfePqzKLrUts+/FRsG3*/
//应收票据退票——保存前事件
import {
	cardEvent
} from '../../../../public/container/index';
export function beforeEvent(props, moduleId, key, value, data) {
	const currType = ['olcrate', 'glcrate', 'gllcrate'];
	if (currType.includes(key)) {
		let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value; //财务组织
		let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_currtype').value; //源币
		let rateType = '';
		if (key === 'olcrate') {
			rateType = 'rate';
		} else if (key === 'glcrate') {
			rateType = 'grouprate';
		} else if (key === 'gllcrate') {
			rateType = 'globalrate';
		}
		const CurrtypeData = {
			pk_org: pk_org,
			pk_currtype: pk_currtype,
			ratekey: rateType
		};
		let editTable = cardEvent.getBeforeEventCurrtype.call(this, CurrtypeData).then((res) => {
			if (res.data) {
				return true;
			} else {
				return false;
			}
		});
		return editTable;
	} else {
		return true;
	}
}

/*mgBVjmwkvoNAq04L4PpN6WDkBpc5Cb+fBrnTboDV4bHkyBfePqzKLrUts+/FRsG3*/