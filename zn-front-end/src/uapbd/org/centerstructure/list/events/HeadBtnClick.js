//agSSNLLrrRneQCEBV9KqusqODO0V7WcTiJvcuG0xsa498kntaYCyKPFy7r7bLHS9
import { buttonCFSClick,buttonClick } from './buttonClick';
import {APPCODEN} from '../../constant';
//表头按钮点击事件
export function HeadBtnClick(props, id) {
	if(this.appcode == APPCODEN.CFAPPCODE){
		this.buttonCFSClick(props,id);//成本要素结构列表查询
	}else{
		this.buttonClick(props,id);//成本中心结构列表查询
	}
}
//agSSNLLrrRneQCEBV9KqusqODO0V7WcTiJvcuG0xsa498kntaYCyKPFy7r7bLHS9