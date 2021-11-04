//pVa3tQFurKG2QPAmhMjhkvSR2JuCqjewWGCXOn/8gZ3zwegTJRDncWnlJFmwLZFw
/*
 * @Author: zhaopym 
 * @Date: 2019-03-15 13:23:03 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-07-10 13:38:30
 */
import { cardCache } from 'nc-lightapp-front';
const { setDefData } = cardCache;

/**
 * 将表体数据放到缓存中
 * @param {array} bodyRows 
 */
function setBodyData2Cache(data) {
	console.log(data);
	// 放缓存,结构是一个pk => 数组
	if (data instanceof Array) {
		let cacheData = new Map();
		data.map((row) => {
			let pk_pricetemplet = row.values.pk_pricetemplet.value;
			let bodyData = cacheData.get(pk_pricetemplet);
			if (bodyData) {
				bodyData.push(row);
			} else {
				bodyData = [ row ];
				cacheData.set(pk_pricetemplet, bodyData);
			}
		});
		cacheData.forEach((value, key) => {
			setDefData(key, 'scm.ct.priceTemplate.bodyData', value);
		});
	} else {
		setBodyData2Cache(data.rows);
	}
}
export { setBodyData2Cache };

//pVa3tQFurKG2QPAmhMjhkvSR2JuCqjewWGCXOn/8gZ3zwegTJRDncWnlJFmwLZFw