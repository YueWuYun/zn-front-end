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
  meta[FormConfig.formId].items.map((item) => {
    if (item.attrcode === "pk_org") {
      //财务组织
      item.queryCondition = () => {
        return {
          funcode: this.props.getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter",
        };
      };
    }

    // 承付类型设置下拉选项
    // 0: {display: "付款", value: "1"}
    // 1: {display: "承诺", value: "2"}
    // 2: {display: "承兑", value: "3"}
    // 3: {display: "拒付", value: "4"}
    if (item.attrcode == "committype") {
      // 兑付方式
      let cashway = formUtil.getFormItemsValue(
        FormConfig.formId,
        "cashway"
      );
      cashway = cashway && cashway.value;

      if (!this.committypeOptions) {
        // 如果为首次加载meta数据
        this.committypeOptions = item.options;
      }
      let resultOptions;
      if (cashway === "1") {
        // 兑付方式为【即期付款】则只能选择付款
        resultOptions = this.committypeOptions.filter(
          item => item.value == "1" || item.value == "4"
        );
        item.options = resultOptions;
      } else if (cashway === "2") {
        // 兑付方式为承兑，则只能选择付款，承兑
        resultOptions = this.committypeOptions.filter(
          item => item.value == "1" || item.value == "3" || item.value == "4"
        );
        item.options = resultOptions;
      } else if (cashway === "3") {
        // 兑付方式为议付时默认为付款
        // 兑付方式为议付，则能选择承兑、承诺、付款
        // resultOptions = this.committypeOptions.filter(
        //   item => item.value !== "4"
        // );
        // item.options = resultOptions;
        item.options = this.committypeOptions;
      } else if (cashway === "4") {
        // 兑付方式为【延期付款】时默认为承诺；
        // 兑付方式为延期付款，则只能选择承诺，付款
        resultOptions = this.committypeOptions.filter(
          item => item.value == "1" || item.value == "2" || item.value == "4"
        );
        item.options = resultOptions;
      } else {
        item.options = this.committypeOptions;
      }
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
  meta.arrivalinfo.items = meta.arrivalinfo.items.map(
    item => {
      //货品分类
    if (item.attrcode == "pk_marbasclass") {
      item.queryCondition = () => {       
        let pk_org = this.props.form.getFormItemsValue(FormConfig.formId, "pk_org").value;
        return {
            pk_org: pk_org             
        };
      };
    }
    //货品劳务
    if (item.attrcode == "pk_material") {     
        item.queryCondition = () => {
          // 获取当前点击行数据
          let clickedData = cardTableUtil.getClickRowIndex(TableConfig.tableCode);
           // 根据行号获取货品分类的值
          let pk_marbasclass = cardTableUtil.getValByKeyAndIndex(
                TableConfig.tableCode,clickedData.index, "pk_marbasclass");
          let pk_org = this.props.form.getFormItemsValue(
                FormConfig.formId,"pk_org").value;
              return {
                  pk_org: pk_org ,
                  pk_marbasclass: pk_marbasclass && pk_marbasclass.value
              };
          };      
    }
      // 签收人
      if (item.attrcode == "pk_signer") {
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
