/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, print, getMultiLang, promptBox,createPageIcon,viewModel } from 'nc-lightapp-front';
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix, NCButton ,NCDiv} = base;
import { buttonClick, initTemplate, pageInfoClick, afterEvent, tableButtonClick, beforeEvent} from './events';
import { addline,defaultLineValue} from './events/addLine';
import { cardCache } from 'nc-lightapp-front';
let { getCacheById, updateCache, addCache, getNextId, deleteCacheById } = cardCache;
import { PAYBILL_CONST } from '../cons/constant.js';
import { commonurl } from '../../../public/utils/constant';

import { high } from 'nc-lightapp-front';
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form/index';
const { Refer, NCUploader, BillTrack, ApproveDetail, PrintOutput, Inspection, ApprovalTrans } = high;
import { buttonVisible } from './events/buttonVisible';
import { orgVersionView } from '../../../../tmpub/pub/util/version/index.js'; //多版本显示
import InvoiceUploader from 'sscivm/ivmpub/components/invoice-uploader';                      
import InvoiceLink from 'sscivm/ivmpub/components/invoice-link';
import { saveMultiLangRes,loadMultiLang } from '../../../../tmpub/pub/util';
import {SCENE,URL_PARAM} from '../../../../tmpub/pub/cons/constant.js';
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;



import { judgeCurrtype,judgeTableCurrtype,judgeTableRate,judgeFormRate } from './events/judgeCurrtype';
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = PAYBILL_CONST.card_from_id;
		// this.searchId = '20521030';
		this.moduleId =PAYBILL_CONST.appcode; //模块id
		this.tableId = PAYBILL_CONST.card_table_id;
		this.pageId = PAYBILL_CONST.card_page_id;
		this.billno = '';
		this.billId = '';
		this.tradeType = 'trade_type';//单据控制规则交易类型字段名称（也可传递的单据类型）
		this.formVOClassName = 'BillVO';//form表单的vo类名
		this.tableVOClassName = 'BillDetailVO';//table表体的vo类名
		this.compositedata='';
		this.commitflag='';
		//this.showbilltrackpk = '',//联查单据pk
		//this.showbilltracktype = '',//联查单据类型
		this.state = {
			showUploader: false,
			target: null,
			billtype: '',
			tradetype: '',
			oldorg: '',
			oldorgDis: '',
			shoWIns: false,
			showAppr: false,
			sourceData: null,
			pasteflag: false,
			billCodeModalShow: false,
			billCode: '',
			openflag: 'true',
			compositedata: '',
			getAssginUsedr: '',
			compositedisplay: false,
			show: false,
			protoPayMny: {},
			defaultLineValue:{},
			showElec:false,
			showbilltrack: false,//联查单据
			showTradeBtn:true,
			ssicmmessage:'',
			showbilltrackpk:'',
			showbilltracktype:'',
			outputData: {
				funcode: '36070PBR', //功能节点编码，即模板编码
				nodekey: 'NCCLOUD', //模板节点标识
				printTemplateID: '1001Z610000000004R6L', //模板id
				oids: [],
				outputType: 'output'
			},
			sscrpInvoiceData:{},
			sscrpLinkInvoiceData:{},
			showBuLu: false,         //设置显示补录模态框显隐性
			onLineData: [],
			modelType: PAYBILL_CONST.SHOWMODEL_BULU, //操作类型，本结算业务用的
			modalValue: PAYBILL_CONST.SHOWMODEL_BULU, //补录框类型，传给网银补录框的


		};
		//initTemplate.call(this, props);
	}
	componentDidMount() {
		
		
	};
	
	initData = () => {
		let src = this.props.getUrlParam('src');
		if (src === 'settlement') {
			let settlePk = this.props.getUrlParam('pk_settle');
			if (settlePk) {
				this.QuerySettleData(settlePk);
			}
			//
		} else if (this.props.getUrlParam('scene') === SCENE.LINK&&this.props.getUrlParam(URL_PARAM.PK_SRC)) {
			let pks=this.props.getUrlParam(URL_PARAM.PK_SRC);
			//let pks='1001Z610000000004L7U';
			this.linkQueryForFTS(pks);
			//联查场景
		} else {
			this.pageShow();
		}
	};
	componentWillMount() {

		let callback = (json) => {
			 this.setState({ json });
			 saveMultiLangRes(this.props,json);//缓存多语资源
			initTemplate.call(this, this.props);
		};
		getMultiLang({ moduleId:{ 
			[ 'tmpub']:['3601'],
			['cmp']: [PAYBILL_CONST.appcode, '36070']
		   } , callback });
		// 关闭浏览器
		window.onbeforeunload = () => {
			let closeStatus =this.props.getUrlParam('status');
			if (closeStatus&&closeStatus!= 'browse') {
				return '';
			}
		};
		
	};
	//资金结算被联查
	linkQueryForFTS = (pks) => {
		let queryData = {
			pk: pks,
			pageid: this.pageId,
			card:true
		};
		ajax({
			url: '/nccloud/cmp/paybills/linkQueryForFTS.do',
			data: queryData,
			success: (res) => {
				if (res.success) {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							this.billno = res.data.head[this.formId].rows[0].values.bill_no.value;
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						this.toggleShow();
					}
				}
			}
		});
	};
    //资金结算被联查
	QuerySettleData = (pk_settle) => {
		let sendArr = {
			pk: pk_settle,
			pageid: '36070PBR_D5_card'
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
							let sourceFlag = res.data.head[this.formId].rows[0].values.source_flag.value;
							this.sourceFlagTranslate(sourceFlag);
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
	
						this.toggleShow();
					}
				}
			}
		});
	};

	//资金结算被联查
	refresh = () => {
		let data = { pk:this.props.form.getFormItemsValue(this.formId, 'pk_paybill').value, pageid: this.pageId };
		ajax({
			url: '/nccloud/cmp/billmanagement/querybypk.do',
			data: data,
			success: (res) => {
				if (res.data) {
					 let billId;
					if (res.data.head) {
						toast({
							color: 'success',
							content:loadMultiLang(this.props, '36070PBR-000118')
					
						});
						this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						let billno = res.data.head[this.formId].rows[0].values.bill_no.value;
						billId = res.data.head[this.formId].rows[0].values.pk_paybill.value;
						this.billno = billno;
						this.billId = billId;
					}
					if (res.data.body) {
						this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					}
					// 增加缓存
					//addCache(billId, res.data, PAYBILL_CONST.card_from_id, PAYBILL_CONST.paybillCacheKey);
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
				
		
	};

	pageShow = () => {
		if (this.props.getUrlParam('status') === 'add') {
			let addData = this.props.createMasterChildData(PAYBILL_CONST.card_page_id, this.formId, this.tableId);
			ajax({
				url: '/nccloud/cmp/paybills/paybillconstructor.do',
				data: addData,
				success: (res) => {
					if (res.success) {
						if (res.data) {
							if (res.data.head) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								let pk_org = res.data.head[this.formId].rows[0].values.pk_org;
								if(pk_org && pk_org.value){
									 //汇率
									 this.props.resMetaAfterPkorgEdit(); 
								}
                                judgeFormRate.call(this,res.data.userjson,this.formId);
								if (this.props.getUrlParam('tradetypepk') && this.props.getUrlParam('tradetypename')) {
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
								let sourceFlag = res.data.head[this.formId].rows[0].values.source_flag.value;
								this.sourceFlagTranslate(sourceFlag);
								// 					//来源系统翻译
							}
							let table_org = res.data.head[this.formId].rows[0].values.pk_org;
							if (res.data.body && table_org && table_org.value) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							judgeTableRate.call(this,res.data.userjson,this.tableId,0);
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
			if (this.props.getUrlParam('op') == 'reverse') {
				toast({
					color: 'success',
					content:loadMultiLang(this.props, '36070PBR-000099')
				}); /* 国际化处理： 红冲成功*/
			}

			if (this.props.getUrlParam('op') == 'cancel') {
				
			
				this.billno = '';
				this.props.form.EmptyAllFormValue(this.formId);
				this.props.cardTable.setTableData(this.tableId, { rows: [] });
				this.toggleShow();
			} else {
				let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
				ajax({
					url: '/nccloud/cmp/billmanagement/querybypk.do',
					data: data,
					success: (res) => {
						if (res.data) {
							 let billId;
							if (res.data.head) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								let billno = res.data.head[this.formId].rows[0].values.bill_no.value;
							    billId = res.data.head[this.formId].rows[0].values.pk_paybill.value;
								this.billno = billno;
								this.billId = billId;
							}
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							let sourceFlag = res.data.head[this.formId].rows[0].values.source_flag.value;
							this.sourceFlagTranslate(sourceFlag);
							// 增加缓存
							//addCache(billId, res.data, PAYBILL_CONST.card_from_id, PAYBILL_CONST.paybillCacheKey);
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
				url: '/nccloud/cmp/billmanagement/querybypk.do',
				data: data,
				success: (res) => {
					if (res.data) {
						let is_cf = false;
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
							let bill_no = res.data.head[this.formId].rows[0].values.bill_no.value;
							if (res.data.head[this.formId].rows[0].values.is_cf.value) {
								is_cf = true;
							}
							let sourceFlag = res.data.head[this.formId].rows[0].values.source_flag;
							this.billno = bill_no;
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							//this.setPknoteVal.call(this);
						}
						//
						let sourceFlag = res.data.head[this.formId].rows[0].values.source_flag.value;
						this.sourceFlagTranslate(sourceFlag);
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
							this.billno = '';
							//来源系统翻译
							let sourceFlag = res.data.head[this.formId].rows[0].values.source_flag.value;
							this.sourceFlagTranslate(sourceFlag);
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							//this.setPknoteVal.call(this);
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
		//红冲
		if (this.props.getUrlParam('status') === 'reverse') {
			//let data = { pk: [ this.props.getUrlParam('id') ], pageid: '36070WC_C01' };
			let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
			ajax({
				url: '/nccloud/cmp/paybills/reverse.do',
				data: data,
				success: (res) => {
					if (res.data) {
						toast({
							color: 'warning',
							content:loadMultiLang(this.props, '36070PBR-000099')
						});

						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
							//来源系统翻译
							let sourceFlag = res.data.head[this.formId].rows[0].values.source_flag.value;
							this.sourceFlagTranslate(sourceFlag);
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							//this.setPknoteVal.call(this);
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
			let val = sourceFlag;
			switch (val) {
				case '2':
					this.props.form.setFormItemsValue('head', {
						source_flag: {
							value: val,
							display:loadMultiLang(this.props, '36070PBR-000019')
						}
					});
					break;
				case '9':
					this.props.form.setFormItemsValue('head', {
						source_flag: {
							value: val,
							display:loadMultiLang(this.props, '36070PBR-000020')
						}
					});
					break;
				case '5':
					this.props.form.setFormItemsValue('head', {
						source_flag: {
							value: val,
							display:loadMultiLang(this.props, '36070PBR-000021')
						}
					});
					break;
				case '8':
					this.props.form.setFormItemsValue('head', {
						source_flag: {
							value: val,
							display:loadMultiLang(this.props, '36070PBR-000022')
						}
					});
					break;
				case '6':
					this.props.form.setFormItemsValue('head', {
						source_flag: {
							value: val,
							display:loadMultiLang(this.props, '36070PBR-000023')
						}
					});
					break;
			}
		}
	};

	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam('status');
		let backShow= this.showBackButton();
		if(this.props.getUrlParam('scene')){
			this.setState({
				showTradeBtn:false
			});
		}
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
			let pk_org = this.props.form.getFormItemsValue('head', 'pk_org');
			this.props.ViewModel.setData('status', status);
			if (!pk_org || !pk_org.value) {
				this.props.form.setFormItemsDisabled(this.formId, { pk_org: false }); //财务组织、
				this.props.resMetaAfterPkorgEdit();
				this.props.initMetaByPkorg();
				this.props.button.setButtonDisabled([ 'addline', 'delline', 'copyline' ], true);
			  } else {
			 	this.props.resMetaAfterPkorgEdit();
			 }
		}
		if (status === 'copy') {
			this.props.form.setFormItemsDisabled(this.formId, { pk_org: true }); //财务组织
			this.props.ViewModel.setData('status', status);
			this.props.resMetaAfterPkorgEdit();
		}

		if (status === 'browse') {
			this.props.ViewModel.setData('status', status);
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true&&backShow, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.billno //修改单据号---非必传
			});
		} else if (status === 'edit') {
			this.props.resMetaAfterPkorgEdit();
			this.props.form.setFormItemsDisabled(this.formId, { pk_org: true }); //财务组织
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
			//修改处理票据编辑性
			this.handlerDirectEdit();

		} else {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
		}
		buttonVisible.call(this, this.props);
		this.buttonUsability.call(this);
		this.protoPayInfo();
		orgVersionView.call(this, this.props, 'head', 'pk_org', 'pk_org_v'); //多版本视图显隐性
	};

	showBackButton=()=> {
		let show= true; 
		    if(this.props.getUrlParam('scene')){
				 if(this.props.getUrlParam('scene')=='linksce'||this.props.getUrlParam('scene')=='zycl') {
					show =false; 
				 }
		}
        return show;
	}
	//保存校验
	
	saveBeforeEvent = (CardData) => {
	    
		let checkData= CardData.body[this.tableId];
        
	   
		 for (let item of checkData.rows) {
		 	if (!item.values.pay_primal.value) {
				//checkData.delRowByRowId(,item.rowid);
				this.props.cardTable.delRowByRowId(this.tableId, item.rowid);
		 	}
	}
		
	};
	//保存校验
	protoPayCheck = (CardData) => {
		let checkData = CardData.body[this.tableId].rows;
		if (checkData.length == 0) {
			toast({
				color: 'warning',
				content:loadMultiLang(this.props, '36070PBR-000025')
			}); /* 国际化处理： 请检查必输项是否填写22*/
			return true;
		}

		for (let item of checkData) {
			if (!item.values.cf_type || !item.values.cf_type.value) {
				toast({
					color: 'warning',
					content:loadMultiLang(this.props, '36070PBR-000101')
					
				}); /* 国际化处理： 请检查必输项是否填写33*/
				return true;
			}
		}
	};
	setPknoteVal = () => {
		let rowNum = this.props.cardTable.getNumberOfRows('paybilldetail_table'); //表体table行数
		for (let i = 0; i < rowNum; i++) {
			let pk_note = this.props.cardTable.getValByKeyAndIndex('paybilldetail_table', i, 'note_no');
			if (pk_note) {
				this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', i, 'pk_note', {
					value: pk_note.value,
					display: pk_note.display
				});
			} else {
				this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', i, 'pk_note', {
					value: null,
					display: null
				});
			}
		}
	};
    
	checkSettleInfo=()=>{
		let isfromindependent=this.props.form.getFormItemsValue('head', 'isfromindependent');
		let iscf=this.props.form.getFormItemsValue('head', 'is_cf');

		if((isfromindependent&&isfromindependent.value&&isfromindependent.value=='1')||(iscf&&iscf.value) ){
			toast({
				color: 'warning',
				content:loadMultiLang(this.props, '36070PBR-000113')
			});
			return true;
		} else{
			return false;
		}
	}
//存在承付类型为强制全额承付的
	showCfBtn = () => {
		let rowNum = this.props.cardTable.getNumberOfRows(this.tableId); //表体table行数
		for (let i = 0; i < rowNum; i++) {
			let cf_type = this.props.cardTable.getValByKeyAndIndex(this.tableId, i, 'cf_type')
			if (cf_type && cf_type.value == 3) {
				return true

			} else {
				return false
			}
		}
	}


	
	//保存单据
	saveBill = () => {
		if (this.props.getUrlParam('copyFlag') === 'copy') {
			this.props.form.setFormItemsValue(this.formId, { pk_paybill: null });
			this.props.form.setFormItemsValue(this.formId, { ts: null });
		}
		//过滤表格空行
		//校验表单必输字段
	//校验表单必输字段
	let CardBeforeData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
	//移除没有金额的数据
	this.saveBeforeEvent.call(this,CardBeforeData);
	let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);

		let flag = this.props.form.isCheckNow(this.formId);
		if (!this.props.cardTable.checkTableRequired(this.tableId)) {
			return;
		}
		if (!flag) {
			return;
		}

		let url = '/nccloud/cmp/paybills/save.do'; //新增保存
		let cacheFlag = true;
		if (this.props.getUrlParam('status') === 'edit') {
			url = '/nccloud/cmp/paybills/update.do'; //修改保存
			cacheFlag = false;
		}

		if (this.props.getUrlParam('status') === 'add' && this.props.getUrlParam('src') === 'settlement') {
			url = '/nccloud/cmp/paybills/assave.do'; //修改保存
			cacheFlag = true;
		}
		if (this.props.getUrlParam('status') === 'edit' && this.props.getUrlParam('op') === 'protopay') {
			url = '/nccloud/cmp/paybills/commisionpay.do'; //承付修改
			if (this.protoPayCheck(CardData)) {
				return;
			}
			cacheFlag = false;
		}
		// if (this.props.getUrlParam('status') === 'edit' && this.props.getUrlParam('op') === 'unprotopay') {
		// 	url = '/nccloud/cmp/paybills/canlecompay.do'; //承付修改
		// 	cacheFlag = false;
		// }

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
							content:loadMultiLang(this.props, '36070PBR-000005')
						}); /* 国际化处理： 保存成功*/
						if (res.data.head && res.data.head[this.formId]) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });

							pk_paybill = res.data.head[this.formId].rows[0].values.pk_paybill.value;
							bill_no = res.data.head[this.formId].rows[0].values.bill_no.value;
							//	pagecode = res.data.head[this.formId].rows[0].values.trade_type.value;
							let ntbMessage = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
							if (ntbMessage) {
								toast({
									color: 'warning',
									content: ntbMessage
								});
							}
						}
						this.billno = bill_no;
						this.billId=pk_paybill;
						//this.props.beforeUpdatePage();
					    
						if (res.data.body && res.data.body[this.tableId]) {	
							let body=res.data.body;
							 body[PAYBILL_CONST.card_table_id] = this.props.cardTable.updateDataByRowId(
								this.tableId,
								res.data.body[this.tableId]
							);
							if (body&&body[PAYBILL_CONST.card_table_id]) {
								res.data.body = body;
							}
						}
						if (cacheFlag) {
							addCache(pk_paybill, res.data, PAYBILL_CONST.card_from_id, PAYBILL_CONST.paybillCacheKey,res.data.head[this.formId].rows[0].values);
						} else {
							updateCache(
								PAYBILL_CONST.paybill_pkname,
								pk_paybill,
								res.data,
								PAYBILL_CONST.card_from_id,
								PAYBILL_CONST.paybillCacheKey,res.data.head[this.formId].rows[0].values
							);
						}

						//this.updateCacheData(PAYBILL_CONST.paybill_pkname,bill_pk, res.data, PAYBILL_CONST.card_from_id, PAYBILL_CONST.paybillCacheKey);
					}
				}
				//this.props.pushTo("/card",{status:"browse",id: pk_paybill,pagecode: pagecode});
				this.props.setUrlParam({
					status: 'browse',
					id: pk_paybill
					//pagecode: pagecode
				});

				this.toggleShow();
				//this.props.updatePage(this.formId, this.tableId, null);

				//网银补录
				//this.netPayBuLu(this.billId);
			}
		});
	};

	//拼装网银补录信息
	netPayBuLu = (id) => {
		let code=this.billTypeCode;
	   let data={
		   pk:id,
		   billTypeCode:this.billTypeCode
	   }
	   ajax({
		   url: '/nccloud/cmp/paybills/netPayBuLu.do',
		   data,
		   success: (res) => {
			   let { data, success } = res;
			   if (success) {
				   if (data) {
					   if(data[code]){	
						   if(data['NETPAYDATA']){
						   this.setState({
							   onLineData: data['NETPAYDATA']
						   }, () => {
							   this.setState({
								   showBuLu: true
							   })
						   });
					   }

					   }
				   }
			   }
		   }
	   });	
	   
   };

   // 保存网银补录数据
   processRetMsg = async (retPayMsg) => {
	   let data = {
		   pk: this.billId,
		   results: retPayMsg,
	   }
	   
	   ajax({
		   url: '/nccloud/cmp/paybills/netPayBuLuSave.do',
		   data,
		   success: (res) => {
			   let { data, success } = res;
			   if (success) {
				   if (data) {

				   }
			   }
		   }
	   });
   }
   handlerDirectEdit=()=>{
	let rowNum = this.props.cardTable.getNumberOfRows('paybilldetail_table'); //表体table行数
	for (let i = 0; i < rowNum; i++) {
		let noteType=this.props.cardTable.getValByKeyAndIndex('paybilldetail_table', i, 'note_type');
		if(noteType&&noteType.value){
			ajax({
				url: '/nccloud/cmp/pub/noteTypeHandler.do',
				async: false,
				data: {
					pk: noteType.value
				},
				success:  (res)=> {
					let noteTypeData = res.data;
					//控制直连电票字段显示问题
					if (noteTypeData.etcs) {
						this.props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, i, 'direct_ecds', true);
						
					} else {
						this.props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, i, 'direct_ecds', false);
						
					}

				}
			});

		}	

	}
   }
	protoPayInfo = () => {

		if(this.props.getUrlParam('status')!='browse'){
		if (this.props.getUrlParam('op') === 'unprotopay' || this.props.getUrlParam('op') === 'protopay') {
			this.props.cardTable.setColEditableByKey('paybilldetail_table', 'cf_type', false);
			this.props.cardTable.setColEditableByKey('paybilldetail_table', 'cf_status', true);
			this.props.cardTable.setColEditableByKey('paybilldetail_table', 'refusenote', false);
			this.props.cardTable.setColEditableByKey('paybilldetail_table', 'is_refuse', false);
		} else{
			this.props.cardTable.setColEditableByKey('paybilldetail_table', 'cf_type', true);
			this.props.cardTable.setColEditableByKey('paybilldetail_table', 'cf_status', true);
			this.props.cardTable.setColEditableByKey('paybilldetail_table', 'refusenote', true);
			this.props.cardTable.setColEditableByKey('paybilldetail_table', 'is_refuse', true);

		}

		if (this.props.getUrlParam('op') === 'unprotopay') {
			this.props.cardTable.setColValue('paybilldetail_table', 'cf_type', {
				display: null,
				value: null
			});
			this.props.cardTable.setColValue('paybilldetail_table', 'cf_status', {
				display: null,
				value: null
			});
			this.props.cardTable.setColValue('paybilldetail_table', 'refusenote', {
				display: null,
				value: null
			});
			this.props.cardTable.setColValue('paybilldetail_table', 'is_refuse', {
				display: null,
				value: null
			});
		}
	}
	};
	cardConstructor = (key) => {};

	cmp49Handle = (props, org, moduleId) => {
		ajax({
			url: '/nccloud/cmp/pub/getpara.do',
			//参数返回类型type， int ,string,boolean
			//组织pk_org
			//参数编码paracode
			data: { paracode: 'CMP49', pk_org: org, type: 'boolean' },
			success: function(res) {
				let { success, data } = res;
				if (res.data.CMP49) {
					if (moduleId == 'head') {
						let meta = props.meta.getMeta();
						let item = meta['head'].items.find((e) => e.attrcode === 'objecttype');
						let itemform = meta['childform1'].items.find((e) => e.attrcode === 'objecttype');
						item.options = [
							{
								display: '',
								value: ''
							},
							{
								display:loadMultiLang(props, '36070PBR-000000'),
								value: '0'
							},
							{
								display:loadMultiLang(props, '36070PBR-000001'),
								value: '1'
							},
							{
								display:loadMultiLang(props, '36070PBR-000002'),
								value: '2'
							},
							{
								display:loadMultiLang(props, '36070PBR-000003'),
								value: '3'
							},
							{
								display:loadMultiLang(props, '36070PBR-000004'),
								value: '4'
							}
						];

						let tableItem = meta['paybilldetail_table'].items.find((e) => e.attrcode === 'objecttype');
						tableItem.options = [
							{
								display: '',
								value: ''
							},
							{
								display:loadMultiLang(props, '36070PBR-000000'),
								value: '0'
							},
							{
								display:loadMultiLang(props, '36070PBR-000001'),
								value: '1'
							},
							{
								display:loadMultiLang(props, '36070PBR-000002'),
								value: '2'
							},
							{
								display:loadMultiLang(props, '36070PBR-000003'),
								value: '3'
							},
							{
								display:loadMultiLang(props, '36070PBR-000004'),
								value: '4'
							}
						];
						itemform.options = [
							{
								display: '',
								value: ''
							},
							{
								display:loadMultiLang(props, '36070PBR-000000'),
								value: '0'
							},
							{
								display:loadMultiLang(props, '36070PBR-000001'),
								value: '1'
							},
							{
								display:loadMultiLang(props, '36070PBR-000002'),
								value: '2'
							},
							{
								display:loadMultiLang(props, '36070PBR-000003'),
								value: '3'
							},
							{
								display:loadMultiLang(props, '36070PBR-000004'),
								value: '4'
							}
						];
						
						props.renderItem('form', 'head', 'objecttype', null);
						props.renderItem('table', 'paybilldetail_table', 'objecttype', null);
						props.renderItem('form', 'childform1', 'objecttype', null);
						props.meta.setMeta(meta);
					}
					if (moduleId == 'paybilldetail_table') {
						let meta = props.meta.getMeta();
						let tableItem = meta['paybilldetail_table'].items.find((e) => e.attrcode === 'objecttype');
						let itemform = meta['childform1'].items.find((e) => e.attrcode === 'objecttype');
						tableItem.options = [
							{
								display: '',
								value: ''
							},
							{
								display:loadMultiLang(props, '36070PBR-000000'),
								value: '0'
							},
							{
								display:loadMultiLang(props, '36070PBR-000001'),
								value: '1'
							},
							{
								display:loadMultiLang(props, '36070PBR-000002'),
								value: '2'
							},
							{
								display:loadMultiLang(props, '36070PBR-000003'),
								value: '3'
							},
							{
								display:loadMultiLang(props, '36070PBR-000004'),
								value: '4'
							}
						];
						itemform.options = [
							{
								display: '',
								value: ''
							},
							{
								display:loadMultiLang(props, '36070PBR-000000'),
								value: '0'
							},
							{
								display:loadMultiLang(props, '36070PBR-000001'),
								value: '1'
							},
							{
								display:loadMultiLang(props, '36070PBR-000002'),
								value: '2'
							},
							{
								display:loadMultiLang(props, '36070PBR-000003'),
								value: '3'
							},
							{
								display:loadMultiLang(props, '36070PBR-000004'),
								value: '4'
							}
						];
						props.renderItem('table', 'paybilldetail_table', 'objecttype', null);
						props.renderItem('form', 'childform1', 'objecttype', null);
						props.meta.setMeta(meta);
					}
				} else {
					if (moduleId == 'head') {
						let meta = props.meta.getMeta();
						let item = meta['head'].items.find((e) => e.attrcode === 'objecttype');
						let itemform = meta['childform1'].items.find((e) => e.attrcode === 'objecttype');

						item.options = [
							{
								display: '',
								value: ''
							},
							{
								display:loadMultiLang(props, '36070PBR-000000'),
								value: '0'
							},
							{
								display:loadMultiLang(props, '36070PBR-000001'),
								value: '1'
							},
							{
								display:loadMultiLang(props, '36070PBR-000002'),
								value: '2'
							},
							{
								display:loadMultiLang(props, '36070PBR-000003'),
								value: '3'
							}
						];
						let tableItem = meta['paybilldetail_table'].items.find((e) => e.attrcode === 'objecttype');
						tableItem.options = [
							{
								display: '',
								value: '0'
							},
							{
								display:loadMultiLang(props, '36070PBR-000000'),
								value: '0'
							},
							{
								display:loadMultiLang(props, '36070PBR-000001'),
								value: '1'
							},
							{
								display:loadMultiLang(props, '36070PBR-000002'),
								value: '2'
							},
							{
								display:loadMultiLang(props, '36070PBR-000003'),
								value: '3'
							}
						];
						itemform.options = [
							{
								display: '',
								value: ''
							},
							{
								display:loadMultiLang(props, '36070PBR-000000'),
								value: '0'
							},
							{
								display:loadMultiLang(props, '36070PBR-000001'),
								value: '1'
							},
							{
								display:loadMultiLang(props, '36070PBR-000002'),
								value: '2'
							},
							{
								display:loadMultiLang(props, '36070PBR-000003'),
								value: '3'
							}
							
						];

						props.renderItem('form', 'head', 'objecttype', null);
						props.renderItem('table', 'paybilldetail_table', 'objecttype', null);
						props.renderItem('form', 'childform1', 'objecttype', null);
						props.meta.setMeta(meta);
					}
					if (moduleId == 'paybilldetail_table') {
						let meta = props.meta.getMeta();
						let tableItem = meta['paybilldetail_table'].items.find((e) => e.attrcode === 'objecttype');
						let itemform = meta['childform1'].items.find((e) => e.attrcode === 'objecttype');
						tableItem.options = [
							{
								display: '',
								value: ''
							},
							{
								display:loadMultiLang(props, '36070PBR-000000'),
								value: '0'
							},
							{
								display:loadMultiLang(props, '36070PBR-000001'),
								value: '1'
							},
							{
								display:loadMultiLang(props, '36070PBR-000002'),
								value: '2'
							},
							{
								display:loadMultiLang(props, '36070PBR-000003'),
								value: '3'
							}
						];
						itemform.options = [
							{
								display: '',
								value: ''
							},
							{
								display:loadMultiLang(props, '36070PBR-000000'),
								value: '0'
							},
							{
								display:loadMultiLang(props, '36070PBR-000001'),
								value: '1'
							},
							{
								display:loadMultiLang(props, '36070PBR-000002'),
								value: '2'
							},
							{
								display:loadMultiLang(props, '36070PBR-000003'),
								value: '3'
							}
							
						];
						props.renderItem('form', 'childform1', 'objecttype', null);
						props.renderItem('table', 'paybilldetail_table', 'objecttype', null);
						props.meta.setMeta(meta);
					}
				}
			}
		});
	};

	//删除单据
	delConfirm = () => {
		let deleteId = this.props.form.getFormItemsValue(this.formId, 'pk_paybill').value;
		//this.props.getUrlParam('id');
		let pkMapTs = {};
		pkMapTs[deleteId] = this.props.form.getFormItemsValue(this.formId, 'ts').value;
		let data = {
			pkMapTs,
			pageid: PAYBILL_CONST.card_page_id,
			pk: deleteId
		};
		ajax({
			url: '/nccloud/cmp/billmanagement/delete.do',
			data: data,
			// data: {
			// 	pk: deleteId,
			// 	ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
			// },
			success: (res) => {
				if (res.success) {
					let { data, status } = res.data;
					if (status == 1) {
						toast({
							color: 'success',
							content:loadMultiLang(this.props, '36070PBR-000028'),
						}); /* 国际化处理： 删除成功*/

						//let idObj = { id: this.props.getUrlParam('id'), status: 3 };
						let url_id = getNextId(deleteId, PAYBILL_CONST.paybillCacheKey);
						//删除缓存
						deleteCacheById(PAYBILL_CONST.paybill_pkname, deleteId, PAYBILL_CONST.paybillCacheKey);
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
		let oldType= this.props.form.getFormItemsValue('head', 'pk_tradetypeid');
		let TradeType= this.props.form.getFormItemsValue('head', 'trade_type');
		

		this.props.form.cancel('head');

		this.props.form.setFormItemsValue('head', {
			pk_org: {
				value: pk_org,
				display: pk_org_dis
			}
		});
		if(oldType){
			this.props.form.setFormItemsValue('head', {
				pk_tradetypeid: {
					value: oldType.value,
					display: oldType.display
				}
			});
		}
		if(TradeType){
			this.props.form.setFormItemsValue('head', {
				trade_type: {
					value: TradeType.value,
					display: TradeType.display
				}
			});
		}
		this.props.form.setFormStatus(this.formId, 'edit');
		//this.props.cardTable.setTableData(this.tableId, { rows: [] });
		//this.props.cardTable.resetTableData(this.tableId);
		this.props.cardTable.setStatus(this.tableId, 'edit');
		let eventdata = {};
		if (!pk_org) {
			this.props.resMetaAfterPkorgEdit();
			this.props.initMetaByPkorg();
			this.props.button.setButtonDisabled([ 'addline' ], true);
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
			return;
		} else {
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
			this.props.cardTable.addRow(this.tableId);
			this.props.button.setButtonDisabled([ 'addline', 'delline', 'copyline' ], false);
			this.cmp49Handle.call(this, this.props, pk_org);
			eventdata = this.props.createHeadAfterEventData(
				'36070PBR_D5_card',
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
                            //币种关联本币汇率字段编辑性
							judgeFormRate.call(this,res.data.userjson,this.formId);

							}
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							judgeTableRate.call(this,res.data.userjson,this.tableId,0);
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
		//this.props.form.EmptyAllFormValue('head');
	};
	cancelBtnClick = () => {
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
			alert(loadMultiLang(this.props, '36070PBR-000030')
			); /* 国际化处理： 只支持jpg格式图片*/
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			alert(loadMultiLang(this.props, '36070PBR-000031')
			
			); /* 国际化处理： 上传大小小于2M*/
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
	closeModal = () => {
		this.setState({
			billCodeModalShow: false
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
		//保证
		
			this.props.pushTo('/list');
			
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
	closeApprove = () => {
		this.setState({
			showAppr: false
		});
	};
	//指派
	getAssginUsedr = (value) => {
		this.setState(
			{
				getAssginUsedr: value
			},
			() => {
				buttonClick.call(this, this.props, 'commitConfirm');
			}
		);
	};
	turnOff = () => {
		this.setState({
			compositedisplay: false
		});
	};

	buttonUsability = () => {
		let Rows = this.props.cardTable.getCheckedRows(this.tableId);
		if (Rows && Rows.length >= 1) {
			this.props.button.setButtonDisabled([ 'addline', 'delline', 'copyline' ], false);
		} else {
			this.props.button.setButtonDisabled([ 'delline', 'copyline' ], true);
		}
	};
	getCacheDataById=(pk)=>{
	let CacheData = getCacheById(pk, PAYBILL_CONST.paybillCacheKey); 
	if (CacheData) {
		this.props.setUrlParam({
			status: 'browse'		
		});
	    let billno = CacheData.head[PAYBILL_CONST.card_from_id].rows[0].values.bill_no.value;
        let  billId = CacheData.head[PAYBILL_CONST.card_from_id].rows[0].values.pk_paybill.value;
		this.props.form.setAllFormValue({ [this.formId]: CacheData.head[PAYBILL_CONST.card_from_id] });
		this.props.cardTable.setTableData(this.tableId, CacheData.body[PAYBILL_CONST.card_table_id]);
		this.billno = billno;
		this.billId = billId;
		this.toggleShow();
		return true;
	} else{
		return false;
	}
	}
	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let { getDefData } = cardCache;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButton, createButtonApp,createErrorFlag } = button;
		const { ncmodal } = this.props;
		let { createModal } = ncmodal;
		let status = this.props.getUrlParam('status');
		let ISlINK = getDefData(PAYBILL_CONST.link_key, PAYBILL_CONST.paybillCacheKey);
		if(this.props.getUrlParam('scene')){
			ISlINK=true;
		}
		//this.props.getUrlParam('status');
		//let { createModal } = modal;
		let billTypeName = loadMultiLang(this.props, '36070PBR-000089'); //标题
	if(getGlobalStorage('sessionStorage','billTypeName')){
		billTypeName=getGlobalStorage('sessionStorage','billTypeName');
	}	
		let { showUploader, target, tradetype, shoWIns, sourceData, showNCbackBtn } = this.state;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					{/**创建websocket */}
					{api.comm.createCardWebSocket(this.props, {
						headBtnAreaCode: cons.card.btnHeadCode,
						formAreaCode: cons.card.headCode,
						billpkname: cons.field.pk,
						billtype: cons.comm.billType
						// serverLocation: '10.16.2.231:9991'
					})}			
					<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area"  >
							<div className="header-title-search-area">
								
									{createBillHeadInfo({
										title:billTypeName,
										billCode: this.billNo,
										backBtnClick: () => {
											this.handleClick();
										}
									})}
							
							</div>

							<div className="header-button-area">
								<div className="button-app-wrapper">
									{createErrorFlag({
										headBtnAreaCode: cons.card.btnHeadCode
									})}
								</div>
								<div className="button-app-wrapper">
									{this.props.ViewModel.getData('status') === 'browse' && !ISlINK&&this.state.showTradeBtn&&(
										<Refer
											placeholder={loadMultiLang(this.props, '36070PBR-000032')
											
											} /* 国际化处理： 单据模板类型*/
											refName={loadMultiLang(this.props, '36070PBR-000033')
											
											} /* 国际化处理： 付款交易类型*/
											refCode={'tradetype001'}
											refType={'grid'}
											queryGridUrl={'/nccloud/riart/ref/fiBillTypeTableRefAction.do'}
											columnConfig = {
												[{
													name: [loadMultiLang(this.props, '36070PBR-000034'),
														   loadMultiLang(this.props, '36070PBR-000032'),
													] /* 国际化处理： 单据编号,单据模板类型*/ ,
													code: ['refcode', 'refname']
												}]
											}
											queryCondition={{
												parentbilltype: 'F5' //过滤条件
											}}
											value={this.state.tradetype}
											onChange={(value) => {
												this.setState(
													{
														tradetype: value
													},
													function() {
														sessionStorage.setItem(
															'sessionTP',
															JSON.stringify(this.state.tradetype)
														);
													}
												);
											}}
											isMultiSelectedEnabled={false}
											clickContainer={
												<NCButton fieldid='trade_type'>
													{loadMultiLang(this.props, '36070PBR-000033')}
												</NCButton>
											} /* 国际化处理： 付款交易类型*/
										/>
									)}
								</div>
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
									dataSource: PAYBILL_CONST.paybillCacheKey,
									handlePageInfoChange: pageInfoClick.bind(this)
								})}
							</div>
							</NCDiv>
					</NCAffix>
				
					<NCScrollElement name="forminfo">
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								onBeforeEvent: beforeEvent.bind(this),
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCScrollElement>
				</div>
				<NCScrollElement name="businfo">
					<div className="nc-bill-bottom-area">
						<div className="nc-bill-table-area">
							{/* {this.getTableHead(buttons, this.tableId)} */}
							{createCardTable(this.tableId, {
								tableHead: this.getTableHead.bind(this, buttons, this.tableId),
								modelSave: ()=>{
									this.saveBill();
									this.props.cardTable.closeModel(PAYBILL_CONST.card_table_id);
								},
								onAfterEvent: afterEvent.bind(this),
								onBeforeEvent: beforeEvent.bind(this),
								showCheck: true,
								showIndex: true,
								adaptionHeight:true,
								isAddRow:true,
								addRowDefaultValue:defaultLineValue.bind(this,this.props),
								onSelected: this.buttonUsability.bind(this),
								onSelectedAll: this.buttonUsability.bind(this),
								modelDelRowBefore:()=> {
									let isfromindependent=this.props.form.getFormItemsValue('head', 'isfromindependent');
									let iscf=this.props.form.getFormItemsValue('head', 'is_cf');
									let  delFlag=(isfromindependent&&isfromindependent.value&&(isfromindependent.value==1)||(iscf&&iscf.value)); 
									if(delFlag){
										toast({
											color: 'warning',
											content:loadMultiLang(this.props, '36070PBR-000113')
												
										});
										
									}
									return !delFlag;
								 },

								modelAddRowBefore:()=> {
								   let isfromindependent=this.props.form.getFormItemsValue('head', 'isfromindependent');
								   let iscf=this.props.form.getFormItemsValue('head', 'is_cf');
								   let  addFlag=(isfromindependent&&isfromindependent.value&&(isfromindependent.value==1)||(iscf&&iscf.value));
								  if(addFlag){
									toast({
										color: 'warning',
										content:loadMultiLang(this.props, '36070PBR-000113')
									});
								  } 
								   return !addFlag;},
								modelAddRow: (props, moduleId, index) => {	
										index = Number(index) + Number(1);
										addline(props, PAYBILL_CONST.DataArr, index);
								

								 }
							
							})}
						</div>
					</div>
				</NCScrollElement>
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader && (
						<NCUploader
							billId={this.billId}
							target={target}
							placement={'bottom'}
							billNo={this.billno}
							onHide={this.onHideUploader}
							customInterface={
								{
									queryLeftTree: commonurl.lefttreequery,
									queryAttachments: PAYBILL_CONST.upload_url
								}
							}

						/>
					)}
				</div>
				<div>
					<ApproveDetail
						show={this.state.showAppr}
						close={this.closeApprove}
						billid={this.billId}
						billtype={this.state.billtype}
					/>
				</div>
				<div>
					<BillTrack
						show={this.state.showbilltrack}
						close={() => {
							this.setState({ showbilltrack: false });
						}}
						pk={this.state.showbilltrackpk}  //单据id
						type={this.state.showbilltracktype}  //单据类型
					/>
				</div>
				<div>
					<Inspection
						show={this.state.shoWIns}
						sourceData={this.state.sourceData}
						cancel={this.cancel.bind(this)}
						affirm={this.affirm.bind(this)}
					/>
				</div>
				<div>
					<PrintOutput
						ref="printOutput"
						url="/nccloud/cmp/paybills/paybillsprint.do"
						data={this.state.outputData}
						//callback={this.onSubmit}
					/>
				</div>
				<div>
              
				
				<div>
					{this.state.compositedisplay ? (
						<ApprovalTrans
							title={	loadMultiLang(this.props, '36070PBR-000114')}
							data={this.state.compositedata}
							//data={this.compositedata}
							display={this.state.compositedisplay}
							getResult={this.getAssginUsedr}
							cancel={this.turnOff}
						/>
					) : (
						''
					)}
				</div>
				<InvoiceLink 
               {...this.state.sscrpLinkInvoiceData}
                table={this.props.table}
                />
				</div> 
				<div>
				<InvoiceUploader
               {...this.state.sscrpInvoiceData}
                />
			    <InvoiceLink 
               {...this.state.sscrpInvoiceData}
                table={this.props.table}
                />
                </div> 
				{/** 网银补录 **/}
				<PayBuluForm
					showmodal={this.state.showBuLu}  //补录框显示
					modal={modal}
					onLineData={this.state.onLineData}  //补录数据
					moduleType={PAYBILL_CONST.sourceModel_CMP}  //模块编码
					modelType={this.state.modalValue} //补录框类型
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
				{createModal('delete', {
					title:loadMultiLang(this.props, '36070PBR-000035'),
					content:loadMultiLang(this.props, '36070PBR-000036'),
					 //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除所选数据吗?*/
					beSureBtnClick: this.delConfirm, //点击确定按钮事件
					//cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName:loadMultiLang(this.props, '36070PBR-000037'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
					leftBtnName:loadMultiLang(this.props, '36070PBR-000038'),
					 //右侧按钮名称， 默认确认/* 国际化处理： 确认*/
				})}
				{createModal('cancelModal', {
					title:loadMultiLang(this.props, '36070PBR-000039'), // 弹框表头信息/* 国际化处理： 确认取消*/
					content:loadMultiLang(this.props, '36070PBR-000040'),  //弹框内容，可以是字符串或dom/* 国际化处理： 是否确认取消*/
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName:loadMultiLang(this.props, '36070PBR-000037'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
					leftBtnName:loadMultiLang(this.props, '36070PBR-000038'), //右侧按钮名称， 默认确认/* 国际化处理： 确认*/
				})}
				{createModal('addNode', {
					title:loadMultiLang(this.props, '36070PBR-000041'), // 弹框表头信息/* 国际化处理： 确认修改*/
					content:loadMultiLang(this.props, '36070PBR-000042'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					beSureBtnClick: this.beSureBtnClick, //点击确定按钮事件
					cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName:loadMultiLang(this.props, '36070PBR-000037'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
					leftBtnName:loadMultiLang(this.props, '36070PBR-000038'), //右侧按钮名称， 默认确认/* 国际化处理： 确认*/
				})}
			</div>
		);
	}
}

Card = createPage({
	mutiLangCode: '36070PBR',
	domainName:'cmp',
	billinfo: {
		billtype: 'card',
		pagecode: PAYBILL_CONST.card_page_id,
		headcode: PAYBILL_CONST.card_from_id,
		bodycode: PAYBILL_CONST.card_table_id
	},
	orderOfHotKey: [ PAYBILL_CONST.card_from_id,PAYBILL_CONST.card_table_id]
})(Card);
export default Card;

// Card = createPage({
// 	// initTemplate: initTemplate,
//mutiLangCode: '36070PBR'
// })(Card);

// ReactDOM.render(<Card />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/