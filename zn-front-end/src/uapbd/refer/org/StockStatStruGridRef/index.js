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
		refName: 'refer-000290',/* 国际化处理： 库存统计体系*/
		placeholder: 'refer-000290',/* 国际化处理： 库存统计体系*/
		refCode:'uapbd.org.StockStatStruGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/StockStatStruGridRef.do',
		columnConfig: [{name: ['refer-000002', 'refer-000003']/* 国际化处理： 编码,名称*/
        ,code: ['refcode', 'refname']}],
		isMultiSelectedEnabled: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65