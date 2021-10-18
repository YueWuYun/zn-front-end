/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, print } from 'nc-lightapp-front';
const { NCBackBtn } = base;//返回button
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix, NCButton } = base;
import { cardCache , getMultiLang,promptBox} from 'nc-lightapp-front';
import { commonurl } from '../../../public/utils/constant';
let { getCacheById, updateCache, addCache, getNextId, deleteCacheById } = cardCache;
 import { buttonClick, initTemplate, pageInfoClick, afterEvent, tableButtonClick,beforeEvent } from './events';
import { high } from 'nc-lightapp-front';
import { PAYBILL_CONST } from '../cons/constant.js';
const { Refer, NCUploader, BillTrack, ApproveDetail,ApprovalTrans} = high;
import { buttonVisible } from './events/buttonVisible';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
import { judgeCurrtype,judgeTableCurrtype,judgeTableRate,judgeFormRate } from './events/judgeCurrtype';
const { NCDiv } = base;
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
		this.pageId = '36070PBR_C04';
		this.tradeType = 'trade_type';//单据控制规则交易类型字段名称（也可传递的单据类型）
		this.formVOClassName = 'BillVO';//form表单的vo类名
		this.tableVOClassName = 'BillAggVO';//table表体的vo类名
		this.showbilltrackpk = '',//联查单据pk
		this.showbilltracktype = '',//联查单据类型
		this.commitflag='',
		this.billno='',
		this.state = {
			billno: '', // 单据编号
			showUploader: false,
			target: null,
			billId: '',
			billtype:'',
			tradetype: {},
			oldorg:'',
			oldorgDis:'',
			shoWIns: false,
			sourceData: null,
			showAppr: false,
			show:false,
			pasteflag: false,
			openflag:'true',
			showNCbackBtn: false,
			compositedata: '',
			getAssginUsedr: '',
			compositedisplay: false,
			showbilltrackpk:'',
			showbilltracktype:''
			
		};
		initTemplate.call(this, props);
	}
	componentDidMount() {
		debugger;
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
		        // 关闭浏览器
		        window.onbeforeunload = () => {
		            let status = this.props.cardTable.getStatus(PAYBILL_CONST.card_from_id);
		            if (status !== 'browse') {
		                return ;
		            }
		        };

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

	QuerySettleData = (pk_settle) => {
		let sendArr = {
			pk: pk_settle,
			pageid: '36070PBR_C04'
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
								billno: billno
							});
							this.billno=billno;
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
				pageid: '36070PBR_C04'
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
							this.billno=billno;
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						this.sourceFlagTranslate(res.data.head);
						this.toggleShow();
						
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
				},
				error: () => {
					this.setState({
						billno:'',
						billId:''
					});
					this.billno='';
					this.props.form.EmptyAllFormValue(this.formId);
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
					this.toggleShow();

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
							this.billno=billno;
							judgeFormRate.call(this,res.data.userjson,this.formId);
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
					//确认操作
					if (this.props.getUrlParam('op') === 'confirm' ) {
						 this.props.cardTable.setColEditableByKey('paybilldetail_table', 'pay_primal',true)
						 this.props.form.setFormItemsDisabled('head',{'pk_currtype':true})
						//}
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
							this.billno=billno;
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
		let flag = status === 'browse' ? true : false;

		//this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag); //设置看片翻页的显隐性
		if (flag) {
			this.props.ViewModel.setData('status', status);
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true ,//控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.billno //修改单据号---非必传
			});
		} else {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
		}
		buttonVisible.call(this, this.props);
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
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000000') });/* 国际化处理： 保存成功*/
						if (res.data.head && res.data.head[this.formId]) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							pk_paybill = res.data.head[this.formId].rows[0].values.pk_paybill.value;
						    let ntbMessage = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
							if (ntbMessage) {
								toast({
									color: 'warning',
									content: ntbMessage
								});
							}
                            						
						}
						if (res.data.body && res.data.body[this.tableId]) {
							let body=res.data.body;
							 body[PAYBILL_CONST.card_table_id] = this.props.cardTable.updateDataByRowId(
								this.tableId,
								res.data.body[this.tableId]
							);
							if (body&&body[PAYBILL_CONST.card_table_id]) {
								res.data.body = body;
							}
							//this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
					}
					let cache = getCacheById(pk_paybill, PAYBILL_CONST.paybillCacheKey);
	               if (!cache) {
					updateCache(
						PAYBILL_CONST.paybill_pkname,
						pk_paybill,
						res.data,
						PAYBILL_CONST.card_from_id,
						PAYBILL_CONST.paybillCacheKey
					);
				    } else{
						addCache(pk_paybill, res.data, PAYBILL_CONST.card_from_id, PAYBILL_CONST.paybillCacheKey);
					}


				}
				this.props.setUrlParam({
					status: 'browse',
					id: pk_paybill
					//pagecode: pagecode
				});
				this.toggleShow();
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
			// 	id: deleteId,
			// 	ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
			// },
			success: (res) => {
				debugger;
				if (res.success) {
					let { data,status } = res.data;
					if(status==1){
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000012') });/* 国际化处理： 删除成功*/
						let url_id = getNextId(deleteId, PAYBILL_CONST.paybillCacheKey);
						//删除缓存
						deleteCacheById(PAYBILL_CONST.paybill_pkname, deleteId, PAYBILL_CONST.paybillCacheKey);
						if(url_id){
							let cardData = getCacheById(url_id, PAYBILL_CONST.paybillCacheKey);
								if (cardData) {
									this.props.form.setAllFormValue({
										[this.formId]: cardData.head[PAYBILL_CONST.card_from_id]
									});
									this.props.cardTable.setTableData(this.tableId, cardData.body['paybilldetail_table']);
								} else {
									pageInfoClick.call(this, this.props, url_id);
								}
								}else{
									this.props.button.setButtonVisible(
										[
											'delete',
											'confirm',
											'canelconfirm',
											'billQueryGroup',
											'linkquery',
											'billlinkquery',
											 'billquery',
											 'BillLQueryVoucher',
											 'billlinkquery'
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
									this.billno='';
									this.props.form.EmptyAllFormValue(this.formId);
									this.props.form.setFormStatus(this.formId, 'browse');
			
									this.props.cardTable.setTableData(this.tableId, { rows: [] });
		
		
								}
					}else{
						let msgData=data[0];
						toast({ color: 'danger', content:msgData.msg});

					}

					// let idObj = { id: this.props.getUrlParam('id'), status: 3 };
					// let url_id = this.props.cardPagination.getNextCardPaginationId(idObj);
					// this.props.cardPagination.setCardPaginationId(idObj);
					// pageInfoClick.call(this, this.props, url_id);
				}
			}
		});
	};

	//审批按钮操作事件
	approveRadio = (val) => {
		this.setState(
			{
				approveType: val
			}
			
		)
	};
	//输入意见输入框
	suggestChange=(val)=> {
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
	getButtonNames= (codeId) =>{
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
				'36070PBR_C04',
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
			pageid: '36070PBR_C04'
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
		//console.log(this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000013'),this.state.oldorg);/* 国际化处理： 修改之前的财务组织*/
		this.props.form.setFormItemsValue('head', { 'pk_org': { value:this.state.oldorg, display: this.state.oldorgDis } });
		this.props.form.setFormStatus(this.formId, 'edit');
	};
	beforeUpload=(billId, fullPath, file, fileList)=> {
		// 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
		//console.log(billId, fullPath, file, fileList);

		const isJPG = file.type === 'image/jpeg';
		if (!isJPG) {
			alert(this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000014'));/* 国际化处理： 只支持jpg格式图片*/
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			alert(this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000015'));/* 国际化处理： 上传大小小于2M*/
		}
		return isJPG && isLt2M;
		// 备注： return false 不执行上传  return true 执行上传
	}
	cancel= () =>  {
		this.setState({
			shoWIns: false
		});
	}
	closeApprove = () => {
		this.setState({
			showAppr: false
		});
	};
	affirm=(info)=> {
		//console.log(info);
		this.setState({
			shoWIns: false
		});
	}
	click= () =>  {
		// alert('1');
		// this.setState({
		//  sourceData: text1,
		//  show: true
		// })
	}
	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};

	buttonUsability= () => {
		let Rows =this.props.cardTable.getCheckedRows(this.tableId);
	   if(Rows&&Rows.length>=1){
		 this.props.button.setButtonDisabled( ['addline','delline','copyline'],false)
	  } else{
		  this.props.button.setButtonDisabled( ['delline','copyline'],true)
	  }
	 };
	    //卡片返回按钮
    handleClick = () => {
        //先跳转列表
  this.props.pushTo('/list');
//         this.props.linkTo('/cmp/billmanagement/paybillcomp/list/index.html');
    }
sourceFlagTranslate = (data) => {
	let sourceFlag = data[this.formId].rows[0].values.source_flag;
	if (sourceFlag) {
		let val = sourceFlag.value;
		switch (val) {
			case '2':
				this.props.form.setFormItemsValue('head', {
					source_flag: {
						value: val,
						display: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000054')/* 国际化处理： 现金管理*/
					}
				});
				break;
			case '9':
				this.props.form.setFormItemsValue('head', {
					source_flag: {
						value: val,
						display: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000055')/* 国际化处理： 协同单据*/
					}
				});
				break;
			case '5':
				this.props.form.setFormItemsValue('head', {
					source_flag: {
						value: val,
						display: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000056')/* 国际化处理： 资金结算*/
					}
				});
				break;
			case '8':
				this.props.form.setFormItemsValue('head', {
					source_flag: {
						value: val,
						display: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000057')/* 国际化处理： 票据管理*/
					}
				});
				break;
			case '6':
				this.props.form.setFormItemsValue('head', {
					source_flag: {
						value: val,
						display: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000058')/* 国际化处理： 网上银行*/
					}
				});
				break;
		}
	}
};
DoubleClick=(record, index,props,e)=> {
	 this.setStateCache();
	props.pushTo("/card",{status:"browse",id:record.pk_paybill.value,
	bill_status:record.bill_status.value});
};
getCacheDataById=(pk)=>{
	let cardData = getCacheById(pk, PAYBILL_CONST.paybillCacheKey); 
	if (cardData) {
		this.props.setUrlParam({
			status: 'browse'		
		});
	    let billno = cardData.head[PAYBILL_CONST.card_from_id].rows[0].values.bill_no.value;
        let  billId = cardData.head[PAYBILL_CONST.card_from_id].rows[0].values.pk_paybill.value;
		this.props.form.setAllFormValue({ [this.formId]: cardData.head[PAYBILL_CONST.card_from_id] });
		this.props.cardTable.setTableData(this.tableId, cardData.body['paybilldetail_table']);
		this.setState({
			billno: billno,
			billId:billId
		});
		this.billno = billno;
		//this.billId = billId;
		this.toggleShow();
		return true;
	} else{
		return false;
	}
	}
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

	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButton, createButtonApp,createErrorFlag } = button;
		const {ncmodal } = this.props;
        let { createModal } = ncmodal;
		//let { createModal } = modal;
		let { showUploader, target, billno, billId, tradetype , shoWIns, sourceData,showAppr,showNCbackBtn} = this.state;
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
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
				
						<div className="header-title-search-area">
								
								{createBillHeadInfo({
									title:
										this.props.MutiInit.getIntl('36070PBRCOMP') &&
										this.props.MutiInit.getIntl('36070PBRCOMP').get('36070PBRCOMP-000029'),
									billCode: this.billno,
									backBtnClick: () => {
										this.handleClick();
									}
								})}
						
						</div>
						
						<div className="header-button-area">
							{createErrorFlag({
								headBtnAreaCode: cons.card.btnHeadCode
							})}
							{false && (
								<Refer
									placeholder={this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000016')}/* 国际化处理： 单据模板类型*/
									refName={this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000017')}/* 国际化处理： 付款交易类型*/
									refCode={'tradetype001'}
									refType={'grid'}
									queryGridUrl={'/nccloud/riart/ref/fiBillTypeTableRefAction.do'}
									columnConfig={[
										{
											name: [ this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000018'), this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000016') ],/* 国际化处理： 单据编号,单据模板类型*/
											code: [ 'pk_billtypecode', 'billtypename' ]
										}
									]}
									value={this.state.tradetype}
									onChange={(value) => {
										this.setState({
											tradetype: value
										},
										function() {
											sessionStorage.setItem('sessionTP', JSON.stringify(this.state.tradetype));
											//let type = JSON.parse(sessionStorage.getItem('sessionTP'));
										
											//{"values":{"pk_billtypecode":{"value":"F5-Cxx-01"},"billtypename":{"value":"付款-委付"},"pk_billtypeid":{"value":"1001G510000000001L7L"},"parentbilltype":{"value":"F5"}},"refpk":"1001G510000000001L7L","refname":"付款-委付","refcode":"F5-Cxx-01"}
											////console.log(this.state.tradetype);
											////console.log(this.state.tradetype.refcode);
										}
									);
									}}
									isMultiSelectedEnabled={true}
									clickContainer={<NCButton>{this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000017')}</NCButton>}/* 国际化处理： 付款交易类型*/
								/>
							)}
							{this.props.button.createButtonApp({
								area: 'card_head',
								buttonLimit: 4,
								onButtonClick: buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
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
							modelSave: this.saveBill,
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: beforeEvent.bind(this),
							showCheck: true,
							onRowDoubleClick:this.DoubleClick.bind(this),
							showIndex: true,
							onSelected:this.buttonUsability.bind(this),
							onSelectedAll:this.buttonUsability.bind(this)
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
								queryAttachments: '/nccloud/cmp/paybills/enclosurequery.do'
							}
						}/>
					)}
				</div>
				<div>
					<ApproveDetail
						
							billtype={this.state.billtype}
							billid={this.state.billid}
							show={this.state.showAppr}
							close={this.closeApprove}
						
					/>
				</div>
				<div>
					<BillTrack
						show={this.state.show}
						close={() => {
							this.setState({ show: false });
						}}
						pk={this.state.showbilltrackpk}  //单据id
						type={this.state.showbilltracktype}  //单据类型
					/>
				</div>
				<div>
					{this.state.compositedisplay ? (
						<ApprovalTrans
							title={	this.props.MutiInit.getIntl("36070PBRCOMP") && 
							   this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000114')}
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
				{/* {createModal('delete', {
					title: multiLang && multiLang.get('20521030-0020'),
					content: multiLang && multiLang.get('20521030-0006'),
					beSureBtnClick: this.delConfirm
				})} */}
				{createModal('delete', {
					title: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000019'), // 弹框表头信息/* 国际化处理： 确认删除*/
					content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000020'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除所选数据吗?*/
					beSureBtnClick: this.delConfirm, //点击确定按钮事件
					//cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000021'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
					leftBtnName: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000022') //右侧按钮名称， 默认确认/* 国际化处理： 确认*/
				})}

				{createModal('addNode', {
					title: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000023'), // 弹框表头信息/* 国际化处理： 确认修改*/
					content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000024'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					beSureBtnClick: this.beSureBtnClick, //点击确定按钮事件
					cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000025'), //左侧按钮名称,默认关闭/* 国际化处理： 否（N）*/
					leftBtnName: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000026') //右侧按钮名称， 默认确认/* 国际化处理： 是（Y）*/
				})}
			</div>
		);
	}
}

Card = createPage({
	mutiLangCode: '36070PBRCOMP',
	billinfo: {
		billtype: 'card',
		pagecode: PAYBILL_CONST.card_page_id,
		headcode: PAYBILL_CONST.card_from_id,
		bodycode: PAYBILL_CONST.card_table_id
	},
	orderOfHotKey: [ PAYBILL_CONST.card_from_id,PAYBILL_CONST.card_table_id]
})(Card);
export default Card;
//ReactDOM.render(<Card />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/