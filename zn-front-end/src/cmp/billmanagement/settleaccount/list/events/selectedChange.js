/*Ymu8zKZ9/qeoNVdNB/LH5Q8827OBcJxE1f3fJyG7w4slK5Va+klzvkpKBhVdcR2+*/
/**
 * [结账]-[ 选择框有变动的钩子函数]-[限定表格只能单选]
 * @param {*} props 
 * @param {*} newVal 被选中的行数
 * @param {*} oldVal 旧的被选中的行数
 */
export default function selectedChange(props, moudleId,record, index,status) {
	
	//设置表格的选中状态:防止在补录保存的时候校验失败
	if(index){
		this.props.table.selectAllRows(this.tableId, false);
		this.props.table.selectTableRows(this.tableId, [index], true);
	}
	
};

/*Ymu8zKZ9/qeoNVdNB/LH5Q8827OBcJxE1f3fJyG7w4slK5Va+klzvkpKBhVdcR2+*/