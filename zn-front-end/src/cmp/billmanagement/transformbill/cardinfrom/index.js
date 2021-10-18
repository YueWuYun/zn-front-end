/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表卡片
import React, { Component } from 'react';
import { createPage, getMultiLang, ajax, base, createPageIcon } from 'nc-lightapp-front';
import { buttonClick, initTemplate  } from './events';
import { constant, requesturl } from '../config/config';
import { buttonVisible } from './events/buttonVisible.js';
import { commondata } from '../../../public/utils/constant';
import {disablefield, editdiablefield, orgchangecleandata, sourceflagtranslate, initBillByPKorg} from '../pubutil/cardfunction';
let { NCFormControl, NCBackBtn, NCAffix, NCDiv } = base;
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;

class Card extends Component {
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pageId = constant.cpagecodeinform;
		this.formId = constant.formcode1;
		this.billpk = constant.pk_transformbill;
		this.state = {
			billId:'',//单据id
			billno: '' ,// 单据编号
			target: null,
			json: {}, //多语
			inlt: null
		};
		// initTemplate.call(this, props);
	}
	//浏览器页签关闭提示
	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				//console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		}
		// getMultiLang({ moduleId: constant.mutiLangCode, domainName: 'cmp', callback });
		getMultiLang({ 
			moduleId: {
			[constant.module_tmpub_name]: [constant.module_tmpub_id],
			[constant.module_name]: [constant.module_id,constant.mutiLangCode]
			}, 
		callback });

		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				return '当前单据未保存，您确认离开此页面？';
			}
		}
	}

	componentDidMount() {
		this.renderHtmlByStatus();
	}

	// 根据不同的状态渲染不同的页面数据
	renderHtmlByStatus = () =>{
		initBillByPKorg.call(this);
		let flag=false;
		let status = this.props.getUrlParam('status');
		let src = this.props.getUrlParam('src');
		let pk = this.props.getUrlParam('id');
		let pks = this.props.getUrlParam('pks');
		
		let data = { pk: pk, pageCode: this.pageId };
		let eidtdata
		if(pks){
			eidtdata = { pk: pks, pageCode: this.pageId };
		}else{
			eidtdata = { pk: pk, pageCode: this.pageId };
		}

		//查询单据详情
		if (status === 'browse') {
			if(pk){
				ajax({
				url: requesturl.querycardbyinform,
				data: data,
				async: false,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
							let billno = res.data[this.formId].rows[0].values.vbillno.value;
							let billstatus = res.data[this.formId].rows[0].values.busistatus.value;
							// this.setState({ billno: ':'+billno});
							this.props.BillHeadInfo.setBillHeadInfoVisible({
								showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
								showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
								billCode: billno
							});

							let sourceflag = res.data[this.formId].rows[0].values.sourceflag.value;
							if(sourceflag){
								sourceflagtranslate.call(this, sourceflag);
							}
							buttonVisible(this.props, billstatus);
						}
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					}
				}
			});
			}
		}
		
		//查询单据详情
		if (status === 'edit') {
			ajax({
				url: requesturl.querycard,
				data: eidtdata,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
							let billno = res.data[this.formId].rows[0].values.vbillno.value;
							// this.setState({ billno: ':'+billno });
							this.props.BillHeadInfo.setBillHeadInfoVisible({
								showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
								showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
								billCode: billno
							});

							this.props.form.setFormItemsDisabled(this.formId, {
								'pk_org': true
							});
							this.props.form.setFormItemsDisabled(this.formId, {
								'olcamount': true
							});
							editdiablefield.call(this);
						}
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					}
				}
			});
			buttonVisible(this.props,null);
		}
	}

	// 按钮点击跳转
	pageTransition = (billpk,urlstatus) =>{
		let src = this.props.getUrlParam('src');
		this.props.pushTo(constant.cardpath, {
			pagecode: constant.cpagecode,
			src: src,
			status: urlstatus,
			id: billpk
		});
		this.renderHtmlByStatus();
	}

	// 取消弹框确认按钮操作
	cancelModalBeSure = () => {
		let pk_transformbill = this.props.getUrlParam('id');
		if(!pk_transformbill){
			pk_transformbill = this.props.getUrlParam('pks');
		}
		
		//动态修改地址栏中的status的值
		this.props.setUrlParam({
			status: 'browse',
			id: pk_transformbill
		});
		if(pk_transformbill){
			this.browseRender(pk_transformbill);
		}else{
			this.emptyData();
		}
	};

	// 退出认领确认按钮
	quitinfromBeSure = () =>{
		this.props.linkTo('/cmp/informerrelease/SscRelease/list/index.html', {
			appcode: '36070AIPSSC',
			pagecode: '36070AIPSSC_L01',
		});
	}

	// 浏览态数据渲染
	browseRender = (pk) =>{
		let queryData =  { pk: pk, pageCode: this.pageId };
		if(pk){
				ajax({
					url: requesturl.querycard,
					data: queryData,
					async: false,
					success: (res) => {
						if (res) {
							if (res.data) {
								this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
								let billno = res.data[this.formId].rows[0].values.vbillno.value;
								let sourceflag = res.data[this.formId].rows[0].values.sourceflag.value;
								if(sourceflag){
									sourceflagtranslate.call(this, sourceflag);
								}
								let billstatus = res.data[this.formId].rows[0].values.busistatus.value;
								// this.setState({ 
								// 	billno: ':'+billno,
								// 	showNCbackBtn: true
								// });
								this.props.BillHeadInfo.setBillHeadInfoVisible({
									showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
									showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
									billCode: billno
								});
								this.props.form.setFormStatus(this.formId, 'browse');
								buttonVisible(this.props, billstatus);
							}else{
								this.emptyData();
							}
						} else {
							this.emptyData();
						}
					}
				});
		}else{
			this.emptyData();
		}
	}

	// 清空数据
	emptyData = () =>{
		this.props.form.EmptyAllFormValue(this.formId);
		this.props.setUrlParam({
			status: 'browse'
		});
		buttonVisible(this.props, null);
		// this.setState({ 
		// 	billno: null
		// });
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
			// billCode: billno
		});
		this.props.form.setFormStatus(this.formId, 'browse');
	}

	// 取消弹框取消按钮操作
	cancelModalCancel = () => {
		// //console.log("修改之前的财务组织",this.state.oldorg);
		this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value:this.state.oldorg, display: this.state.oldorgDis } });
		this.props.form.setFormStatus(this.formId, 'edit');
	};

	render() {
		let { form ,button} = this.props;
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createButton, createButtonApp,createErrorFlag } = button;
		let { createForm } = form;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
				{/**创建websocket */}
				{api.comm.createCardWebSocket(this.props, {
					headBtnAreaCode: cons.card.btnHeadCode,
					formAreaCode: cons.card.headCode,
					billpkname: cons.field.pk,
					billtype: cons.comm.billType
					// serverLocation: '10.16.2.231:9991'
				})}
				{/* <NCAffix> */}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
							{createBillHeadInfo({
								title: this.state.json['36070TBR-000023'],  ///* 国际化处理： 现金缴存*/
								billCode: this.state.billno,//单据号
								// backBtnClick: () => { //返回按钮的点击事件
								// 	this.backClick();
								// }
							})}
					</div>
					<div className="header-button-area">
						{createErrorFlag({
							headBtnAreaCode: cons.card.btnHeadCode
						})}
						{this.props.button.createButtonApp({
							area: 'card_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
							// popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>
				{/* </NCAffix> */}
				<div className="nc-bill-form-area">
					{createForm(this.formId, {
						expandArr:[constant.formcode1,constant.formcode2,constant.formcode3]
						// onAfterEvent: afterEvent.bind(this)
					})}
				</div>
			</div>
		);
	}
}

// Card = createPage({
// 	illinfo:{
//         billtype: 'form',
//         pagecode: constant.cpagecodeinform,
//         headcode: constant.formcode1
//     },
// 	// initTemplate: initTemplate,
// 	mutiLangCode: constant.mutiLangCode
// })(Card);
// export default Card;

Card = createPage({
	// initTemplate: initTemplate,
	// mutiLangCode: constant.mutiLangCode
})(Card);
ReactDOM.render(<Card />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/