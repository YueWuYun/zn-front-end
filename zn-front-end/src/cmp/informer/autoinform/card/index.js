/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
﻿//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, getMultiLang, getBusinessInfo, getContext, cardCache, promptBox, createPageIcon } from 'nc-lightapp-front';
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import { constant, requesturl } from '../config/config';
import { buttonVisible } from './events/buttonVisible';
import { orgVersionUtil } from '../config/orgVersionUtil';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
import { orgChangeAfterEvent } from './events/afterEvent';
let { NCFormControl, NCBackBtn, NCAffix } = base;
let { getCacheById, updateCache, addCache, getDefData, getCurrentLastId, getCurrentId, getNextId, deleteCacheById } = cardCache;
const { NCDiv } = base;
const { NCUploader, ApproveDetail, PrintOutput, ApprovalTrans } = high;
import NCCOriginalBalance from '../../../public/restmoney/list/index';
class Card extends Component {
	constructor(props) {
		super(props);
		this.pageId = constant.cpagecode;
		// this.tableId = constant.ctablecode;
		this.searchId = constant.searchcode;
		this.formId = constant.formcode1;
		this.moduleId = constant.mutiLangCode;
		this.cacheDataSource = constant.cacheDataSource;
		this.pkname = constant.pkname;
		this.state = {
			billId: '',//单据id
			billno: '',// 单据编号
			oldorg: '', // 切换组织前组织
			oldorgDis: '', // 切换组织前组织显示
			showUploader: false, // 附件弹框显示
			target: null, //
			approveshow: false, // 提交指派
			addid: '',
			outputData: '', // 输出数据
			showOriginal: false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData: [], // 联查余额取数据，将需要联查的数据赋值给我
			showNCbackBtn: true, // 返回按钮是否显示
			compositedata: null, // 指派数据
			compositedisplay: null, // 指派弹框是否弹框
			json: {}, // 多语
			inlt: null
		};
	}

	//浏览器页签关闭提示
	componentWillMount() {

		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			// 将多语资源存储到页面级缓存中
			saveMultiLangRes(this.props, json);
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({ json, inlt })       // 保存json和inlt到页面state中并刷新页面
			}
			// else {//试试
			// 	// console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			// }
		}
		getMultiLang({ moduleId: '36070AGR', domainName: 'cmp', callback });

		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				return '';
			}
		}
	}

	componentDidMount() {
		this.renderHtmlByStatus();
	}

	//初始化财务组织[新增其他字段不可编辑，有值其他可以编辑]
	initBillByPKorg = () => {
		let status = this.props.getUrlParam('status');
		//组织之外的字段不可以编辑
		if (status === 'add') {
			this.props.resMetaAfterPkorgEdit();
			this.props.initMetaByPkorg();//此方法不可以调用2次，不然rest失败
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });//财务组织
			this.props.form.EmptyAllFormValue(this.formId);
		}

		if (status === 'edit') {
			this.props.resMetaAfterPkorgEdit();
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });
		}
	}

	// 根据不同的状态渲染不同的页面数据
	renderHtmlByStatus = () => {
		this.initBillByPKorg();
		let flag = false;
		let pk = this.props.getUrlParam('id');
		let editdata = { pk: pk, pageCode: this.pageId };
		let urlstatus = this.props.getUrlParam('status');

		if (!urlstatus) {//设置默认值 默认浏览态
			urlstatus = 'browse';
			this.props.setUrlParam({ status: 'browse' });
		}

		this.props.form.setFormStatus(this.formId, urlstatus);//渲染卡片状态
		this.props.cardTable.setStatus(this.tableId, urlstatus);

		orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
		let statusflag = urlstatus === 'browse' ? false : true;//browse态时为false


		if (statusflag) {//非browse态公共操作
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			});
			buttonVisible.call(this, this.props, null);
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);//设置卡片翻页的显隐性
		}

		if (urlstatus === 'add') {// 新增态
			let context = getDefData('context', this.dataSource);
			if (context && context.pk_org) {
				this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value: context.pk_org ? context.pk_org : null, display: context.org_Name ? context.org_Name : null } });
				this.props.form.setFormItemsDisabled(this.formId, { 'oppbankacc': true });//对方账号不可编辑
				orgChangeAfterEvent.call(this, this.props);
			}
		}

		if (urlstatus === 'edit') {// 编辑态
			ajax({
				url: requesturl.querycard,
				data: editdata,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });//渲染数据到页面						
							this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });//设置pk_org不可更改
							this.props.BillHeadInfo.setBillHeadInfoVisible({
								showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
							});
						}
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					}
					// orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
				}
			});
		}

		if (urlstatus === 'browse') {//浏览态
			if (pk) {
				this.browseRender(pk);
			} else {
				buttonVisible.call(this, this.props, null);
				this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
			}
		}
	}

	// 按钮点击后渲染数据
	buttonAfter(billdata) {
		let status = this.props.getUrlParam('status');
		let id = null;
		let state = 0;
		if (billdata[this.formId]) {
			this.props.form.setAllFormValue({ [this.formId]: billdata[this.formId] });
			id = billdata[this.formId].rows[0].values.pk_autoinform.value;
			state = billdata[this.formId].rows[0].values.state.value;
			if (status === 'add' || status === 'copy') {
				addCache(id, billdata, this.formId, this.cacheDataSource, billdata[this.formId].rows[0].values);//新增缓存
			} else {
				updateCache(this.pkname, id, billdata, this.formId, this.cacheDataSource, billdata[this.formId].rows[0].values);//修改之后更新缓存
			}

		} else {
			this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
		}


		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
		});

		//动态修改地址栏中的id的值
		this.props.setUrlParam({
			status: 'browse',
			id: id
		});

		this.props.form.setFormStatus(this.formId, 'browse');
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);//翻页按钮显示
		buttonVisible.call(this, this.props, state);//按钮显隐性
	}

	//删除单据
	delConfirm = () => {

		let pks;
		let pktsmap = {};
		//处理选择数据
		let pk = this.props.form.getFormItemsValue(this.formId, this.pkname).value;
		let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
		//pksArr.push(pk); //主键数组
		pks = pk;
		pktsmap[pk] = ts;

		//自定义请求数据
		let deldata = {
			pageCode: constant.lpagecode,
			pktsmap: pktsmap,
			pk: pks
		};
		ajax({
			url: requesturl.delete,
			data: deldata,
			success: (res) => {
				let { data, success } = res
				if (success) {
					if (data) {
						toast({
							color: 'success',
							content: this.state.json['36070AGR-000007']/* 国际化处理： 删除成功*/
						});
						let nextId = getNextId(pk, this.cacheDataSource);
						deleteCacheById(this.pkname, pk, this.cacheDataSource);
						this.props.setUrlParam({ id: nextId });
						this.browseRender(nextId);
					}
				}
			}
		});
	};


	//启用
	startConfirm = () => {
		let pkvalue;
		let pktsmap = {};
		//处理选择数据
		let pk = this.props.form.getFormItemsValue(this.formId, this.pkname).value;
		let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;

		pkvalue = pk;
		pktsmap[pk] = ts;//map类型变量

		//自定义请求数据
		let enabledata = {
			pageCode: constant.lpagecode,
			pktsmap: pktsmap,
			pk: pkvalue
		};
		ajax({
			url: requesturl.enable,
			data: enabledata,
			success: (res) => {
				let { data, success } = res
				if (success) {
					if (data) {
						toast({
							color: 'success',
							content: this.state.json['36070AGR-000053']/* 国际化处理： 启用成功*/
						});
						updateCache(this.pkname, pk, res.data, this.formId, this.cacheDataSource);//更新缓存
						this.renderHtmlByStatus();
					}
				}
			}
		});
	}


	//停用
	stopConfirm = () => {
		let pkvalue;
		let pktsmap = {};
		//处理选择数据
		let pk = this.props.form.getFormItemsValue(this.formId, this.pkname).value;
		let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;

		pkvalue = pk;
		pktsmap[pk] = ts;//map类型变量

		//自定义请求数据
		let enabledata = {
			pageCode: constant.lpagecode,
			pktsmap: pktsmap,
			pk: pkvalue
		};
		ajax({
			url: requesturl.unenable,
			data: enabledata,
			success: (res) => {
				let { data, success } = res
				if (success) {
					if (data) {
						toast({
							color: 'success',
							content: this.state.json['36070AGR-000056']/* 国际化处理： 停用成功*/
						});
						updateCache(this.pkname, pk, res.data, this.formId, this.cacheDataSource);//更新缓存
						this.renderHtmlByStatus();
					}
				}
			}
		});
	}

	cancelBtnClick = () => {
		this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value: this.state.oldorg, display: this.state.oldorgDis } });
		this.props.form.setFormStatus(this.formId, 'edit');
	};

	// // 更改组织清空输入数据
	// orgchangecleandata = () => {
	// 	// this.props.form.setFormItemsValue(this.formId, { 'pk_bankaccount': { display: null, value: null } });
	// 	// this.props.form.setFormItemsValue(this.formId, { 'money': { display: null, value: null } });
	// 	// this.props.form.setFormItemsValue(this.formId, { 'olcmoney': { display: null, value: null } });
	// 	// this.props.form.setFormItemsValue(this.formId, { 'pk_balatype': { display: null, value: null } });
	// 	// this.props.form.setFormItemsValue(this.formId, { 'brief': { display: null, value: null } });
	// }

	// 清空组织，清空其他数据
	// emptyOrgCleanData = () => {//改
	// 	this.props.form.setFormItemsValue(this.formId, { 'state': { display: null, value: null } });
	// 	this.props.form.setFormItemsValue(this.formId, { 'pk_bankacc': { display: null, value: null } });
	// 	this.props.form.setFormItemsValue(this.formId, { 'billtypeobj': { display: null, value: null } });
	// 	this.props.form.setFormItemsValue(this.formId, { 'oppunitname': { display: null, value: null } });
	// 	this.props.form.setFormItemsValue(this.formId, { 'oppbankacc': { display: null, value: null } });
	// 	this.props.form.setFormItemsValue(this.formId, { 'memocondition': { display: null, value: null } });
	// 	this.props.form.setFormItemsValue(this.formId, { 'memocontent': { display: null, value: null } });
	// 	this.props.form.setFormItemsValue(this.formId, { 'billtype': { display: null, value: null } });
	// 	this.props.form.setFormItemsValue(this.formId, { 'billtransactype': { display: null, value: null } });
	// 	this.props.form.setFormItemsValue(this.formId, { 'planproject': { display: null, value: null } });
	// 	this.props.form.setFormItemsValue(this.formId, { 'collectionagree': { display: null, value: null } });
	// 	this.props.form.setFormItemsValue(this.formId, { 'department': { display: null, value: null } });
	// 	this.props.form.setFormItemsValue(this.formId, { 'staff': { display: null, value: null } });
	// 	this.props.form.setFormItemsValue(this.formId, { 'billdate': { display: null, value: null } });
	// 	this.props.form.setFormItemsValue(this.formId, { 'settledate': { display: null, value: null } });
	// 	this.props.form.setFormItemsValue(this.formId, { 'effectdate': { display: null, value: null } });
	// 	//this.props.form.setFormItemsValue(this.formId, { 'state': { display: null, value: null } });
	// 	//this.props.form.setFormItemsValue(this.formId, { 'department': { display: null, value: null } });

	// 	//this.orgchangecleandata();
	// }

	// 浏览态数据渲染
	browseRender = (billid) => {
		let cardData, pk_autoinform, state
		if (billid) {
			cardData = getCacheById(billid, this.cacheDataSource);
			let queryData = { pk: billid, pageCode: this.pageId };

			if (cardData) {//有缓存时从缓存中取数据来渲染
				this.props.form.setAllFormValue({ [this.formId]: cardData[this.formId] });
				pk_autoinform = cardData[this.formId].rows[0].values[this.pkname].value;
				state = cardData[this.formId].rows[0].values.state.value;

				buttonVisible.call(this, this.props, state);
				this.props.form.setFormStatus(this.formId, 'browse');
				this.setState({
					addid: pk_autoinform,
				});
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				});
				orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
				this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);//翻页按钮显示
			} else {
				ajax({
					url: requesturl.querycard,
					data: queryData,
					success: (res) => {
						if (res) {
							if (res.data) {
								this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
								pk_autoinform = res.data[this.formId].rows[0].values[this.pkname].value;
								state = res.data[this.formId].rows[0].values.state.value;
								this.setState({
									addid: pk_autoinform,
								});
								this.props.BillHeadInfo.setBillHeadInfoVisible({
									showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
									showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
								});
								buttonVisible.call(this, this.props, state);
								this.props.form.setFormStatus(this.formId, 'browse');
								updateCache(this.pkname, billid, res.data, this.formId, this.cacheDataSource);//更新缓存
								this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);//翻页按钮显示
							} else {//没查询到数据时清空
								this.emptyData();
							}
						} else {
							this.emptyData();
						}
						orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
					}
				});
			}
		} else {
			this.emptyData();
		}	
	}

	// 清空数据
	emptyData = () => {
		this.props.form.EmptyAllFormValue(this.formId);
		this.props.setUrlParam({
			status: 'browse',
			id: null
		});
		buttonVisible.call(this, this.props, null);
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
		});
		//设置卡片翻页的显隐性
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
		// this.renderHtmlByStatus();
	}

	// 取消弹框确定按钮操作
	cancelModalBeSure = () => {
		let pk_autoinform = this.props.getUrlParam('id');
		let addid = this.props.getUrlParam('addid');

		let lastid = getCurrentLastId(this.cacheDataSource);

		if (pk_autoinform) {//修改edit取消情况
			//动态修改地址栏中的status的值
			this.props.setUrlParam({
				status: 'browse',
				id: pk_autoinform
			});
			this.browseRender(pk_autoinform);
		} else {
			if (addid) {
				//动态修改地址栏中的status的值
				this.props.setUrlParam({
					status: 'browse',
					id: addid
				});
				this.browseRender(addid);
			} else {
				if (lastid) {
					//动态修改地址栏中的status的值
					this.props.setUrlParam({
						status: 'browse',
						id: lastid
					});
					this.browseRender(lastid)
				} else {
					this.emptyData();
					this.renderHtmlByStatus();
				}
			}
		}
	};

	// 取消弹框取消按钮操作
	cancelModalCancel = () => {

	};

	// 返回方法
	backClick = () => {
		window.onbeforeunload = null;
		this.props.pushTo(constant.listpath);
	}


	componentDidUpdate() {//render之后调用这个，以更改按钮状态
		if (document.querySelector("button[fieldid=addBtn_btn]")) {
			buttonVisible.call(this, this.props);
		}
	}

	render() {
		let { form, cardPagination } = this.props;
		let { createForm } = form;
		const { createCardPagination } = cardPagination;
		let { showUploader, target, billno, billId } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
				{/* <div className="nc-bill-top-area"> */}
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">

							{createBillHeadInfo({
								title: this.state.json['36070AGR-000018'],  ///* 国际化处理： 现金缴存*/
								billCode: this.state.billno,//单据号
								backBtnClick: () => { //返回按钮的点击事件
									this.backClick();
								}
							})}
						</div>

						<div className="header-button-area">
							{this.props.button.createButtonApp({
								area: 'card_head',
								buttonLimit: 7,
								onButtonClick: buttonClick.bind(this),
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
								onHide={() => {
									this.setState({
										showUploader: false
									})
								}} // 关闭功能
							/>
							}
						</div>
						{/* 左右切换数据 */}
						<div className="header-cardPagination-area" style={{ float: 'right' }}>
							{createCardPagination({
								handlePageInfoChange: pageInfoClick.bind(this),
								dataSource: this.cacheDataSource
							})}
						</div>
					</NCDiv>
				</NCAffix>
				{/* </div> */}
				{/* 设置卡片展开于隐藏 默认隐藏  */}
				<div className="nc-bill-form-area">
					{createForm(this.formId, {
						expandArr: [this.formId, constant.formcode2],
						onAfterEvent: afterEvent.bind(this)
					})}
				</div>

				{/* 联查审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.approveshow}
						close={() => {
							this.setState({
								approveshow: false
							})
						}}
						billtype={constant.billtype}
						billid={billId}
					/>
				</div>

				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url={requesturl.print}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>

				{/* 联查期初余额 */}
				<NCCOriginalBalance
					// 补录框显示
					showmodal={this.state.showOriginal}
					showOriginalData={this.state.showOriginalData}
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
					title={this.state.json['36070DC-000052']}
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
	billinfo: {
		billtype: 'form',
		pagecode: constant.cpagecode,
		headcode: constant.formcode1
	},
	// mutiLangCode: constant.mutiLangCode
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/