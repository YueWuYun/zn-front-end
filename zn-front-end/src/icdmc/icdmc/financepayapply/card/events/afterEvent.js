/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { ajax, promptBox } from "nc-lightapp-front";
import { baseReqUrl, javaUrl, card,editsetnull } from "../../cons/constant";
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
        "contractid",
        "loanmny",
        "payplan",
        "olcrate",
        "glcrate",
        "gllcrate",
        "loandate"
    ];
    // 需要检查不能为负数
    const amountKey = [
        "loanmny"
    ];
    if (amountKey.includes(key)) {
        if (!checkNegative.call(this, key, value)) {
            return;
        }
    }
    if (eventKey.includes(key)) {
        if (key == "pk_org") {
            if (!oldvalue || !oldvalue.value) {
                //处理组织编辑后事件
                getAfterEventDataFuc.call(this, props, moduleId, key, value);
            } else {
                promptBox({
                    color: "warning",
                    title: this.state.json[
                        "36362IAP-000023"
                    ] /* 国际化处理： 修改财务组织*/,
                    content: this.state.json[
                        "36362IAP-000024"
                    ] /* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/,
                    beSureBtnClick: getAfterEventDataFuc.bind(
                        this,
                        props,
                        moduleId,
                        key,
                        value
                    ),
                    cancelBtnClick: () =>
                        props.form.setFormItemsValue(moduleId, {
                            pk_org: oldvalue
                        })
                });
            }
        } else if(key == "contractid"){
            if(value.value == null){
                // 合同编号
                props.form.setFormItemsDisabled(this.formId, {
                    payplan: true //放款计划
                });
                props.form.setFormItemsValue(this.formId, {
                    payplan: { display: null, value: null }
                });
            }else{
                // 合同编号
                props.form.setFormItemsDisabled(this.formId, {
                    payplan: false //放款计划
                });
                props.form.setFormItemsValue(this.formId, {
                    payplan: { display: null, value: null }
                });
            }
            //处理组织编辑后事件
            getAfterEventDataFuc.call(this, props, moduleId, key, value);
            
        }else if(key == "payplan"){
            props.resMetaAfterPkorgEdit();
            if(value.value == null){
                // 放款金额
                props.form.setFormItemsDisabled(this.formId, {
                    loanmny: true 
                });
                props.form.setFormItemsValue(this.formId, {
                    loanmny: { display: null, value: null }
                });
            }else{
                // 放款金额
                props.form.setFormItemsDisabled(this.formId, {
                    loanmny: true //放款金额
                });
                props.form.setFormItemsValue(this.formId, {
                    loanmny: { display: null, value: null }
                });
            }
            //处理组织编辑后事件
            getAfterEventDataFuc.call(this, props, moduleId, key, value);
            
        } else{
            if (value.value) {
                getAfterEventDataFuc.call(this, props, moduleId, key, value);
            }
        }
    }
    if (key == "pk_innerloanpay") {
        //放款单编号
        if (value && value.value) {
            props.resMetaAfterPkorgEdit();
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
        }else{
            props.form.setFormItemsValue(this.formId, editsetnull);
            props.form.setFormItemsDisabled(this.formId, {
                payintmoney: true, //付息金额
                pk_fundplan: true, //资金计划
                loanunitid: true, //单位银行账户
                loanaccount: true, //贷款账户
                // fininstitutionid: true, //单位内部账户
                // subfinstitutionid: true, //内部贷款账户
                loandate:true //付息日期
            });
            // props.form.EmptyAllFormValue(this.formId);
            // props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
            this.setState({
                billNo: ""
            });
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
        let meta = props.meta.getMeta();
        let eventData = props.createHeadAfterEventData(
            // this.pageId,
            meta.code,
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
             //设置表头汇率字段编辑性
             let {userjson}=res.data;
             if(userjson) {
                 let uiedit=JSON.parse(userjson);
                 if(uiedit['olcrate']=='false') {
                     props.form.setFormItemsDisabled(this.formId, {
                         olcrate: true
                     });
                 }else {
                     props.form.setFormItemsDisabled(this.formId, {
                         olcrate: false
                     });
                 }
                 if(uiedit['glcrate']=='false') {
                     props.form.setFormItemsDisabled(this.formId, {
                         glcrate: true
                     });
                 }else {
                     props.form.setFormItemsDisabled(this.formId, {
                         glcrate: false
                     });
                 }
                 if(uiedit['gllcrate']=='false') {
                     props.form.setFormItemsDisabled(this.formId, {
                         gllcrate: true
                     });
                 }else {
                     props.form.setFormItemsDisabled(this.formId, {
                         gllcrate: false
                     });
                 }
             }
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
                    contractid: false //放款单
                });

            }
            if (key == "contractid") {
                props.form.setFormItemsDisabled(this.formId, {
                    loandate: false, //放款日期
                    // loanmny: false, //放款金额
                    payplan: false, //放款计划
                    pk_planitem: false //资金项目
                    // debitunitacctid: false //单位银行账户
                });
                
            }
            if(key == "payplan"){
                props.form.setFormItemsDisabled(this.formId, {
                    loanmny: false //放款金额
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
    } else if (key == "contractid") {
        props.form.setFormItemsValue(this.formId, editsetnull);
        // props.form.EmptyAllFormValue(this.formId);
        // props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
        this.setState({
            billNo: ""
        });
    }
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/