/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/
import { ajax, toast } from 'nc-lightapp-front';
import { module_id, base_url, link_card_page_id, card_from_id, card_table_id } from '../../cons/constant.js';
import { setHeadItemProp, setBodyItemProp } from '../../../../pub/utils/SFAfterEditUtil.js';
import { InsertLine } from '../../../../pub/utils/SFButtonUtil';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g) {
	console.log(props, moduleId, key, value, changedrows, i, s, g)
	let status = props.getUrlParam("status");
	let eventData, newvalue, extParam, oldvalue, data;

	if (key === 'pk_org') {
		//获取页面数据
		let eventdata = props.createHeadAfterEventData('36320FA_C01', card_from_id, [card_table_id], card_from_id, key, value);
		//获取编辑的值
		extParam = { 'uiState': status };
		newvalue = eventdata.newvalue ? eventdata.newvalue.value : '';
		oldvalue = eventdata.oldvalue ? eventdata.oldvalue.value : '';
		// olddisplay=eventdata.oldvalue?eventdata.oldvalue.display:'';
		if (newvalue != oldvalue) {//值未发生改变，直接跳出
			if (oldvalue) {
				// if(!newvalue) {
				// 	this.setState({olddisplay:eventdata.oldvalue.display});
				// }
				this.setState({
					oldorg: oldvalue,
					oldorgdisplay: eventdata.oldvalue.display
				})
				props.modal.show('changeorg');

			} else {
				if (newvalue != undefined) {
					console.log(eventdata);
					this.setState({ oldorgdisplay: eventdata.newvalue.display });
					props.form.setFormItemsValue(card_from_id,
						{
							'pk_org': {
								value: eventdata.newvalue.value,
								display: eventdata.newvalue.display
							}
						}
					);
					eventdata = props.createHeadAfterEventData('36320FA_C01', card_from_id, [card_table_id], card_from_id, key, value);
					ajax({
						url: '/nccloud/sf/allocation/event.do',
						data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventdata), extParam },
						success: (res) => {
							if (res.success) {
								let { success, data } = res;
								let { card, extParam, headItemProps, bodyItemProps } = data;
								let { head, body } = card;
								let t = { [card_from_id]: head[card_from_id] };
								props.form.setAllFormValue(t);

								props.cardTable.updateDataByRowId(card_table_id, { rows: [] });
								props.form.setFormItemsDisabled(card_from_id, { 'memo': false, 'busitype': false, 'pk_currtype': false, 'isreversebustype': false });
								//新增行可点击
								props.button.setButtonDisabled(['addline'], false);
								let meta = this.props.meta.getMeta();
								meta[card_table_id].items.find((e) => e.attrcode == 'pk_org_r').isShowUnit = true;
								//增行操作
								let busitype = props.form.getFormItemsValue(card_from_id, 'busitype').value;
								let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
								let pk_group = props.form.getFormItemsValue(card_from_id, 'pk_group').value;
								let index = 0;
								let rows = props.cardTable.getCheckedRows(card_table_id);
								if (rows.length > 0) {
									index = rows[rows.length - 1].index;
								} else {
									index = props.cardTable.getNumberOfRows(card_table_id) - 1;
								}
								InsertLine(props, card_table_id, index);
								index = props.cardTable.getNumberOfRows(card_table_id) - 1;
								props.cardTable.setValByKeyAndIndex(card_table_id, index + 1, 'pk_org', { value: pk_org, display: '' });
								props.cardTable.setValByKeyAndIndex(card_table_id, index + 1, 'pk_group', { value: pk_group, display: '' });

								if (busitype != 2) {
									props.cardTable.setEditableByIndex(card_table_id,
										[index], 'pk_accid_r', false);

								}
								afterEvent(props, card_from_id, 'busitype', busitype);
							}
						},
						error: (res) => {
							// props.form.setFormItemsValue(card_from_id,{'pk_org':{'value':oldvalue,'display':olddisplay}});
							// toast({ color: 'warning', content: res.Error });
							// console.error(res);
							props.form.EmptyAllFormValue(card_from_id);
							props.cardTable.updateDataByRowId(card_table_id, { rows: [] });
							props.form.setFormItemsDisabled(card_from_id, { 'memo': true, 'busitype': true, 'pk_currtype': true, 'isreversebustype': true });
							toast({ color: 'warning', content: res.message });
						}
					});
				} else {
					props.form.EmptyAllFormValue(card_from_id);
					props.cardTable.updateDataByRowId(card_table_id, { rows: [] });
					props.form.setFormItemsDisabled(card_from_id, { 'memo': true, 'busitype': true, 'pk_currtype': true, 'isreversebustype': true });
				}
				// setTimeout(()=>{
				// 	afterEvent(props,card_from_id,'busitype',props.form.getFormItemsValue(card_from_id,'busitype').value);
				// },0);
				//主组织处理
				// props.resMetaAfterPkorgEdit();
			}

		}

	}
	//下拨银行账户
	if (key === 'pk_bankacc_p') {
		let eventdata = props.createBodyAfterEventData(link_card_page_id, card_from_id, [card_table_id], card_table_id, key, changedrows);
		//获取编辑的值
		newvalue = eventdata.newvalue ? eventdata.newvalue.value : '';
		oldvalue = eventdata.oldvalue ? eventdata.oldvalue.value : '';
		if (newvalue == oldvalue) {//值未发生改变，直接跳出
			console.log(eventdata);
			if (props.cardTable.getValByKeyAndIndex(card_table_id, i, 'pk_bankacc_p').value != undefined) {
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventdata) },
					success: (res) => {
						if (res.success) {
							let { success, data } = res;
							let { card, extParam, headItemProps, bodyItemProps } = data;
							let { head, bodys } = card;
							props.cardTable.updateDataByRowId(card_table_id, bodys[card_table_id]);
							// let tableItemProps = bodyItemProps[card_table_id];
							// props.cardTable.setEditableByRowId(card_table_id,
							// 	tableItemProps[0].rowID,
							// 	'isnetpay',
							// 	true);
							setBodyItemProp(props, card_table_id, bodyItemProps, bodys[0]);
							if (data.extParam.warning) {
								props.cardTable.setValByKeyAndIndex(card_table_id, i, 'pk_bankacc_p', { 'value': null, 'display': null });
								toast({ color: 'warning', content: res.data.extParam.warning });
							}

						}
					}
				});
			}
		}

	}
	if (key == 'pk_bankacc_r') {
		data = props.createBodyAfterEventData(link_card_page_id, card_from_id, [card_table_id], card_table_id, key, changedrows);
		//获取编辑的值
		newvalue = data.newvalue ? data.newvalue.value : '';
		oldvalue = data.oldvalue ? data.oldvalue.value : '';
		if (newvalue == oldvalue) {//值未发生改变，直接跳出
			if (props.cardTable.getValByKeyAndIndex(card_table_id, i, 'pk_bankacc_p').value != undefined) {
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(data) },
					success: (res) => {
						if (res.success) {
							let { success, data } = res;
							let { card, extParam, headItemProps, bodyItemProps } = data;
							let { head, bodys } = card;
							props.cardTable.updateDataByRowId(card_table_id, bodys[card_table_id]);
							setBodyItemProp(props, card_table_id, bodyItemProps, bodys[0]);
							if (data.extParam.warning) {
								props.cardTable.setValByKeyAndIndex(card_table_id, i, 'pk_bankacc_r', { 'value': null, 'display': null });
								props.cardTable.setValByKeyAndIndex(card_table_id, i, 'bankaccname_r', { 'value': null, 'display': null });
								toast({ color: 'warning', content: res.data.extParam.warning });
							}
						}
					}
				});
			}
		}

	}
	if (key == 'isnetpay') {
		data = props.createBodyAfterEventData(link_card_page_id, card_from_id, [card_table_id], card_table_id, key, changedrows);
		//获取编辑的值
		newvalue = data.newvalue ? data.newvalue.value : '';
		oldvalue = data.oldvalue ? data.oldvalue.value : '';
		if (newvalue == oldvalue) {//值未发生改变，直接跳出
			console.log(data);
			if (props.cardTable.getValByKeyAndIndex('table_allocate_01', i, 'isnetpay').value != undefined) {
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(data) },
					success: (res) => {
						if (res.success) {
							let { success, data } = res;
							let { card, extParam, headItemProps, bodyItemProps } = data;
							let { head, bodys } = card;
							props.cardTable.updateDataByRowId(card_table_id, bodys[card_table_id]);
							//设置pk_accid（收款单位内部账户）编辑性
							setBodyItemProp(props, card_table_id, bodyItemProps, bodys[0]);
							let isnetpay = props.cardTable.getValByKeyAndIndex('table_allocate_01', i, 'isnetpay').value;
							if (!isnetpay) {
								props.cardTable.setValByKeyAndIndex(card_table_id, i, 'paytype', { 'value': null, 'display': null });
							}
							//新增行可点击
							props.button.setButtonDisabled(['addline'], false);
						}
					}
				});

			}
		}


	}
	//交易类型
	if (key == 'busitype') {
		debugger;
		data = props.createHeadAfterEventData(link_card_page_id, card_from_id, [card_table_id], card_from_id, key, changedrows);
		//获取编辑的值
		extParam = { 'uiState': status };
		newvalue = data.newvalue ? data.newvalue.value : '';
		oldvalue = data.oldvalue ? data.oldvalue.value : '';
		// if(newvalue==oldvalue){//值未发生改变，直接跳出
		console.log(data);
		let busitype = value;
		if (!busitype) {
			busitype = props.form.getFormItemsValue(card_from_id, 'busitype').value
		}
		if (busitype != undefined) {
			ajax({
				url: '/nccloud/sf/allocation/event.do',
				data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(data), extParam },
				success: (res) => {
					debugger;
					if (res.success && res.data) {
						let { success, data } = res;
						let { card, extParam, headItemProps, bodyItemProps } = data;
						let { head, bodys } = card;
						props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
						if (bodyItemProps) {
							setBodyItemProp(props, card_table_id, bodyItemProps, bodys[0]);
						}
						//判断交易类型是中心下拨吗，不是的话收款单位参照改为财务组织-资金管控
						if (busitype != '2') {
							let meta = props.meta.getMeta();
							meta[card_table_id].items.find((e) => e.attrcode == 'pk_org_r').refCode = '../../../../../uapbd/refer/org/FundManaSystemMemberByFinancePKTreeRef';
						}
						//制空收款单位
						let indexs = props.cardTable.getNumberOfRows(card_table_id);
						for (let i = 0; i < indexs; i++) {
							props.cardTable.setValByKeyAndIndex(card_table_id, i, 'pk_org_r', { value: null, display: null });
							props.cardTable.setValByKeyAndIndex(card_table_id, i, 'pk_accid_r', { value: null, display: null });
						}
					}

				},
				error: (res) => {
					debugger;
					props.form.setFormItemsValue(card_from_id, { 'busitype': { 'value': null, 'display': null } });
					toast({ color: 'warning', content: res.message });
					return;
				}

			});
		}
		// }

	}

	//币种
	if (key == 'pk_currtype') {
		data = props.createHeadAfterEventData(link_card_page_id, card_from_id, [card_table_id], card_from_id, key, changedrows);
		//获取编辑的值
		extParam = { 'uiState': status };
		newvalue = data.newvalue ? data.newvalue.value : '';
		oldvalue = data.oldvalue ? data.oldvalue.value : '';
		if (newvalue == oldvalue) {//值未发生改变，直接跳出
			console.log(data);
			if (props.form.getFormItemsValue(card_from_id, 'pk_currtype').value != undefined) {
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(data), extParam },
					success: (res) => {
						if (res.success && res.data) {
							let { success, data } = res;
							let { card, extParam, headItemProps, bodyItemProps } = data;
							let { head, bodys } = card;
							props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
							props.cardTable.updateDataByRowId(card_table_id, bodys[card_table_id]);
							let rows = props.cardTable.getNumberOfRows(card_table_id);
							for (let index = 0; index < rows; index++) {
								//清除表体某些字段的值
								props.cardTable.setValByKeyAndIndex(card_table_id, index, 'pk_bankacc_p', { value: '', display: '' });
								props.cardTable.setValByKeyAndIndex(card_table_id, index, 'bankname_p', { value: '', display: '' });
								props.cardTable.setValByKeyAndIndex(card_table_id, index, 'pk_bankacc_r', { value: '', display: '' });
								props.cardTable.setValByKeyAndIndex(card_table_id, index, 'bankaccname_r', { value: '', display: '' });
								props.cardTable.setValByKeyAndIndex(card_table_id, index, 'pk_accid_r', { value: '', display: '' });

								let tableItemProps = bodyItemProps[card_table_id];
								let tableValue = bodys[0];
								if (tableItemProps == undefined) {
									return;
								}
								let flag = '';
								for (let i = 0; i < tableItemProps.length; i++) {
									if (tableItemProps[i].editable === 'true') {
										flag = false;
									} else {
										flag = true;
									}
									// 设定每行的可编辑行 setEditableByRowId,目前方法不好使 等待平台张横修复  xuhrc 2018-7-30
									props.cardTable.setEditableByIndex(card_table_id,
										index,
										tableItemProps[i].itemName,
										flag);
								}
							}

						}

					},
					error: (res) => {
						props.form.setFormItemsValue(card_from_id, { 'pk_currtype': { 'value': null, 'display': null } });
						// toast({ color: 'warning', content: res.Error });
						// console.error(res);
						toast({ color: 'warning', content: res.message });
					}

				});
				// if(props.form.getFormItemsValue(card_from_id,'busitype')=='2') {
				// 	props.cardTable. setFormItemsDisabled(card_table_id,{'name':'pk_accid_r','sex':'true'})
				// }else {
				// 	props.form.setFormItemsDisabled(card_table_id,{'name':'pk_accid_r','sex':'false'})
				// }
			}
		}

	}
	//收款单位
	if (key == 'pk_org_r') {
		data = props.createBodyAfterEventData(link_card_page_id, card_from_id, [card_table_id], card_table_id, key, changedrows);
		//获取编辑的值
		newvalue = data.newvalue ? data.newvalue.value : '';
		oldvalue = data.oldvalue ? data.oldvalue.value : '';
		if (newvalue == oldvalue) {//值未发生改变，直接跳出
			console.log(data);
			if (props.cardTable.getValByKeyAndIndex('table_allocate_01', i, 'pk_org_r').value != undefined) {
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(data) },
					success: (res) => {
						if (res.success) {
							let { success, data } = res;
							let { card, extParam, headItemProps, bodyItemProps } = data;
							let { head, bodys } = card;
							props.cardTable.updateDataByRowId(card_table_id, bodys[card_table_id]);
							// props.cardTable.setTableData(card_table_id, bodys[card_table_id]);
						}
					}
				});
			}
		}

	}
	//冲销业务
	if (key == 'isreversebustype') {
		data = props.createHeadAfterEventData(link_card_page_id, card_from_id, [card_table_id], card_from_id, key, changedrows);
		//获取编辑的值
		newvalue = data.newvalue ? data.newvalue.value : '';
		oldvalue = data.oldvalue ? data.oldvalue.value : '';
		if (newvalue == oldvalue) {//值未发生改变，直接跳出
			console.log(data);
			let isreversebustype = data.newvalue.value;
			if (isreversebustype != undefined) {
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(data) },
					success: (res) => {
						if (res.success) {
							let { data } = res;
							let { card, extParam, headItemProps, bodyItemProps } = data;
							let { head, bodys } = card;
							props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
							props.cardTable.updateDataByRowId(card_table_id, bodys[card_table_id]);
							//设置pk_accid（收款单位内部账户）编辑性
							setBodyItemProp(props, card_table_id, bodyItemProps, bodys[0]);
							//新增行可点击
							props.button.setButtonDisabled(['addline'], false);
						}
					}
				});
			}
		}

	}

	if (key == 'amount') {
		data = props.createBodyAfterEventData(link_card_page_id, card_from_id, [card_table_id], card_table_id, key, changedrows);
		//获取编辑的值
		newvalue = data.newvalue ? data.newvalue.value : '';
		oldvalue = data.oldvalue ? data.oldvalue.value : '';
		if (newvalue == oldvalue) {//值未发生改变，直接跳出
			console.log(data);
			let amount = props.cardTable.getValByKeyAndIndex('table_allocate_01', i, 'amount').value;
			let isreversebustype = props.form.getFormItemsValue('form_allocate_01', 'isreversebustype').value;
			if (isreversebustype) {
				if (amount > 0) {
					toast({
						'color': 'warning',
						'content': loadMultiLang(this.props,'36320FA-000001')/* 国际化处理： 冲销业务只能输入负数*/
					});
					return;
				}
			} else {
				if (amount < 0) {
					toast({
						'color': 'warning',
						'content': loadMultiLang(this.props,'36320FA-000002')/* 国际化处理： 金额必须大于0*/
					});
					return;
				}
			}
			if (props.cardTable.getValByKeyAndIndex('table_allocate_01', i, 'amount').value != undefined) {
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(data) },
					success: (res) => {
						if (res.success) {
							let { success, data } = res;
							let { card, extParam, headItemProps, bodyItemProps } = data;
							let { head, bodys } = card;
							props.cardTable.updateDataByRowId(card_table_id, bodys[card_table_id]);
							// let olcrate=bodys[card_table_id].rows[0].values.olcrate.value;
							// let olcamount=bodys[card_table_id].rows[0].values.olcamount.value;
							// let glcrate=bodys[card_table_id].rows[0].values.glcrate.value;
							// let glcamount=bodys[card_table_id].rows[0].values.glcamount.value;
							// let gllcrate=bodys[card_table_id].rows[0].values.gllcrate.value;
							// let gllcamount=bodys[card_table_id].rows[0].values.gllcamount.value;
							// let rowid=bodys[card_table_id].rows[0].rowid;
							// props.cardTable.setValByKeyAndRowId(card_table_id,rowid,'olcrate',{value:olcrate});
							// props.cardTable.setValByKeyAndRowId(card_table_id,rowid,'olcamount',{value:olcamount});
							// props.cardTable.setValByKeyAndRowId(card_table_id,rowid,'glcrate',{value:glcrate});
							// props.cardTable.setValByKeyAndRowId(card_table_id,rowid,'glcamount',{value:glcamount});
							// props.cardTable.setValByKeyAndRowId(card_table_id,rowid,'gllcrate',{value:gllcrate});
							// props.cardTable.setValByKeyAndRowId(card_table_id,rowid,'gllcamount',{value:gllcamount});
							// let rows=props.cardTable.getNumberOfRows(card_table_id);
							setBodyItemProp(props, card_table_id, bodyItemProps, bodys);

						}
					}
				});
			}
		}
	}

	if (key === 'dbilldate') {
		//表头编辑后事件
		// let data = props.createHeadAfterEventData('20521030', this.formId, this.tableId, moduleId, key, value);
		// ajax({
		// 	url: '/nccloud/reva/revebill/afteredit.do',
		// 	data: data,
		// 	success: (res) => {
		// 		if (res.data && res.data.head && res.data.head.head) {
		// 			let dealmny = res.data.head.head.rows[0].values.ndealtotalmny;
		// 			props.form.setFormItemsValue(moduleId, { ndealtotalmny: dealmny });
		// 		}
		// 	}
		// });
	}

	if (key === 'cmaterialvid') {
		let materialsNew = value;
		console.log(materialsNew)
		if (materialsNew && materialsNew.length > 1) {
			props.cardTable.setValByKeyAndIndex(moduleId, i, key, { value: materialsNew[0].refpk, display: materialsNew[0].refname });
			for (let i = 1; i < materialsNew.length; i++) {
				props.cardTable.addRow(moduleId);
				let ll = props.cardTable.getNumberOfRows(moduleId);
				props.cardTable.setValByKeyAndIndex(moduleId, ll - 1, key, { value: materialsNew[i].refpk, display: materialsNew[i].refname });
			}
		}
	}


	//表体编辑后事件
	if (key == 'fconfirmpoint') {
		let data = props.createBodyAfterEventData('20521030', card_from_id, card_table_id, moduleId, key, changedrows);
		// ajax({
		// 	url: '/nccloud/reva/revebill/cardafteredit.do',
		// 	data: data,
		// 	success: (res) => {
		// 		debugger
		// 		if (res.data && res.data.body && res.data.body[this.tableId]) {
		// 			let npobnum = res.data.body[this.tableId].rows[0].values.npobnum;
		// 			props.cardTable.setValByKeyAndRowNumber(moduleId, i+1,'npobnum',npobnum.value);
		// 		}
		// 	}
		// });
	}


}

/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/