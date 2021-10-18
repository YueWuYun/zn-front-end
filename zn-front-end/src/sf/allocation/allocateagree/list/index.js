/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, getMultiLang, createPageIcon } from 'nc-lightapp-front';
let { NCTabsControl, NCFormControl, NCAffix ,NCDiv} = base;
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
const { NCTabPane } = NCTabs;
import { setButtonUsabilitys, buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, onSearchAfterEvent } from './events';
import { listMultiOperator, listSingleOperator, listSingleOperatorNoRecord } from '../../../pub/utils/SFButtonUtil';
//引入常量定义
import { module_id, base_url, lang, button_limit, oid, list_page_id, list_search_id, list_table_id, AllocateAgreeCache, funcode } from '../cons/constant.js';
//引入附件组件
const { NCUploader, ApproveDetail, ApprovalTrans, Inspection } = high;
import { go2card, getCahceValue } from '../util/index';
import Modal from "../../../../tmpub/pub/util/modal/index";
import { backConfirm } from "./events/buttonClick";
import { backConfirmInner } from "./events/bodyButtonClick";
import { getDefData, setDefData } from '../../../../tmpub/pub/util/cache';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../tmpub/pub/util/index";


class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = module_id;
		this.searchId = list_search_id;
		this.tableId = list_table_id;
		this.pageId = list_page_id;


		this.state = {
			numvalues: {
				WAITCOMMIT: 0,
				WAITAPPROVE: 0,
				WAITALLOCATE: 0
			},
			show: false,//联查预算参数	
			sourceData: null,//联查预算参数
			accModalShow: false,//内部账户余额参数

			//默认显示全部分组
			//activeKey: '',
			//当前选中的分组
			selectedGroup: '0',
			//是否显示附件框
			showUploader: false,
			//单据主键
			billID: '',
			//单据编码
			billNO: '',
			approveBilltype: '',//审批意见单据类型
			showApprove: false,//审批意见是否显示
			approveBillId: '',//审批意见单据pk
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			ts: '',
			//行索引
			rowIndex: -1,
			returnnote: '',

			//退回弹框
			showReBack: false,
			showReBackinner: false,
			record: '',
			index: '',
			json: {},
			inlt: null

		};
		// initTemplate.call(this, props);
	}
	componentDidMount() {

		let querytype = this.props.getUrlParam('linkquerytype');
		let srcbillid = this.props.getUrlParam('srcbillid');
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		let pks = Array.isArray(srcbillid) ? srcbillid : [srcbillid];

		if (querytype) {
			setDefData(AllocateAgreeCache, AllocateAgreeCache.islink, true);
			let sendArr = {
				pageInfo: pageInfo,
				linkquerytype: querytype,
				pks: pks
			};
			ajax({
				url: '/nccloud/sf/allocation/linkquery.do',
				data: sendArr,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							let rowlenght = data[list_table_id].rows;
							// let src = this.props.getUrlParam('src');
							if (rowlenght.length == 1) {
								let allocateAgreeRecord = rowlenght[0];
								//单条数据跳转卡片
								this.props.pushTo('/card', {
									status: 'browse',
									id: allocateAgreeRecord.values.pk_allocateagree_h.value,
									autolink: "Y"
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
		}
		//从缓存中加载数据
		getCahceValue(this.props, this.updateState.bind(this));
		setButtonUsabilitys.call(this, this.props);
	}

	// componentWillMount() {
	// 	let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
	// 		if (status) {
	// 			saveMultiLangRes(this.props,json);
	// 			initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
	// 			this.setState({ json, inlt })       // 保存json和inlt到页面state中并刷新页面
	// 		} else {
	// 			//console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
	// 		}

	// 	}
	// 	getMultiLang({ moduleId: lang, domainName: 'sf', callback});
	// }

	componentWillMount() {
		getMultiLang({
			//模块编码
			moduleId: [module_id, funcode],
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

	//页签筛选
	navChangeFun = (groupKey, isRefresh) => {

		//查询
		this.state.selectedGroup = groupKey;
		searchBtnClick.call(this, this.props, null, groupKey,isRefresh);
	};

	//刷新
	refresh = (isRefresh) => {
		let { selectedGroup } = this.state;
		this.navChangeFun(selectedGroup,isRefresh);
	}


	//关闭审批意见页面
	closeApprove = () => {
		this.setState({
			showApprove: false
		})
	}


	//双击进卡片
	onRowDoubleClick = (record, index, props, e) => {
		if(getDefData(AllocateAgreeCache, AllocateAgreeCache.islink)){
			props.pushTo('/card', {
				pagecode: '36320FAA_C01',
				status: 'browse',
				id: record.pk_allocateagree_h.value
			});
		}else{
			go2card(props, {
				pagecode: '36320FAA_C01',
				status: 'browse',
				id: record.pk_allocateagree_h.value
			},
				this.getState.bind(this));
		}
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


	render() {
		let numvalues = this.state.numvalues;
		let { table, button, search, ncmodal, modal ,BillHeadInfo} = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable, getTablePageInfo } = table;
		let { NCCreateSearch } = search;
		let { createButton, getButtons, createButtonApp } = button;
		let { showUploader, billNO, billID, assignShow, assignData } = this.state;
		let { createModal } = modal;
		const { createBillHeadInfo } = BillHeadInfo;
		let createNCModal = ncmodal.createModal;
		//获取缓存中的是否联查标志
		let islink = getDefData(AllocateAgreeCache, AllocateAgreeCache.islink);
		/* 按钮适配 第二步: 从 props.button中取到 createButtonApp 方法用来创建按钮组*/
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
							{/** 渲染图标**/}
							{createBillHeadInfo(
								{
									title: loadMultiLang(this.props, '36320FAA-000042'),//标题
									initShowBackBtn: false
								}
							)}						
						</div>
						<div className="header-button-area">
							{/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
							{createButtonApp({
								area: "list_head", onButtonClick: buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
				</NCDiv>
				{!islink && <div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						// defaultConditionsNum: 2,
						showAdvBtn: true,                           //  显示高级按钮
						onAfterEvent: onSearchAfterEvent.bind(this),  //编辑后事件
					})}
				</div>}
				{/* {islink && <div style={{ borderTop: '1px solid #CCC' }}></div>} */}
				{!islink && <div>
					<NCTabs activeKey={this.state.selectedGroup}
						onChange={(v) => {
							this.navChangeFun.call(this, v);
						}}>
						<NCTabPane key={'0'} tab={
							<span>
								{loadMultiLang(this.props, '36320FAA-000021') + '('} 
								<span>{(numvalues && numvalues.WAITCOMMIT || 0)}</span> {')'/* 国际化处理： 待提交*/}
							</span>
						}/>
						<NCTabPane key={'1'} tab={
							<span>
								{loadMultiLang(this.props, '36320FAA-000022') + '('}
								<span>{(numvalues && numvalues.WAITAPPROVE || 0)}</span>{')'/* 国际化处理： 审批中*/}
							</span>
						}/>
						<NCTabPane key={'2'} tab={
							<span>
								{loadMultiLang(this.props, '36320FAA-000023') + '('}
								<span>{(numvalues && numvalues.WAITALLOCATE || 0)}</span>{')'/* 国际化处理： 待下拨*/}
							</span>
						}/>
						<NCTabPane key={'3'} tab={
							loadMultiLang(this.props, '36320FAA-000024')/* 国际化处理： 全部*/
						}
						/>
					</NCTabs>
				</div>}
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: true,
						dataSource: AllocateAgreeCache,
						pkname: 'pk_allocateagree_h',
						onSelected: setButtonUsabilitys.bind(this, this.props),
						onSelectedAll: setButtonUsabilitys.bind(this, this.props),
						onRowDoubleClick: this.onRowDoubleClick.bind(this),
						componentInitFinished: setButtonUsabilitys.bind(this, this.props),
						//						componentInitFinished:()=>{
						//缓存数据赋值成功的钩子函数
						//若初始化数据后需要对数据做修改，可以在这里处理
						//						}

					})}
				</div>
				{/** 附件 **/}
				<div className="nc-faith-demo-div2">
					{showUploader &&
						<NCUploader
							billId={billID}
							target={null}
							placement={'bottom'}
							billNo={billNO}
							onHide={() => {
								this.setState({ showUploader: false });
							}}
						/>
					}
				</div>

				<div>
					{
						<Inspection
							show={this.state.show}
							sourceData={this.state.sourceData}
							cancel={this.cancel.bind(this)}
							affirm={this.affirm.bind(this)}
						/>
					}
				</div>
				{/** 审批流指派 **/}
				<div>
					{assignShow && <ApprovalTrans
						title={loadMultiLang(this.props, '36320FAA-000010')}/* 国际化处理： 指派*/
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							listSingleOperatorNoRecord(this.props, list_page_id, list_table_id, base_url + 'alloagreecommit.do', this.state.billID, this.state.ts, this.state.rowIndex, loadMultiLang(this.props, '36320FAA-000002'), AllocateAgreeCache, true, extParam);/* 国际化处理： 提交*/
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null });
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


				{/* 退回模态框 */}
				<Modal
					title={loadMultiLang(this.props, '36320FAA-000012')}/* 国际化处理： 退回原因*/
					label={loadMultiLang(this.props, '36320FAA-000012')}/* 国际化处理： 退回原因*/
					show={this.state.showReBack || this.state.showReBackinner}
					onOk={(value) => {
						//处理退回
						if (this.state.showReBack) {
							backConfirm.call(this, this.props, value);
						} else {
							backConfirmInner.call(this, this.props, this.state.record, this.state.index, value);
						}
					}}
					onClose={() => {
						this.setState({ showReBack: false, showReBackinner: false })
					}}
				/>

				{/*批量收回*/}
				{createNCModal('back', {
					title: loadMultiLang(this.props, '36320FAA-000025'),/* 国际化处理： 收回确认*/
					content: loadMultiLang(this.props, '36320FAA-000026'),/* 国际化处理： 你确定要收回吗?*/
					//listMultiOperator = function (props, pageCode, tableCode, pkName, url, successMess, datasource, showTBB, extParam, callback) {
					beSureBtnClick: listMultiOperator.bind(this, this.props, list_page_id, list_table_id, 'pk_allocateagree_h', '/nccloud/sf/allocation/alloagreeuncommit.do', loadMultiLang(this.props, '36320FAA-000003'), AllocateAgreeCache, true)/* 国际化处理： 收回*/
				})}
			</div>
		);
	}
}

List = createPage({
	mutiLangCode: "36320FAA"

})(List);

// ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/