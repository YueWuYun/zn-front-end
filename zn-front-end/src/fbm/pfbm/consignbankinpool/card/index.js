/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 期初应收票据卡片页
 created by：lifft 2019-03-25
 update: 
*/
import { base, createPage, high } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseCard from "../../../public/components/BaseCard";
import { initForm } from "../../../public/container/page";
import { REF21_CONST } from "../ref21/const";
import {
    API_URL,
    billtype,
    CARD,
    confirmreceipt,
    DATA_SOURCE,
    disableReason,
    DISABLE_BTN_PARAM,
    fullAggClassName,
    module_id,
    nodekey,
    LIST,
    tableName
} from "../cons/constant.js";
import {
    afterEvent,
    buttonVisible,
    initTemplate,
    initTemplate1,
    initTemplate2,
    beforeEvent
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
    componentWillMount() {
        let callback = (json, status, inlt) => {
            // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
            } else {
                console.log("未加载到多语资源"); // 未请求到多语资源的后续操作
            }
        };
        this.props.MultiInit.getMultiLang({
            moduleId: module_id,
            domainName: "fbm",
            callback
        });
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
        let multiLang = this.props.MutiInit.getIntl(module_id); //this.moduleId
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
                    listPageCode:LIST.page_id,
                    //appcode: app_code,
                    pageId: CARD.page_id,
                    moduleId: module_id,
                    formId: CARD.form_id,
                    primaryId: CARD.primary_id, //主键ID
                    billNo: CARD.billno, //单据编号
                    dataSource: DATA_SOURCE, //缓存key
                    tdataSource: REF21_CONST.Ref21DataSource, //转单页面的缓存key
                    nodekey, //打印用
                    API_URL, //接口地址
                    billtype, //单据类型，联查审批详情需要
                    disabledBtnsParam: DISABLE_BTN_PARAM, //根据选中数据判断对应按钮禁用状态
                    headDisabledItems, //表头禁用字段
                    pknotetype_bank: CARD.pknotetype_bank, // 银行承兑汇票
                    pknotetype_busi: CARD.pknotetype_busi, // 商业承兑汇票
                    pknotetype_ebank: CARD.pknotetype_ebank, // 电子银行承兑汇票
                    pknotetype_ebusi: CARD.pknotetype_ebusi, // 电子商业承兑汇票
                    cafalg: "true",
                    encryptVOClassName:
                        "nccloud.itf.pfbm.consignbankinpool.vo.ConsignBankInPoolEncryptVO4NCC",
                    disableReason,
                    fullAggClassName,
                    billInfo: CARD.billinfo,
                    confirmreceipt,
                    modulecode: "3620",
                    tableName
                }}
                _initTemplate={this.getInitTemplate.call(this)}
                _buttonVisible={buttonVisible}
                _afterEvent={afterEvent}
                _beforeEvent={beforeEvent}
                pageTitle={multiLang && multiLang.get("36200BC-000003")} //节点标题
                headBtnArea={CARD.head_btn_code} //表头按钮区域
                formParams={{
                    //区域默认展开
                    expandArr: [
                        "form_consignbank_01",
                        "poolinfo",
                        "issecurity"
                    ]
                }} //表头form参数
                linkItems={["approveDetail", "creditBalance", "ntb"]} //联查显示的组件
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