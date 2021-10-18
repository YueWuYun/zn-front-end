/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 期初应付列表页
 created by：liangyen 2018-09-19
 update: 2018-10-08
*/
import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseList from "../../../public/components/BaseList";
import {
    API_URL,
    app_code,
    billtype,
    COMMON,
    DATA_SOURCE,
    DISABLE_BTN_PARAM,
    LIST,
    modelname,
    module_id,
    nodekey,
    searchCache,
    tableName
} from "../cons/constant";
import { CARD } from "../cons/constant.js";
import { initTemplate, initTemplate1 } from "./events";

let disabledBtnsParam = [...DISABLE_BTN_PARAM]; //复制数组，不然会共用卡片页disabledBtnsParam的引用
disabledBtnsParam.push({
    btnName: ["Delete", "Commit"],
    rules: current => current.vbillstatus && current.vbillstatus.value !== "-1" //待提交才可以删除
});
disabledBtnsParam.push({
    btnName: "Commit",
    rules: current => current.vbillstatus && current.vbillstatus.value !== "-1" //提交
});
disabledBtnsParam.push({
    btnName: ["Uncommit","ApproveDetail"],
    rules: current =>
        current.vbillstatus &&
        current.vbillstatus.value !== "3" &&
        current.vbillstatus.value !== "1" && 
        current.vbillstatus.value !== "2"
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

    componentWillMount() {}

    //根据场景加载相应initTemplate
    getInitTemplate = () => {
        let scene = this.props.getUrlParam("scene");
        let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo");
        if (pk_ntbparadimvo || scene === "linksce") {
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


    /**查询区渲染完成回调函数 */
    myRenderCompleteEvent = function() {
        let muti = this.props.MutiInit.getIntl(module_id); //this.moduleId
        let money = muti && muti.get("36180BPB-000013") /* 国际化处理： 票据金额*/;
        let start = muti && muti.get("36180BPB-000014") /* 国际化处理： 开始*/;
        let end  = muti && muti.get("36180BPB-000015") /* 国际化处理： 结束*/;
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
                    name: "DTJ",
                    title:
                        this.props.MutiInit.getIntl("36180BPB") &&
                        this.props.MutiInit.getIntl("36180BPB").get(
                            "36180BPB-000009"
                        )
                } /* 国际化处理： 待提交*/ /* 国际化处理： 待提交*/,
                {
                    key: "2,3",
                    name: "SPZ",
                    title:
                        this.props.MutiInit.getIntl("36180BPB") &&
                        this.props.MutiInit.getIntl("36180BPB").get(
                            "36180BPB-000010"
                        )
                } /* 国际化处理： 审批中*/ /* 国际化处理： 审批中*/,
                {
                    key: "all",
                    title:
                        this.props.MutiInit.getIntl("36180BPB") &&
                        this.props.MutiInit.getIntl("36180BPB").get(
                            "36180BPB-000011"
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
                    cardpageId: CARD.page_id,
                    appcode: app_code,
                    moduleId: module_id,
                    searchId: LIST.search_id,
                    tableId: LIST.table_id,
                    pageId: LIST.page_id,
                    cardPageCode: CARD.page_id,
                    nodekey: nodekey, //打印输出编码
                    dataSource: DATA_SOURCE, //缓存key
                    searchCache, //查询区缓存
                    modelname, //模块名称
                    // oid: LIST.search_oid, //查询区oid
                    primaryId: LIST.primary_id,
                    billNo: LIST.billno, //单据编号
                    billstatus: LIST.billstatus, //单据编号
                    API_URL: API_URL, //接口地址
                    disabledBtn: LIST.disabled_btn, //默认禁用按钮
                    disabledBtnOne: LIST.disabled_btn_one, //列表只有一条数据的条件，按钮才可用
                    billtype, //单据类型，联查审批详情需要
                    disabledBtnsParam, //根据选中数据判断对应按钮禁用状态
                    fields: COMMON.fields, //字段名
                    tableName
                }}
                _initTemplate={this.getInitTemplate.call(this)}
				_renderCompleteEvent={this.myRenderCompleteEvent}
                pageTitle={
                    this.props.MutiInit.getIntl("36180BPB") &&
                    this.props.MutiInit.getIntl("36180BPB").get(
                        "36180BPB-000007"
                    )
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
                initImport={true}
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