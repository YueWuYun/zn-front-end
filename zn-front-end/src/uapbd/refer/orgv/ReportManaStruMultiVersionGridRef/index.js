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
		refName: 'refer-000344',/* 国际化处理： 报表组织体系(多版本)*/
		placeholder: 'refer-000344',/* 国际化处理： 报表组织体系(多版本)*/
		refCode: 'uapbd.ref.ReportManaStruMultiVersionGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/ReportManaStruMultiVersionGridRef.do',
		columnConfig: [{
			code: ['refcode','refname','code','name'],
			name: ['refer-000305','refer-000251','refer-000097','refer-000098']/* 国际化处理： 版本编号,版本名称,体系编码,体系名称*/
		}],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65