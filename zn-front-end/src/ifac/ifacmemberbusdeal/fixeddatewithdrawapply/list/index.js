/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, getMultiLang, cardCache, high,toast } from 'nc-lightapp-front';
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index"; 
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm } from './events';
import * as CONSTANTS from '../cons/constant';
import { buttonVisible } from './events/buttonVisible';
import { saveMultiLangRes, loadMultiLang,go2CardCheck } from "../../../../tmpub/pub/util/index";
import {listSingleOperatorNoRecord } from '../busbutton/listOperation';
const { NCTabPane } = NCTabs;
let { setDefData, getDefData } = cardCache;
let { tableId, searchId, LISTGROUP, moudleName, pageCodeList, FixedWithDrawApplyConst, moudleId, base_url, pkname, app_code,billtype} = CONSTANTS;
const { NCDiv } = base;
//引入附件组件
const { NCUploader, ApprovalTrans,ApproveDetail } = high;
class List extends Component {

	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.pageCodeList = pageCodeList;
		this.moudleId = moudleId;
		this.pkname = pkname;
		this.state = {
			//多语
			json: {},
			inlt: null,
			//时间戳
			ts: null,
			index: null,
			record: {},
			numvalues: {},
			//指派数据
			assignData: null,
			//显示审批详情
			showApproveDetail: false,
			//是否显示指派
			assignShow: false,
			//单据主键
			billID: '',
			//单据编码
			billNO: '',
			//当前选中的分组
			selectedGroup: '1',
			//是否显示附件框
			showUploader: false,
		};
	}

	componentWillMount() {
		let numvalues = getDefData('numvalues',FixedWithDrawApplyConst.dataSource );
		if (numvalues) {
			this.setState({ numvalues: numvalues });
		}
		let selectedGroup = getDefData('selectedGroup',FixedWithDrawApplyConst.dataSource );
		if (selectedGroup) {
			this.setState({ selectedGroup: selectedGroup });
		}
		window.onbeforeunload = () => {
		};
		let callback = (json, status, inlt) => {
			if (status) {
				this.setState({ json, inlt });
				initTemplate.call(this, this.props);
				//将多语资源数据存储到页面级缓存中
				saveMultiLangRes(this.props, json);
			}
		}
		getMultiLang({ moduleId: app_code, domainName: moudleName, callback });
	}

	componentDidMount() {

	}
	onRowDoubleClick = (record, index, props, e) => {
		let link = this.props.getUrlParam('scene');
		go2CardCheck({ 
			props,
			url: base_url + 'FDWAgotocardcheck.do',
			pk:record[pkname].value,
			ts:record["ts"].value,
			fieldPK: pkname,
			//动作编码（权限检查 空则不检查）
			actionCode:null,
			//权限编码（权限检查 空则不检查）
			permissionCode:null,
			//是否进行saga检查(默认检查，不涉及云原生改造的单据不用检查)
			checkSaga : false,
			//是否进行ts检查（默认检查，非操作按钮导致的跳转不用检查）
			checkTS : false,
			go2CardFunc: () => {
				props.pushTo('/card', {
					status: 'browse',
					id: record.pk_fwithdrawapply.value,
					scene: link
				});
			}
		});
	}
	//页签筛选
	navChangeFun = (groupKey, className, e) => {
		//查询
		this.setState({ selectedGroup: groupKey }, () => {
			setDefData('selectedGroup',FixedWithDrawApplyConst.dataSource,  groupKey);
			searchBtnClick.call(this, this.props, null, 'simple', null, false);
		});
		buttonVisible.call(this, this.props);
	};
	//刷新
	refresh = () => {
		let { selectedGroup } = this.state;
		//查询 
		this.setState({ selectedGroup: selectedGroup }, () => {
			setDefData( 'selectedGroup',FixedWithDrawApplyConst.dataSource, selectedGroup);
			searchBtnClick.call(this, this.props, null, 'simple', null, false, true);
		});
	}
	
	render() {
		let numvalues = this.state.numvalues;
		let { table, button, search, form, BillHeadInfo } = this.props;
		let buttons = this.props.button.getButtons();
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { showUploader, billID, billNO, selectedGroup, assignShow, assignData, ts, index, showModal,showApproveDetail } = this.state;
		const { createBillHeadInfo } = BillHeadInfo;
		let link = this.props.getUrlParam('scene') === 'linksce';
		return (
			<div className="nc-bill-list">
				{/** 渲染标题栏 **/}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{/* 标题区 */}
						{createBillHeadInfo(
							{
								title: loadMultiLang(this.props, '36340FDWA-000004'),//标题
								initShowBackBtn: false
							}
						)}
					</div>
					<div className="header-button-area">
						{/* 按钮区 */}
						{createButtonApp({
							area: 'list_head',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>
				{/* 查询区 */}
				<div className="nc-bill-search-area">
					{!link && NCCreateSearch(searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						// defaultConditionsNum: 2,
						showAdvBtn: true,                           //  显示高级按钮
						// onAfterEvent: onSearchAfterEvent.bind(this),  //编辑后事件
					})}
				</div>
				{/** 非联查时渲染分组页签 **/}
				{!link && <NCTabs activeKey={selectedGroup} onChange={(v) => {
					this.navChangeFun.call(this, v);
				}}>
					<NCTabPane key={LISTGROUP.NEEDCOMMIT} tab={
						<span>
							{loadMultiLang(this.props, '36340FDWA-000005') + '('}<span>{numvalues && numvalues['WC'] || 0}</span>{')'}
						</span>}
					/>
					<NCTabPane key={LISTGROUP.NEEDAPPROV} tab={
						<span>
							{loadMultiLang(this.props, '36340FDWA-000006') + '('}<span>{numvalues && numvalues['WA'] || 0}</span>{')'}
						</span>}
					/>
					<NCTabPane key={LISTGROUP.NEEDCONSIGN} tab={
						<span>
							{loadMultiLang(this.props, '36340FDWA-000007') + '('}<span>{numvalues && numvalues['WCO'] || 0}</span>{')'}
						</span>}
					/>
					<NCTabPane key={LISTGROUP.CONSIGNING} tab={
						<span>
							{loadMultiLang(this.props, '36340FDWA-000032') + '('}<span>{numvalues && numvalues['CON'] || 0}</span>{')'}
						</span>}
					/>
					<NCTabPane key={LISTGROUP.ALL} tab={
						<span>
							{loadMultiLang(this.props, '36340FDWA-000008')}
						</span>
					} />
				</NCTabs>
				}
				{/* 列表区 */}
				<div className="nc-bill-table-area">
					{createSimpleTable(tableId, {
						pkname: FixedWithDrawApplyConst.pk_filed,
						dataSource: FixedWithDrawApplyConst.dataSource,
						handlePageInfoChange: pageInfoClick.bind(this),
						componentInitFinished: () => {
							buttonVisible.call(this, this.props);
						},
						onRowDoubleClick: this.onRowDoubleClick.bind(this),
						onSelected: buttonVisible.bind(this, this.props),
						onSelectedAll: buttonVisible.bind(this, this.props),
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: true
					})}
				</div>
				{/** 审批流指派 **/}
				<div>
					{assignShow && <ApprovalTrans
						title={loadMultiLang(this.props, '36300-000015')}/* 国际化处理： 指派*/
						data={assignData}
						display={assignShow}
						getResult={(value) => { 
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							listSingleOperatorNoRecord(this.props,
								pageCodeList,
								tableId,
								base_url + 'FDWDWACommitAction.do',
								billID,
								ts,
								index,
								loadMultiLang(this.props, '36340FDWA-000009')/* 国际化处理： 提交*/,
								FixedWithDrawApplyConst.dataSource,
								true,
								extParam,
								(props, data) => {
									buttonVisible.call(this, this.props);
								});
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
						}}
					/>}
				</div>
				{/** 联查工作流 **/}
				<div>
					{showApproveDetail && <ApproveDetail
						show={showApproveDetail}
						billtype={billtype}
						billid={billID}
						close={() => {
							this.setState({
								showApproveDetail: false,
								billID: ''
							})
						}}
					/>}
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
			</div>
		);
	}
}

List = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: pageCodeList,
		bodycode: tableId
	}
})(List);

export default List;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/