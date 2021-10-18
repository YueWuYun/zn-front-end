/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表列表
import React, { Component } from 'react';
import { createPage, ajax, base, high, cardCache, toast, getMultiLang, createPageIcon } from 'nc-lightapp-front';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, setButtonUsability } from './events';
import { saveMultiLangRes, loadMultiLang, createListWebSocket } from "../../../../tmpub/pub/util/index";
// 网银补录
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form/index.js';
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../pub/cons/constant.js';
import {
	module_id, module_name, module_tmpub_name, module_tmpub_id, appcode,
	list_page_id, list_search_id, list_table_id, card_page_id,
	button_limit, oid, deliveryPk, deliveryBillType,
	cachesearchKey, dataSource, cacheTabKey, cacheTabActiveKey
} from './../cons/constant.js';

let { NCTabsControl, NCFormControl, NCDiv } = base;
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
let { NCUploader, ApproveDetail, PrintOutput, Inspection } = high;
let { getNextId, getCurrentLastId, deleteCacheById, deleteCacheId, getCacheById, updateCache, addCache, setDefData, getDefData } = cardCache;
const { NCTabPane } = NCTabs;

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = module_id;
		this.searchId = list_search_id;
		this.tableId = list_table_id;
		this.pageId = list_page_id;

		this.pk_delivery_h = null;
		this.ts = null;
		this.index = null;
		this.isTableInnerOpt = false;

		this.state = {
			json: {},
			numvalues: {},
			activeKey: '1',
			returnnote: '',
			// 网银补录 start
			showBuLu: false,
			onLineData: [],
			modelType: SHOWMODEL_BULU,
			// 网银补录 end

			// 附件相关 start
			//单据pk
			billId: '',
			//附件管理使用单据编号
			billno: '',
			//控制附件弹出框
			showUploader: false,
			//控制弹出位置
			target: null,
			// 附件相关 end

			// 联查预算 start
			//是否显示预算计划
			showNtbDetail: false,
			//预算计划数据
			ntbdata: null,
			// 联查预算 end

			//审批意见 start
			//审批意见是否显示
			show: false,
			//审批意见单据pk
			billid: '',
			//审批意见单据类型
			billtype: '',
			//审批意见 end

			//输出用   
			outputData: {
				funcode: '', //功能节点编码，即模板编码
				nodekey: '', //模板节点标识
				printTemplateID: '', //模板id
				oids: [],
				outputType: 'output'
			}
		};
		initTemplate.call(this, props);
	}
	componentDidMount() {
		// this.getData();
		this.restoreData();
		setButtonUsability.call(this, this.props);
	}

	componentWillMount() {
		getMultiLang({
			moduleId: {
				//tmpub模块多语资源
				[module_tmpub_name]: [module_tmpub_id],
				//fts模块多语资源
				[module_name]: [module_id, '36320FDA']
			},
			//回调
			callback: (lang) => {
				this.setState({ lang });
				//将多语资源数据存储到页面级缓存中
				saveMultiLangRes(this.props, lang);
				//初始化模板
				// initTemplate(this.props);
			}
		});
	}

	// 还原列表页数据
	restoreData = () => {
		//获取页签数据
		let cachestate = getDefData(cacheTabKey, dataSource);
		let cachestateTabActiveKey = getDefData(cacheTabActiveKey, dataSource);
		if (cachestate) {
			let keys = Object.keys(cachestate);
			this.setState({ numvalues: cachestate });
			this.setState({ activeKey: cachestateTabActiveKey });
		}
	}

	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};

	//刷新列表信息
	refresh = () => {
		//分页
		let refreshpageInfo = this.props.table.getTablePageInfo(list_table_id);
		//查询condition
		let refreshsearchVal = this.props.search.getAllSearchData(list_search_id);
		let queryInfo = this.props.search.getQueryInfo(list_search_id, false);
		let oid = queryInfo.oid;
		if (refreshsearchVal && refreshsearchVal.conditions) {
			setDefData(cachesearchKey, dataSource, refreshsearchVal);
			let data = {
				querycondition: refreshsearchVal,
				custcondition: {
					logic: "and",   //逻辑操作符，and、or
					conditions: [
					],
				},
				conditions: refreshsearchVal.conditions || refreshsearchVal,
				pageInfo: refreshpageInfo,
				pagecode: list_page_id,
				//查询区编码
				queryAreaCode: list_search_id,
				//查询模板id，手工添加在界面模板json中，放在查询区
				oid: oid,
				querytype: 'tree'
			};

			ajax({
				url: '/nccloud/sf/delivery/deliverypayquery.do',
				data: data,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							this.props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
						} else {
							this.props.table.setAllTableData(list_table_id, { rows: [] });
						}
						setButtonUsability.call(this, this.props);
					}
				}
			});
		}
	}

	// 查询区渲染完成回调函数
	renderCompleteEvent = () => {
		let cachesearch = getDefData(cachesearchKey, dataSource);
		if (cachesearch && cachesearch.conditions) {
			for (let item of cachesearch.conditions) {
				if (item.field == 'dbilldate') {
					// 时间类型特殊处理
					let time = [];
					time.push(item.value.firstvalue);
					time.push(item.value.secondvalue);
					this.props.search.setSearchValByField(this.searchId, item.field,
						{ display: item.display, value: time });
				} else {
					this.props.search.setSearchValByField(this.searchId, item.field,
						{ display: item.display, value: item.value.firstvalue });
				}
			}
		}
	}

	getData = (serval) => {
		let servalTemp = serval && serval[0] ? serval[0] : null;
		//分页
		let datapageInfo = this.props.table.getTablePageInfo(list_table_id);
		//查询condition
		// let datasearchVal = this.props.search.getAllSearchData(list_search_id);
		let queryInfo = this.props.search.getQueryInfo(list_search_id, false);
		let oid = queryInfo.oid;
		let cachesearchdata = getDefData(cachesearchKey, dataSource);
		if (cachesearchdata) {
			let data = {
				querycondition: cachesearchdata,
				custcondition: {
					conditions: [servalTemp],
					logic: "and"
				},
				pagecode: this.pageId,
				pageInfo: datapageInfo,
				queryAreaCode: this.searchId,
				oid: oid,
				querytype: 'tree'
			};
			ajax({
				url: '/nccloud/sf/delivery/deliverypayquery.do',
				data: data,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							if (data.grid) {
								this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
							} else {
								this.props.table.setAllTableData(this.tableId, { rows: [] });
							}
							if (data.numvalues) {
								this.setState({ numvalues: data.numvalues });
							}
							setDefData(cacheTabKey, dataSource, this.state.numvalues);
							setDefData(cacheTabActiveKey, dataSource, this.state.activeKey);
							// this.setState({ activeKey: 5 });
						} else {
							this.props.table.setAllTableData(this.tableId, { rows: [] });
							this.setState({ numvalues: {} });
						}
						setButtonUsability.call(this, this.props);
					}
				}
			});
		}
	};
	//页签筛选
	navChangeFun = (status, className, e) => {
		let serval;
		switch (status) {
			// 待支付
			case '1':
				serval = [
					{
						field: 'billstatus',
						value: {
							firstvalue: '2',
							secondvalue: null
						},
						oprtype: '=',
						datatype: 203,
					}
				];
				this.setState({ activeKey: '1' });
				setDefData(cacheTabActiveKey, dataSource, '1');
				this.getData(serval);
				break;
			// 支付中
			case '2':
				serval = [
					{
						field: 'billstatus',
						value: {
							firstvalue: '3',
							secondvalue: null
						},
						oprtype: '=',
						datatype: 203,
					}
				];
				this.setState({ activeKey: '2' });
				setDefData(cacheTabActiveKey, dataSource, '2');
				this.getData(serval);
				break;
			// 全部
			case '3':
				serval = [
					{
						field: 'billstatus',
						value: {
							firstvalue: null,
							secondvalue: null
						},
						oprtype: '=',
						datatype: 203,
					}
				];
				this.setState({ activeKey: '3' });
				setDefData(cacheTabActiveKey, dataSource, '3');
				this.getData(serval);
				break;
			default:
				break;
		}
	};

	//处理网银补录返回信息
	processRetMsg = (retMsg) => {
		let bulupk;
		let buluts;
		if (this.isTableInnerOpt) {
			//主键
			bulupk = this.pk_delivery_h;
			//ts
			buluts = this.ts;
		} else {
			let buluCheckedData = this.props.table.getCheckedRows(this.tableId);
			//数据校验
			if (buluCheckedData.length != 1) {
				/* 国际化处理： 请选择一条数据操作！*/
				toast({
					color: 'warning', content: this.props.MutiInit.getIntl("36320FDA")
						&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000070')
				});
				return;
			}
			//处理选择数据
			buluCheckedData.forEach((val) => {
				if (val.data.values.pk_delivery_h && val.data.values.pk_delivery_h.value) {
					bulupk = val.data.values.pk_delivery_h.value;
				}
				if (val.data.values.ts && val.data.values.ts.value) {
					buluts = val.data.values.ts.value;
				}
				this.index = val.index;
			});
		}
		let buluData = {
			pk: bulupk,
			ts: buluts,
			results: retMsg,
			pageid: list_page_id,
		}
		ajax({
			url: '/nccloud/sf/delivery/deliverybuluretmsg.do',
			data: buluData,
			success: (res) => {
				if (res.success) {
					if (res && res.data) {
						/* 国际化处理： 补录成功*/
						toast({
							color: 'success', content: this.props.MutiInit.getIntl("36320FDA")
								&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000119')
						});
						if (res.data.grid) {
							this.props.table.updateDataByIndexs(list_table_id, [{ index: this.index, data: { values: res.data.grid[list_table_id].rows[0].values } }]);
						}
						this.pk_delivery_h = null;
						this.ts = null;
						this.isTableInnerOpt = false;
						this.index = null;
					}
				}
			}
		});
	}

	// 退回原因
	returnnoteModelContent() {
		return (
			<div className="addModal">
				<NCFormControl
					className="demo-input"
					value={this.state.returnnote}
					onChange={this.changeReturnnoteEvent}
					size="sm"
				/>
			</div>
		)
	};

	// 退回原因改变事件
	changeReturnnoteEvent = (value) => {
		if (value != this.state.returnnote) {
			this.setState({
				returnnote: value
			})
		}
	}

	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}

	beforeUpload(billId, fullPath, file, fileList) {
		// 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
		//console.log(billId, fullPath, file, fileList);

		const isJPG = file.type === 'image/jpeg';
		if (!isJPG) {
			/* 国际化处理： 只支持jpg格式图片*/
			// alert(this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000053'))
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			/* 国际化处理： 上传大小小于2M*/
			// alert(this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000054'))
		}
		return isJPG && isLt2M;
		// 备注： return false 不执行上传  return true 执行上传
	}

	DoubleClick = (record, index, props, e) => {
		props.pushTo("/card", {
			status: "browse",
			id: record.pk_delivery_h && record.pk_delivery_h.value,
			pagecode: card_page_id,
		});
	}

	render() {
		let numvalues = this.state.numvalues;
		let { table, button, search, modal, ncmodal, BillHeadInfo } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButton, getButtons, createButtonApp } = button;
		const { createBillHeadInfo } = BillHeadInfo;
		let { createModal } = modal;
		// 附件相关内容变量
		let { showUploader, target, billno, billId, showNtbDetail, ntbdata } = this.state;
		return (
			<div className="nc-bill-list">
               {/**创建websocket连接 */}
			   {createListWebSocket(this.props, {
                    tableAreaCode: list_table_id,
                    tablePkName: deliveryPk,
					billtype: deliveryBillType,
					dataSource: dataSource
                })}					
				{/** 渲染标题栏 **/}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createBillHeadInfo(
							{
								title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000091'),//标题
								initShowBackBtn: false
							}
						)}
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'list_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						//默认显示几个查询条件
						defaultConditionsNum: 5,
						// 显示高级按钮
						showAdvBtn: true,
						// 添加高级查询区自定义页签 (fun), return Dom 
						addAdvTabs: this.addAdvTabs,
						//						oid: oid,
						// 查询区渲染完成回调函数
						renderCompleteEvent: this.renderCompleteEvent
					})}
				</div>
				{/* <div style={{borderTop: '1px solid #CCC'}}></div> */}
				<NCTabs activeKey={this.state.activeKey}
					onChange={(v) => {
						this.navChangeFun.call(this, v);
					}}>
					{/* 国际化处理： 待支付*/}
					<NCTabPane key={'1'} tab={
						<span>
							{this.props.MutiInit.getIntl("36320FDA")
								&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000082')
								+ '('}<span>{numvalues && numvalues.DZF || 0}</span>{')'}
						</span>
					} />
					{/* 国际化处理： 支付中*/}
					<NCTabPane key={'2'} tab={
						<span>
							{this.props.MutiInit.getIntl("36320FDA")
								&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000093')
								+ '('}<span>{numvalues && numvalues.ZFZ || 0}</span>{')'}
						</span>}
					/>
					{/* 国际化处理： 全部*/}
					<NCTabPane key={'3'} tab={
						this.props.MutiInit.getIntl("36320FDA")
						&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000083')
					} />
				</NCTabs>
				{/* <div style={{ height: '10px' }} /> */}
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: true,

						onSelected: setButtonUsability.bind(this, this.props),
						onSelectedAll: setButtonUsability.bind(this, this.props),
						onRowDoubleClick: this.DoubleClick.bind(this),

						dataSource: dataSource,
						//给表格加pkname: 表格数据的主键名字(key)
						pkname: 'pk_delivery_h',
						componentInitFinished: () => {
							//缓存数据赋值成功的钩子函数
							//若初始化数据后需要对数据做修改，可以在这里处理
							setButtonUsability.call(this, this.props)
						}
					})}
				</div>
				<div>
					<PrintOutput
						ref="printOutput"
						url="/nccloud/sf/delivery/deliveryprint.do"
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader &&
						<NCUploader
							billId={billId}
							target={target}
							placement={'bottom'}
							billNo={billno}
							onHide={this.onHideUploader}
						// beforeUpload={this.beforeUpload}
						/>
					}
				</div>

				{/* <button className="nc-faith-demo-button" onClick={(eve) => {
					this.setState({
						showUploader: true,
						target: eve.target
					})
				}}>点我上传！</button>
				<button className="nc-faith-demo-button" onClick={(eve) => {
					this.setState({
						showUploader: false,
					})
				}}>点我关闭</button> */}

				{/* 退回模态框 */}
				{createModal('backModel', {
					/* 国际化处理： 退回*/
					title: this.props.MutiInit.getIntl("36320FDA")
						&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000059'),
					content: this.returnnoteModelContent(),
					hasCloseBtn: false,
					className: 'senior'
				})}

				{/* 支付模态框 */}
				{createModal('payModel', {
					/* 国际化处理： 支付*/
					title: this.props.MutiInit.getIntl("36320FDA")
						&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000012'),
					hasCloseBtn: false,
					className: 'senior'
				})}

				{/** 网银补录组件 **/}
				<PayBuluForm
					showmodal={this.state.showBuLu}
					modal={modal}
					onLineData={this.state.onLineData}
					moduleType={sourceModel_SF}
					modelType={this.state.modelType}
					//点击确定按钮的回调函数
					onSureClick={(retPayMsg) => {
						//处理补录信息(输出参数：PaymentRetMsg[])
						this.processRetMsg(retPayMsg);
						//关闭对话框
						this.setState({
							showBuLu: false
						})
					}}
					//点击关闭按钮的回调函数
					onCloseClick={() => {
						//关闭对话框
						this.setState({
							showBuLu: false
						})
					}}>
				</PayBuluForm>

				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.approveshow}
						close={() => {
							this.setState({
								approveshow: false
							})
						}}
						billtype={'36K4'}
						billid={billId}
					/>
				</div>

				{/* 联查预算 */}
				<div>
					<Inspection
						show={showNtbDetail}
						sourceData={ntbdata}
						cancel={() => {
							this.setState({ showNtbDetail: false })
						}}
						affirm={() => {
							this.setState({ showNtbDetail: false })
						}}
					/>
				</div>

			</div>
		);
	}
}

List = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: list_page_id,
	},
	// initTemplate: initTemplate,
	mutiLangCode: '36320FDA'
})(List);

// ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/