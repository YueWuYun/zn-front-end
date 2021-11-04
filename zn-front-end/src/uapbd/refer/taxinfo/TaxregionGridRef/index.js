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
		refName: 'refer-000522',/* 国际化处理： 税收地区*/
		placeholder: 'refer-000522',/* 国际化处理： 税收地区*/
		refCode: 'uapbd.taxinfo.TaxregionGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/TaxregionGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'refer-000523', 'refer-000524' ],code: [ 'refcode', 'refname' ]}]/* 国际化处理： 征税地区编码,征税地区名称*/
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65