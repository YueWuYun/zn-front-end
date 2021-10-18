/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';

import {
	app_id, module_id, base_url, button_limit,oid,
	list_search_id, list_table_id, 
	card_page_id, card_from_id, card_fromtail_id,card_table_id 
} from '../../cons/constant.js';
import  {beforeEvent}  from './index';
import  {changePkorgPRefer}  from './index';

let { NCMessage } = base;

export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g, isAutoSet) {
	// console.log(props, moduleId, key, value, changedrows, i, s, g)
	let table_id = card_table_id;
	let form_id = card_from_id;
	let page_id = card_page_id;

	let cardData = this.props.createMasterChildData(page_id, card_from_id, table_id);

	let that = this;
	//form中编辑后事件
	if (moduleId === form_id) {
		//组织变换编辑后事件
		if (key === 'pk_org') {
			let orgid = value.value;
			if (orgid && Object.keys(orgid).length != 0) {
				//给表体字段赋值
				// props.cardTable.setValByKeyAndIndex(table_id, 0, key, { value: orgid, display: orgid });
				//请求后台获取币种和汇率
				let data = props.createHeadAfterEventData(page_id, moduleId, table_id, moduleId, key, value);
				let newvalue = data.newvalue && data.newvalue.value;
				let oldvalue = data.oldvalue && data.oldvalue.value;
				if(newvalue){
					// /清空表单form所有数据
					this.props.form.EmptyAllFormValue(this.formId);
					this.backvbillno = '';
					//清空table所有数据
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
					if(isAutoSet){
						oldvalue = null;
					}
					if (newvalue != oldvalue) {
						//先清空之前做的修改
						if (oldvalue) {
							cardData.head[card_from_id].rows[0].values.pk_org.value = oldvalue;
							cardData.head[card_from_id].rows[0].values.pk_org.display = data.oldvalue.display;
							//首次填写财务组织，不进行清空
							promptBox({
								color: "warning",
								/* 国际化处理： 确认修改*/
								title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000057'),
								/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
								content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000058'),
								//点击确定按钮事件
								beSureBtnClick: this.changeOrgConfirm.bind(this, data),
								//取消按钮事件回调
								cancelBtnClick: this.changeOrgCancel.bind(this, cardData),
							});
						} else {
							ajax({
								url: '/nccloud/sf/delivery/deliveryheadafterevent.do',
								data: data,
								async: false,
								success: (res) => {
									if (res.success) {
										if (res.data) {
											//选择主组织以后，恢复其他字段的编辑性
											props.resMetaAfterPkorgEdit();
											// 组织可编辑
											this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });
											//设置form的编辑属性
											if (res.data.billCard.head) {
												//页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
												props.form.setAllFormValue({ [moduleId]: res.data.billCard.head[moduleId] });
											}
											if(res.data.refWhereInfo4NCC.wherePart){
												this.setState({
													pk_org_pWherePart: res.data.refWhereInfo4NCC.wherePart
												});
											}
											if(res.data.refWhereInfo4NCC.error){
												props.form.setFormItemsValue(card_from_id,{'busitype':{ value: null, display: null }});
												toast({ color: 'warning', content: res.data.refWhereInfo4NCC.error });
												return;
											}
											if(!isAutoSet){
												this.props.cardTable.addRow(card_table_id);
											}
										}
									}
								}
							});
							// 增行
							// this.props.cardTable.addRow(this.tableId);
							// this.props.cardTable.setValByKeyAndIndex(this.tableId, 0, 'amount', { value: 0 });
							// this.props.cardTable.setValByKeyAndIndex(this.tableId, 0, 'glcamount', { value: 0 });
							// this.props.cardTable.setValByKeyAndIndex(this.tableId, 0, 'gllcamount', { value: 0 });
						}
					}
					props.button.setButtonDisabled([   
						// 新增行   删除行 复制行
						'addline', 'delline', 'copyline',
					], false);
				}
			}else{
				//单据有主组织，新增时,将其他字段设置为不可编辑.
				props.initMetaByPkorg(); 
			}
		}
		//币种
		if (key === 'pk_currtype') {
			//表体table行数
			let rowCount = props.cardTable.getNumberOfRows(table_id);
			for(var i = 0; i < rowCount; i++){
				props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_accid', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_bankacc_p', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_bankacc_r', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(table_id, i, 'bankname_p', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(table_id, i, 'bankname_r', { value: null, display: null });
			}
			let pk_currtypedata = props.createHeadAfterEventData(page_id, moduleId, table_id, moduleId, key, value);
			let pk_currtype_newvalue = pk_currtypedata.newvalue.value;
			let pk_currtype_oldvalue = pk_currtypedata.oldvalue.value;
			if(pk_currtype_newvalue){
				if (pk_currtype_newvalue != pk_currtype_oldvalue) {
					ajax({
						url: '/nccloud/sf/delivery/deliveryheadafterevent.do',
						data: pk_currtypedata,
						async: false,
						success: (res) => {
							if (res.success) {
								if (res.data) {
									if (res.data.head) {
										//页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
										props.form.setAllFormValue({ [moduleId]: res.data.head[moduleId] });
									}
									if (res.data.body) {
										this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
									}
								}
							}
						}
					});
				}
			}
		}
		// 交易类型
		if (key === 'busitype') {
			let busitype = value.value;
			if (busitype) {
				let busitypedata = props.createHeadAfterEventData(page_id, moduleId, table_id, moduleId, key, value);
				let busitype_newvalue = busitypedata.newvalue.value;
				let busitype_oldvalue = busitypedata.oldvalue.value;
				if(busitype_newvalue){
					if (busitype_newvalue != busitype_oldvalue) {
						ajax({
							url: '/nccloud/sf/delivery/deliveryheadafterevent.do',
							data: busitypedata,
							async: false,
							success: (res) => {
								if (res.success) {
									if (res.data) {
										if(res.data.wherePart){
											this.setState({
												pk_org_pWherePart: res.data.wherePart
											});
											changePkorgPRefer(props, busitype_newvalue, res.data.wherePart);
										}
										if(res.data.error){
											props.form.setFormItemsValue(card_from_id,{'busitype':{ value: null, display: null }});
											toast({ color: 'warning', content: res.data.error });
											return;
										}
										// beforeEvent.call(that,that.props, table_id, "pk_org_p", null, null, null, null);
									}
								}
							}
						});
					}
					// 中心上收
					let rowCount = props.cardTable.getNumberOfRows(table_id);
					if(rowCount > 0){
						if(busitype != 2){
							for(var i = 0; i < rowCount; i++){
								props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_accid', { value: null, display: null });
								props.cardTable.setEditableByIndex(table_id, i, 'pk_accid', false);
							}
						}else{
							for(var i = 0; i < rowCount; i++){
								props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_accid', { value: null, display: null });
								props.cardTable.setEditableByIndex(table_id, i, 'pk_accid', true);
							}
						}
						props.cardTable.setColsValue(table_id, [{ key:'pk_bankacc_p', data: { display: null, value: null }} ]);
						props.cardTable.setColsValue(table_id, [{ key:'bankname_p', data: { display: null, value: null }} ]);
					}
					props.cardTable.setColsValue(table_id, [{ key:'pk_org_p', data: { display: null, value: null }} ]);
				}
			}
		}
		// 冲销业务
		if (key === 'isreversebusitype') {
			//表体table行数
			let rowCount = props.cardTable.getNumberOfRows(table_id);
			if(rowCount > 0){
				for(var i = 0; i < rowCount; i++){
					props.cardTable.setValByKeyAndIndex(table_id, i, 'isnetpay', { value: null, display: null });
					props.cardTable.setValByKeyAndIndex(table_id, i, 'pay_type', { value: null, display: null });
					props.cardTable.setValByKeyAndIndex(table_id, i, 'issamebank', { value: null, display: null });
					props.cardTable.setValByKeyAndIndex(table_id, i, 'issamecity', { value: null, display: null });
	
					props.cardTable.setEditableByIndex(table_id, i, 'isnetpay', false);
					props.cardTable.setEditableByIndex(table_id, i, 'pay_type', false);
					props.cardTable.setEditableByIndex(table_id, i, 'issamebank', false);
					props.cardTable.setEditableByIndex(table_id, i, 'issamecity', false);
				}

				let isreversebusitype = value.value;
				if (isreversebusitype) {
					let isreversedata = props.createHeadAfterEventData(page_id, moduleId, table_id, moduleId, key, value);
					let isreverse_newvalue = isreversedata.newvalue.value;
					let isreverse_oldvalue = isreversedata.oldvalue.value;
					if(isreverse_newvalue){
						if (isreverse_newvalue != isreverse_oldvalue) {
							ajax({
								url: '/nccloud/sf/delivery/deliveryheadafterevent.do',
								data: isreversedata,
								async: false,
								success: (res) => {
									if (res.success) {
										if (res.data) {
											//设置form的编辑属性
											if (res.data.billCard.head) {
	
											}
											// 设置字段编辑性
											if (res.data.billCard.body) {
												let bodyDatas = res.data.billCard.body[card_table_id].rows;
												let bodyFileEditMap = res.data.bodyFileEditMap;
												if(bodyFileEditMap){
													for (let index = 0; index < bodyDatas.length; index++) {
														const pk_delivery_b = bodyDatas[index].values.pk_delivery_b.value;
														let fileEditMap = bodyFileEditMap[pk_delivery_b];
														for(var key in fileEditMap){
															//每一次循环获取的属性名
															// 获取属性值 在for in 中只能通过对象名[key]来获取 不能写obj.key
															this.props.cardTable.setEditableByIndex(card_table_id, index, key, fileEditMap[key]);
														}
													}
												}
											}
										}
									}
								}
							});
						}
					}
				}else{
					for(var i = 0; i < rowCount; i++){
						props.cardTable.setEditableByIndex(table_id, i, 'isnetpay', true);
						// props.cardTable.setEditableByIndex(table_id, i, 'pay_type', true);
						// props.cardTable.setEditableByIndex(table_id, i, 'issamebank', true);
						// props.cardTable.setEditableByIndex(table_id, i, 'issamecity', true);
					}
				}
			}
		}
	}
	//table中编辑后事件操作表格该行i
	if (moduleId === table_id) {
		//表体table行数
		let opatorRow = props.cardTable.getNumberOfRows(table_id);
		// 缴款单位 
		if (key === 'pk_org_p') {
			if(value){
				props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_bankacc_p', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_accid', { value: null, display: null });
				
				let data = props.createBodyAfterEventData(page_id, form_id, moduleId, moduleId, key, changedrows, i);
				if(data){
					let newvalue = data.changedrows[0].newvalue.value;
					let oldvalue = data.changedrows[0].oldvalue.value;
					if (newvalue != oldvalue) {
						ajax({
							url: '/nccloud/sf/delivery/deliverybodyafterevent.do',
							data: data,
							async: false,
							success: (res) => {
								if (res.success) {
									if (res.data) {
										if (res.data.head) {
											this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
										}
										if (res.data.body) {
											// this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
											this.props.cardTable.updateDataByRowId(card_table_id, res.data.body[card_table_id]);
											
											this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
											this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
										}
									}
								}
							}
						});
					}else{
						this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
						this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
					}
				}
			}else{
				// 触发后台编辑事件后需要重新设置编辑性
				this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
				this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
			}
		}
		// 上收银行账户
		if (key === 'pk_bankacc_r') {
			if(value && value.refpk){
				// 缴款单位银行账户
				let pk_bankacc_p = props.cardTable.getValByKeyAndIndex(table_id, i, 'pk_bankacc_p');
				if(pk_bankacc_p && value.refpk === pk_bankacc_p.value){
					toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000000') });/* 国际化处理： 不能和缴款单位账户相同*/
					props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_bankacc_p', { value: null, display: null });
					return;
				}
				let data = props.createBodyAfterEventData(page_id, form_id, moduleId, moduleId, key, changedrows, i);
				if(data){
					let newvalue = data.changedrows[0].newvalue.value;
					let oldvalue = data.changedrows[0].oldvalue.value;
					if (newvalue != oldvalue) {
						ajax({
							url: '/nccloud/sf/delivery/deliverybodyafterevent.do',
							data: data,
							async: false,
							success: (res) => {
								if (res.success) {
									if (res.data) {
										if (res.data.head) {
											this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
										}
										if (res.data.body) {
											this.props.cardTable.updateDataByRowId(card_table_id, res.data.body[card_table_id]);
										}
										// 触发后台编辑事件后需要重新设置编辑性
										this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
										this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
									}
								}
							}
						});
					}
				}
			}else{
				props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_bankacc_r', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(table_id, i, 'bankacccode_r', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(table_id, i, 'bankaccname_r', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(table_id, i, 'bankname_r', { value: null, display: null });
			}
		}
		// 缴款单位银行账户
		if (key === 'pk_bankacc_p') {
			let pk_org_p = props.cardTable.getValByKeyAndIndex(table_id, i, 'pk_org_p');
			if(!pk_org_p){
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000001') });/* 国际化处理： 请录入缴款单位*/
				return;
			}
			if(value && value.refpk){
				// 缴款单位银行账户
				let pk_bankacc_r = props.cardTable.getValByKeyAndIndex(table_id, i, 'pk_bankacc_r');
				if(pk_bankacc_r && value.refpk === pk_bankacc_r.value){
					toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000002') });/* 国际化处理： 不能和上收银行账户相同*/
					props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_bankacc_r', { value: null, display: null });
					return;
				}
				let isreversebusitype = props.cardTable.getValByKeyAndIndex(table_id, i, 'isreversebusitype');
				if (isreversebusitype && isreversebusitype.value){
					props.cardTable.setEditableByIndex(table_id, i, 'isnetpay', false);
					props.cardTable.setEditableByIndex(table_id, i, 'pay_type', false);
				}
				let data = props.createBodyAfterEventData(page_id, form_id, moduleId, moduleId, key, changedrows, i);
				if(data){
					let newvalue = data.changedrows[0].newvalue.value;
					let oldvalue = data.changedrows[0].oldvalue.value;
					if (newvalue != oldvalue) {
						ajax({
							url: '/nccloud/sf/delivery/deliverybodyafterevent.do',
							data: data,
							async: false,
							success: (res) => {
								if (res.success) {
									if (res.data) {
										if (res.data.head) {
											this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
										}
										if (res.data.body) {
											// this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
											this.props.cardTable.updateDataByRowId(card_table_id, res.data.body[card_table_id]);
											let isnetpay = res.data.body[card_table_id].rows[0].values.isnetpay;
											if(isnetpay && isnetpay.value){
												props.cardTable.setEditableByIndex(table_id, i, 'isnetpay', true);
												props.cardTable.setEditableByIndex(table_id, i, 'pay_type', true);
												props.cardTable.setEditableByIndex(table_id, i, 'issamebank', true);
												props.cardTable.setEditableByIndex(table_id, i, 'issamecity', true);
											}else{
												props.cardTable.setEditableByIndex(table_id, i, 'isnetpay', false);
												props.cardTable.setEditableByIndex(table_id, i, 'pay_type', false);
												props.cardTable.setEditableByIndex(table_id, i, 'issamebank', false);
												props.cardTable.setEditableByIndex(table_id, i, 'issamecity', false);
											}
											// 触发后台编辑事件后需要重新设置编辑性
											// this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
											// this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
										}
									}
								}
							}
						});
					}
				}
			}else{
				// 触发后台编辑事件后需要重新设置编辑性
				this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
				this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
			}
		}
		// 缴款单位内部账户
		if (key === 'pk_accid') {
			let pk_org_p = props.cardTable.getValByKeyAndIndex(table_id, i, 'pk_org_p');
			if(!pk_org_p){
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000001') });/* 国际化处理： 请录入缴款单位*/
				return;
			}
		}
		// 是否网银上收
		if (key === 'isnetpay') {
			props.cardTable.setValByKeyAndIndex(table_id, i, 'pay_type', { value: null, display: null });
			props.cardTable.setValByKeyAndIndex(table_id, i, 'issamebank', { value: null, display: null });
			props.cardTable.setValByKeyAndIndex(table_id, i, 'issamecity', { value: null, display: null });
			if(value){
				props.cardTable.setEditableByIndex(table_id, i, 'pay_type', true);
				props.cardTable.setEditableByIndex(table_id, i, 'issamebank', true);
				props.cardTable.setEditableByIndex(table_id, i, 'issamecity', true);
				props.cardTable.setValByKeyAndIndex(table_id, i, 'pay_type', { value: '0', display: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000003') });/* 国际化处理： 普通*/
			}else{
				props.cardTable.setEditableByIndex(table_id, i, 'pay_type', false);
				props.cardTable.setEditableByIndex(table_id, i, 'issamebank', false);
				props.cardTable.setEditableByIndex(table_id, i, 'issamecity', false);
				props.cardTable.setValByKeyAndIndex(table_id, i, 'pay_type', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(table_id, i, 'issamebank', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(table_id, i, 'issamecity', { value: null, display: null });

				// 触发后台编辑事件后需要重新设置编辑性
				this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
				this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
			}
		}
		// 上收金额
		if (key === 'amount') {
			if(value){
				let data = props.createBodyAfterEventData(page_id, form_id, moduleId, moduleId, key, changedrows, i);
				if(data){
					let newvalue = data.changedrows[0].newvalue && data.changedrows[0].newvalue.value;
					let oldvalue = data.changedrows[0].oldvalue && data.changedrows[0].oldvalue.value;
					if (newvalue != oldvalue) {
						ajax({
							url: '/nccloud/sf/delivery/deliverybodyafterevent.do',
							data: data,
							async: false,
							success: (res) => {
								if (res.success) {
									if (res.data) {
										let amount_currtype = props.form.getFormItemsValue(card_from_id, 'pk_currtype');
										if (res.data.head) {
											this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
										}
										if (res.data.body) {
											this.props.cardTable.updateDataByRowId(card_table_id, res.data.body[card_table_id]);
										}
										if(amount_currtype && res.data.head[card_from_id].rows[0].values.pk_currtype && 
											res.data.head[card_from_id].rows[0].values.pk_currtype.value == amount_currtype.value){
											// 本币汇率不可编辑 
											this.props.cardTable.setEditableByIndex(card_table_id, i, 'olcrate', false);
										}else{
											if(amount_currtype){
												this.props.form.setFormItemsValue(this.formId, 
													{'pk_currtype':{
														value: amount_currtype.value,
														display: amount_currtype.display
													}
												});
											}
										}
										// 触发后台编辑事件后需要重新设置编辑性
										this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
										this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
									}
								}
							}
						});
					}
				}
			}
		}
	}

}

/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/