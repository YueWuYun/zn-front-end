/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息

/**
 * [收款协同]-[列表按钮置灰处理]
 * @param {*} props 
 * @param {*} status 
 */
export default function buttonUsability(props, status) {

	let tableId = Templatedata.list_tableid;
	let selectData = props.table.getCheckedRows(tableId);
	if (selectData.length == 0) {
		props.button.setButtonDisabled([
			'linkquerybillBtn',	//联查单据
			'querysynbillBtn',	//联查协同单据
			'secondlinkgroup',	//联查二级下拉
			// 'linkgroup',	//更多按钮中的联查
			// 'refreshBtn',	//列表中的刷新按钮图标
			'queryvoucherBtn',	//联查凭证列表
			'querymsgBtn',	//查看审批意见列表
			'deleteBtn'	//删除
		], true);
		//切换页签- 切换状态
		props.button.setButtonDisabled(
			[
				// 'linkquerybillBtn',	//联查单据
				// 'querysynbillBtn',	//联查协同单据
				// 'deleteBtn',	//删除
				// 'secondlinkgroup',	//联查二级下拉
				'linkgroup',	//更多按钮中的联查
				'refreshBtn',	//列表中的刷新按钮图标
				// 'queryvoucherBtn',	//联查凭证列表
				// 'querymsgBtn',	//查看审批意见列表
			],
			false
		);
	};
	if (selectData.length >= 1) {
		props.button.setButtonDisabled([
			'linkquerybillBtn',	//联查单据
			'querysynbillBtn',	//联查协同单据
			'deleteBtn',	//删除
			'secondlinkgroup',	//联查二级下拉
			'linkgroup',	//更多按钮中的联查
			'refreshBtn',	//列表中的刷新按钮图标
			'queryvoucherBtn',	//联查凭证列表
			'querymsgBtn',	//查看审批意见列表
		], false);
	}
};

/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/