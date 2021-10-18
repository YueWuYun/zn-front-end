/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//单表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, getMultiLang, createPageIcon } from 'nc-lightapp-front';
let { NCTabsControl ,NCDiv} = base;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, setButtonUsability } from './events';
const { NCUploader, PrintOutput } = high;
import { getCahceValue, go2card, loadSearchCache } from "../util/index";
import { dataSource, pk_allocatereceipt, card_page_id, islink, module_id, app_code, dataSourceLink, grid_code, receiptPk, receiptBillType } from '../cons/constant.js';
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../tmpub/pub/util/cache';
import { setPropCache, saveMultiLangRes, loadMultiLang, createListWebSocket} from "../../../../tmpub/pub/util/index";

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = '2052';
		this.searchId = '36320FARF_list_search';
		this.tableId = '36320FARF_list_table';
		this.state = {
			billId: '',//单据id
			billno: '',// 单据编号
			showUploader: false,//控制附件弹出框
			target: null,//控制弹出位置
			outputData: ''//输出数据参数
		}
		initTemplate.call(this, props);
	}

	// componentWillMount() {
	// 	getMultiLang({
	// 		//模块编码
	// 		moduleId: [module_id, app_code],
	// 		//领域编码
	// 		domainName: 'sf',
	// 		//回调
	// 		callback: (lang) => {
	// 			//将多语资源数据存储到页面级缓存中
	// 			saveMultiLangRes(this.props, lang);
	// 			//初始化模板
	// 			initTemplate.call(this, this.props);
	// 		}
	// 	});
	// }

	componentDidMount() {

		//多语加载
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
				//initTemplate(this.props);
			}
		});
		//被联查场景
		let querytype = this.props.getUrlParam('linkquerytype');
		let srcbillid = this.props.getUrlParam('srcbillid');
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		let src = this.props.getUrlParam('scene');
		if (querytype) {
			//将联查标志加入缓存
			setDefData(dataSource, islink, true);
			let sendArr = {
				pageInfo: pageInfo,
				linkquerytype: querytype,
				pks: [srcbillid]
			};
			ajax({
				url: '/nccloud/sf/allocateReceiptCenter/linkedquery.do',
				data: sendArr,
				success: (res) => {
					debugger
					let { success, data } = res;
					if (success) {
						if (data) {
							let rowlenght = data[this.tableId].rows;
							// let src = this.props.getUrlParam('src');
							if (rowlenght.length == 1) {
								let allocateReceiptRecord = rowlenght[0];
								this.props.table.setAllTableData(this.tableId, data[this.tableId]);
								setDefData(this.tableId, dataSourceLink, data[this.tableId]);
								//单条数据跳转卡片
								this.props.pushTo('/card', {
									status: 'browse',
									scence: 'linksce',// 被联查时 专属识别标志
									id: allocateReceiptRecord.values.pk_allocatereceipt.value
								});
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
		}else if('linksce' === src){//适配错误中心联查单
			//将联查标志加入缓存
			setDefData(dataSource, islink, true);
			let srckey = this.props.getUrlParam('srckey');
			let id = this.props.getUrlParam('id');
			let that = this;
			let pk;
			if (srckey) {
				pk = srckey;
			} else {
				pk = id;
			}
			let data = {
				pks: [pk]
			};
			ajax({
				url: '/nccloud/sf/allocateReceiptCenter/queryPage.do',
				data: data,
				success: function (res) {
					let { success, data } = res;
					if (success) {
						if(data){
							let rowlenght = data[that.tableId].rows;
							// let src = this.props.getUrlParam('src');
							if (rowlenght.length == 1) {
								let allocateReceiptRecord = rowlenght[0];
								that.props.table.setAllTableData(that.tableId, data[that.tableId]);
								setDefData(that.tableId, dataSourceLink, data[that.tableId]);
								//单条数据跳转卡片
								that.props.pushTo('/card', {
									status: 'browse',
									scence: 'linksce',// 被联查时 专属识别标志
									id: allocateReceiptRecord.values.pk_allocatereceipt.value
								});
							}else 
								props.table.setAllTableData(grid_code, data[grid_code]);
						}else{
							props.table.setAllTableData(grid_code, {rows:[]});
						}    
					}
				}
			});

		} else {
			//从缓存中加载数据
			getCahceValue(this.props, this.updateState.bind(this));
		}
		//被联查时 卡片到列表加载数据
		this.restoreData();
	}

	// 还原列表页数据
	restoreData = () => {
		let tableData = getDefData(this.tableId, dataSourceLink);
		if (tableData) {
			this.props.table.setAllTableData(this.tableId, tableData);
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

	//双击进卡片
	onRowDoubleClick = (record, index, props, e) => {
		props.pushTo('/card', {
			status: 'browse',
			id: record.pk_allocatereceipt.value
		});
	}

	/**
	 * 获取state中的数据
	 * @param {*} key 
	 */
	getState(key) {
		return this.state[key];
	};

	//更新state
	updateState(obj) {
		if (!obj || Object.keys(obj).length == 0) {
			return;
		}
		this.setState(obj);
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
		console.log(billId, fullPath, file, fileList);

		const isJPG = file.type === 'image/jpeg';
		if (!isJPG) {
			//            alert(this.props.MutiInit.getIntl("36320FAR") && this.props.MutiInit.getIntl("36320FAR").get('36320FDA--000053'))/* 国际化处理： 只支持jpg格式图片*/
			alert(this.state.json['36320FARF-000014']);/* 国际化处理： 只支持jpg格式图片.*/
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			//            alert(this.props.MutiInit.getIntl("36320FAR") && this.props.MutiInit.getIntl("36320FAR").get('36320FDA--000054'))/* 国际化处理： 上传大小小于2M*/
			alert(this.state.json['36320FARF-000015']);/* 国际化处理： 上传大小小于2M*/
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
                                    title: loadMultiLang(this.props, '36320FARF-000017'),//标题{/* 国际化处理： 中心下拨回单**/}
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
						handlePageInfoChange: pageInfoClick,
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
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url='/nccloud/sf/allocateReceiptCenter/print.do'
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
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