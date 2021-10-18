/**
 * 处理 meta 数据, 比如添加参照过滤等操作
 */

export default function (meta) {
  let { FormConfig, form: formUtil } = this.props;

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
    };
    if (item.attrcode === "pk_recaccount") {
      //收款银行账户 参照客商银行账户子户
      item.refName = this.state.baseMultiLangData[
        "3617PUB-000062"
      ]; /* 国际化处理： 供应商银行账户*/
      item.queryCondition = () => {
        let pk_cust = this.props.form.getFormItemsValue(
          FormConfig.formId,
          "pk_supplier"
        ).value;
        let pk_currtype = this.props.form.getFormItemsValue(
          FormConfig.formId,
          "pk_lcmcurrtype"
        ).value;
        return {
          pk_cust: pk_cust,
          pk_currtype: pk_currtype,
          TreeRefActionExt:
            "nccloud.web.lcm.receive.ref.action.LcmCusUnitAccountRefFilter",
        };
      };
    };
    // 付款计划项目
    if (item.attrcode === "pk_plan"){
      //资金计划项目
        item.queryCondition = () => {
          let pk_org = this.props.form.getFormItemsValue(
            FormConfig.formId,
            "pk_org"
          ).value;
          return { 
            pk_org: pk_org,
            inoutdirect: 1, //支出方向
            TreeRefActionExt: "nccloud.web.lcm.receive.ref.action.LcmPlanItemRefFilter"
          };
        };
  }
  });

  // 付款信息子表meta设置
  meta[FormConfig.paymentinfo].items.map((item) => {
    //现汇支付账户
    if (item.attrcode == "spotaccount") {
      item.queryCondition = () => {
        let pk_org = this.props.form.getFormItemsValue(
          FormConfig.formId,
          "pk_org"
        ).value;
        let pk_currtype = this.props.form.getFormItemsValue(
          FormConfig.formId,
          "pk_lcmcurrtype"
        ).value;
        return {
          pk_org: pk_org,
          pk_currtype: pk_currtype,
          GridRefActionExt:
            "nccloud.web.lcm.receive.ref.action.LcmUnitAcctRefFilter"
        };
      };
    };
    //卖汇账户
    if (item.attrcode == "sellaccount") {
      item.queryCondition = () => {
        let pk_org = this.props.form.getFormItemsValue(
          FormConfig.formId,
          "pk_org"
        ).value;
        let pk_currtype = this.props.form.getFormItemsValue(
          FormConfig.formId,
          "pk_sell_currtype"
        ).value;
        return {
          pk_org: pk_org,
          pk_currtype: pk_currtype,
          GridRefActionExt:
            "nccloud.web.lcm.receive.ref.action.LcmUnitAcctRefFilter"
        };
      };
    };
    //保证金账户
    if (item.attrcode == "depositaccount") {
      item.queryCondition = () => {
        let pk_org = this.props.form.getFormItemsValue(
          FormConfig.formId,
          "pk_org"
        ).value;
        let pk_currtype = this.props.form.getFormItemsValue(
          FormConfig.formId,
          "pk_pledgecurr"
        ).value;
        return {
          pk_org: pk_org,
          pk_currtype: pk_currtype,
          GridRefActionExt:
            "nccloud.web.lcm.receive.ref.action.LcmUnitAcct4MarginRefFilter"
        };
      };
    }
  });
  // meta 是必须返回的
  return meta;
}
