/*CcPhbMUwK6EgcIxdk8kv63s4lD0vxLUk6iWCYetBoywsRIzCJJLvkpzPFbHfvs+q*/
import {
	constant,button
} from '../../config/config';
export default function clickBtn(props) {

	let selectdata = props.table.getCheckedRows(constant.ltablecode);
	// let searchVal = props.search.getAllSearchData(constant.searchcode,false);//新盘适配插叙条件
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
		let billstatus
		//处理选择数据
		selectdata.forEach((val) => {
			billstatus = val.data.values.busistatus.value;
		});

		if (billstatus == 1 || billstatus == '') {
			// 保存态
			props.button.setButtonDisabled(button.savedisable, false);
		} else if (billstatus == 2) {
			//待审批
			props.button.setButtonDisabled(button.tobapprovedisable, false);
		} else if (billstatus == 3) {
			// 待处理
			props.button.setButtonDisabled(button.tobedealdisable, false);
		} else if (billstatus == 4) {
			// 已完毕
			props.button.setButtonDisabled(button.overdisable, false);
		}

	} else {
		let tabCode = this.state.tabInfo;
		if(tabCode == 0){
			//选择多条
		props.button.setButtonDisabled(button.listdisable, false);
		}
		if (tabCode == 1) {
			// 待提交
			props.button.setButtonDisabled(button.savedisable, false);
		} else if (tabCode == 2) {
			//审批中
			// props.button.setButtonDisabled(button.tobapprovedisable, false);
			// 待结算
			props.button.setButtonDisabled(button.tobedealdisable, false);
		} else if (tabCode == 3) {
			
			// 全部
			props.button.setButtonDisabled(button.listdisable, false);
		}
	}
}

/*CcPhbMUwK6EgcIxdk8kv63s4lD0vxLUk6iWCYetBoywsRIzCJJLvkpzPFbHfvs+q*/