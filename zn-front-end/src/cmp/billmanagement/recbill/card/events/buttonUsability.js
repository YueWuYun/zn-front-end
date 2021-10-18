/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/
/**
 * [收款]-卡片表体按钮是否可用
 * @param {*} props 
 * @param {*} hasOrg 是否有组织true/false
 */
export const buttonUsability = function (props) {
	let check_Num = this.props.cardTable.getCheckedRows(this.tableId);//所选行数
	let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') == null ? null : this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
	if (pk_org) {
		//卡片中有财务组织
		props.button.setButtonDisabled([
			'deletebodyBtn',//表体删除
			'copybodyBtn'//表体复制行
		], true);

		props.button.setButtonDisabled(
			[
				'addbodyBtn',//表体新增
			],
			false
		);

		if (check_Num && check_Num.length > 0) {
			//选择数据即可操作
			props.button.setButtonDisabled([
				'deletebodyBtn',//表体删除
				'copybodyBtn'//表体复制行
			], false);
		}
	} else {
		//未设置组织的时候，按钮不可点击
		props.button.setButtonDisabled([
			'addbodyBtn',//表体新增
			'deletebodyBtn',//表体删除
			'copybodyBtn'//表体复制行
		], true);
	}
};

/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/