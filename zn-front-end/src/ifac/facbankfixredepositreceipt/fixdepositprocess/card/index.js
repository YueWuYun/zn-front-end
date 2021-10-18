/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import React, { Component } from 'react';
import { createPage, ajax, base, getMultiLang, toast, high,cardCache } from 'nc-lightapp-front';
import { buttonClick, initTemplate, pageInfoClick, afterEvent } from './events';
import * as CONSTANTS from '../cons/constant';
import { buttonVisible } from './events/buttonVisible';
import { saveMultiLangRes, createCardWebSocket } from "../../../../tmpub/pub/util/index";//xuechh 云原生适配
//联查收款银行账户组件
import NCCOriginalBalance from '../../../../cmp/public/restmoney/list';
import { versionsControl } from "../../../pub/util/util.js";
import { processHeadOlcRateEditable } from '../cons/constant';
let { pageCodeCard, pageCodeList, formId, dataSource, app_code, base_url,pkname,tableId,btnHeadCode,billtype } = CONSTANTS;//xuechh 云原生适配
const { NCDiv, NCAffix } = base;
const { NCUploader } = high;
let { getCacheById, updateCache,addCache,deleteCacheById,getNextId } = cardCache;
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
			actionCode: '', //按钮编码
			//单据主键
			billID: '',
			//单据编码
			billNO: '',
			//分页显示
			paginaShow: true,
			showUploader: false,
			showOriginal: false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData: [],// 联查余额取数据，将需要联查的数据赋值给我
			accModalShow: false,//内部账户余额参数
			currentpk: '',//内部账余额参数
		};
	}


	componentWillMount() {
		window.onbeforeunload = () => {
			if (this.props.getUrlParam('status') !== 'browse') {
				return '当前单据未保存，您确认离开此页面？';
			}
		};
		let callback = (json, status, inlt) => {
			saveMultiLangRes(this.props, json);
			// json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({ json, inlt })       // 保存json和inlt到页面state中并刷新页面
			} else {
				console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		}
		getMultiLang({
			moduleId: {
				'tmpub': ['3601'],
				// 'ifac':['36340', '36340RFDR']
				'ifac': ['36140FDSR']
			},
			callback
		});
	}


	componentDidMount() {
		//设置卡片头部状态
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
		});
		//查询单据详情
		let id = this.props.getUrlParam('id');
		this.billID = id;
		if (id) {
			this.qryData(false);
		}
	}


	//卡片返回按钮
	handleClick = (type2) => {//20200328
		let scene = this.props.getUrlParam("scene");
		let id = this.props.getUrlParam("id");
		this.props.pushTo('/list', {
			pagecode: pageCodeList,
			type:type2,
			scene:scene,
			id:id,
			status: 'add'
		});
	};


	/**
	 * 查询页面数据
	 * @param isRefresh 是否直接查询
	 */
	qryData = (isRefresh = false) => {
		let status = this.props.getUrlParam('status');
		let isCopy = this.props.getUrlParam('isCopy') == 'copy';
		let url = base_url;
		if (isRefresh || status == 'browse') {
			url = url + 'querycardaction.do';
		} else if (status == 'edit') {
			url = url + 'FDSREditaction.do';
		} else if (isCopy) {
			url = url + 'FDSRCopyaction.do';
		} else if (status == 'add') {
			return;
		}
		let data = { pk: this.props.getUrlParam('id'), pageCode: pageCodeCard };
		const that = this;

		ajax({
			url,
			data: data,
			success: (res) => {
				if (res.data) {

					//接收到数据时，全部回显
					if (res.data.head) {
						that.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
						this.billID = res.data.head[formId].rows[0].values.pk_deposit.value || '';
						this.billNO = res.data.head[formId].rows[0].values.vbillcode.value || '';
					}

					//如果是刷新则给提示信息
					if (isRefresh) {
						toast({ color: 'success', title: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000037') });
					}
					if (status == "add" || isCopy) {//复制状态
						this.props.form.EmptyAllFormValue(formId);
						this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
						//设置可编辑性
						this.props.form.setFormItemsDisabled(formId, { 'pk_org': true });
						this.props.form.setFormItemsDisabled(formId, { 'pk_depositbank': false, 'depositcode': false, 'pk_currtype': false, 'businessvariety': false, 'depositamount': false, 'depositdate': false, 'redeposittype': false, 'pk_settleacc': false, 'pk_depositacc': false, 'remark': false });
						if(res.data.userjson){
							let userjson = JSON.parse(res.data.userjson);
							let {retExtParam} =userjson;
							//设置组织本币列编辑性
							processHeadOlcRateEditable(this.props, retExtParam);
							this.props.setUrlParam({
								userjson: userjson
							  });
						  }
					}
					updateCache(tableId, this.props.getUrlParam('id'), formId, dataSource, res.data.head[formId].rows[0].values);
					//未接收到数据
				} else {
					toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300CUREX") && this.props.MutiInit.getIntl("36300CUREX").get('36300CUREX-000033') });
					this.billNO = '';
					this.billID = '';
					that.props.form.EmptyAllFormValue(that.formId);
				}
				this.toggleShow();
				buttonVisible.call(this, this.props);
			}
		});
	};


	/**
	 * 保存单据逻辑处理
	 * isSaveAdd 是否保存新增
	 */
	saveBill = (formdata, callback) => {
		let isSaveAdd = this.isSaveAdd;
		let status = this.props.getUrlParam('status');
		let url = base_url + 'FDSRSaveaction.do';
		if (status == 'add' || status == 'edit') {
			url = base_url + 'FDSRSaveaction.do';
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
				let pk_deposit = null;
				let vbillcode = null;
				let pk_org = null;
				if (res.success) {
					if (res.data) {
						// let { head, bodys } = res.data;
						if (res.data.head && res.data.head[formId]) {
							pk_org = res.data.head[formId].rows[0].values.pk_org;
							pk_deposit = res.data.head[formId].rows[0].values.pk_deposit.value;
							if (isSaveAdd) {
								//清空界面
								this.props.form.EmptyAllFormValue(formId);
								this.props.setUrlParam({
									status: 'add'
								});
								
								addCache(pk_deposit,res.data,formId,dataSource,res.data.head[formId].rows[0].values);
							} else {
								if ((this.props.getUrlParam('status') === 'add') || (this.props.getUrlParam('status') === 'copy')) {
									addCache(pk_deposit,res.data,formId,dataSource,res.data.head[formId].rows[0].values);
								}else{
									updateCache(pkname,pk_deposit,res.data,formId,dataSource,res.data.head[formId].rows[0].values);
								}
								this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
								this.billNO=res.data.head[formId].rows[0].values.vbillcode.value || '';//20200331
								this.props.setUrlParam({
									status: 'browse'
								});
							}
						}
						this.props.setUrlParam({
							id: pk_deposit
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


	//根据状态改变页面显示
	toggleShow = () => {
		//开关开始
		let status = this.props.getUrlParam('status');
		if (status == 'browse') {

			//设置表单状态
			this.props.form.setFormStatus(formId, status);
			//显示翻页条
			this.setState({ paginaShow: true });
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.billNO  //修改单据号---非必传
			});
			versionsControl(this.props,formId);
		}
		else if (status == 'edit') {

			//设置表单状态 
			this.props.form.setFormStatus(formId, status);
			//翻页条不显示
			this.setState({ paginaShow: false });
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.billNO  //修改单据号---非必传
			});
			versionsControl(this.props,formId);

		} else if (status == 'add') {

			this.props.form.setFormStatus(formId, status);
			//翻页条不显示
			this.setState({ paginaShow: false });
			//如果没有主组织则其他字段不可编辑
			// this.props.initMetaByPkorg();
			initTemplate.call(this, this.props);
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: "" //20200331
			});

		} else {

			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
		}
		buttonVisible.call(this, this.props);
	};


	//模态框点击确定并从textarea取值
	beSureClick = (props, value, flag = false) => {
		if (flag) {
			this.props.form.setFormItemsValue(formId, { returnreason: { value: value } });
		}
		this.backConfirm();
	}


	render() {
		let { table, form, button, cardPagination, BillHeadInfo, ncmodal } = this.props;
		let { createForm } = form;
		let { createButtonApp,createErrorFlag } = button;//xuechh 云原生适配 
		let { createModal } = ncmodal;
		const { createCardPagination } = cardPagination;
		const { createBillHeadInfo } = BillHeadInfo;
		let multiLang = this.props.MutiInit.getIntl(app_code);
		let { showUploader, billID, billNO, showModal, paginaShow, currentpk, accModalShow } = this.state;
		let status = this.props.getUrlParam('status');
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: status == 'browse' ? true : false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
		});
		if (status === 'add' || status === 'edit') {
			paginaShow = false;
			//xuechh--修改新增界面如果设置默认财务组织其他字段不可编辑了的bug
		this.props.form.setFormItemsDisabled(formId, { 'pk_depositbank': false, 'depositcode': false, 'pk_currtype': false, 'businessvariety': false, 'depositamount': false, 'depositdate': false, 'redeposittype': false, 'pk_settleacc': false, 'pk_depositacc': false, 'remark': false });
		}
		//20200328
		let type2 = this.props.getUrlParam('type');
		return (
			<div className="nc-bill-card">
				{/**创建websocket--xuechh 云原生适配 */}
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
								title: this.props.MutiInit.getIntl("36140FDSR") &&
									this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000004'),
									billCode: "", //单据号20200331
								backBtnClick: () => {
									//返回按钮的点击事件
									this.handleClick(type2);//20200328
								}
							})}
						</div>
						<div className="header-button-area">
						{createErrorFlag({//xuechh --云原生适配
                                    headBtnAreaCode: btnHeadCode
                                })}
							{createButtonApp({
								area: 'card_head',
								buttonLimit: 3,
								onButtonClick: buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
						{(paginaShow) && <div className='header-cardPagination-area' style={{ float: 'right' }}>
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

				<div>
					{/*账户余额 提示页面*/}
					{accModalShow && <InnerAccoutDialog
						id="dialog"
						showModal={accModalShow}
						accpk={currentpk}
						closeModal={() => {
							this.setState({
								accModalShow: false,
								currentpk: ''
							})
						}}
					/>}
				</div>
				<div>
					{/* 银行账户余额 */}
					<NCCOriginalBalance
						// 补录框显示
						showmodal={this.state.showOriginal}
						showOriginalData={this.state.showOriginalData}
						// 点击确定按钮的回调函数
						onSureClick={(retOriginalMsg) => {
							//console.log(retOriginalMsg, 'retOriginalMsg')
							//关闭对话框
							this.setState({ showOriginal: false })
						}}
						onCloseClick={() => {
							//关闭对话框
							this.setState({ showOriginal: false })
						}}
					>
					</NCCOriginalBalance>
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