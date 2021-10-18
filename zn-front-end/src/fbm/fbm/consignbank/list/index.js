/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 期初应收票据列表页
 created by：lifft 2019-03-25
 update: 
*/
import { cardCache, createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseList from "../../../public/components/BaseList";
import { initList } from "../../../public/container/page";
import { REF21_CONST } from "../ref21/const";
import {
    API_URL,
    billtype,
    CARD,
    confirmreceipt,
    DATA_SOURCE,
    disableReason,
    DISABLE_BTN_PARAM,
    fullAggClassName,
    LIST,
    modelname,
    module_id,
    nodekey,
    searchCache,
    TRAN_CARD_PAGE_INFO,DATA_SOURCE_TRANS,TRAN_LIST_PAGE_INFO,
    tableName
} from "../cons/constant";
import { initTemplate,initTemplate1, searchBtnClick, selectedEvent ,buttonDisable} from "./events";

let { getDefData } = cardCache;
let disabledBtnsParam = [...DISABLE_BTN_PARAM]; //复制数组，不然会共用卡片页disabledBtnsParam的引用
disabledBtnsParam.push({
    // 审批未通过=0,审批通过=1,审批进行中=2,提交=3，这些状态，删除，提交不可用
    btnName: ["Delete", "Commit"],
    rules: current => current.vbillstatus && current.vbillstatus.value !== "-1"
});
disabledBtnsParam.push({
    btnName: ["Uncommit"],
    rules: current =>
        current.vbillstatus &&
        current.vbillstatus.value !== "3" &&
        current.vbillstatus.value !== "1"
});
// disabledBtnsParam.push({
//     // 待提交态，不可用按钮有：发送指令、收回指令、审批详情、凭证、计划预算
//     btnName: [
//         "SendInstruction",
//         "CancelInstruction",
//         "ApproveDetail",
//         "Voucher",
//         "LinkBudgetPlan"
//     ],
//     rules: current =>
//         current.vbillstatus &&
//         current.vbillstatus.value == "-1"
// });
// 审批成功 并且是网银，并且已作废,并且交易失败，不可用按钮：作废
//  disabledBtnsParam.push({
//     btnName: [
//         "Disabled"
//     ],
//     rules: current =>
//         current.vbillstatus &&
//         current.onlinebankflag &&
//         current.disableflag &&
//         !(current.vbillstatus.value == "1" && current.onlinebankflag.value && !current.disableflag.value &&
//         current.paymentstatus && current.paymentstatus.value == "2")

// });
// // 审批成功 并且是网银，并且交易失败，并且没有作废，不可用按钮：取消作废
// disabledBtnsParam.push({
//     btnName: [
//         "CancelDisabled"
//     ],
//     rules: current =>
//         current.vbillstatus &&
//         current.onlinebankflag &&
//         current.disableflag &&
//         !(current.vbillstatus.value == "1" && current.onlinebankflag.value && current.disableflag.value)
// });

class List extends Component {
    constructor(props) {
        super(props);
        this.API_URL = API_URL;
    }
    componentDidMount() { }
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
        myselectedEvent = function(props, moduleId, record, index, status) {
            buttonDisable.call(this);
        };
        // 缓存回写回调函数
        componentInitFinished = function() {
            initList.call(this);
            buttonDisable.call(this);
        };
    /**查询区渲染完成回调函数 */
    myRenderCompleteEvent = function () {
        let muti = this.props.MutiInit.getIntl('36180BC'); //this.moduleId
        let money = muti && muti.get("36180BC-000011") /* 国际化处理： 票据金额*/;
        let start = muti && muti.get("36180BC-000012") /* 国际化处理： 开始*/;
        let end = muti && muti.get("36180BC-000013") /* 国际化处理： 结束*/;
        this.props.search.setTemlateByField(this.searchId,
            'money', 'defaultPlaceholder', { start: money + start, end: money + end })
        this.renderCompleteEvent();
    }
    render() {
        let multiLang = this.props.MutiInit.getIntl(module_id); //this.moduleId
        const tabs = {
            defaultKey: "-1",
            allKey: "all",
            items: [
                {
                    key: "-1",
                    name: "tab01",
                    title: multiLang && multiLang.get("36180BC-000006")
                } /* 国际化处理： 待提交*/,
                {
                    key: "2",
                    name: "tab02",
                    title: multiLang && multiLang.get("36180BC-000007")
                } /* 国际化处理： 审批中*/,
                {
                    key: "10",
                    name: "tab03",
                    title: multiLang && multiLang.get("36180BC-000008")
                } /* 国际化处理： 指令处理中*/,
                {
                    key: "11",
                    name: "tab04",
                    title: multiLang && multiLang.get("36180BC-000009")
                } /* 国际化处理： 待确认收妥*/,
                {
                    key: "all",
                    title: multiLang && multiLang.get("36180BC-000010")
                } /* 国际化处理： 全部*/
            ],
            tabChangeServal: this.tabChangeServal
        };

        return (
            <BaseList
                constant={{
                    cardPageCode:CARD.page_id,
                    //appcode: app_code,
                    moduleId: module_id,
                    searchId: LIST.search_id,
                    tableId: LIST.table_id,
                    pageId: LIST.page_id,
                    apCode: LIST.app_code,
                    nodekey: nodekey, //打印输出编码
                    dataSource: DATA_SOURCE, //缓存key
                    tdataSource: REF21_CONST.Ref21DataSource, //转单页面的缓存key
                    searchCache, //查询区缓存
                    dataSourceTrans:DATA_SOURCE_TRANS, //转单缓存
                    tranListPageInfo:TRAN_LIST_PAGE_INFO, //转单列表信息
                    tranCardPageInfo:TRAN_CARD_PAGE_INFO, //转单卡片信息
                    //oid: LIST.search_oid, //查询区oid
                    primaryId: LIST.primary_id,
                    billNo: LIST.billno, //单据编号
                    billstatus: LIST.billstatus, //单据编号
                    API_URL: API_URL, //接口地址
                    disabledBtn: LIST.disabled_btn, //默认禁用按钮
                    billtype, //单据类型，联查审批详情需要
                    modelname, //模块名称
                    disabledBtnsParam, //根据选中数据判断对应按钮禁用状态
                    cardpageId: CARD.page_id,
                    tabStatus: LIST.tabStatus,
                    paymentstatus: LIST.paymentstatus,
                    busistatus: LIST.busistatus,
                    vbillstatus: LIST.vbillstatus,
                    fullAggClassName,
                    disableReason,
                    showIndex: true,
                    confirmreceipt,
                    modulecode: "3618",
                    disableflag: LIST.disableflag,
                    tableName
                }}
                _initTemplate={this.getInitTemplate.call(this)}
               // _initTemplate={initTemplate}
                _renderCompleteEvent={this.myRenderCompleteEvent}
                _selectedEvent={this.myselectedEvent}
                _componentInitFinished={this.componentInitFinished}
                //_searchBtnClick={searchBtnClick}
                pageTitle={multiLang && multiLang.get("36180BC-000003")} //节点标题
                headBtnArea={LIST.head_btn_code} //表头按钮区域
                listTabs={tabs}
                linkItems={["approveDetail", "creditBalance", "ntb"]} //联查显示的组件
                initImport={true} //初始化导入组件，false或不写则不导入
                {...this.props}
            />
        );
    }
}

List = createPage({
    mutiLangCode: module_id
})(List);
export default List;
// ReactDOM.render(<List />, document.querySelector('#app'));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/