/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, base, toast,	cacheTools, high, print, promptBox } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; //凭证
import { elecSignListPrint } from "../../../../../tmpub/pub/util";
import { listMultiOperator, listSingleOperator } from '../../../../pub/utils/IFACButtonUtil';
const { NCMessage } = base;
const { NCUploader } = high;

export default function buttonClick(props, id) {
	const linksrc = constant.linksrc;
	const billtype = constant.billtype;
	const printfuncode = constant.printfuncode;
	const printnodekey = constant.printnodekey;
	const printtemplateid = constant.printtemplateid;
	const appcode = constant.appcode;
	let that = this;

	const searchdata = function(props) {
		let selectdata = props.table.getCheckedRows(constant.ltablecode);
		//数据校验
		if (selectdata.length == 0) {
			toast({
				color: 'warning',
				content: this.state.json['36140RFD-000027'] /* 国际化处理： 请选择数据*/
			});
			return;
		}
		return selectdata;
	};

	switch (id) {
		case 'tally':// 记账
			tallyHeadConfirm.call(this, props);
			break;
		
		case 'unTally':// 取消记账
			unTallyHeadConfirm.call(this, props);
			break;

		case 'linkregularrateBtn':// 联查定期利率
			let ratedata = searchdata.call(this, props);
			// if (ratedata.length != 1) {
			// 	toast({
			// 		color: 'warning',
			// 		content: this.state.json['36140RFD-000028'] /* 国际化处理： 只能选择一条数据!*/
			// 	});
			// 	return;
			// }
			let pk_depostrate = ratedata[0].data.values.pk_depostrate.value;
			if(pk_depostrate == null || pk_depostrate.length <= 0){
				toast({
					color: 'warning',
					content: this.state.json['36140RFD-000047'] /* 国际化处理： 未查询出符合条件的数据！*/
				});
				return;
			}
			ajax({
				url: requesturl.linkrate, 
				data: {
					pk: pk_depostrate
				},
				success: (res) => {
					let linkpath,appcode,pagecode;
					if(res.data.rateclass=='2'){
						linkpath = '/tmpub/pub/interestrate_global/main/#/card',
						appcode = '36010IRC',
						pagecode = '36010IRC_card'
					}else if(res.data.rateclass=='1'){
						linkpath = '/tmpub/pub/interestrate_group/main/#/card',
						appcode = '36010IRCG',
						pagecode = '36010IRCG_card'
					}else if(res.data.rateclass=='0'){
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
						id:pk_depostrate
					});
				}
			});
			break;

		case 'linkreceiptBtn':// 联查存单
			let selectedReceiptData = searchdata.call(this, props);
			// if (selectedReceiptData.length != 1) {
			// 	toast({
			// 		color: 'warning',
			// 		content: this.state.json['36140RFD-000028'] /* 国际化处理： 只能选择一条数据!*/
			// 	});
			// 	return;
			// }
			let depositcode = selectedReceiptData[0].data.values.depositcode.value;
			if(!depositcode){
				toast({
					color: 'warning',
					content: this.state.json['36140RFD-000047']//{/* 国际化处理： 未查询出符合条件的数据！*/}
				});
			} else {
				this.props.openTo('/ifac/factimedepositmanage/depositreceipt/main/index.html#/card', 
				{
					srcFunCode:'36140RFD',
					appcode: '36140FDLB',
					pagecode: '36140FDLB_C01',
					status: 'browse',
					islinkquery: true,
					id:depositcode,
					scene: "linksce"
				});
			}
			break;

		case 'linkvoucherBtn':// 联查凭证
			let voucherData = searchdata.call(this, props);
			// if (voucherData.length != 1) {
			// 	toast({
			// 		color: 'warning',
			// 		content: this.state.json['36140RFD-000028'] /* 国际化处理： 只能选择一条数据!*/
			// 	});
			// 	return;
			// }
			let pk_fixredeposit,billnov,pk_groupv,pk_orgv
			//处理选择数据
			// voucherData.forEach((val) => {
			// 	pk_fixredeposit = val.data.values.pk_fixredeposit.value;
			// 	billnov = val.data.values.vbillcode.value;
			// 	pk_groupv = val.data.values.pk_group.value;
			// 	pk_orgv = val.data.values.pk_org.value;
			// });
			pk_fixredeposit = voucherData[0].data.values.pk_fixredeposit.value;
			billnov = voucherData[0].data.values.vbillcode.value;
			pk_groupv = voucherData[0].data.values.pk_group.value;
			pk_orgv = voucherData[0].data.values.pk_org.value;
			linkVoucherApp(
				this.props,
				pk_fixredeposit,
				pk_groupv,
				pk_orgv,
				billtype,
				billnov,
			);
			break;

		case 'printBtn':// 打印
			let printData = searchdata.call(this, props);
			let pks = [];
			printData.forEach((item) => {
				pks.push(item.data.values.pk_fixredeposit.value);
			});
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					// billtype: constant.billtype, //单据类型
					// funcode: constant.printfuncode, //功能节点编码，即模板编码
					appcode: appcode, //appcode
					// nodekey: constant.printnodekey, //模板节点标识
					nodekey: null, //模板节点标识
					// printTemplateID: constant.printtemplateid, //模板id
					oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
				}
			);
			break;

		case 'outputBtn':// 输出
			let outputData = searchdata.call(this, props);
			let opks = [];
			outputData.forEach((item) => {
				opks.push(item.data.values.pk_fixredeposit.value);
			});
			this.setState({
					outputData: {
						// funcode: printfuncode, //功能节点编码，即模板编码
						// nodekey: printnodekey, //模板节点标识
						appcode: appcode, //appcode
						nodekey: null, //模板节点标识
						// printTemplateID: printtemplateid, //模板id
						oids: opks,
						outputType: 'output'
					} //打印输出使
				},
				() => {
					this.refs.printOutput.open();
				}
			);
			break;

		case 'printlist':// 打印清单
			let printListData = searchdata.call(this, props);
			let listPks = [];
			printListData.forEach((item) => {
				listPks.push(item.data.values.pk_fixredeposit.value);
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
 * 记账
 * @param {*} props 
 */
const tallyHeadConfirm = function (props) {
    listMultiOperator(props, constant.lpagecode, constant.ltablecode, constant.pkname, requesturl.tally, this.state.json['36140RFD-000064'], constant.cacheDataSource, null, { btncode: 'tally', pagecode: constant.lpagecode });/* 国际化处理：记账成功*/
};

/**
 * 取消记账
 * @param {*} props 
 */
const unTallyHeadConfirm = function (props) {
	listMultiOperator(props, constant.lpagecode, constant.ltablecode, constant.pkname, requesturl.untally, this.state.json['36140RFD-000065'], constant.cacheDataSource, null, { btncode: 'unTally', pagecode: constant.lpagecode });/* 国际化处理： 取消记账成功*/
};
/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/