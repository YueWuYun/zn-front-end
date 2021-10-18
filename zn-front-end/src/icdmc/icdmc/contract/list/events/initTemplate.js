/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { createPage, ajax, toast, base } from "nc-lightapp-front";
import { list, card, appCode, btnLimit, baseReqUrl, javaUrl } from "../../cons/constant.js";
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea, go2CardCheck } from "../../../../../tmpub/pub/util/index";
import { bodyButtonClick } from "../../../public/listBodyBtnClick";
let { NCPopconfirm, NCIcon, NCTooltip } = base;
export default function(props) {
    props.createUIDom(
        {
            pagecode: list.pageCode //页面code
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
                }
                if (data.button) {
                    /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
                    let button = data.button;
                    props.button.setButtons(button);
                    props.button.setButtonDisabled(list.disabled_btn, true);
                    props.button.setPopContent("del_inner", this.state.json['36630BLC-000018']);/* 国际化处理： 确定要删除吗？*/
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
        e => e.attrcode === "pk_financorg"
    ).isMultiSelectedEnabled = true;
    meta[this.searchId].items.find(
        e => e.attrcode === "busistatus"
    ).isMultiSelectedEnabled = true;
    meta[this.tableId].pagination = true;    
    meta[this.searchId].items.map(item => {
        item.isShowDisabledData = true;
        //资金组织
        if (item.attrcode == "pk_org") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    TreeRefActionExt:
                        "nccloud.web.tmpub.filter.FundOrgPermissionFilter" 
                };
            };
        }
        //借款单位
        if (item.attrcode == "pk_financorg") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    pk_fundpayorg: (props.search.getSearchValByField(this.searchId, 'pk_org') || {}).value.firstvalue, 
                    TreeRefActionExt:"nccloud.web.tmpub.filter.FundFinanceOrgRelationFilter"                        
                };
            };
        }
        // 融资品种根据大类过滤
        if (item.attrcode == "transacttype") {
            item.queryCondition = () => {
                return { variety_category: "BANK,TRUST,OTHER_FINANCIAL_COMPANIES", type: "1" };
            };
        }

        if (item.attrcode == "unitdebitaccount") {// 单位借款账号
            item.queryCondition = () => {
                return {
                    pk_org: (props.search.getSearchValByField(this.searchId, 'pk_financorg') || {}).value.firstvalue, 
                    pk_currtype: (props.search.getSearchValByField(this.searchId, 'pk_currtype') || {}).value.firstvalue, 
                    pk_fundorg: (props.search.getSearchValByField(this.searchId, 'pk_org') || {}).value.firstvalue, 
                    noConditionOrg: 'N',
                    refnodename: '使用权参照',
                    GridRefActionExt: 'nccloud.web.icdmc.ref.ICDMCRecBillBankaccSubDefaultGridRefSqlBuilder' //自定义增加的过滤条件	
                };
            }
        }
    });
    meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
        if (item.attrcode == "contractno") {
            item.render = (text, record, index) => {
                if(record && record.contractno&&record.contractno.value){
                    return (
                            <a
                                style={{ cursor: "pointer" }}
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
                                                pagecode: card.pageCode
                                            });
                                        }
                                    })
                                }}
                            >
                            {record && record.contractno&&record.contractno.value}
                            </a>
                    );
                }else{
                    return (
                            <a
                                style={{ cursor: "pointer" }}
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
                                                pagecode: card.pageCode
                                            });
                                        }
                                    })
                                }}
                            >
                            {'------'}
                            </a>
                    );
                }               
            };
        }
        return item;
    });

    //添加操作列
    meta[this.tableId].items.push({
        attrcode: "opr",
        label: this.state.json['36630BLC-000014'],/* 国际化处理： 操作*/
        fixed: "right",
        itemtype: "customer",
        className: "table-opr",
        visible: true,
        render: (text, record, index) => {
            let buttonAry = [];
            let busistatus = record.busistatus && record.busistatus.value; //单据状态
            let vbillstatus = record.vbillstatus && record.vbillstatus.value; //审批状态
            let versionno = record.versionno && record.versionno.value; //版本号
            let pk_srcbill = record.pk_srcbill && record.pk_srcbill.value; //来源单据主键
            let ishasApprove = record.ispayplan && record.ispayplan.value; //Y 有审批流 N 无审批流
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
                        buttonAry = ["commit_inner", "edit_inner", "del_inner"];
                    }
                    //如果来源主键有值 则显示退回
                    if(pk_srcbill){
                        buttonAry = ["commit_inner","edit_inner",  "back_inner"];
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
                        //在执行
                        buttonAry = [
                            "change_inner",
                            "viewVersion_inner",
                            "termination_inner"
                        ];
                    } else if (busistatus == 4) {
                        //终止
                        buttonAry = [                           
                            "unTermination_inner",
                            "viewVersion_inner"
                        ];
                    } else if (busistatus ==2){
                        //未执行
                        //有审批流
                        if(ishasApprove){
                            buttonAry = [
                                // "change_inner",// 2020-03-05需求变更，单据状态未执行，不能变更版本_zhengweih
                                "viewVersion_inner",
                                "termination_inner"
                            ];
                        }else{
                        //无审批流
                            buttonAry = [
                                "uncommit_inner",
                                // "change_inner",// 2020-03-05需求变更，单据状态未执行，不能变更版本_zhengweih
                                "viewVersion_inner",
                                "termination_inner"
                            ];
                        }
                    } else if(busistatus ==0){
                        buttonAry = [
                            "viewVersion_inner"
                        ];
                    } else {
                        buttonAry = ["uncommit_inner", "approvalDetail_inner"];
                    }
                    // if (+versionno > 1) {
                    //     buttonAry = buttonAry.concat(viewVersion);
                    // }
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
                            "uncommit_inner"
                            // ,"approvalDetail_inner"
                        ].concat(viewVersion);
                    } else {
                        // buttonAry = ["uncommit_inner", "approvalDetail_inner"];
                        buttonAry = ["uncommit_inner"];
                    }
                    break;
                default:
                    break;
            }
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