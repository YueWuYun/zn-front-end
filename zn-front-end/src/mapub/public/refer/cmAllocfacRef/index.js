import { high } from 'nc-lightapp-front';

const { Refer } = high;
export default function (props = {}) {
	var conf = {
		multiLang:{
			domainName:'mapub',
			currentLocale: 'simpchn', 
			moduleId: 'mapubref'
		},
		refType: 'grid',
		refName: 'mapubref-000005',/* 国际化处理： 作业档案*/
		placeholder: '',
		queryGridUrl: '/nccloud/mapub/refer/cmAllocfacRef.do',
		columnConfig:[{name:['mapubref-000006','mapubref-000007'],code:["refcode","refname"]}]/* 国际化处理： 编码,名称*/
	};
	return <Refer {...Object.assign(conf, props)} />
}
