//GHo8sBUOUlNAO0/KbmPOx9oxgGpF8c6g+x75XvdkLADivjuD7G8dq6SYbxBWirqL
import { FIELDS } from '../constance';
/**
 * 列表编辑前
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} index 
 * @param {*} record 
 */
export default function(props, moduleId, item, index, value, record) {
	switch (item.attrcode) {
		//数值单位， 里程，上限，下限
		case FIELDS.fnumunit:
		case FIELDS.nmeasrange:
		case FIELDS.nmeasrangeup:
		case FIELDS.nmeasrangedown:
			//抄值类型为数值时数值单位才可编辑
			if (record.values[FIELDS.fcopytype].value == 1) {
				return true;
			} else {
				return false;
			}
		//时间单位
		case FIELDS.vtimeunit:
			//抄值类型为时间时时间单位才可编辑
			if (record.values[FIELDS.fcopytype].value == 0) {
				return true;
			} else {
				return false;
			}
		default:
			return true;
	}
}

//GHo8sBUOUlNAO0/KbmPOx9oxgGpF8c6g+x75XvdkLADivjuD7G8dq6SYbxBWirqL