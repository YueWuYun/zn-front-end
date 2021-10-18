/*mgBVjmwkvoNAq04L4PpN6WDkBpc5Cb+fBrnTboDV4bHkyBfePqzKLrUts+/FRsG3*/
import { CARD_FORM_CODE,CARD_PAGE_CODE,CARD_TABLE_CODE } from "./../../cons/constant";

export function beforeEvent(props, moduleId, key, value, changedrows, i, s, g) {
	if (changedrows instanceof Array) {
		if (changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
			return;
		}
	}

	//表头编辑后事件
	if (moduleId == this.formId) {
		let data = null
		switch (key) {
			case 'pk_org':
				
				break;
			default:
				
				break;
		}
	}

	//表体编辑后事件
	if (moduleId == this.tableId) {
		
	}
}

/*mgBVjmwkvoNAq04L4PpN6WDkBpc5Cb+fBrnTboDV4bHkyBfePqzKLrUts+/FRsG3*/