/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';
import buttonUsability from './buttonUsability';
import {BBR_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { APPCODE, LIST_PAGECODE, SEARCH_CODE, LIST_TABLECODE, CARD__PAGECODE } = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD
const { BBR_CACHEKEY,BBR_PKNAMEKEY,BBR_STATEKEY,SEARCH_KEY,LINK_KEY,SAVED,APPROVING } = BBR_CONST
const { QUERY, QUERYBYIDS, QUERYCARD, SAVE, DELETE, PRINT } = REQUEST_URL;
export default function(props, config, pks) {
	let that = this;
	// 后台还没更新，暂不可用
	let data = {
		pks: pks,
		pageid: LIST_PAGECODE
	};
	ajax({
		url: QUERYBYIDS,
		data: data,
		success: function(res) {
			that.props.table.setAllTableData(LIST_TABLECODE, res.data[LIST_TABLECODE]);
			buttonUsability.call(that, that.props,null);
		}
	});
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/