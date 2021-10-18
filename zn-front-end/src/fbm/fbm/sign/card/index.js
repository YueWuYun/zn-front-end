/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 期初应付票据卡片页
 created by：liyaoh 2018-09-19
 update: 2018-10-10
*/
import { ajax, createPage, toast } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseCard from "../../../public/components/BaseCard";
import { initForm } from "../../../public/container/page";
import {
    API_URL,
    billtype,
    CARD,
    COMMON,
    DATA_SOURCE,
    disableReason,
    DISABLE_BTN_PARAM,
    fullAggClassName,
    modelname,
    module_id,
    nodekey,
    LIST,
    tableName
} from "../cons/constant.js";
import {
    buttonClick,
    afterEvent,
    afterTableEvent,
    beforeTableEvent,
    beforeEvent,
    bodyButtonClick,
    bodySelectedAllEvent,
    bodySelectedEvent,
    buttonVisible,
    initTemplate,
    initTemplate1,
    initTemplate2
} from "./events";

//componentDidMount
function cardDidMount() {
    let status = this.props.getUrlParam("status");
    initForm.call(this, status,
        () => {

            if (status === 'copy') {
                let fbmbillno = this.props.form.getFormItemsValue(this.formId, 'fbmbillno') && this.props.form.getFormItemsValue(this.formId, 'fbmbillno').value;

                if (fbmbillno) {
                    // 票据签发 有两个票据号码，复制的时候需要判断显示哪一个，这里加一下逻辑 
                    this.props.form.setFormItemsVisible(this.formId, {
                        fbmbillno2: true,
                        fbmbillno: false
                    });
                    this.props.form.setFormItemsRequired(this.formId, {
                        fbmbillno2: false, // 设置票据号码2非必输
                        pk_banktype: true  // 银行类别必输
                    });
                }
            }

            
        });

    let pk = this.props.getUrlParam("id");
    //代理开票申请受理跳转签发
    if (status == "add" && pk != null) {
        // 清空表单form所有数据
        this.props.form.EmptyAllFormValue(
            CARD.form_id
        );
        let data = {
            pageCode: CARD.page_id
        };
        if (pk != null) {
            data = {
                pageCode: CARD.page_id,
                pk: pk
            };
        }
        if (pk != "") {
            this.props.resMetaAfterPkorgEdit();
            this.props.form.setFormItemsValue(this.formId, {
                'applybillno': {
                    value: pk
                }
            });
            afterEvent.call(this, this.props, this.formId, 'applybillnobyaccept', { display: null, value: pk }, { value: null });
        }
    }

    //修改的时候显示
    //收款人
    this.props.form.setFormItemsVisible(this.formId, {
        hidereceiveunit: false
    });
    this.props.form.setFormItemsVisible(this.formId, {
        receiveunit: true
    });
    //收款人账户
    this.props.form.setFormItemsVisible(this.formId, {
        hidereceivebankacc: false
    });
    this.props.form.setFormItemsVisible(this.formId, {
        receivebankacc: true
    });
    //收款人银行
    this.props.form.setFormItemsVisible(this.formId, {
        hidereceivebank: false
    });
    this.props.form.setFormItemsVisible(this.formId, {
        receivebank: true
    });
    //设置必输
    this.props.form.setFormItemsRequired(this.formId, {
        receiveunit: true,
        receivebankacc: true,
        receivebank: true,
    });
}

//保存前校验
function saveBefore(saveAction) {
    const impawnmode = this.props.form.getFormItemsValue(
        this.formId,
        "impawnmode"
    ).value; //担保方式
    let currTab = this.props.cardTable.getCurTabKey();
    let guaranteeamount = this.props.cardTable.getTabColValue(
        currTab,
        "guaranteeamount"
    );
    let guaranteerate = this.props.cardTable.getTabColValue(
        currTab,
        "guaranteerate"
    );
    let pk_guarantee = this.props.cardTable.getTabColValue(
        currTab,
        "pk_guarantee"
    );

    // 占用单位票据池金额
    let occucommoney = this.props.form.getFormItemsValue(this.formId, "occucommoney") && this.props.form.getFormItemsValue(this.formId, "occucommoney").value;
    // 占用共享票据池金额
    let occusharemoney = this.props.form.getFormItemsValue(this.formId, "occusharemoney") && this.props.form.getFormItemsValue(this.formId, "occusharemoney").value;
    if (impawnmode == "BILLPOOL") { // 票据池 需要控制占用单位票据池金额+占用共享票据池额度>0
        if (Number(occusharemoney) + Number(occucommoney) <= 0) {
            toast({
                color: "warning",
                content:
                    this.props.MutiInit.getIntl("36180BS") &&
                    this.props.MutiInit.getIntl("36180BS").get(
                        "36180BS-000013"
                    )
            }); /* 国际化处理： 占用单位票据池金额与占用共享票据池额度之和应大于0*/
            return;
        }
    }
    //根据担保方式判断表体数据是否可以为空，不可以为空的话，再判断担保金额和担保比例是否为空   担保方式位信用和票据池的时候，子表非必填
    if (impawnmode !== "BILLPOOL" && impawnmode !== "CREDIT") {
        if (
            this.props.form.isCheckNow(this.formId) &&
            this.props.cardTable.checkTabRequired("guarantee")
        ) {
            for (let guaranteeamountitem of guaranteeamount) {
                if (!guaranteeamountitem || !guaranteeamountitem.value) {
                    toast({
                        color: "warning",
                        content:
                            this.props.MutiInit.getIntl("36180BS") &&
                            this.props.MutiInit.getIntl("36180BS").get(
                                "36180BS-000005"
                            )
                    }); /* 国际化处理： 担保信息的占用担保金额和担保比例不能为空*/
                    return;
                }
                if (guaranteeamountitem && guaranteeamountitem.value <= 0) {
                    toast({
                        color: "warning",
                        content:
                            this.props.MutiInit.getIntl("36180BS") &&
                            this.props.MutiInit.getIntl("36180BS").get(
                                "36180BS-000006"
                            )
                    }); /* 国际化处理： 担保信息的占用担保金额不能等于0*/
                    return;
                }
            }
            for (let guaranteerateitem of guaranteerate) {
                if (!guaranteerateitem || !guaranteerateitem.value) {
                    toast({
                        color: "warning",
                        content:
                            this.props.MutiInit.getIntl("36180BS") &&
                            this.props.MutiInit.getIntl("36180BS").get(
                                "36180BS-000005"
                            )
                    }); /* 国际化处理： 担保信息的占用担保金额和担保比例不能为空*/
                    return;
                }
            }
           
             for (let pk_guaranteeitem of pk_guarantee) {
                let num = 0;
                pk_guarantee.forEach(item => {
                    if(item.value==pk_guaranteeitem.value){
                     num+=1
                    } 
                });
                if(num > 1){
                  return  toast({
                        color: "warning",
                        content:
                            this.props.MutiInit.getIntl("36180BS") &&
                            this.props.MutiInit.getIntl("36180BS").get(
                                "36180BS-000021"
                            )
                    }); /* 国际化处理： 担保合同不能重复*/
                }
            }
        } else {
            return;
        }
    } else {
        // if (this.props.form.isCheckNow(this.formId)  && !this.props.cardTable.checkTabRequired('guarantee')) {
        // }
    }
    saveAction();
}

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {},
            inlt: null
        };
    }

    componentWillMount() {
        let callback = (json, status, inlt) => {
            // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
            }
        };
        //this.props.MultiInit.getMultiLang({ moduleId: [module_id, '36650PUB'], domainName: 'bond', callback });

    }
    //开票申请受理快捷业务跳转
    componentDidMount() {
        // let status = this.props.getUrlParam("status");
        // let pk = this.props.getUrlParam("id");
        // if (status == "add" && pk != null) {
        //     // 清空表单form所有数据
        //     this.props.form.EmptyAllFormValue(
        //         CARD.form_id
        //     );
        //     let data = {
        //       pageCode: CARD.page_id
        //     };
        //     if (pk != null) {
        //       data = {
        //         pageCode: CARD.page_id,
        //         pk: pk
        //       };
        //     }
        //     ajax({
        //       url: API_URL.init,
        //       data: data,
        //       success: res => {
        //         if (res.data) {
        //           if (res.data.head) {
        //             this.props.form.setAllFormValue({
        //               [CARD.form_id]: res.data.head[CARD.form_id]
        //             });
        //           }
        //           let pk_org = this.props.form.getFormItemsValue( CARD.form_id, "pk_org").value;
        //           let isagent = this.props.form.getFormItemsValue( CARD.form_id, "isagent").value;
        //           let applybillno = this.props.form.getFormItemsValue( CARD.form_id, "applybillno").value;
        //           let pk_org_d = this.props.form.getFormItemsValue( CARD.form_id, "pk_org").display;
        //           let isagent_d = this.props.form.getFormItemsValue( CARD.form_id, "isagent").display;
        //           let applybillno_d = this.props.form.getFormItemsValue( CARD.form_id, "applybillno").display;
        //           if (pk_org != "") {
        //             this.props.resMetaAfterPkorgEdit();
        //             afterEvent.call(this, this.props, this.formId, 'pk_org', { display: pk_org_d, value: pk_org }, { value: null });
        //           //  afterEvent.call(this, this.props, this.formId, 'isagent', { display: isagent_d, value: isagent }, { value: null });
        //            // afterEvent.call(this, this.props, this.formId, 'applybillno', { display: applybillno_d, value: applybillno }, { value: null });

        //           }

        //         } else {
        //           this.props.form.setAllFormValue({
        //             [CARD.form_id]: { rows: [] }
        //           });
        //         }
        //         buttonVisible.call(this, this.props);
        //       }
        //     });
        //   }
    }

    //根据场景加载相应initTemplate
    getInitTemplate = () => {
        let scene = this.props.getUrlParam("scene");
        if (scene === "linksce" || scene === "fip") {
            //联查场景
            return initTemplate1;
        } else if (scene === "approvesce") {
            //审批详情场景
            return initTemplate2;
        } else {
            return initTemplate;
        }
    };

    render() {
        //表头禁用字段
        const headDisabledItems = [
            //表头禁用字段
            //当保证金勾选时，保证金其他可以编辑
            {
                key: "securityaccount",
                rules: () => {
                    let issecurity = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "issecurity"
                    );
                    return issecurity && issecurity.value === false;
                }
            },
            {
                key: "securityrate",
                rules: () => {
                    let issecurity = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "issecurity"
                    );
                    return issecurity && issecurity.value === false;
                }
            },
            {
                key: "securitymoney",
                rules: () => {
                    let issecurity = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "issecurity"
                    );
                    return issecurity && issecurity.value === false;
                }
            },
            {
                key: "olcsecuritymoney",
                rules: () => {
                    let issecurity = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "issecurity"
                    );
                    return issecurity && issecurity.value === false;
                }
            },
            //担保方式为票据池的时候，票据池的数据可以编辑

            {
                key: "initpoolflag",
                rules: () => {
                    let result = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "impawnmode"
                    ).value;
                    return result && result.value == "BILLPOOL";
                }
            },
            // 使用下拨额度 downquotaflag
            {
                key: "downquotaflag",
                rules: () => {
                    let result = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "impawnmode"
                    ).value;
                    return result && result.value == "BILLPOOL";
                }
            },
            {
                key: "occucommoney",
                rules: () => {
                    let result = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "impawnmode"
                    ).value;
                    return result && result.value == "BILLPOOL";
                }
            },
            {
                key: "occusharemoney",
                rules: () => {
                    let result = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "impawnmode"
                    ).value;
                    return result && result.value == "BILLPOOL";
                }
            },
            //币种为人民币时禁用组织本币汇率
            {
                key: "olcrate",
                rules: () => {
                    let olcrate = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "olcrate"
                    );
                    return olcrate && Number(olcrate.value) === 1;
                }
            },
            {
                key: "glcrate",
                rules: () => {
                    let glcrate = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "glcrate"
                    );
                    return glcrate && Number(glcrate.value) === 1;
                }
            },
            {
                key: "gllcrate",
                rules: () => {
                    let gllcrate = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "gllcrate"
                    );
                    return gllcrate && Number(gllcrate.value) === 1;
                }
            },

            {
                // 网银只有电子汇票才可以编辑
                // 返回false不可以编辑，true可以编辑
                key: "cyberbankflag",
                rules: () => {
                    let fbmbilltype =
                        this.props.form.getFormItemsValue(
                            CARD.form_id,
                            "fbmbilltype"
                        ) &&
                        this.props.form.getFormItemsValue(
                            CARD.form_id,
                            "fbmbilltype"
                        ).value;
                    if (
                        fbmbilltype === "FBMTZ6E0000000000003" ||
                        fbmbilltype === "FBMTZ6E0000000000004"
                    ) {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                // 票据号码只有非电子汇票才可以编辑
                // 返回false不可以编辑，true可以编辑
                key: "fbmbillno",
                rules: () => {
                    let fbmbilltype =
                        this.props.form.getFormItemsValue(
                            CARD.form_id,
                            "fbmbilltype"
                        ) &&
                        this.props.form.getFormItemsValue(
                            CARD.form_id,
                            "fbmbilltype"
                        ).value;
                    if (
                        fbmbilltype === "FBMTZ6E0000000000003" ||
                        fbmbilltype === "FBMTZ6E0000000000004"
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                // 承兑类型银行承兑的时候不可编辑
                // 返回false不可以编辑，true可以编辑
                key: "acceptortype",
                rules: () => {

                    let fbmbilltype =
                        this.props.form.getFormItemsValue(
                            CARD.form_id,
                            "fbmbilltype"
                        ) &&
                        this.props.form.getFormItemsValue(
                            CARD.form_id,
                            "fbmbilltype"
                        ).value;
                    if (
                        fbmbilltype === "FBMTZ6E0000000000001" ||
                        fbmbilltype === "FBMTZ6E0000000000003"
                    ) {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                key: "pk_payfundorg",
                rules: () => {
                    let issecurity = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "isagent"
                    );
                    return issecurity && issecurity.value === false;
                }
            },
            {
                key: "pk_usebillorg",
                rules: () => {
                    let issecurity = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "isagent"
                    );
                    return issecurity && issecurity.value === false;
                }
            },
            {
                key: "pk_inbalaacc",
                rules: () => {
                    let issecurity = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "isagent"
                    );
                    return issecurity && issecurity.value === false;
                }
            }
        ];
        return (
            <BaseCard
                json={this.state.json}
                inlt={this.state.inlt}
                constant={{
                    listPageCode: LIST.page_id,
                    //appcode: app_code,
                    pageId: CARD.page_id,
                    moduleId: module_id,
                    formId: CARD.form_id,
                    primaryId: CARD.primary_id, //主键ID
                    pk_insecurityacc: CARD.pk_insecurityacc, //内部保证金账户ID
                    pk_inbalaacc: CARD.pk_inbalaacc,
                    billNo: CARD.billno, //单据编号
                    dataSource: DATA_SOURCE, //缓存key
                    tabCode: CARD.tab_code, //tab区域code编码
                    tabOrder: CARD.tab_order, //tab排序
                    tabId: CARD.tab_id, //tab主键
                    nodekey, //打印用
                    modelname, //模块名称
                    API_URL, //接口地址
                    billtype, //单据类型，联查审批详情需要
                    fields: COMMON.fields, //字段名
                    tableTypeObj: {
                        guarantee: "cardTable"
                    },
                    disabledBtnsParam: DISABLE_BTN_PARAM, //根据选中数据判断对应按钮禁用状态
                    headDisabledItems, //表头禁用字段
                    fullAggClassName,
                    disableReason: disableReason,
                    modulecode: "3618",
                    tableName,
                    saveOneCommit: true,
                    saveCommitFlag: true,
                    cafalg:'true',
                    encryptVOClassName:'nccloud.itf.fbm.sign.vo.SignEncryptVO4NCC'
                }}
                _initTemplate={this.getInitTemplate.call(this)}
                _buttonVisible={buttonVisible}
                _afterEvent={afterEvent}
                _beforeTableEvent={beforeTableEvent}
                _beforeEvent={beforeEvent}
                _afterTableEvent={afterTableEvent}
                _bodyButtonClick={bodyButtonClick}
                _buttonClick={buttonClick}
                _bodySelectedEvent={bodySelectedEvent}
                _bodySelectedAllEvent={bodySelectedAllEvent}
                pageTitle={
                    this.props.MutiInit.getIntl("36180BS") &&
                    this.props.MutiInit.getIntl("36180BS").get("36180BS-000007")
                } //节点标题
                headBtnArea={CARD.head_btn_code} //表头按钮区域
                shoulderBtnArea={CARD.shoulder_btn_code} //表体tab区域肩部区域按钮code
                cardDidMount={cardDidMount} //componentDidMount
                formParams={{
                    //区域默认展开
                    expandArr: [
                        "head",
                        "issecurity",
                        "register",
                        "netinfo",
                        "accept",
                        "credit",
                        "billpoolflag"
                    ]
                }}
                linkItems={[
                    "approveDetail",
                    "bankBalance",
                    "ntb",
                    "creditBalance"
                ]} //联查显示的组件
                tabTableParams={{
                    //这个参数会覆盖BaseCard里的参数
                    hideAdd: false, //侧拉增行按钮
                    hideDel: false //侧拉删行按钮
                }}
                saveBefore={saveBefore} //保存前校验
                {...this.props}
            />
        );
    }
}

Card = createPage({
    billinfo: {
        tabs: true, //tab多子表
        billtype: "extcard",
        pagecode: CARD.page_id,
        headcode: CARD.form_id,
        bodycode: CARD.tab_order
    },
    orderOfHotKey: ["head", "rationrate"],
    mutiLangCode: "36180BS"
})(Card);
export default Card;
// ReactDOM.render(<Card />, document.querySelector('#app'));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/