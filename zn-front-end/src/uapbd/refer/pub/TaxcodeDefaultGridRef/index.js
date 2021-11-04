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
		refName: 'refer-000420',/* 国际化处理： 税码税率*/
		placeholder: 'refer-000420',/* 国际化处理： 税码税率*/
		refCode: 'uapbd.refer.pub.TaxcodeDefaultGridRef',
		queryGridUrl: '/nccloud/uapbd/pub/TaxcodeDefaultGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'refer-000421', 'refer-000422' ],code: [ 'refcode', 'refname' ]}]/* 国际化处理： 税码,描述*/
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65