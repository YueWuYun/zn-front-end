import { ajax } from "nc-lightapp-front";

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
    //利率
     if (item.attrcode == "pk_ratecode") {
      item.queryCondition = () => {
        let pk_org = formUtil.getFormItemsValue(FormConfig.formId, "pk_org")
          .value;
        let pk_group = formUtil.getFormItemsValue(FormConfig.formId, "pk_group")
          .value;
        let begindate = formUtil.getFormItemsValue(
          FormConfig.formId,
          "begindate"
        );
        return {
          pk_org: pk_org,
          pk_group: pk_group,
          ratetype: "LRATE",
          revisedate: begindate && begindate.value
        };
      };
    }
    // if (item.attrcode === "pk_settledate") {
    //   //结息日
    //   item.queryCondition = () => {
    //     let returnmode = formUtil.getFormItemsValue(
    //       FormConfig.formId,
    //       "returnmode"
    //     ).value;
    //     return {
    //       pk_repaymentmethod: returnmode
    //     };
    //   };
    // }
    //银行账户
    if (item.attrcode == "pk_debitunitacct") {
      //       item.fieldDisplayed = "refcode"; //账户显示编码
            item.queryCondition = () => {
              let pk_org = this.props.form.getFormItemsValue(
                FormConfig.formId,
                "pk_org"
              ).value;
              let pk_currtype = this.props.form.getFormItemsValue(
                FormConfig.formId,
                "pk_currtype"
              ).value;
              return {
                pk_org: pk_org,
                pk_currtype: pk_currtype,
                GridRefActionExt:
                  "nccloud.web.lcm.receive.ref.action.LcmUnitAcctRefFilter"
              };
            };
          }
      return item;
  }
  
  );
  //授信页签参照过滤
  meta.header_authinfo.items = meta.header_authinfo.items.map(
    item => {
      if (item.attrcode === "pk_bankprotocol") {
        item.queryCondition = () => {
          //组织
          // 表头贷款金融机构银行大类
          let pk_org = formUtil.getFormItemsValue(
            FormConfig.formId,
            "pk_org"
          );
          pk_org = pk_org && pk_org.value;
          //币种
          let pk_currtype = formUtil.getFormItemsValue(
            FormConfig.formId,
            "pk_currtype"
          );
          pk_currtype = pk_currtype && pk_currtype.value;
          //押汇银行
          let pk_creditbank = formUtil.getFormItemsValue(
            FormConfig.formId,
            "pk_creditbank"
          );
          pk_creditbank = pk_creditbank && pk_creditbank.value;
          //修改日期
          let begindate = formUtil.getFormItemsValue(
            FormConfig.formId,
            "begindate"
          );
          begindate = begindate && begindate.value;
          return {
            orgunit: pk_org,
            currtype: pk_currtype,
            begindate: begindate,
            bankdoc: pk_creditbank,
            protocolstatus: "NOEXECUTE,EXECUTING"
          };
        };
      }
      if (item.attrcode === "pk_cctype") {
        //授信类别根据授信协议过滤
        item.queryCondition = () => {
          let pk_bankprotocol = formUtil.getFormItemsValue(
            FormConfig.formId,
            "pk_bankprotocol"
          );
          let pk_cctype;
          if (pk_bankprotocol) {
            ajax({
              url: "/nccloud/ccc/bankprotocol/CCTypeGridRef.do",
              async: false,
              data: { pk: pk_bankprotocol.value },
              success: res => {
                if (res.data) {
                  pk_cctype = res.data.join();
                }
              }
            });
          }
          return { pk_cctype: pk_cctype || "null" };
        };
      }
      return item;
    }
  );

  // 子表meta设置

  // meta 是必须返回的
  return meta;
}
