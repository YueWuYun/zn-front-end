/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, cacheTools, high, getMultiLang } from 'nc-lightapp-front';
import { jsondata } from "./jsondata";
import { Templatedata } from "../config/Templatedata";
import { buttonClick, initTemplate, afterEvent } from './events';
import { formBeforeEvent } from '../../../public/CMPFormRefFilter.js';//单据控制规则[form编辑前事件]
import { bodyBeforeEvent } from '../../../public/CMPTableRefFilter.js';//单据控制规则[table编辑前事件]
import { orgVersionUtil } from "../util/orgVersionUtil";//多版本显示
import { setSourceFlag } from '../util/setSourceFlag.js';//设置来源
import { commonurl } from '../../../public/utils/constant';//附件改造使用
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
let { NCAffix } = base;
const { NCUploader } = high;//附件相关
const { ApproveDetail } = high;//审批详情相关
const { BillTrack, PrintOutput } = high;//联查单据
const { NCDiv } = base;
const { Inspection } = high;//联查计划预算
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;
/**
 * 注意：此页面只用于付款协同联查收款单据使用
 */
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = Templatedata.card_formid;
		this.searchId = Templatedata.list_searchid;
		this.moduleId = Templatedata.list_moduleid;
		this.tableId = Templatedata.card_tableid;
		this.pageId = Templatedata.link_card_pageid;
		this.tradeType = 'trade_type';//单据控制规则交易类型字段名称（也可传递的单据类型）
		this.formVOClassName = 'RecBillVO';//form表单的vo类名
		this.tableVOClassName = 'RecBillDetailVO';//table表体的vo类名
		this.billno = '';// 单据编号
		this.state = {
			showInspection: false,//联查预算
			sourceData: null,//联查预算数据源
			showbilltrack: false,//联查单据
			showbilltrackpk: '',//联查单据pk
			showbilltracktype: '',//联查单据类型
			show: false,//审批意见是否显示
			billid: '',//审批意见单据pk
			billtype: '',//审批意见单据类型
			billId: '',//单据pk
			showUploader: false,//控制附件弹出框
			target: null,//控制弹出位置
			tradebtnflag: true,
			tradetype: 'D4',
			tradename: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000019'),/* 国际化处理： 收款结算单*/
			tradepk: '0000Z6000000000000F4',
			outputData: ''//打印输出使用
		};
	}
	componentDidMount() {
		//被联查处理信息
		let link_src = this.props.getUrlParam("src");//联查来源
		if (link_src && link_src.length > 0) {
			//付款协同联查收款结算
			this.getLinkquery();
			this.toggleShow();
		} else {
			let searchData = [];
			let pk = this.props.getUrlParam("id");
			if (pk && (pk instanceof Array)) {
				searchData = pk;//数组
			} else if (pk) {
				searchData.push(pk);//字符串
			}
			if (searchData.length == 0) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000008') });
				return;
			}
			this.getLinkQueryData(searchData);//查询数据
			this.toggleShow();

		}
	}
	//多语+关闭浏览器提示
	componentWillMount() {
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				return '';
			}
		}
		let callback = (json) => {
			this.setState({ json });//批量提示语句必须使用这种方式
			saveMultiLangRes(this.props, json);//缓存多语资源
			initTemplate.call(this, this.props);
		};
		getMultiLang({
			moduleId: {
				['tmpub']: ['3601'],
				['cmp']: [Templatedata.app_code, '36070']
			},
			callback
		});
	}
	//被联查入口
	getLinkquery = () => {
		//联查数据状态
		let Status = this.props.getUrlParam('status');
		if (Status && Status == 'browse') {
			this.props.cardTable.setStatus(this.tableId, 'browse');
		}
		let cacheTools_informer_src = Templatedata.cacheTools_informer_src;
		let cacheTools_paybill_src = Templatedata.cacheTools_paybill_src;
		//联查来源
		let link_src_2 = this.props.getUrlParam("src");
		//联查1：付款结算单联查
		if (link_src_2 && link_src_2 == cacheTools_paybill_src) {
			//联查处理
			let paybillsData = cacheTools.get(Templatedata.cacheTools_paybill_key);
			if (paybillsData && paybillsData.length > 0) {
				this.getLinkQueryData(paybillsData);
			}
		}
		//联查2：到账通知联查
		if (link_src_2 && link_src_2 == cacheTools_informer_src) {
			//联查处理
			let informerData = [this.props.getUrlParam('id')];
			if (informerData && informerData.length > 0) {
				this.getLinkQueryData(informerData);
			}
		}
	}
	GetQuery = (query) => {
		let theRequest = {};
		if (query.indexOf('?') != -1) {
			let str = query.substr(1);
			if (str.indexOf('&') != -1) {
				let strs = str.split('&');
				for (let i = 0; i < strs.length; i++) {
					theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
				}
			} else {
				theRequest[str.split('=')[0]] = str.split('=')[1];
			}
		}
		return theRequest;
	};
	//开始联查
	getLinkQueryData = (searchData) => {
		let sendArr = {
			'pks': searchData,
			'pageid': this.pageId
		}
		ajax({
			url: '/nccloud/cmp/recbill/recbilllinkbill.do',
			data: sendArr,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							let source_flag = res.data.head[this.formId].rows[0].values.source_flag.value;
							this.billno = res.data.head[this.formId].rows[0].values.bill_no.value;
							setSourceFlag.call(this, source_flag);
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						this.toggleShow();
					} else {
						//清空数据
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}

				}
			}
		});
	}
	//加载刷新数据
	refresh = () => {
		this.toggleShow();
		//查询单据详情
		if (this.props.getUrlParam('status') === 'edit' ||
			this.props.getUrlParam('status') === 'browse') {
			if (!this.props.getUrlParam('id')) {
				return;
			}
			let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
			let that = this;
			ajax({
				url: '/nccloud/cmp/recbill/recbillquerycard.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							//页面渲染数据
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							let source_flag = res.data.head[this.formId].rows[0].values.source_flag.value;
							this.billno = res.data.head[this.formId].rows[0].values.bill_no.value;
							setSourceFlag.call(this, source_flag);
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
						}
						this.toggleShow();
					} else {
						//清空数据
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });

					}
					if (this.props.getUrlParam('status') === 'edit') {
						//设置组织不可以编辑
						this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
					}
				}
			});
		}
		//复制
		if (this.props.getUrlParam('status') === 'copy') {
			// /清空表单form所有数据
			this.props.form.EmptyAllFormValue(this.formId);
			this.billno = '';
			if (!this.props.getUrlParam('id')) {
				return;
			}
			let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
			let that = this;
			ajax({
				url: '/nccloud/cmp/recbill/recbillcopy.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);

						}
					} else {
						//清空数据
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });

					}

					//设置组织不可以编辑
					this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
				}
			});
		}
		//新增
		if (this.props.getUrlParam('status') === 'add') {

			// /清空表单form所有数据
			this.props.form.EmptyAllFormValue(this.formId);
			this.billno = '';
			//清空table所有数据
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
			let data = { pk: this.tableId, pageid: this.pageId };
			let that = this;
			ajax({
				url: '/nccloud/cmp/recbill/recbilladdevent.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.initMetaByPkorg();//单据有主组织，新增时,将其他字段设置为不可编辑. 
							this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });//组织可以进行编辑
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							//把所有form中字段不可以编辑，知道选择org之后
							//仅仅组织可以进行编辑
							// this.props.form.setFormItemsDisabled(this.formId,{ 'pk_currtype': true,'bill_date':true,'pk_balatype':true
							// ,'pk_account':true,'mon_account':true,'note_type':true,'note_no':true,'objecttype':true,'pk_customer':true,'pk_oppaccount':true});
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
							// this.props.cardTable.setEditableByIndex(that.tableId, 0, 'pk_currtype', false);
							//把所有table中字段不可以编辑，知道选择org之后
							this.props.cardTable.setStatus(that.tableId, 'browse');

						}
					} else {
						//清空数据
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });

					}
				}
			});
		}
	}
	//切换页面状态
	toggleShow = () => {

		let status = this.props.getUrlParam('status');
		let billstatus = this.props.getUrlParam('billno');//获取单据状态
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);//设置看片翻页的显隐性
		this.props.form.setFormStatus(this.formId, status);
		this.props.cardTable.setStatus(this.tableId, status);
		if (status == 'browse') {
			this.props.cardTable.setStatus(this.tableId, 'browse');
			//设置卡片头部状态
			if (this.billno != null && this.billno !='') {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: this.billno  //修改单据号---非必传
				});
			} else {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				});
			}
		} else {
			this.props.cardTable.setStatus(this.tableId, 'edit');
		}
		orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
		//按钮控制
		if (status != 'browse') {
			//新增or修改or复制：保存，保存提交，保存新增，取消，附件
			this.props.button.setButtonVisible(['addBtn', 'editBtn', 'deleteBtn'
				, 'copyBtn', 'subimtBtn', 'unsubmitBtn', 'rectradetypeBtn', 'linksettleBtn'
				, 'imagegroup', 'moreoperateBtn'
				, 'editBtn', 'subimtBtn', 'unsubmitBtn'], false);
			//保存，保存提交，保存新增，取消，附件
			this.props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
				, 'cancelBtn', 'annexBtn', 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn', 'openBtn',
				'copylineBtn', 'addlineBtn', 'deletelineBtn', 'editmoreBtn'], true);

		} else {
			//浏览态状态过滤	
			if (billstatus && billstatus === '-1') {
				//待审批
				this.props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
					, 'cancelBtn', 'annexBtn', 'subimtBtn', 'editBtn', 'deleteBtn'
					, 'addbodyBtn', 'deletebodyBtn'
					, 'copybodyBtn'], false);
				//新增，复制，收款交易类型，关联结算信息，收回，影像，更多
				this.props.button.setButtonVisible(['addBtn', 'copyBtn', 'rectradetypeBtn'
					, 'unsubmitBtn', 'imagegroup', 'moreoperateBtn'], true);

			} else if (billstatus && billstatus === '-99') {
				//暂存态
				this.props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
					, 'cancelBtn', 'annexBtn', 'subimtBtn', 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn'
					, 'unsubmitBtn'], false);
				//新增，复制，收款交易类型，关联结算信，影像，更多	
				this.props.button.setButtonVisible(['addBtn', 'copyBtn', 'rectradetypeBtn'
					, 'imagegroup', 'moreoperateBtn'], true);
			} else if (billstatus && billstatus === '8') {
				//签字态
				this.props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
					, 'cancelBtn', 'annexBtn', 'subimtBtn', 'editBtn', 'deleteBtn'
					, 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn'
					, 'unsubmitBtn'], false);
				//新增，复制，收款交易类型，关联结算信，影像，更多	
				this.props.button.setButtonVisible(['addBtn', 'copyBtn', 'rectradetypeBtn'
					, 'imagegroup', 'moreoperateBtn'], true);
			} else if (billstatus && billstatus === '1') {
				//审批通过
				this.props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
					, 'cancelBtn', 'annexBtn', 'subimtBtn', 'editBtn', 'deleteBtn'
					, 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn'
					, 'unsubmitBtn'], false);
				//新增，复制，收款交易类型，关联结算信，影像，更多	
				this.props.button.setButtonVisible(['addBtn', 'copyBtn', 'rectradetypeBtn'
					, 'imagegroup', 'moreoperateBtn'], true);
			} else if (billstatus && billstatus === '2') {
				//审批中
				this.props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
					, 'cancelBtn', 'annexBtn', 'subimtBtn', 'editBtn', 'deleteBtn'
					, 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn'
					, 'unsubmitBtn'], false);
				//新增，复制，收款交易类型，关联结算信，影像，更多	
				this.props.button.setButtonVisible(['addBtn', 'copyBtn', 'rectradetypeBtn'
					, 'imagegroup', 'moreoperateBtn'], true);
			} else if (billstatus && billstatus === '0') {
				//审批失败
				this.props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
					, 'cancelBtn', 'annexBtn', 'subimtBtn', 'deleteBtn'
					, 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn'
					, 'unsubmitBtn'], false);
				//新增，修改，复制，收款交易类型，关联结算信，影像，更多	
				this.props.button.setButtonVisible(['addBtn', 'copyBtn', 'editBtn', 'rectradetypeBtn'
					, 'imagegroup', 'moreoperateBtn'], true);
			} else if (billstatus && billstatus === '9') {
				//未确认
				this.props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
					, 'cancelBtn', 'annexBtn', 'subimtBtn', 'editBtn', 'deleteBtn'
					, 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn'
					, 'unsubmitBtn'], false);
				//新增，复制，收款交易类型，关联结算信，影像，更多	
				this.props.button.setButtonVisible(['addBtn', 'copyBtn', 'rectradetypeBtn'
					, 'imagegroup', 'moreoperateBtn'], true);
			} else if (billstatus && billstatus === '-10') {
				//保存态
				this.props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
					, 'cancelBtn', 'annexBtn', 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn'
					, 'unsubmitBtn'], false);
				//新增，修改，删除复制，收款交易类型，关联结算信息，收回，影像，更多
				this.props.button.setButtonVisible(['addBtn', , 'editBtn', 'deleteBtn', 'copyBtn', 'rectradetypeBtn'
					, 'subimtBtn', 'imagegroup', 'moreoperateBtn'], true);
			}

		}


	};
	//删除单据
	delConfirm = () => {

		let data = {
			'pk': this.props.getUrlParam('id')
		};

		ajax({
			url: '/nccloud/cmp/recbill/recbilldelete.do',
			data: data,
			success: (res) => {
				if (res.success) {
					toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000034') });/* 国际化处理： 删除成功*/
					this.props.linkTo('/cmp/billmanagement/recbill/linklist/index.html');
				}
			}
		});
	};
	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}
	//关闭审批意见页面
	closeApprove = () => {
		this.setState({
			show: false
		})
	}
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
	//保存单据
	saveBill = () => {
		if (this.props.getUrlParam('copyFlag') === 'copy') {
			this.props.form.setFormItemsValue(this.formId, { crevecontid: null });
			this.props.form.setFormItemsValue(this.formId, { ts: null });
		}

		//过滤表格空行
		// this.props.cardTable.filterEmptyRows(this.tableId);
		let isCheckTable = this.props.cardTable.getValByKeyAndIndex(this.tableId, 0, 'rec_primal');//收款原币金额
		if (isCheckTable && isCheckTable.value) {

		} else {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000068') });/* 国际化处理： 收款金额未填写*/
			return;
		}
		let flag = this.props.form.isCheckNow(this.formId);
		let s_tableflag = this.props.cardTable.getCheckedRows(this.tableId);
		if (flag && s_tableflag) {

			let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
			let url = '/nccloud/cmp/recbill/recbillinsert.do'//新增保存
			if (this.props.getUrlParam('status') === 'edit') {
				url = '/nccloud/cmp/recbill/recbillupdate.do'//修改保存
			}
			ajax({
				url: url,
				data: CardData,
				success: (res) => {
					let pk_paybill = null;
					if (res.success) {
						if (res.data) {
							toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000001') });/* 国际化处理： 保存成功*/

							let pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
							let billstatue = res.data.head[this.formId].rows[0].values.bill_status.value;
							// window.location.href = "/cmp/billmanagement/recbill/card#status=browse&id=" + pk_recbill + "&billno=" + billstatue;
							this.props.linkTo('/cmp/billmanagement/recbill/linkcard/index.html', {
								status: 'browse',
								id: pk_recbill,
								billno: billstatue,
								pagecode: this.pageId
							})
							this.componentDidMount();
						}
					}

				}
			});
		}
	};
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
		let { cardTable, form, button } = this.props;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp ,createErrorFlag} = button;
		let { showUploader, target, billId } = this.state;//附件相关内容变量
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
				<div className="nc-bill-top-area">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER}
							className="nc-bill-header-area">
							<div className="header-title-search-area">
								{
									createBillHeadInfo(
										{
											title: this.props.MutiInit.getIntl("36070RBM") &&
												this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000046'),  //标题{/* 国际化处理： 收款结算*/}
											billCode: this.billno,     //单据号
											showBackBtn: false,
											showBillCode: true
										}
									)}

							</div>

							<div className="header-button-area">
								<div className="button-app-wrapper">		
									{createErrorFlag({
										headBtnAreaCode: cons.card.btnHeadCode
									})}
								</div>
								<div>
									{createButtonApp({
										area: Templatedata.card_head,
										buttonLimit: 10,
										onButtonClick: buttonClick.bind(this)
									})}
								</div>
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							expandArr: [jsondata.form1],
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: formBeforeEvent.bind(this)//form编辑前事件
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(this.tableId, {
							adaptionHeight: true,//表格固定行
							tableHead: this.getTableHead.bind(this, buttons, this.tableId),
							modelSave: this.saveBill,
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: bodyBeforeEvent.bind(this),//table编辑前事件
							showCheck: true
						})}
					</div>
				</div>
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader &&
						<NCUploader
							billId={billId}
							target={target}
							placement={'bottom'}
							billNo={this.billno}
							onHide={this.onHideUploader}
							customInterface={
								{
									queryLeftTree: commonurl.lefttreequery,
									queryAttachments: Templatedata.annex_url
								}
							}//附件改造
						/>
					}
				</div>
				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.show}
						close={this.closeApprove}
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

				{/* 联查计划预算 */}
				<div>
					<Inspection
						show={this.state.showInspection}
						sourceData={this.state.sourceData}
						cancel={() => {
							this.setState({ showInspection: false, sourceData: null })
						}}
						affirm={() => {
							this.setState({ showInspection: false, sourceData: null })
						}}
					/>
				</div>
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url='/nccloud/cmp/recbill/recbillprintcard.do'
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
			</div>
		);
	}
}

Card = createPage({
	mutiLangCode: Templatedata.list_moduleid
})(Card);

ReactDOM.render(<Card />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/