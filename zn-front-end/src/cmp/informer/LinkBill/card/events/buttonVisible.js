/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
/**
 * @auther zhanghe
 * 列表置灰
 */
let tableId = 'table';
let formId = 'form';
export const buttonVisible = function (props) {
	let pk = props.form.getFormItemsValue(formId, ['pk_lower'])[0].value;	
	
	if (!pk) {
		//没有选中
		//props.button.setButtonDisabled(['query'], true);
		props.button.setButtonVisible(['query'], false);
	} else {
		//props.button.setButtonDisabled(['query'], false);
		props.button.setButtonVisible(['query'], true);
	}
	
}




/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/