/*un54nM2W1YBxk+3H1t2y07Gs44fQkGEchkbPWqjLnqDFwLIQ4It6cm8W3+Eh9KZL*/
/*
 * @Author: zhanghe 
 * @PageInfo: 查询区参照过滤
 * @Date: 2018-04-25 09:43:24 
 */
import { ajax, base } from 'nc-lightapp-front';
import { REF21_CONST } from '../const';


export default function referEvent(props, meta) {
	//参照
	meta[REF21_CONST.searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;	
	
	meta[REF21_CONST.searchId].items.map((item) => {
		//设置参照面板不显示主组织
		if (item.attrcode === 'pk_org') {
			item.queryCondition = () => {
				item.isTreelazyLoad = false;
				return {
					funcode: props.getSearchParam("c"),
					TreeRefActionExt: 'nccloud.web.cmp.ref.CMPApplyOrgBuilder'
				};
			};
		}else if(item.attrcode == 'pk_project'){
			item.queryCondition = () => {
				return {
					funcode: props.getSearchParam("c"),
					pk_org:(props.search.getSearchValByField(REF21_CONST.searchId, 'pk_org').value || {}).firstvalue
				};
			};
		}
		
	});
}

/*un54nM2W1YBxk+3H1t2y07Gs44fQkGEchkbPWqjLnqDFwLIQ4It6cm8W3+Eh9KZL*/