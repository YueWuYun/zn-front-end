/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';
import buttonUsability from './buttonUsability';
import { BBP_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { LIST_PAGECODE, LIST_TABLECODE, SEARCH_CODE } = APP_INFO;
const { QUERYBYIDS } = REQUEST_URL;
export default function(props, config, pks) {
	let that = this;
	//buttonUsability.call(this, this.props,null);
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