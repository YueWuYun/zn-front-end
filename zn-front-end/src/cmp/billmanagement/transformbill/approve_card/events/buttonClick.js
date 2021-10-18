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
// import {
// 	imageScan,
// 	imageView
// } from '../../../../../sscrp/public/common/components/sscImageMng.js';
//影像
import { imageScan, imageView } from 'sscrp/rppub/components/image';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; // 联查凭证
export default function (props, id) {

	const formcode1 = constant.formcode1;
	const cpagecode = constant.approve_card_pagecode;
	const appcode = constant.appcode;
	// 单据类型
	const billtype = constant.billtype;
	// 打印
	const printfuncode = constant.printfuncode;
	const printnodekey = constant.printnodekey;
	const printtemplateid = constant.printtemplateid;

	const iweb = commondata.iweb;

	let that = this;

	switch (id) {

		// 联查单据
		case 'querybillBtn':
			let pk_transformbill = props.form.getFormItemsValue(this.formId, 'pk_transformbill').value;
			//处理选择数据
			this.setState({
				billId: pk_transformbill, //单据id
				billtrackshow: !this.state.billtrackshow
			})
			break;

			// 联查划入账户余额
		case 'inaccbalanceBtn':
			let inaccbalanceArr = [];
			let inpk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			let transforminaccount = props.form.getFormItemsValue(this.formId, 'transforminaccount').value;

			let inaccbalancedata = {
				pk_org: inpk_org, //财务组织id
				pk_account: transforminaccount, //银行账户id，没有可不写，和现金账户二选一
				pk_cashaccount: null //现金账户id，没有可不写
			}
			inaccbalanceArr.push(inaccbalancedata);

			this.setState({
				showOriginalData: inaccbalanceArr,
				showOriginal: true,
			});
			break;

			// 联查划出账户余额
		case 'outaccbalanceBtn':
			let outaccbalanceArr = [];
			let pk_orgo = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			let transformoutaccount = props.form.getFormItemsValue(this.formId, 'transformoutaccount').value;

			let outaccbalancedata = {
				pk_org: pk_orgo, //财务组织id
				pk_account: transformoutaccount, //银行账户id，没有可不写，和现金账户二选一
				pk_cashaccount: null //现金账户id，没有可不写
			}

			outaccbalanceArr.push(outaccbalancedata); //现金账户

			this.setState({
				showOriginalData: outaccbalanceArr,
				showOriginal: true,
			});

			break;

			// 联查凭证
		case 'voucherBtn':

			// 获取单据id
			let pk_transformbillv = props.form.getFormItemsValue(this.formId, 'pk_transformbill').value;
			let vbillnov = props.form.getFormItemsValue(this.formId, 'vbillno').value;
			let pk_groupv = props.form.getFormItemsValue(this.formId, 'pk_group').value;
			let pk_orgv = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			linkVoucherApp(
				this.props,
				pk_transformbillv,
				pk_groupv,
				pk_orgv,
				billtype,
				vbillnov,
			);

			break;

			//影像查看
		case 'imgreviewBtn':
		let imgreviewdata = props.form.getAllFormValue(formcode1);
		// let openShowbillid = props.getUrlParam('id'); //单据pk(billid)
		var billInfoMap = {};
		billInfoMap.pk_billid = imgreviewdata.rows[0].values.pk_transformbill.value;
		billInfoMap.pk_billtype = imgreviewdata.rows[0].values.pk_billtypecode.value;
		billInfoMap.pk_tradetype = imgreviewdata.rows[0].values.pk_billtypecode.value;
		billInfoMap.pk_org = imgreviewdata.rows[0].values.pk_org.value;
		imageView(billInfoMap, iweb);
		break;
		//影像扫描
	case 'imgscanBtn':
		let imgscandata = props.form.getAllFormValue(formcode1);
		// let openbillid = props.getUrlParam('id'); //单据pk(billid)
		var billInfoMap = {};
		billInfoMap.pk_billid = imgscandata.rows[0].values.pk_transformbill.value;
		billInfoMap.pk_billtype = imgscandata.rows[0].values.pk_billtypecode.value;
		billInfoMap.pk_tradetype = imgscandata.rows[0].values.pk_billtypecode.value;
		billInfoMap.pk_org = imgscandata.rows[0].values.pk_org.value;
		billInfoMap.BillType = imgscandata.rows[0].values.pk_billtypecode.value;
		billInfoMap.BillDate = imgscandata.rows[0].values.creationtime.value;
		billInfoMap.Busi_Serial_No = imgscandata.rows[0].values.pk_transformbill.value; //.pk_mtapp_bill.value;
		// billInfoMap.pk_billtype = imgscandata.rows[0].values.pk_billtypeid.value; //pk_billtype.value;
		billInfoMap.OrgNo = imgscandata.rows[0].values.pk_org.value; //pk_org.value;
		billInfoMap.BillCode = imgscandata.rows[0].values.vbillno.value; //vbillno.value;
		billInfoMap.OrgName = imgscandata.rows[0].values.pk_org.display; //pk_org.display;
		billInfoMap.Cash = imgscandata.rows[0].values.amount.value; //orig_amount.value;
		imageScan(billInfoMap, iweb);
		break;
			// 附件
		case 'enclosureBtn':
			let pk_transformbille = props.form.getFormItemsValue(this.formId, 'pk_transformbill').value;
			let vbillnoe = props.form.getFormItemsValue(this.formId, 'vbillno').value;
			this.setState({
				billId: pk_transformbille, //单据id
				billno: vbillnoe, // 单据编号
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
					appcode: appcode, //
					nodekey: printnodekey, //模板节点标识
					oids: [this.props.form.getFormItemsValue(this.formId, 'pk_transformbill').value]
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
			// 			oids: [this.props.form.getFormItemsValue(this.formId, 'pk_transformbill').value],
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
					oids: [this.props.form.getFormItemsValue(this.formId, 'pk_transformbill').value],
					outputType: 'output'
				}
			});
			break;

		default:
			break;
	}

}
/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/