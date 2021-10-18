/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, cacheTools, high, print, promptBox } from 'nc-lightapp-front';
import { commondata, getappurl } from '../../../../public/utils/constant';
import { constant, requesturl } from '../../config/config';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; // 联查凭证

export default function buttonClick(props, id) {
	const linksrc = constant.linksrc;
	const billtype = constant.billtype;
	const printfuncode = constant.printfuncode;
	const printnodekey = constant.printnodekey;
	const printtemplateid = constant.printtemplateid;
	const appcode = constant.appcode;
	let that = this;

	const searchdata = function(props) {
		let selectdata = props.table.getCheckedRows(constant.ltablecode2);
		//数据校验
		// if (!selectdata) {
		// 	toast({
		// 		color: 'warning',
		// 		content: this.state.json['36070AA-000027'] /* 国际化处理： 请选择数据*/
		// 	});
		// 	return;
		// }
		return selectdata;
	};

	function getrequestdata() {
		let selectdata = searchdata.call(this, props);
		let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		//处理选择数据
		selectdata.forEach((val) => {
			let pk = val.data.values.pk_accountagiotage.value;
			let ts = val.data.values.ts.value;
			pksArr.push(pk); //主键数组
			pktsmap[pk] = ts;
			indexmap[pk] = val.index;
		});
		//自定义请求数据
		let data = {
			pageCode: constant.lpagecode,
			pktsmap: pktsmap,
			indexmap: indexmap,
			pks: pksArr
		};
		return data;
	}

	switch (id) {
		case 'selectAccountBtn':
			this.props.pushTo(constant.listpath);
			break;

		case 'hisRecordBtn':// 损益记录
			this.openQueryForm();
			this.props.form.setFormStatus(constant.formcode, 'edit');

			// 用户单选
			let meta = this.props.meta.getMeta();
			meta[constant.formcode].items.find((e) => e.attrcode === 'user').isMultiSelectedEnabled = false;
			// meta[constant.formcode].items.find((e) => e.attrcode === 'bankAccount').showHistory = true;
			props.meta.setMeta(meta);

			// 初始化损益记录查询框
			this.initHistoryRecordForm();
			break;

		case 'cancelCalculateBtn':// 取消损益
			this.cancelCalculate(props);
			break;

		case 'linkBillBtn':// 联查单据
			let selecteddata = this.props.table.getCheckedRows(constant.ltablecode2);
			let pk_accountagiotage;
			if(selecteddata.length == 0){
				toast({
					color: 'warning',
					content: this.state.json['36070AA-000002'] /* 国际化处理： 请选择数据*/
				});
				return;
			} else if(selecteddata.length > 1){
				toast({
					color: 'warning',
					content: this.state.json['36070AA-000063'] /* 国际化处理： 只能选择一条数据*/
				});
				return;
			} else {
				selecteddata.forEach((val)=>{
					pk_accountagiotage = val.data.values.pk_accountagiotage.value;
				});
			}

			this.props.openTo('/cmp/accountagiotage/accountagiotagebill/main/index.html#/linkcard', ///cmp/accountagiotage/accountagiotagebill/linkcard/index.html
			{
				srcFunCode:'36070AA',
				pk_accountagiotage:pk_accountagiotage,
				appcode: '36070AB',
				pagecode: '36070AB_C02',
				status: 'browse'
			});
			break;

		case 'voucherBtn':// 联查凭证
			let voucherData = searchdata.call(this, props);
			if (voucherData.length > 1) {
				toast({
					color: 'warning',
					content: this.state.json['36070AA-000063'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			} else if (voucherData.length == 0) {
				toast({
					color: 'warning',
					content: this.state.json['36070AA-000027'] /* 国际化处理： 请选择数据*/
				});
				return;
			}
			let pk,billnov,pk_groupv,pk_orgv
			//处理选择数据
			voucherData.forEach((val) => {
				pk = val.data.values.pk_accountagiotage.value;
				billnov = val.data.values.billNo.value;
			});

			let queryData =  { pk: pk, pageCode: constant.lpagecode };
			ajax({
				url: requesturl.querycard,
				data: queryData,
				success: (res) => {
					let { success, data } = res;
						if (success) {
							if (data) {
								pk_groupv = res.data[constant.ltablecode].rows[0].values.pk_group.value;
								pk_orgv = res.data[constant.ltablecode].rows[0].values.pk_org.value;

								linkVoucherApp(
									this.props,
									pk,
									pk_groupv,
									pk_orgv,
									billtype,
									billnov,
								);
							} else {
								toast({
									color: 'warning',
									content: this.state.json['36070AA-000064'] /* 国际化处理： 没有查询到汇兑损益单!*/
								});
							}
						}
				}
			});
			break;

		case 'confirmBtn':// 确认
			this.queryHisRecord(props);
			break;

		case 'cancelBtn':// 取消
			this.closeQueryForm();
			break;

		default:
			break;
	}
}
/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/