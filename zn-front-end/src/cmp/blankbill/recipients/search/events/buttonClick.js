/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, cacheTools, print, toast, viewModel } from 'nc-lightapp-front';
import { imageScan, imageView } from 'sscrp/rppub/components/image';
import { BatchToast } from '../../../../public/CMPMessage.js';
import { linkVoucherApp } from '../../../../public/utils/LinkUtil';
import { BBR_CONST, list_search_id } from '../../cons/constant.js';
import refresh from './refresh.js';

const { NCMessage } = base;
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;

export default function buttonClick(props, id) {
	let pagecodes = '36070PBR_D5_card';
	const selectData = props.table.getCheckedRows(this.tableId);
	switch (id) {
		case 'save': //新增
		 this.setStateCache();
			let tradeType = JSON.parse(
				getGlobalStorage("sessionStorage", "sessionTP"));
			if (tradeType && tradeType.refcode) {
				props.pushTo('/card', {
					status: 'add',
					tradetypecode: tradeType.refcode,
					tradetypename: tradeType.refname,
					tradetypepk:tradeType.refpk,
					pagecode: tradeType.refcode
				});
			} else {
				props.pushTo('/card', {
					status: 'add',
					pagecode: '36070PBR_D5_card'
				});
			}
			break;
		//删除，可以支持批量
		case 'delete':
			const selectedData = props.table.getCheckedRows(this.tableId);
			if (!checkNoSelected(selectedData)) {
				return;
			}

			//自定义请求数据
			// let data = {
			// 	pks: dataArr,
			// 	tss: tsArr
			// };
			let data = dataBuild(selectedData, BBR_CONST.list_page_id);
			this.props.modal.show('delmodal', {
				//点击确定按钮事件
				beSureBtnClick: () => {
					beSureBtnClickDelete.call(this, props, data);
				}
			});
			break;
		//复制
		case 'copy':
			let copyData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (copyData.length != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000068') });/* 国际化处理： 请选择单条数据进行复制操作*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			let copyid;
			copyData.forEach((val) => {
				copyid = val.data.values.pk_paybill.value;
			});

			props.pushTo('/card', {
				status: 'copy',
				id: copyid,
				pagecode: pagecodes
			});
			// props.linkTo(card_page_url, {
			// 	status: 'copy',
			// 	id: copyid,
			// 	pagecode: pagecodes
			// });
			break;
		//提交
		case 'commit':
			let checkdData = props.table.getCheckedRows(this.tableId);
			if (!checkNoSelected(checkdData)) {
				return;
			}

			//自定义请求数据
			// let data = {
			// 	pks: dataArr,
			// 	tss: tsArr
			// };
			let commitData = dataBuild(checkdData, BBR_CONST.list_page_id);
			//数据校验
			// if (checkdData.length == 0) {
			// 	toast({ color: 'warning', content: '请选择要提交的数据' });
			// 	return;
			// }

			// let commitDataArr = [];
			// //处理选择数据
			// checkdData.forEach((val) => {
			// 	commitDataArr.push(val.data.values.pk_paybill.value);
			// });
			// let commitData = {
			// 	pks: commitDataArr,
			// 	pageid: '36070PBR_D5_list'
			// };
			ajax({
				url: '/nccloud/cmp/paybills/commit.do',
				data: commitData,
				success: (res) => {
					let { data } = res.data;
					let updateDataArr = [];
					let errMsg = [];
		
					let successIndexs=0;
					let  failIndexs=0;
					let  total=0;
					if (data && data.length > 0) {
						for (let operatorResult of data) {
							let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
							//成功
							if (state == 0) {
								//删除行
								successIndexs=successIndexs+1;
								//更新行
								
								if (result && result.head && result.head['head'] && result.head['head'].rows && result.head['head'].rows.length > 0) {
									let row = result.head['head'].rows[0];
									let updateData = { index: rowIndex, data: { values: row.values } };
									updateDataArr.push(updateData);
								}
								
							}
							//失败
							else if (state == 1) {
								errMsg.push(msg);
								failIndexs=failIndexs+1;

							}
						}
						//更新行
						if (updateDataArr.length > 0) {
							props.table.updateDataByIndexs(BBR_CONST.list_table_id, updateDataArr);
						}
					}
					let { status, msg } = res.data;
					BatchToast('COMMIT',status,total, successIndexs,failIndexs,errMsg,null);
					// //全部成功
					// if (status == 1) {
					// 	toast({ color: 'success', content: msg });
					// }
					// //全部失败
					// else if (status == 0) {
					// 	toast({ color: 'danger', content: errMsg });
					// }
					// //部分成功
					// else if (status == 2) {
					// 	toast({ color: 'warning', content: errMsg });
					// }
				}
			});
			break;
		//收回
		case 'uncommit':
			let unCheckdData = props.table.getCheckedRows(this.tableId);
			if (!checkNoSelected(unCheckdData)) {
				return;
			}

			let unComData = dataBuild(unCheckdData, BBR_CONST.list_page_id);
			ajax({
				url: '/nccloud/cmp/paybills/uncommit.do',
				data: unComData,
				success: (res) => {
					let { data } = res.data;
					let updateDataArr = [];
					let errMsg = [];
		
					let successIndexs=0;
					let  failIndexs=0;
					let  total=0;
					if (data && data.length > 0) {
						for (let operatorResult of data) {
							let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
							//成功
							if (state == 0) {
								//删除行
								successIndexs=successIndexs+1;
								//更新行
								
								if (result && result.head && result.head['head'] && result.head['head'].rows && result.head['head'].rows.length > 0) {
									let row = result.head['head'].rows[0];
									let updateData = { index: rowIndex, data: { values: row.values } };
									updateDataArr.push(updateData);
								}
								
							}
							//失败
							else if (state == 1) {
								//失败
						errMsg.push(msg);
						failIndexs=failIndexs+1;
							}
						}
						//更新行
						if (updateDataArr.length > 0) {
							props.table.updateDataByIndexs(BBR_CONST.list_table_id, updateDataArr);
						}
					}
					let { status, msg } = res.data;
					BatchToast('DELETE',status,total, successIndexs,failIndexs,errMsg,null);
					// //全部成功
					// if (status == 1) {
					// 	toast({ color: 'success', content: msg });
					// }
					// //全部失败
					// else if (status == 0) {
					// 	toast({ color: 'danger', content: errMsg });
					// }
					// //部分成功
					// else if (status == 2) {
					// 	toast({ color: 'warning', content: errMsg });
					// }
				}
			});
			break;

		//
		case 'tradetype': //交易类型
			break;

		//红冲
		case 'reverse':
			let reverseData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (reverseData.length != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000069') });/* 国际化处理： 红冲操作只支持单条记录操作*/
				return;
			}
			let reverse_pk;
			let bill_reverse_status;
			reverseData.forEach((val) => {
				reverse_pk = val.data.values.pk_paybill.value;
				bill_reverse_status = val.data.values.bill_status.value;
			});
			//数据审批状态校验
			// if (protopay_status != -10 && protopay_status != -99) {
			// 	toast({ color: 'warning', content: '单据状态不符合承付要求，不能进行承付' });
			// 	// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
			// 	return;
			// }

			// props.linkTo(card_page_url, {
			// 	status: 'reverse',
			// 	id: reverse_pk,
			// 	pagecode:pagecodes
			// });
			// break;
			let reqData = { pks: [ reverse_pk ], pageid: this.pageId };

			ajax({
				url: '/nccloud/cmp/paybills/reverse.do',
				data: reqData,
				success: (res) => {
					console.log(res.data[this.tableId] + this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000014'));/* 国际化处理： 红冲数据*/
					if (res.data) {
						if (res.data[this.tableId]) {
							props.pushTo('/card', {
								status: 'browse',
								id: res.data[this.tableId].rows[1].values.pk_paybill.value,
								pagecode: res.data[this.tableId].rows[1].values.trade_type.value
							});
						}
					}
				}
			});
			break;

		//协同单据联查
		case 'billlinkquery':
			let billlinkData = props.table.getCheckedRows(this.tableId);
			if (billlinkData.length == 0) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000070') });/* 国际化处理： 请选择要联查的数据*/
				return;
			}
			let dataArray = [];

			billlinkData.forEach((val) => {
				if (val.data.values.pk_paybill.value != null) {
					dataArray.push(val.data.values.pk_paybill.value);
				}
				if (val.data.values.pk_upbill != null && val.data.values.pk_upbill.value != null) {
					dataArray.push(val.data.values.pk_upbill.value);
				}
			});
			console.log(dataArray);
			let linkcData = {
				pks: dataArray
			};
			cacheTools.set('paybillsData', dataArray);
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

		//影像查看
		case 'BaseImageShow':
			let showData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (showData.length != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000071') });/* 国际化处理： 请选择1条数据*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			let openShowbillid;
			showData.forEach((val) => {
				openShowbillid = val.data.values.pk_paybill.value;
			});
			//查询数据
			let vdata = { pk: openShowbillid, pageid: '36070PBR_D5_card' };
			ajax({
				url: '/nccloud/cmp/billmanagement/querybypk.do',
				data: vdata,
				success: (res) => {
					if (res.data) {
						let ddata = aa(res.data);
						imageView(ddata, openShowbillid, 'F5', 'iweb');
					}
				}
			});
			break;
		//影像扫描
		case 'BaseImageScan': //打印
			let ScanData = props.table.getCheckedRows(this.tableId);
			let openbillid = '';
			//数据校验
			if (ScanData.length != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000071') });/* 国际化处理： 请选择1条数据*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}

			ScanData.forEach((val) => {
				openbillid = val.data.values.pk_paybill.value;
			});
			//查询数据
			let sdata = { pk: openbillid, pageid: '36070PBR_D5_card' };
			ajax({
				url: '/nccloud/cmp/billmanagement/querybypk.do',
				data: sdata,
				success: (res) => {
					if (res.data) {
						let dddata = aa(res.data);
						console.log(dddata);
						imageScan(dddata, openbillid, 'F5', 'iweb');
					}
				}
			});
			break;

		//关联结算Associate
		case 'Associate':
			let appOption = {
				code: '360704SMP',
				name: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000065'),/* 国际化处理： 关联结算信息*/
				pk_appregister: '0001Z610000000042B19'
			};

			let query = {
				callbackappcode: '36070PBR',
				callbackpagecode: '36070PBR_D5_card',
				src: 1,
				callback: '/nccloud/resources/cmp/billmanagement/paybill/card/index.html'
			};
			props.openTo('/nccloud/resources/cmp/settlementmanagement/settlepublic/list/index.html', {
				appcode: '360704SM',
				pagecode: '360704SMP_L01',
				callbackappcode: '36070PBR',
				callbackpagecode: '36070PBR_D5_card',
				src: 1,
				callback: '/nccloud/resources/cmp/billmanagement/paybill/card/index.html',
				name: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000010')/* 国际化处理： 付款结算关联结算信息*/
			});

			// props.openTo('/cmp/billmanagement/recbilllink/card/index.html', {
			// 	appcode: '36070RBMLINK',
			// 	pagecode: '36070RBMLINK_C01',
			// 	status: 'browse',
			// 	src: 'paybills'
			// });
			//window.parent.openNew(appOption, '', query);
			break;
		// 取消关联结算信息
		case 'unassociate': //
			let unAsData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (unAsData.length != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000072') });/* 国际化处理： 取消结算只支持单条记录操作*/
				return;
			}
			let unas_pk;
			let isfromindependent;
			let unassociate_billstatus;
			unAsData.forEach((val) => {
				unas_pk = val.data.values.pk_paybill.value;
				isfromindependent = val.data.values.isfromindependent.value;
				unassociate_billstatus = val.data.values.bill_status.value;
			});
			//数据审批状态校验
			 if (isfromindependent != '1'  ) {
			 	toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000073') });/* 国际化处理： 不是由结算信息产生的数据，不能取消关联结算*/
			 	// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
			 	return;
			 }
			let req_unAs_Data = { pk: unas_pk, pageid: this.pageId };
			ajax({
				url: '/nccloud/cmp/paybills/canelassociate.do',
				data: req_unAs_Data,
				success: function(res) {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000074') });/* 国际化处理： 取消结算成功*/
						refresh(props);
					}
				}
			});
			break;

		case 'protopay':
			let protoPayData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (protoPayData.length != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000071') });/* 国际化处理： 请选择1条数据*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}

			let protopay_id;
			let protopay_flag = false;
			let protopay_status;
			protoPayData.forEach((val) => {
				protopay_id = val.data.values.pk_paybill.value;
				protopay_flag = val.data.values.is_cf;
				protopay_status = val.data.values.bill_status.value;
			});
			//数据承付状态校验s
			if (!protopay_flag || !protopay_flag.value) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000075') });/* 国际化处理： 非承付单据，不能进行承付*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			//数据审批状态校验
			if (protopay_status != -10 && protopay_status != -99) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000076') });/* 国际化处理： 单据状态不符合承付要求，不能进行承付*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}

			props.pushTo("/card",{status: 'edit',id: protopay_id,op: 'protopay',pagecode: pagecodes});

			// props.linkTo(card_page_url, {
			// 	status: 'edit',
			// 	id: protopay_id,
			// 	op: 'protopay',
			// 	pagecode: pagecodes
			// });
			break;
		case 'unprotopay':
			let unprotoPayData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (unprotoPayData.length != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000071') });/* 国际化处理： 请选择1条数据*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			let unprotopay_id;
			let unprotopay_status;
			let unprotopay_flag = false;
			let unprotopay_bill_status;
			unprotoPayData.forEach((val) => {
				unprotopay_id = val.data.values.pk_paybill.value;
				unprotopay_bill_status = val.data.values.bill_status.value;
				unprotopay_flag = val.data.values.is_cf;
				unprotopay_status = val.data.values.cf_status;
			});
			//数据审批状态校验
			if (unprotopay_bill_status != -10) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000077') });/* 国际化处理： 单据状态不符合取消承付要求，不能取消承付*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			//数据承付b标志校验
			if (!unprotopay_flag || !unprotopay_flag.value) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000075') });/* 国际化处理： 非承付单据，不能进行承付*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			//数据审批状态校验
			if (!unprotopay_status || unprotopay_status.value != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000078') });/* 国际化处理： 承付状态不符合取消承付要求，不能取消承付*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			props.pushTo("/card",{status: 'edit',id: unprotopay_id,	op: 'unprotopay',pagecode: pagecodes});

			// props.linkTo(card_page_url, {
			// 	status: 'edit',
			// 	id: unprotopay_id,
			// 	op: 'unprotopay',
			// 	pagecode: pagecodes
			// });
			break;

		case 'BillLQueryVoucher':
			let link_selectedData = props.table.getCheckedRows(this.tableId);
			if (link_selectedData.length != 1) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000071')/* 国际化处理： 请选择1条数据*/
				});
				return;
			}
			let voucherArr = [];
			let pk_link_paybill, link_bill_no,trade_type;
			link_selectedData.forEach((val) => {
				if (val.data.values.pk_paybill && val.data.values.pk_paybill.value != null) {
					pk_link_paybill = val.data.values.pk_paybill.value;
				}
				if (val.data.values.bill_no && val.data.values.bill_no.value != null) {
					link_bill_no = val.data.values.bill_no.value;
				}
				if (val.data.values.trade_type && val.data.values.trade_type.value != null) {
					trade_type = val.data.values.trade_type.value;
				}
			});
			linkVoucherApp(props, pk_link_paybill, 'nc.vo.cmp.bill.BillAggVO', '0001Z61000000001PJBL', trade_type, link_bill_no);
			break;

		case 'printbtn': //打印
			let printData = props.table.getCheckedRows(this.tableId);

			//数据校验
			if (printData.length == 0) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000079') });/* 国际化处理： 请选择要打印的数据*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			let pks = [];
			printData.forEach((item) => {
				pks.push(item.data.values.pk_paybill.value);
			});
			// if (pks.length!= 1) {
			// 	toast({ color: 'warning', content: '请选择一条打印数据' });
			// 	return;
			// }

			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				'/nccloud/cmp/paybills/paybillsprint.do',
				{
					//billtype: 'D5', //单据类型
					//funcode: '36070PBM', //功能节点编码，即模板编码
					appcode:'36070PBR',
					nodekey: 'NCCLOUD', //模板节点标识
					//printTemplateID: '1001Z610000000004R6L',
					oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
				}
			);
			break;
		case 'printlist': //打印
			let printListData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (printListData.length == 0) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000079') });/* 国际化处理： 请选择要打印的数据*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			let pkls = [];
			printListData.forEach((item) => {
				pkls.push(item.data.values.pk_paybill.value);
			});
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				'/nccloud/cmp/paybills/paybillsprintlist.do',
				{
					//billtype: 'D5', //单据类型
					appcode:'36070PBR',
					//funcode: '36070PBM', //功能节点编码，即模板编码
					nodekey: 'NCCLOUDLIST', //模板节点标识
				//	printTemplateID: '1001Z610000000004REF', //模板id
					oids: pkls // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
				}
			);
			break;
		case 'output':
			let outputData = props.table.getCheckedRows(this.tableId);
			let pkos = [];
			outputData.forEach((item) => {
				pkos.push(item.data.values.pk_paybill.value);
			});
			this.setState(
				{
					outputData: {
						funcode: '36070PBR', //功能节点编码，即模板编码
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
		//附件
		case 'file':
			// toast({ color: 'warning', content: '请选择1条数据' });
			let fileData = props.table.getCheckedRows(this.tableId);
			//let pk_billtype='36S2';
			let pk_paybill = ''; //单据pk
			let bill_no = ''; //单据编号
			//选择一个或者不选择，多选默认显示空数据
			if (fileData.length != 1) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000080')/* 国际化处理： 请选择单条数据，上传附件!*/
				});
				return;
			}
			fileData.forEach((val) => {
				if (val.data.values.pk_paybill && val.data.values.pk_paybill.value != null) {
					pk_paybill = val.data.values.pk_paybill.value;
				}
				if (val.data.values.bill_no && val.data.values.bill_no.value != null) {
					bill_no = val.data.values.bill_no.value;
				}
			});

			this.setState({
				billId: pk_paybill, //单据pk
				billno: bill_no, //附件管理使用单据编号
				showUploader: !this.state.showUploader,
				target: null
			});
			break;

		//联查单据
		case 'billquery':
			let queryData = props.table.getCheckedRows(this.tableId);

			if (queryData.length != 1) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000081')/* 国际化处理： 请选择单条数据，进行单据联查!*/
				});
				return;
			}
			//let pk_billtype='36S2';
			let pk_queryPaybill = ''; //单据pk

			//选择一个或者不选择，多选默认显示空数据
			if (queryData.length == 1) {
				queryData.forEach((val) => {
					if (val.data.values.pk_paybill && val.data.values.pk_paybill.value != null) {
						pk_queryPaybill = val.data.values.pk_paybill.value;
					}
				});
			}

			this.setState({
				billId: pk_queryPaybill, //单据pk
				show: true
			});
			this.setState(
				{
					billId: pk_queryPaybill //单据pk
				},
				() => {
					this.setState({
						show: true
					});
				}
			);
			break;

		//联查审批意见
		case 'linkaprv':
			let linkaprvData = props.table.getCheckedRows(this.tableId);
			//let pk_billtype='36S2';
			let pk_linkPaybill = ''; //单据pk
			let pk_linktradetype = ''; //单据pk
			if (linkaprvData.length != 1) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000082')/* 国际化处理： 请选择1条数据，查看审批意见!*/
				});
				return;
			}
			//处理
			linkaprvData.forEach((val) => {
				if (val.data.values.pk_paybill && val.data.values.pk_paybill.value != null) {
					pk_linkPaybill = val.data.values.pk_paybill.value;
				}
				if (val.data.values.trade_type && val.data.values.trade_type.value != null) {
					pk_linktradetype = val.data.values.trade_type.value;
				}
			});

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
		case 'linkplanbudget':
			let linkPlanData = props.table.getCheckedRows(this.tableId);
			//let pk_billtype='36S2';
			let pk_linkPlanbill = ''; //单据pk

			if (linkPlanData.length != 1) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000083')/* 国际化处理： 请选择单条数据，查看计划预算!*/
				});
				return;
			}
			//处理
			linkPlanData.forEach((val) => {
				if (val.data.values.pk_paybill && val.data.values.pk_paybill.value != null) {
					pk_linkPlanbill = val.data.values.pk_paybill.value;
				}
			});

			let linkData = {
				pk: pk_linkPlanbill,
				pagecode: this.pageId
			};
			ajax({
				url: '/nccloud/cmp/paybills/linkplan.do',
				data: linkData,
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

		case 'Refresh':
			let searchData = props.search.getAllSearchData(list_search_id);
			if (searchData && searchData.conditions) {
				refresh.call(this, props);
			}
			break;
	}
}
function aa(obj) {
	let o = {};
	for (let item of Object.keys(obj)) {
		if (obj[item] && typeof obj[item] === 'object') {
			o[item] = aa(obj[item]);
		} else if (obj[item] || obj[item] === 0) {
			o[item] = obj[item];
		}
	}
	return o;
}

//构建请求数据
function dataBuild(selectDatas, pageid) {
	let pks = [];
	let pkMapTs = {};
	let pkMapVbillno = {};
	let pkMapRowIndex = {};
	let index = 0;
	let pk, ts, vbillno;
	let pkName = 'pk_paybill';
	let vbillnofield = 'bill_no';
	while (index < selectDatas.length) {
		//获取行主键值
		pk =
			selectDatas[index] &&
			selectDatas[index].data &&
			selectDatas[index].data.values &&
			selectDatas[index].data.values[pkName] &&
			selectDatas[index].data.values[pkName].value;
		pks.push(pk);
		//获取行ts时间戳
		ts =
			selectDatas[index] &&
			selectDatas[index].data &&
			selectDatas[index].data.values &&
			selectDatas[index].data.values.ts &&
			selectDatas[index].data.values.ts.value;
		//单据编号
		vbillno =
			selectDatas[index] &&
			selectDatas[index].data &&
			selectDatas[index].data.values &&
			selectDatas[index].data.values[vbillnofield] &&
			selectDatas[index].data.values[vbillnofield].value;
		pkMapRowIndex[pk] = selectDatas[index].index;
		//判空
		if (pk && ts) {
			pkMapTs[pk] = ts;
		}
		if (pk && vbillno) {
			pkMapVbillno[pk] = vbillno;
		}
		index++;
	}
	let data = {
		pkMapRowIndex,
		pkMapTs,
		pkMapVbillno,
		pageid,
		pks
	};
	return data;
}
function checkNoSelected(selectDatas) {
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0) {
		toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000084') });/* 国际化处理： 未选中行！*/
		return false;
	}
	return true;
}

function checkOneSelected(selectDatas) {}
//删除
function beSureBtnClickDelete(props, data) {
	ajax({
		url: '/nccloud/cmp/billmanagement/delete.do',
		data: data,
		success: (res) => {
			let { data } = res.data;
			let errMsg = [];
		
			let successIndexs=0;
			let  failIndexs=0;
			let  total=0;
			if (data && data.length > 0) {
				
				total=data.length;
				for (let operatorResult of data) {
					let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
					//成功
					if (state == 0) {
						//删除行
						successIndexs=successIndexs+1;
						//删除缓存数据
						props.table.deleteCacheId(BBR_CONST.list_table_id, pk);
						//删除行
						props.table.deleteTableRowsByIndex(BBR_CONST.list_table_id, rowIndex);
					} else if (state == 1) {
						//失败
						errMsg.push(msg);
						failIndexs=failIndexs+1;
					}
				}

				let { status, msg } = res.data;

				BatchToast('DELETE',status,total, successIndexs,failIndexs,errMsg,null);

				// //全部成功
				// if (status == 1) {
				// 	toast({ color: 'success', content: msg });
				// } else if (status == 0) {
				// 	//全部失败
				// 	toast({ color: 'danger', content: errMsg });
				// } else if (status == 2) {
				// 	//部分成功
				// 	toast({ color: 'warning', content: errMsg });
				// }
			}
		}
	});
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/