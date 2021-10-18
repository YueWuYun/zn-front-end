/**
 * 处理 meta 数据, 比如添加参照过滤等操作
 */
import { ajax } from "nc-lightapp-front";
export default function (meta) {
  let {
    FormConfig,
    form: formUtil
  } = this.props;

  // 主表meta设置
  meta[FormConfig.formId].items.map((item) => {
    if (item.attrcode === "pk_org") {
      //财务组织
      item.queryCondition = () => {
        return {
          funcode: this.props.getSearchParam("c"), //appcode获取
          TreeRefActionExt: "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter",
        };
      };
    }

    return item;
  });

  // 子表meta设置
  //担保页签参照过滤
  meta.header_guarantee.items = meta.header_guarantee.items.map(
    item => {
      //担保合同
      if (item.attrcode === "pk_guaprotocol") {
        //财务组织
        item.queryCondition = () => {
          // 担保合同参照过滤
          let guaranteetype = formUtil.getFormItemsValue(
            FormConfig.formId,
            "guaranteetype"
          );
          guaranteetype = guaranteetype && guaranteetype.value;
          // 财务组织字段作为借款单位
          let pk_org = formUtil.getFormItemsValue(FormConfig.formId, "pk_org");
          pk_org = pk_org && pk_org.value;
          //开证行银行大类
          let pk_banktype = formUtil.getFormItemsValue(
            FormConfig.formId,
            "pk_banktype"
          );
          pk_banktype = pk_banktype && pk_banktype.value;
          return {
            guatype: guaranteetype,
            contracttype: "1",
            //债务人
            pk_debtor: pk_org,
            //债权人
            pk_creditor: pk_banktype,
            isLcm: "true"
          }; // 过滤
        };
      }
      return item;
    }
  );
  //授信页签参照过滤
  meta.header_authinfo.items = meta.header_authinfo.items.map(
    item => {
      if (item.attrcode === "pk_ccterm") {
        item.queryCondition = () => {
          //组织
          // 表头贷款金融机构银行大类
          let pk_org = formUtil.getFormItemsValue(
            FormConfig.formId,
            "pk_org"
          );
          pk_org = pk_org && pk_org.value;
          //币种
          let pk_lccurrtype = formUtil.getFormItemsValue(
            FormConfig.formId,
            "pk_lccurrtype"
          );
          pk_lccurrtype = pk_lccurrtype && pk_lccurrtype.value;
          //开证行
          let pk_bank_issuing = formUtil.getFormItemsValue(
            FormConfig.formId,
            "pk_bank_issuing"
          );
          pk_bank_issuing = pk_bank_issuing && pk_bank_issuing.value;
          //修改日期
          let billdate = formUtil.getFormItemsValue(
            FormConfig.formId,
            "openmodifydate"
          );
          billdate = billdate && billdate.value;
          return {
            orgunit: pk_org,
            currtype: pk_lccurrtype,
            begindate: billdate,
            bankdoc: pk_bank_issuing,
            protocolstatus: "NOEXECUTE,EXECUTING"
          };
        };
      }
      if (item.attrcode === "cccategory") {
        //授信类别根据授信协议过滤
        item.queryCondition = () => {
          let pk_protocol = formUtil.getFormItemsValue(
            FormConfig.formId,
            "pk_ccterm"
          );
          let pk_cctype;
          if (pk_protocol) {
            ajax({
              url: "/nccloud/ccc/bankprotocol/CCTypeGridRef.do",
              async: false,
              data: { pk: pk_protocol.value },
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

   //保证金页签参照过滤
   meta.header_pledge.items = meta.header_pledge.items.map(
    item => {
      // 保证金账户按币种过滤(使用权参照)
    if (item.attrcode == "pk_acc_pledge") {
  //       item.fieldDisplayed = "refcode"; //账户显示编码
        item.queryCondition = () => {
          let pk_org = this.props.form.getFormItemsValue(
            FormConfig.formId,
            "pk_org"
          ).value;
          let pk_currtype = this.props.form.getFormItemsValue(
            FormConfig.formId,
            "pk_lccurrtype"
          ).value;
          return {
            pk_org: pk_org,
            pk_currtype: pk_currtype,
            GridRefActionExt:
              "nccloud.web.lcm.receive.ref.action.LcmUnitAcct4MarginRefFilter"
          };
        };
      }
  
      return item;
    }
  );
  // meta 是必须返回的
  return meta;
}
