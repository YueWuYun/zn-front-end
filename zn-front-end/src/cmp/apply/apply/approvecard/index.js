/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
/**  
 * 付款申请卡片页面   
 * @author zhanghe 
 * @version 1.0
 */ 
import React, { Component } from 'react';  
import ReactDOM from 'react-dom';
import { createPageIcon,createPage, ajax, base, toast, high, cardCache ,cacheTools, getMultiLang} from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix, NCBackBtn ,NCButton ,NCDiv} = base;
import { Radio } from 'tinper-bee';
import { buttonClick, initTemplate, afterEvent, pageInfoClick, buttonVisible, bodyBtnVisible } from './events';
import axios from 'axios';
//引入常量定义
import { APP_INFO, CARD_PAGE_INFO, LIST_PAGE_INFO, URL_INFO, UI_CONF, SHOW_MODE, ITEM_INFO, CACHE_KEY, PROP_EXT_OBJ } from '../cons/constant';
import { module_id, module_name } from "../../../pub/cons/constant";
//引入内转api
import { cardOperator } from "../../../pub/utils/CMPButtonUtil";
import { loadData2Card, qryDataByPKApprove, loadNeedDealDataByPK, loadCopyData, repaintView, save } from "../util/index";
//引入附件组件，审批详情,联查预算
const { NCUploader, ApproveDetail, Inspection ,Refer ,BillTrack,ApprovalTrans} = high;
import InvoiceUploader from 'sscivm/ivmpub/components/invoice-uploader';
import InvoiceLink from 'sscivm/ivmpub/components/invoice-link';
import { setPropCache, getPropCache, saveMultiLangRes, loadMultiLang } from "../../../../tmpub/pub/util/index";
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;

class Card extends Component {
	constructor(props) {
		super(props);	
		this.state = {
			isRowCopy: false,
			//附件框是否显示
			showUploader: false,
			//单据主键
			billID: '',
			//单据编码
			billNO: '',	
			//交易类型编码
			tradeType: '',			
			//是否显示审批详情
			showApproveDetail: false,				
			//是否显示预算计划
			showNtbDetail: false,
			//预算计划数据
			ntbdata: null,
			//联查发票
			billCodeModalShow:false,
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
				qryDataByPKApprove(this.props, pk, this.updateState.bind(this));
			}else {
				loadData2Card(this.props, () => {
					//界面重绘
					repaintView(this.props);
					this.setState({
						billID: null, billNO: null
					})
				});	
				this.props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 'pk_supplier': false });			
			}
		}
		if(id21){
			if(status ==SHOW_MODE.ADD){
				let pk = id21;
				//查询页面数据
				qryDataByPK(this.props, pk, this.updateState.bind(this));
				this.props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 'pk_supplier': true });
			}
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
				dataSource: APP_INFO.DATA_SOURCE, 
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
		let multiLang = this.props.MutiInit.getIntl(APP_INFO.MODULE_ID);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButton, createButtonApp ,createErrorFlag} = button;
		let { createCardPagination } = cardPagination;
		let { createModal } = modal;	
		let status = this.props.getUrlParam('status');
		let { showUploader, billID, billNO, tradeType,showInnerAccInfo, pk_inneracc, showApproveDetail, showNtbDetail, ntbdata, showBankAccBalance, bankAccBalanceParam ,tpflag ,showbilltrack,showbilltracktype,showbilltrackpk, assignData, assignShow } = this.state;
		const that = this;
		const { createTransferList } = transferTable;
		return ( 
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
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
					<NCDiv areaCode={NCDiv.config.HEADER}  className="nc-bill-header-area"> 
						<div className="header-title-search-area">
							{								
								createBillHeadInfo({
									title: loadMultiLang(this.props, '36070APM--000023'),
									initShowBackBtn:false
								})
							}							
						</div>						
						<div className="header-button-area">							
							<div>
								{createErrorFlag({
                                    headBtnAreaCode: cons.card.btnHeadCode
                                })}
								{
									createButtonApp({ onButtonClick: buttonClick.bind(that), buttonLimit: UI_CONF.BUTTON_LIMIT, area: 'card_head' })
								}
							</div>
						</div>
						<div>
							<div className='header-cardPagination-area'>
								{
									that.renderCardChange()
								}
							</div>
						</div>
					</NCDiv>
					</NCAffix>
					<NCScrollElement name='forminfo'>
						<div className="nc-bill-form-area">
							{createForm(CARD_PAGE_INFO.HEAD_CODE, {
								// expandArr: [CARD_PAGE_INFO.HEAD_CODE, 'form_innertransfer_05', 'form_innertransfer_06'],
								onAfterEvent: afterEvent.bind(this)
							})} 
						</div>
					</NCScrollElement>
				</div>
				<NCScrollElement name='businfo'>
					<div className="nc-bill-table-area">						
						{createCardTable(CARD_PAGE_INFO.BODY_CODE, {
							tableHead: this.getTableHeadButton.bind(this, buttons),
							modelSave: save.bind(this, this.props),
							onAfterEvent: afterEvent.bind(this),
							selectedChange: bodyBtnVisible.bind(this, this.props),
							showCheck: true,
							showIndex: true,
							adaptionHeight:true,
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
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							cardOperator(this.props, CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, [], ITEM_INFO.PK, URL_INFO.COMMON.COMMIT, loadMultiLang(this.props, '36070APM--000009'), APP_INFO.DATA_SOURCE, repaintView.bind(this, this.props), false, extParam);
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
						}}
					/>}
				</div>
			</div>		
			
		);
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