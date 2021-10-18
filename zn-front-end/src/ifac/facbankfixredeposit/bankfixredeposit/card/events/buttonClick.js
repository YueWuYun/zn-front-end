/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print, cardCache, promptBox } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; // 联查凭证
import { versionsControl } from "../../../../pub/util/util.js";
import { buttonVisible } from './buttonVisible';
let { updateCache } = cardCache;

export default function (props, id) {
	let cpagecode = constant.cpagecode;
	const appcode = constant.appcode;
	const cardpath = constant.cardpath;
	const billtype = constant.billtype;
	const printfuncode = constant.printfuncode;
	const printnodekey = constant.printnodekey;
	const printtemplateid = constant.printtemplateid;
	const formcode = constant.formcode1;
	const iweb = 'iweb';

	switch (id) {

		case 'edit':// 修改
			let extParam = { 'uiState': 'edit', btncode: 'edit', pagecode: constant.cpagecode };
			let editdata = { pk: props.getUrlParam('id'), pageCode: cpagecode, extParam };
			ajax({
				url: requesturl.editable,
				data: editdata,
				success: (res) => {
					if(res.data){
						props.pushTo('/card', {
							status: 'edit',
							id: props.getUrlParam('id'),
							pagecode: cpagecode
						})
					}
				}
			});
			versionsControl(props, formcode);
			this.toggleShow();
			break;

		case 'save':// 保存
			let saveflag = props.form.isCheckNow(constant.formcode1);
			let CardData = this.props.createMasterChildData(constant.cpagecode, constant.formcode1, null);

			if (saveflag) {
				let saveobj = {};
				// saveobj[card_table_id] = 'cardTable';
				this.props.validateToSave(CardData, save.bind(this, props, CardData), saveobj, '');
			}
			break;

		case 'cancel':// 取消
			promptBox({
				color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36140RFD-000029'],
				content: this.state.json['36140RFD-000014'],/* 国际化处理： 是否确认要取消？*/
				//点击确定按钮事件
				beSureBtnClick: () => {
					if ((props.getUrlParam('status') === 'edit')) {
						// 表单返回上一次的值
						props.form.cancel(constant.formcode1);
						props.setUrlParam({
							status: 'browse',
							id: props.getUrlParam('id')
						});
						versionsControl(props, constant.formcode1);
						this.toggleShow();
					}
					//保存中的取消操作
					if (props.getUrlParam('status') === 'add') {
						props.form.cancel(constant.formcode1);
						// props.cardTable.resetTableData(this.tableId);
						let id = props.getUrlParam('id');
						let nextId = getCurrentLastId(constant.cacheDataSource);
						if (id == null) {
							props.setUrlParam({
								status: 'browse',
								id: nextId
							});
						} else {
							props.setUrlParam({
								status: 'browse',
								id: id
							});
						}
						this.setState({ billno: props.form.getFormItemsValue(constant.formcode1, 'vbillcode').value, vbillno: props.form.getFormItemsValue(constant.formcode1, 'vbillcode').value });
						versionsControl(props, constant.formcode1);
						this.toggleShow();
					}
				}
			});
			break;

		case 'tally':// 记账
			tallyConfirm.call(this, props);
			break;

		case 'unTally':// 取消记账
			unTallyConfirm.call(this, props);
			break;

		case 'linkreceiptBtn':// 联查存单
			let depositcode = this.props.form.getFormItemsValue(constant.formcode1, 'depositcode').value;
			if (!depositcode) {
				toast({
					color: 'warning',
					content: this.state.json['36140RFD-000047']//{/* 国际化处理： 未查询出符合条件的数据！*/}
				});
			} else {
				this.props.openTo('/ifac/factimedepositmanage/depositreceipt/main/index.html#/card',
					{
						srcFunCode: '36140RFD',
						appcode: '36140FDLB',
						pagecode: '36140FDLB_C01',
						status: 'browse',
						islinkquery: true,
						id: depositcode,
						scene: "linksce"
					});
			}
			break;

		case 'linkregularrateBtn':// 联查定期利率
			let rateid = this.props.form.getFormItemsValue(constant.formcode1, 'pk_depostrate').value;
			if (rateid == null || rateid.length <= 0) {
				toast({
					color: 'warning',
					content: this.state.json['36140RFD-000047'] /* 国际化处理： 未查询出符合条件的数据！*/
				});
				return;
			}
			ajax({
				url: requesturl.linkrate,
				data: {
					pk: rateid
				},
				success: (res) => {
					let linkpath, appcode, pagecode;
					if (res.data.rateclass == '2') {
						linkpath = '/tmpub/pub/interestrate_global/main/#/card',
							appcode = '36010IRC',
							pagecode = '36010IRC_card'
					} else if (res.data.rateclass == '1') {
						linkpath = '/tmpub/pub/interestrate_group/main/#/card',
							appcode = '36010IRCG',
							pagecode = '36010IRCG_card'
					} else if (res.data.rateclass == '0') {
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
						id: rateid
					});
				}
			});
			break;

		case 'linkInterestBillBtn':// 联查单位内部利息清单,待利息清单完成之后，做适配

			break;

		case 'linkvoucherBtn':// 联查凭证
			//处理选择数据
			let pk_fixredepositv = props.form.getFormItemsValue(constant.formcode1, 'pk_fixredeposit').value;
			let billnov = props.form.getFormItemsValue(constant.formcode1, 'vbillcode').value;
			let pk_groupv = props.form.getFormItemsValue(constant.formcode1, 'pk_group').value;
			let pk_orgv = props.form.getFormItemsValue(constant.formcode1, 'pk_org').value;
			linkVoucherApp(
				this.props,
				pk_fixredepositv,
				pk_groupv,
				pk_orgv,
				billtype,
				billnov,
			);

			break;

		case 'printBtn':// 打印
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					// billtype: billtype, //单据类型
					// funcode: printfuncode, //功能节点编码，即模板编码
					appcode: appcode, //appcode
					nodekey: null, //模板节点标识
					// printTemplateID: printtemplateid, //模板id
					oids: [this.props.form.getFormItemsValue(constant.formcode1, 'pk_fixredeposit').value]
				}
			);
			break;

		case 'outputBtn':// 输出
			this.setState({
				outputData: {
					// funcode: printfuncode, //功能节点编码，即模板编码
					appcode: appcode, //appcode
					nodekey: null, //模板节点标识
					// printTemplateID: printtemplateid, //模板id
					oids: [this.props.form.getFormItemsValue(constant.formcode1, 'pk_fixredeposit').value],
					outputType: 'output'
				} //打印输出使
			},
				() => {
					this.refs.printOutput.open();
				}
			);
			break;

		case 'refreshBtn':// 刷新
			let cashdrawpk = props.form.getFormItemsValue(constant.formcode1, 'pk_fixredeposit').value;
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
							this.props.form.setAllFormValue({ [constant.formcode1]: res.data.head[constant.formcode1] });
							let billno = res.data.head[constant.formcode1].rows[0].values.vbillcode.value;
							this.setState({
								billno: billno
							});
							this.buttonAfter(res.data.head);
							toast({
								content: this.state.json['36140RFD-000048'],/* 国际化处理： 刷新成功！*/
								color: 'success'
							})
						}
					} else {
						this.props.form.setAllFormValue({ [constant.formcode1]: { rows: [] } });
					}
				}
			});

			break;

		case 'enclosureBtn':// 附件
			let pk_fixredeposite = props.form.getFormItemsValue(constant.formcode1, 'pk_fixredeposit').value;
			let billnoe = props.form.getFormItemsValue(constant.formcode1, 'vbillcode').value;
			this.setState({
				billId: pk_fixredeposite, //单据id
				billno: billnoe, // 单据编号
				showUploader: !this.state.showUploader,
				target: null
			})

			break;

		default:
			break;
	}
}

/**
 * 记账
 * @param {*} props 
 */
const tallyConfirm = function (props) {
	let that = this;
	let pkMapTs = {};
	let pk = props.form.getFormItemsValue(constant.formcode1, constant.pkname).value;
	let ts = props.form.getFormItemsValue(constant.formcode1, 'ts').value;
	pkMapTs[pk] = ts;
	ajax({
		url: requesturl.tally,
		data: {
			pkMapTs,
			pageCode: constant.cpagecode,
			extParam: { btncode: 'tally', pagecode: constant.cpagecode }
		},
		success: (res) => {
			let pk_fixredeposit = null;
			// if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
			// 	props.dealFormulamsg(
			// 		res.formulamsg,  //参数一：返回的公式对象
			// 		{                //参数二：界面使用的表格类型
			// 			card_table_id: "cardTable"
			// 		}
			// 	);
			// }
			if (res.success) {
				toast({ color: 'success', content: that.state.json['36140RFD-000064'] });/* 国际化处理： 记账成功*/
				if (res.data) {
					if (res.data.head && res.data.head[constant.formcode1]) {
						props.form.setAllFormValue({ [constant.formcode1]: res.data.head[constant.formcode1] });
						pk_fixredeposit = res.data.head[constant.formcode1].rows[0].values.pk_fixredeposit.value;
					}
					// if (res.data.body && res.data.body[that.tableId]) {
					// 	props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
					// }
					updateCache(constant.pkname, pk_fixredeposit, res.data, constant.formcode1, constant.cacheDataSource, res.data.head[constant.formcode1].rows[0].values);
				}
				versionsControl(that.props,constant.formcode1);
				buttonVisible(this.props);
			}
		}
	});
};

/**
 * 取消记账
 * @param {*} props 
 */
const unTallyConfirm = function (props) {
	let that = this;
	let pkMapTs = {};
	let pk = props.form.getFormItemsValue(constant.formcode1, constant.pkname).value;
	let ts = props.form.getFormItemsValue(constant.formcode1, 'ts').value;
	pkMapTs[pk] = ts;
	ajax({
		url: requesturl.untally,
		data: {
			pkMapTs,
			pageCode: constant.cpagecode,
			extParam: { btncode: 'unTally', pagecode: constant.cpagecode }
		},
		success: (res) => {
			let pk_fixredeposit = null;
			// if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
			// 	props.dealFormulamsg(
			// 		res.formulamsg,  //参数一：返回的公式对象
			// 		{                //参数二：界面使用的表格类型
			// 			card_table_id: "cardTable"
			// 		}
			// 	);
			// }
			if (res.success) {
				toast({ color: 'success', content: this.state.json['36140RFD-000065'] });/* 国际化处理： 取消记账成功*/
				if (res.data) {
					if (res.data.head && res.data.head[constant.formcode1]) {
						props.form.setAllFormValue({ [constant.formcode1]: res.data.head[constant.formcode1] });
						pk_fixredeposit = res.data.head[constant.formcode1].rows[0].values.pk_fixredeposit.value;
					}
					// if (res.data.body && res.data.body[this.tableId]) {
					// 	props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					// }
					updateCache(constant.pkname, pk_fixredeposit, res.data, constant.formcode1, constant.cacheDataSource, res.data.head[constant.formcode1].rows[0].values);

				}
				versionsControl(this.props,constant.formcode1);
				buttonVisible(this.props);
			}
		}
	});
};



/**
 * 保存
 * @param {*} props 
 * @param {*} CardData 
 */
function save(props, CardData) {
	ajax({
		url: requesturl.save,
		data: CardData,
		success: (res) => {
			let pk_fixredeposit = null;
			// if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
			// 	props.dealFormulamsg(
			// 		res.formulamsg,  //参数一：返回的公式对象
			// 		{                //参数二：界面使用的表格类型
			// 			card_table_id: "cardTable"
			// 		}
			// 	);
			// }
			if (res.success) {
				if (res.data) {
					if (res.data.head && res.data.head[constant.formcode1]) {
						props.form.setAllFormValue({ [constant.formcode1]: res.data.head[constant.formcode1] });
						pk_fixredeposit = res.data.head[constant.formcode1].rows[0].values.pk_fixredeposit.value;
					}
					// if (res.data.body && res.data.body[this.tableId]) {
					// 	props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					// }

					if ((props.getUrlParam('status') === 'add') || (props.getUrlParam('status') === 'copy')) {
						addCache(pk_fixredeposit, res.data, constant.formcode1, constant.cacheDataSource, res.data.head[constant.formcode1].rows[0].values);
					} else {
						updateCache(constant.pkname, pk_fixredeposit, res.data, constant.formcode1, constant.cacheDataSource, res.data.head[constant.formcode1].rows[0].values);
					}

				}
				this.props.pushTo('/card', {
					status: 'browse',
					id: pk_fixredeposit,
					saveres: true,
					pagecode: constant.cpagecode
				});
				versionsControl(this.props, constant.formcode1);
				this.toggleShow();
			}
		}
	});
}
/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/