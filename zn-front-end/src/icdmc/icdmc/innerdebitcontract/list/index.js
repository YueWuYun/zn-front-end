/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, toast, base, high, cardCache, getMultiLang, deepClone, cacheTools, createPageIcon } from 'nc-lightapp-front';
import { constant, requesturl, buttonDisable }  from '../config/config';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, setButtonUsability, onrowDoubleclick } from './events';
let { setDefData, getDefData } = cardCache;
const { NCUploader, PrintOutput } = high;
const { NCModal, NCBackBtn, NCAffix, NCScrollElement, NCDiv } = base;

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pagecode = constant.lpagecode;
		this.searchId = constant.searchcode;
		this.tableId = constant.ltablecode;
		this.formId = constant.formcode1;
		this.tablecode_plan = constant.tablecode_plan;
		this.tablecode_exe = constant.tablecode_exe;
		this.cacheDataSource = constant.cacheDataSource;
		this.pkname = constant.pkname;
		this.pk = null;
		this.ts = null;
		this.index = null;
		this.state = {
			billId:'', //单据id
			billno: '' , // 单据编号
			showUploader: false, // 附件上传弹框显示
			target: null,
			outputData: '', // 输出数据
			showOriginal:false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData:[], // 联查余额取数据，将需要联查的数据赋值给我
			json: {}, // 多语
			inlt: null,
			showModalVersionCard: false
		};
	}

	// 关闭损益记录查询框
	// closeVersionCard() {
	// 	this.setState({ showModalVersionCard: false });
	// }
	
	// 打开损益记录查询框
	// openVersionCard() {
	// 	this.setState({ showModalVersionCard: true });
	// }

	//操作列多语不显示
	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				//console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		}
		getMultiLang({ moduleId: constant.mutiLangCode, domainName: 'icdmc', callback });
	}

	componentDidMount() {
		setButtonUsability.call(this, this.props);
	}

	// 组装查询条件参数
	getsearchdata = (searchVal,pageInfo) =>{
		let queryInfo = this.props.search.getQueryInfo(this.searchId, false);
		let oid=queryInfo.oid;
		let searchdata = {
			querycondition: searchVal,
			custcondition: {
				logic: 'and', //逻辑操作符，and、or
				conditions: []
			},
			pageInfo: pageInfo,
			pageCode: constant.lpagecode,
			appregisterPk: constant.appregisterpk,
			appcode: constant.appcode,
			queryAreaCode: constant.searchcode, //查询区编码
			oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};
		setDefData( this.cacheDataSource, constant.searchKey, searchVal);
		return searchdata;
	}
	
	// 查询按钮查询数据
	querydata = (searchVal,pageInfo) =>{

		if(searchVal){
			// 获取查询条件
			let searchArea = this.props.search.getAllSearchData(constant.searchcode);
			let searchdata = {
				searchArea:this.getsearchdata(searchArea,pageInfo),
			}

			ajax({
				url: requesturl.query,
				data: searchdata,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data && data.model.rows.length>0) {
							this.props.table.setAllTableData(constant.ltablecode, data.model);
							let billid;
							if(data.model.rows[0]){
								billid = data.model.rows[0].values[this.pkname].value;
							}
							this.props.button.setButtonDisabled(buttonDisable.querydisable, true);
							let message = this.state.json['36362IDC-000046'] + data.model.allpks.length + this.state.json['36362IDC-000051'];
							toast({
								content: message,/* 国际化处理： 查询成功！*/
								color: 'success'
							})
						} else {
							toast({
								color: 'warning',
								content: this.state.json['36362IDC-000047']//{/* 国际化处理： 未查询出符合条件的数据！*/}
							});
							this.props.table.setAllTableData(constant.ltablecode, {rows: []});
							this.props.button.setButtonDisabled(buttonDisable.querydisable, true);
						}
					}
				}
			});
		}
	}
	
	// 清空选择框
	emptychoicebox = () =>{
		this.props.table.selectAllRows(this.tableId,false);
		setButtonUsability.call(this, this.props);
	}

	// 刷新页面方法
	refreshHtml = (props) => {
		let search = getDefData(constant.searchKey, this.cacheDataSource);
		let refreshsearchVal = deepClone(search);
		if(!refreshsearchVal){
			refreshsearchVal = this.props.search.getAllSearchData(this.searchId);
		}
		if(refreshsearchVal){
			if(refreshsearchVal.conditions.length != 0){
				let refreshpageInfo = this.props.table.getTablePageInfo(this.tableId);
				refreshpageInfo.pageIndex = 0;
				// this.querydata(refreshsearchVal, refreshpageInfo);
				// let searchArea = this.props.search.getAllSearchData(constant.searchcode);
				let searchdata = {
					searchArea:this.getsearchdata(refreshsearchVal, refreshpageInfo),
				}

				ajax({
					url: requesturl.query,
					data: searchdata,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							if (data && data.model.rows.length>0) {
								this.props.table.setAllTableData(constant.ltablecode, data.model);
								let billid;
								if(data.model.rows[0]){
									billid = data.model.rows[0].values[this.pkname].value;
								}
								this.props.button.setButtonDisabled(buttonDisable.querydisable, true);
								toast({
									content: this.state.json['36362IDC-000050'],/* 国际化处理： 刷新成功！*/
									color: 'success'
								})
							} else {
								toast({
									color: 'warning',
									content: this.state.json['36362IDC-000047']//{/* 国际化处理： 未查询出符合条件的数据！*/}
								});
								this.props.table.setAllTableData(constant.ltablecode, {rows: []});
								this.props.button.setButtonDisabled(buttonDisable.querydisable, true);
							}
						}
					}
				});
			}
		}
	}
	
	render() {
		let { table, search, ncmodal, cardPagination, form, cardTable, button } = this.props;
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { NCCreateSearch } = search;
		let { createModal } = ncmodal;
		let { createButtonApp } = button;
		let { showUploader, target, billno, billId } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		const { createCardPagination } = cardPagination;
		return (
			<div className="nc-bill-list">

				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
					<div className="header-title-search-area">
						{/* {createPageIcon()}
						<h2 className="title-search-detail">{this.state.json['36362IDC-000019']}</h2>国际化处理： 账户汇兑损益单 */}
						{createBillHeadInfo(
                                {
                                    title: this.state.json['36362IDC-000019'],//标题
                                    initShowBackBtn: false
                                }
                            )}
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'list_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
							// popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>
				{<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this), // defaultConditionsNum: 2,
						showAdvBtn: true, // 显示高级按钮 //onAfterEvent: onSearchAfterEvent.bind(this), //编辑后事件 //searchBtnName: multiLang && multiLang.get('3630-0029'), // 查询按钮名称，默认查询 // showAdvSearchPlanBtn :false, //高级面板中是否显示保存方案按钮 ;默认显示 // replaceAdvBtnEve:()=>{}, // 业务组替换高级面板 (fun) // replaceAdvBody: this.replaceAdvBody, // 业务组替换高级面板中的body (fun),return Dom // addAdvTabs: this.addAdvTabs, // 添加高级查询区自定义页签 (fun), return Dom // addAdvBody: ()=>{}, // 添加高级查询区自定义查询条件Dom (fun) , return Dom
						// oid: constant.oid, //查询模板的oid，用于查询查询方案
						// renderCompleteEvent:this.renderCompleteEvent
					})}
				</div>}
				
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: true,
						dataSource: this.cacheDataSource,
						// pkname: pkname,
						// onSelected: setButtonUsability.bind(this, this.props),
						// onSelectedAll: setButtonUsability.bind(this, this.props),
						onRowDoubleClick: onrowDoubleclick.bind(this), //双击事件
						selectedChange: setButtonUsability.bind(this, this.props),
						componentInitFinished:()=>{
							setButtonUsability.call(this, this.props)
						}
						
					})}
				</div>

				<div className="nc-faith-demo-div2">
				{/* 这里是附件上传组件的使用，需要传入三个参数 */}
				{showUploader && <NCUploader
						billId={billId}
                        target={target}
                        placement={'bottom'}
						billNo={billno}
						onHide={() => {
							this.setState({
								showUploader: false
							})
						}} // 关闭功能
                        />
					}
				</div>

				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url={requesturl.print}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>

				{/* 联查-历史版本 */}
				{/* <NCModal show={this.state.showModalVersionCard}>
					<NCModal.Header>
						<NCModal.Title>{this.state.json['36362IDC-000048']}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div className="nc-bill-extCard">
							<div className="nc-bill-top-area">
								<NCScrollElement name='forminfo'>
									<div className="nc-bill-form-area">
										{createForm(this.formId, {
											// expandArr: [card_from_id, card_from_exchangemsg_id, card_from_delivermsg_id],
											// onAfterEvent: afterEvent.bind(this),
											// props, moduleId(区域id), key(操作的键), value（当前值）,data(当前表单所有值)
											// onBeforeEvent: beforeEvent.bind(this),
											// onBeforeEvent: async (props, moduleId, key, value, index, record) => await beforeEvent.call(this, props, moduleId, key, value, index, record),
										})}
									</div>
								</NCScrollElement>
							</div>

							<div className="nc-bill-bottom-area">
								<NCScrollElement name='businfo'>
									<div className="nc-bill-table-area">
										{createCardTable(this.tablecode_plan , {
											// tableHead: this.getTableHead.bind(this, buttons, this.tablecode_plan),
											// modelSave: () => {
											// 	this.saveBill(false);
											// 	this.props.cardTable.closeModel(this.tablecode_plan);
											// },
											// onAfterEvent: afterEvent.bind(this),
											// onBeforeEvent: beforeEvent.bind(this),
											// selectedChange: setCardShouderBtnUseful.bind(this),
											showCheck: true,
											showIndex: true,
											// modelAddRow: modelAddLineProcess.bind(this),
											// modelDelRowBefore: modelDelLineProcess.bind(this),
											// modelDelRow: modelDelLineAfterProcess.bind(this),
											// hideAdd: status == 'deal' ? true : false,
											// hideDel: status == 'deal' ? true : false
										})}
									</div>
								</NCScrollElement>
								<NCScrollElement name='detail'>
									<div className="nc-bill-table-area" style={{borderRadius: '0 0 4px 4px'}}>
										{createCardTable(this.tablecode_exe , {
											// tableHead: this.getTableHead.bind(this, buttons, this.tablecode_exe),
											// modelSave: () => {
											// 	this.saveBill(false);
											// 	this.props.cardTable.closeModel(this.tablecode_exe);
											// },
											// onAfterEvent: afterEvent.bind(this),
											// onBeforeEvent: beforeEvent.bind(this),
											// selectedChange: setCardShouderBtnUseful.bind(this),
											showCheck: true,
											showIndex: true,
											// modelAddRow: modelAddLineProcess.bind(this),
											// modelDelRowBefore: modelDelLineProcess.bind(this),
											// modelDelRow: modelDelLineAfterProcess.bind(this),
											// hideAdd: isinform,
											// hideDel: isinform
										})}
									</div>
								</NCScrollElement>
							</div>
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'versionCard',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>
				</NCModal>  */}

			</div>
		);
	}
}

List = createPage({
	// initTemplate: initTemplate,
	// mutiLangCode: constant.mutiLangCode
})(List);

// ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/