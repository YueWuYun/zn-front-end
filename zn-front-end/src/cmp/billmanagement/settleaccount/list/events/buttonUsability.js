/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息

/**
 * [结账]-[列表按钮置灰处理]
 * @param {*} props 
 * @param {*} status 
 */
export default function buttonUsability(props, status) {
	
	let tableId = Templatedata.list_tableid;
	let selectData = props.table.getCheckedRows(tableId);
	if (selectData.length == 0) {
		props.button.setButtonDisabled([
			
			'settleAccountBtn',	//结账
			'unSettleAccountBtn'//取消
		], true);
		props.button.setButtonDisabled([
			'refreshBtn'	//刷新
		], false);
	};
	if (selectData.length >= 1) {
		props.button.setButtonDisabled([
			'settleAccountBtn',	//结账
			'unSettleAccountBtn'//取消
		], false);
	}
};

/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/