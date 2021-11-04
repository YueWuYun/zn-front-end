//l6jnxA/qz9sbNE0CcMIUf0ILKZQrWypSEBbatx0O/9Er1cgZK9EK2MUMWYbQ3G5g
import { getOffChangeData } from './listOperator';
import { getCFSOffChangeData } from './listOperatorCFS';

import {APPCODEN} from '../../constant'

//列表停用启用数据处理
export function showOffChangeData(props,value) {
	if(this.appcode == APPCODEN.CFAPPCODE){
		getCFSOffChangeData(props,value);//成本要素结构列表停用启用数据处理
	}else{
		getOffChangeData(props,value);//成本中心结构列表数据处理
	}
}

//l6jnxA/qz9sbNE0CcMIUf0ILKZQrWypSEBbatx0O/9Er1cgZK9EK2MUMWYbQ3G5g