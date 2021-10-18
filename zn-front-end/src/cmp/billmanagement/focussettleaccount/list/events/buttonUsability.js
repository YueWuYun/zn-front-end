/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/
/**
 * [集中结账]-[列表按钮置灰处理]
 * @param {*} props 
 * @param {*} status 
 */
export default function buttonUsability(props, status) {

	let selectData = props.table.getCheckedRows(this.tableId);
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