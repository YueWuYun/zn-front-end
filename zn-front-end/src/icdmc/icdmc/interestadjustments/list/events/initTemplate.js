/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea, go2CardCheck } from "src/tmpub/pub/util/index";
import { btnLimit, card, list, busistatusvalue, baseReqUrl, javaUrl } from "../../cons/constant.js";
import { bodyButtonClick } from "./bodyButtonClick";

export default function (props) {
  let appCode = props.getSearchParam("c") || props.getUrlParam("c");
  props.createUIDom(
    {
      pagecode: this.pageId, //页面code
      appcode: appCode
    },
    data => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta.call(this, props, meta);
          setDefOrg2AdvanceSrchArea(props, this.searchId, data, "pk_fundorg");
          props.meta.setMeta(meta);
          setDefOrg2ListSrchArea(props, this.searchId, data, "pk_fundorg");
        }
        if (data.button) {
          /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
          let button = data.button;
          props.button.setButtons(button);
          props.button.setPopContent({
            delete: this.state.json[
              "36360ICIA-000004"
            ] /* 国际化处理： 确认要删除吗?*/
          });
        }
      }
    }
  );
}

function modifierMeta(props, meta) {

  meta[this.searchId].items.find(e => e.attrcode === "pk_fundorg").isMultiSelectedEnabled = true;
  meta[this.searchId].items.find(e => e.attrcode === "pk_fundorg").isShowDisabledData = true;// 资金组织参照，显示停用单选框
  
  meta[this.searchId].items.find(e => e.attrcode === "pk_innerloanpay").isMultiSelectedEnabled = true;
  meta[this.searchId].items.find(e => e.attrcode === "pk_innerloanpay").isShowDisabledData = true;// 放款编号参照，显示停用单选框
  
  meta[this.searchId].items.find(e => e.attrcode === "pk_fundorg").queryCondition = {
      funcode: props.getSearchParam("c"), //appcode获取
      TreeRefActionExt: "nccloud.web.tmpub.filter.FundOrgPermissionFilter"
    };
    
  // meta[this.searchId].items.find(
  //   e => e.attrcode === "pk_contract"
  // ).queryCondition = () => {
  //   return {
  //     isquery: "true",
  //     pk_org: props.search.getSearchValByField(this.searchId, "pk_org").value
  //       .firstvalue
  //   };
  // };
  // meta[this.searchId].items.find(
  //   e => e.attrcode === "financepayno"
  // ).queryCondition = () => {
  //   return {
  //     isquery: "true",
  //     pk_org: props.search.getSearchValByField(this.searchId, "pk_org").value
  //       .firstvalue
  //   };
  // };
  meta[this.tableId].pagination = true;
  meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
    if (item.attrcode == "vbillno") {
      item.render = (text, record, index) => {
        return (
          <a
            style={{ color: "#007ace", cursor: "pointer" }}
            onClick={() => {
              go2CardCheck({
                props,
                url: `${baseReqUrl}${javaUrl.gotocardcheck}.do`,
                pk: record[this.primaryId].value,
                ts: record["ts"].value,
                checkTS: false,
                checkSaga: false,
                fieldPK: this.primaryId,
                go2CardFunc: () => {
                  props.pushTo("/card", {
                    status: "browse",
                    id: record[this.primaryId].value,
                    pagecode: this.card.pageCode
                  });
                }
            })

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
    label: this.state.json["36360ICIA-000019"] /* 国际化处理： 操作*/,
    width: 250,
    fixed: "right",
    className: "table-opr",
    itemtype: "customer",
    visible: true,
    render: (text, record, index) => {
      let buttonAry = [];
      let vbillstatus = record.vbillstatus && record.vbillstatus.value;// 单据状态
      let approvestatus = record.approvestatus && record.approvestatus.value;// 审批状态
      switch (approvestatus) {
        case "-1": //自由态
          buttonAry.push("commit", "edit", "delete");
          break;
        case "0": //审批未通过
          buttonAry = ["commit"];
          break;
        case "1": //审批通过
          buttonAry.push("uncommit");
          // if(busistatus === busistatusvalue.busistatus_unexecuted || busistatus === busistatusvalue.busistatus_executed){
          //   let coordinationstatus = record.coordinationstatus && record.coordinationstatus.value;
          //   let datasources = record.datasources && record.datasources.value;
          //   if(datasources === 'MANUAL'){
          //     buttonAry.push("uncommit");
          //     if(coordinationstatus === false){
          //       buttonAry.push("Coordination");
          //     }else{
          //       buttonAry.push("CancelCoordination");
          //     }
          //   }else{
          //     buttonAry.push("Return");
          //   }
          // }
          break;
        case "2": //审批进行中
          break;
        case "3": //提交
          buttonAry.push("uncommit");
          break;
      }

      return props.button.createOprationButton(buttonAry, {
        area: list.bodyCode,
        buttonLimit: btnLimit,
        onButtonClick: (props, key) =>
          bodyButtonClick.call(this, key, record, index)
      });
    }
  });
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/