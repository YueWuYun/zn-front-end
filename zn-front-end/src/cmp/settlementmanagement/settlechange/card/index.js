/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, getMultiLang, ajax, base, toast, high, cardCache, createPageIcon } from 'nc-lightapp-front';
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import { constant,requesturl } from '../config/config';
import { buttonVisible } from './events/buttonVisible';
import { commondata } from '../../../public/utils/constant';
import { sourceModel_CMP, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from'../../../public/utils/constant';
import PayBuluForm from'../../../../obm/ebankbulu/bulu/form/index';
import NCCOriginalBalance from'../../../public/restmoney/list/index';
import { orgVersionUtil } from '../config/orgVersionUtil';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
let { NCFormControl, NCBackBtn, NCAffix, NCDiv } = base;
const { NCUploader, PrintOutput, ApprovalTrans } = high;
let { getCacheById, updateCache, addCache, getCurrentLastId,getNextId, deleteCacheById } = cardCache;
class Card extends Component {
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pageId = constant.cpagecode;
		this.tableId = constant.ctablecode;
		this.formId = constant.formcode1;
		this.cacheDataSource = constant.cacheDataSource;
		this.billpk = constant.pk_settlechange;
		this.state = {
			billId:'', //单据id
			billno: '', // 单据编号
			showUploader: false,
			target: null,
			outputData: '', // 输出数据赋值
			addid: '',
			showOriginal:false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData:[], // 联查余额取数据，将需要联查的数据赋值给我
			showNCbackBtn: true,
			compositedata: null, // 指派数据
			compositedisplay: null, // 指派弹框是否弹框
			showBuLu: false, //设置显示补录模态框显隐性
			onLineData: [],
			moduleType: 'CMP',
			modelType: SHOWMODEL_BULU,
			json: {}, // 多语
			inlt: null
		};
		// initTemplate.call(this, props);
	}

	//浏览器页签关闭提示
	componentWillMount() {

		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			// 将多语资源存储到页面级缓存中
			saveMultiLangRes(this.props,json);
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				// console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
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
				return '';
			}
		}
	}

	componentDidMount() {
		this.toggleShow();
		this.renderHtmlByStatus();
	}

	//切换页面状态
	toggleShow = () => {
		buttonVisible(this.props,null);
	};

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
		let urlstatus = this.props.getUrlParam('status');
		let src = this.props.getUrlParam('src');

		let editdata,editurl
		if(pk){
			editdata = { pk: pk, pageCode: this.pageId };
			editurl = requesturl.querycard;
		}
		let adddata,addurl

		let pk_detail = this.props.getUrlParam('pk_detail');
		let srcid = this.props.getUrlParam('srcid');
		if(src){
			if(srcid){
				let pks = [];
				let tss = [];
				let pktsmap = {};
				pks.push(srcid);
				adddata = {
					pks: pks,
					tss: tss,
					pktsmap:pktsmap,
					pk_detail: pk_detail,
					pagecode: this.pageId
				};
				addurl = requesturl.querycardbysettle;
			}
		}

		let statusflag = urlstatus === 'browse' ? false : true;
		if(statusflag){
			// this.setState({ showNCbackBtn: false});
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				// showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				// billCode: vbillno
			});
			buttonVisible(this.props, null);
			//设置卡片翻页的显隐性
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
		}

		//查询单据详情
		if (urlstatus === 'browse') {
			if(pk){
				this.browseRender(pk);
			}
		}

		// 单据新增
		if(urlstatus === 'add'){
			ajax({
				url: addurl, 
				data: adddata,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
							this.props.form.setFormItemsDisabled(this.formId,{'pk_org': true});
						}
						orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					}
				}
			});
		}

		// 单据编辑
		if (urlstatus === 'edit') {
			ajax({
				url: editurl, 
				data: editdata,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
							let billno = res.data[this.formId].rows[0].values.vbillno.value;
							this.props.form.setFormItemsDisabled(this.formId,{'pk_org': true});
							// this.setState({ billno: ':'+billno });
							this.props.BillHeadInfo.setBillHeadInfoVisible({
								showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
								showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
								billCode: billno
							});
						}
						orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					}
				}
			});
		}
	}

	// 浏览态数据渲染
	browseRender = (billid) =>{
		let cardData,billstatus,vbillno,pk_settlechange
		if(billid){
			cardData = getCacheById(billid, this.cacheDataSource);
			let queryData =  { pk: billid, pageCode: this.pageId };
			if(cardData){
				this.props.form.setAllFormValue({ [this.formId]: cardData[this.formId] });
				vbillno = cardData[this.formId].rows[0].values.vbillno.value;
				pk_settlechange = cardData[this.formId].rows[0].values[this.billpk].value;
				billstatus = cardData[this.formId].rows[0].values.busistatus.value;
				buttonVisible(this.props, billstatus);
				this.props.form.setFormStatus(this.formId, 'browse');
				this.setState({ 
					// billno: ':'+vbillno,
					addid: pk_settlechange,
					// showNCbackBtn: true
					});
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: vbillno
				});
				orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
			}else{
				ajax({
					url: requesturl.querycard,
					data: queryData,
					async: false,
					success: (res) => {
						if (res) {
							if (res.data) {
								this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
								vbillno = res.data[this.formId].rows[0].values.vbillno.value;
								pk_settlechange = res.data[this.formId].rows[0].values[this.billpk].value;
								billstatus = res.data[this.formId].rows[0].values.busistatus.value;
								this.setState({ 
									// billno: ':'+vbillno,
									addid: pk_settlechange,
									// showNCbackBtn: true
								});
								this.props.BillHeadInfo.setBillHeadInfoVisible({
									showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
									showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
									billCode: vbillno
								});
								this.props.form.setFormStatus(this.formId, 'browse');
								buttonVisible(this.props, billstatus);
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
		//设置卡片翻页的显隐性
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
	}

	emptyData = () =>{
		this.props.form.EmptyAllFormValue(this.formId);
		this.props.setUrlParam({
			status: 'browse',
			billsta: null,
			id: null
		});

		buttonVisible(this.props, null);
		this.setState({ 
			billno: null,
			addid: null,
			// showNCbackBtn: true
		});
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
			// billCode: vbillno
		});
		//设置卡片翻页的显隐性
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
	}

	// 按钮点击后渲染数据
	buttonAfter(billdata){
		
		let billno = billdata[this.formId].rows[0].values.vbillno.value;
		let id = billdata[this.formId].rows[0].values.pk_settlechange.value;
		let busistatus = billdata[this.formId].rows[0].values.busistatus.value;

		// 更新缓存
		updateCache(this.billpk, id, billdata, this.formId, this.cacheDataSource, billdata[this.formId].rows[0].values);

		// this.setState({
		// 	billno: ':'+billno,
		// 	showNCbackBtn: true
		// });
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: billno
		});
		//动态修改地址栏中的id的值
		this.props.setUrlParam({
			status: 'browse',
			id: id,
			billstatus: busistatus
		});
		this.props.form.setAllFormValue({
			[this.formId]: billdata[this.formId]
		});
		this.props.form.setFormStatus(this.formId, 'browse');
		buttonVisible(this.props,busistatus);
	}


	//删除单据
	delConfirm = () => {

		let pksArr = [];
		let pktsmap = {};
		//处理选择数据
		let pk = this.props.form.getFormItemsValue(this.formId, 'pk_settlechange').value;
		let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
		pksArr.push(pk); //主键数组
		pktsmap[pk] = ts;

		//自定义请求数据
		let deldata = {
			pageCode: constant.lpagecode,
			pktsmap: pktsmap,
			pks: pksArr
		};

		ajax({
			url: requesturl.delete,
			data: deldata,
			success: (res) => {
				let {data, success} = res
					if(success){
						if(data){
							if(data.failMsg.length > 0){
								toast({
									color: 'danger',
									content: data.failMsg[0]/* 国际化处理： 删除成功*/
								});
							}else{
								toast({
									color: 'success',
									content: this.state.json['36070CPI-000004']/* 国际化处理： 删除成功*/
								});
								let nextId = getNextId(pk, this.cacheDataSource);
								deleteCacheById(this.billpk, pk, this.cacheDataSource);
								this.props.setUrlParam(nextId);
								this.browseRender(nextId);
							}
						}
					}
			}
		});
	};

	//保存单据
	saveBill = () => {
		if (this.props.getUrlParam('copyFlag') === 'copy') {
			this.props.form.setFormItemsValue(this.formId, { crevecontid: null });
			this.props.form.setFormItemsValue(this.formId, { ts: null });
		}

		let CardData = this.props.createMasterChildData('20521030', this.formId, this.tableId);
		let url = requesturl.save; //新增保存
		// if (this.props.getUrlParam('status') === 'edit') {
		// 	url = '/nccloud/cmp/cash/cashdrawupdate.do'; //修改保存
		// }
		ajax({
			url: url,
			data: CardData,
			success: (res) => {
				let crevecontid = null;
				if (res.success) {
					if (res.data) {
						toast({ color: 'success', content: this.state.json['36070CPI-000000'] });/* 国际化处理： 保存成功*/
						if (res.data.head && res.data.head[this.formId]) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							crevecontid = res.data.head[this.formId].rows[0].values.crevecontid.value;
						}
					}
				}
				this.props.pushTo(constant.cardpath, {
					pagecode: constant.cpagecode,
					status: 'browse',
					id: crevecontid
				});
				this.toggleShow();
			}
		});
		// }
	};

	cancelModalBeSure = () => {

		let pk_settlechange = this.props.getUrlParam('id');
		let addid
		if(this.state.addid){
			addid = this.state.addid;
		}else{
			addid = this.props.getUrlParam('addid');
		}
		let id = getCurrentLastId(this.cacheDataSource);
		//动态修改地址栏中的status的值
		this.props.setUrlParam({
			status: 'browse'
		});
		if(pk_settlechange){
			this.browseRender(pk_settlechange);
		}else{
			if(id){
				this.browseRender(id);
			}else{
				if(addid){
					this.browseRender(addid)
				}else{
					this.emptyData();
				}
			}
		}
	};

	cancelModalCancel = () => {
		// console.log("修改之前的财务组织",this.state.oldorg);
		// this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value:this.state.oldorg, display: this.state.oldorgDis } });
		// this.props.form.setFormStatus(this.formId, 'edit');
	};

	// 返回方法
	backClick = () =>{
		window.onbeforeunload = null;
		this.props.pushTo(constant.listpath,{pagecode: constant.lpagecode});
	}

	// 提交即指派
	getAssginUsedr = (value) => {
		
		let pktsmap = {};
		//处理选择数据
	
		let pk = this.props.form.getFormItemsValue(this.formId, 'pk_settlechange').value;
		let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
		pktsmap[pk] = ts;
		const billid = this.billpk;
		const cardpath = constant.cardpath;

		//自定义请求数据
		let data = {
			pageCode: this.pageId,
			pktsmap: pktsmap,
			pk: pk,
			ts: ts,
			userObj:value
		};

		ajax({
			url: requesturl.commitcard,
			data: data,
			success:  (res) => {
				let { success, data } = res;
				if (success) {
					toast({
						color: 'success',
						content: this.state.json['36070CPI-000001'] /* 国际化处理： 提交成功*/
					});
					let form = data.form;
					let id = form[constant.formcode1].rows[0].values[billid].value
					//加载数据
                    this.props.form.setAllFormValue({ [this.formId]: form[this.formId] });
					const status = this.props.getUrlParam('status');
					if (status === 'edit') {
						updateCache(billid, id, form, constant.formcode1, this.cacheDataSource, form[constant.formcode1].rows[0].values);
					}
				
					this.props.setUrlParam({
						status: 'browse',
						id: form[this.formId].rows[0].values.pk_settlechange.value,
						billstatus: form[this.formId].rows[0].values.busistatus.value
					});
					updateCache(billid, id, form, constant.formcode1, this.cacheDataSource, form[constant.formcode1].rows[0].values);
					this.toggleShow();
					this.renderHtmlByStatus();
					this.setState({
						compositedata: form,
						compositedisplay: false,
					});
				} else {
					this.props.table.setAllTableData(this.formId, { rows: [] });
				}
			}
		});
		
	}

	render() {
		let {  form, modal, cardPagination } = this.props;
		let { createForm } = form;
		const { createCardPagination } = cardPagination;
		let { showUploader, target,billno,billId } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
				{/* <div className="nc-bill-top-area"> */}
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							<div className="header-title-search-area">
									{createBillHeadInfo({
										title: this.state.json['36070CPI-000013'],  ///* 国际化处理： 单位支付信息变更*/
										billCode: this.state.billno,//单据号
										backBtnClick: () => { //返回按钮的点击事件
											this.backClick();
										}
									})}
							</div>
						</div>
						<div className="header-button-area">
							{this.props.button.createButtonApp({
								area: 'card_head',
								buttonLimit: 7,
								onButtonClick: buttonClick.bind(this),
								// popContainer: document.querySelector('.header-button-area')
							})}
						</div>

						{/* 网银补录div */}
						<PayBuluForm showmodal={this.state.showBuLu} modal={modal} 
						//输入参数： 
							onLineData={this.state.onLineData} 
							modelType={this.state.modelType}
							moduleType={this.state.moduleType}
							//点击确定按钮的回调函数
							onSureClick={(retPayMsg)=>{ 
							//处理补录信息(输出参数：PaymentRetMsg[])
							// this.processRetMsg(retPayMsg);
							//关闭对话框
							this.setState({
								showBuLu : false
								})              
							}} 
							//点击关闭按钮的回调函数
							onCloseClick={()=>{
							//关闭对话框
								this.setState({
									showBuLu : false
								})
							}}>
						</PayBuluForm>

						<div className="header-cardPagination-area" style={{ float: 'right' }}>
							{createCardPagination({
								handlePageInfoChange: pageInfoClick.bind(this),
								dataSource: this.cacheDataSource
							})}
						</div>
						<div className="nc-faith-demo-div2">
							{/* 这里是附件上传组件的使用，需要传入三个参数 */}
							{showUploader && <NCUploader
									billId={billId}
									target={target}
									placement={'bottom'}
									billNo={billno}
									onHide={() => {
										this.setState({
											showUploader: false
										})
									}} // 关闭功能
									/>
								}
						</div>
					</NCDiv>
				</NCAffix>
				<div className="nc-bill-form-area">
					{createForm(this.formId, {
						expandArr: [ constant.formcode1, constant.formcode2, constant.formcode3],
						onAfterEvent: afterEvent.bind(this)
					})}
				{/* </div> */}
				</div>
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url= {requesturl.print}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>

				{/* 联查期初余额 */}
				<NCCOriginalBalance
                    // 补录框显示
                    showmodal={this.state.showOriginal}
                    showOriginalData = {this.state.showOriginalData}
                    // 点击确定按钮的回调函数
                    onSureClick={(retOriginalMsg) => {
                        //关闭对话框
                        this.setState({
                            showOriginal: false
                        })
                    }}
                    onCloseClick={() => {
                        //关闭对话框
                        this.setState({
                            showOriginal: false
                        })
                    }}
                >
                </NCCOriginalBalance>

				{this.state.compositedisplay ? <ApprovalTrans
                    title={this.state.json['36070CPI-000027']}
                    data={this.state.compositedata}
                    display={this.state.compositedisplay}
                    getResult={this.getAssginUsedr.bind(this)}
                    cancel={() => {
                        //关闭对话框
                        this.setState({
							compositedata: null,
							compositedisplay: false,
						});
                    }}
                /> : ""}

			</div>
		);
	}
}

Card = createPage({
	billinfo:{
        billtype: 'form',
        pagecode: constant.cpagecode,
        headcode: constant.formcode1
    },
	// initTemplate: initTemplate,
	// mutiLangCode: constant.mutiLangCode
})(Card);

// ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/