/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, print,cacheTools,getMultiLang } from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix, NCButton,NCDiv } = base;
import { commonurl } from '../../../public/utils/constant';
import { PAYBILL_CONST } from '../cons/constant.js';
import { buttonClick, initTemplate, pageInfoClick, afterEvent, tableButtonClick,beforeEvent } from './events';
import { high } from 'nc-lightapp-front';
const { Refer, NCUploader, BillTrack, ApproveDetail, PrintOutput,Inspection,ApprovalTrans} = high;
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
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
		this.pageId = '36070PBR_C02';
		this.code = '';
		this.billId = '';
		this.state = {
			billno: '', // 单据编号
			showUploader: false,
			target: null,
			shoWIns: false,
			sourceData: null,
			show:false,
			billId: '',
			billid: '',
			billtype: '',
			tradetype: '',
			oldorg: '',
			oldorgDis: '',
			showAppr: false,
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

		
	};
	initData = () => {
		let src = this.props.getUrlParam('src');
		let billtype=this.props.getUrlParam('srcbilltype');
	
		if (src === 'recbills') {
			let searchData = cacheTools.get('recbillsData');
			if (searchData && searchData.length > 0) {
				this.linkQueryData(searchData);
			}
		} else if (src === 'informer') {
			let searchData = [this.props.getUrlParam('id')];
			if (searchData && searchData.length > 0) {
				this.linkQueryData(searchData);
			}
		} else if (src === 'dfgz') {
			let searchData = [this.props.getUrlParam('id')];
			if (searchData && searchData.length > 0) {
				this.linkQueryData(searchData);
			}
		}else if (billtype === '36JA') {
			let searchData = [this.props.getUrlParam('id')];
			if (searchData && searchData.length > 0) {
				this.linkQueryData(searchData);
			}
		}else if (billtype === '36J3') {
			let searchData = [this.props.getUrlParam('id')];
			if (searchData && searchData.length > 0) {
				this.linkQueryData(searchData);
			}
		}else if (billtype === '36J5'||billtype === '36J1') {
			let searchData = [this.props.getUrlParam('id')];
			if (searchData && searchData.length > 0) {
				this.linkQueryData(searchData);
			}
		} else{
			let searchData = [this.props.getUrlParam('id')];
			if(searchData && searchData.length > 0){
				this.linkQueryData(searchData);
			}
		}
	
	};


	linkQueryData = (searchData) => {
		let sendArr = {
			pks: searchData,
			pageid: '36070PBR_C02'
		};
		ajax({
			url: '/nccloud/cmp/paybills/linkqueryrecbill.do',
			data: sendArr,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							let billno = res.data.head[this.formId].rows[0].values.bill_no.value;
							let billId = res.data.head[this.formId].rows[0].values.pk_paybill.value;
						
							this.code = billno;
							this.billId = billId;

							this.setState({
								billno: billno,
								billId: billId
							});
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

	QuerySettleData = (pk_settle) => {
		let sendArr = {
			pk: pk_settle,
			pageid: '36070PBR_C02'
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
						
							this.setState({
								billno: billno,
								billId: billId
							});
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
				pageid: '36070PBR_C02'
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
							}
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
			let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
			ajax({
				url: '/nccloud/cmp/billmanagement/querybypk.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							let billno = res.data.head[this.formId].rows[0].values.bill_no.value;
							let billId = res.data.head[this.formId].rows[0].values.pk_paybill.value;
							this.setState({
								billno: billno,
								billId: billId
							});
							this.code = billno;
		                    this.billId = billId;
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

		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置看片翻页的显隐性
		if (flag) {
			this.props.cardTable.setStatus(this.tableId, 'edit');
			this.props.form.setFormStatus(this.formId, 'edit');
		} else {
			this.props.cardTable.setStatus(this.tableId, status);
			this.props.form.setFormStatus(this.formId, status);

			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.code //修改单据号---非必传
			});

		}
		//buttonVisible(this.props);
	};

	//保存单据
	saveBill = () => {
		if (this.props.getUrlParam('copyFlag') === 'copy') {
			this.props.form.setFormItemsValue(this.formId, { pk_paybill: null });
			this.props.form.setFormItemsValue(this.formId, { ts: null });
		}
		//过滤表格空行
		//this.props.cardTable.filterEmptyRows(this.tableId);
		// let flag = this.props.form.isCheckNow(this.formId)
		// if (flag) {
		let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
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
				if (res.success) {
					if (res.data) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000005') });/* 国际化处理： 保存成功*/
						if (res.data.head && res.data.head[this.formId]) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							pk_paybill = res.data.head[this.formId].rows[0].values.pk_paybill.value;
						}
						if (res.data.body && res.data.body[this.tableId]) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
					}
				}
				this.props.linkTo('../card/index.html', {
					status: 'browse',
					id: pk_paybill
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
				id: this.props.getUrlParam('id'),
				ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
			},
			success: () => {
				if (res) {
					this.props.linkTo('../list/index.html');
					let idObj = {};
					idObj.id = delId;
					idObj.status = 3;
					this.props.cardPagination.setCardPaginationId(idObj); //暴露出最新的id值
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
	suggestChange(val) {
		this.setState({
			suggestion: val
		});
	}
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
	getButtonNames(codeId) {
		if (codeId === 'edit' || codeId === 'add') {
			return 'main-button';
		} else {
			return 'secondary-button';
		}
	}
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
	     let  eventdata={};
		if (!pk_org) {
			this.props.initMetaByPkorg();
		} else {
			 eventdata = this.props.createHeadAfterEventData(
				'36070PBR_C02',
				'head',
				'paybilldetail_table',
				this.moduleId,
				'pk_org',
				''
			);
	 eventdata.newvalue={};
	 eventdata.oldvalue={};
		//基础信息
		let data = {
			pageid: '36070PBR_C02'
		};
		ajax({
			url: '/nccloud/cmp/paybills/paybillconstructor.do',
			data: data,
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
		console.log(this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000029'),this.state.oldorg);/* 国际化处理： 修改之前的财务组织*/
		this.props.form.setFormItemsValue('head', { 'pk_org': { value:this.state.oldorg, display: this.state.oldorgDis } });
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
		//先跳转列表
		this.props.pushTo('/list');
		//this.props.linkTo('/cmp/billmanagement/paybill/main/index.html#/list');
	   
	};
	closeApprove = () => {
		this.setState({
			showAppr: false
		});
	};

	render() {

		let { cardTable, form, button, modal, cardPagination } = this.props;
		let buttons = this.props.button.getButtons();
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let multiLang = this.props.MutiInit.getIntl('36070PBR');

		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButton, createButtonApp,createErrorFlag } = button;
		const {ncmodal } = this.props;
        let { createModal } = ncmodal;
		//let { createModal } = modal;
		let { showUploader, target, billno, billId, tradetype , shoWIns, sourceData} = this.state;
		debugger
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
							{
								 createBillHeadInfo({
								title:
									this.props.MutiInit.getIntl('36070PBR') &&
											this.props.MutiInit.getIntl('36070PBR').get('36070PBR-000045'),
									billCode: this.code,
									initShowBackBtn: false
									})}
						</div>
							<div className="header-button-area">
								<div className="button-app-wrapper">
									{createErrorFlag({
										headBtnAreaCode: cons.card.btnHeadCode
									})}
								</div>
								<div className="button-app-wrapper">
									{this.props.ViewModel.getData('status') === 'browse' &&false&&(
										<Refer
											placeholder={
												this.props.MutiInit.getIntl('36070PBR') &&
												this.props.MutiInit.getIntl('36070PBR').get('36070PBR-000032')
											} /* 国际化处理： 单据模板类型*/
											refName={
												this.props.MutiInit.getIntl('36070PBR') &&
												this.props.MutiInit.getIntl('36070PBR').get('36070PBR-000033')
											} /* 国际化处理： 付款交易类型*/
											refCode={'tradetype001'}
											refType={'grid'}
											queryGridUrl={'/nccloud/riart/ref/fiBillTypeTableRefAction.do'}
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
													{this.props.MutiInit.getIntl('36070PBR') &&
														this.props.MutiInit.getIntl('36070PBR').get('36070PBR-000033')}
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
						{/*{this.getTableHead(buttons, this.tableId)}*/}
						{createCardTable(this.tableId, {
							tableHead: this.getTableHead.bind(this, buttons, this.tableId),
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
						<NCUploader billId={billId} target={target} placement={'bottom'} billNo={billno}
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
					<ApproveDetail show={this.state.showAppr}
					  close={this.closeApprove} 
					  billid={this.state.billid}
					  billtype={this.state.billtype}
					  />
				</div>
				<div>
					<BillTrack
						show={this.state.show}
						close={() => {
							this.setState({ show: false });
						}}
						pk={this.state.billId}
						type="F5" //单据类型
						//billtype={this.state.billtype}
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
					<Inspection
						show={this.state.shoWIns}
						sourceData={this.state.sourceData}
						cancel={this.cancel.bind(this)}
						affirm={this.affirm.bind(this)}
					/>
				</div>
				{createModal('delete', {
					title: multiLang && multiLang.get('20521030-0020'),
					content: multiLang && multiLang.get('20521030-0006'),
					beSureBtnClick: this.delConfirm
				})}
				{createModal('delete', {
					title: multiLang && multiLang.get(this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000035')),/* 国际化处理： 确认删除*/
					content: multiLang && multiLang.get('20521030-0006')
				})}
				{createModal('addNode', {
					title: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000041'), // 弹框表头信息/* 国际化处理： 确认修改*/
					content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000042'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					beSureBtnClick: this.beSureBtnClick, //点击确定按钮事件
					cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000066'), //左侧按钮名称,默认关闭/* 国际化处理： 否（N）*/
					leftBtnName: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000067') //右侧按钮名称， 默认确认/* 国际化处理： 是（Y）*/
				})}
			</div>
		);
	}
}

Card = createPage({
	//initTemplate: initTemplate,
	mutiLangCode: '36070PBR'
})(Card);
//export default linkCard;
ReactDOM.render(<Card />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/