/*MKhAr9efcx6R2yL0XZ82WkArUqL/ghOixlSrNfOuiX74qWIe8K66xY0WgiknpWOI7fFzEq5rFFPd
OC8ZNxa+vA==*/
/*
 * @Author: zhangjyp 
 * @PageInfo: 查询按钮处理方法
 * @Date: 2018-04-19 10:33:09 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-07-12 23:18:32
 */

import { REF21_CONST } from '../const';
import { ajax ,spaCache} from 'nc-lightapp-front';
let { setDefData, getDefData } = spaCache;
import { btn_Controller } from '../btnClicks';


export default function clickSerachBtn(props, queryInfo) {
	queryInfo.appcode = this.props.getUrlParam('src_appcode');
	queryInfo.pageCode = REF21_CONST.transPageId;
	ajax({
		url: REF21_CONST.serachUrl,
		data: queryInfo,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					this.props.transferTable.setTransferTableValue(
						REF21_CONST.formId,
						REF21_CONST.tableId,
						data,
						REF21_CONST.pk_head,
						REF21_CONST.pk_body
					);
					/*
					* key：存储数据的key
					* dataSource: 缓存数据命名空间
					* data： 存储数据
					*/
					setDefData('searchData', REF21_CONST.Ref21DataSource, res.data);
				}
				else{
					this.props.transferTable.setTransferTableValue(REF21_CONST.formId, REF21_CONST.tableId, [], REF21_CONST.pk_head, REF21_CONST.pk_body);
				}
				btn_Controller.call(this, props);
			}
		}
	});
}

/*MKhAr9efcx6R2yL0XZ82WkArUqL/ghOixlSrNfOuiX74qWIe8K66xY0WgiknpWOI7fFzEq5rFFPd
OC8ZNxa+vA==*/