/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { cardCache, excelImportconfig } from "nc-lightapp-front";
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util";
import { BILL_TYPE, CARD_PAGE_CODE, LIST_PAGE_CODE, LIST_SEARCH_CODE, LIST_TABLE_CODE } from "./../../cons/constant";
import { bodyButtonClick } from "./bodyButtonClick";
let { setDefData } = cardCache;

export function initTemplate(props) {
  let that = this;
  let appcode = props.getSearchParam("c") || props.getUrlParam("c");

  let excelimportconfig = excelImportconfig(props, "fbm", BILL_TYPE, true, "", {
    appcode: appcode,
    pagecode: LIST_PAGE_CODE
  });
  props.createUIDom(
    {
      pagecode: LIST_PAGE_CODE,
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

          let mutiInit = this.props.MutiInit.getIntl("36180PBR");
          props.button.setPopContent(
            "InnerDelete",
            mutiInit && mutiInit.get("36180PBR-000029")
          ); /* 国际化处理： 确定要删除吗?*/
        }
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta.call(that, props, meta, lineButton);
          //高级查询区域加载默认业务单元
          setDefOrg2AdvanceSrchArea(props, LIST_SEARCH_CODE, data);
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

  let mutiInit = this.props.MutiInit.getIntl("36180PBR");
  meta[LIST_SEARCH_CODE].items.map(item => {
    // 自定义项过滤
		if (item.attrcode.indexOf("def") > -1) {
				//自定义档案按照组织或者集团过滤
				item.queryCondition = (p) => {
					let pk_org = this.props.search.getSearchValByField(LIST_SEARCH_CODE, 'pk_org');
					if (pk_org && pk_org.value && pk_org.value.firstvalue) {
						return {
							pk_org: pk_org.value.firstvalue
						};
					}
				}
			}
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
    //票据类型
    if (item.attrcode == 'pk_register.fbmbilltype') {
      item.queryCondition = () => {
        return {
          GridRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter'
        };
      };
    }
    //资金计划项目过滤
    if (item.attrcode === "paybillplanitem") {
      item.queryCondition = () => {
        let pk_org = props.form.getFormItemsValue(LIST_SEARCH_CODE, "pk_org")
          .value;
        return {
          pk_org: pk_org
        };
      };
    }
    //业务组织过滤
    if (item.attrcode == "pk_entrustorg") {
      // item.showHistory = false;
      item.queryCondition = () => {
        let pk_org =
        this.props.search.getSearchValByField(LIST_SEARCH_CODE, "pk_org") &&
        this.props.search.getSearchValByField(LIST_SEARCH_CODE, "pk_org").value &&
        this.props.search.getSearchValByField(LIST_SEARCH_CODE, "pk_org").value.firstvalue;

      let pk_group =
        this.props.search.getSearchValByField(LIST_SEARCH_CODE, "pk_group") &&
        this.props.search.getSearchValByField(LIST_SEARCH_CODE, "pk_group").value &&
        this.props.search.getSearchValByField(LIST_SEARCH_CODE, "pk_group").value.firstvalue;
        return {
          pkorg: pk_org,
          TreeRefActionExt:
            "nccloud.web.fbm.fbm.paybill.eventhandler.PaybillOrgRelationDataRefModelFilter4NCC"
        };
      };
    }
    //收款单位参照过滤
    if (item.attrcode == "receiveunit") {
      item.showHistory = true;
      item.queryCondition = () => {
        let pk_org =
        this.props.search.getSearchValByField(LIST_SEARCH_CODE, "pk_org") &&
        this.props.search.getSearchValByField(LIST_SEARCH_CODE, "pk_org").value &&
        this.props.search.getSearchValByField(LIST_SEARCH_CODE, "pk_org").value.firstvalue;

      let pk_group =
        this.props.search.getSearchValByField(LIST_SEARCH_CODE, "pk_group") &&
        this.props.search.getSearchValByField(LIST_SEARCH_CODE, "pk_group").value &&
        this.props.search.getSearchValByField(LIST_SEARCH_CODE, "pk_group").value.firstvalue;
        return {
          pk_group: pk_group,
          pk_org: pk_org,
          GridRefActionExt:
            "nccloud.web.fbm.fbm.paybill.filter.PaybillFilterByReceiveunit4NCC"
        };
      };
    }
    //部门过滤
    if (item.attrcode === "dept") {
      item.showHistory = true;
      item.queryCondition = () => {
        let pk_org = props.form.getFormItemsValue(LIST_SEARCH_CODE, "pk_org");
        return {
          pk_org: pk_org && pk_org.value
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
    label: mutiInit && mutiInit.get("36180PBR-000034") /* 国际化处理： 操作*/,
    itemtype: "customer",
    attrcode: "opr",
    width: 200,
    visible: true,
    fixed: "right",
    render: (text, record, index) => {
      return (
        <div>
          {// 适配云原生 改造适配
          props.button.createErrorButton({
            record: record,
            //showBack: false,  //不显示回退，默认显示
            sucessCallBack: () => {
      console.log(record.vbillstatus, 99);
      let buttonAry = [];
      let status = record.vbillstatus && record.vbillstatus.value;
      let cyberbankflag = record.cyberbankflag && record.cyberbankflag.value;
      let paymentstatus = record.paymentstatus && record.paymentstatus.value;
      let disableflag = record.disableflag && record.disableflag.value;
      let voucher = record.voucher && record.voucher.value;
      let syscode = record.syscode && record.syscode.value;
      let recallstatus = record.recallstatus && record.recallstatus.value;
      // 	待提交：删除、修改、提交
      if (status == "-1") {
        buttonAry = ["InnerCommit", "InnerEdit", "InnerDelete"];
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
            if (recallstatus != "3" && recallstatus != "1") {
              buttonAry = ["InnerWithdrawCmd"];
            }
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
      //付票来源系统不是手工录入 则不显示收回删除制证取消制证作废取消作废发送指令撤回指令
      if (syscode != "" && syscode != undefined && syscode != "INPUT") {
        buttonAry = [];
      }
      return props.button.createOprationButton(buttonAry, {
        area: "list_inner",
        buttonLimit: 3,
        onButtonClick: (props, key) =>
          bodyButtonClick.call(that, props, key, text, record, index)
      });
    }
          })}
        </div>
      );
    }
  });
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/