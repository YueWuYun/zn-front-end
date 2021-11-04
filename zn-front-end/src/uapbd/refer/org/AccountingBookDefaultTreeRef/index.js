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

		refType: 'tree',
		refName: 'refer-000175',/* 国际化处理： 财务核算账簿11*/
		placeholder: 'refer-000175',/* 国际化处理： 财务核算账簿11*/
		refCode: 'uapbd.ref.AccountingBookDefaultTreeRef',
		queryTreeUrl: '/nccloud/uapbd/ref/accountingbookdefaulttreeref.do',
		isMultiSelectedEnabled: false,
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65