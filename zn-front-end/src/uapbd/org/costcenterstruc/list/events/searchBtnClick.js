//YuO8szH0cVixePu/Bt+mG3bVDYtJTGvKZcGK3iypDb9P1NCQ60SYpClfbGT0pz4g
import { ajax,toast,cardCache } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
//点击查询，获取查询区数据
export default function searchBtnClick(props,value,type) {
	if(value){
		let that = this;
		let queryInfo = props.search.getQueryInfo('query');
		queryInfo.pageInfo = props.table.getTablePageInfo("head");
		if(type != false){
			queryInfo.pageInfo.pageIndex = 0;
		}else{
			queryInfo.pageInfo.pagepks = value;
		}
		setDefData("queryInfo", "uap.bcbd.barappobject.barappobjectcache", queryInfo);
		ajax({
			url: '/nccloud/bcbd/barappregister/conditionquery.do',
			data: queryInfo,
			success: function (res) {
                let { success, data } = res;
                if (success) {
					that.setPageData(that, res);
				}
            },
		});
	}
	
}


//YuO8szH0cVixePu/Bt+mG3bVDYtJTGvKZcGK3iypDb9P1NCQ60SYpClfbGT0pz4g