/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/
import { ajax, promptBox, toast } from "nc-lightapp-front";
import { baseReqUrl, javaUrl, card } from "../../cons/constant.js";
import moment from "moment";
/**
 * 编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} moduleId  区域id
 * @param {*} key       操作的键
 * @param {*} value     当前值
 * @param {*} oldvalue  旧值/新旧值集合
 */
export default function afterEvent(props, moduleId, key, value, oldvalue, i, s, g) {
    //console.log(key, value, oldvalue, "key, value, oldvalue");
    switch (key) {
        case "pk_org": //财务组织
            if (!oldvalue || !oldvalue.value) {
                //处理组织编辑后事件
                //afterEventEdit.call(this, props, moduleId, key, value);
            } else {
                promptBox({
                    color: "warning",
                    title: this.state.json[
                        "36140DV-000012"
                    ] /* 国际化处理： 修改财务组织*/,
                    content: this.state.json[
                        "36140DV-000013"
                    ] /* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/,
                    beSureBtnClick: afterEventEdit.bind(
                        this,
                        props,
                        moduleId,
                        key,
                        value
                    ),
                    cancelBtnClick: () =>
                        props.form.setFormItemsValue(moduleId, {
                            pk_org: oldvalue,
                            pk_org_v: oldvalue
                        }),
                    onEscapeKeyUp: () =>
                        props.form.setFormItemsValue(moduleId, {
                            pk_org: oldvalue,
                            pk_org_v: oldvalue
                        }), // esc关闭对话框
                });
            }
            break;
         case "pk_currtype": //币种
        //     if (!oldvalue || !oldvalue.value) {
                 afterEventEdit.call(this, props, moduleId, key, value); //处理币种编辑后事件
        //     }else if(oldvalue && value.value == null){
        //         props.form.setFormItemsValue(this.formId, { 'pk_currtype': { value: null } })
        //         return;
        //     } else {
        //         // props.form.setFormItemsValue(this.formId, { 'pk_currtype': { value: null } }) // 贷款账号
        //         // props.form.setFormItemsValue(this.formId, { 'innercreditaccount': { value: null } }) // 内部贷款账号
        //         // props.form.setFormItemsValue(this.formId, { 'unitdebitaccount': { value: null } }) // 单位借款账号
        //         afterEventEdit.call(this, props, moduleId, key, value);
        //     }
             break;
        
        case 'pk_depositrate': // 定期利率
            if (!oldvalue || !oldvalue.value) {
                props.form.setFormItemsValue(this.formId, { 'yrate': { value: value.values["yrate"].value, display: value.values["yrate"].value } })
                props.form.setFormItemsValue(this.formId, { 'mrate': { value: value.values["mrate"].value, display: value.values["mrate"].value } })
                props.form.setFormItemsValue(this.formId, { 'rate': { value: value.values["rate"].value, display: value.values["rate"].value } })
            } else if(oldvalue && value.value == null){
                props.form.setFormItemsValue(this.formId, { 'yrate': { value: null } })
                props.form.setFormItemsValue(this.formId, { 'mrate': { value: null } })
                props.form.setFormItemsValue(this.formId, { 'rate': { value: null } })
                return;
            }
            else {
                props.form.setFormItemsValue(this.formId, { 'yrate': { value: value.values["yrate"].value, display: value.values["yrate"].value } })
                props.form.setFormItemsValue(this.formId, { 'mrate': { value: value.values["mrate"].value, display: value.values["mrate"].value } })
                props.form.setFormItemsValue(this.formId, { 'rate': { value: value.values["rate"].value, display: value.values["rate"].value } })
            }
        
        case '':
            break;

        default:
            break;
    }
}

/**
 * 财务组织、币种、金额等编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} moduleId  区域id
 * @param {*} key       操作的键
 * @param {*} value     当前值
 */
export function afterEventEdit(props, moduleId, key, value) {
    if (value.value) {
        if (key === "pk_org") {
            props.initMetaByPkorg();
            props.form.EmptyAllFormValue(this.formId);
            props.form.setFormItemsValue(this.formId, {
                pk_org: value,
                //pk_org_v: value
            });
        }
        let data = props.createHeadAfterEventData(
        	card.pageCode,
            card.headCode,
            "",
            moduleId,
            key,
            value
        );
        // 解决首次财务组织编辑后事件传值问题
        data.oldvalue = {
            display: null,
            value: null
        };
        let url;
        if(key==="pk_currtype"){
            url = javaUrl.afterCurrtypeEvent
        }else{
            url = javaUrl.afterEvent
        }
        ajax({
            url: `${baseReqUrl}${url}.do`,
            data,
            async: false,
            success: res => {
                if (res.success) {
                    if (key === "pk_org") {
                        props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
                        props.form.setFormItemsDisabled(this.formId, {
                            adjustmount: true
                        });
                    }
                    props.form.setAllFormValue({
                        [this.formId]:
                            res.data &&
                            res.data.head &&
                            res.data.head[this.formId]
                    });
                    //disableamount.call(this);
                }
            },
            error: res => {
                if (key === "pk_org") {
                    props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
                }
                toast({ color: "warning", content: res.message });
            }
        });
    } else if (key === "pk_org") {
        props.initMetaByPkorg();
        props.form.EmptyAllFormValue(this.formId);
    } else if (key === "pk_currtype") {
        // props.form.setFormItemsValue(this.formId, { 'creditaccount': { value: null } }) // 贷款账号
        // props.form.setFormItemsValue(this.formId, { 'innercreditaccount': { value: null } }) // 内部贷款账号
        // props.form.setFormItemsValue(this.formId, { 'unitdebitaccount': { value: null } }) // 单位借款账号
    }
}


/**
 * 禁用金额字段
 */
export function disableamount() {
    this.props.form.setFormItemsDisabled(this.formId, { 'olcapplymnt': true });
    this.props.form.setFormItemsDisabled(this.formId, { 'olccontractamount': true });
    this.props.form.setFormItemsDisabled(this.formId, { 'glcapplymnt': true });
    this.props.form.setFormItemsDisabled(this.formId, { 'glccontractamount': true });
    this.props.form.setFormItemsDisabled(this.formId, { 'gllcapplymnt': true });
    this.props.form.setFormItemsDisabled(this.formId, { 'gllccontractamount': true });
}


/**
 * 检验输入的金额不能为负数
 * @param {*} key         字段
 * @param {*} value       输入的数据
 * @returns 检测正数还是负数
 */
export function checkNegative(key, value) {
    if (value.value && +value.value < 0) {
        this.props.form.setFormItemsValue(this.formId, {
            [key]: {
                display: null,
                value: null
            }
        });
        toast({
            color: "warning",
            content: this.state.json["36140DV-000032"]
        }); /* 国际化处理： 输入的金额不能为负！*/
        return false;
    } if (value.value && +value.value === 0) {
        this.props.form.setFormItemsValue(this.formId, {
            [key]: {
                display: null,
                value: null
            }
        });
        toast({
            color: "warning",
            content: this.state.json["36140DV-000037"]
        }); /* 国际化处理： 输入的金额不能为负！*/
        return false;
    } else {
        return true;
    }
}


/**
 * 判断借贷期间短中长期
 * @param {*} key         字段
 * @param {*} value       输入的数据
 * @returns 判断借贷期间短中长期
 */
export function loanperiodrender(depositdate, enddate) {
    const begintime = moment(depositdate);
    const endtime = moment(enddate);
    const day_diff = endtime.diff(begintime, 'days');
    const daynum = 5 * 366;
    if (day_diff <= 366) {
        this.props.form.setFormItemsValue(this.formId, {
            'loanperiod': {
                value: 'SHORT', display: this.state.json["36140DV-000033"]
            }
        });
    } else if (366 < day_diff && day_diff <= daynum) {
        this.props.form.setFormItemsValue(this.formId, { 'loanperiod': { value: 'MIDDLE', display: this.state.json["36140DV-000034"] } });
    } else if (daynum < day_diff) {
        this.props.form.setFormItemsValue(this.formId, { 'loanperiod': { value: 'LONG', display: this.state.json["36140DV-000035"] } });
    }
}

/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/