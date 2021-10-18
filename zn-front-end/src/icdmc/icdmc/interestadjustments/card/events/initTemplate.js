/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { afterEventEdit } from "./afterEvent";
import { buttonVisible } from "./buttonVisible";
import { getCopyData } from "./page";

export default function (props) {
    let appCode = props.getSearchParam("c") || props.getUrlParam("c");
    props.createUIDom(
        {
            pagecode: this.pageId, //页面id
            appcode: appCode
        },
        data => {
            if (data) {
                if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button, () => {
                        props.button.setPopContent( "delete", this.state.json["36360ICIA-000004"] ); /* 国际化处理： 确认要删除吗?*/
                    });
                    buttonVisible.call(this, props, button);
                }
                if (data.template) {
                    let meta = data.template;
                    meta = modifierMeta.call(this, props, meta);
                    props.meta.setMeta(meta);
                   
                    let id = this.props.getUrlParam("id");
                    if (props.getUrlParam("status") === "copy") {
                        getCopyData.call(this, id, true);
                    } else if(props.getUrlParam("status") === "edit"){
                        props.form.setFormItemsDisabled(this.formId, { pk_fundorg: true });
                    }
                    orgVersionView(props, this.formId, 'pk_fundorg', 'pk_fundorg_v');
                }
                if (data.context && props.getUrlParam("status") === "add") {
                    let { pk_org, pk_org_v, org_Name, org_v_Name } = data.context;
                    if (data.context.pk_org) {
                        props.form.setFormItemsValue(this.formId, {
                            pk_fundorg: { display: org_Name, value: pk_org },
                            pk_fundorg_v: { display: org_v_Name, value: pk_org_v }
                        });
                        afterEventEdit.call( this, props, this.formId, "pk_fundorg", { display: org_Name, value: pk_org } );
                    } else {
                        props.initMetaByPkorg('pk_fundorg');
                    }
                }
            }
        }
    );
}

function modifierMeta(props, meta) {
    meta[this.formId].items.map(item => {
        if (item.attrcode == "pk_fundorg") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    TreeRefActionExt:  "nccloud.web.tmpub.filter.FundOrgPermissionFilter"
                };
            };
        }
        if (item.attrcode == "pk_innerloanpay") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    pk_org: props.form.getFormItemsValue(this.formId, "pk_fundorg") && props.form.getFormItemsValue(this.formId, "pk_fundorg").value
                };
            };
        }
        if (item.attrcode == "pk_interestlisticdmc") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    pk_org_r: props.form.getFormItemsValue(this.formId, "pk_fundorg") && props.form.getFormItemsValue(this.formId, "pk_fundorg").value,
                    pk_financepay:  props.form.getFormItemsValue(this.formId, "pk_innerloanpay") && props.form.getFormItemsValue(this.formId, "pk_innerloanpay").value
//                     TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceFundOrgRelationFilter'
                };
            };
        }

    });
    return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/