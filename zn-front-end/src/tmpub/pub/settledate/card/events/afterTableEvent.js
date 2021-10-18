/*yrJb1LOfoOHhNP+PrTGyMlwVz9IiLdIAQVSFAsP/e+S9VY37I34PlViIIKxjZsFV*/
import { dayOptions } from '../../cons/constant';

export function afterTableEvent(props, moduleId, key, value, changedrows, index, record, type, method) {
	let oldValue = changedrows[0] && changedrows[0].oldvalue.value;
	let currentItem = { moduleId, key, value, oldValue, index };
	//console.log(value, oldValue);
	if (value !== oldValue) {
		switch (key) {
			case 'settleday':
				setLeapDay.call(currentItem, props);
				break;
			case 'settlemonth':
				let feb = value == '2' ? true : false;
				props.cardTable.setEditableByIndex(moduleId, index, 'settleleapday', feb);
				setLeapDay.call(currentItem, props);
				modifiedDaysByMonth.call(this, props, [ '1', '3', '5', '7', '8', '10', '12' ].includes(value), feb);
				break;
			default:
				break;
		}
	}
}

function setLeapDay(props) {
	let settleMonth = props.cardTable.getValByKeyAndIndex(this.moduleId, this.index, 'settlemonth');
	let settleDay = props.cardTable.getValByKeyAndIndex(this.moduleId, this.index, 'settleday');
	let leapDayFromDay =
		settleMonth.value &&
		settleDay.value &&
		(settleMonth.value == '2' && settleDay.value == '29' ? '28' : settleDay.value);
	props.cardTable.setValByKeyAndIndex(this.moduleId, this.index, 'settleleapday', { value: leapDayFromDay || null });
}

function modifiedDaysByMonth(props, signal, febFlag) {
	let meta = props.meta.getMeta();
	let newOptions = dayOptions;
	if (!febFlag) {
		newOptions = signal
			? newOptions.concat(
					{ display: '29', value: '29' },
					{ display: '30', value: '30' },
					{ display: '31', value: '31' }
				)
			: newOptions.concat({ display: '29', value: '29' }, { display: '30', value: '30' });
	}
	meta[this.tableId].items.find((item) => item.attrcode === 'settleday').options = newOptions;
	porps.meta.setMeta(meta);
}

/*yrJb1LOfoOHhNP+PrTGyMlwVz9IiLdIAQVSFAsP/e+S9VY37I34PlViIIKxjZsFV*/