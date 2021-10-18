/*CcPhbMUwK6EgcIxdk8kv63s4lD0vxLUk6iWCYetBoywsRIzCJJLvkpzPFbHfvs+q*/
import {
	constant,button
} from '../../config/config';
export default function clickBtn(props) {
	
	let selectdata = props.table.getCheckedRows(constant.ltablecode);
	// let searchVal = props.search.getAllSearchData(constant.searchcode,false);//新盘适配插叙条件
	// let searchVal = props.search.getAllSearchData(constant.searchcode); //查询condition
	if (!selectdata || selectdata.length == 0) {
		//没有选中
		// 查询条件判断有无
		// if(searchVal){
		// 	props.button.setButtonDisabled(button.listdisable, true);
		// }else{
		// 	props.button.setButtonDisabled(button.refreshdisable, true);
		// }
		props.button.setButtonDisabled(button.refreshdisable, true);

	} else if (selectdata.length == 1) {
		// 选择一条数据按钮根据状态可用
		let billstatus,isinneracc,settlestatus ;
		//处理选择数据
		selectdata.forEach((val) => {
			billstatus = val.data.values.billstatus.value;
			isinneracc = val.data.values.isinneracc.value;
			settlestatus  = val.data.values.settlestatus.value;
		});

		if(billstatus == '0'){
			// 保存态
			props.button.setButtonDisabled(button.tempsavedisable, false);
		}else if (billstatus == '1'|| billstatus == '') {
			// 保存态
			props.button.setButtonDisabled(button.savedisable, false);
		} else if (billstatus == 2) {
			//待审批
			props.button.setButtonDisabled(button.tobapprovedisable, false);
		} else if (billstatus == 3) {
			// 待结算
			props.button.setButtonDisabled(button.tobesettledisable, false);
			//内部账户时委托付款可用，结算不可用
			if(isinneracc){
				props.button.setButtonDisabled(['transfer'], false);
				props.button.setButtonDisabled(['settleBtn'], true);
			}
			//如果单据状态待结算 结算状态是结算中 将委托付款设置不可用  取消委托设置可用
			if(settlestatus == 1){
				props.button.setButtonDisabled(['canceltransfer'], false);
				props.button.setButtonDisabled(['transfer'], true);
			}
		} else if (billstatus == 4) {
			// 已完毕
			props.button.setButtonDisabled(button.overdisable, false);
			//内部账户时取消委托付款可用，取消结算不可用
			if(isinneracc){
				props.button.setButtonDisabled(['canceltransfer'], false);
				props.button.setButtonDisabled(['unsettleBtn'], true);
			}
		}

	} else {
		// let tabCode = this.state.tabInfo;
		// if(tabCode == 0){
		// 	//待提交
		// 	props.button.setButtonDisabled(button.savedisable, false);
		// }
		// if (tabCode == 1) {
		// 	// 审批中
		// 	props.button.setButtonDisabled(button.tobapprovedisable, false);
		// } else if (tabCode == 2) {
		// 	//待结算
		// 	props.button.setButtonDisabled(button.tobesettledisable, false);
		// } else if (tabCode == 3) {
		// 	// 全部
		// 	props.button.setButtonDisabled(button.listdisable, false);
		// }
		props.button.setButtonDisabled(button.listdisable, false);
	}
}

/*CcPhbMUwK6EgcIxdk8kv63s4lD0vxLUk6iWCYetBoywsRIzCJJLvkpzPFbHfvs+q*/