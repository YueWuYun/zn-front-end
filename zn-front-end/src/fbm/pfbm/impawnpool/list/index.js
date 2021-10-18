/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 池内质押票据列表页
 created by：lifft 2019-03-25
 update: 
*/
import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseList from "../../../public/components/BaseList";
import { API_URL, app_code, billtype, CARD, DATA_SOURCE, TRAN_CARD_PAGE_INFO,DATA_SOURCE_TRANS,disableReason, impawnbackAreaCode, LIST, modelname, module_id, nodekey, searchCache, TRAN_LIST_PAGE_INFO ,tableName} from "../cons/constant";
import { buttonDisable, initTemplate } from "./events";

class List extends Component {
    constructor(props) {
        super(props);
        this.API_URL = API_URL;
    }
    componentDidMount() {}

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
                        this.props.MutiInit.getIntl("36200BI") &&
                        this.props.MutiInit.getIntl("36200BI").get(
                            "36200BI-000005"
                        )
                } /* 国际化处理： 待提交*/,
                {
                    key: "2,3",
                    name: "numTJ",
                    title:
                        this.props.MutiInit.getIntl("36200BI") &&
                        this.props.MutiInit.getIntl("36200BI").get(
                            "36200BI-000006"
                        )
                } /* 国际化处理： 审批中*/,
                {
                    key: "cmd2,3",
                    name: "numOnCmd",
                    title:
                        this.props.MutiInit.getIntl("36200BI") &&
                        this.props.MutiInit.getIntl("36200BI").get(
                            "36200BI-000008"
                        )
                } /* 国际化处理： 指令处理中*/,
                {
                    key: "all",
                    title:
                        this.props.MutiInit.getIntl("36200BI") &&
                        this.props.MutiInit.getIntl("36200BI").get(
                            "36200BI-000007"
                        )
                } /* 国际化处理： 全部*/
            ],
            tabChangeServal: this.tabChangeServal.bind(this)
        };

        return (
            <BaseList
                constant={{
                    appcode: app_code,
                    moduleId: module_id,
                    searchId: LIST.search_id,
                    tableId: LIST.table_id,
                    pageId: LIST.page_id,
                    cardPageCode: CARD.page_id,
                    apCode: LIST.app_code,
                    nodekey: nodekey, //打印输出编码
                    dataSource: DATA_SOURCE, //缓存key
                    searchCache, //查询区缓存
                    dataSourceTrans:DATA_SOURCE_TRANS, //转单缓存
                    tranListPageInfo:TRAN_LIST_PAGE_INFO, //转单列表信息
                    tranCardPageInfo:TRAN_CARD_PAGE_INFO, //转单卡片信息
                    // oid: LIST.search_oid, //查询区oid
                    primaryId: LIST.primary_id,
                    billNo: LIST.billno, //单据编号
                    billstatus: LIST.billstatus, //单据编号
                    API_URL: API_URL, //接口地址
                    disabledBtn: LIST.disabled_btn, //默认禁用按钮
                    billtype, //单据类型，联查审批详情需要
                    modelname, //模块名称
                    cardpageId: CARD.page_id,
                    disableReason: disableReason,
                    encryptVOClassName:
                        "nccloud.itf.pfbm.impawnpool.ImpawnpoolEncryptVO4NCC", //ca类
                    cafalg: "true",
                    showIndex: true,
                    modulecode: "3620",
                    impawnbackAreaCode: impawnbackAreaCode,
                    impawnbackdate: "impawnbackdate",
                    impawnbackpersonid: "impawnbackpersonid",
                    tableName
                }}
                _initTemplate={initTemplate}
                _selectedEvent={this.myselectedEvent}
                pageTitle={
                    this.props.MutiInit.getIntl("36200BI") &&
                    this.props.MutiInit.getIntl("36200BI").get("36200BI-000002")
                } //节点标题
                headBtnArea={LIST.head_btn_code} //表头按钮区域
                listTabs={tabs}
                initImport={false} //不做导入导出处理
                linkItems={["approveDetail"]} //联查显示的组件
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