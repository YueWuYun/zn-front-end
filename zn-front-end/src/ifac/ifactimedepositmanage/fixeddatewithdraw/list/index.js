/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, getMultiLang, cardCache,high, } from 'nc-lightapp-front';
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, afterEvent } from './events';
import * as CONSTANTS from '../cons/constant';
import { buttonVisible } from './events/buttonVisible';
import { saveMultiLangRes, loadMultiLang,createListWebSocket,go2CardCheck } from "../../../../tmpub/pub/util/index";
import { listMultiOperator,listSingleOperatorNoRecord } from '../busbutton/listOperation';
import Modal from "../../../../tmpub/pub/util/modal/index";
const { NCTabPane } = NCTabs;
let { setDefData, getDefData } = cardCache;
let { moudleName,tableId, searchId,LISTGROUP, pageCodeList,FixedWithDrawConst, moudleId,base_url, pkname,app_code,formId,billtype } = CONSTANTS;
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
		this.flag = false; //是否联查
		this.state = {
			showModal: false,
			tableshowModal:false,
			//时间戳
			ts: null,
			index: null,
			record: {},
			numvalues: {},
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			//是否显示审批详情
			showApproveDetail: false,
			//单据主键
			billID: '',
			//单据编码
			billNO: '',
			//当前选中的分组
			selectedGroup: '1',
			//是否显示附件框
			showUploader: false,
			extParam:{}
		};
	}

	componentWillMount() {
		let numvalues = getDefData('numvalues',FixedWithDrawConst.dataSource);
		if (numvalues) {
			this.setState({ numvalues: numvalues });
		}
		let selectedGroup = getDefData('selectedGroup',FixedWithDrawConst.dataSource);
		if (selectedGroup) {
			this.setState({ selectedGroup: selectedGroup });
		}
		window.onbeforeunload = () => {
		};
		let callback = (json, status, inlt) => {
			if(status) {
				this.setState({ json, inlt });
				initTemplate.call(this, this.props);
				//将多语资源数据存储到页面级缓存中
				saveMultiLangRes(this.props, json);
			}
		}
		getMultiLang({ 
			moduleId: {
				['ifac']: ['36340FDW', '36340PUBLIC'],
				['tmpub']: ['3601']
			}, 
			callback });
	}

	componentDidMount() {

	}
	onRowDoubleClick = (record, index, props, e) => {
		let scene = (props.getUrlParam("scene")==='fip'||props.getUrlParam("scene")==='linksce')?'linksce':null;
		let islinklistquery=(props.getUrlParam("scene")==='fip'||props.getUrlParam("scene")==='linksce')?true:null;
		go2CardCheck({ 
			props,
			url: base_url + 'FDWgotocardcheck.do',
			pk:record.pk_fixeddatewithdraw.value,
			ts:record.ts.value,
			fieldPK: pkname,
			actionCode:null,
			//权限编码（权限检查 空则不检查）
			permissionCode:null,
			//是否进行saga检查(默认检查，不涉及云原生改造的单据不用检查)
			checkSaga : false,
			checkTS: false,
			go2CardFunc: () => {
				props.pushTo('/card', {
					status: 'browse',
					scene,
					islinklistquery,
					id: record.pk_fixeddatewithdraw.value
				});
			}
		});
	}
	//页签筛选
	navChangeFun = (groupKey, className, e) => {
		//查询
		this.setState({ selectedGroup: groupKey }, () => {
			setDefData('selectedGroup',FixedWithDrawConst.dataSource, groupKey);
			searchBtnClick.call(this, this.props, null, 'simple', null, false);
		});
		buttonVisible.call(this, this.props);
	};
	//刷新
	refresh = () => {
		let { selectedGroup } = this.state;
		//查询
		this.setState({ selectedGroup: selectedGroup }, () => {
			setDefData('selectedGroup',FixedWithDrawConst.dataSource,  selectedGroup);
			searchBtnClick.call(this, this.props, null, 'simple', null, false, true);
		});
	}
	//切换页面状态
	toggleShow = () => {
		this.props.form.setFormStatus(formId,status);
		//设置表单状态
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.billNO  //修改单据号---非必传
		});
		buttonVisible.call(this, this.props);
		//开关关闭
	};
	// 模态框点击确定并从textarea取值
	beSureClick = (props, value, flag = false) => {
		if (!value) {
			toast({ 'color': 'warning', 'content': loadMultiLang(props, '36340FDW-000036') });/* 国际化处理： 退回原因不能为空！*/
			return;
		}
		let { record,index,tableshowModal,showModal } = this.state;
		let extParam = {};
		extParam["returnnote"] = value;
		if(tableshowModal){
			listSingleOperatorNoRecord( 
				props, 
				pageCodeList, 
				tableId, 
				base_url + 'FDWDWReturnAction.do', 
				record[pkname],  
				record['ts'], 
				index, 
				loadMultiLang(this.props, '36340FDW-000010')/* 国际化处理： 退回*/, 
				FixedWithDrawConst.dataSource, 
				null, 
				extParam);
				this.setState({ tableshowModal: false });
		}else if(showModal){
			// 退回单据
			listMultiOperator(
				props, 
				pageCodeList, 
				tableId,
				pkname, 
				base_url+'FDWDWReturnAction.do', 
				loadMultiLang(this.props, '36340FDW-000010'),
				FixedWithDrawConst.dataSource,
				null,
				extParam);/* 国际化处理： 退回*/
			// buttonVisible.call(this,this.props);
			this.setState({ showModal: false });
		}
		buttonVisible.call(this,this.props);
	}
	
	render() {
		let numvalues = this.state.numvalues;
		let { table, button, search, form, BillHeadInfo } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let multiLang = this.props.MutiInit.getIntl(app_code);
		let {showUploader,billID,billNO,selectedGroup,assignShow,assignData,ts,index,showModal,tableshowModal,showApproveDetail,extParam} = this.state;
		const { createBillHeadInfo } = BillHeadInfo;
		let scene = this.props.getUrlParam("scene");

		// let showBackBtn = true;
		// if(scene == 'fip'&&!islist)
		// {
		// 		showBackBtn = false;
		// }
		return (
			<div className="nc-bill-list">
				{createListWebSocket(this.props, { 
                    tableAreaCode: tableId,
                    tablePkName: pkname,
                    billtype: billtype,
					// dataSource:FixedWithDrawConst.dataSource
                    // serverLocation: '10.16.2.231:9991'
                })}
				{/** 渲染标题栏 **/}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{/* 标题区 */}
						{createBillHeadInfo(
							{
								title: loadMultiLang(this.props, '36340FDW-000004'),//标题
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
					{(scene != 'linksce' && scene != 'fip') ?NCCreateSearch(searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						showAdvBtn: true,     //  显示高级按钮
					}):null}
				</div>
				{/** 非联查时渲染分组页签 **/}
				{(scene != 'linksce' && scene != 'fip') ?<NCTabs activeKey={selectedGroup} onChange={(v) => {
					this.navChangeFun.call(this, v);
				}}>
					<NCTabPane key={LISTGROUP.NEEDCOMMIT} tab={
						<span>
							{loadMultiLang(this.props, '36340FDW-000005') + '('}<span>{numvalues && numvalues['WC'] || 0}</span>{')'}
						</span>}
					/>
					<NCTabPane key={LISTGROUP.APPROVING} tab={
						<span>
							{loadMultiLang(this.props, '36340FDW-000006') + '('}<span>{numvalues && numvalues['WA'] || 0}</span>{')'}
						</span>}
					/>
					<NCTabPane key={LISTGROUP.ALL} tab={
						<span>
							{loadMultiLang(this.props, '36340FDW-000008')}
						</span>
					} />
				</NCTabs>
				:null}
				{/* 列表区 */}
				<div className="nc-bill-table-area">
					{createSimpleTable(tableId, {
						pkname: FixedWithDrawConst.pk_filed,
						dataSource: FixedWithDrawConst.dataSource,
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
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							listSingleOperatorNoRecord(this.props, 
								pageCodeList, 
								tableId, 
								base_url + 'FDWDWCommitAction.do',
								billID,  
								ts, 
								index,
								loadMultiLang(this.props, '36340FDW-000011')/* 国际化处理： 提交成功*/, 
								FixedWithDrawConst.dataSource, 
								true, 
								extParam,
								(props, data) =>{
									buttonVisible.call(this, this.props);
								});
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
						}}
					/>}
				</div>
				{/* * 退回弹框 * */}
				{(showModal||tableshowModal) && <Modal
					title={loadMultiLang(this.props, '36340FDW-000009')}
					label={loadMultiLang(this.props, '36340FDW-000009')}
					show={showModal?showModal:tableshowModal}
					onOk={(value) => {
						//处理退回
						if (showModal||tableshowModal) { 
							this.beSureClick.call(this, this.props, value, true);
						}
					}}
					onClose={() => {
						this.setState({ showModal: false,tableshowModal :false})
					}}
				/>
				}
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