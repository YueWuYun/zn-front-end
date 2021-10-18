/*iGEr7jsLTpd/n+WcDubKzfdiTlMIb3nJeMYdZ7qh4EBP14XNy5xzwEPEx39jf3r9*/
/*
 * @Author: wangceb 
 * @PageInfo: 查询公共处理方法
 * @Date: 2018-04-19 10:33:09 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-07-02 21:16:42
 */

import { ajax, toast } from 'nc-lightapp-front';
import clickSerachBtn from './commonSearch_BtnClick';
import { REF21_CONST } from '../const';
import { getDefData } from '../../util/cacheDataManager';

export default function buttonClick(props) {
	let queryInfo = getDefData(REF21_CONST.Ref21DataSource, REF21_CONST.searchId);
	clickSerachBtn.call(this, props, queryInfo);
}

/*iGEr7jsLTpd/n+WcDubKzfdiTlMIb3nJeMYdZ7qh4EBP14XNy5xzwEPEx39jf3r9*/