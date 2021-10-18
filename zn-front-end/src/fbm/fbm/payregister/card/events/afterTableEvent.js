/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/
import { ajax,toast } from 'nc-lightapp-front';
import { cardEvent } from '../../../../public/container/index';
import { setHeadItemProp,setBodyItemProp } from '../../../../pub/utils/FBMAfterEditUtil.js';
export function afterTableEvent(props, moduleId, key, value, changedrows, index, record, type, method) {
	console.log(moduleId, key, value, changedrows, index);
	const eventDatas = this.props.createTabsBodyAfterEventData(this.pageId, this.formId, this.tabOrder, moduleId, key, changedrows);//编辑后事件整单数据
	let eventData = { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventDatas) };

	if (key === 'pk_guarantee') {
			//担保合同
		if (value.values) {
			// cardEvent.setBodyAfterEventData.call(this, eventData);
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this,this.props,res);
			});
		}else{
			
			
		}	
	}else if (key === 'guaranteeamount') {
		//占用担保金额
		if (value !== '' && value >= 0) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this,this.props,res);
			});
		}
	}
	else if (key === 'guaranteerate') {
		//占用担保比例
		if (value !== '' && value >= 0) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this,this.props,res);
			});
		}
	}
		
}


function setAfterEditFormValue(props,res){
	    let { success, data } = res;
	    let { card, retExtParam, headProp, bodyItemProps,headItemProps } = data;
	    let { head, bodys } = card;
	    props.form.setAllFormValue({ [this.formId]: head[this.formId] });
	    props.cardTable.setAllTabsData(bodys, this.tabOrder);
	    setHeadItemProp(props,this.formId,headItemProps);
		setBodyItemProp(props,this.tabCode,bodyItemProps,bodys);
}

/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/