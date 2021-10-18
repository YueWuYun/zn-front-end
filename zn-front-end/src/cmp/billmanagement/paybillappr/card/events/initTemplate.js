/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import tableButtonClick from './tableButtonClick';
import { buttonVisible } from './buttonVisible';
import CustBankAccGridRef from '../../../../../uapbd/refer/pub/CustBankAccGridRef';
import CashAccountGridRef from '../../../../../uapbd/refer/sminfo/CashAccountGridRef';
import FundPlanTreeRef from '../../../../../uapbd/refer/fiacc/FundPlanTreeRef';
import InoutBusiClassTreeRef from '../../../../../uapbd/refer/fiacc/InoutBusiClassTreeRef';
import Bill4CmpPayGridRef from '../../../../../fbm/refer/fbm/Bill4CmpPayGridRef';
let formId = 'head';
let tableId = 'paybilldetail_table';
let pageId = '36070PBR_C03';
export default function(props) {
	let that = this;
	props.createUIDom(
		{
			
			pagecode: pageId, //页面id
			appid: '0001Z61000000003H1O2', //注册按钮的id
			appcode:'36070PBRAPPR'
		},
		function(data) {
			if (data) {
				debugger;
				if (data.template) {
					let meta = data.template;
					modifierMeta(that,props, meta);
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
						buttonVisible.call(that,props);
					});
				}
				//修改页面状态
				//togglePageShow(props);
			}
		}
	);
}

function modifierMeta(that,props, meta) {
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

	meta[formId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = false;

	//财务组织:全加载
	meta[formId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	meta[formId].items.map((item) => {
	if (item.attrcode == 'pk_org') {
		item.queryCondition = () => {
			return {
				funcode: '36070PBR',
				TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
			};
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
				let mon_account_currtype_value = props.form.getFormItemsValue(formId, 'pk_currtype').value;
				return {
					 pk_org: orgid,
					pk_currtype: mon_account_currtype_value,
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder'//自定义增加的过滤条件-现金账户
				 };
			};
		}
	});
	//table中现金账户
	meta[tableId].items.map((item) => {
		// debugger;
		if (item.attrcode == 'mon_account') {
			item.render = function (text, record, index) {
				return (
					CashAccountGridRef({
						queryCondition: () => {
							let cash_orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
							let cash_curr_type = props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_currtype');
							if (cash_curr_type && cash_curr_type.value) {
								cash_curr_type = cash_curr_type.value;
							} else {
								cash_curr_type = null;
							}
							return {
								pk_org: cash_orgid , // 这里对record.values.materiel要做一下非空校验
								pk_currtype: cash_curr_type,
								GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder'//自定义增加的过滤条件-现金账户
							};
						}
					})
				);
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
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsSupplierGridRefSqlBuilder'
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
					refnodename: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000009'),/* 国际化处理： 使用权参照*/
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsBankaccSubDefaultGridRefSqlBuilder'
					//自定义参照过滤条件
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
					refnodename: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000009'),/* 国际化处理： 使用权参照*/
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsBankaccSubDefaultGridRefSqlBuilder' //自定义参照过滤条件
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
				return Bill4CmpPayGridRef({
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
	//table中资金项目计划
	meta[tableId].items.map((item) => {
		if (item.attrcode == 'bankroll_projet') {
			item.render = function(text, record, index) {
				return FundPlanTreeRef({
					queryCondition: () => {
						let bankroll_projet_org = props.form.getFormItemsValue(formId, 'pk_org').value;
						let bankroll_projet_group = props.form.getFormItemsValue(formId, 'pk_group').value;
						return {
							pk_org: bankroll_projet_org,
							pk_group: bankroll_projet_group
						};
					}
				});
			};
		}
	});
	//table中收支项目
	meta[tableId].items.map((item) => {
		if (item.attrcode == 'pk_recproject') {
			item.render = function(text, record, index) {
				return InoutBusiClassTreeRef({
					queryCondition: () => {
						let pk_recproject_org = props.form.getFormItemsValue(formId, 'pk_org').value;
						let pk_recproject_group = props.form.getFormItemsValue(formId, 'pk_group').value;
						return {
							pk_org: pk_recproject_org
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
		label: props.MutiInit.getIntl("36070PBRAPPR") && props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000010'),/* 国际化处理： 操作*/
		visible: true,
		itemtype: 'customer',
		width: '210px',
		fixed: 'right',
		render: (text, record, index) => {
			let buttonAry =
				props.getUrlParam('status') === 'browse'
					? [ 'openbrowse' ]:[];
					//:(that.state.pasteflag ? ['CopyAtLine']:[ 'openedit', 'copybody',  'insertline', 'deleteline' ]);
					return status === 'browse' ? <span class="row-edit-option row-btn-Open"
					onClick={()=>{
					   props.cardTable.toggleRowView('paybilldetail_table', record);
					}}>
				   {record.expandRowStatus ? props.MutiInit.getIntl('36070PBRAPPR') && props.MutiInit.getIntl('36070PBRAPPR').get('36070PBRAPPR-000116'):
					 props.MutiInit.getIntl('36070PBRAPPR') && props.MutiInit.getIntl('36070PBRAPPR').get('36070PBRAPPR-000115')
				} 
				   </span>
					: (<div className="currency-opr-col">{
						props.button.createOprationButton(buttonAry, {
							area: 'card_body_inner',
							buttonLimit:3,
							onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
						})
					}</div>
					);
		}
	};
	meta[tableId].items.push(porCol);

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/