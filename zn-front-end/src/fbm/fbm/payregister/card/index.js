/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 期初应付票据卡片页
 created by：liangyen 2018-09-19
 update: 2018-10-10
*/
import { ajax, createPage, toast } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseCard from "../../../public/components/BaseCard";
import { initForm, queryCard } from "../../../public/container/page";
import {
    API_URL,
    app_code,
    billtype,
    CARD,
    LIST,
    COMMON,
    DATA_SOURCE,
    DISABLE_BTN_PARAM,
    modelname,
    module_id,
    nodekey,
    tableName
} from "../cons/constant.js";
import {
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
    let id = this.props.getUrlParam("id");
    let status = this.props.getUrlParam("status");
    if (status === "add") {
        initForm.call(this, status);
    } else if (id) {
        queryCard.call(this, data =>
            getBeforeEventFbmbilltype.call(this, data)          
        );
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

function getBeforeEventFbmbilltype(data) {
    data =
        this.props.form.getFormItemsValue(this.formId, "fbmbilltype") &&
        this.props.form.getFormItemsValue(this.formId, "fbmbilltype").value;

    ajax({
        url: "/nccloud/fbm/common/getFbmbilltypeByPk.do",
        async: false,
        data,
        success: res => {
            if (res.data === "true") {
                //bank 隐藏  acceptunit
                //承兑人
                this.props.form.setFormItemsVisible(this.formId, {
                    acceptunit: false
                });
                this.props.form.setFormItemsVisible(this.formId, {
                    pk_acceptor: true
                });
                //承兑人开户行名
                this.props.form.setFormItemsVisible(this.formId, {
                    signagrbank: true
                });
                this.props.form.setFormItemsVisible(this.formId, {
                    pk_acceptorbank: false
                });
            } else {
                // buis 隐藏 pk_acceptor
                this.props.form.setFormItemsVisible(this.formId, {
                    pk_acceptor: false
                });
                this.props.form.setFormItemsVisible(this.formId, {
                    acceptunit: true
                });
                //承兑人开户行名
                this.props.form.setFormItemsVisible(this.formId, {
                    signagrbank: false
                });
                this.props.form.setFormItemsVisible(this.formId, {
                    pk_acceptorbank: true
                });
            }   
        },
        error: res => {
            toast({ color: "danger", content: res.message });
            reject(res);
        }
    });
}
//保存前校验
function saveBefore(saveAction,data) {
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
                            this.props.MutiInit.getIntl("36180BPB") &&
                            this.props.MutiInit.getIntl("36180BPB").get(
                                "36180BPB-000005"
                            )
                    }); /* 国际化处理： 担保信息的占用担保金额和担保比例不能为空*/
                    return;
                }
                if (guaranteeamountitem && guaranteeamountitem.value <= 0) {
                    toast({
                        color: "warning",
                        content:
                            this.props.MutiInit.getIntl("36180BPB") &&
                            this.props.MutiInit.getIntl("36180BPB").get(
                                "36180BPB-000006"
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
                            this.props.MutiInit.getIntl("36180BPB") &&
                            this.props.MutiInit.getIntl("36180BPB").get(
                                "36180BPB-000005"
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
                            this.props.MutiInit.getIntl("36180BPB") &&
                            this.props.MutiInit.getIntl("36180BPB").get(
                                "36180BPB-000019"
                            )
                    }); /* 国际化处理： 担保合同不能重复*/
                }
            }
        } else {
            return;
        }
    } else {
        if (impawnmode === "BILLPOOL") {
            let occucommoney = this.props.form.getFormItemsValue(
                this.formId,
                "occucommoney"
            ).value; 
            let occusharemoney = this.props.form.getFormItemsValue(
                this.formId,
                "occusharemoney"
            ).value; 
            if (Number(occucommoney) + Number(occusharemoney) <= Number(0)) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36180BPB") && this.props.MutiInit.getIntl("36180BPB").get('36180BPB-000017') });/* 国际化处理： 占用单位票据池额度和占用共享票据池额度不能都为0*/
                return;
            }
        }
    }
    saveAction(data);
}

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {},
            inlt: null
        };
    }

    componentWillMount() { }

    //根据场景加载相应initTemplate
    getInitTemplate = () => {
        let scene = this.props.getUrlParam("scene");
        if (scene === "linksce") {
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
            // {

            // 	key: 'olcsecuritymoney',
            // 	rules: () => {
            // 		let issecurity = this.props.form.getFormItemsValue(CARD.form_id, 'issecurity');
            // 		return issecurity && issecurity.value === false;
            // 	}
            // },
            //担保方式为票据池的时候，票据池的数据可以编辑
            {
                key: "initpoolflag",
                rules: () => {
                    let result = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "impawnmode"
                    ).value;
                    let initpoolflag = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "initpoolflag"
                    ).value;
                    return (
                        result && result.value !== "BILLPOOL" && !initpoolflag
                    );
                }
            },
            {
                key: "occucommoney",
                rules: () => {
                    let result = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "impawnmode"
                    ).value;
                    let initpoolflag = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "initpoolflag"
                    ).value;
                    return (
                        result && result.value !== "BILLPOOL" && !initpoolflag
                    );
                }
            },
            // {
            // 	key: 'olcoccucommoney',
            // 	rules: () => {

            // 		let result = this.props.form.getFormItemsValue(CARD.form_id, 'impawnmode').value;
            // 		let initpoolflag =  this.props.form.getFormItemsValue(CARD.form_id, 'initpoolflag').value;
            // 		return result && result.value !== 'BILLPOOL' && !initpoolflag;
            // 	}
            // },
            {
                key: "occusharemoney",
                rules: () => {
                    let result = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "impawnmode"
                    ).value;
                    let initpoolflag = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "initpoolflag"
                    ).value;
                    return (
                        result && result.value !== "BILLPOOL" && !initpoolflag
                    );
                }
            },
            //  {
            // 	key: 'olcoccusharemoney',
            // 	rules: () => {
            // 		let initpoolflag =  this.props.form.getFormItemsValue(CARD.form_id, 'initpoolflag').value;
            // 		let result = this.props.form.getFormItemsValue(CARD.form_id, 'impawnmode').value;
            // 		return result && result.value !== 'BILLPOOL' && !initpoolflag;
            // 	}
            // },
            {
                //币种为人民币时禁用组织本币汇率
                key: "olcrate",
                rules: () => {
                    let olcrate = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "olcrate"
                    );
                    return olcrate && olcrate.value === "1.00";
                }
            },
            {
                key: "glcrate",
                rules: () => {
                    let olcrate = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "glcrate"
                    );
                    return olcrate && olcrate.value === "1.00";
                }
            },
            {
                key: "gllcrate",
                rules: () => {
                    let olcrate = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "gllcrate"
                    );
                    return olcrate && olcrate.value === "1.00";
                }
            }
        ];


        // const headItemsVisible = [
        // 	{
        // 		key: 'pk_acceptor',
        // 		rules: () => {

        // 			return false;
        // 		}
        // 	},{

        // 		key: 'acceptunit',
        // 		rules: () => {

        // 			return true;
        // 		}
        // 	},{

        // 		key: 'signagrbank',
        // 		rules: () => {

        // 			return false;
        // 		}
        //     },
        //     {

        // 		key: 'pk_acceptorbank',
        // 		rules: () => {

        // 			return true;
        // 		}
        // 	},
        // ];
        // const headItemsVisible = [//承兑人和承兑人开户行名称  按照 票据类型显示和隐藏
        // 	{
        // 		key: 'pk_acceptor',//银承显示
        // 		rules: () => {
        // 			let fbmbilltype =  this.props.form.getFormItemsValue(CARD.form_id, 'fbmbilltype').value;

        // 			return fbmbilltype && fbmbilltype === 'FBMTZ6E0000000000001' ||  fbmbilltype === 'FBMTZ6E0000000000003';
        // 		}
        // 	}, {
        // 		key: 'acceptunit',//商承显示
        // 		rules: () => {
        // 			let fbmbilltype =  this.props.form.getFormItemsValue(CARD.form_id, 'fbmbilltype').value;

        // 			return fbmbilltype && fbmbilltype === 'FBMTZ6E0000000000002' ||  fbmbilltype === 'FBMTZ6E0000000000004';
        // 		}
        // 	}, {
        // 		key: 'signagrbank',//银承显示
        // 		rules: () => {
        // 			let fbmbilltype =  this.props.form.getFormItemsValue(CARD.form_id, 'fbmbilltype').value;

        // 			return fbmbilltype && fbmbilltype === 'FBMTZ6E0000000000001' ||  fbmbilltype === 'FBMTZ6E0000000000003';
        // 		}
        // 	}, {
        // 		key: 'pk_acceptorbank',//商承显示
        // 		rules: () => {
        // 			let fbmbilltype =  this.props.form.getFormItemsValue(CARD.form_id, 'fbmbilltype').value;

        // 			return fbmbilltype && fbmbilltype === 'FBMTZ6E0000000000002' ||  fbmbilltype === 'FBMTZ6E0000000000004';
        // 		}
        // 	}];
        return (
            <BaseCard
                json={this.state.json}
                inlt={this.state.inlt}
                constant={{
                    appcode: app_code,
                    pageId: CARD.page_id,
                    listPageCode: LIST.page_id,
                    moduleId: module_id,
                    formId: CARD.form_id,
                    primaryId: CARD.primary_id, //主键ID
                    billNo: CARD.billno, //单据编号
                    dataSource: DATA_SOURCE, //缓存key
                    tabCode: CARD.tab_code, //tab区域code编码
                    tabOrder: CARD.tab_order, //tab排序
                    tabId: CARD.tab_id, //tab主键
                    modelname, //模块名称
                    nodekey, //打印用
                    API_URL, //接口地址
                    billtype, //单据类型，联查审批详情需要
                    fields: COMMON.fields, //字段名
                    tableTypeObj: {
                        guarantee: "cardTable"
                    },
                    disabledBtnsParam: DISABLE_BTN_PARAM, //根据选中数据判断对应按钮禁用状态
                    headDisabledItems, //表头禁用字段
                    // headItemsVisible,
                    cafalg: "false",
                    tableName,
                    saveOneCommit:true,
                    saveCommitFlag:true
                }}
                _initTemplate={this.getInitTemplate.call(this)}
                _buttonVisible={buttonVisible}
                _afterEvent={afterEvent}
                _beforeEvent={beforeEvent}
                _afterTableEvent={afterTableEvent}
                _beforeTableEvent={beforeTableEvent}
                _bodyButtonClick={bodyButtonClick}
                _bodySelectedEvent={bodySelectedEvent}
                _bodySelectedAllEvent={bodySelectedAllEvent}
                pageTitle={
                    this.props.MutiInit.getIntl("36180BPB") &&
                    this.props.MutiInit.getIntl("36180BPB").get(
                        "36180BPB-000007"
                    )
                } //节点标题
                headBtnArea={CARD.head_btn_code} //表头按钮区域
                shoulderBtnArea={CARD.shoulder_btn_code} //表体tab区域肩部区域按钮code
                cardDidMount={cardDidMount} //componentDidMount
                linkItems={[
                    "approveDetail",
                    "bankBalance",
                    "ntb",
                    "creditBalance"
                ]} //联查显示的组件
                tabTableParams={{
                    //这个参数会覆盖BaseCard里的参数
                    hideAdd: false, //隐藏侧拉增行按钮
                    hideDel: false //隐藏侧拉删行按钮
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
    mutiLangCode: module_id
})(Card);
export default Card;
// ReactDOM.render(<Card />, document.querySelector('#app'));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/