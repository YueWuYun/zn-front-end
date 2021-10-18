/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 应收票据退票卡片页
 created by：lifft 
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
    DATA_SOURCE,
    DISABLE_BTN_PARAM,
    module_id,
    nodekey
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
    initTemplate1
} from "./events";

//componentDidMount
function cardDidMount() {
    let status = this.props.getUrlParam("status");
    initForm.call(this, status);
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
    }

    //根据场景加载相应initTemplate
    getInitTemplate = () => {
        let scene = this.props.getUrlParam("scene");
        if (scene === "linksce") {
            //联查场景
            return initTemplate1;
        } else {
            return initTemplate;
        }
    };

    render() {
        //表头禁用字段
        const headDisabledItems = [];
        return (
            <BaseCard
                json={this.state.json}
                inlt={this.state.inlt}
                constant={{
                    modulecode: "3618",
                    appcode: app_code,
                    pageId: CARD.page_id,
                    moduleId: module_id,
                    formId: CARD.form_id,
                    primaryId: CARD.primary_id,                             //主键ID
                    billNo: CARD.billno,                                    //单据编号
                    dataSource: DATA_SOURCE,                                //缓存key
                    tabCode: CARD.tab_code,                                 //tab区域code编码
                    tabOrder: CARD.tab_order,                               //tab排序
                    tabId: CARD.tab_id,                                     //tab主键
                    nodekey,                                                //打印用
                    API_URL,                                                //接口地址
                    billtype,                                               //单据类型，联查审批详情需要
                    tableTypeObj: {
                        guarantee: "cardTable"
                    },
                    disabledBtnsParam: DISABLE_BTN_PARAM,                   //根据选中数据判断对应按钮禁用状态
                    headDisabledItems,                                      //表头禁用字段
                    cafalg: "false"                                         //是否进行加签
    
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
                    this.props.MutiInit.getIntl("36180BCI") &&
                    this.props.MutiInit.getIntl("36180BCI").get("36180BCI-000000")
                }
                headBtnArea={CARD.head_btn_code}                            //表头按钮区域
                shoulderBtnArea={CARD.shoulder_btn_code}                    //表体tab区域肩部区域按钮code
                cardDidMount={cardDidMount}                                 //componentDidMount
                linkItems={["approveDetail", "bankBalance", "ntb"]}         //联查显示的组件
                tabTableParams={{
                    //这个参数会覆盖BaseCard里的参数
                    hideAdd: false,                                         //隐藏侧拉增行按钮
                    hideDel: false,                                         //隐藏侧拉删行按钮
                    showCheck: true
                }}
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
    mutiLangCode: "36180BCI"
})(Card);
export default Card;
// ReactDOM.render(<Card />, document.querySelector('#app'));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/