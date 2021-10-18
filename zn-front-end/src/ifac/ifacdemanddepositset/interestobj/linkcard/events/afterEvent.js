/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/
import { ajax } from 'nc-lightapp-front';
//引入配置常量定义
import { module_id, base_url, qcard_page_id, qcard_from_id, qcard_table_id } from '../../cons/constant.js';
import { clearCardItemValue } from '../../util/util.js';
import { setHeadItemProp } from "../../util/util";
import { requesturl } from '../../cons/requesturl';
/**
 * 编辑后事件逻辑处理
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} i 
 */
export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	let status = props.getUrlParam('status');
	let eventData, newvalue, extParam;
	switch (key) {
		default:
			break;
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/