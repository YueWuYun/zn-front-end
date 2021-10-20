/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import {
  setDefOrg2AdvanceSrchArea,
  setDefOrg2ListSrchArea,
} from "../../../../../tmpub/pub/util/index";
import { btnLimit, card, list } from "../../cons/constant.js";
import { bodyButtonClick } from "./bodyButtonClick";

export default function (props) {
  let appCode = props.getSearchParam("c") || props.getUrlParam("c");
  props.createUIDom(
    {
      pagecode: this.pageId, //页面code
      appcode: appCode,
    },
    (data) => {
      console.log(data, "data");
      if (data) {
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta.call(this, props, meta);
          setDefOrg2AdvanceSrchArea(props, this.searchId, data);
          props.meta.setMeta(meta);
          setDefOrg2ListSrchArea(props, this.searchId, data);
        }
        if (data.button) {
          /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
          let button = data.button;
          props.button.setButtons(button);
          props.button.setPopContent({
            delete: this.state.json[
              "36620GP-000005"
            ] /* 国际化处理： 确认要删除吗?*/,
          });
        }
      }
    }
  );
}

function modifierMeta(props, meta) {
  meta[this.searchId].items.find(
    (e) => e.attrcode === "pk_org"
  ).isMultiSelectedEnabled = true;
  meta[this.searchId].items.find(
    (e) => e.attrcode === "pk_org"
  ).queryCondition = {
    funcode: props.getSearchParam("c"), //appcode获取
    TreeRefActionExt: "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter",
  };
  meta[this.searchId].items.find(
    (item) => item.attrcode.indexOf("vdef") > -1
  ).queryCondition = (p) => {
    let pk_org = this.props.search.getSearchValByField(this.searchId, "pk_org");
    pk_org = pk_org && pk_org.value && pk_org.value.firstvalue;
    let pk_group = this.props.search.getSearchValByField(
      this.searchId,
      "pk_group"
    );
    pk_group = pk_group && pk_group.value && pk_group.value.firstvalue;
    return {
      pk_org,
      pk_group,
    };
  };
  meta[this.tableId].pagination = true;
  meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
    if (item.attrcode == "vbillno") {
      item.render = (text, record, index) => {
        return (
          <a
            style={{ color: "#007ace", cursor: "pointer" }}
            onClick={() => {
              props.pushTo("/card", {
                status: "browse",
                id: record[this.primaryId].value,
                pagecode: this.card.pageCode,
              });
            }}
          >
            {record && record.vbillno && record.vbillno.value}
          </a>
        );
      };
    }
    return item;
  });

  //添加操作列
  meta[this.tableId].items.push({
    attrcode: "opr",
    label: this.state.json["36620GP-000037"] /* 国际化处理： 操作*/,
    width: 250,
    fixed: "right",
    className: "table-opr",
    itemtype: "customer",
    visible: true,
    render: (text, record, index) => {
      return props.button.createErrorButton({
        record: record,
        showBack: false, // 是否显示回退按钮
        sucessCallBack: () => {
          let buttonAry = [];
          let vbillstatus = record.vbillstatus && record.vbillstatus.value;
          let guapropstatus =
            record.guapropstatus && record.guapropstatus.value;
          // 物权来源
          let datasource = record.datasource && record.datasource.value;
          let version = record.version && record.version.value;
          switch (vbillstatus) {
            case "-1": //自由态
              // 物权来源为商业汇票时不允许复制、删除、修改
              if (datasource === "2") {
                buttonAry.push("commit");
              } else {
                buttonAry.push("commit", "edit", "delete");
              }
              break;
            case "0": //审批未通过
              buttonAry = ["commit"];
              break;
            case "1": //审批通过
              buttonAry.push("uncommit");
              break;
            case "2": //审批进行中
              break;
            case "3": //提交
              buttonAry.push("uncommit");
              break;
          }
          //  物权状态:guapropstatus 1:未生效/2待押/3在押/4已解/5停用
          //来源为手工且待押物权或者已解物权可停用
          if (datasource === "1" && ["2", "4"].includes(guapropstatus)) {
            buttonAry.push("stop");
          }
          // 在押物权或者已解物权,且审批通过可变更
          if (
            datasource === "1" &&
            ["3", "4"].includes(guapropstatus) &&
            vbillstatus === "1"
          ) {
            buttonAry.push("change");
          }
          // 已停用且来源为手工的可启用
          if (datasource === "1" && guapropstatus === "5") {
            buttonAry.push("start");
          }
          if (+version < 2) {
            // 在押物权或者停用物权不可收回
            if (
              ["1", "3"].includes(vbillstatus) &&
              ["3", "5"].includes(guapropstatus)
            ) {
              let i = buttonAry.indexOf("uncommit");
              if (i > -1) {
                buttonAry.splice(i, 1);
              }
            }
          }
          return props.button.createOprationButton(buttonAry, {
            area: list.bodyCode,
            buttonLimit: btnLimit,
            onButtonClick: (props, key) =>
              bodyButtonClick.call(this, key, record, index),
          });
        },
      });
    },
  });
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/