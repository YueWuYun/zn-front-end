/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast ,cacheTools,deepClone,promptBox} from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
let { getCurrentLastId, updateCache, addCache, getNextId, deleteCacheById } = cardCache;
import {
	card_from_id,
	card_table_id,
	card_page_url
} from '../../cons/constant.js';
import { PAYBILL_CONST } from '../../cons/constant.js';
import {  linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { saveCommit } from "../../../../../tmpub/pub/util"

export default function(props, id) {
	let that = this;
	let org_val = props.form.getFormItemsValue(this.formId, 'pk_org').value;
	let org_display = props.form.getFormItemsValue(this.formId, 'pk_org').display;
	let CardData = props.createMasterChildData('36070PBR_D5_card', this.formId, this.tableId);
	switch (id) {
		case 'save': //保存按钮
			//  props.linkTo('../paybill/card/index.html',{
			//  status:'add'
			//this.saveBill();
			let saveBillData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
			let saveObj = {};
			saveObj[PAYBILL_CONST.card_table_id] = 'cardTable';
			props.validateToSave(saveBillData, this.saveBill.bind(this), saveObj, '');
			break;
		case 'add': //新增按钮
			props.linkTo(card_page_url, {
				status: 'add'
			});
			that.pageShow();
			break;
		//保存新增
		case 'saveadd':
			let CardData = prop.createMasterChildData(this.pageId, this.formId, this.tableId);
			let flag = props.form.isCheckNow(this.formId);
			if (flag) {
				ajax({
					url: '/nccloud/cmp/paybills/save.do',
					data: CardData,
					success: (res) => {
						let pk_paybill = null;
						if (res.success) {
							if (res.data) {
								toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000000') });/* 国际化处理： 保存成功*/
								props.linkTo(card_page_url, {
									status: 'add'
								});
								that.pageShow();
							}
						}
					}
				});
			}

			break;
		case 'edit':
			props.linkTo(card_page_url, {
				status: 'edit',
				id: props.getUrlParam('id')
			});
			this.toggleShow();
			break;
		//肩部操作
		case 'addline':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000001')/* 国际化处理： 请先填写财务组织！*/
				});
				return;
			}
			this.props.cardTable.addRow(this.tableId);
			let rownum = this.props.cardTable.getNumberOfRows('paybilldetail_table');
			//表头赋值给标题
			let dataArr = [
				'pk_currtype',
				'pk_balatype',
				'note_type',
				'pk_tradetypeid',
				'pk_account',
				'pk_oppaccount',
				'objecttype',
				'local_rate',
				'pk_supplier'
			];
			let dataform = this.props.form.getFormItemsValue('head', dataArr);
			dataArr.forEach((val) => {
				let key = val;
				if (props.form.getFormItemsValue(this.formId, key)) {
					let value = props.form.getFormItemsValue(this.formId, key).value;
					let dly = props.form.getFormItemsValue(this.formId, key).display;
					if (value) {
						props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, key, {
							value: value,
							display: dly
						});
						if (key == 'local_rate') {
							//设置本币汇率的编辑性
							let isEdit = props.form.getFormItemsDisabled(this.formId, key);
							if (!isEdit) {
								props.cardTable.setEditableByIndex(this.tableId, rownum - 1, 'local_rate', true);
							}
						}
						if (key == 'pk_account') {
							props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, key, {
								value: value,
								display: null
							});
							props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, 'accountname', {
								value: dly
							});
						}
					}
				}
			});
			break;
			case 'copyline':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000002')/* 国际化处理： 请先选择财务组织！*/
				});
				return;
			}

			let copyRows = props.cardTable.getCheckedRows(this.tableId);
			if (copyRows && copyRows.length > 0) {
				this.setState({ pasteflag: true }, () => {
					this.toggleShow();
				});
			}
			break;
		case 'delline':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000001')/* 国际化处理： 请先填写财务组织！*/
				});
				return;
			}
			let currRows2 = props.cardTable.getCheckedRows(this.tableId);
			let currSelect2 = [];
			if (currRows2 && currRows2.length > 0) {
			
				for (let item of currRows2) {
					currSelect2.push(item.index);
				}
			}

			promptBox({
				color: 'warning', 
				hasCloseBtn:false,        
				content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000046'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否确认取消*/
				beSureBtnClick: () => {
					props.cardTable.delRowsByIndex(this.tableId, currSelect2);
				}}  
			);	
			break;
		case 'saveBtn': //保存按钮
			if (props.getUrlParam('copyFlag') === 'copy') {
				this.props.form.setFormItemsValue(this.formId, { crevecontid: null });
				this.props.form.setFormItemsValue(this.formId, { ts: null });
			}
			//过滤表格空行
			//props.editTable.filterEmptyRows(this.tableId);
			// let flag = props.form.isCheckNow(this.formId)
			// if (flag) {
			let requestUrl = '/nccloud/cmp/billmanagement/save.do'; //新增保存
			if (props.getUrlParam('status') === 'edit') {
				requestUrl = '/nccloud/cmp/billmanagement/update.do'; //修改保存
			}
			ajax({
				url: requestUrl,
				data: CardData,
				success: (res) => {
					let pk_paybill = null;
					if (res.success) {
						if (res.data) {
							toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000000') });/* 国际化处理： 保存成功*/
							if (res.data.head && res.data.head[this.formId]) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								pk_paybill = res.data.head[this.formId].rows[0].values.pk_paybill.value;
							}
							if (res.data.body && res.data.body[this.tableId]) {
								this.props.editTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
						}
					}
					props.linkTo(card_page_url, {
						status: 'browse',
						id: pk_paybill
					});
					this.toggleShow();
				}
			});
			break;
		case 'copy': //复制按钮
			props.linkTo(card_page_url, {
				status: 'edit',
				id: props.getUrlParam('id'),
				copyFlag: 'copy'
			});
			this.toggleShow();
			break;

		case 'delete':
		promptBox({

			color: 'warning', 
			hasCloseBtn:false,        
			content:  this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000019'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除所选数据吗?*/
			// beSureBtnName: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBR-000039'),        // 确定按钮名称, 默认为"确定",非必输
			// cancelBtnName: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBR-000038'),
			beSureBtnClick:this.delConfirm
				//beSureBtnClickDelete.call(this, props, data);
			}  // 确定按钮点击调用函数,非必
		
		);
			// this.props.modal.show('delete');
			break;
		case 'approveBtn': // 审批
			let datas = {
				billID: this.props.form.getFormItemsValue(this.formId, 'crevecontid').value,
				vtranTypeCode: this.props.form.getFormItemsValue(this.formId, 'vtrantypecode').value
			};
			ajax({
				url: '/nccloud/cplatform/approve/queryhistory.do',
				data: datas,
				success: (res) => {
					if (res.data) {
						this.setState(
							{
								ApproveDetails: res.data
							},
							() => {
								props.modal.show('approve');
							}
						);
					}
				}
			});
			break;
		case 'cancelApproveBtn': // 取消审批
			this.approve('UNAPPROVE');
			break;

			case 'canel':
			let current_pk = this.props.getUrlParam('id');

			promptBox({

				color: 'warning', 
				hasCloseBtn:false,        
				content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000059'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否确认取消*/
                // beSureBtnName: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBR-000039'),        // 确定按钮名称, 默认为"确定",非必输
                // cancelBtnName: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBR-000038'),
				
				beSureBtnClick: () => {
					if(!current_pk){
					current_pk=getCurrentLastId(PAYBILL_CONST.paybillCacheKey);  
					}
					if(current_pk){
						if(!this.getCacheDataById.call(this,current_pk)){
							this.props.pushTo("/card",{status:"browse",id:current_pk});
							this.pageShow();
							}
					} else{
						this.setState({
							billno:'',
							billId:''
						});
						 this.billno = '';
						// this.billId='';
						this.props.setUrlParam({
							status: 'browse'		
						});
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
						that.toggleShow();

					}
				} 
				// beSureBtnClick: () => {
				// 	if (current_pk) {
				// 		cannel_linkto.call(this, props, card_page_url, current_pk);
				// 	}
				// 	//beSureBtnClickDelete.call(this, props, data);
				// }  // 确定按钮点击调用函数,非必
			
			});
			break;
		case 'addSenBtn':
			// if(props.form.checkRequired(this.formId)){
			props.cardTable.addRow(this.tableId);
			break;
		case 'addRow':
			props.cardTable.addRow(this.tableId);
			break;
		//保存提交
		case 'savecommit':
			let url = '/nccloud/cmp/paybills/savecommit.do';
			
			let saveComData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
			let saveComflag = props.form.isCheckNow(this.formId);
			if (saveComflag) {
				saveCommit(props, {
					//页面编码
					pageCode: this.pageId,
					//表头区域编码
					headCode: this.formId,
					//表体区域编码（多表体传数组，没有表体不传）
					bodyCode: this.tableId,
					//请求url
					url: url,
					//指派信息
					assign:null,
				//展示指派框的逻辑
				showAssignFunc: (res) => {
					let { data } = res;
					let { workflow } = data;
					this.commitflag = "savecommit";
					if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
						this.setState({
							compositedata: res.data,
							compositedisplay: true
						});
					};
				},
					//更新界面数据的逻辑
					updateViewFunc: (res) => {
						this.props.form.setAllFormValue({ ['head']: res.data.head['head'] });
						let billno = res.data.head[PAYBILL_CONST.card_from_id].rows[0].values.bill_no.value;
					    let billId = res.data.head[PAYBILL_CONST.card_from_id].rows[0].values.pk_paybill.value;
					//提示预算信息
					let ntbMessage =res.data.head[PAYBILL_CONST.card_from_id].rows[0].values.ntberrmsg.value;
					if (ntbMessage) {
						toast({
							color: 'warning',
							content: ntbMessage
						});
					}
					this.billno = billno;
					this.billId = billId;
					let sc_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
					let sc_billstatue = res.data.head['head'].rows[0].values.bill_status.value;
					this.commitflag = null;
					this.setState({
						compositedata: null,
						compositedisplay: false
					});
					this.props.setUrlParam({
						status: 'browse',
						id: sc_pk_paybill,
						billno: sc_billstatue
					});
					this.pageShow();
					this.toggleShow();
						
					}
				});
			}
			break;
		//提交
		case 'commit':
			let commitData = {
				pk: this.props.form.getFormItemsValue('head', 'pk_paybill').value,
				pageid: PAYBILL_CONST.card_page_id
			};
			ajax({
				url: '/nccloud/cmp/paybills/commit.do',
				data: commitData,
				success: function(res) {
					let { success, data } = res;
					if (success) {
						if (data.workflow && (data.workflow == 'approveflow' || data.workflow == 'workflow')) {
							//this.compositedata=	data;
							this.setState({
								compositedata: res.data,
								compositedisplay: true
							});
						} else {
							toast({
								color: 'success',
								content:this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000004')
					
							}); /* 国际化处理： 提交成功*/

							if (res.data.head && res.data.head[this.formId]) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							}
							let com_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
							//更新缓存
							updateCache(
								PAYBILL_CONST.paybill_pkname,
								com_pk_paybill,
								res.data,
								PAYBILL_CONST.card_from_id,
								PAYBILL_CONST.paybillCacheKey
							);
								//this.compositedata=	data;
							this.setState({
								compositedata: null,
								compositedisplay: false
								});
							this.props.setUrlParam({
								status: 'browse',
								id: com_pk_paybill
								//pagecode: pagecode
							});

							this.toggleShow();
						}

					}
				}
			});
			break;
			case 'commitConfirm':
			if (this.commitflag && this.commitflag == 'savecommit') {

				let url = '/nccloud/cmp/paybills/savecommit.do';
				let saveComflag = props.form.isCheckNow(this.formId);
				if (!props.cardTable.checkTableRequired(this.tableId)) {
					return;
				}
				if (saveComflag) {
					saveCommit(props, {
						//页面编码
						pageCode: PAYBILL_CONST.card_page_id,
						//表头区域编码
						headCode: this.formId,
						//表体区域编码（多表体传数组，没有表体不传）
						bodyCode: this.tableId,
						//请求url
						url: url,
						//指派信息
						assign: this.state.compositedata,
						//展示指派框的逻辑
						showAssignFunc: (res) => {
							let { data } = res;
							let { workflow } = data;
							this.commitflag = "savecommit";
							if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
								this.setState({
									compositedata: res.data,
									compositedisplay: true
								});
							};
						},
						//更新界面数据的逻辑
						updateViewFunc: (res) => {

							this.props.form.setAllFormValue({ ['head']: res.data.head['head'] });
							let sc_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
							let sc_bill_no = res.data.head['head'].rows[0].values.bill_no.value;
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							toast({
								color: 'success',
								content:this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000003')
							}); /* 国际化处理： 保存提交成功*/

							//begin tm tangleic 20200219 提交支持预算交互异常信息输出
							let ntbMessage = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
							if (ntbMessage) {
								toast({
									color: 'warning',
									content: ntbMessage
								});
							}
							//end tm tangleic

							this.setState({
								compositedata: '',
								compositedisplay: false
							});
							this.billno = sc_bill_no;
							this.billId = sc_pk_paybill;
							updateCache(
								PAYBILL_CONST.paybill_pkname,
								sc_pk_paybill,
								res.data,
								PAYBILL_CONST.card_from_id,
								PAYBILL_CONST.paybillCacheKey
							);

							this.commitflag=null;
							this.props.setUrlParam({
								status: 'browse',
								id: sc_pk_paybill
							});
							this.toggleShow();
						}
					});
				}
			} else {
				let ConfirmData = dataBuild(
					this.props.form.getFormItemsValue('head', 'pk_paybill').value,
					this.props.form.getFormItemsValue('head', 'ts').value,
					PAYBILL_CONST.card_page_id
				);
				ConfirmData.content = this.state.getAssginUsedr;
				ajax({
					url: '/nccloud/cmp/paybills/commitConfirm.do',
					data: ConfirmData,
					success: (res) => {
						this.setState({
							compositedisplay: false
						});
						let { success, data } = res;
						let { head, body } = data;
						toast({
							color: 'success',
							content:this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000004')
						}); /* 国际化处理： 提交成功*/
						let com_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
						//更新缓存
						updateCache(
							PAYBILL_CONST.paybill_pkname,
							com_pk_paybill,
							res.data,
							PAYBILL_CONST.card_from_id,
							PAYBILL_CONST.paybillCacheKey
						);

						let com_billstatue = res.data.head['head'].rows[0].values.bill_status.value;
						let compage = res.data.head['head'].rows[0].values.trade_type.value;
							//begin tm tangleic 20200219 提交支持预算交互异常信息输出
							let ntbMessage = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
							if (ntbMessage) {
								toast({
									color: 'warning',
									content: ntbMessage
								});
							}
							//end tm tangleic

						this.props.setUrlParam({
							status: 'browse',
							id: com_pk_paybill,
							bill_status: com_billstatue
						
						});
						this.toggleShow();
					}
				});
			}
			break;
		//收回
		case 'uncommit':
			let unComData = {
				pk: this.props.form.getFormItemsValue('head', 'pk_paybill').value,
				pageid: '36070PBR_D5_card'
			};
			ajax({
				url: '/nccloud/cmp/paybills/uncommit.do',
				data: unComData,
				success: function(res) {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000005') });/* 国际化处理： 收回成功*/
						let uncom_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
						let uncom_billstatue = res.data.head['head'].rows[0].values.bill_status.value;
						let uncom_bill_no = res.data.head['head'].rows[0].values.bill_no.value;

						props.linkTo(card_page_url, {
							status: 'browse',
							id: uncom_pk_paybill,
							billno: uncom_bill_no,
							bill_status: uncom_billstatue
						});
						that.pageShow();
					}
				}
			});
			break;
		//确认
		case 'confirm':
		props.pushTo("/card",{status: 'edit',id: props.getUrlParam('id'),op: 'confirm'});
		this.pageShow();
		//this.toggleShow();
			break;
		//取消确认
		case 'canelconfirm':
		let pk = this.props.form.getFormItemsValue('head', 'pk_paybill').value;
		let ts = this.props.form.getFormItemsValue('head', 'ts').value;
		let unconfirmData = dataBuild(pk, ts, PAYBILL_CONST.card_page_id);
		
		// let unconfirmData = {
		// 		pk: props.getUrlParam('id'),
		// 		pageid: '36070PBR_C04'
		// 	};
			ajax({
				url: '/nccloud/cmp/paybills/unconfirm.do',
				data: unconfirmData,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000006') });/* 国际化处理： 取消确认成功*/
						let uncomfirm_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
						let uncomfirm_billstatue = res.data.head['head'].rows[0].values.bill_status.value;
						let uncomfirm_bill_no = res.data.head['head'].rows[0].values.bill_no.value;
						props.pushTo("/card",{status:"browse",	id: uncomfirm_pk_paybill,billno: uncomfirm_bill_no,	bill_status: uncomfirm_billstatue});
						// props.linkTo(card_page_url, {
						// 	status: 'browse',
						// 	id: uncomfirm_pk_paybill,
						// 	billno: uncomfirm_bill_no,
						// 	bill_status: uncomfirm_billstatue
						// });
						that.pageShow();
					}
				}
			});
			break;
		//联查审批意见
		case 'linkaprv':

		//let pk_billtype='36S2';
		let pk_linkPaybill = this.props.form.getFormItemsValue('head', 'pk_paybill').value; //单据pk
		let pk_linktradetype =this.props.form.getFormItemsValue('head', 'trade_type').value;
		this.setState(
			{
				billid: pk_linkPaybill, //单据pk
				billtype: pk_linktradetype
			},
			() => {
				this.setState({
					showAppr: true
				});
			}
		);
		break;
		case 'linkquerybill':
		if (!this.props.form.getFormItemsValue(this.formId, 'pk_paybill').value) {
			toast({ color: 'warning', content:this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000007')});/* 国际化处理： 操作失败，无数据!*/
			return;
		  }
		  let showbilltrackpk = this.props.form.getFormItemsValue(this.formId, 'pk_paybill').value;
		  let billtrack_billtype = 'F5';
		  if (this.props.form.getFormItemsValue(this.formId, 'bill_type').value) {
			billtrack_billtype = this.props.form.getFormItemsValue(this.formId, 'bill_type').value;
		  };
		  let pk_srcbilltypecode = this.props.form.getFormItemsValue(this.formId, 'up_billtype') && this.props.form.getFormItemsValue(this.formId, 'up_billtype').value
		  if (pk_srcbilltypecode && pk_srcbilltypecode == '36S3') {
			toast({
			  color: 'warning',
			  content:this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000120')});/* 国际化处理： 操作失败，无数据!*/
			
			return;
		  };

		  if (showbilltrackpk) {
			this.setState(
			  {
				showbilltrackpk: showbilltrackpk,
				showbilltracktype:'F5' //单据pk
			  },
			  () => {
				this.setState({
					show: true
				});
			  }
			);
		  }
			break;
				//协同单据联查
		//协同单据联查
		case 'billlinkquery':
			let link_dataArray = [];
			let link_paybill, link_upbill;
			if (props.form.getFormItemsValue(card_from_id, 'pk_paybill').value) {
				link_paybill = props.form.getFormItemsValue(card_from_id, 'pk_paybill').value;
				link_dataArray.push(link_paybill); //上后主键
			}
			if (props.form.getFormItemsValue(card_from_id, 'pk_upbill').value) {
				link_upbill = props.form.getFormItemsValue(card_from_id, 'pk_upbill').value;
				link_dataArray.push(link_upbill); //上后主键
			}

			if (link_dataArray.lenth == 0) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000007')});/* 国际化处理： 操作失败，无数据!*/
				return;
			}
			let linkcData = {
				pks: link_dataArray
			};
		
			cacheTools.set('paybillsData', link_dataArray);
			let linkOption = {
				code: '36070RBM',
				name: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000013'),/* 国际化处理： 收款结算联查*/
				pk_appregister: '0001Z61000000003KR2P'
			};
			let params = {
				status: 'browse',
				src: 'paybills'
			};
			ajax({
				url: '/nccloud/cmp/paybills/linkqueryconfirm.do',
				data: linkcData,
				success: (res) => {
					if (res.data) {
						toast({ color: 'warning', content: res.data });
					} else {
						props.openTo('/cmp/billmanagement/recbill/linkcard/index.html', {
							appcode: '36070RBM',
							pagecode: '36070RBMLINK_C01',
							status: 'browse',
							src: 'paybills'
						});
					}
				}
			});

			//window.parent.openNew(linkOption, '', params);
			break;
		case 'BillLQueryVoucher':
		linkVoucherApp(
			props,
			this.props.form.getFormItemsValue('head', 'pk_paybill').value,
			this.props.form.getFormItemsValue('head', 'pk_group').value,
			this.props.form.getFormItemsValue('head', 'pk_org').value,
			this.props.form.getFormItemsValue('head', 'trade_type').value,
			this.props.form.getFormItemsValue('head', 'bill_no').value
		);
		break;
	
			case 'CanelLine':
			this.setState({ pasteflag: false }, () => {
				this.toggleShow();
			});

			break;

		case 'CopyLineLast':
			let selectRows = props.cardTable.getCheckedRows(card_table_id);
			if (selectRows == null || selectRows.length == 0) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000009')/* 国际化处理： 未选中要复制的行*/
				});
				return false;
			}
			let selectIndexs = [];
			let selectRowCopy = deepClone(selectRows);
			for (let item of selectRowCopy) {
				item.data.selected = false;
				item.data.values.pk_paybill_detail={};
				selectIndexs.push(item.data);
			}

			let index = props.cardTable.getNumberOfRows(card_table_id, false);
			//TODO 等待平台批量复制的API
			props.cardTable.insertRowsAfterIndex(card_table_id, selectIndexs, index);
			this.setState({ pasteflag: false }, () => {
				this.toggleShow();
			});
			break;
			//刷新按钮
		case 'Refresh':
		  this.pageShow();
		break;

		default:
			break;
	}
}


//页面返回
function cannel_linkto(props, url, pk) {
	let id = props.form.getFormItemsValue(this.formId, 'pk_paybill').value;
	if (pk) {
		id = pk;
	}
	props.pushTo('/card', { status: 'browse', id: id });
	// props.linkTo(card_page_url, {
	// 	status: 'browse',
	// 	id: id

	// });
	this.pageShow();
}
function dataBuild(pk, ts, pageid) {
	let pkMapTs = {};
	let pkName = 'pk_paybill';
	pkMapTs[pk] = ts;
	let data = {
		pkMapTs,
		pageid,
		pk
	};
	return data;
}


/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/