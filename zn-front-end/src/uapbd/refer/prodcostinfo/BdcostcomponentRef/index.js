//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as  unitConf} from '../../org/BusinessUnitTreeRef/index';

const { Refer } = high;
export default function (props = {}) {
	var conf = {
		multiLang:{
			domainName:'uapbd',
			currentLocale: 'simpchn', 
			moduleId: 'refer_uapbd'
		},
		refType: 'grid',
		refName: 'refer-003565',/* 国际化处理： 成本组件*/
		placeholder: 'refer-003565',
		isMultiSelectedEnabled: true,
		isHasDisabledData:false,
		queryGridUrl: '/nccloud/uapbd/ref/bdcostcomponentRef.do',
		unitProps: unitConf,
		columnConfig:[{name:['refer-003566','refer-003567'],code:["bd_costcomponent.vcostcomponentcode","bd_costcomponent.vcostcomponentname"]}]/* 国际化处理： 编码,名称*/
	};
	return <Refer {...Object.assign(conf, props)} />
}
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65