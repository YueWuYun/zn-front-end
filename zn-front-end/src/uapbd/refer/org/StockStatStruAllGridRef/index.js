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
		refName: 'refer-000289',/* 国际化处理： 库存统计体系(所有)*/
		placeholder: 'refer-000289',/* 国际化处理： 库存统计体系(所有)*/
		refCode:'uapbd.org.StockStatStruAllGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/StockStatStruAllGridRef.do',
		columnConfig: [{name: ['refer-000002', 'refer-000003']/* 国际化处理： 编码,名称*/
        ,code: ['refcode', 'refname']}],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65