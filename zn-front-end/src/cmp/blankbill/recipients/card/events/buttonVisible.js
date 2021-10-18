/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { CMPIVPara } from '../../../../pub/utils/CMPIVPara';//税务参数查询
import {BBR_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { APPCODE, LIST_PAGECODE, CARD__PAGECODE, CARD_FORMCODE, CARD_TABLECODE, BODY_EDIT_CODE} = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD
const { BBR_CACHEKEY,BBR_PKNAMEKEY,BBR_STATEKEY,SEARCH_KEY,LINK_KEY,SAVED,APPROVING } = BBR_CONST
const { QUERY, QUERYBYIDS, QUERYCARD, SAVE, DELETE, PRINT } = REQUEST_URL;
const {
	ADD_GROUP,
	ADD_BTN,
	EDIT_BTN,
	DELETE_BTN,
	PRINT_BTN,
	PRINT_GROUP,
	OUTPUT_BTN,
	SAVE_GROUP,
	SAVE_BTN,
	SAVEADD_BTN,
	CANCEL_BTN,
	REFRESH_BTN
} = BTN

export const buttonVisible = function(props) {
	let status = props.getUrlParam('status');
	let src = props.getUrlParam('src');
	// browse ===false ,edit ===true
	let flag = status === 'browse' ? false : true;
	let opr=this.props.getUrlParam('op') ;
	let pk_note = this.props.getUrlParam('id');
	let pasteflag = this.state.pasteflag || false;
	let bill_status = props.form.getFormItemsValue(this.formId, 'bill_status') && props.form.getFormItemsValue(this.formId, 'bill_status').value;
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
		props.button.setButtonVisible([ 
			SAVE_GROUP,
			SAVE_BTN,
			SAVEADD_BTN,
			CANCEL_BTN,
		], flag);
	}
	if (status === 'browse') {
		if(pk_note){
			switch(bill_status){
				case '2':
					// 已报销
					props.button.setButtonVisible(
						[
							ADD_GROUP,
							ADD_BTN,
							PRINT_BTN,
							PRINT_GROUP,
							OUTPUT_BTN, 
							REFRESH_BTN
						],
						!btnflag
					);
					break;
				default:
					//浏览态固定显示
					props.button.setButtonVisible(
						[
							ADD_GROUP,
							ADD_BTN,
							EDIT_BTN,
							DELETE_BTN,
							PRINT_BTN,
							PRINT_GROUP,
							OUTPUT_BTN, 
							REFRESH_BTN
						],
						!btnflag
					);
					break;
			}
		}else{
			props.button.setButtonVisible([
				ADD_GROUP,
				ADD_BTN,
			], !btnflag);
		}
	}
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag); //设置看片翻页的显隐性
	if (src) {
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置看片翻页的显隐性
	}
};

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/