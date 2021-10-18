/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 贴现申请拉单卡片页
 created by： wusib 2019-10-25
 update: 
*/
import { base, createPage, high } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseCard from "../../../public/components/BaseCard";
import { initForm } from "../../../public/container/page";
import { REF21_CONST } from "../ref21/const";
import {
    API_URL, billtype, CARD, DATA_SOURCE, disableReason, DISABLE_BTN_PARAM, module_id, 
    nodekey, TRAN_CARD_PAGE_INFO
} from "../cons/constant.js";
import {
    afterEvent, beforeEvent, buttonVisible, initTemplate, initTemplate1, initTemplate2
} from "./events";

function cardDidMount() {
    let status = this.props.getUrlParam("status");
    initForm.call(this, status, buttonVisible.bind(this));
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
        let multiLang = this.props.MutiInit.getIntl(module_id);
        return (
            <BaseCard
                constant={{
                    pageId: TRAN_CARD_PAGE_INFO.PAGE_CODE,
                    moduleId: module_id,
                    formId: TRAN_CARD_PAGE_INFO.HEAD_CODE,
                    baseinfo: CARD.baseinfo,
                    primaryId: CARD.primary_id, //主键ID
                    billNo: CARD.billno, //单据编号
                    
                    nodekey, //打印用
                    API_URL, //接口地址
                    billtype, //单据类型，联查审批详情需要
                    disabledBtnsParam: DISABLE_BTN_PARAM, //根据选中数据判断对应按钮禁用状态
                    // headDisabledItems,						//表头禁用字段
                    pknotetype_bank: CARD.pknotetype_bank, // 银行承兑汇票
                    pknotetype_busi: CARD.pknotetype_busi, // 商业承兑汇票
                    pknotetype_ebank: CARD.pknotetype_ebank, // 电子银行承兑汇票
                    pknotetype_ebusi: CARD.pknotetype_ebusi, // 电子商业承兑汇票
                    cafalg: "false",
                    disableReason: disableReason,
                    billInfo: CARD.form_tbillinfo,
                    modulecode: "3618",
                    // 转单
                    dataSource: REF21_CONST.Ref21DataSource, //缓存key
                    ldataSource: DATA_SOURCE, //应用原本的缓存key
                    searchId: REF21_CONST.searchId,
                    transferQueryUrl: API_URL.transtocard, //转单卡片接口地址
                    transferCard: true, //是否是转单卡片页面
                    TRAN_LIST_PAGE_URL: "/ref21",
                    transferListId: TRAN_CARD_PAGE_INFO.LEFT_CODE, //转单列表id
                    srcbillpk:REF21_CONST.pk_head//参照数据的主键pk_register
                }}
                _initTemplate={this.getInitTemplate.call(this)}
                _buttonVisible={buttonVisible}
                _afterEvent={afterEvent}
                _beforeEvent={beforeEvent}
                pageTitle={multiLang && multiLang.get("36200DA-000003")} //节点标题
                headBtnArea={CARD.head_btn_code} //表头按钮区域
                formParams={{
                    expandArr: [
                        CARD.form_id,
                        CARD.form_billinfo,
                    ]
                }} //表头form参数
                linkItems={["approveDetail", "ntb"]} //联查显示的组件
                cardDidMount={cardDidMount} //componentDidMount
                {...this.props}
            />
        );
    }
}

Card = createPage({
    billinfo: {
        billtype: "card",
        pagecode: TRAN_CARD_PAGE_INFO.PAGE_CODE,
        headcode: TRAN_CARD_PAGE_INFO.HEAD_CODE
    },
    mutiLangCode: module_id
})(Card);
export default Card;
// ReactDOM.render(<Card />, document.querySelector('#app'));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/