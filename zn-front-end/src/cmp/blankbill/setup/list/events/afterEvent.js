/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax,toast } from 'nc-lightapp-front';
import { SHOW_MODE } from '../../../../pub/cons/constant';
import { BBC_CONST,APP_INFO,BILL_FIELD,REQUEST_URL,BTN } from '../../cons/constant';
const {  } = BBC_CONST;
const { APPCODE,LIST_PAGECODE,SEARCH_CODE,FORM_BBC_01,FORM_BBC_02,FORM_BBC_03,FORM_BBC_04,FORM_BBC_05,TREE } = APP_INFO;
const { PK_NAME,PK_ORG,TS,BILLPK } = BILL_FIELD;
const { QUERY,SAVE,QUERYNOTETYPE } = REQUEST_URL;
const { SAVE_BTN, EDIT_BTN, CANCEL_BTN } = BTN;
const { ADD,BROWSER,EDIT } = SHOW_MODE;
import { checkNegative } from '../../../../public/cardEvent';
export default function afterEvent(props, moduleId, key, value, changedrows, i, record, g) {

	if(JSON.stringify(value)==='{}'){
		return;
	}
	let selectTree = props.syncTree.getSelectNode(TREE);
	let fundform = null;
	if(selectTree && selectTree.refcode && selectTree.refcode!="-1"){
		fundform = selectTree.refcode;
	}
	switch (key){
		case'isebmmange': // 是否空白票据管理
			let isebmmange = props.form.getFormItemsValue(FORM_BBC_01, 'isebmmange').value;
			props.form.setFormStatus(FORM_BBC_01, 'edit');
			if(isebmmange ){
				this.fildVisible();
			}else{
				this.fildDisabled();
			}
			break;
		case'islyctrlbydate': // 是否按领用张数控制
			let islyctrlbydate = props.form.getFormItemsValue(FORM_BBC_01, 'islyctrlbydate').value;
			if(islyctrlbydate ){
				this.props.form.setFormItemsDisabled(FORM_BBC_01,{'lydate': false}); // 最大未报销领用天数
			}else{
				this.props.form.setFormItemsDisabled(FORM_BBC_01,{'lydate': true}); // 最大未报销领用天数
			}
			break;
		case'islyctrlbynum': // 是否按领用张数控制
			let islyctrlbynum = props.form.getFormItemsValue(FORM_BBC_01, 'islyctrlbynum').value;
			if(islyctrlbynum ){
				this.props.form.setFormItemsDisabled(FORM_BBC_01,{'lynum': false}); // 最大领用张数
			}else{
				this.props.form.setFormItemsDisabled(FORM_BBC_01,{'lynum': true}); // 最大领用张数
			}
			break;
		case'islyctrlbymoney': // 是否按照未报销总金额控制
			let islyctrlbymoney = props.form.getFormItemsValue(FORM_BBC_01, 'islyctrlbymoney').value;
			if(islyctrlbymoney ){
				this.props.form.setFormItemsDisabled(FORM_BBC_01,{'lymoney': false}); // 最大报销金额
			}else{
				this.props.form.setFormItemsDisabled(FORM_BBC_01,{'lymoney': true}); // 最大报销金额
			}
			break;
		case'lynum': // 最大领用张数
		case'lydate': // 最大未报销领用天数
		case'lymoney': // 最大报销金额
			if (!checkNegative.call(this, key, value)) {
				return;
			}
			break;
	}
}




/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/