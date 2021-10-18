/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { createPage, ajax, base, toast, cacheTools ,promptBox} from 'nc-lightapp-front';
const { NCMessage } = base;
import { cardCache } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;
import {
	card_page_url
} from '../../cons/constant.js';
import { PAYBILL_CONST } from '../../cons/constant.js';
import {  linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { BatchToast } from '../../../../public/CMPMessage.js';

import refresh from './refresh.js';
export default function buttonClick(props, id) {
	switch (id) {
		case 'save': //新增
			props.linkTo(card_page_url, {
				status: 'add'
			});
			break;
		//删除，可以支持批量
		//删除，可以支持批量
		case 'delete':
			const selectedData = props.table.getCheckedRows(this.tableId);
			if (!checkNoSelected.call(this,selectedData)) {
				return;
			}
			let data = dataBuild(selectedData, PAYBILL_CONST.list_page_id);
			promptBox({
				color: 'warning', 
				title:this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000060'), //删除*/,
				hasCloseBtn:false,        
				content:this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000020'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除所选数据吗?*/
				beSureBtnClick: () => {
					beSureBtnClickDelete.call(this, props, data);
				}}  
			);
			// this.props.modal.show('delmodal', {
			// 	//点击确定按钮事件
			// 	beSureBtnClick: () => {
			// 		beSureBtnClickDelete.call(this, props, data);
			// 	}
			// });
			break;
		//复制
		case 'copy':
			let copyData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (copyData.length != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000035') });/* 国际化处理： 请选择1条数据*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			let copyid = 0;
			copyData.forEach((val) => {
				copyid = val.data.values.pk_paybill.value;
			});
			props.linkTo(card_page_url, {
				status: 'copy',
				id: copyid
			});
			break;
		//提交
		case 'commit':
			let checkdData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (checkdData.length == 0) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000036') });/* 国际化处理： 请选择要提交的数据*/
				return;
			}

			let commitDataArr = [];
			//处理选择数据
			checkdData.forEach((val) => {
				commitDataArr.push(val.data.values.pk_paybill.value);
			});
			let commitData = {
				pks: commitDataArr,
				pageid: '36070PBR_D5_list'
			};
			ajax({
				url: '/nccloud/cmp/paybills/commit.do',
				data: commitData,
				success: function(res) {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000004') });/* 国际化处理： 提交成功*/
						refresh(props);
					}
				}
			});
			break;
		//收回
		case 'uncommit':
			let unCheckdData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (unCheckdData.length == 0) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000036') });/* 国际化处理： 请选择要提交的数据*/
				return;
			}

			let unComDataArr = [];
			//处理选择数据
			unCheckdData.forEach((val) => {
				unComDataArr.push(val.data.values.pk_paybill.value);
			});
			let unComData = {
				pks: unComDataArr,
				pageid: '36070PBR_D5_list'
			};
			ajax({
				url: '/nccloud/cmp/paybills/uncommit.do',
				data: unComData,
				success: function(res) {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000005') });/* 国际化处理： 收回成功*/
						refresh(props);
					}
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
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000037') });/* 国际化处理： 红冲操作只支持单挑记录操作*/
				return;
			}
			let reverse_pk;
			reverseData.forEach((val) => {
				reverse_pk = val.data.values.pk_paybill.value;
			});
			let reqData = { pk: reverse_pk, pageid: this.pageId };
			ajax({
				url: '/nccloud/cmp/paybills/reverse.do',
				data: reqData,
				success: (res) => {
					console.log(res.data['table_D5'] + this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000038'));/* 国际化处理： 红冲数据*/
					if (res.data) {
						if (res.data['table_D5']) {
							props.linkTo(card_page_url, {
								status: 'browse',
								id: res.data[this.tableId].rows[1].values.pk_paybill.value,
								pagecode: res.data[this.tableId].rows[1].values.trade_type.value
							});
						}
					}
				}
			});
			break;

		//影像查看
		case 'BaseImageShow': //影响扫描
			break;
		//影像扫描
		case 'BaseImageScan': //影响扫描
			break;
		//关联结算Associate
		case 'Associate ': //打印
			break;
		//关联结算Associate
		case 'unassociate ': //打印
			break;

		//关联结算Associate
		case 'Associate':
			let appOption = {
				code: '360704SMP',
				name: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000039'),/* 国际化处理： 关联结算信息*/
				pk_appregister: '0001Z610000000042B19'
			};
			let query = {
				status: 'browse',
				src: 'paybills',
				callback: '/cmp/billmanagement/paybill/card/index.html'
			};
			window.parent.openNew(appOption, '', query);
			break;
		// 取消关联结算信息
		case 'unassociate': //
			let unAsData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (unAsData.length != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000040') });/* 国际化处理： 取消结算只支持单条记录操作*/
				return;
			}
			let unas_pk;
			unAsData.forEach((val) => {
				unas_pk = val.data.values.pk_paybill.value;
			});
			let req_unAs_Data = { pk: unas_pk, pageid: this.pageId };
			ajax({
				url: '/nccloud/cmp/paybills/canelassociate.do',
				data: req_unAs_Data,
				success: function(res) {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000041') });/* 国际化处理： 取消结算成功*/
						refresh(props);
					}
				}
			});
			break;

			break;
		case 'protopay':
			let protoPayData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (protoPayData.length != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000035') });/* 国际化处理： 请选择1条数据*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			let protopay_id = 0;
			protoPayData.forEach((val) => {
				protopay_id = val.data.values.pk_paybill.value;
			});
			props.linkTo(card_page_url, {
				status: 'edit',
				id: protopay_id,
				op: 'protopay'
			});
			break;
		case 'unprotopay':
			let unprotoPayData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (unprotoPayData.length != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000035') });/* 国际化处理： 请选择1条数据*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			let unprotopay_id = 0;
			unprotoPayData.forEach((val) => {
				unprotopay_id = val.data.values.pk_paybill.value;
			});
			props.linkTo(card_page_url, {
				status: 'edit',
				id: unprotopay_id,
				op: 'unprotopay'
			});
			break;

		case 'BillLQueryVoucher':
			let link_selectedData = props.table.getCheckedRows(this.tableId);
			if (link_selectedData.length != 1) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000035')/* 国际化处理： 请选择1条数据*/
				});
				return;
			}
			linkVoucherApp(
				props, 
				link_selectedData[0].data.values.pk_paybill.value,
				link_selectedData[0].data.values.pk_group.value,
				link_selectedData[0].data.values.pk_org.value,
				link_selectedData[0].data.values.trade_type.value,
				link_selectedData[0].data.values.bill_no.value
			)
			break;

		case 'printbtn': //打印
			let printData = props.table.getCheckedRows(this.tableId);
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
					billtype: 'D5', //单据类型
					funcode: '36070PBM', //功能节点编码，即模板编码
					nodekey: 'NCCLOUD', //模板节点标识
					printTemplateID: '0001A81000000004JYKW',
					oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
				}
			);
			break;
		case 'printlist': //打印
			let printListData = props.table.getCheckedRows(this.tableId);
			let pkls = [];
			printListData.forEach((item) => {
				pkls.push(item.data.values.pk_paybill.value);
			});
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				'/nccloud/cmp/paybills/paybillsprintlist.do',
				{
					billtype: 'D5', //单据类型
					funcode: '36070PBM', //功能节点编码，即模板编码
					nodekey: 'NCCLOUDLIST', //模板节点标识
					printTemplateID: '0001A81000000004JYGU', //模板id
					oids: pkls // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
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
			if (fileData.length == 1) {
				fileData.forEach((val) => {
					if (val.data.values.pk_paybill && val.data.values.pk_paybill.value != null) {
						pk_paybill = val.data.values.pk_paybill.value;
					}
					if (val.data.values.bill_no && val.data.values.bill_no.value != null) {
						bill_no = val.data.values.bill_no.value;
					}
				});
			}
			//
			this.setState({
				billId: pk_paybill, //单据pk
				billno: bill_no, //附件管理使用单据编号
				showUploader: !this.state.showUploader,
				target: null
			});
			break;
		//联查单据
		case 'linkquerybill':
			let queryData = props.table.getCheckedRows(this.tableId);
			if (queryData.length != 1) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000042')/* 国际化处理： 请选择单条数据，进行单据联查!*/
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
				  content:'到账通知不支持单据追溯' /* 国际化处理： 到账通知不支持单据追溯!*/
				});
				return;
			  };

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
		//协同单据联查
		case 'billlinkquery':
			let billlinkData = props.table.getCheckedRows(this.tableId);
			if (billlinkData.length == 0) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000043') });/* 国际化处理： 请选择要联查的数据*/
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
				name: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000008'),/* 国际化处理： 收款结算联查*/
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
            //刷新 
			case 'Refresh':
			let searchData = getDefData(PAYBILL_CONST.search_key, PAYBILL_CONST.paybillCacheKey);
				if (searchData && searchData.conditions) {
					refresh.call(this, props);
				}
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
				content:'请选择1条数据，查看审批意见!'
				// this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000082')/* 国际化处理： 请选择1条数据，查看审批意见!*/
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
	}
}
//删除

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
		toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000044') });/* 国际化处理： 未选中行！*/
		return false;
	}
	return true;
}
//删除
function beSureBtnClickDelete(props, data) {
	ajax({
		url: '/nccloud/cmp/billmanagement/delete.do',
		data: data,
		success: (res) => {
			let { data } = res.data;
			let errMsg = [];
		    let deleteIndex=[];
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
						props.table.deleteCacheId(PAYBILL_CONST.list_table_id, pk);
						//删除行
						deleteIndex.push(rowIndex);
						//props.table.deleteTableRowsByIndex(PAYBILL_CONST.list_table_id, rowIndex);
					} else if (state == 1) {
						//失败
						errMsg.push(msg);
						failIndexs=failIndexs+1;
					}
				}
 
				if(deleteIndex&&deleteIndex.length>0){
					props.table.deleteTableRowsByIndex(PAYBILL_CONST.list_table_id, deleteIndex);
				}
				let { status, msg } = res.data;

				BatchToast.call(this,'DELETE',status,total, successIndexs,failIndexs,errMsg,null);
			}
		}
	});
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/