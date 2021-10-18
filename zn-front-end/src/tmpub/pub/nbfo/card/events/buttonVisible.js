/*2+0Qf+roUlDHXBeA/o9JMGpngx6mRLzeeckBoa7ZnDExoDpVCBk7Msmh7CDdTbDQ*/
/**
 * 按钮显隐性
 * @param {*} props  页面内置对象
 */
export function buttonVisible(props) {
	let { isPaste } = this.state;
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
		if (!isPaste) {
			showBtn = [ 'Save', 'Cancel' ];
		} else {
			showBtn = [ 'Save', 'Cancel' ];
		}
	} else {
		//浏览态
		if (id) {
			// 非新增浏览态
			this.setState({ showPagination: true });
			showBtn = [ 'Button_Group', 'Add', 'Revise', 'Delete', 'Account', 'Refresh', 'Print', 'Printout' ];
			//判断启用停用状态
			if (enablestate == 1) {
				showBtn.push('Disenable');
			} else {
				showBtn.push('Enable');
			}
		} else {
			// 新增浏览态
			showBtn = [ 'AddBrowse' ];
		}
	}
	// for循环的目的是拼接成{a: true, b: false, ...}, 来控制按钮的显隐性
	for (let item of buttons) {
		btnObj[item.key] = showBtn.includes(item.key);
	}

	props.button.setButtonVisible(btnObj);
	props.form.setFormStatus(this.formId, isBrowse ? 'browse' : 'edit');
}

/*2+0Qf+roUlDHXBeA/o9JMGpngx6mRLzeeckBoa7ZnDExoDpVCBk7Msmh7CDdTbDQ*/