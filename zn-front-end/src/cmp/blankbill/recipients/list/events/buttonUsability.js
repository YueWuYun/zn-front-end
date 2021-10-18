/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/
import { ajax, base, toast } from 'nc-lightapp-front';
import {BBR_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { APPCODE, LIST_PAGECODE, SEARCH_CODE, LIST_TABLECODE, CARD__PAGECODE } = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD
const { BBR_CACHEKEY,BBR_PKNAMEKEY,BBR_STATEKEY,SEARCH_KEY,LINK_KEY,SAVED,APPROVING } = BBR_CONST
const { ADD_GROUP,ADD_BTN,DELETE_BTN,PRINT_BTN,PRINT_GROUP,OUTPUT_BTN,REFRESH_BTN } = BTN
export default function  buttonUsability(props,status) {
	let selectData = props.table.getCheckedRows(LIST_TABLECODE);
	if(selectData.length==0){
		props.button.setButtonDisabled( [
			ADD_GROUP,DELETE_BTN,PRINT_BTN,PRINT_GROUP,OUTPUT_BTN
		], true);
	}else{
		props.button.setButtonDisabled( [
			ADD_GROUP,DELETE_BTN,PRINT_BTN,PRINT_GROUP,OUTPUT_BTN
		], false);
	}
};

/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/