/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/

import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseList from "../../../public/components/BaseList";
import { CARD } from "../../acceptback/cons/constant";
import {
    API_URL,
    app_code,
    billtype,
    COMMON,
    DATA_SOURCE,
    DISABLE_BTN_PARAM,
    fullAggClassName,
    LIST,
    modelname,
    module_id,
    nodekey,
    searchCache,
    tableName
} from "../cons/constant";
import { selectedEvent, initTemplate, initTemplate1 } from "./events";
let disabledBtnsParam = [...DISABLE_BTN_PARAM]; //复制数组，不然会共用卡片页disabledBtnsParam的引用
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
        if (pk_ntbparadimvo || (scene === "linksce" || scene === "fip")) {
            return initTemplate1;
        } else {
            //预算反联查单据
            return initTemplate;
        }
    };


    /**查询区渲染完成回调函数 */
    myRenderCompleteEvent = function () {
        let muti = this.props.MutiInit.getIntl(module_id); 
        let money = muti && muti.get("36370BPR-000008") /* 国际化处理： 退票金额*/;
        let start = muti && muti.get("36370BPR-000009") /* 国际化处理： 开始*/;
        let end = muti && muti.get("36370BPR-000010") /* 国际化处理： 结束*/;
        this.props.search.setTemlateByField(this.searchId,
            'money', 'defaultPlaceholder', { start: money + start, end: money + end })
        this.renderCompleteEvent();
    }
    
    render() {
        const pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
        return (
            <BaseList
                json={this.state.json}
                inlt={this.state.inlt}
                constant={{
                    modulecode: "3637",
                    appcode: app_code,
                    cardPageCode: CARD.page_id,
                    moduleId: module_id,
                    searchId: LIST.search_id,
                    tableId: LIST.table_id,
                    pageId: LIST.page_id,
                    cardpageId: CARD.page_id,
                    nodekey: nodekey,                               //打印输出编码
                    dataSource: DATA_SOURCE,                        //缓存key
                    searchCache,                                    //查询区缓存
                    // oid: LIST.search_oid,                           //查询区oid
                    primaryId: LIST.primary_id,
                    pk_insecurityacc: CARD.pk_insecurityacc,        //内部保证金账户ID
                    pk_inbalaacc: CARD.pk_inbalaacc,                //内部结算账户
                    billNo: LIST.billno,                            //单据编号
                    modelname,                                      //模块名称
                    billstatus: LIST.billstatus,                    //单据状态
                    tabStatus: LIST.tabStatus,                      //列表特殊页签规则
                    paymentstatus: LIST.paymentstatus,              // 特殊页签对应的条件
                    API_URL: API_URL,                               //接口地址
                    disabledBtn: LIST.disabled_btn,                 //默认禁用按钮
                    disabledBtnOne: LIST.disabled_btn_one,          //列表只有一条数据的条件，按钮才可用
                    billtype,                                       //单据类型，联查审批详情需要
                    disabledBtnsParam,                              //根据选中数据判断对应按钮禁用状态
                    fields: COMMON.fields,                          //字段名
                    fullAggClassName: fullAggClassName,             //联查预算
                    tableName,
                    tallyPlan: LIST.tallyPlan
                }}
                _initTemplate={this.getInitTemplate.call(this)}
                _renderCompleteEvent={this.myRenderCompleteEvent}
                pageTitle={
                    this.props.MutiInit.getIntl("36370BPR") &&
                    this.props.MutiInit.getIntl("36370BPR").get("36370BPR-000003")
                } //页面标题/* 国际化处理*/
                headBtnArea={LIST.head_btn_code}                    //表头按钮区域
                _selectedEvent={this.selectedEvent}
                showSearch={!pk_ntbparadimvo}
                //listTabs={!pk_ntbparadimvo ? tabs : undefined}      //反联查不显示tab页签
                linkItems={["approveDetail", "bankBalance", "ntb"]} //联查显示的组件
                initImport={false}
                {...this.props}
            />
        );
    }
}

List = createPage({
    mutiLangCode: "36370BPR"
})(List);
export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/