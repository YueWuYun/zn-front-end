/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 期初应付票据卡片页
 created by：liyaoh 2018-09-19
 update: 2018-10-10
*/
import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseCard from "../../../public/components/BaseCard";
import { initForm } from "../../../public/container/page";
import {
    API_URL,
    app_code,
    billtype,
    CARD,
    LIST,
    COMMON,
    DATA_SOURCE,
    disableReason,
    DISABLE_BTN_PARAM,
    fullAggClassName,
    modelname,
    module_id,
    nodekey,
    tableName
} from "../cons/constant.js";
import {
    afterEvent,
    afterTableEvent,
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
    initForm.call(this, status);
}
function saveBefore(saveAction) {
    if (
        this.props.form.isCheckNow(this.formId) &&
        this.props.cardTable.checkTabRequired("guarantee")
    ) {
        saveAction();
    } else {
    }
}

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {},
            inlt: null
        };
    }

    componentWillMount() {}

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
        const headDisabledItems = [
            //表头禁用字段
            //内部托管推单形成的单据，票据池用途为质押时，质押率可输入。
            {
                key: "pledgerate",
                rules: () => {
                    let billpooluse = this.props.cardTable
                        .getColValue("guarantee", "billpooluse")
                        .map(item => item.value);
                    // let pk_srcbill = this.props.form.getFormItemsValue(
                    //     CARD.form_id,
                    //     "pk_srcbill"
                    //);
                    //判断子表中用途包含质押，则表头质押率可以编辑
                    if (
                        billpooluse.includes("pledge")
                        //  &&
                        // pk_srcbill &&
                        // pk_srcbill.value
                    ) {
                        return false;
                    }
                    return true;
                }
            },
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
            }
        ];
        return (
            <BaseCard
                json={this.state.json}
                inlt={this.state.inlt}
                constant={{
                    appcode: app_code,
                    pageId: CARD.page_id,
                    listPageCode: LIST.page_id,
                    moduleId: module_id,
                    modelname, //模块名称
                    formId: CARD.form_id,
                    primaryId: CARD.primary_id, //主键ID
                    billNo: CARD.billno, //单据编号
                    dataSource: DATA_SOURCE, //缓存key
                    tabCode: CARD.tab_code, //tab区域code编码
                    tabOrder: CARD.tab_order, //tab排序
                    tabId: CARD.tab_id, //tab主键
                    nodekey, //打印用
                    API_URL, //接口地址
                    billtype, //单据类型，联查审批详情需要
                    fields: COMMON.fields, //字段名
                    tableTypeObj: {
                        guarantee: "cardTable"
                    },
                    disabledBtnsParam: DISABLE_BTN_PARAM, //根据选中数据判断对应按钮禁用状态
                    encryptVOClassName:
                        "nccloud.itf.pfbm.intopool.IntoPoolEncryptVO4NCC",
                    cafalg: "true",
                    disableReason: disableReason,
                    headDisabledItems, //表头禁用字段
                    fullAggClassName: fullAggClassName, //联查预算
                    modulecode: "3620",
                    tableName
                }}
                _initTemplate={this.getInitTemplate.call(this)}
                _buttonVisible={buttonVisible}
                _afterEvent={afterEvent}
                _beforeEvent={beforeEvent}
                _afterTableEvent={afterTableEvent}
                _bodyButtonClick={bodyButtonClick}
                _bodySelectedEvent={bodySelectedEvent}
                _bodySelectedAllEvent={bodySelectedAllEvent}
                pageTitle={
                    this.props.MutiInit.getIntl("36200BT") &&
                    this.props.MutiInit.getIntl("36200BT").get("36200BT-000004")
                } //节点标题
                headBtnArea={CARD.head_btn_code} //表头按钮区域
                shoulderBtnArea={CARD.shoulder_btn_code} //表体tab区域肩部区域按钮code
                cardDidMount={cardDidMount} //componentDidMount
                linkItems={["approveDetail", "bankBalance", "ntb"]} //联查显示的组件
                tabTableParams={{
                    //这个参数会覆盖BaseCard里的参数
                    // hideAdd: false, //隐藏侧拉增行按钮
                    // hideDel: false,  //隐藏侧拉删行按钮
                    showCheck: true
                }}
                saveBefore={saveBefore} //保存前校验
                initImport={false}
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