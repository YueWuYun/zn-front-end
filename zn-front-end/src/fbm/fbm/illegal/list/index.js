/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 整表编辑列表组件
 * @author dongyue7
 */

import { base, createPage, high } from "nc-lightapp-front";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { list, searchCache } from "../cons/constant";
import { afterEvent } from "./events/afterEvent";
import { buttonClick } from "./events/buttonclick";
import { listButtonVisible } from "./events/buttonVisible";
import initTemplate from "./events/initTemplate";
import { searchButtonClick } from "./events/search";

const { ExcelImport } = high;
let { NCUploader } = high;

let { NCAffix, NCDiv } = base;

class List extends Component {
    constructor(props) {
        super(props);
        this.tableId = list.tableCode;
        this.searchId = list.searchCode;
        this.pageid = list.pageCode;
        this.appcode = '';
        this.selectedPKS = [];
        this.searchCache = searchCache;
        this.state = {
            delRowpks: [],
            delRows: [],
            billtype: "36HO",
            // 附件相关 start
            //单据pk
            billId: "",
            billts: "",
            //附件管理使用单据编号
            billno: "",
            //控制附件弹出框
            showUploader: false,
            //控制弹出位置
            target: null
            // 附件相关 end
        };
        let _appcode = props.getSearchParam("c") || props.getUrlParam("c");
        this.appcode = _appcode;
        initTemplate.call(this, props);
    }

    componentDidMount() {
        listButtonVisible.call(this, this.props);
    }

    // 附件的关闭点击
    onHideUploader = () => {
        this.setState({
            showUploader: false
        });
    };
    //查询区渲染完成之后的回调事件
    renderCompleteEvent = () =>{
        let muti = this.props.MutiInit.getIntl("361805IBR");
        let money = muti && muti.get("361805IBR-000021") /* 国际化处理： 票据金额*/;
        let start = muti && muti.get("361805IBR-000022") /* 国际化处理： 开始*/;
        let end  = muti && muti.get("361805IBR-000023") /* 国际化处理： 结束*/;
        this.props.search.setTemlateByField(this.searchId,
            'moneyy','defaultPlaceholder',{start: money+start,end: money+end})
    }
    render() {
        let { button, search, editTable, ncmodal, BillHeadInfo } = this.props;
        let { createModal } = ncmodal;
        let { showSearch, showUploader, target, billno, billId } = this.state;
        let { createEditTable } = editTable;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        const { createBillHeadInfo } = BillHeadInfo;
        let muti = this.props.MutiInit.getIntl("361805IBR");
        return (
            <div className="nc-single-table">
                {/* 标题及肩部按钮区域 */}
                <NCAffix>
                    <NCDiv
                        areaCode={NCDiv.config.HEADER}
                        className="nc-singleTable-header-area"
                    >
                        <div className="header-title-search-area">
                            {createBillHeadInfo({
                                title:
                                    muti &&
                                    muti.get(
                                        "361805IBR-000000"
                                    ) /* 国际化处理： 非法票据登记*/,
                                initShowBackBtn: false
                            })}
                        </div>
                        <div className="header-button-area">
                            {createButtonApp({
                                area: "page_header",
                                onButtonClick: buttonClick.bind(this)
                            })}
                        </div>
                    </NCDiv>
                </NCAffix>
                {/* 查询区域 */}
                <div className="nc-singleTable-search-area">
                    {NCCreateSearch(this.searchId, {
                        oid: this.searchOid,
                        showAdvBtn: false,
                        showClearBtn: true,
                        clickSearchBtn: searchButtonClick.bind(this),
                        renderCompleteEvent:this.renderCompleteEvent, //查询区渲染完成之后的回调事件
                    })}
                </div>
                {/* 表体区域 */}
                <div className="nc-singleTable-table-area">
                    {createEditTable(this.tableId, {
                        showCheck: true,
                        showIndex: true,
                        adaptionHeight: true,
                        onSelected: listButtonVisible.bind(this),
                        onSelectedAll: listButtonVisible.bind(this),
                        onAfterEvent: afterEvent.bind(this)
                    })}
                </div>
                {/* {导入} */}
                {createModal("importModal", {
                    noFooter: true,
                    className: "import-modal",
                    hasBackDrop: false
                })}
                <ExcelImport
                    {...Object.assign(this.props)}
                    moduleName="fbm" //模块名
                    billType={this.state.billtype} //单据类型
                    pagecode={this.pageid}
                    appcode={this.appcode}
                    selectedPKS={this.selectedPKS}
                />
                {/* 这里是附件上传组件的使用，需要传入三个参数 */}
                {showUploader && (
                    <NCUploader
                        billId={billId}
                        target={target}
                        placement={"bottom"}
                        billNo={billno}
                        onHide={this.onHideUploader}
                    />
                )}
            </div>
        );
    }
}

List = createPage({
    mutiLangCode: "361805IBR"
})(List);
//export default List;
ReactDOM.render(<List />, document.querySelector("#app"));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/