/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast,	cacheTools, high, print, promptBox } from 'nc-lightapp-front';
import { commondata, getappurl } from '../../../../public/utils/constant';
import { constant, requesturl } from '../../config/config';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; //凭证
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill'; 
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
				content: this.state.json['36070AB-000027'] /* 国际化处理： 请选择数据*/
			});
			return;
		}
		return selectdata;
	};

	switch (id) {
		case 'refreshBtn'://刷新
			this.refreshHtml(props);
			break;

		case 'cashbalanceBtn':// 联查现金账户余额
			let cashbalanceData = searchdata.call(this, props);
			if (cashbalanceData.length != 1) {
				toast({
					color: 'warning',
					content: this.state.json['36070AB-000028'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let cashbalanceArr = [];
			//处理选择数据
			cashbalanceData.forEach((val) => {
				let pk_org, pk_cashaccount
				if (val.data.values.pk_cashaccount && val.data.values.pk_cashaccount.value != null) {
					pk_cashaccount = val.data.values.pk_cashaccount.value;
				}
				if (val.data.values.pk_org && val.data.values.pk_org.value != null) {
					pk_org = val.data.values.pk_org.value;
				}
				let cashbalancedata = {
					pk_org: pk_org, //财务组织id
					pk_account: null, //银行账户id，没有可不写，和现金账户二选一
					pk_cashaccount: pk_cashaccount //现金账户id，没有可不写
				}
				cashbalanceArr.push(cashbalancedata);
			});
			this.setState({
				showOriginalData: cashbalanceArr,
				showOriginal: true,
			});

			break;

		case 'bankaccbalanceBtn':// 联查银行账户余额
			let bankaccbalanceDatas = searchdata.call(this, props);
			if (bankaccbalanceDatas.length != 1) {
				toast({
					color: 'warning',
					content: this.state.json['36070AB-000028'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let bankaccbalanceArr = [];
			//处理选择数据
			bankaccbalanceDatas.forEach((val) => {
				let pk_org, pk_bankaccount
				if (val.data.values.pk_bankaccount && val.data.values.pk_bankaccount.value != null) {
					pk_bankaccount = val.data.values.pk_bankaccount.value;
				}
				if (val.data.values.pk_org && val.data.values.pk_org.value != null) {
					pk_org = val.data.values.pk_org.value;
				}
				let bankaccbalancedata = {
					pk_org: pk_org, //财务组织id
					pk_account: pk_bankaccount, //银行账户id，没有可不写，和现金账户二选一
					// pk_cashaccount: pk_bankaccount //现金账户id，没有可不写
				}
				bankaccbalanceArr.push(bankaccbalancedata);
			});
			this.setState({
				showOriginalData: bankaccbalanceArr,
				showOriginal: true,
			});

			break;

		case 'voucherBtn':// 联查凭证
			let voucherData = searchdata.call(this, props);
			if (voucherData.length != 1) {
				toast({
					color: 'warning',
					content: this.state.json['36070AB-000028'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let pk_accountagiotage,billnov,pk_groupv,pk_orgv
			//处理选择数据
			voucherData.forEach((val) => {
				pk_accountagiotage = val.data.values.pk_accountagiotage.value;
				billnov = val.data.values.vbillno.value;
				pk_groupv = val.data.values.pk_group.value;
				pk_orgv = val.data.values.pk_org.value;
			});
			linkVoucherApp(
				this.props,
				pk_accountagiotage,
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
				pks.push(item.data.values.pk_accountagiotage.value);
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
			let outputData = searchdata.call(this, props);
			let opks = [];
			outputData.forEach((item) => {
				opks.push(item.data.values.pk_accountagiotage.value);
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
			let enclosureData = searchdata.call(this, props);
			let pk_accountagiotagev, billno
			//处理选择数据
			enclosureData.forEach((val) => {

				if (val.data.values.vbillno && val.data.values.vbillno.value != null) {
					billno = val.data.values.vbillno.value;
				}

				if (val.data.values.pk_accountagiotage && val.data.values.pk_accountagiotage.value != null) {
					pk_accountagiotagev = val.data.values.pk_accountagiotage.value;
				}
			});
			this.setState({
				billId: pk_accountagiotagev, //单据id
				billno: billno, // 单据编号
				showUploader: !this.state.showUploader,
				target: null
			})
			break;

		case 'makebillBtn':
			let makebillData = searchdata.call(this, props);
			if (makebillData.length != 1) {
				toast({
					color: 'warning',
					content: this.state.json['36070AB-000028'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let pkformakebill
			//处理选择数据
			makebillData.forEach((val) => {
				pk_accountagiotage = val.data.values.pk_accountagiotage.value;
			});
			let tableName = constant.tableName;
			let pkfieldName = constant.pkname;
			MakeBillApp(this.props, constant.appcode, pk_accountagiotage, constant.billtype,tableName,pkfieldName);

		default:
			break;
	}
}
/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/