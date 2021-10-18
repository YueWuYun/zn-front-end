/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { excelImportconfig } from "nc-lightapp-front";
import {
  setDefOrg2AdvanceSrchArea,
  setDefOrg2ListSrchArea
} from "src/tmpub/pub/util/index";
import { initList } from "../../../../public/container/page";
import { app_code, button_limit, CARD, LIST } from "../../cons/constant.js";
import { bodyButtonClick } from "./index";
export default function(props) {
  let excelimportconfig = excelImportconfig(props, "fbm", "36HF", true, "", {
    appcode: app_code,
    pagecode: CARD.page_id
  });
  let excelimportconfigq = excelImportconfig(props, "fbm", "36HF1", true, "", {
    appcode: app_code,
    pagecode: CARD.page_id
  });
  let appcode = props.getSearchParam("c") || props.getUrlParam("c");
  props.createUIDom(
    {
      pagecode: LIST.page_id, //页面code
      appcode: appcode
    },
    data => {
      if (data) {
        if (data.button) {
          /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
          let button = data.button;
          props.button.setButtons(button);
          props.button.setPopContent(
            "delete",
            this.props.MutiInit.getIntl("36180BT") &&
              this.props.MutiInit.getIntl("36180BT").get("36180BT-000005")
          ); //* 国际化处理： 确认要删除吗?*//* 国际化处理： 确认要删除吗?*/* 国际化处理： 国际化处理,确认要删除吗*/
          props.button.setPopContent(
            "terminate",
            this.props.MutiInit.getIntl("36180BT") &&
              this.props.MutiInit.getIntl("36180BT").get("36180BT-000006")
          ); //* 国际化处理： 确认要终止吗?*//* 国际化处理： 确认要终止吗?*/* 国际化处理： 国际化处理,确认要终止吗*/
          props.button.setButtonDisabled(LIST.disabled_btn, true);
          props.button.setUploadConfig("Import", excelimportconfig);
          props.button.setUploadConfig("Quilckimport", excelimportconfigq);
          props.button.setPopContent(
            "DeleteInner",
            this.props.MutiInit.getIntl("36180BT") &&
              this.props.MutiInit.getIntl("36180BT").get("36180BT-000005")
          ); /* 国际化处理： 确认要删除吗?*/
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
  meta[this.tableId].pagination = true;
  meta[this.searchId].items.map(item => {
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

    //票据类型过滤
    if (item.attrcode === "glgx.pk_register.fbmbilltype") {
      item.queryCondition = () => {
        return {
          GridRefActionExt:
            "nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter"
        };
      };
    }

    //出票人收款人glgx.pk_register.hidereceiveunit
    if (
      item.attrcode === "glgx.pk_register.invoiceunit" ||
      item.attrcode === "glgx.pk_register.hidereceiveunit"
    ) {
      item.queryCondition = () => {
        let pk_org = this.props.search.getSearchValByField(
          this.searchId,
          "pk_org"
        );
        //let pk_group = this.props.search.getSearchValByField(this.searchId, 'pk_group');
        if (pk_org && pk_org.value && pk_org.value.firstvalue) {
          return {
            pk_org: pk_org.value.firstvalue
            //pk_group: pk_group.value
          };
        } else {
          return {};
        }
      };
    }

    if (item.attrcode === "inputperson") {
      //托管办理人
      item.queryCondition = () => {
        let pk_org = this.props.search.getSearchValByField(
          this.searchId,
          "pk_org"
        );
        if (pk_org && pk_org.value && pk_org.value.firstvalue) {
          return {
            pk_org: pk_org.value.firstvalue
          };
        }else{
          return {};
        }
      };
    }
  });
  meta[this.tableId].pagination = true;
  meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
    // item.width = 150;
    if (item.attrcode == this.billNo) {
      item.render = (text, record, index) => {
        return (
          <a
            style={{ cursor: "pointer" }}
            onClick={() => {
              props.pushTo("/card", {
                status: "browse",
                id: record[LIST.primary_id].value,
                pagecode: CARD.page_id
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
      this.props.MutiInit.getIntl("36180BT") &&
      this.props.MutiInit.getIntl("36180BT").get("36180BT-000003"), //* 国际化处理： 操作*//* 国际化处理： this.props.MutiInit.getIntl("36180BT") && this.props.MutiInit.getIntl("36180BT").get('36180BT-000003')*/* 国际化处理： 国际化处理,操作*/
    width: 200,
    fixed: "right",
    className: "table-opr",
    visible: true,
    render: (text, record, index) => {
      return props.button.createErrorButton({
        record: record,
        //showBack: false, // 是否显示回退按钮
        sucessCallBack: () => {
          let buttonAry = [];
          let busistatus = record.vbillstatus && record.vbillstatus.value;
          let onlinebankflag = record.onlinebankflag.value;
          let disableflag = record.disableflag.value;
          let voucher = record.voucher.value;
          switch (busistatus) {
            case "-1": //待提交
              buttonAry = ["CommitInner", "EditInner", "DeleteInner"];
              break;
            case "3": //待审批
              buttonAry = ["UnCommitInner"];
              break;
            case "2": //审批中
              buttonAry = ["UnCommitInner"];
              break;
            case "1": //审批通过
              buttonAry = ["UnCommitInner"];
              // 审批通过
              if (onlinebankflag) {
                // 网银
                buttonAry = [
                  "UnCommitInner",
                  "CommandInner",
                  "CancelCommandInner"
                ];
              } else {
                // 非网银
                buttonAry = ["UnCommitInner", "MakeVoucherInner"];
              }
              //发送指令
              if (voucher == "1") {
                // 已制证
                buttonAry = ["CancelVoucherInner"];
              }
              if (disableflag == "1") {
                // 已作废
                buttonAry = ["CancelDisabledInner"];
              }
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
    }
  });

  return meta;
}

//模板加载后的回调函数
function templateCallback(meta) {
  initList.call(this);
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/