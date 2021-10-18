/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { createPage, ajax, toast, base } from "nc-lightapp-front";
import { list, card, appCode, btnLimit } from "../../cons/constant.js";
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util/index";
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
                    // linkVoucher.call(this, props, "repayintst");
                }
                if (data.button) {
                    /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
                    let button = data.button;
                    props.button.setButtons(button);
                    props.button.setButtonDisabled(list.disabled_btn, true);
                    props.button.setPopContent("del_inner", this.state.json['36362IAP-000029']);/* 国际化处理： 确定要删除吗？*/
                }
            }
        }
    );
}

function modifierMeta(props, meta) {
    // meta[this.searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
    
    meta[this.searchId].items.map(item => {
        item.isShowDisabledData = true;
        //发送发组织，接收方组织：根据用户权限过滤
        if (item.attrcode == "pk_org") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    TreeRefActionExt:
                        "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
                };
            };
        }
         // 资金计划项目
         if (item.attrcode == "pk_fundplan") {
            item.queryCondition = () => {
                let pk_org = this.props.form.getFormItemsValue(
                    this.searchId,
                    "pk_org"
                ).value;
                return { pk_org: pk_org };
            };
        }
       
       
        // 放款计划根据合同ID过滤
        if (item.attrcode == "payplan") {
            item.queryCondition = () => {
                let data = this.props.form.getFormItemsValue(
                    this.searchId,
                    "contractid"
                ).value;
                return { contractid: data };
            };
        }
        if (item.attrcode == "contractid") {
            item.queryCondition = () => {
                return {
                    isquery: "true",
                    pk_financorg: props.search.getSearchValByField(
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
    });
    meta[this.tableId].pagination = true;
    meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
        
        if (item.attrcode == "vbillno") {
            item.render = (text, record, index) => {
                return (
                    
                        <a
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                go2CardCheck({
                                    url: this.gotocardcheck,
                                    pk:  record[list.primaryId].value,
                                    ts: record.ts.value,
                                    checkTS: record.ts.value ? true : false,
                                    fieldPK: this.primaryId,
                                    checkSaga:false,
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
                    
                );
            };
        }
        return item;
    });

    //添加操作列
    meta[this.tableId].items.push({
        attrcode: "opr",
        label: this.state.json['36362IAP-000009'],/* 国际化处理： 操作*/
        width: 200,
        fixed: "right",
        itemtype: "customer",
        className: "table-opr",
        visible: true,
        render: (text, record, index) => {
            let buttonAry = [];
            let vbillstatus = record.vbillstatus && record.vbillstatus.value; //审批状态
            let busistatus = record.busistatus && record.busistatus.value; //单据状态
            switch (vbillstatus) {
                case "-1": //待提交
                    buttonAry = ["commit_inner","edit_inner", "del_inner"];
                    break;
                case "2": //审批中
                    buttonAry = ["approvalDetail_inner"];
                    break;
                case "3": //待审批
                    buttonAry = ["uncommit_inner", "approvalDetail_inner"];
                    break;
                case "1": //审批完成
                    if(busistatus == '2'){
                        buttonAry = [""];
                    }else{
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