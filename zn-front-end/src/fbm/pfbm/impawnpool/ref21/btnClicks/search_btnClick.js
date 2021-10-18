/*yYIJze53wsRHcGC2ovmOPkXsudIdL29TCcEFpPbr79SKZ8WSWj6G+ZqWUrr1Ew1R*/
import { setDefData } from "../../util/cacheDataManager";
import { REF21_CONST } from "../const";
import commonSearch_BtnClick from "./commonSearch_BtnClick";


export default function clickSerachBtn() {
  let searchVal = this.props.search.getAllSearchData(REF21_CONST.searchId);
  if (searchVal === false) {
    return;
  }
  let queryInfo = this.props.search.getQueryInfo(REF21_CONST.searchId);

  queryInfo.pageInfo = null;
  setDefData(REF21_CONST.Ref21DataSource, REF21_CONST.searchId, queryInfo);

  commonSearch_BtnClick.call(this, this.props, queryInfo);
}

/*yYIJze53wsRHcGC2ovmOPkXsudIdL29TCcEFpPbr79SKZ8WSWj6G+ZqWUrr1Ew1R*/