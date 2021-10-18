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

        //业务组织
   if (item.attrcode === 'pk_entrustorg') {
    item.queryCondition = () => {
      let pk_org = formUtil.getFormItemsValue(
        FormConfig.formId,
        "pk_org"
      );
      return {
        pkorg: pk_org.value,
        TreeRefActionExt:'nccloud.web.lcm.receive.ref.action.LcmOrgRelationDataRefFilter'
      };
    };
  }

  // 合同编码
  if (item.attrcode === 'pk_contract') {
    item.queryCondition = () => {
      let pk_org = formUtil.getFormItemsValue(
        FormConfig.formId,
        "pk_org"
      );
      let isinitial = formUtil.getFormItemsValue(
        FormConfig.formId,
        "isinitial"
      );
      return {
        pk_org: pk_org.value,
        isinitial :isinitial&&isinitial.value?"Y":"N",// 如果当前单据期初标记为是，则查询期初合同数据
        GridRefActionExt:'nccloud.web.lcm.receive.ref.action.LcmDocuContractRefFilter'
      };
    };
  }

  });

    // 主表meta设置
    meta["repayInfo"].items.map((item, key) => {
              //使用参照权按币种过滤
    if (item.attrcode == "pk_debitunitacct") {
      item.queryCondition = () => {
        let pk_currtype = this.props.form.getFormItemsValue(
          FormConfig.formId,
          "pk_currtype"
        ).value;
        return {
          pk_currtype: pk_currtype,
          GridRefActionExt:
            "nccloud.web.lcm.receive.ref.action.LcmUnitAcctRefFilter"
        };
      };
    }

 // 外汇还款账户按币种过滤
 if (item.attrcode == "pk_foreignacct") {
  item.fieldDisplayed = "refcode"; //账户显示编码
  item.queryCondition = () => {
    // let pk_org = this.props.form.getFormItemsValue(
    //   FormConfig.formId,
    //   "pk_org"
    // ).value;
    let pk_currtype = this.props.form.getFormItemsValue(
      FormConfig.formId,
      "pk_foreigncurr"
    ).value;
    return {
      // pk_org: pk_org,
      pk_currtype: pk_currtype,
      GridRefActionExt:
        "nccloud.web.lcm.receive.ref.action.LcmUnitAcctRefFilter"
    };
  };
}

// 本金计划项目
if(item.attrcode == "pk_mntplanitem"){
  //资金计划项目
    item.queryCondition = () => {
      let pk_org = this.props.form.getFormItemsValue(
        FormConfig.formId,
        "pk_org"
      ).value;
      return { 
        pk_org: pk_org,
        inoutdirect: 1,
        TreeRefActionExt: "nccloud.web.lcm.receive.ref.action.LcmPlanItemRefFilter"
      };
    };
  }


  // 利息计划项目
  if(item.attrcode == "pk_intplanitem"){
    //资金计划项目
      item.queryCondition = () => {
        let pk_org = this.props.form.getFormItemsValue(
          FormConfig.formId,
          "pk_org"
        ).value;
        return { 
          pk_org: pk_org,
          inoutdirect: 1,
          TreeRefActionExt: "nccloud.web.lcm.receive.ref.action.LcmPlanItemRefFilter"
        };
      };
    }

   // 成本中心
      if (item.attrcode == "pk_debitcost") {
          let props = this.props;
          return (item.queryCondition = () => {
            let pk_org =
              props.form.getFormItemsValue(FormConfig.formId, "pk_org") &&
              props.form.getFormItemsValue(FormConfig.formId, "pk_org").value;
            return {
              pk_org: pk_org
            };
          });
        }
    
    
    // 利润中心
        if (item.attrcode == "pk_debitprof") {
            let props = this.props;
            return (item.queryCondition = () => {
              let pk_org =
                props.form.getFormItemsValue(FormConfig.formId, "pk_org") &&
                props.form.getFormItemsValue(FormConfig.formId, "pk_org").value;
              return {
                pk_org: pk_org
              };
            });
          }

    return item;
  });

 

  // 子表meta设置
  //子表合同信息参照过滤
  meta.repayplan.items = meta.repayplan.items.map(
    item => {
      // 放款单过滤
      if (item.attrcode == "pk_payrcpt") {
        item.showHistory = true;
        item.queryCondition = () => {
          let pk_contract =this.props.form.getFormItemsValue(FormConfig.formId, "pk_contract").value;
          return {
            pk_contract: pk_contract
          };
        };
      }
      // 计划过滤
      if (item.attrcode == "pk_repayplan") {
        item.queryCondition = () => {
          // 获取当前点击行数据
          let clickedData = cardTableUtil.getClickRowIndex(TableConfig.tableCode);
          // 根据放款主键
          let pk_payrcpt= cardTableUtil.getValByKeyAndIndex(
            TableConfig.tableCode,clickedData.index, "pk_payrcpt");
          return {
            pk_payrcpt:pk_payrcpt&&pk_payrcpt.value
          };
        };
      }
      return item;
    }
  );
  // meta 是必须返回的
  return meta;
}
