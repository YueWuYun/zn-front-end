/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, print, getMultiLang, promptBox,createPageIcon } from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix, NCButton, NCDiv } = base;
const { NCBackBtn } = base; //返回button
import { buttonClick, initTemplate, pageInfoClick, afterEvent, tableButtonClick, beforeEvent} from './events';
import { cardCache } from 'nc-lightapp-front';
let { getCacheById, updateCache, addCache, getNextId, deleteCacheById } = cardCache;
import { commonurl } from '../../../public/utils/constant';
import { high } from 'nc-lightapp-front';
const { Refer, NCUploader, BillTrack, ApproveDetail, PrintOutput, Inspection, ApprovalTrans } = high;
import { buttonVisible } from './events/buttonVisible';
import { orgVersionView } from '../../../../tmpub/pub/util/version/index.js'; //多版本显示
import InvoiceUploader from 'sscrp/rppub/components/invoice-uploader';
import InvoiceLink from 'sscrp/rppub/components/invoice-link';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
import {BBR_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../cons/constant.js';
const { APPCODE, LIST_PAGECODE, CARD__PAGECODE, CARD_FORMCODE, CARD_FORMCODE2,CARD_TABLECODE, BODY_EDIT_CODE} = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG,TS } = BILL_FIELD
const { BBR_CACHEKEY,BBR_PKNAMEKEY,BBR_STATEKEY,SEARCH_KEY,LINK_KEY,SAVED,APPROVING } = BBR_CONST
const { QUERY, QUERYBYIDS, QUERYCARD, SAVE, DELETE, PRINT, ORGCHANGE, ADDEVENT,QUERYCARDFROMBBM } = REQUEST_URL;

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = CARD_FORMCODE;
		this.moduleId = APPCODE; //模块id
		this.tableId = CARD_TABLECODE;
		this.pageId = CARD__PAGECODE;
		this.billno = '';
		this.billId = '';
		this.formVOClassName = 'NOTEEBMVO';//form表单的vo类名
		this.tableVOClassName = 'AggNOTEEBMVO';//table表体的vo类名
		this.state = {
			showUploader: false,
			target: null,
			billtype: '',
			tradetype: '',
			oldorg: '',
			oldorgDis: '',
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
	
	initData = () => {
		let src = this.props.getUrlParam('src');
		if (src === 'settlement') {
			let settlePk = this.props.getUrlParam('pk_settle');
			if (settlePk) {
				this.QuerySettleData(settlePk);
			}
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

	QuerySettleData = (pk_settle) => {
		let sendArr = {
			pk: pk_settle,
			pageid: CARD__PAGECODE
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
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						// this.props.cardTable.setStatus(this.tableId, 'edit');
						// this.props.form.setFormStatus(this.formId, 'edit');
						this.toggleShow();
					}
				}
			}
		});
	};

	pageShow = () => {
		if (this.props.getUrlParam('status') === 'add') {
			//清空表格
			this.props.form.EmptyAllFormValue(CARD_FORMCODE);
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
			let data = {
				pageid: CARD__PAGECODE
			};
			ajax({
				url: ADDEVENT,
				data: data,
				success: (res) => {
					if (res.success) {
						if (res.data) {
							if (res.data.head) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							}
							let pk_org = res.data.head[this.formId].rows[0].values.pk_org;
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
					url: QUERYCARD,
					data: data,
					success: (res) => {
						if (res.data) {
							 let billId;
							if (res.data.head) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								// let billno = res.data.head[this.formId].rows[0].values.bill_no.value;
							    billId = res.data.head[this.formId].rows[0].values[PK_NAME].value;
								// this.billno = billno;
								this.billId = billId;
							}
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							// 增加缓存
							//addCache(billId, res.data, CARD_FORMCODE, BBR_CACHEKEY);
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
			let pks = [];
			let lypks = this.props.getUrlParam('pks');
			let requrl ;
			if(lypks){
				pks = lypks.split(",");
				if(pks.length > 0){
					data = { pks: pks, pageid: this.pageId , pagetype: 'card'}
				}
				requrl = QUERYCARDFROMBBM;
			}else{
				requrl = QUERYCARD;
			}
			ajax({
				url: requrl,
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
							// this.setPknoteVal.call(this);
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
		let auto= this.props.getUrlParam('auto')||(this.props.getUrlParam('scene'));
		let flag = status === 'browse' ? false : true;

		if (flag) {
			// this.props.cardTable.setStatus(this.tableId, 'edit');	
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
			} else {
				this.props.resMetaAfterPkorgEdit();
				this.props.form.setFormItemsDisabled(CARD_FORMCODE,{'ly_total': true}); // 银行名称 
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
			this.props.form.setFormItemsDisabled(CARD_FORMCODE,{'pk_notetype': true}); // 票据类型
		} else {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
		}
		buttonVisible.call(this, this.props);
		// this.buttonUsability.call(this);
		orgVersionView.call(this, this.props, CARD_FORMCODE, 'pk_org', 'pk_org_v'); //多版本视图显隐性
	};


	//保存单据
	saveBill = () => {
		let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
		let flag = this.props.form.isCheckNow(this.formId);
		if (!this.props.cardTable.checkTableRequired(this.tableId)) {
			return;
		}
		if (!flag) {
			return;
		}
		let cacheFlag = true;
		if (this.props.getUrlParam('status') === 'edit') {
			cacheFlag = false;
		}
		ajax({
			url: SAVE,
			data: CardData,
			success: (res) => {
				let pk_paybill = null;
				let bill_no = '';
				if (res.success) {
					if (res.data) {
						//放入缓存
						toast({
							color: 'success',
							content: this.state.json['36070BBR-000006']
						}); /* 国际化处理： 保存成功*/
						if (res.data.head && res.data.head[this.formId]) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							pk_paybill = res.data.head[this.formId].rows[0].values[PK_NAME].value;
							bill_no = res.data.head[this.formId].rows[0].values[VBILLNO].value;
						}
						
						if (res.data.body && res.data.body[this.tableId]) {	
							let body=res.data.body;
							// pk_paybill = body[this.formId].values[PK_NAME].value;
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							//  body[CARD_TABLECODE] = this.props.cardTable.updateDataByRowId(
							// 	this.tableId,
							// 	res.data.body[this.tableId]
							// );
							if (body&&body[CARD_TABLECODE]) {
								res.data.body = body;
							}
						}
						if (cacheFlag) {
							addCache(pk_paybill, res.data, CARD_FORMCODE, BBR_CACHEKEY,res.data.head[this.formId].rows[0].values);
						} else {
							updateCache(
								PK_NAME,
								pk_paybill,
								res.data,
								CARD_FORMCODE,
								BBR_CACHEKEY,res.data.head[this.formId].rows[0].values
							);
						}
						this.billno = bill_no;
						this.billId=pk_paybill;
						this.props.beforeUpdatePage();
					}
				}
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
							content: this.state.json['36070BBR-000007']
						}); /* 国际化处理： 删除成功*/
						let url_id = getNextId(deleteId, BBR_CACHEKEY);
						//删除缓存
						deleteCacheById(PK_NAME, deleteId, BBR_CACHEKEY);
						if (!url_id) {
							this.billno = '';
							this.props.form.EmptyAllFormValue(this.formId);
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
	
	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add') {
			return 'main-button';
		} else {
			return 'secondary-button';
		}
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

		this.props.cardTable.setStatus(this.tableId, 'edit');
		let eventdata = {};
		if (!pk_org) {
			this.props.initMetaByPkorg();
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
				PK_ORG,
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
	cancelBtnClick = () => {
		 /* 国际化处理： 修改之前的财务组织*/
		this.props.form.setFormItemsValue(CARD_FORMCODE, {
			pk_org: { value: this.state.oldorg, display: this.state.oldorgDis }
		});
		this.props.form.setFormStatus(this.formId, 'edit');
	};

	closeModal = () => {
		this.setState({
			billCodeModalShow: false
		});
	};

	updateCacheData = (pk_field, pkvalue, cacheData, moduleId, datasource) => {
		let cache = getCacheById(pkvalue, datasource);
		if (cache) {
			updateCache(pk_field, pkvalue, cacheData, moduleId, datasource);
		} else {
			addCache(pkvalue, cacheData, moduleId, datasource);
		}
	};

	getCacheDataById=(pk)=>{
		let CacheData = getCacheById(pk, BBR_CACHEKEY); 
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

	//卡片返回按钮
	handleClick = () => {
		//先跳转列表
		this.props.pushTo('/list',{pagecode: LIST_PAGECODE,});
	};
	render() {
		let { cardTable, form, cardPagination } = this.props;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;

		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
								<div className="header-title-search-area">
										{createBillHeadInfo({
											title: this.state.json['36070BBR-000000'],
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
										dataSource: BBR_CACHEKEY,
										handlePageInfoChange: pageInfoClick.bind(this)
									})}
								</div>
						</NCDiv>
					</NCAffix>
					<NCScrollElement name="forminfo">
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								expandArr: [ this.formId, CARD_FORMCODE2 ],
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
								tableHead: this.getTableHead.bind(this, buttons, this.tableId),
								modelSave: ()=>{
									this.saveBill();
									this.props.cardTable.closeModel(CARD_TABLECODE);
								},
								onAfterEvent: afterEvent.bind(this),
								onBeforeEvent: beforeEvent.bind(this),
								adaptionHeight: true,
								// showCheck: false,
								// showIndex: true,
								// onSelected: this.buttonUsability.bind(this),
								// onSelectedAll: this.buttonUsability.bind(this),
								// modelAddRowBefore:()=> {},
								// modelAddRow: (props, moduleId, index) => {	
								// 		index = Number(index) + Number(1);
								// 		addline(props, BBR_CONST.DataArr, index);	
								//  }
							})}
						</div>
					</div>
				</NCScrollElement>

				<div>
					<PrintOutput
						ref = "printOutput"
						url = {PRINT}
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
//mutiLangCode: '36070BBR'
// })(Card);

// ReactDOM.render(<Card />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/