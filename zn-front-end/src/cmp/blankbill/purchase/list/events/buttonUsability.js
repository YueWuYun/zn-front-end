/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { BBP_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { LIST_TABLECODE } = APP_INFO;
const {ADD_GROUP,ADD_BTN,EDIT_BTN,DELETE_BTN,PRINT_BTN,PRINT_GROUP,OUTPUT_BTN,REFRESH_BTN} = BTN;
export default function  buttonUsability(props,status) {
	let selectData = props.table.getCheckedRows(LIST_TABLECODE);
	if(selectData.length==0){
		props.button.setButtonDisabled( [
			ADD_GROUP,EDIT_BTN,DELETE_BTN,PRINT_BTN,PRINT_GROUP,OUTPUT_BTN
		], true);
	}else{
		props.button.setButtonDisabled( [
			ADD_GROUP,EDIT_BTN,DELETE_BTN,PRINT_BTN,PRINT_GROUP,OUTPUT_BTN
		], false);
	}
};

/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/