/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, cacheTools, print, deepClone, promptBox } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
import { pageInfoClick } from '../events/pageInfoClick';
let { getCurrentLastId, updateCache, addCache, getNextId, deleteCacheById } = cardCache;
import { addline } from '../events/addLine';
import { printBtn } from '../buttonclick/print.js';
import { billquery } from '../buttonclick/buttonUtil.js';
import { output } from '../buttonclick/output.js';
import { saveCommit } from "../../../../../tmpub/pub/util"
import {
	card_page_id,
	card_from_id,
	card_table_id
} from '../../cons/constant.js';
import { PAYBILL_CONST } from '../../cons/constant.js';
import { imageScan, imageView } from 'sscrp/rppub/components/image';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill';
import api from '../../base/api';
import { saveMultiLangRes,loadMultiLang } from '../../../../../tmpub/pub/util';
import { CMPEableSscivm } from '../../../../pub/utils/CMPIVPara';//税务参数查询

export default function (props, id) {
	let that = this;
	let org_val = props.form.getFormItemsValue(this.formId, 'pk_org').value;
	let last_pk = props.form.getFormItemsValue(this.formId, 'pk_paybill').value;
	let ts = props.form.getFormItemsValue(this.formId, 'ts').value;
	let org_display = props.form.getFormItemsValue(this.formId, 'pk_org').display;
	let pagecodes = props.form.getFormItemsValue(this.formId, 'trade_type').value;
	let CardData = props.createMasterChildData('36070PBR_D5_card', this.formId, this.tableId);

	switch (id) {
		case 'save': //保存按钮
			let saveBillData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
			let saveObj = {};
			saveObj[PAYBILL_CONST.card_table_id] = 'cardTable';
			props.validateToSave(saveBillData, this.saveBill.bind(this), saveObj, '');
			//this.saveBill();
			break;
		case 'add': //新增按钮
			debugger;
			let tradeType = JSON.parse(sessionStorage.getItem('sessionTP'));
			if (tradeType && tradeType.refcode) {
				props.form.EmptyAllFormValue('head');
				props.cardTable.setTableData(this.tableId, { rows: [] });
				props.pushTo('/card', {
					status: 'add',
					tradetypecode: tradeType && tradeType.refcode,
					tradetypename: tradeType && tradeType.refname,
					tradetypepk: tradeType && tradeType.refpk,
					pagecode: tradeType && tradeType.refcode,
					id: this.props.getUrlParam('id')
				});
			} else {
				props.form.EmptyAllFormValue('head');
				props.cardTable.setTableData(this.tableId, { rows: [] });
				props.pushTo('/card', { status: 'add', pagecode: card_page_id, id: this.props.getUrlParam('id') });
			}
			that.pageShow();
			break;
		//保存新增
		case 'saveadd':
			let CardBeforeData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
			//移除没有金额的数据
			this.saveBeforeEvent.call(this, CardBeforeData);
			let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
			//props.validateToSave(CardData, this.saveBill(), obj, '');

			let flag = props.form.isCheckNow(this.formId);
			if (!props.cardTable.checkTableRequired(this.tableId)) {
				return;
			}
			if (!flag) {
				return;
			}
			let cacheFlag = true;
			//let flag = props.form.isCheckNow(this.formId);
			let save_url = '/nccloud/cmp/paybills/save.do';
			if (this.props.getUrlParam('status') === 'edit') {
				save_url = '/nccloud/cmp/paybills/update.do'; //修改保存新增
				cacheFlag = false;
			}
			if (this.props.getUrlParam('status') === 'add' && this.props.getUrlParam('src') === 'settlement') {
				save_url = '/nccloud/cmp/paybills/assave.do'; //修改保存
				cacheFlag = true;
			}
			if (flag) {
				ajax({
					url: save_url,
					data: CardData,
					success: (res) => {
						let pk_paybill = null;
						if (res.success) {
							if (res.data) {
								let bill_pk = res.data.head[this.formId].rows[0].values.pk_paybill.value;
								if (res.data.body && res.data.body[this.tableId]) {
									let body = res.data.body;
									body[PAYBILL_CONST.card_table_id] = this.props.cardTable.updateDataByRowId(
										this.tableId,
										res.data.body[this.tableId]
									);
									if (body && body[PAYBILL_CONST.card_table_id]) {
										res.data.body = body;
									}
								}

								toast({
									color: 'success',
									content: loadMultiLang(this.props, '36070PBR-000005')
								}); /* 国际化处理： 保存成功*/
								//加入缓存
								if (cacheFlag) {
									addCache(
										bill_pk,
										res.data,
										PAYBILL_CONST.card_from_id,
										PAYBILL_CONST.paybillCacheKey,
										res.data.head[this.formId].rows[0].values
									);
								} else {
									// 更新缓存
									updateCache(
										PAYBILL_CONST.paybill_pkname,
										bill_pk,
										res.data,
										PAYBILL_CONST.card_from_id,
										PAYBILL_CONST.paybillCacheKey
									);
								}
								props.form.EmptyAllFormValue(this.formId);
								props.cardTable.setTableData(this.tableId, { rows: [] });
								let ntbMessage = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
								if (ntbMessage) {
									toast({
										color: 'warning',
										content: ntbMessage
									});
									props.setUrlParam({
										status: 'add',
										pagecode: PAYBILL_CONST.card_page_id,
										id:bill_pk
									});
									//props.pushTo('/card', { status: 'add', pagecode: PAYBILL_CONST.card_page_id });

									that.pageShow();
								} else {
									props.setUrlParam({
										status: 'add',
										pagecode: PAYBILL_CONST.card_page_id,
										id:bill_pk
									});
									//props.pushTo('/card', { status: 'add', pagecode: PAYBILL_CONST.card_page_id });

									that.pageShow();
								}
							}
						}
					}
				});
			}

			break;
		case 'edit':
			ajax({
				url: '/nccloud/cmp/paybills/dataAuthority.do',
				data: { pk: last_pk, pageid: '36070PBR_D5_card' },
				success: (res) => {
					this.props.pushTo('/card', { status: 'edit', id: props.getUrlParam('id'), pagecode: pagecodes });
					this.pageShow();
				}
			});
			break;
		//肩部操作
		case 'addline':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: loadMultiLang(this.props, '36070PBR-000006')/* 国际化处理： 请先填写财务组织！*/
				});
				return;
			}
			if (this.checkSettleInfo()) {
				return;
			}

			this.props.cardTable.addRow(this.tableId);
			let rownum = this.props.cardTable.getNumberOfRows('paybilldetail_table');
			let dataArr = [
				'pk_currtype',
				'pk_balatype',
				'note_type',
				'pk_tradetypeid',
				'pk_account',
				'pk_oppaccount',
				'objecttype',
				'local_rate',
				'group_rate',
				'global_rate',
				'pk_supplier',
				'mon_account',
				'accountname',
				'pk_customer',
				'pk_busiman',
				'accountopenbank',
				'accountcode',
				'pk_accountname'
			];
			addline(this.props, dataArr, rownum - 1);
			break;
		case 'copyline':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content:loadMultiLang(this.props, '36070PBR-000007')/* 国际化处理： 请先选择财务组织！*/
				});
				return;
			}
			// console.log(props.cardTable.getCheckedRows(this.tableId).index);
			if (this.checkSettleInfo()) {
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
					content:loadMultiLang(this.props, '36070PBR-000006')/* 国际化处理： 请先填写财务组织！*/
				});
				return;
			}
			if (this.checkSettleInfo()) {
				return;
			}
			let currRows2 = props.cardTable.getCheckedRows(this.tableId);
			let currSelect2 = [];
			if (currRows2 && currRows2.length > 0) {
				for (let item of currRows2) {
					currSelect2.push(item.index);
				}
			}
			props.cardTable.delRowsByIndex(this.tableId, currSelect2);
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
					let page_code = null;
					if (res.success) {
						if (res.data) {
							toast({
								color: 'success',
								content:loadMultiLang(this.props, '36070PBR-000005')
							}); /* 国际化处理： 保存成功*/
							if (res.data.head && res.data.head[this.formId]) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								pk_paybill = res.data.head[this.formId].rows[0].values.pk_paybill.value;
								page_code = res.data.head[this.formId].rows[0].values.trade_type.value;
							}
							this.billno = billno;
							if (res.data.body && res.data.body[this.tableId]) {
								this.props.editTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
						}
					}
					props.pushTo('/card', { status: 'browse', id: pk_paybill, pagecode: page_code });
					that.pageShow();
				}
			});
			break;
		case 'copy': //复制按钮
			let CopyTradeType = this.props.form.getFormItemsValue(this.formId, 'trade_type');
			if (CopyTradeType && CopyTradeType.value === 'DS') {
				toast({
					color: 'warning',
					content:loadMultiLang(this.props, '36070PBR-000109')
				}); /* 国际化处理： 请选择单条数据进行复制操作*/
				return;
			}

			props.pushTo('/card', {
				status: 'copy',
				id: props.getUrlParam('id'),
				pagecode: pagecodes
			});
			that.pageShow();
			break;

		case 'delete':
			promptBox(
				{
					color: 'warning',
					hasCloseBtn: false,
					content:loadMultiLang(this.props, '36070PBR-000036'),//this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否确认取消*/
					beSureBtnClick: this.delConfirm
					//beSureBtnClickDelete.call(this, props, data);
				} // 确定按钮点击调用函数,非必
			);

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

		case 'cancel':
			let current_pk = this.props.getUrlParam('id');

			promptBox({
				color: 'warning',
				hasCloseBtn: false,
				title:loadMultiLang(this.props, '36070PBR-000037'), //this.modalContent(), //取消*/
				content:loadMultiLang(this.props, '36070PBR-000040'), 
				//this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否确认取消*/
				beSureBtnClick: () => {
					if (!current_pk) {
						current_pk = getCurrentLastId(PAYBILL_CONST.paybillCacheKey);
					}
					if (current_pk) {
						if (!this.getCacheDataById.call(this, current_pk)) {
							this.props.pushTo('/card', { status: 'browse', id: current_pk });
							this.pageShow();
						}
					} else {
						this.billno = '';
						this.billId = '';
						this.props.setUrlParam({
							status: 'browse'
						});
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
						this.toggleShow();
					}
				}
			});
			break;
		//break;
		case 'addSenBtn':
			// if(props.form.checkRequired(this.formId)){
			props.cardTable.addRow(this.tableId);
			// }else{
			//     toast({
			//         'color': 'warning',
			//         'content': '请先填写必输项！'
			//     })
			//     return
			// }
			break;
		case 'addRow':
			props.cardTable.addRow(this.tableId);
			break;
		//保存提交
		case 'savecommit':
			//校验表单必输字段
			let saveComBeforeData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
			//移除没有金额的数据
			this.saveBeforeEvent.call(this, saveComBeforeData);
			let saveComData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
			let url = '/nccloud/cmp/paybills/savecommit.do';
			// if (props.getUrlParam('status') === 'edit') {
			// 	url = '/nccloud/cmp/paybills/editcommit.do';

			// }
			if (props.getUrlParam('status') === 'add' && props.getUrlParam('src') === 'settlement') {
				url = '/nccloud/cmp/paybills/assavecommit.do'; //修改保存
			}

			if (props.getUrlParam('status') === 'edit' && props.getUrlParam('op') === 'protopay') {
				// url = '/nccloud/cmp/paybills/commisionSaveCommit.do';
				if (this.protoPayCheck(saveComData)) {
					return;
				}
			}
			let saveComflag = props.form.isCheckNow(this.formId);
			if (!props.cardTable.checkTableRequired(this.tableId)) {
				return;
			}
			if (saveComflag) {
				saveCommit(props, {
					//页面编码
					pageCode: card_page_id,
					//表头区域编码
					headCode: this.formId,
					//表体区域编码（多表体传数组，没有表体不传）
					bodyCode: this.tableId,
					//请求url
					url: url,
					//指派信息
					assign: null,
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

						//begin tm tangleic 20200219 提交支持预算交互异常信息输出
						api.comm.showTbbMsg({ props: this.props, row: res.data.head[this.formId].rows[0] });
						//end tm tangleic

						this.props.form.setAllFormValue({ ['head']: res.data.head['head'] });
						let sc_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
						let sc_bill_no = res.data.head['head'].rows[0].values.bill_no.value;
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						toast({
							color: 'success',
							content:loadMultiLang(this.props, '36070PBR-000008'), 
				
						}); /* 国际化处理： 保存提交成功*/
						let ntbMessage = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
							if (ntbMessage) {
								toast({
									color: 'warning',
									content: ntbMessage
								});
							}	
						this.billno = sc_bill_no;
						this.billId = sc_pk_paybill;
						updateCache(
							PAYBILL_CONST.paybill_pkname,
							sc_pk_paybill,
							res.data,
							PAYBILL_CONST.card_from_id,
							PAYBILL_CONST.paybillCacheKey
						);
						this.props.setUrlParam({
							status: 'browse',
							id: sc_pk_paybill
						});
						this.toggleShow();
					}
				});
			}
			break;
		//打印
		case 'printbtn':
			printBtn.call(this);
			break;
		case 'linkprintbtn':
			printBtn.call(this);
			break;
		//输出	
		case 'output':
			output.call(this);
			break;
		case 'linkoutput':
			output.call(this);
			break;

		case 'filemore':
			//if(this.State.showUploader==='true'){}

			this.setState({
				showUploader: !this.state.showUploader,
				target: null
			});
			break;

		case 'file':
			//if(this.State.showUploader==='true'){}

			this.setState({
				showUploader: !this.state.showUploader,
				target: null
			});
			break;

		//提交
		case 'commit':
			let commitData = dataBuild(
				this.props.form.getFormItemsValue('head', 'pk_paybill').value,
				this.props.form.getFormItemsValue('head', 'ts').value,
				'36070PBR_D5_card'
			);
			ajax({
				url: '/nccloud/cmp/paybills/commit.do',
				data: commitData,
				success: (res) => {
					let { success, data } = res;
					if (data.workflow && (data.workflow == 'approveflow' || data.workflow == 'workflow')) {
						//this.compositedata=	data;
						this.setState({
							compositedata: res.data,
							compositedisplay: true
						});
					} else {
						let { head, body } = data;
						toast({
							color: 'success',
							content:loadMultiLang(this.props, '36070PBR-000009')
				
						}); /* 国际化处理： 提交成功*/

						//begin tm tangleic 20200219 提交支持预算交互异常信息输出
						api.comm.showTbbMsg({ props: this.props, row: res.data.head[this.formId].rows[0] });
						//end tm tangleic

						if (res.data.head && res.data.head[this.formId]) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						}
						let com_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
						let com_billstatue = res.data.head['head'].rows[0].values.bill_status.value;
						let compage = res.data.head['head'].rows[0].values.trade_type.value;
						//更新缓存
						updateCache(
							PAYBILL_CONST.paybill_pkname,
							com_pk_paybill,
							res.data,
							PAYBILL_CONST.card_from_id,
							PAYBILL_CONST.paybillCacheKey
						);
						

						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						this.props.setUrlParam({
							status: 'browse',
							id: com_pk_paybill
							//pagecode: pagecode
						});

						this.toggleShow();
					}
				}
			});
			break;
		//关联结算信息
		case 'Associate':
			props.openTo('/nccloud/resources/cmp/settlementmanagement/settlepublic/list/index.html', {
				appcode: '360704SM',
				pagecode: '360704SMP_L01',
				callbackappcode: '36070PBR',
				callbackpagecode: '36070PBR_D5_card',
				src: 1,
				callback: '/cmp/billmanagement/paybill/main/index.html#/card',
				name:loadMultiLang(props, '36070PBR-000010') /* 国际化处理： 付款结算关联结算信息*/
			});
			break;
		case 'unassociate': //
			let unas_pk = this.props.form.getFormItemsValue(this.formId, 'pk_paybill').value;
			let pkMapTs = {};
			pkMapTs[unas_pk] = this.props.form.getFormItemsValue(this.formId, 'ts').value;
			let req_unAs_Data = {
				pkMapTs,
				pageid: PAYBILL_CONST.card_page_id,
				pk: unas_pk
			};
			ajax({
				url: '/nccloud/cmp/paybills/canelassociate.do',
				data: req_unAs_Data,
				success: (res) => {
					if (res.success) {
						let { data, status } = res.data;
						if (status == '1') {
							toast({
								color: 'success',
								content:loadMultiLang(this.props, '36070PBR-000105') 
							}); /* 国际化处理： 取消关联结算成功*/

							let url_id = getNextId(unas_pk, PAYBILL_CONST.paybillCacheKey);
							//删除缓存
							deleteCacheById(PAYBILL_CONST.paybill_pkname, unas_pk, PAYBILL_CONST.paybillCacheKey);
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
		//收回
		case 'uncommit':
			let pk = this.props.form.getFormItemsValue('head', 'pk_paybill').value;
			let ts = this.props.form.getFormItemsValue('head', 'ts').value;
			let unComData = dataBuild(pk, ts, PAYBILL_CONST.card_page_id);
			ajax({
				url: '/nccloud/cmp/paybills/uncommit.do',
				data: unComData,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						toast({
							color: 'success',
							content:loadMultiLang(this.props, '36070PBR-000011') 
						}); /* 国际化处理： 收回成功*/
						if (res.data.head && res.data.head[this.formId]) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						}
						let uncom_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
						updateCache(
							PAYBILL_CONST.paybill_pkname,
							uncom_pk_paybill,
							res.data,
							PAYBILL_CONST.card_from_id,
							PAYBILL_CONST.paybillCacheKey
						);
						let uncom_billstatue = res.data.head['head'].rows[0].values.bill_status.value;
						let page = res.data.head['head'].rows[0].values.trade_type.value;
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						this.props.setUrlParam({
							status: 'browse',
							id: uncom_pk_paybill
							//pagecode: pagecode
						});
						this.toggleShow();
					}
				}
			});
			break;

		case 'billquery':
		  billquery.call(this);
		  break;

		//影像查看
		case 'BaseImageShow':
		    if(CMPEableSscivm.call(this)){
				return ;
			};
			let showData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
			let openShowbillid = props.getUrlParam('id'); //单据pk(billid)
			let billShowInfoMap = {};
			billShowInfoMap['pk_billid'] = openShowbillid;
			billShowInfoMap['pk_billtype'] = showData.head.head.rows[0].values.bill_type.value;
			billShowInfoMap['pk_tradetype'] = showData.head.head.rows[0].values.trade_type.value;
			billShowInfoMap['pk_org'] = showData.head.head.rows[0].values.pk_org.value;
			imageView(billShowInfoMap, 'iweb');
			break;
		//影像扫描
		case 'BaseImageScan': //
		  if(CMPEableSscivm.call(this)){
			return ;
		   };
			let ScanData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
			let openbillid = props.getUrlParam('id'); //单据pk(billid)
			let billInfoMap = {};
			billInfoMap['pk_billid'] = openbillid;

			billInfoMap['pk_billtype'] = ScanData.head.head.rows[0].values.bill_type.value;
			billInfoMap['pk_tradetype'] = ScanData.head.head.rows[0].values.trade_type.value;
			billInfoMap['pk_org'] = ScanData.head.head.rows[0].values.pk_org.value;
			billInfoMap['BillType'] = ScanData.head.head.rows[0].values.trade_type.value;
			billInfoMap['BillDate'] = ScanData.head.head.rows[0].values.creationtime.value;
			billInfoMap['Busi_Serial_No'] = ScanData.head.head.rows[0].values.pk_paybill.value;
			billInfoMap['OrgNo'] = ScanData.head.head.rows[0].values.pk_org.value;
			billInfoMap['BillCode'] = ScanData.head.head.rows[0].values.bill_no.value;
			billInfoMap['OrgName'] = ScanData.head.head.rows[0].values.pk_org.value;
			billInfoMap['Cash'] = ScanData.head.head.rows[0].values.primal_money.value;

			imageScan(billInfoMap, 'iweb');
			break;

		//联查预算
		case 'linkplanbudget':
			let linkPlanData = {
				pk: this.props.form.getFormItemsValue('head', 'pk_paybill').value,
				pageid: '36070PBR_D5_card'
			};
			ajax({
				url: '/nccloud/cmp/paybills/linkplan.do',
				data: linkPlanData,
				success: (res) => {
					if (res.data) {
						if (res.data.hint) {
							toast({ color: 'warning', content: res.data.hint });
						} else {
							this.setState(
								{
									sourceData: res.data
								},
								() => {
									this.setState({
										shoWIns: true
									});
								}
							);
						}
					}
				}
			});
			break;
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
				toast({
					color: 'warning',
					content:loadMultiLang(this.props, '36070PBR-000012')
				}); /* 国际化处理： 操作失败，无数据!*/
				return;
			}
			let linkcData = {
				pks: link_dataArray
			};

			cacheTools.set('paybillsData', link_dataArray);
			let linkOption = {
				code: '36070RBM',
				name:loadMultiLang(this.props, '36070PBR-000013') /* 国际化处理： 收款结算联查*/,
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

		case 'reverse': //红冲按钮
			let reverseData = {
				pks: [this.props.form.getFormItemsValue('head', 'pk_paybill').value],
				pageid: '36070PBR_D5_list'
			};

			ajax({
				url: '/nccloud/cmp/paybills/reverse.do',
				data: reverseData,
				success: (res) => {
					if (res.data['table_D5']) {
						props.pushTo('/card', {
							status: 'browse',
							op: 'reverse',
							id: res.data['table_D5'].rows[1].values.pk_paybill.value,
							pagecode: res.data['table_D5'].rows[1].values.trade_type.value
						});
					}
					that.pageShow();
				}
			});
			break;
		case 'CancelLine':
			this.setState({ pasteflag: false }, () => {
				this.toggleShow();
			});

			break;

		case 'CopyLineLast':
			let selectRows = props.cardTable.getCheckedRows(card_table_id);
			if (selectRows == null || selectRows.length == 0) {
				toast({
					color: 'warning',
					content:loadMultiLang(this.props, '36070PBR-000015')  /* 国际化处理： 未选中要复制的行*/
				});
				return false;
			}
			let selectIndexs = [];
			// let selectRowCopy = deepClone(selectRows);
			let newRecord;
			for (let selectData of selectRows) {
				newRecord = JSON.parse(JSON.stringify(selectData));
				newRecord.data.selected = false;
				newRecord.data.values['pk_paybill_detail'] = {
					value: null,
					display: null,
					scale: '-1'
				};
				newRecord.data.values['billdetail_no'] = {
					value: null,
					display: null
				};

				newRecord.data.values['pseudocolumn'] = {
					value: null,
					display: null
				};
				selectIndexs.push(newRecord.data);
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
			that.refresh();
			break;
		//制单
		case 'makebill':
			MakeBillApp(
				props,
				'36070PBR',
				this.props.form.getFormItemsValue('head', 'pk_paybill').value,
				this.props.form.getFormItemsValue('head', 'trade_type').value);

			break;
		case 'linkReceipt':
		if(CMPEableSscivm.call(this)){
			return ;
		   };
			let receiptId = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'pk_paybill').value;
			let receiptCode = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, "bill_no").value;
			let receiptBilltype = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, "bill_type").value;
			this.setState({
				sscrpLinkInvoiceData: {
					'billId': receiptId,
					'billCode': receiptBilltype,
					'pk_org': props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'pk_org').value,
					'tradetype': props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'trade_type').value,
					'viewRandom': Math.random()
				}
			})
			break;
		//承付
		case 'protopay':
			debugger;
			let protopay_id = this.props.form.getFormItemsValue('head', 'pk_paybill').value;
			let protopay_flag = this.props.form.getFormItemsValue('head', 'is_cf');
			let protopay_status = this.props.form.getFormItemsValue('head', 'bill_status').value;
			//数据承付状态校验s
			if (!protopay_flag || !protopay_flag.value) {
				toast({
					color: 'warning',
					content:loadMultiLang(this.props, '36070PBR-000075')
				}); /* 国际化处理： 非承付单据，不能进行承付*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			//数据审批状态校验
			if (protopay_status != -10 && protopay_status != -99) {
				toast({
					color: 'warning',
					content:loadMultiLang(this.props, '36070PBR-000076')
				}); /* 国际化处理： 单据状态不符合承付要求，不能进行承付*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			props.pushTo('/card', {
				status: 'edit',
				id: protopay_id,
				op: 'protopay'
				// pagecode: this.props.form.getFormItemsValue('head', 'trade_type').value
			});
			that.pageShow();
			break;
		//取消承付
		case 'unprotopay':
			let unprotopay_bill_status = this.props.form.getFormItemsValue('head', 'bill_status').value;
			//数据审批状态校验
			if (unprotopay_bill_status != -10) {
				toast({
					color: 'warning',
					content:loadMultiLang(this.props, '36070PBR-000077')
				}); /* 国际化处理： 单据状态不符合取消承付要求，不能取消承付*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			let compayData = dataBuild(
				this.props.form.getFormItemsValue('head', 'pk_paybill').value,
				this.props.form.getFormItemsValue('head', 'ts').value,
				'36070PBR_D5_card'
			);
			ajax({
				url: '/nccloud/cmp/paybills/canlecompay.do',
				data: compayData,
				success: (res) => {
					toast({
						color: 'success',
						content:loadMultiLang(this.props, '36070PBR-000104')
					}); /* 国际化处理： 提交成功*/
					if (res.data.head && res.data.head[this.formId]) {
						this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					}
					if (res.data.body && res.data.body[this.tableId]) {
						this.props.editTable.setTableData(this.tableId, res.data.body[this.tableId]);
					}
					let com_pay_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
					//更新缓存
					updateCache(
						PAYBILL_CONST.paybill_pkname,
						com_pay_paybill,
						res.data,
						PAYBILL_CONST.card_from_id,
						PAYBILL_CONST.paybillCacheKey
					);
					props.setUrlParam({
						status: 'browse',
						id: com_pay_paybill
						//pagecode: pagecode
					});
					that.toggleShow();
				}
			});
			break;
		//联查审批详情
		case 'linkaprv':
			//let pk_billtype='36S2';
			let pk_linkPaybill = this.props.form.getFormItemsValue('head', 'pk_paybill').value; //单据pk
			let pk_linktradetype = this.props.form.getFormItemsValue('head', 'trade_type').value; //单据pk
			this.billId = pk_linkPaybill;
			this.setState(
				{
					billtype: pk_linktradetype
				},
				() => {
					this.setState({
						showAppr: true
					});
				}
			);
			break;
		case 'commitConfirm':
			if (this.commitflag && this.commitflag == 'savecommit') {
				//校验表单必输字段
				let saveComBeforeData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
				//移除没有金额的数据
				this.saveBeforeEvent.call(this, saveComBeforeData);
				let saveComData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
				let url = '/nccloud/cmp/paybills/savecommit.do';
				if (props.getUrlParam('status') === 'add' && props.getUrlParam('src') === 'settlement') {
					url = '/nccloud/cmp/paybills/assavecommit.do'; //修改保存
				}
				if (props.getUrlParam('status') === 'edit' && props.getUrlParam('op') === 'protopay') {
					// url = '/nccloud/cmp/paybills/commisionSaveCommit.do';
					if (this.protoPayCheck(saveComData)) {
						return;
					}
				}
				let saveComflag = props.form.isCheckNow(this.formId);
				if (!props.cardTable.checkTableRequired(this.tableId)) {
					return;
				}
				if (saveComflag) {
					saveCommit(props, {
						//页面编码
						pageCode: card_page_id,
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

							//begin tm tangleic 20200219 提交支持预算交互异常信息输出
							api.comm.showTbbMsg({ props: this.props, row: res.data.head[this.formId].rows[0] });
							//end tm tangleic

							this.props.form.setAllFormValue({ ['head']: res.data.head['head'] });
							let sc_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
							let sc_bill_no = res.data.head['head'].rows[0].values.bill_no.value;
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							toast({
								color: 'success',
								content:loadMultiLang(this.props, '36070PBR-000008')
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
					'36070PBR_D5_card'
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
							content:loadMultiLang(this.props, '36070PBR-000009')
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
						props.pushTo('/card', {
							status: 'browse',
							id: com_pk_paybill,
							bill_status: com_billstatue,
							pagecode: compage
						});
						that.pageShow();
					}
				});
			}
			break;
		case 'elecinvoice':
		 
           if(CMPEableSscivm.call(this)){
	            return ;
	         };
			let elecId = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'pk_paybill').value;
			let billtype = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, "bill_type").value;
			let billCode = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, "bill_no").value;
			let pk_org = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'pk_org').value;
			let tradetype = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'trade_type').value;
			let random = Math.random();
			this.setState({
				sscrpInvoiceData: {
					'billId': elecId,
					billtype,
					pk_org,
					tradetype,
					random
				}
			})
			break;

		//影像查看- 联产专用
		case 'LinkImageShow':
		 
          if(CMPEableSscivm.call(this)){
	            return ;
	         };
			let LinkshowData = props.createMasterChildData(this.pageId, this.formId, this.tableId);

			let LinkopenShowbillid = props.getUrlParam('id'); //单据pk(billid)
			let LinkbillShowInfoMap = {};
			LinkbillShowInfoMap['pk_billid'] = LinkopenShowbillid;
			LinkbillShowInfoMap['pk_billtype'] = LinkshowData.head.head.rows[0].values.bill_type.value;
			LinkbillShowInfoMap['pk_tradetype'] = LinkshowData.head.head.rows[0].values.trade_type.value;
			LinkbillShowInfoMap['pk_org'] = LinkshowData.head.head.rows[0].values.pk_org.value;
			imageView(LinkbillShowInfoMap, 'iweb');
			break;
		//影像扫描 - 联产专用
		case 'LinkImageScan': //
		 
         if(CMPEableSscivm.call(this)){
	            return ;
	         };
			let LinkScanData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
			let Linkopenbillid = props.getUrlParam('id'); //单据pk(billid)
			let LinkbillInfoMap = {};
			LinkbillInfoMap['pk_billid'] = Linkopenbillid;

			LinkbillInfoMap['pk_billtype'] = LinkScanData.head.head.rows[0].values.bill_type.value;
			LinkbillInfoMap['pk_tradetype'] = LinkScanData.head.head.rows[0].values.trade_type.value;
			LinkbillInfoMap['pk_org'] = LinkScanData.head.head.rows[0].values.pk_org.value;
			LinkbillInfoMap['BillType'] = LinkScanData.head.head.rows[0].values.trade_type.value;
			LinkbillInfoMap['BillDate'] = LinkScanData.head.head.rows[0].values.creationtime.value;
			LinkbillInfoMap['Busi_Serial_No'] = LinkScanData.head.head.rows[0].values.pk_paybill.value;
			LinkbillInfoMap['OrgNo'] = LinkScanData.head.head.rows[0].values.pk_org.value;
			LinkbillInfoMap['BillCode'] = LinkScanData.head.head.rows[0].values.bill_no.value;
			LinkbillInfoMap['OrgName'] = LinkScanData.head.head.rows[0].values.pk_org.value;
			LinkbillInfoMap['Cash'] = LinkScanData.head.head.rows[0].values.primal_money.value;

			imageScan(LinkbillInfoMap, 'iweb');
			break;
		default:
			break;
		//返回
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

//构建请求数据
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