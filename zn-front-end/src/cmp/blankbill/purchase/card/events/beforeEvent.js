/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/
import { ajax, toast } from 'nc-lightapp-front';
import { FormBeforeEvent } from '../../util/TableRefFilter';
import { BBP_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const {APPCODE, CARD__PAGECODE, CARD_TABLECODE, CARD_FORMCODE, } = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG, PKNOTETYPE } = BILL_FIELD
const { BBP_CACHEKEY } = BBP_CONST

export default function beforeEvent(props, moduleId, key, value, index, record) {
	if (moduleId == CARD_FORMCODE) {
		switch (key) {
			
			 default:
			  	FormBeforeEvent.call(this,props, moduleId, key);
				return true; //默认单元格都可操作
				break;
		}
	}
}

/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/