/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表卡片
import React, { Component } from 'react';
import { createPage, ajax, base, toast, high, cardCache } from 'nc-lightapp-front';
import { jsondata } from "./jsondata";
import { Templatedata } from "../config/Templatedata";
import { buttonVisable } from "./events/buttonVisable";//按钮显隐性
import { orgVersionUtil } from "../util/orgVersionUtil";//多版本显示
import { formBeforeEvent } from '../../../public/CMPFormRefFilter.js';//单据控制规则[form编辑前事件]
import { bodyBeforeEvent } from '../../../public/CMPTableRefFilter.js';//单据控制规则[table编辑前事件]
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import { loadQueryData } from './indexUtil/loadQueryData.js';
const { NCUploader, ApproveDetail, BillTrack } = high;//附件相关联查审批意见
let { NCAnchor, NCScrollLink, NCScrollElement, NCAffix, NCBackBtn } = base;
let { updateCache, getNextId, deleteCacheById, addCache, setDefData, getDefData } = cardCache;
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = Templatedata.card_formid;
		this.searchId = Templatedata.list_searchid;
		this.moduleId = Templatedata.list_moduleid;
		this.tableId = Templatedata.card_tableid;
		this.pageId = Templatedata.card_pageid;
		this.dataSource = Templatedata.dataSource;//缓存相关
		this.key = Templatedata.key;//缓存相关
		this.pkname = Templatedata.pkname;//缓存相关
		this.tradeType = 'trade_type';//单据控制规则交易类型字段名称（也可传递的单据类型）
		this.formVOClassName = 'RecBillVO';//form表单的vo类名
		this.tableVOClassName = 'RecBillDetailVO';//table表体的vo类名
		this.state = {
			showbilltrack: false,//联查单据
			showbilltrackpk: '',//联查单据pk
			showbilltracktype: '',//联查单据类型
			show: false,//审批意见是否显示
			billid: '',//审批意见单据pk
			billtype: '',//审批意见单据类型
			billno: '', // 单据编号
			billId: '',//单据pk
			showUploader: false,//控制附件弹出框
			showNCbackBtn: false,//返回按钮
			target: null,//控制弹出位置
			pasteflag: false,//表体中按钮的显隐性状态
			deleteId: ''
		};
		initTemplate.call(this, props);
	}
	componentDidMount() {
		this.refresh();
	}
	//浏览器页签关闭提示
	componentWillMount() {
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			console.log(status, 'onbeforeunload_status');
			if (status != 'browse') {
				return '当前单据未保存，您确认离开此页面？';
			}
		}
	}
	//加载数据刷新数据
	refresh = () => {
		this.toggleShow();//切换页面状态,查询要根据状态动态改变按钮显隐性的pk
		this.loadQueryData();
	}
	//加载查询数据
	loadQueryData = () => {
		loadQueryData.call(this);
	}
	//切换页面状态
	toggleShow = () => {
		console.log("buttons", this.props.button.getButtons());
		let status = this.props.getUrlParam('status');
		let billstatus = this.props.getUrlParam('billno');//获取单据状态
		this.props.cardTable.setStatus(this.tableId, 'edit');
		let flag = status === 'browse' ? false : true;
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		this.props.form.setFormStatus(this.formId, status);
		if (status == 'browse') {
			this.setState({
				showNCbackBtn: true
			})
			this.props.cardTable.setStatus(this.tableId, 'browse');
		} else {
			this.setState({
				showNCbackBtn: false
			})
			this.props.cardTable.setStatus(this.tableId, 'edit');
		}
		orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
		buttonVisable.call(this, this.props);//按钮显隐性

	};
	//卡片返回按钮
	handleClick = () => {
		//先跳转列表
		this.props.pushTo('/list');
	}
	/**
  	 * 跳转空白card页面
  	 */
	cancleSkyPage = () => {
		cancleSkyPage.call(this);
		this.props.form.EmptyAllFormValue(this.formId);
		this.props.cardTable.setTableData(this.tableId, { rows: [] });
		this.props.pushTo('/card', {
			status: 'browse',
			id: '',
			billno: '',
			pagecode: this.pageId
		})
		this.props.resMetaAfterPkorgEdit();
		this.toggleShow();//切换页面状态
	}
	//删除缓存
	deleteCacheData = () => {
		/**
		 * 调用删除缓存数据方法
		 * idname: 数据主键的命名
		 * id：数据主键的值
		 * dataSource: 缓存数据命名空间
		 */
		deleteCacheById(this.pkname, this.state.deleteId, this.dataSource);

	}
	//删除单据
	delConfirm = () => {
		let data = {
			'pk': this.props.getUrlParam('id'),
			'ts': this.props.form.getFormItemsValue(this.formId, 'ts').value
		};
		//删除后直接进入下一行
		let delpk = this.props.getUrlParam('id');
		if (delpk) {
			this.setState({
				deleteId: delpk
			});//删除单据pk
		}
		/**
		 * id：数据主键的值
		 * dataSource: 缓存数据命名空间
		 */
		let nextId = getNextId(delpk, this.dataSource);
		let that = this;
		ajax({
			url: '/nccloud/cmp/recbill/recbilldelete.do',
			data: data,
			success: (res) => {
				if (res.success) {
					toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000031') });/* 国际化处理： 删除成功*/
					this.deleteCacheData();//删除缓存
					if (nextId != null) {
						pageInfoClick.call(that, that.props, nextId);
					} else {
						this.cancleSkyPage();//跳转空白页面
					}
				}
			}
		});
	};
	//变更组织确认
	changeOrgConfirm = () => {
		//组织
		let pk_org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
		let pk_org_dly = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
		//恢复之前的值，设置edit状态
		this.props.form.cancel(this.formId);
		this.props.form.setFormStatus(this.formId, 'edit');
		//table清楚之前的状态
		this.props.cardTable.resetTableData(this.tableId);
		this.props.cardTable.setStatus(this.tableId, 'edit');
		let org_data = this.props.createHeadAfterEventData(this.pageId, this.formId, this.tableId, this.formId, 'pk_org', this.value);
		ajax({
			url: '/nccloud/cmp/recbill/recbillorgafterevent.do',
			data: org_data,
			success: (res) => {
				if (res.success) {
					if (res.data) {
						if (res.data.head) {
							//设置form的编辑属性

							this.props.resMetaAfterPkorgEdit();//选择主组织以后，恢复其他字段的编辑性
							//组织本币币种
							let currtype = res.data.head[this.formId].rows[0].values.pk_currtype.value;
							let currtypedly = res.data.head[this.formId].rows[0].values.pk_currtype.display;
							//页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
							// props.form.setAllFormValue({ [moduleId]: res.data.head[moduleId] });
							//查询获取的币种汇率
							let re_local_rate_form = res.data.head[this.formId].rows[0].values.local_rate.value;
							let re_local_money_from = res.data.head[this.formId].rows[0].values.local_money.value;

							if (pk_org_dly && pk_org_val) {
								this.props.form.setFormItemsValue(this.formId, { 'pk_org': { display: pk_org_dly, value: pk_org_val } });
							}

						}
						if (res.data.body) {
							this.props.cardTable.setStatus(this.tableId, 'edit');
						}
					}

				}
			}
		});

	}
	//取消确认按钮
	cancelConfirm = () => {
		//编辑中的取消操作
		if (this.props.getUrlParam('status') === 'edit') {
			let edit_pk = this.props.getUrlParam('id');
			let bill_no = this.props.form.getFormItemsValue(this.formId, 'bill_status').value;
			this.cancleNewPage(edit_pk, bill_no);
		}
	}
	//取消---跳转浏览态页面
	//@param url:请求的连接
	//@param pk:跳转数据pk
	//@param pagecode:请求的pageid
	//@param billno:请求的单据状态
	cancleNewPage = (pk, bill_no) => {
		this.props.pushTo('/card', {
			status: 'browse',
			id: pk,
			billno: bill_no,
			pagecode: this.pageId
		})
		this.refresh();
	}
	//保存单据
	saveBill = () => {
		if (this.props.getUrlParam('copyFlag') === 'copy') {
			this.props.form.setFormItemsValue(this.formId, { crevecontid: null });
			this.props.form.setFormItemsValue(this.formId, { ts: null });
		}
		let firstStatus = this.props.getUrlParam('status');
		//自定义校验table
		let checkTableNm = this.props.cardTable.getNumberOfRows(this.tableId);//表体table行数
		let isCheckTable;
		let totalPrimal = 0;//表体中收款原币金额总数
		for (let i = 0; i < checkTableNm; i++) {
			isCheckTable = this.props.cardTable.getValByKeyAndIndex(this.tableId, i, 'rec_primal');//收款原币金额
			if (isCheckTable && isCheckTable.value) {
				totalPrimal = parseFloat(totalPrimal) + parseFloat(isCheckTable.value);
				if (Math.abs(isCheckTable.value) != isCheckTable.value) {
					toast({ color: 'warning', content: '填写原币金额不能为负数!' });
					return;
				}
			} else {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000000') });/* 国际化处理： 收款金额未填写！*/
				return;
			}
		}
		let flag = this.props.form.isCheckNow(this.formId);
		let tableflag = this.props.cardTable.checkTableRequired(this.tableId);//table必输项校验

		if (flag && tableflag) {

			let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
			let url = '/nccloud/cmp/recbill/recbillsynconfirm.do'//保存协同单据--->未确认变成确认状态
			ajax({
				url: url,
				data: CardData,
				success: (res) => {
					let pk_paybill = null;
					if (res.success) {
						if (res.data) {
							toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000032') });/* 国际化处理： 确认保存成功*/
							if (res.data.head) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								let subbillno = res.data.head[this.formId].rows[0].values.bill_no.value;
								this.setState({
									billno: subbillno
								});
							}
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							let pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
							let billstatue = res.data.head[this.formId].rows[0].values.bill_status.value;
							let billnoNo = res.data.head[this.formId].rows[0].values.bill_no.value;
							this.props.setUrlParam({
								status: 'browse',
								id: pk_recbill,
								billno: billstatue,
								pagecode: this.pageId
							});
							this.toggleShow();//切换页面状态
							//增加缓存
							// addCacheId(this.formId, savepk);
							if (!firstStatus || firstStatus == 'add' || firstStatus == 'copy') {
								//新增缓存
								addCache(pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
							} else {
								//更新缓存
								updateCache(this.pkname, pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
							}
						}
					}

				}
			});
		}
	};
	//保存新增
	saveAddBill = () => {

		let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
		let sendurl = '/nccloud/cmp/recbill/recbillinsert.do'//新增保存新增
		if (this.props.getUrlParam('status') === 'edit') {
			sendurl = '/nccloud/cmp/recbill/recbillupdate.do'//修改保存提交
		}
		let checkTableNm = this.props.cardTable.getNumberOfRows(this.tableId);//表体table行数
		let isCheckTable;
		let totalPrimal = 0;//表体中收款原币金额总数
		for (let i = 0; i < checkTableNm; i++) {
			isCheckTable = this.props.cardTable.getValByKeyAndIndex(this.tableId, i, 'rec_primal');//收款原币金额
			if (isCheckTable && isCheckTable.value) {
				totalPrimal = parseFloat(totalPrimal) + parseFloat(isCheckTable.value);
				if (Math.abs(isCheckTable.value) != isCheckTable.value) {
					toast({ color: 'warning', content: '填写原币金额不能为负数!' });
					return;
				}
			} else {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000000') });/* 国际化处理： 收款金额未填写！*/
				return;
			}
		}
		let flag = this.props.form.isCheckNow(this.formId);
		let saveadd_tableflag = this.props.cardTable.checkTableRequired(this.tableId);//table必输项校验
		if (flag && saveadd_tableflag) {
			ajax({
				url: sendurl,
				data: CardData,
				success: (res) => {
					let pk_paybill = null;
					if (res.success) {
						if (res.data) {
							toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000001') });/* 国际化处理： 保存成功*/
							this.props.pushTo('/card', {
								status: 'add'
							})
							this.refresh();
						}
					}

				}
			});
		}

	}
	//保存提交
	saveSubBill = () => {
		let url = '/nccloud/cmp/recbill/recbillsynconfirmsubmit.do'//协同确认保存提交
		let savesubmitBtnData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
		let savesubmitBtnflag = this.props.form.isCheckNow(this.formId);
		let sb_tableflag = this.props.cardTable.checkTableRequired(this.tableId);//table必输项校验
		let saveSubStatus = this.props.getUrlParam('status');
		//自定义校验table
		let checkTableNm2 = this.props.cardTable.getNumberOfRows(this.tableId);//表体table行数
		let isCheckTable2;
		for (let i = 0; i < checkTableNm2; i++) {
			isCheckTable2 = props.cardTable.getValByKeyAndIndex(this.tableId, i, 'rec_primal');//收款原币金额
			if (isCheckTable2 && isCheckTable2.value) {
				if (Math.abs(isCheckTable2.value) != isCheckTable2.value) {
					toast({ color: 'warning', content: '填写原币金额不能为负数!' });
					return;
				}
			} else {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000000') });/* 国际化处理： 收款金额未填写！*/
				return;
			}
		}
		if (savesubmitBtnflag && sb_tableflag) {
			ajax({
				url: url,
				data: savesubmitBtnData,
				success: (res) => {
					let pk_paybill = null;
					if (res.success) {
						if (res.data) {
							toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000002') });/* 国际化处理： 保存提交成功*/
							let ssub_pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
							let ssub_billstatue = res.data.head[this.formId].rows[0].values.bill_status.value;
							//增加缓存
							if (!saveSubStatus || saveSubStatus == 'add' || saveSubStatus == 'copy') {
								//新增缓存
								addCache(ssub_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
							} else {
								//更新缓存
								updateCache(this.pkname, ssub_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
							}
							this.props.pushTo('/card', {
								status: 'browse',
								id: ssub_pk_recbill,
								billno: ssub_billstatue
							})
							this.refresh();
						}
					}

				}
			});
		}
	}
	//获得按钮名称
	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};
	//获取列表肩部信息,肩部按钮
	getTableHead = (buttons, tableId) => {
		let { createButton } = this.props.button;
		return (
			<div className="shoulder-definition-area">

				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(tableId, {
						iconArr: ['close', 'open', 'max'],
						maxDestAreaId: 'finance-fts-commissionpayment-card'
					})}
					{/* 应用注册按钮 */}
					{this.props.button.createButtonApp({
						area: Templatedata.card_body,
						buttonLimit: 3,
						onButtonClick: buttonClick.bind(this),
						popContainer: document.querySelector('.header-button-area')
					})}

				</div>
			</div>
		);
	};
	render() {
		let { cardTable, form, button, ncmodal, cardPagination, editTable } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createEditTable } = editTable;
		let { createButton, createButtonApp } = button;
		let { createModal } = ncmodal;
		let { showUploader, target, billno, billId, showNCbackBtn } = this.state;//附件相关内容变量
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAnchor>
						<NCScrollLink
							to='forminfo'
							spy={true}
							smooth={true}
							duration={300}
							offset={-100}
						>
							<p>
								{this.props.MutiInit.getIntl("36070RBMCP") &&
									this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000039')}
							</p>{/* 国际化处理： 表头信息*/}
						</NCScrollLink>
						<NCScrollLink
							to='businfo'
							spy={true}
							smooth={true}
							duration={300}
							offset={-100}
						>
							<p>
								{this.props.MutiInit.getIntl("36070RBMCP") &&
									this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000040')}
							</p>{/* 国际化处理： 表尾信息*/}
						</NCScrollLink>
					</NCAnchor>
					<NCAffix>
						<div className="nc-bill-header-area">
							<div className="header-title-search-area">
								<h2 className='title-search-detail'>
									{showNCbackBtn && <NCBackBtn onClick={this.handleClick}></NCBackBtn>}
									{this.props.MutiInit.getIntl("36070RBMCP") &&
										this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000041')}
									{this.state.billno}</h2></div>{/* 国际化处理： 收款结算协同确认*/}
							<div className="header-button-area">
								{/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
								{/* {createButtonApp("page_header", {onButtonClick: buttonClick.bind(this) })} */}
								{this.props.button.createButtonApp({
									area: Templatedata.card_head,
									buttonLimit: 10,
									onButtonClick: buttonClick.bind(this)
								})}

							</div>
							<div className='header-cardPagination-area' style={{ float: 'right' }}>
								{createCardPagination({
									dataSource: this.dataSource,
									handlePageInfoChange: pageInfoClick.bind(this)
								})}</div>
						</div>
					</NCAffix>
					<NCScrollElement name='forminfo'>
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								expandArr: [jsondata.form1],
								onAfterEvent: afterEvent.bind(this),
								onBeforeEvent: formBeforeEvent.bind(this)//form编辑前事件
							})}
						</div>
					</NCScrollElement>
				</div>
				<NCScrollElement name='businfo'>
					<div className="nc-bill-bottom-area">
						<div className="nc-bill-table-area">
							{/* {this.getTableHead(buttons, this.tableId)} */}
							{createCardTable(this.tableId, {
								tableHead: this.getTableHead.bind(this, buttons, this.tableId),
								modelSave: this.saveBill,
								onAfterEvent: afterEvent.bind(this),
								onBeforeEvent: bodyBeforeEvent.bind(this),//table编辑前事件
								showCheck: true
							})}
						</div>
					</div>
				</NCScrollElement>
				{createModal('delete', {
					// title: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000033'),/* 国际化处理： 删除确认*/
					// content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000034'),/* 国际化处理： 你确定要删除吗?*/
					// title: '删除确认',/* 国际化处理： 删除确认*/
					title: '你确定要删除吗?',/* 国际化处理： 你确定要删除吗?*/
					beSureBtnClick: this.delConfirm
				})}
				{createModal('cancel', {
					// title: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000035'),/* 国际化处理： 提示*/
					// content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000036'),/* 国际化处理： 确定要取消吗?*/
					// title: '提示',/* 国际化处理： 提示*/
					title: '确定要取消吗?',/* 国际化处理： 确定要取消吗?*/
					beSureBtnClick: this.cancelConfirm
				})}
				{createModal('changeorg', {
					// title: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000037'),/* 国际化处理： 确认修改*/
					// content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000038'),/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					// title: '确认修改',/* 国际化处理： 确认修改*/
					title: '是否修改组织，这样会清空您录入的信息?',/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					beSureBtnClick: this.changeOrgConfirm
				})}
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader &&
						<NCUploader
							billId={billId}
							target={target}
							placement={'bottom'}
							billNo={billno}
							onHide={
								() => {
									this.setState({
										showUploader: false
									})
								}
							}
						/>
					}
				</div>
				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.show}
						close={
							() => {
								this.setState({
									show: false
								})
							}
						}
						billtype={this.state.billtype}
						billid={this.state.billid}
					/>
				</div>
				{/* 联查单据 */}
				<div>
					<BillTrack
						show={this.state.showbilltrack}
						close={() => {
							this.setState({ showbilltrack: false })
						}}
						pk={this.state.showbilltrackpk}  //单据id
						type={this.state.showbilltracktype}  //单据类型
					/>
				</div>
			</div>
		);
	}
}

Card = createPage({
	mutiLangCode: Templatedata.list_moduleid,
	billinfo: {
		billtype: 'card',
		pagecode: Templatedata.card_pageid,
		headcode: Templatedata.card_formid,
		bodycode: Templatedata.card_tableid,
	}
})(Card);
export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/