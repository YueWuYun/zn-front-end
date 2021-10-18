/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax } from 'nc-lightapp-front';
import { constant,requesturl } from '../../config/config.js';
// import { NoteTypeHandle } from '../../util/ReferChangeEvent';
const { cpagecode, formcode1} = constant
export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g) {
	// let cpagecode=constant.cpagecode;
	// let formcode1=constant.formcode1;
	if (key === 'pk_org') {
		let chagedata = {
			pageCode: cpagecode,
			pkorg: props.form.getFormItemsValue(moduleId, 'pk_org').value
		};
		if (chagedata.pkorg) {
			ajax({
				url: requesturl.orgchange,
				data: chagedata,
				async: false,
				success: (res) => {
					if (res.success) {
						let pk_currency = res.data[formcode1].rows[0].values.pk_currency.value;
						let currency = res.data[formcode1].rows[0].values.pk_currency.display;
						let gllcrate = res.data[formcode1].rows[0].values.gllcrate.value;
						let olcrate = res.data[formcode1].rows[0].values.olcrate.value;
						let pk_cashaccount = res.data[formcode1].rows[0].values.pk_cashaccount.value;
						let cashaccount = res.data[formcode1].rows[0].values.pk_cashaccount.display;
						props.form.setFormItemsValue(moduleId, {
							pk_currency: { display: currency, value: pk_currency }
						});
						props.form.setFormItemsValue(moduleId, {
							pk_cashaccount: { display: cashaccount, value: pk_cashaccount }
						});
						props.form.setFormItemsValue(moduleId, { olcrate: { display: olcrate, value: olcrate } });
						props.form.setFormItemsValue(moduleId, { gllcrate: { display: gllcrate, value: gllcrate } });
						props.form.getFormItemsValue();
					}
				}
			});
		}else{
			props.form.setFormItemsValue(moduleId, {
				pk_currency: { display: null, value: null }
			});
			props.form.setFormItemsValue(moduleId, {
				pk_cashaccount: { display: null, value: null }
			});
			props.form.setFormItemsValue(moduleId, { olcrate: { display: null, value: null } });
			props.form.setFormItemsValue(moduleId, { gllcrate: { display: null, value: null } });
			props.form.getFormItemsValue();
		}
		props.resMetaAfterPkorgEdit();//选择主组织以后，恢复其他字段的编辑性
	}

	if( key === 'pk_bank' ){
		props.form.setFormItemsValue(moduleId, { pk_account: { display: null, value: null } });
	}

	if( key === 'pk_account'){
		let pk_account = props.form.getFormItemsValue(moduleId, 'pk_account').value;
		let pk_bank = props.form.getFormItemsValue(moduleId, 'pk_bank').value;
		let bankdocname, pk_bankdoc, accname, accpk
		accname = i.refcode;
		accpk = i.refpk;
		props.form.setFormItemsValue(moduleId, {
			'pk_account': {
				display: accname,
				value: accpk
			}
		});
		//tm lidyu 选择本方账户没有带出银行账户   去掉.value  上面已经定义 20200426
		// if(pk_account.value && !pk_account.value == ''){
		// 	if (pk_bank.value == '' || pk_bank.value == null) {
			if(pk_account && !pk_account == ''){
				if (pk_bank== '' || pk_bank == null) {
					if (i) {
					bankdocname = i.values['bd_bankdoc.name'].value;
					pk_bankdoc = i.values['bd_bankdoc.pk_bankdoc'].value;
					props.form.setFormItemsValue(moduleId, {
						'pk_bank': {
							display: bankdocname,
							value: pk_bankdoc
						}
					});
				}
			}
		}
	}
	// 票据类型
	if ( key === 'pk_notetype' ) {
		//表头编辑 表体赋值
		let form_nt_value = props.form.getFormItemsValue(moduleId, key).value;
		//类型的票据大类为银行汇票或商业汇票时，票据号应该是参照型，
		//所选票据类型的票据大类为支票或其他时，票据号应该是备注型，可以手工录入。
		let note_type_val = value.value;
		if (note_type_val) {
			ajax({
				url: '/nccloud/cmp/pub/noteTypeHandler.do',
				data: { pk: form_nt_value },
				async: false,
				success: function(res) {
					NoteTypeHandle(props, moduleId, res.data.note_type, null);
				}
			});
		}
	}
	// 票据号
	if ( key === 'bill_number' ) {
		let pk_notenumber = i.refpk;
		let bill_number = i.refcode;
		if(pk_notenumber){
			props.form.setFormItemsValue(moduleId, {
				'pk_notenumber': {
					// display: i.refcode,
					value: pk_notenumber
				}
			});
			if(bill_number){
				props.form.setFormItemsValue(moduleId, {
					'bill_number': {
						display: bill_number,
						value: bill_number
					}
				});
			}
		}
		
	}
	
}

/**
 * 票据号参照切换
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 *  @param {*} value 交易对象值
 */
export const NoteTypeHandle = function(props, moduleId, value,index) {
	let meta = props.meta.getMeta();
	let item = meta['settlechange_changeinfo'].items.find((e) => e.attrcode === 'bill_number');
	// let tableItem = meta[formcode1].items.find((e) => e.attrcode === 'bill_number');
	let orgVal=props.form.getFormItemsValue(formcode1, 'pk_org');
	let currVal=props.form.getFormItemsValue(formcode1, 'pk_curr');
	let noteTypeVal=props.form.getFormItemsValue(formcode1, 'pk_notetype');
	if(item.attrcode==='bill_number'){
		if (value) {
			item.itemtype = 'refer';
			item.refcode = 'fbm/refer/fbm/Bill4CmpPayGridRef/index.js';
			item.queryCondition= () => {
				return {
					pk_org: orgVal.value,
					fbmbilltype: noteTypeVal?noteTypeVal.value:null,
					pk_curr: currVal?currVal.value:null,
					// pk_register: getRegister(props) == null ? null : getRegister(props),
					notestatus:props.getUrlParam('status'),
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPFBMDefaultBuilder'//自定义增加的过滤条件-票据号
				};
			};

		} else {
			item.itemtype = 'input';
			item.refcode = null;
		}
		props.renderItem('form',  formcode1, 'bill_number', null);
		props.meta.setMeta(meta);
	}
	
};
/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/