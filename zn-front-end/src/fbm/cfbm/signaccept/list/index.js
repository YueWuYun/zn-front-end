/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 开票申请受理列表页
 created by：chenmcht 2019-11-08
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
    searchCache
} from "../cons/constant";
import { initTemplate, selectedEvent } from "./events";

let disabledBtnsParam = [...DISABLE_BTN_PARAM]; //复制数组，不然会共用卡片页disabledBtnsParam的引用



disabledBtnsParam.push({
    btnName: ["Accept"],
    rules: current => current.dealsign.value || current.busistatus.value == "6"

});

disabledBtnsParam.push({
    btnName: ["UnAccept"],
    rules: current => !(current.dealsign.value && current.vbillstatus.value == "-1")
});

disabledBtnsParam.push({
    btnName: ["Return"],
    rules: current => !(current.busistatus.value == "6" || current.dealsign.value == false)
});


disabledBtnsParam.push({
    btnName: ["Commission"],
    rules: current => !(current.vbillstatus.value == "1" && current.isacceptednow.value == false && current.busistatus.value != "3")
});

disabledBtnsParam.push({
    btnName: ["CommissionCancel"],
    rules: current => !(current.busistatus.value == "3")
});

disabledBtnsParam.push({
    btnName: ["Commit"],
    rules: current => !(current.vbillstatus.value == "-1" && current.dealsign.value)
});
disabledBtnsParam.push({
    btnName: ["Uncommit"],
    rules: current => !((current.vbillstatus.value == "3" || current.vbillstatus.value == "1") && !current.signflag.value && current.busistatus.value != "3")
});

disabledBtnsParam.push({
    btnName: ["SignLink"],
    rules: current => !(current.isacceptednow.value && current.vbillstatus.value == "1" && !current.signflag.value)
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
    myRenderCompleteEvent = function () {
        let muti = this.props.MutiInit.getIntl(module_id); //this.moduleId
        let amount = muti && muti.get("36370IFBAD-000008") /* 国际化处理： 申请金额*/;
        let start = muti && muti.get("36370IFBAD-000009") /* 国际化处理： 开始*/;
        let end = muti && muti.get("36370IFBAD-000010") /* 国际化处理： 结束*/;
        this.props.search.setTemlateByField(this.searchId,
            'amount', 'defaultPlaceholder', { start: amount + start, end: amount + end })
        this.renderCompleteEvent();
    }
    render() {

        let multiLang = this.props.MutiInit.getIntl(module_id);

        const tabs = {
            defaultKey: "10",
            allKey: "all",
            items: [
                {
                    key: "10",
                    name: "tab03",
                    title: multiLang && multiLang.get("36370IFBAD-000011")
                } /* 国际化处理： 待受理*/,
                {
                    key: "11",
                    name: "tab01",
                    title: multiLang && multiLang.get("36370IFBAD-000005")
                } /* 国际化处理： 待提交*/,
                {
                    key: "2,3",
                    name: "tab02",
                    title: multiLang && multiLang.get("36370IFBAD-000006")
                } /* 国际化处理： 审批中*/,
                {
                    key: "all",
                    title: multiLang && multiLang.get("36370IFBAD-000007")
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
                    pk_inbalaacc: LIST.pk_inbalaacc,//内部结算账户的主键
                    modelname, //模块名称
                    disabledBtnsParam, //根据选中数据判断对应按钮禁用状态
                    tabStatus: LIST.tabStatus, //用于待受理页签
                    dealsign: LIST.dealsign,
                    vbillstatus: LIST.vbillstatus,
                    dealsignY: LIST.dealsignY,
                    cardpageId: CARD.page_id,
                    pk_insecurityacc: LIST.pk_securityacc,
                    returnReason: LIST.returnReason
                }}
                _initTemplate={initTemplate}
                _selectedEvent={selectedEvent}
                _renderCompleteEvent={this.myRenderCompleteEvent}
                pageTitle={multiLang && multiLang.get("36370IFBAD-000002")} //页面标题
                headBtnArea={LIST.head_btn_code} //表头按钮区域
                listTabs={tabs}
                initImport={false} //导入导出
                linkItems={["approveDetail"]} //联查显示的组件
                {...this.props}
            />
        );
    }
}

List = createPage({
    mutiLangCode: "36370IFBAD"
})(List);
export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/