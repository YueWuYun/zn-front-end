/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { cardCache, deepClone } from "nc-lightapp-front";
import { constant } from "../../config/config.js";
let {setDefData } = cardCache;
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
  let that = this;

  if (searchVal) {
    let pageInfo = props.table.getTablePageInfo(this.tableId);
    let searchClone = deepClone(searchVal);
    setDefData(constant.searchKey, this.cacheDataSource, searchClone); // 将克隆的查询区条件存入缓存

    that.querydata(searchVal, pageInfo);
  }
}

/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/