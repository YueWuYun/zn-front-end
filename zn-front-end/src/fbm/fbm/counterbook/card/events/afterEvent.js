/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
import { CARD_FORM_CODE, CARD_PAGE_CODE, CARD_TABLE_CODE, URL_LIST } from "./../../cons/constant";
import { doAjax } from "./../../utils/commonUtil";
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';

export function afterEvent(props, moduleId, key, value, changedrows, i, s, g) {
	console.log(key);
	let data = props.createHeadAfterEventData(CARD_PAGE_CODE, moduleId, [], moduleId, key, value);
	switch (key) {
		case 'pk_org':
			break;
		default:
			break;
	}

}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/