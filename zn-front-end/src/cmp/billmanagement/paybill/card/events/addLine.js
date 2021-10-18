/*Zj4c78X3+SM8w7XPjC/yqbeJ/hg9YDjdUQVCOMRqw6+VBHkCRideQk2SpYL+eGxi*/

import { PAYBILL_CONST } from '../../cons/constant.js';
export const addline = function(props, dataArr,index) { 
    
    let dataform = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, dataArr);
    dataArr.forEach((val) => {
        let key = val;
        if (props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, key)) {
            let value = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, key).value;
            let dly = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, key).display;
            if (value) {
                props.cardTable.setValByKeyAndIndex(PAYBILL_CONST.card_table_id, index, key, {
                    value: value,
                    display: dly
                });
                if (key == 'local_rate') {
                    //设置本币汇率的编辑性
                    let isEdit = props.form.getFormItemsDisabled(PAYBILL_CONST.card_from_id, key);
                    if (!isEdit) {
                        props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'local_rate', true);
                    }
                   
                };
                if(key==='pk_accountname'){
                    props.cardTable.setValByKeyAndIndex(PAYBILL_CONST.card_table_id,index, 'accountname', {
                        value: props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, key)
                        && props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, key).value 
                    });
                }
 
            }
        }
        if (key === 'accountopenbank'||key === 'accountcode'||key === 'accountname') {
            let currtVal=props.cardTable.getValByKeyAndIndex(PAYBILL_CONST.card_table_id, index, key)
            if(!currtVal||!currtVal.value){
                if(props.cardTable.getNumberOfRows(PAYBILL_CONST.card_table_id)>1){
                    let zeroVal=props.cardTable.getValByKeyAndIndex(PAYBILL_CONST.card_table_id, 0, key);
                   if(zeroVal){
                   props.cardTable.setValByKeyAndIndex(PAYBILL_CONST.card_table_id, index, key, {
                       value: zeroVal.value,
                       display:zeroVal.display
                   });
                }
               }
            }
        };
        if(key==='local_rate'||key==='group_rate'||key==='global_rate'){
            let rate=props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, key);
            let scaleNum=(rate&&rate.scale)?(rate.scale):'2';
            props.cardTable.setValByKeyAndIndex(PAYBILL_CONST.card_table_id, index, key, {
                scale: scaleNum,
            });
        }

    });
     //表体精度处理
     let body_primal = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'primal_money');//原币
     let body_local = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'local_money');//本币
     let body_rate = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'local_rate');//汇率
     let bodyMnyScale = '2';
     let bodyLocalScale = '2';
     let bodyRateScale = '2';
     if (body_primal && body_primal.scale) {
        bodyMnyScale = body_primal.scale;
     }
     if (body_local && body_local.scale) {
        bodyLocalScale = body_local.scale;
     }
     if (body_rate && body_rate.scale) {
        bodyRateScale = body_rate.scale;
     }
      //精度处理了
      props.cardTable.setColScale([
         {areacode: PAYBILL_CONST.card_table_id, fieldcode: 'pay_primal', scale: bodyMnyScale},

         {areacode: PAYBILL_CONST.card_table_id, filedcode: 'local_rate', scale: bodyRateScale},
         {areacode: PAYBILL_CONST.card_table_id, fieldcode: 'group_rate', scale: bodyRateScale},
         {areacode: PAYBILL_CONST.card_table_id, fieldcode: 'global_rate', scale: bodyRateScale},

         {areacode: PAYBILL_CONST.card_table_id, fieldcode: 'pay_local', scale: bodyLocalScale},
         {areacode: PAYBILL_CONST.card_table_id, fieldcode: 'global_local_pay', scale: bodyLocalScale},
         {areacode: PAYBILL_CONST.card_table_id, fieldcode: 'global_local_ts', scale: bodyLocalScale},
         {areacode: PAYBILL_CONST.card_table_id, fieldcode: 'group_local_ts', scale: bodyLocalScale},
         {areacode: PAYBILL_CONST.card_table_id, fieldcode: 'group_local_pay', scale: bodyLocalScale},
         {areacode: PAYBILL_CONST.card_table_id, fieldcode: 'ts_local', scale: bodyLocalScale},
     ]);
   
}
export const defaultLineValue = function(props) { 
            //默认字段取值
            let obj= {};
            let dataArr = ['pk_currtype','pk_balatype','note_type','pk_tradetypeid','pk_account','pk_oppaccount','objecttype',
			   'local_rate','group_rate','global_rate','pk_supplier','mon_account','accountname','pk_customer', 'pk_busiman', 'accountopenbank', 'accountcode',
               'pk_accountname','bill_date','pk_accountname'];
             if(props&&props.form&& props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, dataArr))  {
                dataArr.forEach((val) => {
                    let key = val;
                    let valData = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, key)? props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, key).value:null;
                    let dlyData =props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, key)? props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, key).display:null;
                    obj[key]={value:valData,display:dlyData};

                });
            }
            return obj;
            
}


/*Zj4c78X3+SM8w7XPjC/yqbeJ/hg9YDjdUQVCOMRqw6+VBHkCRideQk2SpYL+eGxi*/