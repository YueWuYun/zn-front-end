/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { bodyButtonClick } from "./bodyButtonClick";
import { list, card, appCode, btnLimit } from "../../cons/constant.js";
import {
  setDefOrg2ListSrchArea,
  setDefOrg2AdvanceSrchArea
} from "src/tmpub/pub/util/index";

export default function(props) {
  let appCode = props.getSearchParam("c") || props.getUrlParam("c");
  props.createUIDom(
    {
      pagecode: this.pageId, //页面code
      appcode: appCode
    },
    data => {
      if (data) {
        console.log(data, "data");
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
              "36620GC-000069"
            ] /* 国际化处理： 确认要删除吗?*/
          });
        }
      }
    }
  );
}

function modifierMeta(props, meta) {
  meta[this.searchId].items.find(
    e => e.attrcode === "pk_org"
  ).isMultiSelectedEnabled = true;
  meta[this.searchId].items.find(
    e => e.attrcode === "pk_org"
  ).queryCondition = {
    funcode: props.getSearchParam("c"), //appcode获取
    TreeRefActionExt: "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
  };
  meta[this.searchId].items.find(
    item => item.attrcode.indexOf("vdef") > -1
  ).queryCondition = p => {
    let pk_org = this.props.search.getSearchValByField(this.searchId, "pk_org");
    pk_org = pk_org && pk_org.value && pk_org.value.firstvalue;
    let pk_group = this.props.search.getSearchValByField(
      this.searchId,
      "pk_group"
    );
    pk_group = pk_group && pk_group.value && pk_group.value.firstvalue;
    return {
      pk_org,
      pk_group
    };
  };
  meta[this.tableId].pagination = true;
  meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
    if (item.attrcode == "contractno") {
      item.render = (text, record, index) => {
        return (
          <a
            style={{ color: "#007ace", cursor: "pointer" }}
            onClick={() => {
              props.pushTo("/card", {
                status: "browse",
                id: record[this.primaryId].value,
                pagecode: this.card.pageCode
              });
            }}
          >
            {record && record.contractno && record.contractno.value}
          </a>
        );
      };
    }
    return item;
  });

  //添加操作列
  meta[this.tableId].items.push({
    attrcode: "opr",
    label: this.state.json["36620GC-000021"] /* 国际化处理： 操作*/,
    width: 200,
    fixed: "right",
    className: "table-opr",
    visible: true,
    itemtype: "customer",
    render: (text, record, index) => {
      return props.button.createErrorButton({
        record: record,
        showBack: false, // 是否显示回退按钮
        sucessCallBack: () => {
          let buttonAry = [];
          let vbillstatus = record.vbillstatus && record.vbillstatus.value;
          let busistatus = record.busistatus && record.busistatus.value;
          switch (vbillstatus) {
            case "-1": //自由态
              buttonAry = ["commit", "edit", "delete"];
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
              buttonAry = ["uncommit"];
              break;
          }
          // 单据状态busistatus : 待提交=-1,待审批=0,未执行=1,在执行=2,已结束=3,已终止=4
          if (busistatus === "1") {
          } else if (busistatus === "2" && vbillstatus === "1") {
            buttonAry.push("change", "terminal");
          } else if (busistatus === "4") {
            if (vbillstatus === "1") {
              let i = buttonAry.indexOf("uncommit");
              if (i > -1) {
                buttonAry.splice(i, 1);
              }
            }
            buttonAry.push("unterminal");
          }
          // 在执行不可收回
          if (["1", "3"].includes(vbillstatus) && ["2"].includes(busistatus)) {
            let i = buttonAry.indexOf("uncommit");
            if (i > -1) {
              buttonAry.splice(i, 1);
            }
          }
          return props.button.createOprationButton(buttonAry, {
            area: list.bodyCode,
            buttonLimit: btnLimit,
            onButtonClick: (props, key) =>
              bodyButtonClick.call(this, key, record, index)
          });
        }
      });
    }
  });
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/