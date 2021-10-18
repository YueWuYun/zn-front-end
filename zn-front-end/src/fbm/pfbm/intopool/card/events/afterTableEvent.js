/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/
import { ajax,toast } from 'nc-lightapp-front';
import { cardEvent } from '../../../../public/container/index';
import { setHeadItemProp,setBodyItemProp } from '../../../../pub/utils/FBMAfterEditUtil.js';
import { clsRowno } from '../../../../public/container/common';

export function afterTableEvent(props, moduleId, key, value, changedrows, index, record, type, method) {
	console.log(moduleId, key, value, changedrows, index);
	const eventDatas = this.props.createTabsBodyAfterEventData(this.pageId, this.formId, this.tabOrder, moduleId, key, changedrows);//编辑后事件整单数据
	let eventData = { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventDatas) };

	if (key === 'pk_register') {
			//票据编码
		if (value) {
			let guaData = props.cardTable.getColValue('guarantee', 'pk_register').map(item => item.value);
			cardEvent.setBodyAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this,this.props,res);
				clsRowno.call(this, this.tabCode); 
        	});
 			this.props.cardTable.setColEditableByKey('guarantee', ['billpooluse', 'calculcostflag'], false)

		}else{
			 this.props.cardTable.setColEditableByKey('guarantee', ['billpooluse', 'calculcostflag'], false)

			
		}	
	}
	if(key === 'billpooluse'){
		//若来源位内部托管，则 票据池用途不可编辑
		// let pk_srcbill = this.props.form.getFormItemsValue(this.formId, 'pk_srcbill');
		// if(pk_srcbill){
		// 	this.props.form.setFormItemsDisabled(this.formId, {					
		// 		billpooluse: true,
		// 	});
		// }
		// let billpooluse = props.cardTable.getColValue('guarantee', 'billpooluse').map(item => item.value);
		// //判断子表中用途包含质押，则表头质押率可以编辑
		// if (billpooluse.includes('pledge')) {
		// 	this.props.form.setFormItemsDisabled(this.formId, {					
		// 		pledgerate: false,
		// 	});

		// }
		if (value) {
			cardEvent.setBodyAfterEventData.call(this, eventData).then(res => {
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