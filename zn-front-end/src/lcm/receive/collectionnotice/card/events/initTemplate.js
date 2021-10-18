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

   if (item.attrcode === "pk_dept") {
          //部门过滤
          item.showHistory = true;
          item.queryCondition = () => {
            let pk_entrustorg = this.props.form.getFormItemsValue(
              FormConfig.formId,"pk_entrustorg").value;
            let pk_org = this.props.form.getFormItemsValue(
              FormConfig.formId,"pk_org").value;
            return {
              pk_org:(pk_entrustorg == ""? pk_org: pk_entrustorg)
            };
          };
        }
    //业务员参照
    if (item.attrcode == "pk_busipersion") {
      item.showHistory = true;
      item.queryCondition = () => {
        let pk_dept =
          this.props.form.getFormItemsValue(FormConfig.formId, "pk_dept") &&
          this.props.form.getFormItemsValue(FormConfig.formId,"pk_dept").value;
        let pk_org =
          this.props.form.getFormItemsValue(FormConfig.formId, "pk_entrustorg")
            .value == ""
            ? this.props.form.getFormItemsValue(FormConfig.formId, "pk_org").value
            : this.props.form.getFormItemsValue(FormConfig.formId, "pk_entrustorg")
                .value;
        return {
          pk_dept: pk_dept,
          pk_org: pk_org
        };
      };
    }

   // 客户参照过滤
   if (item.attrcode == "pk_customer") {
        item.queryCondition = () => {
          let pk_org = this.props.form.getFormItemsValue(FormConfig.formId, "pk_org").value;
          return {
            pk_org: pk_org 
          };
        };
      }

    //客户账户按币种,客户过滤
    if (item.attrcode == "pk_payaccount") {
      // item.refName = this.state.baseMultiLangData[
      //   "36630PUBLIC-000088"
      // ]; /* 国际化处理： 客商银行账户*/
      // item.fieldDisplayed = "refcode"; //账户显示编码
      item.queryCondition = () => {
        let pk_currtype = this.props.form.getFormItemsValue(
          FormConfig.formId,
          "pk_lccurrtype"
        ).value;
        let pk_cust = this.props.form.getFormItemsValue(
          FormConfig.formId,
          "pk_customer"
        ).value;
        return {
          pk_currtype: pk_currtype,
          pk_cust: pk_cust,
          GridRefActionExt:
            "nccloud.web.lcm.receive.ref.action.LcmCusUnitAccountRefFilter"
        };
      };
    }
 
    return item;
  });

  
    // 主表meta设置
    meta["collectInfo"].items.map((item, key) => {
        // 收款计划项目
        if(item.attrcode == "collectplan"){
          //资金计划项目
            item.queryCondition = () => {
              let pk_org = this.props.form.getFormItemsValue(
                FormConfig.formId,
                "pk_org"
              ).value;
              return { 
                pk_org: pk_org,
                inoutdirect: 0,
                TreeRefActionExt: "nccloud.web.lcm.receive.ref.action.LcmPlanItemRefFilter"
              };
            };
          }

                //使用参照权按币种过滤
      if (item.attrcode == "collectaccount") {
        item.queryCondition = () => {
          let pk_currtype = this.props.form.getFormItemsValue(
            FormConfig.formId,
            "pk_lccurrtype"
          ).value;
          return {
            pk_currtype: pk_currtype,
            GridRefActionExt:
              "nccloud.web.lcm.receive.ref.action.LcmUnitAcctRefFilter"
          };
        };
      }
      return item;
    });
      // meta 是必须返回的
      return meta;
    }







