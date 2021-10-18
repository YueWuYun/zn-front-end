/*p3PBAgd0dW05HIwiD/hGxmEaSeKiElJI2QmoTVzZvOilVN+Q1btr2G8wXZzUTPyP*/
import { ajax } from "nc-lightapp-front";
import { baseReqUrl, javaUrl } from "../../cons/constant";

export function afterEvent(props, moduleId, key, value, oldValue) {
    //console.log(key, value, oldValue);
    let eventData = this.props.createHeadAfterEventData(
        this.pageId,
        this.formId,
        this.tableId,
        moduleId,
        key,
        value
    );
    if (value.value !== oldValue.value) {
        switch (key) {
            case "pk_bankdoc":
                if (value.value) {
                    getAfterData(eventData).then(res => {
                        let pk_org = props.form.getFormItemsValue(
                            this.formId,
                            "pk_org"
                        );
                        // 带出网银信息以及根据银行档案给银行类别赋值
                        props.form.setAllFormValue({
                            [this.formId]:
                                res.data.head && res.data.head[this.formId]
                        });
                        props.form.setFormItemsValue(this.formId, {
                            pk_banktype: {
                                value: value.values.pk_banktype.value,
                                display: value.values.ttname.value
                            },
                            pk_org
                        });
                        let netBank = props.form.getFormItemsValue(
                            this.formId,
                            "pk_netbankinftp"
                        ).value;
                        netBankHandel.call(this, props, netBank);
                    });
                }
                break;
            case "pk_netbankinftp": // 网银接口类别
                netBankHandel.call(this, props, value);
                break;
            default:
                break;
        }
    }
}

function netBankHandel(props, value) {
    let requireFlag = value.value ? true : false;
    props.form.setFormItemsRequired(this.formId, {
        areacode: requireFlag,
        bankarea: requireFlag,
        province: requireFlag,
        city: requireFlag
    });
}

function getAfterData(data) {
    return new Promise(resolve => {
        ajax({
            // 带出网银信息以及根据银行档案给银行类别赋值
            url: `${baseReqUrl}${javaUrl.accAfterEvent}.do`,
            async: false,
            data,
            success: res => {
                resolve(res);
            }
        });
    });
}

/*p3PBAgd0dW05HIwiD/hGxmEaSeKiElJI2QmoTVzZvOilVN+Q1btr2G8wXZzUTPyP*/