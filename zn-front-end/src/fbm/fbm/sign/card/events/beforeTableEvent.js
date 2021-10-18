/*STDl2art2qn2l86JAyoCNKwRbz1qb66dPhG78hrp/5+Dwu/sSBDPLAg8PArsNiH4*/
import {
	cardEvent
} from '../../../../public/container/index';

export function beforeTableEvent(
  props,
  moduleId,
  key,
  value,
  index,
  record,
  status
) {
  	// 需要校验模块是否启用的字段
	const checkModuleEnable = ['pk_guarantee',];
  if(checkModuleEnable.includes(key)){
		//校验moduleCode对应模块是否开启
		let moduleCode = key =='pk_guarantee'?"3662":"";
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
/*STDl2art2qn2l86JAyoCNKwRbz1qb66dPhG78hrp/5+Dwu/sSBDPLAg8PArsNiH4*/