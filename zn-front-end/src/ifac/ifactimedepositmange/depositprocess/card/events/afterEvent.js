/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/
import { ajax, promptBox, toast } from "nc-lightapp-front";
import { baseReqUrl, javaUrl, card, processHeadOlcRateEditable } from "../../cons/constant.js";
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
    console.log(key, value, oldvalue, "key, value, oldvalue");
    switch (key) {
        case "pk_org": //财务组织
            if (!oldvalue || !oldvalue.value) {
                //处理组织编辑后事件
                afterEventEdit.call(this, props, moduleId, key, value);

            } else {
                promptBox({
                    color: "warning",
                    title: this.state.json[
                        "36340FDR-000012"
                    ] /* 国际化处理： 修改财务组织*/,
                    content: this.state.json[
                        "36340FDR-000013"
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
            if (!oldvalue || !oldvalue.value) {
                afterEventEdit.call(this, props, moduleId, key, value); //处理币种编辑后事件
            } else {
                // props.form.setFormItemsValue(this.formId, { 'olcrate': { value: null } }) // 组织本币汇率
                // props.form.setFormItemsValue(this.formId, { 'glcrate': { value: null } }) // 集团本币汇率
                // props.form.setFormItemsValue(this.formId, { 'gllcrate': { value: null } }) // 全局本币汇率
                props.form.setFormItemsValue(this.formId, { 'businessvariety': { value: null } }) // 业务品种
                props.form.setFormItemsValue(this.formId, { 'pk_settleacc': { value: null } }) // 结算账户
                props.form.setFormItemsValue(this.formId, { 'pk_depositacc': { value: null } }) // 定期账户
                afterEventEdit.call(this, props, moduleId, key, value);
            }
            break;
        case "olcrate": // 组织本币汇率
        case "glcrate": // 集团本币汇率
        case "gllcrate": // 全局本币汇率
            afterEventEdit.call(this, props, moduleId, key, value); //处理汇率编辑后事件
            break;
        case "depositamount": // 存入原币金额
            if (!oldvalue || !oldvalue.value) {
                afterEventEdit.call(this, props, moduleId, key, value);
            } else if (value.value == null || value.value == '') {
                props.form.setFormItemsValue(this.formId, { 'olcdepositamount': { value: null } })
                props.form.setFormItemsValue(this.formId, { 'glcdepositamount': { value: null } })
                props.form.setFormItemsValue(this.formId, { 'gllcdepositamount': { value: null } })
                return;
            } else {
                afterEventEdit.call(this, props, moduleId, key, value);
            }
            break;
        case 'pk_depositorg': // 存款单位
            props.form.setFormItemsValue(this.formId, { 'pk_settleacc': { value: null } })
            props.form.setFormItemsValue(this.formId, { 'pk_settleacc.accidname': { value: null } })
            props.form.setFormItemsValue(this.formId, { 'pk_depositacc': { value: null } })
            props.form.setFormItemsValue(this.formId, { 'pk_depositacc.accidname': { value: null } })
            if (!oldvalue || !oldvalue.value) {
                props.form.setFormItemsValue(this.formId, { 'depositorgname': { value: value.values["name"].value, display: value.values["name"].value } })

            } else if (oldvalue && value.value == null) {
                props.form.setFormItemsValue(this.formId, { 'depositorgname': { value: null } })
                return;
            }
            else {
                props.form.setFormItemsValue(this.formId, { 'depositorgname': { value: value.values["name"].value, display: value.values["name"].value } })
            }
            break;
        case 'pk_settleacc': // 结算账号
            if (!oldvalue || !oldvalue.value) {
                props.form.setFormItemsValue(this.formId, { 'pk_settleacc.accidname': { value: value.values["accidname"].value, display: value.values["accidname"].value } })
                props.form.setFormItemsValue(this.formId, { 'olcdepositamount': { value: s["glcdepositamount"].scale, display: s["glcdepositamount"].scale } })
                props.form.setFormItemsValue(this.formId, { 'olcrate': { value: s["olcrate"].value, display: s["olcrate"].value } })


            } else if (oldvalue && value.value == null) {
                props.form.setFormItemsValue(this.formId, { 'pk_settleacc.accidname': { value: null } })
                props.form.setFormItemsValue(this.formId, { 'olcdepositamount': { value: null } })
                props.form.setFormItemsValue(this.formId, { 'olcrate': { value: null } })
                return;
            }
            else {
                props.form.setFormItemsValue(this.formId, { 'pk_settleacc.accidname': { value: value.values["accidname"].value, display: value.values["accidname"].value } })
                props.form.setFormItemsValue(this.formId, { 'olcdepositamount': { value: s["glcdepositamount"].scale, display: s["glcdepositamount"].scale } })
                props.form.setFormItemsValue(this.formId, { 'olcrate': { value: s["olcrate"].value, display: s["olcrate"].value } })

            }
            break;

        case 'pk_depositacc': // 定期账号
            if (!oldvalue || !oldvalue.value) {
                props.form.setFormItemsValue(this.formId, { 'pk_depositacc.accidname': { value: value.values["accidname"].value, display: value.values["accidname"].value } })

            } else if (oldvalue && value.value == null) {
                props.form.setFormItemsValue(this.formId, { 'pk_depositacc.accidname': { value: null } })
                return;
            }
            else {
                props.form.setFormItemsValue(this.formId, { 'pk_depositacc.accidname': { value: value.values["accidname"].value, display: value.values["accidname"].value } })

            }
            break;

        case 'businessvariety': // 定期业务品种
            let pkvarieties = props.form.getFormItemsValue(this.formId, 'businessvariety').value;
            if (!oldvalue || !oldvalue.value) {
                let data = props.createFormAfterEventData(card.pageCode, card.headCode);
                ajax({
                    url: `${baseReqUrl}${javaUrl.aftervariety}.do`,
                    data: data,
                    async: false,
                    success: res => {
                        if (res.success) {

                            props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
                        }
                    },
                    error: res => {
                        if (key === "pk_org") {
                            props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
                        }
                        toast({ color: "warning", content: res.message });
                    }

                });
                this.props.form.setFormItemsDisabled(this.formId, { 'pk_depositrate': true });
                this.props.form.setFormItemsDisabled(this.formId, { 'pk_aiacrate': true });
                this.props.form.setFormItemsDisabled(this.formId, { 'depositinterval': true });
                this.props.form.setFormItemsDisabled(this.formId, { 'intervalunit': true });
            } else if (oldvalue && value.value == null) {
                props.form.setFormItemsValue(this.formId, { 'businessvariety': { value: null } })
                props.form.setFormItemsValue(this.formId, { 'pk_depositrate': { value: null } })
                props.form.setFormItemsValue(this.formId, { 'pk_aiacrate': { value: null } })
                props.form.setFormItemsValue(this.formId, { 'intervalunit': { value: null } })
                props.form.setFormItemsValue(this.formId, { 'depositinterval': { value: null } })
                props.form.setFormItemsValue(this.formId, { 'deposityrate': { value: null } })
                props.form.setFormItemsValue(this.formId, { 'enddate': { value: null } })
                return;
            }
            else {
                let data = props.createFormAfterEventData(card.pageCode, card.headCode);
                ajax({
                    url: `${baseReqUrl}${javaUrl.aftervariety}.do`,
                    data: data,
                    async: false,
                    success: res => {
                        if (res.success) {

                            props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
                        }
                    },
                    error: res => {
                        if (key === "pk_org") {
                            props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
                        }
                        toast({ color: "warning", content: res.message });
                    }

                });
                this.props.form.setFormItemsDisabled(this.formId, { 'pk_depositrate': true });
                this.props.form.setFormItemsDisabled(this.formId, { 'pk_aiacrate': true });
                this.props.form.setFormItemsDisabled(this.formId, { 'depositinterval': true });
                this.props.form.setFormItemsDisabled(this.formId, { 'intervalunit': true });
            }
            break;
        case "depositdate": // 存款日期
            if (!oldvalue || !oldvalue.value) {
                afterEventEdit.call(this, props, moduleId, key, value);
            } else if (value.value == null || value.value == '') {
                props.form.setFormItemsValue(this.formId, { 'enddate': { value: null } })
                return;
            } else {
                afterEventEdit.call(this, props, moduleId, key, value);
            }
            // let begindate = props.form.getFormItemsValue(this.formId, "depositdate").value; // 开始日期
            // let periodcount = props.form.getFormItemsValue(this.formId, "depositinterval").value; // 期间
            // if (key == 'periodcount') {
            //     if (!checkNegative.call(this, key, value)) {
            //         return;
            //     }
            // }
            // let periodunit = props.form.getFormItemsValue(this.formId, "intervalunit").value; // 期间单位
            // let enddate
            // if (begindate && periodcount && periodunit) {

            //     if (periodunit.includes('D')) {
            //         enddate = moment(begindate).add(periodcount, 'day');
            //     }
            //     if (periodunit.includes('M')) {
            //         enddate = moment(begindate).add(periodcount, 'months');
            //     }
            //     if (periodunit.includes('S')) {
            //         enddate = moment(begindate).add(periodcount, 'quarters');
            //     }
            //     if (periodunit.includes('Y')) {
            //         if (periodunit.includes('HALFYEAR')) {
            //             let numb = 6 * periodcount;
            //             enddate = moment(begindate).add(numb, 'months');
            //         } else {
            //             enddate = moment(begindate).add(periodcount, 'years');
            //         }
            //     }
            //     props.form.setFormItemsValue(this.formId, { 'enddate': { value: moment(enddate).format('YYYY-MM-DD HH:mm:ss'), display: moment(enddate).format('YYYY-MM-DD HH:mm:ss') } })
            //     //loanperiodrender.call(this, begindate, enddate);
            // }
            break;
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
            this.pageId,
            this.formId,
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
        ajax({
            url: `${baseReqUrl}${javaUrl.afterEvent}.do`,
            data,
            async: false,
            success: res => {
                if (res.success) {
                    let glcrate = res.data.head.head.rows["0"].values.glcrate.value;
                    let olcrate = res.data.head.head.rows["0"].values.olcrate.value;
                    let gllcrate = res.data.head.head.rows["0"].values.gllcrate.value;
                    if (key === "pk_org") {
                        props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
                        // if (olcrate == 1 && glcrate == 1 && gllcrate == 1) {
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'olcrate': true });
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'glcrate': true });
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'gllcrate': true });
                        // } else {
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'olcrate': false });
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'glcrate': false });
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'gllcrate': false });
                        // }

                        props.form.setFormItemsDisabled(this.formId, {
                            adjustmount: true
                        });
                    } else if (key === "pk_currtype") {
                        // if (olcrate == 1 && glcrate == 1 && gllcrate == 1) {
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'olcrate': true });
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'glcrate': true });
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'gllcrate': true });
                        // } else {
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'olcrate': false });
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'glcrate': false });
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'gllcrate': false });
                        // }
                    } else if (key === "olcrate" || key === "glcrate" || key === "gllcrate") {
                        // if (olcrate == 1 && glcrate == 1 && gllcrate == 1) {
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'olcrate': true });
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'glcrate': true });
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'gllcrate': true });
                        // } else {
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'olcrate': false });
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'glcrate': false });
                        //     this.props.form.setFormItemsDisabled(this.formId, { 'gllcrate': false });
                        // }
                    }
                    if (res.data.userjson) {
                        let userjson = JSON.parse(res.data.userjson);
                        let { retExtParam } = userjson;
                        //设置组织本币列编辑性
                        processHeadOlcRateEditable(props, retExtParam);
                    }
                    props.form.setAllFormValue({
                        [this.formId]:
                            res.data &&
                            res.data.head &&
                            res.data.head[this.formId]
                    });
                    disableamount.call(this);
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
        props.form.setFormItemsValue(this.formId, { 'creditaccount': { value: null } }) // 贷款账号
        props.form.setFormItemsValue(this.formId, { 'innercreditaccount': { value: null } }) // 内部贷款账号
        props.form.setFormItemsValue(this.formId, { 'unitdebitaccount': { value: null } }) // 单位借款账号
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
            content: this.state.json["36340FDR-000032"]
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
            content: this.state.json["36340FDR-000037"]
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
                value: 'SHORT', display: this.state.json["36340FDR-000033"]
            }
        });
    } else if (366 < day_diff && day_diff <= daynum) {
        this.props.form.setFormItemsValue(this.formId, { 'loanperiod': { value: 'MIDDLE', display: this.state.json["36340FDR-000034"] } });
    } else if (daynum < day_diff) {
        this.props.form.setFormItemsValue(this.formId, { 'loanperiod': { value: 'LONG', display: this.state.json["36340FDR-000035"] } });
    }
}

/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/