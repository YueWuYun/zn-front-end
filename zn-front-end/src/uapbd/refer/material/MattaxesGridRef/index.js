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
		refName: 'refer-000150',/* 国际化处理： 物料税类*/
		placeholder: 'refer-000150',/* 国际化处理： 物料税类*/
		refCode: 'uapbd.refer.material.MattaxesGridRef',
		queryGridUrl: '/nccloud/uapbd/material/MattaxesGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'refer-000151', 'refer-000152' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 物料税类编码,物料税类名称*/
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65