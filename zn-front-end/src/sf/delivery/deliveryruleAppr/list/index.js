/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high } from 'nc-lightapp-front';
let { NCTabsControl } = base;
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
const { NCTabPane } = NCTabs;
let { ApprovalTrans, ApproveDetail } = high;
import { go2Card, listMultiOperator, listSingleOperator, listSingleOperatorNoRecord } from '../../../pub/utils/SFButtonUtil';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, searchBtnClickForPage, setButtonUsability } from './events';
import { jsoncode, requesturl } from '../util/const.js';
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form/index.js';
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../pub/cons/constant.js';
import { getCahceValue, go2card } from "../util/index";
class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = jsoncode.modulecode;
		this.searchId = 'search_deliveryrule_01';
		this.tableId = 'table_deliveryrule_01';
		this.pkMapTs = null;
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
				needApprove: 0
			},
			showBuLu: false,
			onLineData: [],
			modelType: SHOWMODEL_BULU,
			//列表页面表体行号
			index: -1,
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			//时间戳
			ts: '',
			//单据主键
			billID: '',
			approveBilltype: '',//审批意见单据类型
			showApprove: false,//审批意见是否显示
			approveBillId: '',//审批意见单据pk
			//分组页签按钮是不是第一次点击
			isFirst: true,
		},
			initTemplate.call(this, props);
	}
	//关闭审批意见页面
	closeApprove = () => {
		this.setState({
			showApprove: false
		})
	}
	componentDidMount() {
		//从缓存中加载数据
		getCahceValue(this.props, this.updateState.bind(this));
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
	//页签筛选
	navChangeFun = (groupKey, className, e) => {
		this.setState({ activeKey: groupKey });
		searchBtnClick.call(this, this.props, null, groupKey);
	};
	//双击进卡片
	DoubleClick = (record, index, props, e) => {
		//props.pushTo("/card", { status: "browse", id: record.pk_deliveryrule_h.value });
		go2card(props, { pagecode: jsoncode.cpageid, status: 'browse', id: record.pk_deliveryrule_h.value }, this.getState.bind(this));

	}
	//处理网银补录返回信息
	processRetMsg = (retMsg) => {
		let checkData = this.props.table.getCheckedRows(this.tableId);

		let data = {
			pkMapTs: this.pkMapTs,
			results: retMsg,
			isRet: true,
			pageCode: jsoncode.pagecode
		}
		ajax({
			url: '/nccloud/sf/deliveryrule/deliveryruleprocessretmsg.do',
			data: data,
			success: (res) => {
				if (res.success) {
					if (res && res.data) {
						//刷新当前单据
						if (res.data.head && res.data.head[this.formId]) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						}
						if (res.data.body && res.data.body[this.tableId]) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
					}
				}
			}
		});

	}
	render() {
		let { defaultSelectGrup, groupCount, assignData, assignShow, ts, index, billID } = this.state;
		let { table, button, search, modal } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButton, getButtons } = button;
		let { createModal } = modal;
		return (
			<div className="nc-bill-list">
				<div className="nc-bill-header-area">
					<div className="header-title-search-area">
						<h2 className="title-search-detail">{'上收规则设置'}</h2>
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
				</div>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 2 //默认显示几个查询条件
					})}
				</div>
				{/* <div style={{ borderTop: '1px solid #CCC' }}></div> */}
				{/* <div className="tab-definInfo-area"> */}
					<NCTabs activeKey={this.state.activeKey}
						onChange={(v) => {
							this.navChangeFun.call(this, v);
						}}>
						<NCTabPane key={'0'} tab={
							'待提交'
							+ '(' + (groupCount.needCommit || 0) + ')'}
						/>
						<NCTabPane key={'1'} tab={
							'审批中'
							+ '(' + (groupCount.needApprove || 0) + ')'}
						/>
						<NCTabPane key={'2'} tab={
							'全部'
							}
						/>
					</NCTabs>
				{/* </div> */}
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						onRowDoubleClick: this.DoubleClick.bind(this),
						showCheck: true,
						showIndex: true,
						pkname: 'pk_deliveryrule_h',
						dataSource: jsoncode.dataSource,
						onSelected: setButtonUsability.bind(this, this.props),
						onSelectedAll: setButtonUsability.bind(this, this.props)
					})}
				</div>
				{/** 网银补录组件 **/}
				<PayBuluForm
					showmodal={this.state.showBuLu}  //补录框显示
					modal={modal}
					onLineData={this.state.onLineData}  //补录数据
					moduleType={sourceModel_SF}  //模块编码
					modelType={this.state.modelType} //补录框类型
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
				{/* 审批流指派 */}
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
							listSingleOperatorNoRecord(this.props, jsoncode.pagecode, jsoncode.tablecode, requesturl.batchcommit, billID, ts, index, '提交成功', jsoncode.dataSource, true, extParam);

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
			</div>
		);
	}
}

List = createPage({
	// initTemplate: initTemplate,
	mutiLangCode: jsoncode.modulecode
})(List);

export default List;
/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/