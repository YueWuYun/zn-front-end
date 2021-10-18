/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import {
	ajax,
	base,
	toast
} from 'nc-lightapp-front';

import {
	BBP_CONST,
	APP_INFO,
	BILL_FIELD,
	REQUEST_URL,
	BTN
} from '../../cons/constant.js';
const {
	ADD_GROUP,
	ADD_BTN,
	EDIT_BTN,
	DELETE_BTN,
	PRINT_BTN,
	PRINT_GROUP,
	OUTPUT_BTN,
	EDIT_INNER_BTN,
	DELETE_INNER_BTN,
	SAVE_GROUP,
	SAVE_BTN,
	SAVEADD_BTN,
	CANCEL_BTN,
	REFRESH_BTN
} = BTN

export const buttonVisible = function (props) {
	let status = props.getUrlParam('status');
	let src = props.getUrlParam('src');
	let flag = status === 'browse' ? false : true;
	let opr = this.props.getUrlParam('op');
	let pk_note = this.props.getUrlParam('id');
	let pasteflag = this.state.pasteflag || false;
	let btnflag = false;
	// 按钮默认隐藏
	props.button.setButtonVisible(
		[
			ADD_GROUP,
			ADD_BTN,
			EDIT_BTN,
			DELETE_BTN,
			PRINT_BTN,
			PRINT_GROUP,
			OUTPUT_BTN,
			EDIT_INNER_BTN,
			DELETE_INNER_BTN,
			SAVE_GROUP,
			SAVE_BTN,
			SAVEADD_BTN,
			CANCEL_BTN,
			REFRESH_BTN
		],
		btnflag
	);
	if (flag) {
		//编辑态
		props.button.setButtonVisible([SAVE_GROUP, SAVE_BTN, SAVEADD_BTN, CANCEL_BTN], !btnflag);
	}
	if (status === 'browse') {
		if(pk_note){
			props.button.setButtonVisible([
				ADD_GROUP,
				ADD_BTN,
				EDIT_BTN,
				DELETE_BTN,
				PRINT_BTN,
				PRINT_GROUP,
				OUTPUT_BTN, REFRESH_BTN
			], !btnflag);
		}else{
			props.button.setButtonVisible([
				ADD_GROUP,
				ADD_BTN,
			], !btnflag);
		}
	}
	if(flag){
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置看片翻页的显隐性
	}else{
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag); //设置看片翻页的显隐性
	}
	if (src) {
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置看片翻页的显隐性
	}
};
/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/