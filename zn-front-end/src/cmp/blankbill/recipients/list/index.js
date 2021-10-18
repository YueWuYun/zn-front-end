/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, cacheTools, print, toast ,createPageIcon} from 'nc-lightapp-front';
const { NCBreadcrumb, NCTabsControl, NCButton } = base;
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
const NCBreadcrumbItem = NCBreadcrumb.NCBreadcrumbItem;
import { cardCache, getMultiLang } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;
//引入常量定义
const { NCDiv } = base;
import {SCENE,URL_PARAM} from '../../../../tmpub/pub/cons/constant.js';
import { commonurl } from '../../../public/utils/constant';
import { high } from 'nc-lightapp-front';
const {ExcelImport} = high;
const { Refer, NCUploader, BillTrack, ApproveDetail, PrintOutput, Inspection, ApprovalTrans } = high;

import {
	buttonClick,
	initTemplate,
	searchBtnClick,
	pageInfoClick,
	tableModelConfirm,
	tableButtonClick,
	buttonUsability
} from './events';
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index"
const NCTabPane = NCTabs.NCTabPane;
import InvoiceLink from 'sscrp/rppub/components/invoice-link'
import { BBR_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../cons/constant.js';
const { APPCODE, LIST_PAGECODE, SEARCH_CODE, LIST_TABLECODE, CARD__PAGECODE } = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD
const { BBR_CACHEKEY,BBR_PKNAMEKEY,BBR_STATEKEY,SEARCH_KEY,LINK_KEY,SAVED,APPROVING } = BBR_CONST
const { QUERY, QUERYCARD, SAVE, DELETE, PRINT } = REQUEST_URL;
import  {go2Card}  from '../util/goToCard.js';

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = APPCODE;
		this.searchId = SEARCH_CODE;
		this.tableId = LIST_TABLECODE;
		this.pageId = LIST_PAGECODE;
		this.navChange = '0';
		this.selectedPKS= []; //导出数据的主键pk
		this.state = {
			currentLocale: 'zh-CN',
			numvalues: {},
			billno: null, // 单据编号
			billId: '',
			billid: '',
			billtype: '',
			tradetype: '',
			tpflag: true,
			show: false,
			sourceData: null,
			last_pk: null,
			billCode: '',
			compositedata: '',
			record: null,
			index: null,
			activeKey: '0',
			sscrpLinkInvoiceData:{},
			outputData:'',
			json: {}, // 多语
		};
	}

	componentWillMount() {
		let callback = (json) => {
			this.setState({ json });
			saveMultiLangRes(this.props,json);//缓存多语资源
			initTemplate.call(this, this.props);
		};
		getMultiLang({ moduleId:{ 
			 [ 'tmpub']:['3601'],
			 ['cmp']: [APPCODE, '36070']
			} , callback });
	}

	refresh = () => {
		let oid 
		if (this.props.meta.getMeta()[this.searchId].oid) {
			oid = this.props.meta.getMeta()[this.searchId].oid; //动态获取oid
		}
		//查询condition
		let pageInfo = this.props.table.getTablePageInfo(LIST_TABLECODE);
		let refreshsearchVal = this.props.search.getAllSearchData(SEARCH_CODE);
		let data = {
			querycondition: refreshsearchVal,
			custcondition: {
				logic: 'and', //逻辑操作符，and、or
				conditions: []
			},
			pageInfo: pageInfo,
			pagecode: LIST_PAGECODE,
			queryAreaCode: SEARCH_CODE, //查询区编码
			oid: oid,
			querytype: 'tree'
		};
		ajax({
			url: QUERY,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(LIST_TABLECODE, data.grid[LIST_TABLECODE]);
						this.setState({ last_pk: data.grid[LIST_TABLECODE].allpks[0] });
					} else {
						this.props.table.setAllTableData(LIST_TABLECODE, { rows: [] });
					}
				}
			}
		});
	};
	// 查询区渲染完成回调函数
	renderCompleteEvent = () => {
		let cachesearch = getDefData(SEARCH_KEY, BBR_CACHEKEY);
		if (cachesearch && cachesearch.conditions) {
			// this.props.search.setSearchValue(this.searchId, cachesearch);
			for (let item of cachesearch.conditions) {
				if (item.field == 'bill_date') {
					// 时间类型特殊处理
					let time = [];
					time.push(item.value.firstvalue);
					time.push(item.value.secondvalue);
					this.props.search.setSearchValByField(this.searchId, item.field, {
						display: item.display,
						value: time
					});
				} else {
					this.props.search.setSearchValByField(this.searchId, item.field, {
						display: item.display,
						value: item.value.firstvalue
					});
				}
			}
		}
	};
	
	DoubleClick = (record, index, props, e) => {

		
		go2Card(props,{ pagecode: CARD__PAGECODE,	status: 'browse',id: record[PK_NAME].value,} ,{} );

	
		// props.pushTo('/card', {
		// 	pagecode: CARD_PAGECODE,
		// 	status: 'browse',
		// 	id: record[PK_NAME].value,
		// 	// bill_status: record.bill_status.value,
		// 	// is_cf: record.is_cf.value
		// });
	}
	
	render = () => {

		let { table, button, search, BillHeadInfo } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				{/** 渲染标题栏 **/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					{/* 标题 */}
					<div className="header-title-search-area">
						{createBillHeadInfo(
							{
								title: this.state.json['36070BBR-000000'],
								initShowBackBtn: false
							}
						)}
					</div>
					{/* 按钮区 */}
					<div className="header-button-area">
						<div>
							{createButtonApp({
								area: 'list_head',
								buttonLimit: 12,
								onButtonClick: buttonClick.bind(this)
								//popContainer: document.querySelector('.header-button-area')
							})}
						</div>
					</div>
				</NCDiv>
				{/* 查询区 */}
				{ (
					<div className="nc-bill-search-area">
						{NCCreateSearch(this.searchId, {
							clickSearchBtn: searchBtnClick.bind(this),
							// defaultConditionsNum: 2,
							showAdvBtn: true //  显示高级按钮
							// onAfterEvent: onSearchAfterEvent.bind(this),  //编辑后事件
							//searchBtnName: multiLang && multiLang.get('3618-0029')
							//renderCompleteEvent: this.renderCompleteEvent
							//    查询按钮名称，默认查询
							// showAdvSearchPlanBtn :false,    //高级面板中是否显示保存方案按钮 ;默认显示
							// replaceAdvBtnEve:()=>{},        // 业务组替换高级面板 (fun)
							// replaceAdvBody: this.replaceAdvBody,          // 业务组替换高级面板中的body (fun),return Dom
							// addAdvTabs: this.addAdvTabs,              // 添加高级查询区自定义页签 (fun), return Dom
							// addAdvBody: ()=>{},              // 添加高级查询区自定义查询条件Dom (fun) , return Dom
						})}
					</div>
				)}
				{/* 表格区 */}
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						onRowDoubleClick: this.DoubleClick.bind(this),
						showCheck: true,
						showIndex: true,
						dataSource: BBR_CACHEKEY,
						pkname: PK_NAME,
						onSelected: buttonUsability.bind(this, this.props, null),
						onSelectedAll: buttonUsability.bind(this, this.props, null)
					})}
				</div>
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref = "printOutput"
						url = {PRINT}
						data = {this.state.outputData}
						callback = {this.onSubmit}
					/>
				</div>
			</div>
		);
	};
}

List = createPage({
	//initTemplate: initTemplate,
	mutiLangCode: APPCODE,
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/