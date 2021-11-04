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
		refName: 'refer-000268',
		placeholder: 'refer-000268',
		refCode: 'uapbd.psndoc.RefPsndocPostGrid',	
        queryGridUrl: '/nccloud/uapbd/psndoc/RefPsndocPostGrid.do',
        columnConfig: [{name: [ 'refer-001068', 'refer-001069' ],code: [ 'postcode', 'postname' ]}],
		isMultiSelectedEnabled: false,
		unitProps:false,
        isShowUnit:false
	};
	return <Refer {...Object.assign(conf, props)} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65