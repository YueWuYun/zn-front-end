//FhGt8mVXHBYBQ3wFaJJd7VfYIfHu6Ad+f0YVYScpli+rn9cXPhyX+/AGyq/BaKln
/*
 * @Author: zhaopym 
 * @Date: 2019-03-15 14:51:05 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-07-10 13:39:37
 */
import { BUTTON, BUTTON_BROWSE, BUTTON_EDIT, STATUS, AREA } from '../constants';
import { getLangByResId } from '../../pub/tool/multiLangUtil';

function togglePageStatus(props, status) {
	// 1.切换state中的页面状态字段
	this.UIStatus = status;
	// 2.切换按钮状态
	initButtons(props, status);
	setButtonEnable(props);
	// 3.切换表格状态
	let { editTable } = props;
	let { setStatus } = editTable;
	setStatus(AREA.table_head, status);
	setStatus(AREA.table_body, status);
	if (STATUS.browse == status) {
		props.button.setPopContent(BUTTON.Delete_inline_head, getLangByResId(this, '4004PRICETEMPLET-000011'));/* 国际化处理： 确定要删除吗？*/
	} else {
		props.button.setPopContent(BUTTON.Delete_inline_head);
	}
}
/**
 * 控制按钮的可用性
 * @param { } props 
 * @param {*} status 
 */
function setButtonEnable(props) {
	//浏览太只有勾选表头数据删除才可用
	let checkedRows = props.editTable.getCheckedRows(AREA.table_head);
	if (checkedRows && checkedRows.length > 0) {
		props.button.setButtonDisabled(BUTTON.Delete, false);
	} else {
		props.button.setButtonDisabled(BUTTON.Delete, true);
	}
}

/**
 * 按页面状态初始化按钮
 * @param {*} props 
 * @param {*} status 
 */
function initButtons(props, status) {
	let { button } = props;
	let { setButtonVisible, setButtonDisabled } = button;
	switch (status) {
		case STATUS.browse:
			// 浏览态
			setButtonVisible(BUTTON_EDIT, false);
			setButtonVisible(BUTTON_BROWSE, true);
			let browse_btns = {
				Add: false,
				Delete: false,
				Refresh: false
			};
			setButtonDisabled(browse_btns);
			break;
		case STATUS.edit:
			// 编辑态
			setButtonVisible(BUTTON_BROWSE, false);
			setButtonVisible(BUTTON_EDIT, true);
			break;
		default:
			break;
	}
}
function headNotNull(props) {
	let { editTable } = props;
	let { getNumberOfRows, setButtonDisabled } = editTable;
	let count = getNumberOfRows(AREA.table_head);
	if (count > 0) {
		return true;
	} else {
		return false;
	}
}
export { togglePageStatus, setButtonEnable };

//FhGt8mVXHBYBQ3wFaJJd7VfYIfHu6Ad+f0YVYScpli+rn9cXPhyX+/AGyq/BaKln