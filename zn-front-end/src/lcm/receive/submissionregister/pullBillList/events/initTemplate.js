/**
 * 处理 meta 数据, 比如添加参照过滤等操作
 */
export default function (meta) {
  let { SearchConfig, getSearchParam } = this.props;
  meta[SearchConfig.searchId].items.map((item) => {
    if (item.attrcode === "pk_org") {
      //财务组织过滤
      item.isMultiSelectedEnabled = true; //财务组织多选
      item.queryCondition = () => {
        return {
          funcode: getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter",
        };
      };
    }
  });
  // meta 是必须返回的
  return meta;
}
