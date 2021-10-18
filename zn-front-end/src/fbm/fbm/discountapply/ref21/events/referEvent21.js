/*un54nM2W1YBxk+3H1t2y08BKQwIHbCogMM+PJcHohrACdJ4RPOyB4VfltAM/gzvW*/
/*
 * @Author: wusib
 * @PageInfo: 查询区参照过滤
 * @Date: 2019-10-25 09:43:24
 */
import { REF21_CONST } from "../const";

export default function referEvent(props, meta) {
  //参照
  meta[REF21_CONST.searchId].items.find(
    e => e.attrcode === "pk_org"
  ).isMultiSelectedEnabled = true;

  meta[REF21_CONST.searchId].items.map(item => {
    //设置参照面板不显示主组织
    if (item.attrcode === "pk_org") {
      //财务组织
      item.queryCondition = () => {
        return {
          funcode: this.props.getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
        };
      };
    }
    //票据类型过滤
    if (item.attrcode === 'fbmbilltype') {
      item.queryCondition = () => {
        return {
          GridRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter'
        };
      };
    }
    // 出票人
    if (item.attrcode === 'hidepayunit') {
      item.queryCondition = () => {
        let pk_org = this.props.search.getSearchValByField(REF21_CONST.searchId, 'pk_org');
        if (pk_org && pk_org.value && pk_org.value.firstvalue) {
          return {
            pk_org: pk_org.value.firstvalue,
          };
        }else{
          return {};
        }
      };
    }

  });
}

/*un54nM2W1YBxk+3H1t2y08BKQwIHbCogMM+PJcHohrACdJ4RPOyB4VfltAM/gzvW*/