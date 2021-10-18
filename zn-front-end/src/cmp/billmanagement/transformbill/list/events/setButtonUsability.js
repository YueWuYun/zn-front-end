/*CcPhbMUwK6EgcIxdk8kv63s4lD0vxLUk6iWCYetBoywsRIzCJJLvkpzPFbHfvs+q*/
import {
	constant,button
} from '../../config/config';
export default function clickBtn(props) {
	// let checkedrows = props.table.getCheckedRows(constant.ltablecode);
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
		let billstatus,pk_srcbilltypecode
		//处理选择数据
		selectdata.forEach((val) => {
			billstatus = val.data.values.busistatus.value;
			pk_srcbilltypecode = val.data.values.pk_srcbilltypecode.value;
		});

		if (billstatus == '1'|| billstatus == '') {
			// 保存态
			props.button.setButtonDisabled(button.savedisable, false);
		} else if (billstatus == 2) {
			//待审批
			props.button.setButtonDisabled(button.tobapprovedisable, false);
		} else if (billstatus == 3) {
			// 待结算
			props.button.setButtonDisabled(button.tobesettledisable, false);

		} else if (billstatus == 4) {
			// 已完毕
			props.button.setButtonDisabled(button.overdisable, false);
			if(pk_srcbilltypecode == constant.informerbilltype){
				props.button.setButtonDisabled(['unsettleBtn'], true);
			}
		}

	} else {
		let tabCode = this.state.tabInfo;
		if(tabCode == 0){
			//待提交
			// props.button.setButtonDisabled(button.listdisable, false);
			props.button.setButtonDisabled(button.savedisable, false);
		}
		if (tabCode == 1) {
			// 审批中
			props.button.setButtonDisabled(button.tobapprovedisable, false);
		} else if (tabCode == 2) {
			//待结算
			props.button.setButtonDisabled(button.tobesettledisable, false);
		} else if (tabCode == 3) {
			// 全部
			props.button.setButtonDisabled(button.listdisable, false);
		}

	}
}

/*CcPhbMUwK6EgcIxdk8kv63s4lD0vxLUk6iWCYetBoywsRIzCJJLvkpzPFbHfvs+q*/