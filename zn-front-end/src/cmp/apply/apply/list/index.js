/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react'; 
import ReactDOM from 'react-dom';
import { createPageIcon,createPage, ajax, base, toast, high, cardCache ,getMultiLang,viewModel} from 'nc-lightapp-front';
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
let { NCTabsControl, NCAffix, NCButton,NCDiv} = base;
const { NCTabPane } = NCTabs;
import { buttonClick, initTemplate, searchBtnClick, listInitData, pageInfoClick, tableModelConfirm , buttonVisible} from './events';
//引入常量定义
import { APP_INFO, LIST_PAGE_INFO, URL_INFO, TEMPLATE_INFO, ITEM_INFO, CACHE_KEY,CARD_PAGE_INFO ,SHOW_MODE, PROP_EXT_OBJ } from '../cons/constant';
import { getCahceValue, autoLoadData, go2card } from "../util/index";
import { module_id, module_name } from "../../../pub/cons/constant";
import { listSingleOperatorNoRecord } from "../../../pub/utils/CMPButtonUtil";
import { setPropCache, saveMultiLangRes, loadMultiLang,go2CardCheck } from "../../../../tmpub/pub/util/index";
//引入附件组件,联查工作流，联查预算
const { NCUploader, ApproveDetail, Inspection,BillTrack,Refer ,ApprovalTrans } = high;
import InvoiceUploader from 'sscivm/ivmpub/components/invoice-uploader';
import InvoiceLink from 'sscivm/ivmpub/components/invoice-link';
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;
/**
 * 付款申请列表界面
 * @author zhanghe 
 * @version 1.0
 */
class List extends Component {
	constructor(props) {
		super(props);		
		this.state = {
			// 选中页签的信息
			tabInfo: 0,
			//默认显示全部分组
			defaultSelectGrup: 0,
			//当前选中的分组
			selectedGroup: '0',
			//分组单据总数
			groupCount: {				
				// 待提交         
				NEEDCOMMIT: 0,
				//待生成        
				NEEDGENERATE:0
			},
			//是否显示附件框
			showUploader: false,
			//单据主键
			billID: '',
			//单据编码
			billNO: '',
			//交易类型编码
			tradeType: '',
			//联查发票
			billCodeModalShow:false,
			//是否显示预算计划
			showNtbDetail: false,
			//预算计划数据
			ntbdata: null,	
			//提交即指派
			compositedata: null,
			compositedisplay: null,
			showApproveDetail:false,		
			showbilltrack: false,//联查单据
			showbilltrackpk: '',//联查单据pk
			showbilltracktype: '',//联查单据类型
			numvalues: {},
			activeKey: 2,
			tpflag: true,
			tradetype: {},
			//时间戳
			ts: '',
			//行索引
			rowIndex: -1,
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			sscrpLinkInvoiceData:{}
		};
		//将页面对象绑定到页面缓存中，避免后续操作无法获取this
		setPropCache(this.props, APP_INFO.FUNCODE, PROP_EXT_OBJ.CONTAIN, this);
	}
	
	componentWillMount() {
		getMultiLang({
			//模块编码
			moduleId: [ APP_INFO.FUNCODE],
			//领域编码
			domainName: module_name,
			//回调
			callback: (lang) => {
				//将多语资源数据存储到页面级缓存中
				saveMultiLangRes(this.props, lang);
				//初始化模板
				initTemplate(this.props);
			}
		});
	}
	
	/**
	 * 更新state
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
	//页签筛选
	navChangeFun = (groupKey, className, e) => {  
		//查询
		searchBtnClick.call(this, this.props, null, groupKey);
	};		
	render() {		
		let { defaultSelectGrup, groupCount } = this.state;
		let { table, button, search, modal,BillHeadInfo } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(APP_INFO.MODULE_ID);
		let { createSimpleTable, getTablePageInfo } = table;
		let { NCCreateSearch } = search;
		let { createButton, getButtons, createButtonApp } = button;
		let { showUploader, billNO, billID,tradeType, showApproveDetail, showNtbDetail, ntbdata ,showbilltrack,showbilltracktype,showbilltrackpk,selectedGroup, ts,rowIndex,assignData, assignShow } = this.state;		
		const that = this;
		let { createModal } = modal;
		let numvalues = this.state.numvalues;	
		const { createBillHeadInfo } = BillHeadInfo;
		//获取缓存中的是否联查标志
		let islink = cardCache.getDefData(CACHE_KEY.ISLINK, APP_INFO.DATA_SOURCE);	
		let transtype_name = getGlobalStorage('sessionStorage', 'transtype_name');
		return (
			<div className="nc-bill-list">	
				{/**创建websocket连接 */}
                {api.comm.createListWebSocket(this.props, {
                    tableAreaCode: cons.list.tableCode,
                    tablePkName: cons.field.pk,
                    billtype: cons.comm.billType
                    // serverLocation: '10.16.2.231:9991'
                })}
				{/** 渲染标题栏 **/}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area"> 
					<div className="header-title-search-area">
						{createBillHeadInfo(
							{
								title: transtype_name?transtype_name:loadMultiLang(this.props, '36070APM--000023'),//{/* 国际化处理： 付款申请*/}
								initShowBackBtn: false
							}
						)}
					</div>											
					<div className="header-button-area">
						{!transtype_name&&
							<div className="button-app-wrapper">
							{(
								<Refer
									placeholder={loadMultiLang(this.props, '36070APM--000018')}/* 国际化处理： 单据模板类型*/
									refName={loadMultiLang(this.props, '36070APM--000019')}/* 国际化处理： 付款交易类型*/
									refCode={'tradetype001'}
									refType={'grid'}
									queryGridUrl={'/nccloud/riart/ref/fiBillTypeTableRefAction.do'}
									columnConfig={[
										{
											name: [loadMultiLang(this.props, '36070APM--000134'), loadMultiLang(this.props, '36070APM--000135')],/* 国际化处理： 编码,名称*/
											code: ['refcode', 'refname']
										}
									]}
									queryCondition={{
										parentbilltype: '36D1' //过滤条件
									}}
									value={this.state.tradetype}
									onChange={(value) => {
										this.setState(
											{
												tradetype: value
											},
											function () {											
												setGlobalStorage('sessionStorage', 'sessionTP', JSON.stringify(this.state.tradetype), ()=>{
													//存储缓存失败的处理函数
													//联查需要处理缓存存储失败的情况，失败时，把缓存信息转后台存放
												});
											}
										);
									}}
									isMultiSelectedEnabled={false}
									clickContainer={<NCButton> {loadMultiLang(this.props, '36070APM--000038')}</NCButton>}/* 国际化处理： 交易类型*/
								/>

							)}
							</div>
						}
						<div>
						{
							createButtonApp({ onButtonClick: buttonClick.bind(that), area: "list_head", })
						}
						</div>
					</div>	
				</NCDiv>
				{/** 非联查时渲染查询区域 **/}
				{!islink && <div className="nc-bill-search-area">
								{NCCreateSearch(LIST_PAGE_INFO.SEARCH_CODE, {
									clickSearchBtn: searchBtnClick.bind(this),
									defaultConditionsNum: 2 //默认显示几个查询条件
								})}
							</div>}				
				{/** 非联查时渲染分组页签 **/}
				{!islink &&
					<div>
						<NCTabs activeKey={selectedGroup} onChange={(v) => {this.navChangeFun.call(this, v);}}>
							<NCTabPane key={LIST_PAGE_INFO.GROUP.NEEDCOMMIT} tab={
								<span>
									{//待提交
									loadMultiLang(this.props, '36070APM--000034') + '(' }<span>{(groupCount.NEEDCOMMIT || 0)}</span>{')' }
								</span>
							} />
							<NCTabPane key={LIST_PAGE_INFO.GROUP.NEEDGENERATE} tab={
								<span>{
									//待生成
									loadMultiLang(this.props, '36070APM--000035') + '('} <span>{(groupCount.NEEDGENERATE || 0)}</span>{')'
								}</span>
							} />						
							<NCTabPane key={LIST_PAGE_INFO.GROUP.ALL} tab={
								<span>{
									//全部
									loadMultiLang(this.props, '36070APM--000036')
								}</span>
							} />
						</NCTabs> 	 
					</div>
				}				
				<div className="nc-bill-table-area">
					{createSimpleTable(LIST_PAGE_INFO.TABLE_CODE, {
						dataSource: APP_INFO.DATA_SOURCE,
						pkname: ITEM_INFO.PK,
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: true,
						onSelected: buttonVisible.bind(this, this.props),
						onSelectedAll: buttonVisible.bind(this, this.props),
						//双击进入卡片
						onRowDoubleClick: (record, index, props, e) => { 
							go2CardCheck({
								props,url:URL_INFO.LIST.LIST2CARD_CHECK,pk:record[ITEM_INFO.PK].value,ts:record[ITEM_INFO.TS].value,fieldPK:ITEM_INFO.PK,actionCode:null,permissionCode:null,checkSaga:false,checkTS:false,go2CardFunc:()=>{
									go2card(this.props, { pagecode: CARD_PAGE_INFO.PAGE_CODE, status: SHOW_MODE.BROWSER, id: record[ITEM_INFO.PK].value }, this.getState.bind(this)) 
								}
							});	
							
						},
						componentInitFinished: () => {
							//缓存数据赋值成功的钩子函数
							//若初始化数据后需要对数据做修改，可以在这里处理
							buttonVisible.call(this, this.props);							
						}
					})}
				</div>
				{/** 附件 **/}
				<div className="nc-faith-demo-div2">
					{showUploader &&
						<NCUploader
							onHide={() => {
								this.setState({
									showUploader: false
								})
							}}
							billId={billID}
							target={null}
							placement={'bottom'}
							billNo={billNO}
						/>
					}
				</div>
				{/** 联查工作流 **/}
				<div>
					{showApproveDetail && <ApproveDetail 
						show={showApproveDetail}
						billtype={tradeType}
						billid={billID}
						close={() => {
							this.setState({
								showApproveDetail: false,
								billID: ''
							})
						}}
					/>}
				</div>
				{/** 联查单据 **/}		
				<div>
					<BillTrack
						show={this.state.showbilltrack}
						close={() => {
							this.setState({ showbilltrack: false })
						}}
						pk={this.state.showbilltrackpk}  //单据id
						type={this.state.showbilltracktype}  //单据类型
					/>
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

				<div>
				<InvoiceLink 
               {...this.state.sscrpLinkInvoiceData}
                table={this.props.table}
                />
				</div>
               	<div>
					{assignShow && <ApprovalTrans
						title={loadMultiLang(this.props, '36070APM--000128')/*'指派'*/} 
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							listSingleOperatorNoRecord(this.props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, URL_INFO.COMMON.COMMIT, billID, ts, rowIndex, loadMultiLang(this.props, '36070APM--000129'), APP_INFO.DATA_SOURCE, true, extParam);/* 国际化处理： 提交成功！*/
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
						}}
					/>}
				</div>


			</div>
		);
	}	

	//刷新
	refresh = () => {
		let { selectedGroup } = this.state;
		this.navChangeFun(selectedGroup);
	}
}

List = createPage({
	// initTemplate: initTemplate,
	billinfo: {
		billtype: 'card',
		pagecode: LIST_PAGE_INFO.PAGE_CODE
	},
	mutiLangCode: APP_INFO.MODULE_ID
})(List);

export default List;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/