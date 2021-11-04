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
		refName: 'refer-000020',/* 国际化处理： 交易代码*/
		placeholder: 'refer-000020',/* 国际化处理： 交易代码*/
		refCode: 'uapbd.refer.busiinfo.TransactioncodeGridRef',
		queryGridUrl: '/nccloud/uapbd/busiinfo/TransactioncodeGridRef.do',
		isMultiSelectedEnabled: false,
		isHasDisabledData:false,
		columnConfig: [{
			code: ['refcode'],
			name: ['refer-000002']/* 国际化处理： 编码*/
		}],
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65