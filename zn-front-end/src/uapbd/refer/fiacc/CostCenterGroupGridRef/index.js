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
		refName: 'refer-000092',/* 国际化处理： 成本中心组*/
		placeholder: 'refer-000092',/* 国际化处理： 成本中心组*/
		refCode: 'uapbd.fiacc.CostCenterGroupGridRef',	
        queryGridUrl: '/nccloud/uapbd/ref/CostCenterGroupGridRef.do',
        columnConfig: [{name: [ 'refer-000093', 'refer-000094' ],code: [ 'groupcode', 'groupname' ]}],/* 国际化处理： 成本中心组编码,成本中心组名称*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65