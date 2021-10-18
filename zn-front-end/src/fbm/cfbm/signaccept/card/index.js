/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 开票申请受理卡片页
 created by：chenmcht 2019.11.14
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
    LIST
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
        this.state = {
            json: {},
            inlt: null
        };
    }

    componentDidMount() {
        let callback = (json, status, inlt) => {
            // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
            }
        };
        //this.props.MultiInit.getMultiLang({ moduleId: [module_id, '36650PUB'], domainName: 'bond', callback });
    }

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
        // const headDisabledItems = [{
        // 	//币种为人民币时禁用组织本币汇率
        // 	key: 'olcrate',
        // 	rules: () => {
        // 		let pk_currtype = this.props.form.getFormItemsValue(CARD.form_id, 'pk_currtype');
        // 		return pk_currtype && pk_currtype.value === '1002Z0100000000001K1';
        // 	}
        // }];
        return (
            <BaseCard
                constant={{
                    appcode: app_code,
                    pageId: CARD.page_id,
                    listPageCode: LIST.page_id,
                    moduleId: module_id,
                    formId: CARD.form_id,
                    primaryId: CARD.primary_id, //主键ID
                    billNo: CARD.billno, //单据编号
                    dataSource: DATA_SOURCE, //缓存key
                    nodekey, //打印用
                    API_URL, //接口地址
                    billtype, //单据类型，联查审批详情需要
                    disabledBtnsParam: DISABLE_BTN_PARAM, //根据选中数据判断对应按钮禁用状态
                    //headDisabledItems,						//表头禁用字段
                    pk_inbalaacc:LIST.pk_inbalaacc,//内部结算账户的主键
                    pknotetype_bank: CARD.pknotetype_bank, // 银行承兑汇票
                    pknotetype_busi: CARD.pknotetype_busi, // 商业承兑汇票
                    pknotetype_ebank: CARD.pknotetype_ebank, // 电子银行承兑汇票
                    pknotetype_ebusi: CARD.pknotetype_ebusi, // 电子商业承兑汇票
                    pk_insecurityacc:LIST.pk_securityacc,
                    cafalg: "false",
                    returnReason:LIST.returnReason,
                    returnWithDeleteSwitch:true
                }}
                _initTemplate={this.getInitTemplate.call(this)}
                _buttonVisible={buttonVisible}
                _afterEvent={afterEvent}
                pageTitle={
                    this.props.MutiInit.getIntl("36370IFBAD") &&
                    this.props.MutiInit.getIntl("36370IFBAD").get(
                        "36370IFBAD-000002"
                    )
                } //页面标题/* 国际化处理： 开票申请受理*/
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
        billtype: "card",
        pagecode: CARD.page_id,
        headcode: CARD.form_id
    },
    mutiLangCode: "36370IFBAD"
})(Card);
export default Card;
// ReactDOM.render(<Card />, document.querySelector('#app'));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/