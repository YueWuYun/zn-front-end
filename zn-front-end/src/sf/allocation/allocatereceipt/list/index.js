/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//单表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, getMultiLang ,createPageIcon, toast} from 'nc-lightapp-front';
let { NCTabsControl ,NCDiv} = base;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, setButtonUsability } from './events';
//联查内部账户组件
import { InnerAccoutDialog } from '../../../../tmpub/pub/inneraccount/list/index.js';
//联查收款银行账户组件
import NCCOriginalBalance from '../../../../cmp/public/restmoney/list';
import { dataSource, pk_allocatereceipt, list_page_code, grid_code, scenceLinke, islink, dataSourceLink, module_id, app_code
		,receiptBillType, receiptPk} from '../cons/constant.js';
import { setDefData, getQueryInfo, getSearchAreaData, setSearchValue, getDefData } from '../../../../tmpub/pub/util/cache';
import { getCahceValue, VoucherLinkBill } from "../util/index";
import { setPropCache, saveMultiLangRes, loadMultiLang, createListWebSocket} from "../../../../tmpub/pub/util/index";
const { NCUploader, PrintOutput, Inspection } = high;
class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = '36320';
		this.searchId = '36320FAR_list_search';
		this.tableId = '36320FAR_list_table';
		this.state = {
			billId: '',//单据id
			billno: '',// 单据编号
			showUploader: false,//控制附件弹出框
			target: null,//控制弹出位置
			outputData: '',//输出数据参数
			accModalShow: false,//内部账户余额参数
			currentpk: '',//内部账余额参数
			//联查 收款银行账户 指定参数 pk_bankacc_r
			showOriginal: false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData: [],// 联查余额取数据，将需要联查的数据赋值给我
			//联查计划预算
			showNtbDetail: false,//是否显示预算计划
			ntbdata: null,//预算计划数据
			showplan: false,//联查预算参数

		};
		//		initTemplate.call(this, props);
	}

	cancel() {
		this.setState({
			showplan: false
		})
	}
	affirm(info) {
		this.setState({
			showplan: false
		})
	}

	/**
	 * 获取state中的数据
	 * @param {*} key 
	 */
	getState(key) {
		return this.state[key];
	};


	componentWillMount() {
		getMultiLang({
			//模块编码
			moduleId: [module_id, app_code],
			//领域编码
			domainName: 'sf',
			//回调
			callback: (lang) => {
				//将多语资源数据存储到页面级缓存中
				saveMultiLangRes(this.props, lang);
				//初始化模板
				initTemplate.call(this, this.props);
			}
		});
	}

	componentDidMount() {
		//处理联查场景
		let src = this.props.getUrlParam('scene');//来源场景
		//联查回单
		let querytype = this.props.getUrlParam('linkquerytype');
		if ('fip' == src) {//fip代表会计平台
			//将联查标志加入缓存
			setDefData(dataSource, islink, true);
			VoucherLinkBill(this.props, list_page_code, grid_code);

		} else if (querytype) {//联查回单
			//将联查标志加入缓存
			setDefData(dataSource, islink, true);
			this.ReturnLinkBill(querytype);
		} else if (this.props.getUrlParam('pk_ntbparadimvo')) {//计划预算
			//将联查标志加入缓存
			setDefData(dataSource, islink, true);
			this.getNtbLinkBillData();
		} else {
			//从缓存中加载数据
			getCahceValue(this.props, this.updateState.bind(this));
		}
		//被联查后返回时 回复列表数据
		this.restoreData();
	}

	ReturnLinkBill = (querytype) => {
		let srcbillid = this.props.getUrlParam('srcbillid');
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		let sendArr = {
			pageInfo: pageInfo,
			linkquerytype: querytype,
			pks: [srcbillid]
		};
		ajax({
			url: '/nccloud/sf/allocateReceiptCenter/linkedquery.do',
			data: sendArr,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data.grid) {
						let rowlenght = data[this.tableId].rows;
						// let src = this.props.getUrlParam('src');
						if (rowlenght.length == 1) {
							let allocateReceiptRecord = rowlenght[0];
							setDefData(grid_code, dataSourceLink, data[grid_code]);
							this.props.table.setAllTableData(this.tableId, data[this.tableId]);
							//单条数据跳转卡片
							this.props.pushTo('/card', {
								status: 'browse',
								scence: 'linksce',// 被联查时 专属识别标志
								id: allocateReceiptRecord.values.pk_allocatereceipt.value
							});
							//							this.props.table.setAllTableData(this.tableId, data[this.tableId]);
						} else {
							//多条数据跳转列表页面
							this.props.table.setAllTableData(this.tableId, data[this.tableId]);
						}
					}
				} else {
					this.props.table.setAllTableData(this.tableId, { rows: [] });
				}
			}
		});
	}

	// 预算联查单据
	getNtbLinkBillData = () => {
		let pageInfo = this.props.table.getTablePageInfo(grid_code);
		ajax({
			url: '/nccloud/sf/allocatereceipt/allocatereceiptntblinkbill.do',
			data: {
				pk: this.props.getUrlParam('pk_ntbparadimvo'),
				pageCode: this.pageId,
				pageInfo: pageInfo,
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data.grid) {
						this.props.table.setAllTableData(grid_code, data.grid[grid_code]);
						let rowlenght = data.grid[grid_code].rows;
						if (rowlenght.length == 1) {
							setDefData(grid_code, dataSourceLink, data.grid[grid_code]);
							let record = rowlenght[0];
							//1条数据跳转到卡片页面
							this.props.pushTo("/card", {
								status: 'browse',
								scence: 'linksce',// 被联查时 专属识别标志
								id: record.values.pk_allocatereceipt && record.values.pk_allocatereceipt.value
							});
						}
					} else {
						toast({ color: 'warning', content: loadMultiLang(this.props, '36320FAR-000037') });/* 国际化处理： 未联查到对应的下拨回单!*/
						this.props.table.setAllTableData(grid_code, { rows: [] });
					}
				} else {
					toast({ color: 'warning', content: loadMultiLang(this.props, '36320FAR-000037') });/* 国际化处理： 未联查到对应的下拨回单!*/
				}
			}
		});
	}

	// 还原列表页数据
	restoreData = () => {
		let tableData = getDefData(grid_code, dataSourceLink);
		if (tableData) {
			this.props.table.setAllTableData(grid_code, tableData);
		}
		setButtonUsability.call(this, this.props);
	}

	getButtonNames = (codeId) => {
		if (codeId === 'printBtn' || codeId === 'addBtn' || codeId === 'copyBtn' || codeId === 'submitBtn') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};

	//更新state
	updateState(obj) {
		if (!obj || Object.keys(obj).length == 0) {
			return;
		}
		this.setState(obj);
	}

	//双击进卡片
	onRowDoubleClick = (record, index, props, e) => {
		props.pushTo('/card', {
			status: 'browse',
			id: record.pk_allocatereceipt.value
		});
	}

	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}
	//附件上传校验
	beforeUpload(billId, fullPath, file, fileList) {
		// 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
		//console.log(billId, fullPath, file, fileList);

		const isJPG = file.type === 'image/jpeg';
		if (!isJPG) {
			//            alert(this.props.MutiInit.getIntl("36320FAR") && this.props.MutiInit.getIntl("36320FAR").get('36320FDA--000053'))/* 国际化处理： 只支持jpg格式图片*/
			alert(this.state.json['36320FAR-000007']);/* 国际化处理： 只支持jpg格式图片.*/
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			//            alert(this.props.MutiInit.getIntl("36320FAR") && this.props.MutiInit.getIntl("36320FAR").get('36320FDA--000054'))/* 国际化处理： 上传大小小于2M*/
			alert(this.state.json['36320FAR-000008']);/* 国际化处理： 上传大小小于2M*/
		}
		return isJPG && isLt2M;
		// 备注： return false 不执行上传  return true 执行上传
	}

	render() {
		let { table, button, search ,BillHeadInfo} = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButton, getButtons } = button;
		let { showUploader, target, billno, billId } = this.state;
		let { accModalShow, currentpk, showNtbDetail, ntbdata } = this.state;
		let islinked = getDefData(dataSource, islink);
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				{/**创建websocket连接 */}
				{createListWebSocket(this.props, {
                    tableAreaCode: grid_code,
                    tablePkName: receiptPk,
					billtype: receiptBillType,
					dataSource: dataSource
                })}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{/*页面大图标*/}			
						{createBillHeadInfo(
                            {
                                title: loadMultiLang(this.props, '36320FAR-000010'),//标题{/* 国际化处理： 单位下拨回单**/}
                                initShowBackBtn: false
                            }
                        )}	
					</div>
					<div className="header-button-area">
						{/* 小应用注册button */}
						{this.props.button.createButtonApp({
							area: 'list_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>
				{!islinked && <div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 2
					})}
				</div>}
				{/* <div style={{ borderTop: '1px solid #CCC' }}></div> */}
				{/* <div style={{ height: '10px' }} /> */}
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: true,
						pkname: pk_allocatereceipt,
						dataSource: dataSource,
						onSelected: setButtonUsability.bind(this, this.props),
						onSelectedAll: setButtonUsability.bind(this, this.props),
						onRowDoubleClick: this.onRowDoubleClick.bind(this),
						componentInitFinished: setButtonUsability.bind(this, this.props)
					})}
				</div>
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader && <NCUploader
						billId={billId}
						billNo={billno}
						onHide={this.onHideUploader}
					// beforeUpload={this.beforeUpload}
					/>
					}
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
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url='/nccloud/sf/allocatereceipt/print.do'
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
				<div>
					{/*内部账户余额 提示页面*/}
					{accModalShow && <InnerAccoutDialog
						id="dialog"
						showModal={accModalShow}
						accpk={currentpk}
						closeModal={() => {
							this.setState({
								accModalShow: false,
								currentpk: ''
							})
						}}
					/>}
				</div>
				<div>
					{/* 银行账户余额 */}
					<NCCOriginalBalance
						// 补录框显示
						showmodal={this.state.showOriginal}
						showOriginalData={this.state.showOriginalData}
						// 点击确定按钮的回调函数
						onSureClick={(retOriginalMsg) => {
							////console.log(retOriginalMsg, 'retOriginalMsg')
							//关闭对话框
							this.setState({ showOriginal: false })
						}}
						onCloseClick={() => {
							//关闭对话框
							this.setState({ showOriginal: false })
						}}
					>
					</NCCOriginalBalance>
				</div>
			</div>
		);
	}
}

List = createPage({
	//	initTemplate: initTemplate,
	mutiLangCode: '3632'
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/