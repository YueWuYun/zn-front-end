/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 额度管理卡片页
 created by：lifft 2019-03-25
 update: 
*/
import { base, createPage, high } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseCard from "../../../public/components/BaseCard";
import { initForm } from "../../../public/container/page";
import {
    API_URL,
    app_code,
    billtype,
    CARD,
    DATA_SOURCE,
    DISABLE_BTN_PARAM,
    module_id,
    nodekey,
    nodekeyList
} from "../cons/constant.js";
import {
    afterEvent,
    buttonVisible,
    initTemplate,
    initTemplate1,
    initTemplate2
} from "./events";

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
            {
                //币种为人民币时禁用组织本币汇率
                key: "olcrate",
                rules: () => {
                    let pk_currtype = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "pk_currtype"
                    );
                    return (
                        pk_currtype &&
                        pk_currtype.value === "1002Z0100000000001K1"
                    );
                }
            }
        ];
        return (
            <BaseCard
                constant={{
                    appcode: app_code,
                    pageId: CARD.page_id,
                    moduleId: module_id,
                    formId: CARD.form_id,
                    primaryId: CARD.primary_id, //主键ID
                    billNo: CARD.billno, //单据编号
                    dataSource: DATA_SOURCE, //缓存key
                    nodekey, //打印用
                    nodekeyList, //打印清单用
                    API_URL, //接口地址
                    billtype, //单据类型，联查审批详情需要
                    disabledBtnsParam: DISABLE_BTN_PARAM, //根据选中数据判断对应按钮禁用状态
                    headDisabledItems, //表头禁用字段
                    pknotetype_bank: CARD.pknotetype_bank, // 银行承兑汇票
                    pknotetype_busi: CARD.pknotetype_busi, // 商业承兑汇票
                    pknotetype_ebank: CARD.pknotetype_ebank, // 电子银行承兑汇票
                    pknotetype_ebusi: CARD.pknotetype_ebusi, // 电子商业承兑汇票
                    cafalg: "false",
                    returnReason: "sendbacknote"
                }}
                _initTemplate={this.getInitTemplate.call(this)}
                _buttonVisible={buttonVisible}
                _afterEvent={afterEvent}
                pageTitle={ this.props.MutiInit.getIntl("1880000025") && this.props.MutiInit.getIntl("1880000025").get('1880000025-000000')}                   //页面标题/* 国际化处理： 单位下拨可用额度*/
                headBtnArea={CARD.head_btn_code} //表头按钮区域
                formParams={{
                    expandArr: ["form_credit"]
                }} //表头form参数
                linkItems={["approveDetail", "creditBalance"]} //联查显示的组件
                cardDidMount={cardDidMount} //componentDidMount
                {...this.props}
            />
        );
    }
}

Card = createPage({
    billinfo: {
        billtype: "form",
        pagecode: CARD.page_id,
        headcode: CARD.form_id
    },
    mutiLangCode: "1880000025"
})(Card);
export default Card;
// ReactDOM.render(<Card />, document.querySelector('#app'));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/