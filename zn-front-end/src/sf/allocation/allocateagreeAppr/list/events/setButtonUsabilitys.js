/*CcPhbMUwK6EgcIxdk8kv6zhcRuGdCkOhlZS8DaCxPnPKwq7kDX9B3hzPZQFdpYWU*/
import {list_table_id } from '../../cons/constant.js';
import { ajax } from 'nc-lightapp-front';

export default function click(props) {
	//先把所有按钮都设置为不可编辑
	props.button.setButtonDisabled(['BatchCommitMajor', 'BatchUncommit', 'BatchBack', 'creategroup','BatchCreateAllocate',
		'MergeCreate' ,'linkgroupsec','LinkSourceBill', 'LinkUnionFundBill', 'LinkNtbPlan', 'File', 'Print', 'OutPut'], true);
	let selectdata;
	if (props.table && props.table.getCheckedRows) {
		selectdata = props.table.getCheckedRows(list_table_id);
	}
	if (!selectdata || selectdata.length == 0) {
		//没有选中行，只刷新
		props.button.setButtonDisabled(['Refresh'], false);
	} else if (selectdata.length == 1) {
		// 选择一条数据按钮根据状态可用
		// 单据状态 
		let billstatus;
		// 审批状态 
		let vbillstatus;
		//处理选择数据
		selectdata.forEach((val) => {
			billstatus = val.data.values.billstatus && val.data.values.billstatus.value;
			vbillstatus = val.data.values.vbillstatus && val.data.values.vbillstatus.value;
		});
		//所有状态均可以联查、附件、打印
		props.button.setButtonDisabled(['linkgroup','linkgroupsec','LinkSourceBill', 'LinkNtbPlan', 'File', 'Print','OutPut'], false);
		//1=待提交，2=待审批，3=待下拨， 4=部分下拨， 5=处理完毕，  
		if (billstatus == '1') {//待提交 
			props.button.setButtonDisabled(['BatchCommitMajor', 'BatchUncommit','BatchBack'], false);
		}
		if (billstatus == '2') {//审批中
			props.button.setButtonDisabled(['BatchUncommit'], false);
		}
		if (billstatus == '3') {//待下拨
			props.button.setButtonDisabled(['BatchCreateAllocate','MergeCreate','BatchUncommit'], false);
		}
		if (billstatus == '4') {//部分下拨
			props.button.setButtonDisabled(['BatchCreateAllocate','MergeCreate'], false);
		}
		if (billstatus == '5') {//处理完毕
			props.button.setButtonDisabled(['LinkUnionFundBill'], false);
		}
	} else {
	    //所有状态均可以
		props.button.setButtonDisabled(['File', 'Print', 'OutPut'], true);
	    //选择多条  0待提交 1审批中 2带委托 3全部
		let activeKey = this.state.activeKey;
		if (activeKey == 0) {
			props.button.setButtonDisabled(['BatchCommitMajor','BatchUncommit' ,'BatchBack'], false);
		} else if (activeKey == 1) {
		 	props.button.setButtonDisabled(['BatchUncommit', ], false);
		} else if (activeKey == 2) {
		    props.button.setButtonDisabled(['BatchUncommit','BatchCreateAllocate','MergeCreate'], false);
		} else {//全部  先除附件全部显示，老nc的逻辑太复杂
			props.button.setButtonDisabled(['BatchCommitMajor', 'BatchUncommit', 'BatchBack', 'creategroup','BatchCreateAllocate',
			'MergeCreate', 'linkgroup','linkgroupsec','LinkSourceBill', 'LinkUnionFundBill', 'LinkNtbPlan', 'File', 'Print', 'OutPut' ], false);	
		}
	}
}

/*CcPhbMUwK6EgcIxdk8kv6zhcRuGdCkOhlZS8DaCxPnPKwq7kDX9B3hzPZQFdpYWU*/