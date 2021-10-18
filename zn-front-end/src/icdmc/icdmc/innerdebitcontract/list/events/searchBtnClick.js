/*YuO8szH0cVixePu/Bt+mG4wwt1ZCV6u4IgNbgRHpTsn8KoXosovF0Q43KKMn41B9*/
import { constant } from "../../config/config";
import { createPage, ajax, toast, base, high, cardCache,deepClone } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;

//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
	if (searchVal) {
		let pageInfo = props.table.getTablePageInfo(this.tableId);
		let searchClone = deepClone(searchVal); // 克隆
		setDefData(constant.searchKey, this.cacheDataSource, searchClone); // 将克隆的查询区条件存入缓存
		this.querydata(searchVal,pageInfo);
	}
}

/*YuO8szH0cVixePu/Bt+mG4wwt1ZCV6u4IgNbgRHpTsn8KoXosovF0Q43KKMn41B9*/