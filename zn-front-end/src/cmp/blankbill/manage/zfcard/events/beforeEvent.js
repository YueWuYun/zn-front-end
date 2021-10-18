/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/
import { ajax, toast } from 'nc-lightapp-front';
import { FormBeforeEvent } from '../../util/ZFTableRefFilter';
import {BBM_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { APPCODE, LIST_PAGECODE, ZF_PAGECODE, FORM_BBM_ZF01, FORM_BBM_ZF02,TABLE_BBM_ZF01, BODY_EDIT_CODE} = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD

export default function beforeEvent(props, moduleId, key, value, index, record) {
	let pk_org = props.form.getFormItemsValue(FORM_BBM_ZF01, 'pk_org');
	if (moduleId == FORM_BBM_ZF01) {
		switch (key) {
			 default:
			  	FormBeforeEvent.call(this,props, moduleId, key);
				return true; //默认单元格都可操作
				break;
		}
	}
	return true;
}

/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/