/*amCSQ7Nq168EJ/+3YUIntUSWfwq1fcUazNXjgbAkkzj3e129VukJL3xlgmApETUP*/
/**
 * [结账]-[行单击事件]-[限定表格只能单选]
 * @param {*} props 
 * @param {*} status 
 */
export default function onClinckRow(props, moudleId,record, index, text) {
	
	//设置表格的选中状态:防止在补录保存的时候校验失败
	if(index){
		this.props.table.selectAllRows(this.tableId, false);
		this.props.table.selectTableRows(this.tableId, [index], true);
	}else if(index  == 0){//代码0表示false
		this.props.table.selectAllRows(this.tableId, false);
		this.props.table.selectTableRows(this.tableId, [index], true);
	}
	
};

/*amCSQ7Nq168EJ/+3YUIntUSWfwq1fcUazNXjgbAkkzj3e129VukJL3xlgmApETUP*/