/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, cacheTools, print, deepClone,promptBox } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
let { getCurrentLastId, updateCache, addCache } = cardCache;

import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url,
	list_page_url,
	card_page_url
} from '../../cons/constant.js';
import { PAYBILL_CONST } from '../../cons/constant.js';
import { imageScan, imageView } from 'sscrp/rppub/components/image';
import { linkApp, linkVoucherApp } from '../../../../public/utils/LinkUtil';


export default function(props, id) {
	let that = this;
	let org_val = props.form.getFormItemsValue(this.formId, 'pk_org').value;
	let last_pk = props.form.getFormItemsValue(this.formId, 'pk_paybill').value;
	let org_display = props.form.getFormItemsValue(this.formId, 'pk_org').display;
	let pagecodes = props.form.getFormItemsValue(this.formId, 'trade_type').value;
	let CardData = props.createMasterChildData('36070PBR_D5_card', this.formId, this.tableId);

	switch (id) {
		case 'save': //保存按钮
			this.saveBill();
			break;
		case 'add': //新增按钮
		debugger;
			let tradeType = JSON.parse(sessionStorage.getItem('sessionTP'));

			if (tradeType && tradeType.refcode) {
				props.pushTo('/card', {
					status: 'add',
					tradetypecode: tradeType && tradeType.refcode,
					tradetypename: tradeType && tradeType.refname,
					tradetypepk: tradeType && tradeType.refpk,
					pagecode: tradeType && tradeType.refcode,
					id: this.props.getUrlParam('id')
				});
			} else {
				props.pushTo('/card', { status: 'add', pagecode: card_page_id, id: this.props.getUrlParam('id') });

				// props.linkTo(card_page_url, {
				// 	status: 'add',
				// 	pagecode: card_page_id,
				// 	id: this.props.getUrlParam('id')
				// });
			}
			that.pageShow();
			break;
		//保存新增
		case 'saveadd':
			let CardData = props.createMasterChildData(this.pageId, this.formId, this.tableId);

			let checkFlag = this.saveBeforeEvent(CardData);

			if (!checkFlag) {
				return;
			}
			let cacheFlag = true;
			let flag = props.form.isCheckNow(this.formId);
			let save_url = '/nccloud/cmp/paybills/save.do';
			if (this.props.getUrlParam('status') === 'edit') {
				save_url = '/nccloud/cmp/paybills/update.do'; //修改保存新增
				cacheFlag = false;
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
								toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000005') });/* 国际化处理： 保存成功*/
								//加入缓存
								if (cacheFlag) {
									addCache(
										bill_pk,
										res.data,
										PAYBILL_CONST.card_from_id,
										PAYBILL_CONST.paybillCacheKey
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
								props.pushTo('/card', { status: 'add', pagecode: PAYBILL_CONST.card_page_id });
								// props.linkTo(card_page_url, {
								// 	status: 'add',
								// 	pagecode: card_page_id
								// });
								that.pageShow();
							}
						}
					}
				});
			}

			break;
		case 'edit':
			props.pushTo('/card', { status: 'edit', id: props.getUrlParam('id') });

			that.pageShow();
			break;
		//肩部操作
		case 'addline':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000006')/* 国际化处理： 请先填写财务组织！*/
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
								display: dly
							});
							props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, 'accountname', {
								value: props.form.getFormItemsValue(this.formId, 'pk_accountname').value
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
					content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000007')/* 国际化处理： 请先选择财务组织！*/
				});
				return;
			}
			// console.log(props.cardTable.getCheckedRows(this.tableId).index);
			let copyRows = props.cardTable.getCheckedRows(this.tableId);
			if (copyRows && copyRows.length > 0) {
				this.setState({ pasteflag: true }, () => {
					this.toggleShow();
				});
			}
			break;
			// let rowNum;
			// let record = [];
			// if (copyRows && copyRows.length > 0) {
			// 	for (let item of copyRows) {
			// 		rowNum = item.index;
			// 		record.push(item.data);
			// 	}
			// }
			// let dataArray = [
			// 	{
			// 		index: rowNum + 1,
			// 		data: record
			// 	}
			// ];

			// if (dataArray.length == 0) {
			// 	toast({ color: 'warning', content: '未选择数据!' });
			// 	return;
			// }

			// props.cardTable.insertDataByIndexs(this.tableId, dataArray);
			// props.cardTable.insertRowsAfterindex(this.tableId,dataArray,rowNum+1);
			break;
		case 'delline':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000006')/* 国际化处理： 请先填写财务组织！*/
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

			props.cardTable.delRowsByIndex(this.tableId, currSelect2);
			break;
		//props.cardTable.delRowsByIndex(this.tableId, props.cardTable.getCheckedRows(this.tableId)[0].index);
		//break;
		// case 'saveBtn': //保存按钮
		// 	if (props.getUrlParam('copyFlag') === 'copy') {
		// 		this.props.form.setFormItemsValue(this.formId, { crevecontid: null });
		// 		this.props.form.setFormItemsValue(this.formId, { ts: null });
		// 	}
		// 	//过滤表格空行
		// 	//props.editTable.filterEmptyRows(this.tableId);
		// 	// let flag = props.form.isCheckNow(this.formId)
		// 	// if (flag) {
		// 	let requestUrl = '/nccloud/cmp/billmanagement/save.do'; //新增保存
		// 	if (props.getUrlParam('status') === 'edit') {
		// 		requestUrl = '/nccloud/cmp/billmanagement/update.do'; //修改保存
		// 	}
		// 	ajax({
		// 		url: requestUrl,
		// 		data: CardData,
		// 		success: (res) => {
		// 			let pk_paybill = null;
		// 			let page_code = null;
		// 			if (res.success) {
		// 				if (res.data) {
		// 					toast({ color: 'success', content: '保存成功' });
		// 					if (res.data.head && res.data.head[this.formId]) {
		// 						this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
		// 						pk_paybill = res.data.head[this.formId].rows[0].values.pk_paybill.value;
		// 						page_code = res.data.head[this.formId].rows[0].values.trade_type.value;
		// 					}
		// 					this.setState({
		// 						billno: billno
		// 					});
		// 					if (res.data.body && res.data.body[this.tableId]) {
		// 						this.props.editTable.setTableData(this.tableId, res.data.body[this.tableId]);
		// 					}
		// 				}
		// 			}
		// 			props.pushTo('/card', { status: 'browse', id: pk_paybill, pagecode: page_code });
		// 			// props.linkTo(card_page_url, {
		// 			// 	status: 'browse',
		// 			// 	id: pk_paybill,
		// 			// 	pagecode: page_code
		// 			// });
		// 			that.pageShow();
		// 		}
		// 	});
		// 	break;
		case 'copy': //复制按钮
			// props.linkTo(card_page_url, {
			// 	status: 'copy',
			// 	id: props.getUrlParam('id'),
			// 	copyFlag: 'copy',
			// 	pagecode: pagecodes
			// });
			props.pushTo('/card', {
				status: 'copy',
				id: props.getUrlParam('id'),
				pagecode: pagecodes,
				copyFlag: 'copy'
			});
			that.pageShow();
			break;

		case 'delete':
			this.props.modal.show('delete');


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

			this.props.modal.show('cancelModal', {
				//点击确定按钮事件
				beSureBtnClick: () => {
					if (current_pk) {
						cannel_linkto.call(this, props, card_page_url, current_pk);
					}
					if (props.getUrlParam('status') === 'add') {
						let last_pk = getCurrentLastId(PAYBILL_CONST.paybillCacheKey);
						if (last_pk) {
							cannel_linkto.call(this, props, card_page_url, last_pk);
						} else {
							props.pushTo('/card', { status: 'browse', op: 'cancel' });
							// props.linkTo(card_page_url, {
							// 	status: 'browse',
							// 	op: 'cancel'
							// });
							that.pageShow();
						}
					} else {
						cannel_linkto.call(this, props, card_page_url, current_pk);
					}
					//beSureBtnClickDelete.call(this, props, data);
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
			let url = '/nccloud/cmp/paybills/savecommit.do';
			if (props.getUrlParam('status') === 'edit') {
				url = '/nccloud/cmp/paybills/editcommit.do';
			}
			let saveComData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
			let saveComflag = props.form.isCheckNow(this.formId);
			if (saveComflag) {
				ajax({
					url: url,
					data: saveComData,
					success: (res) => {
						let pk_paybill = null;
						if (res.success) {
							if (res.data) {
								toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000008') });/* 国际化处理： 保存提交成功*/
								let sc_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
								let sc_bill_no = res.data.head['head'].rows[0].values.bill_no.value;
								let page_cod = res.data.head['head'].rows[0].values.trade_type.value;
								props.pushTo('/card', {
									status: 'browse',
									id: sc_pk_paybill,
									billno: sc_bill_no,
									pagecode: page_cod
								});
								// props.linkTo(card_page_url, {
								// 	status: 'browse',
								// 	id: sc_pk_paybill,
								// 	billno: sc_bill_no,
								// 	pagecode: page_cod
								// });
								//that.componentDidMount();
								that.pageShow();
							}
						}
					}
				});
			}
			break;
		case 'printbtn':
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				'/nccloud/cmp/paybills/paybillsprint.do',
				{
					//billtype: 'D5', //单据类型
					//funcode: '36070PBM', //功能节点编码，即模板编码
					nodekey: 'NCCLOUD', //模板节点标识
					//printTemplateID: '1001Z610000000004R6L', //模板id
					appcode: '36070PBR',
					oids: [ this.props.form.getFormItemsValue('head', 'pk_paybill').value ]
				}
			);
			break;

		case 'output':
			let pkos = [];
			pkos.push(this.props.form.getFormItemsValue('head', 'pk_paybill').value);
			this.setState(
				{
					outputData: {
						appcode: '36070PBR', //功能节点编码，即模板编码
						nodekey: 'NCCLOUD', //模板节点标识

						printTemplateID: '1001Z610000000004R6L', //模板id
						outputType: 'output',
						oids: pkos
					}
				},
				() => {
					this.refs.printOutput.open();
				}
			);
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
				success: function(res) {
					let { success, data } = res;
					if (success) {
						let {head ,body}=data;
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000009') });/* 国际化处理： 提交成功*/
						let com_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
						//更新缓存
						that.updateCacheData(PAYBILL_CONST.paybill_pkname,com_pk_paybill, res.data, PAYBILL_CONST.card_from_id, PAYBILL_CONST.paybillCacheKey);
						// if(head){
						// 	props.form.setAllFormValue({['head']:head['head']})
						// }
						// if(body){
						// 	props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						// }
						
						//this.props.form.getFormItemsValue('head', 'pk_paybill').value;
						//
						let com_billstatue = res.data.head['head'].rows[0].values.bill_status.value;
						//this.props.form.getFormItemsValue('head', 'bill_status').value,
						//
						let compage = res.data.head['head'].rows[0].values.trade_type.value;
						//this.props.form.getFormItemsValue('head', 'trade_type').value;
						//
						props.pushTo('/card', {
							status: 'browse',
							id: com_pk_paybill,
							bill_status: com_billstatue,
							pagecode: compage
						});
						that.pageShow();
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
				callback: '/nccloud/resources/cmp/billmanagement/paybill/card/index.html',
				name: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000010')/* 国际化处理： 付款结算关联结算信息*/
			});
			break;
		case 'unassociate': //
			let req_unAs_Data = {
				pk: this.props.form.getFormItemsValue('head', 'pk_paybill').value,
				pageid: '36070PBR_D5_card'
			};
			ajax({
				url: '/nccloud/cmp/paybills/canelassociate.do',
				data: req_unAs_Data,
				success: function(res) {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000009') });/* 国际化处理： 提交成功*/
						let com_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
						let com_billstatue = res.data.head['head'].rows[0].values.bill_status.value;
						let pagecode = res.data.head['head'].rows[0].values.trade_type.value;

						props.pushTo('/card', {
							status: 'browse',
							id: com_pk_paybill,
							billno: com_billstatue,
							pagecode: pagecodes
						});
						// props.linkTo(card_page_url, {
						// 	status: 'browse',
						// 	id: com_pk_paybill,
						// 	billno: com_billstatue,
						// 	pagecode: pagecodes
						// });
						this.pageShow();
					}
				}
			});

			break;
		case 'BillLQueryVoucher':
			linkVoucherApp(
				props,
				this.props.form.getFormItemsValue('head', 'pk_paybill').value,
				'nc.vo.cmp.bill.BillAggVO',
				'36070PBR',
				'F5',
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
				success: function(res) {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000011') });/* 国际化处理： 收回成功*/
						let uncom_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
						that.updateCacheData(PAYBILL_CONST.paybill_pkname,uncom_pk_paybill, res.data, PAYBILL_CONST.card_from_id, PAYBILL_CONST.paybillCacheKey);
						let uncom_billstatue = res.data.head['head'].rows[0].values.bill_status.value;
						let page = res.data.head['head'].rows[0].values.trade_type.value;
						props.pushTo('/card', {
							status: 'browse',
							id: uncom_pk_paybill,
							bill_status: uncom_billstatue,
							pagecode: page
						});
						that.pageShow();
					}
				}
			});
			break;

		case 'billquery':
			//if(this.State.showUploader==='true'){}

			this.setState({
				show: true
			});
			break;
		//影像查看
		case 'BaseImageShow':
			let showData = props.createMasterChildData(this.pageId, this.formId, this.tableId);

			let openShowbillid = props.getUrlParam('id'); //单据pk(billid)
			console.log(openShowbillid);
			imageView(showData, openShowbillid, 'F5', 'iweb');
			break;
		//影像扫描
		case 'BaseImageScan': //打印
			let ScanData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
			console.log(ScanData);
			let openbillid = props.getUrlParam('id'); //单据pk(billid)
			imageScan(ScanData, openbillid, 'F5', 'iweb');
			break;

		//收回
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
				link_dataArray.push(link_paybill); //上后主键
			}

			if (link_dataArray.lenth == 0) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000012') });/* 国际化处理： 操作失败，无数据!*/
				return;
			}
			console.log(link_dataArray);
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

			props.openTo('/cmp/billmanagement/recbill/linkcard/index.html', {
				appcode: '36070RBM',
				pagecode: '36070RBMLINK_C01',
				status: 'browse',
				src: 'paybills'
			});

			//window.parent.openNew(linkOption, '', params);
			break;

		case 'reverse': //红冲按钮

    

			let reverseData = {
				pks:  [this.props.form.getFormItemsValue('head', 'pk_paybill').value] ,
				pageid: '36070PBR_D5_list'
			};

			ajax({
				url: '/nccloud/cmp/paybills/reverse.do',
				data: reverseData,
				success: (res) => {
					console.log(res.data[''] + this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000014'));/* 国际化处理： 红冲数据*/
					if (res.data) {
						if (res.data['table_D5']) {
							props.pushTo('/card', {
								status: 'browse',
								id: res.data['table_D5'].rows[1].values.pk_paybill.value,
								pagecode: res.data['table_D5'].rows[1].values.trade_type.value
							});

							// props.linkTo(card_page_url, {
							// 	status: 'browse',
							// 	id: res.data[this.tableId].rows[1].values.pk_paybill.value,
							// 	pagecode: res.data[this.tableId].rows[1].values.trade_type.value
							// });
						}
					}
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
					content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000015')/* 国际化处理： 未选中要复制的行*/
				});
				return false;
			}
			let selectIndexs = [];
			let selectRowCopy = deepClone(selectRows);

			for (let item of selectRowCopy) {
				item.data.selected = false;
				item.data.values.pk_paybill_detail = null;
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
			that.pageShow();
			break;
		case 'saveBtn':
      let firstStatus = this.props.getUrlParam('status');
     	//校验表单必输字段
		let formflag = this.props.form.isCheckNow(this.formId);
		if (!formflag) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000094') });/* 国际化处理： 请检查必输项是否填写*/
			return;
		}

		let ReleaseCardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);

		let tableCheckFlag = this.saveBeforeEvent(ReleaseCardData);

		if (!tableCheckFlag) {
			return;
		}
		let ReleaseUrl = '/nccloud/cmp/paybills/releasesave.do'//认领保存
        ajax({
          url: ReleaseUrl,
          data: ReleaseCardData,
          success: (res) => {
            if (res.success) {
              if (res.data) {
                toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000005') });/* 国际化处理： 保存成功*/
                if (res.data.head) {
                  this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
				  let ntbMessage = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
				  if (ntbMessage) {
					  toast({
						  color: 'warning',
						  content: ntbMessage
					  });
				  }
				}
                if (res.data.body) {
                  this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                }
                let release_pk = res.data.head[this.formId].rows[0].values.pk_paybill.value;
                let release_status = res.data.head[this.formId].rows[0].values.bill_status.value;
                let release_billno = res.data.head[this.formId].rows[0].values.bill_no.value;

                this.setState({
                  status: 'browse'
                });
                //跳转下一个缩略图
                this.props.transferTable.setTransformFormStatus('leftarea', {
                  status: 'browse',
                  onChange: (current, next, currentIndex) => {
                    this.props.transferTable.setTransferListValueByIndex('leftarea', current, currentIndex);
                    //刷新左侧列表数据
                    let size = this.props.transferTable.getTransformFormAmount('leftarea');
                    let nextIndex = currentIndex + 1;
                    if (nextIndex == size) {
                      nextIndex = size;
                    }
                    this.props.transferTable.setTransferListValueByIndex('leftarea', res.data, currentIndex);
                  }
                });
              }
            }

          }
        });
	  break;
	   //认领取消
	   case 'cancelBtn':
	   this.releasetoggleShow('browse');
	   break;
	 //认领退出
	 case 'quitBtn':

	 promptBox({

		color: 'warning', 
		hasCloseBtn:false,        
		content:  this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000096'),/* 国际化处理： 确定要退出认领吗?*/
		beSureBtnClick:this.cancelReleaseConfirm
			//beSureBtnClickDelete.call(this, props, data);
		}  // 确定按钮点击调用函数,非必
	);
	  // props.modal.show('cancelRelease');
	   break;
	 //认领修改
	 case 'editBtn':
	   this.releasetoggleShow('edit');
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