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
		refName: 'refer-000489',/* 国际化处理： 收付款业务类型*/
		placeholder: 'refer-000489',/* 国际化处理： 收付款业务类型*/
		refCode: 'uapbd.sminfo.RecPaytypeGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/RecPaytypeGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'refer-000490', 'refer-000491' ],code: [ 'refcode', 'refname' ]}]/* 国际化处理： 收付款业务类型编码,收付款业务类型名称*/
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65