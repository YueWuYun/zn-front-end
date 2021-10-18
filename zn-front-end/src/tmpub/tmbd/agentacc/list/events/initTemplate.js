/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/
import {
  list_search_id,
  list_page_id,
  list_table_id,
  appcode,
  card_page_id
} from "../../cons/constant.js";
import bodyButtonClick from "./bodyButtonClick";
import buttonUsability from "./buttonUsability";
import {
  setDefOrg2ListSrchArea,
  setDefOrg2AdvanceSrchArea
} from "../../../../pub/util/index";
let searchId = list_search_id;
let tableId = list_table_id;
let pageId = list_page_id;

export default function(props) {
  let that = this;
  props.createUIDom(
    {
      pagecode: pageId //页面id
      //appid: app_id
    },
    function(data) {
      if (data) {
        if (data.button) {
          let button = data.button;
          let multiLang = that.state.json;
          props.button.setButtons(button);
          props.button.setPopContent(
            "Delete_i",
            props.MutiInit.getIntl("36010SA") &&
              props.MutiInit.getIntl("36010SA").get("36010SA-000018")
          ); /* 国际化处理： 确认要删除该信息吗？*/
          props.button.setPopContent(
            "Confirm_i",
            props.MutiInit.getIntl("36010SA") &&
              props.MutiInit.getIntl("36010SA").get("36010SA-000011")
          ); /* 国际化处理： 确定要确认当前数据吗？*/
          // props.button.setPopContent('Confirm_i', multiLang['36010SA-000011']);/* 国际化处理： 确定要确认当前数据吗？*/
          props.button.setPopContent(
            "UnConfirm_i",
            props.MutiInit.getIntl("36010SA") &&
              props.MutiInit.getIntl("36010SA").get("36010SA-000012")
          ); /* 国际化处理： 确定要取消确认当前数据吗？*/
          props.button.setPopContent(
            "UnEnable",
            props.MutiInit.getIntl("36010SA") &&
              props.MutiInit.getIntl("36010SA").get("36010SA-000013")
          ); /* 国际化处理： 将对您当前选择的代理结算账户进行停用，请确认*/
          props.button.setPopContent(
            "Enable",
            props.MutiInit.getIntl("36010SA") &&
              props.MutiInit.getIntl("36010SA").get("36010SA-000014")
          ); /* 国际化处理： 将对您当前选择的代理结算账户进行启用，请确认*/
        }
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta(that, props, meta);
          setDefOrg2AdvanceSrchArea(props, list_search_id, data);
          props.meta.setMeta(meta);
          setDefOrg2ListSrchArea(props, list_search_id, data);
        }
        buttonUsability.call(that, props, ""); //列表按钮置灰
      }
    }
  );
}

function modifierMeta(that, props, meta) {
  meta[searchId].items.find(
    e => e.attrcode === "pk_org"
  ).isMultiSelectedEnabled = true;
  //财务组织跨集团
  let financeorgMeta = meta[searchId].items.find(
    e => e.attrcode === "cfgdetail.pk_financeorg"
  );
  if (financeorgMeta) {
    financeorgMeta.isShowUnit = true;
  }

  meta[tableId].items = meta[tableId].items.map((item, key) => {
    if (item.attrcode == "pk_bankaccount") {
      item.render = (text, record, index) => {
        return (
          <a
            style={{ cursor: "pointer" }}
            onClick={() => {
              that.addQueryCache();
              props.pushTo("/card", {
                status: "browse",
                id: record.pk_agentacccfg.value,
                pagecode: card_page_id
              });
            }}
          >
            {record.pk_bankaccount ? record.pk_bankaccount.display : ""}
          </a>
        );
      };
    }
    return item;
  });
  meta[searchId].items.map(item => {
    item.isShowDisabledData = true;
    //资金组织
    if (item.attrcode == "pk_org") {
      item.queryCondition = () => {
        return {
          funcode: appcode,
          TreeRefActionExt: "nccloud.web.tmpub.filter.FundOrgPermissionFilter" //自定义参照过滤条件
        };
      };
    }
    //代理结算账户
    else if (item.attrcode == "pk_bankaccount") {
      item.queryCondition = () => {
        let pk_org = props.search.getSearchValByField(searchId, "pk_org").value
          .firstvalue;
        return {
          pk_orgs: pk_org,
          noConditionOrg: "Y",
          GridRefActionExt:
            "nccloud.web.tmpub.agentacc.filter.AgentAccMultiBankAccFilter" //自定义参照过滤条件
        };
      };
    }
  });
  //添加操作列
  let material_event = {
    // label: that.state.json['36010SA-000015'],
    label:
      props.MutiInit.getIntl("36010SA") &&
      props.MutiInit.getIntl("36010SA").get(
        "36010SA-000015"
      ) /* 国际化处理： 操作*/,
    itemtype: "customer",
    attrcode: "opr",
    width: "200px",
    visible: true,
    fixed: "right",
    render: (text, record, index) => {
      // billstatus 确认标识 0=未确认，1=已确认，2=变更待确认，
      // enablestate 停用标志 1=未启用，2=已启用，3=已停用，
      let buttonAry = [];
      if (record && record.billstatus) {
        // 修改 删除 确认
        if (record.billstatus.value === "0") {
          buttonAry.push("Confirm_i");
          buttonAry.push("Edit_i");
          buttonAry.push("Delete_i");
        }
        if (record.billstatus.value === "2") {
          buttonAry.push("Confirm_i");
          buttonAry.push("Modify_i");
        }
        //变更、确认、停用
        if (
          record.billstatus.value === "1" &&
          record.enablestate.value === "2"
        ) {
          buttonAry.push("UnConfirm_i");
          buttonAry.push("Modify_i");
          buttonAry.push("UnEnable");
        }
        //启用、取消确认、变更
        if (
          record.billstatus.value === "1" &&
          record.enablestate.value === "3"
        ) {
          buttonAry.push("UnConfirm_i");
          buttonAry.push("Modify_i");
          buttonAry.push("Enable");
        }
      }
      return props.button.createOprationButton(buttonAry, {
        area: "list_inner",
        buttonLimit: 3,
        onButtonClick: (props, key) =>
          bodyButtonClick.call(that, props, key, text, record, index)
      });
    }
  };
  meta[tableId].items.push(material_event);
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/