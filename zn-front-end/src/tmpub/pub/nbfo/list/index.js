/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/**
 * 非银行金融机构列表
 * @author：dongyue7
 */

import { base, getBusinessInfo, high } from "nc-lightapp-front";
import React, { Component } from "react";
import {
    appCode,
    baseReqUrl,
    card,
    data_source,
    javaUrl,
    list,
    moduleId
} from "../cons/constant.js";
import { buttonClick, initTemplate, pageInfoClick } from "./events";
import { onDblClick, onSearchClick, selectedEvent,onSearchAfterEvent } from "./events/page";
import {
    addNodeCallBack,
    clearSearchVal,
    clickAddIconEve,
    clickEditIconEve,
    delNodeCallBack,
    editNodeCallBack,
    onMouseEnterEve,
    onSelectEve,
    onTreeExpand
} from "./events/treeEvent";
import "./index.less";
let { NCAffix, NCDiv } = base;
let { PrintOutput } = high;

class List extends Component {
    constructor(props) {
        super(props);
        this.tableId = list.tableCode; //table区域
        this.searchId = list.searchCode; //查询区域
        this.pageId = props.pageId || list.pageCode; //list页面code
        this.cardPageId = card.pageCode; //card页面code
        this.primaryId = list.primaryId; //主键ID
        this.dataSource = data_source; //缓存key
        this.disabled_btn = list.disabled_btn; //列表禁用按钮
        this.moduleId = props.moduleId || moduleId; //多语使用
        this.appcode = props.appcode || appCode;
        this.treeId = "tree";
        this.templateId = list.listTemplateId;
        this.businessInfo = getBusinessInfo();
        this.state = {
            pks: [], //后台返回的所有pks
            printOut: {},
            data: {},
            type: "",
            showToast: true,
            langSeq: "",
            context: {} // 全局上下文 为获取当前使用的组织
        };
        if (props.pageType === "org") {
            //集团
            this.appcode = "36010NBFOO";
            this.pageId = "36010NBFOO_list";
            this.nodekey = "36010NBFOO_card";
            this.dataSource = "tm.pub.interestrateOrg.datasource";
        } else if (props.pageType === "group") {
            //全局
            this.appcode = "36010NBFOG";
            this.pageId = "36010NBFOG_list";
            this.nodekey = "36010NBFOG_card";
            this.dataSource = "tm.pub.interestrateGroup.datasource";
        }
    }

    componentWillMount() {
        let callback = (json, status, inlt) => {
            if (status) {
                this.setState({ json, inlt }, () => {
                    initTemplate.call(this, this.props, json);
                });
            } else {
                //console.log("未加载到多语资源");
            }
        };
        this.props.MultiInit.getMultiLang({
            moduleId: [this.moduleId, "36010PUBLIC", "36010NBFO"],
            domainName: "tmpub",
            callback
        });
    }

    render() {
        let {
            table,
            button,
            search,
            syncTree,
            DragWidthCom,
            BillHeadInfo
        } = this.props;
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        let { printOut } = this.state;
        let { createSyncTree } = syncTree;
        const { createBillHeadInfo } = BillHeadInfo;
        return (
            <div className="nc-bill-list nbfo-list">
                <NCAffix>
                    <NCDiv
                        areaCode={NCDiv.config.HEADER}
                        className="nc-bill-header-area"
                    >
                        <div className="header-title-search-area">
                            {createBillHeadInfo({
                                title:
                                    this.state.json &&
                                    this.state.json[this.props.pageTitle],
                                initShowBackBtn: false
                            })}
                        </div>
                        <div className="header-button-area">
                            {createButtonApp({
                                area: list.btnCode,
                                onButtonClick: buttonClick.bind(this)
                            })}
                        </div>
                    </NCDiv>
                </NCAffix>
                <div className="nc-bill-search-area">
                    {NCCreateSearch(this.searchId, {
                        onAfterEvent: onSearchAfterEvent.bind(this),
                        clickSearchBtn: onSearchClick.bind(this),
                        showAdvBtn: true
                    })}
                </div>
                <div className="nc-bill-table-area">
                    <DragWidthCom
                        // 左树区域
                        style={{ height: "100%" }}
                        leftDom={
                            <div className="tree-area">
                                {createSyncTree({
                                    treeId: "tree", //树id
                                    metaId: "treeForm", //弹出框的fomrId
                                    modalSize: "senior", //模态框size
                                    searchType: "filtration", //搜索查询方式(location/filtration)
                                    needEdit: true, //启用编辑
                                    showLine: true, //显示连线
                                    needSearch: true, //是否需要搜索框,
                                    showModal: true, //是否使用弹出式编辑
                                    verifyModalForm: true, //是否自己控制模态框开关
                                    hiddenDefaultIcon: true, //隐藏默认的文件夹图标
                                    clearSearchVal: clearSearchVal.bind(this), //清空搜索框回调方法
                                    onSelectEve: onSelectEve.bind(this), //选择节点回调方法
                                    addNodeCallBack: addNodeCallBack.bind(this), //新增节点回调方法
                                    delNodeCallBack: delNodeCallBack.bind(this), //删除节点回调方法
                                    editNodeCallBack: editNodeCallBack.bind(
                                        this
                                    ), //编辑节点回调方法
                                    onMouseEnterEve: onMouseEnterEve.bind(this), //鼠标滑过节点事件
                                    onTreeExpand: onTreeExpand.bind(this), //展开节点事件
                                    clickEditIconEve: clickEditIconEve.bind(
                                        this
                                    ), //编辑点击回调
                                    clickAddIconEve: clickAddIconEve.bind(this) //新增点击回调
                                })}
                            </div>
                        } //左侧区域dom
                        // 右列表
                        rightDom={
                            <div className="table-area">
                                {createSimpleTable(this.tableId, {
                                    showCheck: true,
                                    showIndex: true,
                                    onSelected: selectedEvent.bind(
                                        this,
                                        this.props
                                    ),
                                    onSelectedAll: selectedEvent.bind(
                                        this,
                                        this.props
                                    ),
                                    onRowDoubleClick: onDblClick.bind(this),
                                    handlePageInfoChange: pageInfoClick.bind(
                                        this
                                    ),
                                    dataSource: this.dataSource,
                                    pkname: this.primaryId,
                                    componentInitFinished: () => {
                                        //缓存数据赋值成功的钩子函数
                                        //若初始化数据后需要对数据做修改，可以在这里处理
                                    }
                                })}
                            </div>
                        } //右侧区域dom
                        defLeftWid="20%" // 默认左侧区域宽度，px/百分百
                    />
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
export default List;
// export default createPage(
// 	{
// 		// mutiLangCode: moduleId
// 	}
// )(List);

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/