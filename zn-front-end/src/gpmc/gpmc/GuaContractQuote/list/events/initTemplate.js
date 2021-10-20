/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import tableButtonClick from "./bodyButtonClick";
import { list, card, appCode, btnLimit } from "../../cons/constant.js";
import {
  setDefOrg2AdvanceSrchArea,
  setDefOrg2ListSrchArea
} from "../../../../../tmpub/pub/util/index";

export default function(props) {
  let appCode = props.getSearchParam("c") || props.getUrlParam("c");
  props.createUIDom(
    {
      pagecode: this.pageId, //页面code
      appcode: appCode
    },
    data => {
      console.log(data, "data");
      if (data) {
        if (data.template) {
          let meta = data.template;
          //高级查询区域加载默认业务单元
          setDefOrg2AdvanceSrchArea(props, list.searchCode, data);
          meta = modifierMeta.call(this, props, meta);
          props.meta.setMeta(meta);
          //列表查询区域加载默认业务单元
          setDefOrg2ListSrchArea(props, list.searchCode, data);
        }
        if (data.button) {
          /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
          props.button.setButtons(data.button);
          props.button.setPopContent(
            "delete",
            this.state.json["36620GBM-000005"]
          ); /* 国际化处理： 确认要删除吗?*/
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
    //财务组织:全加载
    meta[this.searchId].items.find(
      e => e.attrcode === "pk_org"
    ).isTreelazyLoad = false;

    meta[this.searchId].items.map(item => {
      //发送发组织，接收方组织：根据用户权限过滤
      if (item.attrcode == "pk_org") {
        item.queryCondition = () => {
          return {
            funcode: props.getSearchParam("c"), //appcode获取
            TreeRefActionExt:
              "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
          };
        };
      }
    });
    if (item.attrcode == "vbillno") {
      item.render = (text, record, index) => {
        return (
          <a
            style={{ cursor: "pointer" }}
            onClick={() => {
              props.pushTo("/card", {
                status: "browse",
                id: record[this.primaryId].value,
                pagecode: this.card.pageCode
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
    label: "操作",
    width: 200,
    fixed: "right",
    className: "table-opr",
    visible: true,
    itemtype: "customer",
    render: (text, record, index) => {
      let buttonAry = [];
      let vbillstatus = record.vbillstatus && record.vbillstatus.value;
      let datasource = record.datasource && record.datasource.value;
      if (datasource !== "2") {
        //非融资生成的可以操作
        switch (vbillstatus) {
          case "-1": //自由态
            buttonAry = ["commit", "edit", "delete"];
            break;
          case "0": //审批未通过
            buttonAry = ["commit"];
            break;
          case "1": //审批通过
            buttonAry = ["uncommit"];
            break;
          case "2": //审批进行中
            break;
          case "3": //提交
            buttonAry = ["uncommit"];
            break;
        }
      }
      return props.button.createOprationButton(buttonAry, {
        area: "list_inner",
        buttonLimit: btnLimit,
        onButtonClick: (props, key) =>
          tableButtonClick.call(this, props, key, text, record, index)
      });
    }
  });
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/