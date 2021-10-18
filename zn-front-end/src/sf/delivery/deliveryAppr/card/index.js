/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, cardCache, getMultiLang } from 'nc-lightapp-front';
import { buttonClick, initTemplate, beforeEvent, afterEvent, pageInfoClick, buttonVisible } from './events';
// 网银补录
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form/index.js';
// ca
import Sign from '../../../../tmpub/pub/util/ca';
//引入联查内部账户组件
import { InnerAccoutDialog } from "../../../../tmpub/pub/inneraccount/list";
import NCCOriginalBalance from '../../../../cmp/public/restmoney/list';
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
import { saveMultiLangRes, loadMultiLang, createCardWebSocket } from "../../../../tmpub/pub/util/index";
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../pub/cons/constant';
import {
	module_id, module_name, module_tmpub_name, module_tmpub_id, appcode,
	list_search_id, list_page_id, list_table_id, button_limit,
	oid, card_page_id, card_from_id, card_fromtail_id, card_table_id,
	dataSource, deliveryPk, deliveryBillType
} from '../cons/constant';
import Modal from '../../../../tmpub/pub/util/modal/index';

let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix } = base;
//返回button
const { NCBackBtn, NCDiv } = base;
let { NCUploader, ApproveDetail, PrintOutput, ApprovalTrans, Inspection } = high;
let { getNextId, getCurrentLastId, deleteCacheById, getCacheById, updateCache, addCache } = cardCache;

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = card_from_id;
		this.searchId = list_search_id;
		this.moduleId = module_id;
		this.tableId = card_table_id;
		this.pageId = card_page_id;
		this.ts = null;
		this.backvbillno = '';
		this.state = {
			//多语
			json: {},
			pk_org_pWherePart: null,
			// 单据编号
			vbillno: '',
			// 退回原因
			returnnote: '',
			// 网银补录 start
			showBuLu: false,
			onLineData: [],
			modelType: SHOWMODEL_BULU,
			// 网银补录 end

			// 附件相关 start
			//单据pk
			billId: '',
			//附件管理使用单据编号
			billno: '',
			//控制附件弹出框
			showUploader: false,
			//控制弹出位置
			target: null,
			// 附件相关 end

			// 联查预算 start
			//是否显示预算计划
			showNtbDetail: false,
			//预算计划数据
			ntbdata: null,
			// 联查预算 end

			//审批意见 start
			//审批意见是否显示
			show: false,
			//审批意见单据pk
			billid: '',
			//审批意见单据类型
			billtype: '',
			//审批意见 end

			// 联查内部账户余额 start
			showInnerAccInfo: false,
			pk_inneracc: '',
			// 联查内部账户余额 end

			// 银行账户余额 start
			// 是否展示期初余额联查框，true:展示，false:不展示
			showOriginal: false,
			// 联查余额取数据，将需要联查的数据赋值给我
			showOriginalData: [],
			// 银行账户余额 end

			//输出用   
			outputData: {
				funcode: '', //功能节点编码，即模板编码
				nodekey: '', //模板节点标识
				printTemplateID: '', //模板id
				oids: [],
				outputType: 'output'
			},
			//返回箭头
			showNCbackBtn: false,

			//表体中按钮的显隐性状态
			pasteflag: false,

			// 提交即指派 start
			compositedata: null,
			compositedisplay: null,

			// 取个性化中心设置的组织
			curr_pk_org: null,
			curr_orgname: null,
			curr_pk_org_v: null,
			curr_orgname_v: null,

			// 退回原因
			showBackModal: false,
		};
		initTemplate.call(this, props);
	}

	componentDidMount() {
		// orgVersionView(this.props, card_from_id);
		// 联查信息
		let srcbilltype = this.props.getUrlParam('srcbilltype');
		if (srcbilltype) {
			// 上游生成上收单，根据pk_srcbill查询
			// 36KC 上收规则设置;36K3 上缴单;36J1 委托付款; 36S3 到账通知
			if (srcbilltype === '36KC' || srcbilltype === '36K3'
				|| srcbilltype === '36J1') {
				this.getLinkQueryBillDataBySrc();
			} else {
				this.getLinkQueryBillData();
			}
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				//控制显示返回按钮: true为显示,false为隐藏
				showBackBtn: true,
				//控制显示单据号：true为显示,false为隐藏
				showBillCode: true,
			});
		}
		else {
			this.toggleShow();
			this.refresh();
		}
	}

	componentWillMount() {
		getMultiLang({
			moduleId: {
				//tmpub模块多语资源
				[module_tmpub_name]: [module_tmpub_id],
				//fts模块多语资源
				[module_name]: [module_id, '36320FDA']
			},
			//回调
			callback: (lang) => {
				this.setState({ lang });
				//将多语资源数据存储到页面级缓存中
				saveMultiLangRes(this.props, lang);
				//初始化模板
				// initTemplate(this.props);
			}
		});
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				/* 国际化处理： 当前单据未保存，您确认离开此页面？*/
				return this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000087');;
			}
		};
	}

	// 上游生成上收单，根据pk_srcbill查询
	getLinkQueryBillDataBySrc = () => {
		let srckey = this.props.getUrlParam('srckey');
		if (srckey) {
			let data = {
				pk_srcbill: srckey,
				pageid: link_card_page_id,
			};
		}
	}

	// 上收单生成下游，根据主键查询
	getLinkQueryBillData = () => {
		let srckey = this.props.getUrlParam('srckey');
		let id = this.props.getUrlParam('id');
		let pk;
		if (srckey) {
			pk = srckey;
		} else {
			pk = id;
		}
		if (pk) {
			let data = {
				pk: pk,
				pageid: link_card_page_id,
			};
			ajax({
				url: '/nccloud/sf/delivery/deliveryquerycard.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							//页签赋值
							let vbillno = res.data.head[this.formId].rows[0].values.vbillno;
							this.backvbillno = vbillno && vbillno.value;
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						// buttonVisible(this.props);
						this.toggleShow();
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
				}
			});
		}
	}

	//加载数据刷新数据
	refresh = () => {
		let status = this.props.getUrlParam('status');
		let pk = this.props.getUrlParam('id');
		//查询单据详情
		if (status === 'browse') {
			let refreshcardData = getCacheById(pk, dataSource);
			if (pk) {
				// if (refreshcardData) {
				// 	this.props.form.setAllFormValue({ [card_from_id]: refreshcardData.head[card_from_id] });
				// 	this.props.cardTable.setTableData(card_table_id, refreshcardData.body[card_table_id]);
				// 	let vbillno = refreshcardData.head[card_from_id].rows[0].values.vbillno;
				// 	this.backvbillno = vbillno && vbillno.value;
				// 	this.toggleShow();
				// 	this.props.setUrlParam({
				// 		id: pk,
				// 		status: 'browse',
				// 		pagecode: card_page_id,
				// 	})
				// } else 
				{
					let data = {
						pk: pk,
						pageid: this.pageId
					};
					let that = this;
					ajax({
						url: '/nccloud/sf/delivery/deliveryquerycard.do',
						data: data,
						success: (res) => {
							if (res.data) {
								if(res.data.head[card_from_id].rows[0].values.saga_status){
	
									let saga_status = res.data.head[card_from_id].rows[0].values.saga_status;
			
									this.props.button.toggleErrorStatus('card_head',{
										isError: saga_status.value === "1"
									})
								}
								if (res.data.head) {
									this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
									//页签赋值
									let vbillno = res.data.head[this.formId].rows[0].values.vbillno;
									this.backvbillno = vbillno && vbillno.value;
									updateCache('pk_delivery_h', res.data.head[this.formId].rows[0].values.pk_delivery_h.value, res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
								}
								if (res.data.body) {
									this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
								}
								// buttonVisible(this.props);
								this.toggleShow();
								this.props.setUrlParam({
									id: pk,
									status: 'browse',
									pagecode: card_page_id,
								})
							} else {
							}
						}
					});
				}
			} else {
				//清空数据
				this.props.form.EmptyAllFormValue(this.formId);
				this.props.cardTable.setTableData(this.tableId, { rows: [] });
				this.toggleShow();
			}
		}
		else if (status === 'edit') {
			let data = {
				pk: pk,
				pageid: this.pageId,
				status: status,
			};
			let that = this;
			ajax({
				url: '/nccloud/sf/delivery/deliveryquerycard.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							//页签赋值
							let vbillno = res.data.head[this.formId].rows[0].values.vbillno;
							this.backvbillno = vbillno && vbillno.value;
							updateCache('pk_delivery_h', res.data.head[this.formId].rows[0].values.pk_delivery_h.value, res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
						}
						// buttonVisible(this.props);
						this.toggleShow();
					} else {
						// this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						// this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					//设置组织不可以编辑
					this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
					// 1=手工录入，2=上收申请生成，3=自动上收生成，4=到账通知生成，5=委托付款取消回拨生成
					let srcbusitype = this.props.form.getFormItemsValue(this.formId, 'srcbusitype');
					let rowCount = this.props.cardTable.getNumberOfRows(card_table_id);
					if (rowCount > 0) {
						for (var i = 0; i < rowCount; i++) {
							if (srcbusitype == 3) {
								this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_r', false);
							}
							else if (srcbusitype == 4) {
								this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_r', false);
							}
							else if (srcbusitype == 5) {
								this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_r', false);
							}
						}
					}
				}
			});
		}
		//复制
		else if (status === 'copy') {
			// /清空表单form所有数据
			this.props.form.EmptyAllFormValue(this.formId);
			this.backvbillno = '';
			let data = {
				pk: pk,
				pageid: this.pageId
			};
			let that = this;
			ajax({
				url: '/nccloud/sf/delivery/deliverycopy.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
						}
						// buttonVisible(this.props);
						this.toggleShow();
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					//设置组织不可以编辑
					this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
					// 设置某一列的编辑性 true为不可编辑(默认true)
					this.props.cardTable.setColEditableByKey(card_table_id, 'isnetpay', false);
				}
			});
		}
		//经办
		else if (status === 'decide') {
			let data = {
				pk: pk,
				pageid: this.pageId
			};
			let that = this;
			ajax({
				url: '/nccloud/sf/delivery/deliverydecide.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.billCard.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.billCard.head[this.formId] });
							let vbillno = res.data.billCard.head[this.formId].rows[0].values.vbillno;
							this.backvbillno = vbillno && vbillno.value;
							updateCache('pk_delivery_h', pk, res.data.billCard, card_from_id, dataSource, res.data.billCard.head[this.formId].rows[0].values);
							// 清空相关字段
							//设置组织不可以编辑
							that.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
						}
						// 设置字段编辑性
						if (res.data.billCard.body) {
							this.props.cardTable.setTableData(that.tableId, res.data.billCard.body[this.tableId]);
						}
						// buttonVisible(this.props);
						this.toggleShow();
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
				}
			});
		}
		//新增
		else if (status === 'add') {
			// 清空表单form所有数据
			this.props.form.EmptyAllFormValue(this.formId);
			this.backvbillno = '';
			//清空table所有数据
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
			let that = this;
			//单据有主组织，新增时,将其他字段设置为不可编辑.
			this.props.initMetaByPkorg();
			//把所有table中字段不可以编辑，直到选择org之后
			this.props.cardTable.setStatus(that.tableId, 'browse');
			let interfaceJump = this.props.getUrlParam('interfaceJump');
			if (interfaceJump === 'card') {
				//设置组织可以编辑
				this.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
			}
			this.props.form.setFormItemsValue(card_from_id,
				{
					'pk_org': {
						value: this.state.curr_pk_org,
						display: this.state.curr_orgname
					},
					'pk_org_v': {
						value: this.state.curr_pk_org_v,
						display: this.state.curr_orgname_v
					}
				}
			);
			if (this.state.curr_pk_org) {
				let pk_org = {
					value: this.state.curr_pk_org,
					display: this.state.curr_orgname
				};
				afterEvent.call(this, this.props, card_from_id, "pk_org", pk_org, null, null, null, null, true);
				this.props.resMetaAfterPkorgEdit();
				this.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
			}
			// this.props.cardTable.addRow(this.tableId);
			this.toggleShow();
		} else {
			let data = {
				pk: pk,
				pageid: this.pageId
			};
			let that = this;
			ajax({
				url: '/nccloud/sf/delivery/deliveryquerycard.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							//页签赋值
							let vbillno = res.data.head[this.formId].rows[0].values.vbillno;
							this.backvbillno = vbillno && vbillno.value;
							// updateCache('pk_delivery_h', res.data.head[this.formId].rows[0].values.pk_delivery_h.value, res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						// buttonVisible(this.props);
						this.toggleShow();
						this.props.setUrlParam({
							id: pk,
							status: 'browse',
							pagecode: card_page_id,
						})
					} else {
					}
				}
			});
		}
	}

	//加载数据刷新数据
	refreshPage = () => {
		let status = this.props.getUrlParam('status');
		let pk = this.props.getUrlParam('id');
		//查询单据详情
		if (status === 'browse') {
			let data = {
				pk: pk,
				pageid: this.pageId
			};
			let that = this;
			ajax({
				url: '/nccloud/sf/delivery/deliveryquerycard.do',
				data: data,
				success: (res) => {
					if (res.data) {
						toast({
							color: 'success', content: loadMultiLang(this.props, '3601-000013')/**多语 刷新成功 */
						});
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							//页签赋值
							let vbillno = res.data.head[this.formId].rows[0].values.vbillno;
							this.backvbillno = vbillno && vbillno.value;
							updateCache('pk_delivery_h', res.data.head[this.formId].rows[0].values.pk_delivery_h.value, res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						// buttonVisible(this.props);
						this.toggleShow();
					} else {
						// this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						// this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					// this.setState({
					// 	showNCbackBtn: true
					// });
				}
			});
		}
	}
	//切换页面状态
	toggleShow = () => {
		//按钮显隐性
		buttonVisible.call(this, this.props);
		let status = this.props.getUrlParam('status');
		if (status === 'browse') {
			// this.setState({
			// 	showNCbackBtn: true
			// });
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				//控制显示返回按钮: true为显示,false为隐藏
				showBackBtn: false,
				//控制显示单据号：true为显示,false为隐藏
				showBillCode: true,
				billCode: this.backvbillno,
			});
		}
		else if (status === 'edit' || status === 'decide') {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				//控制显示返回按钮: true为显示,false为隐藏
				showBackBtn: false,
				//控制显示单据号：true为显示,false为隐藏
				showBillCode: true,
				billCode: this.backvbillno,
			});
		}
		else if (status === 'add' || status === 'copy') {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				//控制显示返回按钮: true为显示,false为隐藏
				showBackBtn: false,
				//控制显示单据号：true为显示,false为隐藏
				showBillCode: false,
			});
		} else {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				//控制显示返回按钮: true为显示,false为隐藏
				showBackBtn: false,
				//控制显示单据号：true为显示,false为隐藏
				showBillCode: true,
				billCode: this.backvbillno,
			});
		}
		if (status === 'edit' || status === 'decide' || status === 'copy') {
			this.props.resMetaAfterPkorgEdit();
		}
		// orgVersionView(this.props, card_from_id);
	};

	//删除单据
	delConfirm = () => {
		let data = {
			pks: [this.props.getUrlParam('id')],
			tss: [this.props.form.getFormItemsValue(this.formId, 'ts').value]
		};

		ajax({
			url: '/nccloud/sf/delivery/deliverydel.do',
			data: data,
			success: (res) => {
				if (res.success) {
					toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000050') });/* 国际化处理： 删除成功*/
					let deleteid = this.props.getUrlParam("id");
					//根据当前id,获取下个id
					/*
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
					let deletenextId = getNextId(deleteid, dataSource);
					//调用删除缓存数据方法
					/*
					* idname: 数据主键的命名
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
					deleteCacheById('pk_delivery_h', deleteid, dataSource);
					//根据nextId查询下条数据
					//注意：查询下条数据时，也同样需要先判断有没有缓存数据，没有缓存数据时，再发查询请求。
					this.props.setUrlParam({
						status: 'browse',
						id: deletenextId ? deletenextId : '',
					});
					this.refresh();
				}
			}
		});
	};

	// 编辑保存是取消按钮确认框
	saveCancelConfirm = () => {
		let status = this.props.getUrlParam('status');
		let id = this.props.getUrlParam('id');
		if (status === 'edit') {
			// 表格返回上一次的值
			this.props.pushTo("/card", {
				status: 'browse',
				id: id,
				pagecode: card_page_id,
			});
			// this.setState({showNCbackBtn: true});
			this.toggleShow();
			this.refresh();
		}
		//保存中的取消操作
		else if (status === 'add') {
			this.props.pushTo("/card", {
				id: id,
				status: 'browse',
				pagecode: card_page_id,
			});
			// this.setState({showNCbackBtn: true});
			this.toggleShow();
			this.refresh();
			//清空table所有数据
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
		}
		//复制中的取消操作
		else if (status === 'copy') {
			this.props.pushTo("/card", {
				id: id,
				status: 'browse',
				pagecode: card_page_id,
			});
			this.refresh();
		}
		// 经办
		else if (status === 'decide') {
			this.props.pushTo("/card", {
				status: 'browse',
				id: id,
				pagecode: card_page_id,
			});
			this.toggleShow();
			this.refresh();
		}
		//浏览查询详情
		else if (status === 'browse') {
			this.props.pushTo("/card", {
				status: 'browse',
				id: id,
				pagecode: card_page_id,
			});
			this.toggleShow();
			this.refresh();
		}
	};

	// 切换主组织确认按钮
	changeOrgConfirm = (data) => {
		let rowCount = this.props.cardTable.getNumberOfRows(card_table_id);
		if (rowCount > 0) {
			for (var i = 0; i < rowCount; i++) {
				this.props.cardTable.delRowsByIndex(card_table_id, i);
			}
		}
		ajax({
			url: '/nccloud/sf/delivery/deliveryheadafterevent.do',
			data: data,
			success: (res) => {
				if (res.success) {
					if (res.data) {
						this.props.form.EmptyAllFormValue(this.formId);
						if (res.data.billCard.head) {
							//页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
							this.props.form.setAllFormValue({ [this.formId]: res.data.billCard.head[this.formId] });
							//选择主组织以后，恢复其他字段的编辑性
							this.props.resMetaAfterPkorgEdit();
							// 组织可编辑
							this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });
						}
						this.props.cardTable.addRow(card_table_id);
						if (res.data.billCard.body) {
							this.props.cardTable.setStatus(this.tableId, 'edit');
							//表体table行数
							let allTableDataRows = this.props.cardTable.getNumberOfRows(this.tableId);
							if (allTableDataRows.length < 0) {
								// 增行
								this.props.cardTable.addRow(this.tableId);
								this.props.cardTable.setValByKeyAndIndex(this.tableId, 0, 'amount', { value: 0 });
								this.props.cardTable.setValByKeyAndIndex(this.tableId, 0, 'glcamount', { value: 0 });
								this.props.cardTable.setValByKeyAndIndex(this.tableId, 0, 'gllcamount', { value: 0 });
							}
						}
						if (res.data.refWhereInfo4NCC.wherePart) {
							this.setState({
								pk_org_pWherePart: res.data.refWhereInfo4NCC.wherePart
							});
						}
						if (res.data.refWhereInfo4NCC.error) {
							this.props.form.setFormItemsValue(card_from_id, { 'busitype': { value: null, display: null } });
							toast({ color: 'warning', content: res.data.refWhereInfo4NCC.error });
							return;
						}
					}
				}
			}
		});

	}

	// 切换主组织取消按钮
	changeOrgCancel = (cardData) => {
		if (cardData.head) {
			this.props.form.setAllFormValue({ [card_from_id]: cardData.head[card_from_id] });
		}
		if (cardData.body) {
			this.props.cardTable.setTableData(card_table_id, cardData.body[card_table_id]);
		}
	}

	//处理网银补录返回信息
	processRetMsg = (retMsg) => {
		let data = {
			pk: this.props.form.getFormItemsValue(this.formId, 'pk_delivery_h').value,
			ts: this.props.form.getFormItemsValue(this.formId, 'ts').value,
			results: retMsg,
			pageid: card_page_id,
			isCardOpt: true,
		}
		ajax({
			url: '/nccloud/sf/delivery/deliverybuluretmsg.do',
			data: data,
			success: (res) => {
				if (res.success) {
					if (res && res.data) {
						let vbillno = '';
						if (res.data.billCard.head) {
							this.props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                            /*
                            * idname: 数据主键的命名
                            * id：数据主键的值
                            * headAreacode: 卡片表头的区域编码
                            * dataSource: 缓存数据命名空间
                            */
							updateCache('pk_delivery_h', res.data.billCard.head[card_from_id].rows[0].values.pk_delivery_h.value,
								res.data, card_from_id, dataSource);
							vbillno = res.data.billCard.head[card_from_id].rows[0].values.vbillno.value;
							this.backvbillno = vbillno && vbillno.value;
						}
						if (res.data.billCard.body) {
							this.props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
						}
						this.toggleShow();
					}
				}
			}
		});
		// this.refresh();
	}

	//保存单据
	saveBill = async () => {
		if (this.props.getUrlParam('status') === 'copy') {
			this.props.form.setFormItemsValue(this.formId, { pk_delivery_h: null });
			this.props.form.setFormItemsValue(this.formId, { ts: null });
		}
		let saveBeforePk = this.props.form.getFormItemsValue(this.formId, 'pk_delivery_h');
		let saveflag = this.saveBillBeforeCheck();
		if (saveflag) {
			let cardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
			//console.log(cardData, 'sign before cardData');
			let result = await Sign({
				isSign: true,
				isKey: true,
				data: cardData,
				isSave: true,
				encryptVOClassName: 'nccloud.pubitf.sf.delivery.delivery.DeliveryEncryptVO4NCC'
			});
			if (result.isStop) {
				return;
			}
			cardData = result.data;
			//console.log(cardData, 'sign after cardData');
			ajax({
				url: '/nccloud/sf/delivery/deliverysave.do',
				data: cardData,
				success: (res) => {
					if (res.success) {
						if (res.data) {
							toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000040') });/* 国际化处理： 保存成功*/
							if (res.data.head) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								//页签赋值
								let vbillno = res.data.head[this.formId].rows[0].values.vbillno;
								this.backvbillno = vbillno && vbillno.value;
								if (saveBeforePk && saveBeforePk.value) {
									updateCache('pk_delivery_h', res.data.head[this.formId].rows[0].values.pk_delivery_h.value, res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
								} else {
									addCache(res.data.head[this.formId].rows[0].values.pk_delivery_h.value, res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
								}
							}
							this.props.beforeUpdatePage();
							if (res.data.body) {
								// this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
								this.props.cardTable.updateDataByRowId(this.tableId, res.data.body[this.tableId]);
							}
							let pk_delivery_h = res.data.head[this.formId].rows[0].values.pk_delivery_h;
							let vbillno = res.data.head[this.formId].rows[0].values.vbillno;
							this.backvbillno = vbillno && vbillno.value;
							this.props.setUrlParam({
								status: 'browse',
								id: pk_delivery_h && pk_delivery_h.value,
								vbillno: vbillno && vbillno.value,
								pagecode: card_page_id,
							})
							this.toggleShow();
							this.props.updatePage(null, this.tableId, null);
							// orgVersionView(this.props, card_from_id);
							this.props.form.setFormItemsVisible(card_from_id, { 'pk_org': true });
							// this.props.form.setFormItemsVisible(card_from_id, {'pk_org':false});
							// this.props.form.setFormItemsVisible(card_from_id, {'pk_org_v':true});
							// this.setState({
							// 	showNCbackBtn: true
							// });
						}
					}
				}
			});
		}
	};

	// 保存前校验
	saveBillBeforeCheck = () => {
		let isreversebusitype = this.props.form.getFormItemsValue(this.formId, 'isreversebusitype');
		let rowCount = this.props.cardTable.getNumberOfRows(card_table_id);
		if (rowCount <= 0) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000051') });/* 国际化处理： 请录入表体数据!*/
			return false;
		}
		if (isreversebusitype && isreversebusitype.value) {

		} else {
			for (var i = 0; i < rowCount; i++) {
				let amount = this.props.cardTable.getValByKeyAndIndex(card_table_id, i, 'amount');
				if (amount && amount.value < 0) {
					toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000052') });/* 国际化处理： 金额必须大于0!*/
					return false;
				}
			}
		}
		// form必输项校验
		let flag = this.props.form.isCheckNow(this.formId);
		//table必输项校验
		let tableflag = this.props.cardTable.checkTableRequired(this.tableId);
		return flag && tableflag;
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
						area: 'card_body',
						buttonLimit: 7,
						onButtonClick: buttonClick.bind(this),
						popContainer: document.querySelector('.header-button-area')
					})}
				</div>
			</div>
		);
	};

	// 退回原因
	returnnoteModelContent() {
		return (
			<div className="addModal">
				<NCFormControl
					className="demo-input"
					value={this.state.returnnote}
					onChange={this.changeReturnnoteEvent}
					size="sm"
				/>
			</div>
		)
	};

	// 退回原因改变事件
	changeReturnnoteEvent = (value) => {
		if (value != this.state.returnnote) {
			this.setState({
				returnnote: value
			})
		}
	}

	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}

	beforeUpload(billId, fullPath, file, fileList) {
		// 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
		//console.log(billId, fullPath, file, fileList);

		const isJPG = file.type === 'image/jpeg';
		if (!isJPG) {
			// alert(this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000053'))/* 国际化处理： 只支持jpg格式图片*/
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			// alert(this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000054'))/* 国际化处理： 上传大小小于2M*/
		}
		return isJPG && isLt2M;
		// 备注： return false 不执行上传  return true 执行上传
	}

	// 返回箭头按钮
	ncBackBtnClick = () => {
		//先跳转列表
		this.props.pushTo("/list", {
			pagecode: list_page_id,
		});
	};

	getAssginUsedr = (value) => {
		this.commit(value);
	}

	// 提交即指派取消
	compositeTurnOff = (value) => {
		this.setState({
			compositedata: null,
			compositedisplay: false,
		});
	}

	// 提交
	commit = (userObj) => {
		let commitdataArr = [];
		let pk_delivery_h = this.props.form.getFormItemsValue(this.formId, 'pk_delivery_h');
		let ts = this.props.form.getFormItemsValue(this.formId, 'ts');
		let commitData = {
			pks: [pk_delivery_h && pk_delivery_h.value],
			tss: [ts && ts.value],
			pageid: card_page_id,
			isCardOpt: true,
			userObj: userObj,
		};
		ajax({
			url: '/nccloud/sf/delivery/deliverycommit.do',
			data: commitData,
			success: (res) => {
				if (res.success) {
					if (res.data && res.data.errorMsg) {
						toast({ color: 'warning', content: res.data.errorMsg });
					} else {
						if (res.data.workflow &&
							(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow') && !userObj) {
							this.setState({
								compositedata: res.data,
								compositedisplay: true,
							});
						} else {
							if (res.data.warningMsg) {
								toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000007') + res.data.warningMsg });/* 国际化处理： 提交成功*/
							} else {
								toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000007') });/* 国际化处理： 提交成功*/
							}
							this.setState({
								compositedata: res.data,
								compositedisplay: false,
							});
							if (res.data.billCard.head) {
								this.props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
								updateCache('pk_delivery_h', pk_delivery_h && pk_delivery_h.value, res.data, card_from_id, dataSource);
							}
							if (res.data.billCard.body) {
								this.props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
							}
						}
					}
					this.props.setUrlParam({
						status: 'browse',
						id: pk_delivery_h && pk_delivery_h.value,
						pagecode: card_page_id,
					})
					this.toggleShow();
				}
			}
		});
	};

	// 退回
	backConfirm = (value) => {
		let backdataArr = [];
		backdataArr.push(this.props.getUrlParam('id'));
		let backData = {
			pks: backdataArr,
			tss: [this.ts],
			pageid: card_page_id,
			isCardOpt: true,
			returnnote: value,
		};
		ajax({
			url: '/nccloud/sf/delivery/deliveryback.do',
			data: backData,
			success: (res) => {
				if (res.success) {
					if (res.data) {
						this.backvbillno = '';
						this.ts = null;
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000006') });/* 国际化处理： 退回成功*/
						this.setState({
							showBackModal: false
						});
						let backid = this.props.getUrlParam("id");
						//根据当前id,获取下个id
						/*
						* id：数据主键的值
						* dataSource: 缓存数据命名空间
						*/
						let backnextId = getNextId(backid, dataSource);
						//调用删除缓存数据方法
						/*
						* idname: 数据主键的命名
						* id：数据主键的值
						* dataSource: 缓存数据命名空间
						*/
						deleteCacheById('pk_delivery_h', backid, dataSource);
						//根据nextId查询下条数据
						//注意：查询下条数据时，也同样需要先判断有没有缓存数据，没有缓存数据时，再发查询请求。
						this.props.setUrlParam({
							status: 'browse',
							id: backnextId ? backnextId : '',
						});
						this.refresh();
					}
				}
			}
		});
	}

	render() {
		let { cardTable, form, button, modal, ncmodal, cardPagination, editTable } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createEditTable } = editTable;
		let { createButton, createButtonApp, createErrorFlag } = button;
		let { createModal } = modal;
		let createNCModal = ncmodal.createModal;
		const { createBillHeadInfo } = this.props.BillHeadInfo;

		// 附件相关内容变量
		let { showUploader, target, billno, billId, showNCbackBtn } = this.state;
		let { showInnerAccInfo, pk_inneracc, showNtbDetail, ntbdata, showBackModal } = this.state;
		// //console.log("button.getButtons:", button.getButtons);
		return (
			<div className="nc-bill-card">
				{/**创建websocket */}
				{createCardWebSocket(this.props, {
                    headBtnAreaCode: 'card_head',
                    formAreaCode: card_from_id,
                    billpkname: deliveryPk,
					billtype: deliveryBillType,
					dataSource: dataSource
                })}				
				{/* 新增div */}
				<div className="nc-bill-top-area">
					<NCAffix>
						{/** 渲染标题栏 **/}
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">

							<div className="header-title-search-area">
								{createBillHeadInfo({
									// {/* 国际化处理： 资金上收*/}
									title: this.props.MutiInit.getIntl("36320FDA")
										&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000079'),
									//单据号
									billCode: this.backvbillno,
									//返回按钮的点击事件 
									backBtnClick: () => {
										this.ncBackBtnClick();
									}
								})}
							</div>
							<div className="header-button-area">
								{
									createErrorFlag({
										headBtnAreaCode: 'card_head'
									})
								}
								{/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
								{this.props.button.createButtonApp({
									area: 'card_head',
									buttonLimit: 10,
									onButtonClick: buttonClick.bind(this),
									popContainer: document.querySelector('.header-button-area')
								})}
							</div>
							{/* <div className='header-cardPagination-area' style={{ float: 'right' }}>
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this),
									dataSource: dataSource
								})}
							</div> */}
						</NCDiv>
					</NCAffix>
					{/* <NCScrollElement name='forminfo'> */}
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							expandArr: [this.formId],
							onBeforeEvent: beforeEvent.bind(this),
							onAfterEvent: afterEvent.bind(this),
						})}
					</div>
					{/* </NCScrollElement> */}
				</div>
				{/* 新增div */}
				<div className="nc-bill-bottom-area">
					<NCScrollElement name='businfo'>
						<div className="nc-bill-table-area">
							{/* {this.getTableHead(buttons, this.tableId)} */}
							{createCardTable(this.tableId, {
								adaptionHeight: true,//表格固定10行的大小
								tableHead: this.getTableHead.bind(this, buttons, this.tableId),
								modelSave: this.saveBill,
								onBeforeEvent: beforeEvent.bind(this),
								onAfterEvent: afterEvent.bind(this),
								showCheck: true,
								showIndex: true,
								// showTotal: true,
								// 是否隐藏增行按钮 默认显示，当值为true时候隐藏
								hideAdd: this.props.getUrlParam("status") === 'decide',
								// 是否隐藏删行按钮 默认显示，当值为true时候隐藏
								hideDel: this.props.getUrlParam("status") === 'decide',
							})}
						</div>
					</NCScrollElement>
				</div>

				{/* 输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url="/nccloud/sf/delivery/deliveryprint.do"
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>

				{createModal('saveCancelModel', {
					title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000088'),/* 国际化处理： 取消确认*/
					content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000089'),/* 国际化处理： 是否确任要取消?*/
					beSureBtnClick: this.saveCancelConfirm,
					//  模态框大小 sm/lg/xlg,
					size: 'sm',
					className: 'junior'
				})}

				{createModal('delete', {
					title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000055'),/* 国际化处理： 删除确认*/
					content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000056'),/* 国际化处理： 你确定要删除吗?*/
					beSureBtnClick: this.delConfirm,
					//  模态框大小 sm/lg/xlg,
					size: 'sm',
					className: 'junior'
				})}

				{createModal('changeorg', {
					title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000057'),/* 国际化处理： 确认修改*/
					content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000058'),/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					//  模态框大小 sm/lg/xlg,
					size: 'sm',
					className: 'junior',
					// beSureBtnClick: this.changeOrgConfirm
				})}

				{/* 模态框 */}
				{createModal('commonModel', {
					hasCloseBtn: false,
					className: 'senior'
				})}

				{/* 退回模态框 */}
				{createModal('backModel', {
					title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000059'),/* 国际化处理： 退回*/
					content: this.returnnoteModelContent(),
					hasCloseBtn: false,
					className: 'senior'
				})}

				{/* 支付模态框 */}
				{createModal('payModel', {
					// title: "支付",
					hasCloseBtn: false,
					className: 'senior'
				})}
				{/* 再次网银支付模态框 */}
				{/* {createModal('netpayagain', {
					// title: "再次网银支付",
				})} */}
				{/* 再次手工支付模态框 */}
				{/* {createNCModal('payagainModel', {
					// title: "再次手工支付",
				})} */}
				{/* 分录作废模态框 */}
				{/* {createModal('recorddisuseModel', {
					// title: "分录作废",
				})} */}

				{/** 网银补录组件 **/}
				<PayBuluForm
					showmodal={this.state.showBuLu}
					modal={modal}
					onLineData={this.state.onLineData}
					moduleType={sourceModel_SF}
					modelType={this.state.modelType}
					//点击确定按钮的回调函数
					onSureClick={(retPayMsg) => {
						//处理补录信息(输出参数：PaymentRetMsg[])
						this.processRetMsg(retPayMsg);
						//关闭对话框
						this.setState({
							showBuLu: false
						})
					}}
					//点击关闭按钮的回调函数
					onCloseClick={() => {
						//关闭对话框
						this.setState({
							showBuLu: false
						})
					}}>
				</PayBuluForm>

				{/* 这里是附件上传组件的使用，需要传入三个参数 */}
				<div className="nc-faith-demo-div2">
					{showUploader &&
						<NCUploader
							billId={billId}
							billNo={billno}
							onHide={this.onHideUploader}
							// beforeUpload={this.beforeUpload}
							customInterface={
								{
									queryLeftTree: '/nccloud/tmpub/pub/lefttreequery.do',
									queryAttachments: '/nccloud/sf/delivery/deliveryattachment.do'
								}
							}
						/>
					}
				</div>

				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.approveshow}
						close={() => {
							this.setState({
								approveshow: false
							})
						}}
						billtype={'36K4'}
						billid={billId}
					/>
				</div>

				{/* 联查预算 */}
				<div>
					<Inspection
						show={showNtbDetail}
						sourceData={ntbdata}
						cancel={() => {
							this.setState({ showNtbDetail: false })
						}}
						affirm={() => {
							this.setState({ showNtbDetail: false })
						}}
					/>
				</div>
				{/* 联查内部账户余额 */}
				<div>
					{showInnerAccInfo && <InnerAccoutDialog
						id="dialog"
						showModal={showInnerAccInfo}
						accpk={pk_inneracc}
						closeModal={() => {
							this.setState({
								showInnerAccInfo: false,
								pk_inneracc: ''
							})
						}}
					/>}
				</div>
				<div>
					{/* 提交即指派 */}
					{this.state.compositedisplay ? <ApprovalTrans
						title={'指派'}
						data={this.state.compositedata}
						display={this.state.compositedisplay}
						getResult={this.getAssginUsedr}
						cancel={this.compositeTurnOff}
					/> : ""}
				</div>

				<div>
					<Modal
						title={this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000090')}
						// label ='退回原因'
						/* 国际化处理： 退回*/
						label={this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000059')}
						show={showBackModal} //布尔值，true为显示，false为不显示
						onOk={(value) => {
							this.backConfirm(value);
						}}
						onClose={() => {
							this.setState({ showBackModal: false })
						}}
					/>
				</div>

				<div>
					{/* 银行账户余额 */}
					<NCCOriginalBalance
						// 补录框显示
						showmodal={this.state.showOriginal}
						showOriginalData={this.state.showOriginalData}
						// 点击确定按钮的回调函数
						onSureClick={(retOriginalMsg) => {
							////console.log(retOriginalMsg, 'retOriginalMsg')
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
				</div>

			</div>
		);
	}
}

Card = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: card_page_id,
		headcode: card_from_id,
		bodycode: card_table_id
	},
	// initTemplate: initTemplate,
	mutiLangCode: '36320FDA'
})(Card);
// ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/