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
		refName: 'rcrefer-000000',
		placeholder: 'rcrefer-000000',/*标准工序 */
		refCode: 'uapbd.rc.RcGridRef',
		queryGridUrl: '/nccloud/mmbd/rc/rcref.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'rcrefer-000001', 'rcrefer-000002','rcrefer-000003' ],code: [ 'refcode', 'refname','vcraftnote' ]}],/*工序编码，工序名称,备注 */
		isShowUnit:false,
		unitProps:unitProps,
		unitValueIsNeeded:false,
	};
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65