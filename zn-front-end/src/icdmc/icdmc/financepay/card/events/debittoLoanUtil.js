/*36oDFpNgu0e6f3pxiBjRiwWD+AO7rMu7WCwiAX/CJ2aUjy4xiG0lMcvvsC3lmoiw*/
import {
    createPage,
    ajax,
    base,
    toast
} from 'nc-lightapp-front';
/**
 *  根据借款来源切换 来源单据号的参照
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 *  @param {*} value 交易对象值
 */
export const BorrowSrouceHandle = function (props, moduleId, oldvalue, value) {
    let meta = props.meta.getMeta();
    let item = meta[this.formId].items.find((e) => e.attrcode === 'srcbillno');
    if (!value || !value.value) {

        props.form.setFormItemsDisabled(this.formId, {
            srcbillno: true,
        });
    } else {

        props.form.setFormItemsDisabled(this.formId, {
            srcbillno: false,
        });
    }

    if (oldvalue.value != value.value) {
        props.form.setFormItemsValue(this.formId, {
            srcbillno: {
                display: null,
                value: null
            }
        });

    }
    if (value.value == '0') {
        item.itemtype = 'refer';
        item.refName = "放款参照";
        item.refcode = "cdmc/refer/financepay/financepayGrid4InnerRef/index.js",
            item.queryCondition = () => {
                let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value;
                return {
                    pk_org: pk_org,
                    GridRefActionExt:'nccloud.web.icdmc.icdmc.financepay.filter.SagasDefaultFilterForNCC'
                };
            }
    } else if (value.value == '1') {
        item.itemtype = 'refer';
        item.refName = "债券发行参照";
        item.refcode = "bond/refer/bondregister/RegisterGrid4InnerRef/index.js",
            item.queryCondition = () => {
                let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value;
                return {
                    pk_org: pk_org,
                    GridRefActionExt:'nccloud.web.icdmc.icdmc.financepay.filter.SagasDefaultFilterForNCC'
                };
            }


    }
    props.renderItem('form', this.formId, 'srcbillno', null);
    props.meta.setMeta(meta);
};
/**
 * 来源单据号编辑后事件
 * 设置金额
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 *  @param {*} value 交易对象值
 */
export const srcBillNoAfterEvent = function (props, moduleId, value, i) {

    if (value.value) {
        //放款字段的可编辑性
        // props.resMetaAfterPkorgEdit();
        //设置利率不可编辑性
        // props.form.setFormItemsDisabled(this.formId, {  
        //     pk_rate: true,
        //     floatscale: true,
        //     floatpoint: true,
        //     adjratemethod: true,
        //     effecttype: true,
        //     adjbegdate: true,
        //     adjperiodunit: true,
        //     lastadjdate: true,
        //     advancefloatscale: true,
        //     advancefloatpoint: true,
        //     extfloatpoint:true,
        //     extfloatscale:true,
        //     fixrate:true,
        //     pk_currtype:true,
        //     payplan:true

        // });
        //设置放款日期 结束日期、 结息日、 还款方式可以编辑
        // props.form.setFormItemsDisabled(this.formId, {
        //     srcbillno:false,
        //     contenddate:false,
        //     loandate:false
        // });
        //设置放款日期 结束日期、 结息日、 还款方式可以编辑
        props.form.setFormItemsDisabled(this.formId, {
            srcbillno: false
        });

    }
};


/**
 * 来源单据号编辑后事件
 * 设置金额
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 *  @param {*} value 交易对象值
 */
export const debittoLoanAfterEvent = function (props, moduleId, value, i) {
    let debittoloan = props.form.getFormItemsValue(this.formId, "debittoloan"); //放款金额

    let BSource = props.form.getFormItemsValue(this.formId, "borrowmnysource"); //放款金额
   

    if (debittoloan && debittoloan.value) {
     
     
        //判断借转贷 来源单据号
        if (!BSource || !BSource.value) {

            props.form.setFormItemsDisabled(this.formId, {
                srcbillno: true,
            });
        } else {
    
            props.form.setFormItemsDisabled(this.formId, {
                srcbillno: false,
            });
        }

        props.form.setFormItemsDisabled(this.formId, {
            borrowmnysource: false
        });
        //借转贷必输项
        props.form.setFormItemsRequired(this.formId, {
            srcbillno: true,
            borrowmnysource: true
        });
        props.form.setFormItemsDisabled(this.formId, {
            pk_rate: true,
            floatscale: true,
            floatpoint: true,
            adjratemethod: true,
            effecttype: true,
            adjbegdate: true,
            adjperiodunit: true,
            lastadjdate: true,
            advancefloatscale: true,
            advancefloatpoint: true,
            extfloatpoint: true,
            extfloatscale: true,
            fixrate: true,
            prepayinterest:true,
            pk_currtype:true,
            debitunitacctid:true,
            pk_project:true,
            pk_planitem:true,
            isfixhrate:true,
            accountinter:true,
            ispayusecc:true
            
        });
        props.form.setFormItemsDisabled('header_rate', {
            pk_settledate:false,
            pk_returnmethod:false    
        });

    } else {
        props.form.setFormItemsDisabled(this.formId, {
            srcbillno: true,
            borrowmnysource: true
        });
        props.form.setFormItemsValue(this.formId, {
            srcbillno: {
                display: null,
                value: null
            },
            borrowmnysource: {
                display: null,
                value: null
            }
        });
        //非借转贷必输项
        props.form.setFormItemsRequired(this.formId, {
            srcbillno: false,
            borrowmnysource: false
        });
        props.form.setFormItemsDisabled(this.formId, {
            pk_rate: false,
            floatscale: false,
            floatpoint: false,
            adjratemethod: false,
            effecttype: false,
            adjbegdate: false,
            adjperiodunit: false,
            lastadjdate: false,
            advancefloatscale: false,
            advancefloatpoint: false,
            extfloatpoint: false,
            extfloatscale: false,
            fixrate: false

        });

    }
    // debittoLoanRequired(props, moduleId, value,false)
};

/**
 * 单据修改借转贷字段的编辑性控制
 * 
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 *  @param {*} value 交易对象值
 */
export const editDebittoLoan = function (props) {
    //获取是否为借助贷单据  
    let debittoloan = props.form.getFormItemsValue(this.formId, "debittoloan");

    if (debittoloan && debittoloan.value) {
        // props.form.setFormItemsDisabled(this.formId, {
        //     srcbillno: false
        // });
        props.form.setFormItemsDisabled(this.formId, {
            borrowmnysource: false
        });
        //借转贷必输项
        props.form.setFormItemsRequired(this.formId, {
            srcbillno: true,
            borrowmnysource: true
        });
        props.form.setFormItemsDisabled(this.formId, {
            autogenrepay: true,
            accountinter: true,
            
        });

    } else {
        props.form.setFormItemsDisabled(this.formId, {
            srcbillno: true,
            borrowmnysource: true,

        });
        props.form.setFormItemsDisabled(this.formId, {
            autogenrepay: false,
            accountinter: false,
            
        });
        props.form.setFormItemsValue(this.formId, {
            srcbillno: {
                display: null,
                value: null
            },
            borrowmnysource: {
                display: null,
                value: null
            }
        });
        //非借转贷必输项
        props.form.setFormItemsRequired(this.formId, {
            srcbillno: false,
            borrowmnysource: false
        });

    }
    // debittoLoanRequired(props, moduleId, value,false)
};


/**
 * 设置字段的可编辑性
 * 设置金额
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 *  @param {*} value 交易对象值
 */
export const debittoLoanRequired = function (props, moduleId, value, flag) {

    if (value.value) {


        props.form.setFormItemsRequired(this.formId, {
            contractid: flag
        });
    }
};

/**
 * 借款来源的翻译
 * 
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 *  @param {*} value 交易对象值
 */
export const debittoLoanTranslet = function (props) {
    //借款来源
    let borrowmnysource = props.form.getFormItemsValue(this.formId, "borrowmnysource");
    if (borrowmnysource && borrowmnysource.value) {
        let val = borrowmnysource.value
        switch (val) {
            case '0':
                this.props.form.setFormItemsValue(this.formId, {
                    borrowmnysource: {
                        value: val,
                        display: '贷款放款'

                    }
                });
                break;
            case '1':
                this.props.form.setFormItemsValue(this.formId, {
                    borrowmnysource: {
                        value: val,
                        display: '契约发行'
                    }
                });
                break;
        }
    }
};







/**
 * 借转贷设置字段的可编辑性
 * @param {*} props  页面内置对象
 */
export const setDebittoLoanDisable = function (props, moduleId, value) {
    props.initMetaByPkorg();
    props.form.setFormItemsDisabled(this.formId, {
        pk_org: true
    });
    props.form.setFormItemsDisabled(this.formId, {
        pk_settledate: false,
        pk_returnmethod: false,
        pk_rate: false,
        floatscale: false,
        floatpoint: false,
        adjratemethod: false,
        effecttype: false,
        adjbegdate: false,
        adjperiodunit: false,
        lastadjdate: false,
        beginrefdate: false,
        advancefloatscale: false,
        advancefloatpoint: false,
        amountuse: false
    });
    // 可变更子表：授信 还款计划
    props.cardTable.setColEditableByKey(
        "authinfo",
        ["ccprotocolid", "creditbankid", "cctypeid", "cccurrtypeid", "ccmny"],
        false
    );
    props.cardTable.setColEditableByKey(
        "repayplan",
        ["planrepaycode", "planrepaydate", "premny", "preinterest"],
        false
    );
    // 设置结息日
    let repaytype = props.form.getFormItemsValue(this.formId, "repaytype");
    if (repaytype.value && repaytype.value == "once") {
        this.props.form.setFormItemsRequired(this.formId, {
            pk_settledate: false
        });
        this.props.form.setFormItemsDisabled(this.formId, {
            pk_settledate: true
        });
    } else {
        this.props.form.setFormItemsRequired(this.formId, {
            pk_settledate: true
        });
        this.props.form.setFormItemsDisabled(this.formId, {
            pk_settledate: false
        });
    }
    // 设置还款方式不可修改
    this.props.form.setFormItemsDisabled(this.formId, {
        pk_returnmethod: true
    });
    //禁用表格复选框
    props.cardTable.setAllCheckboxAble(this.tabCode, true);
    // 还款计划编辑性
    let data = props.cardTable.getTabVisibleRows("repayplan");
    data.map(item => {
        if (item.values.isrepay && item.values.isrepay.value) {
            this.props.cardTable.setEditableByRowId(
                "repayplan",
                item.rowid,
                ["planrepaycode", "planrepaydate", "premny", "preinterest"],
                false
            );
        }
    });
}
/*36oDFpNgu0e6f3pxiBjRiwWD+AO7rMu7WCwiAX/CJ2aUjy4xiG0lMcvvsC3lmoiw*/