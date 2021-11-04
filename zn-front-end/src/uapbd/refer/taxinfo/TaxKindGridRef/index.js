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
		refName: 'refer-000521',/* 国际化处理： 税种*/
		placeholder: 'refer-000521',/* 国际化处理： 税种*/
		refCode: 'uapbd.taxinfo.TaxKindGridRef',
		queryGridUrl: '/nccloud/uapbd/taxinfo/TaxKindGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'refer-000519', 'refer-000520' ],code: [ 'refcode', 'refname' ]}]/* 国际化处理： 税种编码,税种名称*/
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65