/*mgBVjmwkvoNAq04L4PpN6WDkBpc5Cb+fBrnTboDV4bHkyBfePqzKLrUts+/FRsG3*/
import { ajax, toast } from 'nc-lightapp-front';
export function beforeEvent(props, moduleId, key, value, data) {
	const currType = ['olcrate', 'glcrate', 'gllcrate', 'discountinterest', 'onlinebankflag'];
	if (currType.includes(key)) {
		let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org'); //财务组织
		let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_curr'); //源币
		//主键，判断是否是新增还是修改
		let pk_discount = props.form.getFormItemsValue(this.formId, this.primaryId).value;
		if (!pk_discount) {
			// 新增，能进来的即可修改
			return true;
		}
		if (key === 'discountinterest') {
			let buyerinterest = props.form.getFormItemsValue(this.formId, 'buyerinterest').value;
			if (buyerinterest) {
				return false;
			} else {
				return true;
			}
		}
		const CurrtypeData = {
			pk_org: pk_org && pk_org.value,
			pk_currtype: pk_currtype && pk_currtype.value,
			field: key,
			pk: pk_discount
		};
		let flag = false;
		ajax({
			url: this.API_URL.beforeEvent,
			async: false,
			data: CurrtypeData,
			success: (res) => {
				flag = res.data;
			},
			error: (res) => {
				toast({ color: 'danger', content: res.message });
			}
		})
		return flag;
	} else {
		return true;
	}
}
/*mgBVjmwkvoNAq04L4PpN6WDkBpc5Cb+fBrnTboDV4bHkyBfePqzKLrUts+/FRsG3*/