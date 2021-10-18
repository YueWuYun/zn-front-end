/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { createPage, ajax, toast, base } from "nc-lightapp-front";
import { list, card, appCode, btnLimit } from "../../cons/constant.js";
import {
    setDefOrg2ListSrchArea,
    setDefOrg2AdvanceSrchArea
} from "src/tmpub/pub/util/index";
import { bodyButtonClick } from "../../../public/listBodyBtnClick";
import { linkVoucher } from "../../../public/cardEvent";
import {go2CardCheck} from '../../../../../tmpub/pub/util/index.js';
let { NCPopconfirm, NCIcon, NCTooltip } = base;
export default function(props) {
    props.createUIDom(
        {
            pagecode: list.pageCode, //页面code
            appcode: props.getUrlParam('c')
        },
        data => {
            if (data) {
                if (data.template) {
                    let meta = data.template;
                    meta = modifierMeta.call(this, props, meta);
                    // 给高级查询区域赋默认业务单元(在setMeta之前使用)
                    setDefOrg2AdvanceSrchArea(props, list.searchCode, data);
                    props.meta.setMeta(meta);
                    // 给列表查询区域赋默认业务单元(在setMeta之后使用)
                    setDefOrg2ListSrchArea(props, list.searchCode, data);
                    linkVoucher.call(this, props, "financepay");
                }
                if (data.button) {
                    /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
                    let button = data.button;
                    props.button.setButtons(button);
                    props.button.setButtonDisabled(list.disabled_btn, true);
                    props.button.setPopContent("del_inner", this.state.json['36360IP-000013']);/* 国际化处理： 确定要删除吗？*/
                }
            }
        }
    );
}

function modifierMeta(props, meta) {
    meta[this.searchId].items.find(
        e => e.attrcode === "pk_org"
    ).isMultiSelectedEnabled = true;
    meta[this.tableId].pagination = true;
    meta[this.searchId].items.map(item => {
        item.isShowDisabledData = true;
        //发送发组织，接收方组织：根据用户权限过滤
        if (item.attrcode == "pk_org") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    TreeRefActionExt:
                        "nccloud.web.tmpub.filter.FundOrgPermissionFilter"
                };
            };
        }
        if (item.attrcode == "invstfincvartyid") {
            item.queryCondition = () => {
                return { variety_category: "BANK,TRUST", type: "1" };
            };
        }
        if (item.attrcode == "contractid") {
            item.queryCondition = () => {
                return {
                    isquery: "true",
                    pk_org: props.search.getSearchValByField(
                        this.searchId,
                        "pk_org"
                    ).value.firstvalue
                };
            };
        }
        //借款单位
        if (item.attrcode == "financecorpid") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    pk_fundpayorg: (props.search.getSearchValByField(this.searchId, 'pk_org') || {}).value.firstvalue,
                    TreeRefActionExt: "nccloud.web.tmpub.filter.FundFinanceOrgRelationFilter"
                };
            };
        }
        
        if (item.attrcode == "debitunitacctid") {// 单位银行账号
            item.queryCondition = () => {
                return {
                    pk_org: props.search.getSearchValByField(this.searchId, 'pk_org').value.firstvalue,
                    pk_currtype: props.search.getSearchValByField(this.searchId, 'pk_currtype').value.firstvalue,
                    noConditionOrg: 'N',
                    refnodename: '使用权参照',
                    GridRefActionExt: 'nccloud.web.icdmc.ref.ICDMCRecBillBankaccSubDefaultGridRefSqlBuilder' //自定义增加的过滤条件	
                };
            }
        }
    });
    meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
        if (item.attrcode == "vbillno") {
            item.render = (text, record, index) => {
                return (
                    // <NCTooltip placement="top">
                        <a
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                go2CardCheck({
                                    url: this.gotocardcheck,
                                    pk:  record[list.primaryId].value,
                                    ts: record.ts.value,
                                    checkTS: record.ts.value ? true : false,
                                    fieldPK: this.primaryId,
                                    go2CardFunc: () =>{
                                        props.pushTo("/card", {
                                            status: "browse",
                                            id: record[this.primaryId].value,
                                            pagecode: card.pageCode
                                        });
                                   }	
                               })  
                                
                            }}
                        >
                            {record && record.vbillno && record.vbillno.value}
                        </a>
                    // </NCTooltip>
                );
            };
        }
        return item;
    });

    //添加操作列
    meta[this.tableId].items.push({
        attrcode: "opr",
        label: this.state.json['36360IP-000010'],/* 国际化处理： 操作*/
        width: 200,
        fixed: "right",
        itemtype: "customer",
        className: "table-opr",
        visible: true,
        render: (text, record, index) => {
            let buttonAry = [];
            let busistatus = record.busistatus && record.busistatus.value; //单据状态
            let vbillstatus = record.vbillstatus && record.vbillstatus.value; //审批状态
            let versionno = record.versionno && record.versionno.value; //版本号
            let agentbankmgt=record.agentbankmgt&&record.agentbankmgt.value;//是否记账
            let viewVersion = ["viewVersion_inner"];
            switch (vbillstatus) {
                case "-1": //待提交
                    if (+versionno > 1) {
                        buttonAry = [
                            "commit_inner",
                            "edit_inner",
                            "delete_version"
                        ].concat(viewVersion);
                    } else {
                        buttonAry = ["commit_inner","edit_inner", "del_inner"];
                    }
                    break;
                case "0": //未通过
                    if (+versionno > 1) {
                        buttonAry = [
                            "uncommit_inner",
                            "approvalDetail_inner"
                        ].concat(viewVersion);
                    } else {
                        buttonAry = ["uncommit_inner", "approvalDetail_inner"];
                    }
                    break;
                case "1": //审批通过
                    if (busistatus == 1) {
                        if(agentbankmgt) {
                            buttonAry = ["unBookkeeping_inner"];
                        }else {
                            buttonAry = ["uncommit_inner","Bookkeeping_inner"];
                        }
                        buttonAry = buttonAry.concat([
                            "change_inner",
                            "termination_inner",
                            "approvalDetail_inner"
                        ]);
                    } else if (busistatus == 4) {
                        buttonAry = [
                            "uncommit_inner",
                            "unTermination_inner",
                            "approvalDetail_inner"
                        ];
                    } else {
                        if(agentbankmgt) {
                            buttonAry = ["unBookkeeping_inner", "approvalDetail_inner"];
                        }else {
                            buttonAry = ["uncommit_inner","Bookkeeping_inner", "approvalDetail_inner"];
                        }
                        
                    }
                    if (+versionno > 1) {
                        buttonAry = buttonAry.concat(viewVersion);
                    }
                    break;
                case "2": //进行中
                    if (+versionno > 1) {
                        buttonAry = ["approvalDetail_inner"].concat(
                            viewVersion
                        );
                    } else {
                        buttonAry = ["approvalDetail_inner"];
                    }
                    break;
                case "3": //待审批
                    if (+versionno > 1) {
                        buttonAry = [
                            "uncommit_inner",
                            "approvalDetail_inner"
                        ].concat(viewVersion);
                    } else {
                        buttonAry = ["uncommit_inner", "approvalDetail_inner"];
                    }
                    break;
                default:
                    break;
            }
            return <div>{
				// 创建按钮
				 props.button.createErrorButton({
					 record: record,
					 sucessCallBack: () => {
						return props.button.createOprationButton(buttonAry, {
							rowIndex: index,
							area: "list_inner",
                            buttonLimit: btnLimit,
                            onButtonClick: (props, key) =>
                                bodyButtonClick.call(this, key, record, index)
                            });
					 }
				 })
 
			 }</div>
        }
    });
    return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/