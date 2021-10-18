/*mgBVjmwkvoNAq04L4PpN6WDkBpc5Cb+fBrnTboDV4bHkyBfePqzKLrUts+/FRsG3*/
import {
	cardEvent
} from '../../../../public/container/index';
export function beforeEvent(props, moduleId, key, value, data) {
	const currType = ['olcrate', 'glcrate', 'gllcrate'];
	// 需要校验模块是否启用的字段
	const checkModuleEnable = ['ccno',];
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
	} else if(checkModuleEnable.includes(key)){
		//校验moduleCode对应模块是否开启
		let moduleCode = key =='ccno'?"3661":"";
	    let data= {
				    moduleId : moduleCode,
				    pk_group : this.props.form.getFormItemsValue(this.formId, "pk_group").value
			    };
		let moduleFlag = cardEvent.getBeforeEventModule.call(this, data).then((res) => {
			if (res.data && res.success) {
				return true;
			} else {
				return false;
			}
		});
		return moduleFlag;
	} else {
		return true;
	}
}

/*mgBVjmwkvoNAq04L4PpN6WDkBpc5Cb+fBrnTboDV4bHkyBfePqzKLrUts+/FRsG3*/