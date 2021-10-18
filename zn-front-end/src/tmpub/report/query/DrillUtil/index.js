/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import { ajax } from 'nc-lightapp-front';
/**
 * 报表联查到单据方法
 * @param {*} data 报表数据，报表平台提供
 * @param {*} pkCode 报表主键对应的code
 * @param {*} billTypeCode 表体单据类型所在列对应的code
 * @param {*} callback 请求成功的回调函数，用于对返回的url进行特殊操作的情况，可以不传
 */
export function drillToBill(props, data, pkCode, billTypeCode, callback) {
	//默认回调
	let defaultCallBack = (res) => {
		if (res.success) {
			debugger;
			//下面是平台提供的方法，但现在不支持新页签打卡，所以先用window.open
			// props.openTo(res.data, {
			// 	...res.data,
			// 	status: 'browse'
			// });
			let url = res.data.url;
			let pagecode = res.data.pagecode;
			let appcode = res.data.appcode;
			let id = res.data.id;
			props.openTo(url, {
				pagecode,
				appcode,
				id,
				status: 'browse',
				scene:'linksce'
			});
		}
	};
	data['pkCode'] = pkCode;
	data['billTypeCode'] = billTypeCode;
	ajax({
		url: '/nccloud/tmpub/report/drillquery.do',
		data,
		method: 'post',
		success: callback || defaultCallBack
	});
}

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/