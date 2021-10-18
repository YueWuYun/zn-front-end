/*2+0Qf+roUlDHXBeA/o9JMGpngx6mRLzeeckBoa7ZnDExoDpVCBk7Msmh7CDdTbDQ*/
/**
 * 按钮显隐性控制
 * @param {*} props  页面内置对象
 */
export function buttonVisible(props) {
	let status = props.getUrlParam('status');
	let id = props.getUrlParam('id');
	let isBrowse = status === 'browse';
	let buttons = props.button.getButtons();
	let enablestate =
		props.form.getFormItemsValue(this.formId, 'enable_state') &&
		props.form.getFormItemsValue(this.formId, 'enable_state').value;
	let btnObj = {};
	let showBtn = [];
	if (!isBrowse) {
		//编辑态
		this.setState({ showPagination: false });
		showBtn = [ 'SaveGroup', 'Save', 'Saveadd', 'Cancel', 'addrow_i', 'deleterow_i' ];
	} else {
		if (id) {
			// 非新增浏览态
			this.setState({ showPagination: true });
			showBtn = [ 'Button_Group', 'Add', 'Revise', 'Delete', 'Endefault_i', 'Print', 'PrintOut', 'Refresh' ];
			//判断启用停用状态
			if (enablestate === '1') {
				showBtn.push('Disenable');
			} else {
				showBtn.push('Enable');
			}
		} else {
			// 新增浏览态
			showBtn = [ 'AddBrowse' ];
		}
	}
	for (let item of buttons) {
		btnObj[item.key] = showBtn.includes(item.key);
	}

	props.button.setButtonVisible(btnObj);
	props.form.setFormStatus(this.formId, isBrowse ? 'browse' : 'edit');
	props.cardTable.setStatus(this.tableId, isBrowse ? 'browse' : 'edit');
}

/*2+0Qf+roUlDHXBeA/o9JMGpngx6mRLzeeckBoa7ZnDExoDpVCBk7Msmh7CDdTbDQ*/