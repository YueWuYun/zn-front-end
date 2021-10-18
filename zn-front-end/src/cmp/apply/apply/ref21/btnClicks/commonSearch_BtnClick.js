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
import { ajax } from 'nc-lightapp-front';
import { btn_Controller } from '../btnClicks';

export default function clickSerachBtn(props, queryInfo) {
	ajax({
		url: REF21_CONST.serachUrl,
		data: queryInfo,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					if(data.grid){
						this.props.transferTable.setTransferTableValue(
							REF21_CONST.formId,
							REF21_CONST.tableId,
							data.grid[REF21_CONST.formId],
							REF21_CONST.pk_head,
							REF21_CONST.pk_body
						);
					}
					else{
						this.props.transferTable.setTransferTableValue(REF21_CONST.formId, REF21_CONST.tableId, [], REF21_CONST.pk_head, REF21_CONST.pk_body);
					}
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