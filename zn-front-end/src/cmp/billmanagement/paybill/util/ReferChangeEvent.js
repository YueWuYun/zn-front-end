/*uZLtZFUDsXr/PbCrMlFkKKHOOsx8cogsO6AXMyU6fw7w4UoFKggVqz8tclUsJL2b*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import { PAYBILL_CONST } from '../cons/constant.js';
import { saveMultiLangRes,loadMultiLang } from '../../../../tmpub/pub/util';
/**
 * 交易对象处理银行参照字段
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 *  @param {*} value 交易对象值
 */
export const ObjectTypeHandle = function(props, moduleId, value,index,formId,tableId) {

	let meta = props.meta.getMeta();
	let itemformId='childform1';
	if(formId&&tableId){
		itemformId='childform1_paybill_01';
	}
	if(!formId){
		formId=PAYBILL_CONST.card_from_id;
	}
	if(!tableId){
		tableId=PAYBILL_CONST.card_table_id;
		
	}
	

	let item = meta[formId].items.find((e) => e.attrcode === 'pk_account');
	let tableItem = meta[tableId].items.find((e) => e.attrcode === 'pk_account');
	let itemform = meta[itemformId].items.find((e) => e.attrcode === 'pk_account');

	if (moduleId == formId) {
        if (value == '0') {
			item.itemtype='refer';
			item.refName=loadMultiLang(props, '36070PBR-000110'),
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
			tableItem.itemtype='refer';
			tableItem.refName=loadMultiLang(props, '36070PBR-000110'),
			tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
			
			itemform.itemtype='refer';
			itemform.refName=props.MutiInit.getIntl('36070PBR') &&props.MutiInit.getIntl('36070PBR').get('36070PBR-000110');
			itemform.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
        } else if (value == '1') {
			item.itemtype='refer';
			item.refName=loadMultiLang(props, '36070PBR-000111'),
		
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
			tableItem.itemtype='refer';
			tableItem.refName=loadMultiLang(props, '36070PBR-000111'),
			tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
				
			itemform.itemtype='refer';
			itemform.refName=props.MutiInit.getIntl('36070PBR') &&props.MutiInit.getIntl('36070PBR').get('36070PBR-000111');
			itemform.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		} else if (value == '3') {
		
			item.itemtype='refer';
			item.refName=loadMultiLang(props, '36070PBR-000112'),
	
			item.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';
			tableItem.itemtype='refer';
			tableItem.refName=loadMultiLang(props, '36070PBR-000112'),
			tableItem.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';

			itemform.itemtype='refer';
			itemform.refName=loadMultiLang(props, '36070PBR-000112'),
	
			itemform.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		} 	else if (value == '4') {
			item.itemtype = 'input';
			item.refcode = null;
			tableItem.itemtype = 'input';
			tableItem.refcode = null;
			itemform.itemtype = 'input';
			itemform.refcode = null;
		} else {
			item.itemtype='refer';
			item.refName=loadMultiLang(props, '36070PBR-000111'),
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
			tableItem.itemtype='refer';
			tableItem.refName=loadMultiLang(props, '36070PBR-000111'),
			tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
			itemform.itemtype='refer';
			itemform.refName=loadMultiLang(props, '36070PBR-000111'),
			itemform.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		}
		props.renderItem('form', formId, 'pk_account', null);
		props.renderItem('table', tableId, 'pk_account', null);
		props.renderItem('form', itemformId, 'pk_account', null);
		props.meta.setMeta(meta);
	}
	if (moduleId == tableId) {

		if (value == '0') {
			tableItem.itemtype='refer';
			tableItem.refName=loadMultiLang(props, '36070PBR-000110'),
	
			tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';

			itemform.itemtype='refer';
			itemform.refName=loadMultiLang(props, '36070PBR-000110'),
			itemform.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		} else if (value == '1') {
			tableItem.itemtype='refer';
			tableItem.refName=loadMultiLang(props, '36070PBR-000111'),
			tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';

			itemform.itemtype='refer';
			itemform.refName=loadMultiLang(props, '36070PBR-000111'),
			itemform.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';

		} else	if (value == '3') {
			tableItem.itemtype='refer';
			tableItem.refName=loadMultiLang(props, '36070PBR-000112'),
			tableItem.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';

			itemform.itemtype='refer';
			itemform.refName=loadMultiLang(props, '36070PBR-000112'),
			itemform.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';

		}else if (value == '4') {
			tableItem.itemtype = 'input';
			tableItem.refcode = null;

			itemform.itemtype = 'input';
			itemform.refcode = null;

		} else{
			tableItem.itemtype='refer';
			tableItem.refName=loadMultiLang(props, '36070PBR-000111'),
			tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';

			itemform.itemtype='refer';
			itemform.refName=loadMultiLang(props, '36070PBR-000111'),
			itemform.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		}
		tableItem.queryCondition= () => {
			// let data = props.form.getFormItemsValue(formId, 'pk_org').value;
			let org = props.form.getFormItemsValue(formId, 'pk_org').value;
			let pk_customer =  props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_customer')&& props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_customer').value;
			//props.form.getFormItemsValue(formId, 'pk_customer').value;
			let pk_supplier = props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_supplier')&& props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_supplier').value;
			// props.form.getFormItemsValue(formId, 'pk_supplier').value;
			let psndoc=  props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_busiman')&& props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_busiman').value;
			let pk_currtype= props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_currtype')&& props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_currtype').value;
			//props.form.getFormItemsValue(formId, 'pk_busiman').value;
			let pk_cust = pk_supplier; //供应商
			let acclass = 3;
			let objecttype =  props.cardTable.getValByKeyAndIndex(tableId, index, 'objecttype')&&props.cardTable.getValByKeyAndIndex(tableId, index, 'objecttype').value;
			//props.form.getFormItemsValue(formId, 'objecttype').value;
			if(objecttype == '0'||objecttype == '1'){
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
				accclass: acclass,
				pk_curr:pk_currtype,
				GridRefActionExt: 'nccloud.web.cmp.ref.CMPaybillsCustBankAccGridRefSqlBuilder'//自定义参照过滤条件
			};
		} else if(objecttype == '3'){

       return {
		  pk_psndoc:psndoc,
	   }
		}else{
		}
	}
	itemform.queryCondition= () => {
			// let data = props.form.getFormItemsValue(formId, 'pk_org').value;
			let org = props.form.getFormItemsValue(formId, 'pk_org').value;
			let pk_customer =  props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_customer')&& props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_customer').value;
			//props.form.getFormItemsValue(formId, 'pk_customer').value;
			let pk_supplier = props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_supplier')&& props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_supplier').value;
			// props.form.getFormItemsValue(formId, 'pk_supplier').value;
			let psndoc=  props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_busiman')&& props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_busiman').value;
			let pk_currtype= props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_currtype')&& props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_currtype').value;
			//props.form.getFormItemsValue(formId, 'pk_busiman').value;
			let pk_cust = pk_supplier; //供应商
			let acclass = 3;
			let objecttype =  props.cardTable.getValByKeyAndIndex(tableId, index, 'objecttype')&&props.cardTable.getValByKeyAndIndex(tableId, index, 'objecttype').value;
			//props.form.getFormItemsValue(formId, 'objecttype').value;
			if(objecttype == '0'||objecttype == '1'){
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
				accclass: acclass,
				pk_curr:pk_currtype,
				GridRefActionExt: 'nccloud.web.cmp.ref.CMPaybillsCustBankAccGridRefSqlBuilder'//自定义参照过滤条件
			};
		} else if(objecttype == '3'){

       return {
		  pk_psndoc:psndoc,
	   }
		}else{
		}
	}
       


		props.renderItem('table', tableId, 'pk_account', null);
		props.renderItem('form', itemformId, 'pk_account', null);
		props.meta.setMeta(meta);
	}
};
/**
 * 票据号参照切换
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 *  @param {*} value 交易对象值
 */
export const NoteTypeHandle = function(props, moduleId, noteTypeData,index,formId,tableId) {
   let value=noteTypeData.note_type;
	let meta = props.meta.getMeta();
	let itemformId='childform1';
	if(formId&&tableId){
		itemformId='childform1_paybill_01';
	}
	if(!formId){
		formId=PAYBILL_CONST.card_from_id;
	}
	if(!tableId){
		tableId=PAYBILL_CONST.card_table_id;
		
	}


	let item = meta[formId].items.find((e) => e.attrcode === 'note_no');
	let tableItem = meta[tableId].items.find((e) => e.attrcode === 'note_no');
	let itemform = meta[itemformId].items.find((e) => e.attrcode === 'note_no');
	let orgVal=props.form.getFormItemsValue(formId, 'pk_org');
	let currVal=props.form.getFormItemsValue(formId, 'currtype');
	let noteTypeVal=props.form.getFormItemsValue(formId, 'note_type');
	
	if (moduleId ==formId) {
		 //控制直连电票字段显示问题
		 if(noteTypeData.etcs&&tableId==PAYBILL_CONST.card_table_id){
			props.cardTable.setColEditableByKey(PAYBILL_CONST.card_table_id,'direct_ecds' ,false);
			props.cardTable.setColValue(PAYBILL_CONST.card_table_id, 'direct_ecds', {
				display: null,
				value: null
			});
		 }else{
			props.cardTable.setColEditableByKey(PAYBILL_CONST.card_table_id,'direct_ecds' ,true);
			props.cardTable.setColValue(PAYBILL_CONST.card_table_id, 'direct_ecds', {
				display: null,
				value: null
			});
		 }
		if(item.attrcode==='note_no'){
		if (value) {
			item.itemtype = 'refer';
			item.refcode = 'fbm/refer/fbm/Bill4CmpPayGridRef/index.js';
			tableItem.itemtype = 'refer';
			tableItem.refcode = 'fbm/refer/fbm/Bill4CmpPayGridRef/index.js';
			itemform.itemtype = 'refer';
			itemform.refcode = 'fbm/refer/fbm/Bill4CmpPayGridRef/index.js';
			noteTypeInputTORefer(props,tableId);
			item.queryCondition= () => {
				return {
					pk_org: orgVal.value,
					fbmbilltype: noteTypeVal?noteTypeVal.value:null,
					pk_curr: currVal?currVal.value:null,
					pk_register: getRegister(props,tableId) == null ? null : getRegister(props,tableId),
					notestatus:props.getUrlParam('status'),
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPFBMDefaultBuilder'//自定义增加的过滤条件-票据号
				};
			};

			tableItem.queryCondition= () => {
				
				return {
					pk_org:orgVal.value,
					fbmbilltype: noteTypeVal?noteTypeVal.value:null,
					pk_curr: currVal?currVal.value:null,
					pk_register: getRegister(props,tableId) == null ? null : getRegister(props,tableId),
					notestatus:props.getUrlParam('status'),
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPFBMDefaultBuilder'//自定义增加的过滤条件-票据号
				};
			};
			itemform.queryCondition= () => {
				return {
					pk_org: orgVal.value,
					fbmbilltype:  noteTypeVal?noteTypeVal.value:null,
					pk_curr:  currVal?currVal.value:null,
					pk_register: getRegister(props,tableId) == null ? null : getRegister(props,tableId),
					notestatus:props.getUrlParam('status'),
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPFBMDefaultBuilder'//自定义增加的过滤条件-票据号
				};
			};

		} else {
			item.itemtype = 'input';
			item.refcode = null;
			tableItem.itemtype = 'input';
			tableItem.refcode = null;
			noteTypeReferTOInput(props,tableId);

		}
		props.renderItem('form',  formId, 'note_no', null);
		props.renderItem('table', tableId, 'note_no', null);
		props.meta.setMeta(meta);

	}
	}
	if (moduleId == tableId) {

          //控制直连电票字段显示问题
		 if(noteTypeData.etcs&&tableId==PAYBILL_CONST.card_table_id){
		
			props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'direct_ecds',true);
			props.cardTable.setValByKeyAndIndex(PAYBILL_CONST.card_table_id, index, 'direct_ecds', {
				 		value: null,
				 		display: null
				 	});
	
		} else{
			props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'direct_ecds', false);
			props.cardTable.setValByKeyAndIndex(PAYBILL_CONST.card_table_id, index, 'direct_ecds', {
				value: null,
				display: null
			});
		 }

		if(tableItem.attrcode==='note_no'){
		if (value) {
			tableItem.itemtype = 'refer';
			tableItem.refcode = 'fbm/refer/fbm/Bill4CmpPayGridRef/index.js';
			itemform.itemtype = 'refer';
			itemform.refcode = 'fbm/refer/fbm/Bill4CmpPayGridRef/index.js';
			noteTypeInputTORefer(props);
			let table_org = props.form.getFormItemsValue(formId, 'pk_org').value;
				let table_currtype =  props.cardTable.getValByKeyAndIndex(moduleId, index, 'pk_currtype');
				let table_noteType= props.cardTable.getValByKeyAndIndex(tableId, index, 'note_type');
				let currTypeVal;
				let noteTypeVal;
				
				if (table_noteType && table_noteType.value) {
					noteTypeVal = table_noteType.value;
				}
				if (table_currtype && table_currtype.value) {
					currTypeVal = table_currtype.value;
				};
			tableItem.queryCondition= () => {
				
				return {
					pk_org: table_org,
					fbmbilltype: noteTypeVal,
					pk_curr: currTypeVal,
					pk_register: getRegister(props,tableId) == null ? null : getRegister(props,tableId),
					notestatus:props.getUrlParam('status'),
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPFBMDefaultBuilder'//自定义增加的过滤条件-票据号
				};
			};
			itemform.queryCondition= () => {
				return {
					pk_org: table_org,
					fbmbilltype: noteTypeVal,
					pk_curr: currTypeVal,
					pk_register: getRegister(props,tableId) == null ? null : getRegister(props,tableId),
					notestatus:props.getUrlParam('status'),
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPFBMDefaultBuilder'//自定义增加的过滤条件-票据号
				};
			};

		} else {
			tableItem.itemtype = 'input';
			tableItem.refcode = null;
			itemform.itemtype='input';
			itemform.refcode=null;

			noteTypeReferTOInput(props,tableId);
		}
		props.renderItem('table', tableId, 'note_no', null);
		props.renderItem('form', itemformId, 'note_no', null);
		props.meta.setMeta(meta);
	}	


}
};
export const noteTypeReferTOInput = function(props,tableId) {
	let rowNum = props.cardTable.getNumberOfRows(tableId);//表体table行数
	for (let  i = 0; i <rowNum; i++) {
		let noteInput= props.cardTable.getValByKeyAndIndex(tableId, i, 'pk_note')
		if(noteInput&&noteInput.value){
		props.cardTable.setValByKeyAndIndex(tableId, i, 'note_no', {
			value:noteInput.display,
			display:noteInput.display
		});
		
	  }
	}

};
export const noteTypeInputTORefer = function(props,tableId) {
	let rowNum = props.cardTable.getNumberOfRows(tableId);//表体table行数
	for (let  i = 0; i <rowNum; i++) {
		let noteRefer= props.cardTable.getValByKeyAndIndex(tableId, i, 'pk_note')
		if(noteRefer&&noteRefer.value){
		props.cardTable.setValByKeyAndIndex(tableId, i, 'note_no', {
			value:noteRefer.value,
			display:noteRefer.display
		});
		
	  }
	}

}
//获取子表所有的票据号
export const getRegister = function(props,tableId) {
	let rowNum = props.cardTable.getNumberOfRows(tableId);//表体table行数pk
	let pk_register=null;
	for (let  i = 0; i <rowNum; i++) {      
    	let note_no= props.cardTable.getValByKeyAndIndex(tableId, i, 'pk_note')
		if(note_no&&note_no.value){
			if(pk_register){
				pk_register=pk_register+','+note_no.value
			}else{
				pk_register=note_no.value
			}
	  }
	}
	if(pk_register){
      return  pk_register
	} else{
		return null;
	}
	
}

export const handleTableRateEdit = function (key, record, index) {
    //本币汇率+集团汇率+全局汇率
    if (key == 'local_rate' || key == 'group_rate' || key == 'global_rate') {
        let pk_org = record.values.pk_org.value;//财务组织
        let pk_currtype = record.values.pk_currtype.value;//币种
        if (pk_org && pk_currtype) {
            ajax({
                url: '/nccloud/cmp/paybills/rate.do',
                data: {
                    pk_org: pk_org,
                    pk_currtype: pk_currtype
                },
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if (data && data.userJson) {
                            let extParam = data.userJson;
                            if (extParam) {
                                let obj = JSON.parse(extParam);
                                this.props.cardTable.setEditableByIndex(this.tableId, index, 'local_rate', obj.olcRateEditable);
                                this.props.cardTable.setEditableByIndex(this.tableId, index, 'group_rate', obj.glcRateEditable);
                                this.props.cardTable.setEditableByIndex(this.tableId, index, 'global_rate', obj.gllcRateEditable);
                            }
                        }
                    }
                }
            });
        }
    }

}
export const RateHandle = function(props, moduleId, index, record) {

	if(moduleId===PAYBILL_CONST.card_from_id){
	  let org = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'pk_org');
	  let currType= props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'pk_currtype');
	  if(!org){
		return ; 
	 }
	 if(!currType||!currType.value){
	   props.form.setFormItemsDisabled(PAYBILL_CONST.card_from_id, { 'local_rate': false });
	    return ;
	 };
	 ajax({
	   url: '/nccloud/cmp/paybills/rate.do',
	   data: { pk_org: org.value ,
			  pk_currtype:currType.value
			 },
	   success: function(res) {
		   let { success, data } = res;
		   if (!data.edit) {
			   props.form.setFormItemsDisabled(PAYBILL_CONST.card_from_id, { 'local_rate': true });
		}else{
		   props.form.setFormItemsDisabled(PAYBILL_CONST.card_from_id, { 'local_rate': false }); 
		}
	   }
   });

 }

 if(moduleId===PAYBILL_CONST.card_table_id){
   let table_org = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'pk_org');
   let table_currType=props.cardTable.getValByKeyAndIndex(PAYBILL_CONST.card_table_id, index, 'pk_currtype');
   if(!table_org){
	 return ; 
  }
  if(!table_currType||!table_currType.value){
	props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'local_rate', false);
	return ;
  };
  ajax({
	url: '/nccloud/cmp/paybills/rate.do',
	data: { pk_org: table_org.value ,
	  pk_currtype:table_currType.value},
	success: function(res) {
		let { success, data } = res;
		if (data.edit) {
		   props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'local_rate', true);
	 }else{
		props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'local_rate', false);
	 }
	}
});

}


}

/*uZLtZFUDsXr/PbCrMlFkKKHOOsx8cogsO6AXMyU6fw7w4UoFKggVqz8tclUsJL2b*/