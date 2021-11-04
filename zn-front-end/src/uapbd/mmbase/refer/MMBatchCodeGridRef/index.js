//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'PDRefer',
		},

		refType: 'grid',
		refName: 'pbrefer-000000',
		placeholder: 'pbrefer-000000',
		refCode: 'mmpd.refer.pb.MMBatchCodeGridRef',
		queryGridUrl: '/nccloud/mmpd/refer/MMBatchGridRefAction.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'pbrefer-000001' ],code: [ 'refcode' ]}],
		isShowUnit:false,
		unitValueIsNeeded:false,
	};
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65