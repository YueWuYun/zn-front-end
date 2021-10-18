/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import {
  setDefOrg2AdvanceSrchArea,
  setDefOrg2ListSrchArea
} from "src/tmpub/pub/util/index";
import { initList } from "../../../../public/container/page";
import { button_limit, LIST } from "../../cons/constant.js";
import { bodyButtonClick } from "./index";
export default function(props) {
  let pagecode = LIST.page_id;
  let scene = this.props.getUrlParam("scene");
  // 凭证,报表联查
  if (scene === "linksce" || scene === "fip") {
    pagecode = LIST.page_id_link;
  }
  let appcode = props.getSearchParam("c") || props.getUrlParam("c");
  props.createUIDom(
    {
      pagecode: pagecode, //页面code
      appcode: appcode
    },
    data => {
      if (data) {
        if (data.button) {
          /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
          let button = data.button;
          props.button.setButtons(button);
          props.button.setPopContent(
            "DeleteInner",
            this.props.MutiInit.getIntl("36200BI") &&
              this.props.MutiInit.getIntl("36200BI").get("36200BI-000003")
          ); /* 国际化处理： 确认要删除吗?*/
          props.button.setButtonDisabled(LIST.disabled_btn, true);
        }
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta.call(this, props, meta);
          //给高级查询区域赋默认业务单元(在setMeta之前使用)
          setDefOrg2AdvanceSrchArea(props, LIST.search_id, data);
          props.meta.setMeta(meta);
          //给列表查询区域赋默认业务单元(在setMeta之后使用)
          setDefOrg2ListSrchArea(props, LIST.search_id, data);
          templateCallback.call(this, meta);
        }
      }
    }
  );
}

function modifierMeta(props, meta) {
  meta[this.searchId].items.map(item => {
    // 自定义项过滤
    if (item.attrcode.indexOf("def") > -1) {
      //自定义档案按照组织或者集团过滤
      item.queryCondition = p => {
        let pk_org = this.props.search.getSearchValByField(
          this.searchId,
          "pk_org"
        );
        if (pk_org && pk_org.value && pk_org.value.firstvalue) {
          return {
            pk_org: pk_org.value.firstvalue
          };
        }
      };
    }
    if (item.attrcode === "pk_org") {
      //财务组织过滤
      item.isMultiSelectedEnabled = true; //财务组织多选
      item.queryCondition = () => {
        return {
          funcode: this.props.getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
        };
      };
    }
    //借款单位  客商参照需要传pk_org和pk_group
    if (item.attrcode == "debitunit") {
      item.queryCondition = () => {
        let pk_org = this.props.form.getFormItemsValue(this.searchId, "pk_org");
        let pk_group = this.props.form.getFormItemsValue(
          this.formId,
          "pk_group"
        );
        return {
          pk_org: pk_org && pk_org.value,
          pk_group: pk_group && pk_group.value
        };
      };
    }
  });
  meta[this.tableId].pagination = true;
  meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
    // item.width = 150;
    if (item.attrcode == this.billNo) {
      item.render = (text, record, index) => {
        let pagecode = LIST.page_id;
        let scene = this.props.getUrlParam("scene");
        if (scene && scene == "linkce") {
          pagecode = LIST.page_id_link;
        }
        return (
          <a
            style={{ cursor: "pointer" }}
            onClick={() => {
              props.pushTo("/card", {
                status: "browse",
                id: record[this.primaryId].value,
                pagecode: pagecode,
                scene: scene
              });
            }}
          >
            {record[this.billNo] && record[this.billNo].value}
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
    label:
      this.props.MutiInit.getIntl("36200BI") &&
      this.props.MutiInit.getIntl("36200BI").get(
        "36200BI-000004"
      ) /* 国际化处理： 操作*/,
    width: 200,
    fixed: "right",
    className: "table-opr",
    visible: true,
    render: (text, record, index) => {
      let buttonAry = [];
      let vbillstatus = record.vbillstatus && record.vbillstatus.value;
      //质押指令状态
      let paymentstatus = record.paymentstatus && record.paymentstatus.value;
      //是否勾选网银
      let onlinebankflag = record.onlinebankflag && record.onlinebankflag.value;
      //质押收回指令状态
      let backimpawnstatus =
        record.backimpawnstatus && record.backimpawnstatus.value;
      //质押状态
      let impawnstatus = record.impawnstatus && record.impawnstatus.value;
      //作废状态
      let disableflag = record.disableflag && record.disableflag.value;
      //解除质押签收指令状态
      let impawnbacksignstatus =
        record.impawnbacksignstatus && record.impawnbacksignstatus.value;
      //是否是推单过来的数据
      let srcbill = record.pk_srcbill && record.pk_srcbill.value;

      switch (vbillstatus) {
        case "-1": //待提交
          if (null != srcbill) {
            buttonAry = ["CommitInner", "DeleteInner"];
          } else {
            buttonAry = ["EditInner", "CommitInner", "DeleteInner"];
          }
          break;
        case "2": //审批中
          if (null != srcbill) {
            buttonAry = [];
          } else {
            buttonAry = ["UnCommitInner"];
          }
          break;
        case "3": //审批中
          if (null != srcbill) {
            buttonAry = [];
          } else {
            buttonAry = ["UnCommitInner"];
          }
          break;
        case "1": //审批通过
          if (onlinebankflag) {
            //网银
            if (impawnbacksignstatus == null) {
              //解除质押签收指令状态
              if (backimpawnstatus == null) {
                //质押收回指令状态
                if (paymentstatus == null) {
                  //发送指令状态
                  if (null != srcbill) {
                    buttonAry = ["CommandInner"];
                  } else {
                    buttonAry = ["UnCommitInner", "CommandInner"];
                  }
                } else {
                  if (disableflag) {
                    buttonAry = ["CancelDisabledInner"];
                  } else {
                    if (paymentstatus == 1) {
                      //成功显示解除质押
                      buttonAry = ["ImpawnBackInstrInner"];
                    } else if (paymentstatus == 2) {
                      //失败显示发送指令
                      buttonAry = ["CommandInner", "DisabledInner"];
                    } else if (paymentstatus == 3) {
                      //不明
                      buttonAry = [];
                    }
                  }
                }
              } else {
                if (backimpawnstatus == 1) {
                  buttonAry = ["ImpawnBackSignInner"];
                } else if (backimpawnstatus == 2) {
                  buttonAry = ["ImpawnBackInstrInner"];
                } else if (backimpawnstatus == 3) {
                  buttonAry = [];
                }
              }
            } else {
              if (impawnbacksignstatus == 2) {
                buttonAry = ["ImpawnBackSignInner"];
              } else if (impawnbacksignstatus == 3) {
                buttonAry = [];
              } else if (impawnbacksignstatus == 1) {
                buttonAry = ["CancelImpawnBack"];
              }
            }
          } else {
            if (impawnstatus == "hasback") {
              buttonAry = ["CancelImpawnBackInner"];
            } else if (impawnstatus == "on_impawn_back") {
              buttonAry = ["ImpawnBackSignInner"];
            } else {
              if (null != srcbill) {
                buttonAry = ["ImpawnBackInstrInner"];
              } else {
                buttonAry = ["UnCommitInner", "ImpawnBackInstrInner"];
              }
            }
          }
          break;
        default:
          break;
      }

      return props.button.createOprationButton(buttonAry, {
        area: "list_inner",
        buttonLimit: button_limit,
        onButtonClick: (props, key) =>
          bodyButtonClick.call(this, key, record, index)
      });
    }
  });
  return meta;
}

//模板加载后的回调函数
function templateCallback(meta) {
  initList.call(this);
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/