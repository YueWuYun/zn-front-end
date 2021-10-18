/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, cardCache, getMultiLang, toast, createPageIcon } from 'nc-lightapp-front';
let { NCTabsControl, NCDiv } = base;
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
const { NCTabPane } = NCTabs;
const { PrintOutput, NCUploader, ApprovalTrans, ApproveDetail, Inspection } = high;
import { listSingleOperatorNoRecord, listMultiOperator } from '../../../pub/utils/SFButtonUtil';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, searchBtnClickForPage, setButtonUsability } from './events';
import { jsoncode, requesturl } from '../util/const.js';
import { getCahceValue, go2card } from "../util/index";
let { addCache, getCurrentLastId, getNextId, deleteCacheById, getCacheById, updateCache } = cardCache;
import { module_id, module_name } from "../../../pub/cons/constant";
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../tmpub/pub/util/index";
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../tmpub/pub/util/cache';
class List extends Component {

	constructor(props) {
		let { hasCacheData } = props.table;
		super(props);
		this.moduleId = jsoncode.modulecode;
		this.searchId = jsoncode.searchcode;
		this.tableId = jsoncode.tablecode;
		initTemplate.call(this, props);
		this.state = {
			//选中某个页签后 需要赋值
			activeKey: '0',
			//默认显示全部分组
			defaultSelectGrup: 0,
			//当前选中的分组
			selectedGroup: '',
			//分组单据总数
			groupCount: {
				//待提交 总数
				needCommit: 0,
				//待审批 总数
				needApprove: 0,
				//待委托 总数
				needSubmit: 0,
				//已委托 总数
				needUnSubmit: 0
			},
			billId: '',//单据id
			billno: '',// 单据编号
			showUploader: false,
			target: null,
			//列表页面表体行号 委托指派用
			index: -1,
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			//时间戳 委托指派用
			ts: '',
			//单据主键 委托指派用
			billID: '',
			approveBilltype: '',//审批意见单据类型
			showApprove: false,//审批意见是否显示
			approveBillId: '',//审批意见单据pk
			//分组页签按钮是不是第一次点击
			isFirst: true,
			show: false,//联查预算参数
			sourceData: null,//联查预算参数
			outputData: '',//输出数据参数
		};
	}
	componentWillMount() {
		getMultiLang({
			// //模块编码
			// moduleId: [module_id, jsoncode.appcode],
			// //领域编码
			// domainName: module_name,
			moduleId: {
				//tmpub模块多语资源
				'tmpub': ['3601'],
				//fts模块多语资源
				'sf': ['3632', '36320DA']
			},
			//回调
			callback: (lang) => {
				//将多语资源数据存储到页面级缓存中
				saveMultiLangRes(this.props, lang);
				//初始化模板
				initTemplate.call(this, this.props);
			}
		});
	}
	cancel() {
		this.setState({
			show: false
		})
	}
	affirm(info) {
		//console.log(info);
		this.setState({
			show: false
		})
	}
	//关闭审批意见页面
	closeApprove = () => {
		this.setState({
			showApprove: false
		})
	}
	componentDidMount() {
		let srcbillid = this.props.getUrlParam('id');
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		let pks = Array.isArray(srcbillid) ? srcbillid : [srcbillid];
		//单据联查单据
		let sendArr = {
			pageInfo: pageInfo,
			linkquerytype: '3',
			pks: pks
		};
		if (srcbillid) {
			//资金上收联查上缴单，均是一对一的，只能查到一条上缴单，故不做多条跳列表的判断以提高效率
			ajax({
				url: '/nccloud/sf/deliveryapply/deliveryapplylinkquery.do',
				data: sendArr,
				success: (res) => {
					let { success, data } = res;
					cardCache.setDefData(jsoncode.tablecode, jsoncode.dataSource, data[jsoncode.tablecode]);
					let rowlenght = data[jsoncode.tablecode].rows;
					let deliveryApplyRecord = rowlenght[0];
					//单条数据跳转卡片
					this.props.pushTo('/linkcard', {
						status: 'browse',
						id: deliveryApplyRecord.values.pk_deliveryapply_h.value,
						pagecode: jsoncode.linkcpageid
					});
				}
			});
		} else if (!srcbillid && this.props.getUrlParam('pk_ntbparadimvo')) {
			//计划预算联查上缴单，存在一对多的场景，因此多条需要跳转列表
			ajax({
				url: '/nccloud/sf/deliveryapply/deliveryapplyntblinkbill.do',
				data: {
					pk: this.props.getUrlParam('pk_ntbparadimvo'),
					pageCode: jsoncode.linkpageid,
					pageInfo: pageInfo,
				},
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data.grid) {
							cardCache.setDefData(jsoncode.tablecode, jsoncode.dataSource, data.grid[jsoncode.tablecode]);
							let rowlenght = data.grid[jsoncode.tablecode].rows;
							if (rowlenght.length == 1) {//1条数据跳转到卡片页面
								let record = rowlenght[0];
								this.props.pushTo("/linkcard", {
									status: 'browse',
									id: record.values.pk_deliveryapply_h && record.values.pk_deliveryapply_h.value,
									pagecode: jsoncode.linkcpageid
								});
							} else {//没有数据，或者多条数据在列表
								this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
							}
						} else {
							toast({ color: 'warning', content: loadMultiLang(this.props, '36320DA-000063') });/* 国际化处理： 未联查到对应的上缴单!*/
							this.props.table.setAllTableData(this.tableId, { rows: [] });
						}
					} else {
						toast({ color: 'warning', content: loadMultiLang(this.props, '36320DA-000063') });/* 国际化处理： 未联查到对应的上缴单!*/
					}
				}
			});


		}
	}
	// 还原列表页数据
	restoreData = () => {
		let tableData = getDefData(jsoncode.grid_code, jsoncode.dataSourceLink);
		if (tableData) {
			this.props.table.setAllTableData(jsoncode.grid_code, tableData);
		}
		setButtonUsability.call(this, this.props);
	}
	// 预算联查单据
	getNtbLinkBillData = () => {

	}
	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};
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

	//刷新方法
	refresh = () => {
		let { selectedGroup } = this.state;
		let { activeKey } = this.state;
		this.navChangeFun(activeKey);
	}

	//页签筛选
	navChangeFun = (groupKey, className, e) => {
		this.setState({ activeKey: groupKey });
		searchBtnClick.call(this, this.props, null, groupKey);
	};

	//双击进卡片
	DoubleClick = (record, index, props, e) => {
		//go2card(props, { pagecode: jsoncode.cpageid, status: 'browse', id: record.pk_deliveryapply_h.value }, this.getState.bind(this));
		props.pushTo("/linkcard", { status: "browse", id: record.pk_deliveryapply_h.value, pagecode: jsoncode.linkcpageid });
	}
	render() {
		let { defaultSelectGrup, groupCount, assignData, assignShow, ts, index, billID } = this.state;
		let { table, button, search, ncmodal, BillHeadInfo } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButton, getButtons } = button;
		const { createBillHeadInfo } = BillHeadInfo;
		let { showUploader, target, billno, billId } = this.state;
		let createNCModal = ncmodal.createModal;
		return (
			<div className="nc-bill-list">
				{/** 渲染标题栏 **/}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createBillHeadInfo(
							{
								title: loadMultiLang(this.props, '36320DA-000047'),//标题
								initShowBackBtn: false
							}
						)}
					</div>
					<div className="header-button-area">
						{/* {buttons.map((v) => {
							return createButton(v.btncode, {
								name: v.btnname,
								onButtonClick: buttonClick.bind(this),
								buttonColor: this.getButtonNames(v.btncode)
							});
						})} */}
						{this.props.button.createButtonApp({
							area: 'list_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						onRowDoubleClick: this.DoubleClick.bind(this),
						showCheck: true,
						showIndex: true,
						pkname: 'pk_deliveryapply_h',
						dataSource: jsoncode.dataSource,
						onSelected: setButtonUsability.bind(this, this.props),
						onSelectedAll: setButtonUsability.bind(this, this.props),
						componentInitFinished: setButtonUsability.bind(this, this.props)

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
							this.setState({ showUploader: false });
						}}
					/>
					}
				</div>
				<div>
					<Inspection
						show={this.state.show}
						sourceData={this.state.sourceData}
						cancel={this.cancel.bind(this)}
						affirm={this.affirm.bind(this)}
					/>
				</div>
				{/* 审批流指派 */}
				<div>
					{assignShow && <ApprovalTrans
						title={loadMultiLang(this.props, '36320DA-000032')}/* 国际化处理： 指派*/
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							listSingleOperatorNoRecord(this.props, jsoncode.pagecode, jsoncode.tablecode, requesturl.batchcommit, billID, ts, index, loadMultiLang(this.props, '36320DA-000061'), jsoncode.dataSource, true, extParam);/* 国际化处理： 提交成功*/

						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
						}}
					/>}
				</div>
				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.showApprove}
						close={this.closeApprove}
						billtype={this.state.approveBilltype}
						billid={this.state.approveBillId}
					/>
				</div>
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url='/nccloud/sf/allocateapply/allocateapplyprint.do'
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
				{createNCModal('delete', {
					title: loadMultiLang(this.props, '36320DA-000029'),/* 国际化处理： 删除*/
					content: loadMultiLang(this.props, '36320DA-000062'),/* 国际化处理： 确定要删除所选数据吗?*/
					beSureBtnClick: listMultiOperator.bind(this, this.props, jsoncode.pagecode, jsoncode.tablecode, 'pk_deliveryapply_h', requesturl.batchdelete, loadMultiLang(this.props, '36320DA-000029'), jsoncode.dataSource)/* 国际化处理： 删除*/
				})}
			</div>
		);
	}
}

List = createPage({
	mutiLangCode: jsoncode.modulecode
})(List);
//删除 改为下列
//ReactDOM.renderReactDOM.render(<List />, document.querySelector('#app'));
//改为：
export default List;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/