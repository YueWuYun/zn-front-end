/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 池内贴现拉单卡片页
 created by：lifft 2019-03-25
 update: 
*/
import { base, createPage, high } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseCard from "../../../public/components/BaseCard";
import { initForm } from "../../../public/container/page";
import {
    API_URL,
    billtype,
    CARD,
    TRAN_CARD_PAGE_INFO,
    LIST,
    DATA_SOURCE,
    disableReason,
    DISABLE_BTN_PARAM,
    fullAggClassName,
    module_id,
    nodekey
} from "../cons/constant.js";
import {
    afterEvent,
    beforeEvent,
    buttonVisible,
    initTemplate,
    initTemplate1,
    initTemplate2
} from "./events";
import { REF21_CONST } from "../ref21/const";
//componentDidMount
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
        // let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
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
        // const headDisabledItems = [{
        // 	//币种为人民币时禁用组织本币汇率
        // 	key: 'olcrate',
        // 	rules: () => {
        // 		let pk_currtype = this.props.form.getFormItemsValue(CARD.form_id, 'pk_currtype');
        // 		return pk_currtype && pk_currtype.value === '1002Z0100000000001K1';
        // 	}
        // }];
        let multiLang = this.props.MutiInit.getIntl(module_id); //this.moduleId
        return (
            <BaseCard
                constant={{
                    // appcode: app_code,
                    pageId: TRAN_CARD_PAGE_INFO.PAGE_CODE,
                    listPageCode: LIST.page_id,
                    moduleId: module_id,
                    formId: TRAN_CARD_PAGE_INFO.HEAD_CODE,
                    primaryId: CARD.primary_id, //主键ID
                    billNo: CARD.billno, //单据编号
                    dataSource: DATA_SOURCE, //缓存key
                    nodekey, //打印用
                    API_URL, //接口地址
                    billtype, //单据类型，联查审批详情需要
                    disabledBtnsParam: DISABLE_BTN_PARAM, //根据选中数据判断对应按钮禁用状态
                    // headDisabledItems,						//表头禁用字段
                    pknotetype_bank: CARD.pknotetype_bank, // 银行承兑汇票
                    pknotetype_busi: CARD.pknotetype_busi, // 商业承兑汇票
                    pknotetype_ebank: CARD.pknotetype_ebank, // 电子银行承兑汇票
                    pknotetype_ebusi: CARD.pknotetype_ebusi, // 电子商业承兑汇票
                    cafalg: "true",
                    encryptVOClassName:
                        "nccloud.itf.pfbm.discount.vo.DiscountInPoolEncryptVO4NCC",
                    fullAggClassName: fullAggClassName, // aggvo全路径名
                    disableReason: disableReason,
                    billInfo: CARD.form_billinfo,
                    modulecode: "3620",

                    // 转单
                    ldataSource: DATA_SOURCE, //应用原本的缓存key
                    dataSource: REF21_CONST.Ref21DataSource, //缓存key
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
                pageTitle={multiLang && multiLang.get("36200DT-000003")} //节点标题
                headBtnArea={CARD.head_btn_code} //表头按钮区域
                formParams={{
                    expandArr: [
                        CARD.form_id,
                        CARD.form_clearinfo,
                        // CARD.form_billinfo,
                        CARD.form_ticket
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
        billtype: "extcard",
        pagecode: TRAN_CARD_PAGE_INFO.PAGE_CODE,
        headcode: TRAN_CARD_PAGE_INFO.HEAD_CODE
    },
    mutiLangCode: module_id
})(Card);
export default Card;
// ReactDOM.render(<Card />, document.querySelector('#app'));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/