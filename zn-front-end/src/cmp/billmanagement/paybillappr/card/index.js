/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, print,createPageIcon,cardCache } from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix, NCButton } = base;
import { buttonClick, initTemplate, pageInfoClick, afterEvent, tableButtonClick, beforeEvent } from './events';
import {
	card_page_url
} from '../cons/constant.js';
import { commonurl } from '../../../public/utils/constant';
import { high } from 'nc-lightapp-front';
const { Refer, NCUploader, BillTrack, ApproveDetail, PrintOutput } = high;
import { buttonVisible } from './events/buttonVisible';
const { NCDiv } = base;
let {setDefData, getDefData } = cardCache;
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = 'head';
		// this.searchId = '20521030';
		this.moduleId = '2052'; //模块id
		this.tableId = 'paybilldetail_table';
		this.pageId = '36070PBR_C03';
		this.billno = '';
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
			sscivmMessage:'',
			outputData: {
				funcode: '36070PBM', //功能节点编码，即模板编码
				nodekey: 'NCCLOUD', //模板节点标识
				printTemplateID: '1001Z610000000004R6L', //模板id
				oids: [],
				outputType: 'output'
			}
		};
		initTemplate.call(this, props);
	}
	componentDidMount() {
		let src = this.props.getUrlParam('src');
		if (src === 'settlement') {
			let settlePk = this.props.getUrlParam('pk_settle');
			if (settlePk) {
				this.QuerySettleData(settlePk);
			}
		} else {
			this.pageShow();
		}
	}

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
					}
				}
			}
		});
	};

	pageShow = () => {
		if (this.props.getUrlParam('status') === 'add') {
			this.toggleShow();
			//清空表格
			this.props.form.EmptyAllFormValue('head');
			let data = {
				pageid: '36070PBR_D5_card'
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
									this.props.getUrlParam('tradetypecode') &&
									this.props.getUrlParam('tradetypename')
								) {
									this.props.form.setFormItemsValue('head', {
										pk_tradetypeid: {
											value: this.props.getUrlParam('tradetypecode'),
											display: this.props.getUrlParam('tradetypename')
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
					tpflag: true
				});
				this.props.form.EmptyAllFormValue(this.formId);
				this.props.cardTable.resetTableData(this.tableId);
				this.props.form.setFormStatus(this.formId, 'browse');
			} else {
				let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
				//弹异常提示
				cardCache.setDefData(cons.comm.iserrtoast, cons.comm.dataSource, true);
				ajax({
					url: '/nccloud/cmp/billmanagement/querybypk.do',
					data: data,
					success: (res) => {
						if (res.data) {
							if (res.data.head) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								let billno = res.data.head[this.formId].rows[0].values.bill_no.value;
								let billId = res.data.head[this.formId].rows[0].values.pk_paybill.value;
								this.billno = billno;
								let bill_status = this.setState({
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
					}
				});
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
					if (this.props.getUrlParam('op') === 'protopay' || this.props.getUrlParam('op') === 'unprotopay') {
						this.props.cardTable.showColByKey(this.tableId, [
							'cf_type',
							'cf_status',
							'refusenote',
							'is_refuse'
						]);
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
	sourceFlagTranslate = (data) => {
		let sourceFlag = data[this.formId].rows[0].values.source_flag;
		if (sourceFlag) {
			let val = sourceFlag.value;
			switch (val) {
				case '2':
					this.props.form.setFormItemsValue('head', {
						source_flag: {
							value: val,
							display: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000011')/* 国际化处理： 现金管理*/
						}
					});
					break;
				case '9':
					this.props.form.setFormItemsValue('head', {
						source_flag: {
							value: val,
							display: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000012')/* 国际化处理： 协同单据*/
						}
					});
					break;
				case '5':
					this.props.form.setFormItemsValue('head', {
						source_flag: {
							value: val,
							display: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000013')/* 国际化处理： 资金结算*/
						}
					});
					break;
				case '8':
					this.props.form.setFormItemsValue('head', {
						source_flag: {
							value: val,
							display: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000014')/* 国际化处理： 票据管理*/
						}
					});
					break;
				case '6':
					this.props.form.setFormItemsValue('head', {
						source_flag: {
							value: val,
							display: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000015')/* 国际化处理： 网上银行*/
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
				tpflag: false
			});
		} else {
			this.props.cardTable.setStatus(this.tableId, status);
			this.props.form.setFormStatus(this.formId, status);
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.billno //修改单据号---非必传
			});
		}
		buttonVisible.call(this, this.props);
		//this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag); //设置看片翻页的显隐性
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
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000016') });/* 国际化处理： 请检查必输项是否填写*/
		}
		let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
		//  let tableflag = this.props.cardTable.getCheckedRows(this.tableId);
		// if(!tableflage){
		// 	toast({ color: 'warning', content: '请检查必输项是否填写' });
		// }
		let url = '/nccloud/cmp/paybills/save.do'; //新增保存
		if (this.props.getUrlParam('status') === 'edit') {
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
				if (res.success) {
					if (res.data) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000000') });/* 国际化处理： 保存成功*/
						if (res.data.head && res.data.head[this.formId]) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							pk_paybill = res.data.head[this.formId].rows[0].values.pk_paybill.value;
							bill_no = res.data.head[this.formId].rows[0].values.bill_no.value;
							pagecode = res.data.head[this.formId].rows[0].values.trade_type.value;
							let ntberrmsg= res.data.head[this.formId].rows[0].values.ntberrmsg.value;
							if(ntberrmsg){
								toast({ color: 'warning', content: ntberrmsg });
							}
						}
						this.setState({
							billno: bill_no
						});
						if (res.data.body && res.data.body[this.tableId]) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
					}
				}
				this.props.linkTo(card_page_url, {
					status: 'browse',
					id: pk_paybill,
					pagecode: pagecode
				});
				this.toggleShow();
			}
		});
	};

	cardConstructor = (key) => {};

	//删除单据
	delConfirm = () => {
		ajax({
			url: '/nccloud/cmp/billmanagement/delete.do',
			data: {
				pk: this.props.getUrlParam('id'),
				ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
			},
			success: (res) => {
				if (res.success) {
					toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000017') });/* 国际化处理： 删除成功*/
					let idObj = { id: this.props.getUrlParam('id'), status: 3 };
					let url_id = this.props.cardPagination.getNextCardPaginationId(idObj);
					pageInfoClick.call(this, this.props, url_id);
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
		//this.props.cardTable.resetTableData(this.tableId);
		let eventdata = {};
		if (!pk_org) {
			this.props.initMetaByPkorg();
		} else {
			eventdata = this.props.createHeadAfterEventData(
				'36070PBR_D5_card',
				'head',
				'paybilldetail_table',
				this.moduleId,
				'pk_org',
				''
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
		console.log(this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000018'), this.state.oldorg);/* 国际化处理： 修改之前的财务组织*/
		this.props.form.setFormItemsValue('head', {
			pk_org: { value: this.state.oldorg, display: this.state.oldorgDis }
		});
		this.props.form.setFormStatus(this.formId, 'edit');
	};
	beforeUpload=  (billId, fullPath, file, fileList)=> {
		// 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
		console.log(billId, fullPath, file, fileList);

		const isJPG = file.type === 'image/jpeg';
		if (!isJPG) {
			alert(this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000019'));/* 国际化处理： 只支持jpg格式图片*/
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			alert(this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000020'));/* 国际化处理： 上传大小小于2M*/
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
	};

	render() {
		let { cardTable, form, button, modal, cardPagination,BillHeadInfo } = this.props;
		
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButton, createButtonApp,createErrorFlag } = button;
		const { ncmodal } = this.props;
		let { createModal } = ncmodal;
		const { createBillHeadInfo } = BillHeadInfo;
		//let { createModal } = modal;
		let { showUploader, target, billno, billId, tradetype, shoWIns, sourceData } = this.state;
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
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
						
							<div className="header-title-search-area">
							{createBillHeadInfo({
										title:
										this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000031'),
										billCode: this.billNo,
										initShowBackBtn: false
									})}
							</div>

							<div className="header-button-area">
								{createErrorFlag({
									headBtnAreaCode: cons.card.btnHeadCode
								})}
								{this.props.button.createButtonApp({
									area: 'card_head',
									buttonLimit: 4,
									onButtonClick: buttonClick.bind(this),
									popContainer: document.querySelector('.header-button-area')
								})}
							</div>
							<div className="header-cardPagination-area" style={{ float: 'right' }}>
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this)
								})}
							</div>
					
						</NCDiv>
					</NCAffix>
					<NCScrollElement name="forminfo">
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
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
								modelSave: this.saveBill,
								onAfterEvent: afterEvent.bind(this),
								showCheck: true,
								showIndex: true
							})}
						</div>
					</div>
				</NCScrollElement>
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader && (
						<NCUploader
							billId={billId}
							target={target}
							placement={'bottom'}
							billNo={billno}
							onHide={this.onHideUploader}
							customInterface={
								{
									queryLeftTree: commonurl.lefttreequery,
									queryAttachments: '/nccloud/cmp/paybills/enclosurequery.do'
								}
							}
						/>
					)}
				</div>
				<div>
					<ApproveDetail show={this.state.showAppr} close={this.closeApprove} billtype="F5" billid={billId} />
				</div>
				<div>
					<BillTrack
						show={this.state.show}
						close={() => {
							this.setState({ show: false });
						}}
						pk={billId} //单据id
						type="F5" //单据类型
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
				{createModal('delete', {
					title: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000021'), // 弹框表头信息/* 国际化处理： 确认删除*/
					content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000022'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除所选数据吗?*/
					beSureBtnClick: this.delConfirm, //点击确定按钮事件
					//cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000023'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
					leftBtnName: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000024') //右侧按钮名称， 默认确认/* 国际化处理： 确认*/
				})}
				{createModal('cancelModal', {
					title: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000025'), // 弹框表头信息/* 国际化处理： 确认取消*/
					content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000026'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否确认取消*/
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000023'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
					leftBtnName: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000024') //右侧按钮名称， 默认确认/* 国际化处理： 确认*/
				})}
				{createModal('addNode', {
					title: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000027'), // 弹框表头信息/* 国际化处理： 确认修改*/
					content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000028'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					beSureBtnClick: this.beSureBtnClick, //点击确定按钮事件
					cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000023'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
					leftBtnName: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000024') //右侧按钮名称， 默认确认/* 国际化处理： 确认*/
				})}
			</div>
		);
	}
}

Card = createPage({
	// initTemplate: initTemplate,
	mutiLangCode: '36070PBRAPPR'
})(Card);

ReactDOM.render(<Card />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/