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
    searchCache,
    tableName
} from "../cons/constant";
import { initTemplate, selectedEvent } from "./events";

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
        current.vbillstatus.value !== "1" &&
        current.vbillstatus.value !== "2" &&
        current.vbillstatus.value !== "0"
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
    componentDidMount() {
        let callback = (json, status, inlt) => {
            // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
            }
        };
    }

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
	/**查询区渲染完成回调函数 */
    myRenderCompleteEvent = function() {
        let muti = this.props.MutiInit.getIntl(module_id); //this.moduleId
        let money = muti && muti.get("36180BRB-000008") /* 国际化处理： 票据金额*/;
        let start = muti && muti.get("36180BRB-000009") /* 国际化处理： 开始*/;
        let end  = muti && muti.get("36180BRB-000010") /* 国际化处理： 结束*/;
        this.props.search.setTemlateByField(this.searchId,
            'money','defaultPlaceholder',{start: money+start,end: money+end})
        this.renderCompleteEvent();
    }
    render() {
        const tabs = {
            defaultKey: "-1",
            allKey: "all",
            items: [
                {
                    key: "-1",
                    name: "numZY",
                    title:
                        this.props.MutiInit.getIntl("36180BRB") &&
                        this.props.MutiInit.getIntl("36180BRB").get(
                            "36180BRB-000005"
                        )
                } /* 国际化处理： 待提交*/,
                {
                    key: "2,3",
                    name: "numTJ",
                    title:
                        this.props.MutiInit.getIntl("36180BRB") &&
                        this.props.MutiInit.getIntl("36180BRB").get(
                            "36180BRB-000006"
                        )
                } /* 国际化处理： 审批中*/,
                {
                    key: "all",
                    title:
                        this.props.MutiInit.getIntl("36180BRB") &&
                        this.props.MutiInit.getIntl("36180BRB").get(
                            "36180BRB-000007"
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
                    cardPageCode: CARD.page_id,
                    tableId: LIST.table_id,
                    pageId: LIST.page_id,
                    apCode: LIST.app_code,
                    nodekey: nodekey, //打印输出编码
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
                    tableName
                }}
                _initTemplate={initTemplate}
                _selectedEvent={selectedEvent}
				_renderCompleteEvent={this.myRenderCompleteEvent}
                pageTitle={
                    this.props.MutiInit.getIntl("36180BRB") &&
                    this.props.MutiInit.getIntl("36180BRB").get(
                        "36180BRB-000002"
                    )
                } //页面标题/* 国际化处理： 期初应收票据*/
                headBtnArea={LIST.head_btn_code} //表头按钮区域
                listTabs={tabs}
                initImport={true} //导入导出
                linkItems={["approveDetail", "creditBalance"]} //联查显示的组件
                {...this.props}
            />
        );
    }
}

List = createPage({
    mutiLangCode: "36180BRB"
})(List);
export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/