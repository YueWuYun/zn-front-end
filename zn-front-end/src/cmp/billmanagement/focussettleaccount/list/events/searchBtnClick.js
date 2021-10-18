/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
//集中结账
import { ajax, toast } from 'nc-lightapp-front';
//点击查询，获取查询区数据
export default function searchBtnClick(props, value) {

	if (value) {
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		let data = {
			"conditions": value.conditions,
			"pagecode": this.pageId,
			"pageInfo": pageInfo,
			"queryAreaCode": this.searchId,
			"oid": "",
			"queryType": "simple"
		};
		console.log(data);
		ajax({
			url: '/nccloud/cmp/focussettleaccount/query.do',
			data: data,
			success: (res) => {//成功执行
				let { success, data } = res;
				if (success) {
					if (data && data[this.tableId]) {
						toast({
							color: 'success',
						});
						this.props.table.setAllTableData(this.tableId, res.data[this.tableId]);
					} else {
						toast(
							{
								color: 'warning',
								content: this.props.MutiInit.getIntl("36070FSA") &&
									this.props.MutiInit.getIntl("36070FSA").get('36070FSA-000022')/*国际化处理：未查询出符合条件的数据!*/
							});
						this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
					}
				}
			},
			error: (res) => {//错误处理
				if (res && res.message) {
					toast({ color: 'warning', content: res.message });
					this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
				}
			}
		});
	}

}


/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/