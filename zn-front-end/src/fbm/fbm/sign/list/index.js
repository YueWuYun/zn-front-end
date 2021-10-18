/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 债券还本列表页
 created by：liyaoh 2018-09-19
 update: 2018-10-08
*/
import { cardCache, createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseList from "../../../public/components/BaseList";
import { initList } from "../../../public/container/page";
import {
    API_URL,
    billtype,
    CARD,
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
import { initTemplate, initTemplate1, searchBtnClick ,buttonDisable} from "./events";
import { selectedEvent } from './events/index';
let { getDefData } = cardCache;

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
// disabledBtnsParam.push({
//     // 待提交态，不可用按钮有：发送指令、收回指令、作废、取消作废、核销,联查凭证
//     btnName: [
//         "SendInstruction",
//         "CancelInstruction",
//         "Disabled",
//         "CancelDisabled",
//         "Destroy",
//         "Voucher"

//     ],
//     rules: current => current.vbillstatus && current.vbillstatus.value == "-1"
// });
// disabledBtnsParam.push({
//     // 审批通过，不可用按钮有：核销
//     btnName: ["Destroy"],
//     rules: current =>
//         current.vbillstatus &&
//         current.vbillstatus.value == "1" &&
//         !(
//             current.registerstatus === "has_paybill" ||
//             current.registerstatus === "has_return"
//         )
// });
disabledBtnsParam.push({
    // 期初数据，不可用按钮有：删除、发送指令、撤回指令,联查凭证、联查预算
    btnName: ["Delete", "SendInstruction", "CancelInstruction", "Voucher", "LinkBudgetPlan"],

    rules: current => current.initflag && current.initflag.value
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
    }

    //根据场景加载相应initTemplate
    getInitTemplate = () => {
        let scene = this.props.getUrlParam("scene");
        let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo");
        if (pk_ntbparadimvo || scene === "linksce" || scene === "fip") {
            //预算反联查单据
            return initTemplate1;
        } else {
            return initTemplate;
        }
    };

    //页签切换需要传的条件
    tabChangeServal = function (status, callback) {
        let queryInfo = this.props.search.getQueryInfo(this.searchId, false);
        this.setState({ activeTab: status }, () => {
            let searchdata = this.props.search.getQueryInfo(this.searchId);
            let searchCache = getDefData(
                this.searchCache.key,
                this.searchCache.dataSource
            );
            if (searchCache && searchdata) {
                // 去查询
                searchBtnClick.call(
                    this,
                    this.props,
                    searchdata.querycondition
                );
            }
            this.props.table.selectAllRows(this.tableId, false);
        });
    };
    // 设置选中数据按钮的可点击性
    myselectedEvent = function (props, moduleId, record, index, status) {
        
        selectedEvent.call(this);
        let initflag = record.initflag && record.initflag.value;
        if (initflag) {
            // 期初数据，附件除上传禁用
            this.setState({ disableButton: true })
        } else {
            this.setState({ disableButton: false })
        }
        buttonDisable.call(this);
    };
        // 缓存回写回调函数
        componentInitFinished = function() {
            initList.call(this);
            buttonDisable.call(this);
        };
    /**查询区渲染完成回调函数 */
    myRenderCompleteEvent = function () {
        let muti = this.props.MutiInit.getIntl('36180BS'); //this.moduleId
        let money = muti && muti.get("36180BS-000014") /* 国际化处理： 票据金额*/;
        let start = muti && muti.get("36180BS-000015") /* 国际化处理： 开始*/;
        let end = muti && muti.get("36180BS-000016") /* 国际化处理： 结束*/;
        this.props.search.setTemlateByField(this.searchId,
            'money', 'defaultPlaceholder', { start: money + start, end: money + end })
        this.renderCompleteEvent();
    }
    render() {
        const tabs = {
            defaultKey: "-1",
            allKey: "all",
            items: [
                {
                    key: "-1",
                    name: "DTJ",
                    title:
                        this.props.MutiInit.getIntl("36180BS") &&
                        this.props.MutiInit.getIntl("36180BS").get(
                            "36180BS-000009"
                        )
                } /* 国际化处理： 待提交*/,
                {
                    key: "2",
                    name: "SPZ",
                    title:
                        this.props.MutiInit.getIntl("36180BS") &&
                        this.props.MutiInit.getIntl("36180BS").get(
                            "36180BS-000010"
                        )
                } /* 国际化处理： 审批中*/,
                {
                    key: "10",
                    name: "paying",
                    title:
                        this.props.MutiInit.getIntl("36180BS") &&
                        this.props.MutiInit.getIntl("36180BS").get(
                            "36180BS-000012"
                        )
                } /* 国际化处理： 指令处理中*/,
                ,
                {
                    key: "all",
                    title:
                        this.props.MutiInit.getIntl("36180BS") &&
                        this.props.MutiInit.getIntl("36180BS").get(
                            "36180BS-000011"
                        )
                } /* 国际化处理： 全部*/
            ],
            tabChangeServal: this.tabChangeServal
        };
        const pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
        // let queryInfo = this.props.search.getQueryInfo(LIST.search_id, false);
        // let oid = queryInfo.oid;
        // 
        return (
            <BaseList
                json={this.state.json}
                inlt={this.state.inlt}
                constant={{
                    cardPageCode:CARD.page_id,
                    //appcode: app_code,
                    moduleId: module_id,
                    searchId: LIST.search_id,
                    tableId: LIST.table_id,
                    pageId: LIST.page_id,
                    cardpageId: CARD.page_id,
                    nodekey: nodekey, //打印输出编码
                    dataSource: DATA_SOURCE, //缓存key
                    searchCache, //查询区缓存
                    modelname, //模块名称
                    pk_inbalaacc:CARD.pk_inbalaacc,
                    pk_insecurityacc: CARD.pk_insecurityacc, //内部保证金账户ID
                    //oid: LIST.search_oid, //查询区oid
                    primaryId: LIST.primary_id,
                    billNo: LIST.billno, //单据编号
                    billstatus: LIST.billstatus, //单据编号
                    API_URL: API_URL, //接口地址
                    disabledBtn: LIST.disabled_btn, //默认禁用按钮
                    disabledBtnOne: LIST.disabled_btn_one, //列表只有一条数据的条件，按钮才可用
                    billtype, //单据类型，联查审批详情需要
                    disabledBtnsParam, //根据选中数据判断对应按钮禁用状态
                    fields: COMMON.fields, //字段名
                    fullAggClassName,
                    showIndex: true,
                    disableReason,
                    modulecode: "3618",
                    disableflag: LIST.disableflag,
                    tableName
                }}
                _selectedEvent={this.myselectedEvent}
                _initTemplate={this.getInitTemplate.call(this)}
                _searchBtnClick={searchBtnClick}
                _componentInitFinished={this.componentInitFinished}
                _renderCompleteEvent={this.myRenderCompleteEvent}
                pageTitle={
                    this.props.MutiInit.getIntl("36180BS") &&
                    this.props.MutiInit.getIntl("36180BS").get("36180BS-000007")
                } //节点标题
                headBtnArea={LIST.head_btn_code} //表头按钮区域
                showSearch={!pk_ntbparadimvo}
                listTabs={!pk_ntbparadimvo ? tabs : undefined} //反联查不显示tab页签
                linkItems={[
                    "approveDetail",
                    "bankBalance",
                    "ntb",
                    "creditBalance"
                ]} //联查显示的组件
                initImport={true} //初始化导入组件，false或不写则不导入
                {...this.props}
            />
        );
    }
}

List = createPage({
    mutiLangCode: "36180BS"
})(List);
export default List;
// ReactDOM.render(<List />, document.querySelector('#app'));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/