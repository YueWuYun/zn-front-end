/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {  promptBox } from 'nc-lightapp-front';

import {BBM_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';

const { APPCODE, LIST_PAGECODE, ZF_PAGECODE, FORM_BBM_ZF01, FORM_BBM_ZF02,TABLE_BBM_ZF01, BODY_EDIT_CODE} = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD
const { QUERY, QUERYBYIDS, QUERYCARD, SAVE, DELETE, PRINT } = REQUEST_URL;
const { SAVE_BTN, CANCEL_BTN, } = BTN
export default function(props, id) {
	

	switch (id) {
		case SAVE_BTN: //保存按钮
			this.saveBill();
			break;

		case CANCEL_BTN:
			
			promptBox({
				color: 'warning',
				hasCloseBtn: false,
				title: this.state.json['36070BBM-000013'], //this.modalContent(), //取消*/
				content: this.state.json['36070BBM-000014'],//this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否确认取消*/
				beSureBtnClick: () => {
					this.close();
				}
			});
			break;

		default:
			break;
		//返回
	}
}


/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/