/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { constant } from "../../config/config";
import { createPage, ajax, toast, base, high, cardCache, deepClone } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
	if (searchVal) {
		let pageInfo = props.table.getTablePageInfo(this.tableId);
		// 点击查询时，将查询条件放入缓存中
		if (searchVal == null || searchVal) {
			let searchClone = deepClone(searchVal);
			setDefData(constant.searchKey, this.cacheDataSource, searchClone);
			this.querydata(searchVal,pageInfo);
		}
		
	}
}

/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/