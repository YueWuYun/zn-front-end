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
		refName: 'refer-000037',/* 国际化处理： 客户税类*/
		placeholder: 'refer-000037',/* 国际化处理： 客户税类*/
		refCode: 'uapbd.customer.CustaxesGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/CustaxesGridRef.do',
		columnConfig: [{ name: ['refer-000038', 'refer-000039'], code: ['custtaxescode', 'custtaxesname'] }],/* 国际化处理： 税类编码,税类名称*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65