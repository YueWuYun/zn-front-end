/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
票据出池——列表页
*/
import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseList from "../../../public/components/BaseList";
import { CARD } from "../../exitpool/cons/constant";
import {
    API_URL,
    app_code,
    billtype,
    COMMON,
    DATA_SOURCE,
    disableReason,
    DISABLE_BTN_PARAM,
    fullAggClassName,
    LIST,
    modelname,
    module_id,
    nodekey,
    searchCache,
    tableName
} from "../cons/constant";
import { buttonDisable, initTemplate, initTemplate1 } from "./events";

let disabledBtnsParam = [...DISABLE_BTN_PARAM]; //复制数组，不然会共用卡片页disabledBtnsParam的引用
disabledBtnsParam.push({
    btnName: ["Delete", "Commit"],
    rules: current => current.vbillstatus && current.vbillstatus.value !== "-1" //待提交才可以删除
});
disabledBtnsParam.push({
    btnName: "Uncommit",
    rules: current =>
        current.vbillstatus &&
        current.vbillstatus.value !== "3" &&
        current.vbillstatus.value !== "1"
});
disabledBtnsParam.push({
    btnName: [
        "SendInstruction",
        "Invalid",
        "CancelInvalid",
        "MakeVoucher",
        "CancelVoucher"
    ],
    rules: current => current.vbillstatus && current.vbillstatus.value !== "1"
});
class List extends Component {
    constructor(props) {
        super(props);
        this.API_URL = API_URL;
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
        //this.props.MultiInit.getMultiLang({ moduleId: '', domainName: 'fbm', callback });
    }

    //根据场景加载相应initTemplate
    getInitTemplate = () => {
        let scene = this.props.getUrlParam("scene");
        let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo");
        if (pk_ntbparadimvo || (scene === "linksce" || scene === "fip")) {
            //预算反联查单据
            return initTemplate1;
        } else {
            return initTemplate;
        }
    };

    //页签切换需要传的条件
    tabChangeServal = (status, callback) => {
        let serval = {
            field: "vbillstatus",
            value: {
                firstvalue: status != "all" ? status : "-1,0,1,2,3",
                secondvalue: null
            },
            oprtype: status != "all" ? "=" : "in"
        };
        callback(serval);
        return serval;
    };

    // 设置选中数据按钮的可点击性
    myselectedEvent = function(props, moduleId, record, index, status) {
        buttonDisable.call(this);
    };

    render() {
        const tabs = {
            defaultKey: "-1",
            allKey: "all",
            items: [
                {
                    key: "-1",
                    name: "numZY",
                    title:
                        this.props.MutiInit.getIntl("36200BR") &&
                        this.props.MutiInit.getIntl("36200BR").get(
                            "36200BR-000006"
                        )
                } /* 国际化处理： 待提交*/,
                {
                    key: "2,3",
                    name: "numTJ",
                    title:
                        this.props.MutiInit.getIntl("36200BR") &&
                        this.props.MutiInit.getIntl("36200BR").get(
                            "36200BR-000007"
                        )
                } /* 国际化处理： 审批中*/,
                {
                    key: "4",
                    name: "numZLCLZ",
                    title:
                        this.props.MutiInit.getIntl("36200BR") &&
                        this.props.MutiInit.getIntl("36200BR").get(
                            "36200BR-000009"
                        )
                } /* 国际化处理： 指令处理中*/,
                {
                    key: "all",
                    title:
                        this.props.MutiInit.getIntl("36200BR") &&
                        this.props.MutiInit.getIntl("36200BR").get(
                            "36200BR-000008"
                        )
                } /* 国际化处理： 全部*/ /* 国际化处理： 全部*/
            ],
            tabChangeServal: this.tabChangeServal.bind(this)
        };
        const pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
        return (
            <BaseList
                json={this.state.json}
                inlt={this.state.inlt}
                constant={{
                    modulecode: "3620",
                    appcode: app_code,
                    cardPageCode: CARD.page_id,
                    moduleId: module_id,
                    searchId: LIST.search_id,
                    tableId: LIST.table_id,
                    pageId: LIST.page_id,
                    cardpageId: CARD.page_id,
                    nodekey: nodekey, //打印输出编码
                    dataSource: DATA_SOURCE, //缓存key
                    searchCache, //查询区缓存
                    // oid: LIST.search_oid, //查询区oid
                    primaryId: LIST.primary_id,
                    billNo: LIST.billno, //单据编号
                    modelname, //模块名称
                    billstatus: LIST.billstatus, //单据状态
                    tabStatus: LIST.tabStatus, //列表特殊页签规则
                    paymentstatus: LIST.paymentstatus, // 特殊页签对应的条件
                    API_URL: API_URL, //接口地址
                    disabledBtn: LIST.disabled_btn, //默认禁用按钮
                    disabledBtnOne: LIST.disabled_btn_one, //列表只有一条数据的条件，按钮才可用
                    billtype, //单据类型，联查审批详情需要
                    disabledBtnsParam, //根据选中数据判断对应按钮禁用状态
                    fields: COMMON.fields, //字段名
                    fullAggClassName: fullAggClassName, //联查预算
                    disableReason: disableReason,
                    tableName

                    // tabStatus:LIST.tabStatus,
                    // paymentstatus:LIST.paymentstatus
                }}
                _initTemplate={this.getInitTemplate.call(this)}
                pageTitle={
                    this.props.MutiInit.getIntl("36200BR") &&
                    this.props.MutiInit.getIntl("36200BR").get("36200BR-000003")
                } //页面标题/* 国际化处理： 票据出池*/
                headBtnArea={LIST.head_btn_code} //表头按钮区域
                _selectedEvent={this.myselectedEvent}
                showSearch={!pk_ntbparadimvo}
                listTabs={!pk_ntbparadimvo ? tabs : undefined} //反联查不显示tab页签
                linkItems={["approveDetail", "bankBalance", "ntb"]} //联查显示的组件
                initImport={false}
                {...this.props}
            />
        );
    }
}

List = createPage({
    mutiLangCode: "36200BR"
})(List);
export default List;
// ReactDOM.render(<List />, document.querySelector('#app'));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/