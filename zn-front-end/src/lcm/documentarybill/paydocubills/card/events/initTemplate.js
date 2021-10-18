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
    //合同编号
    if (item.attrcode == "pk_contract") {
      item.queryCondition = () => {
        let pk_org = formUtil.getFormItemsValue(FormConfig.formId, "pk_org")
          .value;
        let pk_currtype = formUtil.getFormItemsValue(FormConfig.formId, "pk_currtype")
          .value;
        let isinitial = formUtil.getFormItemsValue(FormConfig.formId, "isinitial");
        return {
          pk_org: pk_org,
          pk_currtype: pk_currtype,
          isinitial :isinitial&&isinitial.value?"Y":"N",// 如果当前单据期初标记为是，则查询期初合同数据
          GridRefActionExt:
            "nccloud.web.lcm.documentarybills.ref.filter.LcmDocuCont4DocuPayRefFilter"
        };
      };
    }
    //放款计划编号
    if (item.attrcode == "pk_payplan") {
      item.queryCondition = () => {
        let pk_contract = formUtil.getFormItemsValue(FormConfig.formId, "pk_contract")
          .value;
        return {
          pk_contract: pk_contract,
        };
      };
    }
    //借款单位账户
    if (item.attrcode == "pk_debitacct") {
      item.queryCondition = () => {
        let pk_org = formUtil.getFormItemsValue(
          FormConfig.formId, "pk_org").value;
        let pk_currtype = formUtil.getFormItemsValue(
          FormConfig.formId, "pk_currtype").value;
        return {
          pk_org: pk_org,
          pk_currtype: pk_currtype,
          acctype: 0,//0=活期，1=定期，2=通知，3=票据，4=保证金户，
          GridRefActionExt:
            "nccloud.web.lcm.receive.ref.action.LcmUnitAcctRefFilter"
        };
      };
    }
    // 计划项目
    if(item.attrcode == "pk_planitem"){
      //资金计划项目
        item.queryCondition = () => {
          let pk_org = this.props.form.getFormItemsValue(
            FormConfig.formId,
            "pk_org"
          ).value;
          return { 
            pk_org: pk_org,
            inoutdirect: 0,// 收支方向：0收入，1支出
            TreeRefActionExt: "nccloud.web.lcm.receive.ref.action.LcmPlanItemRefFilter"
          };
        };
      }
      return item;
  });

  // 子表meta设置
  //子表合同信息参照过滤
  meta.repayplan.items = meta.repayplan.items.map((item, key) => {
      // 利率过滤
      if (item.attrcode == "pk_extratecode") {
        item.queryCondition = () => {
          // 获取当前点击行数据
          let clickedData = cardTableUtil.getClickRowIndex(TableConfig.tableCode);
          // 根据行号获取展期开始日期的值
          if(clickedData){
            let extbegindate = cardTableUtil.getValByKeyAndIndex(
                    TableConfig.tableCode,clickedData.index, "extbegindate").value;
            let pk_org = formUtil.getFormItemsValue(FormConfig.formId, "pk_org")
              .value;
            let pk_group = formUtil.getFormItemsValue(FormConfig.formId, "pk_group")
              .value;
            return {
              pk_org: pk_org,
              pk_group: pk_group,
              ratetype: "LRATE",
              revisedate: extbegindate
            }
          };
        }
      }
      return item;
    }
  );
  // meta 是必须返回的
  return meta;
}
