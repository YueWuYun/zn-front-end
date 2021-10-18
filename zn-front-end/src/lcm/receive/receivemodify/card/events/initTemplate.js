/**
 * 处理 meta 数据, 比如添加参照过滤等操作
 */
export default function (meta) {
  let { FormConfig, form: formUtil } = this.props;

  // 主表meta设置
  meta[FormConfig.formId].items.map((item, key) => {
    if (item.attrcode === "pk_org") {
      // 财务组织
      item.queryCondition = () => {
        return {
          funcode: this.props.getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter",
        };
      };
    }
  });

  // 子表meta设置

  // meta 是必须返回的
  return meta;
}
