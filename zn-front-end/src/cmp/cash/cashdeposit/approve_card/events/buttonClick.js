/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {
	cacheTools,
	print,
	output
} from 'nc-lightapp-front';
import {
	constant,
	requesturl
} from '../../config/config';

import {
	commondata,
	getappurl
} from '../../../../public/utils/constant';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; //联查凭证
export default function (props, id) {

	const formcode1 = constant.formcode1;
	const cpagecode = constant.approve_card_pagecode;
	const cardpath = constant.cardpath;
	const appcode = constant.appcode;
	// 联查src
	const linksrc = constant.linksrc;
	// 单据类型
	const billtype = constant.billtype;
	// 打印
	const printfuncode = constant.printfuncode;
	const printnodekey = constant.printnodekey;
	const printtemplateid = constant.printtemplateid;

	const voucherappcode = commondata.voucherappcode;
	const voucherpagecode = commondata.voucherpagecode;
	const voucherappid = commondata.voucherappid;

	const iweb = commondata.iweb;
	let status = props.getUrlParam('status');

	switch (id) {

		// 联查账户余额
		case 'cashbalanceBtn':
			let cashbalanceArr = [];
			let pk_cashaccount = props.form.getFormItemsValue(this.formId, 'pk_cashaccount').value;
			let pkorg = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			//修改请求联查方式
			let query_data = {
				pk_org: pkorg, //财务组织id
				pk_account: null, //银行账户id，没有可不写，和现金账户二选一
				pk_cashaccount: pk_cashaccount //现金账户id，没有可不写
			}
			cashbalanceArr.push(query_data); //现金账户
			this.setState({
				showOriginalData: cashbalanceArr,
				showOriginal: true,
			});

			break;

			// 联查银行账户余额
		case 'bankaccbalanceBtn':

			let bankaccbalanceArr = [];
			//处理选择数据
			let pk_bankaccount = props.form.getFormItemsValue(this.formId, 'pk_bankaccount').value;
			let pkorgb = props.form.getFormItemsValue(this.formId, 'pk_org').value;

			//修改请求联查方式
			let bank_data = {
				pk_org: pkorgb, //财务组织id
				pk_account: pk_bankaccount, //银行账户id，没有可不写，和现金账户二选一
				pk_cashaccount: null //现金账户id，没有可不写
			}
			bankaccbalanceArr.push(bank_data); //现金账户
			this.setState({
				showOriginalData: bankaccbalanceArr,
				showOriginal: true,
			});

			break;

			// 联查审批意见
		case 'approveopinionBtn':

			let pk_cashdeposita = props.form.getFormItemsValue(this.formId, 'pk_cashdeposit').value;

			this.setState({
				billId: pk_cashdeposita, //单据id
				approveshow: !this.state.approveshow
			})
			break;

			// 联查凭证
		case 'voucherBtn':
			//处理选择数据
			let pk_cashdepositv = props.form.getFormItemsValue(this.formId, 'pk_cashdeposit').value;
			let billnov = props.form.getFormItemsValue(this.formId, 'billno').value;
			let pk_groupv = props.form.getFormItemsValue(this.formId, 'pk_group').value;
			let pk_orgv = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			linkVoucherApp(
				this.props,
				pk_cashdepositv,
				pk_groupv,
				pk_orgv,
				billtype,
				billnov,
			);
			break;

			// 附件
		case 'enclosureBtn':
			let pk_cashdeposite = props.form.getFormItemsValue(this.formId, 'pk_cashdeposit').value;
			let billnoe = props.form.getFormItemsValue(this.formId, 'billno').value;
			this.setState({
				billId: pk_cashdeposite, //单据id
				billno: billnoe, // 单据编号
				showUploader: !this.state.showUploader,
				target: null
			})
			break;

			// 打印
		case 'printBtn':
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					// billtype: billtype, //单据类型
					// funcode: printfuncode, //功能节点编码，即模板编码
					appcode: appcode, //appcode
					nodekey: printnodekey, //模板节点标识
					// printTemplateID: printtemplateid, //模板id
					oids: [this.props.form.getFormItemsValue(this.formId, 'pk_cashdeposit').value]
				}
			);
			break;

			// 输出
		case 'outputBtn':
			// this.refs.printOutput.open();
			// this.setState({
			// 		outputData: {
			// 			funcode: printfuncode, //功能节点编码，即模板编码
			// 			nodekey: printnodekey, //模板节点标识
			// 			printTemplateID: printtemplateid, //模板id
			// 			oids: [this.props.form.getFormItemsValue(this.formId, 'pk_cashdeposit').value],
			// 			outputType: 'output'
			// 		} //打印输出使
			// 	},
			// 	() => {
			// 		this.refs.printOutput.open();
			// 	}
			// );
			output({
				url: requesturl.print,
				data: {
					nodekey: printnodekey,
					appcode: appcode,
					oids: [this.props.form.getFormItemsValue(this.formId, 'pk_cashdeposit').value],
					outputType: 'output'
				}
			});
			break;

		default:
			break;
	}
}
/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/