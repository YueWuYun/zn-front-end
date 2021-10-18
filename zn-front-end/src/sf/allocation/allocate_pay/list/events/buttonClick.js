/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, toast, print, output, base,cardCache } from 'nc-lightapp-front';
import { BatchToast } from '../../../../pub/utils/allocatepayMsgUtil';
import { elecSignListPrint} from "../../../../../tmpub/pub/util/index";
import {
	printnodekey,
	card_from_id,
	PAYMODEL_COMBINEPAY,
	card_table_id,
	list_search_id,
	base_url,
	list_table_id,
	list_page_id,
	SHOWMODEL_LIULAN,
	SHOWMODEL_BULU,
	dataSource,
	funcode,card_page_id
} from '../../cons/constant.js';
import { go2Card, listMultiOperator, listSingleOperator } from '../../../../pub/utils/SFButtonUtil';
import { searchBtnClick } from './index.js';
let { NCMessage } = base;
import { linkApp, linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';




// ca签名
import Sign from '../../../../../tmpub/pub/util/ca/index.js';

async function buttonClick(props, key, text, record) {
	let selectDatass = props.table.getCheckedRows(list_table_id);
	let that = this;
	switch (key) {
		//联查 下拨核准
		case 'allocatecheck':
			doAllocateCheck.call(this, props);
			break;

		//联查 委托付款
		case 'commissionpay':
			doCommissionPay.call(this, props);
			break;

		// 联查 回单
		case 'receipt':
			doReceipt.call(this, props);
			break;

		// 联查 计划预算
		case 'planbudget':
			doPlanBudget.call(this, props);
			break;

		// 联查 凭证
		case 'voucher':
			doVoucher.call(this, props);
			break;

		//头部刷新
		case 'refresh':
			refreshHtml.call(that, props);
			break;

		//支付（校验）
		case 'pay':
			dopay.call(this,this.props);
			break;

		// 支付确认
		case 'payConfirm':
			if (!selectDatass || selectDatass.length < 1) {
				toast({
					color: 'warning',
					content:
						this.props.MutiInit.getIntl('36320FA_PAY') &&
						this.props.MutiInit.getIntl('36320FA_PAY').get('36320FA_PAY-000045')
				}); /* 国际化处理： 请选中一行数据！*/
				return;
			}

			//添加选中数据的映射集合
			let pkMapTs_payConfirm = {};
			let index_payConfirm = 0;
			let payConfirmpks = [];
			let isNetpay = false;
			let ismendinfofull_payBtnConfirms = [];

			while (index_payConfirm < selectDatass.length) {
				let pk_allocate_payConfirm =
					selectDatass[index_payConfirm] &&
					selectDatass[index_payConfirm].data &&
					selectDatass[index_payConfirm].data.values &&
					selectDatass[index_payConfirm].data.values['pk_allocate_h'] &&
					selectDatass[index_payConfirm].data.values['pk_allocate_h'].value;
				let ts_payConfirm =
					selectDatass[index_payConfirm] &&
					selectDatass[index_payConfirm].data &&
					selectDatass[index_payConfirm].data.values &&
					selectDatass[index_payConfirm].data.values['ts'] &&
					selectDatass[index_payConfirm].data.values['ts'].value;
				ismendinfofull_payBtnConfirms.push(
					selectDatass[index_payConfirm] &&
						selectDatass[index_payConfirm].data &&
						selectDatass[index_payConfirm].data.values &&
						selectDatass[index_payConfirm].data.values['ismendinfofull'] &&
						selectDatass[index_payConfirm].data.values['ismendinfofull'].value
				);

				if (pk_allocate_payConfirm && ts_payConfirm) {
					pkMapTs_payConfirm[pk_allocate_payConfirm] = ts_payConfirm;
					payConfirmpks.push(pk_allocate_payConfirm);
				}
				index_payConfirm++;
			}

			for (let index = 0; index < ismendinfofull_payBtnConfirms.length; index++) {
				const ismendinfofull_payBtnConfirm = ismendinfofull_payBtnConfirms[index];
				if (ismendinfofull_payBtnConfirm && ismendinfofull_payBtnConfirm.value) {
					isNetpay = true;
					return;
				}
			}

			let payConfirmresult = await Sign({
				isSign: true,
				isKey: false,
				data: null,
				encryptVOClassName: null,
				primaryId: payConfirmpks
			});
			if (payConfirmresult.isStop) {
				return;
			}

			let payConfirmData = {
				pkMapTs: pkMapTs_payConfirm,
				pageid: list_page_id,
				operator: 1,
				isCardOpt: false,
				sign_strSrc: payConfirmresult.data && payConfirmresult.data.text,
				signature: payConfirmresult.data && payConfirmresult.data.signText,
				sing_sn: payConfirmresult.data && payConfirmresult.data.userjson,
				pagecode : list_page_id,
				btncode : 'payConfirm'
			};
			ajax({
				url: '/nccloud/sf/allocation/allocatepay.do',
				data: payConfirmData,
				success: (res) => {
					let { data }=res;
					if (res.success) {
						let successIndexs = 0,
							failIndexs = 0;
						if (res.data.successpks) {
							successIndexs = res.data.successpks.length;
						}
						failIndexs = selectDatass.length - successIndexs;
						// 全部成功
						if (failIndexs == 0) {
							BatchToast('pay', 1, selectDatass.length, successIndexs, failIndexs, null, null, that);
						} else if (selectDatass.length == failIndexs) {
							// 全部失败
							BatchToast(
								'pay',
								0,
								selectDatass.length,
								successIndexs,
								failIndexs,
								data.errorMsg.split('\n'),
								null,
								that
							);
						} else if (failIndexs > 0) {
							// 部分成功
							BatchToast(
								'pay',
								2,
								selectDatass.length,
								successIndexs,
								failIndexs,
								data.errorMsg.split('\n'),
								null,
								that
							);
						}
						if (res.data.grid) {
							handleReturnData.call(that, selectDatass, res.data.grid);
						}
					}
				}
			});
			break;

		//取消支付
		case 'paycancel':
			//添加选中数据的映射集合
			let pkMapTs_paycancel = {};
			let index_paycancel = 0;
			while (index_paycancel < selectDatass.length) {
				let pk_allocate_paycancel =
					selectDatass[index_paycancel] &&
					selectDatass[index_paycancel].data &&
					selectDatass[index_paycancel].data.values &&
					selectDatass[index_paycancel].data.values['pk_allocate_h'] &&
					selectDatass[index_paycancel].data.values['pk_allocate_h'].value;
				let ts_paycancel =
					selectDatass[index_paycancel] &&
					selectDatass[index_paycancel].data &&
					selectDatass[index_paycancel].data.values &&
					selectDatass[index_paycancel].data.values['ts'] &&
					selectDatass[index_paycancel].data.values['ts'].value;

				if (pk_allocate_paycancel && ts_paycancel) {
					pkMapTs_paycancel[pk_allocate_paycancel] = ts_paycancel;
				}
				index_paycancel++;
			}

			ajax({
				url: '/nccloud/sf/allocation/allocateunpay.do',
				data: {
					pkMapTs: pkMapTs_paycancel,
					pageid: list_page_id,
					isCardOpt: false,
					pagecode : list_page_id,
					btncode : 'paycancel'
				},
				success: (res) => {
					let { success, data } = res;
					if (success) {
						let successIndexs = 0,
							failIndexs = 0;
						if (res.data.successpks) {
							successIndexs = res.data.successpks.length;
						}
						failIndexs = selectDatass.length - successIndexs;
						// 全部成功
						if (failIndexs == 0) {
							BatchToast('unpay', 1, selectDatass.length, successIndexs, failIndexs, null, null, this);
						} else if (selectDatass.length == failIndexs) {
							// 全部失败
							BatchToast(
								'unpay',
								0,
								selectDatass.length,
								successIndexs,
								failIndexs,
								data.errorMsg.split('\n'),
								null,
								this
							);
						} else if (failIndexs > 0) {
							// 部分成功
							BatchToast(
								'unpay',
								2,
								selectDatass.length,
								successIndexs,
								failIndexs,
								data.errorMsg.split('\n'),
								null,
								this
							);
						}						
						if (res.data.grid) {
							handleReturnData.call(this, selectDatass, res.data.grid);
						}
					}
				}
			});
			break;

		//附件管理
		case 'field':
			if (selectDatass.length > 1) {
				toast({
					color: 'info',
					content:
						this.props.MutiInit.getIntl('36320FA_PAY') &&
						this.props.MutiInit.getIntl('36320FA_PAY').get('36320FA_PAY-000046')
				}); /* 国际化处理： 仅可选择一条数据上传附件，此处默认上传附件至您选择的第一条数据!*/
				return;
			}
			if (selectDatass.length == 0) {
				toast({
					color: 'info',
					content:
						this.props.MutiInit.getIntl('36320FA_PAY') &&
						this.props.MutiInit.getIntl('36320FA_PAY').get('36320FA_PAY-000047')
				}); /* 国际化处理： 请您选择一条数据*/
				return;
			}
			let vbillno = selectDatass[0].data.values.vbillno.value;
			let pk_allocate_h = selectDatass[0].data.values.pk_allocate_h.value;

			this.setState({
				showUploader: !this.state.showUploader,
				target: null,
				billId: pk_allocate_h,
				billno: vbillno
			});
			break;

		//打印
		case 'Print':
			let printData = props.table.getCheckedRows(this.tableId);
			let printpks = [];
			printData.forEach((item) => {
				printpks.push(item.data.values.pk_allocate_h.value);
			});
			print(
				//支持两类: 'html'为模板打印, 'pdf'为pdf打印
				'pdf',
				'/nccloud/sf/allocation/allocateprint.do',
				{
					oids: printpks
				}
			);
			break;

		// 输出
		case 'export':
			let outputData = props.table.getCheckedRows(list_table_id);
			//判断是否有选中行
			if (outputData == null || outputData.length == 0) {
				// toast({ color: 'warning', content: '请选中一行数据！' });
				NCMessage.create({
					content:
						this.props.MutiInit.getIntl('36320FDAPay') &&
						this.props.MutiInit.getIntl('36320FDAPay').get('36320FDAPay--000067'),
					color: 'warning',
					position: 'top'
				}); /* 国际化处理： 请选择一条数据操作！*/
				return;
			}

			let outputpks = [];
			outputData.forEach((item) => {
				outputpks.push(item.data.values.pk_allocate_h.value);
			});
			output({
				url: '/nccloud/sf/allocation/allocateprint.do',
				data: {
					oids: outputpks,
					outputType: 'output'
				}
			});
			break;
		//正式打印
        case 'elecsignformalPrint':
            elecSignListPrint(props, {
                url: base_url+'elecsignprint.do',
                offical:true,               //是否正式打印
                appCode: funcode,           
                nodeKey: 'OFFICAL',         //正式打印
                tableCode: list_table_id,   //列表id
                field_id: 'pk_allocate_h',
                field_billno: 'vbillno',
                validateFunc: (selectData) => {
                    let billstatus = selectData && selectData.data && selectData.data.values && selectData.data.values['billstatus'] && selectData.data.values['billstatus'].value;
                    if ('5' != billstatus) {
                        return this.props.MutiInit.getIntl('36320FA_PAY') &&
						this.props.MutiInit.getIntl('36320FA_PAY').get('36320FA_PAY-000088');
                    }
                    return null;
                }
            })
        break;
        //补充打印
        case 'elecsigninformalPrint':
            elecSignListPrint(props, {
                url: base_url+'elecsignprint.do',
                offical:false,               //是否正式打印
                appCode: funcode,           
                nodeKey: 'INOFFICAL',         //正式打印
                tableCode: list_table_id,   //列表id
                field_id: 'pk_allocate_h',
                field_billno: 'vbillno',
                validateFunc: (selectData) => {
                    let billstatus = selectData && selectData.data && selectData.data.values && selectData.data.values['billstatus'] && selectData.data.values['billstatus'].value;
                    if ('5' != billstatus) {
                        return this.props.MutiInit.getIntl('36320FA_PAY') &&
						this.props.MutiInit.getIntl('36320FA_PAY').get('36320FA_PAY-000088');
                    }
                    return null;
                }
            })
        break;

		default:
			break;
	}
}

/**
 * 支付（校验后）
 * @param {*} props 
 * @param {*} isNetpay 
 */
async function dopay(props) {
	let that = this;
	let selectDatass = props.table.getCheckedRows(list_table_id);
	if (!selectDatass || selectDatass.length < 1) {
		toast({
			color: 'warning',
			content:
				this.props.MutiInit.getIntl('36320FA_PAY') &&
				this.props.MutiInit.getIntl('36320FA_PAY').get('36320FA_PAY-000045')
		}); /* 国际化处理： 请选中一行数据！*/
		return;
	}
	//添加选中数据的映射集合
	let pks = [];
	let ismendinfofull_pays = [];
	let pkMapTs_dopay = {};
	let index_dopay = 0;
	let isNetpay = false;

	while (index_dopay < selectDatass.length) {
		let pk_allocate_dopay =
			selectDatass[index_dopay] &&
			selectDatass[index_dopay].data &&
			selectDatass[index_dopay].data.values &&
			selectDatass[index_dopay].data.values['pk_allocate_h'] &&
			selectDatass[index_dopay].data.values['pk_allocate_h'].value;
		pks.push(
			selectDatass[index_dopay] &&
				selectDatass[index_dopay].data &&
				selectDatass[index_dopay].data.values &&
				selectDatass[index_dopay].data.values['pk_allocate_h'] &&
				selectDatass[index_dopay].data.values['pk_allocate_h'].value
		);
		let ts_dopay =
			selectDatass[index_dopay] &&
			selectDatass[index_dopay].data &&
			selectDatass[index_dopay].data.values &&
			selectDatass[index_dopay].data.values['ts'] &&
			selectDatass[index_dopay].data.values['ts'].value;
		ismendinfofull_pays.push(
			selectDatass[index_dopay] &&
				selectDatass[index_dopay].data &&
				selectDatass[index_dopay].data.values &&
				selectDatass[index_dopay].data.values['ismendinfofull'] &&
				selectDatass[index_dopay].data.values['ismendinfofull'].value
		);

		if (pk_allocate_dopay && ts_dopay) {
			pkMapTs_dopay[pk_allocate_dopay] = ts_dopay;
		}
		index_dopay++;
	}

	for (let index = 0; index < ismendinfofull_pays.length; index++) {
		if (ismendinfofull_pays[index]) {
			isNetpay = true;
			break;
		}
	}

	let needCa = cardCache.getDefData('ismendinfofull', dataSource);
    if(needCa){
        isNetpay = true
    }

	let dopayresult = await Sign({
		isSign: true,
		isKey: isNetpay,
		data: null,
		encryptVOClassName: null,
		primaryId: pks
	});
	if (dopayresult.isStop) {
		return;
	}

	let data_dopay = {
		pkMapTs: pkMapTs_dopay,
		pageid: list_page_id,
		isCardOpt: false,
		sign_strSrc: dopayresult.data.text,
		signature: dopayresult.data.signText,
		sing_sn: dopayresult.data.userjson,
		pagecode : list_page_id,
        btncode : 'pay'
	};

	ajax({
		url: '/nccloud/sf/allocation/allocatepay.do',
		data: data_dopay,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data.interactMsg) {
					props.modal.show('payModel', {
						title:
							this.props.MutiInit.getIntl('36320FA_PAY') &&
							this.props.MutiInit.getIntl('36320FA_PAY').get('36320FA_PAY-000018') /* 国际化处理： 支付*/,
						content: data.interactMsg,
						//点击确定按钮事件
						beSureBtnClick: buttonClick.bind(this, props, 'payConfirm')
					});
				} else {
					let successIndexs = 0,
						failIndexs = 0;
					if (res.data.successpks) {
						successIndexs = res.data.successpks.length;
					}
					failIndexs = selectDatass.length - successIndexs;
					// 全部成功
					if (failIndexs == 0) {
						BatchToast('pay', 1, selectDatass.length, successIndexs, failIndexs, null, null, that);
					} else if (selectDatass.length == failIndexs) {
						// 全部失败
						BatchToast(
							'pay',
							0,
							selectDatass.length,
							successIndexs,
							failIndexs,
							data.errorMsg.split('\n'),
							null,
							that
						);
					} else if (failIndexs > 0) {
						// 部分成功
						BatchToast(
							'pay',
							2,
							selectDatass.length,
							successIndexs,
							failIndexs,
							data.errorMsg.split('\n'),
							null,
							that
						);
					}
					if (res.data.grid) {
						handleReturnData.call(that, selectDatass, res.data.grid);
					}
				}
			}
		}
	});
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(selectedData, data) {
	let returnData = data[list_table_id].rows;
	//处理选择数据
	selectedData.forEach((val) => {
		let pk_allocate_h_check = val.data.values.pk_allocate_h.value;
		returnData.forEach((retrunval) => {
			if (pk_allocate_h_check === retrunval.values.pk_allocate_h.value) {
				let updateDataArr = [
					{
						index: val.index,
						data: { values: retrunval.values }
					}
				];
				this.props.table.updateDataByIndexs(list_table_id, updateDataArr);
			}
		});
	});
}

//刷新列表信息
function refreshHtml(props) {
	//获取查询条件
	// let refreshsearchVal = this.props.search.getAllSearchData(list_search_id);
	let selectedGroup = cardCache.getDefData('selectedGroup', dataSource);
	if(selectedGroup){
		searchBtnClick.call(this, props, null,selectedGroup);
	}else{
		searchBtnClick.call(this, props, null,0);
	}
	
}

/**
 * 联查 计划预算
 * @param {*} props 
 */
function doPlanBudget(props) {
	let linkntbplanData = props.table.getCheckedRows(this.tableId);
	//数据校验
	if (linkntbplanData.length != 1) {
		toast({ color: 'warning', content: '请选择一条数据操作' }); /* 国际化处理： 请选择一条数据操作！*/
		return;
	}
	let linkntbplanArr;
	//处理选择数据
	linkntbplanData.forEach((val) => {
		if (val.data.values.pk_allocate_h && val.data.values.pk_allocate_h.value) {
			let pk = val.data.values.pk_allocate_h.value;
			//主键
			linkntbplanArr = pk;
		}
	});
	let queryntbplanData = {
		pk: linkntbplanArr,
		pageid: list_page_id
	};
	// let row = props.table.getCheckedRows(list_table_id);
	// let pk=row[0].values.pk_allocate_h;
	ajax({
		url: '/nccloud/sf/allocation/allocatelinkplan.do',
		data: queryntbplanData,
		success: (res) => {
			if (res.success) {
				if (res.data && res.data.hint) {
					toast({ color: 'warning', content: res.data.hint });
					return;
				} else {
					this.setState({
						ntbdata: res.data,
						showNtbDetail: true
					});
				}
			}
		}
	});
	// let planbudgetRow = props.table.getCheckedRows(list_table_id)
	// if(planbudgetRow && planbudgetRow.length != 1){
	//     toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000045') });/* 国际化处理： 请选中一行数据！*/
	//     return
	// }

	// let pk = planbudgetRow[0] && planbudgetRow[0].data && planbudgetRow[0].data.values && planbudgetRow[0].data.values['pk_allocate_h'] && planbudgetRow[0].data.values['pk_allocate_h'].value;
	// ajax({
	//   url: "/nccloud/sf/allocation/allocatelinkplan.do",
	//   data: {
	//     pk,
	//     pageid:list_page_id
	//    },
	//   success: (res) => {
	//     let { data } = res.data;
	//     this.setState({
	//       showNtbDetail: true,
	//       ntbdata: data
	//     })
	//   }
	// });
}

/**
 * 联查 回单
 * @param {*} props 
 */
function doReceipt(props) {
	let receiptData = props.table.getCheckedRows(list_table_id);
	//数据校验
	if (receiptData.length != 1) {
		toast({ color: 'warning', content: '请选择一条数据操作！' }); /* 国际化处理： 请选择一条数据操作！*/
		return;
	}
	if (
		receiptData[0].data.values.billstatus &&
		receiptData[0].data.values.billstatus.value &&
		receiptData[0].data.values.billstatus.value != 5
	) {
		toast({ color: 'warning', content: '请选择上收成功的单据进行操作!' }); /* 国际化处理： 请选择上收成功的单据进行操作!*/
		return;
	}
	let receiptArr = [];
	//处理选择数据
	receiptData.forEach((val) => {
		// 转账成功
		if (val.data.values.billstatus && val.data.values.billstatus.value && val.data.values.billstatus.value == 5) {
			if (val.data.values.pk_allocate_h && val.data.values.pk_allocate_h.value) {
				let pk = val.data.values.pk_allocate_h.value;
				//主键
				receiptArr.push(pk);
			}
		}
	});
	let receiptExtParam = {
		status: 'browse',
		srcbillid: receiptArr,
		linkquerytype: 'LinkQuery_SrcBill_H'
	};
	linkApp(props, '36K8', receiptExtParam);
}

/**
 * 联查 下拨核准
 * @param {*} props 
 */
function doAllocateCheck(props) {
		let row = props.table.getCheckedRows(list_table_id);
		if (row && row.length != 1) {
			toast({ color: 'warning', content: loadMultiLang(this.props, '36320FA-000078') });/* 国际化处理： 请选中一行数据！*/
			return
		}
		let pk = row[0].data.values.pk_allocate_h.value;
		let srcbusitype = row[0].data.values.srcbusitype;
		ajax({
			url: "/nccloud/sf/allocation/querycard.do",
			data: {pk:pk,pageid: card_page_id,pageCode:card_page_id ,status:'browse'},
			success: (res) => {
				if (res.success) {
					if(res.data.body) {
						let pk_srcbillhead=[];
						for(let i=0;i<res.data.body[card_table_id].rows.length;i++) {
							pk_srcbillhead[i]=res.data.body[card_table_id].rows[i].values.pk_srcbillhead.value;
						}
						
						let urlExtParam = {
							status: 'browse',
							srcbillid: pk_srcbillhead,
							linkquerytype: '1',
						};
						if (srcbusitype && srcbusitype.value && srcbusitype.value == 6) {
							linkApp(props, "36K7", urlExtParam);
						} else {
							toast({ color: 'warning', content: this.props.MutiInit.getIntl('36320FA_PAY').get('36320FA_PAY-000016') });/* 国际化处理： 该单据来源非下拨申请！*/
							return;
						}
					}
				}
			}
		});
}

/**
 * 联查 委托付款
 * @param {*} props 
 */
function doCommissionPay(props) {
	let commissionpayRow = props.table.getCheckedRows(list_table_id);
	if (commissionpayRow && commissionpayRow.length != 1) {
		toast({
			color: 'warning',
			content:
				this.props.MutiInit.getIntl('36320FA_PAY') &&
				this.props.MutiInit.getIntl('36320FA_PAY').get('36320FA_PAY-000045')
		}); /* 国际化处理： 请选中一行数据！*/
		return;
	}

	let entrustpay_pk_srcbill =
		commissionpayRow[0] &&
		commissionpayRow[0].data &&
		commissionpayRow[0].data.values &&
		commissionpayRow[0].data.values['pk_srcbill'] &&
		commissionpayRow[0].data.values['pk_srcbill'].value;
	let entrustpay_srcbusitype =
		commissionpayRow[0] &&
		commissionpayRow[0].data &&
		commissionpayRow[0].data.values &&
		commissionpayRow[0].data.values['srcbusitype'] &&
		commissionpayRow[0].data.values['srcbusitype'].value;
	if (entrustpay_srcbusitype && entrustpay_srcbusitype != 3) {
		toast({
			color: 'warning',
			content:
				this.props.MutiInit.getIntl('36320FA_PAY') &&
				this.props.MutiInit.getIntl('36320FA_PAY').get('36320FA_PAY-000012')
		}); /* 国际化处理： 单据不是回拨生成的，无法联查委托付款书*/
		return;
	}

	//数据校验
	if (!entrustpay_pk_srcbill) {
		toast({
			color: 'warning',
			content:
				this.props.MutiInit.getIntl('36320FA_PAY') &&
				this.props.MutiInit.getIntl('36320FA_PAY').get('36320FA_PAY-000013')
		}); /* 国际化处理： 该单据无来源单据*/
		return;
	}
	let entrustpaywfExtParam = {
		status: 'browse',
		id: entrustpay_pk_srcbill
	};
	linkApp(props, '36J1', entrustpaywfExtParam);
}

/**
 * 联查 凭证
 * @param {*} props 
 */
function doVoucher(props) {
	let voucherRow = props.table.getCheckedRows(list_table_id);
	if (voucherRow && voucherRow.length != 1) {
		toast({
			color: 'warning',
			content:
				this.props.MutiInit.getIntl('36320FA_PAY') &&
				this.props.MutiInit.getIntl('36320FA_PAY').get('36320FA_PAY-000045')
		}); /* 国际化处理： 请选中一行数据！*/
		return;
	}

	let pk_voucher =
		voucherRow[0] &&
		voucherRow[0].data &&
		voucherRow[0].data.values &&
		voucherRow[0].data.values['pk_allocate_h'] &&
		voucherRow[0].data.values['pk_allocate_h'].value;
	let pk_group = voucherRow[0].data.values['pk_group'].value;
	let pk_org = voucherRow[0].data.values['pk_org'].value;
	let billno = voucherRow[0].data.values['vbillno'].value;
	let pk_billtype = voucherRow[0].data.values['pk_billtype'].value;
	linkVoucherApp(props, pk_voucher,pk_group,pk_org, pk_billtype,billno);
	
}

export default buttonClick;

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/