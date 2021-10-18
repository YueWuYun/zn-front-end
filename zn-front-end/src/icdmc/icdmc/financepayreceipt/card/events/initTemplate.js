/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax, getBusinessInfo } from "nc-lightapp-front";
let { NCPopconfirm } = base;
import { tabs, appCode, btnLimit, card } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { tabButtonClick } from "./tabButtonClick";
import { setChangeDisable } from "./buttonClick";
import RateGridRef from "../../../../../tmpub/refer/ratecode/RateGridRef";
import { afterEvent } from "../../card/events/afterEvent";
import { initData, getCardData } from "../../../public/cardEvent";
export default function(props) {
    props.createUIDom(
        {
            pagecode: card.pageCode, //页面id
            appcode: props.getUrlParam('c')
        },
        data => {
            if (data) {
                //console.log(data, "data");
                if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button);
                    if (props.getUrlParam("status") == "add") {
                        props.button.setButtonDisabled(card.disabled_btn, true);
                    }
                    buttonVisible.call(this, props, button);
                }
                if (data.template) {
                    let meta = data.template;
                    meta = modifierMeta.call(this, meta, props);
                    props.meta.renderTabs(
                        meta,
                        this.tabOrder,
                        this.tabShow,
                        initData.bind(this, this.props)
                    );
                    if (this.props.getUrlParam("id")) {
                        getCardData.call(
                            this,
                            this.cardUrl,
                            String(this.props.getUrlParam("id")),
                            true
                        );
                    }
                    templateCallback.call(this, props, meta);
//                    orgVersionView(this.props, "header");
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
            }
        }
    );
}
function modifierMeta(meta, props) {
    let businessInfo = getBusinessInfo();
    for (let item of Object.keys(meta.gridrelation)) {
        meta[item].items.push({
            attrcode: "opr",
            label: this.state.json['36362IPR-000010'],/* 国际化处理： 操作*/
            fixed: "right",
            itemtype: "customer",
            className: "table-opr",
            visible: true,
            width: "210px",
            render: (text, record, index) => {
                let buttonAry =[record.expandRowStatus ? "fold" : "unfold"];
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
    // 过滤参照
    meta.header.items.map(item => {
        //发送发组织，接收方组织：根据用户权限过滤
        if (item.attrcode == "pk_org") {
            item.queryCondition = () => {
                return {
                    funcode: this.props.getSearchParam("c"), //appcode获取
                    TreeRefActionExt:
                        "nccloud.web.tmpub.filter.FundOrgPermissionFilter"
                };
            };
        }
        // 金融机构根据组织过滤
        if (item.attrcode == "fininstitutionid") {
            item.queryCondition = () => {
                let data = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                let pk_banktype = [];
                let pk_banktypeMap = this.pk_banktypeMap;
                if (pk_banktypeMap.size) {
                    for (let value of pk_banktypeMap.values()) {
                        pk_banktype.push(value);
                    }
                    pk_banktype = String(pk_banktype);
                } else {
                    pk_banktype = null;
                }
                return { 
                    pk_org: data, 
                    pk_banktype: pk_banktype, 
                    pk_bankdoc: this.bankdoc,
                    GridRefActionExt: 'nccloud.web.tmpub.ref.tmbd.BankDocDefaultGridRefFilter'
                };
            };
        }
        // 计划项目根据组织过滤
        if (item.attrcode == "pk_planitem") {
            item.queryCondition = () => {
                let data = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                return { pk_org: data };
            };
        }
        // 合同根据组织过滤
        if (item.attrcode == "contractid") {
            item.queryCondition = () => {
                let data = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                return { pk_org: data };
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
        // 账户根据金融机构过滤
        if (item.attrcode == "debitunitacctid") {
            item.queryCondition = () => {
                let data = this.props.form.getFormItemsValue(
                    this.formId,
                    "fininstitutionid"
                ).value;
                let pk_org = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                return { type: data, pk_org: pk_org };
            };
        }
        // 项目根据组织过滤
        if (item.attrcode == "pk_project") {
            item.queryCondition = () => {
                let pk_org = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                return { pk_org: pk_org };
            };
        }
        // 融资品种根据大类过滤
        if (item.attrcode == "invstfincvartyid") {
            item.queryCondition = () => {
                return {
                    variety_category: "BANK,TRUST",
                    type: "1"
                };
            };
        }
    });
    meta["header_rate"].items.map(item => {
        // 利率根据组织过滤
        if (item.attrcode == "pk_rate") {
            item.queryCondition = () => {
                let pk_org = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                let pk_group = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_group"
                ).value;
                let date =
                    props.getUrlParam("status") == "change"
                        ? businessInfo.businessDate.value
                        : this.props.form.getFormItemsValue(
                              this.formId,
                              "loandate"
                          ).value;
                return {
                    pk_org: pk_org,
                    pk_group: pk_group,
                    ratetype: "LRATE",
                    revisedate: date
                };
            };
        }
    });
    //授信协议根据组织集团币种开始/结束日期过滤
    
    //利率信息
    meta["extinfo"].items.map(item => {
        if (item.attrcode === "pk_rate") {
            item.render = function(text, record, index) {
                return RateGridRef({
                    queryCondition: () => {
                        return {
                            pk_org: props.form.getFormItemsValue(
                                "header",
                                "pk_org"
                            ).value,
                            pk_group: props.form.getFormItemsValue(
                                "header",
                                "pk_group"
                            ).value,
                            ratetype: "LRATE",
                            revisedate: props.cardTable.getTabValByKeyAndIndex(
                                "extinfo",
                                index,
                                "extbegindate"
                            ).value
                        };
                    }
                });
            };
        }
    });
    return meta;
}
// 模板初始化设置编辑性及其他
function templateCallback(props, meta) {
    let status = props.getUrlParam("status");
    if (status == "add") {
        // 初始化编辑性
        props.cardTable.tabKeyShowSwitch("authinfo", false, false, false);
    } else if (status == "change") {
        // 设置变更可编辑性
        setChangeDisable.call(this, props);
    } else {
        props.form.setFormItemsDisabled(this.formId, {
            pk_org: true //组织
        });
    }
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/