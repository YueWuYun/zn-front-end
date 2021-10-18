/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { cardCache, excelImportconfig } from "nc-lightapp-front";
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util";
import { BILL_TYPE, CARD_PAGE_CODE, LINK_LIST_PAGE_CODE, LIST_SEARCH_CODE, LIST_TABLE_CODE } from "./../../cons/constant";
import { bodyButtonClick } from "./bodyButtonClick";
let { setDefData } = cardCache;

export function initTemplate(props) {
  let that = this;
  let appcode = props.getSearchParam("c") || props.getUrlParam("c");

  let excelimportconfig = excelImportconfig(props, "fbm", BILL_TYPE, true, "", {
    appcode: appcode,
    pagecode: LINK_LIST_PAGE_CODE
  });
  props.createUIDom(
    {
      pagecode: LINK_LIST_PAGE_CODE,
      appcode: appcode //注册时的应用编码
    },
    data => {
      if (data) {
        if (!data.template[LIST_TABLE_CODE]) {
          return;
        }
        let lineButton = [];
        if (data.button) {
          props.button.setButtons(data.button);
					props.button.setPopContent('InnerDelete',this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000029') );/* 国际化处理： 确定要删除吗?*/
        }
        if (data.template) {
          let meta = data.template;
          //高级查询区域加载默认业务单元
          setDefOrg2AdvanceSrchArea(props, LIST_SEARCH_CODE, data);
          meta = modifierMeta.call(that, props, meta, lineButton);
          // modifierSearchMetas(searchId, props, meta, billType, data.context.paramMap ? data.context.paramMap.transtype : null, that);
          props.meta.setMeta(meta);
          //列表查询区域加载默认业务单元
          setDefOrg2ListSrchArea(props, LIST_SEARCH_CODE, data);
        }

        if (data.context) {
          //context信息中包含小应用的一些信息，可根据此信息进行特殊处理
        }
      }
    }
  );
}

function modifierMeta(props, meta, lineButton) {
  let that = this;
  meta[LIST_SEARCH_CODE].items.map(item => {
    //财务组织用户过滤
    if (item.attrcode == "pk_org") {
      item.queryCondition = () => {
        return {
          funcode: props.getSearchParam("c") || props.getUrlParam("c"),
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
        };
      };
    }
  });
  meta[LIST_TABLE_CODE].items = meta[LIST_TABLE_CODE].items.map((item, key) => {
    if (item.attrcode == "vbillno") {
      item.render = (text, record, index) => {
        return (
          <a
            style={{ cursor: "pointer" }}
            onClick={() => {
              props.pushTo("/card", {
                status: "browse",
                id: record.pk_paybill && record.pk_paybill.value,
                pagecode: CARD_PAGE_CODE
              });
            }}
          >
            {record.vbillno && record.vbillno.value}
          </a>
        );
      };
    }
    return item;
  });
  //添加操作列
  meta[LIST_TABLE_CODE].items.push({
    label: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000034'),/* 国际化处理： 操作*/
    itemtype: "customer",
    attrcode: "opr",
    width: 200,
    visible: true,
    fixed: "right",
    render: (text, record, index) => {
      console.log(record.vbillstatus, 99);
      let buttonAry = [];
      let status = record.vbillstatus && record.vbillstatus.value;
      let cyberbankflag = record.cyberbankflag && record.cyberbankflag.value;
      let paymentstatus = record.paymentstatus && record.paymentstatus.value;
      let disableflag = record.disableflag && record.disableflag.value;
      let voucher = record.voucher && record.voucher.value;
      // 	待提交：删除、修改、提交
      if (status == "-1") {
        buttonAry = ["InnerEdit", "InnerDelete", "InnerCommit"];
      }
      // 已提交：收回
      else if (status == "2" || status == "3") {
        buttonAry = ["InnerUnCommit"];
      } else if (status == "1") {
        // 已审批（网银）：收回、发送指令
        if (cyberbankflag) {
          //指令交易成功：制证
          if (paymentstatus == "1") {
            if (voucher) {
              buttonAry = ["InnerCancelVoucher"];
            } else {
              buttonAry = ["InnerMakeVoucher"];
            }
          }
          //	指令交易失败：发送指令、作废
          else if (paymentstatus == "2") {
            if (disableflag) {
              buttonAry = ["InnerCancelDisable"];
            } else {
              buttonAry = ["InnerSendCmd", "InnerDisable"];
            }
          }
          //	指令交易不明：撤销指令
          else if (paymentstatus == "3") {
            buttonAry = ["InnerWithdrawCmd"];
          } else {
            buttonAry = ["InnerUnCommit", "InnerSendCmd"];
          }
        }
        //	已审批（非网银）：收回、制证
        else {
          if (voucher) {
            buttonAry = ["InnerCancelVoucher"];
          } else {
            buttonAry = ["InnerUnCommit", "InnerMakeVoucher"];
          }
        }
      }
      return props.button.createOprationButton(buttonAry, {
        area: "list_inner",
        buttonLimit: 3,
        onButtonClick: (props, key) =>
          bodyButtonClick.call(that, props, key, text, record, index)
      });
    }
  });
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/