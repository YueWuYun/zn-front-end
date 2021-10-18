/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, cardCache, getMultiLang, createPageIcon } from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix } = base;
//返回button
const { NCBackBtn, NCDiv } = base;
let { NCUploader, ApproveDetail, PrintOutput, Inspection } = high;
let { getNextId, getCurrentLastId, deleteCacheById, getCacheById, updateCache, addCache } = cardCache;
import { buttonClick, initTemplate, beforeEvent, afterEvent, pageInfoClick, buttonVisible } from './events';
// 网银补录
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form';
// ca
import Sign from '../../../../tmpub/pub/util/ca';
//引入联查内部账户组件
import { InnerAccoutDialog } from "../../../../tmpub/pub/inneraccount/list";
import NCCOriginalBalance from '../../../../cmp/public/restmoney/list';
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
import { saveMultiLangRes, loadMultiLang,createCardWebSocket} from "../../../../tmpub/pub/util/index";
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../pub/cons/constant';
import {
	module_id, module_name, module_tmpub_name, module_tmpub_id, appcode,
	list_search_id, list_page_id, list_table_id, button_limit,
	oid, card_page_id, card_from_id, link_card_page_id,
	card_fromtail_id, card_table_id,
	dataSourceLink,deliveryPk,deliveryBillType,link_list_page_id
} from '../cons/constant';

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = card_from_id;
		this.searchId = list_search_id;
		this.moduleId = module_id;
		this.tableId = card_table_id;
		this.pageId = link_card_page_id;
		this.state = {
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
		};
		initTemplate.call(this, props);
	}

	componentDidMount() {
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
							this.setState({
								vbillno: vbillno.value
							});
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
		// debugger;
		//查询单据详情
		if (status === 'browse') {
			let refreshcardData = getCacheById(pk, dataSourceLink);
			if (pk) {
				if (refreshcardData) {
					this.props.form.setAllFormValue({ [card_from_id]: refreshcardData.head[card_from_id] });
					this.props.cardTable.setTableData(card_table_id, refreshcardData.body[card_table_id]);
					this.setState({
						vbillno: refreshcardData.head[card_from_id].rows[0].values.vbillno.value,
					});
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
									this.setState({
										vbillno: vbillno && vbillno.value
									});
									// updateCache('pk_delivery_h', res.data.head[this.formId].rows[0].values.pk_delivery_h.value, res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
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
							this.setState({
								showNCbackBtn: true
							});
						}
					});
				}
			}
		}
		else if (status === 'edit') {
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
							this.setState({
								vbillno: vbillno.value
							});
							updateCache('pk_delivery_h', res.data.head[this.formId].rows[0].values.pk_delivery_h.value, res.data, card_from_id, dataSourceLink, res.data.head[this.formId].rows[0].values);
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
			this.setState({
				vbillno: ''
			});

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
				}
			});
		}
		//经办
		else if (status === 'decide') {
			// /清空表单form所有数据
			// this.setState({
			// 	vbillno: ''
			// });
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
							updateCache('pk_delivery_h', pk, res.data.billCard, card_from_id, dataSourceLink, res.data.billCard.head[this.formId].rows[0].values);
							// 清空相关字段
							//设置组织不可以编辑
							that.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
						}
						// 设置字段编辑性
						if (res.data.billCard.body) {
							this.props.cardTable.setTableData(that.tableId, res.data.billCard.body[this.tableId]);
							let bodyDatas = res.data.billCard.body[that.tableId].rows;
							let bodyFileEditMap = res.data.bodyFileEditMap;
							if (bodyFileEditMap) {
								for (let index = 0; index < bodyDatas.length; index++) {
									const pk_delivery_b = bodyDatas[index].values.pk_delivery_b.value;
									let fileEditMap = bodyFileEditMap[pk_delivery_b];
									for (var key in fileEditMap) {
										//每一次循环获取的属性名
										// 获取属性值 在for in 中只能通过对象名[key]来获取 不能写obj.key
										that.props.cardTable.setEditableByIndex(card_table_id, index, key, fileEditMap[key]);
									}
									// 重新设置编辑性
									this.props.cardTable.setEditableByIndex(card_table_id, index, 'pk_org_p', false);
									this.props.cardTable.setEditableByIndex(card_table_id, index, 'pk_bankacc_p', false);
									this.props.cardTable.setEditableByIndex(card_table_id, index, 'amount', false);
									this.props.cardTable.setEditableByIndex(card_table_id, index, 'olcrate', false);
								}
							}
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
			this.setState({
				vbillno: ''
			});
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
				this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });
			}
			// this.props.cardTable.addRow(this.tableId);
			// buttonVisible(this.props);
			this.toggleShow();
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
							this.setState({
								vbillno: vbillno && vbillno.value
							});
							updateCache('pk_delivery_h', res.data.head[this.formId].rows[0].values.pk_delivery_h.value, res.data, card_from_id, dataSourceLink, res.data.head[this.formId].rows[0].values);
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
					this.setState({
						showNCbackBtn: true
					});
				}
			});
		}
	}

	//切换页面状态
	toggleShow = () => {
		//按钮显隐性
		buttonVisible.call(this, this.props);
		orgVersionView(this.props, card_from_id);
		// buttonVisible(this.props);
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
					let deletenextId = getNextId(deleteid, dataSourceLink);
					//调用删除缓存数据方法
					/*
					* idname: 数据主键的命名
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
					deleteCacheById('pk_delivery_h', deleteid, dataSourceLink);
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

	changeOrgConfirm = (data) => {
		//组织
		let pk_org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
		let pk_org_dly = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
		//恢复之前的值，设置edit状态
		this.props.form.cancel(this.formId);
		this.props.form.setFormStatus(this.formId, 'edit');
		//table清楚之前的状态
		this.props.cardTable.resetTableData(this.tableId);
		this.props.cardTable.setStatus(this.tableId, 'edit');

		ajax({
			url: '/nccloud/sf/delivery/deliveryheadafterevent.do',
			data: data,
			success: (res) => {
				if (res.success) {
					if (res.data) {
						this.props.form.EmptyAllFormValue(this.formId);
						if (res.data.head) {
							//页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							//选择主组织以后，恢复其他字段的编辑性
							this.props.resMetaAfterPkorgEdit();
							// 组织可编辑
							this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });
						}
						if (res.data.body) {
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
					}
				}
			}
		});

	}

	//处理网银补录返回信息
	processRetMsg = (retMsg) => {
		let data = {
			pk: this.props.form.getFormItemsValue(this.formId, 'pk_delivery_h').value,
			ts: this.props.form.getFormItemsValue(this.formId, 'ts').value,
			results: retMsg,
			pageid: link_card_page_id,
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
								res.data, card_from_id, dataSourceLink);
							vbillno = res.data.billCard.head[card_from_id].rows[0].values.vbillno.value;
							this.setState({
								vbillno: vbillno
							});
						}
						if (res.data.billCard.bodys) {
							this.props.cardTable.setTableData(card_table_id, res.data.billCard.bodys[card_table_id]);
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
								this.setState({
									vbillno: vbillno && vbillno.value
								});
								if (saveBeforePk && saveBeforePk.value) {
									updateCache('pk_delivery_h', res.data.head[this.formId].rows[0].values.pk_delivery_h.value, res.data, card_from_id, dataSourceLink, res.data.head[this.formId].rows[0].values);
								} else {
									addCache(res.data.head[this.formId].rows[0].values.pk_delivery_h.value, res.data, card_from_id, dataSourceLink, res.data.head[this.formId].rows[0].values);
								}
							}
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							let pk_delivery_h = res.data.head[this.formId].rows[0].values.pk_delivery_h;
							let vbillno = res.data.head[this.formId].rows[0].values.vbillno;
							this.props.pushTo("/card", {
								status: 'browse',
								id: pk_delivery_h && pk_delivery_h.value,
								vbillno: vbillno && vbillno.value,
								pagecode: card_page_id,
							})
							this.toggleShow();
							this.setState({
								showNCbackBtn: true
							});
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
		this.props.pushTo("/listlinkq", {
			pagecode: link_list_page_id,
		});
	};

	render() {
		let { cardTable, form, button, modal, ncmodal, cardPagination, editTable } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createEditTable } = editTable;
		let { createButton, createButtonApp, createErrorFlag} = button;
		let { createModal } = modal;
		let createNCModal = ncmodal.createModal;

		// 附件相关内容变量
		let { showUploader, target, billno, billId, showNCbackBtn, showNtbDetail, ntbdata } = this.state;
		let { showInnerAccInfo, pk_inneracc } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		// //console.log("button:", this.props.button.getButtons());
		return (
			<div className="nc-bill-card">
				{/**创建websocket */}
				{createCardWebSocket(this.props, {
                    headBtnAreaCode: 'card_head',
                    formAreaCode: card_from_id,
                    billpkname: deliveryPk,
					billtype: deliveryBillType,
					dataSource: dataSourceLink
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
									billCode: this.state.vbillno,
									//返回按钮的点击事件 
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
							<div className='header-cardPagination-area' style={{ float: 'right' }}>
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this),
									dataSource: dataSourceLink
								})}
							</div>
						</NCDiv>
					</NCAffix>
					{/* <NCScrollElement name='forminfo'> */}
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							expandArr: [this.formId],
							onAfterEvent: afterEvent.bind(this)
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

				{createModal('delete', {
					title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000055'),/* 国际化处理： 删除确认*/
					content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000056'),/* 国际化处理： 你确定要删除吗?*/
					beSureBtnClick: this.delConfirm
				})}
				{createModal('changeorg', {
					title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000057'),/* 国际化处理： 确认修改*/
					content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000058'),/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
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
		);
	}
}

Card = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: link_card_page_id,
		headcode: card_from_id,
		bodycode: card_table_id
	},
	// initTemplate: initTemplate,
	mutiLangCode: appcode
})(Card);
// ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/