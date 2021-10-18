/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, cacheTools, getMultiLang, toast, cardCache,high } from 'nc-lightapp-front';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, afterEvent} from './events';
import { deleteCacheData, getNextId, deleteCacheDataForList, addCacheData, updateCacheData, getDefData, setDefData } from '../../../../tmpub/pub/util/cache';
import * as CONSTANTS from '../cons/constant.js';
import { buttonVisible } from './events/buttonVisible';
import { cardOperator } from '../../../pub/utils/IFACButtonUtil';
import Modal from "../../../../tmpub/pub/util/modal/index";
import { saveMultiLangRes, loadMultiLang,createSimpleBillData,createCardWebSocket} from "../../../../tmpub/pub/util/index";
let { pageCodeCard,pageCodeList, tableId, searchId, moudleId,pkname,FixedWithDrawConst,formId,dataSource ,app_code,base_url,btnHeadCode,billtype } = CONSTANTS;
const { NCDiv, NCAffix } = base;
const { NCUploader, ApproveDetail, BillTrack, ApprovalTrans } = high;
class Card extends Component {
	constructor(props) {
		super(props);
		this.isSaveAdd = false; //是否保存新增
		this.state = {
			showModal: false,
			//时间戳
			ts: null,
			index: null,
			showUploader: false,//控制附件弹出框
			showInnerAccount: false,//控制内部账户联查弹框
			actionCode: '', //按钮编码
			showApproveDetail: false, //显示审批详情
			showModal: false, //退回意见框
			showBillReview: false, //单据追溯	
			//单据主键
			billID: '',
			//翻页控制
			paginaShow: true,
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			//单据编码
			billNO: '',
			pageinfo:true,
		};
		initTemplate.call(this, this.props);
		// initTemplate.call(this, props);
	}
	componentWillMount() { 
		// 关闭浏览器
		// window.onbeforeunload = () => {
		// 	if (this.props.getUrlParam('status') !== 'browse') {
		// 		return '当前单据未保存，您确认离开此页面？';
		// 	}
		// };
	}

	componentDidMount() {
		//查询单据详情
		//设置卡片头部状态
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
		}); 
		let id = this.props.getUrlParam('id');
		this.billID = id;
		if (id) {
			this.qryData(false);
		}
	}
	//卡片返回按钮
	handleClick = () => {
		window.onbeforeunload = null;
		let scene = this.props.getUrlParam("scene");
		this.props.pushTo('/list', {
			pagecode: pageCodeList,
			status: 'add',
			scene: scene
		});
	};
	/**
	 * 查询页面数据
	 * @param isRefresh 是否直接查询
	 */
	qryData = (isRefresh = false) => {
		let status = this.props.getUrlParam('status');
		let isCopy = this.props.getUrlParam('isCopy')=='copy';
		let billstate=this.props.getUrlParam('billstate');
		let url = base_url;
		if (isRefresh||status == 'browse') {
			url = url + 'querycardaction.do';
		}else if (status == 'edit') {
			url = url + 'FDWDWEditAction.do';
		} else if (isCopy) {
			url = url + 'FDWDWCopyAction.do';
		}else if(status=='add'){
			return;
		}
		let data = { pk: this.props.getUrlParam('id'), pageCode: pageCodeCard };
		const that = this;

		ajax({
			url,
			data: data,
			success: (res) => {
				if (res.data) {
					if (res.data.head) {
						that.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
						this.billNO = res.data.head[formId].rows[0].values.vbillcode.value || '';
					} 
					if (isRefresh) {
						toast({ color: 'success', title: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000037') });
					}else if (status == 'edit' || isCopy) {
						if(isCopy){
							this.props.form.setFormStatus(formId,'add');
							this.props.form.setFormItemsDisabled(formId, { 'pk_org': true});
							//复制时单据状态无论是什么，都变为未记账
							// this.props.form.setFormItemsValue(formId, { 'billstate': { value: 0, display: "未记账" } })
							this.props.form.setFormItemsDisabled(formId, { 'pk_depositorg':false,'pk_depositreceipt':false,'pk_settleacc':false,'withdrawdate':false,'withdrawamount':false,'remark':false});
							if(billstate=="1"){
								this.desposittonull();
							}
							
						}else{
							this.props.form.setFormStatus(formId,'edit');
							
						}
					}
					if(!isCopy){
						this.toggleShow();
					}
				} else {
					toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300CUREX") && this.props.MutiInit.getIntl("36300CUREX").get('36300CUREX-000033') });
					this.billNO = '';
					this.billID = '';
					that.props.form.EmptyAllFormValue(that.formId);
					this.toggleShow();
				}
			}
		});

	};
	
desposittonull=()=>{
	this.props.form.setFormItemsValue(formId, { 'depostbalmnt': null });
	this.props.form.setFormItemsValue(formId, { 'pk_depositreceipt': null });
	this.props.form.setFormItemsValue(formId, { 'depositdate': null });
	this.props.form.setFormItemsValue(formId, { 'enddate': null });
	this.props.form.setFormItemsValue(formId, { 'redeposittype': null });
	this.props.form.setFormItemsValue(formId, { 'pk_depositbank': null });
	this.props.form.setFormItemsValue(formId, { 'pk_depositacc': null });
	this.props.form.setFormItemsValue(formId, { 'pk_depositacc.name': null });
	this.props.form.setFormItemsValue(formId, { 'pk_currtype': null });
	this.props.form.setFormItemsValue(formId, { 'pk_depostrate': null });
	this.props.form.setFormItemsValue(formId, { 'pk_aiacrate': null });
	this.props.form.setFormItemsValue(formId, { 'pk_settleacc': null });
	this.props.form.setFormItemsValue(formId, { 'pk_settleacc.name': null });
	this.props.form.setFormItemsValue(formId, { 'depositinterval': null });
	this.props.form.setFormItemsValue(formId, { 'intervalunit': null });
	this.props.form.setFormItemsValue(formId, { 'pk_varieties': null });
}
	/**
	 * 保存单据逻辑处理
	 * iscommit  是否保存提交
	 * isSaveAdd 是否保存新增
	 */
	saveBill = (iscommit = false,formdata, callback) => {
		let isSaveAdd = this.isSaveAdd;
		let status = this.props.getUrlParam('status');
		let url = base_url + 'FDWDWSaveaction.do';
		if (status == 'add' || status == 'edit') {
			url = base_url + 'FDWDWSaveaction.do';
		}
		//开启必输项校验
		let formRequire = this.props.form.isCheckNow(formId);
		if (!formRequire) {
			return;
		}
		ajax({
			url: url,
			data: formdata,
			success: (res) => {
				let pk_fixeddatewithdraw  = null;
				let vbillcode = null;
				let pk_org = null;
				if (res.success) {
					if (res.data) {
						// let { head, bodys } = res.data;
						if (res.data.head && res.data.head[formId]) {
							pk_org = res.data.head[formId].rows[0].values.pk_org;
							pk_fixeddatewithdraw = res.data.head[formId].rows[0].values.pk_fixeddatewithdraw.value;
							this.billNO = res.data.head[formId].rows[0].values.vbillcode.value || '';
							if (isSaveAdd) {
								//清空界面
								this.props.form.EmptyAllFormValue(formId);
								this.props.setUrlParam({
									status: 'add'
								});
							} else {
								this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
								
								
								this.props.setUrlParam({
									status: 'browse'
								});
							}
							if (status == 'add'||status == 'copy') {
								addCacheData(
									this.props,
									FixedWithDrawConst.pk_filed,
									pk_fixeddatewithdraw,
									res.data,
									formId,
									dataSource,
									res.data.head[formId].rows[0].values
								);
							} else if (status == 'edit') {
								updateCacheData(
									this.props,
									FixedWithDrawConst.pk_filed,
									pk_fixeddatewithdraw,
									res.data,
									formId,
									dataSource,
									res.data.head[formId].rows[0].values
								);
							}
						}
						this.props.setUrlParam({
							id: pk_fixeddatewithdraw
						});
					}
				}
				
				this.toggleShow();
				let hasCallBack = (callback && (typeof callback == 'function'));
				//如果有回调则执行回调
				if (hasCallBack) {
					callback();
				}
			}
		});
	};
	//切换页面状态
	toggleShow = () => {
		//开关开始
		let status = this.props.getUrlParam('status');
		let fip = this.props.getUrlParam('scene')==="linksce";
		//let billstate = this.props.form.getFormItemsValue(formId, 'billstate');
		if (status == 'browse') {
			//设置表单状态
			this.props.form.setFormStatus(formId,status);
			//翻页显示
			this.setState({ paginaShow: true });
			
			if(fip){
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传

					
				});
			}else{
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传

					
				});
			}
		}
		else if (status == 'edit') {
			this.props.form.setFormStatus(formId,status);
			//设置表单状态 
			this.setState({ paginaShow: false });
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				
			});

		} else if(status == 'add'){
			this.props.form.setFormStatus(formId,status);
			this.setState({ paginaShow: false });
			//billstate.value='0';
			this.props.initMetaByPkorg();
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传  //控制显示单据号：true为显示,false为隐藏 ---非必传
				showBillCode: false
			});
			
		}else{
			// this.props.form.setFormItemsVisible(this.formId, {"pk_clearoutaccount":false,"pk_clearoutbankaccount":true});
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
		}
		buttonVisible.call(this, this.props);
		//开关关闭
	};
	//模态框点击确定并从textarea取值
	beSureClick = (props, value, flag = false) => {
		if (flag) {
			// toast({ content: this.props.MutiInit.getIntl("36300CUREX") && this.props.MutiInit.getIntl("36300CUREX").get('36300CUREX-000053'), color: 'warning' });/* 国际化处理： 请填入退回理由！*/
			this.props.form.setFormItemsValue(formId, { returnreason: { value: value } });
		}
		this.backConfirm();
	}
	//退回单据
	backConfirm = () => {
		let pkMapTs = {};
		let pk = this.props.getUrlParam('id');
		let value = (this.props.form.getFormItemsValue(formId, 'returnreason') || {}).value;
		let ts = this.props.form.getFormItemsValue(formId, 'ts').value;
		let extParam = {};
		extParam["returnreason"] = value;
		pkMapTs[pk] = ts;
		ajax({
			url: base_url + 'FDWbackAction.do',
			data: {
				extParam,
				pkMapTs,
				pageCode: pageCodeList
			},
			success: (res) => {
				if (res) {
					toast({ color: 'success', content: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000010') + this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000036') });/* 国际化处理： 退回成功！*/
					let nextId = getNextId(this.props, pk, dataSource);
					deleteCacheData(this.props, pkname, pk, dataSource);
					pageInfoClick.call(this, this.props, nextId);
					this.setState({ showModal: false });
				}
			}
		});
	};
	render() {
		let { table, form, button, cardPagination, BillHeadInfo, ncmodal } = this.props;
		let { createForm } = form;
		let { createButtonApp,createErrorFlag } = button;
		let { createModal } = ncmodal;
		const { createCardPagination } = cardPagination;
		const { createBillHeadInfo } = BillHeadInfo;
		let multiLang = this.props.MutiInit.getIntl(app_code);
		let {showUploader,billID,billNO,assignShow,assignData,ts,paginaShow,showModal,pageinfo} = this.state;
		let status = this.props.getUrlParam('status');
		let fip = this.props.getUrlParam('scene')==="linksce";
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: (status == 'browse'&&!fip)?true:false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传(status == 'browse'&&!fip)?true:false
			billCode: this.billNO
		});
		if (status === 'add' || status === 'edit') {
			paginaShow = false;
		}
		return (
			 
			<div className="nc-bill-card">
				{/**创建websocket */}
				{createCardWebSocket(this.props, {
				headBtnAreaCode: btnHeadCode,
				formAreaCode: formId,
				billpkname: pkname,
				billtype: billtype
				// serverLocation: '10.16.2.231:9991'
			})}
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo({
								title: this.props.MutiInit.getIntl("36140NDSR") && 
								this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000004'),
								billCode: this.billno, //单据号
								backBtnClick: () => {
									//返回按钮的点击事件
									this.handleClick();
								}
							})}
						</div>
						<div className="header-button-area">
						{createErrorFlag({
                                    headBtnAreaCode: btnHeadCode
                                })}
							{createButtonApp({
								area: 'card_head',
								buttonLimit: 3,
								onButtonClick: buttonClick.bind(this),
								// popContainer: document.querySelector('.header-button-area')
							})}
						</div>
						{(paginaShow)&&<div className='header-cardPagination-area' style={{ float: 'right' }}>
							{createCardPagination({
								handlePageInfoChange: pageInfoClick.bind(this),
								dataSource: dataSource
						})}</div>}
					</NCDiv>
				</NCAffix>
				{/* 单据信息 */}
				<div className="nc-bill-form-area">{createForm(formId, {
					onAfterEvent: afterEvent.bind(this),

				})}</div>
				{createModal('MessageDlg', {
					size: 'lg'
				})}
				{/** 退回弹框 **/}
				{(showModal) && <Modal
					title={multiLang && multiLang.get('36140NDSR-000009')}
					label={multiLang && multiLang.get('36140NDSR-000009')}
					show={showModal}
					onOk={(value) => {
						//处理退回
						if (showModal) {
							this.beSureClick.call(this, this.props, value, true);
						}
					}}
					onClose={() => {
						this.setState({ showModal: false })
					}}
				/>
				}
			{/** 审批流指派 **/}
				<div>
					{assignShow && <ApprovalTrans
						title={loadMultiLang(this.props, '36140NDSR-000046')/* 国际化处理： 指派*/}
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							let bodyCodeArr = {};
							cardOperator(
								this.props,
								pageCodeCard,
								formId,
								bodyCodeArr,
								pkname,
								base_url + 'FDWDWCommitAction.do',
								this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000011')/* 国际化处理： 提交成功！*/, dataSource, this.toggleShow.bind(this), true, extParam);
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
						}}
						// hideNote={true}
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

Card = createPage({
	billinfo: {
		billtype: 'form',
		pagecode: pageCodeCard,
		headcode: formId,
		bodycode: []
	},
	mutiLangCode: app_code
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/