/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { list, card, appCode, btnLimit, baseReqUrl, javaUrl } from "../../cons/constant.js";
import {
    setDefOrg2ListSrchArea,
    setDefOrg2AdvanceSrchArea,
    go2CardCheck
} from "../../../../../tmpub/pub/util/index";
import { bodyButtonClick } from "../../../public/listBodyBtnClick";
export default function (props) {
    props.createUIDom(
        {
            pagecode: list.pageCode, //页面code
        },
        data => {
            if (data) {
                if (data.template) {
                    //console.log(data.template);
                    let meta = data.template;
                    meta = modifierMeta.call(this, props, meta);
                    // 给高级查询区域赋默认业务单元(在setMeta之前使用)
                    setDefOrg2AdvanceSrchArea(props, list.searchCode, data);
                    props.meta.setMeta(meta);
                    // 给列表查询区域赋默认业务单元(在setMeta之后使用)
                    setDefOrg2ListSrchArea(props, list.searchCode, data);
                    //列表页面查询区域oid
                    let queryInfo_oid = props.meta.getMeta()[list.searchCode].oid;
                    if (queryInfo_oid) {
                        this.searchOid = queryInfo_oid; //列表页面查询区域oid
                    };
                }
                if (data.button) {
                    /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
                    let button = data.button;
                    props.button.setButtons(button);
                    props.button.setButtonDisabled(list.disabled_btn, true);
                    props.button.setPopContent("del_inner", this.state.json["36360INCP-000025"]);/* 国际化处理：  确定要删除吗？*/
                }
            }
        }
    );
}

function modifierMeta(props, meta) {
    meta[this.tableId].pagination = true;
    meta[this.searchId].items.map(item => {
        item.isShowDisabledData = true;
        //资金组织
        if (item.attrcode == "pk_org") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    TreeRefActionExt:
                        "nccloud.web.tmpub.filter.FundOrgPermissionFilter"//资金组织过滤
                };
            };
        }
        //授信单位(财务组织)
        if (item.attrcode == "pk_debitorg") {
            item.isShowUnit = true;//是否显示查询框
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    pk_fundpayorg: (props.search.getSearchValByField(this.searchId, 'pk_org') || {}).value.firstvalue,
                    TreeRefActionExt: "nccloud.web.icdmc.icdmc.innerprotocol.filter.ProtocolFundFinanceOrgRelationFilter"
                };
            };
        }

    });
    meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
        if (item.attrcode == "vbillno") {
            item.render = (text, record, index) => {
                return (
                    <a
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            //列表跳转卡片检查
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
                                        pagecode: card.pageCode
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
        label: this.state.json["36360INCP-000016"],/* 国际化处理： 操作*/
        width: 200,
        fixed: "right",
        itemtype: "customer",
        className: "table-opr",
        visible: true,
        render: (text, record, index) => {
            let buttonAry = [];
            let protocolstatus = record.protocolstatus && record.protocolstatus.value;//协议状态
            let vbillstatus = record.vbillstatus && record.vbillstatus.value; //审批状态
            let versionorigin = record.vbillstatus && record.versionorigin.value; //版本来源
            let versionno = record.versionno && record.versionno.value; //版本号
            let isinherit = record.isinherit && record.isinherit.value; //被继承
            let viewVersion = ["viewVersion_inner"];//历史版本
            switch (vbillstatus) {
                case "-1": //待提交
                    if (+versionno > 1) {
                        buttonAry = [
                            "commit_inner",
                            "edit_inner",
                        ].concat(viewVersion);
                    } else {
                        buttonAry = ["commit_inner", "edit_inner", "del_inner"];
                    }
                    break;
                case "0": //未通过
                    buttonAry = ["uncommit_inner", "approvalDetail_inner"];
                    if (+versionno > 1) {
                        buttonAry = buttonAry.concat(viewVersion);
                    }
                    break;
                case "1": //审批通过
                    buttonAry = [
                        "uncommit_inner",
                        "approvalDetail_inner"
                    ];
                    if (+versionno > 1) {
                        buttonAry = buttonAry.concat(viewVersion);
                    }
                    break;
                case "2": //进行中
                    buttonAry = ["approvalDetail_inner"];
                    if (+versionno > 1) {
                        buttonAry = buttonAry.concat(viewVersion);
                    }
                    break;
                case "3": //待审批
                    buttonAry = ["uncommit_inner", "approvalDetail_inner"];
                    if (+versionno > 1) {
                        buttonAry = buttonAry.concat(viewVersion);
                    }
                    break;
                default:
                    break;
            }
            if (protocolstatus && protocolstatus == 'EXECUTING' && vbillstatus == '1') {
                buttonAry = buttonAry.concat(["termination_inner", "frozen_inner"]);//结束+冻结
            }
            if (protocolstatus && protocolstatus == 'FINISHED' && !isinherit) {
                buttonAry = buttonAry.concat(["unTermination_inner"]);//取消结束
            }
            if (protocolstatus && protocolstatus == 'FROZEN' && !isinherit) {
                buttonAry = buttonAry.concat(["unFrozen_inner"]);//取消冻结
            }
            //2004-需求变更：变更后的协议什么情况下都可以删除，后台判断下是否又被合同引用就行了。
            if (versionorigin && versionorigin == 'CHANGE') {
                buttonAry = buttonAry.concat(["delete_version"]);//删除版本
            }
            //协议状态为在执行，已结束，已冻结不允许收回弃审
            if (protocolstatus == 'EXECUTING' || protocolstatus == 'FINISHED' || protocolstatus == 'FROZEN') {
                let index = buttonAry.indexOf('uncommit_inner');
                if (index > -1) {
                    buttonAry.splice(index, 1);
                }
            }
            //列表表体操作列按钮
            return props.button.createOprationButton(buttonAry, {
                area: "list_inner",
                buttonLimit: btnLimit,
                onButtonClick: (props, key) =>
                    bodyButtonClick.call(this, key, record, index)
            });
        }
    });
    return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/