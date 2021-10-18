/*AoVDPsUWhd0K5LgkkiCY1UDp6sB1kfc6+0sUoIBARIHzV0jSIE+l6jGOEsEcyYrg*/
/*
 * @Author: zhangjyp 
 * @PageInfo: 查询按钮处理方法
 * @Date: 2018-04-19 10:33:09 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-06-16 16:39:18
 */

import { REF21_CONST } from '../const';

import { ajax } from 'nc-lightapp-front';
import commonSearch_BtnClick from './commonSearch_BtnClick';

export default function clickSerachBtn() {
	let searchVal = this.props.search.getAllSearchData(REF21_CONST.searchId);
	if (searchVal === false) {
		return;
	}
	let queryInfo = this.props.search.getQueryInfo(REF21_CONST.searchId);

	queryInfo.pageInfo = null;
	this.setState({ queryInfo: queryInfo });

	commonSearch_BtnClick.call(this, this.props, queryInfo);
}

/*AoVDPsUWhd0K5LgkkiCY1UDp6sB1kfc6+0sUoIBARIHzV0jSIE+l6jGOEsEcyYrg*/