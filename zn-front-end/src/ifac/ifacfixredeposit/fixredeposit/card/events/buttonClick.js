/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print, cardCache, promptBox } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
// import { commondata } from '../../../../public/utils/constant';
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
	const iweb = 'iweb';

	switch (id) {
		case 'linkregularrateBtn':// 联查定期利率
			let rateid = this.props.form.getFormItemsValue(this.formId, 'pk_depostrate').value;
			if(rateid == null || rateid.length <= 0){
				toast({
					color: 'warning',
					content: this.state.json['36340RFD-000047'] /* 国际化处理： 未查询出符合条件的数据！*/
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
						scene: "linksce",
						islinkquery: true,
						id:rateid
					});
				}
			});
			break;

		case 'linkreceiptBtn':// 联查存单
			let depositcode = this.props.form.getFormItemsValue(this.formId, 'depositcode').value;
			if(!depositcode){
				toast({
					color: 'warning',
					content: this.state.json['36340RFD-000047']//{/* 国际化处理： 未查询出符合条件的数据！*/}
				});
			} else {
				this.props.openTo('/ifac/ifactimedepositmange/depositreceipt/main/index.html#/card', 
				{
					srcFunCode:'36340RFD',
					appcode: '36340FDLB',
					pagecode: '36340FDLB_C01',
					status: 'browse',
					islinkquery: true,
					id:depositcode,
					scene: "linksce"
				});
			}
			break;

		case 'voucherBtn':// 联查凭证
			//处理选择数据
			let pk_fixredepositv = props.form.getFormItemsValue(this.formId, 'pk_fixredeposit').value;
			let billnov = props.form.getFormItemsValue(this.formId, 'vbillcode').value;
			let pk_groupv = props.form.getFormItemsValue(this.formId, 'pk_group').value;
			let pk_orgv = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			linkVoucherApp(
				this.props,
				pk_fixredepositv,
				pk_groupv,
				pk_orgv,
				billtype,
				billnov,
			);

			break;

			// 附件
		case 'enclosureBtn':
			let pk_fixredeposite = props.form.getFormItemsValue(this.formId, 'pk_fixredeposit').value;
			let billnoe = props.form.getFormItemsValue(this.formId, 'vbillcode').value;
			this.setState({
				billId: pk_fixredeposite, //单据id
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
					nodekey: null, //模板节点标识
					// printTemplateID: printtemplateid, //模板id
					oids: [this.props.form.getFormItemsValue(this.formId, 'pk_fixredeposit').value]
				}
			);
			break;

			// 输出
		case 'outputBtn':
			this.setState({
					outputData: {
						// funcode: printfuncode, //功能节点编码，即模板编码
						appcode: appcode, //appcode
						nodekey: null, //模板节点标识
						// printTemplateID: printtemplateid, //模板id
						oids: [this.props.form.getFormItemsValue(this.formId, 'pk_fixredeposit').value],
						outputType: 'output'
					} //打印输出使
				},
				() => {
					this.refs.printOutput.open();
				}
			);
			break;

			// 刷新
		case 'refreshBtn':
			let cashdrawpk = props.form.getFormItemsValue(this.formId, 'pk_fixredeposit').value;
			let data = {
				pk: cashdrawpk,
				pageCode: this.pageId
			};
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({[this.formId]: res.data.head[this.formId]});
							let billno = res.data.head[this.formId].rows[0].values.vbillcode.value;
							this.setState({
								billno: billno
							});
							this.buttonAfter(res.data.head);
							toast({
								content: this.state.json['36340RFD-000048'],/* 国际化处理： 刷新成功！*/
								color: 'success'
							})
						}
					} else {
						this.props.form.setAllFormValue({[this.formId]: {rows: []}});
					}
				}
			});

			break;

		default:
			break;
	}
}
/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/