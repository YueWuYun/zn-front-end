//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
const { Refer } = high;
export default function(props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: '10140MMREFER'
		},
		refType: 'grid',
		refName: 'ssdrefer-000000',
		placeholder: 'ssdrefer-000000',
		refCode: 'uapbd.shift.ShiftDefGridRef',
		queryGridUrl: '/nccloud/mmbd/shift/shiftref.do',
		isMultiSelectedEnabled: false,
		columnConfig: [ { name: [ 'ssdrefer-000001', 'ssdrefer-000002' ], code: [ 'refcode', 'refname' ] } ],
		isShowUnit: false,
		unitValueIsNeeded: false
	};
	return <Refer {...conf} {...props} />;
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65