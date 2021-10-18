/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 贴现申请列表页
 created by：wusib 2019-10-25
 update: 
*/
import { cardCache, createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseList from "../../../public/components/BaseList";
import { initList } from "../../../public/container/page";
import { REF21_CONST } from "../ref21/const";
import {
    API_URL, billtype, CARD, DATA_SOURCE, disableReason, DISABLE_BTN_PARAM,
    fullAggClassName, LIST, modelname, module_id, nodekey, searchCache
} from "../cons/constant";
import { buttonDisable, initTemplate, searchBtnClick } from "./events";
let { setDefData, getDefData } = cardCache;
class List extends Component {
    constructor(props) {
        super(props);
        this.API_URL = API_URL;
    }
    componentDidMount() {
        // buttonDisable.call(this);
    }
    // listDidMount() {
    // }
    //页签切换需要传的条件,此处自己查，不调用callback
    tabChangeServal = function(status, callback) {
        this.setState(
            {
                activeTab: status
            },
            () => {
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
                buttonDisable.call(this);
            }
        );
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
    myRenderCompleteEvent = function() {
        let muti = this.props.MutiInit.getIntl(module_id); //this.moduleId
        // let money = muti && muti.get("36180DA-000010") /* 国际化处理： 票据金额*/;
        let moneystart = muti && muti.get("36180DA-000011") /* 国际化处理： 票据金额由*/;
        let moneyend  = muti && muti.get("36180DA-000012") /* 国际化处理： 票据金额至*/;
        this.props.search.setTemlateByField(this.searchId,
            'money','defaultPlaceholder',{start: moneystart,end: moneyend})
        let discountmoneystart = muti && muti.get("36180DA-000015") /* 国际化处理： 贴现余额由*/;
        let discountmoneyend = muti && muti.get("36180DA-000016") /* 国际化处理： 贴现余额至*/;
        this.props.search.setTemlateByField(this.searchId,
            'discountmoney','defaultPlaceholder',{start: discountmoneystart,end: discountmoneyend})
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
                    title: multiLang && multiLang.get("36180DA-000006")
                } /* 国际化处理： 待提交*/,
                {
                    key: "2,3",
                    name: "tab02",
                    title: multiLang && multiLang.get("36180DA-000007")
                } /* 国际化处理： 审批中*/,
                {
                    key: "all",
                    title: multiLang && multiLang.get("36180DA-000009")
                } /* 国际化处理： 全部*/
            ],
            tabChangeServal: this.tabChangeServal
        };

        return (
            <BaseList
                constant={{
                    // appcode: app_code,
                    moduleId: module_id,
                    searchId: LIST.search_id,
                    tableId: LIST.table_id,
                    pageId: LIST.page_id,
                    // apCode: LIST.app_code,
                    nodekey: nodekey, //打印输出编码
                    dataSource: DATA_SOURCE, //缓存key
                    tdataSource: REF21_CONST.Ref21DataSource, //转单页面的缓存key
                    searchCache, //查询区缓存
                    // oid: LIST.search_oid, //查询区oid
                    primaryId: LIST.primary_id,
                    billNo: LIST.billno, //单据编号
                    billstatus: LIST.billstatus, //单据编号
                    API_URL: API_URL, //接口地址
                    disabledBtn: LIST.disabled_btn, //默认禁用按钮
                    billtype, //单据类型，联查审批详情需要
                    modelname, //模块名称
                    disabledBtnsParam: DISABLE_BTN_PARAM, //根据选中数据判断对应按钮禁用状态
                    cardpageId: CARD.page_id,
                    tabStatus: LIST.tabStatus, //列表特殊页签规则
                    paymentstatus: LIST.paymentstatus, // 特殊页签对应的条件
                    showIndex: true,
                    fullAggClassName: fullAggClassName,
                    disableReason: disableReason,
                    modulecode: "3618",
                    disableflag: LIST.disableflag
                }}
                _initTemplate={initTemplate}
                _selectedEvent={this.myselectedEvent}
                _renderCompleteEvent={this.myRenderCompleteEvent}
                // _searchBtnClick={searchBtnClick}	// 查询按钮注册，用公共的
                _componentInitFinished={this.componentInitFinished}
                pageTitle={multiLang && multiLang.get("36180DA-000003")} //节点标题
                headBtnArea={LIST.head_btn_code} //表头按钮区域
                listTabs={tabs}
                // listDidMount={this.listDidMount}
                linkItems={["approveDetail", "ntb"]} //联查显示的组件,审批详情，预算
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