/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { appCode, btnLimit, card } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { tabButtonClick } from "./tabButtonClick";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { afterEvent } from "../../card/events/afterEvent";
import { setChangeDisable } from "./buttonClick";
import { initData, getCardData, setEditStatus } from "../../../public/cardEvent";
export default function (props) {
    props.createUIDom(
        {
            pagecode: card.pageCode, //页面id
        },
        data => {
            if (data) {
                if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button);
                    buttonVisible.call(this, props, button);//卡片肩部按钮显示
                }
                if (data.template) {
                    let meta = data.template;
                    meta = modifierMeta.call(this, meta);
                    props.meta.renderTabs(
                        meta,
                        this.tabOrder,
                        this.tabShow,
                        initData.bind(this, this.props)
                    );
                    let id = this.props.getUrlParam("id");
                    if (id) {
                        //加载数据
                        if (props.getUrlParam("status") === "copy") {
                            setEditStatus.call(this, "add");
                            getCardData.call(
                                this,
                                this.copyUrl,
                                String(id),
                                true
                            );
                        } else {
                            //联查历史版本就不用加载页面数据了
                            let pageType = this.props.getUrlParam("pageType");
                            let id = this.props.getUrlParam("id");
                            if (id && pageType === "version") {
                                //查看版本
                                this.initVersionTree();
                            }else{
                                //单据查询
                                getCardData.call(
                                    this,
                                    this.cardUrl,
                                    String(id),
                                    true
                                );
                            }
                        }
                    }
                    templateCallback.call(this, props, meta);
                    orgVersionView(this.props, "header");
                }
                if (data.context && props.getUrlParam("status") === "add") {
                    let {
                        pk_org,
                        pk_org_v,
                        org_Name,
                        org_v_Name
                    } = data.context;
                    if (data.context.pk_org) {
                        props.resMetaAfterPkorgEdit();//释放其他编辑字段编辑性
                        props.form.setFormItemsValue(this.formId, {
                            pk_org: { display: org_Name, value: pk_org },
                            pk_org_v: { display: org_v_Name, value: pk_org_v }
                        });
                        afterEvent.call(this, props, this.formId, "pk_org", {
                            display: org_Name,
                            value: pk_org
                        });
                    } else {
                        props.button.setButtonDisabled(card.disabled_btn, true);//表体肩部按钮都不点击
                        props.initMetaByPkorg();//限制其他编辑字段编辑性
                    }
                }
            }
        }
    );
}
function modifierMeta(meta) {
    for (let item of Object.keys(meta.gridrelation)) {
        meta[item].items.push({
            attrcode: "opr",
            label: this.state.json["36360INCP-000016"],/* 国际化处理： 操作*/
            fixed: "right",
            itemtype: "customer",
            className: "table-opr",
            visible: true,
            width: "210px",
            render: (text, record, index) => {
                //表体操作列按钮
                let buttonAry =
                    this.props.getUrlParam("status") == "browse"//浏览状态
                        ? [record.expandRowStatus ? "unfold" : "fold"]//展开收起
                        : this.props.getUrlParam("status") == "change" ?//变更状态
                            [record.expandRowStatus ? "unfold" : "fold"]
                            : ["cela", "insertRow", "delRow"];//展开，插行，删行
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
    meta['header'].items.map(item => {
        //资金组织
        if (item.attrcode == "pk_org") {
            item.queryCondition = () => {
                return {
                    funcode: this.props.getSearchParam("c"), //appcode获取
                    TreeRefActionExt:
                        "nccloud.web.tmpub.filter.FundOrgPermissionFilter"//资金组织过滤
                };
            };
        }
        //授信组织
        // if (item.attrcode == "pk_debitorg") {
        //     item.isShowUnit = true;//是否显示查询框
        //     item.queryCondition = () => {
        //         let pk_funorg = this.props.form.getFormItemsValue(
        //             this.formId,
        //             "pk_org"
        //         ).value;
        //         return {
        //             funcode: this.props.getSearchParam("c"),//appcode获取
        //             pk_funorg: pk_funorg,//资金组织
        //             TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter,nccloud.web.icdmc.icdmc.innerprotocol.filter.DebitorgFilterNCCFilter'
        //         };
        //     };
        // }
        if (item.attrcode == "pk_debitorg") {
            item.isShowUnit = true;//是否显示查询框
            item.queryCondition = () => {
                return {
                    funcode: this.props.getSearchParam("c"), //appcode获取
                    pk_fundpayorg: this.props.form.getFormItemsValue(
                        this.formId,
                        "pk_org"
                    ).value,
                    TreeRefActionExt: "nccloud.web.tmpub.filter.FundFinanceOrgRelationFilter"
                };
            };
        }
        //继承授信协议
        if (item.attrcode == "pk_inheritprotocol") {
            item.queryCondition = () => {
                let pk_funorg = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;//资金组织
                let pk_debitorg = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_debitorg"
                ).value;//授信单位
                let pk_currtype = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_currtype"
                ).value;//币种
                let begindate = this.props.form.getFormItemsValue(
                    this.formId,
                    "begindate"
                ).value;//开始日期
                let enddate = this.props.form.getFormItemsValue(
                    this.formId,
                    "enddate"
                ).value;//结束日期
                return {
                    pk_org: pk_funorg,//资金组织
                    pk_debitorg: pk_debitorg,
                    pk_currtype: pk_currtype,
                    begindate: begindate,
                    GridRefActionExt: 'nccloud.web.icdmc.icdmc.innerprotocol.filter.InheritProtocolFilterNCCFilter'
                };
            };
        }
    });
    // 表体参照过滤
    meta["cctype"].items.map(item => {

    });
    return meta;
}
// 模板初始化设置编辑性及其他
function templateCallback(props, meta) {
    let status = props.getUrlParam("status");
    if (status === "add") {
        // 初始化编辑性
        // props.initMetaByPkorg();
    } else if (status == "change") {
        // 变更-->可编辑性
        setChangeDisable.call(this, props);
    }
    else {
        props.form.setFormItemsDisabled(this.formId, {
            pk_org: true //组织
        });
    }
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/