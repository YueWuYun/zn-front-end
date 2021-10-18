/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, cacheTools } from 'nc-lightapp-front';
import { cardCache, getMultiLang } from 'nc-lightapp-front';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
//引入常量定义
const { NCDiv } = base;
import {SCENE, URL_PARAM} from '../../../../tmpub/pub/cons/constant.js';
import { high } from 'nc-lightapp-front';
import {
	buttonClick,
	initTemplate,
	searchBtnClick,
	pageInfoClick,
	tableModelConfirm,
	tableButtonClick,
	buttonUsability
} from './events';
let { setDefData, getDefData } = cardCache;
const { PrintOutput } = high;
import { BBP_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../cons/constant.js';
const {APPCODE, LIST_PAGECODE, SEARCH_CODE, LIST_TABLECODE,PRINT_FUNCODE, PRINT_NODEKEY, PRINT_TEMPLATEID } = APP_INFO;
const {BBP_CACHEKEY, BBP_PKNAMEKEY, BBP_STATEKEY, LINK_KEY, SEARCH_KEY } = BBP_CONST;
const { QUERY, DELETE, PRINT } = REQUEST_URL;
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD;
import  {go2Card}  from '../util/goToCard.js';
class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = '3607';
		this.searchId = SEARCH_CODE;
		this.tableId = LIST_TABLECODE;
		this.pageId = LIST_PAGECODE;
		this.state = {
			currentLocale: 'zh-CN',
			billno: null, // 单据编号
			target: null,
			billId: '',
			billid: '',
			billtype: '',
			tpflag: true,
			show: false,
			sourceData: null,
			last_pk: null,
			billCode: '',
			record: null,
			index: null,
			activeKey: '0',
			outputData: {
				funcode: PRINT_FUNCODE, //功能节点编码，即模板编码
				nodekey: PRINT_NODEKEY, //模板节点标识
				printTemplateID: PRINT_TEMPLATEID, //模板id
				oids: [],
				outputType: 'output'
			}, // 输出数据
			json: {}, // 多语
		};
		initTemplate.call(this, props);
	}

	componentDidMount() {

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

	// 刷新
	refresh = () => {
		let oid 
		if (this.props.meta.getMeta()[SEARCH_CODE].oid) {
			oid = this.props.meta.getMeta()[SEARCH_CODE].oid; //动态获取oid
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
						if (data.statusNum) {
							this.setState({ numvalues: data.statusNum });
						}
					} else {
						this.props.table.setAllTableData(LIST_TABLECODE, { rows: [] });
					}
				}
			}
		});
	};

	cancel = () => {
		this.setState({
			shoWIns: false
		});
	};

	// 还原列表页数据
	restoreData = () => {
		//获取页签数据
		let cachestate = getDefData(BBP_STATEKEY, BBP_CACHEKEY);
		if (cachestate) {
			let keys = Object.keys(cachestate);
			for (let i = 0, l = keys.length; i < l; i++) {
				let key = keys[i];
				this.state[key] = cachestate[key];
			}
		}
	};
	// 查询区渲染完成回调函数
	renderCompleteEvent = () => {
		let cachesearch = getDefData(SEARCH_KEY, BBP_CACHEKEY);
		if (cachesearch && cachesearch.conditions) {
			// this.props.search.setSearchValue(SEARCH_CODE, cachesearch);
			for (let item of cachesearch.conditions) {
				if (item.field == 'bill_date') {
					// 时间类型特殊处理
					let time = [];
					time.push(item.value.firstvalue);
					time.push(item.value.secondvalue);
					this.props.search.setSearchValByField(SEARCH_CODE, item.field, {
						display: item.display,
						value: time
					});
				} else {
					this.props.search.setSearchValByField(SEARCH_CODE, item.field, {
						display: item.display,
						value: item.value.firstvalue
					});
				}
			}
		}
	};
	
	turnOff = () => {
		this.setState({
			compositedisplay: false
		});
	};

	DoubleClick = (record, index, props, e) => {
		let ISlINK = getDefData(LINK_KEY, BBP_CACHEKEY);
			if(ISlINK) {
				props.pushTo('/card', {
					pagecode: CARD__PAGECODE,
					status: 'browse',
					id: record[PK_NAME].value,
					scene: 'linksce'
				});

     }else {
		// this.setStateCache();

		go2Card(props,{ pagecode: CARD_PAGECODE,	status: 'browse',id: record[PK_NAME].value,} ,{} );
		// props.pushTo('/card', {
		// 	pagecode: CARD_PAGECODE,
		// 	status: 'browse',
		// 	id: record[PK_NAME].value,
		// 	// bill_status: record.bill_status.value,
		// 	// is_cf: record.is_cf.value
		// });
	}
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
					<div className="header-title-search-area">
						<h2 className="title-search-detail">
							{createBillHeadInfo(
								{
									title: this.state.json['36070BBP-000000'],
									// loadMultiLang(this.props, '36070BBP-000000'),//国际化处理： 现金缴存
									initShowBackBtn: false
								}
							)}
						</h2>
					</div>
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
				{(
					<div className="nc-bill-search-area">
						{NCCreateSearch(SEARCH_CODE, {
							clickSearchBtn: searchBtnClick.bind(this),
							// defaultConditionsNum: 2,
							showAdvBtn: true //  显示高级按钮
							//onAfterEvent: onSearchAfterEvent.bind(this),  //编辑后事件
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

				<div className="nc-bill-table-area">
					{createSimpleTable(LIST_TABLECODE, {
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						onRowDoubleClick: this.DoubleClick.bind(this),
						showCheck: true,
						showIndex: true,
						dataSource: BBP_CACHEKEY,
						pkname: PK_NAME,
						onSelected: buttonUsability.bind(this, this.props, null),
						onSelectedAll: buttonUsability.bind(this, this.props, null)
					})}
				</div>
				
				<div>
					<PrintOutput
						ref="printOutput"
						url={PRINT}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
				
				<div />
				
			</div>
		);
	};
}

List = createPage({
	//initTemplate: initTemplate,
	mutiLangCode: APPCODE
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/