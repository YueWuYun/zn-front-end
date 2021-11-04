//kmMeNHXPpdljPj98yiqeQdKlz3xdyvJpl3AGIOS31WSgypzUaa2eii52arHt4qo0
/*
 * 按钮控制器 
 * @Author: yangls7 
 * @Date: 2019-04-28 10:21:42 
 * @Last Modified by: yangls7
 * @Last Modified time: 2019-07-10 13:34:34
 */
import { BUTTONS, UISTATE, PAGEAREA } from '../constance';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

export default function(props, status = UISTATE.browse) {
	if (status == UISTATE.browse) {
		//浏览态按钮状态
		let visibleBtns = {
			[BUTTONS.Edit]: true,
			[BUTTONS.Print]: true,
			[BUTTONS.Add]: true,
			[BUTTONS.Delete]: true,
			[BUTTONS.Refresh]: true,
			[BUTTONS.Save]: false,
			[BUTTONS.Cancel]: false
		};
		props.button.setButtonsVisible(visibleBtns);
		props.button.setPopContent(BUTTONS.Delete, getLangByResId(this, '4001MST-000029')); /* 国际化处理： 确定要删除吗？*/
	} else if (status == UISTATE.edit) {
		//编辑态按钮状态
		let visibleBtns = {
			[BUTTONS.Edit]: false,
			[BUTTONS.Print]: false,
			[BUTTONS.Add]: true,
			[BUTTONS.Delete]: true,
			[BUTTONS.Refresh]: false,
			[BUTTONS.Save]: true,
			[BUTTONS.Cancel]: true
		};
		props.button.setButtonsVisible(visibleBtns);
		props.button.setPopContent(BUTTONS.Delete);
	}
	setButtonsEnable.call(this, props, status);
}
/**
 * 控制按钮可不可用
 * @param {*} props 
 */
function setButtonsEnable(props) {
	//如果主组织没有值都不可以用
	let enableBtns = {
		[BUTTONS.Add]: true,
		[BUTTONS.Edit]: true,
		[BUTTONS.Delete]: true,
		[BUTTONS.Print]: true,
		[BUTTONS.Output]: true,
		[BUTTONS.Refresh]: true
	};
	let mainOrg = this.state.pk_org && this.state.pk_org.value;
	if (!mainOrg) {
		props.button.setButtonDisabled(enableBtns);
		return;
	} else {
		enableBtns[BUTTONS.Refresh] = false;
		enableBtns[BUTTONS.Add] = false;
	}
	//选中控制
	let selectRows = props.editTable.getCheckedRows(PAGEAREA.list);
	let selectflag = selectRows.length > 0 ? false : true;
	enableBtns[BUTTONS.Delete] = selectflag;
	enableBtns[BUTTONS.Print] = selectflag;
	enableBtns[BUTTONS.Output] = selectflag;

	//当没有数据的时候编辑不可用
	let rows = props.editTable.getNumberOfRows(PAGEAREA.list);
	let rowflag = rows > 0 ? false : true;
	enableBtns[BUTTONS.Edit] = rowflag;
	props.button.setButtonDisabled(enableBtns);
}

//kmMeNHXPpdljPj98yiqeQdKlz3xdyvJpl3AGIOS31WSgypzUaa2eii52arHt4qo0