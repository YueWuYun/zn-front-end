/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表卡片
import React, { Component } from 'react';
import { createPage, getMultiLang, ajax, base, toast, high, cardCache } from 'nc-lightapp-front';
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import { constant, requesturl } from '../config/config';
import { buttonVisible } from './events/buttonVisible';
import { orgVersionUtil } from '../config/orgVersionUtil';
import { createCardWebSocket } from "../../../../tmpub/pub/util/index";

let { NCBackBtn, NCDiv, NCAffix } = base;
let { getCacheById, updateCache, addCache, getCurrentLastId,getNextId, deleteCacheById } = cardCache;
const { NCUploader, PrintOutput } = high;

class Card extends Component {
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pageId2 = constant.cpagecode2;
		this.searchId = constant.searchcode;
		this.formId2 = constant.formcode2;
		this.cacheDataSource = constant.cacheDataSource;
		this.pkname = constant.pkname;
		this.state = {
			billId:'',//单据id
			billno: '' ,// 单据编号
			addid: '',
			oldorg:'',
			oldorgDis:'',
			showUploader: false, // 附件弹框
			target: null,
			outputData: '', // 输出数据
			showOriginal:false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData:[],// 联查余额取数据，将需要联查的数据赋值给我
			showNCbackBtn: true, // 返回按钮
			json: {}, // 多语
			inlt: null
		};
	}

	//浏览器页签关闭提示
	componentWillMount() {

		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				// console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		}
		getMultiLang({ moduleId: constant.mutiLangCode, domainName: 'cmp', callback });
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				return '';
			}
		}
	}

	componentDidMount() {
		// this.renderHtmlByStatus();
		
		if(this.props.getUrlParam('status') == 'browse'){
			let pk_accountagiotage = this.props.getUrlParam('pk_accountagiotage');
			let pk_id = this.props.getUrlParam('id');
			let billno;
			if(!pk_accountagiotage){
				pk_accountagiotage = pk_id;
			}
			let data = { pk:pk_accountagiotage, pageCode: this.pageId2 };

			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					//获取后台返回data				
					if (res.data) {
						billno = res.data[constant.formcode2].rows[0].values.vbillno.value;
						this.setState({ 
								showBillCode: true,
								billno: billno,
								addid: pk_accountagiotage,
								showNCbackBtn: false
						});
						this.props.form.setAllFormValue({ [this.formId2]: res.data[this.formId2] });
						// orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
						// 汇兑损益计算 联查单据卡片页面，返回列表，列表显示数据
						// addCache(pk_accountagiotage, res.data, this.formId2, this.cacheDataSource, res.data[this.formId2].rows[0].values);
					} else {
						this.props.form.setAllFormValue({ [this.formId2]: { rows: [] } });
					}
				}
			});
		}
	}

	//初始化财务组织[新增其他字段不可编辑，有值其他可以编辑]
	initBillByPKorg = () => {
		let status = this.props.getUrlParam('status');
		//组织之外的字段不可以编辑
		if (status === 'add') {
			this.props.resMetaAfterPkorgEdit();
			this.props.initMetaByPkorg();//此方法不可以调用2次，不然rest失败
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });//财务组织
		}
		if (status === 'edit') {
			this.props.resMetaAfterPkorgEdit();
		}
		if (status === 'copy') {
			this.props.resMetaAfterPkorgEdit();
		}
	}

	// 根据不同状态渲染不同数据
	renderHtmlByStatus = () =>{

		this.initBillByPKorg();
		let flag=false;
		let pk = this.props.getUrlParam('id');
		let data = { pk: pk, pageCode: this.pageId };
		let urlstatus = this.props.getUrlParam('status');
		// orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
		let statusflag = urlstatus === 'browse' ? false : true;
		if(statusflag){
			this.disablefield();
			this.setState({ showNCbackBtn: false});
			buttonVisible(this.props);
			//设置看片翻页的显隐性
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !statusflag);
		}
		
		//查询单据详情
		if (urlstatus === 'browse') {
			if(pk){
				this.browseRender(pk);
			}
		}
	}

	// 禁用字段
	disablefield(){

	}

	// 浏览态数据渲染
	browseRender = (pkbill) =>{
		// let cardData,billstatus,billno,pk_accountagiotage
		let cardData,billno,pk_accountagiotage
		if(pkbill){
			cardData = getCacheById(pkbill, this.cacheDataSource);
			let queryData =  { pk: pkbill, pageCode: this.pageId };
			if(cardData){
				this.props.form.setAllFormValue({ [this.formId]: cardData[this.formId] });

				billno = cardData[this.formId].rows[0].values.vbillno.value;
				pk_accountagiotage = cardData[this.formId].rows[0].values[this.pkname].value;
				// billstatus = cardData[this.formId].rows[0].values.billstatus.value;
				buttonVisible(this.props);
				this.props.form.setFormStatus(this.formId, 'browse');
				this.setState({ 
					showBillCode: true,
					billno: billno,
					addid: pk_accountagiotage,
					showNCbackBtn: false
					});
				orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
			}else{
				ajax({
					url: requesturl.querycard,
					data: queryData,
					success: (res) => {
						if (res) {
							if (res.data) {
								this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
								billno = res.data[this.formId].rows[0].values.vbillno.value;
								pk_accountagiotage = res.data[this.formId].rows[0].values[this.pkname].value;
								// billstatus = res.data[this.formId].rows[0].values.billstatus.value;

								// billno = res.data[this.formId].values.vbillno.value;
								// pk_accountagiotage = res.data[this.formId].values[this.pkname].value;
								// billstatus = res.data[this.formId].rows[0].values.billstatus.value;

								this.setState({ 
									showBillCode: true,
									billno: billno,
									addid: pk_accountagiotage,
									showNCbackBtn: false
								});
								buttonVisible(this.props);
								this.props.form.setFormStatus(this.formId, 'browse');
								orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
							}else{
								this.emptyData();
							}
						} else {
							this.emptyData();
						}
					}
				});
			}
		}else{
			this.emptyData();
		}
		
	}

	emptyData = () => {
		this.props.form.EmptyAllFormValue(this.formId);
		this.props.setUrlParam({
			status: 'browse',
			id: null
		});
		buttonVisible(this.props);
		this.setState({ 
			showBillCode: true,
			billno: this.state.billno,
			addid: null,
			showNCbackBtn: false
		});
		//设置卡片翻页的显隐性
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	}

	// 按钮点击后渲染数据
	buttonAfter(billdata){
	
		let billno = billdata[this.formId2].rows[0].values.vbillno.value;
		let id = billdata[this.formId2].rows[0].values[this.pkname].value;
		// let billstatus = billdata[this.formId].rows[0].values.billstatus.value;

		// 更新缓存
		updateCache(this.pkname,id,billdata,this.formId2,this.cacheDataSource, billdata[this.formId2].rows[0].values);

		this.setState({
			
			billno: billno,
			showNCbackBtn: false
		});
		//动态修改地址栏中的id的值
		this.props.setUrlParam({
			status: 'browse',
			id: id
		});
		this.props.form.setAllFormValue({
			[this.formId2]: billdata[this.formId2]
		});
		this.props.form.setFormStatus(this.formId2, 'browse');
		// buttonVisible(this.props, billstatus);
		buttonVisible(this.props);
	}

	// 更改组织确认按钮
	ortBeSureBtnClick = () => {
		let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
		let pk_org_dis = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
		this.props.form.cancel(this.formId);
		this.props.form.setFormItemsValue(this.formId, {
			'pk_org': {
				value: pk_org,
				display: pk_org_dis
			}
		});
		this.props.form.setFormStatus(this.formId, 'edit');
		if (!pk_org) {
			this.props.initMetaByPkorg();
			this.emptyorgcleandata();
		} else {
			
			let changedata = this.props.createFormAfterEventData(this.pageId, this.formId);
			
			ajax({
				url: requesturl.orgchange,
				data: changedata,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
							let olcrate = res.data[constant.formcode1].rows[0].values.olcrate.value;
							if(olcrate){
								this.props.form.setFormItemsDisabled(this.formId,{'olcrate': true});
							}
							this.orgchangecleandata();
						}
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					}
				}
			});
		}
		//清空表格
		//this.props.form.EmptyAllFormValue('head');
	};

	// 组织修改取消
	orgCancelBtnClick = () => {
		this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value:this.state.oldorg, display: this.state.oldorgDis } });
		this.props.form.setFormStatus(this.formId, 'edit');
	};

	// 更改组织清空输入数据
	orgchangecleandata = () => {
		this.props.form.setFormItemsValue(this.formId,{'pk_bankaccount':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'money':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'olcmoney':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'pk_balatype':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'brief':{ display: null, value: null }});
	}

	// 清空组织，清空其他数据
	emptyorgcleandata = () =>{
		this.props.form.setFormItemsValue(this.formId,{'pk_currency':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'pk_cashaccount':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'olcrate':{ display: null, value: null }});
		this.orgchangecleandata();
	}
	
	// 取消弹框确认按钮操作
	cancelModalBeSure = () => {
		let pk_accountagiotage = this.props.getUrlParam('id');
		let id = getCurrentLastId(this.cacheDataSource);
		let addid;
		if(this.state.addid){
			addid = this.state.addid;
		}else{
			addid = this.props.getUrlParam('addid');
		}
		//动态修改地址栏中的status的值
		this.props.setUrlParam({
			status: 'browse'
		});
		if(pk_accountagiotage){
			//动态修改地址栏中的status的值
			this.props.setUrlParam({
				id: pk_accountagiotage
			});
			this.browseRender(pk_accountagiotage);
		}else{
			if(id){
				//动态修改地址栏中的status的值
				this.props.setUrlParam({
					id: id
				});
				this.browseRender(id);
			}else{
				if(addid){
					//动态修改地址栏中的status的值
					this.props.setUrlParam({
						id: addid
					});
					this.browseRender(addid)
				}else{
					this.emptyData();
				}
			}
		}
	};

	// 取消弹框取消按钮操作
	cancelModalCancel = () => {

	};
	
	// 返回方法
	backClick = () =>{
		// window.onbeforeunload = null;
		// this.props.pushTo(constant.listpath,{
		// 	resource:'card'
		// });
		window.onbeforeunload = null;
		this.props.pushTo(constant.listpath,{
			pagecode: constant.lpagecode,
		});
	}

	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}
	// 根据单据来源显示返回按钮
	judgeBillSource = (linksce) => {
		if (linksce) {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				// showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
		} else {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				// showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
		}
	};
	render() {
		let linksce = this.props.getUrlParam('scene');
		let { form, cardPagination } = this.props;
		let { createForm } = form;
		const { createCardPagination } = cardPagination;
		let { showUploader, target, billno, billId } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true,
			showBillCode: true,
			billCode: billno || billId
		});
		this.judgeBillSource(linksce);
		return (
			<div className="nc-bill-card">
			{/* <div className="nc-bill-top-area"> */}
				 {/**创建websocket */}
				 {createCardWebSocket(this.props, {
                    headBtnAreaCode: 'card_head',
                    formAreaCode: constant.formcode2,
                    billpkname: constant.pkname,
                    billtype: constant.billtype,
					// serverLocation: '10.16.2.231:9991'
					dataSource:constant.cacheDataSource
                })}
				<NCAffix>
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
					<div>
						{createBillHeadInfo({
							title: this.state.json['36070AB-000019'],
							billCode: this.state.billno, //单据号
							backBtnClick: () => {           //返回按钮的点击事件
								this.backClick();
							}
						})}
					</div>
					
					<div className="header-button-area">
					{this.props.button.createErrorFlag({
                         headBtnAreaCode: 'card_head'
                                })}
						{this.props.button.createButtonApp({
							area: 'card_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this)
							// popContainer: document.querySelector('.header-button-area')
						})}
					</div>
					{/* 附件 */}
					<div className="nc-faith-demo-div2">
						{/* 这里是附件上传组件的使用，需要传入三个参数 */}
						{showUploader && <NCUploader
								billId={billId}
								target={target}
								placement={'bottom'}
								billNo={billno}
								onHide={this.onHideUploader} // 关闭功能
								/>
						}
					</div>
					<div className="header-cardPagination-area" style={{ float: 'right' }}>
						{createCardPagination({
							handlePageInfoChange: pageInfoClick.bind(this),
							dataSource: this.cacheDataSource
						})}
					</div>
				</NCDiv>
				</NCAffix>
				{/* 设置卡片展开于隐藏 默认隐藏 */}
				<div className="nc-bill-form-area">
					{createForm(this.formId2, {
						// expandArr: [ this.formId, constant.formcode2 ],
						// onAfterEvent: afterEvent.bind(this)
					})}
				</div>
			</div>
		);
	}
}

Card = createPage({
	billinfo:{
        billtype: 'form',
        pagecode: constant.cpagecode2,
        headcode: constant.formcode2
    },
	// initTemplate: initTemplate,
	// mutiLangCode: constant.mutiLangCode
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/