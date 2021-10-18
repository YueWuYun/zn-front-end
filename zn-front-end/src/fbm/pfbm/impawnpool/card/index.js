/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseCard from "../../../public/components/BaseCard";
import { initForm } from "../../../public/container/page";
import { API_URL, app_code, billtype, CARD,LIST, DATA_SOURCE, disableReason, DISABLE_BTN_PARAM, impawnbackAreaCode, module_id, nodekey, tableName } from "../cons/constant.js";
import { afterEvent, buttonVisible, initTemplate, initTemplate1, initTemplate2 } from "./events";

//componentDidMount
function cardDidMount() {
    let status = this.props.getUrlParam("status");
    initForm.call(this, status);
}

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

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
            //币种为人民币时禁用组织本币汇率
            {
                key: "olcbrate",
                rules: () => {
                    let olcrate = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "olcbrate"
                    );
                    return olcrate && Number(olcrate.value) === 1;
                }
            },
            {
                key: "glcbrate",
                rules: () => {
                    let glcrate = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "glcbrate"
                    );
                    return glcrate && Number(glcrate.value) === 1;
                }
            },
            {
                key: "gllcbrate",
                rules: () => {
                    let gllcrate = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "gllcbrate"
                    );
                    return gllcrate && Number(gllcrate.value) === 1;
                }
            }
        ];
        return (
            <BaseCard
                constant={{
                    appcode: app_code,
                    pageId: CARD.page_id,
                    listPageCode: LIST.page_id,
                    moduleId: module_id,
                    formId: CARD.form_id,
                    baseinfo: CARD.baseinfo,
                    primaryId: CARD.primary_id, //主键ID
                    billNo: CARD.billno, //单据编号
                    dataSource: DATA_SOURCE, //缓存key
                    nodekey, //打印用
                    API_URL, //接口地址
                    billtype, //单据类型，联查审批详情需要
                    disabledBtnsParam: DISABLE_BTN_PARAM, //根据选中数据判断对应按钮禁用状态
                    headDisabledItems,						//表头禁用字段
                    encryptVOClassName:
                        "nccloud.itf.pfbm.impawnpool.ImpawnpoolEncryptVO4NCC",
                    cafalg: "false",
                    disableReason: disableReason,
                    modulecode: "3620",
                    impawnbackAreaCode: impawnbackAreaCode,
                    impawnbackdate: "impawnbackdate",
                    impawnbackpersonid: "impawnbackpersonid",
                    tableName
                }}
                _initTemplate={this.getInitTemplate.call(this)}
                _buttonVisible={buttonVisible}
                _afterEvent={afterEvent}
                pageTitle={
                    this.props.MutiInit.getIntl("36200BI") &&
                    this.props.MutiInit.getIntl("36200BI").get("36200BI-000002")
                } //节点标题
                headBtnArea={CARD.head_btn_code} //表头按钮区域
                formParams={{
                    expandArr: [CARD.ebank,CARD.withdrawstatus]
                }} //表头form参数
                linkItems={["approveDetail"]} //联查显示的组件
                cardDidMount={cardDidMount} //componentDidMount
                {...this.props}
            />
        );
    }
}

Card = createPage({
    billinfo: {
        billtype: "extcard",
        pagecode: CARD.page_id,
        headcode: CARD.form_id
    },
    mutiLangCode: module_id
})(Card);
export default Card;
// ReactDOM.render(<Card />, document.querySelector('#app'));
/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/