/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/
//应收票据退票——表体编辑后事件
import { ajax, toast } from 'nc-lightapp-front';
import { cardEvent } from '../../../../public/container/index';
export function afterTableEvent(props, moduleId, key, value, changedrows, index, record, type, method) {
	console.log(moduleId, key, value, changedrows, index);
	const eventData = this.props.createTabsBodyAfterEventData(this.pageId, this.formId, this.tabOrder, moduleId, key, changedrows);//编辑后事件整单数据
	const repAfterKeys = ['realrepaymny', 'grtrelease']; //还款计划编辑后事件字段 实还本金/释放担保金额

	if (key === 'pk_register') {
		cardEvent.setBodyAfterEventData.call(this, eventData).then(res => {
			props.form.setAllFormValue({
				[this.formId]: res.data.head && res.data.head[this.formId]
			});
		});
	} else if (repAfterKeys.includes(key)) {
		cardEvent.setBodyAfterEventData.call(this, eventData);
	}
}



/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/