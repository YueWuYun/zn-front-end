/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/
import { ajax, toast } from 'nc-lightapp-front';
import { FormBeforeEvent } from '../../util/TableRefFilter';
import {BBR_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { APPCODE, LIST_PAGECODE, CARD__PAGECODE, CARD_FORMCODE, CARD_TABLECODE, BODY_EDIT_CODE} = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD
const { BBR_CACHEKEY,BBR_PKNAMEKEY,BBR_STATEKEY,SEARCH_KEY,LINK_KEY,SAVED,APPROVING } = BBR_CONST

export default function beforeEvent(props, moduleId, key, value, index, record) {
	let pk_org = props.form.getFormItemsValue(CARD_FORMCODE, 'pk_org');
	if (moduleId == CARD_FORMCODE) {
		switch (key) {
			 default:
			  	FormBeforeEvent.call(this,props, moduleId, key, value, index, record);
				return true; //默认单元格都可操作
				break;
		}
	}
	return true;
}

/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/