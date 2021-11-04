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
		refName: 'refer-000492',/* 国际化处理： 收款业务类型*/
		placeholder: 'refer-000492',/* 国际化处理： 收款业务类型*/
		refCode: 'uapbd.sminfo.RectypeGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/RectypeGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'refer-000493', 'refer-000494' ],code: [ 'refcode', 'refname' ]}]/* 国际化处理： 收款业务类型编码,收款业务类型名称*/
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65