//YuO8szH0cVixePu/Bt+mG3bVDYtJTGvKZcGK3iypDb9P1NCQ60SYpClfbGT0pz4g
import { ajax, toast,cacheTools } from 'nc-lightapp-front';

export default function searchBtnClick(props, value, type) {
	
	let curr_props = props;
	let that = this;
	let queryData = curr_props.search.getQueryInfo('profitcenterquery');
	cacheTools.set("hasSearched",1);
	cacheTools.set("searchParams",queryData);
	let qdata = {
		pageid: "10100PFC_listView",
		filter: queryData
	};
	debugger
	ajax({
		url:"/nccloud/uapbd/profitcenter/querylistdata.do",
		method:"post",
		data:qdata,
		success:function(res){
			if(res.success){
				if(res.data){//返回全新的数据 刷新界面
					//后台返回的是表格的数据  需要构造成树状表的数据
					let datas =  that.props.treeTableManyCol.createNewData(res.data.grid.resaprofitcenter.rows);
					//根据树状表的数据构造树表
					that.props.treeTableManyCol.initTreeTableData('resaprofitcenter',datas,'refpk');
				}else{
					that.props.treeTableManyCol.emptyAllData('resaprofitcenter');
				}

			}	
		}
	});
}


//YuO8szH0cVixePu/Bt+mG3bVDYtJTGvKZcGK3iypDb9P1NCQ60SYpClfbGT0pz4g