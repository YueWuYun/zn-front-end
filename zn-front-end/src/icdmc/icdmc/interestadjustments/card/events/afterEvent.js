/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
import { ajax, promptBox, toast } from "nc-lightapp-front";
import { baseReqUrl, javaUrl } from "../../cons/constant.js";

/**
 * 编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} moduleId  区域id
 * @param {*} key       操作的键
 * @param {*} value     当前值
 * @param {*} oldvalue  旧值/新旧值集合
 */
export default function afterEvent(props, moduleId, key, value, oldvalue) {
    switch (key) {
        case "pk_fundorg": // 资金组织
            if (!oldvalue || !oldvalue.value) {
                //处理组织编辑后事件
                afterEventEdit.call(this, props, moduleId, key, value);
            } else {
                promptBox({
                    color: "warning",
                    title: this.state.json["36360ICIA-000012"] /* 国际化处理： 修改财务组织*/,
                    content: this.state.json["36360ICIA-000013"] /* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/,
                    beSureBtnClick: afterEventEdit.bind(this, props, moduleId, key, value ),
                    cancelBtnClick: () =>
                        props.form.setFormItemsValue(moduleId, { pk_fundorg: oldvalue, pk_fundorg_v: oldvalue})
                });
            }
            break;
        case "pk_innerloanpay": //放款编号
            afterEventEdit.call(this, props, moduleId, key, value);
        case "adjustmoney": //调整差额
            afterEventEdit.call(this, props, moduleId, key, value); //处理币种编辑后事件
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
    // if (key=== 'adjustmount') {
    // 	if (value && value.value<0) {
    // 		toast({color: 'warning', content: '调整差额不能为负数!'});
    // 		props.form.setFormItemsValue(this.formId, {
    // 			adjustmount: {display: null, value: null},   //调整差额
    // 		});
    // 		return;
    // 	}
    // }
    if (value.value) {
        if (key === "pk_fundorg") {
            // props.initMetaByPkorg();
            props.form.EmptyAllFormValue(this.formId);
            props.form.setFormItemsValue(this.formId, {
                pk_fundorg: value,
                pk_fundorg_v: value
            });
        }
        if (key === "pk_innerloanpay") {
            props.form.setFormItemsValue(this.formId, {
                adjustmoney: null,
                pk_interestlisticdmc: null
            });
        }
        let data = props.createHeadAfterEventData(this.pageId, this.formId, "", moduleId, key, value);
        // 解决首次财务组织编辑后事件传值问题
        data.oldvalue = {display: null, value: null};
        ajax({
            url: `${baseReqUrl}${javaUrl.afterEvent}.do`,
            data,
            async: false,
            success: res => {
                if (res.success) {
                    if (key === "pk_fundorg") {
                        props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
                        props.form.setFormItemsDisabled(this.formId, { adjustmoney: true, pk_interestlisticdmc: true, rate: true});
                    }
                    if (key === "pk_innerloanpay") {
                        props.form.setFormItemsDisabled(this.formId, {
                            adjustmoney: false,
                            pk_interestlisticdmc: false
                        });
                        if(res.data.userjson){
                            let userjson = JSON.parse(res.data.userjson);      
                            let flag = userjson.rateEditable == 'Y' ? false : true;
                            props.form.setFormItemsDisabled(this.formId, { rate: flag });
                        }
                    }
                    props.form.setAllFormValue({[this.formId]: res.data && res.data.head && res.data.head[this.formId]});
                }
            },
            error: res => {
                if (key === "pk_fundorg") {
                    props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
                }
                if (key === "adjustmoney") {
                    props.form.setFormItemsValue(this.formId, {
                        adjustmoney: { display: null, value: null },
                        adjustafterinterest: { display: null, value: null },
                    });
                }
                toast({ color: "warning", content: res.message });
            }
        });
    } else if (key === "pk_fundorg") {
        props.initMetaByPkorg('pk_fundorg');
        props.form.EmptyAllFormValue(this.formId);
    } else if (key === "pk_innerloanpay") {
        props.form.setFormItemsDisabled(this.formId, {
            adjustmoney: true,
            pk_interestlisticdmc: true
        });
        props.form.setFormItemsValue(this.formId, {
            pk_interestlisticdmc: { display: null, value: null }
        });
    }
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/