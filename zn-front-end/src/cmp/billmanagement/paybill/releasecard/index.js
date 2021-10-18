/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, print } from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix, NCButton } = base;
const { NCBackBtn } = base; //返回button
 import { buttonClick, initTemplate, pageInfoClick, afterEvent, tableButtonClick, beforeEvent } from './events';
import { cardCache } from 'nc-lightapp-front';
let { getCacheById, updateCache, addCache, getNextId, deleteCacheById } = cardCache;

import { PAYBILL_CONST } from '../cons/constant.js';
import { high } from 'nc-lightapp-front';
const { Refer, NCUploader, BillTrack, ApproveDetail, PrintOutput,Inspection } = high;
import { buttonVisible } from './events/buttonVisible';
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;


class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = 'mainform_paybill_01';
		// this.searchId = '20521030';
		this.moduleId = '2052'; //模块id
		this.tableId = 'table_paybill_01';
		this.pageId = '36070PBR_C05';
		this.state = {
			billno: '', // 单据编号
			showUploader: false,
			target: null,
			billId: '',
			tradetype: '',
			oldorg: '',
			oldorgDis: '',
			shoWIns: false,
			sourceData: null,
			tpflag: true,
			pasteflag: false,
			openflag:false,
			showNCbackBtn: false, //返回箭头
			tranferstatus: '',//转单页面状态
			outputData: {
				funcode: '36070PBR', //功能节点编码，即模板编码
				nodekey: 'NCCLOUD', //模板节点标识
				printTemplateID: '1001Z610000000004R6L', //模板id
				oids: [],
				outputType: 'output'
			}
		};
		initTemplate.call(this, props);
	}
	componentDidMount() {
		
	}

	initData = () => {
		let src = this.props.getUrlParam('src');
		if (src === 'settlement') {
			let settlePk = this.props.getUrlParam('pk_settle');
			if (settlePk) {
				this.QuerySettleData(settlePk);
			}
		} else {
			this.releaseConfirm();
		}
	};
	//到账认领
	releaseConfirm = () => {
		let release_billtype = this.props.getUrlParam('billtype');
		if (release_billtype) {
			let pkArr = this.props.getUrlParam("pks");//多个
			//请求数据
			let pkdata = {
				'pk': pkArr,
				'pageid': this.pageId,
				'billtype': release_billtype
			};
			ajax({
				url: '/nccloud/cmp/paybills/releasecard.do',
				data: pkdata,
				sync:false,
				success: (res) => {
					if (res.data) {
						this.props.transferTable.setTransferListValue('leftarea', res.data);
					}
				
				}
			});
		} else {
			this.props.transferTable.setTransferListValue('leftarea', []);
		}
	}

	QuerySettleData = (pk_settle) => {
		let sendArr = {
			pk: pk_settle,
			pageid: '36070PBR_C05'
		};
		ajax({
			url: '/nccloud/cmp/paybills/associate.do',
			data: sendArr,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							let billno = res.data.head[this.formId].rows[0].values.bill_no.value;
							let billId = res.data.head[this.formId].rows[0].values.pk_paybill.value;
							this.setState({
								billno: billno,
								billId: billId
							});
							//来源系统翻译
							this.sourceFlagTranslate(res.data.head);
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						//保存缓存
						addCache(billId, res.data, PAYBILL_CONST.card_from_id, PAYBILL_CONST.paybillCacheKey);
						this.toggleShow();
					}
				}
			}
		});
	};

	releasetoggleShow = (isEdit) => {
		debugger;

		let status = isEdit;
		let flag = status === 'browse' ? false : true;
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		this.props.form.setFormStatus(this.formId, status);
		this.props.cardTable.setStatus(this.tableId, status);
		if (status == 'browse') {
			this.setState({
				showNCbackBtn: true,
				tranferstatus: status//转单页面状态
			})
			this.props.cardTable.setStatus(this.tableId, 'browse');
			this.props.button.setButtonVisible(
				[ 'editBtn','quitBtn' ],
				true
			);
			this.props.button.setButtonVisible(
				[ 'saveBtn','cancelBtn','delline' ],
				false
			);
		
		} else {
			this.setState({
				showNCbackBtn: false,
				tranferstatus: status////转单页面状态
			})
			this.props.cardTable.setStatus(this.tableId, 'edit');
			this.props.button.setButtonVisible(
				[ 'editBtn'],
				false
			);
			this.props.button.setButtonVisible(
				[ 'saveBtn','quitBtn','cancelBtn','delline' ],
				true
			);
		}
		//组织之外的字段不可以编辑
		if (status === 'add') {
			this.props.initMetaByPkorg();
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });//财务组织
		}
		if (status === 'edit') {
			this.props.resMetaAfterPkorgEdit();

		}
		if (status === 'copy') {
			this.props.resMetaAfterPkorgEdit();
		}

		// releaseButtonVisable.call(this, this.props, status);//认领转单按钮的显隐性
	};

	pageShow = () => {
		if (this.props.getUrlParam('status') === 'add') {
			debugger;
			this.toggleShow();
			//清空表格
			this.props.form.EmptyAllFormValue('head');
			let data = {
				pageid: '36070PBR_C05'
			};
			ajax({
				url: '/nccloud/cmp/paybills/paybillconstructor.do',
				data: data,
				success: (res) => {
					if (res.success) {
						if (res.data) {
							if (res.data.head) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								if (
									this.props.getUrlParam('tradetypepk') &&
									this.props.getUrlParam('tradetypename')
								) {
									this.props.form.setFormItemsValue('head', {
										pk_tradetypeid: {
											value: this.props.getUrlParam('tradetypepk'),
											display: this.props.getUrlParam('tradetypename')
										}
									});
									
										this.props.form.setFormItemsValue('head', {
											trade_type: {
												value: this.props.getUrlParam('tradetypecode'),
												display: this.props.getUrlParam('tradetypecode')
											}
										});
									
								}
								//来源系统翻译
								this.sourceFlagTranslate(res.data.head);
							}
							this.setState({
								billno: '',
								billId: ''
							});
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
								//this.props.cardTable.setStatus(this.tableId, 'edit');
							}
						} else {
							this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
							this.props.cardTable.setTableData(this.tableId, { rows: [] });
						}
					}
				}
			});
		}
		//查询单据详情
		//浏览 browse
		if (this.props.getUrlParam('status') == 'browse') {
			if (this.props.getUrlParam('op') == 'cancel') {
				//设置按钮
				this.props.button.setButtonVisible(
					[ 'save', 'saveadd', 'savecommit', 'cancel', 'file', 'addline', 'delline', 'copyline' ],
					false
				);
				//设置按钮
				this.props.button.setButtonVisible([ 'add' ], true);
				this.setState({
					tpflag: true,
					showNCbackBtn: true,
					billno: ''
				});
				this.props.form.EmptyAllFormValue(this.formId);
				this.props.cardTable.resetTableData(this.tableId);
				this.props.form.setFormStatus(this.formId, 'browse');
			} else {
				let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
				// let cardData = getCacheById(this.props.getUrlParam('id'), PAYBILL_CONST.paybillCacheKey);
				// if (cardData) {
				// 	this.props.form.setAllFormValue({ [this.formId]: cardData.head[PAYBILL_CONST.card_from_id] });
				// 	this.props.cardTable.setTableData(this.tableId, cardData.body['paybilldetail_table']);
				// } else {
					ajax({
						url: '/nccloud/cmp/billmanagement/querybypk.do',
						data: data,
						success: (res) => {
							if (res.data) {
								if (res.data.head) {
									this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
									let billno = res.data.head[this.formId].rows[0].values.bill_no.value;
									let billId = res.data.head[this.formId].rows[0].values.pk_paybill.value;
									let bill_status = this.setState({
										billno: billno,
										billId: billId
									});
									//来源系统翻译
									let tanfer_source_flag = record.head[this.formId].rows[0].values.source_flag;
									this.sourceFlagTranslate(tanfer_source_flag);
								}
								if (res.data.body) {
									this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
								}
								this.toggleShow();
							} else {
								this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
								this.props.cardTable.setTableData(this.tableId, { rows: [] });
							}
						}
					});
				//}
			}
		}
		if (this.props.getUrlParam('status') === 'edit') {
			let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
			ajax({
				url: '/nccloud/cmp/billmanagement/querybypk.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
							let billno = res.data.head[this.formId].rows[0].values.bill_no.value;
							let billId = res.data.head[this.formId].rows[0].values.pk_paybill.value;
							this.setState({
								billno: billno,
								billId: billId
							});
							//来源系统翻译
							this.sourceFlagTranslate(res.data.head);
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}

						this.toggleShow();
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					//设置组织不可以编辑
					this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
				}
			});
		}
		//浏览edit
		//copy
		if (this.props.getUrlParam('status') === 'copy') {
			//let data = { pk: [ this.props.getUrlParam('id') ], pageid: '36070WC_C01' };
			let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
			ajax({
				url: '/nccloud/cmp/paybills/copy.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
							let billno = res.data.head[this.formId].rows[0].values.bill_no.value;
							this.setState({
								billno: billno
							});
							//来源系统翻译
							this.sourceFlagTranslate(res.data.head);
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						this.toggleShow();
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					//设置组织不可以编辑
					this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
				}
			});
		} else {
			//this.props.cardTable.addRow(this.tableId);
		}
		//浏览edit
		//copy
		if (this.props.getUrlParam('status') === 'reverse') {
			//let data = { pk: [ this.props.getUrlParam('id') ], pageid: '36070WC_C01' };
			let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
			ajax({
				url: '/nccloud/cmp/paybills/reverse.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
							//来源系统翻译
							this.sourceFlagTranslate(res.data.head);
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						this.toggleShow();
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					//设置组织不可以编辑
					this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
				}
			});
		}
	};
	sourceFlagTranslate = (sourceFlag) => {
		if (sourceFlag) {
			let val = sourceFlag.value;
			switch (val) {
				case '2':
				this.props.form.setFormItemsValue(this.formId, {
						source_flag: {
							value: val,
							display: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000019')/* 国际化处理： 现金管理*/
						}
					});
					break;
				case '9':
					this.props.form.setFormItemsValue(this.formId, {
						source_flag: {
							value: val,
							display: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000020')/* 国际化处理： 协同单据*/
						}
					});
					break;
				case '5':
					this.props.form.setFormItemsValue(this.formId, {
						source_flag: {
							value: val,
							display: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000021')/* 国际化处理： 资金结算*/
						}
					});
					break;
				case '8':
					this.props.form.setFormItemsValue(this.formId, {
						source_flag: {
							value: val,
							display: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000022')/* 国际化处理： 票据管理*/
						}
					});
					break;
				case '6':
					this.props.form.setFormItemsValue(this.formId, {
						source_flag: {
							value: val,
							display: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000023')/* 国际化处理： 网上银行*/
						}
					});
					break;
			}
		}
	};

	newPageShow = () => {
		//币种
		//this.props.form.setFormItemsValue(this.formId, { pk_currtype: { display: '人民币', value: '1002Z0100000000001K1' } });
		//新增表格自动添加一行
		//this.props.cardTable.addRow(this.tableId);
		//this.props.cardTable.setValByKeyAndIndex(this.tableId, 0, 'pk_currtype', {  value: '1002Z0100000000001K1', display: '人民币'});
		//无组织 不可编辑性设置
		// let meta = this.props.meta.getMeta();
		// this.props.meta.setMeta(meta['head'],this.props.initMetaByPkorg);
	};

	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam('status');
		let flag = status === 'browse' ? false : true;
		if (flag) {
			this.props.cardTable.setStatus(this.tableId, 'edit');
			this.props.form.setFormStatus(this.formId, 'edit');
			this.setState({
				tpflag: false,
				showNCbackBtn: false
			});
			
		} else {
			this.props.cardTable.setStatus(this.tableId, status);
			this.props.form.setFormStatus(this.formId, status);
			this.setState({
				tpflag: true,
				showNCbackBtn: true
			});
		}
		//组织之外的字段不可以编辑
		if (status === 'add') {
			this.props.initMetaByPkorg();
			this.props.form.setFormItemsDisabled(this.formId, { pk_org: false }); //财务组织
		}
		if (status === 'copy') {
			this.props.form.setFormItemsDisabled(this.formId, { pk_org: true }); //财务组织
		}
		buttonVisible.call(this, this.props);
		//this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag); //设置看片翻页的显隐性
	};
	//保存校验
	saveBeforeEvent = (CardData) => {
		let headData = CardData.head[this.formId].rows[0];
		let i = 0;
		if (headData.values.mon_account.value) {
			i = i + 1;
		}
		if (headData.values.note_no.value) {
			i = i + 1;
		}
		if (headData.values.pk_oppaccount.value) {
			i = i + 1;
		}
		if (i > 1) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000024') });/* 国际化处理： 票据号、银行账户、现金账户不能同时有值*/
			return false;
		}

		let checkData = CardData.body[this.tableId].rows;
		if (checkData.length == 0) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000094') });/* 国际化处理： 请检查必输项是否填写*/
			return false;
		}

		for (let item of checkData) {
			if (!item.values.pay_local.value) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000094') });/* 国际化处理： 请检查必输项是否填写*/
				return false;
			}
		}
		return true;
	};

	//保存单据
	saveBill = () => {
		if (this.props.getUrlParam('copyFlag') === 'copy') {
			this.props.form.setFormItemsValue(this.formId, { pk_paybill: null });
			this.props.form.setFormItemsValue(this.formId, { ts: null });
		}
		//过滤表格空行
		//校验表单必输字段
		let flag = this.props.form.isCheckNow(this.formId);
		if (!flag) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000094') });/* 国际化处理： 请检查必输项是否填写*/
			return;
		}

		let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);

		let checkFlag = this.saveBeforeEvent(CardData);

		if (!checkFlag) {
			return;
		}
		let url = '/nccloud/cmp/paybills/save.do'; //新增保存
		// let cacheFlag = true;
		if (this.props.getUrlParam('status') === 'edit'&& this.props.form.getFormItemsValue('head', 'pk_paybill').value) {
			url = '/nccloud/cmp/paybills/update.do'; //修改保存
		
		}
		if (this.props.getUrlParam('status') === 'edit' && this.props.getUrlParam('src') === 'settlement') {
			url = '/nccloud/cmp/paybills/save.do';
		
		}
		if (this.props.getUrlParam('status') === 'edit' && this.props.getUrlParam('op') === 'protopay') {
			url = '/nccloud/cmp/paybills/commisionpay.do'; //承付修改
	
		}
		if (this.props.getUrlParam('status') === 'edit' && this.props.getUrlParam('op') === 'unprotopay') {
			url = '/nccloud/cmp/paybills/canlecompay.do'; //承付修改
		
		}
		ajax({
			url: url,
			data: CardData,
			success: (res) => {
				let pk_paybill = null;
				let pagecode = '';
				let bill_no = '';
				let bill_pk = '';
				if (res.success) {
					if (res.data) {
						//放入缓存
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000005') });/* 国际化处理： 保存成功*/
						if (res.data.head && res.data.head[this.formId]) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							pk_paybill = res.data.head[this.formId].rows[0].values.pk_paybill.value;
							bill_no = res.data.head[this.formId].rows[0].values.bill_no.value;
							pagecode = res.data.head[this.formId].rows[0].values.trade_type.value;
							bill_pk = res.data.head[this.formId].rows[0].values.pk_paybill.value;
							let ntbMessage = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
							if (ntbMessage) {
								toast({
									color: 'warning',
									content: ntbMessage
								});
							}
						}
						this.setState({
							billno: bill_no
						});
						if (res.data.body && res.data.body[this.tableId]) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}

						this.updateCacheData(PAYBILL_CONST.paybill_pkname,bill_pk, res.data, PAYBILL_CONST.card_from_id, PAYBILL_CONST.paybillCacheKey);
		
					}
				}
				//this.props.pushTo("/card",{status:"browse",id: pk_paybill,pagecode: pagecode});
				this.props.setUrlParam({
					status: 'browse',
					id: pk_paybill
					//pagecode: pagecode
				});
				this.toggleShow();
				this.releasetoggleShow('browse');
			}
		});
	};

	cardConstructor = (key) => {};

	//删除单据
	delConfirm = () => {
		let deleteId = this.props.getUrlParam('id');
	    let pkMapTs = {};
		pkMapTs[deleteId] = this.props.form.getFormItemsValue(this.formId, 'ts').value;
		let data={
			pkMapTs,
			pageid:PAYBILL_CONST.card_page_id,
			pk:deleteId
		}
		ajax({
			url: '/nccloud/cmp/billmanagement/delete.do',
			data:data,
			// data: {
			// 	pk: deleteId,
			// 	ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
			// },
			success: (res) => {
				if (res.success) {
					toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000028') });/* 国际化处理： 删除成功*/

					//let idObj = { id: this.props.getUrlParam('id'), status: 3 };
					let url_id = getNextId(deleteId, PAYBILL_CONST.paybillCacheKey);
					//删除缓存
					deleteCacheById(PAYBILL_CONST.paybill_pkname, deleteId, PAYBILL_CONST.paybillCacheKey);
					//let url_id = this.props.cardPagination.getNextCardPaginationId(idObj);
					if (!url_id) {
						//设置按钮
						this.props.button.setButtonVisible(
							[
								'copy',
								'Associate',
								'edit',
								'delete',
								'commit',
								'uncommit',
								'BaseImagegroup',
								'moreopr',
								'Refresh'
							],
							false
						);
						//设置按钮
						//this.props.button.setButtonVisible([ 'add' ], true);
						this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
						this.setState({
							tpflag: true,
							showNCbackBtn: true,
							billno: ''
						});
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.form.setFormStatus(this.formId, 'browse');

						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					} else {
						let cardData = getCacheById(url_id, PAYBILL_CONST.paybillCacheKey);
						if (cardData) {
							this.props.form.setAllFormValue({
								[this.formId]: cardData.head[PAYBILL_CONST.card_from_id]
							});
							this.props.cardTable.setTableData(this.tableId, cardData.body['paybilldetail_table']);
						} else {
							pageInfoClick.call(this, this.props, url_id);
						}
						//this.props.cardPagination.setCardPaginationId(idObj);
						//pageInfoClick.call(this, this.props, url_id);
					}
				}
			}
		});
	};

	//审批按钮操作事件
	approveRadio = (val) => {
		this.setState(
			{
				approveType: val
			},
			() => console.log(this.state)
		);
	};
	//输入意见输入框
	suggestChange = (val) => {
		this.setState({
			suggestion: val
		});
	};
	createApprove = () => {
		//审批流程
		let { approveDetail } = this.props;
		let { ApproveDetails, approveType, approveList, suggestion, billID } = this.state;
		return approveDetail.create('demo1', {
			data: ApproveDetails,
			approveType,
			suggestion,
			approveList,
			needInput: true,
			approveRadio: this.approveRadio.bind(this),
			suggestChange: this.suggestChange.bind(this),
			billID
		});
	};
	//审批单据
	approve = (name) => {
		let { approveType, suggestion, ApproveDetails } = this.state;
		let approveResult =
			approveType == 'approve' ? 'Y' : approveType == 'Noapprove' ? 'N' : approveType == 'reject' ? 'R' : '';
		let jumpToActivity = approveType == 'approve' ? null : ApproveDetails[ApproveDetails.length - 2].activityID;
		let data = {
			approveResult,
			jumpToActivity,
			checknote: suggestion,
			billid: this.props.form.getFormItemsValue(this.formId, 'crevecontid').value,
			ts: this.props.form.getFormItemsValue(this.formId, 'ts').value,
			billOrTranstype: this.props.form.getFormItemsValue(this.formId, 'vtrantypecode').value,
			//hasApproveflowDef: this.props.form.getFormItemsValue(this.formId, 'bcloseflag').value,
			userid: '1001A41000000000592P',
			actionname: name ? name : 'APPROVE'
		};
		ajax({
			url: '/nccloud/reva/revebill/approve.do',
			data,
			success: (res) => {
				if (res.data) {
					console.log(res);
				}
			}
		});
	};
	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add') {
			return 'main-button';
		} else {
			return 'secondary-button';
		}
	};
	//获取列表肩部信息

	//获取列表肩部信息
	getTableHead = (buttons, tableId) => {
		let { createButton } = this.props.button;
		return (
			<div className="shoulder-definition-area">
				{/* <div className="definition-search">
				<span className="definition-search-title">调入资产信息</span>
				<span>
					<NCFormControl
						className="definition-search-handel"
						type={'search'}
						placeholder={''}
						onChange={this.handelChange}
					/>
				</span>
				<span>列设置</span>
			</div> */}
				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(tableId, {
						iconArr: [ 'close', 'open', 'max' ],
						maxDestAreaId: 'finance-fts-commissionpayment-card'
					})}
					{this.props.button.createButtonApp({
						area: 'card_body',
						buttonLimit: 4,
						onButtonClick: buttonClick.bind(this),
						popContainer: document.querySelector('.header-button-area')
					})}
				</div>
			</div>
		);
	};
	beSureBtnClick = () => {
		let pk_org = this.props.form.getFormItemsValue('head', 'pk_org').value;
		let pk_org_dis = this.props.form.getFormItemsValue('head', 'pk_org').display;
		this.props.form.cancel('head');

		this.props.form.setFormItemsValue('head', {
			pk_org: {
				value: pk_org,
				display: pk_org_dis
			}
		});
		this.props.form.setFormStatus(this.formId, 'edit');
		this.props.cardTable.resetTableData(this.tableId);
		this.props.cardTable.setStatus(this.tableId, 'edit');
		let eventdata = {};
		if (!pk_org) {
			this.props.initMetaByPkorg();
		} else {
			eventdata = this.props.createHeadAfterEventData(
				'36070PBR_C05',
				'head',
				'paybilldetail_table',
				'head',
				'pk_org',
				this.value
			);
			eventdata.newvalue = {};
			eventdata.oldvalue = {};
			//eventdata.card.head.head.rows[0].values.pk_org.value=pk_org;
			//eventdata.card.head.head.rows[0].values.pk_org.display=pk_org_dis;
			ajax({
				url: '/nccloud/cmp/paybills/orgchange.do',
				data: eventdata,
				success: (res) => {
					if (res.success) {
						if (res.data) {
							if (res.data.head) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							}
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
						} else {
							this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
							this.props.cardTable.setTableData(this.tableId, { rows: [] });
						}
					}
				}
			});
		}
		//清空表格
		//this.props.form.EmptyAllFormValue('head');
	};
	cancelBtnClick = () => {
		console.log(this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000029'), this.state.oldorg);/* 国际化处理： 修改之前的财务组织*/
		this.props.form.setFormItemsValue('head', {
			pk_org: { value: this.state.oldorg, display: this.state.oldorgDis }
		});
		this.props.form.setFormStatus(this.formId, 'edit');
	};
	beforeUpload(billId, fullPath, file, fileList) {
		// 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
		console.log(billId, fullPath, file, fileList);

		const isJPG = file.type === 'image/jpeg';
		if (!isJPG) {
			alert(this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000030'));/* 国际化处理： 只支持jpg格式图片*/
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			alert(this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000031'));/* 国际化处理： 上传大小小于2M*/
		}
		return isJPG && isLt2M;
		// 备注： return false 不执行上传  return true 执行上传
	}
	cancel = () => {
		this.setState({
			shoWIns: false
		});
	};
	affirm = (info) => {
		console.log(info);
		this.setState({
			shoWIns: false
		});
	};
	click = () => {
		// alert('1');
		// this.setState({
		//  sourceData: text1,
		//  show: true
		// })
	};
	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	}; //卡片返回按钮

	handleClick = () => {
		//先跳转列表
		this.props.pushTo('/list');
	};
	cancelReleaseConfirm = () => {
		this.props.linkTo('/cmp/informerrelease/SscRelease/list/index.html', {
			appcode: '36070AIPSSC',
			pagecode: '36070AIPSSC_L01',
		});
	}
	 updateCacheData= (pk_field, pkvalue, cacheData, moduleId, datasource) =>{
        let cache = getCacheById(pkvalue, datasource);
	    if (!cache) {
		updateCache(pk_field, pkvalue, cacheData, moduleId, datasource);
	} else{
		addCache(pkvalue, cacheData, moduleId, datasource);
	 }	 
	 }

	 buttonUsability= () => {
		let Rows =this.props.cardTable.getCheckedRows(this.tableId);
	   if(Rows&&Rows.length>=1){
		 this.props.button.setButtonDisabled( ['delline'],false)
	  } else{
		  this.props.button.setButtonDisabled( ['delline'],true)
	  }
	 };

	render() {
		let { cardTable, form, button, modal, cardPagination,transferTable } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButton, createButtonApp ,createErrorFlag} = button;
		const { ncmodal } = this.props;
		let { createModal } = ncmodal;
		const { createTransferList } = transferTable;
		let { showUploader, target, billno, billId, tradetype, shoWIns, sourceData, showNCbackBtn } = this.state;
		return (
			<div id="transferCard" className="nc-bill-transferList">
				{/**创建websocket */}
				{api.comm.createCardWebSocket(this.props, {
					headBtnAreaCode: cons.card.btnHeadCode,
					formAreaCode: cons.card.headCode,
					billpkname: cons.field.pk,
					billtype: cons.comm.billType
					// serverLocation: '10.16.2.231:9991'
				})}	
			<div className="nc-bill-header-area">
				<div className="header-title-search-area">
					<h2 className='title-search-detail'>{this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000097')}{this.state.billno}</h2></div>
				<div className="header-button-area">
					{createErrorFlag({
						headBtnAreaCode: cons.card.btnHeadCode
					})}
					{createButtonApp({
						area:'card_head',
						buttonLimit: 10,
						onButtonClick: buttonClick.bind(this)
					})}
				</div>
			</div>
			<div className="nc-bill-transferList-content">
					{createTransferList({
						//表格组件id
						headcode: this.formId,
						transferListId: 'leftarea', //转单列表id
						onTransferItemSelected: (record, status) => {
							//初次加载第一个默认页面
							let isEdit = status ? 'browse' : 'edit';
							if(isEdit==='browse'){
								this.props.setUrlParam({status:'browse'})
							}
							this.releasetoggleShow(isEdit);
							this.props.button.setButtonDisabled( ['delline'],true);
							if(isEdit==='edit'){
								this.props.form.setAllFormValue({
									[this.formId]: record.head[this.formId]
								});
							}
							this.props.form.setFormItemsDisabled(this.formId, { pk_org: true }); //财务组织、
							if(record.head[this.formId].rows[0].values.bill_no&&record.head[this.formId].rows[0].values.bill_no.value){
								this.setState({
									billno: ':'+record.head[this.formId].rows[0].values.bill_no.value,
									billId:record.head[this.formId].rows[0].values.pk_paybill.value,
									openflag: true
								});
							}
							let tanfer_source_flag = record.head[this.formId].rows[0].values.source_flag;
							if(isEdit==='edit'){
								this.props.cardTable.setTableData('table_paybill_01', record.body['table_paybill_01']);
								
							}
						
							this.sourceFlagTranslate(tanfer_source_flag);
							
						},
						onTransferItemClick: (record, index, status) => {
							// this.props.setUrlParam({status:'browse'})//方法不好用舍弃
							// let checkstatus = this.props.getUrlParam('status');
							//切换缩略图
							let isEdit = status ? 'browse' : 'edit';
							if(isEdit==='browse'){
								this.props.setUrlParam({status:'browse'})
							}
							this.releasetoggleShow(isEdit);

							this.props.form.setAllFormValue({ [this.formId]: record.head[this.formId] });
							this.props.form.setFormItemsDisabled(this.formId, { pk_org: true }); //财务组织、
							if(record.head[this.formId].rows[0].values.bill_no&&record.head[this.formId].rows[0].values.bill_no.value){
								this.setState({
									billno: ':'+record.head[this.formId].rows[0].values.bill_no.value,
									billId:record.head[this.formId].rows[0].values.pk_paybill.value,
									openflag: true
								});
							}
							this.props.cardTable.setTableData(this.tableId, record.body[this.tableId]);
					
							let tanfer_source_flag = record.head[this.formId].rows[0].values.source_flag;
							this.sourceFlagTranslate(tanfer_source_flag);
							
						}
					})}
					<div className="transferList-content-right nc-bill-card" id="paybill-card">
						<NCScrollElement name='forminfo'>
							<div className="nc-bill-form-area">
								{createForm(this.formId, {
									expandArr: ["mainform_paybill_01"],
									onAfterEvent: afterEvent.bind(this)
								})}
							</div>
						</NCScrollElement>
				<NCScrollElement name="businfo">
					<div className="nc-bill-bottom-area">
						<div className="nc-bill-table-area">
							{/* {this.getTableHead(buttons, this.tableId)} */}
							{createCardTable(this.tableId, {
								tableHead: this.getTableHead.bind(this, buttons, this.tableId),
								modelSave: ()=>{
									this.saveBill();
									this.props.cardTable.closeModel(PAYBILL_CONST.release_table_id);
								},
								onAfterEvent: afterEvent.bind(this),
								showCheck: true,
								showIndex: true,
								onSelected:this.buttonUsability.bind(this),
								onSelectedAll:this.buttonUsability.bind(this),
							})}
						</div>
					</div>
				</NCScrollElement>
				{createModal('delete', {
					title: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000035'), // 弹框表头信息/* 国际化处理： 确认删除*/
					content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000036'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除所选数据吗?*/
					beSureBtnClick: this.delConfirm, //点击确定按钮事件
					//cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000037'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
					leftBtnName: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000038') //右侧按钮名称， 默认确认/* 国际化处理： 确认*/
				})}
				{createModal('cancelModal', {
					title: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000039'), // 弹框表头信息/* 国际化处理： 确认取消*/
					content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000040'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否确认取消*/
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000037'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
					leftBtnName: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000038') //右侧按钮名称， 默认确认/* 国际化处理： 确认*/
				})}
				{createModal('addNode', {
					title: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000041'), // 弹框表头信息/* 国际化处理： 确认修改*/
					content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000042'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					beSureBtnClick: this.beSureBtnClick, //点击确定按钮事件
					cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000037'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
					leftBtnName: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000038') //右侧按钮名称， 默认确认/* 国际化处理： 确认*/
				})}
				{createModal('cancelRelease', {
							title: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000095'),/* 国际化处理： 提示*/
							content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000096'),/* 国际化处理： 确定要退出认领吗?*/
							beSureBtnClick: this.cancelReleaseConfirm
						})}
			</div>
			</div>
			</div>
		);
	}
}

// Card = createPage({
// 	billinfo: {
// 		billtype: 'card',
// 		pagecode: PAYBILL_CONST.card_page_id,
// 		headcode: PAYBILL_CONST.card_from_id,
// 		bodycode: PAYBILL_CONST.card_table_id
// 	}
// })(Card);
// export default Card;

 Card = createPage({
// 	// initTemplate: initTemplate,
	mutiLangCode: '36070PBR'
 })(Card);
 ReactDOM.render(<Card />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/