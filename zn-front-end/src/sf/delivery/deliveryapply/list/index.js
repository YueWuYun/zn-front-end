/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, getMultiLang, createPageIcon } from 'nc-lightapp-front';
let { NCTabsControl, NCDiv } = base;
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
const { NCTabPane } = NCTabs;
const { PrintOutput, NCUploader, ApprovalTrans, ApproveDetail, Inspection } = high;
import { listSingleOperatorNoRecord, listMultiOperator } from '../../../pub/utils/SFButtonUtil';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, searchBtnClickForPage, setButtonUsability } from './events';
import { jsoncode, requesturl } from '../util/const.js';
import { getCahceValue, go2card } from "../util/index";
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
		if (this.props.getUrlParam('pk_ntbparadimvo')) {//启用联查方法(计划预算联查上缴单)
			//将联查标志加入缓存
			setDefData(jsoncode.dataSource, 'islink', true);
			this.getNtbLinkBillData();
		} else {
			//从缓存中加载数据
			getCahceValue(this.props, this.updateState.bind(this));
		}
		//被联查后返回时 回复列表数据
		this.restoreData();
	}
	// 预算联查单据
	getNtbLinkBillData = () => {
		let pageInfo = this.props.table.getTablePageInfo(jsoncode.grid_code);
		ajax({
			url: '/nccloud/sf/deliveryapply/deliveryapplyntblinkbill.do',
			data: {
				pk: this.props.getUrlParam('pk_ntbparadimvo'),
				pageCode: this.pageId,
				pageInfo: pageInfo,
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(jsoncode.grid_code, data.grid[jsoncode.grid_code]);
						let rowlenght = data.grid[jsoncode.grid_code].rows;
						if (rowlenght.length == 1) {
							setDefData(jsoncode.grid_code, 'islink', data.grid[jsoncode.grid_code]);
							let record = rowlenght[0];
							this.props.table.setAllTableData(jsoncode.grid_code, data.grid[jsoncode.grid_code]);
							//1条数据跳转到卡片页面
							this.props.pushTo("/card", {
								status: 'browse',
								id: record.values.pk_deliveryapply_h && record.values.pk_deliveryapply_h.value,
								pagecode: jsoncode.cpageid
							});
						}
					} else {
						toast({ color: 'warning', content: loadMultiLang(this.props, '36320DA-000063') });/* 国际化处理： 未联查到对应的下拨申请单!*/
						this.props.table.setAllTableData(jsoncode.grid_code, { rows: [] });
					}
				} else {
					toast({ color: 'warning', content: loadMultiLang(this.props, '36320DA-000063') });/* 国际化处理： 未联查到对应的下拨申请单!*/
				}
			}
		});
	}
	// 还原列表页数据
	restoreData = () => {
		let tableData = getDefData(jsoncode.grid_code, jsoncode.dataSourceLink);
		if (tableData) {
			this.props.table.setAllTableData(jsoncode.grid_code, tableData);
		}
		setButtonUsability.call(this, this.props);
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
		go2card(props, { pagecode: jsoncode.cpageid, status: 'browse', id: record.pk_deliveryapply_h.value }, this.getState.bind(this));
		// props.pushTo("/card", { status: "browse", id: record.pk_deliveryapply_h.value });
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
		const obj = {
			title: loadMultiLang(this.props, '36320DA-000029'),/* 国际化处理： 删除*/
			content: loadMultiLang(this.props, '36320DA-000062'),/* 国际化处理： 确定要删除所选数据吗?*/
			beSureBtnClick: listMultiOperator.bind(this, this.props, jsoncode.pagecode, jsoncode.tablecode, 'pk_deliveryapply_h', requesturl.batchdelete, loadMultiLang(this.props, '36320DA-000029'), jsoncode.dataSource)/* 国际化处理： 删除*/
		};
		//console.log(obj);
		return (
			<div className="nc-bill-list">
				{/** 渲染标题栏 **/}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createBillHeadInfo(
							{
								title: loadMultiLang(this.props, '36320DA-000028'),//标题
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
						defaultConditionsNum: 2 //默认显示几个查询条件
					})}
				</div>
				{/* <div style={{ borderTop: '1px solid #CCC' }}></div> */}
				<NCTabs activeKey={this.state.activeKey}
					onChange={(v) => {
						this.navChangeFun.call(this, v);
					}}>
					<NCTabPane key={'0'} tab={
						<span>
							{loadMultiLang(this.props, '36320DA-000064')/* 国际化处理： 待提交*/
								+ '('}<span>{groupCount.needCommit || 0}</span>{')'}
						</span>
					} />
					<NCTabPane key={'1'} tab={
						<span>
							{loadMultiLang(this.props, '36320DA-000065')/* 国际化处理： 审批中*/
								+ '('}<span>{groupCount.needApprove || 0}</span>{')'}
						</span>
					} />
					<NCTabPane key={'2'} tab={
						<span>
							{loadMultiLang(this.props, '36320DA-000066')/* 国际化处理： 待委托*/
								+ '('}<span>{groupCount.needSubmit || 0}</span>{')'}
						</span>
					} />
					<NCTabPane key={'4'} tab={
						loadMultiLang(this.props, '36320DA-000067')/* 国际化处理： 全部*/
					}
					/>
				</NCTabs>

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
							listSingleOperatorNoRecord(this.props, jsoncode.pagecode, jsoncode.tablecode, requesturl.batchcommit, billID, ts, index, loadMultiLang(this.props, '36320DA-000010'), jsoncode.dataSource, true, extParam);/* 国际化处理： 提交*/

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
						url='/nccloud/sf/deliveryapply/deliveryapplyprint.do'
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
				{createNCModal('delete', {
					title: loadMultiLang(this.props, '36320DA-000029'),/* 国际化处理： 删除*/
					content: loadMultiLang(this.props, '36320DA-000062'),/* 国际化处理： 确定要删除所选数据吗?*/
					beSureBtnClick: () => listMultiOperator.call(this, this.props, jsoncode.pagecode, jsoncode.tablecode, 'pk_deliveryapply_h', requesturl.batchdelete, loadMultiLang(this.props, '36320DA-000029'), jsoncode.dataSource)/* 国际化处理： 删除*/
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