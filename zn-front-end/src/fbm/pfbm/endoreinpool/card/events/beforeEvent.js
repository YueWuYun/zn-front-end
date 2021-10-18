/*mgBVjmwkvoNAq04L4PpN6WDkBpc5Cb+fBrnTboDV4bHkyBfePqzKLrUts+/FRsG3*/
import {
	cardEvent
} from '../../../../public/container/index';
import {
	setHeadItemsDisabled
} from '../../../../public/container/page';
import { ajax, toast } from 'nc-lightapp-front';
export function beforeEvent(props, moduleId, key, value, data) {
	const rateFileds = ['olcrate', 'glcrate', 'gllcrate'];
	if (rateFileds.includes(key)) {
		let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org'); //财务组织
		let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_curr'); //源币
		//主键，判断是否是新增还是修改
		let pk_endore = props.form.getFormItemsValue(this.formId, this.primaryId);
		if (!(pk_endore && pk_endore.value)) {
			// 新增，能进来的即可修改
			return true;
		}

		const rateData = {
			pk_org: pk_org && pk_org.value,
			pk_curr: pk_currtype && pk_currtype.value,
			field: key,
			pk: pk_endore && pk_endore.value,
		};
		let flag = false;
		ajax({
			url: this.API_URL.ratebeforeevent,
			async: false,
			data: rateData,
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