//ChwtK7xNbiE0T80ETHXkT+dUORZeD8dUo5aelWUtyAYFh54N/DcPGdVUUi6OTUP3
/*
 * @Author: 刘奇 
 * @PageInfo: 卡片态表体编辑后事件  
 * @Date: 2018-05-25 09:44:49 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2018-06-28 20:31:46
 */
export default function body_beforeEvent(props, moduleId, item, index, value, record) {
	let key = item.key;
	let meta = props.meta.getMeta();
	if (moduleId == 'cdefectprocess') {
	}
	//库存状态增加参照过滤
	if (key == 'pk_stockstate') {
		// let pk = record.values.pk_qualitylv_b.value;
		// let item = meta[moduleId].items.find((item) => item.attrcode == 'pk_stockstate');
		// item.queryCondition = () => {
		// 	return {
		// 		pk_defdoclist: pk
		// 	};
		// };
		// props.meta.setMeta(meta);
		// return true;
	}
	return true;
}

//ChwtK7xNbiE0T80ETHXkT+dUORZeD8dUo5aelWUtyAYFh54N/DcPGdVUUi6OTUP3