/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 期初应收票据列表页
 created by：lifft 2019-03-25
 update: 
*/
import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseList from "../../../public/components/BaseList";
import {
    API_URL,
    app_code,
    billtype,
    CARD,
    DATA_SOURCE,
    DISABLE_BTN_PARAM,
    LIST,
    modelname,
    module_id,
    nodekey,
    nodekeyList,
    searchCache
} from "../cons/constant";
import { buttonDisable, initTemplate, selectedEvent } from "./events";

let disabledBtnsParam = [...DISABLE_BTN_PARAM]; //复制数组，不然会共用卡片页disabledBtnsParam的引用

function listDidMount() {}

class List extends Component {
    constructor(props) {
        super(props);
        this.API_URL = API_URL;
    }

    // 设置选中数据按钮的可点击性
    myselectedEvent = function(props, moduleId, record, index, status) {
        buttonDisable.call(this);
    };

    /**双击回调函数 */
    mydoubleClickEvent = function() {
        return;
    }

    render() {
        return (
            <BaseList
                constant={{
                    appcode: app_code,
                    moduleId: module_id,
                    searchId: LIST.search_id,
                    tableId: LIST.table_id,
                    pageId: LIST.page_id,
                    apCode: LIST.app_code,
                    nodekey: nodekey, //打印输出编码
                    nodekeyList: nodekeyList,
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
                    disabledBtnsParam, //根据选中数据判断对应按钮禁用状态
                    cardpageId: CARD.page_id,
                    returnReason: "sendbacknote",
                    linkAtList: true
                }}
                _initTemplate={initTemplate}
                _selectedEvent={selectedEvent}
                _doubleClickEvent={this.mydoubleClickEvent}
                pageTitle={
                    this.props.MutiInit.getIntl("36185540") &&
                    this.props.MutiInit.getIntl("36185540").get("36185540-000000")
                } //节点标题/* 国际化处理： 单位下拨可用额度*/
                headBtnArea={LIST.head_btn_code} //表头按钮区域
                _selectedEvent={this.myselectedEvent}
                listDidMount={listDidMount}
                linkItems={["approveDetail", "creditBalance"]} //联查显示的组件
                initImport={false}
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