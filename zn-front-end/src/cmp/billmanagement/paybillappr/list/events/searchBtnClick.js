/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax } from 'nc-lightapp-front';
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
	if (searchVal) {
		let pageInfo = props.table.getTablePageInfo(this.tableId);

		let data = {
			querycondition: searchVal,
			custcondition: {
				logic: 'and', //逻辑操作符，and、or
				conditions: []
			},
			pageInfo: pageInfo,
			pagecode: '36070PBR_D5_list',
			queryAreaCode: 'search_D5', //查询区编码
			oid: '1001Z61000000000B6Z5', //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};
		ajax({
			url: '/nccloud/cmp/paybills/query.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
					} else {
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}
					if (data.statusNum) {
						this.setState({ numvalues: data.statusNum });
					}
				}
			}
		});
	}
}

/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/