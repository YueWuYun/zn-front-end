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
                beSureBtnClick: ()=>{
					cardEvent.changeOrg.call(this, value).then(() => {
						props.form.EmptyAllFormValue(this.formId);
					    if (value.value!=null) {
							cardEvent.getAfterEventData.call(this, eventData).then(res => {
									setAfterEditFormValue.call(this,props,res);
							});
					    } 
					})
				},
				cancelBtnClick: () => {
					if(oldValue.value!=null){
						props.form.setFormItemsValue(this.formId,{'pk_org':{value:oldValue.value,display:oldValue.display}});
					}
				}
            });
        }
	}else if (key === 'pk_register') { //票据编号 
		if (value.value !== oldValue.value) {
			EmptyAreaValue.call(this, this.baseinfo, this.formId, "pk_register.");
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				//池内质押网银字段不限制是否可编辑
				props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
				let setEditable = res.data.card.userjson;
				if (setEditable.indexOf("olcbrate") > -1) {
					props.form.setFormItemsDisabled(moduleId, { olcbrate: false });
				} else {
					props.form.setFormItemsDisabled(moduleId, { olcbrate: true });
				}
				if (setEditable.indexOf("glcbrate") > -1) {
					props.form.setFormItemsDisabled(moduleId, { glcbrate: false });
				} else {
					props.form.setFormItemsDisabled(moduleId, { glcbrate: true });
				}
				if (setEditable.indexOf("gllcbrate") > -1) {
					props.form.setFormItemsDisabled(moduleId, { gllcbrate: false });
				} else {
					props.form.setFormItemsDisabled(moduleId, { gllcbrate: true });
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
	}else if (key === 'olcbrate'||key === 'glcbrate'||key === 'gllcbrate'){ //组织本币汇率
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this,props,res);
			});
		}
	}else if(key === 'onlinebankflag'){//网银
		if(value.value==true){	
		} else {			
			props.form.setFormItemsValue(this.formId, {
				holderaccount: { value: null }
			  });
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