/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, toast, print, cardCache, promptBox } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill'; //制单制证
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; // 联查凭证
let { updateCache } = cardCache;
export default function (props, id) {

	let cpagecode = constant.cpagecode;
	const appcode = constant.appcode;
	const cardpath = constant.cardpath;
	// 单据类型
	const billtype = constant.billtype;
	// 打印
	const printfuncode = constant.printfuncode;
	const printnodekey = constant.printnodekey;
	const printtemplateid = constant.printtemplateid;
	const iweb = commondata.iweb;

	switch (id) {

			// 联查账户余额
		case 'cashbalanceBtn':
			let cashbalanceArr = [];
			let pk_cashaccount = props.form.getFormItemsValue(this.formId, 'pk_cashaccount').value;
			let pk_orgc = props.form.getFormItemsValue(this.formId, 'pk_org').value;

			//修改请求联查方式
			let query_datac = {
				pk_org: pk_orgc, //财务组织id
				pk_account: null, //银行账户id，没有可不写，和现金账户二选一
				pk_cashaccount: pk_cashaccount //现金账户id，没有可不写
			}
			cashbalanceArr.push(query_datac); //现金账户
			this.setState({
				showOriginalData: cashbalanceArr,
				showOriginal: true,
			});
			break;

			// 联查银行账户余额
		case 'bankaccbalanceBtn':

			let bankaccbalanceArr = [];
			let pk_bankaccount = props.form.getFormItemsValue(this.formId, 'pk_bankaccount').value;
			let pk_orgb = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			let query_datab = {
				pk_org: pk_orgb, //财务组织id
				pk_account: pk_bankaccount, //银行账户id，没有可不写，和现金账户二选一
				pk_cashaccount: null //现金账户id，没有可不写
			}
			bankaccbalanceArr.push(query_datab); //现金账户
			this.setState({
				showOriginalData: bankaccbalanceArr,
				showOriginal: true,
			});

			break;

			// 联查凭证
		case 'voucherBtn':
			//处理选择数据
			let pk_accountagiotagev = props.form.getFormItemsValue(this.formId, 'pk_accountagiotage').value;
			let billnov = props.form.getFormItemsValue(this.formId, 'vbillno').value;
			let pk_groupv = props.form.getFormItemsValue(this.formId, 'pk_group').value;
			let pk_orgv = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			linkVoucherApp(
				this.props,
				pk_accountagiotagev,
				pk_groupv,
				pk_orgv,
				billtype,
				billnov,
			);

			break;

			// 制单
		case 'makebillBtn':
			//处理选择数据
			let pk_accountagiotagemb = props.form.getFormItemsValue(this.formId, 'pk_accountagiotage').value;
			let tableName = constant.tableName;
			let pkfieldName = constant.pkname;
			MakeBillApp(this.props, constant.appcode, pk_accountagiotagemb, billtype,tableName,pkfieldName);
			break;
			
			// 附件
		case 'enclosureBtn':
			let pk_accountagiotagee = props.form.getFormItemsValue(this.formId2, 'pk_accountagiotage').value;
			let billnoe = props.form.getFormItemsValue(this.formId2, 'vbillno').value;
			this.setState({
				billId: pk_accountagiotagee, //单据id
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
					oids: [this.props.form.getFormItemsValue(this.formId, 'pk_accountagiotage').value]
				}
			);
			break;

			// 输出
		case 'outputBtn':
			this.setState({
					outputData: {
						funcode: printfuncode, //功能节点编码，即模板编码
						nodekey: printnodekey, //模板节点标识
						printTemplateID: printtemplateid, //模板id
						oids: [this.props.form.getFormItemsValue(this.formId, 'pk_accountagiotage').value],
						outputType: commondata.outputType
					} //打印输出使
				},
				() => {
					this.refs.printOutput.open();
				}
			);
			break;

			// 刷新
		case 'refreshBtn':
			let cashdrawpk = props.form.getFormItemsValue(this.formId2, 'pk_accountagiotage').value;
			let data = {
				pk: cashdrawpk,
				pageCode: this.pageId2
			};
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({
								[this.formId2]: res.data[this.formId2]
							});
							let billno = res.data[this.formId2].rows[0].values.vbillno.value;
							this.setState({
								billno: billno
							});
							this.buttonAfter(res.data);
							toast({
								content: this.state.json['36070AB-000048'],/* 国际化处理： 刷新成功！*/
								color: 'success'
							})
						}
					} else {
						this.props.form.setAllFormValue({
							[this.formId2]: {
								rows: []
							}
						});
					}
				}
			});

			break;

		default:
			break;
	}
}
/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/