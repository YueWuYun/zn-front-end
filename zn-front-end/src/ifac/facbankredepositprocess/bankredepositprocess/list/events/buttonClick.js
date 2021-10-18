/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, base, toast, cacheTools, high, print, promptBox } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { listMultiOperator, listSingleOperator } from '../../../../pub/utils/IFACButtonUtil';

export default function buttonClick(props, id) {
	const linksrc = constant.linksrc;
	const billtype = constant.billtype;
	const printfuncode = constant.printfuncode;
	const printnodekey = constant.printnodekey;
	const printtemplateid = constant.printtemplateid;
	const appcode = constant.appcode;
	let that = this;

	const searchdata = function (props) {
		let selectdata = props.table.getCheckedRows(constant.ltablecode);
		//数据校验
		if (selectdata.length == 0) {
			toast({
				color: 'warning',
				content: this.state.json['36140ERD-000027'] /* 国际化处理： 请选择数据*/
			});
			return;
		}
		return selectdata;
	};

	switch (id) {

		case 'reDepositProcess':// 到期转存
			processHeadConfirm.call(this, props);
			break;

		case 'unReDepositProcess':// 取消转存
			unProcessHeadConfirm.call(this, props);
			break;

		case 'linkregularrateBtn':// 联查定期利率
			let ratedata = searchdata.call(this, props);
			// if (ratedata.length > 1) {
			// 	toast({
			// 		color: 'warning',
			// 		content: this.state.json['36140ERD-000028'] /* 国际化处理： 只能选择一条数据!*/
			// 	});
			// 	return;
			// }
			let pk_depostrate = ratedata[0].data.values.pk_depostrate.value;
			if (pk_depostrate == null || pk_depostrate.length <= 0) {
				toast({
					color: 'warning',
					content: this.state.json['36362IDC-000047'] /* 国际化处理： 未查询出符合条件的数据！*/
				});
				return;
			}
			ajax({
				url: requesturl.linkrate,
				data: {
					pk: pk_depostrate
				},
				success: (res) => {
					let linkpath, appcode, pagecode;
					if (res.data.rateclass == '2') {
						linkpath = '/tmpub/pub/interestrate_global/main/#/card',
							appcode = '36010IRC',
							pagecode = '36010IRC_card'
					} else if (res.data.rateclass == '1') {
						linkpath = '/tmpub/pub/interestrate_group/main/#/card',
							appcode = '36010IRCG',
							pagecode = '36010IRCG_card'
					} else if (res.data.rateclass == '0') {
						linkpath = '/tmpub/pub/interestrate_org/main/#/card',
							appcode = '36010IRCO',
							pagecode = '36010IRCO_card'
					}
					props.openTo(linkpath, {
						appcode: appcode,
						pagecode: pagecode,
						status: 'browse',
						scene: "linksce",
						islinkquery: true,
						id: pk_depostrate
					});
				}
			});
			break;

		case 'linkDepositBillBtn':// 联查银行定期存单
			let selectedReceiptData = searchdata.call(this, props);
			// if (selectedReceiptData.length > 1) {
			// 	toast({
			// 		color: 'warning',
			// 		content: this.state.json['36140ERD-000028'] /* 国际化处理： 只能选择一条数据!*/
			// 	});
			// 	return;
			// }
			let depositcode = selectedReceiptData[0].data.values.pk_depositreceipt.value;
			if (!depositcode) {
				toast({
					color: 'warning',
					content: this.state.json['36140ERD-000047']//{/* 国际化处理： 未查询出符合条件的数据！*/}
				});
			} else {
				this.props.openTo('/ifac/factimedepositmanage/depositreceipt/main/index.html#/card',
					{
						srcFunCode: '36140ERD',
						appcode: '36140FDLB',
						pagecode: '36140FDLB_C01',
						status: 'browse',
						islinkquery: true,
						id: depositcode,
						scene: "linksce"
					});
			}
			break;

		case 'linkReDepositBillBtn':// 联查银行定期转存单
			let selectedDataReDeposit = searchdata.call(this, props);
			// if (selectedDataReDeposit.length > 1) {
			// 	toast({
			// 		color: 'warning',
			// 		content: this.state.json['36140ERD-000028'] /* 国际化处理： 只能选择一条数据!*/
			// 	});
			// 	return;
			// }
			let pk_depositreceipt = selectedDataReDeposit[0].data.values.pk_depositreceipt.value;
			linkReDepositBill.call(this, props, pk_depositreceipt);
			break;

		case 'linkInterestBillBtn':// 联查银行定期利息清单
			let selectedInterestData = searchdata.call(this, props);
			// if (selectedInterestData.length > 1) {
			// 	toast({
			// 		color: 'warning',
			// 		content: this.state.json['36140ERD-000028'] /* 国际化处理： 只能选择一条数据!*/
			// 	});
			// 	return;
			// }
			let interestpk = selectedInterestData[0].data.values.pk_depositreceipt.value;// 存单主键
			ajax({
				url: requesturl.checklist,
				data: {
					"pks": [interestpk]
				},
				success: (res) => {
					let linkpath;
					if (res.data == '0') {
						toast({
							color: 'warning',
							content: this.state.json['36140ERD-000066']/**暂无数据 */
						});
					} else if (res.data == '1') {
						linkpath = '/ifac/facbankinterestdeal/bankcenterinterestbill/main/#/card'
						props.openTo(linkpath, {
							appcode: '36140FDIB',
							pagecode: '36140FDIB_C01',
							islinkquery: true,
							pks: interestpk,
							type: 'intercard',
							scene: "linksce"
						});
					} else {
						linkpath = '/ifac/facbankinterestdeal/bankcenterinterestbill/main/#/list'
						props.openTo(linkpath, {
							appcode: '36140FDIB',
							pagecode: '36140FDIB_L01',
							islinkquery: true,
							pks: interestpk,
							type: 'interlist',
							scene: "linksce"
						});
					}
				}
			})


			break;

		// case 'printBtn':// 打印
		// 	let printData = searchdata.call(this, props);
		// 	let pks = [];
		// 	printData.forEach((item) => {
		// 		pks.push(item.data.values.pk_depositreceipt.value);
		// 	});
		// 	print(
		// 		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		// 		requesturl.listprint, {
		// 			// billtype: constant.billtype, //单据类型
		// 			// funcode: constant.printfuncode, //功能节点编码，即模板编码
		// 			appcode: appcode, //appcode
		// 			// nodekey: constant.printnodekey, //模板节点标识
		// 			nodekey: 'LIST', // 后台自动判断是否为列表打印
		// 			// printTemplateID: constant.printtemplateid, //模板id
		// 			oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
		// 		}
		// 	);
		// 	break;

		case 'printlist':// 打印清单
			let printListData = searchdata.call(this, props);
			let listPks = [];
			printListData.forEach((item) => {
				listPks.push(item.data.values.pk_depositreceipt.value);
			});
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					// billtype: constant.billtype, //单据类型
					// funcode: constant.printfuncode, //功能节点编码，即模板编码
					appcode: appcode, //appcode
					// nodekey: constant.printnodekey, //模板节点标识
					nodekey: 'LIST', //模板节点标识
					// printTemplateID: constant.printtemplateid, //模板id
					oids: listPks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
				}
			);
			break;

		case 'refreshBtn'://刷新
			this.refreshHtml(props);
			break;

		default:
			break;
	}
}

/**
 * 联查银行定期转存单
 * @param {*} props 
 * @param {*} pk_depositreceipt 
 */
export const linkReDepositBill = function (props, pk_depositreceipt) {
	ajax({
		url: requesturl.queryPksByReceiptPk,
		data: pk_depositreceipt,
		success: (res) => {
			if (res.data) {
				if (res.data.length == 0) {
					toast({
						color: 'warning',
						content: this.state.json['36140ERD-000047'] /* 国际化处理： 未查询出符合条件的数据！*/
					});
				} else if (res.data.length == 1) {
					props.openTo('/ifac/facbankfixredeposit/bankfixredeposit/main/index.html#/card',
					{
						srcFunCode: '36140ERD',
						appcode: '36140RFD',
						pagecode: '36140RFD_C01',
						status: 'browse',
						id: res.data[0],
						scene: "linksce"
					});
				} else if (res.data.length > 1) {
					let pks = [];
					res.data.forEach((val) => {
						pks.push(val);
					});
					props.openTo('/ifac/facbankfixredeposit/bankfixredeposit/main/index.html#/list',
					{
						srcFunCode: '36140ERD',
						appcode: '36140RFD',
						pagecode: '36140RFD_L01',
						status: 'browse',
						id: pks,
						scene: "linksce"
					});
				}
			} else {
				toast({
					color: 'warning',
					content: this.state.json['36140ERD-000047'] /* 国际化处理： 未查询出符合条件的数据！*/
				});
			}
		}
	});
};

/**
 * 到期转存
 * @param {*} props 
 */
export const processHeadConfirm = function (props) {
	listMultiOperator(props, constant.lpagecode, constant.ltablecode, constant.pkname, requesturl.process, this.state.json['36140ERD-000064'], constant.cacheDataSource);/* 国际化处理：转存成功*/
};

/**
 * 取消转存
 * @param {*} props 
 */
export const unProcessHeadConfirm = function (props) {
	listMultiOperator(props, constant.lpagecode, constant.ltablecode, constant.pkname, requesturl.unprocess, this.state.json['36140ERD-000065'], constant.cacheDataSource);/* 国际化处理： 取消转存成功*/
};
/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/