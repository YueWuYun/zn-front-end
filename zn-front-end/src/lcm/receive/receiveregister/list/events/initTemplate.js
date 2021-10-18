/**
 * 处理 mate 数据, 比如添加参照过滤等操作
 */
export default function(meta) {
  let { BillConfig, TableConfig ,SearchConfig, getSearchParam  } = this.props;
  meta[SearchConfig.searchId].items.map(item => {
    if (item.attrcode === "pk_org") {
      //财务组织过滤
      item.isMultiSelectedEnabled = true; //财务组织多选
      item.queryCondition = () => {
        return {
          funcode: getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
        };
      };
    }
  });
  meta[TableConfig.tableId].pagination = true;
  meta[TableConfig.tableId].items = meta[TableConfig.tableId].items.map(
    (item, key) => {
      // item.width = 150;
      if (item.attrcode == BillConfig.billNo) {
        item.render = (text, record, index) => {
          return (
            <a
              style={{ cursor: "pointer" }}
              onClick={() => {
                let scene = this.props.getUrlParam("scene"); // 联查场景
                this.props.pushTo("/card", {
                  status: "browse",
                  scene,
                  id: record[BillConfig.primaryId].value,
                  pagecode: BillConfig.pageId
                });
              }}
            >
              {record[BillConfig.billNo] && record[BillConfig.billNo].value}
            </a>
          );
        };
      }
      return item;
    }
  );
  // meta 是必须返回的
  return meta;
}
