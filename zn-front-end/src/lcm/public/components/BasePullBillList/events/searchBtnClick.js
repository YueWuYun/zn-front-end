//列表头部按钮操作
import { getPullListData } from "../../../container/list.js";
import { cardCache } from "nc-lightapp-front";
let { setDefData, getDefData, deleteCacheById, updateCache } = cardCache;

/**
 * 拉单列表查询按钮点击事件
 */
export function searchBtnClick() {
  let { search: searchUtil, SearchConfig, BillConfig } = this.props;
  // 设置查询区缓存
  setDefData(
    BillConfig.searchCache.key,
    BillConfig.searchCache.dataSource,
    searchUtil.getQueryInfo(SearchConfig.searchId)
  );

  getPullListData.call(
    this,
    this.state.baseMultiLangData["3617PUB-000020"] /* 国际化处理： 查询成功 */,
    false
  );
}
