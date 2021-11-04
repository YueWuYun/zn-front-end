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
		refName: 'refer-000331',/* 国际化处理： 利润中心体系版本*/
		placeholder: 'refer-000331',/* 国际化处理： 利润中心体系版本*/
		refCode: 'uapbd.refer.orgv.LiabilityCenterStruVersionGridRef',
		queryGridUrl: '/nccloud/uapbd/orgv/LiabilityCenterStruVersionGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'refer-000252', 'refer-000251' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 版本号,版本名称*/
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65