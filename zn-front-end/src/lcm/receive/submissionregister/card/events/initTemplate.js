/**
 * 处理 meta 数据, 比如添加参照过滤等操作
 */
export default function (meta) {
  let {
    TableConfig,
    FormConfig,
    form: formUtil,
    cardTable: cardTableUtil
  } = this.props;

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
    if (item.attrcode === "pk_dept") {
      //部门过滤
      item.showHistory = true;
      item.queryCondition = () => {
        let pk_entrustorg = this.props.form.getFormItemsValue(
          FormConfig.formId,"pk_entrustorg").value;
        let pk_org = this.props.form.getFormItemsValue(
          FormConfig.formId,"pk_org").value;
        return {
          pk_org:(pk_entrustorg == ""? pk_org: pk_entrustorg)
        };
      };
    }
    //业务员参照
    if (item.attrcode == "pk_busipersion") {
      item.showHistory = true;
      item.queryCondition = () => {
        let pk_dept =
          this.props.form.getFormItemsValue(FormConfig.formId, "pk_dept") &&
          this.props.form.getFormItemsValue(FormConfig.formId,"pk_dept").value;
        let pk_org =
          this.props.form.getFormItemsValue(FormConfig.formId, "pk_entrustorg")
            .value == ""
            ? this.props.form.getFormItemsValue(FormConfig.formId, "pk_org").value
            : this.props.form.getFormItemsValue(FormConfig.formId, "pk_entrustorg")
                .value;
        return {
          pk_dept: pk_dept,
          pk_org: pk_org
        };
      };
    }
    return item;
  });

  // 子表meta设置
  //子表合同信息参照过滤
  meta.contractinfo.items = meta.contractinfo.items.map(
    item => {
      // 经手人
      if (item.attrcode == "pk_handler") {
        item.showHistory = true;
        item.queryCondition = () => {
          let pk_org =this.props.form.getFormItemsValue(FormConfig.formId, "pk_org").value;
          return {
            pk_org: pk_org
          };
        };
      }
      return item;
    }
  );

  // meta 是必须返回的
  return meta;
}
