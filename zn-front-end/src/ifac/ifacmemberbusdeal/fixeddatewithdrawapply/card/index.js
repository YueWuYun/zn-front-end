/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, getMultiLang, toast, high } from 'nc-lightapp-front';
import { buttonClick, initTemplate, pageInfoClick, afterEvent} from './events';
import {addCacheData, updateCacheData} from '../../../../tmpub/pub/util/cache';
import * as CONSTANTS from '../cons/constant.js';
import { cardOperator } from '../../../pub/utils/IFACButtonUtil';
import { buttonVisible } from './events/buttonVisible';
import { mysaveCommit } from './events/method.js';
import { requesturl } from '../cons/requesturl.js';
import { saveMultiLangRes, loadMultiLang} from "../../../../tmpub/pub/util/index";
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
let { pageCodeCard,pageCodeList,FixedWithDrawApplyConst,assignTypecon,pkname ,moudleName,formId ,app_code,base_url,billtype } = CONSTANTS;
const { NCDiv, NCAffix } = base;
const { NCUploader, ApprovalTrans,ApproveDetail } = high;
class Card extends Component {
	constructor(props) {
		super(props);
		this.isSaveAdd = false; //是否保存新增
		this.state = {
			ts: null,//时间戳
			index: null,
			showUploader: false,//控制附件弹出框
			showInnerAccount: false,//控制内部账户联查弹框
			actionCode: '', //按钮编码
			showApproveDetail: false, //显示审批详情
			showBillReview: false, //单据追溯	
			billID: '',//单据主键
			assignData: null,//指派数据
			assignShow: false,//是否显示指派
			assignType: 0,//指派类型（0 提交, 1 保存提交）
			billNO: '',//单据编码
		};
	}
	componentWillMount() {
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
		getMultiLang({ moduleId: app_code, domainName: moudleName, callback });
		window.onbeforeunload = () => {
			if (this.props.getUrlParam('status') != 'browse') {
				return loadMultiLang(this.props, '36340FDWA-000038');
			}
		}
		
	}

	componentDidMount() {
		let id = this.props.getUrlParam('id');
		this.billID = id;
		if (id) {
			this.qryData(false);
		}
		this.toggleShow();
	}
	//卡片返回按钮
	handleClick = () => {
		let link = this.props.getUrlParam('scene');
		this.props.pushTo('/list', {
			pagecode: pageCodeList,
			status: 'browse',
			scene:link,
			id:this.props.getUrlParam('id')
		});
	};
	/**
	 * 查询页面数据
	 * @param isRefresh 是否直接查询
	 */
	qryData = (isRefresh = false) => {
		let link = this.props.getUrlParam('scene') === 'linksce';
		let status = this.props.getUrlParam('status');
		let isCopy = this.props.getUrlParam('isCopy')=='copy';
		let url;
		if (isRefresh||status == 'browse') {
			url = requesturl.cardquery;
		}else if (status == 'edit') {
			url = requesturl.edit;
		} else if (isCopy) {
			url = requesturl.copy;
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
						toast({ color: 'success', title: loadMultiLang(this.props, '36340FDWA-000022')});
					}else if (status == 'edit') {
						this.props.form.setFormStatus(formId,'edit');
					}else if(isCopy){
						this.props.form.setFormStatus(formId,'add');
						this.props.form.setFormItemsDisabled(formId, { 'pk_org': true});
						this.props.form.setFormItemsDisabled(formId, { 'pk_fundorg':false,'applydate':false,'pk_depositreceipt':false,'withdrawamount':false,'pk_settleacc':false,'remark':false});
					}
					if(link){
						updateCacheData(
							this.props,
							FixedWithDrawApplyConst.pk_filed,
							this.props.getUrlParam('id'),
							res.data,
							formId,
							FixedWithDrawApplyConst.dataSource,
							res.data.head[formId].rows[0].values
						);
					}
				} else {
					toast({ color: 'warning', content: loadMultiLang(this.props, '36340FDWA-000020')});
					this.billNO = '';
					this.billID = '';
					that.props.form.EmptyAllFormValue(that.formId);
				}
				this.toggleShow();
			}
		});

	};
	/**
	 * 保存单据逻辑处理
	 * iscommit  是否保存提交
	 * isSaveAdd 是否保存新增
	 */
	saveBill = (iscommit = false,formdata, callback) => {
		let isSaveAdd = this.isSaveAdd;
		let status = this.props.getUrlParam('status');
		let url = base_url + 'FDWDWASaveaction.do';
		if (status == 'add' || status == 'edit') {
			url = base_url + 'FDWDWASaveaction.do';
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
				let pk_fwithdrawapply  = null;
				if (res.success) {
					if(res.data.msg){
						this.props.form.setFormItemsValue(formId, { 'enddate': { value: res.data.result.parent.valueIndex['enddate'], display: null } });
						this.props.form.setFormItemsValue(formId, { 'depositdate': { value: res.data.result.parent.valueIndex['depositdate'], display: null } });
						toast({color: 'warning', content: res.data.msg});
						return;
					}
					toast({color: 'success', content: loadMultiLang(this.props, '36340FDWA-000039')+loadMultiLang(this.props, '36340FDWA-000021'),/* 国际化处理： 保存成功！*/});
					if (res.data) {
						if (res.data.head && res.data.head[formId]) {
							pk_fwithdrawapply = res.data.head[formId].rows[0].values.pk_fwithdrawapply.value;
							this.billNO = res.data.head[formId].rows[0].values.vbillcode.value || '';
							if (isSaveAdd) {
								//清空界面
								this.props.form.EmptyAllFormValue(formId);
								this.props.setUrlParam({
									status: 'add'
								});
								this.props.initMetaByPkorg();
							} else {
								this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
								this.props.setUrlParam({
									status: 'browse'
								});
							}
						}
						if (status == 'add') {
							addCacheData(
								this.props,
								FixedWithDrawApplyConst.pk_filed,
								pk_fwithdrawapply,
								res.data,
								formId,
								FixedWithDrawApplyConst.dataSource,
								res.data.head[formId].rows[0].values
							);
						} else if (status == 'edit') {
							updateCacheData(
								this.props,
								FixedWithDrawApplyConst.pk_filed,
								pk_fwithdrawapply,
								res.data,
								formId,
								FixedWithDrawApplyConst.dataSource,
								res.data.head[formId].rows[0].values
							);
						} 
					}
					this.props.setUrlParam({
						id: pk_fwithdrawapply
					});
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
		if (status == 'browse') {
			this.props.form.setFormStatus(formId,status);
		}
		else if (status == 'edit') {
			this.props.form.setFormStatus(formId,'edit');

		}
		else if (status == 'copy') {
			this.props.form.setFormStatus(formId,'add');

		} else if(status == 'add'){
			this.props.form.setFormStatus(formId,'add');
			
		}
		orgVersionView(this.props, formId);
		buttonVisible.call(this, this.props);
		//开关关闭
	};
	render() {
		let that = this;
		let {form, button, cardPagination, BillHeadInfo, ncmodal } = this.props;
		let { createForm } = form;
		let { createButtonApp } = button;
		let { createModal } = ncmodal;
		const { createCardPagination } = cardPagination;
		const { createBillHeadInfo } = BillHeadInfo;
		let {showUploader,billID,billNO,assignShow,assignData,showApproveDetail,assignType} = this.state;
		let status = this.props.getUrlParam('status');
		let scene = this.props.getUrlParam("scene");
		let islinkquery = this.props.getUrlParam('islinkquery');
		let showBackBtn = true;
		if((scene&&(scene == 'linksce')) ||islinkquery||status!='browse')
		{
				showBackBtn = false;
		}
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: showBackBtn,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: status=="browse"?true:false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.billNO
		});
		return (
			<div className="nc-bill-card">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo({
								title: loadMultiLang(this.props, '36340FDWA-000004'),
								backBtnClick: () => {
									//返回按钮的点击事件
									this.handleClick();
								}
							})}
						</div>
						<div className="header-button-area">
							{createButtonApp({
								area: 'card_head',
								buttonLimit: 3,
								onButtonClick: buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
						<div className='header-cardPagination-area' style={{ float: 'right' }}>
							{createCardPagination({
								handlePageInfoChange: pageInfoClick.bind(this),
								dataSource: FixedWithDrawApplyConst.dataSource
						})}</div>
					</NCDiv>
				</NCAffix>
				{/* 单据信息 */}
				<div className="nc-bill-form-area">{createForm(formId, {
					onAfterEvent: afterEvent.bind(this),
				})}</div>
				{createModal('MessageDlg', {
					size: 'lg',
					content:''
				})}
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
			{/** 审批流指派 **/}
				<div>
					{assignShow && <ApprovalTrans
						title={loadMultiLang(this.props, '36340FDWA-000029')/* 国际化处理： 指派*/}
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							//关闭指派框
							this.setState({ assignShow: false, assignData: null,assignType: assignTypecon.commit });
							if (assignType == assignTypecon.savecommit) {
								mysaveCommit.call(this, this.props, value);
                            }
                            //如果是提交类型 继续提交
                            else {
								let extParam = {};
								let bodyCodeArr = {};
                                if (value) {
                                    extParam['content'] = JSON.stringify(value);
                                }
                                cardOperator(
									this.props,
									pageCodeCard,
									formId,
									bodyCodeArr, 
									pkname,
									base_url + 'FDWDWACommitAction.do',
									loadMultiLang(this.props, '36340FDWA-000009')/* 提交成功*/, 
									FixedWithDrawApplyConst.dataSource, 
									this.toggleShow.bind(this),
									true, 
									extParam);
                            }
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
	}
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/