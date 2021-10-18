/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { base, ajax, promptBox } from 'nc-lightapp-front';

import { cardEvent } from '../../../../public/container/index';
import { setHeadItemProp } from '../../../../pub/utils/FBMAfterEditUtil.js';
export function afterEvent(props, moduleId, key, value, oldValue) {
	console.log(key, value, oldValue);
	let currentItem = { props, moduleId, key, value, oldValue };
	let eventDataOld = this.props.createHeadAfterEventData(this.pageId, this.formId, '', moduleId, key, value);
	let eventData = { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDataOld) };
	if (key === 'pk_org') {
		//财务组织
		if (!oldValue.value) {
			// 老数据为空，直接请求
			changeOrg.call(this, value, eventData);
		}else if (value.value !== oldValue.value) {
			promptBox({
				color: "warning",
				title: this.props.MutiInit.getIntl("36370IFBA") && this.props.MutiInit.getIntl("36370IFBA").get('36370IFBA-000000'),/* 国际化处理： 修改财务组织*/
				content: this.props.MutiInit.getIntl("36370IFBA") && this.props.MutiInit.getIntl("36370IFBA").get('36370IFBA-000001'),/* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/
				beSureBtnClick: () => {
					changeOrg.call(this, value, eventData);
				},
				cancelBtnClick:() => {
					props.form.setFormItemsValue(this.formId,{'pk_org': oldValue});
				}
			});
		}
	} else if (key === 'securityrate' || key === "securityamount" || key === 'amount' || key === "olcrate" || key === "glcrate" || key === "gllcrate" 
	|| key === "pk_currtype" || key === "poundageamount"  ||  key === "applydate") { //币种 + 申请日期
		if (!value.value) {
			return;
		}
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this, this.props, res);

			});
		}
	}else if(key ==='pk_acceptorg'){
		if(!value.value){
			this.props.form.setFormItemsDisabled(this.formId, {
				pk_applybankacc: true,
				pk_applybank: true,
				pk_banksecurityacc: true,
				poundageamount: true,
			//	dealsign: true,
				securityrate: true,
				securityamount: true,

			});

			this.props.form.setFormItemsValue(this.formId, {
				'pk_applybankacc': {
					display: '',
					value: ''
				},

				'pk_applybank': {
					display: '',
					value: ''
				},
				'pk_banksecurityacc': {
					display: '',
					value: ''
				},
				'poundageamount': {
					display: '',
					value: ''
				},
				 'pk_poundageacc': {
				 	display: '',
				 	value: ''
				 },
				'securityrate': {
					display: '',
					value: ''
				},
				'securityamount': {
					display: '',
					value: ''
				}
			});
			return;
		}
		if(value.value != oldValue.value){
			this.props.form.setFormItemsDisabled(this.formId, {
				pk_applybankacc: false,
				pk_applybank: false,
				pk_banksecurityacc: false,
				poundageamount: false,
				//dealsign: false,
				securityrate: false,
				securityamount: false,

			});

		}
	}else if (key === 'pk_applybank') {//申请银行  修改后，清空出票人账号
		if (value.value !== oldValue.value && value.value) {	
			
		}else{
			this.props.form.setFormItemsValue(this.formId, {
				'pk_applybankacc': {
					display: '',
					value: ''
				},
			});
		}
	} else if (key === "pk_receivebank") {//收款人开户银行  修改后，清空出票人账号
		if (value.value !== oldValue.value && value.value) {	
			
		}else{
			this.props.form.setFormItemsValue(this.formId, {
				'pk_receivebankacc': {
					display: '',
					value: ''
				},
			});
		}
	} else if (key === 'pk_applybankacc' || key === 'pk_receivebankacc') {//银行账户 /收款人账户
		if (!value.value) {
			return;
		}
		if (value.value !== oldValue.value && value.value) {	
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this, this.props, res);
			});
		}
	}else if (key === "innersecurityamount" || key === "innersecurityrate") {//
		if (value.value !== oldValue.value  && value.value ) {			
			if( value.value > 0){			
				  //设置必输
				this.props.form.setFormItemsRequired(this.formId, {
					pk_securityacc: true,
				});
			}
		}else{
			this.props.form.setFormItemsRequired(this.formId, {
				pk_securityacc: false,
			});
			this.props.form.setFormItemsValue(this.formId, {
				olcinnersecurityamount: '',
				olcinnersecurityamount: '',
				gllcinnersecurityamount:''
			})
		}
		cardEvent.getAfterEventData.call(this, eventData).then(res => {
			setAfterEditFormValue.call(this, this.props, res);

		});
	}

}

export function afterEventEdit (props, moduleId, key, value, async= false) {
	if (value.value) {
		if (key=== 'pk_org') {
			props.initMetaByPkorg();
			props.form.EmptyAllFormValue(this.formId);
			props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
		//	props.button.setButtonDisabled(["addRow", "deleteRow"], true);
			props.form.setFormItemsValue(moduleId, {
				pk_org: value,
				pk_org_v: value
			})
			this.props.resMetaAfterPkorgEdit();
		}
	}


	
}

function changeOrg(value,eventData){
	cardEvent.changeOrg.call(this, value).then(() => {
		if (value.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this,this.props,res);
			}).then(() => {
				this.props.cardTable.addRow(this.tabCode, undefined, {}, true);
			});
		}
	})
}

function setAfterEditFormValue(props, res) {
	let { success, data } = res;
	let { card, extParam, bodyItemProps, headItemProps } = data;
	props.form.EmptyAllFormValue(this.formId);
	props.form.setFormItemsValue(this.formId, { 'note': { value: '', display: '' } });
	props.form.setAllFormValue({ [this.formId]: card.head[this.formId] });
	setHeadItemProp(props, this.formId, headItemProps);
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/