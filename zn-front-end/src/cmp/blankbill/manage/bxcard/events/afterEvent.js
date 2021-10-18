/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax, toast, promptBox } from 'nc-lightapp-front';

import {BBM_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { APPCODE, LIST_PAGECODE, BX_PAGECODE, FORM_BBM_BX01, TABLE_BBM_BX01, BODY_EDIT_CODE} = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD

const { ORGCHANGE } = REQUEST_URL
export default function afterEvent(props, moduleId, key, value, changedrows, i) {
    
        // 报销人
	if (key == 'bx_person') {
		if (moduleId === FORM_BBM_BX01) {
			let bx_person = props.form.getFormItemsValue(moduleId, 'bx_person');
			if(bx_person){
				props.cardTable.setColValue(TABLE_BBM_BX01, 'bx_person', { value: bx_person.value, display: bx_person.display });
			}
		}
	}
	
	
}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/