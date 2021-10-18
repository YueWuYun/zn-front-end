/*dNgkNrQJR88LnaZFhdW318luIF3FceWkeHJRymYtUVJIyLzw8MXMGG5VYsNOJNTn*/
import { toast } from 'nc-lightapp-front';
import { getProps } from './main';

export function compareOperation () {//对照操作
	let { compareFlag, searchMap, record, corpIndex, bankIndex, isContrast }= this.state;
	if (compareFlag=== '0' && !Object.keys(record).length) {
		toast({color: 'warning', content: this.lang('0085')});
		this.setState({
			isContrast: !isContrast,
		});
		return;
	}
	
	let data= {
		queryVo: {
			...searchMap,
			m_Pk_Account: [this.state.searchMap.m_Pk_Account]
		},
		compareFlag,
		[compareFlag=== '1' ? 'units' : compareFlag=== '2' ? 'banks' : '']: record,
		[compareFlag=== '2' ? 'units' : compareFlag=== '1' ? 'banks' : '']: {}
	};
	this.setState({
		corpIndex: compareFlag=== '1' ? corpIndex : -1,
		bankIndex: compareFlag=== '2' ? bankIndex : -1,
	});
	this.btnRequire('compare.do', data, this.lang('0086'));
}

export function unCompareOperation () {//取消对照操作
	let { isContrast, pages }= this.state;
	let { bankPageNum, corpPageNum }= pages;
	this.setState({
		isContrast: !isContrast,
		// compareFlag: '0',
		corpIndex: -1,		
		bankIndex: -1,
		bankData: getProps.call(this, 'bankData', bankPageNum),
		corpData: getProps.call(this, 'corpData', corpPageNum),
		bankSelect: getProps.call(this, 'bankSelect', bankPageNum),	
		bankBool: getProps.call(this, 'bankBool', bankPageNum),	
		corpSelect: getProps.call(this, 'corpSelect', corpPageNum),
		corpBool: getProps.call(this, 'corpBool', corpPageNum),
	});
}
/*dNgkNrQJR88LnaZFhdW318luIF3FceWkeHJRymYtUVJIyLzw8MXMGG5VYsNOJNTn*/