/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/
import { bodyButtonClick } from "./bodyButtonClick";
import { list, card, appCode, btnLimit } from "../../cons/constant.js";
import { exdInit } from "./treeEvent";

export default function(props, json) {
  let appCode =
    props.getSearchParam("c") || props.getUrlParam("c") || this.appcode;
  props.createUIDom(
    {
      pagecode: this.pageId, //页面id
      appcode: appCode
    },
    data => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta.call(this, props, meta, json);
          props.meta.setMeta(meta, () => {
            if (this.appcode == "36010NBFO") {
              //给全局的所属组织赋默认值
              props.search.setSearchValByField(this.searchId, "pk_org", {
                value: "GLOBLE00000000000000",
                display: this.state.json["36010NBFO-000046"]
              });
            } else if (this.appcode == "36010NBFOG") {
              //给集团和组织赋当前登陆的集团
              let { groupId, groupName } = this.businessInfo;
              if (groupId && groupName) {
                props.search.setSearchValByField(this.searchId, "pk_org", {
                  value: groupId,
                  display: groupName
                });
              }
            } else {
              // 全局上下文 其中包含当前组织
              this.setState({
                context: data.context
              });
              //给组织赋当前组织
              let { pk_org, org_Name } = data.context;
              if (pk_org && pk_org !== "GLOBLE00000000000000") {
                props.search.setSearchValByField(this.searchId, "pk_org", {
                  value: pk_org,
                  display: org_Name
                });
              } else {
                props.search.setSearchValByField(this.searchId, "pk_org", {
                  value: null,
                  display: null
                });
              }
            }
          });
          afterSetMata.call(this, props);
        }
        if (data.button) {
          /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
          let button = data.button;
          props.button.setButtons(button);
          props.button.setPopContent(
            "Delete_i",
            json["36010NBFO-000005"]
          ); /* 国际化处理： 确定要删除吗?*/
          props.button.setButtonVisible(
            ["Account", "Copy", "Enable", "Disenable", "PrintOut"],
            false
          );
          if (!props.getUrlParam("bckPk")) {
            props.button.setButtonDisabled(list.disabled_btn, true);
          }
        }
        if (data.context) {
          this.setState({
            langSeq: data.context.currentLangSeq || "1"
          });
        }
      }
    }
  );
}

function modifierMeta(props, meta, json) {
  meta[this.tableId].pagination = true;
  meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
    if (item.attrcode == "code") {
      item.render = (text, record, index) => {
        return (
          <a
            style={{ cursor: "pointer" }}
            onClick={e => {
              e.stopPropagation();
              props.pushTo("/card", {
                status: "browse",
                id: record[this.primaryId].value,
                pagecode: card.pageCode,
                name: record.name.value,
                typePk: record.type.value // 用于树的展开点击
              });
            }}
          >
            {record && record.code && record.code.value}
          </a>
        );
      };
    }
    return item;
  });

  //添加操作列
  meta[this.tableId].items.push({
    itemtype: "customer",
    attrcode: "opr",
    label: json["36010NBFO-000023"] /* 国际化处理： 操作*/,
    width: 200,
    fixed: "right",
    className: "table-opr",
    visible: true,
    render: (text, record, index) => {
      let buttonAry = [];
      let enableState = record.enable_state && record.enable_state.value;
      if (enableState === "1") {
        buttonAry = ["Revise_i", "Delete_i", "Disenable_i"];
      } else {
        buttonAry = ["Revise_i", "Delete_i", "Enable_i"];
      }
      return props.button.createOprationButton(buttonAry, {
        area: list.bodyCode,
        buttonLimit: btnLimit,
        onButtonClick: (props, key) => bodyButtonClick.call(this, key, record)
      });
    }
  });
  return meta;
}

function afterSetMata(props) {
  exdInit.call(this); // 树表content加载
  props.button.setButtonDisabled(list.disabled_btn, true);
  let bckPk = props.getUrlParam("bckPk");
  if (bckPk) {
    props.syncTree.setNodeSelected(this.treeId, [bckPk]);
    props.button.setButtonDisabled("Add", false);
    this.setState({
      typePk: bckPk,
      typeQueryPk: bckPk
    });
  }
  if (this.props.getUrlParam("bckFlag")) {
    this.setState({ showToast: false });
  }
}

/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/