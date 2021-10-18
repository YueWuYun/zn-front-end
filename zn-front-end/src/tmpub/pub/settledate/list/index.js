/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/**
 * 结息日列表
 * @author：dongyue7
 */

import React, { Component } from "react";
import { createPage, base, high, createPageIcon } from "nc-lightapp-front";
import {
    moduleId,
    list,
    baseReqUrl,
    javaUrl,
    card,
    searchCache,
    insPrintData
} from "../cons/constant.js";
import { onSearchAfterEvent } from "./events/afterSearchEvent";
import listHeadBtnClick from "../../public/container/list/listHeadBtnClick";
import {
    searchBtnOperation,
    pageInfoClick
} from "../../public/container/list/search";
import initTemplate from "./events/initTemplate.js";
let { NCAffix, NCDiv } = base;
let { PrintOutput } = high;

class List extends Component {
    constructor(props) {
        super(props);
        this.tableId = list.tableCode; //table区域
        this.searchId = list.searchCode; //查询区域
        this.pageId = list.pageCode; //list页面code
        this.primaryId = list.primaryId; //主键ID
        this.disableBtn = list.disabled_btn; //禁用按钮
        this.dataSource = list.listCache; //缓存key
        this.moduleId = moduleId; //多语使用
        this.searchCache = searchCache; //查询区缓存
        this.list = list; //列表页相关编码
        this.card = card; //卡片页相关编码
        this.baseUrl = baseReqUrl; //请求基础路径
        this.javaUrl = javaUrl; //请求接口
        this.printData = insPrintData; //打印传参
        this.state = {
            billInfo: {}, //附件上传信息
            pks: [], //后台返回的所有pks
            printOut: {
                //打印输出使用
            },
            showToast: true,
            json: {}, //多语json
            inlt: null //多语占位符
        };
        // initTemplate.call(this, props);
    }

    componentWillMount() {
        let callback = (json, status, inlt) => {
            // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                initTemplate.call(this, this.props, json, inlt); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
                this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
            } else {
                //console.log("未加载到多语资源"); // 未请求到多语资源的后续操作
            }
        };
        this.props.MultiInit.getMultiLang({
            moduleId: [this.moduleId, "36010PUBLIC"],
            domainName: "tmpub",
            callback
        });
    }

    componentDidMount() {
        //
    }

    /**
     * 列表选择事件，用于通过勾选判断肩部按钮置灰
     * @param {*} props  页面内置对象
     */
    selectedEvent(props, moduleId, record, index, status) {
        let selectDatas = props.table.getCheckedRows(this.tableId);
        let disabledBtn = this.disableBtn.filter(item => item !== "refresh");
        if (selectDatas.length === 0) {
            props.button.setButtonDisabled(disabledBtn, true);
        } else {
            props.button.setButtonDisabled(disabledBtn, false);
        }
    }

    //行双击事件
    onDblClick = (record, index, props, e) => {
        props.pushTo("/card", {
            status: "browse",
            id: record[this.primaryId].value,
            pagecode: card.pageCode,
            sysMark: record.advanceddata.value
        });
    };

    //查询按钮
    onSearchClick = () => {
        this.setState({ showToast: true });
        searchBtnOperation.call(this, this.props);
    };

    render() {
        let { table, button, search, BillHeadInfo } = this.props;
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        let { printOut } = this.state;
        const { createBillHeadInfo } = BillHeadInfo;
        return (
            <div className="nc-single-table">
                <NCAffix>
                    <NCDiv
                        areaCode={NCDiv.config.HEADER}
                        className="nc-singleTable-header-area"
                    >
                        <div className="header-title-search-area">
                            {createBillHeadInfo({
                                title: this.state.json[
                                    "36010ISDC-000020"
                                ] /* 国际化处理： 结息日*/,
                                initShowBackBtn: false
                            })}
                        </div>
                        <div className="header-button-area">
                            {createButtonApp({
                                area: list.btnCode,
                                onButtonClick: listHeadBtnClick.bind(this)
                            })}
                        </div>
                    </NCDiv>
                </NCAffix>
                <div className="nc-singleTable-search-area">
                    {NCCreateSearch(this.searchId, {
                        clickSearchBtn: this.onSearchClick,
                        showAdvBtn: true,
                        onAfterEvent: onSearchAfterEvent.bind(this),
                        oid: list.searchOid
                    })}
                </div>
                <div className="nc-singleTable-table-area">
                    {createSimpleTable(this.tableId, {
                        handlePageInfoChange: pageInfoClick.bind(this),
                        showCheck: true,
                        showIndex: true,
                        onSelected: this.selectedEvent.bind(this, this.props),
                        onSelectedAll: this.selectedEvent.bind(
                            this,
                            this.props
                        ),
                        dataSource: this.dataSource,
                        pkname: this.primaryId,
                        onRowDoubleClick: this.onDblClick.bind(this),
                        componentInitFinished: () => {
                            //缓存数据赋值成功的钩子函数
                            //若初始化数据后需要对数据做修改，可以在这里处理
                        }
                    })}
                </div>
                <PrintOutput
                    ref="printOutput"
                    url={`${baseReqUrl}${javaUrl.print}.do`}
                    data={printOut}
                />
            </div>
        );
    }
}

List = createPage({
    // mutiLangCode: moduleId
})(List);

export default List;

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/