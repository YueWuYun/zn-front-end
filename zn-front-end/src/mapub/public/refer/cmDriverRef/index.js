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
		refName: 'mapubref-000010',/* 国际化处理： 成本动因*/
		placeholder: '',
		queryGridUrl: '/nccloud/mapub/refer/cmDriverRef.do',
		columnConfig:[{name:['mapubref-000002','mapubref-000003'],code:["refcode","refname"]}]/* 国际化处理： 编码,名称*/
	};
	return <Refer {...Object.assign(conf, props)} />
}
