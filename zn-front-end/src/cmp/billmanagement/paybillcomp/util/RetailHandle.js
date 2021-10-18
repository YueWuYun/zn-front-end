/*KOMNi7V6Z5Trp2oXKhpozyGJWSlTK4S3F2c29EzOvpWWO0D0RzvgobsZh2Y/IdWL*/

import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import { PAYBILL_CONST } from '../cons/constant.js';
export const RetailHandle = function (props,index,record) {
    
    let head_objecttype= props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'objecttype');
    let head_supplier=props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'pk_supplier'); 
    let body_objectType=record.values.objecttype;
    let body_supplier=record.values.pk_supplier;
    let meta = props.meta.getMeta();
    let tableItem = meta['paybilldetail_table'].items.find((e) => e.attrcode === 'accountopenbank');
    if(body_objectType&&body_objectType.value&&body_supplier&&body_supplier.value){
        if(body_objectType.value==='4'){
            props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'accounttype', true);
            props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'accountopenbank' ,true);
            props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'accountname' ,true);
            tableItem.itemtype='refer';
            tableItem.refName='银行档案';
            tableItem.iscode=false;
            tableItem.refcode = 'uapbd/refer/bankacc/BankDocDefaultGridTreeRef/index.js';
            props.renderItem('table', 'paybilldetail_table', 'accountopenbank', null);
            tableItem.queryCondition= () => {
			let pk_org = props.form.getFormItemsValue('head', 'pk_org').value;
			return {
				pk_org: pk_org,
			};
			}
            props.meta.setMeta(meta);

        }else{
            props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'accounttype', false);
            props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'accountopenbank' ,false);
            props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'accountname' ,false);
        }

    }else{
        if(head_objecttype&&head_objecttype.value==='4'&&head_supplier&&head_supplier.value){

            props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'accounttype', true);
            props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'accountopenbank' ,true);
            props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'accountname' ,true);
            tableItem.itemtype='refer';
            tableItem.refName='银行档案';
            tableItem.iscode=false;
            tableItem.refcode = 'uapbd/refer/bankacc/BankDocDefaultGridTreeRef/index.js';
            props.renderItem('table', 'paybilldetail_table', 'accountopenbank', null);
            tableItem.queryCondition= () => {
			let pk_org = props.form.getFormItemsValue('head', 'pk_org').value;
			return {
				pk_org: pk_org,
			};
			}
            props.meta.setMeta(meta);
        }else{
            props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'accounttype', false);
            props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'accountopenbank' ,false);
            props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'accountname' ,false);

        }
    } 
    
}

/*KOMNi7V6Z5Trp2oXKhpozyGJWSlTK4S3F2c29EzOvpWWO0D0RzvgobsZh2Y/IdWL*/