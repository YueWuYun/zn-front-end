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
		refName: 'twrefer-000000',
		placeholder: 'twrefer-000000',/*投料点 */
		refCode: 'uapbd.wktw.WktwGridRef',
		queryGridUrl: '/nccloud/mmbd/wktw/twref.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'twrefer-000001', 'twrefer-000002','twrefer-000003' ],code: [ 'refcode', 'refname','vcraftnote' ]}],/*投料点编码，投料点名称,备注 */
		isShowUnit:false,
		unitProps:unitProps,
		unitValueIsNeeded:false,
	};
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65