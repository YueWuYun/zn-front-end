/*ORTWSEnYgDjzlMdiiByYnU5hTj8+5YHXqu9ohaaLa+54oWqPiUUAA26LoByTnbEz*/
import { hasDefaultOrg } from '../../../../../tmpub/pub/util/index';//是否有设置财务组织
/**
 * [结账]-[如果存在财务组织自动加载数据]
 * @param {*} props 
 * @param {*} status 
 */
export default function autoRefresh(data) {
	
	if(!data || !hasDefaultOrg(data)){
		return;
	}
	//自动加载数据
	this.refresh();
};

/*ORTWSEnYgDjzlMdiiByYnU5hTj8+5YHXqu9ohaaLa+54oWqPiUUAA26LoByTnbEz*/