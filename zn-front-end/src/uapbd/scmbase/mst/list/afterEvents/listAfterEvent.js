//2ynTbHJFUBmDuZ5zM03gnAuoj79qgKkMYwAlRUNZRONQtmulAQj4hJAZKN03ybCO
import { FIELDS } from '../constance';

/**
 * 列表编辑后事件
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} index 
 * @param {*} record 
 */
export default function(props, moduleId, key, value, changedrows, index, record) {
	switch (key) {
		//抄值类型
		case FIELDS.fcopytype:
			//如果抄值类型为时间数值单位 里程，上限，下限清空并且不可编辑
			if (value == 0) {
				//批量设值有问题，先分开设
				// let keys = [ FIELDS.fnumunit, FIELDS.nmeasrange, FIELDS.nmeasrangeup, FIELDS.nmeasrangedown ];
				// props.editTable.setValByKeyAndIndex(moduleId, index, keys, {
				// 	display: null,
				// 	value: null
				// });
				props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.fnumunit, {
					display: null,
					value: null
				});
				props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.nmeasrange, {
					display: null,
					value: null
				});
				props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.nmeasrangeup, {
					display: null,
					value: null
				});
				props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.nmeasrangedown, {
					display: null,
					value: null
				});
			} else {
				//如果抄值类型为数值时，时间单位清空且不可编辑
				props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.vtimeunit, {
					display: null,
					value: null
				});
			}
			break;
	}
}

//2ynTbHJFUBmDuZ5zM03gnAuoj79qgKkMYwAlRUNZRONQtmulAQj4hJAZKN03ybCO