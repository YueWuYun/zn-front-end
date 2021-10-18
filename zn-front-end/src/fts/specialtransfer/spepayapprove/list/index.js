/*cI4u54VYZVPxnvGrX5EL6DhQLKLvsjv+xJQO0cjqQUunJngTbJoVbN8iY5o8EoG5*/
/**
 * 特转付款单列表界面
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high ,getMultiLang,createPageIcon} from 'nc-lightapp-front';
let { NCTabsControl, NCAffix } = base;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick } from './events';
import ReasonModal from '../../../pub/utils/modalContentConfig.js';
//预算信息提示工具
import { showTbbInfo } from "../../../../tmpub/pub/util/tbb/index";
//引入常量定义
import { module_id,module_name,module_tmpub_id,module_tmpub_name, funcode,base_url, button_limit, oid, list_page_id, list_search_id, list_table_id, group_needcommit, group_approving, group_all, billtype, dataSource, pkName } from '../cons/constant.js';
//引入附件、联查审批意见组件
const { NCUploader, ApproveDetail, ApprovalTrans, Inspection } = high;
//引入缓存
import { deleteCacheDataForList, setDefData } from '../../../../tmpub/pub/util/cache';
import { listSingleOperator, listSingleOperatorNoRecord } from '../../../pub/utils/FTSButtonUtil';
import { getCahceValue, goTocard, setListButtonUseful } from '../util/spepayUtil';
import { saveMultiLangRes, loadMultiLang } from "../../../../tmpub/pub/util/index";

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//当前选中的分组
			selectedGroup: 0,
			//分组单据总数
			groupCount: {
				//待提交 总数
				needCommit: 0,
				//审批中 总数
				approving: 0
			},
			//是否显示附件框
			showUploader: false,
			//单据主键
			billID: '',
			//单据编码
			billNO: '',
			//是否显示审批意见
			approveshow: false,
			//是否显示退回的原因框
			showBackModal: false,
			//退回原因
			backReason: '',
			//列表页面表体行记录
			record: {},
			//列表页面表体行号
			index: null,
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			//时间戳
			ts: '',
			//是否显示预算计划
			showNtbDetail: false,
			//预算计划数据
			ntbdata: null
		}
		// initTemplate.call(this, props);
	}

	componentWillMount() {
		getMultiLang({
			//模块编码
			moduleId: {
				//tmpub模块多语资源
				[module_tmpub_name]:[module_tmpub_id],
				//fts模块多语资源
				[module_name]:[module_id,funcode]
				
			},
			//领域编码
			domainName: 'fts',
			//回调
			callback: (lang) => {
				//将多语资源数据存储到页面级缓存中
				saveMultiLangRes(this.props, lang);
				//初始化模板
				initTemplate.call(this,this.props);
			}
		});
	}

	componentDidMount() {
		//从缓存中加载数据
		getCahceValue(this.props, this.updateState.bind(this));
		setListButtonUseful.call(this);
	}

	/**
	 * 更新state中的数据
	 */
	updateState(obj) {
		if (!obj || Object.keys(obj).length == 0) {
			return;
		}
		this.setState(obj);
	}

	/**
	 * 获取state中的数据
	 * @param {*} key 
	 */
	getState(key) {
		return this.state[key];
	}

	//打开审批意见弹框
	openApprove = () => {
		this.setState({
			approveshow: true
		})
	}

	//关闭审批意见弹框
	closeApprove = () => {
		this.setState({
			approveshow: false
		})
	}

	//双击行进入卡片页面
	onRowDoubleClick = (record, index, props, e) => {
		goTocard(this.props, { status: 'browse', id: record.pk_spepay_h.value, from: 'list' }, this.getState.bind(this));
	}

	//页签筛选
	navChangeFun = (groupKey, className, e) => {
		//查询
		searchBtnClick.call(this, this.props, null, groupKey);
	};

	//删除确认
	delConfirm = (record, index) => {
		let pkMapTs = {};
		let pk = record.pk_spepay_h.value;
		let ts = record.ts.value;
		pkMapTs[pk] = ts;
		const that = this;
		let data = { pkMapTs: pkMapTs, pageCode: list_page_id };
		ajax({
			url: base_url + 'spepaydelete.do',
			data: data,
			success: () => {
				let showSuccess = showTbbInfo(this.props, record);
				if(showSuccess){
					toast({ color: 'success', content: this.props.MutiInit.getIntl("1880000025") && this.props.MutiInit.getIntl("1880000025").get('1880000025-000018') });/* 国际化处理： 删除成功*/
				}
				this.props.table.deleteTableRowsByIndex(list_table_id, index);
				//删除成功后, 调用该方法删除缓存中对应id
				deleteCacheDataForList(this.props, list_table_id, pk);
			}
		});
	};

	//修改单据
	editData = (record, index) => {
		let pk = record.pk_spepay_h.value;
		let data = { pk: pk, pageCode: list_page_id };
		ajax({
			url: base_url + 'spepayedit.do',
			data: data,
			success: () => {
				//成功后再向页面跳转
				goTocard(this.props, { status: 'edit', id: pk, from: 'list' }, this.getState.bind(this));
			}
		});
	}

	//模态框点击确定并从textarea取值
	beSureClick = (flag = false) => {
		let valInTextarea = this.state.backReason;
		if (flag && (!valInTextarea || valInTextarea.replace(/(^\s*)|(\s*$)/g, "") == "")) {
			toast({ content: this.props.MutiInit.getIntl("1880000025") && this.props.MutiInit.getIntl("1880000025").get('1880000025-000046'), color: 'warning' });/* 国际化处理： 请填入退回原因！*/
		} else {
			//输入的退回原因
			//console.log(valInTextarea);
			let record = this.state.record;
			let index = this.state.index;
			let extParam = { 'reason': valInTextarea };
			//这里可以加入逻辑处理
			record.retbillreason = { value: valInTextarea };
			listSingleOperator(this.props, list_page_id, list_table_id, base_url + 'spepayback.do', record, 'pk_spepay_h', index, this.props.MutiInit.getIntl("1880000025") && this.props.MutiInit.getIntl("1880000025").get('1880000025-000023'), dataSource, extParam);/* 国际化处理： 退回成功！*/
			this.setState({ showBackModal: false, backReason: '', record: {}, index: null });//关闭模态框
		}
	}

	//输入框
	onChange = (e) => {
		this.setState({ backReason: e });
	}

	//刷新
	refresh = () => {
		let { selectedGroup } = this.state;
		this.navChangeFun(selectedGroup);
	}

	render() {
		let { selectedGroup, groupCount } = this.state;
		let { table, button, search } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(module_id);
		let { createSimpleTable, getTablePageInfo } = table;
		let { NCCreateSearch } = search;
		let { createButton, getButtons, createButtonApp } = button;
		let { showNtbDetail, ntbdata, ts, index, assignData, assignShow, backReason, showBackModal, showUploader, billNO, billID, approveshow } = this.state;
		const that = this;
		return (
			<div className="nc-bill-list">
				<NCAffix>
					<div className="nc-bill-header-area">
						<div className="header-title-search-area">
							{/** 渲染图标**/}
							{createPageIcon()}
							<h2 className="title-search-detail">{this.props.MutiInit.getIntl("1880000025") && this.props.MutiInit.getIntl("1880000025").get('1880000025-000026')}</h2>/* 国际化处理： 特转付款*/
						</div>
						<div className="header-button-area">
							{
								createButtonApp({ onButtonClick: buttonClick.bind(that), area: "list_head" })
							}
						</div>
					</div>
				</NCAffix>
				<div className="nc-bill-search-area">
					{NCCreateSearch(list_search_id, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 2 //默认显示几个查询条件
					})}
				</div>
				<div className="tab-definInfo-area">
					<NCTabsControl defaultKey={selectedGroup}>
						<div key={0} clickFun={this.navChangeFun.bind(this, 0)}>
							{this.props.MutiInit.getIntl("1880000025") && this.props.MutiInit.getIntl("1880000025").get('1880000025-000047')}&nbsp;&nbsp;/* 国际化处理： 待提交*/
							<span>{'(' + (groupCount.needCommit || 0) + ')'}</span>
						</div>
						<div key={1} clickFun={this.navChangeFun.bind(this, 1)}>
							{this.props.MutiInit.getIntl("1880000025") && this.props.MutiInit.getIntl("1880000025").get('1880000025-000048')}&nbsp;&nbsp;/* 国际化处理： 审批中*/
							<span>{'(' + (groupCount.approving || 0) + ')'}</span>
						</div>
						<div key={2} clickFun={this.navChangeFun.bind(this, 2)}>
							{this.props.MutiInit.getIntl("1880000025") && this.props.MutiInit.getIntl("1880000025").get('1880000025-000049')}&nbsp;&nbsp;/* 国际化处理： 全部*/
						</div>
					</NCTabsControl>
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(list_table_id, {
						dataSource: dataSource,
						pkname: pkName,
						handlePageInfoChange: pageInfoClick.bind(this),
						onRowDoubleClick: this.onRowDoubleClick.bind(this),//双击每行进入卡片页面
						onSelected: setListButtonUseful.bind(this),
						onSelectedAll: setListButtonUseful.bind(this),
						showCheck: true,
						showIndex: true
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
				{/** 联查审批意见 **/}
				<div className="nc-faith-demo-div2">
					{approveshow &&
						<ApproveDetail
							show={this.state.approveshow}
							close={this.closeApprove}
							billtype={billtype}
							billid={billID}
						/>
					}
				</div>
				{/* 退回原因 */}
				<div>
					{showBackModal &&
						<ReasonModal title={this.props.MutiInit.getIntl("1880000025") && this.props.MutiInit.getIntl("1880000025").get('1880000025-000024')/* 国际化处理： 请输入退回原因*/}
							show={this.state.showBackModal} //布尔值，true为显示，false为不显示
							open={() => {
								this.setState({ showBackModal: true })
							}} //打开模态框
							close={() => {
								this.setState({ showBackModal: false, backReason: '' })
							}} //关闭模态框
							beSureClick={this.beSureClick.bind(this, true)} //确认按钮
							onChange={this.onChange}
							value={backReason}
						/>

					}
				</div>
				{/* 审批流指派 */}
				<div>
					{assignShow && <ApprovalTrans
						title={this.props.MutiInit.getIntl("1880000025") && this.props.MutiInit.getIntl("1880000025").get('1880000025-000025')}/* 国际化处理： 指派*/
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							listSingleOperatorNoRecord(this.props, list_page_id, list_table_id, base_url + 'spepaycommit.do', billID, ts, index, this.props.MutiInit.getIntl("1880000025") && this.props.MutiInit.getIntl("1880000025").get('1880000025-000007'), dataSource, true, extParam);/* 国际化处理： 提交成功！*/
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
						}}
					/>}
				</div>
				{/** 联查预算 **/}
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
	// initTemplate: initTemplate,
	mutiLangCode: module_id
})(List);

export default List;

/*cI4u54VYZVPxnvGrX5EL6DhQLKLvsjv+xJQO0cjqQUunJngTbJoVbN8iY5o8EoG5*/