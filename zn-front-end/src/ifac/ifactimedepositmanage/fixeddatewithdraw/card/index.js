/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, getMultiLang, toast,high } from 'nc-lightapp-front';
import { buttonClick, initTemplate,pageInfoClick, afterEvent} from './events';
import { deleteCacheData, getNextId,addCacheData, updateCacheData} from '../../../../tmpub/pub/util/cache';
import * as CONSTANTS from '../cons/constant.js';
import { buttonVisible } from './events/buttonVisible';
import { cardOperator } from '../../../pub/utils/IFACButtonUtil';
import Modal from "../../../../tmpub/pub/util/modal/index";
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
import { mysaveCommit } from './events/method.js';
import { saveMultiLangRes, loadMultiLang, createCardWebSocket } from "../../../../tmpub/pub/util/index";
let {pageCodeCard,pageCodeList, billtype,pkname,FixedWithDrawConst, formId ,app_code,base_url,assignTypecon  } = CONSTANTS;
const { NCDiv, NCAffix } = base;
const { NCUploader, ApproveDetail,ApprovalTrans } = high;
class Card extends Component {
	constructor(props) {
		super(props);
		this.isSaveAdd = false; //是否保存新增
		this.state = {
			//时间戳
			ts: null,
			index: null,
			showUploader: false,//控制附件弹出框
			showInnerAccount: false,//控制内部账户联查弹框
			actionCode: '', //按钮编码
			showApproveDetail: false, //显示审批详情
			showModal: false, //退回意见框 
			showBillReview: false, //单据追溯	
			assignType: 0,//指派类型（0 提交, 1 保存提交）
			//单据主键
			billID: '',
			//多语
			json: {},
			inlt: null,
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			//单据编码
			billNO: '',
		};
		// initTemplate.call(this, this.props);
		// initTemplate.call(this, props);
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
		getMultiLang({ 
			moduleId: {
				['ifac']: ['36340FDW', '36340PUBLIC'],
				['tmpub']: ['3601']
			}, 
			callback });
		window.onbeforeunload = () => {
			if (this.props.getUrlParam('status') != 'browse') {
				return loadMultiLang(this.props, '36340FDW-000037');
			}
		}
	}

	componentDidMount() {
		let id = this.props.getUrlParam('id');
		this.billID = id;
		if (id) {
			this.qryData(false);
		}
	}
	//卡片返回按钮
	handleClick = () => {
		let scene = this.props.getUrlParam("scene");
		this.props.pushTo('/list', {
			pagecode: pageCodeList,
			scene,
			islinklistquery:this.props.getUrlParam('islinklistquery')?true:null,
		});
	};
	/**
	 * 查询页面数据
	 * @param isRefresh 是否直接查询
	 */
	qryData = (isRefresh = false) => {
		let status = this.props.getUrlParam('status');
		let isCopy = this.props.getUrlParam('isCopy')=='copy';
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
		let pk;
		ajax({
			url,
			data: data,
			success: (res) => {
				if (res.data) {
					if (res.data.head) {
						this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
						this.billNO = res.data.head[formId].rows[0].values.vbillcode.value || '';
						if(res.data.head.userjson){
							let userjson = JSON.parse(res.data.head.userjson);
							let {retExtParam} =userjson;
							//设置组织本币列编辑性
							if (retExtParam.hasOwnProperty('bodyOlcRateEditable')) {
								//设置列得编辑性，flag=true是不可编辑，false是可编辑
								let flag = retExtParam['bodyOlcRateEditable'] == 'Y' ? false : true;
								this.props.form.setFormItemsDisabled(formId, {   olcrate: flag });
							}
							if (retExtParam.hasOwnProperty('bodyGlcRateEditable')) {
								//设置列得编辑性，flag=true是不可编辑，false是可编辑
								let flag = retExtParam['bodyGlcRateEditable'] == 'Y' ? false : true;
								this.props.form.setFormItemsDisabled(formId, {   glcrate: flag });
							}
							if (retExtParam.hasOwnProperty('bodyGllcRateEditable')) {
								//设置列得编辑性，flag=true是不可编辑，false是可编辑
								let flag = retExtParam['bodyGllcRateEditable'] == 'Y' ? false : true;
								this.props.form.setFormItemsDisabled(formId, {   gllcrate: flag });
							}
						}
					} 
					if (isRefresh) {
						toast({ color: 'success', title: loadMultiLang(this.props, '36340FDW-000023') });
					}
					pk = res.data.head[formId].rows[0].values.pk_fixeddatewithdraw.value;
				} else {
					toast({ color: 'warning', content: loadMultiLang(this.props, '36340FDW-000033') });
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
		console.log("formdata:"+JSON.stringify(formdata));
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
				if (res.success) {
					if(res.data.msg){
						this.props.form.setFormItemsValue(formId, { 'enddate': { value: res.data.result.parent.valueIndex['enddate'], display: null } });
						this.props.form.setFormItemsValue(formId, { 'depositdate': { value: res.data.result.parent.valueIndex['depositdate'], display: null } });
						toast({color: 'warning', content: res.data.msg});
						return;
					}
					toast({color: 'success', content: loadMultiLang(this.props, '36340FDW-000032')+loadMultiLang(this.props, '36340FDW-000022'),/* 国际化处理： 保存成功！*/});
					if (res.data) {
						if (res.data.head && res.data.head[formId]) {
							pk_fixeddatewithdraw = res.data.head[formId].rows[0].values.pk_fixeddatewithdraw.value;
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
						if (status == 'add'||status == 'copy') {
							addCacheData(
								this.props,
								FixedWithDrawConst.pk_filed,
								pk_fixeddatewithdraw,
								res.data,
								formId,
								FixedWithDrawConst.dataSource,
								res.data.head[formId].rows[0].values
							);
						} else if (status == 'edit') {
							updateCacheData(
								this.props,
								FixedWithDrawConst.pk_filed,
								pk_fixeddatewithdraw,
								res.data,
								formId,
								FixedWithDrawConst.dataSource,
								res.data.head[formId].rows[0].values
							);
						}
					}
					this.props.setUrlParam({
						id: pk_fixeddatewithdraw
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
		let srcbillcode=this.props.form.getFormItemsValue(formId, 'srcbillcode').value; 
    	let srcbilltypecode=this.props.form.getFormItemsValue(formId, 'srcbilltypecode').value; 
		let status = this.props.getUrlParam('status');
		if (status == 'browse') {
			this.props.form.setFormStatus(formId,'browse');
		}
		else if (status == 'edit') {
			this.props.form.setFormItemsDisabled(formId, { 'pk_org': true});
			this.props.form.setFormStatus(formId,'edit');
			if(srcbillcode!=null&&srcbilltypecode!=null){
				this.props.form.setFormItemsDisabled(formId, {'pk_depositorg':true,'pk_depositreceipt':true,'pk_settleacc':true,'withdrawamount':true});
			}

		}else if(status == 'copy'){
			this.props.form.setFormStatus(formId,'add');
			this.props.form.setFormItemsDisabled(formId, {'pk_org': true,'pk_depositorg':false,'pk_depositreceipt':false,'pk_settleacc':false,'withdrawdate':false,'withdrawamount':false,'remark':false});
		}
		 else if(status == 'add'){
			this.props.form.setFormStatus(formId,'add');
		}
		buttonVisible.call(this, this.props);
		orgVersionView(this.props, formId);
		//开关关闭
	};
	// 模态框点击确定并从textarea取值
	beSureClick = (props, value, flag = false) => {
		if (!value) {
			toast({ 'color': 'warning', 'content': loadMultiLang(props, '36340FDW-000036') });/* 国际化处理： 退回原因不能为空！*/
			return;
		}
		// 退回单据
		let pkMapTs = {};
		let pk = this.props.getUrlParam('id');
		let values = value?value:null;
		let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
		let extParam = {};
		extParam["returnnote"] = values;
		pkMapTs[pk] = ts;
		ajax({
			url: base_url + 'FDWDWReturnAction.do',
			data: {
				extParam,
				pkMapTs,
				pageCode: pageCodeCard
			},
			success: (res) => { 
				if (res) {
					toast({ color: 'success', content: loadMultiLang(this.props, '36340FDW-000010')+loadMultiLang(this.props, '36340FDW-000022') });/* 国际化处理： 退回成功！*/
					let nextId = getNextId(this.props, pk, FixedWithDrawConst.dataSource);
					deleteCacheData(this.props, FixedWithDrawConst.pk_filed, pk, FixedWithDrawConst.dataSource);
					pageInfoClick.call(this, this.props, nextId);
					this.setState({ showModal: false });
				}
			}
		});
	}
	render() {
		let {form, button, cardPagination, BillHeadInfo, ncmodal } = this.props;
		let { createForm } = form;
		let { createButtonApp ,createErrorFlag} = button;
		let { createModal } = ncmodal;
		const { createCardPagination } = cardPagination;
		const { createBillHeadInfo } = BillHeadInfo;
		let {showUploader,billID,billNO,assignShow,assignData,ts,index,showModal,showApproveDetail,assignType} = this.state;
		let scene = this.props.getUrlParam("scene");
		let status = this.props.getUrlParam('status');
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBillCode: status=="browse"?true:false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.billNO
		});
		return ( 
			<div className="nc-bill-card"> 
				{/**创建websocket */}
				{createCardWebSocket(this.props, {
                    headBtnAreaCode: 'card_head',
                    formAreaCode: formId,
                    billpkname: pkname,
					billtype: billtype,
					// dataSource:FixedWithDrawConst.dataSource
                    // serverLocation: '10.16.2.231:9991'
                })}
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo({
								title: loadMultiLang(this.props, '36340FDW-000004'),
								backBtnClick: () => {
									//返回按钮的点击事件
									this.handleClick();
								}
							})}
						</div>
						<div className="header-button-area">
							{createErrorFlag({
                                headBtnAreaCode: 'card_head'
                            })}
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
								dataSource: FixedWithDrawConst.dataSource
						})}</div>
					</NCDiv>
				</NCAffix>
				{/* 单据信息 */}
				<div className="nc-bill-form-area">{createForm(formId, {
					onAfterEvent: afterEvent.bind(this),
				})}</div>
				{createModal('MessageDlg', {
					size: 'lg'
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
				{/* * 退回弹框 * */}
				{(showModal) && <Modal
					title={loadMultiLang(this.props, '36340FDW-000009')}
					label={loadMultiLang(this.props, '36340FDW-000009')}
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
						title={loadMultiLang(this.props, '36340FDW-000030')/* 国际化处理： 指派*/}
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
								let extParam={btncode:"SaveCommit",pagecode:"36340FDW_C01"};
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
									base_url + 'FDWDWCommitAction.do',
									loadMultiLang(this.props, '36340FDW-000011')/* 国际化处理： 提交成功！*/, 
									FixedWithDrawConst.dataSource, 
									this.toggleShow.bind(this), 
									true, 
									extParam);
							}
							
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
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