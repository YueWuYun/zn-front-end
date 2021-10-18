/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, cardCache, toast } from 'nc-lightapp-front';
const { NCTabsControl, NCBackBtn ,NCDiv} = base;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, bodyButtonClick, setButtonUsability } from './events';
import { listMultiOperator, listSingleOperator, listSingleOperatorNoRecord } from '../../../pub/utils/SFButtonUtil';
import {
	module_id, base_url, oid, list_page_code, grid_code, list_search_code, pk_allocateapply_h,
	group_needcommit, group_approving, group_needSubmit, group_all, dataSource, app_code, card_page_id
} from '../cons/constant.js';
const { NCUploader, ApproveDetail, PrintOutput, ApprovalTrans ,Inspection} = high;
import { getCahceValue, go2card } from "../util/index";
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../tmpub/pub/util/cache';
//预算信息提示工具
import { showTbbInfo } from "../../../../tmpub/pub/util/tbb/index";
import './index.less';

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = module_id;
		this.searchId = list_search_code;
		this.tableId = grid_code;
		this.state = {
			//选中某个页签后 需要赋值
			activeKey: 0,
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
		};
		initTemplate.call(this, props);
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

	componentDidMount() {
		let srcbillid = this.props.getUrlParam('srcbillid');
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		//启用联查方法
		if (srcbillid != undefined) {
			let querycondition = {
				logic: "and",
				conditions: [
					{
						field: 'vbillno',
						value: {
							firstvalue: srcbillid,
							secondvalue: null
						},
						oprtype: '='
					}
				],

			};
			let sendArr = {
				pageInfo: pageInfo,
				querycondition: querycondition,
				pageCode: list_page_code,
				queryAreaCode: list_search_code, //查询区编码
				oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
				querytype: 'tree'
			};
			ajax({
				url: '/nccloud/sf/allocateapply/allocateapplysourcelinked.do',
				data: sendArr,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							let { grid, numvalues } = data;
							let rowlenght = data[this.tableId].rows;
							this.props.table.setAllTableData(this.tableId, data[this.tableId]);
							let allocateApplyRecord = rowlenght[0];
							//单条数据跳转卡片
							// this.props.pushTo('/card', {
							// 	status: 'browse',
							// 	scence: 'linksce',// 被联查时 专属识别标志
							// 	id: allocateApplyRecord.values.pk_allocateapply_h.value
							// });
							go2card(this.props, {
								pagecode: card_page_id,
								status: 'browse',
								id: allocateApplyRecord.values.pk_allocateapply_h.value
							}, this.getState.bind(this));
						} else {
							this.props.table.setAllTableData(this.tableId, { rows: [] });
						}
					}
				}
			});
		} else {
			//从缓存中加载数据
			getCahceValue(this.props, this.updateState.bind(this));
		}
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

	getData = (serval) => {
		// let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		let data = {
			conditions: [
				{
					field: 'applydate',
					value: {
						firstvalue: '2015-04-10',
						secondvalue: '2020-04-20'
					},
					oprtype: 'between'
				},
				{
					field: 'pk_org',
					value: {
						firstvalue: '0001A110000000003C2M',
						secondvalue: null
					},
					display: "NC产品本部",
					oprtype: '='
				}
			],
			pagecode: '36320AA_L01',
			pageInfo: {
				pageIndex: 1,
				pageSize: 10,
				total: 23,
				totalPage: 3
			},
			queryAreaCode: 'search_allocateapply_01',
			oid: '1001Z6100000000085ZM',
			queryType: 'simple'
		};

		ajax({
			url: '/nccloud/sf/allocateapply/queryscheme.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(this.tableId, data[this.tableId]);
					} else {
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}
				}
			}
		});
	};
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
		props.pushTo('/card', {
			status: 'browse',
			id: record.pk_allocateapply_h.value
		});
	}

	//删除确认
	delConfirm = (record, index) => {
		let pkMapTs = {};
		let pk = record['pk_allocateapply_h'].value;
		let ts = record['ts'].value;
		pkMapTs[pk] = ts;
		let data = { pkMapTs, pageCode: list_page_code };
		ajax({
			url: base_url + 'batchdelete.do',
			data,
			success: () => {
				let showSuccess = showTbbInfo(this.props, record);
				if (showSuccess) {
					toast({ color: 'success', content: '删除成功' });
				}
				this.props.table.deleteTableRowsByIndex(grid_code, index);
				//删除成功后, 调用该方法删除缓存中对应id
				deleteCacheDataForList(this.props, grid_code, pk);
			}
		});
	};

	render() {
		let { defaultSelectGrup, groupCount } = this.state;
		let { table, button, search, ncmodal } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButton, getButtons } = button;
		let { showUploader, target, billno, billId, rowIndex, ts, assignData, assignShow } = this.state;
		let createNCModal = ncmodal.createModal;
		return (
			<div className="nc-bill-list">
				<div className="nc-bill-header-area">
					<div className="header-title-search-area">
						<h2 className="title-search-detail">{"下拨申请"}</h2>
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'list_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</div>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this, ),
						defaultConditionsNum: 2 //默认显示几个查询条件
					})}
				</div>
				{/* <div style={{ borderTop: '1px solid #CCC' }}></div> */}
				<div className="tab-definInfo-area">
					<NCTabsControl defaultKey={this.state.activeKey}>
						<div key={group_needcommit} clickFun={this.navChangeFun.bind(this, 0)}>
							{"待提交"}&nbsp;&nbsp;
							<span>({groupCount.needCommit || 0})</span>{//待提交
							}
						</div>
						<div key={group_approving} clickFun={this.navChangeFun.bind(this, 1)}>
							{"审批中"}&nbsp;&nbsp;
							<span>({groupCount.approving || 0})</span>{//审批中
							}
						</div>
						<div key={group_needSubmit} clickFun={this.navChangeFun.bind(this, 2)}>
							{"待委托"}&nbsp;&nbsp;
							<span>({groupCount.needSubmit || 0})</span>{//待委托
							}
						</div>
						<div key={group_all} clickFun={this.navChangeFun.bind(this, 3)}>
							{"全部"}&nbsp;&nbsp;
						</div>{//全部
						}
					</NCTabsControl>
				</div>
				<div style={{ height: '10px' }} />
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						dataSource: dataSource,
						componentInitFinished: () => {
							//缓存数据赋值成功的钩子函数
							//若初始化数据后需要对数据做修改，可以在这里处理
						},
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: true,
						onSelected: setButtonUsability.bind(this, this.props),
						onSelectedAll: setButtonUsability.bind(this, this.props),
						onRowDoubleClick: this.onRowDoubleClick.bind(this)
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
				<div>
					{/*计划预算 联查提示页面*/}
					<Inspection
						show={this.state.showplan}
						sourceData={this.state.sourceDataplan}
						cancel={this.cancel.bind(this)}
						affirm={this.affirm.bind(this)}
					/>
				</div>
				{/** 审批流指派 **/}
				<div>
					{assignShow && <ApprovalTrans
						title={'指派'}
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							listSingleOperatorNoRecord(this.props, list_page_code, grid_code, base_url + 'commit.do', billId, ts, rowIndex, '提交成功！', dataSource, true, extParam);
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
					title: '删除确认',
					content: '你确定要删除吗?',
					beSureBtnClick: listMultiOperator.bind(this, this.props, list_page_code, grid_code, pk_allocateapply_h, '/nccloud/sf/allocateapply/batchdelete.do', '删除', dataSource)
				})}
				{/*单笔删除*/}
				{createNCModal('deleteInner', {
					title: '删除确认',
					content: '你确定要删除吗?',
					beSureBtnClick: listSingleOperator.bind(this, this.props, list_page_code, grid_code, '/nccloud/sf/allocateapply/batchdelete.do', this.state.listRecord, pk_allocateapply_h, this.state.listIndex, '删除', dataSource)
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