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
                    linkVoucher.call(this, props, "repayintst");
                }
                if (data.button) {
                    /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
                    let button = data.button;
                    props.button.setButtons(button);
                    props.button.setButtonDisabled(list.disabled_btn, true);
                    props.button.setPopContent("del_inner", this.state.json['36360IPI-000029']);/* 国际化处理： 确定要删除吗？*/
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
                        "nccloud.web.tmpub.filter.FundOrgPermissionFilter"
                };
            };
        }
        // 放款单根据组织过滤
        if (item.attrcode == "pk_innerloanpay") {
            item.queryCondition = () => {
                let data = props.search.getSearchValByField(this.searchId, 'pk_org').value.firstvalue;
                return { pk_org: data, repaytype: "intst",isquery: true, };
            };
        }
        //合同过滤
        if (item.attrcode == "pk_contract_icdmc") {
            item.queryCondition = () => {
                
                return {
                    pk_org: props.search.getSearchValByField(this.searchId, 'pk_org').value.firstvalue,
                    funcode: props.getSearchParam("c"), //appcode获取
                    isquery: true,
                    TreeRefActionExt:
                        "nccloud.web.icdmc.icdmc.ref.action.ContractGridRefAction"
                };
            };
        }
        //借款单位
        if (item.attrcode == "pk_debitunit") {
            
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    pk_fundpayorg: (props.search.getSearchValByField(this.searchId, 'pk_org') || {}).value.firstvalue, 
                    TreeRefActionExt:"nccloud.web.tmpub.filter.FundFinanceOrgRelationFilter"                        
                };
            };
        }
        if (item.attrcode == "loanunitid") {// 单位借款账号
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
        label: this.state.json['36360IPI-000009'],/* 国际化处理： 操作*/
        width: 200,
        fixed: "right",
        itemtype: "customer",
        className: "table-opr",
        visible: true,
        render: (text, record, index) => {
            let buttonAry = [];
            let vbillstatus = record.vbillstatus && record.vbillstatus.value; //审批状态
            let isfirstpayintst = record.isfirstpayintst && record.isfirstpayintst.value; //先付息
            let repaytointerest = record.repaytointerest && record.repaytointerest.value; //利随本清
            let voucherflag = record.voucherflag && record.voucherflag.value; //制证、记账
            switch (vbillstatus) {
                case "-1": //待提交
                    if(isfirstpayintst || repaytointerest){
                        buttonAry = ["commit_inner","edit_inner" ];
                    }else{
                        buttonAry = ["commit_inner","edit_inner", "del_inner"];
                    }
                    
                    break;
                case "2": //审批中
                    buttonAry = ["approvalDetail_inner"];
                    break;
                case "3": //待审批
                    buttonAry = ["uncommit_inner", "approvalDetail_inner"];
                    break;
                case "1": //审批完成
                    if(voucherflag){
                        buttonAry = ["unBookkeeping_inner"];
                    }else{
                        buttonAry = ["uncommit_inner", "Bookkeeping_inner"];
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