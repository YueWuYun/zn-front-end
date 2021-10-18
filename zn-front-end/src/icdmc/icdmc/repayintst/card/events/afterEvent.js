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
        "loancode",
        "payintmoney",
        "loanunitid",
        "isfirstpayintst",
        "olcrate",
        "glcrate",
        "gllcrate",
        "loandate"
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
    if (eventKey.includes(key)) {
        if (key == "pk_org") {
            if (!oldvalue || !oldvalue.value) {
                //处理组织编辑后事件
                getAfterEventDataFuc.call(this, props, moduleId, key, value);
            } else {
                promptBox({
                    color: "warning",
                    title: this.state.json[
                        "36360IPI-000023"
                    ] /* 国际化处理： 修改财务组织*/,
                    content: this.state.json[
                        "36360IPI-000024"
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
        } else if(key == "loanunitid"){
            let banktype = 'bd_banktype.pk_banktype';
            
            if(value.value == null){
                props.form.setFormItemsValue(this.formId,{
                    'loanaccount':null,//收款账户
                    // 'fininstitutionid': null //单位内部账户
                });
                props.form.setFormItemsDisabled(this.formId, {
                    loanaccount:true,//收款账户
                    // fininstitutionid: true //单位内部账户
                });
                props.form.setFormItemsRequired(this.formId,{
                    'loanaccount':false,//收款账户
                    // 'fininstitutionid': false //单位内部账户
                });
            }else{
                if (value.values[banktype].value == '0001Z01000000000036R'){ //结算账户
                    props.form.setFormItemsDisabled(this.formId, {
                        loanaccount:true,//贷款账户
                        // fininstitutionid: false //单位内部账户
                    });
                    props.form.setFormItemsRequired(this.formId,{
                        'loanaccount':false,//贷款账户
                        // 'fininstitutionid': true //单位内部账户
                    });
                    props.form.setFormItemsValue(this.formId,{
                        'loanaccount':null,//贷款账户)
                    });
                   
                }else {
                    props.form.setFormItemsDisabled(this.formId, {
                        loanaccount:false,//贷款账户
                        // fininstitutionid: true //单位内部账户
                    });
                    props.form.setFormItemsRequired(this.formId,{
                        'loanaccount':true,//贷款账户
                        // 'fininstitutionid': false //单位内部账户
                    });
                }
            }
            
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
                    pk_innerloanpay: false //放款单
                });
            }
            if (key == "pk_innerloanpay") {
                props.form.setFormItemsDisabled(this.formId, {
                    payintmoney: false, //付息金额
                    pk_fundplan: false, //资金计划
                    loanunitid: false, //单位银行账户
                    loanaccount: true, //贷款账户
                    // fininstitutionid: true, //单位内部账户
                    // subfinstitutionid: true, //内部贷款账户
                    loandate: false, //付息日期
                    pk_contract_icdmc: true, //合同编号
                    pk_currtype: true, //币种
                    loanmny: true, //放款金额
                    pk_debitunit: true, //借款单位
                    financorgid: true, //贷款单位
                    shdpayintmny: true, //应付息金额
                    unpayintmoney: true, //为付息金额
                    accept_date: true, //受理日期
                    busistatus: true, //单据状态
                    vbillstatus: true //审批状态
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
    } else if (key == "pk_innerloanpay") {
        props.form.setFormItemsValue(this.formId, editsetnull);
        // props.form.EmptyAllFormValue(this.formId);
        // props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
        this.setState({
            billNo: ""
        });
    }
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/