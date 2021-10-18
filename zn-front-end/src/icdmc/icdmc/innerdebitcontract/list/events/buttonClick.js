/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { ajax, base, toast,	cacheTools, high, print, promptBox } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';

// 内部借款合同-列表-按钮
export default function buttonClick(props, id) {
	const billtype = constant.billtype;
	const printfuncode = constant.printfuncode;
	const printnodekey = constant.printnodekey;
	const printtemplateid = constant.printtemplateid;
	const appcode = constant.appcode;

	switch (id) {
		case 'linkrateBtn':// 联查-利率
			let ratedata = getSelectedData.call(this, props);
			let pk_rateCode = ratedata[0].data.values.rateid.value;
			if(pk_rateCode == null || pk_rateCode.length <= 0){
				toast({
					color: 'warning',
					content: this.state.json['36362IDC-000047'] /* 国际化处理： 未查询出符合条件的数据！*/
				});
				return;
			}
			ajax({
				url: requesturl.linkrate, 
				data: {
					pk: pk_rateCode
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
						islinkquery: true,
						id:pk_rateCode
					});
				}
			});
			break;

		case 'linksettledateBtn':// 联查-结息日
			let settledata = getSelectedData.call(this, props);
			let iadate = settledata[0].data.values.iadate.value;
			if(iadate == null || iadate.length <= 0){
				toast({
					color: 'warning',
					content: this.state.json['36362IDC-000052'] /* 国际化处理： 当前单据的结息日不存在！*/
				});
				return;
			}
			let linkpath,appcode,pagecode;
			linkpath = '/tmpub/pub/settledate/main/index.html#/card',
			appcode = '36010ISDC',
			pagecode = '36010ISDC_CARD_01'
			props.openTo(linkpath, {
				appcode: appcode,
				pagecode: pagecode,
				status: 'browse',
				islinkquery: true,
				id:iadate
			});			
			break;

		case 'linkpayreceiptBtn':// 联查-放款回单
			let linkpaydata = getSelectedData.call(this, props);
			let linkpaydatapk = linkpaydata[0].data.values.pk_debitcontract_icdmc.value;
			queryPksByContractNo.call(this, props, '/icdmc/icdmc/financepayreceipt/main/index.html#/list', '36362IDC', '36362IPR', '36362IPR_LIST', linkpaydatapk);
			break;

		case 'linkrepayreceiptBtn':// 联查-还款回单
			let linkrepaydata = getSelectedData.call(this, props);
			let linkrepaydatapk = linkrepaydata[0].data.values.pk_debitcontract_icdmc.value;
			queryPksByContractNo.call(this, props, '/icdmc/icdmc/repayprcplreceipt/main/index.html#/list', '36362IDC', '36362IRPR', '36362IRPR_LIST', linkrepaydatapk);
			break;

		case 'linkinterestbillBtn':// 联查-利息清单
			let linkinterestdata = getSelectedData.call(this, props);
			let contractpk = linkinterestdata[0].data.values.pk_srcbill.value;
			queryPksByContractNo.call(this, props, '/icdmc/icdmc/interest/main/index.html#/list', '36362IDC', '36360FCIB', '36360FCIB_LIST', contractpk);
			break;

		case 'linkhistoryversionBtn':// 联查-历史版本
			let selectedDataHistory = getSelectedData.call(this, props);
			let pk_debitcontract_icdmc = selectedDataHistory[0].data.values.pk_debitcontract_icdmc.value;
			this.props.openTo('/icdmc/icdmc/innerdebitcontract/main/index.html#/card',
			{
				srcFunCode:'36362IDC',
				id:pk_debitcontract_icdmc,
				appcode: '36362IDC',
				pagecode: '36362IDC_C01',
				status: 'browse',
				pageType:'version'
			});
			break;

		case 'closeBtn':
			this.closeVersionCard();
			break;

			
		case 'linkdebitapplyBtn':// 联查-借款申请
			let selectedDataApply = getSelectedData.call(this, props);
			let pk_debitapply = selectedDataApply[0].data.values.pk_debitapply.value;
			if(!pk_debitapply){
				toast({
					color: 'warning',
					content: this.state.json['36362IDC-000047']//{/* 国际化处理： 未查询出符合条件的数据！*/}
				});
			} else {
				this.props.openTo('/icdmc/icdmc/debitapply/main/index.html#/card', 
				{
					srcFunCode:'36362IDC',
					appcode: '36362IDA',
					pagecode: '36362IDA_card',
					status: 'browse',
					islinkquery: true,
					id:pk_debitapply,
					scene: "linksce"
				});
			}
			break;

		case 'printBtn':// 打印
			let printData = this.props.table.getCheckedRows(constant.ltablecode);
			let pks = [];
			printData.forEach((item) => {
				pks.push(item.data.values.pk_debitcontract_icdmc.value);
			});
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					// billtype: constant.billtype, //单据类型
					// funcode: constant.printfuncode, //功能节点编码，即模板编码
					appcode: appcode, //appcode
					nodekey: constant.printnodekey, //模板节点标识
					// printTemplateID: constant.printtemplateid, //模板id
					oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
				}
			);
			break;

		case 'outputBtn':// 输出
			let outputData = this.props.table.getCheckedRows(constant.ltablecode);
			// if (outputData.length == 0) {
			// 	toast({
			// 		color: 'warning',
			// 		content: this.state.json['36362IDC-000027'] /* 国际化处理： 请选择数据*/
			// 	});
			// 	return;
			// } else if(outputData.length > 1){
			// 	toast({
			// 		color: 'warning',
			// 		content: this.state.json['36362IDC-000028'] /* 国际化处理： 只能选择一条数据!*/
			// 	});
			// 	return;
			// }
			// let outputData = searchdata();
			let opks = [];
			outputData.forEach((item) => {
				opks.push(item.data.values.pk_debitcontract_icdmc.value);
			});
			this.setState({
					outputData: {
						funcode: printfuncode, //功能节点编码，即模板编码
						nodekey: printnodekey, //模板节点标识
						printTemplateID: printtemplateid, //模板id
						oids: opks,
						outputType: 'output'
					} //打印输出使
				},
				() => {
					this.refs.printOutput.open();
				}
			);
			break;

		case 'enclosureBtn':// 附件
			let enclosureData = this.props.table.getCheckedRows(constant.ltablecode);
			if (enclosureData.length == 0) {
				toast({
					color: 'warning',
					content: this.state.json['36362IDC-000027'] /* 国际化处理： 请选择数据*/
				});
				return;
			} else if(enclosureData.length > 1){
				toast({
					color: 'warning',
					content: this.state.json['36362IDC-000028'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			// let enclosureData = searchdata();
			if (enclosureData.length != 1) {
				toast({
					color: 'warning',
					content: this.state.json['36362IDC-000028'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}

			let pk_debitcontract_icdmcv, billno
			//处理选择数据
			enclosureData.forEach((val) => {

				if (val.data.values.vbillno && val.data.values.vbillno.value != null) {
					billno = val.data.values.vbillno.value;
				}

				if (val.data.values.pk_debitcontract_icdmc && val.data.values.pk_debitcontract_icdmc.value != null) {
					pk_debitcontract_icdmcv = val.data.values.pk_debitcontract_icdmc.value;
				}
			});
			this.setState({
				billId: pk_debitcontract_icdmcv, //单据id
				billno: billno, // 单据编号
				showUploader: !this.state.showUploader,
				target: null
			})
			break;

		case 'refreshBtn'://刷新
			this.refreshHtml(props);
			break;
			
		default:
			break;
	}
}

const queryPksByContractNo = function(props, linkUrl, srcFunCode, appcode, pagecode, srcpks) {
	let queryData =  { pk: srcpks, pageCode: constant.cpagecode, linkType: pagecode };
	ajax({
		url: requesturl.querybycontractpk,
		data: queryData,
		success: (res) => {
			if (res.data) {
				let pks = [];
				res.data.forEach((val) => {
					pks.push(val);
				});
				props.openTo(linkUrl, 
				{
					srcFunCode: srcFunCode,
					appcode: appcode,
					pagecode: pagecode,
					status: 'browse',
					id: pks,
					scene: "linksce"
				});
			}
		}
	});
};

const getSelectedData = function(props) {
	let selectedData = props.table.getCheckedRows(constant.ltablecode);
	if (selectedData.length == 0) {
		toast({
			color: 'warning',
			content: this.state.json['36362IDC-000027'] /* 国际化处理： 请选择数据*/
		});
		return;
	} else if(selectedData.length > 1){
		toast({
			color: 'warning',
			content: this.state.json['36362IDC-000028'] /* 国际化处理： 只能选择一条数据!*/
		});
		return;
	}
	return selectedData;
};
/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/