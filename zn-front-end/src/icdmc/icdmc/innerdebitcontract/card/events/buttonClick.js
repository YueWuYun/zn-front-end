/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { ajax, toast, print, cardCache } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
let { updateCache } = cardCache;
import { getCardData } from "../../../public/cardEvent";

// 内部借款合同-卡片-按钮
export default function (props, id) {
	let cpagecode = constant.cpagecode;
	const appcode = constant.appcode;
	const cardpath = constant.cardpath;
	const billtype = constant.billtype;
	const printfuncode = constant.printfuncode;
	const printnodekey = constant.printnodekey;
	const printtemplateid = constant.printtemplateid;
	const formcode1 = constant.formcode1;
	const tablecode_plan = constant.tablecode_plan;
	const tablecode_exe = constant.tablecode_exe;
	const pkname = constant.pkname;

	switch (id) {
		case 'linkrateBtn':// 联查-利率
			let rateid = this.props.form.getFormItemsValue(this.formId, 'rateid').value;
			if(rateid == null || rateid.length <= 0){
				toast({
					color: 'warning',
					content: this.state.json['36362IDC-000047'] /* 国际化处理： 未查询出符合条件的数据！*/
				});
				return;
			}
			ajax({
				url: requesturl.linkrate, 
				data: {
					pk: rateid
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
						id:rateid
					});
				}
			});
			break;

		case 'linksettledateBtn':// 联查-结息日
			let iadate = this.props.form.getFormItemsValue(this.formId, 'iadate').value;
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
			let paypk = props.form.getFormItemsValue(constant.formcode1, 'pk_debitcontract_icdmc').value;// 借款合同主键
			queryPksByContractNo(props, '/icdmc/icdmc/financepayreceipt/main/index.html#/list', '36362IDC', '36362IPR', '36362IPR_LIST', paypk);
			break;

			
		case 'linkrepayreceiptBtn':// 联查-还款回单
			let repaypk = props.form.getFormItemsValue(constant.formcode1, 'pk_debitcontract_icdmc').value;// 借款合同主键
			queryPksByContractNo(props, '/icdmc/icdmc/repayprcplreceipt/main/index.html#/list', '36362IDC', '36362IRPR', '36362IRPR_LIST', repaypk);
			break;

			
		case 'linkinterestbillBtn':// 联查-利息清单
			let contractpk = props.form.getFormItemsValue(constant.formcode1, 'pk_srcbill').value;// 贷款合同主键
			queryPksByContractNo(props, '/icdmc/icdmc/interest/main/index.html#/list', '36362IDC', '36360FCIB', '36360FCIB_LIST', contractpk);
			break;

		case 'linkhistoryversionBtn':// 联查-历史版本
			let pk_debitcontract_icdmc = this.props.form.getFormItemsValue(this.formId, 'pk_debitcontract_icdmc').value;
			this.props.openTo('/icdmc/icdmc/innerdebitcontract/main/index.html#/card',
			{
				srcFunCode:'36362IDC',
				id:pk_debitcontract_icdmc,
				appcode: '36362IDC',
				pagecode: '36362IDC_C01',
				status: 'browse',
				pageType: 'version'
			});
			break;

		case 'linkdebitapplyBtn':// 联查-借款申请
			let pk_debitapply = this.props.form.getFormItemsValue(this.formId, 'pk_debitapply').value;
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

		case 'enclosureBtn':// 附件
			let pk_debitcontract_icdmce = props.form.getFormItemsValue(this.formId, 'pk_debitcontract_icdmc').value;
			let billnoe = props.form.getFormItemsValue(this.formId, 'vbillno').value;
			this.setState({
				billId: pk_debitcontract_icdmce, //单据id
				billno: billnoe, // 单据编号
				showUploader: !this.state.showUploader,
				target: null
			})

			break;

		case 'printBtn':// 打印
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					// billtype: billtype, //单据类型
					// funcode: printfuncode, //功能节点编码，即模板编码
					appcode: appcode, //appcode
					nodekey: printnodekey, //模板节点标识
					// printTemplateID: printtemplateid, //模板id
					oids: [this.props.form.getFormItemsValue(this.formId, 'pk_debitcontract_icdmc').value]
				}
			);
			break;

		case 'outputBtn':// 输出
			this.setState({
					outputData: {
						funcode: printfuncode, //功能节点编码，即模板编码
						nodekey: printnodekey, //模板节点标识
						printTemplateID: printtemplateid, //模板id
						oids: [this.props.form.getFormItemsValue(this.formId, 'pk_debitcontract_icdmc').value],
						outputType: 'output'
					} //打印输出使
				},
				() => {
					this.refs.printOutput.open();
				}
			);
			break;

		case 'refreshBtn':// 刷新
			let refreshpk = this.props.form.getFormItemsValue(this.formId, 'pk_debitcontract_icdmc').value;
			getCardData.call(
				this,
				'/nccloud/icdmc/innerdebitcontract/querysingle',
				refreshpk,
				true,
                true
			);
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




/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/