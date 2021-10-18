/*un54nM2W1YBxk+3H1t2y07Gs44fQkGEchkbPWqjLnqDFwLIQ4It6cm8W3+Eh9KZL*/
/*
 * @Author: wangceb 
 * @PageInfo: 查询区参照过滤
 * @Date: 2018-04-25 09:43:24 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-07-23 17:28:12
 */

import { ajax, base } from 'nc-lightapp-front';
import { REF21_CONST } from '../const';
// import { getSearchValByField } from '../../../pub/tool/SearchTool';
// 参照只根据表头组织过滤的字段
const pk_org_filter_Fields = [ 'pk_order_b.pk_srcmaterial', 'pk_order_b.pk_srcmaterial.pk_marbasclass' ];

export default function referEvent(props, meta) {
	//参照
	meta[REF21_CONST.searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;	
	
	meta[REF21_CONST.searchId].items.map((item) => { 
		//组织参照过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				item.isTreelazyLoad = false;
				return {
					funcode: '36070APM',
					// TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}else if(item.attrcode =='pk_acceptorg'){
			item.queryCondition = () => {
				item.isTreelazyLoad = false;
				return {
					funcode: '36070APM',
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}	
	});
}

/*un54nM2W1YBxk+3H1t2y07Gs44fQkGEchkbPWqjLnqDFwLIQ4It6cm8W3+Eh9KZL*/