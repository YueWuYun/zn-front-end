/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {
	print,
	output
} from 'nc-lightapp-front';
import {
	constant,
	requesturl
} from '../../config/config.js';
import {
	commondata,
} from '../../../../public/utils/constant';

export default function (props, id) {


	const formcode1 = constant.formcode1;

	const cpagecode = constant.approve_card_pagecode;

	const cardpath = constant.cardpath;
	// 联查src
	const linksrc = constant.linksrc;

	// 联查结算常量
	const settleappcode = commondata.settleappcode;
	const settlepagecode = commondata.settlepagecode;
	const settlecardurl = commondata.settlecardurl;

	// 单据类型
	const billtype = constant.billtype;
	// 打印
	const printfuncode = constant.printfuncode;

	const printnodekey = constant.printnodekey;

	const printtemplateid = constant.printtemplateid;
	const appcode = constant.appcode;

	const billid = this.billpk;
	// const iweb = constant.iweb;

	switch (id) {

			// 联查本方账户余额余额
		case 'bankaccbalanceBtn':
			let bankaccbalanceArr = [];
			
			//处理选择数据
			let pk_bankaccount = props.form.getFormItemsValue(this.formId, 'pk_account').value;
			let pkorgb = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			//修改请求联查方式
			let bank_data = {
				pk_org: pkorgb, //财务组织id
				pk_account: pk_bankaccount //银行账户id，没有可不写，和现金账户二选一
				// pk_cashaccount: null //现金账户id，没有可不写
			}
			bankaccbalanceArr.push(bank_data); 

			this.setState({
                showOriginalData: bankaccbalanceArr,
                showOriginal: true,
			});
			break;

			// 联查结算单
		case 'linksettlementBtn':
			let linksettleArr = [];
			let pk_settlement;
			
			if (props.form.getFormItemsValue(this.formId, 'pk_settlement').value) {
				pk_settlement = props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
				linksettleArr.push(pk_settlement); // 单据id
			}

			props.openTo(settlecardurl, {
				status: 'browse',
				appcode: settleappcode,
				pagecode: settlepagecode,
				// name: this.state.json['36070CPI-000003'],/* 国际化处理： 联查结算单*/
				id: pk_settlement,
				src: linksrc
			});

			break;

			// 打印
		case 'printBtn': //打印
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					// billtype: billtype, //单据类型
					// funcode: printfuncode, //功能节点编码，即模板编码
					appcode: appcode, //appcode
					nodekey: printnodekey, //模板节点标识
					// printTemplateID: printtemplateid, //模板id
					oids: [this.props.form.getFormItemsValue(this.formId, 'pk_settlechange').value]
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
			// 			oids: [this.props.form.getFormItemsValue(this.formId, 'pk_settlechange').value],
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
					oids: [this.props.form.getFormItemsValue(this.formId, 'pk_settlechange').value],
					outputType: 'output'
				}
			});
			break;

			// 附件
		case 'enclosureBtn':
			let pk_settlechangee = props.form.getFormItemsValue(this.formId, 'pk_settlechange').value;
			let vbillno = props.form.getFormItemsValue(this.formId, 'vbillno').value;
			this.setState({
				billId: pk_settlechangee, //单据id
				billno: vbillno, // 单据编号
				showUploader: !this.state.showUploader,
				target: null
			})
			break;

		default:
			break;
	}
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/