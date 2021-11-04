//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},
		refType: 'grid',
		refName: 'refer-000239',//'职务', 
		placeholder: 'refer-000239',//'职务',refer-000239
		refCode: 'uapbd.psndoc.RefPsndocJobGrid',	
        queryGridUrl: '/nccloud/uapbd/psndoc/RefPsndocJobGrid.do',
        columnConfig: [{name: [ 'refer-001068', 'refer-001069' ],code: [ 'jobcode', 'jobname' ]}],
		isMultiSelectedEnabled: false,
		unitProps:false,
        isShowUnit:false
	};
	return <Refer {...Object.assign(conf, props)} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65