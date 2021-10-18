/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
/**
 * @auther zhanghe
 * 列表置灰
 */
import { tableId, searchId, pagecode, formId_01, oid } from '../constants';

export const buttonVisible = function (props) {
	let selectdata = props.table.getCheckedRows(tableId);
	
	//设置新增为主要按钮	
	if (!selectdata || selectdata.length == 0) {
		//没有选中
		props.button.setButtonDisabled(['claim','print','printout'], true);
	} else {
		props.button.setButtonDisabled(['claim','print','printout'], false);
	}
	
}




///////////////////////////////////////////////////////////////
//列表批量不需要判断了
	// let tabCode = this.state.tabInfo;		
	// if (tabCode == LIST_PAGE_INFO.GROUP.NEEDCOMMIT) {
	// 	// 待提交
	// 	props.button.setButtonDisabled(LIST_BUTTON_USE.NEEDCOMMIT, false);
	// 	props.button.setButtonDisabled(LIST_BUTTON_NOT.NEEDCOMMIT, true);

	// } else if (tabCode == LIST_PAGE_INFO.GROUP.NEEDGENERATE) {
	// 	// 待生成
	// 	props.button.setButtonDisabled(LIST_BUTTON_USE.NEEDGENERATE, false);
	// 	props.button.setButtonDisabled(LIST_BUTTON_NOT.NEEDGENERATE, true);

	// } else if (tabCode == LIST_PAGE_INFO.GROUP.ALL) {
	// 	// 全部
	// 	props.button.setButtonDisabled(LIST_BUTTON_USE.ALL, false);
	// 	props.button.setButtonDisabled(LIST_BUTTON_NOT.ALL, true);

	// } 
///////////////////////////////////////////////////////////////

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/