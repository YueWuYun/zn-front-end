/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax } from "nc-lightapp-front";
let { NCPopconfirm } = base;
import { tabs, appCode, btnLimit, card } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { tabButtonClick } from "./tabButtonClick";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { afterEvent } from "../../card/events/afterEvent";
import { initData, getCardData,setEditStatus } from "../../../public/cardEvent";
export default function(props) {
    props.createUIDom(
        {
            pagecode: card.pageCode, //页面id
            appcode: props.getUrlParam('c')
        },
        data => {
            if (data) {
                if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button);
                    // if (props.getUrlParam("status") == "add") {
                    //     props.button.setButtonDisabled(card.disabled_btn, true);
                    // }
                    buttonVisible.call(this, props, button);
                }
                if (data.template) {
                    let meta = data.template;
                    meta = modifierMeta.call(this, meta);
                    // props.meta.renderTabs(
                    //     meta,
                    //     this.tabOrder,
                    //     this.tabShow,
                    //     initData.bind(this, this.props)
                    // );
                    // if (this.props.getUrlParam("id")) {
                    //     getCardData.call(
                    //         this,
                    //         this.cardUrl,
                    //         String(this.props.getUrlParam("id")),
                    //         true
                    //     );
                    // }
                    if (this.props.getUrlParam("id")) {
                        if (props.getUrlParam("status") === "copy") {
                            setEditStatus.call(this, "add");
                            getCardData.call(
                                this,
                                this.copyUrl,
                                String(this.props.getUrlParam("id")),
                                true
                            );
                        } else {
                            getCardData.call(
                                this,
                                this.cardUrl,
                                String(this.props.getUrlParam("id")),
                                true
                            );
                        }
                    }
                    props.meta.setMeta(meta);
                    templateCallback.call(this, props, meta);
                    orgVersionView(this.props, card.headCode);

                }
                if (data.context && props.getUrlParam("status") === "add") {
                    let {
                        pk_org,
                        pk_org_v,
                        org_Name,
                        org_v_Name
                    } = data.context;
                    if (data.context.pk_org) {
                        props.form.setFormItemsValue(this.formId, {
                            pk_org: { display: org_Name, value: pk_org },
                            pk_org_v: { display: org_v_Name, value: pk_org_v }
                        });
                        afterEvent.call(this, props, this.formId, "pk_org", {
                            display: org_Name,
                            value: pk_org
                        });
                    } else {
                        props.initMetaByPkorg();
                    }
                }
                // if (data.context && props.getUrlParam("status") === "edit") {
                //     props.initMetaByPkorg();
                //     props.form.setFormItemsDisabled(this.formId, this.editdisabled);
                    
                // }
            }
        }
    );
}
function modifierMeta(meta) {
    for (let item of Object.keys(meta.gridrelation)) {
        meta[item].items.push({

            attrcode: "opr",
            label: this.state.json['36362IAP-000009'],/* 国际化处理： 操作*/
            itemtype: "customer",
            fixed: "right",
            className: "table-opr",
            visible: true,
            width: "210px",
            render: (text, record, index) => {
                let buttonAry =
                    this.props.getUrlParam("status") == "browse"
                        ? [record.expandRowStatus ? "fold" : "unfold"]
                        : [];
                return this.props.button.createOprationButton(buttonAry, {
                    area: "tabs_body",
                    buttonLimit: btnLimit,
                    onButtonClick: (props, key) =>
                        tabButtonClick.call(
                            this,
                            props,
                            key,
                            text,
                            record,
                            index
                        )
                });
            }
        });
    }

    meta[card.headCode].items.map(item => {
        //发送发组织，接收方组织：根据用户权限过滤
        if (item.attrcode == "pk_org") {
            item.queryCondition = () => {
                return {
                    funcode: this.props.getSearchParam("c"), //appcode获取
                    TreeRefActionExt:
                        "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
                };
            };
        }
        // 合同根据组织过滤
        if (item.attrcode == "contractid") {
            item.queryCondition = () => {
                let data = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                return { pk_financorg: data,isquery:false };
            };
        }
        // 资金计划项目
        if (item.attrcode == "pk_fundplan") {
            item.queryCondition = () => {
                let pk_org = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                return { pk_org: pk_org };
            };
        }
       
       
        // 放款计划根据合同ID过滤
        if (item.attrcode == "payplan") {
            item.queryCondition = () => {
                let data = this.props.form.getFormItemsValue(
                    this.formId,
                    "contractid"
                ).value;
                return { contractid: data };
            };
        }
        // 单位银行账户账户根据金融机构过滤
        if (item.attrcode == "debitunitacctid") {
            item.queryCondition = () => {
                let data = null;
                let pk_org = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                let pk_currtype =this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_currtype"
                ).value;
                return { type: data, pk_org: pk_org,pk_currtype:pk_currtype,
                    GridRefActionExt:"nccloud.web.icdmc.icdmc.financepay.filter.PkBillTypeBankAccFilterForNCC" };
            };
        }
    });
    return meta;
}
// 模板初始化设置编辑性及其他
function templateCallback(props, meta) {
    let status = props.getUrlParam("status");
    if (status === "add") {
        // 初始化编辑性
        props.initMetaByPkorg();
        // 初始化页签显示
    } else if (status === "edit"){
        props.form.setFormItemsDisabled(this.formId, this.editdisabled);
    } else {
        props.form.setFormItemsDisabled(this.formId, {
            pk_org: true //组织
        });
    }
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/