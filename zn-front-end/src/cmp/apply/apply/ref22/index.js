/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
/**
 * 付款申请转单卡片页面 
 * @author zhanghe 
 * @version 1.0
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, cardCache ,cacheTools,getMultiLang } from 'nc-lightapp-front'; 
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix, NCBackBtn ,NCButton,NCDiv } = base;
import { Radio } from 'tinper-bee';
import { buttonClick, initTemplate, afterEvent,beforeEvent, bodyBeforeEvent,pageInfoClick, buttonVisible } from './events';
import axios from 'axios';
//引入常量定义
import { APP_INFO, CARD_PAGE_INFO, LIST_PAGE_INFO, URL_INFO, UI_CONF, SHOW_MODE, ITEM_INFO ,TRAN_CARD_PAGE_INFO, TRAN_LIST_PAGE_INFO,PROP_EXT_OBJ} from '../cons/constant';
import { REF21_CONST } from '../ref21/const';
import { module_id, module_name } from "../../../pub/cons/constant";
//引入内转api
import { versionControl, loadData2Card, qryDataByPK, loadNeedDealDataByPK, loadCopyData, repaintView,getNewRow } from "../util/index";
import { setPropCache, getPropCache, saveMultiLangRes, loadMultiLang,saveCommit } from "../../../../tmpub/pub/util/index";
//引入附件组件，审批详情,联查预算
const { NCUploader, ApproveDetail, Inspection ,Refer ,BillTrack,ApprovalTrans} = high;
import InvoiceUploader from 'sscivm/ivmpub/components/invoice-uploader';
import InvoiceLink from 'sscivm/ivmpub/components/invoice-link';
// import JointBill from '../../../../sscrp/refer/jointbill/JointBillTableRef/JointBillModal';
import {savecommit,save} from "../ref22/events/buttonClick";
let {getCacheById} = cardCache;
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;




class Card extends Component {
	constructor(props) {
		super(props);		
		this.state = {
			//附件框是否显示
			showUploader: false,
			//单据主键
			billID: '',
			//单据编码
			billNO: '',
			//是否行复制模式
			isRowCopy: false,	
			//交易类型编码
			tradeType: '',	
			//是否显示审批详情
			showApproveDetail: false,				
			//是否显示预算计划
			showNtbDetail: false,
			//预算计划数据
			ntbdata: null,
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			//旧数据
			showbilltrack: false,//联查单据
			showbilltrackpk:'',//联查单据pk
			showbilltracktype:'',//联查单据类型
			vbillno:'',//单据编号,
			tpflag:true,
			data: [],
			sscivmMessage:'',
			tradetype: {}
		}
		//将页面对象绑定到页面缓存中，避免后续操作无法获取this
		setPropCache(this.props, APP_INFO.FUNCODE, PROP_EXT_OBJ.CONTAIN, this);
	}

	componentWillMount() { 
		getMultiLang({
			//模块编码
			moduleId: [APP_INFO.FUNCODE],
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
		window.onbeforeunload = () => {
			let status = this.props.getUrlParam('status')
			if (status != SHOW_MODE.BROWSER) {
				return loadMultiLang(this.props, '36070APM--000112')/* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		}
	}

	
	componentDidMount() {		 
		let id = this.props.getUrlParam(URL_INFO.PARAM.ID);
		let id21 = cacheTools.get('21TO36D1Pks');//采购付款计划推付款申请传给的pk
		let status = this.props.getUrlParam('status');
		
		if (id) {
			let status = this.props.getUrlParam('status');
			let pk = this.props.getUrlParam('id');
			let ts = this.props.getUrlParam('ts');
			if (status == SHOW_MODE.COPY) {
				//加载复制数据
				loadCopyData(this.props, pk, this.updateState.bind(this));
			}else if(status == SHOW_MODE.BROWSER || status == SHOW_MODE.EDIT){			
				//查询页面数据
				qryDataByPK(this.props, pk, this.updateState.bind(this));
			}else {
				loadData2Card(this.props, () => {
					//界面重绘
					repaintView(this.props);
					this.setState({
						billID: null, billNO: null
					})
				});
			}
		}
		let transfer = this.props.getUrlParam('srcbilltype') === 'ref22';
		if (transfer) {
			let transferIds = this.props.transferTable.getTransferTableSelectedId(CARD_PAGE_INFO.HEAD_CODE);
			this.getTransferValue(transferIds);
		} 
	}
	/**
	 * 更新状态机
	 * @param {*} obj 
	 */
	updateState(obj) {
		if (obj && Object.keys(obj).length > 0) {
			this.setState(obj);
		}
	}
	
	getTransferValue = (transferIds) => {
		if(transferIds){
			//从缓存中获取查询区域条件
			let queryVO = cardCache.getDefData(REF21_CONST.searchId, REF21_CONST.Ref21DataSource);
			let pkMapTs={};
			let index = 0;
			let pk = null;
			let ts =null;
			while (index < transferIds.length) {
				//获取行主键值
				pk = transferIds[index] && transferIds[index].head && transferIds[index].head.pk;
				//获取行ts时间戳
				ts = transferIds[index] && transferIds[index].head && transferIds[index].head.ts;				
				//判空
				if (pk && ts) {
					pkMapTs[pk] = ts;
				}
				index++;
			}
			ajax({
				url: URL_INFO.TRANLIST.CARDQRY,
				data: {pkMapTs,queryVO},
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							this.props.transferTable.setTransferListValue(TRAN_CARD_PAGE_INFO.HEAD_CODE, data);	
						}					
					}else{
						this.props.transferTable.setTransferListValue(TRAN_CARD_PAGE_INFO.HEAD_CODE, []);	
					}
				} 
			});
		}else{
			this.props.transferTable.setTransferListValue(TRAN_CARD_PAGE_INFO.HEAD_CODE, []);	
		}
		
	};
	
	//获取列表肩部信息
	getTableHeadButton = (buttons) => {
		let { createButton, createButtonApp } = this.props.button;
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(CARD_PAGE_INFO.BODY_CODE, {
						iconArr: ['close', 'open', 'max'],
					})}
					{
						createButtonApp({ onButtonClick: buttonClick.bind(this), buttonLimit: UI_CONF.BUTTON_LIMIT, area: 'card_body' })
					}
				</div>
			</div>
		);
	};
	/**
	 * 渲染切换上下页组件
	 */
	renderCardChange = () => {
		let { createCardPagination } = this.props.cardPagination;
		let status = this.props.getUrlParam('status');
		if (status == 'browse') {
			return (createCardPagination({
				dataSource: APP_INFO.DATA_SOURCE_TRANS, 
				handlePageInfoChange: pageInfoClick.bind(this)
			}));
		}
	}

	/**
	 * 关闭审批详情
	 */
	link2ListPage = () => {
		this.props.pushTo(URL_INFO.LIST_PAGE_URL, {
			status: 'browse',
			pagecode: LIST_PAGE_INFO.PAGE_CODE
		});
	}
	render() {		
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let { cardTable, form, button, modal, cardPagination ,transferTable} = this.props;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButton, createButtonApp ,createErrorFlag} = button;
		let { createModal } = modal;	
		let status = this.props.getUrlParam('status');
		let { showUploader, billID, billNO, showInnerAccInfo,tradeType, pk_inneracc, showApproveDetail, showNtbDetail, ntbdata, showBankAccBalance, bankAccBalanceParam ,tpflag ,showbilltrack,showbilltracktype,showbilltrackpk, assignData, assignShow,assignType} = this.state;
		const that = this;
		const { createTransferList } = transferTable;
		let ishowback = this.props.getUrlParam("status") === "browse"; 
		return (
			<div id="transferCard" className="nc-bill-transferList">
				{/**创建websocket */}
				{api.comm.createCardWebSocket(this.props, {
					headBtnAreaCode: cons.card.btnHeadCode,
					formAreaCode: cons.card.headCode,
					billpkname: cons.field.pk,
					billtype: cons.comm.billType
					// serverLocation: '10.16.2.231:9991'
                })}
				{/** 渲染标题栏 **/}
				<NCAffix>
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area"> 
					<div className="header-title-search-area">
						{createBillHeadInfo({
							title: loadMultiLang(this.props,'36070APM--000023'),
							backBtnClick: () => {
								this.props.pushTo(URL_INFO.LIST_PAGE_URL, {
									status: 'browse',
									pagecode: LIST_PAGE_INFO.PAGE_CODE
								});
							}
						})}						
					</div>	
					<div className="header-button-area">
						{createErrorFlag({
                            headBtnAreaCode: cons.card.btnHeadCode
                        })}
						{
							createButtonApp({ onButtonClick: buttonClick.bind(that), buttonLimit: UI_CONF.BUTTON_LIMIT, area: 'card_head' })
						}
					</div>
				</NCDiv>
				</NCAffix>
				<div className="nc-bill-transferList-content">
					{createTransferList({
						//表格组件id
						headcode: CARD_PAGE_INFO.HEAD_CODE,
						transferListId: TRAN_CARD_PAGE_INFO.HEAD_CODE, //转单列表id
						onTransferItemSelected: (record, status,index) => {
							//转单缩略图被选中时的钩子函数
							let isEdit = status ? SHOW_MODE.BROWSER : SHOW_MODE.ADD;							
							if(isEdit == SHOW_MODE.BROWSER){
								this.props.setUrlParam({status:SHOW_MODE.BROWSER})
								let id = record.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_apply.value;
								record = id == null ? record : getCacheById(id, APP_INFO.DATA_SOURCE_TRANS)?getCacheById(id, APP_INFO.DATA_SOURCE_TRANS): record;
								if(id){
									this.props.setUrlParam({ id: id ,status:SHOW_MODE.BROWSER});	
									this.props.form.setFormStatus([CARD_PAGE_INFO.HEAD_CODE], isEdit);
									this.props.cardTable.setStatus(CARD_PAGE_INFO.BODY_CODE, isEdit);
									this.props.form.setAllFormValue({[CARD_PAGE_INFO.HEAD_CODE]: record.head[CARD_PAGE_INFO.HEAD_CODE]});
									this.props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, record.body[CARD_PAGE_INFO.BODY_CODE]);																							
								}
							}else {
								this.props.delUrlParam('id');
								this.props.setUrlParam({status:SHOW_MODE.ADD})
								this.props.form.setFormStatus([CARD_PAGE_INFO.HEAD_CODE], isEdit);
								this.props.cardTable.setStatus(CARD_PAGE_INFO.BODY_CODE, isEdit);
								this.props.form.setAllFormValue({[CARD_PAGE_INFO.HEAD_CODE]: record.head[CARD_PAGE_INFO.HEAD_CODE]});
								this.props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, record.body[CARD_PAGE_INFO.BODY_CODE]);							
							
							}
							repaintView(this.props);
						}
						// ,
						// onTransferItemClick: (record, index, status) => {
						// 	//点击转单缩略图的钩子函数
						// 	let isEdit = status ? SHOW_MODE.BROWSER : SHOW_MODE.ADD;
						// 	// this.props.form.setFormStatus(CARD_PAGE_INFO.HEAD_CODE, isEdit);
						// 	// this.props.cardTable.setStatus(CARD_PAGE_INFO.BODY_CODE, isEdit);
						// 	if(isEdit == SHOW_MODE.BROWSER){
						// 		this.props.setUrlParam({status:SHOW_MODE.BROWSER})
						// 		let id = record.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_apply.value;
						// 		this.props.setUrlParam({ id: id });	
						// 	}else {
						// 		this.props.delUrlParam('id');
						// 		this.props.setUrlParam({status:SHOW_MODE.ADD})
						// 		this.props.setUrlParam({status:SHOW_MODE.ADD})
						// 	}	
						// 	this.props.form.setFormStatus([CARD_PAGE_INFO.HEAD_CODE], isEdit);
						// 	this.props.cardTable.setStatus(CARD_PAGE_INFO.BODY_CODE, isEdit);							
						// 	this.props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: record.head[CARD_PAGE_INFO.HEAD_CODE] });
						// 	this.props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, record.body[CARD_PAGE_INFO.BODY_CODE]);							
						// 	repaintView(this.props);						
						// }
					})}
					<div className="transferList-content-right nc-bill-card" id="paybill-card">
						<NCScrollElement name='forminfo'>
						<div className="nc-bill-form-area">
							{createForm(CARD_PAGE_INFO.HEAD_CODE, {
								// expandArr: [CARD_PAGE_INFO.HEAD_CODE, 'form_innertransfer_05', 'form_innertransfer_06'],
								onAfterEvent: afterEvent.bind(this),
								onBeforeEvent: beforeEvent.bind(this)
							})}
						</div>
						</NCScrollElement>
						<NCScrollElement name='businfo'>
							<div className="nc-bill-table-area">
								{/* {this.getTableHeadButton(buttons)} */}
								{createCardTable(CARD_PAGE_INFO.BODY_CODE, {
									tableHead: this.getTableHeadButton.bind(this, buttons),
									modelSave: ()=>{
										save.call(this, this.props);
										//关闭侧拉弹框
										this.props.cardTable.closeModel(CARD_PAGE_INFO.BODY_CODE);
									},
									onAfterEvent: afterEvent.bind(this),
									onBeforeEvent: bodyBeforeEvent.bind(this),
									showCheck: true,
									showIndex: true,
									hideAdd: ishowback,
									hideDel: ishowback,
									hideModelSave: ishowback,
									adaptionHeight:true,
									modelAddRow: (props, moduleId, index) => {
										let newrow = getNewRow(props);
										index = Number(index) + Number(1);
										props.cardTable.setValByKeysAndIndex(moduleId, index, newrow);
									}
								})}
							</div>
						</NCScrollElement>
						
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
										showApproveDetail: false
									})
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
						<div>
						<InvoiceLink 
               {...this.state.sscrpLinkInvoiceData}
                table={this.props.table}
                />
				</div> 
						{/** 联查单据 **/}
						<div>
							<BillTrack
								show={this.state.showbilltrack}
								close={()=>{
									this.setState({showbilltrack: false})
								}}
								pk={this.state.showbilltrackpk}  //单据id
								type={this.state.showbilltracktype}  //单据类型
							/>
						</div>

						<div>
							<InvoiceLink 
						{...this.state.sscrpLinkInvoiceData}
							table={this.props.table}
							/>
							</div> 
							<div>
			                <InvoiceUploader
							{...this.state.sscrpInvoiceData}
							/>
			               <InvoiceLink 
							{...this.state.sscrpInvoiceData}
							table={this.props.table}
							/>
						</div> 
					
						{/** 审批流指派 **/}
						<div>
							{assignShow && <ApprovalTrans							
								title={loadMultiLang(this.props, '36070APM--000128')/*'指派'*/}
								data={assignData}
								display={assignShow}
								getResult={(value) => {							
									//关闭指派框
									this.setState({ assignShow: false, assignData: null, assignType: URL_INFO.ASSIGNTYPE.COMMIT });
									//判断指派类型 如果是保存提交类型 则继续保存提交
									if (assignType == URL_INFO.ASSIGNTYPE.SAVECOMMIT) {
										savecommit.call(this, this.props, value);
									}else{
										let extParam = {};
										if (value) {
											extParam['content'] = JSON.stringify(value);
										}
										cardOperator(this.props, CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, [], ITEM_INFO.PK, URL_INFO.COMMON.COMMIT, loadMultiLang(this.props, '36070APM--000009'), APP_INFO.DATA_SOURCE, repaintView.bind(this, this.props), false, extParam);
									}
								}}
								cancel={() => {
									this.setState({ assignShow: false, assignData: null })
								}}
							/>}
						</div>			
						
					</div>
				</div>
			</div>
		)
	}
}
Card = createPage({
	mutiLangCode: APP_INFO.MODULE_ID,
	billinfo: {
		billtype: 'card',
		pagecode: CARD_PAGE_INFO.PAGE_CODE,
		headcode: CARD_PAGE_INFO.HEAD_CODE,
		bodycode: CARD_PAGE_INFO.BODY_CODE
	},
	// initTemplate: initTemplate
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/