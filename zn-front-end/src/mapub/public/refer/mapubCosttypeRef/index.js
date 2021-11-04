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
		refName: 'mapubref-000011',/* 国际化处理： 成本类型*/
		placeholder: '',
		queryGridUrl: '/nccloud/mapub/refer/mapubCosttypeRef.do',
		columnConfig:[{name:['mapubref-000012','mapubref-000013','mapubref-000008','mapubref-000009'],code:["refcode","refname","cbeginmonth","cendmonth"]}]/* 国际化处理： 编码,名称*/
	};
	return <Refer {...Object.assign(conf, props)} />
}
