/*vaVcVGwUmjKcjj2pE+Uz0b6Vuk9X/DxRUoIec97tumd7zftYdY53+KowvFELar7V*/
import  buttonUsability  from "./buttonUsability";
/**
 * [结账]-[单选复选框]-[限定表格只能单选]
 * @param {*} props 
 * @param {*} newVal 被选中的行数
 * @param {*} oldVal 旧的被选中的行数
 */
export default function onSelectedClick(props, moudleId, record, index, status) {
	buttonUsability.call(this, this.props, '');//按钮显隐性控制
	//设置表格的选中状态:防止在补录保存的时候校验失败
	if (index) {
		this.props.table.selectAllRows(this.tableId, false);
		this.props.table.selectTableRows(this.tableId, [index], true);
	}

};

/*vaVcVGwUmjKcjj2pE+Uz0b6Vuk9X/DxRUoIec97tumd7zftYdY53+KowvFELar7V*/