/*OWmq6Ugo6jPE4W7xoi1UXhq+1vSZXrOgt+4SRrMwzTA038JeUFSq6eAdNHSNbyTH*/
import { ajax } from 'nc-lightapp-front';

let props2 = null;
const formId = "form_bulu"; 
const tableid= "table_bulu";

export default function afterEvent(props, moduleId, key,value, changedrows, i) { 
	props2 = props; 
	if(moduleId===formId){ 
		let display = '';
		if(value.display=== undefined){
			display = value.value;
		}else{
			display = value.display;
		}
		let tablevalue = {value:value.value,display:display}; 
		props.table.setValByKeyAndIndex(tableid, this.selrow, key,tablevalue) ;
		// props.form.setFormItemsDisabled(formId, {'c_ccynbr': false});
		if(key === 'c_ccynbr'){
			//日本瑞穗特殊处理  
			let type = props.form.getFormItemsValue(formId, 'filetype');
			if (type) {
				let typevalue = props.form.getFormItemsValue(formId, 'filetype').value;
				if (typevalue && typevalue==="rbnc") {
					if(value && value.display === '人民币'){
						//手续费负担指定方法外币时必填
						props.form.setFormItemsRequired(formId, {'bankcharges': true});
					}
				}
			}
		}else if(key === 'bankcharges'){
			//手续费汇出帐户1或2时     
			if (value && value.value==="1" || value.value==="2") {
				//手续费汇出账户必填
				props.form.setFormItemsRequired(formId, {'chargaccount': true});
			}
			if (value && value.value==="3" || value.value==="2") {
				let dbtacc = props.form.getFormItemsValue(formId, 'dbtacc').value;
				let dbtaccvalue = {value:dbtacc,display:dbtacc}; 
				//设置手续费汇出账户
				props.form.setFormItemsValue(formId, {'chargaccount':{value:dbtacc,display:dbtacc}});
				props.table.setValByKeyAndIndex(tableid, this.selrow, 'chargaccount',dbtaccvalue) ;
			}
		}
		// else if(key === 'paymentmethod'){

		// }
	} 
}
/*OWmq6Ugo6jPE4W7xoi1UXhq+1vSZXrOgt+4SRrMwzTA038JeUFSq6eAdNHSNbyTH*/