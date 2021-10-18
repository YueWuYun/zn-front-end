/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, cardCache, toast, getMultiLang, createPageIcon } from 'nc-lightapp-front';
const { NCTabsControl, NCBackBtn ,NCDiv} = base;
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index"
const { NCTabPane } = NCTabs;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, bodyButtonClick, setButtonUsability } from './events';
import { listMultiOperator, listSingleOperator, listSingleOperatorNoRecord } from '../../../pub/utils/SFButtonUtil';
import {
	module_id, base_url, oid, list_page_code, grid_code, list_search_code, pk_allocateapply_h,
	group_needcommit, group_approving, group_needSubmit, group_all, dataSource, app_code, card_page_id, islink, dataSourceLink
} from '../cons/constant.js';
const { NCUploader, ApproveDetail, PrintOutput, ApprovalTrans, Inspection } = high;
import { getCahceValue, go2card } from "../util/index";
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../tmpub/pub/util/cache';
//预算信息提示工具
import { showTbbInfo } from "../../../../tmpub/pub/util/tbb/index";
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../tmpub/pub/util/index";
import './index.less';

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = module_id;
		this.searchId = list_search_code;
		this.tableId = grid_code;
		this.state = {
			//选中某个页签后 需要赋值
			activeKey: '0',
			//默认显示全部分组
			defaultSelectGrup: 3,
			//当前选中的分组
			selectedGroup: '',
			//分组单据总数
			groupCount: {
				//待提交 总数
				needCommit: 0,
				//待审批 总数
				approving: 0,
				//待委托 总数
				needSubmit: 0
			},
			showUploader: false,//是否显示附件框
			target: null,//附件控制弹出位置
			billId: '',//单据主键
			billno: '',//单据编码
			showplan: false,//联查预算参数
			sourceDataplan: null,//联查预算参数
			approveBilltype: '',//审批意见单据类型
			showApprove: false,//审批意见是否显示
			approveBillId: '',//审批意见单据pk
			outputData: '',//输出数据参数
			listRecord: null,//列表操作数据
			listIndex: 0,//列表行数
			// 取个性化中心设置的组织(用于默认参照过滤)
			curr_pk_org: null,
			//行索引
			rowIndex: -1,
			ts: '',
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			//联查计划预算
			showNtbDetail: false,//是否显示预算计划
			ntbdata: null,//预算计划数据
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

	//关闭审批意见页面
	closeApprove = () => {
		this.setState({
			showApprove: false
		})
	}

	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}

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
		//下游单据核准联查
		let srcbillid = this.props.getUrlParam('srcbillid');
		//凭证反联查
		let src = this.props.getUrlParam('scene');

		if (srcbillid != undefined) {//启用联查方法(核准联查下拨申请)
			//将联查标志加入缓存
			setDefData(dataSource, islink, true);
			this.agreeLinkQueryAllocateApply(srcbillid);

		} else if ('fip' == src) {//启用联查方法(凭证联查下拨申请)
			//将联查标志加入缓存
			setDefData(dataSource, islink, true);
			this.voucherLinkBill();

		} else if (this.props.getUrlParam('pk_ntbparadimvo')) {//启用联查方法(计划预算联查下拨申请)
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

	//核准联查下拨申请
	agreeLinkQueryAllocateApply = (srcbillid) => {
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		//			let queryInfo = props.search.getQueryInfo(list_search_code, false);
		let sendArr = {
			pks: [srcbillid],
			pageid: list_page_code,
			//				oid: queryInfo.oid
		};
		//		let queryInfo = this.props.search.getQueryInfo(list_search_code, false);
		// 		let querycondition = {
		// 			logic: "and",
		// 			conditions: [
		// 				{
		// 					field: 'vbillno',
		// 					value: {
		// 						firstvalue: srcbillid,
		// 						secondvalue: null
		// 					},
		// 					oprtype: '='
		// 				}
		// 			],

		// 		};
		// 		let sendArr = {
		// 			pageInfo: pageInfo,
		// 			querycondition: querycondition,
		// 			pageCode: list_page_code,
		// 			queryAreaCode: list_search_code, //查询区编码
		// //			oid: queryInfo.oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
		// 			querytype: 'tree'
		// 		};
		ajax({
			url: '/nccloud/sf/allocateapply/queryPage.do',
			data: sendArr,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						let { grid, numvalues } = data;
						let rowlenght = data[this.tableId].rows;
						// this.props.table.setAllTableData(this.tableId, data[this.tableId]);
						setDefData(grid_code, dataSourceLink, data[grid_code]);
						let allocateApplyRecord = rowlenght[0];
						this.props.table.setAllTableData(grid_code, data[grid_code]);
						//单条数据跳转卡片
						this.props.pushTo("/card", {
							status: 'browse',
							id: allocateApplyRecord.values.pk_allocateapply_h.value
						});
					} else {
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}
				}
			}
		});
	}

	// 预算联查单据
	getNtbLinkBillData = () => {
		let pageInfo = this.props.table.getTablePageInfo(grid_code);
		ajax({
			url: '/nccloud/sf/allocateapply/allocateapplyntblinkbill.do',
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
							this.props.table.setAllTableData(grid_code, data.grid[grid_code]);
							//1条数据跳转到卡片页面
							this.props.pushTo("/card", {
								status: 'browse',
								id: record.values.pk_allocateapply_h && record.values.pk_allocateapply_h.value
							});
						}
					} else {
						toast({ color: 'warning', content: loadMultiLang(this.props, '36320AA-000062') });/* 国际化处理： 未联查到对应的下拨申请单!*/
						this.props.table.setAllTableData(grid_code, { rows: [] });
					}
				} else {
					toast({ color: 'warning', content: loadMultiLang(this.props, '36320AA-000062') });/* 国际化处理： 未联查到对应的下拨申请单!*/
				}
			}
		});
	}

	// 凭证联查单据
	voucherLinkBill = () => {
		let checkedData = [];
		//缓存中的key为’checkedData’,
		checkedData = cacheTools.get('checkedData');
		if (checkedData && checkedData.length > 0) {
			let data = {
				operatingLogVO: checkedData,
				pageCode: link_list_page_id,
			};
			ajax({
				url: '/nccloud/sf/allocateapply/allocateapplyvoucherlinked.do',
				data: data,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							this.props.table.setAllTableData(grid_code, data.grid[grid_code]);
							let rowlenght = data.grid[grid_code].rows;
							if (rowlenght.length == 1) {
								setDefData(grid_code, dataSourceLink, data.grid[grid_code]);
								let record = rowlenght[0];
								//1条数据跳转到卡片页面
								this.props.pushTo("/card", {
									status: 'browse',
									id: record.values.pk_allocateapply_h && record.values.pk_allocateapply_h.value
								});
							} else {
								//多条数据跳转到列表页面
								this.props.table.setAllTableData(grid_code, data.grid[grid_code]);
							}
						} else {
							toast({ color: 'warning', content: loadMultiLang(this.props, '36320AA-000062') });/* 国际化处理： 未联查到对应的下拨申请单!*/
							this.props.table.setAllTableData(list_table_id, { rows: [] });
						}
					} else {
						toast({ color: 'warning', content: loadMultiLang(this.props, '36320AA-000063') });/* 国际化处理： 未联查到对应的下拨申请单！*/
					}
					setButtonUsability.call(this, this.props);
				}
			});
		}
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
		let { activeKey } = this.state;
		this.navChangeFun(activeKey);
	}
	//页签筛选
	navChangeFun = (groupKey, className, e) => {
		//查询
		// this.setState({selectedGroup: groupKey},()=>{
		// 	searchBtnClick.call(this, this.props, null, groupKey);
		// });
		searchBtnClick.call(this, this.props, null, groupKey);
	};

	beforeUpload(billId, fullPath, file, fileList) {
		// 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
		console.log(billId, fullPath, file, fileList);

		const isJPG = file.type === 'image/jpeg';
		if (!isJPG) {
			alert(this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000053'))/* 国际化处理： 只支持jpg格式图片*/
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			alert(this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000054'))/* 国际化处理： 上传大小小于2M*/
		}
		return isJPG && isLt2M;
		// 备注： return false 不执行上传  return true 执行上传
	}

	//双击进卡片
	onRowDoubleClick = (record, index, props, e) => {
		// props.pushTo('/card', {
		// 	status: 'browse',
		// 	id: record.pk_allocateapply_h.value
		// });
		go2card(props, {
			pagecode: card_page_id, status: 'browse',
			id: record.pk_allocateapply_h.value
		}, this.getState.bind(this));
	}

	//删除确认
	delConfirm = (record, index) => {
		debugger
		let pkMapTs = {};
		let pk = record['pk_allocateapply_h'].value;
		let ts = record['ts'].value;
		pkMapTs[pk] = ts;
		let data = { pkMapTs, pageCode: list_page_code };
		ajax({
			url: base_url + 'batchdelete.do',
			data,
			success: () => {
				//				let showSuccess = showTbbInfo(this.props, record);
				//				if (showSuccess) {
				toast({ color: 'success', content: loadMultiLang(this.props, '36320AA-000028') });/* 国际化处理： 删除成功*/
				//				}
				this.props.table.deleteTableRowsByIndex(grid_code, index);
				//删除成功后, 调用该方法删除缓存中对应id
				deleteCacheDataForList(this.props, grid_code, pk);
			}
		});
	};

	render() {
		let { defaultSelectGrup, groupCount } = this.state;
		let { table, button, search, ncmodal ,BillHeadInfo} = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButton, getButtons } = button;
		let { showUploader, target, billno, billId, rowIndex, ts, assignData, assignShow, showNtbDetail, ntbdata } = this.state;
		let createNCModal = ncmodal.createModal;
		const { createBillHeadInfo } = BillHeadInfo;
		let islinked = getDefData(dataSource, islink);
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{/** 渲染图标**/}
						{createBillHeadInfo(
                            {
                                title: loadMultiLang(this.props, '36320AA-000031'),//标题
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
				{!islinked && <div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this, ),
						defaultConditionsNum: 2 //默认显示几个查询条件
					})}
				</div>}
				{/* {islinked && <div style={{ borderTop: '1px solid #CCC' }}></div>} */}
				{!islinked && <div>
					<NCTabs activeKey={this.state.activeKey}
						onChange={(v) => {
							this.navChangeFun.call(this, v);
						}}>
						<NCTabPane key={'0'} tab={
							<span>
								{loadMultiLang(this.props, '36320AA-000064') + '('}
								<span>{(groupCount.needCommit || 0)}</span>{')'/* 国际化处理： 待提交*/}
							</span>
						}/>
						<NCTabPane key={'1'} tab={
							<span>
								{loadMultiLang(this.props, '36320AA-000065') + '('}
								<span>{(groupCount.approving || 0)}</span>{')'/* 国际化处理： 审批中*/}
							</span>
						}/>
						<NCTabPane key={'2'} tab={
							<span>
								{loadMultiLang(this.props, '36320AA-000066') + '('} 
								<span>{(groupCount.needSubmit || 0)}</span>{')'/* 国际化处理： 待委托*/}
							</span>
						}/>
						<NCTabPane key={'3'} tab={
							loadMultiLang(this.props, '36320AA-000067')/* 国际化处理： 全部*/
						}
						/>
					</NCTabs>
				</div>}
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						dataSource: dataSource,
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: true,
						pkname: 'pk_allocateapply_h',
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
				{/** 审批流指派 **/}
				<div>
					{assignShow && <ApprovalTrans
						title={loadMultiLang(this.props, '36320AA-000034')}/* 国际化处理： 指派*/
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							listSingleOperatorNoRecord(this.props, list_page_code, grid_code, base_url + 'commit.do', billId, ts, rowIndex, loadMultiLang(this.props, '36320AA-000048'), dataSource, true, extParam);/* 国际化处理： 提交*/
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
				{/*批量删除*/}
				{createNCModal('delete', {
					title: loadMultiLang(this.props, '36320AA-000068'),/* 国际化处理： 删除确认*/
					content: loadMultiLang(this.props, '36320AA-000069'),/* 国际化处理： 你确定要删除吗?*/
					beSureBtnClick: listMultiOperator.bind(this, this.props, list_page_code, grid_code, pk_allocateapply_h, '/nccloud/sf/allocateapply/batchdelete.do', loadMultiLang(this.props, '36320AA-000032'), dataSource)/* 国际化处理： 删除*/
				})}
				{/*单笔删除*/}
				{createNCModal('deleteInner', {
					title: loadMultiLang(this.props, '36320AA-000068'),/* 国际化处理： 删除确认*/
					content: loadMultiLang(this.props, '36320AA-000069'),/* 国际化处理： 你确定要删除吗?*/
					beSureBtnClick: listSingleOperator.bind(this, this.props, list_page_code, grid_code, '/nccloud/sf/allocateapply/batchdelete.do', this.state.listRecord, pk_allocateapply_h, this.state.listIndex, loadMultiLang(this.props, '36320AA-000032'), dataSource)/* 国际化处理： 删除*/
				})}
			</div>
		);
	}
}

List = createPage({
	// initTemplate: initTemplate,
	billinfo: {
		billtype: 'card',
		pagecode: list_page_code,
	},
	mutiLangCode: module_id
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/