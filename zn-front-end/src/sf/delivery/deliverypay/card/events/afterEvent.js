/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/
import { createPage, ajax, base, toast  } from 'nc-lightapp-front';

let { NCMessage } = base;

import { app_id, module_id, base_url, list_search_id,
	list_table_id, button_limit, 
	oid,card_page_id,card_from_id,
	card_fromtail_id,card_table_id } from '../../cons/constant.js';

export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g) {
	// console.log(props, moduleId, key, value, changedrows, i, s, g)
	let table_id = card_table_id;
	let form_id = card_from_id;
	let page_id = card_page_id;

	//form中编辑后事件
	if (moduleId === form_id) {
		//组织变换编辑后事件
		if (key === 'pk_org') {
			let orgid = value.value;
			let ll = props.cardTable.getNumberOfRows(table_id);//表体table行数
			let form_org_currtype = props.form.getFormItemsValue(moduleId, 'pk_currtype').value;
			let form_org_currtype_dly = props.form.getFormItemsValue(moduleId, 'pk_currtype').display;
			if (!form_org_currtype_dly) {
				form_org_currtype = null;
			}
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
					this.setState({
						vbillno: ''
					});
					//清空table所有数据
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
					if (newvalue != oldvalue) {
						//先清空之前做的修改
						if (oldvalue) {
							//首次填写财务组织，不进行清空
							props.modal.show('changeorg',{
								//点击确定按钮事件
								beSureBtnClick: this.changeOrgConfirm(data),
							});
						} else {
							ajax({
								url: '/nccloud/sf/delivery/deliveryheadafterevent.do',
								data: data,
								success: (res) => {
									if (res.success) {
										if (res.data) {
											if(res.data.error){
												props.form.setFormItemsValue(card_from_id,{'busitype':{ value: null, display: null }});
												toast({ color: 'warning', content: res.data.error });
												return;
											}
											//设置form的编辑属性
											if (res.data.head) {
												//页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
												props.form.setAllFormValue({ [moduleId]: res.data.head[moduleId] });
												//选择主组织以后，恢复其他字段的编辑性
												props.resMetaAfterPkorgEdit();
												// 组织可编辑
												this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });
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
							success: (res) => {
								if (res.success) {
									if (res.data) {
										if(res.data.error){
											props.form.setFormItemsValue(card_from_id,{'busitype':{ value: null, display: null }});
											toast({ color: 'warning', content: res.data.error });
											return;
										}
										//表体table行数
										let rowCount = props.cardTable.getNumberOfRows(table_id);
										if(rowCount > 0){
											let meta = this.props.meta.getMeta()
											this.props.renderItem('table', card_table_id, 'pk_org_p', null);
											// 中心上收
											if(busitype != 2){
												// 财务组织-资金管控
												meta[card_table_id].items.find(e=>e.attrcode === 'pk_org_p').refcode = 'uapbd/refer/org/FundManaSystemMemberByFinancePKTreeRef/index.js'
											}else{
												// 财务组织
												meta[card_table_id].items.find(e=>e.attrcode === 'pk_org_p').refcode = 'uapbd/refer/org/FinanceOrgTreeRef/index.js'
											}
										}
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
					}
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
								success: (res) => {
									if (res.success) {
										if (res.data) {
											//设置form的编辑属性
											if (res.data.billCard.head) {
	
											}
											// 设置字段编辑性
											if (res.data.billCard.body) {
												let bodyDatas = res.data.billCard.body[this.tableId].rows;
												let bodyFileEditMap = res.data.bodyFileEditMap;
												if(bodyFileEditMap){
													for (let index = 0; index < bodyDatas.length; index++) {
														const pk_delivery_b = bodyDatas[index].values.pk_delivery_b.value;
														let fileEditMap = bodyFileEditMap[pk_delivery_b];
														for(var key in fileEditMap){
															//每一次循环获取的属性名
															// 获取属性值 在for in 中只能通过对象名[key]来获取 不能写obj.key
															// this.props.form.setFormItemsDisabled(this.formId, { key: fileEditMap[key] });
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
							success: (res) => {
								if (res.success) {
									if (res.data) {
										if (res.data.head) {
											this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
										}
										if (res.data.body) {
											this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
											
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
					// NCMessage.create({ content: '不能和缴款单位账户相同', color: 'warning', position: 'top' });
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
							success: (res) => {
								if (res.success) {
									if (res.data) {
										if (res.data.head) {
											this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
										}
										if (res.data.body) {
											this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
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
				// NCMessage.create({ content: '请录入缴款单位！', color: 'warning', position: 'top' });
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000001') });/* 国际化处理： 请录入缴款单位*/
				return;
			}
			if(value && value.refpk){
				// 缴款单位银行账户
				let pk_bankacc_r = props.cardTable.getValByKeyAndIndex(table_id, i, 'pk_bankacc_r');
				if(pk_bankacc_r && value.refpk === pk_bankacc_r.value){
					// NCMessage.create({ content: '不能和上收银行账户相同', color: 'warning', position: 'top' });
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
							success: (res) => {
								if (res.success) {
									if (res.data) {
										if (res.data.head) {
											this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
										}
										if (res.data.body) {
											let isnetpay = res.data.body[card_table_id].rows[0].values.isnetpay;
											if(isnetpay && isnetpay.value === 'Y'){
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
											this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
											// 触发后台编辑事件后需要重新设置编辑性
											this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
											this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
										}
									}
								}
							}
						});
					}else{
						// 触发后台编辑事件后需要重新设置编辑性
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
		// 缴款单位内部账户
		if (key === 'pk_accid') {
			let pk_org_p = props.cardTable.getValByKeyAndIndex(table_id, i, 'pk_org_p');
			if(!pk_org_p){
				// NCMessage.create({ content: '请录入缴款单位！', color: 'warning', position: 'top' });
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000001') });/* 国际化处理： 请录入缴款单位*/
				return;
			}
		}
		// 是否网银上收
		if (key === 'isnetpay') {
			if(value){
				props.cardTable.setEditableByIndex(table_id, i, 'pay_type', true);
				props.cardTable.setEditableByIndex(table_id, i, 'issamebank', true);
				props.cardTable.setEditableByIndex(table_id, i, 'issamecity', true);
				props.cardTable.setValByKeyAndIndex(table_id, i, 'pay_type', { value: 0, display: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000003') });/* 国际化处理： 普通*/
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
							success: (res) => {
								if (res.success) {
									if (res.data) {
										let amount_currtype = props.form.getFormItemsValue(card_from_id, 'pk_currtype');
										if (res.data.head) {
											this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
										}
										if (res.data.body) {
											this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
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