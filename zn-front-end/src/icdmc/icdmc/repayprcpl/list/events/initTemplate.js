/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { list, card, appCode, btnLimit } from "../../cons/constant.js";
import {
    setDefOrg2ListSrchArea,
    setDefOrg2AdvanceSrchArea
} from "../../../../../tmpub/pub/util/index";
import { bodyButtonClick } from "../../../public/listBodyBtnClick";
import {go2CardCheck} from '../../../../../tmpub/pub/util/index.js';
export default function (props) {
    props.createUIDom(
        {
            pagecode: list.pageCode, //页面code
            appcode: props.getUrlParam("c")//动态获取appcode
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
                    props.button.setPopContent("del_inner", this.state.json["36360IRP-000025"]);/* 国际化处理：  确定要删除吗？*/
                }
            }
        }
    );
}

function modifierMeta(props, meta) {
    meta[this.tableId].pagination = true;
    meta[this.searchId].items.map(item => {
        item.isShowDisabledData = true;
        //财务组织
        if (item.attrcode == "pk_org") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    TreeRefActionExt:
                        "nccloud.web.tmpub.filter.FundOrgPermissionFilter"//资金组织过滤
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
        //合同号
        if (item.attrcode == "pk_contract") {
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
        //放款单
        if (item.attrcode == "pk_financepay") {
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
    });
    meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
        // item.width = 180;
        if (item.attrcode == "vbillno") {
            item.render = (text, record, index) => {
                return (
                    <a
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            go2CardCheck({
                                props,
                                url: this.gotocardcheck,
                                pk: record[this.primaryId].value,
                                ts: record["ts"].value,
                                checkTS: record["ts"].value ? true : false,
                                checkSaga: true,
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
        label: this.state.json["36360IRP-000016"],/* 国际化处理： 操作*/
        width: 200,
        fixed: "right",
        itemtype: "customer",
        className: "table-opr",
        visible: true,
        render: (text, record, index) => {
            let buttonAry = [];
            //审批状态
            let vbillstatus = record.vbillstatus && record.vbillstatus.value;
            //是否制证
            let voucherflag = record.voucherflag && record.voucherflag.value;
            switch (vbillstatus) {
                case "-1": //待提交
                    buttonAry = ["commit_inner", "edit_inner", "del_inner"];
                    break;
                case "2": //审批中
                    buttonAry = ["approvalDetail_inner"];
                    break;
                case "3": //待审批，提交
                    buttonAry = ["uncommit_inner", "approvalDetail_inner"];
                    break;
                case "1": //审批完成
                    buttonAry = ["uncommit_inner", "approvalDetail_inner"];
                    buttonAry = voucherflag ? buttonAry.concat(["unBookkeeping_inner"]) : buttonAry.concat(["Bookkeeping_inner"]);
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