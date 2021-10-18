/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax,toast } from 'nc-lightapp-front';
//点击查询，获取查询区数据
export default function searchBtnClick(props,value) {

	if(value){
		let pageInfo = props.table.getTablePageInfo(this.tableId);
		let data = {
			"conditions": value.conditions,
			"pagecode": this.pageId,
			"pageInfo": pageInfo,
			"queryAreaCode": this.searchId,
			"oid": "",
			"queryType": "simple"
		};
		ajax({
			url: '/nccloud/cmp/settleaccount/settleaccountquery.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if(success){
					if(data && data[this.tableId]){
						
						//待结账月份赋值
						let rows = data[this.tableId].rows;
						let isSettled= null;
						rows.forEach((val) => {
							debugger
							if(!isSettled){
								if(val.values.stype_flag.value=='2'){
									isSettled = val.values.stype_flag.value;//状态标识：1：未启用；2：未结账；3：已结账
									let title_month = (this.props.MutiInit.getIntl("36070SA") &&
											this.props.MutiInit.getIntl("36070SA").get('36070SA-000018')) + ' : ';
									this.setState({
										settleMonth: title_month+val.values.findAccMonth.value//待结账月份
									});
								}
							}
						})
						toast(
                            {
                                color: 'success',
                            });
						this.props.table.setAllTableData(this.tableId, res.data[this.tableId]);
					}else{
						if(data && data.message){
							toast({ color: 'warning', content:data.message});/* 国际化处理： 请选择单条数据，进行结账处理!*/
						}else{
							toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070SA") &&
                            this.props.MutiInit.getIntl("36070SA").get('36070SA-000019') });//未查询到符合条件的数据
						}
						this.props.table.setAllTableData(this.tableId, { rows: [] ,pageInfo:{pageIndex:0,pageSize:10,total:0,totalPage:0}});
					}	
				}
			}
		});
	}
	
}


/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/