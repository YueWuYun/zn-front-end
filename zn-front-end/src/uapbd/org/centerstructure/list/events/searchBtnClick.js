//YuO8szH0cVixePu/Bt+mG3bVDYtJTGvKZcGK3iypDb9P1NCQ60SYpClfbGT0pz4g
import { listSearch } from './listOperator';
import { listCFSSearch } from './listOperatorCFS';

import {APPCODEN} from '../../constant'

//点击查询，获取查询区数据
export function searchBtnClick(props) {
	if(this.appcode == APPCODEN.CFAPPCODE){
		this.listCFSSearch(props);//成本要素结构列表查询
	}else{
		this.listSearch(props);//成本中心结构列表查询
	}
}

//YuO8szH0cVixePu/Bt+mG3bVDYtJTGvKZcGK3iypDb9P1NCQ60SYpClfbGT0pz4g