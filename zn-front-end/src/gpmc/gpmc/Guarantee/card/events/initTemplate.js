/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { tabs, appCode, btnLimit } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { tabButtonClick } from "./tabButtonClick";
import { afterEventEdit } from "./afterEvent";
import { initMethod, getCardData } from "./page";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";

export default function(props) {
  let app_code = props.getSearchParam("c") || props.getUrlParam("c") || appCode;
  props.createUIDom(
    {
      pagecode: this.pageId, //页面id
      appcode: app_code
    },
    data => {
      console.log(data, "data");
      if (data) {
        if (data.button) {
          props.button.setButtons(data.button);
          buttonVisible.call(this, props);
        }
        if (data.template) {
          let meta = data.template;
          let id = props.getUrlParam("id");
          meta = modifierMeta.call(this, props, meta);
          props.meta.renderTabs(meta, this.tabOrder, tabs.tabShow);
          if (
            props.getUrlParam("status") === "add" ||
            props.getUrlParam("status") === "copy"
          ) {
            initMethod.call(this, props);
          } else if (id) {
            getCardData.call(this, id, true);
          }
          orgVersionView(props, this.formId);
          props.getUrlParam("status") === "add" &&
            props.form.setFormItemsDisabled(this.formId, {
              pk_org: false
            });
        }
        if (data.context && props.getUrlParam("status") === "add") {
          let { pk_org, pk_org_v, org_Name, org_v_Name } = data.context;
          if (data.context.pk_org) {
            props.form.setFormItemsValue(this.formId, {
              pk_org: { display: org_Name, value: pk_org },
              pk_org_v: { display: org_v_Name, value: pk_org_v }
            });
            afterEventEdit.call(this, props, this.formId, "pk_org", {
              display: org_Name,
              value: pk_org
            });

            let obj = {
              warrantyinfo: {
                show: true,
                isCur: true
              },
              guarantyinfo: {
                show: true,
                isClear: true
              },
              pledgeinfo: {
                show: true,
                isClear: true
              }
            };
            props.cardTable.tabKeyShowSwitch(
              obj,
              props.getUrlParam("status") === "add"
            );
          } else {
            props.initMetaByPkorg();
          }
        }
      }
    }
  );
}
// 添加参照过滤条件
function modifierMeta(props, meta) {
  meta[this.formId].items.find(e => e.attrcode === "pk_org").queryCondition = {
    funcode: props.getSearchParam("c"), //appcode获取
    TreeRefActionExt: "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
  };
  //主表债务外部单位
  meta[this.formId].items.find(
    e => e.attrcode === "partdebtor"
  ).queryCondition = () => ({
    pk_financeorg: props.form.getFormItemsValue(this.formId, "pk_org").value,
    pk_org: props.form.getFormItemsValue(this.formId, "pk_org").value
  });
  //主表债权人外部单位
  meta[this.formId].items.find(
    e => e.attrcode === "partcreditor"
  ).queryCondition = () => ({
    pk_org: props.form.getFormItemsValue(this.formId, "pk_org").value
  });
  //主表担保外部单位
  meta[this.formId].items.find(
    e => e.attrcode === "partguarantor"
  ).queryCondition = () => ({
    pk_financeorg: props.form.getFormItemsValue(this.formId, "pk_org").value,
    pk_org: props.form.getFormItemsValue(this.formId, "pk_org").value
  });
  //主表债权人金融机构
  meta[this.formId].items.find(
    e => e.attrcode === "fincreditor"
  ).queryCondition = () => ({
    pk_org: props.form.getFormItemsValue(this.formId, "pk_org").value
  });
  //主表担保人金融机构
  meta[this.formId].items.find(
    e => e.attrcode === "finguarantor"
  ).queryCondition = () => ({
    pk_org: props.form.getFormItemsValue(this.formId, "pk_org").value
  });
  //主表自定义项
  meta[this.formId].items.find(
    item => item.attrcode.indexOf("vdef") > -1
  ).queryCondition = p => {
    let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org");
    pk_org = pk_org && pk_org.value;
    let pk_group = this.props.form.getFormItemsValue(this.formId, "pk_group");
    pk_group = pk_group && pk_group.value;
    return {
      pk_org,
      pk_group
    };
  };
  //主表操作信息自定义项
  meta.operateinfo.items.find(
    item => item.attrcode.indexOf("vdef") > -1
  ).queryCondition = p => {
    let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org");
    pk_org = pk_org && pk_org.value;
    let pk_group = this.props.form.getFormItemsValue(this.formId, "pk_group");
    pk_group = pk_group && pk_group.value;
    return {
      pk_org,
      pk_group
    };
  };

  //主表担保债务信息自定义项
  meta.guadebtor.items.find(
    item => item.attrcode.indexOf("vdef") > -1
  ).queryCondition = p => {
    let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org");
    pk_org = pk_org && pk_org.value;
    let pk_group = this.props.form.getFormItemsValue(this.formId, "pk_group");
    pk_group = pk_group && pk_group.value;
    return {
      pk_org,
      pk_group
    };
  };
  //担保债务信息
  meta.guadebtor.items.find(
    e => e.attrcode === "debttype"
  ).queryCondition = () => ({
    type: "1"
  });
  //保证信息
  meta.warrantyinfo.items.find(
    e => e.attrcode === "warrantorou"
  ).queryCondition = () => ({
    pk_financeorg: props.form.getFormItemsValue(this.formId, "pk_org").value,
    pk_org: props.form.getFormItemsValue(this.formId, "pk_org").value
  });
  //子表保证信息：担保人金融机构
  meta.warrantyinfo.items.find(
    e => e.attrcode === "warrantorfin"
  ).queryCondition = () => ({
    pk_org: props.form.getFormItemsValue(this.formId, "pk_org").value
  });
  //保证信息--测拉
  meta.warrantyinfo2.items.find(
    e => e.attrcode === "warrantorou"
  ).queryCondition = () => ({
    pk_financeorg: props.form.getFormItemsValue(this.formId, "pk_org").value,
    pk_org: props.form.getFormItemsValue(this.formId, "pk_org").value
  });
  //抵押
  meta.guarantyinfo.items.find(
    e => e.attrcode === "pledgeno"
  ).queryCondition = () => {
    return {
      guagptype: "1",
      pk_org: props.form.getFormItemsValue(this.formId, "pk_org").value,
      partdebtor:
        props.form.getFormItemsValue(this.formId, "partdebtor").value || null,
      owerdebtor:
        props.form.getFormItemsValue(this.formId, "owerdebtor").value || null,
      indebtor:
        props.form.getFormItemsValue(this.formId, "indebtor").value || null
    };
  };
  //抵押--测拉
  meta.guarantyinfo2.items.find(
    e => e.attrcode === "pledgeno"
  ).queryCondition = () => {
    return {
      guagptype: "1",
      pk_org: props.form.getFormItemsValue(this.formId, "pk_org").value,
      partdebtor:
        props.form.getFormItemsValue(this.formId, "partdebtor").value || null,
      owerdebtor:
        props.form.getFormItemsValue(this.formId, "owerdebtor").value || null,
      indebtor:
        props.form.getFormItemsValue(this.formId, "indebtor").value || null
    };
  };
  //质押
  meta.pledgeinfo.items.find(
    e => e.attrcode === "pledgeno"
  ).queryCondition = () => {
    return {
      guagptype: "2",
      pk_org: props.form.getFormItemsValue(this.formId, "pk_org").value,
      partdebtor:
        props.form.getFormItemsValue(this.formId, "partdebtor").value || null,
      owerdebtor:
        props.form.getFormItemsValue(this.formId, "owerdebtor").value || null,
      indebtor:
        props.form.getFormItemsValue(this.formId, "indebtor").value || null
    };
  };
  //质押--测拉
  meta.pledgeinfo2.items.find(
    e => e.attrcode === "pledgeno"
  ).queryCondition = () => {
    return {
      guagptype: "2",
      pk_org: props.form.getFormItemsValue(this.formId, "pk_org").value,
      partdebtor:
        props.form.getFormItemsValue(this.formId, "partdebtor").value || null,
      owerdebtor:
        props.form.getFormItemsValue(this.formId, "owerdebtor").value || null,
      indebtor:
        props.form.getFormItemsValue(this.formId, "indebtor").value || null
    };
  };
  //担保信息
  meta.contractinfo.items.find(
    e => e.attrcode === "contractno"
  ).queryCondition = () => {
    let pk_org = props.form.getFormItemsValue(this.formId, "pk_org").value; //财务组织
    let contracttype = props.form.getFormItemsValue(this.formId, "contracttype")
      .value; //合同类型
    let partdebtor = props.form.getFormItemsValue(this.formId, "partdebtor")
      .value; //债务人合作伙伴
    let owerdebtor = props.form.getFormItemsValue(this.formId, "owerdebtor")
      .value; //债务人本单位
    let indebtor = props.form.getFormItemsValue(this.formId, "indebtor").value; //债务人内部单位
    let fincreditor = props.form.getFormItemsValue(this.formId, "fincreditor")
      .value; //债权人金融机构
    let partcreditor = props.form.getFormItemsValue(this.formId, "partcreditor")
      .value; //债权人外部单位
    let increditor = props.form.getFormItemsValue(this.formId, "increditor")
      .value; //债务人内部单位
    let owercreditor = props.form.getFormItemsValue(this.formId, "owercreditor")
      .value; //债权人本单位
    let guastartdate = props.form.getFormItemsValue(this.formId, "guastartdate")
      .value; //担保开始日期
    let guaenddate = props.form.getFormItemsValue(this.formId, "guaenddate")
      .value; //担保结束日期
    if (contracttype === "1") {
      return {
        pk_debtor: partdebtor || owerdebtor || indebtor
      };
    } else if (contracttype === "2") {
      return {
        pk_org,
        fincreditor,
        partcreditor,
        increditor,
        owercreditor,
        contracttype,
        startdate: guastartdate,
        enddate: guaenddate
      };
    }
  };
  //担保信息--测拉
  meta.contractinfo2.items.find(
    e => e.attrcode === "contractno"
  ).queryCondition = () => {
    let contracttype = props.form.getFormItemsValue(this.formId, "contracttype")
      .value; //合同类型
    let partdebtor = props.form.getFormItemsValue(this.formId, "partdebtor")
      .value; //债务人合作伙伴
    let owerdebtor = props.form.getFormItemsValue(this.formId, "owerdebtor")
      .value; //债务人本单位
    let indebtor = props.form.getFormItemsValue(this.formId, "indebtor").value; //债务人内部单位
    let fincreditor = props.form.getFormItemsValue(this.formId, "fincreditor")
      .value; //债权人金融机构
    let partcreditor = props.form.getFormItemsValue(this.formId, "partcreditor")
      .value; //债权人外部单位
    let increditor = props.form.getFormItemsValue(this.formId, "increditor")
      .value; //债务人内部单位
    let owercreditor = props.form.getFormItemsValue(this.formId, "owercreditor")
      .value; //债权人本单位
    let guastartdate = props.form.getFormItemsValue(this.formId, "guastartdate")
      .value; //担保开始日期
    let guaenddate = props.form.getFormItemsValue(this.formId, "guaenddate")
      .value; //担保结束日期
    if (contracttype === "1") {
      return {
        pk_debtor: partdebtor || owerdebtor || indebtor
      };
    } else if (contracttype === "2") {
      return {
        fincreditor,
        partcreditor,
        increditor,
        owercreditor,
        contracttype,
        startdate: guastartdate,
        enddate: guaenddate
      };
    }
  };
  for (let item of Object.keys(meta.gridrelation)) {
    meta[item].items.push({
      attrcode: "opr",
      label: this.state.json["36620GC-000021"] /* 国际化处理： 操作*/,
      itemtype: "customer",
      fixed: "right",
      className: "table-opr",
      visible: true,
      width: "210px",
      render: (text, record, index) => {
        let { isPaste } = this.state;
        let status = this.props.getUrlParam("status");
        let buttonAry = [];
        if (["add", "edit", "change", "copy"].includes(status)) {
          //编辑态
          buttonAry = isPaste
            ? ["copyThisRow"]
            : ["cela", "copy", "insert", "delete"];
        } else {
          //浏览态
          buttonAry = [record.expandRowStatus ? "fold" : "unfold"];
        }

        return this.props.button.createOprationButton(buttonAry, {
          area: tabs.bodyCode,
          buttonLimit: btnLimit,
          onButtonClick: (props, key) =>
            tabButtonClick.call(this, props, key, text, record, index)
        });
      }
    });
  }
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/