/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/
import { base_url,button,sourceModel_SF,SHOWMODEL_BULU, list_table_id, list_page_id, list_search_id, viewmod_deal, billtype, print_nodekey, print_templateid, funcode,dataSource } from '../../cons/constant.js';

export default function click(props) {
	let selectdata ;
	if(props.table) {
		selectdata=props.table.getCheckedRows(list_table_id);
	}
	if (!selectdata || selectdata.length == 0) {
		//没有选中
		props.button.setButtonDisabled(button.refreshdisable, true);
	} else if (selectdata.length == 1) {
		// 选择一条数据按钮根据状态可用
		// 单据状态 1=待提交, 2=待审批，3=待支付，4=支付中，5=转账成功，6=已作废 
		let billstatus;
		// 来源业务类型   7=手工录入，1=系统自动生成 3=委托回拨生成，2=到账通知生成，4=资金计划生成，5=付款排程生成 ,6=下拨申请生成   
		let srcbusitype;
		// 审批状态 0=审批未通过，1=审批通过，2=审批进行中，3=提交，-1=自由， 
		let vbillstatus;
		//处理选择数据
		selectdata.forEach((val) => {
			billstatus = val.data.values.billstatus.value;
			srcbusitype = val.data.values.srcbusitype.value;
			vbillstatus = val.data.values.vbillstatus.value;
		});

		// 手工录入
		if(srcbusitype == '7'){
			//待提交和待审批
			if(billstatus == '1' || billstatus == '2'){
				props.button.setButtonDisabled(button.refreshdisable, true);
				props.button.setButtonDisabled(button.dtj, false);
			}
			//待支付
			else if(billstatus == '3'){
				props.button.setButtonDisabled(button.refreshdisable, true);
				props.button.setButtonDisabled(button.dzf, false);
			}
			//支付中
			else if(billstatus == '4') {
				props.button.setButtonDisabled(button.refreshdisable, true);
				props.button.setButtonDisabled(button.zfz, false);
			}
			//转账成功
			else if(billstatus == '5'||billstatus=='6') {
				props.button.setButtonDisabled(button.refreshdisable, true);
				props.button.setButtonDisabled(button.zzcg, false);
			}
		}
		// 非手工录入
		else {
			props.button.setButtonDisabled(button.otherdtj, false);
		}
	} else {
		//选择多条
		let activeKey = this.state.activeKey;
		if(activeKey == 0||activeKey==1){
			// 待提交,待审批
			props.button.setButtonDisabled(button.refreshdisable, true);
			props.button.setButtonDisabled(button.dtjm, false);
		}
		else if (activeKey==2) {
			//待支付
			props.button.setButtonDisabled(button.refreshdisable, true);
			props.button.setButtonDisabled(button.dzfm, false);
		}
		else if (activeKey==3) {
			//支付中
			props.button.setButtonDisabled(button.refreshdisable, true);
			props.button.setButtonDisabled(button.zfzm, false);
		}
		else if (activeKey == 4||activeKey==5) {
			// 转账成功,已作废
			props.button.setButtonDisabled(button.refreshdisable, true);
			props.button.setButtonDisabled(button.zzcgm, false);
		}
		else if (activeKey == 6) {
			// 全部
			props.button.setButtonDisabled(button.refreshdisable, true);
			props.button.setButtonDisabled(button.qb, false);
		}
		
	}
	props.button.setButtonDisabled('add', false);
}

/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/