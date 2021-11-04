//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
	var conf = {
		placeholder:'refer-000257',/* 国际化处理： 业务场景*/
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},
        columnConfig: [{name: [ 'refer-000002', 'refer-000003' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
		refType: 'grid',
		refName: 'refer-000257',/* 国际化处理： 业务场景*/
		refCode:'uapbd.org.OrgFunclistGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/OrgFunclistGridRef.do',
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65