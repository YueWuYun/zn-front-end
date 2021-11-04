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
		refName: 'refer-000464',/* 国际化处理： 结算方式*/
		placeholder: 'refer-000464',/* 国际化处理： 结算方式*/
		refCode: 'uapbd.refer.sminfo.BalanceTypeGridRef',
        queryGridUrl: '/nccloud/uapbd/sminfo/BalanceTypeGridRef.do',
		// isMultiSelectedEnabled: false,//nc端能多选
		columnConfig: [{name: [ 'refer-000002', 'refer-000003' ],code: [ 'refcode', 'refname' ]}]/* 国际化处理： 编码,名称*/
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65