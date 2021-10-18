/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 贷款利息清单列表界面
 * @author：zhangyangz
 */
import React, { Component } from "react";
import { createPage, base, createPageIcon, high } from "nc-lightapp-front";
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../tmpub/pub/util/cache';
import {
    listHeadBtnClick,
    initTemplate,
    searchCommonClick,
    pageInfoClick,
    onRowDoubleClick,
    selectedEvent,
    getCommonDataForLinked,
    selectedEventForReceipt
} from "./events";
import {
    moduleId,
    list,
    baseReqUrl,
    javaUrl,
    printData,
    appCode,linkdataSource,islink,isOneLink,pkName,billType
} from "../cons/constant.js";
import { createListWebSocket,go2CardCheck } from "../../../../tmpub/pub/util/index";
let { PrintOutput,NCUploader} = high;
let { NCAffix ,NCDiv} = base;
class List extends Component {
    constructor(props) {
        super(props);
        this.appCode = appCode; //appCode
        this.tableId = list.tableCode; //table区域
        this.searchId = list.searchCode; //查询区域
        this.pageId = list.pageCode; //list页面code
        this.primaryId = list.primaryId; //主键ID
        this.dataSource = list.listCache; //缓存key
        this.moduleId = moduleId; //多语使用
        this.disabled_btn = list.disabled_btn; //列表禁用按钮
        this.searchKey = list.searchKey; //查询条件缓存key
        this.searchOid = list.searchOid; //列表页面查询区域oid
        this.listUrl = `${baseReqUrl}${javaUrl.list}`; //获取列表url
        this.pksUrl = `${baseReqUrl}${javaUrl.pks}`; //根据pks查询
        this.vouchermakeUrl = `${baseReqUrl}${javaUrl.vouchermake}`; //制证url
        this.vouchercancelUrl = `${baseReqUrl}${javaUrl.vouchercancel}`; //取消制证url
        this.printUrl = `${baseReqUrl}${javaUrl.print}`; //打印url
        this.pksUrl = `${baseReqUrl}${javaUrl.pks}`; //pks查询url
        this.elecPrintUrl = `${baseReqUrl}${javaUrl.elecPrint}`;//正式打印url
        this.printData = printData;
        this.islink = islink;
        this.linkdataSource = linkdataSource;
        this.isOneLink = isOneLink;
        this.state = {
            showUploader: false, //附件上传show
            billInfo: {}, //附件上传信息
            isListFresh: false,
            json: {},
            inlt: null,
            printOut: {
                //打印输出使用
                ...printData,
                outputType: "output"
            }
        };
    }
    componentWillMount() {
        let callback = (json, status, inlt) => {
            // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                initTemplate.call(this, this.props, json, inlt); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
                this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
            } else {
            }
        };
        this.props.MultiInit.getMultiLang({
            moduleId: ["36360FCIB", "3636PUBLIC","36360PUBLIC"],
            domainName: "icdmc",
            callback
        });
    }
    componentDidMount() {
        //利息清单被联查
        let pks = this.props.getUrlParam("id");
        //被内部计息联查
        if (pks) {
            //将联查标志加入缓存
			setDefData(linkdataSource, islink, true);
            let searchData = {
                querycondition: {
                    logic: "and",
                    conditions: [
                        {
                            field: "pk_interestlisticdmc", //单据主键
                            value: { firstvalue: pks, secondvalue: "" },
                            oprtype: "="
                        }
                    ]
                },
                pageInfo: this.props.table.getTablePageInfo(this.tableId),
                oid: this.searchOid,
                pageCode: this.pageId,
                queryAreaCode: this.searchId, //查询区编码
                querytype: "tree"
            };
            getCommonDataForLinked.call(this, this.listUrl, searchData);
        }
    }

    //列表行双击事件
	onRowDoubleClick = (record,index,props,e) =>{
		let pk = record.pk_interestlisticdmc.value;
		let type = this.props.getUrlParam('type');
		let src = props.getUrlParam('scene');


		go2CardCheck({
            props,
            url: '/nccloud/icdmc/interestlist/check2card.do',
            pk: record.pk_interestlisticdmc.value,
            ts: record.ts.value,
            //checkTS: record.ts.value ? true : false,
            checkTS: false,
            checkSaga: false,
            fieldPK: 'pk_interestlisticdmc',
            go2CardFunc: () =>{
                props.pushTo("/card", {
                    status: "browse",
                    id: record[this.primaryId].value,
                    pagecode: this.pageId
               });
           }	
       })  
	}

    render() {
        let { table, button, search ,BillHeadInfo,socket} = this.props;
        let { createSimpleTable, getTablePageInfo } = table;
        let { NCCreateSearch } = search;
        let { createButton, getButtons, createButtonApp } = button;
        let { tabKey, tabStatus, printOut,showUploader,billInfo} = this.state;
        let islinked = getDefData(linkdataSource, islink);
        const { createBillHeadInfo } = BillHeadInfo;
        return (
            <div className="nc-bill-list">
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                        <div className="header-title-search-area">
                            {/*页面大图标*/}
                            {createBillHeadInfo(
                                {
                                    title:this.state.json["36360FCIB-000000"] /*多语适配：内部利息清单 */,
                                    initShowBackBtn: false
                                }
                            )}
                        </div>
                        <div className="header-button-area">
                            {createButtonApp({
                                area: list.btnCode,
                                onButtonClick: listHeadBtnClick.bind(this)
                            })}
                        </div>
                </NCDiv>
                {!islinked && <div className="nc-bill-search-area">
                    {
                        NCCreateSearch(this.searchId, {
                            clickSearchBtn: searchCommonClick.bind(this),
                            showAdvBtn: true, //  显示高级按钮
                            // searchBtnName: this.state.json["36360FCIB-000007"] /* 国际化处理： 查询*/,
                            oid: list.searchOid //查询模板的oid，用于查询查询方案
                        })}
                </div>}
                {/* {socket.connectMesg({
					tableAreaCode: this.tableId,
					tablePkName: pkName ,
                    billtype: billType,
                    dataSource: this.dataSource
                })} */}
                
                {createListWebSocket(this.props, {
					tableAreaCode: this.tableId,
					tablePkName: pkName ,
                    billtype: billType,
                    dataSource: this.dataSource
				})}

                <div className="nc-bill-table-area">
                    {createSimpleTable(this.tableId, {
                        handlePageInfoChange: pageInfoClick.bind(this),
                        showCheck: true,
                        showIndex: true,
                        dataSource: this.dataSource,
                        pkname: this.primaryId,
                        onSelected: selectedEventForReceipt.bind(this),
                        onSelectedAll: selectedEventForReceipt.bind(this),
                        onRowDoubleClick: this.onRowDoubleClick.bind(this),
                        componentInitFinished:selectedEventForReceipt.bind(this,this.props)
                        // componentInitFinished: () => {
                            //缓存数据赋值成功的钩子函数
                            //若初始化数据后需要对数据做修改，可以在这里处理
                        // }
                    })}
                </div>
                <PrintOutput
                    ref="printOutput"
                    url={`${this.printUrl}.do`}
                    data={printOut}
                />
                {showUploader && (
                    <NCUploader
                        placement={"bottom"}
                        {...billInfo}
                        onHide={() => {
                            this.setState({
                                showUploader: false
                            });
                        }}
                    />
                )}
            </div>
        );
    }
}

List = createPage({
    mutiLangCode: moduleId
})(List);

export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/