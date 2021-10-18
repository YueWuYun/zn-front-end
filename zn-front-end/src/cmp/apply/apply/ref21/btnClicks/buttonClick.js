/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
/*
 * @Author: wangceb 
 * @PageInfo: 销售订单列表按钮事件处理
 * @Date: 2018-04-19 10:34:04 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-07-02 21:08:52
 */
import refresh_BtnClick from './refresh_BtnClick';

export default function buttonClick(props, id) {
	switch (id) {
		// Refresh	刷新
		case 'Refresh':
			return refresh_BtnClick.call(this, props);
			break;
		default:
			break;
	}
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/