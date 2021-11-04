//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitProps }  from '../../../../uapbd/refer/org/BusinessUnitTreeRef/index';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: '10140MMREFER',
		},

		refType: 'grid',
		refName: 'pstrefer-000000',
		placeholder: 'pstrefer-000000',
		refCode: 'uapbd.pst.PlanStrategyGridRef',
		queryGridUrl: '/nccloud/mmbd/pst/pstref.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'pstrefer-000001', 'pstrefer-000002','pstrefer-000003' ],code: [ 'refcode', 'refname','fplanpurpose' ]}],
		isShowUnit:true,
		unitProps:unitProps,
		unitValueIsNeeded:true,
	};
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65