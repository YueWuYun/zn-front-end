/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import tableButtonClick from './tableButtonClick';
import { buttonVisible } from './buttonVisible';
import CustBankAccGridRef from '../../../../../uapbd/refer/pub/CustBankAccGridRef';

import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url
} from '../../cons/constant.js';
let formId = 'head';
let tableId = 'paybilldetail_table';
let pageId = '36070PBR_D5_card';
export default function(props) {
	let _this = this;
	props.createUIDom(
		{
			pagecode: pageId, //页面id
			appid: '0001Z61000000003KX8X' //注册按钮的id
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta);
					props.meta.setMeta(meta, () => {
						if (props.getUrlParam('status') == 'add') {
							props.initMetaByPkorg();
						} else {
							props.meta.setMeta(meta);
						}
					});
				}
				if (data.button) {
					let button = data.button;
					//props.button.setButtons(button);
					props.button.setButtons(button, () => {
						buttonVisible(props);
					});
				}
				//修改页面状态
				//togglePageShow(props);
			}
		}
	);
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;

	meta[formId].items.map((item) => {
		if (item.attrcode == 'pk_fiorg') {
			item.queryCondition = () => {
				// let data = props.form.getFormItemsValue(formId, 'vbillcode').value;
				// return { pk_org: '1001A110000000000LKL' };
			};
		}
	});

	//现金账户
	//参照过滤-现金账户
	//条件根据pk_org进行过滤
	meta[formId].items.map((item) => {
		if (item.attrcode == 'mon_account') {
			item.queryCondition = () => {
				let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
				return { pk_org: orgid };
			};
		}
	});
	//table中现金账户
	meta[tableId].items.map((item) => {
		if (item.attrcode == 'mon_account') {
			item.queryCondition = () => {
				let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
				return { pk_org: orgid };
			};
		}
	});
	//收款银行账户
	meta[formId].items.map((item) => {
		if (item.attrcode == 'pk_account') {
			item.queryCondition = () => {
				// let data = props.form.getFormItemsValue(formId, 'pk_org').value;
				let pk_customer = props.form.getFormItemsValue(formId, 'pk_customer').value;
				let pk_supplier = props.form.getFormItemsValue(formId, 'pk_supplier').value;
				let pk_cust = pk_supplier; //供应商
				let acclass = 3;
				let objecttype = props.form.getFormItemsValue(formId, 'objecttype').value;
				if (objecttype == '0') {
					acclass = '1';
					pk_cust = pk_customer;
				}
				if (objecttype == '1') {
					acclass = '3';
					pk_cust = pk_supplier;
				}
				return {
					pk_cust: pk_cust,
					accclass: acclass //ExtRefSqlBuilder: 'nccloud.web.cmp.ref.CMPRecBillRefSqlBuilder'//自定义参照过滤条件
				};
			};
		}
	});

	//收款银行账户
	meta[tableId].items.map((item) => {
		if (item.attrcode == 'pk_account') {
			item.render = function(text, record, index) {
				return CustBankAccGridRef({
					queryCondition: () => {
						let pk_customer = (record.values.pk_customer || {}).value;
						let pk_supplier = (record.values.pk_supplier || {}).value;
						let pk_cust = pk_supplier; //供应商
						let acclass = 3;
						let objecttype = (record.values.objecttype || {}).value;
						if (objecttype == '0') {
							acclass = '1';
							pk_cust = pk_customer;
						}
						if (objecttype == '1') {
							acclass = '3';
							pk_cust = pk_supplier;
						}
						return {
							pk_cust: pk_cust,
							accclass: acclass //ExtRefSqlBuilder: 'nccloud.web.cmp.ref.CMPRecBillRefSqlBuilder'//自定义参照过滤条件
						};
					}
				});
			};
		}
	});

	//form
	meta[formId].items.map((item) => {
		if (item.attrcode == 'pk_supplier') {
			item.queryCondition = () => {
				let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
				return {
					pk_org: orgid,
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsSupplierGridRefSqlBuilder' //自定义参照过滤条件
				};
			};
		}
	});

	//table
	meta[tableId].items.map((item) => {
		if (item.attrcode == 'pk_supplier') {
			item.queryCondition = () => {
				let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
				return {
					pk_org: orgid,
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsSupplierGridRefSqlBuilder' //自定义参照过滤条件
				};
			};
		}
	});
	//付款银行账号
	meta[tableId].items.map((item) => {
		if (item.attrcode == 'pk_oppaccount') {
			item.queryCondition = () => {
				let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
				let currtype = props.form.getFormItemsValue(formId, 'pk_currtype').value;
				return {
					pk_org: orgid,
					pk_currtype: currtype,
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaysillBankSubUseTreeGridRefSqlBuilder' //自定义参照过滤条件
				};
			};
		}
	});

	//付款银行账号
	meta[formId].items.map((item) => {
		if (item.attrcode == 'pk_oppaccount') {
			item.queryCondition = () => {
				let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
				let currtype = props.form.getFormItemsValue(formId, 'pk_currtype').value;
				return {
					pk_org: orgid,
					pk_currtype: currtype,
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaysillBankSubUseTreeGridRefSqlBuilder' //自定义参照过滤条件
				};
			};
		}
	});
	//票据号过滤:组织+币种+票据类型
	meta[formId].items.map((item) => {
		if (item.attrcode == 'note_no') {
			item.queryCondition = () => {
				let note_no_org_value = props.form.getFormItemsValue(formId, 'pk_org').value; //所选组织
				let note_no_curr_value = props.form.getFormItemsValue(formId, 'pk_currtype').value; //币种
				let note_type_value = props.form.getFormItemsValue(formId, 'note_type').value; //票据类型

				return {
					pk_org: note_no_org_value,
					pk_currtype: note_type_value,
					pk_curr: note_no_curr_value
				};
			};
		}
	});
	//table中票据号过滤
	meta[tableId].items.map((item) => {
		if (item.attrcode == 'note_no') {
			item.render = function(text, record, index) {
				return Bill4CmpReceiveGridRef({
					queryCondition: () => {
						let tb_note_no_data = props.form.getFormItemsValue(formId, 'pk_org').value;
						let tb_note_curr_type = props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_currtype');
						let tb_note_no_type = props.cardTable.getValByKeyAndIndex(tableId, index, 'note_type');

						if (tb_note_curr_type && tb_note_curr_type.value) {
							tb_note_curr_type = tb_note_curr_type.value;
						}
						if (tb_note_no_type && tb_note_no_type.value) {
							tb_note_no_type = tb_note_no_type.value;
						}

						return {
							pk_org: tb_note_no_data,
							pk_currtype: tb_note_no_type,
							pk_curr: tb_note_curr_type
						};
					}
				});
			};
		}
	});
	let multiLang = props.MutiInit.getIntl('2052');
	let porCol = {
		attrcode: 'opr',
		//label: multiLang && multiLang.get('20521030-0005'),
		label: '操作',
		visible: true,
		itemtype: 'customer',
		width: '200px',
		fixed: 'right',
		render: (text, record, index) => {
			let buttonAry =
				props.getUrlParam('status') === 'browse'
					? [ 'openedit' ]
					: [ 'openedit', 'copybody', 'insertline', 'deleteline' ];
			return props.button.createOprationButton(buttonAry, {
				area: 'card_body_inner',
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick(props, key, text, record, index)
			});
		}
	};
	meta[tableId].items.push(porCol);

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/