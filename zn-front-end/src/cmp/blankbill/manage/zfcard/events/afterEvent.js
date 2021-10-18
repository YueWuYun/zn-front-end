/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax, toast, promptBox } from 'nc-lightapp-front';
import { buildLightBodyAfterEditData } from '../../../../../tmpub/pub/util/index';
import {BBM_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { APPCODE, LIST_PAGECODE, ZF_PAGECODE, FORM_BBM_ZF01, FORM_BBM_ZF02,TABLE_BBM_ZF01, BODY_EDIT_CODE} = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD
const { ORGCHANGE } = REQUEST_URL

export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	
	   // 作废原因
       if (key == 'zf_reason') {
		if (moduleId === FORM_BBM_ZF01) {
			let zf_reason = props.form.getFormItemsValue(moduleId, 'zf_reason');
			if(zf_reason){
				props.cardTable.setColValue(TABLE_BBM_ZF01, 'zf_reason', { value: zf_reason.value, display: zf_reason.value });
			}
		}
	}
	
	
}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/