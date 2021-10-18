/*CcPhbMUwK6EgcIxdk8kv63s4lD0vxLUk6iWCYetBoywsRIzCJJLvkpzPFbHfvs+q*/
import {
	constant,button
} from '../../config/config';
export default function clickBtn(props) {
	
	let selectdata = props.table.getCheckedRows(constant.ltablecode);
	//设置除新增和刷新外都不可用
	props.button.setButtonDisabled(['modifyBtn','deleteBtn','startBtn','stopBtn'], true);
	// let searchVal = props.search.getAllSearchData(constant.searchcode,false);//新盘适配插叙条件
	// let searchVal = props.search.getAllSearchData(constant.searchcode); //查询condition
	if (!selectdata || selectdata.length == 0) {
		//props.button.setButtonDisabled(button.refreshdisable, true);//config里有定义refreshdisable
		//设置除新增和刷新外都不可用
		props.button.setButtonDisabled(['modifyBtn','deleteBtn','startBtn','stopBtn'], true);

	} else if (selectdata.length == 1) {
		//props.button.setButtonDisabled(['deleteBtn'], false);
		// 选择一条数据按钮根据状态可用
		let state;
		//处理选择数据
		selectdata.forEach((val) => {
			state = val.data.values.state.value;
		});		
		
		if(state == '1'){//未启用态
			props.button.setButtonDisabled(['modifyBtn','deleteBtn','startBtn'], false);			
		}

		if(state == '2'){//已启用态
			props.button.setButtonDisabled(['stopBtn'], false);
		}

		if(state == '3'){//已停用态
			props.button.setButtonDisabled(['modifyBtn','deleteBtn','startBtn'], false);
		}

	} else {

	}
}

/*CcPhbMUwK6EgcIxdk8kv63s4lD0vxLUk6iWCYetBoywsRIzCJJLvkpzPFbHfvs+q*/