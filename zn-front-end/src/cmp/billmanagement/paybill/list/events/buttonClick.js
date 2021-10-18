/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { createPage, ajax, base, toast, cacheTools, print, promptBox, viewModel } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
let { setDefData, getDefData } = cardCache;
const { NCMessage } = base;
import { PAYBILL_CONST } from '../../cons/constant.js';
import { BatchToast } from '../../../../public/CMPMessage.js';
import refresh from './refresh.js';
import { imageScan, imageView } from 'sscrp/rppub/components/image';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { exportFile } from '../../../../pub/utils/CMPButtonUtil';//导出EXCEL
import api from '../../base/api/index.js';
import  {go2Card}  from '../../util/goToCard.js';
import { CMPEableSscivm } from '../../../../pub/utils/CMPIVPara';
import { saveMultiLangRes,loadMultiLang } from '../../../../../tmpub/pub/util';

export default function buttonClick(props, id) {
	let pagecodes = '36070PBR_D5_card';
	const selectData = props.table.getCheckedRows(this.tableId);
	switch (id) {
		case 'save': //新增
			this.setStateCache();
			let tradeType = JSON.parse(getGlobalStorage('sessionStorage', 'sessionTP'));
			//JSON.parse(sessionStorage.getItem('sessionTP'));
			if (tradeType && tradeType.refcode) {
				props.pushTo('/card', {
					status: 'add',
					tradetypecode: tradeType.refcode,
					tradetypename: tradeType.refname,
					tradetypepk: tradeType.refpk,
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
			if (!checkNoSelected.call(this, selectedData)) {
				return;
			}
			let data = dataBuild(selectedData, PAYBILL_CONST.list_page_id);
			promptBox({
				color: 'warning',
				title:  loadMultiLang(this.props, '36070PBR-000103'),/* 国际化处理： 请先填写财务组织！*/
				hasCloseBtn: false,
				content: loadMultiLang(this.props, '36070PBR-000036'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否确认取消*/
				beSureBtnClick: () => {
					beSureBtnClickDelete.call(this, props, data);
				}
			}
			);
			break;
		//复制
		case 'copy':
			let copyData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (copyData.length != 1) {
				toast({ color: 'warning', content: loadMultiLang(this.props, '36070PBR-000068') });/* 国际化处理： 请选择单条数据进行复制操作*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			let copyid;
			let CopyTradeType;
			copyData.forEach((val) => {
				copyid = val.data.values.pk_paybill.value;
				CopyTradeType = val.data.values.trade_type;
			});
			if (CopyTradeType && CopyTradeType.value === 'DS') {
				toast({ color: 'warning', content:  loadMultiLang(this.props, '36070PBR-000109') });/* 国际化处理： 请选择单条数据进行复制操作*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			go2Card(props,{ status: 'copy',	id: copyid,pagecode: pagecodes} ,{} );
			break;
		//提交
		case 'commit':
			let checkdData = props.table.getCheckedRows(this.tableId);
			if (!checkNoSelected(checkdData)) {
				return;
			}

			let commitData = dataBuild(checkdData, PAYBILL_CONST.list_page_id);

			ajax({
				url: '/nccloud/cmp/paybills/commit.do',
				data: commitData,
				success: (res) => {
					let { data} = res;
					if (data.workflow && (data.workflow == 'approveflow' || data.workflow == 'workflow')) {
						this.setState({
							compositedata: res.data,
							compositedisplay: true
						});

					} else {
                     let opdata=data.data;
						let updateDataArr = [];
						let errMsg = [];

						let successIndexs = 0;
						let failIndexs = 0;
						
						//begin tm tangleic 修改共计值 取返回数据的个数
						// let total = 0;
						let total = 0;
						if(opdata.length>0){
							total=opdata.length;
						}
						//end tm tangleic
						
						if (opdata && opdata.length > 0) {
							for (let operatorResult of opdata) {
								let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
								//成功
								if (state == 0) {
									//删除行
									successIndexs = successIndexs + 1;
									//更新行
									if (result && result.head && result.head['table_D5'] && result.head['table_D5'].rows && result.head['table_D5'].rows.length > 0) {
										let row = result.head['table_D5'].rows[0];

										//begin tm tangleic 批量提交增加对预算提示信息的处理
										let tbbMsg = api.comm.getTbbMsg({ props, row });
										if (tbbMsg) {
											errMsg.push(tbbMsg);
										}
										//end tm tangleic 

										let updateData = { index: rowIndex, data: { values: row.values } };
										updateDataArr.push(updateData);
									}

								}
								//失败
								else if (state == 1) {
									errMsg.push(msg);
									failIndexs = failIndexs + 1;

								}
							}
							//更新行
							if (updateDataArr.length > 0) {
								props.table.updateDataByIndexs(PAYBILL_CONST.list_table_id, updateDataArr);
							}
						}
						let { status, msg } = res.data;
						//BatchToast('COMMIT',status,total, successIndexs,failIndexs,errMsg,null);
						BatchToast.call(this, 'COMMIT', status, total, successIndexs, failIndexs, errMsg, null);
					}
				}
			});
			break;
		//收回
		case 'uncommit':
			let unCheckdData = props.table.getCheckedRows(this.tableId);
			if (!checkNoSelected(unCheckdData)) {
				return;
			}

			let unComData = dataBuild(unCheckdData, PAYBILL_CONST.list_page_id);
			ajax({
				url: '/nccloud/cmp/paybills/uncommit.do',
				data: unComData,
				success: (res) => {
					let { data } = res.data;
					let updateDataArr = [];
					let errMsg = [];

					let successIndexs = 0;
					let failIndexs = 0;
					let total = 0;
						if(data.length>0){
							total=data.length;
						}
					if (data && data.length > 0) {

						for (let operatorResult of data) {
							let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
							//成功
							if (state == 0) {
								//删除行
								successIndexs = successIndexs + 1;
								//更新行

								if (result && result.head && result.head['table_D5'] && result.head['table_D5'].rows && result.head['table_D5'].rows.length > 0) {
									let row = result.head['table_D5'].rows[0];
									let updateData = { index: rowIndex, data: { values: row.values } };
									updateDataArr.push(updateData);
								}

							}
							//失败
							else if (state == 1) {
								//失败
								errMsg.push(msg);
								failIndexs = failIndexs + 1;
							}
						}
						//更新行
						if (updateDataArr.length > 0) {
							props.table.updateDataByIndexs(PAYBILL_CONST.list_table_id, updateDataArr);
						}
					}
					let { status, msg } = res.data;

					//BatchToast('UNCOMMIT',status,total, successIndexs,failIndexs,errMsg,null);
					BatchToast.call(this, 'UNCOMMIT', status, total, successIndexs, failIndexs, errMsg, null);
				}
			});
			break;

		//
		case 'tradetype': //交易类型
			break;


		//协同单据联查
		case 'billlinkquery':
			let billlinkData = props.table.getCheckedRows(this.tableId);
			if (billlinkData.length != 1) {
				toast({ color: 'warning', content: loadMultiLang(this.props, '36070PBR-000100') });/* 国际化处理： 请选择要联查的数据*/
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
				name:  loadMultiLang(this.props, '36070PBR-000013'),/* 国际化处理： 收款结算联查*/
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
		if(CMPEableSscivm.call(this)){
			 return ;
			};
			let showData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (showData.length != 1) {
				toast({ color: 'warning', 
				content: loadMultiLang(this.props, '36070PBR-000071')});/* 国际化处理： 请选择1条数据*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			let billShowInfoMap = {};
			let openShowbillid;
			showData.forEach((val) => {
				openShowbillid = val.data.values.pk_paybill.value;
				billShowInfoMap['pk_billid'] = openShowbillid;

				billShowInfoMap['pk_billtype'] = val.data.values.bill_type.value;
				billShowInfoMap['pk_tradetype'] = val.data.values.trade_type.value;;
				billShowInfoMap['pk_org'] = val.data.values.pk_org.value;;
			});
			imageView(billShowInfoMap, 'iweb');
			//查询数据
			// let vdata = { pk: openShowbillid, pageid: '36070PBR_D5_card' };
			// ajax({
			// 	url: '/nccloud/cmp/billmanagement/querybypk.do',
			// 	data: vdata,
			// 	success: (res) => {
			// 		if (res.data) {
			// 			let ddata = aa(res.data);
			// 			imageView(ddata, openShowbillid, 'F5', 'iweb');
			// 		}
			// 	}
			// });
			break;
		//影像扫描
		case 'BaseImageScan': //打印
		if(CMPEableSscivm.call(this)){
			 return ;
			};
			let ScanData = props.table.getCheckedRows(this.tableId);
			let openbillid = '';
			//数据校验
			if (ScanData.length != 1) {
				toast({ color: 'warning',
				 content:  loadMultiLang(this.props, '36070PBR-000071')});/* 国际化处理： 请选择1条数据*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			let billInfoMap = {};
			ScanData.forEach((val) => {
				openbillid = val.data.values.pk_paybill.value;
				billInfoMap['pk_billid'] = openbillid;
				billInfoMap['pk_billtype'] = val.data.values.bill_type.value;
				billInfoMap['pk_tradetype'] = val.data.values.trade_type.value;
				billInfoMap['pk_org'] = val.data.values.pk_org.value;
				billInfoMap['BillType'] = val.data.values.trade_type.value;
				billInfoMap['BillDate'] = val.data.values.creationtime.value;
				billInfoMap['Busi_Serial_No'] = val.data.values.pk_paybill.value;
				billInfoMap['OrgNo'] = val.data.values.pk_org.value;
				billInfoMap['BillCode'] = val.data.values.bill_no.value;
				billInfoMap['OrgName'] = val.data.values.pk_org.value;
				billInfoMap['Cash'] = val.data.values.primal_money.value;
			});
			imageScan(billInfoMap, 'iweb');
			break;

		//关联结算Associate
		case 'Associate':

			let appOption = {
				code: '360704SMP',
				name: loadMultiLang(this.props, '36070PBR-000065'),/* 国际化处理： 关联结算信息*/
				pk_appregister: '0001Z610000000042B19'
			};

			let query = {
				callbackappcode: '36070PBR',
				callbackpagecode: '36070PBR_D5_card',
				src: 1,
				callback: '/nccloud/resources/cmp/billmanagement/paybill/main/index.html#/card'
			};
			props.openTo('/cmp/settlementmanagement/settlepublic/list/index.html', {
				appcode: '360704SM',
				pagecode: '360704SMP_L01',
				callbackappcode: '36070PBR',
				callbackpagecode: '36070PBR_D5_card',
				src: 1,
				callback: '/cmp/billmanagement/paybill/main/index.html#/card',
				name:  loadMultiLang(this.props, '36070PBR-000010')/* 国际化处理： 付款结算关联结算信息*/
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
				toast({ color: 'warning', content: loadMultiLang(this.props, '36070PBR-000072')
				});/* 国际化处理： 取消结算只支持单条记录操作*/
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
			let req_unAs_Data = dataBuild(unAsData, PAYBILL_CONST.list_page_id);
			//数据审批状态校验
			if (!isfromindependent || isfromindependent != '1') {
				toast({ color: 'warning', content:  loadMultiLang(this.props, '36070PBR-000073') });/* 国际化处理： 不是由结算信息产生的数据，不能取消关联结算*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			ajax({
				url: '/nccloud/cmp/paybills/canelassociate.do',
				data: req_unAs_Data,
				success: function (res) {
					let { data } = res.data;
					let deleteIndex = [];
					if (data && data.length > 0) {

						for (let operatorResult of data) {
							let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
							//成功
							if (state == 0) {
								//删除缓存数据
								props.table.deleteCacheId(PAYBILL_CONST.list_table_id, pk);

								//删除行
								deleteIndex.push(rowIndex);
								toast({ color: 'success', content: loadMultiLang(props, '36070PBR-000105')
							 });/* 国际化处理： 取消关联结算成功*/

							} else if (state == 1) {
								//失败
								toast({ color: 'warning', content: loadMultiLang(props, '36070PBR-000107') });/* 国际化处理： 取消关联结算失败*/

							}

						}
						if (deleteIndex && deleteIndex.length > 0) {
							props.table.deleteTableRowsByIndex(PAYBILL_CONST.list_table_id, deleteIndex);
						}
					}
				}
			});
			break;

		case 'BillLQueryVoucher':
			let link_selectedData = props.table.getCheckedRows(this.tableId);
			if (link_selectedData.length != 1) {
				toast({
					color: 'warning',
					content:loadMultiLang(this.props, '36070PBR-000071')/* 国际化处理： 请选择1条数据*/
				});
				return;
			}
			linkVoucherApp(
				props,
				link_selectedData[0].data.values.pk_paybill.value,
				link_selectedData[0].data.values.pk_group.value,
				link_selectedData[0].data.values.pk_org.value,
				link_selectedData[0].data.values.trade_type.value,
				link_selectedData[0].data.values.bill_no.value,
			)
			break;

		case 'printbtn': //打印
			let printData = props.table.getCheckedRows(this.tableId);

			//数据校验
			if (printData.length == 0) {
				toast({ color: 'warning', content: loadMultiLang(this.props, '36070PBR-000079')});/* 国际化处理： 请选择要打印的数据*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			let pks = [];
			printData.forEach((item) => {
				pks.push(item.data.values.pk_paybill.value);
			});
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				'/nccloud/cmp/paybills/paybillsprint.do',
				{
					appcode: '36070PBR',
					nodekey: 'NCCLOUD', //模板节点标识

					oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
				}
			);
			break;
		case 'printlist': //打印
			let printListData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (printListData.length == 0) {
				toast({ color: 'warning', content: loadMultiLang(this.props, '36070PBR-000079') });/* 国际化处理： 请选择要打印的数据*/
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
					appcode: '36070PBR',
					nodekey: 'NCCLOUDLIST', //模板节点标识
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
					content:loadMultiLang(this.props, '36070PBR-000080')/* 国际化处理： 请选择单条数据，上传附件!*/
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
					content:loadMultiLang(this.props, '36070PBR-000081')/* 国际化处理： 请选择单条数据，进行单据联查!*/
				});
				return;
			}
			

			//let pk_billtype='36S2';
			let pk_queryPaybill = ''; //单据pk
			let  pk_srcbilltypecode;

			//选择一个或者不选择，多选默认显示空数据
			if (queryData.length == 1) {
				queryData.forEach((val) => {
					if (val.data.values.pk_paybill && val.data.values.pk_paybill.value != null) {
						pk_queryPaybill = val.data.values.pk_paybill.value;
						pk_srcbilltypecode= val.data.values.up_billtype.value;
					}
				});
			}
			if (pk_srcbilltypecode && pk_srcbilltypecode == '36S3') {
			  toast({
				color: 'warning',
				content:loadMultiLang(this.props, '36070PBR-000120') /* 国际化处理： 到账通知不支持单据追溯!*/
			  });
			  return;
			};

			// this.setState({
			// 	billId: pk_queryPaybill, //单据pk
			// 	show: true
			// });
			this.setState(
				{
					billId: pk_queryPaybill //单据pk
				},
				() => {
					this.setState({
						showBackTrace: true
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
					content: loadMultiLang(this.props, '36070PBR-000082')/* 国际化处理： 请选择1条数据，查看审批意见!*/
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
					content:loadMultiLang(this.props, '36070PBR-000083')/* 国际化处理： 请选择单条数据，查看计划预算!*/
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
			let searchData = getDefData(PAYBILL_CONST.search_key, PAYBILL_CONST.paybillCacheKey);
			if (searchData && searchData.conditions) {
				refresh.call(this, props);
			}
			break;
		case 'linkReceipt':
			let reciptData = props.table.getCheckedRows(this.tableId);

			if (reciptData.length != 1) {
				toast({
					color: 'warning',
					content: loadMultiLang(this.props, '36070PBR-000081')/* 国际化处理： 请选择单条数据，进行单据联查!*/
				});
				return;
			}
			this.setState({
				sscrpLinkInvoiceData: {
					'billId': reciptData[0].data.values.pk_paybill.value,
					'billCode': reciptData[0].data.values.bill_no.value,
					'pk_org': reciptData[0].data.values.pk_org.value,
					'tradetype': reciptData[0].data.values.trade_type.value,
					'viewRandom': Math.random()
				}
			})
			break;

		//导出
		case 'exportFile': //导出
			exportFile.call(this, props, PAYBILL_CONST.list_table_id, 'pk_paybill');
			break;
		case 'CommitConfirm':
			let commitConfirmData = dataBuild(props.table.getCheckedRows(this.tableId), PAYBILL_CONST.list_page_id);
			commitConfirmData.content = this.state.getAssginUsedr;
			ajax({
				url: '/nccloud/cmp/paybills/commitConfirm.do',
				data: commitConfirmData,
				success: (res) => {
					let { data } = res.data;
					let updateDataArr = [];
					let errMsg = [];

					let successIndexs = 0;
					let failIndexs = 0;
					let total = 0;


					this.setState({
						compositedisplay: false
					})
					if (data && data.length > 0) {
						for (let operatorResult of data) {
							let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
							//成功
							if (state == 0) {
								//关闭窗口

								//删除行
								successIndexs = successIndexs + 1;
								//更新行

								if (result && result.head && result.head['table_D5'] && result.head['table_D5'].rows && result.head['table_D5'].rows.length > 0) {
									let row = result.head['table_D5'].rows[0];

									//begin tm tangleic 批量提交增加对预算提示信息的处理
									let tbbMsg = api.comm.getTbbMsg({ props, row });
									if (tbbMsg) {
										errMsg.push(tbbMsg);
									}
									//end tm tangleic 

									let updateData = { index: rowIndex, data: { values: row.values } };
									updateDataArr.push(updateData);
								}

							}
							//失败
							else if (state == 1) {
								errMsg.push(msg);
								failIndexs = failIndexs + 1;

							}
						}
						//更新行
						if (updateDataArr.length > 0) {
							props.table.updateDataByIndexs(PAYBILL_CONST.list_table_id, updateDataArr);
						}
					}
					let { status, msg } = res.data;
					//('COMMIT',status,total, successIndexs,failIndexs,errMsg,null);

				}

			});
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
		pks,
	};
	return data;
}
function checkNoSelected(selectDatas) {
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0) {
		toast({ color: 'warning', content: loadMultiLang(this.props, '36070PBR-000084') });/* 国际化处理： 未选中行！*/
		return false;
	}
	return true;
}

function checkOneSelected(selectDatas) { }
//删除
function beSureBtnClickDelete(props, data) {
	ajax({
		url: '/nccloud/cmp/billmanagement/delete.do',
		data: data,
		success: (res) => {
			let { data } = res.data;
			let errMsg = [];

			let successIndexs = 0;
			let failIndexs = 0;
			let total = 0;
			let deleteIndex = [];
			if (data && data.length > 0) {

				total = data.length;
				for (let operatorResult of data) {
					let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
					//成功
					if (state == 0) {
						//删除行
						successIndexs = successIndexs + 1;
						//删除缓存数据
						props.table.deleteCacheId(PAYBILL_CONST.list_table_id, pk);

						//删除行
						deleteIndex.push(rowIndex);
						//props.table.deleteTableRowsByIndex(PAYBILL_CONST.list_table_id, rowIndex);
					} else if (state == 1) {
						//失败
						errMsg.push(msg);
						failIndexs = failIndexs + 1;
					}

				}
				if (deleteIndex && deleteIndex.length > 0) {
					props.table.deleteTableRowsByIndex(PAYBILL_CONST.list_table_id, deleteIndex);
				}

				let { status, msg } = res.data;

				BatchToast.call(this, 'DELETE', status, total, successIndexs, failIndexs, errMsg, null);
				//BatchToast('DELETE',status,total, successIndexs,failIndexs,errMsg,null);
			}
		}
	});
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/