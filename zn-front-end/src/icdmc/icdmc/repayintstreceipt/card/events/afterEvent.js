/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { ajax, promptBox } from "nc-lightapp-front";
import { baseReqUrl, javaUrl, card } from "../../cons/constant";
import {
    // setOlcDisabled,
    getAfterEventData,
    checkNegative
} from "../../../public/cardEvent";
// props, moduleId(区域id), key(操作的键), value（当前值），oldValue(旧值)
export function afterEvent(props, moduleId, key, value, oldvalue) {
    //console.log(key, value);
    // let eventData = this.props.createTabsAfterEventData(
    //     this.pageId,
    //     this.formId,
    //     this.tabOrder,
    //     moduleId,
    //     key,
    //     value
    // );
    //编辑后事件url
    const url = baseReqUrl + javaUrl.afterEvent;
    //需要调编辑后事件接口
    const eventKey = [
        "pk_org",
        "loancode",
        "payintmoney",
        "loanunitid",
        "isfirstpayintst"
    ];
    // 需要检查不能为负数
    const amountKey = [
        "shdpayintmny",
        "payintmoney",
        "oclpayintmoney",
        "olcrate"
    ];
    if (amountKey.includes(key)) {
        if (!checkNegative.call(this, key, value)) {
            return;
        }
    }
    if (key == "pk_innerloanpay") {
        //放款单编号
        if (value && value.value) {
            // props.resMetaAfterPkorgEdit();
            // props.form.setFormItemsDisabled(this.formId, {
            //     pk_debitunit: true, //借款单位
            //     fininstitutionid: true
            // });
            let accountinter = value.values.accountinter; //核算利息
            if (accountinter && accountinter.value == "Y") {
                props.form.setFormItemsDisabled(this.formId, {
                    // payintmoney: true //付息金额
                    payintmoney: false //付息金额
                });
            } else {
                props.form.setFormItemsDisabled(this.formId, {
                    payintmoney: false //付息金额
                });
            }
            getAfterEventDataFuc.call(this, props, moduleId, key, value);
        }
    } else if (key == "payintmoney") {
        // 付息金额
    } 
}
// 编辑后事件
function getAfterEventDataFuc(props, moduleId, key, value) {
    if (value.value) {
        if (key == "pk_org") {
            let data = {};
            props.form.EmptyAllFormValue(this.formId);
            for (let item of this.tabOrder) {
                data[item] = { rows: [] };
            }
            // props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
            props.form.setFormItemsValue(this.formId, {
                pk_org: value,
                pk_org_v: value
            });
            // props.form.setFormItemsDisabled(this.formId, {
            //     loancode: false //放款单编号
            // });
            this.setState({
                billNo: ""
            });
        }
        // let eventData = props.createTabsAfterEventData(
        //     this.pageId,
        //     this.formId,
        //     this.tabOrder,
        //     moduleId,
        //     key,
        //     value
        // );
        // let eventData = props.createFormAfterEventData(
        let eventData = props.createHeadAfterEventData(
            this.pageId,
            this.formId,
            "",
            moduleId,
            key,
            value
        );
       
        //编辑后事件url
        const url = baseReqUrl + javaUrl.afterEvent;
        getAfterEventData.call(this, eventData, url).then(res => {
            props.form.setAllFormValue({
                [this.formId]: res.data.head && res.data.head[this.formId]
            });
            let pk_currtype =
                res.data.head[this.formId].rows[0].values.pk_currtype;
            if (pk_currtype && pk_currtype.value) {
                this.setState(
                    {
                        initPk_currtype: pk_currtype.value
                    }
                );
            }
            if (key == "pk_org") {
                props.form.setFormItemsDisabled(this.formId, {
                    memo: false, //备注
                    pk_innerloanpay: false //放款单
                });
            }
            if (key == "pk_innerloanpay") {
                props.form.setFormItemsDisabled(this.formId, {
                    payintmoney: false, //付息金额
                    pk_fundplan: false //资金计划
                });
            }
        });
    } else if (key == "pk_org") {
        props.initMetaByPkorg();
        props.form.EmptyAllFormValue(this.formId);
        // props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
        this.setState({
            billNo: ""
        });
    }
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/