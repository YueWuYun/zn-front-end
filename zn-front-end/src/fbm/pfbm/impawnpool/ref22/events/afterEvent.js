/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { promptBox } from 'nc-lightapp-front';
import { EmptyAreaValue } from "../../../../pub/utils/EmptyAreaValueUtil";
import { cardEvent } from '../../../../public/container/index';
import { setHeadItemProp } from '../../../../pub/utils/FBMAfterEditUtil.js';
export function afterEvent(props, moduleId, key, value, oldValue) {
	console.log(key, value, oldValue);
	let eventDatas = this.props.createHeadAfterEventData(this.pageId, this.formId, '', moduleId, key, value);
	let eventData = { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDatas) };
	if (key === 'pk_org') {
		this.props.resMetaAfterPkorgEdit();
		this.props.button.setButtonDisabled(['addRow', 'delRow'], false);//恢复增行编辑性
		//财务组织
		if (!oldValue || !oldValue.value) {
			//编辑后事件
			cardEvent.changeOrg.call(this, value, () => {				
			}).then(() => {
                if (value.value) {
                    cardEvent.getAfterEventData.call(this, eventData).then(res => {
                       props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
                    });
                }
            });
        }else {
            promptBox({
                color: "warning",
                title: this.props.MutiInit.getIntl("36200BI") && this.props.MutiInit.getIntl("36200BI").get('36200BI-000000'),/* 国际化处理： 修改财务组织*/
                content: this.props.MutiInit.getIntl("36200BI") && this.props.MutiInit.getIntl("36200BI").get('36200BI-000001'),/* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/
                beSureBtnClick: cardEvent.changeOrg.call(this, value).then(() => {
                    if (value.value) {
                        cardEvent.getAfterEventData.call(this, eventData).then(res => {
	                           props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
                        })
                    }
                }),
                cancelBtnClick: () => props.form.setFormItemsValue(moduleId, {
                    pk_org: oldValue,
                    pk_org_v: oldValue
                })
            });
        }
	}else if (key === 'pk_register') { //票据编号 
		if (value.value !== oldValue.value) {
			EmptyAreaValue.call(this, this.baseinfo, this.formId, "pk_register.");
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				//池内质押网银字段不限制是否可编辑
				props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
				let pk_olccurr = res.data.userjson;
				let pk_curr = props.form.getFormItemsValue(moduleId, 'pk_register.pk_curr');
				if (pk_olccurr == pk_curr.value) {
					props.form.setFormItemsDisabled(moduleId, { 'olcrate': true });
				}else{
					props.form.setFormItemsDisabled(moduleId, { 'olcrate': false });
				}
			});
		}
	}else if (key === 'impawndate'){ //质押日期
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this,props,res);
			});
		}
	}else if (key === 'impawnrate'){ //质押率
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this,props,res);
			});
		}
	}else if (key === 'olcbrate'){ //组织本币汇率
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this,props,res);
			});
		}
	}else if(key === 'onlinebankflag'){//网银
		if(value.value==true){
			props.form.setFormItemsRequired(this.formId,{'holderaccount':true});
			props.form.setFormItemsDisabled(this.formId,{'holderaccount':false});
		} else {
			props.form.setFormItemsDisabled(this.formId,{'holderaccount':true});
			props.form.setFormItemsRequired(this.formId,{'holderaccount':false});
		}
	}
	
function setAfterEditFormValue(props,res){
	let { success, data } = res;
	let { card, retExtParam, headProp, bodyItemProps,headItemProps } = data;
	let { head, bodys } = card;
	props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
	setHeadItemProp(props,this.formId,headItemProps);
}
}


/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/