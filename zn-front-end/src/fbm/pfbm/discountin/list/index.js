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
import { REF21_CONST } from "../ref21/const";
import {
    API_URL,
    billtype,
    CARD,
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
import { buttonDisable, initTemplate, searchBtnClick } from "./events";
let { setDefData, getDefData } = cardCache;
class List extends Component {
    constructor(props) {
        super(props);
        this.API_URL = API_URL;

        let app_code = props.getSearchParam("c");
    }
    componentDidMount() {}

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
        let money = muti && muti.get("36200DT-000010") /* 国际化处理： 票据金额*/;
        let start = muti && muti.get("36200DT-000011") /* 国际化处理： 开始*/;
        let end  = muti && muti.get("36200DT-000012") /* 国际化处理： 结束*/;
        this.props.search.setTemlateByField(this.searchId,
            'discountmoney','defaultPlaceholder',{start: money+start,end: money+end})
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
                    title: multiLang && multiLang.get("36200DT-000006")
                } /* 国际化处理： 待提交*/,
                {
                    key: "2,3",
                    name: "tab02",
                    title: multiLang && multiLang.get("36200DT-000007")
                } /* 国际化处理： 审批中*/,
                {
                    key: "10",
                    name: "tab03",
                    title: multiLang && multiLang.get("36200DT-000008")
                } /* 国际化处理： 指令处理中*/,
                {
                    key: "all",
                    title: multiLang && multiLang.get("36200DT-000009")
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
                    cardPageCode: CARD.page_id,
                    // apCode: LIST.app_code,
                    nodekey: nodekey, //打印输出编码
                    tdataSource: REF21_CONST.Ref21DataSource, //转单页面的缓存key
                    dataSource: DATA_SOURCE, //缓存key
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
                    tabStatus: LIST.tabStatus, //列表特殊页签规则
                    paymentstatus: LIST.paymentstatus, // 特殊页签对应的条件
                    showIndex: true,
                    fullAggClassName: fullAggClassName, // aggvo全路径名
                    disableReason: disableReason,
                    modulecode: "3620",
                    disableflag: LIST.disableflag,
                    tableName
                }}
                _initTemplate={initTemplate}
                _selectedEvent={this.myselectedEvent}
                _renderCompleteEvent={this.myRenderCompleteEvent}
                // _searchBtnClick={searchBtnClick}	// 查询按钮注册，用自己的
                _componentInitFinished={this.componentInitFinished}
                pageTitle={multiLang && multiLang.get("36200DT-000003")} //节点标题
                headBtnArea={LIST.head_btn_code} //表头按钮区域
                listTabs={tabs}
                linkItems={["approveDetail", "ntb"]} //联查显示的组件
                initImport={false} // 是否初始化导入组件，true:是；不写或false:否;
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