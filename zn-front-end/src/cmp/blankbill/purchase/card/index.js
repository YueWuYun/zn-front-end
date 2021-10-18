/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, print, getMultiLang, promptBox } from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix, NCButton, NCDiv } = base;
const { NCBackBtn } = base; //返回button
import { buttonClick, initTemplate, pageInfoClick, afterEvent, beforeEvent} from './events';
import { cardCache } from 'nc-lightapp-front';
let { getCacheById, updateCache, addCache, getNextId, deleteCacheById } = cardCache;
import { high } from 'nc-lightapp-front';
const { PrintOutput } = high;
import { buttonVisible } from './events/buttonVisible';
import { orgVersionView } from '../../../../tmpub/pub/util/version/index.js'; //多版本显示
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
import { BBP_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../cons/constant.js';
const {APPCODE,LIST_PAGECODE, CARD__PAGECODE, CARD_TABLECODE, CARD_FORMCODE, FORM_BBP_02} = APP_INFO;
const { PK_NAME, VBILLNO, PK_ORG, TS } = BILL_FIELD;
const { BBP_CACHEKEY, AGGVO_CLASSNAME, VO_CLASSNAME } = BBP_CONST;
const { DELETE, SAVE, ORGCHANGE } = REQUEST_URL;
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = CARD_FORMCODE;
		this.moduleId = APPCODE; //模块id
		this.tableId = CARD_TABLECODE;
		this.pageId = CARD__PAGECODE;
		this.billno = '';
		this.billId = '';
		this.formVOClassName = VO_CLASSNAME;//form表单的vo类名
		this.tableVOClassName = AGGVO_CLASSNAME;//table表体的vo类名
		this.tradeType = '';
		this.state = {
			billtype: '',
			tradetype: '',
			oldorg: '',
			oldorgDis: '',
			shoWIns: false,
			sourceData: null,
			pasteflag: false,
			billCodeModalShow: false,
			billCode: '',
			openflag: 'true',
			show: false,
			outputData: '',
			json: {}, // 多语

		};
	}
	componentDidMount() {
		
	};
	
	initData = () => {
		this.pageShow();
	};
	componentWillMount() {

		let callback = (json) => {
			this.setState({ json });
			saveMultiLangRes(this.props,json);//缓存多语资源
			initTemplate.call(this, this.props);
		};
		getMultiLang({ moduleId:{ 
			 [ 'tmpub']:['3601'],
			 ['cmp']: [APPCODE, '36070']
			} , callback });
		// 关闭浏览器
		window.onbeforeunload = () => {
			let closeStatus =this.props.getUrlParam('status');
			if (closeStatus&&closeStatus!= 'browse') {
				return '';
			}
		};
		
	};

	pageShow = () => {
		if (this.props.getUrlParam('status') === 'add') {
			//清空表格
			this.props.form.EmptyAllFormValue(CARD_FORMCODE);
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
			let data = {
				pageid: CARD_TABLECODE
			};
			ajax({
				url: REQUEST_URL.ADDEVENT,
				data: data,
				success: (res) => {
					if (res.success) {
						if (res.data) {
							if (res.data.head) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								// 					//来源系统翻译
							}
							let pk_org = res.data.head[this.formId].rows[0].values[PK_ORG];
							if (res.data.body && pk_org && pk_org.value) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							this.billno = '';
							this.billId = '';
							this.toggleShow();
							// 				//}
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
				this.billno = '';
				this.props.form.EmptyAllFormValue(this.formId);
				this.props.cardTable.setTableData(this.tableId, { rows: [] });
				this.toggleShow();
			} else {
				let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
				ajax({
					url: REQUEST_URL.QUERYCARD,
					data: data,
					success: (res) => {
						if (res.data) {
							 let billId;
							if (res.data.head) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								let billno = res.data.head[this.formId].rows[0].values[VBILLNO].value;
							    billId = res.data.head[this.formId].rows[0].values[PK_NAME].value;
								this.billno = billno;
								this.billId = billId;
							}
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							// 增加缓存
							//addCache(billId, res.data, CARD_FORMCODE, BBP_CACHEKEY);
							this.toggleShow();
						} else {
							this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
							this.props.cardTable.setTableData(this.tableId, { rows: [] });
						}
					},
					error: (res) => {
						toast({
							color: 'warning',
							content:res.message
						});
						this.billno = '';
						this.billId='';
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
                        this.toggleShow();
					}
				});
				//}
			}
		}
		if (this.props.getUrlParam('status') === 'edit') {
			let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
			ajax({
				url: REQUEST_URL.QUERYCARD,
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
							let bill_no = res.data.head[this.formId].rows[0].values[VBILLNO].value;
							this.billno = bill_no;
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							this.setPknoteVal.call(this);
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

	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam('status');
		let auto= this.props.getUrlParam('auto');
		let flag = status === 'browse' ? false : true;

		if (flag) {
			this.props.cardTable.setStatus(this.tableId, 'edit');	
			this.props.form.setFormStatus(this.formId, 'edit');
		} else {
			this.props.cardTable.setStatus(this.tableId, status);
			this.props.form.setFormStatus(this.formId, status);
		}
		//组织之外的字段不可以编辑
		if (status === 'add') {
			let pk_org = this.props.form.getFormItemsValue(CARD_FORMCODE, 'pk_org');
			this.props.ViewModel.setData('status', status);
			if (!pk_org || !pk_org.value) {
				this.props.form.setFormItemsDisabled(this.formId, { pk_org: false }); //财务组织、
				this.props.resMetaAfterPkorgEdit();
				this.props.initMetaByPkorg();
				this.setFildDisabled();
			} else {
				this.props.resMetaAfterPkorgEdit();
				this.setFildDisabled();
			}
		}

		if (status === 'browse') {
			this.props.ViewModel.setData('status', status);
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true&&!auto, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.billno //修改单据号---非必传
			});
		} else if (status === 'edit') {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
			this.props.resMetaAfterPkorgEdit();
			this.setFildDisabled();
			// this.props.initMetaByPkorg();
		} else {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
		}
		buttonVisible.call(this, this.props);
		// this.buttonUsability.call(this);
		orgVersionView.call(this, this.props, CARD_FORMCODE, PK_ORG, 'pk_org_v'); //多版本视图显隐性
		//pk_note 赋值
		//this.setPknoteVal();
		//this.protoPayInfo();
		//this.forceUpdate();
	};
	//保存校验
	// saveBeforeEvent = (CardData) => {
	// 	let headData = CardData.head[this.formId].rows[0];
	// 	let i = 0;
	// 	if (headData.values.mon_account.value) {
	// 		i = i + 1;
	// 	}
	// 	if (headData.values.note_no.value) {
	// 		i = i + 1;
	// 	}
	// 	if (headData.values.pk_oppaccount.value) {
	// 		i = i + 1;
	// 	}
	// 	if (i > 1) {
	// 		toast({
	// 			color: 'warning',
	// 			content: this.state.json['36070BBP-000024']
	// 		}); /* 国际化处理： 票据号、银行账户、现金账户不能同时有值*/
	// 		return false;
	// 	}

	// 	let checkData = CardData.body[this.tableId].rows;
	// 	if (checkData.length == 0) {
	// 		toast({
	// 			color: 'warning',
	// 			content: this.state.json['36070BBP-000025']
	// 		}); /* 国际化处理： 请检查必输项是否填写22*/
	// 		return false;
	// 	}

	// 	for (let item of checkData) {
	// 		if (!item.values.pay_local.value) {
	// 			toast({
	// 				color: 'warning',
	// 				content: this.state.json['36070BBP-000026']
	// 			}); /* 国际化处理： 请检查必输项是否填写33*/
	// 			return false;
	// 		}
	// 	}
	// 	return true;
	// };
	//保存校验
	// protoPayCheck = (CardData) => {
	// 	let checkData = CardData.body[this.tableId].rows;
	// 	if (checkData.length == 0) {
	// 		toast({
	// 			color: 'warning',
	// 			content: this.state.json['36070BBP-000025']
	// 		}); /* 国际化处理： 请检查必输项是否填写22*/
	// 		return true;
	// 	}

	// 	for (let item of checkData) {
	// 		if (!item.values.cf_type || !item.values.cf_type.value) {
	// 			toast({
	// 				color: 'warning',
	// 				content: this.state.json['36070BBP-000101']
	// 			}); /* 国际化处理： 请检查必输项是否填写33*/
	// 			return true;
	// 		}
	// 	}
	// };
	setPknoteVal = () => {
		let rowNum = this.props.cardTable.getNumberOfRows(CARD_TABLECODE); //表体table行数
		for (let i = 0; i < rowNum; i++) {
			let pk_note = this.props.cardTable.getValByKeyAndIndex(CARD_TABLECODE, i, 'note_no');
			if (pk_note) {
				this.props.cardTable.setValByKeyAndIndex(CARD_TABLECODE, i, 'pk_note', {
					value: pk_note.value,
					display: pk_note.display
				});
			} else {
				this.props.cardTable.setValByKeyAndIndex(CARD_TABLECODE, i, 'pk_note', {
					value: null,
					display: null
				});
			}
		}
	};
  
	//保存单据
	saveBill = () => {
		if (this.props.getUrlParam('copyFlag') === 'copy') {
			this.props.form.setFormItemsValue(this.formId, { pk_paybill: null });
			this.props.form.setFormItemsValue(this.formId, { ts: null });
		}
		//过滤表格空行
		//校验表单必输字段
		let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);

		let flag = this.props.form.isCheckNow(this.formId);
		if (!this.props.cardTable.checkTableRequired(this.tableId)) {
			return;
		}
		if (!flag) {
			return;
		}

		let url = SAVE; //新增保存
		let cacheFlag = true;
		if (this.props.getUrlParam('status') === 'edit') {
			// url = '/nccloud/cmp/paybills/update.do'; //修改保存
			cacheFlag = false;
		}
		ajax({
			url: url,
			data: CardData,
			success: (res) => {
				let pk_paybill = null;
				let pagecode = '';
				let bill_no = '';
				if (res.success) {
					if (res.data) {
						//放入缓存
						toast({
							color: 'success',
							content:  this.state.json['36070BBP-000005']
						}); /* 国际化处理： 保存成功*/
						if (res.data.head && res.data.head[this.formId]) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });

							pk_paybill = res.data.head[this.formId].rows[0].values[PK_NAME].value;
							bill_no = res.data.head[this.formId].rows[0].values[VBILLNO].value;
							//	pagecode = res.data.head[this.formId].rows[0].values.trade_type.value;
							// let ntbMessage = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
							// if (ntbMessage) {
							// 	toast({
							// 		color: 'warning',
							// 		content: ntbMessage
							// 	});
							// }
						}
						this.billno = bill_no;
						this.billId=pk_paybill;
						this.props.beforeUpdatePage();
						if (res.data.body && res.data.body[this.tableId]) {	
							let body=res.data.body;
							this.props.cardTable.setTableData(this.tableId,body[CARD_TABLECODE]);
							 body[CARD_TABLECODE] = this.props.cardTable.updateDataByRowId(
								this.tableId,
								res.data.body[this.tableId]
							);
							if (body&&body[CARD_TABLECODE]) {
								res.data.body = body;
							}
						}
						if (cacheFlag) {
							addCache(pk_paybill, res.data, CARD_FORMCODE, BBP_CACHEKEY,res.data.head[this.formId].rows[0].values);
						} else {
							updateCache(
								PK_NAME,
								pk_paybill,
								res.data,
								CARD_FORMCODE,
								BBP_CACHEKEY,res.data.head[this.formId].rows[0].values
							);
						}

						//this.updateCacheData(pk,bill_pk, res.data, CARD_FORMCODE, BBP_CACHEKEY);
					}
				}
				//this.props.pushTo("/card",{status:"browse",id: pk_paybill,pagecode: pagecode});
				this.props.setUrlParam({
					status: 'browse',
					id: pk_paybill
					//pagecode: pagecode
				});

				this.toggleShow();
				this.props.updatePage(this.formId, this.tableId, null);
			}
		});
	};

	//删除单据
	delConfirm = () => {
		let deleteId = this.props.form.getFormItemsValue(this.formId, PK_NAME).value;
		//this.props.getUrlParam('id');
		let pkMapTs = {};
		pkMapTs[deleteId] = this.props.form.getFormItemsValue(this.formId, TS).value;
		let data = {
			pkMapTs,
			pageid: CARD__PAGECODE,
			pk: deleteId
		};
		ajax({
			url: DELETE,
			data: data,
			success: (res) => {
				if (res.success) {
					let { data, status } = res.data;
					if (status == 1) {
						toast({
							color: 'success',
							content: this.state.json['36070BBP-000006']
						}); /* 国际化处理： 删除成功*/

						//let idObj = { id: this.props.getUrlParam('id'), status: 3 };
						let url_id = getNextId(deleteId, BBP_CACHEKEY);
						//删除缓存
						deleteCacheById(PK_NAME, deleteId, BBP_CACHEKEY);
						//let url_id = this.props.cardPagination.getNextCardPaginationId(idObj);
						if (!url_id) {
							this.billno = '';
							this.props.form.EmptyAllFormValue(this.formId);
							//this.props.form.setFormStatus(this.formId, 'browse');
							this.props.cardTable.setTableData(this.tableId, { rows: [] });
							this.props.setUrlParam({
								status: 'browse',
								id: ''
							});
							this.toggleShow();
						} else {
							pageInfoClick.call(this, this.props, url_id);
						}
					} else {
						let msgData = data[0];
						toast({ color: 'danger', content: msgData.msg });
					}
				}
			}
		});
	};

	//获取列表肩部信息
	getTableHead = (buttons, tableId) => {
		let { createButton } = this.props.button;
		return (
			<div className="shoulder-definition-area">
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
		let pk_org = this.props.form.getFormItemsValue(CARD_FORMCODE, 'pk_org').value;
		let pk_org_dis = this.props.form.getFormItemsValue(CARD_FORMCODE, 'pk_org').display;
		this.props.form.cancel(CARD_FORMCODE);
		this.props.form.setFormItemsValue(CARD_FORMCODE, {
			pk_org: {
				value: pk_org,
				display: pk_org_dis
			}
		});
		this.props.form.setFormStatus(this.formId, 'edit');
		//this.props.cardTable.setTableData(this.tableId, { rows: [] });
		//this.props.cardTable.resetTableData(this.tableId);
		this.props.cardTable.setStatus(this.tableId, 'edit');
		let eventdata = {};
		if (!pk_org) {
			this.props.initMetaByPkorg();
			this.setFildDisabled();
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
			return;
		} else {
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
			this.props.cardTable.addRow(this.tableId);
			eventdata = this.props.createHeadAfterEventData(
				CARD__PAGECODE,
				CARD_FORMCODE,
				CARD_TABLECODE,
				CARD_FORMCODE,
				'pk_org',
				this.value
			);
			eventdata.newvalue = {};
			eventdata.oldvalue = {};
			//eventdata.card.head.head.rows[0].values.pk_org.value=pk_org;
			//eventdata.card.head.head.rows[0].values.pk_org.display=pk_org_dis;
			ajax({
				url: ORGCHANGE,
				data: eventdata,
				success: (res) => {
					if (res.success) {
						if (res.data) {
							if (res.data.head) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								// this.setFildDisabled();
							}
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
						} else {
							this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
							this.props.cardTable.setTableData(this.tableId, { rows: [] });
						}
					}
					this.toggleShow();
				}
			});
		}
		//清空表格
		//this.props.form.EmptyAllFormValue(CARD_FORMCODE);
	};

	// 设置不可编辑字段
	setFildDisabled = () => {
		this.props.form.setFormItemsDisabled(CARD_FORMCODE,{'pk_bankdoc': true}); // 银行名称 
		this.props.form.setFormItemsDisabled(CARD_FORMCODE,{'gz_number': true}); // 购置张数
		this.props.form.setFormItemsDisabled(CARD_FORMCODE,{'creator': true}); // 创建人
		this.props.form.setFormItemsDisabled(CARD_FORMCODE,{'creationtime': true}); // 创建时间
		this.props.form.setFormItemsDisabled(CARD_FORMCODE,{'modifier': true}); // 修改人
		this.props.form.setFormItemsDisabled(CARD_FORMCODE,{'modifiedtime': true}); // 修改时间
	};

	cancelBtnClick = () => {
		this.props.form.setFormItemsValue(CARD_FORMCODE, {
			pk_org: { value: this.state.oldorg, display: this.state.oldorgDis }
		});
		this.props.form.setFormStatus(this.formId, 'edit');
	};
	
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
	closeModal = () => {
		this.setState({
			billCodeModalShow: false
		});
	};
	click = () => {
		// this.setState({
		//  sourceData: text1,
		//  show: true
		// })
	};

	 //卡片返回按钮
	handleClick = () => {
		//先跳转列表
		this.props.pushTo('/list',{pagecode: LIST_PAGECODE});
	};
	updateCacheData = (pk_field, pkvalue, cacheData, moduleId, datasource) => {
		debugger;
		let cache = getCacheById(pkvalue, datasource);
		if (cache) {
			updateCache(pk_field, pkvalue, cacheData, moduleId, datasource);
		} else {
			addCache(pkvalue, cacheData, moduleId, datasource);
		}
	};
	
	getCacheDataById=(pk)=>{
		let CacheData = getCacheById(pk, BBP_CACHEKEY); 
		if (CacheData) {
			this.props.setUrlParam({
				status: 'browse'
			});
			let billno = CacheData.head[CARD_FORMCODE].rows[0].values[VBILLNO].value;
	        let  billId = CacheData.head[CARD_FORMCODE].rows[0].values[PK_NAME].value;
			this.props.form.setAllFormValue({ [this.formId]: CacheData.head[CARD_FORMCODE] });
			this.props.cardTable.setTableData(this.tableId, CacheData.body[CARD_TABLECODE]);
			this.billno = billno;
			this.billId = billId;
			this.toggleShow();
			return true;
		} else{
			return false;
		}
	}
	render() {
		let { cardTable, form, button, cardPagination } = this.props;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let { getDefData } = cardCache;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButtonApp } = button;
		let status = this.props.getUrlParam('status');
		
		let { showUploader, target, tradetype, shoWIns, sourceData, showNCbackBtn } = this.state;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
								<div className="header-title-search-area">
									{createBillHeadInfo({
										title: this.state.json['36070BBP-000000'],
										billCode: this.billno,
										backBtnClick: () => {
											this.handleClick();
										}
									})}
								</div>
								<div className="header-button-area">
									<div>
										{this.props.button.createButtonApp({
											area: 'card_head',
											buttonLimit: 4,
											onButtonClick: buttonClick.bind(this)
											//popContainer: document.querySelector('.header-button-area')
										})}
									</div>
								</div>
								<div className="header-cardPagination-area" style={{ float: 'right' }}>
									{createCardPagination({
										dataSource: BBP_CACHEKEY,
										handlePageInfoChange: pageInfoClick.bind(this)
									})}
								</div>
						</NCDiv>
					</NCAffix>
					<NCScrollElement name="forminfo">
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								expandArr: [ this.formId,  FORM_BBP_02],
								onBeforeEvent: beforeEvent.bind(this),
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCScrollElement>
				</div>
				<NCScrollElement name="businfo">
					<div className="nc-bill-bottom-area">
						<div className="nc-bill-table-area">
							{createCardTable(this.tableId, {
								adaptionHeight: true,
								// tableHead: this.getTableHead.bind(this, buttons, this.tableId),
								// modelSave: ()=>{
								// 	this.saveBill();
								// 	this.props.cardTable.closeModel(CARD_TABLECODE);
								// },
								// onAfterEvent: afterEvent.bind(this),
								// onBeforeEvent: beforeEvent.bind(this),
								// showCheck: false,
								// showIndex: true,
								// onSelected: this.buttonUsability.bind(this),
								// onSelectedAll: this.buttonUsability.bind(this),
								// modelAddRowBefore:()=> {this.checkSettleInfo()},
								// modelAddRow: (props, moduleId, index) => {	
								// 		index = Number(index) + Number(1);
								// 		addline(props, BBP_CONST.DataArr, index);	
								//  }
							})}
						</div>
					</div>
				</NCScrollElement>
				
				<div>
					<PrintOutput
						ref="printOutput"
						url="/nccloud/cmp/paybills/paybillsprint.do"
						data={this.state.outputData}
						//callback={this.onSubmit}
					/>
				</div>
			
			</div>
		);
	}
}

Card = createPage({
	mutiLangCode: APPCODE,
	billinfo: {
		billtype: 'card',
		pagecode: CARD__PAGECODE,
		headcode: CARD_FORMCODE,
		bodycode: CARD_TABLECODE
	},
	orderOfHotKey: [ CARD_FORMCODE,CARD_TABLECODE]
})(Card);
export default Card;

// Card = createPage({
// 	// initTemplate: initTemplate,
//mutiLangCode: '36070BBP'
// })(Card);

// ReactDOM.render(<Card />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/