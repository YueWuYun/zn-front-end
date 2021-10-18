/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
/**
 * @auther zhanghe
 * 列表置灰
 */
import { APP_INFO, URL_INFO, LIST_PAGE_INFO, SHOW_MODE, TEMPLATE_INFO, ITEM_INFO ,CARD_PAGE_INFO,TRAN_LIST_PAGE_INFO,LIST_BUTTON_USE,LIST_BUTTON_NOT} from '../../cons/constant';

export const buttonVisible = function (props) {
	let selectdata = props.table.getCheckedRows(LIST_PAGE_INFO.TABLE_CODE);
	
	//设置新增为主要按钮
	props.button.setMainButton('Addlist',true);
	if (!selectdata || selectdata.length == 0) {
		//没有选中
		props.button.setButtonDisabled(LIST_BUTTON_USE.NOCHECK, false);
		props.button.setButtonDisabled(LIST_BUTTON_NOT.NOCHECK, true);

	} else if (selectdata.length == 1) {
		// 选择一条数据按钮根据状态可用
		let billstatus
		//处理选择数据
		selectdata.forEach((val) => {
			billstatus = val.data.values.busistatus.value;
		});
		debugger;
		if (billstatus == LIST_PAGE_INFO.BUSISTATUS.NEEDCOMMIT) {
			// 待提交
			props.button.setButtonDisabled(LIST_BUTTON_USE.NEEDCOMMIT, false);
			props.button.setButtonDisabled(LIST_BUTTON_NOT.NEEDCOMMIT, true);

		} else if (billstatus == LIST_PAGE_INFO.BUSISTATUS.NEEDAPPROVE) {
			// 待审批
			props.button.setButtonDisabled(LIST_BUTTON_USE.NEEDAPPROVE, false);
			props.button.setButtonDisabled(LIST_BUTTON_NOT.NEEDAPPROVE, true);

		} else if (billstatus == LIST_PAGE_INFO.BUSISTATUS.NEEDGENERATE) {
			// 待生成
			props.button.setButtonDisabled(LIST_BUTTON_USE.NEEDGENERATE, false);
			props.button.setButtonDisabled(LIST_BUTTON_NOT.NEEDGENERATE, true);

		} else if (billstatus == LIST_PAGE_INFO.BUSISTATUS.PARTGENERATE) {
			// 部分生成
			props.button.setButtonDisabled(LIST_BUTTON_USE.NEEDGENERATE, false);
			props.button.setButtonDisabled(LIST_BUTTON_NOT.PARTGENERATE, true);

		} else if (billstatus == LIST_PAGE_INFO.BUSISTATUS.READYGENERATE) {
			// 已生成
			props.button.setButtonDisabled(LIST_BUTTON_USE.READYGENERATE, false);
			props.button.setButtonDisabled(LIST_BUTTON_NOT.READYGENERATE, true);
			
		} else if (billstatus == LIST_PAGE_INFO.BUSISTATUS.FREE) {
			// 自由态
			props.button.setButtonDisabled(LIST_BUTTON_USE.NEEDCOMMIT, false);
			props.button.setButtonDisabled(LIST_BUTTON_NOT.FREE, true);

		}
	} else {
		props.button.setButtonDisabled(LIST_BUTTON_USE.ALL, false);		
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